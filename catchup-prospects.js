// catchup-prospects.js
// Rattrapage ciblé de la table prospects UNIQUEMENT — contrairement à migrate-database.js,
// celui-ci FAIT ÉCRASER les lignes déjà présentes avec la version de l'ancien projet (ON
// CONFLICT DO UPDATE, pas DO NOTHING). Nécessaire une seule fois : les actions faites dans le
// CRM aujourd'hui, pendant qu'on déboguait la clé anon cassée, sont allées vers l'ancien
// projet et n'ont jamais été rapatriées par la migration normale (qui ignore les conflits).
//
// ⚠️ À lancer UNE SEULE FOIS, maintenant — pas après avoir recommencé à travailler sur le
// nouveau projet, sinon ça écraserait du travail plus récent avec une version plus ancienne.
//
// Lance avec : node catchup-prospects.js

console.log('=== CATCHUP PROSPECTS VERSION 1 ===\n');

const { Client } = require('pg');

const OLD_CONNECTION = 'postgresql://postgres.mifljhsusidgzelnswma:1dstack01112003@aws-1-eu-central-1.pooler.supabase.com:5432/postgres';
const NEW_CONNECTION = 'postgresql://postgres.hgxcpkrqdahmxhmpouvm:0dstack01112003@aws-1-eu-west-1.pooler.supabase.com:5432/postgres';

(async () => {
  const oldDb = new Client({ connectionString: OLD_CONNECTION });
  const newDb = new Client({ connectionString: NEW_CONNECTION });
  await oldDb.connect();
  await newDb.connect();
  console.log('✓ Connecté aux deux bases.\n');

  const colsRes = await oldDb.query(`
    select column_name from information_schema.columns
    where table_schema='public' and table_name='prospects'
    order by ordinal_position
  `);
  const colNames = colsRes.rows.map(r => r.column_name);
  console.log(`Colonnes : ${colNames.join(', ')}\n`);

  const countRes = await oldDb.query(`SELECT COUNT(*) FROM prospects`);
  const total = parseInt(countRes.rows[0].count, 10);
  console.log(`${total} prospect(s) à synchroniser...\n`);

  const jsonCols = new Set(['notes']); // seule colonne JSON connue sur prospects, à sérialiser
  const serialize = (col, val) => {
    if (val === null || val === undefined) return val;
    if (jsonCols.has(col) && typeof val !== 'string') return JSON.stringify(val);
    return val;
  };

  const updateCols = colNames.filter(c => c !== 'id');
  const setClause = updateCols.map(c => `"${c}" = EXCLUDED."${c}"`).join(', ');

  let copied = 0;
  const batchSize = 200;
  for (let offset = 0; offset < total; offset += batchSize) {
    const dataRes = await oldDb.query(`SELECT * FROM prospects ORDER BY id LIMIT ${batchSize} OFFSET ${offset}`);
    if (!dataRes.rows.length) break;

    const valueRows = [];
    const flatValues = [];
    let paramIdx = 1;
    for (const row of dataRes.rows) {
      const placeholders = colNames.map(c => { flatValues.push(serialize(c, row[c])); return `$${paramIdx++}`; });
      valueRows.push(`(${placeholders.join(', ')})`);
    }
    const upsertSQL = `INSERT INTO prospects (${colNames.map(c=>`"${c}"`).join(', ')}) VALUES ${valueRows.join(', ')} ON CONFLICT (id) DO UPDATE SET ${setClause}`;
    try {
      await newDb.query(upsertSQL, flatValues);
      copied += dataRes.rows.length;
    } catch (e) {
      console.warn(`  ⚠ Lot ${offset}-${offset+dataRes.rows.length} échoué :`, e.message);
    }
    console.log(`  ... ${Math.min(offset+batchSize, total)}/${total}`);
  }

  await oldDb.end();
  await newDb.end();
  console.log(`\n✅ ${copied}/${total} prospect(s) synchronisé(s) avec l'état le plus récent.`);
})();
