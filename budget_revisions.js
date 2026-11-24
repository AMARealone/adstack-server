// budget-client-v1 + rectifications-v1 (24 nov. 2026) — décisions du fondateur :
//  1. BUDGET DE PRODUCTION PAR CLIENT ET PAR MOIS : 117 $ pour un PERF+ (24 créatives), proportionnel aux crédits pour les autres offres
//     (GROWTH 234 $, SCALE 468 $, ONE SHOT 29 $). C'est ce qui garde 50 % de profit net à 250 000 FCFA.
//     Chaque vidéo reçoit son budget au lancement : 8 $ tout compris, dont 1,5 $ de caisse erreurs (au lieu de 15 $ + 2 $). Il n'est jamais
//     baissé en dessous (la qualité passe avant) ; un mois qui dépasse l'enveloppe déclenche une alerte pour trouver ce qui a coûté. Le moteur vidéo s'y adapte déjà seul (moins de reprises, film plus court si besoin).
//     Alerte par email à 80 % et à 100 % du budget du mois.
//  2. RECTIFICATIONS : une par vidéo, demandée par le client depuis AdBoard, livrée en 24 h au plus. Elle arrive dans Factory ;
//     le fondateur la prépare (traduction en plans à refaire + avis de faisabilité), la lance (correcteur plan par plan, plafond 3 $),
//     puis la livre : la vidéo du client est remplacée dans AdBoard et il est prévenu.
// Branché dans serveur.js : brancher(deps) au démarrage, routes() dans le routeur, cron() dans /cron/check-pending.
// Le module video_jobs.js appelle budgetVideo() au lancement de chaque vidéo d'une commande.
const BUDGET_PERF = () => parseFloat(process.env.BUDGET_CLIENT_PERF_USD || '117')
const CREDITS = { starter: 24, pro: 48, scale: 96, oneshot: 6 }
const VIDEO_CIBLE = () => parseFloat(process.env.BUDGET_VIDEO_CIBLE_USD || '8')
const VIDEO_MIN = () => parseFloat(process.env.BUDGET_VIDEO_MIN_USD || '8'), VIDEO_MAX = 10   // sous 8 $ le moteur n'a plus de quoi tourner assez de plans : la qualité passe avant, un dépassement se signale
const CAISSE_ERR = 1.5            // part du budget d'une vidéo réservée aux seules reprises d'un défaut qui la rend impubliable
const HORS_VIDEO_LOT = 5          // hypothèse, ad copies, 4 images et leurs corrections, par lot de 6 (même valeur que Factory)
const RESERVE_REV_VIDEO = 1       // gardé par vidéo à venir pour sa rectification
const REVISION_MAX_USD = () => parseFloat(process.env.REVISION_MAX_USD || '3')
const DELAI_REV_H = 24
const FACTORY = 'https://www.adstackofficial.com/factory/production?cmd='

let D = null
const brancher = (f) => { D = f }
const deps = () => { if (!D) throw new Error('module budget non branché'); return typeof D === 'function' ? D() : D }
const lire = (req, max = 60000) => new Promise((ok, ko) => { let b = ''; req.on('data', (d) => { b += d; if (b.length > max) { req.destroy(); ko(new Error('corps trop gros')) } }); req.on('end', () => ok(b)); req.on('error', ko) })
const rep = (res, code, o) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(o)) }
const r2 = (n) => Math.round(n * 100) / 100
const nomDe = (b) => String((b && b.product && b.product.nom) || 'produit').slice(0, 80)
const dateFr = (ms) => new Date(ms).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' UTC'
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

// ── période du mois en cours d'un client : cycles de 30 jours ancrés sur le début de son abonnement ──
async function periodeClient(uid) {
  const d = deps()
  let s = null
  try {
    const r = await fetch(`${d.SB}/rest/v1/subscriptions?user_id=eq.${encodeURIComponent(uid)}&select=plan,type,started_at&order=started_at.desc&limit=1`, { headers: d.entetes() })
    if (r.ok) s = ((await r.json()) || [])[0] || null
  } catch (_) { }
  if (!s) return null
  const plan = s.type === 'pack' ? 'oneshot' : String(s.plan || 'starter')
  const credits = CREDITS[plan] || 24
  const J30 = 30 * 86400000, maintenant = Date.now()
  let debut = new Date(s.started_at || maintenant).getTime()
  if (!(debut > 0)) debut = maintenant
  if (plan !== 'oneshot') while (debut + J30 <= maintenant) debut += J30
  return { plan, credits, debut, fin: debut + (plan === 'oneshot' ? 60 * 86400000 : J30), plafond: r2(BUDGET_PERF() * credits / 24) }
}

// ── ce qu'une commande a coûté (coûts relevés par Factory et par le moteur vidéo) ──
function coutCommande(b) {
  const d = (b && b.deliverables) || {}
  const hors = Number((d.couts || {}).hors_video) || 0
  let videos = 0, nbVideos = 0
  ;(d.creatives || []).forEach((c) => {
    const j = c && c.job; if (!j) return
    const u = Number(j.cout_usd) || 0   // coût total de la vidéo, tentatives et corrections comprises (le moteur relit ce qui est déjà payé sans le recompter)
    videos += u
    if (c.videoUrl || j.etat === 'termine') nbVideos++
  })
  return { hors_video: r2(hors), videos: r2(videos), total: r2(hors + videos), nb_videos: nbVideos }
}

// ── état du budget du mois d'un client ──
async function etatBudget(uid, { briefs } = {}) {
  const per = await periodeClient(uid)
  if (!per) return null
  const liste = (briefs || await deps().loadBriefs()).filter((b) => b && b.client && b.client.user_id === uid && new Date(b.created_at).getTime() >= per.debut)
  let depense = 0, faites = 0, revAttente = 0
  const commandes = liste.map((b) => {
    const c = coutCommande(b); depense += c.total; faites += c.nb_videos
    revAttente += (Array.isArray(b.revisions) ? b.revisions : []).filter((r) => r && !['livree', 'refusee'].includes(r.etat)).length
    return { id: b.id, produit: nomDe(b), date: b.created_at, ...c }
  })
  const prevues = Math.max(1, Math.round(per.credits / 3))   // 1 vidéo pour 3 créatives (lot de 6 = 2 vidéos + 4 images)
  const restantes = Math.max(0, prevues - faites)
  const horsRestant = Math.ceil(restantes / 2) * HORS_VIDEO_LOT
  const reserve = restantes * RESERVE_REV_VIDEO + revAttente * REVISION_MAX_USD()
  const reste = per.plafond - depense
  const parVideo = restantes > 0 ? (reste - horsRestant - reserve) / restantes : 0
  // 8 $ par vidéo ; jamais plus, même si le client a consommé peu (le surplus reste du profit) ; jamais moins (la vidéo est due au client, en bonne qualité)
  const cible = Math.min(VIDEO_MAX, VIDEO_CIBLE())
  const total = restantes > 0 ? Math.max(VIDEO_MIN(), Math.min(cible, parVideo)) : VIDEO_MIN()
  const pct = per.plafond > 0 ? Math.round(depense / per.plafond * 100) : 0
  return {
    plan: per.plan, credits: per.credits, periode: { debut: new Date(per.debut).toISOString(), fin: new Date(per.fin).toISOString() },
    plafond_usd: per.plafond, depense_usd: r2(depense), reste_usd: r2(reste), pct,
    videos_prevues: prevues, videos_faites: faites, videos_restantes: restantes, rectifications_en_attente: revAttente,
    budget_video: { total_usd: r2(total), production_usd: r2(total - CAISSE_ERR), erreurs_usd: CAISSE_ERR, par_video_disponible_usd: r2(parVideo) },
    alerte: pct >= 100 ? 'depasse' : pct >= 80 ? 'attention' : null,
    commandes,
  }
}

// ── alertes 80 % / 100 % : une seule fois par seuil, par client et par mois ──
const alertesFaites = new Set()
async function alerter(b, e) {
  try {
    if (!e || !e.alerte) return
    const cle = b.client.user_id + '|' + e.periode.debut + '|' + e.alerte
    if (alertesFaites.has(cle)) return
    alertesFaites.add(cle)
    const titre = e.alerte === 'depasse' ? '🔴 Budget de production DÉPASSÉ' : '🟠 Budget de production à ' + e.pct + ' %'
    await deps().notifierAdmin(titre + ' — ' + nomDe(b), `<p><b>${esc(titre)}</b> pour le client de « ${esc(nomDe(b))} » (offre ${esc(e.plan)}).</p>
      <p>Dépensé ce mois : <b>${e.depense_usd.toFixed(2)} $</b> sur ${e.plafond_usd.toFixed(2)} $ · vidéos : ${e.videos_faites} faites sur ${e.videos_prevues} prévues.</p>
      <p>${e.alerte === 'depasse' ? 'Chaque vidéo restante garde ses 8 $ (la qualité passe avant) : vérifiez dans Factory ce qui a coûté le plus (vidéos refaites, reprises, textes réécrits).' : 'À surveiller : évitez les vidéos refaites en entier, préférez le texte d\'abord et les corrections de plans.'}</p>
      <p><a href="${FACTORY}${encodeURIComponent(b.id)}">Ouvrir la commande dans Factory</a></p>`)
  } catch (_) { }
}

// ── budget d'UNE vidéo au lancement (appelé par video_jobs.js) ──
async function budgetVideo(cmd) {
  try {
    const briefs = await deps().loadBriefs()
    const b = briefs.find((x) => x && x.id === cmd)
    if (!b || !b.client || !b.client.user_id) return null
    const e = await etatBudget(b.client.user_id, { briefs })
    if (!e) return null
    alerter(b, e)
    return { total: e.budget_video.total_usd, production: e.budget_video.production_usd, erreurs: e.budget_video.erreurs_usd,
      raison: 'budget du mois ' + e.depense_usd.toFixed(2) + ' / ' + e.plafond_usd.toFixed(2) + ' $, ' + e.videos_restantes + ' vidéo(s) restante(s)' }
  } catch (e) { console.log('[Budget] budget de la vidéo non calculé : ' + e.message); return null }
}

// ── qui parle : le client propriétaire (ou un membre actif de son équipe) ──
async function utilisateur(req) {
  const d = deps(), tok = (req.headers['authorization'] || '').replace(/^Bearer\s+/i, '')
  if (!tok) return null
  try {
    const r = await fetch(`${d.SB}/auth/v1/user`, { headers: { apikey: d.ANON, Authorization: `Bearer ${tok}` } })
    if (!r.ok) return null
    return await r.json()
  } catch (_) { return null }
}
async function peutAgirPour(me, ownerId) {
  if (!me || !ownerId) return false
  if (me.id === ownerId) return true
  try {
    const d = deps()
    const r = await fetch(`${d.SB}/rest/v1/team_members?member_id=eq.${encodeURIComponent(me.id)}&owner_id=eq.${encodeURIComponent(ownerId)}&status=eq.active&select=owner_id`, { headers: d.entetes() })
    return r.ok && ((await r.json()) || []).length > 0
  } catch (_) { return false }
}
// id d'une créative AdBoard : <commande>_g<version>_<index>
const lireIdCreative = (id) => { const m = /^(.+)_g\d+_(\d+)$/.exec(String(id || '')); return m ? { cmd: m[1], index: Number(m[2]) } : null }
const publique = (r) => r && { id: r.id, etat: r.etat, t: r.t, echeance: r.echeance, livree_t: r.livree_t || null, texte: r.texte }

async function chargerBrief(cmd) {
  const l = await deps().loadBriefs(cmd)
  return (l || []).find((x) => x && x.id === cmd) || null
}
async function sauver(b) { await deps().saveBriefs([b]) }

// ── la demande du client est traduite en plans à refaire, avec un avis de faisabilité ──
async function preparer(b, r, plans) {
  const d = deps()
  if (!d.callGeminiPro) throw new Error('modèle de texte indisponible sur le serveur')
  const desc = (plans || []).map((p) => `Plan ${p.bloc}${p.t0 != null ? ` (${Number(p.t0).toFixed(1)}–${Number(p.t1).toFixed(1)} s)` : ''} : ${p.dit ? 'réplique « ' + String(p.dit).slice(0, 300) + ' »' : 'sans parole'}${p.image ? ' — image : ' + String(p.image).slice(0, 300) : ''}`).join('\n')
  const sys = `Tu prépares la rectification d'une vidéo publicitaire déjà livrée à un client d'AdStack. La vidéo est découpée en plans numérotés.
L'outil de correction refait l'IMAGE et le MOUVEMENT de plans entiers (geste, position et aspect du produit, objet, décor, expression, cadrage, personnage), en gardant la même réplique, la même voix, la même musique, les mêmes sous-titres et le même montage. Il ne sait pas changer les mots dits, la voix, la musique, les sous-titres, la durée, l'ordre des plans, ni ajouter un plan.
Lis la demande du client au plus près de ce qu'il veut voir changer, retrouve les plans concernés, et écris pour chacun une consigne précise et visuelle (ce que le plan doit montrer, dans le décor et avec le produit de la vidéo). Si une partie de la demande sort de ce que l'outil sait faire, nomme-la.
Réponds uniquement en JSON : {"plans":[{"bloc":numéro,"consigne":"…"}],"faisable":"oui"|"partiel"|"non","hors_correcteur":["…"],"explication":"une ou deux phrases pour le fondateur"}`
  const txt = await d.callGeminiPro(sys, [{ type: 'text', text: `PRODUIT : ${nomDe(b)}\n\nPLANS DE LA VIDÉO :\n${desc || '(plans inconnus)'}\n\nDEMANDE DU CLIENT :\n${r.texte}` }], 3000,
    { modele: (d.MODELES && d.MODELES.raisonnement) || undefined, temperature: 0.2, thinkingBudget: 2048, logLabel: 'Rectification', typeAppel: 'revision_video' })
  const m = /\{[\s\S]*\}/.exec(String(txt || ''))
  if (!m) throw new Error('réponse illisible')
  const j = JSON.parse(m[0])
  const blocs = new Set((plans || []).map((p) => Number(p.bloc)))
  j.plans = (Array.isArray(j.plans) ? j.plans : []).map((x) => ({ bloc: Number(x.bloc), consigne: String(x.consigne || '').trim().slice(0, 600) })).filter((x) => x.bloc > 0 && (!blocs.size || blocs.has(x.bloc)) && x.consigne.length >= 4).slice(0, 8)
  j.faisable = ['oui', 'partiel', 'non'].includes(j.faisable) ? j.faisable : (j.plans.length ? 'partiel' : 'non')
  j.hors_correcteur = (Array.isArray(j.hors_correcteur) ? j.hors_correcteur : []).map((x) => String(x).slice(0, 300)).slice(0, 6)
  j.explication = String(j.explication || '').slice(0, 600)
  return j
}

// ── la vidéo corrigée remplace celle du client dans AdBoard ──
async function livrerDansAdboard(b, r) {
  const d = deps()
  const c = ((b.deliverables || {}).creatives || [])[r.index]
  if (!c || !c.videoUrl) throw new Error('la vidéo corrigée n\'est pas encore dans la commande (attendez la fin de la correction)')
  const pid = b.product && b.product.id
  if (!pid) throw new Error('commande sans produit AdBoard')
  const rp = await fetch(`${d.SB}/rest/v1/products?id=eq.${encodeURIComponent(pid)}&select=creatives`, { headers: d.entetes() })
  if (!rp.ok) throw new Error('lecture du produit : HTTP ' + rp.status)
  const prod = ((await rp.json()) || [])[0]
  if (!prod) throw new Error('produit introuvable dans AdBoard')
  const re = new RegExp('^' + String(b.id).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '_g\\d+_' + r.index + '$')
  let trouve = false
  const creatives = (prod.creatives || []).map((x) => {
    if (!x || !re.test(String(x.id || ''))) return x
    trouve = true
    return { ...x, videoUrl: c.videoUrl, thumbUrl: c.thumbUrl || x.thumbUrl, rectifiee_le: new Date().toISOString() }
  })
  if (!trouve) throw new Error('cette vidéo n\'a pas encore été envoyée au client : envoyez-la depuis Factory')
  const rw = await fetch(`${d.SB}/rest/v1/products?id=eq.${encodeURIComponent(pid)}`, { method: 'PATCH', headers: { ...d.entetes(), 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify({ creatives }) })
  if (!rw.ok) throw new Error('mise à jour du produit : HTTP ' + rw.status)
  try { await d.notifyUserBoth(b.client.user_id, { title: 'Votre vidéo rectifiée est prête', body: nomDe(b) + ' : la nouvelle version est dans votre galerie.', url: '/adboard', type: 'success' }) } catch (_) { }
}

async function routes(req, res) {
  const u = new URL(req.url, 'http://x'), url = u.pathname
  if (!url.startsWith('/budget/') && !url.startsWith('/revisions/')) return false
  const d = deps()
  try {
    // ── Factory : budget du client d'une commande ──
    if (req.method === 'GET' && url === '/budget/client') {
      if (!(await d.adminOk(req))) return rep(res, 401, { error: 'accès administrateur requis' }), true
      const cmd = String(u.searchParams.get('commande_id') || '')
      const b = await chargerBrief(cmd)
      if (!b) return rep(res, 404, { error: 'commande introuvable' }), true
      if (!b.client || !b.client.user_id) return rep(res, 200, { sans_client: true }), true
      const e = await etatBudget(b.client.user_id)
      if (!e) return rep(res, 200, { sans_abonnement: true }), true
      alerter(b, e)
      return rep(res, 200, { ...e, commande: coutCommande(b) }), true
    }
    // ── AdBoard : demander une rectification (une par vidéo) ──
    if (req.method === 'POST' && url === '/revisions/demander') {
      const me = await utilisateur(req); if (!me) return rep(res, 401, { error: 'connexion requise' }), true
      const x = JSON.parse((await lire(req)) || '{}')
      const id = lireIdCreative(x.creative_id), texte = String(x.texte || '').trim()
      if (!id) return rep(res, 400, { error: 'vidéo inconnue' }), true
      if (texte.length < 15) return rep(res, 400, { error: 'Décrivez précisément ce qu\'il faut changer (15 caractères au moins).' }), true
      const b = await chargerBrief(id.cmd)
      if (!b) return rep(res, 404, { error: 'commande introuvable' }), true
      if (!(await peutAgirPour(me, b.client && b.client.user_id))) return rep(res, 403, { error: 'cette vidéo n\'est pas à vous' }), true
      const c = ((b.deliverables || {}).creatives || [])[id.index]
      if (!c || !(c.kind === 'video' || c.videoUrl)) return rep(res, 400, { error: 'les rectifications concernent les vidéos uniquement' }), true
      b.revisions = Array.isArray(b.revisions) ? b.revisions : []
      const deja = b.revisions.find((r) => r && r.index === id.index && r.etat !== 'refusee')
      if (deja) return rep(res, 409, { error: deja.etat === 'livree' ? 'La rectification de cette vidéo a déjà été utilisée.' : 'Une rectification est déjà en cours pour cette vidéo.', revision: publique(deja) }), true
      const t = Date.now()
      const r = { id: t.toString(36), t, echeance: t + DELAI_REV_H * 3600000, creative_id: String(x.creative_id), index: id.index, slot: (c.job && c.job.slot) || (Number(c.angleIdx) + 1) || null, texte: texte.slice(0, 2000), etat: 'nouvelle', par: me.id }
      b.revisions.push(r)
      await sauver(b)
      d.notifierAdmin('🩹 Rectification demandée — ' + nomDe(b), `<p>Le client de « ${esc(nomDe(b))} » demande une rectification de sa vidéo (créative n°${id.index + 1}).</p>
        <blockquote style="border-left:3px solid #5B8DEF;padding-left:10px;color:#333">${esc(r.texte).replace(/\n/g, '<br>')}</blockquote>
        <p>À livrer avant le <b>${dateFr(r.echeance)}</b> (24 h).</p><p><a href="${FACTORY}${encodeURIComponent(b.id)}">Ouvrir dans Factory</a></p>`).catch(() => { })
      console.log('🩹 Rectification demandée : commande ' + b.id + ' vidéo ' + id.index)
      return rep(res, 200, { ok: true, revision: publique(r) }), true
    }
    // ── AdBoard : état de la rectification d'une vidéo ──
    if (req.method === 'GET' && url === '/revisions/etat') {
      const me = await utilisateur(req); if (!me) return rep(res, 401, { error: 'connexion requise' }), true
      const id = lireIdCreative(u.searchParams.get('creative_id'))
      if (!id) return rep(res, 200, { revision: null }), true
      const b = await chargerBrief(id.cmd)
      if (!b || !(await peutAgirPour(me, b.client && b.client.user_id))) return rep(res, 200, { revision: null }), true
      const r = (Array.isArray(b.revisions) ? b.revisions : []).filter((x) => x && x.index === id.index).pop()
      return rep(res, 200, { revision: publique(r) || null }), true
    }
    // ── Factory : rectifications ──
    if (!(await d.adminOk(req))) return rep(res, 401, { error: 'accès administrateur requis' }), true
    if (req.method === 'GET' && url === '/revisions/liste') {
      const cmd = String(u.searchParams.get('commande_id') || '')
      const l = cmd ? [await chargerBrief(cmd)].filter(Boolean) : await d.loadBriefs()
      const out = []
      l.forEach((b) => (Array.isArray(b.revisions) ? b.revisions : []).forEach((r) => { if (cmd || !['livree', 'refusee'].includes(r.etat)) out.push({ ...r, commande_id: b.id, produit: nomDe(b) }) }))
      out.sort((a, b2) => a.echeance - b2.echeance)
      return rep(res, 200, { revisions: out, plafond_usd: REVISION_MAX_USD() }), true
    }
    const x = JSON.parse((await lire(req, 200000)) || '{}')
    const b = await chargerBrief(String(x.commande_id || ''))
    if (!b) return rep(res, 404, { error: 'commande introuvable' }), true
    const r = (Array.isArray(b.revisions) ? b.revisions : []).find((y) => y && y.id === String(x.id || ''))
    if (!r) return rep(res, 404, { error: 'rectification introuvable' }), true
    if (req.method === 'POST' && url === '/revisions/preparer') {
      r.preparation = { ...(await preparer(b, r, x.plans)), t: Date.now() }
      if (r.etat === 'nouvelle') r.etat = 'preparee'
      await sauver(b)
      return rep(res, 200, { revision: r }), true
    }
    if (req.method === 'POST' && url === '/revisions/maj') {
      if (['nouvelle', 'preparee', 'en_cours', 'refusee'].includes(x.etat)) r.etat = x.etat
      if (x.execution) r.execution = String(x.execution).slice(0, 80)
      if (Array.isArray(x.plans)) r.plans_lances = x.plans.slice(0, 8)
      if (x.note != null) r.note = String(x.note).slice(0, 1000)
      await sauver(b)
      return rep(res, 200, { revision: r }), true
    }
    if (req.method === 'POST' && url === '/revisions/livrer') {
      await livrerDansAdboard(b, r)
      r.etat = 'livree'; r.livree_t = Date.now()
      await sauver(b)
      console.log('🩹 Rectification livrée : commande ' + b.id + ' vidéo ' + r.index + (r.livree_t > r.echeance ? ' (EN RETARD)' : ''))
      return rep(res, 200, { revision: r }), true
    }
    return rep(res, 404, { error: 'route inconnue' }), true
  } catch (e) {
    console.error('[Rectifications/Budget] ' + e.message)
    return rep(res, 500, { error: e.message }), true
  }
}

// ── rappel unique quand une rectification n'est pas livrée 6 h avant l'échéance ──
async function cron() {
  try {
    const d = deps(), l = await d.loadBriefs(), now = Date.now()
    for (const b of l) {
      const rs = Array.isArray(b.revisions) ? b.revisions : []
      const aRappeler = rs.filter((r) => r && !['livree', 'refusee'].includes(r.etat) && !r.rappel && now > r.echeance - 6 * 3600000)
      if (!aRappeler.length) continue
      aRappeler.forEach((r) => { r.rappel = now })
      await sauver(b)
      await d.notifierAdmin('⏰ Rectification à livrer — ' + nomDe(b), `<p>${aRappeler.length} rectification(s) de « ${esc(nomDe(b))} » à livrer avant le <b>${dateFr(Math.min(...aRappeler.map((r) => r.echeance)))}</b>.</p><p><a href="${FACTORY}${encodeURIComponent(b.id)}">Ouvrir dans Factory</a></p>`)
    }
  } catch (e) { console.log('[Rectifications] rappel : ' + e.message) }
}

module.exports = { brancher, routes, cron, budgetVideo, etatBudget, coutCommande, periodeClient, lireIdCreative, REVISION_MAX_USD }
