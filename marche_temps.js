// timing-marche-v2 (19 nov. 2026) — LE TEMPS DU MARCHÉ.
// Fonctions pures (sans réseau) utilisées par le balayage ScrapeCreators de serveur.js :
//   • âge de chaque donnée (Reddit, TikTok, YouTube, pubs Meta) ;
//   • classement des pubs par âge (30 j ou plus = prouvée, 8 à 29 j = en test long, 7 j ou moins = lancement) ;
//   • carte temporelle des angles : pour chaque famille d'angle, combien de pubs, combien d'annonceurs différents, âge de la plus
//     ancienne et de la plus récente, lancements des 14 derniers jours, variantes → statut SATURÉ / PROUVÉ / PROUVÉ ENCORE RELANCÉ /
//     EN MONTÉE / ESSAI ISOLÉ ;
//   • choix des créatives candidates pour la galerie CT (les meilleures RELATIVEMENT à leur propre recherche).
'use strict'

const JOUR = 86400

// Âge en jours d'une date (secondes Unix, millisecondes, ou texte ISO). null si inconnue.
function ageJours(v, maintenant) {
  const now = maintenant || Date.now()
  if (v === undefined || v === null || v === '') return null
  let ms
  if (typeof v === 'number') ms = v > 1e12 ? v : v * 1000
  else if (/^\d+$/.test(String(v))) { const n = Number(v); ms = n > 1e12 ? n : n * 1000 }
  else { ms = Date.parse(String(v)); if (isNaN(ms)) return null }
  return Math.max(0, Math.floor((now - ms) / (JOUR * 1000)))
}

function ageTexte(j) {
  if (j === null || j === undefined) return 'date inconnue'
  if (j === 0) return "aujourd'hui"
  if (j === 1) return 'il y a 1 j'
  if (j < 60) return 'il y a ' + j + ' j'
  if (j < 730) return 'il y a ' + Math.round(j / 30) + ' mois'
  return 'il y a ' + Math.round(j / 365) + ' ans'
}

// Tranche d'âge d'une pub Meta active
function trancheAge(j) {
  if (j === null || j === undefined) return 'inconnu'
  if (j >= 30) return 'prouvee'      // payée depuis un mois ou plus : elle rapporte
  if (j >= 8) return 'test_long'     // a passé la première semaine
  return 'lancement'                 // 7 jours ou moins : test en cours
}
const LIBELLE_TRANCHE = { prouvee: 'ACTIVES DEPUIS 30 J OU PLUS (preuve : payées parce qu\'elles rapportent)', test_long: 'ACTIVES DEPUIS 8 À 29 J (ont passé la première semaine)', lancement: 'LANCÉES CES 7 DERNIERS JOURS (tests en cours : ce qui se lance)', inconnu: 'DATE DE LANCEMENT INCONNUE' }

// Carte temporelle. pubs : [{ i, annonceur, age_j, variantes, famille, type_message }]
function carteTemporelle(pubs) {
  const valides = (pubs || []).filter((p) => p && p.famille)
  const annonceursTotal = new Set(valides.map((p) => p.annonceur || '?')).size
  const fam = {}
  valides.forEach((p) => {
    const f = (fam[p.famille] = fam[p.famille] || { famille: p.famille, pubs: 0, annonceurs: new Set(), age_max: null, age_min: null, lancements_14j: 0, annonceurs_14j: new Set(), variantes: 0, types: {} })
    f.pubs++; f.annonceurs.add(p.annonceur || '?')
    if (p.age_j !== null && p.age_j !== undefined) {
      f.age_max = f.age_max === null ? p.age_j : Math.max(f.age_max, p.age_j)
      f.age_min = f.age_min === null ? p.age_j : Math.min(f.age_min, p.age_j)
      if (p.age_j <= 14) { f.lancements_14j++; f.annonceurs_14j.add(p.annonceur || '?') }
    }
    f.variantes += Math.max(1, Number(p.variantes) || 1)
    if (p.type_message) f.types[p.type_message] = (f.types[p.type_message] || 0) + 1
  })
  const lignes = Object.values(fam).map((f) => {
    const nA = f.annonceurs.size
    let statut
    if (nA >= 3 && annonceursTotal >= 4 && nA / annonceursTotal >= 0.5) statut = 'SATURÉ'
    else if (f.age_max !== null && f.age_max >= 30 && f.lancements_14j > 0) statut = 'PROUVÉ ENCORE RELANCÉ'
    else if (f.age_max !== null && f.age_max >= 30) statut = 'PROUVÉ'
    else if (f.annonceurs_14j.size >= 2) statut = 'EN MONTÉE'
    else statut = 'ESSAI ISOLÉ'
    return { famille: f.famille, statut, pubs: f.pubs, annonceurs: nA, age_max: f.age_max, age_min: f.age_min, lancements_14j: f.lancements_14j, variantes: f.variantes, types: f.types }
  })
  const ordre = { 'SATURÉ': 0, 'PROUVÉ ENCORE RELANCÉ': 1, 'PROUVÉ': 2, 'EN MONTÉE': 3, 'ESSAI ISOLÉ': 4 }
  lignes.sort((a, b) => ordre[a.statut] - ordre[b.statut] || b.annonceurs - a.annonceurs)
  const types = {}
  valides.forEach((p) => { if (p.type_message) types[p.type_message] = (types[p.type_message] || 0) + 1 })
  return { familles: lignes, annonceurs_total: annonceursTotal, pubs_total: valides.length, types }
}

function texteCarte(carte, dateBalayage) {
  if (!carte || !carte.familles.length) return ''
  const L = []
  L.push(`### CARTE TEMPORELLE DES ANGLES DES PUBS (balayage du ${dateBalayage} · ${carte.pubs_total} pubs actives · ${carte.annonceurs_total} annonceurs différents)`)
  L.push('Comptage fait par le programme, pas par un modèle. Statuts : SATURÉ = la majorité des annonceurs le disent déjà (déjà dans le prix) ; PROUVÉ = au moins une pub active depuis 30 j ou plus ; PROUVÉ ENCORE RELANCÉ = prouvé et encore relancé ces 14 derniers jours ; EN MONTÉE = lancé par au moins 2 annonceurs différents ces 14 derniers jours, sans preuve de durée ; ESSAI ISOLÉ = un seul annonceur, récent.')
  carte.familles.forEach((f) => {
    const t = Object.entries(f.types).map(([k, v]) => k + ' ' + v).join(', ')
    L.push(`- ${f.famille} → ${f.statut} · ${f.pubs} pub(s), ${f.annonceurs} annonceur(s), plus ancienne ${f.age_max === null ? '?' : f.age_max + ' j'}, plus récente ${f.age_min === null ? '?' : f.age_min + ' j'}, ${f.lancements_14j} lancement(s) en 14 j, ${f.variantes} variante(s)${t ? ' · messages : ' + t : ''}`)
  })
  const tt = Object.entries(carte.types).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${Math.round((v / carte.pubs_total) * 100)} %`).join(', ')
  if (tt) L.push(`Répartition des types de message sur le marché : ${tt}. Le type dominant indique le stade du marché (promesse → promesse plus forte → mécanisme → nouveau mécanisme → identification).`)
  L.push('Échantillon de quelques dizaines de pubs : la durée d\'une pub prouve une dépense continue, pas un retour sur investissement.')
  return L.join('\n') + '\n\n'
}

// ── CANDIDATS POUR LA GALERIE CT ──
// Score RELATIF à la même recherche : une vidéo TikTok à 4 % d'engagement est remarquable dans une recherche où la médiane est 1 %,
// banale dans une recherche où la médiane est 6 %. Les contenus étrangers sont acceptés (décision du fondateur, 19 nov. 2026).
function mediane(xs) { const a = xs.filter((x) => x > 0).sort((x, y) => x - y); if (!a.length) return 0; const m = Math.floor(a.length / 2); return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2 }

// items : [{ cle, plateforme, type:'image'|'video', recherche, mesure, media_url, ... }] — mesure = engagement (TikTok) ou preuve de durée (pubs)
function choisirCandidats(items, opts = {}) {
  const max = opts.max || 6, seuil = opts.seuil || 1.3, parAuteur = opts.parAuteur || 2, parType = opts.parType || 4
  const groupes = {}
  ;(items || []).forEach((it) => { if (it && it.media_url && it.mesure > 0) (groupes[it.plateforme + '|' + it.recherche] = groupes[it.plateforme + '|' + it.recherche] || []).push(it) })
  const notes = []
  Object.values(groupes).forEach((g) => {
    const med = mediane(g.map((x) => x.mesure))
    g.forEach((it) => { const rel = med > 0 ? it.mesure / med : 1; if (g.length === 1 || rel >= seuil) notes.push(Object.assign({}, it, { score_relatif: Math.round(rel * 100) / 100, taille_recherche: g.length })) })
  })
  notes.sort((a, b) => b.score_relatif - a.score_relatif || b.mesure - a.mesure)
  const vus = new Set(), auteurs = {}, types = {}, sortie = []
  for (const n of notes) {
    if (sortie.length >= max) break
    const empreinte = (n.auteur || '') + '|' + String(n.texte || '').slice(0, 120)   // même pub vue sous plusieurs recherches
    if (vus.has(n.cle) || vus.has(n.media_url) || (n.texte && vus.has(empreinte))) continue
    const a = (n.auteur || '?').toLowerCase()
    if ((auteurs[a] || 0) >= parAuteur) continue
    if ((types[n.type] || 0) >= parType) continue
    vus.add(n.cle); vus.add(n.media_url); if (n.texte) vus.add(empreinte); auteurs[a] = (auteurs[a] || 0) + 1; types[n.type] = (types[n.type] || 0) + 1
    sortie.push(n)
  }
  return sortie
}

// Mesure d'engagement d'une vidéo TikTok : (j'aime + 2 × commentaires + 3 × partages + 2 × enregistrements) / vues
function engagementTikTok(s) {
  s = s || {}
  const vues = Number(s.play_count) || 0
  if (vues < 1000) return 0
  return ((Number(s.digg_count) || 0) + 2 * (Number(s.comment_count) || 0) + 3 * (Number(s.share_count) || 0) + 2 * (Number(s.collect_count) || 0)) / vues
}
// Preuve d'une pub Meta. Une pub de moins de 14 jours n'a pas encore de preuve. balayage-v3 : la durée compte jusqu'à 90 jours (au-delà, elle
// prouve la même chose), et une pub lancée il y a plus de 4 mois perd de sa valeur de CANDIDATE (avant : une pub de 4 ans gagnait toujours ;
// le fondateur veut ce qui tourne maintenant). Les variantes (la marque la décline) restent le signe le plus fort.
function preuvePub(ageJ, variantes) {
  if (ageJ === null || ageJ === undefined || ageJ < 14) return 0
  const fraicheur = ageJ <= 120 ? 1 : ageJ <= 240 ? 0.5 : ageJ <= 365 ? 0.25 : 0.05
  return Math.min(ageJ, 90) * (1 + Math.min(Number(variantes) || 1, 10) / 5) * fraicheur
}

module.exports = { ageJours, ageTexte, trancheAge, LIBELLE_TRANCHE, carteTemporelle, texteCarte, choisirCandidats, engagementTikTok, preuvePub, mediane, VERSION: 'balayage-v3' }
