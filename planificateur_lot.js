'use strict'
// Planificateur de lot AdStack — MODE « PLAN SEULEMENT » (aucun appel IA, aucun coût).
// Module pur : composition du lot, budget, redondance, diversité, compatibilité cible.
// Décisions du 1er nov. : 1 vidéo + 2 images par angle ; budgets 25/45/~63/80 $ tout compris ;
// redondance lot <= 25 % (idéal 0) ; galerie produit <= 20 % de créatives qui se ressemblent.

const TAILLES = [6, 12, 18, 24]
const BUDGET_PAR_TAILLE = { 6: 25, 12: 45, 18: 63, 24: 80 } // 18 interpolé (à confirmer par le fondateur)
const PLAFOND_VIDEO = 10
const SEUIL_REDONDANCE_LOT = 0.25
const SEUIL_SIMILAIRES_GALERIE = 0.20
const SEUIL_RESSEMBLANCE = 0.5          // part d'axes identiques à partir de laquelle 2 créatives « se ressemblent »
const SEUIL_COMPAT_CIBLE = 0.5
const AXES = ['style', 'voix', 'lieu', 'rythme', 'structure', 'ouverture', 'musique', 'palette']
// Coûts unitaires ESTIMÉS (à remplacer par les coûts réels du registre quand il existera)
const EST = { hypothese: 2.0, image: 0.30, copieParAngle: 0.10, planificateur: 0.05, reserveRefaits: 0.15 }
// Plafonds par format (compétence de l'analyste, S3) : la vidéo peut descendre jusqu'à Problem Aware, l'image jamais plus froid que Solution Aware.
// Most Aware vit dans la conversion de la vidéo (derniers 25-30 %) et dans l'ad copy.
const NIVEAU_VIDEO = 'Problem'
const NIVEAUX_IMAGES = ['Solution', 'Product']

function composition(taille) {
  if (!Number.isInteger(taille) || taille < 6 || taille % 3 !== 0 || taille > 24) throw new Error('Taille de lot invalide : ' + taille + ' (multiple de 3, entre 6 et 24)')
  const angles = taille / 3
  return { taille, angles, videos: angles, images: angles * 2 }
}

function budgetTotal(taille) {
  if (BUDGET_PAR_TAILLE[taille] != null) return BUDGET_PAR_TAILLE[taille]
  const ks = Object.keys(BUDGET_PAR_TAILLE).map(Number).sort((a, b) => a - b)
  for (let i = 0; i < ks.length - 1; i++) if (taille > ks[i] && taille < ks[i + 1]) {
    const t = (taille - ks[i]) / (ks[i + 1] - ks[i]); return Math.round((BUDGET_PAR_TAILLE[ks[i]] + t * (BUDGET_PAR_TAILLE[ks[i + 1]] - BUDGET_PAR_TAILLE[ks[i]])) * 100) / 100
  }
  throw new Error('Pas de budget pour ' + taille)
}

// Répartition du budget entre postes. hypotheseExiste=true => 0 $ d'hypothèse (réutilisée).
function repartitionBudget(taille, { hypotheseExiste = false } = {}) {
  const c = composition(taille), total = budgetTotal(taille)
  const hyp = hypotheseExiste ? 0 : EST.hypothese
  const img = c.images * EST.image
  const copies = c.angles * EST.copieParAngle
  const plan = EST.planificateur
  const reserve = Math.round(total * EST.reserveRefaits * 100) / 100
  const reste = total - hyp - img - copies - plan - reserve
  const parVideoBrut = reste / c.videos
  const parVideo = Math.max(0, Math.min(PLAFOND_VIDEO, Math.round(parVideoBrut * 100) / 100))
  const nonUtilise = Math.round((reste - parVideo * c.videos) * 100) / 100
  return { total, hypothese: hyp, images: Math.round(img * 100) / 100, copies: Math.round(copies * 100) / 100, planificateur: plan, reserveRefaits: reserve,
    videos: Math.round(parVideo * c.videos * 100) / 100, parVideo, plafondParVideo: PLAFOND_VIDEO, nonUtilise,
    coutMoyenParCreative: Math.round(total / taille * 100) / 100, faisable: parVideo >= 5 }
}

function ressemblance(a, b) {
  if (!a || !b) return 0
  if (a.ctId && a.ctId === b.ctId) return 1
  if (a.concept && b.concept && a.concept === b.concept) return 1
  let comp = 0, egal = 0
  for (const ax of AXES) { const x = a.axes && a.axes[ax], y = b.axes && b.axes[ax]; if (x == null || y == null) continue; comp++; if (x === y) egal++ }
  return comp ? egal / comp : 0
}

// Part des créatives du lot qui ressemblent à au moins une créative de l'historique
function redondanceLot(lot, historique) {
  if (!lot.length) return { taux: 0, redondantes: [] }
  const red = lot.filter(c => historique.some(h => ressemblance(c, h) >= SEUIL_RESSEMBLANCE))
  return { taux: red.length / lot.length, redondantes: red.map(c => c.id) }
}
// Part de la galerie qui ressemble à au moins une autre créative de la galerie
function similairesGalerie(galerie) {
  if (!galerie.length) return { taux: 0, nb: 0 }
  let nb = 0
  galerie.forEach((c, i) => { if (galerie.some((h, j) => i !== j && ressemblance(c, h) >= SEUIL_RESSEMBLANCE)) nb++ })
  return { taux: nb / galerie.length, nb }
}

function compatibiliteCible(ct, cible) {
  const m = ct.maturite; if (!m || !cible) return 0.5
  let s = 0, n = 0
  if (m.generations && cible.generation) { n++; s += m.generations.includes(cible.generation) || m.generations.includes('toutes') ? 1 : 0 }
  if (m.aisanceNumerique != null && cible.aisanceNumerique != null) { n++; s += Math.max(0, 1 - Math.abs(m.aisanceNumerique - cible.aisanceNumerique) / 3) }
  if (m.rythmes && cible.rythmes) { n++; s += m.rythmes.some(r => cible.rythmes.includes(r)) ? 1 : 0 }
  return n ? s / n : 0.5
}

// Contrôles du lot (faits par le code)
function controlerLot(lot, historique, galerieExistante, tailleAttendue) {
  const erreurs = [], c = composition(tailleAttendue)
  const nbV = lot.filter(x => x.format === 'video').length, nbI = lot.filter(x => x.format === 'image').length
  if (nbV !== c.videos || nbI !== c.images) erreurs.push(`composition ${nbV}V+${nbI}I au lieu de ${c.videos}V+${c.images}I`)
  const parAngle = {}; lot.forEach(x => { (parAngle[x.angleId] = parAngle[x.angleId] || []).push(x) })
  Object.entries(parAngle).forEach(([a, l]) => { const v = l.filter(x => x.format === 'video').length, i = l.filter(x => x.format === 'image').length; if (v !== 1 || i !== 2) erreurs.push(`angle ${a} : ${v}V+${i}I (attendu 1V+2I)`) })
  const ids = lot.map(x => x.ctId); if (new Set(ids).size !== ids.length) erreurs.push('même CT utilisé deux fois dans le lot')
  for (let i = 0; i < lot.length; i++) for (let j = i + 1; j < lot.length; j++) {
    const r = ressemblance(lot[i], lot[j]); if (r >= SEUIL_RESSEMBLANCE) erreurs.push(`${lot[i].id} et ${lot[j].id} se ressemblent (${Math.round(r * 100)} %)`)
    if (lot[i].format === 'video' && lot[j].format === 'video' && lot[i].axes.style === lot[j].axes.style && lot[i].axes.voix === lot[j].axes.voix) erreurs.push(`vidéos ${lot[i].id} et ${lot[j].id} : même style ET même voix`)
  }
  const rl = redondanceLot(lot, historique); if (rl.taux > SEUIL_REDONDANCE_LOT) erreurs.push(`redondance avec l'historique ${Math.round(rl.taux * 100)} % > 25 %`)
  const gal = similairesGalerie(galerieExistante.concat(lot)); if (gal.taux > SEUIL_SIMILAIRES_GALERIE) erreurs.push(`galerie : ${Math.round(gal.taux * 100)} % de créatives qui se ressemblent > 20 %`)
  const gagnants = lot.filter(x => x.ctGagnant).length; if (gagnants > 1) erreurs.push('plus d\'un CT gagnant dans le lot')
  return { ok: erreurs.length === 0, erreurs, redondanceLot: rl.taux, similairesGalerie: gal.taux }
}

// Choix glouton déterministe : CT compatibles, non utilisés, qui diffèrent le plus de ce qui est déjà pris
function planifierLot({ taille, angles, galerieCT, historique = [], ctGagnants = [], cible = null, hypotheseExiste = false, anglesGagnants = [] }) {
  const c = composition(taille)
  if (!angles || angles.length < c.angles) throw new Error(`Hypothèse : ${angles ? angles.length : 0} angle(s) disponible(s), ${c.angles} nécessaires`)
  const angPris = angles.filter(a => !anglesGagnants.includes(a.id)).slice(0, c.angles)
  if (angPris.length < c.angles) throw new Error('Pas assez d\'angles non gagnants')
  const dejaUtilises = new Set(historique.map(h => h.ctId))
  const lot = [], alertes = []
  const compat = ct => compatibiliteCible(ct, cible)
  const rejetes = { dejaUtilise: 0, incompatible: 0 }
  const candidats = fmt => galerieCT.filter(ct => ct.format === fmt).filter(ct => {
    if (dejaUtilises.has(ct.id)) { rejetes.dejaUtilise++; return false }
    if (compat(ct) < SEUIL_COMPAT_CIBLE) { rejetes.incompatible++; return false }
    return true
  })
  const poolV = candidats('video'), poolI = candidats('image')
  let gagnantPlace = false
  const choisir = (pool, fmt, angle, niveau, k) => {
    let meilleur = null, meilleurScore = -1
    for (const ct of pool) {
      if (lot.some(x => x.ctId === ct.id)) continue
      const fiche = { id: '', ctId: ct.id, format: fmt, concept: ct.concept, axes: ct.axes || {}, angleId: angle.id }
      let maxRess = 0; lot.forEach(x => { maxRess = Math.max(maxRess, ressemblance(fiche, x)) }); historique.forEach(h => { maxRess = Math.max(maxRess, ressemblance(fiche, h)) })
      if (maxRess >= SEUIL_RESSEMBLANCE) continue
      if (fmt === 'video' && lot.some(x => x.format === 'video' && x.axes.style === (ct.axes||{}).style && x.axes.voix === (ct.axes||{}).voix)) continue
      const estGagnant = ctGagnants.some(g => g.ctId === ct.id)
      if (estGagnant && gagnantPlace) continue
      const score = (1 - maxRess) * 0.6 + compat(ct) * 0.4 + (estGagnant ? 0.15 : 0)
      if (score > meilleurScore) { meilleurScore = score; meilleur = { ct, fiche, estGagnant } }
    }
    if (!meilleur) { alertes.push(`Aucun CT ${fmt} valable pour l'angle ${angle.id} (${niveau})`); return }
    if (meilleur.estGagnant) gagnantPlace = true
    const n = lot.length + 1
    lot.push({ id: `${angle.id}-${fmt === 'video' ? 'V' : 'I'}${n}`, ctId: meilleur.ct.id, format: fmt, concept: meilleur.ct.concept, axes: meilleur.ct.axes || {}, angleId: angle.id, niveau, facette: angle.facette || null, raisonIdx: k, raison: (angle.raisons && angle.raisons[k]) || null, ctGagnant: meilleur.estGagnant, compatCible: Math.round(compat(meilleur.ct) * 100) / 100 })
  }
  // Une raison d'acheter par créative de l'angle : 0 = vidéo, 1 et 2 = images.
  angPris.forEach(angle => { choisir(poolV, 'video', angle, NIVEAU_VIDEO, 0); choisir(poolI, 'image', angle, NIVEAUX_IMAGES[0], 1); choisir(poolI, 'image', angle, NIVEAUX_IMAGES[1], 2) })
  const controles = controlerLot(lot, historique, [], taille)
  return { composition: c, budget: repartitionBudget(taille, { hypotheseExiste }), lot, controles, alertes, rejetes }
}

module.exports = { NIVEAU_VIDEO, NIVEAUX_IMAGES, TAILLES, BUDGET_PAR_TAILLE, AXES, composition, budgetTotal, repartitionBudget, ressemblance, redondanceLot, similairesGalerie, compatibiliteCible, controlerLot, planifierLot, EST }
