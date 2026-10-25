// Migration ponctuelle — à exécuter UNE FOIS depuis le dossier adstack-server, après avoir
// configuré les variables d'environnement R2 (voir README plus bas). Convertit toutes les
// commandes existantes dont photo_base64/photo_nobg sont encore en base64 brut vers des URLs
// R2, et réduit d'autant la taille réelle de la table `commandes` dans Supabase.
//
// Usage :
//   R2_ENDPOINT=... R2_ACCESS_KEY_ID=... R2_SECRET_ACCESS_KEY=... \
//   SUPABASE_URL=https://mifljhsusidgzelnswma.supabase.co SUPABASE_SERVICE_KEY=... \
//   node migrate_photos_to_r2.js

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const R2_BUCKET = 'adstack-images';
const R2_PUBLIC_BASE = 'https://images.adstackofficial.com';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !process.env.R2_ACCESS_KEY_ID) {
  console.error('❌ Variables manquantes. Voir le commentaire en haut du fichier pour les 5 requises.');
  process.exit(1);
}

const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

async function uploaderVersR2(dataUri, cheminFichier) {
  const match = dataUri.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) return null;
  const mime = match[1];
  const buffer = Buffer.from(match[2], 'base64');
  await r2Client.send(new PutObjectCommand({
    Bucket: R2_BUCKET, Key: cheminFichier, Body: buffer, ContentType: mime,
  }));
  return `${R2_PUBLIC_BASE}/${cheminFichier}`;
}

async function main() {
  console.log('📡 Récupération de toutes les commandes...');
  const r = await fetch(`${SUPABASE_URL}/rest/v1/commandes?select=id,product,photo_nobg`, {
    headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` },
  });
  if (!r.ok) { console.error('❌ Erreur Supabase:', r.status, await r.text()); return; }
  const commandes = await r.json();
  console.log(`✅ ${commandes.length} commandes trouvées.\n`);

  let migrees = 0, dejaOk = 0, echecs = 0, octetsLiberes = 0;

  for (const c of commandes) {
    const patch = {};
    const photoOriginale = c.product?.photo_base64;
    const photoNobg = c.photo_nobg;

    if (photoOriginale && photoOriginale.startsWith('data:')) {
      octetsLiberes += photoOriginale.length;
      const url = await uploaderVersR2(photoOriginale, `briefs/${c.id}-original.png`);
      if (url) {
        patch.product = { ...c.product, photo_base64: url };
      } else {
        echecs++;
        console.warn(`  ⚠️ ${c.id} — échec upload photo originale`);
      }
    }

    if (photoNobg && photoNobg.startsWith('data:')) {
      octetsLiberes += photoNobg.length;
      const url = await uploaderVersR2(photoNobg, `briefs/${c.id}-nobg.png`);
      if (url) {
        patch.photo_nobg = url;
      } else {
        echecs++;
        console.warn(`  ⚠️ ${c.id} — échec upload photo nobg`);
      }
    }

    if (Object.keys(patch).length === 0) {
      dejaOk++;
      continue;
    }

    const rPatch = await fetch(`${SUPABASE_URL}/rest/v1/commandes?id=eq.${c.id}`, {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json', Prefer: 'return=minimal',
      },
      body: JSON.stringify(patch),
    });

    if (rPatch.ok) {
      migrees++;
      console.log(`  ✅ ${c.id} migrée`);
    } else {
      echecs++;
      console.warn(`  ⚠️ ${c.id} — échec écriture Supabase après upload R2 réussi (image quand même sur R2, pas perdue)`);
    }
  }

  console.log(`\n📊 Résumé :`);
  console.log(`   ${migrees} commandes migrées vers R2`);
  console.log(`   ${dejaOk} déjà propres (rien à faire)`);
  console.log(`   ${echecs} échecs (voir détails ci-dessus)`);
  console.log(`   ~${(octetsLiberes / 1024 / 1024).toFixed(1)} Mo de texte base64 libérés de la base de données`);
}

main().catch(e => console.error('❌ Erreur fatale:', e));
