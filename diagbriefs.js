// diagnose-missing-briefs.js
// Trouve les lignes de briefs présentes dans l'ancien projet mais absentes du nouveau
// (les 6 échecs JSON jamais rattrapés depuis la toute première migration), et affiche
// exactement quelle colonne pose problème pour chacune.
//
// Lance avec : node diagnose-missing-briefs.js

console.log('=== DIAGNOSE MISSING BRIEFS VERSION 1 ===\n');

const { Client } = require('pg');

const OLD_CONNECTION = 'postgresql://postgres.mifljhsusidgzelnswma:1dstack01112003@aws-1-eu-central-1.pooler.supabase.com:5432/postgres';
const NEW_CONNECTION = 'postgresql://postgres.hgxcpkrqdahmxhmpouvm:0dstack01112003@aws-1-eu-west-1.pooler.supabase.com:5432/postgres';

(async () => {
  const oldDb = new Client({ connectionString: OLD_CONNECTION });
  const newDb = new Client({ connectionString: NEW_CONNECTION });
  await oldDb.connect();
  await newDb.connect();

  const oldIds = (await oldDb.query('SELECT id FROM briefs')).rows.map(r => r.id);
  const newIds = new Set((await newDb.query('SELECT id FROM briefs')).rows.map(r => r.id));
  const manquants = oldIds.filter(id => !newIds.has(id));

  console.log(`${manquants.length} ligne(s) manquante(s) sur ${oldIds.length} au total.\n`);

  for (const id of manquants) {
    const row = (await oldDb.query('SELECT * FROM briefs WHERE id = $1', [id])).rows[0];
    console.log(`── Brief ${id} ──`);
    console.log(`  user_id: ${row.user_id}`);
    console.log(`  product_id: ${row.product_id}`);
    console.log(`  status: ${row.status}, credits_used: ${row.credits_used}`);
    for (const [col, val] of Object.entries(row)) {
      if (val !== null && typeof val === 'object') {
        console.log(`  ⚠ colonne "${col}" (probable coupable) :`, JSON.stringify(val).slice(0, 200));
      }
    }
    console.log('');
  }

  await oldDb.end();
  await newDb.end();
})();
