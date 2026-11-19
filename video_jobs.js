// v10 : + plan des niveaux de conscience, arrêt réel (/video-jobs/cancel), état de la machine, routes Creative Image v10.
// Module Render : lance et suit les productions vidéo sur Google Cloud Run (job « video-adstack »),
// et choisit automatiquement les CT vidéo d'une commande. Accroché dans serveur.js par une seule ligne :
//   if (await require('./video_jobs')(req, res, { getToken, callGeminiPro, MODELES, SA })) return;
// Routes : GET /video-jobs/diag · POST /video-jobs/start · GET /video-jobs/status · POST /video/select-cts
const PROJET = () => process.env.VIDEO_PROJECT || ''
const REGION = () => process.env.VIDEO_REGION || 'us-central1'
const JOB = () => process.env.VIDEO_JOB || 'video-adstack'
const PUB = () => (process.env.R2_PUBLIC_BASE || 'https://images.adstackofficial.com').replace(/\/$/, '')
const lire = (req, max = 400000) => new Promise((ok, ko) => { let b = ''; req.on('data', (d) => { b += d; if (b.length > max) { req.destroy(); ko(new Error('corps trop gros')) } }); req.on('end', () => ok(b)); req.on('error', ko) })
const rep = (res, code, o) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(o)) }
const recents = new Map()            // anti double-clic : même vidéo relancée en moins de 10 minutes
const verifs = new Map()             // dernier contrôle de l'exécution Cloud Run (au plus toutes les 30 s)

async function api(deps, method, url, body) {
  const token = await deps.getToken()
  const r = await fetch(url, { method, headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined })
  const t = await r.text(); let d; try { d = JSON.parse(t) } catch (_) { d = { raw: t.slice(0, 300) } }
  return { ok: r.ok, status: r.status, d }
}
const base = (deps) => {
  const p = PROJET() || (deps.SA && deps.SA.project_id) || ''
  return `https://run.googleapis.com/v2/projects/${p}/locations/${REGION()}/jobs/${JOB()}`
}

const SYSTEME_SELECTION = `Tu es le directeur de création vidéo d'AdStack. Une commande client doit recevoir {{N}} vidéos publicitaires (format UGC, Meta Ads), chacune construite sur un Creative Template (CT) vidéo de la galerie. Tu choisis les CT.
RÈGLES
1. Les CT choisis doivent être DIFFÉRENTS entre eux par la structure et le ressenti (pas deux CT du même type de scénario, pas deux fois la même ouverture, pas la même chute), et chacun sert un ANGLE différent de la commande quand il y a assez d'angles.
2. Compatibilité produit d'abord : le geste du produit doit être montrable à l'écran, dans un lieu cohérent. Écarte tout CT dont « lieux_interdits » ou « produit_compatible » contredit le produit ou son usage réel.
3. Niveau de conscience : respecte-le s'il est imposé pour l'angle ; sinon vise la meilleure adéquation avec la synthèse de marché (persona, douleur, preuve, objection principale).
4. Durée : préfère des CT dont la durée tient dans le budget de production (≈ 30 à 50 secondes). Un CT très long ne se choisit que s'il est nettement meilleur pour l'angle.
5. Cherche le potentiel de conversion : hook fort pour CET angle, chute qui déclenche l'achat, preuve visible.
RÉPONSE : uniquement un objet JSON, sans texte autour :
{"choix":[{"id":"<id exact du CT>","angle":"<titre exact de l'angle servi>","raison":"<2 phrases : pourquoi ce CT pour cet angle, en quoi il diffère des autres>"}]}`

const SYSTEME_PLAN = `Tu es le directeur de création vidéo d'AdStack. Une commande reçoit {{N}} angles marketing ; chaque angle produit 3 créatives : 1 VIDÉO (UGC, Meta Ads) + 2 IMAGES. Tu décides, pour chaque angle :
(a) son PARCOURS de niveaux de conscience — exactement l'un des deux :
    "A" = Problem Aware → Solution Aware → Product Aware (le marché ignore encore le problème ou la solution)
    "B" = Solution Aware → Product Aware → Most Aware (le marché connaît la solution, il faut convertir)
(b) le NIVEAU porté par la VIDÉO (un des 3 niveaux du parcours ; les 2 images prennent les 2 autres) ;
(c) le CT vidéo de la galerie qui fait la meilleure vidéo à ce niveau pour cet angle.
RÈGLES
1. Sur toute la commande, il faut au moins une créative Solution Aware, une Product Aware et une Most Aware : AU MOINS UN angle suit le parcours B.
2. Choisis le parcours d'après la synthèse (maturité de la cible, ce qu'elle sait déjà, objections) : ne mets "A" que si une partie réelle de la cible ignore encore le problème ou sa solution.
3. Le CT vidéo doit être balisé au niveau que porte la vidéo (champ conscience), sinon le plus proche. Les CT choisis sont TOUS DIFFÉRENTS entre eux par la structure et le ressenti (pas la même ouverture, pas la même chute).
4. Compatibilité produit : le geste du produit doit être montrable à l'écran dans un lieu cohérent ; écarte tout CT dont « lieux_interdits » ou « produit_compatible » contredit le produit.
5. Durée : préfère des CT de 30 à 50 secondes.
6. DIVERSITÉ VISUELLE DU LOT (impérative) : pour chaque vidéo, fixe une DIRECTION qui la rend visuellement et techniquement différente des autres vidéos du lot : casting (âge, allure, coiffure — tous de la cible et du pays de la synthèse), lieux (le lieu où le produit sert + les autres lieux de sa journée que le dispositif du CT demande), tenue (ce que cette personne porte vraiment à ce moment, jamais de peignoir en satin ni de cliché publicitaire), lumière (UNIQUEMENT une lumière naturelle réelle du lieu : fenêtre de jour, plafonnier d'une salle de bain, ciel couvert, plein jour dehors — jamais « fin de journée », « tons orangés », heure dorée, bougies, lampes d'ambiance ni ambiance chaude ou intimiste : la couleur de l'image reste neutre, comme un rendu brut de téléphone ; si le CT a une lumière, tu la suis), cadrage dominant. Deux vidéos ne partagent ni le casting, ni la tenue, ni le lieu principal, ni la pièce éclairée ; leur différence vient de la personne, du lieu et du cadrage, jamais d'une teinte. Le choix de CT lui-même doit déjà être divers : formats et dispositifs différents (face caméra, plans de vie, démonstration, extérieur…).
7. DIVERSITÉ DE RENDU ET DE VOIX (v11b-diversite, impérative dès 2 vidéos) : le lot ne doit jamais être une série de vidéos du même genre. D'après « style », « blocs » et la description de chaque CT : (a) RENDU — si la galerie contient un CT animé ou stylisé (3D, dessin animé, illustration, motion design) compatible avec le produit, au moins UNE vidéo du lot le prend et au moins une reste en prise de vue réelle ; sur 4 vidéos, pas plus de 2 du même rendu si la galerie le permet. (b) VOIX — au moins une vidéo où une personne parle face caméra ET au moins une en voix off (narrateur hors champ) ou en texte/musique, si la galerie le permet ; jamais toutes les vidéos avec le même mode de voix. (c) RYTHME — mélange un CT rapide (coupes courtes) et un CT posé. Tu ne sacrifies pas la règle 3 (niveau) ni la règle 4 (compatibilité) : à qualité égale, tu prends le CT qui élargit la palette du lot. Dis dans « raison » le rendu et le mode de voix du CT choisi.
RÉPONSE : uniquement un objet JSON, sans texte autour :
{"choix":[{"angle":"<titre exact de l'angle>","parcours":"A"|"B","niveau_video":"Problem Aware|Solution Aware|Product Aware|Most Aware","id":"<id exact du CT>","raison":"<2 phrases : pourquoi ce parcours et ce CT pour cet angle>","direction":{"casting":"…","lieux":"…","tenue":"…","lumiere":"…","cadrage":"…"}}]}`

async function handle(req, res, deps) {
  const url = (req.url || '').split('?')[0]
  if (url === '/production/dossier') return require('./dossier')(req, res)
  if (url === '/creative-prod-v10' || url === '/creative-qa') return require('./creative_v10')(req, res, deps)
  if (!url.startsWith('/video-jobs/') && url !== '/video/select-cts') return false
  try {
    // ── diagnostic : qui est le compte du serveur, et peut-il lancer le job ? ──
    if (req.method === 'GET' && url === '/video-jobs/diag') {
      const sa = (deps.SA && deps.SA.client_email) || ''
      const projet = PROJET() || (deps.SA && deps.SA.project_id) || ''
      const out = { compte_serveur: sa, projet, region: REGION(), job: JOB(), peut_lancer: false }
      try { const r = await api(deps, 'GET', base(deps)); out.http = r.status; out.peut_lancer = r.ok; if (!r.ok) out.erreur = (r.d.error && r.d.error.message) || r.d.raw || '' ; else out.image = (((r.d.template || {}).template || {}).containers || [{}])[0].image } catch (e) { out.erreur = e.message }
      if (!out.peut_lancer && sa) out.commande_autorisation = `gcloud projects add-iam-policy-binding ${projet} --member="serviceAccount:${sa}" --role="roles/run.developer"`
      return rep(res, 200, out), true
    }
    // ── lancement d'une vidéo ──
    if (req.method === 'POST' && url === '/video-jobs/start') {
      const b = JSON.parse((await lire(req)) || '{}')
      const cmd = String(b.commande_id || ''), ct = String(b.ct_id || ''), slot = String(parseInt(b.slot, 10) || 1)
      if (!/^[A-Za-z0-9\-]{8,60}$/.test(cmd)) return rep(res, 400, { error: 'commande_id invalide' }), true
      if (!/^[A-Za-z0-9_\-]{1,60}$/.test(ct)) return rep(res, 400, { error: 'ct_id invalide' }), true
      const cle = cmd + '|' + slot, deja = recents.get(cle)
      if (deja && Date.now() - deja.t < 600000 && !b.forcer) return rep(res, 200, { execution: deja.execution, deja_lance: true }), true
      const env = [{ name: 'COMMANDE_ID', value: cmd }, { name: 'CT_ID', value: ct }, { name: 'SLOT', value: slot }]
      if (b.angle) env.push({ name: 'ANGLE', value: String(b.angle).slice(0, 300) })
      if (b.consignes) env.push({ name: 'CONSIGNES', value: String(b.consignes).slice(0, 7000) })
      if (b.modele && /^veo-[\w.\-]+$/.test(b.modele)) env.push({ name: 'MODELE', value: b.modele })
      if (b.niveau && /^(Problem|Solution|Product|Most) Aware$/.test(b.niveau)) env.push({ name: 'NIVEAU', value: b.niveau })
      const r = await api(deps, 'POST', base(deps) + ':run', { overrides: { containerOverrides: [{ env }], taskCount: 1 } })
      if (!r.ok) return rep(res, 502, { error: 'Cloud Run a refusé le lancement : ' + ((r.d.error && r.d.error.message) || r.status), http: r.status }), true
      const nom = (((r.d.metadata || {}).name) || '').split('/').pop() || ''
      recents.set(cle, { t: Date.now(), execution: nom })
      console.log('🎬 VIDEO-JOB lancé : commande ' + cmd + ' slot ' + slot + ' CT ' + ct + ' → ' + nom)
      return rep(res, 200, { execution: nom }), true
    }
    // ── arrêt réel d'une vidéo (bouton Annuler de Factory) ──
    if (req.method === 'POST' && url === '/video-jobs/cancel') {
      const b = JSON.parse((await lire(req)) || '{}')
      const ex = String(b.execution || '').replace(/[^\w\-]/g, '')
      if (!ex) return rep(res, 400, { error: 'execution requise' }), true
      const r = await api(deps, 'POST', base(deps) + '/executions/' + ex + ':cancel', {})
      console.log('⏹ VIDEO-JOB arrêté : ' + ex + ' (HTTP ' + r.status + ')')
      for (const [k, x] of recents) if (x.execution === ex) recents.delete(k)
      return rep(res, r.ok ? 200 : 502, r.ok ? { ok: true } : { error: (r.d.error && r.d.error.message) || 'HTTP ' + r.status }), true
    }
    // ── avancement d'une vidéo (fichier d'état écrit par la machine sur R2, relayé ici : pas de souci CORS) ──
    if (req.method === 'GET' && url === '/video-jobs/status') {
      const q = new URL(req.url, 'http://x').searchParams
      const cmd = (q.get('commande_id') || '').replace(/[^\w\-]/g, '').slice(0, 40), slot = String(parseInt(q.get('slot'), 10) || 1), ex = (q.get('execution') || '').replace(/[^\w\-]/g, '')
      let etat = null
      try { const r = await fetch(`${PUB()}/ct-video/productions/${cmd}_s${slot}.json?t=${Date.now()}`); if (r.ok) etat = await r.json() } catch (_) { }
      if (etat && ex && etat.execution && etat.execution !== ex) etat = null          // fichier d'une exécution plus ancienne
      if (!etat) etat = { etat: 'demarrage', etape: 'La machine démarre', pct: 1, journal: [] }
      if (etat.etat !== 'termine' && etat.etat !== 'echec' && ex) {                  // état de la machine vu par Cloud Run (au plus toutes les 30 s)
        const v = verifs.get(ex)
        if (!v || Date.now() - v.t > 30000) {
          const r = await api(deps, 'GET', base(deps) + '/executions/' + ex).catch(() => null)
          const d = r && r.ok ? r.d : null
          const cond = d && Array.isArray(d.conditions) ? d.conditions : []
          const att = cond.find((c) => c.state === 'CONDITION_FAILED' || c.state === 'CONDITION_PENDING')
          verifs.set(ex, { t: Date.now(), d: d ? {
            en_cours: Number(d.runningCount || 0), echouee: Number(d.failedCount || 0), annulee: Number(d.cancelledCount || 0), reussie: Number(d.succeededCount || 0),
            fini: !!d.completionTime, cree: d.createTime || null, demarre: d.startTime || null, journal: d.logUri || null,
            attente: att ? String(att.message || att.type || '').slice(0, 200) : null } : null })
        }
        const m = (verifs.get(ex) || {}).d
        if (m) {
          etat = Object.assign({}, etat, { machine: m })
          if (m.fini && m.echouee) etat = Object.assign(etat, { etat: 'echec', erreur: etat.erreur || 'La machine vidéo s\'est arrêtée avant la fin (mémoire ou délai dépassé). Journal : ' + (m.journal || 'Cloud Run') })
          else if (m.fini && m.annulee) etat = Object.assign(etat, { etat: 'echec', erreur: 'Machine arrêtée (annulée).' })
          else if (m.fini && m.reussie) etat = Object.assign(etat, { etat: 'echec', erreur: 'La machine a terminé sans publier son état : ancien moteur vidéo installé ? La vidéo est peut-être sur R2 (ct-video/productions/). Journal : ' + (m.journal || 'Cloud Run') })
          else if (etat.etat === 'demarrage') etat = Object.assign(etat, { etape: m.en_cours ? 'Machine démarrée — premier état attendu' : m.attente ? 'En attente de Cloud Run : ' + m.attente : 'Machine en file chez Cloud Run' })
        }
      }
      return rep(res, 200, etat), true
    }
    // ── choix automatique des CT vidéo d'une commande ──
    if (req.method === 'POST' && url === '/video/select-cts') {
      const b = JSON.parse((await lire(req, 3000000)) || '{}')
      const n = Math.max(1, Math.min(4, parseInt(b.n, 10) || 2))
      const exclus = new Set((b.exclure || []).map(String))
      const cts = (Array.isArray(b.cts) ? b.cts : []).filter((c) => c && c.id && !exclus.has(String(c.id)))
      if (cts.length < 1) return rep(res, 400, { error: 'Galerie CT vidéo vide' }), true
      const angles = (Array.isArray(b.angles) ? b.angles : []).map((a) => (typeof a === 'string' ? a : (a && (a.titre || a.title || a.nom)) || '')).filter(Boolean)
      const parts = []
      parts.push({ type: 'text', text: 'PRODUIT ET BRIEF :\n' + String(b.brief || '').slice(0, 6000) })
      parts.push({ type: 'text', text: 'SYNTHÈSE DE MARCHÉ :\n' + String(b.synthese || '').slice(0, 14000) })
      parts.push({ type: 'text', text: 'ANGLES DE LA COMMANDE (un CT par angle si possible) :\n' + (angles.map((a, i) => (i + 1) + '. ' + a).join('\n') || '(aucun)') })
      if (b.niveaux) parts.push({ type: 'text', text: 'NIVEAU DE CONSCIENCE IMPOSÉ PAR ANGLE :\n' + String(b.niveaux).slice(0, 1500) })
      const f = (v) => (Array.isArray(v) ? v.join(', ') : (v == null ? '' : String(v)))
      parts.push({ type: 'text', text: '━━━ GALERIE DE CT VIDÉO : ' + cts.length + ' ━━━\n' + cts.map((c, i) => (i + 1) + '. id=' + c.id + ' | ' + (c.name || '') + ' | durée ' + (c.duree_s || '?') + ' s | niche ' + f(c.niche) + ' | conscience ' + f(c.awareness) + ' | style ' + f(c.styleTags) + ' | blocs ' + f(c.blocs) + '\n   ' + [c.meta, c.hook && ('HOOK : ' + c.hook), c.chute && ('CHUTE : ' + c.chute), c.produit_compatible && ('PRODUITS OK : ' + f(c.produit_compatible)), c.angles_fit && ('ANGLES : ' + f(c.angles_fit)), c.lieux_interdits && ('LIEUX INTERDITS : ' + f(c.lieux_interdits)), c.epic && ('EPIC : ' + f(c.epic))].filter(Boolean).join(' · ').slice(0, 900)).join('\n') })
      const plan = b.mode === 'plan'
      const raw = await deps.callGeminiPro((plan ? SYSTEME_PLAN : SYSTEME_SELECTION).replace('{{N}}', String(n)), parts, 12000, { modele: deps.MODELES.creative, temperature: 0.3, thinkingBudget: 12288, logLabel: 'Choix CT vidéo', timeoutMs: 150000, typeAppel: 'selection_ct_video' })
      const txt = String(raw || ''), d = txt.indexOf('{'), e = txt.lastIndexOf('}')
      let choix = []
      try { choix = (JSON.parse(txt.slice(d, e + 1)).choix || []) } catch (_) { }
      const ids = new Set(cts.map((c) => String(c.id))), vus = new Set()
      choix = choix.filter((c) => c && ids.has(String(c.id)) && !vus.has(String(c.id)) && vus.add(String(c.id))).slice(0, n).map((c) => ({ id: String(c.id), angle: String(c.angle || ''), parcours: String(c.parcours || ''), niveau_video: String(c.niveau_video || ''), raison: String(c.raison || '').slice(0, 500), direction: (c.direction && typeof c.direction === 'object') ? Object.fromEntries(['casting', 'lieux', 'tenue', 'lumiere', 'cadrage'].map((k) => [k, String(c.direction[k] || '').slice(0, 300)])) : null }))
      console.log('🎞 SELECT-CT-VIDEO — ' + choix.map((c) => c.id).join(', ') + ' parmi ' + cts.length)
      return rep(res, 200, { choix, complet: choix.length === n }), true
    }
    return false
  } catch (e) { console.error('✗ video_jobs', e.message); return rep(res, 500, { error: e.message }), true }
}
module.exports = handle
