// Mesure la taille approximative de chaque table en comptant les octets JSON réellement
// transférés pour son contenu complet — ne nécessite pas le Dashboard (juste l'API REST,
// déjà confirmée fonctionnelle par la migration qu'on vient de faire).
//
// Usage (mêmes variables que migrate_photos_to_r2.js) :
//   SUPABASE_URL=https://hgxcpkrqdahmxhmpouvm.supabase.co SUPABASE_SERVICE_KEY=... \
//   node mesurer_taille_tables.js

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_URL et SUPABASE_SERVICE_KEY requis.');
  process.exit(1);
}

// Liste des tables trouvées dans le code — ajoute-en si tu en connais d'autres.
const TABLES = [
  'commandes', 'briefs', 'products', 'prospects', 'transactions',
  'subscriptions', 'pending_activations', 'user_events', 'api_usage_log',
  'clarity_snapshots', 'templates', 'push_subscriptions',
];

async function mesurerTable(nom) {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${nom}?select=*`, {
      headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` },
    });
    if (!r.ok) return { nom, erreur: `HTTP ${r.status}` };
    const texte = await r.text();
    const octets = Buffer.byteLength(texte, 'utf8');
    let nbLignes = 0;
    try { nbLignes = JSON.parse(texte).length; } catch(e) {}
    return { nom, octets, nbLignes };
  } catch(e) {
    return { nom, erreur: e.message };
  }
}

async function main() {
  console.log('📡 Mesure en cours (peut prendre 1-2 minutes selon le volume)...\n');
  const resultats = [];
  for (const table of TABLES) {
    const res = await mesurerTable(table);
    resultats.push(res);
    if (res.erreur) {
      console.log(`  ${table.padEnd(22)} — ⚠️ ${res.erreur}`);
    } else {
      console.log(`  ${table.padEnd(22)} — ${(res.octets / 1024 / 1024).toFixed(2)} Mo (${res.nbLignes} lignes)`);
    }
  }

  const tries = resultats.filter(r => !r.erreur).sort((a, b) => b.octets - a.octets);
  console.log('\n📊 Classement par taille (plus gros en premier) :');
  tries.forEach((r, i) => {
    console.log(`  ${i + 1}. ${r.nom} — ${(r.octets / 1024 / 1024).toFixed(2)} Mo`);
  });
}

main();
