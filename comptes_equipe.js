// comptes_equipe.js — v1 (22 nov. 2026)
// Les comptes de l'équipe AdStack (tests, démo, administration) ne sont pas des clients :
// leurs achats ne sont jamais comptés comme du revenu, ni dans la Finance, ni dans les Transactions, ni dans les Clients.
// Pour en ajouter un sans toucher au code : variable d'environnement COMPTES_EQUIPE sur Render (emails séparés par des virgules).
'use strict';

const LISTE = [
  'amarbirane.diaw@unchk.edu.sn',
  'amarbiranediaw@gmail.com',
  'thefirstquality01@gmail.com',
];

function emails() {
  const extra = String(process.env.COMPTES_EQUIPE || '').split(/[,;\s]+/);
  return new Set([...LISTE, ...extra].map((e) => String(e || '').trim().toLowerCase()).filter((e) => e.includes('@')));
}

// Identifiants des comptes de l'équipe (les anciennes transactions n'ont pas d'email, seulement user_id). Gardés 10 minutes.
let cache = { t: 0, ids: null };
async function ids(supabaseUrl, cleService) {
  if (cache.ids && Date.now() - cache.t < 600000) return cache.ids;
  const E = emails(), out = new Set();
  try {
    const r = await fetch(`${supabaseUrl}/auth/v1/admin/users?per_page=1000`, { headers: { apikey: cleService, Authorization: `Bearer ${cleService}` } });
    const j = await r.json();
    (j.users || j || []).forEach((u) => { if (u && u.id && E.has(String(u.email || '').toLowerCase())) out.add(u.id); });
    cache = { t: Date.now(), ids: out };
  } catch (e) { console.log('[comptes équipe] lecture des comptes impossible :', e.message); if (cache.ids) return cache.ids; }
  return out;
}

// Une ligne (transaction, abonnement, client) appartient-elle à l'équipe ?
function estEquipe(ligne, idsEquipe) {
  if (!ligne) return false;
  if (ligne.user_id && idsEquipe && idsEquipe.has(ligne.user_id)) return true;
  return emails().has(String(ligne.email || '').toLowerCase());
}

module.exports = { emails, ids, estEquipe };
