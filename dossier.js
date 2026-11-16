// AdStack — DOSSIER COMPLET D'UNE PRODUCTION (Render). Un seul zip avec TOUT ce qu'il faut pour analyser une production
// et améliorer les agents : brief, hypothèse et données marché, plan des niveaux, ad copies, images (fichier + prompt +
// contrôle qualité + CT utilisé), vidéos (fichier final + historique complet + CT source + dossier de tournage),
// coûts et journal de Factory. Le zip est déposé sur Cloudflare R2 (ct-video/dossiers/) et son lien est renvoyé.
// Route : POST /production/dossier  { commande_id, brief, deliverables, journal }
const crypto = require('crypto')

// ── zip minimal (méthode « stored », sans dépendance) ──
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0 } return t })()
const crc32 = (b) => { let c = 0xffffffff; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0 }
function zip(fichiers) {   // fichiers : [{ nom, data: Buffer }]
  const parts = [], central = []; let off = 0
  const now = new Date(), dt = ((now.getFullYear() - 1980) << 25) | ((now.getMonth() + 1) << 21) | (now.getDate() << 16) | (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1)
  for (const f of fichiers) {
    const nom = Buffer.from(f.nom, 'utf8'), d = f.data, crc = crc32(d)
    const h = Buffer.alloc(30); h.writeUInt32LE(0x04034b50, 0); h.writeUInt16LE(20, 4); h.writeUInt16LE(0x0800, 6); h.writeUInt16LE(0, 8); h.writeUInt32LE(dt >>> 0, 10); h.writeUInt32LE(crc, 14); h.writeUInt32LE(d.length, 18); h.writeUInt32LE(d.length, 22); h.writeUInt16LE(nom.length, 26); h.writeUInt16LE(0, 28)
    parts.push(h, nom, d)
    const c = Buffer.alloc(46); c.writeUInt32LE(0x02014b50, 0); c.writeUInt16LE(20, 4); c.writeUInt16LE(20, 6); c.writeUInt16LE(0x0800, 8); c.writeUInt16LE(0, 10); c.writeUInt32LE(dt >>> 0, 12); c.writeUInt32LE(crc, 16); c.writeUInt32LE(d.length, 20); c.writeUInt32LE(d.length, 24); c.writeUInt16LE(nom.length, 28); c.writeUInt32LE(off, 42)
    central.push(c, nom); off += 30 + nom.length + d.length
  }
  const cd = Buffer.concat(central), e = Buffer.alloc(22)
  e.writeUInt32LE(0x06054b50, 0); e.writeUInt16LE(fichiers.length, 8); e.writeUInt16LE(fichiers.length, 10); e.writeUInt32LE(cd.length, 12); e.writeUInt32LE(off, 16)
  return Buffer.concat([...parts, cd, e])
}

async function telecharger(url, max = 80e6, ms = 120000) {
  const r = await fetch(url, { signal: AbortSignal.timeout(ms) })
  if (!r.ok) throw new Error('HTTP ' + r.status)
  const b = Buffer.from(await r.arrayBuffer())
  if (b.length > max) throw new Error('trop lourd (' + Math.round(b.length / 1e6) + ' Mo)')
  return b
}
async function versR2(key, buf, type) {
  const { presign } = require('./r2_video')
  const { R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = process.env
  if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) throw new Error('clés Cloudflare absentes côté serveur')
  const bucket = process.env.R2_BUCKET || 'adstack-images', host = new URL(R2_ENDPOINT).host
  const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '')
  const { url } = presign({ method: 'PUT', host, path: `/${bucket}/${key}`, accessKey: R2_ACCESS_KEY_ID, secret: R2_SECRET_ACCESS_KEY, region: 'auto', amzDate, expires: 3600 })
  const r = await fetch(url, { method: 'PUT', headers: { 'Content-Type': type }, body: buf })
  if (!r.ok) throw new Error('envoi R2 HTTP ' + r.status)
  return (process.env.R2_PUBLIC_BASE || 'https://images.adstackofficial.com').replace(/\/$/, '') + '/' + key
}
const lire = (req, max = 60e6) => new Promise((ok, ko) => { const ch = []; let n = 0; req.on('data', (d) => { n += d.length; if (n > max) { req.destroy(); ko(new Error('corps trop gros')) } else ch.push(d) }); req.on('end', () => ok(Buffer.concat(ch).toString('utf8'))); req.on('error', ko) })
const rep = (res, code, o) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(o)) }
const NIV = { problem: 'Problem Aware', solution: 'Solution Aware', product: 'Product Aware', most: 'Most Aware' }
const sur = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w\-]+/g, '_').replace(/_+/g, '_').slice(0, 40)
const ext = (u, def) => (String(u || '').split('?')[0].match(/\.(png|jpe?g|webp|mp4|mov|webm|json|zip)$/i) || [, def])[1].toLowerCase()

module.exports = async function dossier(req, res) {
  if (req.method !== 'POST' || (req.url || '').split('?')[0] !== '/production/dossier') return false
  const t0 = Date.now()
  try {
    const b = JSON.parse((await lire(req)) || '{}')
    const cmd = String(b.commande_id || 'sans_commande').replace(/[^\w\-]/g, '').slice(0, 60)
    const d = b.deliverables || {}, brief = b.brief || {}
    const F = [], manques = [], liens = []
    const ajouter = (nom, data) => F.push({ nom, data: Buffer.isBuffer(data) ? data : Buffer.from(typeof data === 'string' ? data : JSON.stringify(data, null, 2), 'utf8') })
    let poids = 0
    const media = async (nom, url, max, quoi) => {
      if (!url || !/^https:\/\//.test(url)) return false
      if (poids > 100e6) { liens.push(quoi + ' : ' + url + ' (non inclus : dossier déjà lourd)'); return false }
      try { const buf = await telecharger(url, max); poids += buf.length; ajouter(nom, buf); return true }
      catch (e) { manques.push(quoi + ' — ' + e.message + ' — ' + url); return false }
    }
    // 1. brief, hypothèse, marché, plan, coûts, journal
    ajouter('01_brief/brief.json', brief)
    ajouter('02_hypothese_marche/synthese_S0-S7.md', String(d.synthesis || '(absente)'))
    ajouter('02_hypothese_marche/donnees_marche.json', d.marche || null)
    ajouter('02_hypothese_marche/angles_retenus.json', d.angles || [])
    ajouter('03_plan/plan_niveaux_de_conscience.json', d.planNiveaux || null)
    ajouter('03_plan/couts.json', d.couts || null)
    ajouter('03_plan/journal_factory.txt', (b.journal || []).join('\n') || '(vide)')
    // 2. ad copies
    ;(d.copies || []).forEach((c, a) => { if (c) ajouter(`04_ad_copies/angle${a + 1}.md`, '# Angle ' + (a + 1) + ' — ' + String((d.angles || [])[a] || '').split('*')[0] + '\n\n## 5 hooks\n' + (c.hooks || []).map((h, i) => (i + 1) + '. ' + h).join('\n') + '\n\n## Description\n' + (c.description || '')) })
    // 3. créatives
    const lignes = []
    const crea = Array.isArray(d.creatives) ? d.creatives : []
    for (let i = 0; i < crea.length; i++) {
      const c = crea[i]; if (!c) continue
      const a = (c.angleIdx || 0) + 1, niv = NIV[c.niveau] || c.niveau || ''
      if (c.kind === 'video') {
        const j = c.job || {}, base = `06_videos/angle${a}_${sur(niv)}_${sur(j.ctNom || c.ct)}`
        ajouter(base + '/infos.json', { angle: a, niveau: niv, ct: j.ct || c.ct, ct_nom: j.ctNom, raison_du_choix: j.raison || c.ctRaison, direction: j.direction || null, execution: j.execution, run: j.run, etat: j.etat, erreur: j.erreur, cout_usd: j.cout_usd, monteur: j.monteur, debut: j.debut, fin: j.fin, video: c.videoUrl, historique: j.historiqueUrl, dossier_tournage: j.dossierUrl, ct_video_source: j.ctVideoUrl })
        if (j.journal && j.journal.length) ajouter(base + '/journal_machine.txt', j.journal.map((x) => typeof x === 'string' ? x : JSON.stringify(x)).join('\n'))
        await media(base + '/video_finale.' + ext(c.videoUrl, 'mp4'), c.videoUrl, 120e6, 'vidéo angle ' + a)
        await media(base + '/historique_production.json', j.historiqueUrl, 60e6, 'historique vidéo angle ' + a)
        await media(base + '/ct_source.' + ext(j.ctVideoUrl, 'mp4'), j.ctVideoUrl, 60e6, 'CT source vidéo angle ' + a)
        if (j.dossierUrl) { if (!(await media(base + '/dossier_tournage.zip', j.dossierUrl, 60e6, 'dossier de tournage angle ' + a))) liens.push('dossier de tournage angle ' + a + ' : ' + j.dossierUrl) }
        lignes.push(`| ${a} | vidéo | ${niv} | ${j.ctNom || c.ct || '—'} | ${j.etat || (c.videoUrl ? 'prête' : '—')} | ${j.cout_usd != null ? Number(j.cout_usd).toFixed(2) + ' $' : '—'} | — |`)
      } else {
        const base = `05_images/angle${a}_${sur(niv)}_${i + 1}`
        await media(base + '/image.' + ext(c.url, 'png'), c.url, 30e6, 'image ' + (i + 1))
        if (!c.url && c.imgB64) ajouter(base + '/image.png', Buffer.from(c.imgB64, 'base64'))
        await media(base + '/ct_utilise.' + ext(c.ctUrl, 'jpg'), c.ctUrl, 20e6, 'CT image ' + (i + 1))
        ajouter(base + '/prompt_gemini.txt', String(c.prompt || '(prompt non conservé : créative faite avant la v10c)'))
        ajouter(base + '/meta_agent.txt', String(c.meta || c.desc || ''))
        ajouter(base + '/infos.json', { angle: a, niveau: niv, ct: c.ct, raison_du_choix: c.ctRaison, controle_qualite: c.qa || null, historique_qa: c.qaHist || null })
        const q = c.qa || {}
        lignes.push(`| ${a} | image | ${niv} | ${c.ct || '—'} | ${q.verdict || '—'}${q.score != null ? ' ' + q.score + '/10' : ''} | — | ${q.corrections || 0} |`)
      }
    }
    // 4. lisez-moi
    const md = ['# Dossier complet de production', '', `Commande : ${cmd}`, `Marque / produit : ${brief.marque || '?'} — ${brief.produit || '?'} (${brief.pays || '?'})`, `Créé le : ${new Date().toISOString()}`, '',
      '## Créatives', '| Angle | Type | Niveau | CT | État / contrôle | Coût | Corrections |', '|---|---|---|---|---|---|---|', ...lignes, '',
      '## Coûts', '```json', JSON.stringify(d.couts || {}, null, 2), '```', '',
      liens.length ? '## Liens non inclus\n' + liens.map((x) => '- ' + x).join('\n') : '', manques.length ? '\n## Éléments manquants\n' + manques.map((x) => '- ' + x).join('\n') : '',
      '', '## Contenu', '01 brief · 02 hypothèse et données marché · 03 plan, coûts, journal Factory · 04 ad copies · 05 images (image, CT utilisé, prompt, contrôle qualité) · 06 vidéos (vidéo finale, CT source, historique complet du tournage, dossier de tournage)'].join('\n')
    F.unshift({ nom: '00_LISEZMOI.md', data: Buffer.from(md, 'utf8') })
    const z = zip(F)
    const key = `ct-video/dossiers/${sur(brief.marque || 'production')}_${cmd}_${new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-')}.zip`
    const url = await versR2(key, z, 'application/zip')
    console.log('🗂 DOSSIER COMPLET — ' + F.length + ' fichiers, ' + Math.round(z.length / 1e6) + ' Mo, ' + Math.round((Date.now() - t0) / 1000) + ' s → ' + url)
    return rep(res, 200, { url, fichiers: F.length, mo: Math.round(z.length / 1e5) / 10, manques, liens }), true
  } catch (e) { console.error('✗ dossier', e.message); return rep(res, 500, { error: e.message }), true }
}
module.exports.zip = zip
