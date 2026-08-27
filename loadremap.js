// load-remap-table.js
// Charge TOUS les couples (email, ancien_id) de id_mapping.json dans une table dédiée du
// nouveau projet — sert ensuite au reconciliation automatique à la première connexion de
// chaque compte (voir l'endpoint /reconcile-account côté serveur).
//
// Lance avec : node load-remap-table.js

console.log('=== LOAD REMAP VERSION 1 ===\n');

const { Client } = require('pg');
const fs = require('fs');

const NEW_DB_CONNECTION = 'postgresql://postgres.hgxcpkrqdahmxhmpouvm:0dstack01112003@aws-1-eu-west-1.pooler.supabase.com:5432/postgres';

(async () => {
  if (!fs.existsSync('id_mapping.json')) {
    console.error('⚠ id_mapping.json introuvable dans ce dossier.');
    process.exit(1);
  }
  const mapping = JSON.parse(fs.readFileSync('id_mapping.json', 'utf-8'));
  console.log(`${mapping.length} compte(s) à charger.\n`);

  const client = new Client({ connectionString: NEW_DB_CONNECTION });
  await client.connect();

  await client.query(`
    CREATE TABLE IF NOT EXISTS user_id_remap (
      email text PRIMARY KEY,
      old_id uuid NOT NULL,
      resolved boolean NOT NULL DEFAULT false,
      resolved_at timestamptz,
      new_id uuid
    );
  `);
  console.log('✓ Table user_id_remap prête.\n');

  let inserted = 0;
  for (const { email, oldId } of mapping) {
    await client.query(
      `INSERT INTO user_id_remap (email, old_id) VALUES ($1, $2)
       ON CONFLICT (email) DO UPDATE SET old_id = EXCLUDED.old_id`,
      [email.toLowerCase(), oldId]
    );
    inserted++;
    console.log(`  ✓ ${email}`);
  }

  await client.end();
  console.log(`\n✅ ${inserted} compte(s) chargé(s) dans user_id_remap.`);
})();
