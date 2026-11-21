// balayage-v3 (21 nov. 2026) — RÉCENT, MONDIAL POUR LES CRÉATIVES, LU PSYCHOLOGIQUEMENT.
// Constat du fondateur (Vitalina Energy) : les créatives proposées dataient de 2 à 4 ans, des recettes « contre la fatigue » sans produit,
// des images qui ne sont pas des pubs. Causes : (1) TikTok cherché sans filtre de date et à partir du PROBLÈME seul (on tombe sur des remèdes
// maison) ; (2) les pubs « prouvées » triées de la plus vieille à la plus jeune, et le score des candidates = jours de diffusion (une pub de
// 4 ans gagnait toujours) ; (3) le contenu cherché dans le pays seulement. Maintenant : la voix du marché (le texte) reste celle des pays visés ;
// les CRÉATIVES se cherchent dans le monde entier (nos agents transposent n'importe quelle langue), parmi les PRODUITS et FORMATS qui tournent
// en ce moment dans la catégorie, sur les 3 derniers mois ; et chaque pub est lue (angle, douleur, désir, peur, accroche) puis comptée.
// timing-marche-v2 (19 nov. 2026) — BALAYAGE DATÉ (ScrapeCreators).
// Chaque donnée porte son âge, les pubs Meta sont lues sous deux tris (plus vues + plus récentes) et classées par âge, une carte
// temporelle compte les familles d'angle, YouTube des 90 derniers jours s'ajoute, et les contenus vus sont gardés (bruts) pour
// proposer les meilleures créatives à la galerie CT (candidats_ct.js).
// deps : { scGet, coupe, geoDe(pays), etiqueter(liste, plan) → [{i, famille, type}] }
'use strict'
const MT = require('./marche_temps')

async function etiqueterPubs(pubs, plan, deps) {
  if (!pubs.length || !deps.etiqueter) return pubs
  try {
    const rep = await deps.etiqueter(pubs.map((p, i) => `${i}. [${deps.coupe(p.annonceur, 40)}]${p.titre ? ' TITRE « ' + deps.coupe(p.titre, 100) + ' »' : ''} ${deps.coupe(p.texte, 320)}`).join('\n'), plan)
    const TYPES = ['promesse', 'mécanisme', 'preuve', 'identité', 'offre']
    ;(rep || []).forEach((x) => {
      const p = pubs[x.i]; if (!p) return
      p.famille = deps.coupe(String(x.famille || '').toLowerCase(), 60) || null
      const t = String(x.type || '').toLowerCase().replace('mecanisme', 'mécanisme').replace('identite', 'identité')
      p.type_message = TYPES.includes(t) ? t : null
      // balayage-v3 : la lecture psychologique de la pub (ce qu'elle appuie chez la personne)
      ;['douleur', 'desir', 'peur', 'accroche', 'cible'].forEach((k) => { const v = deps.coupe(String(x[k] || '').toLowerCase(), 90); p[k] = v && !/^(aucun|aucune|n\/a|none|-)$/.test(v) ? v : null })
    })
  } catch (e) { console.log('   ⚠ carte des angles non étiquetée :', e.message) }
  return pubs
}

// balayage-v3 — LECTURE PSYCHOLOGIQUE DES PUBS, COMPTÉE PAR LE PROGRAMME. Ce qui revient chez plusieurs annonceurs est ce que le marché paie
// pour dire : c'est un fait de marché, pas une intuition. Chaque élément garde le nom des annonceurs qui le portent (preuve vérifiable).
function lecturePsychologique(pubs, titre) {
  const champs = [['douleur', 'DOULEURS APPUYÉES'], ['desir', 'DÉSIRS PROMIS'], ['peur', 'PEURS ACTIVÉES'], ['accroche', 'MÉCANIQUES D\'ACCROCHE'], ['cible', 'QUI EST VISÉ']]
  const v = (pubs || []).filter((p) => p && (p.douleur || p.desir || p.peur || p.accroche))
  if (v.length < 3) return ''
  const L = [`#### ${titre} — lecture psychologique de ${v.length} pub(s), comptée par le programme (n annonceurs = n marques différentes qui paient pour le dire)`]
  champs.forEach(([k, lib]) => {
    const m = {}
    v.forEach((p) => { const x = p[k]; if (!x) return; (m[x] = m[x] || { n: 0, annonceurs: new Set(), ages: [] }); m[x].n++; m[x].annonceurs.add(p.annonceur || '?'); if (p.age_j !== null && p.age_j !== undefined) m[x].ages.push(p.age_j) })
    const top = Object.entries(m).sort((a, b) => b[1].annonceurs.size - a[1].annonceurs.size || b[1].n - a[1].n).slice(0, 7)
    if (top.length) L.push(`- ${lib} : ` + top.map(([x, o]) => `« ${x} » (${o.annonceurs.size} annonceur(s) : ${[...o.annonceurs].slice(0, 3).join(', ')}${o.ages.length ? ' ; diffusée depuis ' + Math.min(...o.ages) + ' à ' + Math.max(...o.ages) + ' j' : ''})`).join(' ; '))
  })
  return L.join('\n') + '\n\n'
}

async function balayage(plan, pays, compteur, deps) {
  const { scGet } = deps, C = deps.coupe
  const auj = new Date().toISOString().slice(0, 10)
  const stats = { reddit: 0, tiktok_videos: 0, tiktok_commentaires: 0, youtube: 0, pubs: 0, pubs_recentes: 0, pubs_monde: 0, tiktok_monde: 0, dates_inconnues: 0, familles: 0, erreurs: [] }
  const sections = { reddit: '', tiktok: '', youtube: '', pubs: '', carte: '', monde: '', psy: '' }
  const bruts = { pubs: [], tiktok: [] }
  const reperes = { familles: [], annonceurs: [], douleurs: [], desirs: [], peurs: [] }   // balayage-v3 : pour mesurer ensuite ce que l'hypothèse en a fait
  const depuis = (j) => new Date(Date.now() - j * 86400000).toISOString().slice(0, 10)
  const qMonde = (plan.creatives_monde && plan.creatives_monde.length ? plan.creatives_monde : [plan.categorie]).filter(Boolean).slice(0, 3)
  const geo = deps.geoDe(pays) || ''
  const age = (v) => { const j = MT.ageJours(v); if (j === null) stats.dates_inconnues++; return j }

  const tacheReddit = async () => {
    const lignes = []
    const lirePosts = (j, etiquette) => (j.posts || []).slice(0, 5).forEach((p) => {
      stats.reddit++
      const a = age(p.created_utc || p.created)
      lignes.push(`- [${etiquette}] [${p.subreddit_name_prefixed || ('r/' + (p.subreddit || '?'))}] (${MT.ageTexte(a)}) "${C(p.title, 160)}"${p.selftext ? ' — ' + C(p.selftext, 380) : ''} (score ${p.score ?? '?'}, ${p.num_comments ?? '?'} commentaires) ${p.url || ''}`)
    })
    for (const q of plan.reddit.slice(0, 2)) {
      try { lirePosts(await scGet('/v1/reddit/search', { query: q, filter: 'posts', sort: 'relevance', timeframe: 'year', trim: 'true' }, compteur), '12 derniers mois') }
      catch (e) { stats.erreurs.push('reddit « ' + q + ' » : ' + e.message) }
    }
    try { lirePosts(await scGet('/v1/reddit/search', { query: plan.reddit[0] || plan.probleme, filter: 'posts', sort: 'relevance', timeframe: 'month', trim: 'true' }, compteur), '30 derniers jours') }
    catch (e) { stats.erreurs.push('reddit récent : ' + e.message) }
    try {
      const j = await scGet('/v1/reddit/search', { query: plan.formulations[0] || plan.probleme, filter: 'comments', sort: 'top', trim: 'true' }, compteur)
      ;(j.comments || j.posts || []).slice(0, 8).forEach((c) => {
        const t = c.body || c.selftext || c.text || c.comment || ''
        if (String(t).length < 25) return
        stats.reddit++
        lignes.push(`- [commentaire ${c.subreddit_name_prefixed || ''}] (${MT.ageTexte(age(c.created_utc || c.created))}) "${C(t, 380)}" (score ${c.score ?? '?'}) ${c.url || c.permalink || ''}`)
      })
    } catch (e) { stats.erreurs.push('reddit commentaires : ' + e.message) }
    if (lignes.length) sections.reddit = `### SOURCE — SCRAPECREATORS · REDDIT (discussions sur le PROBLÈME : « ${plan.probleme} » — [12 derniers mois] = le fond récent, [30 derniers jours] = ce qui se dit maintenant)\n` + lignes.join('\n') + '\n\n'
  }

  const tacheTikTok = async () => {
    const videos = []
    for (const q of plan.tiktok.slice(0, 2)) {
      try {
        const j = await scGet('/v1/tiktok/search/keyword', { query: q, date_posted: 'last-6-months', sort_by: 'relevance' }, compteur)
        const items = (j.search_item_list || []).map((x) => x.aweme_info).filter(Boolean)
        items.forEach((a) => bruts.tiktok.push({ a, recherche: q, source: 'probleme' }))
        items.slice().sort((a, b) => ((b.statistics?.comment_count) || 0) - ((a.statistics?.comment_count) || 0)).slice(0, 2).forEach((a) => videos.push({ q, a }))
      } catch (e) { stats.erreurs.push('tiktok « ' + q + ' » : ' + e.message) }
    }
    const lignes = []
    let nbCom = 0
    for (const { a } of videos.slice(0, 4)) {
      stats.tiktok_videos++
      const pseudo = a.author?.unique_id || ''
      const url = a.share_url || (pseudo && a.aweme_id ? `https://www.tiktok.com/@${pseudo}/video/${a.aweme_id}` : '')
      lignes.push(`- VIDÉO (${MT.ageTexte(age(a.create_time))}) « ${C(a.desc, 220)} » (${a.statistics?.play_count ?? '?'} vues, ${a.statistics?.comment_count ?? '?'} commentaires) ${url}`)
      if (!url) continue
      try {
        const j = await scGet('/v1/tiktok/video/comments', { url, trim: 'true' }, compteur)
        ;(j.comments || []).filter((c) => String(c.text || '').length >= 15).sort((x, y) => (y.digg_count || 0) - (x.digg_count || 0)).slice(0, 8)
          .forEach((c) => { nbCom++; lignes.push(`    · commentaire${c.create_time ? ' (' + MT.ageTexte(MT.ageJours(c.create_time)) + ')' : ''} : "${C(c.text, 300)}" (${c.digg_count ?? 0} likes)`) })
      } catch (e) { stats.erreurs.push('tiktok commentaires : ' + e.message) }
    }
    stats.tiktok_commentaires = nbCom
    if (lignes.length) sections.tiktok = `### SOURCE — SCRAPECREATORS · TIKTOK (vidéos des 6 derniers mois et commentaires sur le problème, chacun daté)\n` + lignes.join('\n') + '\n\n'
  }

  const tacheYouTube = async () => {
    const q = (plan.tiktok && plan.tiktok[0]) || plan.probleme
    try {
      const j = await scGet('/v1/youtube/search', { query: q, uploadDate: 'this_year', sortBy: 'relevance' }, compteur)
      const vids = (j.videos || []).map((v) => ({ v, a: MT.ageJours(v.publishedTime) })).filter((x) => x.a !== null && x.a <= 90).slice(0, 6)
      const lignes = vids.map(({ v, a }) => { stats.youtube++; return `- (${MT.ageTexte(a)}) « ${C(v.title, 160)} » — ${v.viewCountInt ?? v.viewCountText ?? '?'} vues${v.channel && v.channel.title ? ' · ' + C(v.channel.title, 40) : ''} ${v.url || ''}` })
      if (lignes.length) sections.youtube = `### SOURCE — SCRAPECREATORS · YOUTUBE (vidéos des 90 derniers jours sur « ${q} »)\n` + lignes.join('\n') + '\n\n'
    } catch (e) { stats.erreurs.push('youtube : ' + e.message) }
  }

  const tachePubs = async () => {
    const vus = new Set(), pubs = []
    const lire = (res, q, tri) => res.forEach((ad) => {
      const cle = ad.collation_id || ad.ad_archive_id
      if (cle && vus.has(cle)) return
      if (cle) vus.add(cle)
      const s = ad.snapshot || {}
      const corps = (s.body && (s.body.text || s.body)) || s.link_description || ''
      if (!corps && !s.title) return
      bruts.pubs.push({ ad, recherche: q, source: 'marche' })
      stats.pubs++; if (tri === 'récentes') stats.pubs_recentes++
      pubs.push({ i: pubs.length, annonceur: ad.page_name || '?', age_j: age(ad.start_date), variantes: ad.collation_count || 1, recherche: q, tri, titre: s.title || '', cta: s.cta_text || '',
        format: (s.videos && s.videos.length) ? 'vidéo' : (s.images && s.images.length) ? 'image' : (s.cards && s.cards.length) ? 'carrousel' : '?',
        texte: typeof corps === 'string' ? corps : JSON.stringify(corps) })
    })
    for (const q of plan.ads.slice(0, 3)) {
      for (const [tri, sort_by] of [['plus vues', 'total_impressions'], ['récentes', 'relevancy_monthly_grouped']]) {
        try {
          let j = await scGet('/v1/facebook/adLibrary/search/ads', { query: q, country: geo || 'ALL', status: 'ACTIVE', sort_by, media_type: 'ALL' }, compteur)
          let res = j.searchResults || []
          if (!res.length && geo) {
            j = await scGet('/v1/facebook/adLibrary/search/ads', { query: q, country: 'ALL', language: 'FR', status: 'ACTIVE', sort_by, media_type: 'ALL' }, compteur)
            res = j.searchResults || []
          }
          lire(res.slice(0, 6), q, tri)
        } catch (e) { stats.erreurs.push('pubs « ' + q + ' » (' + tri + ') : ' + e.message) }
      }
    }
    if (!pubs.length) return
    const groupes = { prouvee: [], test_long: [], lancement: [], inconnu: [] }
    pubs.forEach((p) => groupes[MT.trancheAge(p.age_j)].push(p))
    let txt = `### SOURCE — SCRAPECREATORS · BIBLIOTHÈQUE DE PUBS META (pubs actives des alternatives et concurrents, lues sous deux tris — les plus vues et les plus récentes — puis classées par âge)\n`
    ;['prouvee', 'test_long', 'lancement', 'inconnu'].forEach((k) => {
      if (!groupes[k].length) return
      txt += `#### ${MT.LIBELLE_TRANCHE[k]} — ${groupes[k].length} pub(s)\n`
      groupes[k].slice().sort((a, b) => (a.age_j || 0) - (b.age_j || 0)).forEach((p) => {   // balayage-v3 : de la plus récente à la plus ancienne
        txt += `- [${p.annonceur}] (recherche « ${p.recherche} », ${p.age_j === null ? 'date inconnue' : 'diffusée depuis ' + p.age_j + ' j'}${p.variantes > 1 ? ', ' + p.variantes + ' variantes' : ''}, ${p.format}) ${p.titre ? 'TITRE « ' + C(p.titre, 120) + ' » — ' : ''}« ${C(p.texte, 380)} »${p.cta ? ' [CTA : ' + p.cta + ']' : ''}\n`
      })
    })
    sections.pubs = txt + '\n'
    P_MARCHE.push(...pubs)
  }
  const P_MARCHE = [], P_MONDE = []

  // balayage-v3 — LES CRÉATIVES QUI TOURNENT DANS LE MONDE, dans la catégorie du produit, sur les 3 derniers mois (pubs actives et TikTok).
  // Elles servent deux fois : (1) à l'analyste, pour voir les angles et les mécaniques qui se paient ailleurs en ce moment ; (2) à la galerie CT.
  const tacheMonde = async () => {
    const vus = new Set(), lignes = [], lignesTT = []
    for (const q of qMonde) {
      try {
        let j = await scGet('/v1/facebook/adLibrary/search/ads', { query: q, country: 'ALL', status: 'ACTIVE', sort_by: 'total_impressions', media_type: 'ALL', start_date: depuis(90) }, compteur)
        ;(j.searchResults || []).slice(0, 8).forEach((ad) => {
          const cle = ad.collation_id || ad.ad_archive_id; if (cle && vus.has(cle)) return; if (cle) vus.add(cle)
          const s = ad.snapshot || {}, corps = (s.body && (s.body.text || s.body)) || s.link_description || ''
          if (!corps && !s.title) return
          bruts.pubs.push({ ad, recherche: q, source: 'monde' }); stats.pubs_monde++
          const p = { annonceur: ad.page_name || '?', age_j: age(ad.start_date), variantes: ad.collation_count || 1, recherche: q, titre: s.title || '', monde: true,
            format: (s.videos && s.videos.length) ? 'vidéo' : (s.images && s.images.length) ? 'image' : (s.cards && s.cards.length) ? 'carrousel' : '?', texte: typeof corps === 'string' ? corps : JSON.stringify(corps) }
          P_MONDE.push(p)
          lignes.push(`- [${p.annonceur}] (« ${q} », ${p.age_j === null ? 'date inconnue' : 'diffusée depuis ' + p.age_j + ' j'}${p.variantes > 1 ? ', ' + p.variantes + ' variantes' : ''}, ${p.format}) ${p.titre ? 'TITRE « ' + C(p.titre, 100) + ' » — ' : ''}« ${C(p.texte, 260)} »`)
        })
      } catch (e) { stats.erreurs.push('pubs monde « ' + q + ' » : ' + e.message) }
      try {
        let j = await scGet('/v1/tiktok/search/keyword', { query: q, date_posted: 'last-3-months', sort_by: 'relevance' }, compteur)
        let items = (j.search_item_list || []).map((x) => x.aweme_info).filter(Boolean)
        if (items.length < 4) { j = await scGet('/v1/tiktok/search/keyword', { query: q, date_posted: 'last-6-months', sort_by: 'relevance' }, compteur); items = (j.search_item_list || []).map((x) => x.aweme_info).filter(Boolean) }
        items.forEach((a) => { bruts.tiktok.push({ a, recherche: q, source: 'monde' }); stats.tiktok_monde++ })
        items.slice().sort((a, b) => (Number(b.statistics?.play_count) || 0) - (Number(a.statistics?.play_count) || 0)).slice(0, 4).forEach((a) => {
          const pseudo = a.author?.unique_id || ''; const url = a.share_url || (pseudo && a.aweme_id ? `https://www.tiktok.com/@${pseudo}/video/${a.aweme_id}` : '')
          lignesTT.push(`- (« ${q} », ${MT.ageTexte(age(a.create_time))}) @${pseudo} « ${C(a.desc, 200)} » (${a.statistics?.play_count ?? '?'} vues, ${a.statistics?.comment_count ?? '?'} commentaires, ${a.statistics?.share_count ?? '?'} partages) ${url}`)
        })
      } catch (e) { stats.erreurs.push('tiktok monde « ' + q + ' » : ' + e.message) }
    }
    if (lignes.length || lignesTT.length) sections.monde = `### SOURCE — SCRAPECREATORS · CRÉATIVES QUI TOURNENT DANS LE MONDE, CES 3 DERNIERS MOIS (catégorie du produit, toutes langues ; recherches : ${qMonde.join(' | ')}). Elles montrent les angles, les formats et les mécaniques que d'autres marques paient en ce moment ; ce ne sont PAS des données sur la cible (sa voix et son marché sont dans les autres sections).\n`
      + (lignes.length ? '#### Pubs Meta actives (monde)\n' + lignes.join('\n') + '\n' : '') + (lignesTT.length ? '#### Vidéos TikTok les plus vues (monde)\n' + lignesTT.join('\n') + '\n' : '') + '\n'
  }

  await Promise.all([tacheReddit(), tacheTikTok(), tacheYouTube(), tachePubs(), tacheMonde()])
  // lecture psychologique de toutes les pubs (marché + monde) en un seul appel ; la carte temporelle ne compte que le marché visé
  const tout = P_MARCHE.concat(P_MONDE).map((p, i) => Object.assign(p, { i }))
  if (tout.length) {
    await etiqueterPubs(tout, plan, deps)
    if (P_MARCHE.length) { const carte = MT.carteTemporelle(P_MARCHE); stats.familles = carte.familles.length; sections.carte = MT.texteCarte(carte, auj); reperes.familles = carte.familles.map((f) => f.famille) }
    sections.psy = '### LECTURE PSYCHOLOGIQUE DES PUBLICITÉS (ce que les annonceurs appuient chez la personne)\n' + lecturePsychologique(P_MARCHE, 'MARCHÉ VISÉ') + lecturePsychologique(P_MONDE, 'MONDE, 3 DERNIERS MOIS')
    if (sections.psy.split('\n').length < 3) sections.psy = ''
    reperes.annonceurs = [...new Set(tout.map((p) => p.annonceur).filter((a) => a && a !== '?'))].slice(0, 40)
    ;['douleur', 'desir', 'peur'].forEach((k) => { reperes[k === 'desir' ? 'desirs' : k + 's'] = [...new Set(tout.map((p) => p[k]).filter(Boolean))].slice(0, 30) })
  }
  const entete = `### DATE DU BALAYAGE : ${auj} — chaque donnée ci-dessous porte son âge (« il y a N j »). Sers-t'en pour juger ce qui est ancien, prouvé, en montée ou trop tôt.\n${stats.dates_inconnues ? `(${stats.dates_inconnues} donnée(s) sans date : ne les utilise jamais comme preuve de timing.)\n` : ''}\n`
  const texte = entete + sections.carte.slice(0, 5000) + sections.psy.slice(0, 6000) + [sections.pubs, sections.monde, sections.reddit, sections.tiktok, sections.youtube].map((s) => s.slice(0, 7000)).join('')
  return { texte, stats, bruts, reperes }
}

module.exports = { balayage, lecturePsychologique, VERSION: 'balayage-v3' }
