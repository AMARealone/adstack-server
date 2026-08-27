// fix-my-account.js
// Relie les anciennes données (produits, briefs, abonnement...) au nouveau compte, après une
// première connexion Google réussie. Cherche l'ancien id dans id_mapping.json à partir de
// l'email, applique le nouveau id fourni ci-dessous à toutes les tables concernées.
//
// Lance avec : node fix-my-account.js

console.log('=== FIX ACCOUNT VERSION 1 ===\n');

const { Client } = require('pg');
const fs = require('fs');

const EMAIL = 'amarbirane.diaw@unchk.edu.sn';
const NOUVEAU_ID = 'e89da3c6-cf0d-4ffb-891a-1825aedd5e7a';

const NEW_DB_CONNECTION = 'postgresql://postgres.hgxcpkrqdahmxhmpouvm:0dstack01112003@aws-1-eu-west-1.pooler.supabase.com:5432/postgres';

const TABLES_A_CORRIGER = [
  { table: 'products', colonne: 'user_id' },
  { table: 'briefs', colonne: 'user_id' },
  { table: 'subscriptions', colonne: 'user_id' },
  { table: 'pending_activations', colonne: 'resolved_user_id' },
];

(async () => {
  if (!fs.existsSync('id_mapping.json')) {
    console.error('⚠ id_mapping.json introuvable dans ce dossier — relance ce script depuis là où authv2.js a tourné.');
    process.exit(1);
  }
  const mapping = JSON.parse(fs.readFileSync('id_mapping.json', 'utf-8'));
  const entry = mapping.find(m => m.email.toLowerCase() === EMAIL.toLowerCase());
  if (!entry) {
    console.error(`⚠ Aucune entrée trouvée pour ${EMAIL} dans id_mapping.json`);
    process.exit(1);
  }
  console.log(`✓ Ancien id trouvé pour ${EMAIL} : ${entry.oldId}`);
  console.log(`→ Nouveau id : ${NOUVEAU_ID}\n`);

  const client = new Client({ connectionString: NEW_DB_CONNECTION });
  await client.connect();

  let totalGlobal = 0;
  for (const { table, colonne } of TABLES_A_CORRIGER) {
    try {
      const r = await client.query(`UPDATE ${table} SET ${colonne} = $1 WHERE ${colonne} = $2`, [NOUVEAU_ID, entry.oldId]);
      console.log(`  ✓ ${table}.${colonne} : ${r.rowCount} ligne(s) mise(s) à jour`);
      totalGlobal += r.rowCount;
    } catch (e) {
      console.warn(`  ⚠ ${table}.${colonne} :`, e.message);
    }
  }

  await client.end();
  console.log(`\n✅ Terminé — ${totalGlobal} ligne(s) au total reliée(s) à ton nouveau compte.`);
  console.log('Recharge AdBoard, tes produits devraient apparaître.');
})();
