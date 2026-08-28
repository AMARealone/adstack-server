// fix-missing-briefs.js
// Rattrape les 6 briefs jamais migrés (échec JSON depuis le tout début) — nettoie les
// caractères invalides pour Postgres (octets null, demi-paires d'emojis mal encodés) avant
// d'insérer, ce que le script de migration original ne faisait pas.
//
// Lance avec : node fix-missing-briefs.js

console.log('=== FIX MISSING BRIEFS VERSION 1 ===\n');

const { Client } = require('pg');

const OLD_CONNECTION = 'postgresql://postgres.mifljhsusidgzelnswma:1dstack01112003@aws-1-eu-central-1.pooler.supabase.com:5432/postgres';
const NEW_CONNECTION = 'postgresql://postgres.hgxcpkrqdahmxhmpouvm:0dstack01112003@aws-1-eu-west-1.pooler.supabase.com:5432/postgres';

// Retire tout ce que Postgres refuse dans une valeur JSON, même si JSON.stringify() lui-même
// ne voit aucun problème : octets null (jamais autorisés en texte Postgres), et demi-paires
// UTF-16 orphelines (un emoji dont la moitié a été coupée/mal encodée quelque part en amont).
function sanitize(str) {
  return str
    .replace(/\u0000/g, '')
    .replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])/g, '')
    .replace(/(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '');
}

(async () => {
  const oldDb = new Client({ connectionString: OLD_CONNECTION });
  const newDb = new Client({ connectionString: NEW_CONNECTION });
  await oldDb.connect();
  await newDb.connect();

  const colsRes = await oldDb.query(`
    select column_name, udt_name from information_schema.columns
    where table_schema='public' and table_name='briefs'
    order by ordinal_position
  `);
  const colNames = colsRes.rows.map(r => r.column_name);
  const jsonCols = new Set(colsRes.rows.filter(c => c.udt_name === 'json' || c.udt_name === 'jsonb').map(c => c.column_name));

  const oldIds = (await oldDb.query('SELECT id FROM briefs')).rows.map(r => r.id);
  const newIds = new Set((await newDb.query('SELECT id FROM briefs')).rows.map(r => r.id));
  const manquants = oldIds.filter(id => !newIds.has(id));
  console.log(`${manquants.length} ligne(s) à rattraper.\n`);

  let ok = 0;
  for (const id of manquants) {
    const row = (await oldDb.query('SELECT * FROM briefs WHERE id = $1', [id])).rows[0];
    const values = colNames.map(c => {
      let v = row[c];
      if (v === null || v === undefined) return v;
      if (jsonCols.has(c)) {
        v = JSON.stringify(v);
        v = sanitize(v);
        return v;
      }
      return v;
    });
    const placeholders = colNames.map((_, i) => `$${i+1}`).join(', ');
    try {
      await newDb.query(`INSERT INTO briefs (${colNames.map(c=>`"${c}"`).join(', ')}) VALUES (${placeholders}) ON CONFLICT (id) DO NOTHING`, values);
      console.log(`  ✓ ${id} rattrapé`);
      ok++;
    } catch (e) {
      console.error(`  ✗ ${id} toujours en échec :`, e.message);
    }
  }

  await oldDb.end();
  await newDb.end();
  console.log(`\n✅ ${ok}/${manquants.length} ligne(s) rattrapée(s).`);
})();
