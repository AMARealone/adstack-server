// delete-wrong-accounts.js
// Supprime les comptes créés par migrate-auth.js — nécessaire car ils sont email+mot de passe,
// alors que la vraie connexion se fait via Google OAuth. Un compte email+password existant
// avec le même email BLOQUE la connexion Google (Supabase ne les relie pas automatiquement).
//
// Lance avec : node delete-wrong-accounts.js

console.log('=== DELETE VERSION 1 ===\n');

const NEW_URL = 'https://hgxcpkrqdahmxhmpouvm.supabase.co';
const NEW_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhneGNwa3JxZGFobXhobXBvdXZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Nzc4MTUyNiwiZXhwIjoyMTAzMzU3NTI2fQ.KxhzYsRLBV6ZOx_ikJT64wqNsDjAJijDDKEFs51tOyw';

const fs = require('fs');

(async () => {
  if (!fs.existsSync('id_mapping.json')) {
    console.error('⚠ id_mapping.json introuvable — lance-le depuis le dossier où migrate-auth.js a tourné.');
    process.exit(1);
  }
  const mapping = JSON.parse(fs.readFileSync('id_mapping.json', 'utf-8'));
  console.log(`${mapping.length} compte(s) à supprimer.\n`);

  for (const { newId, email } of mapping) {
    const r = await fetch(`${NEW_URL}/auth/v1/admin/users/${newId}`, {
      method: 'DELETE',
      headers: { apikey: NEW_SERVICE_KEY, Authorization: `Bearer ${NEW_SERVICE_KEY}` }
    });
    if (r.ok) console.log(`✓ Supprimé : ${email}`);
    else console.error(`✗ Échec pour ${email} :`, r.status, await r.text());
  }

  console.log('\n✅ Nettoyage terminé. Les emails pourront maintenant se connecter via Google normalement.');
  console.log('⚠ GARDE id_mapping.json quand même — les couples (email, oldId) restent valides et serviront au remapping après chaque première connexion Google.');
})();
