// fix-foreign-keys.js
// Compare toutes les clés étrangères de l'ancien projet à celles du nouveau, et ajoute
// automatiquement celles qui manquent — le migrate-database.js original n'a copié que les
// clés primaires, jamais les foreign keys (déjà trouvé 2 fois : subscriptions, demos).
// Ce script ferme tout le trou d'un coup plutôt qu'un par un au fil de l'usage.
//
// Lance avec : node fix-foreign-keys.js

console.log('=== FIX FOREIGN KEYS VERSION 2 (fix parsing tableaux) ===\n');

const { Client } = require('pg');

const OLD_CONNECTION = 'postgresql://postgres.mifljhsusidgzelnswma:1dstack01112003@aws-1-eu-central-1.pooler.supabase.com:5432/postgres';
const NEW_CONNECTION = 'postgresql://postgres.hgxcpkrqdahmxhmpouvm:0dstack01112003@aws-1-eu-west-1.pooler.supabase.com:5432/postgres';

const FK_QUERY = `
  SELECT
    c.conname AS constraint_name,
    c.conrelid::regclass::text AS table_name,
    array_agg(a.attname ORDER BY ck.ord) AS columns,
    c.confrelid::regclass::text AS foreign_table_name,
    array_agg(af.attname ORDER BY ck.ord) AS foreign_columns
  FROM pg_constraint c
  JOIN unnest(c.conkey) WITH ORDINALITY AS ck(attnum, ord) ON true
  JOIN pg_attribute a ON a.attnum = ck.attnum AND a.attrelid = c.conrelid
  JOIN unnest(c.confkey) WITH ORDINALITY AS fk(attnum, ord) ON fk.ord = ck.ord
  JOIN pg_attribute af ON af.attnum = fk.attnum AND af.attrelid = c.confrelid
  WHERE c.contype = 'f' AND c.connamespace = 'public'::regnamespace
  GROUP BY c.conname, c.conrelid, c.confrelid
  ORDER BY 2, 1;
`;

(async () => {
  const oldDb = new Client({ connectionString: OLD_CONNECTION });
  const newDb = new Client({ connectionString: NEW_CONNECTION });
  await oldDb.connect();
  await newDb.connect();
  console.log('✓ Connecté aux deux bases.\n');

  // Le pooler renvoie parfois les tableaux Postgres comme texte brut ("{col1,col2}") au lieu
  // d'un vrai tableau JS auto-parsé par pg — normalise les deux cas ici, une fois pour toutes.
  const toArray = (val) => {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') return val.replace(/^\{|\}$/g, '').split(',').filter(Boolean);
    return [];
  };
  const normalizeFk = (fk) => ({
    ...fk,
    columns: toArray(fk.columns),
    foreign_columns: toArray(fk.foreign_columns),
  });

  const oldFks = (await oldDb.query(FK_QUERY)).rows.map(normalizeFk);
  const newFks = (await newDb.query(FK_QUERY)).rows.map(normalizeFk);
  console.log(`Ancien projet : ${oldFks.length} clé(s) étrangère(s)`);
  console.log(`Nouveau projet : ${newFks.length} clé(s) étrangère(s)\n`);

  // Une FK est considérée "présente" si une contrainte existe déjà sur EXACTEMENT les mêmes
  // colonnes source → mêmes colonnes cible, peu importe son nom (le nom lui-même n'a pas
  // d'importance fonctionnelle, seule la relation compte).
  const newFkSet = new Set(newFks.map(fk =>
    `${fk.table_name}(${fk.columns.join(',')})->${fk.foreign_table_name}(${fk.foreign_columns.join(',')})`
  ));

  const manquantes = oldFks.filter(fk =>
    !newFkSet.has(`${fk.table_name}(${fk.columns.join(',')})->${fk.foreign_table_name}(${fk.foreign_columns.join(',')})`)
  );

  console.log(`${manquantes.length} clé(s) étrangère(s) manquante(s) à ajouter :\n`);

  let ok = 0, fail = 0;
  for (const fk of manquantes) {
    const cols = fk.columns.join('", "');
    const fcols = fk.foreign_columns.join('", "');
    const sql = `ALTER TABLE ${fk.table_name} ADD CONSTRAINT "${fk.constraint_name}" FOREIGN KEY ("${cols}") REFERENCES ${fk.foreign_table_name} ("${fcols}")`;
    try {
      await newDb.query(sql);
      console.log(`  ✓ ${fk.table_name}(${fk.columns.join(',')}) → ${fk.foreign_table_name}(${fk.foreign_columns.join(',')})`);
      ok++;
    } catch (e) {
      console.warn(`  ✗ ${fk.table_name}(${fk.columns.join(',')}) → ${fk.foreign_table_name}(${fk.foreign_columns.join(',')}) :`, e.message);
      fail++;
    }
  }

  await oldDb.end();
  await newDb.end();
  console.log(`\n✅ ${ok} clé(s) ajoutée(s), ${fail} échec(s).`);
  if (fail > 0) console.log('Les échecs sont probablement dus à des données orphelines (une ligne référence un id qui n\'existe plus côté cible) — à traiter au cas par cas si besoin.');
})();
