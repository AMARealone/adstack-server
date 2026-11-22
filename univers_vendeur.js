// univers_vendeur.js — v1 (22 nov. 2026)
// CE QUE LA BOUTIQUE VEND AUTOUR DU PRODUIT.
// La page d'un produit seule ne dit pas à qui le vendeur s'adresse : un sachet de flocons d'avoine vendu par une épicerie
// et le même sachet vendu par une boutique de nutrition sportive ne s'achètent pas pour la même raison ni par les mêmes gens.
// Ce module lit l'accueil, le menu et le catalogue du site du vendeur et rend un bloc de DONNÉES BRUTES pour l'Analyste.
// Il ne conclut rien : il rapporte ce qui est écrit sur le site. C'est l'Analyste qui raisonne.
'use strict';

const nettoyer = s => String(s || '')
  .replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&#39;|&rsquo;|&apos;/g, '\'').replace(/&quot;/g, '"').replace(/&eacute;/g, 'é').replace(/&egrave;/g, 'è').replace(/&agrave;/g, 'à')
  .replace(/\s+/g, ' ').trim();

const uniques = (liste, max) => {
  const vus = new Set(), out = [];
  for (const x of liste) {
    const t = String(x || '').trim(); const k = t.toLowerCase();
    if (t.length < 2 || t.length > 90 || vus.has(k)) continue;
    vus.add(k); out.push(t); if (out.length >= max) break;
  }
  return out;
};

const avecDelai = (promesse, ms) => Promise.race([promesse, new Promise((_, rej) => setTimeout(() => rej(new Error('délai dépassé (' + Math.round(ms / 1000) + ' s)')), ms))]);

// Lecture de l'accueil : titre, description, menu, titres de sections, liens de rayons et de produits.
function lireAccueil(html, origine) {
  const titre = nettoyer((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1]);
  const description = nettoyer((html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) || html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) || [])[1]);
  const zonesMenu = [...html.matchAll(/<(nav|header)\b[\s\S]*?<\/\1>/gi)].map(m => m[0]).join(' ');
  const liens = zone => [...zone.matchAll(/<a\b[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi)].map(m => ({ href: m[1], texte: nettoyer(m[2]) })).filter(l => l.texte);
  const menu = uniques(liens(zonesMenu).map(l => l.texte), 60);
  const tous = liens(html);
  const memeSite = l => { try { return new URL(l.href, origine).origin === origine; } catch (_) { return false; } };
  const chemin = l => { try { return new URL(l.href, origine).pathname.toLowerCase(); } catch (_) { return ''; } };
  const rayons = uniques(tous.filter(l => memeSite(l) && /\/(collections?|categor[a-z]*|product-category|c|rayons?|boutique|shop)\/[^/]+\/?$/.test(chemin(l))).map(l => l.texte), 40);
  const produits = uniques(tous.filter(l => memeSite(l) && /\/(products?|produits?|p|item)\/[^/]+\/?$/.test(chemin(l))).map(l => l.texte), 40);
  const sections = uniques([...html.matchAll(/<h[1-3]\b[^>]*>([\s\S]*?)<\/h[1-3]>/gi)].map(m => nettoyer(m[1])), 30);
  const corps = nettoyer(html.replace(/<(nav|header|footer)\b[\s\S]*?<\/\1>/gi, ' ')).slice(0, 1800);
  return { titre, description, menu, rayons, produits, sections, corps };
}

// Catalogue public quand le site l'expose (boutiques Shopify : /products.json et /collections.json). Silencieux sinon.
async function lireCatalogue(origine, fetchRawHtml) {
  const out = { rayons: [], produits: [] };
  const lire = async chemin => { try { const t = await avecDelai(fetchRawHtml(origine + chemin), 15000); const j = JSON.parse(t); return j; } catch (_) { return null; } };
  const [c, p] = await Promise.all([lire('/collections.json?limit=100'), lire('/products.json?limit=100')]);
  if (c && Array.isArray(c.collections)) out.rayons = uniques(c.collections.map(x => x.title + (x.products_count != null ? ' (' + x.products_count + ' produit(s))' : '')), 60);
  if (p && Array.isArray(p.products)) out.produits = uniques(p.products.map(x => x.title + (x.product_type ? ' [' + x.product_type + ']' : '')), 80);
  return out;
}

async function universVendeur(lienProduit, fetchRawHtml) {
  let origine, chemin;
  try { const u = new URL(lienProduit); origine = u.origin; chemin = u.pathname; } catch (_) { return { texte: '', stats: { erreur: 'lien illisible' } }; }
  const stats = { site: origine, menu: 0, rayons: 0, produits: 0, erreur: null };
  let acc = null, cat = { rayons: [], produits: [] };
  try {
    const [html, c] = await Promise.all([
      avecDelai(fetchRawHtml(origine + '/'), 25000).catch(e => { stats.erreur = 'accueil : ' + e.message; return ''; }),
      lireCatalogue(origine, fetchRawHtml)
    ]);
    if (html && html.length > 500) acc = lireAccueil(html, origine);
    cat = c;
  } catch (e) { stats.erreur = e.message; }
  const rayons = uniques([...(cat.rayons || []), ...((acc && acc.rayons) || [])], 60);
  const produits = uniques([...(cat.produits || []), ...((acc && acc.produits) || [])], 80);
  stats.menu = acc ? acc.menu.length : 0; stats.rayons = rayons.length; stats.produits = produits.length;
  if (!acc && !rayons.length && !produits.length) return { texte: '', stats };
  let t = `### SOURCE — UNIVERS DU VENDEUR (accueil, menu et catalogue du site ${origine} — ce que ce vendeur vend AUTOUR du produit, relevé tel quel)\n`;
  t += `Page du produit sur ce site : ${chemin}\n`;
  if (acc && acc.titre) t += `Titre de l'accueil : ${acc.titre}\n`;
  if (acc && acc.description) t += `Description du site : ${acc.description}\n`;
  if (acc && acc.menu.length) t += `Menu du site (libellés exacts) : ${acc.menu.join(' · ')}\n`;
  if (rayons.length) t += `Rayons / catégories (libellés exacts) : ${rayons.join(' · ')}\n`;
  if (produits.length) t += `Autres produits vendus (${produits.length} relevé(s)) : ${produits.join(' · ')}\n`;
  if (acc && acc.sections.length) t += `Titres des sections de l'accueil : ${acc.sections.join(' · ')}\n`;
  if (acc && acc.corps) t += `Texte de l'accueil (début) : ${acc.corps}\n`;
  t += `Note de lecture : ce relevé est brut. Si ce site est une place de marché qui vend de tout, il décrit la place de marché et non le vendeur du produit.\n\n`;
  return { texte: t.slice(0, 9000), stats };
}

module.exports = { universVendeur, lireAccueil };
