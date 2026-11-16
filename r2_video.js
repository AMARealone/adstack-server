// Module Cloudflare R2 : signe des adresses temporaires d'envoi (PUT) et de suppression (DELETE).
// Les clés R2 restent dans les variables Render ; le navigateur envoie la vidéo directement à Cloudflare.
const crypto = require('crypto')
const hmac = (k, s) => crypto.createHmac('sha256', k).update(s).digest()
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex')
const enc = (s) => encodeURIComponent(s).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase())

// Signature V4 « presigned URL » (en-tête host seul, charge utile non signée).
function presign({ method, host, path, accessKey, secret, region, service = 's3', amzDate, expires = 900 }) {
  const day = amzDate.slice(0, 8), scope = `${day}/${region}/${service}/aws4_request`
  const q = { 'X-Amz-Algorithm': 'AWS4-HMAC-SHA256', 'X-Amz-Credential': `${accessKey}/${scope}`, 'X-Amz-Date': amzDate, 'X-Amz-Expires': String(expires), 'X-Amz-SignedHeaders': 'host' }
  const cq = Object.keys(q).sort().map((k) => `${enc(k)}=${enc(q[k])}`).join('&')
  const cpath = path.split('/').map((s) => enc(s)).join('/')
  const creq = [method, cpath, cq, `host:${host}\n`, 'host', 'UNSIGNED-PAYLOAD'].join('\n')
  const sts = ['AWS4-HMAC-SHA256', amzDate, scope, sha(creq)].join('\n')
  const kS = hmac(hmac(hmac(hmac('AWS4' + secret, day), region), service), 'aws4_request')
  const sig = crypto.createHmac('sha256', kS).update(sts).digest('hex')
  return { signature: sig, url: `https://${host}${cpath}?${cq}&X-Amz-Signature=${sig}` }
}

const TYPES = ['video/mp4', 'video/quicktime', 'video/webm', 'image/jpeg', 'image/png', 'image/webp', 'application/json', 'application/zip']
const lireCorps = (req) => new Promise((ok, ko) => { let b = ''; req.on('data', (d) => { b += d; if (b.length > 20000) { req.destroy(); ko(new Error('trop gros')) } }); req.on('end', () => ok(b)); req.on('error', ko) })
const rep = (res, code, o) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(o)) }

// v11 — TÉLÉCHARGEMENT DIRECT : GET /dl?u=<adresse publique du fichier>&n=<nom du fichier>. Le serveur relaie le fichier avec « Content-Disposition: attachment »
// et le nom demandé : le navigateur (ordinateur ou mobile) l'enregistre tel quel, sans ouvrir de lien, sans le charger en mémoire, sans CORS, sans zip.
// Seules les adresses de NOS fichiers sont relayées (Cloudflare R2 public, Supabase Storage) : ce n'est pas un relais ouvert.
const https = require('https')
function telechargementDirect(req, res) {
  return new Promise((ok) => {
    let u, nom
    try {
      const sp = new URL(req.url, 'http://x').searchParams
      u = new URL(sp.get('u') || '')
      nom = String(sp.get('n') || 'fichier').replace(/[\\/:*?"<>|\r\n]+/g, '_').trim().slice(0, 120) || 'fichier'
    } catch (e) { rep(res, 400, { error: 'Adresse illisible' }); return ok(true) }
    const baseHost = new URL(process.env.R2_PUBLIC_BASE || 'https://images.adstackofficial.com').host
    const permis = u.protocol === 'https:' && (u.host === baseHost || /\.supabase\.co$/i.test(u.hostname) || /\.r2\.dev$/i.test(u.hostname)) && !u.pathname.includes('..')
    if (!permis) { rep(res, 400, { error: 'Adresse refusée' }); return ok(true) }
    const ascii = nom.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\x20-\x7E]/g, '_').replace(/["\\]/g, '')
    const rq = https.get(u, { headers: { 'User-Agent': 'adstack-dl' } }, (up) => {
      if (up.statusCode !== 200) { up.resume(); rep(res, 502, { error: 'Fichier introuvable (' + up.statusCode + ')' }); return ok(true) }
      const h = { 'Content-Type': up.headers['content-type'] || 'application/octet-stream', 'Content-Disposition': `attachment; filename="${ascii}"; filename*=UTF-8''${enc(nom)}`, 'Cache-Control': 'no-store', 'Access-Control-Expose-Headers': 'Content-Disposition' }
      if (up.headers['content-length']) h['Content-Length'] = up.headers['content-length']
      res.writeHead(200, h)
      up.pipe(res)
      up.on('end', () => ok(true))
      up.on('error', () => { try { res.destroy() } catch (e) {} ok(true) })
    })
    rq.setTimeout(60000, () => rq.destroy(new Error('délai dépassé')))
    rq.on('error', (e) => { if (!res.headersSent) rep(res, 502, { error: 'Téléchargement impossible : ' + e.message }); else { try { res.destroy() } catch (e2) {} } ok(true) })
    res.on('close', () => { try { rq.destroy() } catch (e) {} })
  })
}

// Retourne true si la requête a été traitée.
async function handle(req, res) {
  const url = (req.url || '').split('?')[0]
  if (req.method === 'GET' && url === '/dl') return telechargementDirect(req, res)
  if (req.method === 'GET' && url === '/r2/ping') {
    return rep(res, 200, { ok: !!(process.env.R2_ENDPOINT && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY), bucket: process.env.R2_BUCKET || 'adstack-images' }), true
  }
  if (req.method !== 'POST' || url !== '/r2/presign') return false
  try {
    const { key, contentType, method } = JSON.parse((await lireCorps(req)) || '{}')
    const m = method === 'DELETE' ? 'DELETE' : 'PUT'
    if (typeof key !== 'string' || !/^ct-video\/[A-Za-z0-9_\-]+\/[A-Za-z0-9_.\-]+$/.test(key) || key.includes('..')) return rep(res, 400, { error: 'Clé refusée (elle doit être sous ct-video/)' }), true
    if (m === 'PUT' && !TYPES.includes(contentType)) return rep(res, 400, { error: 'Type de fichier refusé : ' + contentType }), true
    const { R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = process.env
    if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) return rep(res, 500, { error: 'Clés Cloudflare absentes côté serveur' }), true
    const bucket = process.env.R2_BUCKET || 'adstack-images'
    const host = new URL(R2_ENDPOINT).host
    const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '')
    const { url: signed } = presign({ method: m, host, path: `/${bucket}/${key}`, accessKey: R2_ACCESS_KEY_ID, secret: R2_SECRET_ACCESS_KEY, region: 'auto', amzDate, expires: 3600 })
    const base = (process.env.R2_PUBLIC_BASE || 'https://images.adstackofficial.com').replace(/\/$/, '')
    return rep(res, 200, { url: signed, publicUrl: `${base}/${key}` }), true
  } catch (e) { return rep(res, 400, { error: e.message }), true }
}
module.exports = handle
module.exports.presign = presign
