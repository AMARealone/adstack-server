// migrate-storage.js
// Copie tous les fichiers des buckets Storage de l'ancien projet Supabase vers le nouveau.
// Lance avec : node migrate-storage.js
//
// Remplis les 4 valeurs ci-dessous avant de lancer.

const OLD_URL = 'https://mifljhsusidgzelnswma.supabase.co'; // ancien projet (déjà connu)
const OLD_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pZmxqaHN1c2lkZ3plbG5zd21hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzkyMjYzNCwiZXhwIjoyMDkzNDk4NjM0fQ.ofHPWFowYLzCx1dr9f0TveA74br8cgRHwyNTGQUA8E4';

const NEW_URL = 'https://hgxcpkrqdahmxhmpouvm.supabase.co';
const NEW_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhneGNwa3JxZGFobXhobXBvdXZtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Nzc4MTUyNiwiZXhwIjoyMTAzMzU3NTI2fQ.KxhzYsRLBV6ZOx_ikJT64wqNsDjAJijDDKEFs51tOyw';

// migrate-storage.js — VERSION 2 (clés pré-remplies)
console.log('=== STORAGE VERSION 4 (retry + pause anti-rejet) ===\n');

const BUCKETS = ['demos', 'images', 'ct-gallery']; // ajoute ici tout autre bucket que tu utiliserais

async function listAllObjects(baseUrl, serviceKey, bucket) {
  const objects = [];
  let offset = 0;
  const limit = 1000;
  while (true) {
    const r = await fetch(`${baseUrl}/storage/v1/object/list/${bucket}`, {
      method: 'POST',
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ prefix: '', limit, offset, sortBy: { column: 'name', order: 'asc' } })
    });
    if (!r.ok) { console.error(`  ✗ Erreur listing ${bucket} :`, r.status, await r.text()); break; }
    const batch = await r.json();
    if (!batch.length) break;
    objects.push(...batch.filter(o => o.id)); // exclut les "dossiers" virtuels sans id
    offset += limit;
    if (batch.length < limit) break;
  }
  return objects;
}

async function ensureBucketExists(baseUrl, serviceKey, bucket) {
  const r = await fetch(`${baseUrl}/storage/v1/bucket`, {
    method: 'POST',
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: bucket, name: bucket, public: true })
  });
  // 200 = créé, 409 = existe déjà (les deux sont OK)
  if (!r.ok && r.status !== 409) console.warn(`  ⚠ Création bucket ${bucket} :`, r.status, await r.text());
}

async function migrateBucket(bucket) {
  console.log(`\n📦 Bucket "${bucket}"`);
  await ensureBucketExists(NEW_URL, NEW_SERVICE_KEY, bucket);

  const objects = await listAllObjects(OLD_URL, OLD_SERVICE_KEY, bucket);
  console.log(`  ${objects.length} fichier(s) trouvé(s)`);

  let ok = 0, fail = 0;
  for (const obj of objects) {
    let tentatives = 0;
    let reussi = false;
    while (tentatives < 3 && !reussi) {
      tentatives++;
      try {
        const dl = await fetch(`${OLD_URL}/storage/v1/object/${bucket}/${obj.name}`, {
          headers: { apikey: OLD_SERVICE_KEY, Authorization: `Bearer ${OLD_SERVICE_KEY}` }
        });
        if (!dl.ok) { console.error(`  ✗ Téléchargement échoué (${dl.status}): ${obj.name}`); break; }
        const buffer = Buffer.from(await dl.arrayBuffer());
        const contentType = dl.headers.get('content-type') || 'application/octet-stream';

        const up = await fetch(`${NEW_URL}/storage/v1/object/${bucket}/${obj.name}`, {
          method: 'POST',
          headers: {
            apikey: NEW_SERVICE_KEY, Authorization: `Bearer ${NEW_SERVICE_KEY}`,
            'Content-Type': contentType, 'x-upsert': 'true',
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
          body: buffer
        });
        if (!up.ok) { console.error(`  ✗ Upload échoué (${up.status}): ${obj.name}`); break; }
        reussi = true;
        ok++;
        if (ok % 20 === 0) console.log(`  ... ${ok}/${objects.length}`);
      } catch (e) {
        if (tentatives < 3) {
          console.warn(`  ⚠ ${obj.name} — échec réseau, tentative ${tentatives}/3 dans 2s...`);
          await new Promise(r => setTimeout(r, 2000));
        } else {
          console.error(`  ✗ Abandonné après 3 tentatives : ${obj.name} —`, e.message);
        }
      }
    }
    if (!reussi) fail++;
    // Petite pause entre chaque fichier — l'ancien projet est en fin de quota Supabase,
    // mieux vaut y aller doucement que de déclencher un rejet massif comme la dernière fois.
    await new Promise(r => setTimeout(r, 150));
  }
  console.log(`  ✓ Terminé : ${ok} copiés, ${fail} échoués`);
}

(async () => {
  if (OLD_SERVICE_KEY.startsWith('COLLE_ICI') || NEW_URL.startsWith('COLLE_ICI') || NEW_SERVICE_KEY.startsWith('COLLE_ICI')) {
    console.error('⚠ Remplis d\'abord les 4 valeurs en haut du fichier avant de lancer.');
    process.exit(1);
  }
  for (const bucket of BUCKETS) {
    await migrateBucket(bucket);
  }
  console.log('\n✅ Migration Storage terminée.');
})();
