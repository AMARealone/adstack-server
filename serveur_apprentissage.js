// ══ APPRENTISSAGE — créatives, angles et concepts gagnants (tp-v2-apprentissage) ══
// BACK-END SEULEMENT : le client ne voit jamais rien de ceci dans AdBoard (il ne voit que son classement et son angle gagnant).
// Méthode : le classement de chaque cible (topPerformer.js) donne un indice par créative ; on cherche ensuite ce qui SE RÉPÈTE dans le haut des classements
// (angle, concept de CT, format) au lieu de couronner une créative isolée. Un motif vu sur peu de créatives ou peu de ventes reste une HYPOTHÈSE à confirmer,
// pas une règle (un classement sur 2 ou 3 acheteurs est du hasard).
function ecrireApprentissage(id, snap) {
  (async () => {
    try {
      const { presign } = require('./r2_video');
      const { R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = process.env;
      if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) return;
      const bucket = process.env.R2_BUCKET || 'adstack-images', host = new URL(R2_ENDPOINT).host;
      const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
      const { url } = presign({ method: 'PUT', host, path: `/${bucket}/learning/creatives/${id}.json`, accessKey: R2_ACCESS_KEY_ID, secret: R2_SECRET_ACCESS_KEY, region: 'auto', amzDate, expires: 3600 });
      const r = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(snap) });
      if (!r.ok) console.warn('[apprentissage] R2 HTTP ' + r.status);
    } catch (e) { console.warn('[apprentissage] ' + e.message); }
  })();
}
const _compactApprentissage = (x, max = 20000) => { if (x == null) return null; try { const t = JSON.stringify(x); return t.length <= max ? x : t.slice(0, max); } catch (_) { return null; } };

function agregerApprentissage(creatives) {
  const comparables = creatives.filter(x => x.comparable && x.sur >= 2);
  const poidsFiab = (f) => f === 'solide' ? 1 : f === 'moyenne' ? 0.6 : 0.3;
  const agreger = (cle, extra) => {
    const m = {};
    comparables.forEach(x => {
      const k = cle(x); if (!k) return;
      const a = m[k] = m[k] || { cle: k, n: 0, nTop: 0, somme: 0, poids: 0, achats: 0, produits: new Set(), cibles: new Set(), ...(extra ? extra(x) : {}) };
      const w = poidsFiab(x.fiabilite);
      a.n++; if (x.dansLeTiersSuperieur) a.nTop++;
      a.somme += w * Math.log(Math.max(0.25, Math.min(4, (x.indice || 100) / 100))); a.poids += w; a.achats += x.achats || 0;
      a.produits.add(x.productId); a.cibles.add(x.productId + '|' + x.cible);
    });
    return Object.values(m).map(a => {
      const indiceMoyen = Math.round(100 * Math.exp(a.somme / a.poids)), partTop = a.nTop / a.n;
      const regle = a.n >= 4 && partTop >= 0.5 && indiceMoyen >= 110 && a.cibles.size >= 2 && a.achats >= 50;
      const tendance = a.n >= 2 && partTop >= 0.5 && indiceMoyen >= 110;
      return { ...a, produits: a.produits.size, cibles: a.cibles.size, indiceMoyen, partTop: Math.round(partTop * 100) / 100, statut: regle ? 'règle' : tendance ? 'tendance' : 'à confirmer' };
    }).sort((p, q) => q.indiceMoyen - p.indiceMoyen);
  };
  // angle gagnant par (produit, cible) : celui qui met le plus de créatives dans le tiers supérieur, à indice moyen égal le meilleur
  const parAngle = agreger(x => x.productId + '|' + x.cible + '|' + x.angle, x => ({ produit: x.produit, cible: x.cible, angle: x.angle }));
  const gagnantsAngle = {};
  parAngle.forEach(a => { const g = a.produit + '|' + a.cible; if (!gagnantsAngle[g] || a.nTop > gagnantsAngle[g].nTop || (a.nTop === gagnantsAngle[g].nTop && a.indiceMoyen > gagnantsAngle[g].indiceMoyen)) gagnantsAngle[g] = a; });
  const anglesGagnants = Object.values(gagnantsAngle).filter(a => a.nTop >= 1 && a.indiceMoyen >= 110).map(a => ({ ...a, statut: a.n >= 2 && a.nTop >= 2 && a.achats >= 50 ? 'confirmé' : 'hypothèse' }));
  return {
    angles_gagnants: anglesGagnants,
    concepts_ct: agreger(x => x.ct, x => ({ concept: x.concept })),
    concepts_balises: agreger(x => x.concept),
    formats: agreger(x => x.format),
  };
}

async function carnetApprentissage() {
  const H = { apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` };
  const prods = await (await fetch(`${SUPABASE_URL_INT}/rest/v1/products?select=id,nom,creatives,deliveries`, { headers: H })).json();
  if (!Array.isArray(prods)) throw new Error('lecture des produits impossible');
  let galerie = { parId: {} }; try { galerie = await chargerGalerieBalisee(); } catch (_) {}
  const creatives = [];
  for (const p of prods) {
    const avec = (p.creatives || []).filter(c => c && c.topPerformer && aDesChiffres(c));
    if (!avec.length) continue;
    const groupes = {};
    avec.forEach(c => { const d = (p.deliveries || []).find(x => x.semaine === c.week); const k = (d && (d.cible_signature || d.cible)) || c.cible || 'cible inconnue'; (groupes[k] = groupes[k] || []).push({ c, d }); });
    for (const [cible, membres] of Object.entries(groupes)) {
      const sc = scoresTopPerformer(membres.map(m => m.c));
      const classees = classerTopPerformer(membres.map(m => m.c));
      const nTiers = Math.max(1, Math.ceil(classees.length / 3));
      classees.forEach((c, i) => {
        const s = sc[c.id], d = (membres.find(m => m.c.id === c.id) || {}).d, ct = c.ct || c.ctId || null, g = ct && galerie.parId[ct];
        const st = completerStats(c.tpStats);
        creatives.push({ produit: p.nom || p.id, productId: p.id, cible, creativeId: c.id, rang: i + 1, sur: classees.length, dansLeTiersSuperieur: classees.length >= 3 && i < nTiers, indice: s.indice, fiabilite: s.fiabilite, comparable: !!s.comparable, stats: c.tpStats, achats: Number.isFinite(st.achats) ? st.achats : null, angle: c.angle || null, ct, concept: g ? g.concept : null, format: (c.type === 'video' || c.videoUrl) ? 'video' : 'image', lot: c.week || null, hooks: (((d && d.angles) || []).find(a => a.nom === c.angle) || {}).hooks || [], url: c.videoUrl || c.imageUrl || null });
      });
    }
  }
  const statut = (x) => (!x.comparable || x.sur < 3) ? 'trop tôt (moins de 3 créatives comparables)' : (x.indice >= 120 && x.fiabilite !== 'faible') ? 'gagnante' : x.indice >= 110 ? 'candidate' : x.indice < 85 ? 'perdante' : 'dans la moyenne';
  creatives.forEach(x => { x.statut = statut(x); });
  // fiche complète (prompt, script, direction, hooks…) gardée à la livraison : on la joint aux créatives qui comptent
  const R2_PUB = (process.env.R2_PUBLIC_BASE || 'https://images.adstackofficial.com').replace(/\/$/, '');
  await Promise.all(creatives.filter(x => x.indice >= 110).slice(0, 60).map(async x => {
    try { const r = await fetch(`${R2_PUB}/learning/creatives/${x.creativeId}.json`, { signal: AbortSignal.timeout(8000) }); if (r.ok) x.fiche = await r.json(); } catch (_) {}
  }));
  creatives.sort((a, b) => (b.indice || 0) - (a.indice || 0));
  return { genere_le: new Date().toISOString(), nb_produits: prods.length, nb_creatives_chiffrees: creatives.length, creatives_gagnantes: creatives.filter(x => x.statut === 'gagnante'), creatives_candidates: creatives.filter(x => x.statut === 'candidate'), ...agregerApprentissage(creatives), toutes_les_creatives: creatives };
}
