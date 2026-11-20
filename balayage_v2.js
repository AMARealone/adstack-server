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
    const rep = await deps.etiqueter(pubs.map((p, i) => `${i}. [${deps.coupe(p.annonceur, 40)}] ${deps.coupe(p.texte, 260)}`).join('\n'), plan)
    const TYPES = ['promesse', 'mécanisme', 'preuve', 'identité', 'offre']
    ;(rep || []).forEach((x) => {
      const p = pubs[x.i]; if (!p) return
      p.famille = deps.coupe(String(x.famille || '').toLowerCase(), 60) || null
      const t = String(x.type || '').toLowerCase().replace('mecanisme', 'mécanisme').replace('identite', 'identité')
      p.type_message = TYPES.includes(t) ? t : null
    })
  } catch (e) { console.log('   ⚠ carte des angles non étiquetée :', e.message) }
  return pubs
}

async function balayage(plan, pays, compteur, deps) {
  const { scGet } = deps, C = deps.coupe
  const auj = new Date().toISOString().slice(0, 10)
  const stats = { reddit: 0, tiktok_videos: 0, tiktok_commentaires: 0, youtube: 0, pubs: 0, pubs_recentes: 0, dates_inconnues: 0, familles: 0, erreurs: [] }
  const sections = { reddit: '', tiktok: '', youtube: '', pubs: '', carte: '' }
  const bruts = { pubs: [], tiktok: [] }
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
      try { lirePosts(await scGet('/v1/reddit/search', { query: q, filter: 'posts', sort: 'relevance', timeframe: 'all', trim: 'true' }, compteur), 'fond') }
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
    if (lignes.length) sections.reddit = `### SOURCE — SCRAPECREATORS · REDDIT (discussions sur le PROBLÈME : « ${plan.probleme} » — [fond] = toutes époques, [30 derniers jours] = ce qui se dit maintenant)\n` + lignes.join('\n') + '\n\n'
  }

  const tacheTikTok = async () => {
    const videos = []
    for (const q of plan.tiktok.slice(0, 2)) {
      try {
        const j = await scGet('/v1/tiktok/search/keyword', { query: q }, compteur)
        const items = (j.search_item_list || []).map((x) => x.aweme_info).filter(Boolean)
        items.forEach((a) => bruts.tiktok.push({ a, recherche: q }))
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
    if (lignes.length) sections.tiktok = `### SOURCE — SCRAPECREATORS · TIKTOK (vidéos et commentaires sur le problème, chacun daté)\n` + lignes.join('\n') + '\n\n'
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
      bruts.pubs.push({ ad, recherche: q })
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
      groupes[k].slice().sort((a, b) => (b.age_j || 0) - (a.age_j || 0)).forEach((p) => {
        txt += `- [${p.annonceur}] (recherche « ${p.recherche} », ${p.age_j === null ? 'date inconnue' : 'diffusée depuis ' + p.age_j + ' j'}${p.variantes > 1 ? ', ' + p.variantes + ' variantes' : ''}, ${p.format}) ${p.titre ? 'TITRE « ' + C(p.titre, 120) + ' » — ' : ''}« ${C(p.texte, 380)} »${p.cta ? ' [CTA : ' + p.cta + ']' : ''}\n`
      })
    })
    sections.pubs = txt + '\n'
    await etiqueterPubs(pubs, plan, deps)
    const carte = MT.carteTemporelle(pubs)
    stats.familles = carte.familles.length
    sections.carte = MT.texteCarte(carte, auj)
  }

  await Promise.all([tacheReddit(), tacheTikTok(), tacheYouTube(), tachePubs()])
  const entete = `### DATE DU BALAYAGE : ${auj} — chaque donnée ci-dessous porte son âge (« il y a N j »). Sers-t'en pour juger ce qui est ancien, prouvé, en montée ou trop tôt.\n${stats.dates_inconnues ? `(${stats.dates_inconnues} donnée(s) sans date : ne les utilise jamais comme preuve de timing.)\n` : ''}\n`
  const texte = entete + sections.carte.slice(0, 5000) + [sections.pubs, sections.reddit, sections.tiktok, sections.youtube].map((s) => s.slice(0, 7000)).join('')
  return { texte, stats, bruts }
}

module.exports = { balayage, VERSION: 'timing-marche-v2' }
