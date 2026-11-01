'use strict'
// Lecture de l'hypothèse (synthèse) par le code : angles (nom, facette, 3 raisons d'acheter) et profil de maturité de la cible.
// Les formats lus ici sont imposés par la compétence de l'analyste (S1d et champ 17). Aucun appel IA.

function lireMaturite(txt) {
  const g = re => { const m = String(txt || '').match(re); return m ? m[1].trim() : null }
  const gen = g(/MATURITE\s*[—-]\s*g[ée]n[ée]ration\s*:\s*([^\n]+)/i)
  const ais = g(/MATURITE\s*[—-]\s*aisance num[ée]rique\s*:\s*([^\n]+)/i)
  const ryt = g(/MATURITE\s*[—-]\s*rythmes? compris\s*:\s*([^\n]+)/i)
  const hum = g(/MATURITE\s*[—-]\s*humour\s*:\s*([^\n]+)/i)
  if (!gen && !ais && !ryt) return null
  const liste = v => v ? v.replace(/[\[\]]/g, '').split(/[,;/]|\bet\b/).map(x => x.trim()).filter(Boolean) : []
  const n = ais ? parseInt((ais.match(/[0-3]/) || [])[0], 10) : NaN
  const rythmes = liste(ryt).map(x => x.toLowerCase()).filter(x => ['lent', 'moyen', 'rapide'].includes(x))
  const generations = liste(gen).map(x => { const u = x.replace(/s$/i, '').toUpperCase(); return u === 'BOOMER' ? 'Boomers' : u }).filter(x => ['Z', 'Y', 'X', 'Boomers'].includes(x))
  return { generation: generations[0] || null, generations, aisanceNumerique: Number.isFinite(n) ? n : null, rythmes, humour: hum ? hum.replace(/[\[\]]/g, '').trim().toLowerCase() : null }
}

function lireAngles(txt) {
  const t = String(txt || '')
  const re = /^[#*\s]*Angle\s+(\d+)\s*[—-]\s*([^\n*]+?)[*\s]*$/gmi
  const heads = []; let m
  while ((m = re.exec(t))) heads.push({ numero: parseInt(m[1], 10), nom: m[2].trim(), debut: m.index, finEntete: re.lastIndex })
  const angles = []
  heads.forEach((h, i) => {
    const fin = i + 1 < heads.length ? heads[i + 1].debut : t.length
    const bloc = t.slice(h.finEntete, fin)
    const fac = (bloc.match(/Facette rattach[ée]e\s*[:—-]\s*([^\n]+)/i) || [])[1]
    const raisons = []
    for (let k = 1; k <= 3; k++) { const r = bloc.match(new RegExp('Raison\\s*' + k + '\\s*:\\s*([^\\n]*?)(?=\\s*·\\s*Raison\\s*' + (k + 1) + '\\s*:|\\n|$)', 'i')); raisons.push(r ? r[1].replace(/[\[\]]/g, '').trim() : null) }
    angles.push({ id: 'A' + h.numero, numero: h.numero, nom: h.nom, facette: fac ? fac.replace(/[\[\]]/g, '').trim() : null, raisons: raisons.filter(Boolean).length === 3 ? raisons : (raisons.some(Boolean) ? raisons : []), complet: raisons.filter(Boolean).length === 3 })
  })
  // dédoublonnage (un angle peut être cité dans S10 avec le même en-tête) : on garde la première occurrence qui porte des raisons
  const vus = new Map(); angles.forEach(a => { const p = vus.get(a.numero); if (!p || (!p.complet && a.complet)) vus.set(a.numero, a) })
  return [...vus.values()].sort((a, b) => a.numero - b.numero)
}

// Diagnostic : l'hypothèse est-elle de la nouvelle génération (S1d + champ 17) ou faut-il la restructurer sans rescrapper ?
function diagnostic(txt) {
  const mat = lireMaturite(txt), ang = lireAngles(txt)
  const sansRaisons = ang.filter(a => !a.complet).map(a => a.numero)
  return { nbAngles: ang.length, maturite: !!mat, anglesSansRaisons: sansRaisons, aMigrer: !mat || sansRaisons.length > 0 }
}
module.exports = { lireMaturite, lireAngles, diagnostic }
