// agents-cloud-v1 (21 nov. 2026) — L'ANALYSTE, LE COPYWRITER ET L'AGENT IMAGE TOURNENT SUR GOOGLE CLOUD (décision du fondateur).
// Avant : Factory appelait Render et attendait la réponse ; une page rechargée ou Render qui redémarre (mémoire) = travail perdu, et deux analyses
// en même temps se disputaient la même petite machine. Maintenant, chaque appel lourd est une exécution du job Cloud Run « agents-adstack » :
// sa propre machine (4 Go), autant d'exécutions en parallèle que de demandes, indépendante du navigateur et de Render.
// Le job exécute EXACTEMENT le code de ce serveur : Render lui envoie son propre code (paquet chiffré sur R2, recalculé à chaque déploiement),
// ses variables d'environnement (chiffrées) et la demande. Le job démarre ce serveur chez lui, appelle la même route, range la réponse et un
// JOURNAL COMPLET (chaque ligne du serveur, horodatée, mémoire comprise) sur R2. Factory suit l'avancement et lit le journal en direct.
// Variables Render : AGENTS_CLE (64 caractères hexadécimaux, donnée par deployer.sh ; sans elle, tout reste sur Render comme avant),
// AGENTS_CLOUD (liste des agents envoyés sur Google Cloud, défaut « analyste,copywriter,image » ; « 0 » pour tout garder sur Render),
// AGENTS_JOB (défaut agents-adstack). Le compte de service de Render a déjà le droit de lancer des jobs (job vidéo).
'use strict'
const crypto = require('crypto'), fs = require('fs'), path = require('path'), zlib = require('zlib')

const ROUTES = { '/analyste-synthese': 'analyste', '/copywriter': 'copywriter', '/creative-prod': 'image', '/creative-prod-v10': 'image' }
const PROJET = (deps) => process.env.VIDEO_PROJECT || (deps.SA && deps.SA.project_id) || ''
const REGION = () => process.env.VIDEO_REGION || 'us-central1'
const JOB = () => process.env.AGENTS_JOB || 'agents-adstack'
const PUB = () => (process.env.R2_PUBLIC_BASE || 'https://images.adstackofficial.com').replace(/\/$/, '')
const cle = () => { const k = String(process.env.AGENTS_CLE || '').trim(); return /^[0-9a-f]{64}$/i.test(k) ? Buffer.from(k, 'hex') : null }
const actifs = () => { const v = String(process.env.AGENTS_CLOUD || 'analyste,copywriter,image').toLowerCase(); return v === '0' ? [] : v.split(/[\s,]+/).filter(Boolean) }
const rep = (res, code, o) => { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(o)) }
const lire = (req, max) => new Promise((ok, ko) => { const morceaux = []; let n = 0; req.on('data', (d) => { n += d.length; if (n > max) { req.destroy(); ko(new Error('corps trop gros')) } else morceaux.push(Buffer.isBuffer(d) ? d : Buffer.from(d)) }); req.on('end', () => ok(Buffer.concat(morceaux).toString('utf8'))); req.on('error', ko) })

function chiffrer(buf) {
  const iv = crypto.randomBytes(12), c = crypto.createCipheriv('aes-256-gcm', cle(), iv)
  const corps = Buffer.concat([c.update(buf), c.final()])
  return Buffer.concat([iv, c.getAuthTag(), corps])
}
async function r2Put(key, buf, type) {
  const { R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = process.env
  if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) throw new Error('clés Cloudflare R2 absentes sur Render')
  const bucket = process.env.R2_BUCKET || 'adstack-images'
  const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '')
  const url = require('./r2_video').presign({ method: 'PUT', host: new URL(R2_ENDPOINT).host, path: `/${bucket}/${key}`, accessKey: R2_ACCESS_KEY_ID, secret: R2_SECRET_ACCESS_KEY, region: 'auto', amzDate, expires: 900 }).url
  const r = await fetch(url, { method: 'PUT', headers: { 'Content-Type': type }, body: buf })
  if (!r.ok) throw new Error('R2 HTTP ' + r.status)
}
async function lireJson(key) { try { const r = await fetch(PUB() + '/' + key + '?t=' + Date.now()); if (r.ok) return await r.json() } catch (_) { } return null }

// ── le code de ce serveur, tel qu'il tourne sur Render (calculé une fois par démarrage de Render, donc à chaque déploiement) ──
let _code = null
async function paquetCode() {
  if (_code) return _code
  const racine = __dirname, fichiers = {}
  const marcher = (d, rel) => {
    for (const n of fs.readdirSync(d)) {
      if (n === 'node_modules' || n === '.git' || n.startsWith('.env')) continue
      const p = path.join(d, n), r = rel ? rel + '/' + n : n, st = fs.statSync(p)
      if (st.isDirectory()) marcher(p, r)
      else if (st.size <= 4 * 1024 * 1024) fichiers[r] = fs.readFileSync(p).toString('base64')
    }
  }
  marcher(racine, '')
  const brut = zlib.gzipSync(Buffer.from(JSON.stringify(fichiers)))
  const hash = crypto.createHash('sha256').update(brut).digest('hex').slice(0, 16)
  const key = 'agents/code/' + hash + '.bin'
  const deja = await fetch(PUB() + '/' + key, { method: 'HEAD' }).then((r) => r.ok).catch(() => false)
  if (!deja) await r2Put(key, chiffrer(brut), 'application/octet-stream')
  _code = { key, hash, fichiers: Object.keys(fichiers).length, octets: brut.length }
  console.log(`☁️  AGENTS CLOUD : code du serveur empaqueté pour Google Cloud (${_code.fichiers} fichiers, ${Math.round(brut.length / 1024)} Ko, ${hash})`)
  return _code
}
// ── les variables d'environnement de Render, sauf celles propres à la machine ──
function envServeur() {
  const non = /^(PATH|HOME|HOSTNAME|PWD|OLDPWD|SHLVL|TERM|_|PORT|NODE_VERSION|YARN_VERSION|NODE_OPTIONS|LANG|LC_.*|RENDER.*|IS_PULL_REQUEST|K_.*|CLOUD_RUN_.*|AGENT_ID|AGENTS_CLE)$/
  const e = {}; Object.keys(process.env).forEach((k) => { if (!non.test(k)) e[k] = process.env[k] }); return e
}
async function api(deps, method, url, body) {
  const token = await deps.getToken()
  const r = await fetch(url, { method, headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined })
  const t = await r.text(); let d; try { d = JSON.parse(t) } catch (_) { d = { raw: t.slice(0, 300) } }
  return { ok: r.ok, status: r.status, d }
}
const base = (deps) => `https://run.googleapis.com/v2/projects/${PROJET(deps)}/locations/${REGION()}/jobs/${JOB()}`

// ── liste des derniers passages (pour Factory et pour relire un journal plus tard) ──
const IDX = 'agents/index.json'
let idxChaine = Promise.resolve(), idxCache = null
async function lireIndex() { const j = await lireJson(IDX); if (Array.isArray(j)) idxCache = j; return idxCache || [] }
function majIndex(f) { idxChaine = idxChaine.catch(() => { }).then(async () => { const l = await lireIndex(); const n = (f(l.slice()) || l).slice(0, 150); idxCache = n; await r2Put(IDX, Buffer.from(JSON.stringify(n)), 'application/json') }).catch((e) => console.log('☁️  index des agents non mis à jour : ' + e.message)); return idxChaine }
const verifs = new Map(), clos = new Set()

module.exports = async function agentsJobs(req, res, deps) {
  const url = (req.url || '').split('?')[0]
  if (!url.startsWith('/agents-jobs/')) return false
  try {
    // ── lancer un agent sur Google Cloud (ou dire à Factory de l'appeler sur Render comme avant) ──
    if (req.method === 'POST' && url === '/agents-jobs/start') {
      const b = JSON.parse((await lire(req, 60 * 1024 * 1024)) || '{}')
      const route = String(b.route || ''), agent = ROUTES[route]
      if (!agent) return rep(res, 400, { error: 'route non prise en charge : ' + route }), true
      if (!cle()) return rep(res, 200, { repli: true, raison: 'AGENTS_CLE absente sur Render : l\'agent tourne sur Render' }), true
      if (!actifs().includes(agent)) return rep(res, 200, { repli: true, raison: 'agent « ' + agent + ' » gardé sur Render (AGENTS_CLOUD)' }), true
      const code = await paquetCode()
      const id = 'ag_' + Date.now().toString(36) + crypto.randomBytes(4).toString('hex')
      const etiquette = String(b.etiquette || agent).slice(0, 160)
      const paquet = { id, route, agent, etiquette, corps: b.corps || {}, env: envServeur(), code: { key: code.key, hash: code.hash }, cree: Date.now() }
      await r2Put('agents/entrees/' + id + '.bin', chiffrer(Buffer.from(JSON.stringify(paquet))), 'application/octet-stream')
      await r2Put('agents/etats/' + id + '.json', Buffer.from(JSON.stringify({ id, agent, route, etiquette, etat: 'lance', etape: 'Machine Google Cloud demandée', debut: new Date().toISOString(), journal: [] })), 'application/json')
      const r = await api(deps, 'POST', base(deps) + ':run', { overrides: { containerOverrides: [{ env: [{ name: 'AGENT_ID', value: id }] }], taskCount: 1 } })
      if (!r.ok) {
        const msg = (r.d.error && r.d.error.message) || ('HTTP ' + r.status)
        console.log('☁️  AGENTS CLOUD : lancement refusé (' + msg + ') → ' + agent + ' tourne sur Render.')
        return rep(res, 200, { repli: true, raison: 'Google Cloud a refusé le lancement (' + String(msg).slice(0, 200) + ') : l\'agent tourne sur Render' }), true
      }
      const execution = (((r.d.metadata || {}).name) || '').split('/').pop() || ''
      console.log(`☁️  AGENT ${agent.toUpperCase()} lancé sur Google Cloud : ${etiquette} → ${id} (${execution})`)
      majIndex((l) => [{ id, agent, route, etiquette, execution, t: Date.now(), etat: 'lance' }, ...l.filter((x) => x.id !== id)])
      return rep(res, 200, { id, execution, agent }), true
    }
    // ── journal complet en FICHIER téléchargeable (journal-agent-<agent>-<id>.txt) ──
    if (req.method === 'GET' && url === '/agents-jobs/journal') {
      const id = (new URL(req.url, 'http://x').searchParams.get('id') || '').replace(/[^\w]/g, '')
      if (!id) return rep(res, 400, { error: 'id manquant' }), true
      const r = await fetch(PUB() + '/agents/journaux/' + id + '.txt?t=' + Date.now())
      if (!r.ok) return rep(res, 404, { error: 'journal introuvable (la machine ne l\'a pas encore publié)' }), true
      const txt = Buffer.from(await r.arrayBuffer())
      const agent = ((String(txt.subarray(0, 200)).match(/JOURNAL DE L'AGENT (\w+)/) || [])[1] || 'agent').toLowerCase()
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Content-Disposition': `attachment; filename="journal-${agent}-${id}.txt"`, 'Cache-Control': 'no-store' })
      res.end(txt); return true
    }
    // ── avancement + journal en direct ──
    if (req.method === 'GET' && url === '/agents-jobs/status') {
      const id = (new URL(req.url, 'http://x').searchParams.get('id') || '').replace(/[^\w]/g, '')
      if (!id) return rep(res, 400, { error: 'id requis' }), true
      let e = (await lireJson('agents/etats/' + id + '.json')) || { id, etat: 'lance', etape: 'Machine Google Cloud demandée', journal: [] }
      const fini = e.etat === 'termine' || e.etat === 'echec'
      const ex = (idxCache || []).find((x) => x.id === id) || ((await lireIndex()).find((x) => x.id === id)) || {}
      if (!fini && ex.execution) {   // la machine vue par Cloud Run (au plus toutes les 30 s) : un plantage se voit même si le job n'a rien pu écrire
        const v = verifs.get(id)
        if (!v || Date.now() - v.t > 30000) {
          const r = await api(deps, 'GET', base(deps) + '/executions/' + ex.execution).catch(() => null)
          const d = r && r.ok ? r.d : null
          verifs.set(id, { t: Date.now(), d: d ? { fini: !!d.completionTime, echouee: Number(d.failedCount || 0), annulee: Number(d.cancelledCount || 0), en_cours: Number(d.runningCount || 0), journal: d.logUri || null } : null })
        }
        const m = (verifs.get(id) || {}).d
        if (m && m.fini && (m.echouee || m.annulee)) e = Object.assign({}, e, { etat: 'echec', erreur: e.erreur || (m.annulee ? 'Machine arrêtée.' : 'La machine Google Cloud s\'est arrêtée avant la fin. Journal Google : ' + (m.journal || '?')) })
        else if (m && e.etat === 'lance') e = Object.assign({}, e, { etape: m.en_cours ? 'Machine démarrée, chargement du serveur' : 'En file chez Google Cloud' })
      }
      if ((e.etat === 'termine' || e.etat === 'echec') && !clos.has(id)) { clos.add(id); const fin = e; majIndex((l) => l.map((x) => (x.id === id ? Object.assign(x, { etat: fin.etat, duree_s: fin.duree_s || null, code: fin.code || null, journal_url: fin.journal_url || null, erreur: fin.erreur || null }) : x))); console.log(`☁️  AGENT ${String(e.agent || ex.agent || '').toUpperCase()} ${e.etat === 'termine' ? 'terminé' : 'en échec'} : ${id}${e.duree_s ? ' en ' + e.duree_s + ' s' : ''}${e.erreur ? ' — ' + e.erreur : ''}`) }
      return rep(res, 200, e), true
    }
    // ── la réponse de la route, telle que Render l'aurait donnée ──
    if (req.method === 'GET' && url === '/agents-jobs/resultat') {
      const id = (new URL(req.url, 'http://x').searchParams.get('id') || '').replace(/[^\w]/g, '')
      const r = await fetch(PUB() + '/agents/resultats/' + id + '.json?t=' + Date.now())
      if (!r.ok) return rep(res, 404, { error: 'résultat introuvable' }), true
      const j = await r.json()
      res.writeHead(Number(j.code) || 200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(String(j.corps || '{}')); return true
    }
    if (req.method === 'POST' && url === '/agents-jobs/cancel') {
      const b = JSON.parse((await lire(req, 20000)) || '{}'), id = String(b.id || '').replace(/[^\w]/g, '')
      const ex = ((await lireIndex()).find((x) => x.id === id) || {}).execution
      if (!ex) return rep(res, 404, { error: 'passage introuvable' }), true
      const r = await api(deps, 'POST', base(deps) + '/executions/' + ex + ':cancel', {})
      console.log('☁️  AGENT arrêté : ' + id + ' (HTTP ' + r.status + ')')
      return rep(res, r.ok ? 200 : 502, r.ok ? { ok: true } : { error: 'HTTP ' + r.status }), true
    }
    if (req.method === 'GET' && url === '/agents-jobs/liste') return rep(res, 200, { passages: (await lireIndex()).slice(0, 60), cloud: !!cle(), agents_sur_google_cloud: cle() ? actifs() : [] }), true
    return rep(res, 404, { error: 'route inconnue' }), true
  } catch (e) { return rep(res, 500, { error: e.message }), true }
}
module.exports.ROUTES = ROUTES
