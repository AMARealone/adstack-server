// Patch idempotent de serveur.js (v10c) : « Envoyer à un compte » (manual-deliver)
//  1. remplace vraiment ce qui a changé (image refaite, vidéo ajoutée, ad copies réécrites) au lieu d'ignorer un renvoi ;
//  2. ne répond plus « ok » si l'écriture dans AdBoard a échoué : il renvoie le détail (créatives, ad copies, marché) que Factory vérifie.
// Usage : node patch_serveur_v10c.js [chemin/serveur.js]
const fs = require('fs'), path = require('path')
const f = process.argv[2] || path.join(__dirname, 'serveur.js')
let s = fs.readFileSync(f, 'utf8')
const dejaA = s.includes('v10c-remplacer'), dejaB = s.includes('v10c-compte-produit')
if (dejaA && dejaB) { console.log('Déjà patché : rien à faire.'); process.exit(0) }
const AN = "if (req.method === 'POST' && req.url === '/manual-deliver') {"
if (!dejaB && s.split(AN).length - 1 !== 1) { console.error('ANCRE manual-deliver introuvable : RIEN N\'A ÉTÉ MODIFIÉ.'); process.exit(1) }
if (!dejaA) {
const A1 = "const { userId, productId, newProductName, deliverables, ticketId } = JSON.parse(body);"
const A2 = "const pushResult = await pushDeliverablesToProduct(targetProductId, ticketId || ('manuel-' + Date.now()), deliverables, new Set(), false, null, null, null, generationVersion);"
const A3 = /res\.writeHead\(200, \{'Content-Type':'application\/json'\}\);\s*res\.end\(JSON\.stringify\(\{ ok: true, productId: targetProductId \}\)\);/g
const compte = (a) => typeof a === 'string' ? s.split(a).length - 1 : (s.match(a) || []).length
for (const [n, a] of [['1', A1], ['2', A2], ['3', A3]]) { const k = compte(a); if (k !== 1) { console.error('ANCRE ' + n + ' introuvable ou multiple (' + k + ') : serveur.js différent de celui attendu. RIEN N\'A ÉTÉ MODIFIÉ.'); process.exit(1) } }
s = s.replace(A1, "const { userId, productId, newProductName, deliverables, ticketId, remplacer } = JSON.parse(body); // v10c-remplacer")
s = s.replace(A2, `// v10c — renvoi : ce qui a changé remplace l'ancien (même id), sinon un renvoi ne mettait rien à jour
      if (remplacer && ticketId) {
        const hd = { apikey: SUPABASE_SERVICE_KEY, Authorization: \`Bearer \${SUPABASE_SERVICE_KEY}\`, 'Content-Type': 'application/json', Prefer: 'return=minimal' };
        const rl = await fetch(\`\${SUPABASE_URL_INT}/rest/v1/products?id=eq.\${targetProductId}&select=creatives,deliveries\`, { headers: hd });
        if (!rl.ok) throw new Error('Lecture du produit échouée avant remplacement : HTTP ' + rl.status);
        const row = (await rl.json())[0] || {};
        const ids = new Set();
        (deliverables.creatives || []).forEach((c, i) => { if (c && (c.url || c.imgB64 || c.videoUrl)) ids.add(\`\${ticketId}_g\${generationVersion}_\${i}\`); });
        const patch = { creatives: (row.creatives || []).filter(c => !ids.has(c.id)) };
        if (remplacer === 'tout') patch.deliveries = (row.deliveries || []).filter(d => d.ticketId !== ticketId);
        const rp = await fetch(\`\${SUPABASE_URL_INT}/rest/v1/products?id=eq.\${targetProductId}\`, { method: 'PATCH', headers: hd, body: JSON.stringify(patch) });
        if (!rp.ok) throw new Error('Remplacement des anciens livrables échoué : HTTP ' + rp.status);
      }
      ` + A2)
s = s.replace(A3, () => `if (!pushResult || pushResult.patchOk === false) { res.writeHead(500, {'Content-Type':'application/json'}); res.end(JSON.stringify({ ok: false, error: 'Écriture dans AdBoard échouée' + (pushResult && pushResult.error ? ' : ' + pushResult.error : ''), push: pushResult || null })); return; }
      res.writeHead(200, {'Content-Type':'application/json'});
      res.end(JSON.stringify({ ok: true, productId: targetProductId, push: { expectedCount: pushResult.expectedCount, pushedCount: pushResult.pushedCount, adCopiesOk: pushResult.adCopiesOk, adCopiesCount: pushResult.adCopiesCount, adCopiesAttendu: pushResult.adCopiesAttendu, marcheOk: pushResult.marcheOk } }));`)
}
if (!dejaB) { const bloc = fs.readFileSync(path.join(__dirname, 'bloc_compte_produit.txt'), 'utf8'); s = s.replace(AN, () => bloc + AN) }
fs.copyFileSync(f, f + '.avant_v10c')
fs.writeFileSync(f, s)
console.log('serveur.js patché (v10c). Sauvegarde : ' + f + '.avant_v10c')
