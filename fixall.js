// fix-all-accounts.js
// Pour chacun des comptes migrés : trouve son VRAI ancien id (directement depuis auth.users
// de l'ancien projet, pas depuis id_mapping.json qui s'est déjà trompé 2 fois), son nouvel id
// (s'il s'est déjà connecté), et corrige products/briefs/subscriptions/pending_activations
// si des lignes traînent encore sous l'ancien id.
//
// Lance avec : node fix-all-accounts.js

console.log('=== FIX ALL ACCOUNTS VERSION 1 ===\n');

const OLD_URL = 'https://mifljhsusidgzelnswma.supabase.co';
const OLD_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pZmxqaHN1c2lkZ3plbG5zd21hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzkyMjYzNCwiZXhwIjoyMDkzNDk4NjM0fQ.ofHPWFowYLzCx1dr9f0TveA74br8cgRHwyNTGQUA8E4';

const NEW_URL = 'https://hgxcpkrqdahmxhmpouvm.supabase.co';
const NEW_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhneGNwa3JxZGFobXhobXBvdXZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Nzc4MTUyNiwiZXhwIjoyMTAzMzU3NTI2fQ.KxhzYsRLBV6ZOx_ikJT64wqNsDjAJijDDKEFs51tOyw';

const TABLES_A_CORRIGER = [
  { table: 'products', colonne: 'user_id' },
  { table: 'briefs', colonne: 'user_id' },
  { table: 'subscriptions', colonne: 'user_id' },
  { table: 'pending_activations', colonne: 'resolved_user_id' },
];

async function listAllUsers(baseUrl, serviceKey) {
  const users = [];
  let page = 1;
  while (true) {
    const r = await fetch(`${baseUrl}/auth/v1/admin/users?per_page=1000&page=${page}`, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` }
    });
    const data = await r.json();
    const batch = data.users || data || [];
    if (!batch.length) break;
    users.push(...batch);
    if (batch.length < 1000) break;
    page++;
  }
  return users;
}

(async () => {
  console.log('📋 Récupération des comptes des deux projets...\n');
  const oldUsers = await listAllUsers(OLD_URL, OLD_SERVICE_KEY);
  const newUsers = await listAllUsers(NEW_URL, NEW_SERVICE_KEY);
  console.log(`Ancien projet : ${oldUsers.length} compte(s)`);
  console.log(`Nouveau projet : ${newUsers.length} compte(s)\n`);

  const newByEmail = {};
  newUsers.forEach(u => { newByEmail[u.email.toLowerCase()] = u.id; });

  let totalCorrections = 0;
  for (const oldUser of oldUsers) {
    const email = oldUser.email.toLowerCase();
    const newId = newByEmail[email];
    if (!newId) {
      console.log(`⏭ ${email} — pas encore de compte sur le nouveau projet, ignoré`);
      continue;
    }
    if (newId === oldUser.id) {
      console.log(`✓ ${email} — même id des deux côtés, rien à faire`);
      continue;
    }

    let corrigeCeCompte = 0;
    for (const { table, colonne } of TABLES_A_CORRIGER) {
      try {
        const patchRes = await fetch(`${NEW_URL}/rest/v1/${table}?${colonne}=eq.${oldUser.id}`, {
          method: 'PATCH',
          headers: { apikey: NEW_SERVICE_KEY, Authorization: `Bearer ${NEW_SERVICE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
          body: JSON.stringify({ [colonne]: newId })
        });
        const patched = await patchRes.json();
        if (Array.isArray(patched) && patched.length) {
          console.log(`  → ${table}.${colonne} : ${patched.length} ligne(s) corrigée(s)`);
          corrigeCeCompte += patched.length;
        }
      } catch (e) {
        console.warn(`  ⚠ ${table}.${colonne} :`, e.message);
      }
    }

    if (corrigeCeCompte > 0) {
      console.log(`✅ ${email} — ${corrigeCeCompte} ligne(s) au total reliée(s) à son nouveau compte\n`);
      totalCorrections += corrigeCeCompte;
    } else {
      console.log(`✓ ${email} — ids différents mais rien à corriger (déjà bon ou aucune donnée)\n`);
    }
  }

  console.log(`\n🏁 Terminé — ${totalCorrections} ligne(s) corrigée(s) au total, tous comptes confondus.`);
})();
