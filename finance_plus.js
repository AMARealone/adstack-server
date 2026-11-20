// finance-v2 — coût de chaque production, moyenne par lot et par offre, marge par client, et dépenses rangées par usage.
// Module séparé de serveur.js : il lit les mêmes tables (api_usage_log, couts_externes, transactions) et les commandes.
// Rien n'est écrit ici. Tant que finance_v2.sql n'a pas été exécuté (colonnes commande_id), seules les vidéos sont rattachées à leur commande.

const OFFRES = { starter: 'PERF+', pro: 'GROWTH', scale: 'SCALE', oneshot: 'ONE SHOT', one_shot: 'ONE SHOT', test: 'ONE SHOT' };
const LOTS_MOIS = { starter: 4, pro: 8, scale: 16 };
const R = (v) => Math.round((Number(v) || 0) * 1e4) / 1e4;

// Poste d'un appel IA (à quoi il a servi dans la production)
function poste(type) {
  const t = String(type || '');
  if (/^analyste|^trends_|^lecture_document|^lecture_capture|^apparence_cible/.test(t)) return 'analyse';
  if (/^copywriter/.test(t)) return 'copies';
  if (/video/i.test(t)) return 'video';
  if (/^creative_|^selection_ct|^aspects|^photo|^generation_image|^assemblage_|^verification_|^analyse_photo|^background_removal/.test(t)) return 'images';
  return 'autre';
}
// Usage d'une dépense IA : la case dans laquelle elle est rangée
function usageApi(r) {
  const s = String(r.source || ''), t = String(r.type_appel || '');
  if (s === 'agent_test' || /_test$/.test(t)) return 'tests';
  if (r.commande_id) return 'production';
  if (s === 'prospecteur') return 'prospection';
  if (s === 'production' || /_prod$/.test(t)) return 'production';
  if (s === 'demo' || /demo|^fetch_product_info$|^persona_portrait$|^chat|ava|^quiz/.test(t)) return 'site';
  return 'interne';
}
function usageExt(r, cmd) {
  if (cmd) return 'production';
  const o = String(r.origine || ''), f = String(r.fournisseur || '');
  if (o === 'prospecteur') return 'prospection';
  if (o === 'adboard' || o === 'adstats') return 'site';
  if (f === 'analyse_ct') return 'bibliotheque';
  if (/test/i.test(f + ' ' + (r.ref || ''))) return 'tests';
  if (o === 'factory') return 'production';
  return 'interne';
}
const LIBELLES = { production: 'Production client', tests: 'Tests des agents', prospection: 'Prospection', site: 'Site et chatbot', bibliotheque: 'Bibliothèque de CT', interne: 'Interne et divers' };

async function productions(deps, du, au) {
  const { lire, jourSuivant, loadBriefs, taux } = deps;
  const fen = 'created_at=gte.' + du + 'T00:00:00Z&created_at=lt.' + jourSuivant(au) + 'T00:00:00Z';
  let api = await lire('api_usage_log', 'select=source,type_appel,cout_usd,commande_id,created_at&' + fen + '&order=created_at.asc');
  let colonnes = true;
  if (api.absente) { colonnes = false; api = await lire('api_usage_log', 'select=source,type_appel,cout_usd,created_at&' + fen + '&order=created_at.asc'); }
  let ext = await lire('couts_externes', 'select=fournisseur,origine,cout_usd,commande_id,ref,detail,created_at&' + fen + '&order=created_at.asc');
  if (ext.absente) ext = await lire('couts_externes', 'select=fournisseur,origine,cout_usd,ref,detail,created_at&' + fen + '&order=created_at.asc');
  const tx = await lire('transactions', 'select=user_id,montant_fcfa,montant_net_fcfa,commission_chariow_fcfa,plan,created_at&' + fen + '&order=created_at.asc');
  let briefs = []; try { briefs = (await loadBriefs()) || []; } catch (_) { briefs = []; }
  const parId = {}; briefs.forEach((b) => { if (b && b.id) parId[b.id] = b; });

  const usages = {}; Object.keys(LIBELLES).forEach((k) => { usages[k] = 0; });
  const cmds = {};
  const ligne = (id) => (cmds[id] = cmds[id] || { commande_id: id, total_usd: 0, postes: { analyse: 0, images: 0, copies: 0, video: 0, autre: 0 } });
  let nonRattache = 0;

  (api.rows || []).forEach((r) => {
    const u = Number(r.cout_usd) || 0, k = usageApi(r);
    usages[k] += u;
    if (r.commande_id && k === 'production') { const l = ligne(r.commande_id); l.total_usd += u; l.postes[poste(r.type_appel)] += u; }
    else if (k === 'production') nonRattache += u;
  });
  (ext.rows || []).forEach((r) => {
    const u = Number(r.cout_usd) || 0;
    const m = String(r.ref || '').match(/^video:([^:]+):/);
    const id = r.commande_id || (m && parId[m[1]] ? m[1] : null);
    const k = usageExt(r, id);
    usages[k] += u;
    if (id) { const l = ligne(id); l.total_usd += u; l.postes[r.fournisseur === 'moteur_video' ? 'video' : r.fournisseur === 'scrapecreators' ? 'analyse' : 'autre'] += u; }
    else if (k === 'production') nonRattache += u;
  });

  // Chaque commande avec son client, son offre et son coût
  const T = taux;
  const liste = Object.values(cmds).map((l) => {
    const b = parId[l.commande_id] || {}, c = b.client || {};
    const q = Number(b.quantity) || 6;
    return { commande_id: l.commande_id, produit: (b.product && b.product.nom) || 'Commande ' + String(l.commande_id).slice(0, 8), client: c.email || (c.user_id ? String(c.user_id).slice(0, 8) : '—'), user_id: c.user_id || null,
      plan: c.plan || '', offre: OFFRES[c.plan] || (c.plan ? String(c.plan).toUpperCase() : '—'), creatives: q, statut: b.status || '—', date: String(b.created_at || '').slice(0, 10),
      total_usd: R(l.total_usd), par_lot_de_6_usd: R(l.total_usd / (q / 6)), par_creative_usd: R(l.total_usd / q),
      postes: Object.keys(l.postes).map((p) => ({ poste: p, usd: R(l.postes[p]) })).filter((p) => p.usd > 0) };
  }).sort((a, b) => (b.date || '').localeCompare(a.date || '') || b.total_usd - a.total_usd);

  // Moyennes par offre (sur les lots réellement produits)
  const off = {};
  liste.forEach((l) => { const o = (off[l.plan || '?'] = off[l.plan || '?'] || { plan: l.plan, offre: l.offre, lots: 0, usd: 0, creatives: 0 }); o.lots += l.creatives / 6; o.usd += l.total_usd; o.creatives += l.creatives; });
  const parOffre = Object.values(off).map((o) => {
    const parLot = o.lots ? o.usd / o.lots : 0, lm = LOTS_MOIS[o.plan] || null;
    return { plan: o.plan, offre: o.offre, commandes: liste.filter((l) => (l.plan || '?') === (o.plan || '?')).length, cout_par_lot_usd: R(parLot), cout_par_creative_usd: R(o.creatives ? o.usd / o.creatives : 0), lots_par_mois: lm, cout_mensuel_plein_usd: lm ? R(parLot * lm) : null };
  }).sort((a, b) => b.commandes - a.commandes);

  // Marge par client : ce qu'il a payé (net de Chariow) moins ce que ses productions ont coûté, sur la période
  const cli = {};
  liste.forEach((l) => { if (!l.user_id) return; const c = (cli[l.user_id] = cli[l.user_id] || { user_id: l.user_id, client: l.client, offre: l.offre, commandes: 0, cout_usd: 0, revenu_net_usd: 0 }); c.commandes++; c.cout_usd += l.total_usd; });
  (tx.rows || []).forEach((t) => {
    const brut = Number(t.montant_fcfa) || 0;
    const comm = (t.commission_chariow_fcfa === null || t.commission_chariow_fcfa === undefined) ? brut * deps.commissionPct / 100 : (Number(t.commission_chariow_fcfa) || 0);
    const net = (t.montant_net_fcfa === null || t.montant_net_fcfa === undefined) ? brut - comm : (Number(t.montant_net_fcfa) || 0);
    if (!t.user_id) return;
    const c = (cli[t.user_id] = cli[t.user_id] || { user_id: t.user_id, client: String(t.user_id).slice(0, 8), offre: OFFRES[t.plan] || '—', commandes: 0, cout_usd: 0, revenu_net_usd: 0 });
    c.revenu_net_usd += net / T;
  });
  const emails = {}; briefs.forEach((b) => { const c = b && b.client; if (c && c.user_id && c.email) emails[c.user_id] = c.email; });
  const parClient = Object.values(cli).map((c) => ({ client: emails[c.user_id] || c.client, offre: c.offre, commandes: c.commandes, cout_usd: R(c.cout_usd), revenu_net_usd: R(c.revenu_net_usd), marge_usd: R(c.revenu_net_usd - c.cout_usd), marge_pct: c.revenu_net_usd > 0 ? Math.round((c.revenu_net_usd - c.cout_usd) / c.revenu_net_usd * 1000) / 10 : null }))
    .sort((a, b) => b.revenu_net_usd - a.revenu_net_usd || b.cout_usd - a.cout_usd);

  const totalLots = liste.reduce((s, l) => s + l.creatives / 6, 0), totalCmd = liste.reduce((s, l) => s + l.total_usd, 0);
  return {
    periode: { du, au }, version: 'finance-v2', colonnes_commande: colonnes,
    usages: Object.keys(LIBELLES).map((k) => ({ usage: k, libelle: LIBELLES[k], usd: R(usages[k]) })),
    production: { commandes: liste.length, lots: Math.round(totalLots * 10) / 10, total_usd: R(totalCmd), cout_moyen_par_lot_usd: totalLots ? R(totalCmd / totalLots) : null, non_rattache_usd: R(nonRattache) },
    par_offre: parOffre, par_client: parClient, commandes: liste.slice(0, 60),
  };
}

module.exports = { productions, usageApi, usageExt, poste, LIBELLES };
