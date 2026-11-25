// auto-prod-v1 (19 nov. 2026) — PRODUCTION AUTOMATIQUE D'UNE COMMANDE, SANS NAVIGATEUR OUVERT.
// Décision du fondateur :
//   offre 48 h (PERF+, ONE SHOT) : 12 h d'attente (le client peut annuler) → production → envoi au client 36 h pile après la demande ;
//   offre 24 h (GROWTH, SCALE)   :  6 h d'attente → production → envoi 18 h après la demande.
// À la fin de l'attente, un « ouvrier » (job Cloud Run « factory-auto ») ouvre Factory avec une session administrateur, charge la
// commande et lance exactement la même production que le bouton de Factory. Tout est rangé dans la carte de la commande.
// Le fondateur est prévenu dès que le lot est prêt ; il vérifie, régénère ce qu'il veut, envoie quand il veut.
// L'ENVOI AUTOMATIQUE EST ÉTEINT PAR DÉFAUT (variable Render AUTO_ENVOI=1 pour l'allumer) : à l'heure dite, sans elle, c'est un rappel.
// Variables Render : AUTO_PROD_SECRET (obligatoire pour l'ouvrier), FACTORY_JOB (défaut factory-auto), AUTO_PROD=0 (coupe la production auto).
// Branché dans serveur.js : routes() dans le routeur, cron() dans /cron/check-pending.
const crypto = require('crypto')
const H = (n) => n * 3600000
const SECRET = () => process.env.AUTO_PROD_SECRET || ''
const prodActive = () => !!SECRET() && process.env.AUTO_PROD !== '0'
const envoiAuto = () => process.env.AUTO_ENVOI === '1'
const FACTORY = 'https://www.adstackofficial.com/factory'
const lire = (req, max = 200000) => new Promise((ok, ko) => { let b = ''; req.setEncoding('utf8'); req.on('data', (d) => { b += d; if (b.length > max) { req.destroy(); ko(new Error('corps trop gros')) } }); req.on('end', () => ok(b)); req.on('error', ko) })
const rep = (res, code, o) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(o)) }
const egal = (a, b) => { const x = Buffer.from(String(a || '')), y = Buffer.from(String(b || '')); return x.length === y.length && x.length > 0 && crypto.timingSafeEqual(x, y) }
const nomDe = (b) => String((b.product && b.product.nom) || b.produit || 'produit').slice(0, 80)
const heure = (ms) => new Date(ms).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' UTC'

function calendrier(delaiH) { const d = delaiH === 24 ? 24 : 48; return { delai_h: d, attente_h: d / 4, envoi_h: d * 3 / 4 } }
async function delaiPour(b, deps) {
  try {
    const uid = b.client && b.client.user_id; if (!uid) return 48
    const r = await fetch(`${deps.SB}/rest/v1/subscriptions?user_id=eq.${encodeURIComponent(uid)}&select=plan,type&order=started_at.desc&limit=1`, { headers: deps.entetes() })
    const s = ((await r.json()) || [])[0]
    if (!s || s.type === 'pack' || !deps.OFFERS[s.plan]) return 48
    return /24/.test(String(deps.OFFERS[s.plan].monthly.delivery || '')) ? 24 : 48
  } catch (_) { return 48 }
}
// Écriture sûre : la commande est relue juste avant, seul le champ « auto » (et « dossiers ») est modifié — Factory sauvegarde les livrables en parallèle.
async function majAuto(id, deps, fn) {
  const frais = (await deps.loadBriefs(id) || []).find((x) => x.id === id)
  if (!frais) return null
  frais.auto = frais.auto || {}
  fn(frais.auto, frais)
  await deps.saveBriefs([frais])
  return frais
}
async function lancerOuvrier(b, deps) {
  if (!SECRET()) throw new Error('AUTO_PROD_SECRET absente sur Render')
  const projet = process.env.VIDEO_PROJECT || (deps.SA && deps.SA.project_id) || ''
  const region = process.env.VIDEO_REGION || 'us-central1', job = process.env.FACTORY_JOB || 'factory-auto'
  const jeton = crypto.randomBytes(18).toString('hex')
  const token = await deps.getToken()
  const r = await fetch(`https://run.googleapis.com/v2/projects/${projet}/locations/${region}/jobs/${job}:run`, {
    method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ overrides: { containerOverrides: [{ env: [{ name: 'COMMANDE_ID', value: b.id }, { name: 'JETON', value: jeton }] }], taskCount: 1 } }),
  })
  const d = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error('Cloud Run a refusé le lancement : ' + ((d.error && d.error.message) || r.status))
  return { execution: (((d.metadata || {}).name) || '').split('/').pop() || '', jeton }
}
const lien = (id) => `<p><a href="${FACTORY}/production?cmd=${encodeURIComponent(id)}" style="color:#5B8DEF;">Ouvrir la commande dans Factory →</a></p>`

// ── Passage régulier (toutes les 30 à 60 min, depuis /cron/check-pending) ──
// auto-prod-v2 : deux déclencheurs (le minuteur interne du serveur et cron-job.org) peuvent tomber en même temps ;
// un seul passage à la fois, sinon la même commande pourrait être lancée deux fois.
let passageEnCours = false
// alertes-sobres-v1 (24 nov. 2026) — fondateur : « 2 ou 3 alertes au maximum, pas toutes les 10 minutes ». Le suivi « auto » n'était pas écrit en base
// (corrigé dans saveBriefs) ; en plus, ce garde en mémoire plafonne chaque alerte et chaque lancement même si la base ne garde pas l'état.
const memo = new Map()   // « id|genre » → { n, t }
const deja = (id, genre) => memo.get(id + '|' + genre) || { n: 0, t: 0 }
const note = (id, genre) => { const x = deja(id, genre); memo.set(id + '|' + genre, { n: x.n + 1, t: Date.now() }) }
const RAPPELS_ENVOI_MAX = 3
// file-attente-v1 (24 nov. 2026) — fondateur : « il faut un système de queue pour bien gérer chacune de ces demandes ». Un client (Afrimall) a déposé
// 4 commandes presque en même temps : sans file, 3 ouvriers seraient partis à la même minute (appels Google en rafale, budget du mois lu par 3 lots
// à la fois). Désormais les productions automatiques passent UNE PAR UNE, la plus ancienne demande d'abord.
//   · une production « occupe » la file de son lancement jusqu'à son rapport (prête, incomplète, échec), ou au plus AUTO_FILE_LIMITE_H heures
//     (défaut 8) si l'ouvrier ne donne plus de nouvelles : la file ne reste jamais bloquée ;
//   · la promesse client passe avant la file : une commande qui a déjà attendu la moitié du temps entre la fin de l'attente et l'heure d'envoi
//     part quoi qu'il arrive ;
//   · dès qu'une production se termine, la suivante est lancée dans la minute (sans attendre le passage des 15 min).
// Variables Render : AUTO_FILE_MAX (productions simultanées, défaut 1), AUTO_FILE_LIMITE_H (défaut 8).
const FILE_MAX = () => Math.max(1, Number(process.env.AUTO_FILE_MAX) || 1)
const FILE_LIMITE_H = () => Math.max(1, Number(process.env.AUTO_FILE_LIMITE_H) || 8)
function occupeLaFile(b, now) {
  const a = b.auto || {}
  if (!a.lancee_le || a.prete_le || a.etat === 'echec') return false
  if (b.status !== 'pending' && b.status !== 'in_production') return false
  return now - new Date(a.lancee_le).getTime() < H(FILE_LIMITE_H())
}
async function cron(deps) {
  if (passageEnCours) { console.log('[Auto-prod] passage déjà en cours, celui-ci est ignoré'); return { ignore: true } }
  passageEnCours = true
  try { return await cron0(deps) } finally { passageEnCours = false }
}
async function cron0(deps) {
  const bilan = { lancees: 0, rappels: 0, envoyees: 0, alertes: 0, en_file: 0 }
  const now = Date.now()
  const briefs = (await deps.loadBriefs() || []).slice().sort((x, y) => new Date(x.created_at).getTime() - new Date(y.created_at).getTime())   // file-attente-v1 : la plus ancienne demande d'abord
  let enCours = briefs.filter((b) => occupeLaFile(b, now)).length
  let rang = 0
  for (const b of briefs) {
    try {
      if (b.status !== 'pending' && b.status !== 'in_production') continue
      const age = now - new Date(b.created_at).getTime()
      if (!(age >= 0) || age > H(24 * 12)) continue                    // commande trop ancienne : on ne touche à rien
      let a = b.auto || {}
      if (!a.delai_h) { const c = calendrier(await delaiPour(b, deps)); const f = await majAuto(b.id, deps, (x) => Object.assign(x, c)); a = (f && f.auto) || Object.assign(a, c) }
      const infos = `<p>Client : ${(b.client && b.client.email) || 'email non renseigné'} — ${b.quantity} créatives · offre ${a.delai_h} h</p><p style="color:#888;font-size:12px">Demande reçue le ${heure(new Date(b.created_at).getTime())} · envoi prévu le ${heure(new Date(b.created_at).getTime() + H(a.envoi_h))} · id ${b.id}</p>`

      // 1. Fin de l'attente : la production démarre (ou, sans ouvrier, le fondateur est prévenu comme avant)
      if (b.status === 'pending' && age >= H(a.attente_h) && !a.lancee_le && !a.alerte_attente && !deja(b.id, 'attente').n) {
        if (prodActive()) {
          // file-attente-v1 : une autre production tourne → cette commande attend son tour (sauf si l'heure d'envoi promise approche)
          const urgente = age >= H(a.attente_h + (a.envoi_h - a.attente_h) / 2)
          if (enCours >= FILE_MAX() && !urgente) {
            rang++; bilan.en_file++
            if (a.en_file !== rang) await majAuto(b.id, deps, (x) => { x.en_file = rang; x.en_file_depuis = x.en_file_depuis || new Date().toISOString() })
            console.log(`[Auto-prod] file d'attente : ${nomDe(b)} n° ${rang} (${enCours} production(s) en cours)`)
            continue
          }
          if (enCours >= FILE_MAX()) console.log(`[Auto-prod] ${nomDe(b)} passe devant la file : l'heure d'envoi promise approche`)
        }
        note(b.id, 'attente')
        if (prodActive()) {
          try {
            const o = await lancerOuvrier(b, deps)
            enCours++
            await majAuto(b.id, deps, (x) => { x.lancee_le = new Date().toISOString(); x.execution = o.execution; x.jeton = o.jeton; x.etat = 'lancee'; delete x.en_file })
            bilan.lancees++; console.log('🏭 AUTO-PROD lancée : ' + b.id + ' → ' + o.execution)
          } catch (e) {
            await majAuto(b.id, deps, (x) => { x.alerte_attente = true; x.erreur = String(e.message).slice(0, 200) })
            await deps.notifierAdmin(`⚠️ Production automatique non lancée — ${nomDe(b)}`, `<p>L'attente de ${a.attente_h} h est terminée, mais l'ouvrier n'a pas démarré : ${String(e.message).slice(0, 200)}</p><p><strong>Lance la production à la main dans Factory.</strong></p>${infos}${lien(b.id)}`)
            bilan.alertes++
          }
        } else {
          await majAuto(b.id, deps, (x) => { x.alerte_attente = true })
          await deps.notifierAdmin(`⏰ Attente terminée — ${nomDe(b)}`, `<p><strong>${nomDe(b)}</strong> — les ${a.attente_h} h d'attente sont passées, le client ne peut plus annuler. La production peut démarrer.</p>${infos}${lien(b.id)}`)
          bilan.rappels++
        }
        continue
      }
      // 2. L'ouvrier tourne depuis trop longtemps sans nouvelles : une alerte, une seule
      if (a.lancee_le && !a.prete_le && !a.alerte_retard && !deja(b.id, 'retard').n && now - new Date(a.lancee_le).getTime() > H(Math.max(5, (a.envoi_h - a.attente_h) * 0.6))) {
        note(b.id, 'retard'); await majAuto(b.id, deps, (x) => { x.alerte_retard = true })
        await deps.notifierAdmin(`⚠️ Production automatique en retard — ${nomDe(b)}`, `<p>Lancée le ${heure(new Date(a.lancee_le).getTime())}, la production n'est toujours pas signalée prête${a.etape ? ' (dernière étape : ' + a.etape + ')' : ''}. Ouvre la commande pour voir où elle en est ; « Reprendre » ne refait que ce qui manque.</p>${infos}${lien(b.id)}`)
        bilan.alertes++
      }
      // 3. Heure d'envoi : envoi automatique si allumé ET lot complet ; sinon un rappel — au plus 3 fois, espacés (à l'heure d'envoi, puis
      //    au tiers et aux deux tiers du temps qui reste avant l'échéance promise), et plus du tout dès que la commande est envoyée (statut « done »)
      const nR = Math.max(Number(a.rappels_envoi) || 0, deja(b.id, 'envoi').n), dernierR = Math.max(a.dernier_rappel_envoi ? new Date(a.dernier_rappel_envoi).getTime() : 0, deja(b.id, 'envoi').t)
      const ecartR = H(Math.max(1, (a.delai_h - a.envoi_h) / RAPPELS_ENVOI_MAX))
      if (age >= H(a.envoi_h) && nR < RAPPELS_ENVOI_MAX && (!nR || now - dernierR >= ecartR) && !(nR && a.envoyee_auto_le)) {
        note(b.id, 'envoi')
        await majAuto(b.id, deps, (x) => { x.envoi_traite = x.envoi_traite || new Date().toISOString(); x.rappels_envoi = nR + 1; x.dernier_rappel_envoi = new Date().toISOString() })
        if (nR) { await deps.notifierAdmin(`🔔 Rappel ${nR + 1}/${RAPPELS_ENVOI_MAX} : livrables à envoyer — ${nomDe(b)}`, `<p>La commande n'est pas encore envoyée au client. Échéance promise : <strong>${heure(new Date(b.created_at).getTime() + H(a.delai_h))}</strong>.${nR + 1 >= RAPPELS_ENVOI_MAX ? ' C\'est le dernier rappel.' : ''}</p>${infos}${lien(b.id)}`); bilan.rappels++; continue }
        if (a.prete_le && a.complet && envoiAuto()) {
          try {
            const r = await fetch(`http://127.0.0.1:${deps.PORT}/commandes/${b.id}/done`, { method: 'POST' })
            const d = await r.json().catch(() => ({}))
            if (!r.ok) throw new Error('HTTP ' + r.status)
            await majAuto(b.id, deps, (x) => { x.envoyee_auto_le = new Date().toISOString() })
            await deps.notifierAdmin(`📦 Envoyée automatiquement — ${nomDe(b)}`, `<p>Le lot complet a été envoyé au client à l'heure prévue${d.push ? ' (' + (d.push.pushedCount ?? '?') + '/' + (d.push.expectedCount ?? '?') + ' créatives transmises)' : ''}. La carte reste dans Factory : tu peux encore tout vérifier.</p>${infos}${lien(b.id)}`)
            bilan.envoyees++
          } catch (e) {
            await deps.notifierAdmin(`⚠️ Envoi automatique échoué — ${nomDe(b)}`, `<p>${String(e.message).slice(0, 200)}</p><p><strong>Envoie la commande à la main depuis Factory.</strong></p>${infos}${lien(b.id)}`); bilan.alertes++
          }
        } else {
          const pret = a.prete_le && a.complet
          await deps.notifierAdmin(`${pret ? '📬 C\'est l\'heure d\'envoyer' : '⚠️ Heure d\'envoi atteinte, lot pas prêt'} — ${nomDe(b)}`, `<p>${pret ? 'Le lot est complet et vérifiable : il reste ' + (a.delai_h - a.envoi_h) + ' h avant l\'échéance promise au client.' : 'Le lot n\'est pas complet' + (a.resume ? ' (' + a.resume + ')' : '') + '. Il reste ' + (a.delai_h - a.envoi_h) + ' h avant l\'échéance : ouvre la commande et termine-la.'}</p>${infos}${lien(b.id)}`)
          bilan.rappels++
        }
      }
    } catch (e) { console.error('[Auto-prod] commande ' + (b && b.id) + ' :', e.message) }
  }
  console.log(`[Auto-prod] ${bilan.lancees} lancée(s), ${bilan.en_file} en file d'attente, ${bilan.rappels} rappel(s), ${bilan.envoyees} envoyée(s), ${bilan.alertes} alerte(s)`)
  return bilan
}

// ── Routes ──
async function routes(req, res, deps) {
  const url = (req.url || '').split('?')[0]
  if (!url.startsWith('/auto/')) return false
  try {
    // L'ouvrier demande une session administrateur pour ouvrir Factory (clé secrète, jamais de mot de passe)
    if (req.method === 'POST' && url === '/auto/session') {
      const b = JSON.parse((await lire(req)) || '{}')
      if (!egal(b.cle, SECRET())) return rep(res, 403, { error: 'clé invalide' }), true
      const email = process.env.FACTORY_ADMIN_EMAIL || deps.ADMIN_EMAIL
      if (!email) return rep(res, 500, { error: 'FACTORY_ADMIN_EMAIL (ou ADMIN_NOTIF_EMAIL) absente sur Render' }), true
      const lr = await fetch(`${deps.SB}/auth/v1/admin/generate_link`, { method: 'POST', headers: { ...deps.entetes(), 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'magiclink', email }) })
      if (!lr.ok) return rep(res, 502, { error: 'lien de connexion refusé (HTTP ' + lr.status + ')' }), true
      const ld = await lr.json(), hache = ld.hashed_token || (ld.properties && ld.properties.hashed_token)
      const vr = await fetch(`${deps.SB}/auth/v1/verify`, { method: 'POST', headers: { apikey: deps.ANON, 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'magiclink', token_hash: hache }) })
      if (!vr.ok) return rep(res, 502, { error: 'session refusée (HTTP ' + vr.status + ')' }), true
      const s = await vr.json()
      console.log('🏭 AUTO-PROD : session ouvrier délivrée')
      return rep(res, 200, { access_token: s.access_token, refresh_token: s.refresh_token, expires_in: s.expires_in || 3600 }), true
    }
    // Factory (piloté par l'ouvrier, ou par le fondateur) rapporte l'avancement : étape, lot prêt, dossier complet
    if (req.method === 'POST' && url === '/auto/etat') {
      const b = JSON.parse((await lire(req)) || '{}')
      const id = String(b.commande_id || '')
      const cmd = (await deps.loadBriefs(id) || []).find((x) => x.id === id)
      if (!cmd) return rep(res, 404, { error: 'commande introuvable' }), true
      const parJeton = cmd.auto && cmd.auto.jeton && egal(b.jeton, cmd.auto.jeton)
      if (!parJeton && !(await deps.adminOk(req))) return rep(res, 403, { error: 'non autorisé' }), true
      const r = b.resume && typeof b.resume === 'object' ? b.resume : null
      const txt = r ? `${r.images || 0}/${r.images_attendues || 0} images, ${r.videos || 0}/${r.videos_attendues || 0} vidéos, ${r.copies || 0}/${r.copies_attendues || 0} ad copies` + (r.videos_a_revoir ? ` — ${r.videos_a_revoir} vidéo(s) jugée(s) non livrable(s) par le moteur` : '') : ''
      const dossier = typeof b.dossier_url === 'string' && /^https:\/\//.test(b.dossier_url) ? { url: b.dossier_url.slice(0, 500), date: new Date().toISOString(), fichiers: Number(b.dossier_fichiers) || null, mo: Number(b.dossier_mo) || null, auto: !!parJeton } : null
      const avant = cmd.auto || {}
      await majAuto(id, deps, (x, c) => {
        if (b.etape) x.etape = String(b.etape).slice(0, 120)
        if (b.etat === 'prete' || b.etat === 'incomplete') { x.etat = b.etat; x.prete_le = new Date().toISOString(); x.complet = b.etat === 'prete'; x.resume = txt }
        if (b.etat === 'echec') { x.etat = 'echec'; x.erreur = String(b.erreur || '').slice(0, 300) }
        if (dossier) { c.dossiers = (Array.isArray(c.dossiers) ? c.dossiers : []).filter((d) => d.url !== dossier.url).concat([dossier]).slice(-12) }
      })
      if (parJeton && (b.etat === 'prete' || b.etat === 'incomplete') && !avant.prete_le) {
        const envoi = new Date(cmd.created_at).getTime() + H(avant.envoi_h || 36)
        await deps.notifierAdmin(`${b.etat === 'prete' ? '✅ Production prête à vérifier' : '🟠 Production terminée, lot incomplet'} — ${nomDe(cmd)}`,
          `<p><strong>${nomDe(cmd)}</strong> — ${txt}.</p><p>${b.etat === 'prete' ? 'Tout est rangé dans la carte de la commande. Rien n\'est parti chez le client : vérifie, régénère ce que tu veux, puis envoie.' : (r && r.videos_a_revoir ? 'Rien n\'est parti chez le client. ' + r.videos_a_revoir + ' vidéo(s) jugée(s) non livrable(s) : ouvre la commande, regarde-la et corrige les plans fautifs avec « 🩹 Corriger des plans » (quelques dollars) ou « ↻ Refaire ». ' : '') + 'Si des livrables manquent, « Reprendre » ne refait que ce qui manque.'}</p><p>Envoi prévu au client : <strong>${heure(envoi)}</strong>${envoiAuto() ? ' (envoi automatique allumé)' : ' (c\'est toi qui envoies)'}.</p>${dossier ? '<p><a href="' + dossier.url + '">Télécharger le dossier complet de la production</a></p>' : ''}${lien(id)}`)
        if (deps.ADMIN_USER_ID && deps.notifyUserBoth) deps.notifyUserBoth(deps.ADMIN_USER_ID, { title: b.etat === 'prete' ? '✅ Production prête à vérifier' : '🟠 Lot incomplet', body: `${nomDe(cmd)} — ${txt}`, url: '/factory/production', type: 'info' }).catch(() => {})
      }
      // file-attente-v1 : la production a rendu son rapport → la suivante de la file part tout de suite (un seul passage à la fois, voir cron)
      if (parJeton && (b.etat === 'prete' || b.etat === 'incomplete' || b.etat === 'echec')) setTimeout(() => { cron(deps).catch((e) => console.error('[Auto-prod] file :', e.message)) }, 20000)
      if (parJeton && b.etat === 'echec') await deps.notifierAdmin(`❌ Production automatique en échec — ${nomDe(cmd)}`, `<p>${String(b.erreur || 'erreur inconnue').slice(0, 300)}</p><p><strong>Lance ou reprends la production à la main dans Factory.</strong></p>${lien(id)}`)
      return rep(res, 200, { ok: true }), true
    }
    // Réservé au fondateur : lancer l'ouvrier tout de suite sur une commande (bouton « Produire sans moi »)
    if (req.method === 'POST' && url === '/auto/lancer') {
      if (!(await deps.adminOk(req))) return rep(res, 403, { error: 'non autorisé' }), true
      const b = JSON.parse((await lire(req)) || '{}')
      const cmd = (await deps.loadBriefs(String(b.commande_id || '')) || []).find((x) => x.id === b.commande_id)
      if (!cmd) return rep(res, 404, { error: 'commande introuvable' }), true
      const o = await lancerOuvrier(cmd, deps)
      const c = calendrier(await delaiPour(cmd, deps))
      await majAuto(cmd.id, deps, (x) => { if (!x.delai_h) Object.assign(x, c); x.lancee_le = new Date().toISOString(); x.execution = o.execution; x.jeton = o.jeton; x.etat = 'lancee'; delete x.prete_le; delete x.complet; delete x.alerte_retard; delete x.en_file })
      return rep(res, 200, { ok: true, execution: o.execution }), true
    }
    // Réservé au fondateur : tous les dossiers complets conservés + réglages affichés dans Factory
    if (req.method === 'GET' && url === '/auto/dossiers') {
      if (!(await deps.adminOk(req))) return rep(res, 403, { error: 'non autorisé' }), true
      const briefs = await deps.loadBriefs()
      const dossiers = []
      for (const c of (briefs || [])) for (const d of (Array.isArray(c.dossiers) ? c.dossiers : [])) dossiers.push({ commande_id: c.id, produit: nomDe(c), client: (c.client && (c.client.name || c.client.email)) || '', statut: c.status, ...d })
      dossiers.sort((x, y) => String(y.date).localeCompare(String(x.date)))
      return rep(res, 200, { dossiers: dossiers.slice(0, 300), reglages: { production_auto: prodActive(), envoi_auto: envoiAuto() } }), true
    }
    return rep(res, 404, { error: 'route inconnue' }), true
  } catch (e) { console.error('[Auto-prod]', e.message); return rep(res, 500, { error: e.message }), true }
}

module.exports = { routes, cron, calendrier }
