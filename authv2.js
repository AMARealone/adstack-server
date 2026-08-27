// migrate-auth.js
// Recrée les comptes utilisateurs dans le nouveau projet Supabase.
// Lance avec : node migrate-auth.js
//
// ⚠️ IMPORTANT : les mots de passe ne peuvent PAS être migrés directement (Supabase ne les
// expose jamais, même via l'API admin, pour des raisons de sécurité — c'est normal et voulu).
// Chaque utilisateur recréé recevra un mot de passe temporaire aléatoire, ET ce script génère
// un lien de réinitialisation par email pour chacun. Vu le petit nombre de comptes réels
// (quelques utilisateurs), c'est largement gérable manuellement le temps de la bascule.

const OLD_URL = 'https://mifljhsusidgzelnswma.supabase.co';
const OLD_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pZmxqaHN1c2lkZ3plbG5zd21hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzkyMjYzNCwiZXhwIjoyMDkzNDk4NjM0fQ.ofHPWFowYLzCx1dr9f0TveA74br8cgRHwyNTGQUA8E4';

const NEW_URL = 'https://hgxcpkrqdahmxhmpouvm.supabase.co';
const NEW_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhneGNwa3JxZGFobXhobXBvdXZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Nzc4MTUyNiwiZXhwIjoyMTAzMzU3NTI2fQ.KxhzYsRLBV6ZOx_ikJT64wqNsDjAJijDDKEFs51tOyw';

// migrate-auth.js — VERSION 2 (clés pré-remplies)
console.log('=== AUTH VERSION 2 ===\n');

function randomPassword() {
  return 'Tmp' + Math.random().toString(36).slice(2, 10) + '!Aa1';
}

async function listOldUsers() {
  const users = [];
  let page = 1;
  while (true) {
    const r = await fetch(`${OLD_URL}/auth/v1/admin/users?per_page=1000&page=${page}`, {
      headers: { apikey: OLD_SERVICE_KEY, Authorization: `Bearer ${OLD_SERVICE_KEY}` }
    });
    if (!r.ok) { console.error('Erreur listing users:', r.status, await r.text()); break; }
    const data = await r.json();
    const batch = data.users || data || [];
    if (!batch.length) break;
    users.push(...batch);
    if (batch.length < 1000) break;
    page++;
  }
  return users;
}

async function createNewUser(oldUser) {
  const tempPassword = randomPassword();
  const r = await fetch(`${NEW_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers: { apikey: NEW_SERVICE_KEY, Authorization: `Bearer ${NEW_SERVICE_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: oldUser.email,
      password: tempPassword,
      email_confirm: true, // déjà vérifié avant, pas la peine de refaire vérifier
      phone: oldUser.phone || undefined,
      user_metadata: oldUser.user_metadata || {},
      app_metadata: oldUser.app_metadata || {},
    })
  });
  if (!r.ok) {
    const errText = await r.text();
    if (errText.includes('already been registered') || r.status === 422) {
      console.log(`  ⏭ ${oldUser.email} — déjà présent dans le nouveau projet, ignoré`);
      return { skipped: true };
    }
    console.error(`  ✗ ${oldUser.email} — échec création :`, r.status, errText);
    return { error: true };
  }
  const created = await r.json();
  return { ok: true, newId: created.id, oldId: oldUser.id, email: oldUser.email, tempPassword };
}

async function envoyerResetPassword(email) {
  try {
    await fetch(`${NEW_URL}/auth/v1/recover`, {
      method: 'POST',
      headers: { apikey: NEW_SERVICE_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
  } catch (e) {
    console.warn(`  ⚠ Envoi email reset échoué pour ${email} :`, e.message);
  }
}

(async () => {
  if (OLD_SERVICE_KEY.startsWith('COLLE_ICI') || NEW_URL.startsWith('COLLE_ICI') || NEW_SERVICE_KEY.startsWith('COLLE_ICI')) {
    console.error('⚠ Remplis d\'abord les 4 valeurs en haut du fichier avant de lancer.');
    process.exit(1);
  }

  console.log('📋 Récupération des comptes existants...');
  const oldUsers = await listOldUsers();
  console.log(`${oldUsers.length} compte(s) trouvé(s) dans l'ancien projet.\n`);

  const idMapping = []; // ancien user_id -> nouveau user_id — INDISPENSABLE pour la migration des données
  const resultats = [];

  for (const u of oldUsers) {
    console.log(`→ ${u.email}`);
    const res = await createNewUser(u);
    if (res.ok) {
      idMapping.push({ oldId: res.oldId, newId: res.newId, email: res.email });
      resultats.push(res);
      await envoyerResetPassword(u.email);
      console.log(`  ✓ Créé — email de réinitialisation envoyé à ${u.email}`);
    }
  }

  const fs = require('fs');
  fs.writeFileSync('id_mapping.json', JSON.stringify(idMapping, null, 2));
  console.log(`\n✅ ${resultats.length} compte(s) migré(s).`);
  console.log('📄 id_mapping.json écrit — GARDE CE FICHIER, il sert à la migration des données (products.user_id, briefs.user_id, etc. doivent être remis à jour avec les nouveaux ids).');
  console.log('\n⚠ Chaque utilisateur doit cliquer sur le lien reçu par email pour définir un nouveau mot de passe avant de pouvoir se reconnecter.');
})();
