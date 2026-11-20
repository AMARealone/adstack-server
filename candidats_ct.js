// candidats-ct-v1 (19 nov. 2026) — CRÉATIVES CANDIDATES POUR LES GALERIES CT.
// Pendant le balayage de l'analyse de marché, le serveur voit des pubs Meta (images et vidéos) et des vidéos TikTok organiques.
// Les meilleures RELATIVEMENT à leur propre recherche (6 au plus par balayage, contenus étrangers acceptés) sont téléchargées et rangées
// dans une file « À valider ». Le fondateur les accepte (elles entrent dans la galerie CT image ou vidéo, la vidéo est analysée) ou les refuse
// (le fichier est supprimé). Un email de résumé part quand de nouvelles candidates arrivent.
// Stockage : images → Supabase Storage (ct-gallery/candidats/), vidéos → Cloudflare R2 (ct-video/candidats/), fiches → table ct_candidats.
'use strict'
const MT = require('./marche_temps')

const MAX_IMAGE = 12 * 1024 * 1024, MAX_VIDEO = 80 * 1024 * 1024
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
const coupe = (s, n) => { s = String(s == null ? '' : s).replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n) + '…' : s }

// ── 1. Extraction des candidats depuis les réponses brutes du balayage ──
function depuisPub(ad, recherche) {
  const s = ad.snapshot || {}
  const age = MT.ageJours(ad.start_date)
  const variantes = ad.collation_count || 1
  const vids = (s.videos || []).concat(((s.cards || []).filter((c) => c && (c.video_hd_url || c.video_sd_url))))
  const imgs = (s.images || []).concat((s.cards || []).filter((c) => c && (c.original_image_url || c.resized_image_url)))
  const v = vids[0], im = imgs[0]
  const media = v ? (v.video_hd_url || v.video_sd_url) : im ? (im.original_image_url || im.resized_image_url) : ''
  if (!media) return null
  const corps = (s.body && (s.body.text || s.body)) || s.link_description || ''
  return {
    cle: 'meta:' + (ad.ad_archive_id || ad.collation_id || media).toString(), plateforme: 'meta_ads', type: v ? 'video' : 'image', recherche,
    mesure: MT.preuvePub(age, variantes), media_url: media, poster_url: v ? (v.video_preview_image_url || '') : '',
    auteur: ad.page_name || '', texte: coupe(typeof corps === 'string' ? corps : JSON.stringify(corps), 600),
    lien: ad.ad_archive_id ? 'https://www.facebook.com/ads/library/?id=' + ad.ad_archive_id : '', age_jours: age,
    metriques: { variantes, jours_actifs: age, plateformes: ad.publisher_platform || [] }
  }
}
function depuisTikTok(a, recherche) {
  const st = a.statistics || {}
  const vid = a.video || {}
  const url = (vid.download_addr && vid.download_addr.url_list && vid.download_addr.url_list[0]) || (vid.play_addr && vid.play_addr.url_list && vid.play_addr.url_list[0]) ||
    ((vid.bit_rate || [])[0] && vid.bit_rate[0].play_addr && vid.bit_rate[0].play_addr.url_list && vid.bit_rate[0].play_addr.url_list[0]) || ''
  const poster = (vid.cover && vid.cover.url_list && vid.cover.url_list[0]) || (vid.origin_cover && vid.origin_cover.url_list && vid.origin_cover.url_list[0]) || ''
  const pseudo = (a.author && a.author.unique_id) || ''
  return {
    cle: 'tiktok:' + (a.aweme_id || url), plateforme: 'tiktok', type: 'video', recherche, mesure: MT.engagementTikTok(st), media_url: url, poster_url: poster,
    auteur: pseudo, texte: coupe(a.desc, 600), lien: a.share_url || (pseudo && a.aweme_id ? `https://www.tiktok.com/@${pseudo}/video/${a.aweme_id}` : ''),
    age_jours: MT.ageJours(a.create_time),
    metriques: { vues: st.play_count || 0, jaime: st.digg_count || 0, commentaires: st.comment_count || 0, partages: st.share_count || 0, enregistrements: st.collect_count || 0, engagement_pct: Math.round(MT.engagementTikTok(st) * 10000) / 100 }
  }
}

// ── 2. Téléchargement et stockage ──
async function telecharger(url, max, referer) {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 60000)
  try {
    const r = await fetch(url, { headers: Object.assign({ 'User-Agent': UA, Accept: '*/*' }, referer ? { Referer: referer } : {}), signal: ctl.signal, redirect: 'follow' })
    if (!r.ok) throw new Error('HTTP ' + r.status)
    const lg = Number(r.headers.get('content-length') || 0)
    if (lg && lg > max) throw new Error('fichier trop lourd (' + Math.round(lg / 1048576) + ' Mo)')
    const buf = Buffer.from(await r.arrayBuffer())
    if (buf.length > max) throw new Error('fichier trop lourd')
    if (buf.length < 2000) throw new Error('fichier vide ou refusé')
    return { buf, type: (r.headers.get('content-type') || '').split(';')[0].trim() }
  } finally { clearTimeout(t) }
}
function r2Url(deps, method, key) {
  const { R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = process.env
  if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) throw new Error('clés Cloudflare R2 absentes sur Render')
  const bucket = process.env.R2_BUCKET || 'adstack-images'
  const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '')
  return deps.presign({ method, host: new URL(R2_ENDPOINT).host, path: `/${bucket}/${key}`, accessKey: R2_ACCESS_KEY_ID, secret: R2_SECRET_ACCESS_KEY, region: 'auto', amzDate, expires: 900 }).url
}
const r2Public = (key) => (process.env.R2_PUBLIC_BASE || 'https://images.adstackofficial.com').replace(/\/$/, '') + '/' + key
async function r2Mettre(deps, key, buf, type) {
  const r = await fetch(r2Url(deps, 'PUT', key), { method: 'PUT', headers: { 'Content-Type': type }, body: buf })
  if (!r.ok) throw new Error('envoi R2 HTTP ' + r.status)
  return r2Public(key)
}
async function r2Supprimer(deps, key) { try { if (key) await fetch(r2Url(deps, 'DELETE', key), { method: 'DELETE' }) } catch (_) {} }
async function sbMettre(deps, chemin, buf, type) {
  const r = await fetch(`${deps.SB}/storage/v1/object/ct-gallery/${chemin}`, { method: 'POST', headers: Object.assign(deps.entetes(), { 'Content-Type': type, 'x-upsert': 'true' }), body: buf })
  if (!r.ok) throw new Error('envoi Supabase HTTP ' + r.status)
  return `${deps.SB}/storage/v1/object/public/ct-gallery/${chemin}`
}
async function sbSupprimer(deps, chemin) {
  try { if (chemin) await fetch(`${deps.SB}/storage/v1/object/ct-gallery`, { method: 'DELETE', headers: Object.assign(deps.entetes(), { 'Content-Type': 'application/json' }), body: JSON.stringify({ prefixes: [chemin] }) }) } catch (_) {}
}
const extImage = (type) => /png/.test(type) ? 'png' : /webp/.test(type) ? 'webp' : 'jpg'

async function dejaVues(deps, cles) {
  if (!cles.length) return new Set()
  const liste = cles.map((c) => '"' + String(c).replace(/"/g, '') + '"').join(',')
  const r = await fetch(`${deps.SB}/rest/v1/ct_candidats?select=cle&cle=in.(${encodeURIComponent(liste)})`, { headers: deps.entetes() })
  if (r.status === 404) throw new Error('table ct_candidats absente : lancez le SQL candidats_ct.sql dans Supabase')
  if (!r.ok) throw new Error('lecture ct_candidats HTTP ' + r.status)
  return new Set((await r.json()).map((x) => x.cle))
}

// ── 3. Capture complète (appelée sans attendre, après le balayage) ──
async function capturer(deps, bruts, ctx) {
  const log = (m) => console.log('   [CT candidats] ' + m)
  const items = []
  ;(bruts.pubs || []).forEach(({ ad, recherche }) => { const c = depuisPub(ad, recherche); if (c) items.push(c) })
  ;(bruts.tiktok || []).forEach(({ a, recherche }) => { const c = depuisTikTok(a, recherche); if (c) items.push(c) })
  const choisis = MT.choisirCandidats(items, { max: 6 })
  log(`${items.length} contenu(s) vu(s), ${choisis.length} au-dessus de la norme de leur recherche`)
  if (!choisis.length) return { nouveaux: 0 }
  let vues
  try { vues = await dejaVues(deps, choisis.map((c) => c.cle)) } catch (e) { log('✗ ' + e.message); return { nouveaux: 0, erreur: e.message } }
  const nouveaux = []
  for (const c of choisis) {
    if (vues.has(c.cle)) continue
    const id = 'cand_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7)
    const ligne = { id, cle: c.cle, statut: 'a_valider', type: c.type, plateforme: c.plateforme, recherche: coupe(c.recherche, 200), produit: coupe(ctx.produit, 200), product_id: ctx.productId || null,
      pays: ctx.pays || '', auteur: coupe(c.auteur, 120), texte: c.texte, lien: c.lien, mesure: Math.round(c.mesure * 10000) / 10000, score_relatif: c.score_relatif, age_jours: c.age_jours,
      metriques: Object.assign({}, c.metriques, { contenus_dans_la_recherche: c.taille_recherche }), media_url: null, media_key: null, poster_url: null, poster_key: null, erreur: null }
    try {
      const referer = c.plateforme === 'tiktok' ? 'https://www.tiktok.com/' : ''
      if (c.type === 'image') {
        const f = await telecharger(c.media_url, MAX_IMAGE, referer)
        const chemin = `candidats/${id}.${extImage(f.type)}`
        ligne.media_url = await sbMettre(deps, chemin, f.buf, f.type || 'image/jpeg'); ligne.media_key = chemin
      } else {
        const f = await telecharger(c.media_url, MAX_VIDEO, referer)
        const key = `ct-video/candidats/${id}.mp4`
        ligne.media_url = await r2Mettre(deps, key, f.buf, 'video/mp4'); ligne.media_key = key
        if (c.poster_url) {
          try { const p = await telecharger(c.poster_url, MAX_IMAGE, referer); const pk = `ct-video/candidats/${id}-poster.jpg`; ligne.poster_url = await r2Mettre(deps, pk, p.buf, 'image/jpeg'); ligne.poster_key = pk } catch (_) {}
        }
      }
    } catch (e) { ligne.erreur = coupe('téléchargement impossible : ' + e.message, 300); ligne.media_url = null }
    const r = await fetch(`${deps.SB}/rest/v1/ct_candidats`, { method: 'POST', headers: Object.assign(deps.entetes(), { 'Content-Type': 'application/json', Prefer: 'return=minimal,resolution=ignore-duplicates' }), body: JSON.stringify(ligne) })
    if (!r.ok) { log('✗ fiche non enregistrée HTTP ' + r.status); continue }
    nouveaux.push(ligne)
    log(`✓ ${c.type} ${c.plateforme} « ${coupe(c.auteur, 40)} » ×${c.score_relatif} la norme de sa recherche${ligne.erreur ? ' (sans fichier : ' + ligne.erreur + ')' : ''}`)
  }
  if (nouveaux.length && deps.notifierAdmin) {
    const nbI = nouveaux.filter((x) => x.type === 'image').length, nbV = nouveaux.length - nbI
    const base = (process.env.FACTORY_URL || 'https://www.adstackofficial.com/factory').replace(/\/$/, '')
    const items = nouveaux.map((x) => `<li><b>${x.type === 'video' ? 'Vidéo' : 'Image'} · ${x.plateforme === 'tiktok' ? 'TikTok' : 'Pub Meta'}</b> — ${coupe(x.auteur, 60) || 'auteur inconnu'} · ${x.score_relatif} × la norme de sa recherche « ${coupe(x.recherche, 60)} »${x.age_jours !== null ? ' · ' + MT.ageTexte(x.age_jours) : ''}${x.erreur ? ' · <i>fichier non récupéré</i>' : ''}${x.lien ? ` · <a href="${x.lien}">source</a>` : ''}</li>`).join('')
    try {
      await deps.notifierAdmin(`🎯 ${nouveaux.length} créative(s) à valider — ${coupe(ctx.produit, 60)}`,
        `<p>Le balayage du marché pour <b>${coupe(ctx.produit, 80)}</b> a trouvé ${nouveaux.length} créative(s) au-dessus de la norme de leur recherche (${nbI} image(s), ${nbV} vidéo(s)).</p><ul>${items}</ul>` +
        `<p>${nbI ? `<a href="${base}/galerie?onglet=a_valider">Valider les images</a>` : ''}${nbI && nbV ? ' · ' : ''}${nbV ? `<a href="${base}/galerie-video?onglet=a_valider">Valider les vidéos</a>` : ''}</p>`)
    } catch (_) {}
  }
  return { nouveaux: nouveaux.length }
}

// ── 4. Routes (administrateur) ──
//   GET  /ct-candidats?statut=a_valider&type=image|video
//   POST /ct-candidats/decision { id, decision: 'accepte'|'refuse', ct_id? }
async function routes(req, res, deps) {
  const chemin = (req.url || '').split('?')[0]
  if (!chemin.startsWith('/ct-candidats')) return false
  const J = (code, o) => { res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(o)) }
  try {
    if (!(await deps.adminOk(req))) return J(403, { error: "réservé à l'administrateur" }), true
    if (req.method === 'GET' && chemin === '/ct-candidats') {
      const q = new URL(req.url, 'http://x').searchParams
      const statut = ['a_valider', 'accepte', 'refuse'].includes(q.get('statut')) ? q.get('statut') : 'a_valider'
      const type = ['image', 'video'].includes(q.get('type')) ? '&type=eq.' + q.get('type') : ''
      const r = await fetch(`${deps.SB}/rest/v1/ct_candidats?select=*&statut=eq.${statut}${type}&order=created_at.desc&limit=200`, { headers: deps.entetes() })
      if (r.status === 404) return J(200, { candidats: [], table: false }), true
      if (!r.ok) return J(502, { error: 'lecture HTTP ' + r.status }), true
      const rc = await fetch(`${deps.SB}/rest/v1/ct_candidats?select=type&statut=eq.a_valider`, { headers: deps.entetes() })
      const tous = rc.ok ? await rc.json() : []
      return J(200, { candidats: await r.json(), table: true, a_valider: { image: tous.filter((x) => x.type === 'image').length, video: tous.filter((x) => x.type === 'video').length } }), true
    }
    if (req.method === 'POST' && chemin === '/ct-candidats/decision') {
      const corps = await new Promise((ok, ko) => { let b = ''; req.on('data', (d) => { b += d; if (b.length > 20000) req.destroy() }); req.on('end', () => ok(b)); req.on('error', ko) })
      const { id, decision, ct_id } = JSON.parse(corps || '{}')
      if (!/^cand_[a-z0-9_]+$/i.test(String(id || '')) || !['accepte', 'refuse'].includes(decision)) return J(400, { error: 'demande illisible' }), true
      const r0 = await fetch(`${deps.SB}/rest/v1/ct_candidats?select=*&id=eq.${id}`, { headers: deps.entetes() })
      const c = r0.ok ? (await r0.json())[0] : null
      if (!c) return J(404, { error: 'candidate introuvable' }), true
      // Une image acceptée est recopiée dans la galerie par Factory : le fichier de la file n'est plus utile. Une vidéo acceptée garde son fichier (c'est la vidéo source du CT).
      if (c.type === 'image' && c.media_key) await sbSupprimer(deps, c.media_key)
      if (c.type === 'video' && decision === 'refuse') { await r2Supprimer(deps, c.media_key); await r2Supprimer(deps, c.poster_key) }
      const maj = { statut: decision, decide_le: new Date().toISOString(), ct_id: ct_id ? String(ct_id).slice(0, 80) : null }
      const r = await fetch(`${deps.SB}/rest/v1/ct_candidats?id=eq.${id}`, { method: 'PATCH', headers: Object.assign(deps.entetes(), { 'Content-Type': 'application/json', Prefer: 'return=minimal' }), body: JSON.stringify(maj) })
      if (!r.ok) return J(502, { error: 'mise à jour HTTP ' + r.status }), true
      return J(200, { ok: true }), true
    }
    return J(404, { error: 'route inconnue' }), true
  } catch (e) { return J(500, { error: e.message }), true }
}

module.exports = { capturer, routes, depuisPub, depuisTikTok, VERSION: 'candidats-ct-v1' }
