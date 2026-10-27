// AdStack Video Lab — serveur autonome, zéro dépendance (Node 18+).
// VERSION v6.80-service-en-ligne — SERVICE EN LIGNE : dossier de travail (LAB_OUT), clé d'accès (LAB_KEY), origine autorisée (LAB_ORIGIN), /health, limite de productions simultanées (MAX_JOBS), état des productions conservé et relu au redémarrage, nettoyage après RETENTION_DAYS jours, copie de la vidéo finale dans Supabase (SUPABASE_URL + SUPABASE_SERVICE_KEY). Sans variable, comportement identique au labo local.
// VERSION v6.70 — PAGE PRODUIT, LOGO ET CALENDRIER : la vraie page du client (champ lien_page_produit) capturee et animee par le monteur, logo extrait de la page, calendrier dessine par le code ; declares dans les surimpressions du CT (page_produit, logo_permanent, calendrier), jamais inventes.
// VERSION v6.69 — PLANS DE COUPE ANIMES : chaque plan de coupe du CT est un clip muet de 4 s (Veo 3.1 Lite, ~0,12 $) pose sur la voix du montage, jamais une image fixe ; pas de budget = plan saute.
// VERSION v6.68 — L'ACCENT DE LA VOIX, PAS LA LONGUEUR DU MOT : quand le CT agrandit les mots importants, Flash designe les mots que la voix appuie (objet, lieu, idee, elements d'une enumeration) ; repli sur la regle de la longueur ; mesure sur la source CT014.
// VERSION v6.67 — SYMBIOSE DES SOUS-TITRES : le registre (police, mouvement) est choisi avec le style visuel, le ton, la persona et la categorie du client, pas seulement la destination.
// VERSION v6.66 — CARTE DE FIN PLEINE IMAGE dessinee par le monteur (marque, titre, photo du produit du client, garantie) quand le CT la decrit ; mesure sur les sources CT003 et CT008.
// VERSION v6.65 — SOUS-TITRES PAR DEFAUT SELON L'INTENTION DU CT : un CT d'UGC ou de temoignage qui ne decrit pas ses sous-titres recoit un style discret (phrase, casse de phrase, blanc, petit, ~76 %) au lieu du style generique.
// VERSION v6.64 — SOURCE CT007 MESUREE : texte natif (blanc simple, mi-hauteur) pour l'accroche d'un UGC en prise unique ; images d'incrustation explicitement photoreelles (Nano Banana) quand le film est en prise de vue reelle.
// VERSION v6.63 — SOURCE CT004 MESUREE : prise unique sans recadrage force (rythme >= 6 s), cartes du monteur : legende d'accroche, incrustation photo a plat, jauge de mecanisme, sticker d'allusion.
// VERSION v6.62 — INTENTION D'ABORD, FORME ENSUITE : chaque dispositif du CT est lu avec son intention psychologique puis juge pour le client (mot cle agrandi, rythme, geste...) ; temps de PREUVE refait en carte de donnees REELLES de la synthese (verifiees, jamais inventees).
// VERSION v6.61 — SOUS-TITRES A MOT CLE AGRANDI (CT014) : le CT peut dire que les mots importants sont ecrits beaucoup plus gros (`emphase_agrandie`), le monteur agrandit le mot le plus long de chaque groupe.
// VERSION v6.60 — INCRUSTATIONS DU CT DESSINEES PAR LE MONTEUR (carte de commentaire, pastille, chiffre, offre, contradiction, carte d'identite nom+titre, plans de coupe) ; base = video sans incrustations, repli = version ASS.
// VERSION v6.59 — SOURCE RYZE MESUREE (CT002) : recadrage multi-coupes au rythme du CT et sur les souffles de la parole, post-production lue dans le CT (musique comprise), debit de la source `mots_par_seconde` optionnel.
// VERSION v6.58 — ALIGNEMENT CT / SERVEUR / MONTEUR : mode de voix lu aussi dans la fiche du CT (CT015), controle de l'offre reellement execute, roles non requis lus dans le CT, arc rouge-vert subordonne au CT, sous-titres du monteur identiques a ceux de l'etape ASS.
// VERSION v6.57 — MONTEUR HYPERFRAMES : apres le montage ffmpeg, un re-montage dynamique (coupes accentuees, zooms, secousse, flash, etalonnage froid-chaud par role, bandeau offre/appel, sous-titres animes), generique a tout CT, repli automatique sur le montage ffmpeg.
// VERSION v6.56 — UN MODELE PAR FAMILLE DE TACHES : ecriture Gemini 3.1 Pro, controles Gemini 3 Flash, images sans produit Nano Banana 2.1, images avec produit Gemini 3 Pro Image, voix off Eleven v3 ; repli automatique ; partition de mouvement precise pour les plans muets.
// VERSION v6.56 — GET /competence (lecture seule, pour Factory).
// VERSION v6.55 — PV55 : une pub qui vend finit par vendre (offre puis appel, copy sniper, arc rouge-vert, mouvement franc, queue de chanson sans fondu).
// VERSION v6.54 — LA SYMBIOSE (PV53) : une boussole sensorielle (destination du produit, registre, energie, tempo, arc, voix, musique, jeu, camera, lumiere, montage, sous-titres, miroir du persona) est fixee avant tout et pilote chaque etape ; le CT donne la mecanique, jamais le registre (PV54).
// VERSION v6.55 — PILOTAGE PAR FACTORY : accès autorisé depuis Factory (CORS), archivage de chaque image avant qu'elle soit refaite (dossier versions), entrées enregistrées avec la photo produit, export de tout l'historique d'une production en un seul fichier JSON (GET /pipe/<id>/historique, avec ou sans images).
// VERSION v6.54 — ASPECTS DU PRODUIT : la planche de 4 plans ne recoit plus qu'UNE image produit, assemblee par le code a partir des aspects utiles a CES 4 plans (face, dos, cote, contenu, en main, detail ; 4 vues au plus) ; photos facultatives en plus de la photo principale.
// VERSION v6.53 — LA PARTITION EMOTIONNELLE (PV52) : chaque plan porte role, intention, emotion jouee, cadrage et rendu ; le controle exige signes touches, proche, resultat promis MONTRE, vie avec les siens, preuves montrees ; INSERTS graphiques (preuves, composants, carte, laboratoire) concus par le modele d'image et animes par le code, sans Veo ; chanson calee sur la duree de la video (38 s) ; prompt Veo court, action d'abord ; emotion jouee fort ; planche 2K ; sous-titres : graisse, emojis et surlignage lus dans le CT, groupes coupes aux plans ; mesure du mouvement en parallele.
// VERSION v6.52 — MINI-PLANS (CT voix off / chanson) : clips Veo de 4 s dont le montage garde le moment le plus vivant, un geste par plan, ~2,5 s par plan, duree <= 40 s ; Veo ne change jamais de scene dans une prise (contrôle + nettoyage) ; aucun texte, carte, surimpression ni effet magique demande a Veo ; emotion lisible dans l'image de depart ; planches 2..N en parallele ; plus de re-encodage avant montage ; sous-titres du CT enfin lus.
// VERSION v6.51 — BUDGET : plus d'arret avant Veo quand ca rentre (ElevenLabs compte une fois, plafond reel = budget), TENUE PAR LIEU, retouche ciblee d'un panneau (pose / tenue) au lieu de refaire la grille, style d'objet non bloquant.
// VERSION v6.50 — UNE IMAGE PAR CLIP AU-DELÀ DE 4 CLIPS (la consigne « 4 maximum » n'était pas adaptée : un CT de 5 à 9 clips partageait ses images et repartait de la même pose), PAROLIER (une chanson est écrite en vers + refrain, contrôlé par le code), le prompt Veo ne demande plus de surimpression, débit affiché sur la vraie durée ; v6.49 : INCRUSTATIONS DU CT posées au montage (cartes, prix, contradiction : texte gratuit ; photos de preuve et plans de coupe : image Gemini ~0,15 $, plafonnée) ; v6.48 : PLAFOND 9 CLIPS (72 s) ; CHANSON PAR CHUNKS (music_v2_5) ; MODE CHANSON (CT dont la ligne Voix contient « chanson » : ElevenLabs Music chante les paroles du copywriter, une section par bloc, minutage par alignement forcé ou Scribe, Veo muet, aucun lit musical, jamais accélérée) ; v6.47 : NOMBRE DE CLIPS VARIABLE (4 à 7 clips Lite de 8 s selon la « Durée cible » du CT, borné par le budget ; planche en plusieurs grilles de 4 cases max, la 2e reçoit la 1re en référence d'identité) ; v6.46 : triage produit au regard de téléphone, budget connu du réalisateur ; v6.45 : compteur de coût (Google + ElevenLabs mesuré), plafond de budget, sous-titres lus dans le CT ; v6.43 : voix jamais coupée (réquilibrage sur temps mesuré, vitesse, queue), packshot≠scène, parole empruntée, relecteur de cohérence ; v6.32 : CT a VOIX OFF (ElevenLabs TTS minutee au caractere, Veo muet, montage cale sur la voix) ; v6.30 : la langue de sortie vient de la SYNTHESE et non plus du code ; recoupe des clips sur la parole, compression du texte, musique +8 %, sous-titres à schéma imposé.
// Lancer :  GOOGLE_CREDENTIALS='{...json compte de service...}' node lab_server.js
//  ou :     GOOGLE_APPLICATION_CREDENTIALS=chemin/cle.json node lab_server.js
const http = require('http'), fs = require('fs'), path = require('path'), crypto = require('crypto');
// v6.39 — FFMPEG NE BLOQUE PLUS LE SERVEUR. Les appels etaient SYNCHRONES : pendant le montage, le mixage et
// l'incrustation des sous-titres — plusieurs dizaines de secondes chacun — Node ne repondait a AUCUNE requete.
// La page restait a tourner, les lecteurs video ne chargeaient rien, et la production paraissait bloquee alors
// qu'elle avancait. Tout passe desormais par une promesse : le serveur continue de servir pendant l'encodage.
const _execFile = require('child_process').execFile;
const sh = (bin, args, timeout) => new Promise((res, rej) => {
  _execFile(bin, args, { maxBuffer: 64 * 1024 * 1024, timeout: timeout || 1800000, windowsHide: true }, (e, so, se) => {
    if (e) { e.message = String(e.message || e).slice(0, 200) + ' :: ' + String(se || '').slice(-300); return rej(e); }
    res(String(so || '') + String(se || ''));
  });
});
// ───────── PNG sans dépendance : décodage 8 bits (RGB/RGBA, non entrelacé), redimensionnement bilinéaire, encodage.
// Sert à découper la PLANCHE de référence (une seule image 2x2) en 4 images de décor : l'identité des personnages
// est garantie par construction, puisque les 4 décors sont dessinés dans la même génération.
const zlib = require('zlib');
const _CRCT = (() => { const t = new Int32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1); t[n] = c; } return t; })();
const _crc32 = b => { let c = -1; for (let i = 0; i < b.length; i++) c = _CRCT[(c ^ b[i]) & 0xFF] ^ (c >>> 8); return (c ^ -1) >>> 0; };
function pngDecode(buf) {
  if (buf.length < 8 || buf.readUInt32BE(0) !== 0x89504E47) throw new Error('pas un PNG');
  let off = 8, ihdr = null; const idat = [];
  while (off + 8 <= buf.length) {
    const len = buf.readUInt32BE(off), typ = buf.toString('ascii', off + 4, off + 8), d = buf.slice(off + 8, off + 8 + len);
    if (typ === 'IHDR') ihdr = { w: d.readUInt32BE(0), h: d.readUInt32BE(4), depth: d[8], color: d[9], interlace: d[12] };
    else if (typ === 'IDAT') idat.push(d);
    else if (typ === 'IEND') break;
    off += 12 + len;
  }
  if (!ihdr) throw new Error('IHDR manquant');
  if (ihdr.depth !== 8 || ihdr.interlace !== 0 || (ihdr.color !== 2 && ihdr.color !== 6)) throw new Error('PNG non géré (depth ' + ihdr.depth + ', color ' + ihdr.color + ')');
  const bpp = ihdr.color === 6 ? 4 : 3, stride = ihdr.w * bpp, raw = zlib.inflateSync(Buffer.concat(idat)), out = Buffer.alloc(ihdr.h * stride);
  let p = 0;
  for (let y = 0; y < ihdr.h; y++) {
    const ft = raw[p++], line = raw.slice(p, p + stride); p += stride;
    const cur = out.slice(y * stride, (y + 1) * stride), prev = y ? out.slice((y - 1) * stride, y * stride) : null;
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? cur[x - bpp] : 0, b = prev ? prev[x] : 0, c = (prev && x >= bpp) ? prev[x - bpp] : 0;
      let v = line[x];
      if (ft === 1) v += a; else if (ft === 2) v += b; else if (ft === 3) v += (a + b) >> 1;
      else if (ft === 4) { const pa = Math.abs(b - c), pb = Math.abs(a - c), pc = Math.abs(a + b - 2 * c); v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c); }
      cur[x] = v & 0xFF;
    }
  }
  return { w: ihdr.w, h: ihdr.h, bpp, data: out };
}
function pngEncode(im) {
  const stride = im.w * im.bpp, raw = Buffer.alloc(im.h * (stride + 1));
  for (let y = 0; y < im.h; y++) { raw[y * (stride + 1)] = 0; im.data.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride); }
  const chunk = (typ, d) => { const b = Buffer.alloc(12 + d.length); b.writeUInt32BE(d.length, 0); b.write(typ, 4, 'ascii'); d.copy(b, 8); b.writeUInt32BE(_crc32(b.slice(4, 8 + d.length)), 8 + d.length); return b; };
  const ih = Buffer.alloc(13); ih.writeUInt32BE(im.w, 0); ih.writeUInt32BE(im.h, 4); ih[8] = 8; ih[9] = im.bpp === 4 ? 6 : 2;
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]), chunk('IHDR', ih), chunk('IDAT', zlib.deflateSync(raw, { level: 6 })), chunk('IEND', Buffer.alloc(0))]);
}
function pngCrop(im, x0, y0, w, h) {
  const stride = im.w * im.bpp, qs = w * im.bpp, out = Buffer.alloc(h * qs);
  for (let y = 0; y < h; y++) im.data.copy(out, y * qs, (y0 + y) * stride + x0 * im.bpp, (y0 + y) * stride + x0 * im.bpp + qs);
  return { w, h, bpp: im.bpp, data: out };
}
function pngScale(im, w, h) { // bilinéaire : remonte un quadrant à la définition attendue par Veo
  const out = Buffer.alloc(w * h * im.bpp), sx = im.w / w, sy = im.h / h, st = im.w * im.bpp;
  for (let y = 0; y < h; y++) {
    const fy = Math.min(im.h - 1, (y + 0.5) * sy - 0.5), y0 = Math.max(0, Math.floor(fy)), y1 = Math.min(im.h - 1, y0 + 1), wy = fy - y0;
    for (let x = 0; x < w; x++) {
      const fx = Math.min(im.w - 1, (x + 0.5) * sx - 0.5), x0 = Math.max(0, Math.floor(fx)), x1 = Math.min(im.w - 1, x0 + 1), wx = fx - x0;
      for (let c = 0; c < im.bpp; c++) {
        const a = im.data[y0 * st + x0 * im.bpp + c], b = im.data[y0 * st + x1 * im.bpp + c], d = im.data[y1 * st + x0 * im.bpp + c], e = im.data[y1 * st + x1 * im.bpp + c];
        out[(y * w + x) * im.bpp + c] = Math.round((a * (1 - wx) + b * wx) * (1 - wy) + (d * (1 - wx) + e * wx) * wy);
      }
    }
  }
  return { w, h, bpp: im.bpp, data: out };
}
// ───────── Découpe d'une planche en cellules. Générique : n'importe quelle grille (rows x cols), n'importe quel CT.
// Un modèle d'image dessine parfois un liseré entre les panneaux ou un cadre autour de la planche : on le détecte
// (une colonne ou une ligne d'une seule couleur sur TOUTE la hauteur ou la largeur de la planche ne peut pas être
// du décor) et on découpe à l'intérieur, puis chaque cellule est remise au format nominal de la grille.
function _uni(im, i, vertical) {
  const st = im.w * im.bpp, n = vertical ? im.h : im.w;
  const o0 = vertical ? i * im.bpp : i * st;
  const r = im.data[o0], g = im.data[o0 + 1], b = im.data[o0 + 2];
  for (let k = 1; k < n; k++) {
    const o = vertical ? k * st + i * im.bpp : i * st + k * im.bpp;
    if (Math.abs(im.data[o] - r) > 8 || Math.abs(im.data[o + 1] - g) > 8 || Math.abs(im.data[o + 2] - b) > 8) return false;
  }
  return true;
}
function _bande(im, centre, vertical, marge) { // étendue du séparateur autour d'une ligne de partage (vide s'il n'y en a pas)
  const taille = vertical ? im.w : im.h;
  let c = -1;
  for (let d = 0; d <= marge && c < 0; d++) { if (_uni(im, centre - d, vertical)) c = centre - d; else if (_uni(im, centre + d, vertical)) c = centre + d; }
  if (c < 0) return null;
  let a = c, b = c;
  while (a - 1 >= 0 && c - (a - 1) <= marge * 2 && _uni(im, a - 1, vertical)) a--;
  while (b + 1 < taille && (b + 1) - c <= marge * 2 && _uni(im, b + 1, vertical)) b++;
  return { a, b };
}
// CONTROLES=1 rallume les contrôles de diagnostic (juges LLM, audit, QA vidéo). Par défaut ils sont éteints :
// ils n'ont jamais corrigé une sortie, ils ne faisaient qu'allonger chaque production.
const CONTROLES = process.env.CONTROLES === '1';
const VIDEO_RATIO = 9 / 16;   // format de sortie du lab : chaque image de décor est recadrée à ce format, quelle que soit la planche rendue
function pngPanels(buf, rows, cols, minW, ratioCible) {
  const im = pngDecode(buf);
  let x0 = 0, y0 = 0, x1 = im.w, y1 = im.h;
  const mx = Math.max(2, Math.round(im.w * 0.04)), my = Math.max(2, Math.round(im.h * 0.04));
  while (x0 < mx && _uni(im, x0, true)) x0++;                    // cadre éventuel autour de la planche
  while (x1 - 1 > im.w - mx && _uni(im, x1 - 1, true)) x1--;
  while (y0 < my && _uni(im, y0, false)) y0++;
  while (y1 - 1 > im.h - my && _uni(im, y1 - 1, false)) y1--;
  const bornes = (deb, fin, n, vertical, marge) => { // bornes de chaque cellule le long d'un axe, séparateurs retirés
    const out = []; const pas = (fin - deb) / n;
    for (let k = 0; k < n; k++) {
      let a = Math.round(deb + k * pas), b = Math.round(deb + (k + 1) * pas);
      if (k > 0) { const s = _bande(im, Math.round(deb + k * pas), vertical, marge); if (s) a = Math.max(a, s.b + 1); }
      if (k < n - 1) { const s = _bande(im, Math.round(deb + (k + 1) * pas), vertical, marge); if (s) b = Math.min(b, s.a); }
      out.push([a, Math.max(a + 1, b)]);
    }
    return out;
  };
  const cx = bornes(x0, x1, cols, true, Math.max(2, Math.round(im.w * 0.02)));
  const cy = bornes(y0, y1, rows, false, Math.max(2, Math.round(im.h * 0.02)));
  const ratio = ratioCible || (im.w / cols) / (im.h / rows);     // format visé pour chaque cellule (le modèle peut rendre une planche d'un autre format que demandé)
  const lw = Math.max(minW || 0, Math.round(im.w / cols)), lh = Math.round(lw / ratio);
  const out = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    let cel = pngCrop(im, cx[c][0], cy[r][0], cx[c][1] - cx[c][0], cy[r][1] - cy[r][0]);
    const brut = cel.w + 'x' + cel.h;
    if (Math.abs(cel.w / cel.h - ratio) / ratio > 0.02) {        // recadrage centré au format visé si la cellule ne l'a pas
      const nw = Math.min(cel.w, Math.round(cel.h * ratio)), nh = Math.min(cel.h, Math.round(cel.w / ratio));
      cel = pngCrop(cel, Math.floor((cel.w - nw) / 2), Math.floor((cel.h - nh) / 2), nw, nh);
    }
    const fin2 = (cel.w === lw && cel.h === lh) ? cel : pngScale(cel, lw, lh);
    out.push({ w: fin2.w, h: fin2.h, png: pngEncode(fin2), brut });
  }
  return out;
}
const PROJECT_ID = process.env.PROJECT_ID || 'adstack-ecosystem-api';
const LOCATION = process.env.LOCATION || 'us-central1';
const PORT = process.env.PORT || 8787;
// SERVICE EN LIGNE : tout se règle par variables d'environnement, rien ne change en local (sans variable, le labo se comporte comme avant).
const EN_LIGNE = !!process.env.LAB_OUT;                                   // vrai quand le dossier de travail est un disque persistant (Render)
const OUT = process.env.LAB_OUT ? path.resolve(process.env.LAB_OUT) : path.join(__dirname, 'lab_out'); fs.mkdirSync(OUT, { recursive: true });
const LAB_KEY = String(process.env.LAB_KEY || '').trim();                  // clé d'accès : si elle est définie, toute demande doit la présenter
const LAB_ORIGINS = String(process.env.LAB_ORIGIN || '*').split(',').map(x => x.trim()).filter(Boolean);
const MAX_JOBS = parseInt(process.env.MAX_JOBS || '2', 10);                // productions simultanées au plus (mémoire et coût)
const RETENTION_DAYS = parseFloat(process.env.RETENTION_DAYS || '14');     // en ligne : les anciennes productions sont effacées du disque après ce délai (la vidéo finale reste dans Supabase)
const cleOk = (k) => { if (!LAB_KEY) return true; try { const a = Buffer.from(String(k || '')), b = Buffer.from(LAB_KEY); return a.length === b.length && require('crypto').timingSafeEqual(a, b); } catch (_) { return false; } };

// Tarifs indicatifs $/seconde (à vérifier dans la console Google Cloud, modifiables ici)
// v6.23 — la clé ElevenLabs se lit dans elevenlabs.key, à côté du serveur. Elle n'est donc plus à recoller
// à chaque démarrage, et elle ne voyage jamais dans lab_server.js.
(() => { try {
  if (!process.env.ELEVENLABS_API_KEY) {
    const f = path.join(__dirname, 'elevenlabs.key');
    if (fs.existsSync(f)) { const k = fs.readFileSync(f, 'utf8').trim(); if (k) process.env.ELEVENLABS_API_KEY = k; }
  }
} catch (e) {} })();
const MODELS = {
  'veo-3.1-generate-001':      { label: 'Veo 3.1 Standard', usdPerSec: 0.40 },
  'veo-3.1-fast-generate-001': { label: 'Veo 3.1 Fast',     usdPerSec: 0.10 },
  'veo-3.1-lite-generate-001': { label: 'Veo 3.1 Lite',     usdPerSec: 0.05 },
  'veo-3.0-generate-001':      { label: 'Veo 3.0 Standard', usdPerSec: 0.40 },
  'veo-3.0-fast-generate-001': { label: 'Veo 3.0 Fast',     usdPerSec: 0.10 },
};

function creds() {
  if (process.env.GOOGLE_CREDENTIALS) return JSON.parse(process.env.GOOGLE_CREDENTIALS);
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) return JSON.parse(fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf8'));
  throw new Error('Aucune clé : définis GOOGLE_CREDENTIALS ou GOOGLE_APPLICATION_CREDENTIALS');
}
const cause = e => { const c = e && e.cause; return String(e.message || e) + (c ? ' [cause: ' + (c.code || '') + ' ' + (c.message || c) + (c.hostname ? ' host=' + c.hostname : '') + ']' : ''); };
async function rfetch(url, opt, tries = 4, msTimeout = 240000) {
  let last;
  for (let i = 0; i < tries; i++) {
    const ac = new AbortController(); const minuteur = setTimeout(() => ac.abort(), msTimeout);
    try { const rep2 = await fetch(url, { ...opt, signal: ac.signal }); clearTimeout(minuteur); return rep2; }
    catch (e) { clearTimeout(minuteur); last = new Error('Réseau : ' + cause(e) + ' (tentative ' + (i + 1) + '/' + tries + ') sur ' + String(url).split('?')[0].slice(0, 90)); console.log(last.message); await new Promise(s => setTimeout(s, 3000 * (i + 1))); }
  }
  throw last;
}
const b64u = b => Buffer.from(b).toString('base64url');
let tok = { v: null, exp: 0 };
async function getToken() {
  if (tok.v && Date.now() < tok.exp - 60000) return tok.v;
  const sa = creds(), now = Math.floor(Date.now() / 1000);
  const head = b64u(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64u(JSON.stringify({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/cloud-platform', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }));
  const sig = crypto.createSign('RSA-SHA256').update(head + '.' + claim).sign(sa.private_key, 'base64url');
  const r = await rfetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=' + head + '.' + claim + '.' + sig });
  const j = await r.json(); if (!j.access_token) throw new Error('Token: ' + JSON.stringify(j));
  tok = { v: j.access_token, exp: Date.now() + j.expires_in * 1000 }; return tok.v;
}
const base = m => `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${m}`;

const jobs = {}; // id -> {state, model, ...}
async function startJob(p) {
  const id = crypto.randomUUID().slice(0, 8);
  const dur = Number(p.durationSeconds || 8);
  const _coutStore = COUT_ALS.getStore();
  const job = jobs[id] = { id, model: p.model, state: 'running', t0: Date.now(), dur, estCost: +(dur * (MODELS[p.model]?.usdPerSec ?? 0)).toFixed(2), prompt: p.prompt };
  (async () => {
    try {
      const token = await getToken();
      const inst = { prompt: p.prompt };
      // v6.17 — « referenceImages » est la fonction d'images-ASSETS de Veo, que tous les modèles ne portent pas
      // (Veo 3.1 Lite la refuse). La PREMIÈRE IMAGE (instances[0].image), elle, est universelle, et c'est elle que
      // notre pipeline utilise de toute façon : avec Lite on bascule donc la première référence en première image.
      const liteModel = /lite/i.test(String(p.model || ''));
      if (p.refs && p.refs.length && !liteModel) inst.referenceImages = p.refs.map(r => ({ image: { bytesBase64Encoded: r.data, mimeType: r.mime || 'image/png' }, referenceType: 'asset' }));
      else if (p.firstFrame) inst.image = { bytesBase64Encoded: p.firstFrame.data, mimeType: p.firstFrame.mime || 'image/png' };
      else if (p.refs && p.refs.length) inst.image = { bytesBase64Encoded: p.refs[0].data, mimeType: p.refs[0].mime || 'image/png' };
      const params = { aspectRatio: p.aspectRatio || '9:16', durationSeconds: dur, sampleCount: 1, generateAudio: p.generateAudio !== false };
      if (p.resolution) params.resolution = p.resolution;
      if (p.negativePrompt) params.negativePrompt = p.negativePrompt;
      const body = { instances: [inst], parameters: params };
      const r = await rfetch(base(p.model) + ':predictLongRunning', { method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }, 4, 300000);
      const j = await r.json(); if (!r.ok) throw new Error(JSON.stringify(j).slice(0, 1500));
      job.op = j.name;
      let coupures = 0;
      for (let i = 0; i < 120; i++) {           // 120 x 10 s = 20 min max
        await new Promise(s => setTimeout(s, 10000));
        job.secsEnCours = Math.round((Date.now() - job.t0) / 1000);
        let pj;
        try { // le travail tourne déjà chez Google : une coupure réseau pendant le suivi ne doit pas l'annuler
          const t2 = await getToken();
          const pr = await rfetch(base(p.model) + ':fetchPredictOperation', { method: 'POST', headers: { Authorization: 'Bearer ' + t2, 'Content-Type': 'application/json' }, body: JSON.stringify({ operationName: j.name }) }, 2, 60000);
          pj = await pr.json();
        } catch (eP) { coupures++; job.reseau = coupures; if (coupures > 20) throw new Error('Réseau indisponible pendant le suivi du clip (' + coupures + ' coupures) : ' + String(eP.message || eP).slice(0, 120)); continue; }
        if (pj.done) {
          if (pj.error) throw new Error(JSON.stringify(pj.error));
          const v = (pj.response?.videos || pj.response?.generatedSamples || [])[0];
          if (!v) throw new Error('Pas de vidéo (filtre sécurité ?) ' + JSON.stringify(pj.response || {}).slice(0, 800));
          const file = `${id}_${p.model}.mp4`;
          if (v.bytesBase64Encoded) fs.writeFileSync(path.join(OUT, file), Buffer.from(v.bytesBase64Encoded, 'base64'));
          else throw new Error('Sortie en gcsUri (' + (v.gcsUri || '?') + ') : ajoute storageUri ou télécharge-la depuis GCS');
          job.file = file; job.state = 'done'; job.secs = Math.round((Date.now() - job.t0) / 1000);
          try { const tv = TARIFS.veo[p.model] || null; const audio = p.generateAudio !== false; const tps = tv ? (audio ? tv.audio : tv.muet) : (MODELS[p.model] || {}).usdPerSec; COUT_ALS.run(_coutStore, () => coutAjoute('veo', p.model, { secondes: dur, audio }, tps == null ? null : dur * tps, tv && (tv.estime || (!audio && tv.estime_muet)) ? { estime: true } : {})); } catch (eC) {}
          fs.appendFileSync(path.join(OUT, 'journal.jsonl'), JSON.stringify({ id, model: p.model, dur, estCost: job.estCost, secs: job.secs, file, prompt: p.prompt, at: new Date().toISOString() }) + '\n');
          return;
        }
      }
      throw new Error('Délai dépassé (20 min)');
    } catch (e) { job.state = 'error'; job.error = String(e.message || e); }
  })();
  return id;
}


// ───────── PIPELINE : synthèse + photo produit + CT  ->  plan -> images de réf -> clip 1 (8 s)
// v6.56 — UN MODELE PAR FAMILLE DE TACHES (decision du 25/10/2026). Ecriture et decision creative : Gemini 3.1 Pro ; controles et
// audits : Gemini 3 Flash ; images sans produit : Nano Banana 2.1 ; images avec produit ou etiquette : Gemini 3 Pro Image.
// Chaque famille se regle par variable (MODELE_ECRITURE, MODELE_CONTROLE, MODELE_IMAGE) et un modele indisponible sur le projet
// est remplace automatiquement par l'ancien (une ligne dans le journal), jamais d'arret de la production.
const MODELE_ECRITURE = (process.env.MODELE_ECRITURE || 'gemini-3.1-pro').trim();
const MODELE_CONTROLE = (process.env.MODELE_CONTROLE || 'gemini-3-flash').trim();
const MODELE_IMAGE_STD = (process.env.MODELE_IMAGE || 'gemini-nano-banana-2.1').trim();
const MODELE_IMAGE_PRO = 'gemini-3-pro-image';
const _REPLI_MODELES = new Map();   // modele -> raison (indisponible pour toute la session)
const imgPath = produit => `/v1/projects/${PROJECT_ID}/locations/global/publishers/google/models/${(produit || _REPLI_MODELES.has(MODELE_IMAGE_STD)) ? MODELE_IMAGE_PRO : MODELE_IMAGE_STD}:generateContent`;
const _indispo = msg => /not found|NOT_FOUND|does not exist|not supported|PERMISSION_DENIED|permission|404|unknown model|invalid model/i.test(String(msg || ''));
async function vjsonBrut(host, pathStr, body) {
  let last;
  for (let i = 0; i < 4; i++) {            // réessai automatique sur 429 / 5xx
    const token = await getToken();
    const r = await rfetch(`https://${host}${pathStr}`, { method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }, 3, 900000);
    const j = await r.json().catch(() => ({}));
    if (r.ok && !j.error) { coutGemini(pathStr, j); return j; }
    last = new Error(JSON.stringify(j.error || j).slice(0, 1500));
    last.statut = r.status;
    if (r.status === 429 || r.status >= 500) { await new Promise(s => setTimeout(s, 4000 * (i + 1))); continue; }
    throw last;
  }
  throw last;
}
async function vjson(host, pathStr, body) {
  const m = /models\/(gemini-2\.5-pro|gemini-2\.5-flash|gemini-nano-banana-2\.1|gemini-3-pro-image)(:|$)/.exec(pathStr);
  const ancien = m ? m[1] : null;
  let cible = ancien === 'gemini-2.5-pro' ? MODELE_ECRITURE : ancien === 'gemini-2.5-flash' ? MODELE_CONTROLE : null;
  // v6.77 — sur ce projet Vertex seuls les ids « -preview » de Gemini 3 / 3.1 répondent : on essaie l'id demandé, puis son « -preview », puis l'ancien modèle.
  if (cible && cible !== ancien && _REPLI_MODELES.has(cible) && !/preview/.test(cible) && !_REPLI_MODELES.has(cible + '-preview')) cible = cible + '-preview';
  if (!cible || cible === ancien || _REPLI_MODELES.has(cible)) return vjsonBrut(host, pathStr, body);
  // le nouveau modele ne sait pas desactiver sa reflexion (Pro) : un budget 0 est retire plutot que de provoquer une erreur 400
  let corps = body;
  try { const tc = body && body.generationConfig && body.generationConfig.thinkingConfig;
    if (tc && tc.thinkingBudget === 0 && /pro/i.test(cible)) { corps = JSON.parse(JSON.stringify(body)); delete corps.generationConfig.thinkingConfig; } } catch (e) {}
  try { return await vjsonBrut(host, pathStr.replace('models/' + ancien, 'models/' + cible), corps); }
  catch (e) {
    if (_indispo(e.message) || e.statut === 404 || e.statut === 403) {
      _REPLI_MODELES.set(cible, String(e.message).slice(0, 120));
      if (!/preview/.test(cible) && !_REPLI_MODELES.has(cible + '-preview')) {
        console.log('[modeles] ' + cible + ' indisponible sur ce projet → essai de ' + cible + '-preview.');
        try { return await vjsonBrut(host, pathStr.replace('models/' + ancien, 'models/' + cible + '-preview'), corps); }
        catch (e2) { if (_indispo(e2.message) || e2.statut === 404 || e2.statut === 403) _REPLI_MODELES.set(cible + '-preview', String(e2.message).slice(0, 120)); else if (e2.statut !== 400) throw e2; }
      }
      console.log('[modeles] ' + cible + ' indisponible sur ce projet (' + String(e.message).slice(0, 120) + ') → repli sur ' + ancien + ' pour toute la session.');
    } else if (e.statut === 400) {
      console.log('[modeles] ' + cible + ' a refusé cette requête (' + String(e.message).slice(0, 120) + ') → cet appel repasse sur ' + ancien + '.');
    } else throw e;
    return vjsonBrut(host, pathStr, body);
  }
}
// image : repli sur Pro si le modele standard echoue (indisponible ou refuse)
async function vjsonImage(host, pathStr, body) {
  try { return await vjson(host, pathStr, body); }
  catch (e) {
    if (pathStr.includes('/models/' + MODELE_IMAGE_STD + ':') && MODELE_IMAGE_STD !== MODELE_IMAGE_PRO && (e.statut === 400 || e.statut === 404 || e.statut === 403 || _indispo(e.message))) {
      if (!_REPLI_MODELES.has(MODELE_IMAGE_STD) && (e.statut === 404 || e.statut === 403 || _indispo(e.message))) _REPLI_MODELES.set(MODELE_IMAGE_STD, String(e.message).slice(0, 120));
      console.log('[modeles] ' + MODELE_IMAGE_STD + ' ne répond pas (' + String(e.message).slice(0, 100) + ') → cette image repasse sur ' + MODELE_IMAGE_PRO + '.');
      return vjson(host, pathStr.replace('/models/' + MODELE_IMAGE_STD + ':', '/models/' + MODELE_IMAGE_PRO + ':'), body);
    }
    throw e;
  }
}

// ───────── v6.44 — COMPTEUR DE COUT. Chaque appel payant est enregistre par production (AsyncLocalStorage : le contexte de la
// production suit tous ses appels, sans changer leur signature). On enregistre d'abord des QUANTITES exactes (tokens par
// type, secondes de Veo, caracteres de voix) puis des dollars = quantites x tarifs. Les tarifs sont dans tarifs_couts.json
// (modifiable sans toucher au code) : les quantites restent vraies meme si un tarif est faux, et se comparent au CSV de facturation.
const { AsyncLocalStorage } = require('async_hooks');
const COUT_ALS = new AsyncLocalStorage();
const TARIFS_DEFAUT = {
  _note: "USD. Veo : tarifs CALIBRES sur la facture d'octobre 2026 (688 s=86 clips de 8 s a 0,10 ; 424 s a 0,05 ; 96 s muet a 0,03 ; 8 s a 0,40). Tarifs marques estime:true = non verifies. Gemini : tarifs publics Vertex AI par million de tokens, a verifier sur la page de prix Google.",
  veo: {
    'veo-3.0-fast-generate-001': { audio: 0.10, muet: 0.10, estime_muet: true },
    'veo-3.0-generate-001':      { audio: 0.40, muet: 0.20, estime_muet: true },
    'veo-3.1-lite-generate-001': { audio: 0.05, muet: 0.03 },
    'veo-3.1-fast-generate-001': { audio: 0.15, muet: 0.10, estime: true },
    'veo-3.1-generate-001':      { audio: 0.40, muet: 0.20, estime: true }
  },
  gemini: {
    'gemini-2.5-pro':       { in: 1.25, out: 10, inHaut: 2.5, outHaut: 15, seuil: 200000, cache: 0.125 },
    'gemini-2.5-flash':     { in: 0.30, inAudio: 1.0, out: 2.5, cache: 0.03 },
    'gemini-3-pro-image':   { in: 2.0, out: 12, outImage: 120, cache: 0.2 },
    'gemini-3.1-pro':       { in: 2.0, out: 12, inHaut: 4.0, outHaut: 18, seuil: 200000, cache: 0.2 },
    'gemini-3-flash':       { in: 0.50, out: 3.0, cache: 0.05, estime: true },
    'gemini-nano-banana-2.1': { in: 0.50, out: 3.0, outImage: 45, cache: 0.05, estime: true },   // 0,0504 $ l'image 2K (1 120 jetons) ; entrees/reflexion non publiees : estimees
    'gemini-3-pro':         { in: 2.0, out: 12, cache: 0.2 }
  },
  elevenlabs: { usd_par_credit: 0.0001667, _note: "plan ElevenLabs a 5 $ pour 30 000 credits (confirme par le fondateur le 22/10/2026) : a corriger dans tarifs_couts.json si le plan change" }
};
let TARIFS = TARIFS_DEFAUT;
try {
  const ft = path.join(__dirname, 'tarifs_couts.json');
  if (fs.existsSync(ft)) { const u = JSON.parse(fs.readFileSync(ft, 'utf8')); TARIFS = { ...TARIFS_DEFAUT, ...u, veo: { ...TARIFS_DEFAUT.veo, ...(u.veo || {}) }, gemini: { ...TARIFS_DEFAUT.gemini, ...(u.gemini || {}) }, elevenlabs: { ...TARIFS_DEFAUT.elevenlabs, ...(u.elevenlabs || {}) } }; }
} catch (e) { console.log('tarifs_couts.json illisible, tarifs par defaut : ' + e.message); }
const HORS_PROD = { lignes: [], total: 0 };
function coutAjoute(famille, modele, q, usd, extra) {
  const store = COUT_ALS.getStore() || null;
  const cible = store ? (store._couts = store._couts || { lignes: [], total: 0 }) : HORS_PROD;
  const l = Object.assign({ at: new Date().toISOString(), famille, modele, q, usd: usd == null ? null : +usd.toFixed(5) }, extra || {});
  cible.lignes.push(l); if (usd) cible.total += usd;
  if (store) store.cout = Math.round(cible.total * 1000) / 1000;
  return l;
}
function coutGemini(pathStr, j) {
  try {
    const m = /models\/([^:\/]+)/.exec(pathStr); const modele = m ? m[1] : '?';
    const u = j && j.usageMetadata; if (!u) return;
    const cle = Object.keys(TARIFS.gemini).sort((a, b) => b.length - a.length).find(k => modele === k || modele.startsWith(k));
    const tf = cle ? TARIFS.gemini[cle] : null;
    const det = (arr, mod) => ((arr || []).find(x => String(x.modality).toUpperCase() === mod) || {}).tokenCount || 0;
    const inTot = u.promptTokenCount || 0, cache = u.cachedContentTokenCount || 0;
    const inAudio = det(u.promptTokensDetails, 'AUDIO');
    const outTexte = u.candidatesTokenCount || 0, pense = u.thoughtsTokenCount || 0;
    const outImg = det(u.candidatesTokensDetails, 'IMAGE');
    const q = { in: inTot, in_cache: cache, in_audio: inAudio, out_texte: Math.max(0, outTexte - outImg), out_image: outImg, reflexion: pense };
    let usd = null;
    if (tf) {
      const haut = tf.seuil && inTot > tf.seuil;
      const pin = (haut ? tf.inHaut : tf.in) || tf.in, pout = (haut ? tf.outHaut : tf.out) || tf.out;
      const inNorm = Math.max(0, inTot - cache - inAudio);
      usd = (inNorm * pin + inAudio * (tf.inAudio || pin) + cache * (tf.cache == null ? pin : tf.cache)) / 1e6
          + ((q.out_texte + pense) * pout + outImg * (tf.outImage || pout)) / 1e6;
    }
    coutAjoute('gemini', modele, q, usd, tf ? {} : { sans_tarif: true });
  } catch (e) {}
}
function coutResume(c) {
  const par = { veo: 0, gemini_texte: 0, gemini_image: 0, elevenlabs: 0 }; let sansTarif = 0, nbVeo = 0, secVeo = 0, car = 0, secMus = 0, secScr = 0;
  (c.lignes || []).forEach(l => {
    if (l.famille === 'veo') { par.veo += l.usd || 0; nbVeo++; secVeo += (l.q && l.q.secondes) || 0; }
    else if (l.famille === 'voix') { par.elevenlabs += l.usd || 0; car += (l.q && l.q.caracteres) || 0; }
    else if (l.famille === 'musique') secMus += (l.q && l.q.secondes) || 0;
    else if (l.famille === 'transcription') secScr += (l.q && l.q.secondes) || 0;
    else if (l.famille === 'gemini') { if (/image/.test(l.modele)) par.gemini_image += l.usd || 0; else par.gemini_texte += l.usd || 0; if (l.sans_tarif) sansTarif++; }
  });
  Object.keys(par).forEach(k => par[k] = +par[k].toFixed(3));
  return { par_poste_usd: par, clips_veo: nbVeo, secondes_veo: secVeo, caracteres_voix: car, secondes_musique: secMus, secondes_transcription: secScr, appels_gemini: (c.lignes || []).filter(l => l.famille === 'gemini').length, appels_sans_tarif: sansTarif };
}
// Solde de credits ElevenLabs (caracteres utilises sur la periode) : lu avant et apres chaque production, la difference
// est la consommation REELLE de la voix, de la musique et de la transcription, sans avoir a connaitre leurs conversions.
async function elSolde() {
  const k = process.env.ELEVENLABS_API_KEY; if (!k) return null;
  try {
    const r = await rfetch('https://api.elevenlabs.io/v1/user/subscription', { headers: { 'xi-api-key': k } }, 2, 15000);
    if (!r.ok) return null; const j = await r.json();
    return typeof j.character_count === 'number' ? { utilises: j.character_count, limite: j.character_limit } : null;
  } catch (e) { return null; }
}
async function coutFinal(P, log, save) {
  try {
    const c = P._couts || { lignes: [], total: 0 }; const r = coutResume(c); const pp = r.par_poste_usd;
    const ap = await elSolde(); let credits = null;
    if (P._elAvant && ap) credits = ap.utilises - P._elAvant.utilises;
    const upc = TARIFS.elevenlabs.usd_par_credit;
    if (credits != null && upc != null) pp.elevenlabs = +(credits * upc).toFixed(3);   // la mesure remplace l'estimation
    const total = +(pp.veo + pp.gemini_texte + pp.gemini_image + pp.elevenlabs).toFixed(3);
    const rapport = { production: P.id, duree_s: Math.round((Date.now() - P.t0) / 1000), total_usd: total, ...r, credits_elevenlabs_mesures: credits, solde_elevenlabs: ap, lignes: c.lignes };
    save('07_couts.json', rapport);
    fs.appendFileSync(path.join(OUT, 'couts_journal.jsonl'), JSON.stringify({ id: P.id, at: new Date().toISOString(), total_usd: total, ...r, credits_elevenlabs_mesures: credits }) + '\n');
    log('COUT estime de cette production : ' + total.toFixed(2) + ' $ (Veo ' + pp.veo.toFixed(2) + ' pour ' + r.clips_veo + ' clip(s) / ' + r.secondes_veo + ' s ; Gemini texte ' + pp.gemini_texte.toFixed(2) + ' ; images ' + pp.gemini_image.toFixed(2) + ' ; ElevenLabs ' + pp.elevenlabs.toFixed(2) + ' $'
      + (credits != null ? ' = ' + credits + ' credits mesures' : ' (solde illisible : estimation sur la voix seule ; ' + r.secondes_musique + ' s de musique et ' + r.secondes_transcription + ' s de transcription non chiffrees)') + '). Detail : 07_couts.json. A comparer a la facturation Google.');
    if (ap) log('Solde ElevenLabs : ' + ap.utilises + ' / ' + ap.limite + ' credits utilises sur la periode.');
    P.cout = total; P.cout_detail = pp;
  } catch (e) { try { log('Compteur de cout : ' + String(e.message || e).slice(0, 120)); } catch (_) {} }
}
// ───────── v6.49 — MOTEUR D'INCRUSTATIONS. Le plan declarait des `surimpressions` (cartes, prix, contradiction, photos de
// preuve) que le montage ne dessinait JAMAIS : elles etaient lues, verifiees, puis perdues. Ce moteur les pose au montage.

// ───────── v6.70 — PAGE PRODUIT ET LOGO DU CLIENT (champ « lien_page_produit » du brief, le meme que celui du serveur Render) ─────────
// La VRAIE page du client, capturee avec le Chrome/Edge du monteur (aucun service externe), puis lue par Flash pour trouver le bloc offre
// (titre, avis, avantages, prix, bouton) et la ligne de garantie. Rien n'est ecrit ni redessine : ce sont les pixels de la page.
async function capturerPageClient(url, dir, nom) {
  const { execFile } = require('child_process');
  const chrome = require('./monteur_hf.js').trouverChrome();
  const out = path.join(dir, nom + '_page_client.png');
  try { fs.unlinkSync(out); } catch (e) {}
  const args = ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--mute-audio', '--force-device-scale-factor=2', '--window-size=430,2600', '--virtual-time-budget=10000',
    '--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1', '--screenshot=' + out, url];
  if (process.platform === 'linux') args.unshift('--no-sandbox');
  await new Promise((res, rej) => execFile(chrome, args, { timeout: 70000 }, e => (fs.existsSync(out) && fs.statSync(out).size > 5000) ? res() : rej(e || new Error('capture vide'))));
  return out;
}
async function localiserBlocsPage(png) {
  const { execFileSync } = require('child_process');
  const small = png.replace(/\.png$/, '_s.jpg');
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', png, '-vf', 'scale=430:-2', '-q:v', '4', small]);
  const box = { type: 'OBJECT', nullable: true, properties: { x: { type: 'NUMBER' }, y: { type: 'NUMBER' }, w: { type: 'NUMBER' }, h: { type: 'NUMBER' } }, required: ['x', 'y', 'w', 'h'] };
  const g = await vjson(`${LOCATION}-aiplatform.googleapis.com`, `/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-2.5-flash:generateContent`, {
    contents: [{ role: 'user', parts: [{ text: 'Capture du haut d\'une page produit sur mobile. Toutes les coordonnees sont NORMALISEES entre 0 et 1 par rapport a l\'image ENTIERE (x, y = coin haut-gauche, w = largeur, h = hauteur). '
      + 'bloque = true si la page est un mur de cookies, un captcha, un acces refuse ou une page d\'erreur qui cache le produit. '
      + 'offre = le bloc LE PLUS COMPACT qui contient le titre du produit, les avis (etoiles) s\'il y en a, la liste d\'avantages, le prix et le bouton d\'achat ; il ne depasse jamais 55 % de la hauteur de l\'image ; null si tu ne le vois pas. '
      + 'garantie = la ligne ou la puce unique qui parle de garantie, de remboursement ou de satisfait ou rembourse ; null si aucune. Ne devine rien : null si absent.' }, { inlineData: { mimeType: 'image/jpeg', data: fs.readFileSync(small).toString('base64') } }] }],
    generationConfig: { temperature: 0.1, maxOutputTokens: 1200, thinkingConfig: { thinkingBudget: 0 }, responseMimeType: 'application/json', responseSchema: { type: 'OBJECT', properties: { bloque: { type: 'BOOLEAN' }, offre: box, garantie: box }, required: ['bloque'] } } });
  return JSON.parse(textOf(g));
}
function recadrerPageClient(png, loc) {
  const { execFileSync } = require('child_process');
  const pr = String(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', png])).trim().split(',').map(Number), W = pr[0], H = pr[1];
  if (!(W > 100 && H > 300)) throw new Error('capture trop petite');
  if (!loc || loc.bloque || !loc.offre) throw new Error('page non exploitable (mur de cookies, acces refuse ou bloc offre introuvable)');
  const cl = v => Math.max(0, Math.min(1, v));
  let y0 = cl(loc.offre.y - 0.012), y1 = cl(loc.offre.y + loc.offre.h + 0.012);
  if ((y1 - y0) * H < W * 0.9) { const mid = (y0 + y1) / 2, need = (W * 0.9) / H; y0 = cl(mid - need / 2); y1 = cl(mid + need / 2); }
  const ch = Math.round((y1 - y0) * H / 2) * 2, cy = Math.round(y0 * H);
  const out = png.replace(/\.png$/, '_crop.png');
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', png, '-vf', 'crop=' + W + ':' + ch + ':0:' + cy, out]);
  let hl = null;
  if (loc.garantie && loc.garantie.y >= y0 - 0.005 && loc.garantie.y + loc.garantie.h <= y1 + 0.005) hl = { x: cl(loc.garantie.x - 0.01), y: cl((loc.garantie.y - y0) / (y1 - y0) - 0.004), w: Math.min(1, loc.garantie.w + 0.02), h: Math.min(1, loc.garantie.h / (y1 - y0) + 0.008) };
  let fond = '#f7f4ee';
  try { const b = execFileSync('ffmpeg', ['-v', 'error', '-i', out, '-vf', 'crop=iw:4:0:0,scale=1:1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-']); if (b.length >= 3) fond = '#' + [b[0], b[1], b[2]].map(x => x.toString(16).padStart(2, '0')).join(''); } catch (e) {}
  return { fichier: out, hl, fond };
}
async function extraireLogoPage(url, dir, nom) {
  const hdr = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36', 'Accept': 'text/html,*/*' };
  const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), 20000);
  let html = '';
  try { const r = await fetch(url, { headers: hdr, signal: ctl.signal, redirect: 'follow' }); html = (await r.text()).slice(0, 400000); } finally { clearTimeout(to); }
  const abs = u => { try { return new URL(u, url).href; } catch (e) { return null; } };
  const cands = [];
  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try { const walk = o => { if (!o || typeof o !== 'object') return; if (o.logo) cands.push(typeof o.logo === 'string' ? o.logo : (o.logo.url || o.logo.contentUrl || '')); Object.values(o).forEach(walk); }; walk(JSON.parse(m[1])); } catch (e) {}
  }
  const og = html.match(/<meta[^>]+property=["']og:logo["'][^>]+content=["']([^"']+)["']/i); if (og) cands.push(og[1]);
  const head = html.slice(0, 60000);
  for (const m of head.matchAll(/<img[^>]+>/gi)) { const t = m[0]; if (/logo/i.test(t)) { const sm = t.match(/(?:data-src|src)=["']([^"']+)["']/i); if (sm && !/^data:/i.test(sm[1])) cands.push(sm[1]); } }
  const ap = html.match(/<link[^>]+rel=["'][^"']*apple-touch-icon[^"']*["'][^>]+href=["']([^"']+)["']/i); if (ap) cands.push(ap[1]);
  for (const c of cands.map(abs).filter(Boolean)) {
    try {
      const r = await fetch(c, { headers: hdr, redirect: 'follow' }); if (!r.ok) continue;
      const ct = String(r.headers.get('content-type') || ''); const ext = /svg/i.test(ct) ? 'svg' : /png/i.test(ct) ? 'png' : /webp/i.test(ct) ? 'webp' : /jpe?g/i.test(ct) ? 'jpg' : null;
      if (!ext) continue;
      const buf = Buffer.from(await r.arrayBuffer()); if (buf.length < 400 || buf.length > 3e6) continue;
      const f = path.join(dir, nom + '_logo_client.' + ext); fs.writeFileSync(f, buf); return f;
    } catch (e) {}
  }
  return null;
}


// ───────── v6.71 — FICHE REELLE DE LA PAGE DU CLIENT. La page porte ce que la synthese ne sait pas : nom exact du produit, prix et devise,
// garantie, dose et geste, matiere, couleurs de la marque, mentions d'etiquette, avis. Elle est lue SANS Flash (code seul : JSON-LD,
// balises meta, CSS, titres, phrases a mots-cles ; Chrome si la page est rendue par JavaScript) et ajoutee a la synthese comme une section
// « S10 — FAITS REELS » : l'agent, l'extracteur de bible, le controle de copywriting et la porte finale la lisent donc tous. Aucun fait
// n'est invente : une rubrique absente de la page est absente de la fiche.
async function ficheReellePage(url) {
  const hdr = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36', 'Accept': 'text/html,*/*', 'Accept-Language': 'fr,en;q=0.8' };
  let html = '';
  const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), 20000);
  try { const r = await fetch(url, { headers: hdr, signal: ctl.signal, redirect: 'follow' }); html = (await r.text()).slice(0, 900000); } catch (e) {} finally { clearTimeout(to); }
  const texteDe = h => h.replace(/<(script|style|noscript|svg)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
  if (texteDe(html).length < 1500) {
    try {
      const { execFile } = require('child_process'); const chrome = require('./monteur_hf.js').trouverChrome();
      const args = ['--headless=new', '--disable-gpu', '--no-first-run', '--virtual-time-budget=9000', '--dump-dom', url]; if (process.platform === 'linux') args.unshift('--no-sandbox');
      const dom = await new Promise((res, rej) => execFile(chrome, args, { timeout: 60000, maxBuffer: 20e6 }, (e, so) => so && so.length > 800 ? res(String(so)) : rej(e || new Error('dom vide'))));
      if (texteDe(dom).length > texteDe(html).length) html = dom.slice(0, 900000);
    } catch (e) {}
  }
  if (!html || html.length < 500) return null;
  const meta = (k) => { const m = html.match(new RegExp('<meta[^>]+(?:property|name)=["\']' + k + '["\'][^>]*content=["\']([^"\']*)["\']', 'i')) || html.match(new RegExp('<meta[^>]+content=["\']([^"\']*)["\'][^>]+(?:property|name)=["\']' + k + '["\']', 'i')); return m ? texteDe(m[1]) : ''; };
  const F = { url };
  F.titre = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1]; F.titre = F.titre ? texteDe(F.titre).slice(0, 160) : '';
  F.description = (meta('og:description') || meta('description')).slice(0, 400);
  F.site = meta('og:site_name');
  const prods = [];
  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try { const walk = o => { if (!o || typeof o !== 'object') return; if (Array.isArray(o)) return o.forEach(walk); const t = [].concat(o['@type'] || []).join(','); if (/Product/i.test(t)) prods.push(o); Object.values(o).forEach(walk); }; walk(JSON.parse(m[1])); } catch (e) {}
  }
  const pr = prods[0];
  if (pr) {
    F.nom = String(pr.name || '').slice(0, 140);
    F.marque = typeof pr.brand === 'string' ? pr.brand : (pr.brand && pr.brand.name) || '';
    const of = [].concat(pr.offers || [])[0] || {};
    const o2 = of.offers ? [].concat(of.offers)[0] : of;
    if (o2 && (o2.price || o2.lowPrice)) F.prix = (o2.price || o2.lowPrice) + ' ' + (o2.priceCurrency || '');
    if (pr.aggregateRating) F.note = (pr.aggregateRating.ratingValue || '') + '/5 sur ' + (pr.aggregateRating.reviewCount || pr.aggregateRating.ratingCount || '?') + ' avis';
    if (pr.description) F.descProduit = texteDe(String(pr.description)).slice(0, 500);
  }
  const cols = [];
  const tc = meta('theme-color'); if (/^#[0-9a-f]{3,8}$/i.test(tc)) cols.push({ c: tc.toLowerCase(), src: 'theme-color' });
  const css = (html.match(/<style[\s\S]*?<\/style>/gi) || []).join(' ').slice(0, 300000);
  for (const m of css.matchAll(/--([a-z0-9-]*(?:primary|accent|brand|main|cta|button)[a-z0-9-]*)\s*:\s*(#[0-9a-f]{3,8})\b/gi)) cols.push({ c: m[2].toLowerCase(), src: '--' + m[1] });
  const freq = {}; for (const m of (css + ' ' + html.slice(0, 200000)).matchAll(/#([0-9a-f]{6})\b/gi)) freq[m[1].toLowerCase()] = (freq[m[1].toLowerCase()] || 0) + 1;
  const vif = hx => { const r = parseInt(hx.slice(0, 2), 16), g = parseInt(hx.slice(2, 4), 16), b = parseInt(hx.slice(4, 6), 16); return (Math.max(r, g, b) - Math.min(r, g, b)) > 40; };
  Object.entries(freq).filter(([h]) => vif(h)).sort((a, b) => b[1] - a[1]).slice(0, 4).forEach(([h, n]) => cols.push({ c: '#' + h, src: 'frequente x' + n }));
  const vus = new Set(); F.couleurs = cols.filter(x => { const k = x.c.length === 4 ? '#' + x.c[1] + x.c[1] + x.c[2] + x.c[2] + x.c[3] + x.c[3] : x.c; if (vus.has(k)) return false; vus.add(k); x.c = k; return true; }).slice(0, 5).map(x => x.c + ' (' + x.src + ')');
  const h = []; for (const m of html.matchAll(/<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/gi)) { const t = texteDe(m[2]); if (t.length > 3 && t.length < 160 && !h.includes(t)) h.push(t); if (h.length >= 14) break; }
  F.titres = h;
  const corps = texteDe(html.replace(/<(header|footer|nav)[\s\S]*?<\/\1>/gi, ' '));
  const phrases = corps.split(/(?<=[.!?])\s+|\s{2,}|\s[•|·]\s/).map(x => x.trim()).filter(x => x.length >= 12 && x.length <= 220);
  const rub = [['garantie', /garanti|rembours|satisfait|guarantee|refund|money.?back/i], ['livraison', /livraison|exp[ée]di|shipping|delivery|livr[ée]/i], ['usage', /dose|mesure|cuill[eè]re|scoop|serving|par jour|per day|daily|mode d.emploi|how to use|saupoudr|verser|appliquer|apply|m[ée]langer/i], ['composition', /ingr[ée]dient|compos|contient|contains|extrait|extract|\bmg\b|vegan|bio\b|organic|sans (?:gluten|sucre)|gluten.?free|certifi/i], ['preuve', /[ée]tude|clinique|clinical|test[ée]|prouv|proven|dermatolog|v[ée]t[ée]rinaire|veterinar|laborato/i], ['variantes', /saveur|flavou?r|parfum|go[uû]t |variante|variant|coloris|couleur disponible|taille|size/i], ['format', /\b\d+\s?(?:g|kg|ml|l|oz|gélules|capsules|comprimés|doses|scoops|sachets)\b|net (?:wt|weight)|contenance|poids net/i]];
  F.rubriques = {};
  for (const [k, re] of rub) { const hits = []; for (const ph of phrases) { if (re.test(ph) && !hits.includes(ph)) hits.push(ph); if (hits.length >= 4) break; } if (hits.length) F.rubriques[k] = hits; }
  F.avis = []; for (const ph of phrases) { if (/^[«"“].{20,200}[»"”]/.test(ph) && F.avis.length < 3) F.avis.push(ph); }
  F.packaging = []; for (const m of html.matchAll(/<img[^>]+alt=["']([^"']{6,140})["'][^>]*>/gi)) { if (/pot|bo[iî]te|flacon|tube|pack|jar|bottle|box|pouch|sachet|packag|produit|product/i.test(m[1]) && F.packaging.length < 4 && !F.packaging.includes(m[1])) F.packaging.push(m[1]); }
  const og = meta('og:image'); F.image = og ? (() => { try { return new URL(og, url).href; } catch (e) { return ''; } })() : '';
  return F;
}
function fiche2texte(F) {
  if (!F) return '';
  const L = ['', '', '=== S10 — FAITS REELS LUS SUR LA PAGE DU CLIENT (' + F.url + ') ===',
    'Ces faits viennent de la page que le client a lui-meme fournie. Ils PRIMENT sur toute supposition : ce que la video montre ou dit du produit (nom, forme, couleur de la poudre ou de la creme, geste, dose, garantie, prix, certifications) doit les respecter. Un fait absent de cette section et de la synthese n\'est PAS un fait : on ne l\'invente pas, on ne le suggere pas. ATTENTION : un fait de la page ne donne PAS le droit de le dire — les interdits, la regle du niveau de conscience (prix et offre) et les mots interdits de la synthese restent appliques ; la page sert d\'abord a ne rien montrer ni dire de FAUX (forme, couleur, geste, garantie reelle), ensuite a personnaliser ce qui est autorise.'];
  if (F.nom || F.titre) L.push('Nom du produit : ' + (F.nom || F.titre));
  if (F.marque || F.site) L.push('Marque : ' + (F.marque || F.site));
  if (F.prix) L.push('Prix affiche : ' + F.prix);
  if (F.note) L.push('Avis : ' + F.note);
  if (F.description) L.push('Description de la page : ' + F.description);
  if (F.descProduit) L.push('Description produit : ' + F.descProduit);
  if (F.couleurs && F.couleurs.length) L.push('Couleurs de la marque (CSS reel) : ' + F.couleurs.join(', '));
  if (F.titres && F.titres.length) L.push('Titres de la page : ' + F.titres.join(' | '));
  for (const [k, v] of Object.entries(F.rubriques || {})) L.push('Page — ' + k + ' : ' + v.join(' // '));
  if (F.avis && F.avis.length) L.push('Avis clients cites : ' + F.avis.join(' // '));
  if (F.packaging && F.packaging.length) L.push('Packaging decrit par les images de la page : ' + F.packaging.join(' | '));
  return L.join('\n').slice(0, 6000);
}


// ───────── v6.72 — ETIQUETTE REELLE DU PRODUIT. Quand le CT montre un gros plan d'etiquette (sceau bio, mentions, composition), on ne le fait
// pas dessiner a un modele (il invente des lettres) : on recadre la VRAIE photo du produit fournie par le client, a l'endroit repere par
// Flash, et le monteur l'anime comme la page produit (entree en perspective, leger zoom). Pas de zone lisible repere = rien n'est pose.
async function recadrerEtiquetteReelle(prod, dir, nom) {
  const { execFileSync } = require('child_process');
  const ext = /png/i.test(prod.mime || '') ? 'png' : /webp/i.test(prod.mime || '') ? 'webp' : 'jpg';
  const src = path.join(dir, nom + '_photo_produit.' + ext); fs.writeFileSync(src, Buffer.from(prod.data, 'base64'));
  const pr = String(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', src])).trim().split(',').map(Number), W = pr[0], H = pr[1];
  if (!(W >= 300 && H >= 300)) throw new Error('photo trop petite');
  const box = { type: 'OBJECT', nullable: true, properties: { x: { type: 'NUMBER' }, y: { type: 'NUMBER' }, w: { type: 'NUMBER' }, h: { type: 'NUMBER' } }, required: ['x', 'y', 'w', 'h'] };
  const g = await vjson(`${LOCATION}-aiplatform.googleapis.com`, `/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-2.5-flash:generateContent`, {
    contents: [{ role: 'user', parts: [{ text: 'Photo d\'un produit reel. Coordonnees NORMALISEES entre 0 et 1 par rapport a l\'image entiere (x, y = coin haut-gauche, w, h). '
      + 'etiquette = la zone de l\'emballage qui porte les MENTIONS LISIBLES les plus utiles a montrer en gros plan : sceau ou logo de certification (bio, label, test), liste de composition, ou a defaut le nom et le sous-titre du produit ; elle fait entre 25 % et 70 % de la largeur de l\'image ; null si aucune mention n\'est lisible. Ne devine rien.' }, { inlineData: { mimeType: prod.mime || 'image/png', data: prod.data } }] }],
    generationConfig: { temperature: 0.1, maxOutputTokens: 800, thinkingConfig: { thinkingBudget: 0 }, responseMimeType: 'application/json', responseSchema: { type: 'OBJECT', properties: { etiquette: box }, required: ['etiquette'] } } });
  const loc = JSON.parse(textOf(g)); if (!loc || !loc.etiquette) throw new Error('aucune mention lisible reperee');
  const e = loc.etiquette, cl = v => Math.max(0, Math.min(1, v));
  let cw = Math.round(cl(e.w + 0.06) * W / 2) * 2, ch = Math.round(cl(e.h + 0.06) * H / 2) * 2;
  const cx = Math.round(cl(e.x - 0.03) * W), cy = Math.round(cl(e.y - 0.03) * H);
  cw = Math.min(cw, W - cx); ch = Math.min(ch, H - cy); cw -= cw % 2; ch -= ch % 2;
  if (cw < 200 || ch < 200) throw new Error('zone trop petite');
  const out = path.join(dir, nom + '_etiquette_client.png');
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', src, '-vf', 'crop=' + cw + ':' + ch + ':' + cx + ':' + cy, out]);
  let fond = '#1a1410';
  try { const b = execFileSync('ffmpeg', ['-v', 'error', '-i', out, '-vf', 'crop=iw:4:0:0,scale=1:1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-']); if (b.length >= 3) fond = '#' + [b[0], b[1], b[2]].map(x => x.toString(16).padStart(2, '0')).join(''); } catch (e2) {}
  return { fichier: out, fond };
}

// Texte -> ASS (cout 0). Photo de preuve -> petite image en coin avec fondu. Plan de coupe -> image pleine hauteur, leger
// zoom. Un seul passage ffmpeg. Les images sont generees ailleurs (Gemini) et passees par chemin.
function styleIncrustation(type) {
  const t = String(type || '').toLowerCase();
  if (/prix|etiquette|étiquette|pastille|valeur/.test(t)) return 'IncPrix';
  if (/contradiction/.test(t)) return 'IncContra';
  if (/offre|fin|reduction|réduction|code/.test(t)) return 'IncOffre';
  if (/gros|chiffre|garantie|economie|économie|cout|coût/.test(t)) return 'IncGros';
  return 'IncCarte';
}
function genreIncrustation(o) {
  const t = String(o.type || '').toLowerCase();
  if (o.img && /coupe|insert|illustration|plan_/.test(t)) return 'coupe';
  if (o.img) return 'photo';
  return 'texte';
}
async function incrusterVideo(opt) {
  const { vIn, vOut, items, police, accent, shFn, preset, crf, assPath, dureeTotale } = opt;
  const FPS = 24;
  const tc = t2 => { const h = Math.floor(t2 / 3600), m2 = Math.floor((t2 % 3600) / 60), sec = t2 % 60; return h + ':' + String(m2).padStart(2, '0') + ':' + sec.toFixed(2).padStart(5, '0'); };
  const esc = s => String(s).replace(/[{}\\]/g, '').replace(/\r?\n/g, '\\N').trim();
  const ACC = accent || '&H0000D6FF&';
  const F = police || 'Arial Black';
  const st = (name, size, align, mL, mR, mV, bs, outline, primary, outlineCol) =>
    'Style: ' + name + ',' + F + ',' + size + ',' + primary + ',&H00FFFFFF&,' + outlineCol + ',&H64000000&,-1,0,0,0,100,100,0,0,' + bs + ',' + outline + ',0,' + align + ',' + mL + ',' + mR + ',' + mV + ',1\n';
  let ass = '[Script Info]\nScriptType: v4.00+\nPlayResX: 720\nPlayResY: 1280\nWrapStyle: 0\nScaledBorderAndShadow: yes\n\n[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n'
    + st('IncCarte', 34, 7, 36, 200, 215, 3, 14, '&H00FFFFFF&', '&H30000000&')
    + st('IncContra', 46, 2, 50, 50, 250, 3, 14, '&H00FFFFFF&', '&H30000000&')
    + st('IncGros', 80, 5, 40, 40, 0, 1, 7, '&H00FFFFFF&', '&H00000000&')
    + st('IncPrix', 46, 6, 20, 24, 0, 3, 14, '&H00000000&', ACC)
    + st('IncOffre', 40, 2, 40, 40, 120, 3, 14, '&H00000000&', ACC)
    + '\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n';
  const textes = items.filter(o => genreIncrustation(o) === 'texte' && o.texte);
  textes.forEach(o => { ass += 'Dialogue: 1,' + tc(o.t0) + ',' + tc(o.t1) + ',' + styleIncrustation(o.type) + ',,0,0,0,,{\\fad(160,160)}' + esc(o.texte) + '\n'; });
  const images = items.filter(o => genreIncrustation(o) !== 'texte');
  const args = ['-y', '-i', vIn];
  images.forEach(o => { const d = Math.max(0.5, o.t1 - o.t0); args.push('-loop', '1', '-framerate', String(FPS), '-t', d.toFixed(3), '-i', o.img); });
  let chain = '', prev = '0:v';
  images.forEach((o, i) => {
    const n = i + 1, d = Math.max(0.5, o.t1 - o.t0), g = genreIncrustation(o), lab = 'ov' + i, nx = 'vx' + i;
    if (g === 'coupe') {
      chain += '[' + n + ':v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,zoompan=z=\'min(1+0.0010*on,1.14)\':d=1:x=\'iw/2-(iw/zoom/2)\':y=\'ih/2-(ih/zoom/2)\':s=720x1280:fps=' + FPS + ',setsar=1,format=yuv420p,setpts=PTS-STARTPTS+' + o.t0.toFixed(3) + '/TB[' + lab + '];';
      chain += '[' + prev + '][' + lab + ']overlay=0:0:enable=\'between(t,' + o.t0.toFixed(3) + ',' + o.t1.toFixed(3) + ')\':eof_action=pass[' + nx + '];';
    } else {
      const fd = Math.min(0.25, d / 4);
      chain += '[' + n + ':v]scale=300:-2,pad=iw+10:ih+10:5:5:color=white,format=rgba,fade=t=in:st=0:d=' + fd.toFixed(2) + ':alpha=1,fade=t=out:st=' + (d - fd).toFixed(2) + ':d=' + fd.toFixed(2) + ':alpha=1,setpts=PTS-STARTPTS+' + o.t0.toFixed(3) + '/TB[' + lab + '];';
      chain += '[' + prev + '][' + lab + ']overlay=x=W-w-26:y=235:enable=\'between(t,' + o.t0.toFixed(3) + ',' + o.t1.toFixed(3) + ')\':eof_action=pass[' + nx + '];';
    }
    prev = nx;
  });
  if (textes.length) {
    require('fs').writeFileSync(assPath, ass, 'utf8');
    const chemin = assPath.replace(/\\/g, '/').replace(/:/g, '\\:');
    chain += '[' + prev + ']subtitles=\'' + chemin + '\'[vout]';
  } else chain += '[' + prev + ']null[vout]';
  args.push('-filter_complex', chain, '-map', '[vout]', '-map', '0:a?', '-c:v', 'libx264', '-preset', preset || 'medium', '-crf', String(crf || '23'), '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart', '-c:a', 'copy', vOut);
  await shFn('ffmpeg', args);
  return { textes: textes.length, photos: images.filter(o => genreIncrustation(o) === 'photo').length, coupes: images.filter(o => genreIncrustation(o) === 'coupe').length };
}

const norm = t => String(t || '').replace(/\s*\([^)]*\)/g, '').replace(/[  ]/g, ' ').replace(/\s+/g, ' ').toLowerCase();
const repTexte = r => (typeof r === 'string' ? r : (r && r.texte) || '');
const repLoc = r => (typeof r === 'string' ? '' : (r && r.locuteur) || '');
function retime(c) {   // les durées de plan sont un réglage mécanique : le code les ajuste à la quantité de parole (1,8 à 3,6 mots/s)
  const pls = c.plans || [], reps = c.repliques || []; if (!pls.length) return;
  const W = pls.map(pl => (pl.repliques || []).map(x => repTexte(reps[x])).join(' ').trim().split(/\s+/).filter(Boolean).length);
  const D = pls.map(pl => pl.t1 - pl.t0);
  if (!pls.some((pl, i) => W[i] && (W[i] / D[i] > 3.6 || W[i] / D[i] < 1.8))) return;
  let nd = pls.map((pl, i) => W[i] ? W[i] / 2.6 : D[i]), sum = nd.reduce((a, b) => a + b, 0);
  nd = nd.map(x => x * 8 / sum);
  if (nd.some(x => x < 1.95) || nd.some((x, i) => W[i] && (W[i] / x > 3.6 || W[i] / x < 1.8))) return;   // infaisable : le contrôle le signalera
  let t = 0; const old = pls.map(pl => [pl.t0, pl.t1]);
  nd.forEach((x, i) => { pls[i].t0 = +t.toFixed(1); t += x; pls[i].t1 = i === nd.length - 1 ? 8 : +t.toFixed(1); });
  const re = /(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)\s*s\s*:/g, found = (String(c.prompt_veo).match(re) || []).length;
  if (found === pls.length) { let k = 0; c.prompt_veo = String(c.prompt_veo).replace(re, () => { const p = pls[k++]; return p.t0.toFixed(1) + '-' + p.t1.toFixed(1) + 's:'; }); c._retime = old.map((o, i) => o[0] + '-' + o[1] + ' → ' + pls[i].t0 + '-' + pls[i].t1); }
}
function enrich(plan) {   // ce que le code sait calculer, il le calcule : le modèle ne l'auto-déclare pas
  const subs = [];
  (plan.clips || []).forEach((c, i) => {
    const reps = c.repliques || [];
    retime(c);
    c.mots = reps.map(repTexte).join(' ').trim().split(/\s+/).filter(Boolean).length;
    c.nb_plans = (c.plans || []).length || c.nb_plans;
    (c.plans || []).forEach(pl => {
      const idx = pl.repliques || []; if (!idx.length) return;
      const words = idx.map(x => repTexte(reps[x])).join(' ').trim().split(/\s+/).filter(Boolean);
      if (!words.length) return;
      const a = i * 8 + pl.t0 + 0.2, b = i * 8 + pl.t1 - 0.3, n = Math.ceil(words.length / 5), per = Math.ceil(words.length / n);
      for (let k = 0; k < n; k++) {
        const chunk = words.slice(k * per, (k + 1) * per); if (!chunk.length) continue;
        const t0 = a + (b - a) * (k * per) / words.length, t1 = a + (b - a) * (k * per + chunk.length) / words.length;
        subs.push({ t0: +t0.toFixed(2), t1: +t1.toFixed(2), texte: chunk.join(' ') });
      }
    });
  });
  plan.sous_titres = subs; return plan;
}

// ---------- assemblage et réparations déterministes (faits par le code, jamais par le LLM) ----------
const hasProduct = ir => ir && (ir.produit_dans_image === true || (ir.personnages || []).some(isProductNode));
const isProductNode = x => /produit|product|flacon|bottle|capsule/i.test(String(x || ''));
const clipSel = v => { const t = String(v || '0').trim(); if (!t || t === '0') return null; const m = t.match(/^(\d)\s*-\s*(\d)$/); if (m) { const a = +m[1], b = +m[2], r = []; for (let i = a; i <= b; i++) r.push(i); return r; } const n = parseInt(t, 10); return n ? [n] : null; };
const cleanRef = t => String(t || '').replace(/[^.\n]*\b(?:reference (?:image|frame|photo)|reference-image|as depicted|as shown in the (?:image|frame))\b[^.\n]*\.?[ \t]*/gi, '').replace(/\s{2,}/g, ' ').trim();
const frNum = n => { const u = ['zéro','un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix','onze','douze','treize','quatorze','quinze','seize','dix-sept','dix-huit','dix-neuf'], t = ['','','vingt','trente','quarante','cinquante','soixante'];
  if (n < 20) return u[n]; if (n < 70) { const d = Math.floor(n / 10), r = n % 10; return t[d] + (r === 1 ? ' et un' : r ? '-' + u[r] : ''); }
  if (n < 80) { const r = n - 60; return 'soixante' + (r === 11 ? ' et onze' : '-' + u[r]); } if (n < 100) { const r = n - 80; return 'quatre-vingt' + (r ? '-' + u[r] : 's'); }
  if (n < 1000) { const c = Math.floor(n / 100), r = n % 100; return (c > 1 ? u[c] + ' ' : '') + 'cent' + (r ? ' ' + frNum(r) : (c > 1 ? 's' : '')); }
  if (n < 1000000) { const k = Math.floor(n / 1000), r = n % 1000; return (k > 1 ? frNum(k) + ' ' : '') + 'mille' + (r ? ' ' + frNum(r) : ''); } return String(n); };
// forme PARLÉE d'une réplique pour Veo : chiffres, heures, pourcentages, monnaie écrits en toutes lettres (le sous-titre garde la forme écrite)
// Un nom de studio, de film, de marque ou de personnage connu dans le prompt fait refuser la génération par Veo
// (« the interests of third-party content providers »). Le code les remplace par une description neutre du rendu.
const MARQUES = /\b(pixar|disney|dreamworks|dream works|illumination|ghibli|studio ghibli|aardman|laika|blue sky|sony pictures animation|warner(?: bros\.?)?|marvel|dc comics|lucasfilm|weta|industrial light(?: & | and )magic|nickelodeon|cartoon network|netflix|hbo|coca-?cola|pepsi|nike|adidas|apple inc\.?|unreal engine)\b/gi;
const deBrand = t => {
  let x = String(t || '').replace(MARQUES, 'cinematic CG animation');
  x = x.replace(/\b(?:in the style of|style of|look of|inspired by)\s+cinematic CG animation\b/gi, 'cinematic CG animation')
       .replace(/cinematic CG animation([- ]style)?\s+(?:render(?:ing)?|look|style|film|movie|feature)\b/gi, 'cinematic CG animation render')
       .replace(/cinematic CG animation\s+(?:animation|studios?|pictures|films?|entertainment|interactive|bros\.?)\b/gi, 'cinematic CG animation')
       .replace(/(cinematic CG animation render)(?:[,;]?\s+\1)+/gi, '$1')
       .replace(/\s{2,}/g, ' ').replace(/\s+([.,;:])/g, '$1').trim();
  return x;
};
// Veo rend du 720x1280 : lui envoyer un panneau en pleine définition (8 Mo) allonge l'envoi et provoque des
// délais réseau. On garde le fichier complet sur le disque et on n'envoie qu'une version réduite.
const VEO_REF_W = 768;
function reduirePourVeo(rec) {
  try {
    const buf = Buffer.from(rec.data, 'base64');
    if (!/png/i.test(rec.mime || 'image/png')) return rec;
    const im = pngDecode(buf);
    if (im.w <= VEO_REF_W) return rec;
    const h2 = Math.round(im.h * VEO_REF_W / im.w); const petit = pngEncode(pngScale(im, VEO_REF_W, h2 % 2 ? h2 + 1 : h2));   // dimensions paires : certains encodeurs refusent une hauteur impaire
    return petit.length < buf.length ? { data: petit.toString('base64'), mime: 'image/png' } : rec;
  } catch (e) { return rec; }
}
// v6.22 — Veo lit « flacon » avec un S. Pour les mots qu'il écorche, on lui donne l'orthographe PHONÉTIQUE :
// lui seul voit cette version, les sous-titres et le plan gardent l'orthographe correcte. Le fichier
// prononciation.json, à côté du serveur, permet d'ajouter un mot sans toucher au code.
const PRONONCE = (() => {
  const base = { 'flacon': 'flakon', 'flacons': 'flakons', 'second': 'segond', 'seconde': 'segonde',
    'secondes': 'segondes', 'gageure': 'gajure', 'oignon': 'ognon', 'oignons': 'ognons',
    'cueillir': 'keuillir', 'orgueil': 'orgueuil', 'écueil': 'ékeuil', 'cercueil': 'cerkeuil' };
  try { const f = path.join(__dirname, 'prononciation.json');
    if (fs.existsSync(f)) Object.assign(base, JSON.parse(fs.readFileSync(f, 'utf8'))); } catch (e) {}
  return base;
})();
const REPRON = new RegExp('\\b(' + Object.keys(PRONONCE).map(x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')\\b', 'gi');
const spoken = t => String(t || '')
  .replace(REPRON, m => { const v = PRONONCE[m.toLowerCase()] || m; return /^[A-ZÀ-Ý]/.test(m) ? v.charAt(0).toUpperCase() + v.slice(1) : v; })
  // v6.8 — Veo PRONONCE le point d'interrogation (« … pas plus quoi ? »). La question garde son intonation par le
  // ton de la réplique et par l'ordre des mots ; la ponctuation, elle, se dit. On la remplace donc par un point
  // dans ce qui part à Veo. Les sous-titres, eux, sont construits à part et gardent le « ? ».
  .replace(/\s*\?+/g, '.')
  .replace(/\s*!+/g, '.')
  .replace(/\.{2,}/g, '.')
  // v6.15 — Veo marque un silence à chaque point. Un point à l'INTÉRIEUR d'une réplique devient une virgule :
  // la phrase continue de couler, l'intonation reste, le trou disparaît. Seul le point final est conservé.
  .replace(/\.(?=\s*\S)/g, ',')
  .replace(/,\s*,/g, ',')
  .replace(/, (Ce|Cette|Ces|Cet|Il|Elle|Ils|Elles|Et|Mais|Tu|Je|On|Nous|Vous|Le|La|Les|Un|Une|Des|Ton|Ta|Tes|Mon|Ma|Mes|Son|Sa|Ses|Ça|Cela|Alors|Donc|Puis|Sans|Pour|Parce|Quand|Avec|Chez|Depuis|Aujourd)\b/g, (m, w) => ', ' + w.toLowerCase())
  .replace(/\b(\d{1,2})\s?h(?:(\d{2}))?\b/gi, (m, h, mn) => { const hh = parseInt(h, 10); return (hh === 1 ? 'une' : frNum(hh)) + (hh > 1 ? ' heures' : ' heure') + (mn && parseInt(mn, 10) ? ' ' + frNum(parseInt(mn, 10)) : ''); })
  .replace(/(\d+)\s?%/g, (m, n) => frNum(parseInt(n, 10)) + ' pour cent')
  .replace(/\bF\s?CFA\b/g, 'francs CFA')
  .replace(/\b\d{1,3}(?:[ \u00a0.]\d{3})+\b|\b\d+\b/g, m => frNum(parseInt(m.replace(/[ \u00a0.]/g, ''), 10)));
// v6.42 — une image de depart est une action en cours, jamais une pose (PV38). VERSION v6.42
// v6.41 — la fiche produit entre dans le prompt Veo : plus d accessoire invente (PV37).
// v6.40 — aucun mockup de telephone : la planche est la photo, jamais une photo dans un appareil (PV36).
// v6.39 — ffmpeg asynchrone : le serveur repond pendant l encodage ; log horodate (PV35).
// v6.38 — recadrage interne au pivot de la voix : 8 plans percus pour 4 clips (PV34).
// v6.37 — banalites du marche et avantage deloyal, interdits verifies litteralement, passe produit en plein cadre (PV32, PV33).
// v6.36 — transposition obligatoire du CT bloc par bloc : preuve, geste reel, equivalence (PV31).
// v6.35 — un seul produit, aucune coupure en deux moities, identite tenue, musique sur l emotion (PV29, PV30).
// v6.34 — fiche produit lue sur la photo, conflit de marque, budget de prompt rendu a la scene (PV27, PV28).
// v6.33 — voix du persona cible, emotion en courbe, action du clip jamais elaguee (PV26).
// v6.32 — voix off mesuree avant Veo, clips joues (PV25).
// v6.31 — CT A VOIX OFF. Certains CT (008, 009) ne font pas parler de personnage : la voix est ecrite, dite
// par ElevenLabs, et c'est elle qui commande le minutage. Veo ne doit alors produire AUCUNE parole — ni dans
// le prompt, ni a l'image. Ce drapeau est pose par le pipeline au debut de chaque production.
let VOIX_OFF_RUN = false;
let MINI_RUN = false, MINI_INFO = null;
let BOUSSOLE_VEO = '';   // v6.54 : jeu et lumiere de la destination, poses dans chaque prompt Veo   // v6.52 : mode MINI-PLANS (voir PV50)
// v6.52 — duree Veo d'un clip : 8 s hors mini-plans ; en mini-plans, la plus courte (4, 6 ou 8 s) qui contient le plan et une marge pour choisir le meilleur moment
function estInsert(c) { return !!(MINI_RUN && c && String(c.rendu || '').toLowerCase() === 'insert'); }   // v6.53 : image concue animee par le code, aucun Veo
function dureeVeo(c) {
  if (!MINI_RUN) return 8;
  if (estInsert(c)) return 0;
  const sg = VO_TIMING && VO_TIMING.segments && VO_TIMING.segments[(Number(c && c.bloc) || 1) - 1];
  const L = sg ? sg.duree : 3;
  return L <= 3.4 ? 4 : L <= 5.4 ? 6 : 8;
}
// v6.52 — CE QUE VEO NE SAIT PAS FAIRE (mesure sur la video acda0d31) : changer de scene dans une prise (il fond un bras de robot
// en flacon marron « Formule Sompeil »), ecrire (etiquette lue en macro, « 100 % Recycled », carte de France), un effet magique
// (lueur doree qui sort du torse), faire parler un personnage sans voix (bouche qui bouge sur une chanson).
const VEO_SCENE = /\b(transitions? (?:back )?(?:to|into)|dissolv(?:es?|ing) (?:in)?to|the (?:scene|shot|image) (?:changes|shifts|cuts|transitions|dissolves|morphs)|scene shifts|cuts? (?:back )?to|morph(?:s|ing)? into|transforms? into|turns into an?|flash(?:es)? (?:to|of white)|white flash|match cut|split[- ]screen|image changes visibly|then we see|the next moment)\b/i;
const VEO_TEXTE = /(\bthe words\b|\bwords? ['"‘“]|\btext (?:appears|reads|on)\b|\blabel reads\b|\breads ['"‘“]|\bgraphic overlay\b|\boverlays?\b|\binfographic\b|\bmap of\b|\banimated map\b|\bstylized map\b|\bdiagram\b|\bdigital clock\b|\bclock (?:shows|reads|displays)\b|\bnumbers? (?:appear|glow|on the)\b|\bpercent\b|\bcheck ?mark\b|\bfocus pulls? (?:from|to) the\b|\bpans? (?:down|across|along) the label\b|\b(?:macro|extreme close-up)(?: shot)? (?:of|on) the (?:bottle'?s? )?label\b)/i;
const VEO_VFX = /\b(glow(?:s|ing)? (?:from|through|inside|within|in) (?:his|her|their|the) (?:chest|body|skin|heart)|(?:golden|warm|soft) (?:light|warmth|glow) (?:spreads|radiates|emanates|begins|is born|blooms)|light spreads (?:through|across|over) (?:his|her|their|the) body|\baura\b|magical|sparkl\w*|particles? (?:rise|float|swirl|appear)|energy (?:waves?|flows?|beams?)|glowing (?:aura|light) around)\b/i;
const VEO_PAROLE = /\b(speaking|talking|talks|speaks|says|tells|chatting|his mouth moves|her mouth moves|mouth moves|lips move|as if talking|presents? to (?:the )?(?:team|colleagues))\b/i;
const VEO_PRODUIT = /\b(rotat(?:es|ing)(?: slowly)?|turntable|spins?|spinning|360)\b/i;
function nettoyerCorpsVeo(body, sansParole, produit) {
  const retires = [];
  const garde = String(body || '').split('\n').map(l => l.split(/(?<=[.!?])\s+/).filter(ph => {
    const sans = ph.replace(/\b(?:no|without|never)\b[^.]*/gi, ' ');   // « no text », « never speaks » sont des consignes, pas des demandes
    const ko = VEO_SCENE.test(sans) || VEO_TEXTE.test(sans) || VEO_VFX.test(sans) || (sansParole && VEO_PAROLE.test(sans)) || (produit && VEO_PRODUIT.test(sans));
    if (ko) retires.push(ph.slice(0, 90));
    return !ko;
  }).join(' ')).join('\n').replace(/[ \t]{2,}/g, ' ').trim();
  return { body: garde, retires };
}
let CHANSON_RUN = false;   // v6.48 : le CT se joue en CHANSON (ElevenLabs Music chante les paroles ; Veo muet ; montage cale sur la chanson)
let VO_TIMING = null;   // v6.32 : minutage MESURE de la voix off (segments par bloc, pivot de chaque bloc), pose par le pipeline avant la direction
function assemblePrompts(plan, force, journal) {
  const log = typeof journal === 'function' ? journal : () => {};   // appelée aussi hors pipeline (tests, rejeu) : sans journal, on se tait
  const fiches = {}; (plan.fiches_personnages || []).forEach(f => { fiches[norm(f.nom)] = cleanRef(f.description_physique); });
  const voix = Array.isArray(plan.voix) ? plan.voix : [];
  const sansBouche = new Set(voix.filter(x => x && x.a_l_image === 'sans_bouche').map(x => norm(x.personnage))); // P1quinquies : dans le cadre, mais filmé sans sa bouche
  (plan.clips || []).forEach(c => {
    if (c._assembled && !force) return;
    let body = String(force && c._corps ? c._corps : c.prompt_veo || '').trim();
    const paras = body.split(/\n\s*\n/);
    if (paras.length > 1 && /(vertical 9:16|pixar|feature-film|the only voice)/i.test(paras[0])) body = paras.slice(1).join('\n\n').trim(); // l'agent a recopié l'en-tête : on le retire, le code le remet
    body = body.split('\n').filter(l => !/^\s*(sound|audio|ambiance|ambience|sfx|music)\s*[:\-]/i.test(l)).join('\n').replace(/\b(whoosh|ambient (?:sound|noise)s?|background (?:sound|noise|music)s?|room tone|soft [a-z ]*ambience)\b[^.\n]*[.]?/gi, '').replace(/[ \t]+\n/g, '\n').trim();
    body = body.replace(/[^.\n]*\b(?:reference (?:image|frame|photo)|reference-image|as depicted|as shown in the (?:image|frame))\b[^.\n]*\.?[ \t]*/gi, '').trim();
    const vis = c.personnages_visibles || [];
    body = body.replace(/([A-Za-zÀ-ÿ])'s (says|asks|whispers|replies|adds|admits)\b/g, '$1 $2');
    body = body.replace(/Voice-?over(?: \(same voice\))? from ('?)([^':\n]+?)\1\s+(says|asks|whispers|replies|adds|admits)\b/gi, (m, q, nm, vb) => ((c.personnages_visibles || []).some(v2 => norm(v2) === norm(nm)) && !sansBouche.has(norm(nm))) ? nm + ' ' + vb : m);
    body = body.replace(/Voice-?over(?: \(same voice\))? from ('?)([^':\n]+?)\1\s*:/gi, (m, q, nm) => (vis.some(v2 => norm(v2) === norm(nm)) && !sansBouche.has(norm(nm))) ? (q ? "'" + nm + "'" : nm) + ' says:' : m);
    const speakers = new Set((c.repliques || []).map(r => norm(repLoc(r))));
    if ([...speakers].every(sp => vis.some(v2 => norm(v2) === sp) && !sansBouche.has(sp))) body = body.replace(/\b(?:as an? |in )?voice-?over\b[,]?\s*/gi, '');
    if (!/mouth (?:is )?never visible|from behind|back to the (?:camera|lens)/i.test(body)) [...speakers].filter(sp => sansBouche.has(sp) && vis.some(v2 => norm(v2) === sp)).forEach(sp => { // P1quinquies : le cadrage sans bouche est garanti par le code, pas par le CT
      const nm = String(vis.find(v2 => norm(v2) === sp) || '').trim(); if (nm) body += '\n' + nm + ' is filmed from behind or in sharp profile, mouth never visible, lips closed, never speaking on camera.';
    });
    let reps0 = null;
    if (VOIX_OFF_RUN) {
      // v6.32 — CT a voix off. La v6.31 SORTAIT ici avec le corps ecrit par le directeur (63 a 85 mots) : tout ce que
      // le code ajoute d'ordinaire — style, identite des personnages, mise en scene en temps, mouvement de camera —
      // etait perdu, et c'est ce qui a donne des plans pauvres en detail et en emotion. On retire desormais
      // seulement la PAROLE, et le reste de l'assemblage s'applique comme pour tout clip.
      body = body.replace(/[^\n]*\b(?:says|asks|whispers|replies|adds|admits|voice-?over)\b[^\n]*/gi, '');
      body = body.replace(/\bholds? (?:this|the same|that) pose,?\s*/gi, 'moves, ').replace(/\b(?:is|remains?|stays?) (?:static|motionless|frozen)\b/gi, 'is alive');   // v6.32 : une pose tenue n'est jamais une consigne
      body = body.replace(/[«"][^«»"\n]{6,}[»"]/g, '');
      body = body.replace(/\n{3,}/g, '\n\n').replace(/[ \t]{2,}/g, ' ').trim();
      // la voix off n'est pas un personnage a l'image : un narrateur « visible » ferait chercher sa bouche a Veo
      const narr = new Set(voix.map(x => norm(x.personnage)).filter(Boolean));
      for (let iv = vis.length - 1; iv >= 0; iv--) if (narr.has(norm(vis[iv]))) vis.splice(iv, 1);
      reps0 = c.repliques; c.repliques = [];   // restaure en fin de clip ; sert a ce que tout le code aval traite le clip comme un clip sans parole a l'image
    }
    (c.repliques || []).forEach(r => { // le ton de chaque réplique est posé par le code, la voix reste celle de la fiche
      const tx = repTexte(r).trim(), tn = String((r && r.ton) || '').trim(); if (!tn || !tx) return;
      const i = body.indexOf('"' + tx); if (i < 0) return; const colon = body.lastIndexOf(':', i); if (colon < 0 || i - colon > 3) return;
      const before = body.slice(0, colon); if (/\bdelivery\b/i.test(before.slice(-140))) return;
      body = before + ' (delivery: ' + tn + ')' + body.slice(colon);
    });
    { // découpage mécanique : une réplique de plus de 12 mots est dite en deux ou trois temps (mêmes mots, coupe aux phrases puis aux virgules) — Veo dérive sur une ligne longue
      const W = x => String(x).trim().split(/\s+/).filter(Boolean).length;
      const cut = txt => {
        const segs = [];
        String(txt).trim().split(/(?<=[.!?\u2026])\s+/).filter(Boolean).forEach(ph => {
          if (segs.length && W(segs[segs.length - 1]) + W(ph) <= 12) segs[segs.length - 1] += ' ' + ph; else segs.push(ph); // coupe aux phrases seulement : une phrase entière n'est jamais tronquée en fragment
        });
        for (let i = 0; i < segs.length; i++) if (W(segs[i]) < 3 && segs.length > 1) { if (i > 0) { segs[i - 1] += ' ' + segs[i]; segs.splice(i, 1); i--; } else { segs[1] = segs[0] + ' ' + segs[1]; segs.splice(0, 1); i--; } }
        return segs;
      };
      const nouv = [], map = [];
      (c.repliques || []).forEach((r, idx) => {
        const tx = repTexte(r).trim();
        const segs = tx && W(tx) > 12 ? cut(tx) : [tx];
        if (segs.length > 1 && body.includes('"' + tx + '"') && segs.every(x => W(x) >= 3)) {
          map[idx] = segs.map(x => { nouv.push(typeof r === 'string' ? x : Object.assign({}, r, { texte: x })); return nouv.length - 1; });
        } else { nouv.push(r); map[idx] = [nouv.length - 1]; }
      });
      if (nouv.length !== (c.repliques || []).length) {
        c._decoupe = (c.repliques || []).length + ' \u2192 ' + nouv.length + ' r\u00e9pliques';
        c.repliques = nouv;
        (c.plans || []).forEach(pl => { pl.repliques = [].concat.apply([], (pl.repliques || []).map(i => map[i] || [])); });
      }
    }
    let sty = deBrand(plan.style_visuel);
    if (/\b(3d anim|animated|animation|cartoon|stylis|stylized|cg feature|toon)\b/i.test(sty) && !/\b(photo-?real|live-action|documentary)\b/i.test(sty)
        && !/(large (?:expressive )?eyes|simplified|exaggerated|matte|non-?photoreal|toy-?like)/i.test(sty))
      sty += ' Stylised animation look: simplified facial anatomy with large expressive eyes, smooth matte surfaces, slightly exaggerated proportions, clean soft shading.';
    sty = sty.split(/(?<=[.!?])\s+/).filter(sn => !/\breference (?:image|photo|frame)\b|image de référence/i.test(sn)).join(' ');
    if (/(pixar|animated|animation|cartoon|3d|illustrat|stylis)/i.test(sty)) sty = sty.split(/(?<=[.!?])\s+/).filter(sn => !/photo-?realis|photoréalis|live-action|documentary/i.test(sn)).join(' ');
    sty = sty.replace(/[^.!?]*\b(?:subtitle|caption|on-screen text|text overlay|watermark)\w*[^.!?]*[.!?]\s*/gi, '').replace(/\s{2,}/g, ' ').trim();
    plan.style_visuel = sty.trim();
    body = deBrand(body);
    if (!estInsert(c)) { // v6.52 — filet de securite : ce que Veo rate a chaque fois est retire du corps avant envoi (v6.53 : un insert ne part pas chez Veo) (le controle demande deja au realisateur de le reecrire)
      c._corpsBrut = body;
      const nt = nettoyerCorpsVeo(body, VOIX_OFF_RUN || !(c.repliques || []).length, c.produit_visible === true);
      if (nt.retires.length) {
        c._retires = nt.retires;
        log('Clip ' + c.bloc + ' : ' + nt.retires.length + ' phrase(s) retirée(s) du prompt Veo (changement de scène, texte, effet magique, parole ou rotation du produit, que Veo rate) : « ' + nt.retires.join(' » ; « ').slice(0, 240) + ' ».');
        const geste0 = String(((c.repliques || [])[0] || {}).geste || '').trim();
        body = nt.body.split(/\s+/).filter(Boolean).length >= 8 ? nt.body : (nt.body + (geste0 ? ' ' + geste0 : '')).trim();
      }
    }
    voix.forEach(x => { x.description_exacte = deBrand(x.description_exacte); });
    const styC = (() => { // le style est plafonné en gardant des phrases entières (l'image de référence porte déjà le rendu)
      const ph = sty.trim().split(/(?<=[.!?])\s+/).filter(Boolean); let out = '', n2 = 0;
      for (const x of ph) { const w = x.split(/\s+/).length; if (n2 && n2 + w > 40) break; out += (out ? ' ' : '') + x; n2 += w; }
      return out || sty.trim();
    })();
    // v6.8 — le prompt assemblé dépassait 520 mots alors que le corps écrit par l'agent n'en faisait que 54 :
    // l'essentiel venait du style_visuel recopié en entier (plus de 300 mots de décor que l'image porte déjà).
    // On n'en garde que les deux premières phrases : le registre suffit, le reste est dans l'image de référence.
    const styCourt = (() => { const ph = String(styC || '').split(/(?<=[.!?])\s+/).filter(Boolean);
      let out = '', n = 0; for (const x of ph) { if (n && (out + ' ' + x).split(/\s+/).length > 60) break; out = out ? out + ' ' + x : x; n++; if (n >= 2) break; }
      return out || styC; })();
    const parts = [styCourt].concat(plan._cadrage ? [cleanRef(String(plan._cadrage)).split(/(?<=[.!?])\s+/).filter(ph => !(MINI_RUN && /two beats|pivot|reframe|deux temps|recadr|hold|tenu \d/i.test(ph))).join(' ').trim()].filter(Boolean) : []); // grammaire de cadrage propre au CT (P7quater)
    const imgD = (plan._imgDesc || {})[(c.references || [])[0]];   // descriptions issues de l'image réellement générée : le texte décrit ce que Veo voit, jamais une invention parallèle
    const dsc = nm => (imgD && imgD.personnages && imgD.personnages[Object.keys(imgD.personnages).find(k => norm(k) === norm(nm))]) || fiches[norm(nm)];
    const coupe = (t2, n2) => { const w = String(t2).trim().split(/\s+/); return w.length <= n2 ? String(t2).trim() : w.slice(0, n2).join(' ').replace(/[,;:]$/, '') + '.'; };
    const ch = vis.map(nm => dsc(nm) ? nm + ': ' + coupe(dsc(nm), 60) : null).filter(Boolean);
    // v6.43 — CONSIGNES SERREES. PV28 disait « les consignes fixes ne depassent pas le tiers du prompt » ; les v6.37 a v6.42
    // en ont ajoute huit et elles pesaient 400 a 540 mots sur 520 : le corps ecrit par le realisateur (l'action, le geste,
    // l'emotion de CE clip) etait rabote a 40-80 mots, et c'est ce qui donnait des plans figes et un CT non respecte a
    // l'animation. Les verrous d'identite, d'objets, de cadre et de taille sont fusionnes en UNE ligne ; chaque consigne
    // est ecrite en une phrase ; la grille de mise en scene, le jeu, l'emotion et la camera tiennent en trois lignes.
    const parlant = (c.repliques || []).length > 0;
    parts.push('Animate the attached image: it is the exact first frame. Setting, ' + (vis.length ? 'faces, skin tones, outfits, ' : '') + (c.produit_visible ? 'the product, ' : '') + 'objects and proportions stay exactly as in it for the whole clip; only what is already in the image exists — nothing appears, multiplies, disappears, grows, shrinks or morphs.' + (vis.length ? ' Hands keep five fingers and never sweep across the lens.' : '') + ' Filmed directly: no device frame, border, interface or added text.');
    parts.push('No posing: the subject keeps doing what the image shows — body and hands stay busy, never a person standing still facing the lens.');
    if (c.produit_visible === true) {
      // v6.41 — la fiche produit entre dans le prompt video : Veo inventait l'applicateur que la voix nommait.
      // v6.43 — la fiche decrit le CONTENANT seul. Les elements poses a cote sur le packshot (gelules, accessoires) ne font
      // pas partie de la scene : recopies dans la fiche, ils etaient colles partout (table de nuit, salon, main).
      const fch = String((plan._fiche && plan._fiche.description_en) || '').replace(/\s+/g, ' ').trim();
      let fcourt = ''; { const ph = fch ? fch.split(/(?<=[.!?])\s+/).filter(Boolean) : []; for (const x of ph) { if (fcourt && (fcourt + ' ' + x).split(/\s+/).length > 52) break; fcourt += (fcourt ? ' ' : '') + x; } if (fcourt.split(/\s+/).length > 56) fcourt = fcourt.split(/\s+/).slice(0, 52).join(' ') + '.'; }
      const hors = String((plan._fiche && plan._fiche.hors_contenant) || '').replace(/\s+/g, ' ').trim().split(/\s+/).slice(0, 10).join(' ');
      parts.push('Product: the single object of the attached image, same shape, size, colours, finish and label from first to last frame, never swapped or re-lettered.' + (fcourt ? ' It is: ' + fcourt : '') + ' Nothing else belongs to it or sits around it: no applicator, pad, extra container' + (hors ? ', no ' + hors : '') + '; whatever comes out of it appears only in the hand that takes it.');
    }
    // Veo ajoute une tete humaine en l'air quand le visage du locuteur est trop petit ou trop plat pour porter la synchronisation labiale.
    if (VOIX_OFF_RUN) parts.push('No face exists but those already in the image; never add or duplicate a head.');
    else parts.push('No face exists but those already in the image; never add or duplicate a head; a personified object speaks with the face on its own body.');
    voix.forEach(x => { x.description_exacte = String(x.description_exacte || '').replace(/,?\s*(?:like|as if|sounding like|evoking)\s+an?\s+[^,.]*/gi, '').replace(/\b(friendly|charming|guilty|confidant|conspirator|conspiratorial|playful|cheerful|joyful|sad|angry|persuasive|caring|reassuring|menacing|seductive|smug|mischievous|enthusiastic|confident|sincere)\b/gi, '').replace(/,\s*(?:and\s*)?,/g, ',').replace(/,\s*and\s+(?=[.,])/g, '').replace(/\b(a|an|with)\s+(?=[,.])/g, '').replace(/\s+([,.])/g, '$1').replace(/\s{2,}/g, ' ').split(/(?<=[.!?])\s+/).filter(sn => sn.replace(/[^A-Za-z\u00C0-\u00ff]+/g, ' ').trim().split(/\s+/).filter(Boolean).length > 2).join(' ').trim(); }); // la voix = identité seule (âge, hauteur, timbre, débit, accent) : seuls les mots d'émotion sont retirés, jamais une phrase d'identité
    voix.filter(x => parlant && (speakers.has(norm(x.personnage)) || voix.length === 1)).forEach(x => parts.push('Voice of ' + x.personnage + ': ' + x.description_exacte + ' Same voice all clip; only the emotion changes.'));
    { const muets = vis.filter(nm => !speakers.has(norm(nm)));   // une seule ligne pour tous les silencieux
      if (muets.length) parts.push(muets.join(' and ') + ': lips stay closed and the jaw still; ' + (muets.length > 1 ? 'they breathe, blink and listen.' : 'breathes, blinks and listens.')); }
    const emoTxt = (() => { // l'emotion se joue dans le corps, lisible sans le son : elle vient de la reponse de ton du CT, jamais d'une voix
      const propre = x => /^[\x20-\x7E]{2,40}$/.test(x);
      const emos = ((reps0 || c.repliques || [])).map(r => String((r && r.emotion) || '').replace(/[\r\n]+/g, ' ').trim()).filter(x => /^[\x20-\x7E]{3,90}$/.test(x));
      const tons = emos.length ? [...new Set(emos)].slice(0, 2) : [...new Set(((reps0 || c.repliques || [])).map(r => String((r && r.ton) || '').trim()).filter(x => propre(x) && !/^(declarative|informative|insightful|matter-of-fact|neutral|natural|explanatory|observational|revealing|promising|opportunistic)$/i.test(x)))].slice(0, 2);
      return tons.length ? tons.join(', then ') : 'the feeling carried by the idea being narrated at that moment (its tension, relief or conviction)';
    })();
    const emoLigne = 'Emotion readable with the sound off: ' + emoTxt + ', shown in posture, breath, gaze and hands (with no person on screen: in light, colour and pace).';
    const camFixe = /\b(locked|static|fixed|tripod|propped|still frame)\b/i.test(String(plan._cadrage || '') + ' ' + String(plan.style_visuel || ''));   // le CT impose une camera fixe : la grille generique ne la contredit pas
    const camLigne = MINI_RUN ? 'Camera: ' + ({ tres_gros_plan: 'extreme close-up', gros_plan: 'close-up', plan_moyen: 'medium shot', plan_large: 'wide shot', insert_mains: 'close-up on the hands', insert_objet: 'close-up on the object' }[norm(String(c.cadrage || '')).replace(/[^a-z_]/g, '')] || 'framing of the image') + ', a live camera that follows the action with a clear motivated move (push-in, drift or a small handheld sway); the body, the face and the hands move with purpose and energy, never frozen.' : camFixe ? 'Camera: locked exactly as in the framing above; only the people and objects in the frame move.' : 'Camera: one continuous take from the framing of the attached image, a slow push-in or lateral drift, never fast.';
    if (parlant) { // Veo donne la voix au visage qu'il cadre : le locuteur reste cadre, la camera ne bouge pas vite pendant qu'il parle
      const sp = [...new Set((c.repliques || []).map(r => repLoc(r)).filter(Boolean))];
      const datee = /\b(?:for the first \d|at \d+(?:\.\d+)? ?(?:s\b|sec))/i.test(body);   // le directeur a date ses temps de jeu : la grille generique s'efface
      parts.push('Performance in one continuous take, no cut: the characters act through all 8 seconds — gaze, expression, hands and body answer each sentence and the listener reacts; no freeze, no repeated gesture. '
        + (datee ? 'The timed beats written here are the staging; each is a different body position, none held over two seconds.'
                 : 'Three beats: 0.0-2.5 s the movement from the first frame continues; 2.5-5.5 s the strongest physical action (gesture, posture change, step, object picked up); 5.5-8.0 s it settles.'));
      parts.push('The voice comes from ' + (sp.join(' and ') || 'the speaker') + '\'s mouth: it opens and closes on every syllable, in frame and in focus from the first word to the last.');
      parts.push(camLigne);
      parts.push(emoLigne);
      parts.push('Audio: the character\'s voice only, evenly paced from 0.4 s to about 7.4 s, no pause over 0.4 s; the body keeps moving after the last word.');
    } else {
      // v6.32 — MISE EN SCENE, EMOTION, DETAIL pour un clip sans parole a l'image (voix off, insert, CT muet).
      const sujet = vis.length ? vis.join(' and ') : 'the main subject of the shot';
      const seg = VO_TIMING && VO_TIMING.segments && VO_TIMING.segments[(Number(c.bloc) || 1) - 1];
      const dK = seg ? Math.max(3, Math.min(7.6, seg.duree)) : 8;
      const piv = seg && seg.pivot && seg.pivot.length ? seg.pivot[0] : null;
      parts.push('Performance in one continuous take, no one speaking: ' + sujet + ' acts through the whole shot; whatever is alive in the frame — a body, a curtain, steam, a plant — visibly moves and changes state, never a held pose. Real material on every surface and small secondary motion keep the frame alive.');
      parts.push(camLigne);
      const gs = (reps0 || []).map(r => String((r && r.geste) || '').replace(/\s+/g, ' ').trim()).filter(Boolean);
      const beatsDirecteur = /\b(?:for the first \d|at \d+(?:\.\d+)? ?(?:s\b|sec))/i.test(body);
      if (MINI_RUN)
        parts.push('One shot, one place, one subject, one action: the gesture described in this prompt, already under way in the first frame. It reads clearly within the first 2 seconds, then the body settles naturally. The shot never changes place, subject or moment: no transition, no dissolve, no second scene, nothing transforms or appears.');
      else if (beatsDirecteur)
        parts.push('Timing: the whole action is complete within the first ' + dK.toFixed(1) + ' s (the rest is never used, hold the final state); every beat is a different action and the emotion changes between beats.');
      else if (piv && piv >= 1.5 && dK - piv >= 1.5 && gs.length >= 2)
        parts.push('Staging in two beats, complete within the first ' + dK.toFixed(1) + ' s (the rest is never used): 0.0-' + piv.toFixed(1) + ' s ' + gs[0] + ' At ' + piv.toFixed(1) + ' s, same place and same subject, a new action begins: ' + gs[1] + ' No transition, nothing transforms. It ends settled.');
      else if (piv && piv >= 1.5 && dK - piv >= 1.5)
        parts.push('Staging in two beats, complete within the first ' + dK.toFixed(1) + ' s (the rest is never used): 0.0-' + piv.toFixed(1) + ' s the first idea of the narration is what the eye sees; at ' + piv.toFixed(1) + ' s the same subject in the same place starts a different action (no transition, nothing transforms) and the second idea is what the eye sees until ' + dK.toFixed(1) + ' s, ending settled.');
      else
        parts.push('Staging in three beats, complete within the first ' + dK.toFixed(1) + ' s (the rest is never used): 0.0-' + (dK / 3).toFixed(1) + ' s the action begun in the first frame continues; ' + (dK / 3).toFixed(1) + '-' + (2 * dK / 3).toFixed(1) + ' s the strongest visible change; ' + (2 * dK / 3).toFixed(1) + '-' + dK.toFixed(1) + ' s it settles.');
      parts.push(emoLigne);
      if (!MINI_RUN && BOUSSOLE_VEO) parts.push('Pace and energy: ' + BOUSSOLE_VEO.split(/\s+/).slice(0, 30).join(' '));
      parts.push('Audio: complete silence — no voice, music, ambient noise or effects.');
    }

    body = body.replace(/[^.!?\n]*\b(?:subtitle|caption|on-screen text|text overlay|watermark)\w*[^.!?\n]*[.!?]?/gi, '').replace(/[ \t]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
    if ((c.repliques || []).length) { // on ne neutralise que ce qui fait vraiment dériver la voix : la COUPE et le mouvement brutal. Un mouvement lent et continu est une seule prise, donc il est conservé.
      body = body
        .replace(/\b(?:whip[ -]?pan|snap[ -]?(?:zoom|pan)|crash[ -]?zoom|smash[ -]?cut|jump[ -]?cut|hard cut|quick cut|cut to|cuts to|cutaway|match cut|swish[ -]?pan)\b/gi, 'continuous slow camera move')
        .replace(/\b(?:rapid(?:ly)?|fast|quick(?:ly)?|sudden(?:ly)?|abrupt(?:ly)?|violent(?:ly)?|snappy)\s+(?=(?:camera\s+)?(?:pan|tilt|zoom|dolly|track|push|move|movement|whip))/gi, 'slow ')
        .replace(/\b(?:then|and then)\s+(?:we\s+)?cut\b[^.;]*/gi, 'the same continuous take continues')
        .replace(/\s{2,}/g, ' ').replace(/\s+([.,;:])/g, '$1');
    }
    { // minutage des plans recalculé sur le nombre de mots : un plan ne porte jamais plus de 3,2 mots par seconde si la répartition peut l'éviter
      const pls = Array.isArray(c.plans) ? c.plans : [];
      const dur = Number(c.duree_s || 8) || 8;
      const locs = new Set((c.repliques || []).map(r => norm(repLoc(r))).filter(Boolean));
      if (pls.length > 1 && locs.size <= 1) {   // un seul locuteur : un seul plan continu, aucune coupe où la voix puisse dériver
        const codes0 = body.match(/\d+(?:[.,]\d+)?\s*[-–—]\s*\d+(?:[.,]\d+)?\s*s\b/g) || [];
        if (codes0.length === pls.length) {
          let k0 = 0;
          body = body.replace(/\d+(?:[.,]\d+)?\s*[-–—]\s*\d+(?:[.,]\d+)?\s*s\s*:\s*/g, () => (k0++ === 0 ? '0.0-' + dur.toFixed(1) + 's: ' : ''));
          c.plans = [{ t0: 0, t1: dur, repliques: (c.repliques || []).map((_, i2) => i2) }];
          c._minutage = 'plan unique 0-' + dur + 's (un seul locuteur)';
        }
      } else if (pls.length > 1 && pls.length <= 3) {
        const motsDe = pl => (pl.repliques || []).reduce((a, i) => a + String(repTexte((c.repliques || [])[i]) || '').trim().split(/\s+/).filter(Boolean).length, 0);
        const mots = pls.map(motsDe), total = mots.reduce((a, b) => a + b, 0);
        if (total > 0) {
          const mini = 2, libre = dur - mini * pls.length;
          let t = 0; const bornes = [];
          pls.forEach((pl, i) => {
            let d = i === pls.length - 1 ? dur - t : Math.round((mini + libre * mots[i] / total) * 2) / 2;
            if (i < pls.length - 1) d = Math.max(mini, Math.min(d, dur - t - mini * (pls.length - 1 - i)));
            bornes.push([t, Math.round((t + d) * 10) / 10]); t = Math.round((t + d) * 10) / 10;
          });
          const codes = body.match(/\d+(?:[.,]\d+)?\s*[-–—]\s*\d+(?:[.,]\d+)?\s*s\b/g) || [];
          if (codes.length === pls.length) { // on ne réécrit que si le corps porte exactement un horodatage par plan
            let k2 = 0;
            body = body.replace(/\d+(?:[.,]\d+)?\s*[-–—]\s*\d+(?:[.,]\d+)?\s*s\b/g, () => { const b = bornes[k2++]; return b[0].toFixed(1) + '-' + b[1].toFixed(1) + 's'; });
            pls.forEach((pl, i) => { pl.t0 = bornes[i][0]; pl.t1 = bornes[i][1]; });
            c._minutage = bornes.map((b, i) => b[0] + '-' + b[1] + 's (' + mots[i] + ' mots)').join(' | ');
          }
        }
      }
    }
    let bodyV = body; (c.repliques || []).forEach(r => { // les chiffres ne sont épelés que si la langue du marché est le français (sinon on laisse le texte tel quel)
      const tx = repTexte(r).trim(); if (!tx) return;
      const vx = voix.find(x => norm(x.personnage) === norm(repLoc(r))) || (voix.length === 1 ? voix[0] : null);
      if (vx && vx.langue && !/^fr/i.test(String(vx.langue))) return;
      const sp = spoken(tx); if (sp !== tx && bodyV.includes(tx)) bodyV = bodyV.split(tx).join(sp); });
    { // la phrase qui porte la réplique est déplacée en fin de corps : c'est la dernière chose que le modèle lit
      const coupePhrases = t2 => { // on ne coupe JAMAIS à l'intérieur d'une citation
        const out = []; let cur = '', q = false;
        for (let i2 = 0; i2 < t2.length; i2++) {
          const ch = t2[i2]; cur += ch;
          if (ch === '"') q = !q;
          if (!q && /[.!?]/.test(ch) && /\s/.test(t2[i2 + 1] || ' ')) { out.push(cur.trim()); cur = ''; }
        }
        if (cur.trim()) out.push(cur.trim());
        return out;
      };
      const lignes2 = bodyV.split('\n'), dern = lignes2.length - 1, avantT = bodyV;
      const phr = coupePhrases(lignes2[dern]);
      const avec = phr.filter(x => /"/.test(x)), sans = phr.filter(x => !/"/.test(x));
      if (avec.length && sans.length) {
        lignes2[dern] = sans.concat(avec).join(' ');
        const essai = lignes2.join('\n');
        const intact = (c.repliques || []).every(r => { const tx3 = spoken(repTexte(r).trim()); return !tx3 || essai.includes(tx3) || essai.includes(repTexte(r).trim()); });
        bodyV = intact ? essai : avantT;   // au moindre doute, on ne touche pas au corps
      }
    }
    const tete2 = parts.filter(Boolean), consignes = tete2.filter(x => /^(Voice of|Lip sync|Only |Camera|Audio:|The voice comes from|Performance in|Staging|Emotion readable|Detail:|Frame:|Objects:|Product:|Identity:|Timing:|No posing:)/.test(x) || /never speaks|lips stay/.test(x));
    let avantCorps = tete2.filter(x => !consignes.includes(x));
    // v6.5 — Veo tronque au-delà d'environ 520 mots, et il tronque par la FIN : les dernières consignes (la voix, qui
    // se tait, la caméra) et le dernier temps du clip disparaissent, donc le modèle improvise la fin — objets qui
    // apparaissent, qui changent de nombre, qui se déplacent tout seuls. Plutôt que de laisser Veo couper au hasard,
    // le code raccourcit lui-même le CORPS, phrase par phrase en partant de la fin, en gardant toujours : la tête,
    // toutes les répliques entre guillemets, et les consignes de voix et de caméra.
    const mots = t2 => String(t2).split(/\s+/).filter(Boolean).length;
    // v6.19 — Lite plafonne à 1024 tokens. Un prompt majoritairement anglais compte ~1,4 token par mot, les répliques
    // françaises ~2 : à 520 mots on est vers 790 tokens, donc sous le plafond. Les 380 mots de la v6.16 étaient trop
    // prudents et rabotaient le décor pour rien. La limite redevient celle de Veo lui-même, qui tronque vers 520 mots.
    const MAXP = parseInt(process.env.VEO_MAX_MOTS || '520', 10);
    let corpsFinal = bodyV;
    const total = () => mots(avantCorps.join('\n')) + mots(corpsFinal) + mots(consignes.join('\n'));
    if (total() > MAXP) {
      const avant = total();
      const protege = (c.repliques || []).map(r => spoken(repTexte(r).trim())).filter(Boolean);
      const phrases = corpsFinal.split(/(?<=[.!?])\s+(?=[A-Z0-9«"])/);
      for (let i3 = phrases.length - 1; i3 >= 1 && total() > MAXP; i3--) {
        const ph = phrases[i3];
        if (/"/.test(ph) || protege.some(t3 => ph.includes(t3)) || /\b(?:at \d|for the first \d|seconds?\b)/i.test(ph)) continue;   // jamais une phrase qui porte une réplique
        phrases.splice(i3, 1); corpsFinal = phrases.join(' ');
      }
      // v6.34 — on coupe d'abord les phrases de DECOR du corps (les temps d'action dates et les repliques sont proteges),
      // puis seulement la tete. Couper la tete en premier (v6.33) la vidait de son style et de ses ancrages d'identite.
      // si le corps ne suffit pas, on allège la TÊTE : elle décrit surtout le décor, que l'image de référence porte déjà.
      // Intouchables : la première phrase (format et registre) et la consigne qui impose l'image comme première image.
      for (let i4 = avantCorps.length - 1; i4 >= 1 && total() > MAXP; i4--) {
        if (/Animate the attached image|first frame/i.test(avantCorps[i4])) continue;
        avantCorps.splice(i4, 1);
      }
      if (total() > MAXP) {   // v6.34 — dernier recours : on retire NOUS-MEMES les consignes les moins critiques, dans un ordre
        // decide ici, plutot que de laisser Veo couper la FIN du prompt (c'est-a-dire le jeu, l'emotion et l'audio).
        for (const re of [/^Identity:/, /^Detail:/, /^Frame:/, /^No posing:/, /^No face exists/, /^Every character keeps the exact size/]) {
          for (let i5 = consignes.length - 1; i5 >= 0 && total() > MAXP; i5--) if (re.test(consignes[i5])) consignes.splice(i5, 1);
          for (let i5 = avantCorps.length - 1; i5 >= 0 && total() > MAXP; i5--) if (re.test(avantCorps[i5])) avantCorps.splice(i5, 1);
          if (total() <= MAXP) break;
        }
      }
      const apres = total();
      if (apres < avant) log('Clip ' + (c.bloc || '?') + ' : prompt ramené de ' + avant + ' à ' + apres + ' mots (limite ' + MAXP + ') en retirant des phrases de décor — toutes les répliques et les consignes de voix sont conservées.');
      if (apres > MAXP) log('Clip ' + (c.bloc || '?') + ' : prompt encore à ' + apres + ' mots alors que la limite est ' + MAXP + ' ; Veo en coupera la fin. Raccourcis le corps écrit par l\'agent.');
    }
    c.prompt_veo = avantCorps.join('\n') + '\n\n' + corpsFinal + '\n\n' + consignes.join('\n'); c._assembled = true; c._corps = body;
    if (MINI_RUN) {
      // v6.53 — PROMPT COURT, L'ACTION D'ABORD. Mesure (run 94b5e103) : prompts de 380 a 500 mots dont 60 d'action, 14 clips
      // sur 15 « quasi figes ». Le geste etait noye sous les consignes generiques. En mini-plans, Veo recoit ~120 mots : le
      // geste et son temps fort, le jeu, la camera, l'identite verrouillee en une phrase, le registre en une phrase.
      const motsMax = (t5, n5) => { const w5 = String(t5 || '').trim().split(/\s+/).filter(Boolean); return w5.length <= n5 ? w5.join(' ') : w5.slice(0, n5).join(' ').replace(/[,;:]$/, '') + '.'; };
      const emoC = String(c.emotion || '').replace(/[\r\n]+/g, ' ').trim();
      const styM = motsMax(styCourt, 28);
      c.prompt_veo = estInsert(c) ? motsMax(corpsFinal, 60) : [
        'Animate the attached image; it is the exact first frame. ' + motsMax(corpsFinal, 70),
        'Acting: ' + (/^[\x20-\x7E]{3,120}$/.test(emoC) ? emoC : emoTxt) + ' — played with the big, readable intensity of a 3D animated feature film: eyes, brows, mouth, shoulders and hands all show it, and it grows during the first second.',
        'The action is already under way in the first frame, reaches its peak at about 1 second and keeps moving until the last frame: something in the frame is always in motion (body, hands, hair, fabric, light). One continuous take in one place: nothing appears, transforms or changes scene.',
        camLigne,
        c.produit_visible === true ? 'The product stays exactly as in the image, label facing the camera, never rotated or re-lettered.' : '',
        'Faces, skin tones, hair, outfits, objects and proportions stay exactly as in the image; hands keep five fingers; lips stay closed, nobody speaks.',
        BOUSSOLE_VEO ? motsMax('Pace and energy of the whole film: ' + BOUSSOLE_VEO, 30) : '',
        styM,
        'Audio: complete silence.'
      ].filter(Boolean).join('\n');
    }
    if (reps0) c.repliques = reps0;   // v6.32 : voix off — le texte reste porte par le plan, c'est la voix qui le dira
  });
  return plan;
}
// Une image par changement de décor : chaque clip reçoit l'image de SON décor (jamais celle d'un autre).
// Chaînage d'identité (calculé par le code d'après les personnages contenus dans les images) :
// si une image partage un personnage avec une image précédente, elle est générée à partir de la plus récente de celles-ci ;
// l'agent peut aussi déclarer `suite_de` (continuité de décor sans personnage commun) ; un identifiant invalide est effacé.
function assignRefs(plan) {
  const irs = plan.images_reference || [];
  const chars = x => (x.personnages || []).filter(q => !isProductNode(q)).map(norm);
  irs.forEach((x, i) => {
    const earlier = irs.slice(0, i);
    if (x.suite_de && !earlier.some(e => e.id === x.suite_de)) x.suite_de = null;
    // parent = l'image antérieure la plus proche : même lieu (mots communs des noms de décor) d'abord, puis personnages communs, puis la plus récente
    const toks = d => new Set(String(d || '').toLowerCase().split(/[^a-zà-ÿ0-9]+/).filter(t => t.length > 2));
    const score = e => { const a = toks(e.decor || e.id), b = toks(x.decor || x.id); let t = 0; a.forEach(w => { if (b.has(w)) t++; }); return 10 * t + chars(e).filter(q => chars(x).includes(q)).length; };
    const cands = earlier.map((e, k) => ({ e, k, sc: score(e) })).filter(o => o.sc > 0).sort((p1, p2) => p2.sc - p1.sc || p2.k - p1.k);
    if (cands.length) { const cur = earlier.find(e => e.id === x.suite_de); if (!cur || score(cur) < cands[0].sc) x.suite_de = cands[0].e.id; }
  });
  // v6.2 — l'image de référence EST la première image du clip : chaque clip garde CELLE QUE LE PLAN LUI A DONNÉE.
  // Avant, le code réattribuait les images par nom de décor : trois clips tournés dans la même pièce recevaient tous
  // la première image de cette pièce, et les images des autres états (colis ouvert, exemplaires alignés) étaient
  // dessinées, payées, puis jamais envoyées à Veo. Le décor ne sert plus que de repli quand le plan ne déclare rien.
  const pris = new Set();
  (plan.clips || []).forEach(c => {
    const dec = (Array.isArray(c.references) ? c.references : []).filter(r => irs.some(x => x.id === r));
    if (dec.length) { c.references = [dec[0]]; pris.add(dec[0]); return; }
    const sameDec = irs.filter(x => norm(x.decor || '') && norm(x.decor) === norm(c.decor || ''));
    const own = sameDec.find(x => !pris.has(x.id)) || sameDec[0];   // une image libre d'abord, sinon on partage
    c.references = own ? [own.id] : [];
    if (own) pris.add(own.id);
  });
  // un personnage qui parle est visible dans son clip et dans l'image du clip (sa voix est liée à son visage)
  (plan.clips || []).forEach(c => { const ir = irs.find(i => i.id === (c.references || [])[0]); const vis = c.personnages_visibles = c.personnages_visibles || [];
    if (!VOIX_OFF_RUN) [...new Set((c.repliques || []).map(r => repLoc(r)).filter(Boolean))].forEach(sp => { if (!vis.some(v => norm(v) === norm(sp))) vis.push(sp); if (ir && !(ir.personnages || []).some(v => norm(v) === norm(sp))) (ir.personnages = ir.personnages || []).push(sp); }); });
  // corrections mécaniques par le code (jamais un arrêt) : le produit est dans l'image de chaque clip qui le montre, et seulement là
  irs.forEach(x => { const users = (plan.clips || []).filter(c => (c.references || [])[0] === x.id); const shows = users.some(c => c.produit_visible === true); if (shows && !hasProduct(x)) x.produit_dans_image = true; else if (!shows && x.produit_dans_image === true && users.length) x.produit_dans_image = false; });
  const keep = new Set(); const addK = id => { if (!id || keep.has(id)) return; keep.add(id); const ir = irs.find(x => x.id === id); if (ir) addK(ir.suite_de); };
  (plan.clips || []).forEach(c => (c.references || []).forEach(addK));
  plan.images_reference = irs.filter(x => keep.has(x.id));
  return plan;
}
// v6.47 — NOMBRE DE CLIPS VARIABLE. Le CT donne sa durée (« Durée cible », 8 s par clip) : un CT de 36 s n'est plus amputé à 32 s.
// Borne haute MAX_CLIPS (9 par défaut, soit 72 s) ; borne basse 4. Le budget peut encore le réduire (voir budgetNC).
const MAX_CLIPS = parseInt(process.env.MAX_CLIPS || '9', 10);
// v6.58 — MODE DE VOIX LU PARTOUT DE LA MEME FACON. Avant, le marqueur machine "voix": "off_elevenlabs" etait seul lu : un CT dont la fiche
// dit « VOIX OFF, ElevenLabs » sans ce marqueur (CT015) tournait comme un CT parle (voix de Veo, plus cher, sans mini-plans).
// Ordre : 1) marqueur machine ; 2) ligne « | Voix | … » de la fiche d'identite ; sinon parle. Rien n'est devine ailleurs.
function modeVoixCT(ct) {
  const t = String(ct || '');
  const m = t.match(/"voix"\s*:\s*"((?:[^"\\]|\\.)*)"/);
  if (m && m[1].trim()) return /chanson|chant[ée]e?|song|sung/i.test(m[1]) ? 'chanson' : (/off/i.test(m[1]) ? 'off' : 'parle');
  const f = t.match(/\|\s*Voix\s*\|([^\n]*)/i);
  if (f) {
    const v = f[1].replace(/\*/g, '');
    if (/\bCHANSON\b/i.test(v)) return 'chanson';
    if (/\bVOIX[ _-]?OFF\b|off[_-]?elevenlabs/i.test(v) && !/\b(?:pas de|aucune?|sans)\s+voix[ _-]?off\b/i.test(v)) return 'off';
  }
  return 'parle';
}
function ncDuCT(ct) {
  const m = /Durée cible[^\n]*?(\d{2,3})\s*(?:s\b|sec)/i.exec(String(ct || ''));
  const sec = m ? parseInt(m[1], 10) : 32;
  return Math.max(4, Math.min(MAX_CLIPS, Math.round(sec / 8)));
}
const BLOQUANT = /(Il faut exactement \d+ clips|sans image de décor)/; // seuls blocages : ce que Veo ne peut pas recevoir (pas 4 clips, clip sans image). Tout le reste est une remarque lue par l'utilisateur, jamais un arrêt ni une correction.
function validatePlan(plan, synth, PP) {   // v6.58 : PP = le contexte de la production (bible, roles non requis) ; avant, `P` n'existait pas ici et le controle de l'offre ne s'executait JAMAIS
  const v = [], S = norm(synth).replace(/ /g, '').replace(/[.,]/g, '');
  const clips = plan.clips || [];
  const voix = Array.isArray(plan.voix) ? plan.voix : (plan.voix ? [{ personnage: '', description_exacte: plan.voix.description_exacte }] : []);
  const NC = plan._nc || 4;
  if (clips.length !== NC) v.push('Il faut exactement ' + NC + ' clips (bloc 1 à ' + NC + '), reçu ' + clips.length);
  // v6.43 — LE PACKSHOT N'EST PAS UNE SCENE. Mesure : les gelules posees devant le flacon sur la photo produit etaient dessinees
  // sur la table de nuit, dans le salon, a cote du flacon de CHAQUE plan. Le code releve sur la photo ce qui est HORS du
  // contenant ; si ce nom revient dans la majorite des clips, c'est du packshot recopie, pas une action.
  {
    const hors = String((plan._fiche && plan._fiche.hors_contenant) || '').toLowerCase();
    const bruit = /^(two|three|four|five|some|several|few|small|large|little|light|beige|white|dark|black|loose|scattered|visible|next|beside|front|bottle|jar|tube|box|container|and|the|of|a|an|pieces?|items?)$/;
    const noms = [...new Set((hors.match(/[a-z]{4,}/g) || []).filter(w => !bruit.test(w)).map(w => w.replace(/s$/, '')))];
    if (noms.length) {
      const re = new RegExp('\\b(?:' + noms.join('|') + ')s?\\b', 'i');
      const nC = clips.filter(c => re.test(String(c._corps || c.prompt_veo || '').replace(/"[^"]*"/g, ' '))).length;
      const nI = (plan.images_reference || []).filter(x => re.test(String(x.prompt_gemini || ''))).length;
      if (nC >= 3 || nI >= 3) v.push('Packshot recopié dans la scène : « ' + hors + ' » est posé à côté du produit sur la PHOTO (décor de photographe) et revient dans ' + nC + ' clip(s) / ' + nI + ' image(s). Le produit est le contenant seul ; ce qui est posé à côté ne figure que dans UN clip dont l\'action est de le sortir du contenant, une seule pièce dans une main.');
    }
  }
  // v6.36 — LA TRANSPOSITION (PV31, §5bis). Un CT decrit une suite de PREUVES ; le geste qu'il montre n'appartient
  // qu'au produit de la pub source. Sans ce raisonnement ecrit, l'agent se replie sur « quelqu'un parle en tenant le
  // produit » des que le geste du CT ne va pas de soi — et la video devient un plan-parole de 32 s, quel que soit le CT.
  {
    const tr = Array.isArray(plan.transposition) ? plan.transposition : [];
    const texte = x => String((x && x.geste) || '').replace(/\s+/g, ' ').trim();
    if (tr.length < clips.length) v.push('transposition : il faut une entree par bloc (' + clips.length + ' attendues, ' + tr.length + ' recue(s)) — ce que le bloc PROUVE, puis le geste reel de CE produit qui le prouve (§5bis)');
    else {
      tr.slice(0, clips.length).forEach((t, i2) => {
        const g = texte(t), pr = String((t && t.preuve) || '').trim();
        if (pr.split(/\s+/).filter(Boolean).length < 3) v.push('transposition, bloc ' + (i2 + 1) + ' : `preuve` manquante ou trop vague — ecris ce que ce bloc doit PROUVER au spectateur');
        if (g.split(/\s+/).filter(Boolean).length < 4) v.push('transposition, bloc ' + (i2 + 1) + ' : `geste` manquant ou trop vague — nomme le geste reel du produit, filmable en 8 s');
        else if (/^(?:elle?|il|la personne|le personnage|the )?\s*(?:parle|dit|explique|raconte|presente|présente|montre le produit|tient le produit|regarde la camera|regarde la caméra|sourit)\b/i.test(g) && !/\b(?:ouvre|verse|dose|applique|pose|prend|sort|retire|enfile|ferme|remue|melange|mélange|range|essuie|tend|compte|deplie|déplie|remplit|branche|allume|coupe|etale|étale|glisse|soulève|souleve|ecarte|écarte)\b/i.test(g))
          v.push('transposition, bloc ' + (i2 + 1) + ' : « ' + g.slice(0, 60) + ' » n\'est pas un geste, c\'est quelqu\'un qui parle — un bloc dont le geste est difficile se rejoue sur la preparation, la dose, la mise en place, le rangement ou le resultat tenu en main (§5bis), jamais sur un visage qui parle');
      });
      const gs = tr.slice(0, clips.length).map(t => norm(texte(t))).filter(Boolean);
      if (gs.length >= 3 && new Set(gs).size <= Math.max(1, gs.length - 2)) v.push('transposition : les gestes des blocs se repetent (' + new Set(gs).size + ' geste(s) different(s) pour ' + gs.length + ' blocs) — les quatre blocs doivent progresser, chacun prouvant autre chose');
    }
  }
  clips.forEach((c, i) => {
    const n = 'Clip ' + (i + 1);
    if (!VOIX_OFF_RUN && c.duree_s !== 8) v.push(n + ' : duree_s doit valoir 8');   // v6.43 : en voix off la duree d'un clip est celle de SA voix mesuree, pas 8
    const reps = VOIX_OFF_RUN ? [] : (c.repliques || []);   // v6.32 : en voix off aucun controle de parole a l'image ne s'applique (54 faux ecarts mesures)
    const words = reps.map(repTexte).join(' ').trim().split(/\s+/).filter(Boolean).length;
    const parRep = reps.map(r => repTexte(r).trim().split(/\s+/).filter(Boolean).length);
    // v6.14 — L'ALLUSION. Une réplique qui désigne au lieu de nommer (« quant à ça », « ils sont le problème »)
    // oblige le spectateur à deviner. Répétée, elle rend toute la vidéo floue. On vérifie qu'un nom commun a bien
    // été prononcé avant le démonstratif, dans la même réplique ou dans la précédente du même clip.
    const DEM = /(?:^|[\s,;:«"'])(quant à (?:ç|c)a|(?:ç|c)a|cela|ceci|celui-là|celle-là|ceux-là|ce truc|ce machin|ce dernier)(?=$|[\s,;:.!?»"'])/i;
    const NOMME = /(?:\b(?:le|la|les|un|une|des|du|de la|ton|ta|tes|mon|ma|mes|son|sa|ses|votre|vos|leur|leurs|ce|cet|cette|ces)\s+)[a-zà-ÿ][a-zà-ÿ'-]{2,}/i;
    reps.forEach((r, k) => {
      const t = repTexte(r); const m = DEM.exec(t); if (!m) return;
      const avant = (k > 0 ? repTexte(reps[k - 1]) + ' ' : '') + t.slice(0, m.index + m[0].length - m[1].length);
      if (NOMME.test(avant)) return;
      v.push(n + ' : allusion dans « ' + t.trim().slice(0, 70) + ' » — « ' + m[1] + ' » ne renvoie à aucun nom prononcé avant. Nomme la chose (« le café que tu bois », « les boissons sucrées ») au lieu de la désigner : le spectateur entend avant de regarder.');
    });
    // pronoms de 3e personne : « leur donner raison », « ils sont le problème » — personne ne sait de qui on parle
    const PLUR = /(?:^|[\s,;:«"'])(ils|elles|eux|leur|leurs)(?=$|[\s,;:.!?»"'])/i;
    const HUMAIN = /\b(?:les|des|ces|mes|tes|ses|nos|vos|leurs|aux|mon|ton|son)\s+[a-zà-ÿ][a-zà-ÿ'-]{2,}s?\b|\b(?:gens|monde|collègues|patron|famille|médecins|marques|vendeurs|amis|enfants|équipe|voisins|autres)\b/i;
    reps.forEach((r, k) => {
      const t = repTexte(r); const m = PLUR.exec(t); if (!m) return;
      const avant = (i === 0 && k === 0 ? '' : 'X ') + (k > 0 ? repTexte(reps[k - 1]) + ' ' : '') + t.slice(0, m.index + m[0].length - m[1].length);
      if (HUMAIN.test(avant)) return;
      v.push(n + ' : pronom sans référent dans « ' + t.trim().slice(0, 70) + ' » — « ' + m[1] + ' » ne désigne personne de nommé. Dis QUI (« les gens au bureau », « ta famille », « les marques ») ou reformule sans pronom.');
    });
    if (i === 0 && reps.length && /^(ça|ca|cela|ceci|ils|elles|leur|leurs|eux)\b/i.test(repTexte(reps[0]).trim())) v.push(n + ' : la toute première réplique de la vidéo commence par un pronom sans référent — le spectateur ne sait pas de quoi on lui parle au moment où il décide de rester.');
    if (!VOIX_OFF_RUN && (words < 22 || words > 30)) v.push(n + ' : ' + words + ' mots de voix, attendu 24 a 28 (la parole doit courir jusque vers 7,4 s ; en dessous, la fin du clip est silencieuse et ca s\'entend).'
      + ' Decompte par replique : ' + parRep.join(' + ') + ' (raccourcis ou rallonge en gardant le sens de vente)');
    if (reps.length > 3) v.push(n + ' : ' + reps.length + ' répliques dans un clip de 8 s, maximum 3 (2 de préférence) : Veo marque une pause à chaque point, donc chaque réplique de plus est un silence de plus. Fusionne-les en phrases de 9 à 16 mots.');
    reps.forEach(r => { const t = repTexte(r).trim().replace(/\.$/, '');
      if (/[.](\s|$)/.test(t)) v.push(n + ' : deux phrases dans une même réplique (« ' + repTexte(r).trim().slice(0, 70) + ' ») — Veo marque un silence à chaque point. Enchaîne avec une virgule ou un mot de liaison, ou fais-en deux répliques.'); });
    if (reps.length > 1 && !/^(et|mais|parce que|alors|donc|pourtant|sauf que|car|puis|or|sans parler)/i.test(repTexte(reps[1] || {}).trim())) v.push(n + ' : la deuxième réplique ne commence pas par un mot de liaison — la voix retombe entre les deux et le clip sonne coupé en deux.');
    if (parRep.filter(x => x < 9).length > 1) v.push(n + ' : ' + parRep.filter(x => x < 9).length + ' répliques de moins de 9 mots (' + parRep.join(' + ') + ') : une seule réplique courte est admise dans toute la vidéo, sinon le débit est haché et le clip paraît vide.');
    const pw = String(c.prompt_veo || '').trim().split(/\s+/).filter(Boolean).length;
    const maxp = 520;
    if (pw > maxp) v.push(n + ' : prompt assemblé de ' + pw + ' mots, maximum ' + maxp + ' (sinon tronqué par Veo) : raccourcis le corps du prompt');
    const P = norm(c.prompt_veo);
    reps.forEach(r => {
      const t = norm(repTexte(r));
      if (t && !norm(c._corps || c.prompt_veo || '').includes(t.slice(0, 25))) v.push(n + ' : la réplique « ' + repTexte(r).slice(0, 30) + '… » n\'apparaît pas entre guillemets dans prompt_veo');
      const loc = repLoc(r);
      if (voix.length > 1 && !loc) v.push(n + ' : une réplique n\'a pas de locuteur');
      const vx = voix.find(x => norm(x.personnage) === norm(loc)) || (voix.length === 1 ? voix[0] : null);
      if (!vx) { if (loc) v.push(n + ' : le locuteur « ' + loc + ' » n\'a pas de description dans voix[]'); }
      else if (!P.includes(norm(vx.description_exacte))) v.push(n + ' : la description de voix de « ' + (vx.personnage || 'voix') + ' » n\'est pas recopiée mot pour mot dans prompt_veo');
    });
    reps.forEach((r, j) => { if (!String((r && r.ton) || '').trim()) v.push(n + ' réplique ' + (j + 1) + ' : champ ton manquant (émotion de diction de cette réplique, en anglais)'); });
    const locs = new Set(reps.map(repLoc).filter(Boolean));
    if (locs.size > 1 && !/(silent|mouth closed|does not speak|stays quiet|lips closed)/i.test(c.prompt_veo || '')) v.push(n + ' : plusieurs locuteurs mais le prompt ne dit pas qui se tait (« stays silent, mouth closed »)');
  });
  if ((plan.images_reference || []).length > NC) v.push('Plus de ' + NC + ' images de référence générées (une par changement de décor, ' + NC + ' clips au maximum)');
  // v6.11 — le lieu est le mécanisme du CT, pas un décor : un CT qui refuse le bureau ne peut pas s'y tourner,
  // même si le persona y travaille. Un écart ici fait rejouer le plan entier (« lieu du CT » déclenche la correction).
  if (Array.isArray(plan._lieuxInterdits) && plan._lieuxInterdits.length) {
    (plan.images_reference || []).forEach(ir => {
      const champ = norm([ir.decor, ir.role, ir.contenu, ir.prompt_gemini].filter(Boolean).join(' '));
      const touche = plan._lieuxInterdits.filter(k => k && norm(k).length > 2 && champ.includes(norm(k)));
      if (touche.length) v.push('Image « ' + (ir.id || '?') + '  » : le lieu du CT n\'est pas respecté — « ' + touche.join(', ') + ' » est refusé par ce CT' + (plan._lieuCT ? ' (lieu imposé : ' + String(plan._lieuCT).slice(0, 110) + ')' : '') + '. Le métier du persona dit qui il est, pas où la scène se passe.');
    });
    clips.forEach((c, i) => {
      const champ = norm(String(c._corps || c.prompt_veo || '').replace(/"[^"]*"/g, ' '));
      const touche = plan._lieuxInterdits.filter(k => k && norm(k).length > 2 && champ.includes(norm(k)));
      if (touche.length) v.push('Clip ' + (i + 1) + ' : le lieu du CT n\'est pas respecté — « ' + touche.join(', ') + ' » est refusé par ce CT.');
    });
  }
  const texts = [].concat((plan.sous_titres || []).map(x => x.texte), (plan.surimpressions || []).map(x => x.texte), clips.flatMap(c => (c.repliques || []).map(repTexte)));
  texts.forEach(t => (String(t).replace(/\d{1,2}\s?(?:h(?:\s?\d{2})?|heures?)\b/gi, ' ').match(/\d[\d\s.,]*\d|\d/g) || []).forEach(n => { const k = n.replace(/[\s.,]/g, ''); if (k.length >= 2 && !S.includes(k)) v.push('Donnée chiffrée « ' + n.trim() + ' » absente de la synthèse (texte : « ' + String(t).slice(0, 60) + ' »)'); }));
  // ---- contrôles de structure (indépendants de l'auto-déclaration du modèle)
  const refIds = (plan.images_reference || []).map(x => x.id).filter(Boolean);
  const canSpeakVoix = voix.filter(x => x.a_l_image === 'hors_champ');
  clips.forEach((c, i) => {
    const n = 'Clip ' + (i + 1), P = String(c.prompt_veo || '');
    refIds.forEach(id => { if (new RegExp('\\b' + id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i').test(P)) v.push(n + ' : prompt_veo cite l\'identifiant de référence « ' + id + ' » (Veo ne le connaît pas ; décrire physiquement)'); });
    if (/\b(reference image|ref_[a-z0-9_]+|image de référence|first image|second image|image #?\d|\.png|\.jpg)/i.test(P)) v.push(n + ' : prompt_veo fait référence à une image/un fichier (formulation interdite, décrire physiquement)');
    if (/\b(?:previous|preceding|prior|next|last|earlier) (?:clip|shot|scene)\b|\bcontinu(?:es|ing) from\b|\b(?:the )?clip (?:cuts|ends) (?:mid|abruptly)/i.test(String(c._corps || P).replace(/"[^"]*"/g, ''))) v.push(n + ' : dépend d\'un autre clip (Veo ne voit que son image : chaque clip doit se suffire à lui-même, sans geste commencé ou fini ailleurs ni coupe en plein geste)');
    if (typeof c.produit_visible !== 'boolean') v.push(n + ' : champ produit_visible (true/false) manquant');
    if (!Array.isArray(c.personnages_visibles)) v.push(n + ' : champ personnages_visibles (liste) manquant');
    const reps = VOIX_OFF_RUN ? [] : (c.repliques || []);
    reps.forEach(r => {
      const loc = repLoc(r), vx = voix.find(x => norm(x.personnage) === norm(loc));
      if (vx && vx.a_l_image === 'hors_champ') {
        const others = (c.personnages_visibles || []).filter(nm => norm(nm) !== norm(loc));
        if (others.length && !/(mouth closed|lips closed|silent|does not speak|stays quiet)/i.test(P)) v.push(n + ' : « ' + loc + ' » est en voix hors-champ alors que ' + others.join(', ') + ' est/sont visible(s) sans être décrit(s) bouche fermée (Veo fera parler ce visage)');
      }
      // v6.22 — « sans_bouche » est abandonné : à l'essai, Veo qui entend une voix sans voir de bouche fait
      // pivoter le personnage et lui déforme le visage. Un locuteur est DE FACE dans son image, point.
      if (vx && vx.a_l_image === 'sans_bouche') v.push(n + ' : « ' + loc + ' » est déclaré sans_bouche alors qu\'il parle dans ce clip — cette option ne marche pas avec Veo, qui déforme le visage en le faisant pivoter vers la caméra. Mets le locuteur DE FACE dans son image de départ.');
      if (/\b(from behind|back to the (?:camera|lens)|seen from the back|sharp profile|in profile)\b/i.test(P) && (c.repliques || []).length) v.push(n + ' : le prompt cadre le personnage de dos ou de profil alors qu\'il parle dans ce clip — Veo le fera pivoter en pleine phrase et le visage se déformera. Caméra de face ou de trois quarts face.');
      if (vx && vx.a_l_image === 'visible' && !(c.personnages_visibles || []).some(nm => norm(nm) === norm(loc))) v.push(n + ' : « ' + loc + ' » parle mais n\'est pas dans personnages_visibles');
    });
    if (/\b(surimpression|overlay(?:s|ed)?|animated graphic|infographic|progress bar|bar filling|graphic (?:appears|fades)|text appears|captions?|title card|lower third)\b/i.test(String(c._corps || P).replace(/\b(?:no|without) (?:any )?(?:on-screen |added )?(?:text|graphics?|overlays?|captions?|subtitles?)\b/gi, ''))) v.push(n + ' : le prompt demande à Veo une surimpression, un graphique ou du texte à l\'écran (Veo les dessinerait mal) : les incrustations se déclarent dans `surimpressions` (posées au montage), jamais dans prompt_veo ; décris à la place l\'image filmable (le produit posé, un geste, un objet).');
    if (!estInsert(c)) { // v6.52 — ce que Veo rate a chaque fois : controle dur, corrige par une retouche chirurgicale du realisateur (v6.53 : un insert n'est pas envoye a Veo)
      const brut = String(c._corpsBrut || c._corps || P || '').replace(/\b(?:no|without|never)\b[^.]*/gi, ' ');
      const cite = re => '« ' + String((brut.match(re) || [''])[0]).slice(0, 40) + ' »';
      if (VEO_SCENE.test(brut)) v.push('[VEO] ' + n + ' : changement de scène DANS la prise ' + cite(VEO_SCENE) + ' — Veo part d\'une seule image et fait fondre un objet dans un autre. Un clip = un lieu, un sujet, une action ; le changement se fait au montage, entre deux clips. Réécris ce clip en UNE action.');
      if (VEO_TEXTE.test(brut)) v.push('[VEO] ' + n + ' : Veo doit écrire ou lire du texte ' + cite(VEO_TEXTE) + ' (étiquette en macro, carte, schéma, surimpression, chiffres) : il l\'invente déformé et dénature le produit. Montre le produit réel tenu ou posé ; la preuve se dit dans la voix.');
      if (VEO_VFX.test(brut)) v.push('[VEO] ' + n + ' : effet magique ' + cite(VEO_VFX) + ' : Veo le rend comme une tache lumineuse. L\'effet se montre par le corps (épaules qui descendent, souffle, sourire yeux fermés, lumière du jour sur le visage).');
      if ((VOIX_OFF_RUN || !(c.repliques || []).length) && VEO_PAROLE.test(brut)) v.push('[VEO] ' + n + ' : un personnage parle ' + cite(VEO_PAROLE) + ' alors que personne ne parle à l\'image : une bouche qui bouge sur la voix off ou la chanson casse tout. Bouche fermée, une autre action.');
      if (c.produit_visible === true && VEO_PRODUIT.test(brut)) v.push('[VEO] ' + n + ' : le produit tourne sur lui-même ' + cite(VEO_PRODUIT) + ' : Veo invente alors la face cachée et réécrit l\'étiquette. Produit tenu ou posé, étiquette face caméra, caméra lente.');
    }
    if (c.produit_visible === true && !/(product|bottle|packag|jar|box|pot|tube|capsule|pill)/i.test(P)) v.push(n + ' : produit_visible = true mais le prompt ne décrit pas le produit');
    if (c.produit_visible === false && /reproduce the product exactly/i.test(P)) v.push(n + ' : produit_visible = false mais le prompt décrit le produit');
    if (typeof c.nb_lieux === 'number' && c.nb_lieux > 1) v.push(n + ' : ' + c.nb_lieux + ' lieux dans un clip (maximum 1)');
    if (typeof c.nb_plans === 'number' && c.nb_plans > 2) v.push(n + ' : ' + c.nb_plans + ' plans dans un clip (maximum 2, chacun ≥ 3 s ; un seul plan si le même locuteur parle tout le clip) : moins de coupes = moins de dérive de décor et de voix');
    (c.plans || []).forEach((pl, k) => { if (pl.t1 - pl.t0 < 1.95) v.push(n + ' plan ' + (k + 1) + ' : durée ' + (pl.t1 - pl.t0).toFixed(1) + ' s (minimum 2 s)'); });
    // P9/P10 : continuité de voix et adéquation parole/temps
    const pls = c.plans;
    if (VOIX_OFF_RUN && (!Array.isArray(pls) || !pls.length)) { /* v6.43 : en voix off personne ne parle a l'image, il n'y a pas de plans de parole a decouper */ }
    else if (!Array.isArray(pls) || !pls.length) v.push(n + ' : champ plans manquant (découpage temporel avec indices de répliques)');
    else {
      let t = 0, okT = true; pls.forEach(pl => { if (Math.abs(pl.t0 - t) > 0.05 || !(pl.t1 > pl.t0)) okT = false; t = pl.t1; });
      if (!okT || Math.abs(t - 8) > 0.05) v.push(n + ' : plans non contigus ou ne couvrant pas exactement 0–8 s');
      const seen = [];
      pls.forEach((pl, k) => {
        const idx = pl.repliques || []; idx.forEach(x => seen.push(x));
        const w = idx.map(x => repTexte(reps[x])).join(' ').trim().split(/\s+/).filter(Boolean).length, d = pl.t1 - pl.t0;
        if (idx.length) { const rate = w / d; if (rate < 1.8 || rate > 3.6) v.push(n + ' plan ' + (k + 1) + ' (' + pl.t0 + '–' + pl.t1 + ' s) : ' + w + ' mots en ' + d.toFixed(1) + ' s = ' + rate.toFixed(1) + ' mots/s (attendu 1,8–3,6 ; sinon Veo répète ou invente des mots ; maximum ' + Math.floor(3.6 * d) + ' mots, minimum ' + Math.ceil(1.8 * d) + ')'); }
      });
      if (seen.length !== reps.length || new Set(seen).size !== reps.length) v.push(n + ' : chaque réplique doit appartenir à un seul plan (une réplique ne traverse pas une coupe)');
    }
    reps.forEach((r, ir2) => { const tx2 = repTexte(r).trim(); const w = tx2.split(/\s+/).filter(Boolean).length; if (w < 4 && !(ir2 === reps.length - 1 && /\b(command|achet|essai|essaye|découvr|decouvr|clique|prend|teste|commence)/i.test(tx2))) v.push(n + ' : réplique de ' + w + ' mots (minimum 4, sauf la réplique d\'appel à l\'action)'); });
    if (reps.length && !/(same voice|unchanged|identical|(remain|stay|keep)s?\s+(the same|consistent|constant))/i.test(P)) v.push(n + ' : le prompt n\'affirme pas que la même voix reste inchangée dans tout le clip');
    const locsC = new Set(reps.map(repLoc).filter(Boolean)); if (locsC.size > 2) v.push(n + ' : plus de 2 locuteurs dans un clip');
    let ch = 0, prev = null; reps.forEach(r => { const l = repLoc(r); if (prev !== null && l !== prev) ch++; prev = l; }); if (ch > 1) v.push(n + ' : ' + ch + ' changements de locuteur (maximum 1)');
    reps.forEach(r => { const w = repTexte(r).trim().split(/\s+/).filter(Boolean).length; if (w > 12) v.push(n + ' : une réplique de ' + w + ' mots (maximum 12)'); });
    if (!plan.style_visuel || !norm(P).includes(norm(plan.style_visuel).slice(0, 30))) v.push(n + ' : le style_visuel du plan n\'est pas repris à l\'identique dans prompt_veo');
  });
  // sous-titres : temps absolus 0-32 et texte issu des répliques
  const allVoice = norm(clips.flatMap(c => (c.repliques || []).map(repTexte)).join(' ')).replace(/[^a-z0-9àâäéèêëîïôöùûüçœ' ]/g, ' ').replace(/\s+/g, ' ');
  (plan.sous_titres || []).forEach(st => {
    if (!(st.t0 >= 0) || !(st.t1 <= 32.01) || !(st.t1 > st.t0)) v.push('Sous-titre « ' + String(st.texte).slice(0, 25) + ' » : temps hors de 0–32 s (' + st.t0 + '–' + st.t1 + ')');
    const stn = norm(st.texte).replace(/[^a-z0-9àâäéèêëîïôöùûüçœ' ]/g, ' ').replace(/\s+/g, ' ').trim();
    if (stn && !allVoice.includes(stn)) v.push('Sous-titre « ' + String(st.texte).slice(0, 40) + ' » : n\'est pas extrait mot pour mot des répliques');
    const sw = String(st.texte).trim().split(/\s+/).filter(Boolean).length; if (sw > 6) v.push('Sous-titre « ' + String(st.texte).slice(0, 25) + '… » : ' + sw + ' mots (2 à 5 attendus)');
  });
  (plan.surimpressions || []).forEach(o => { const a0 = o.t0 != null ? o.t0 : o.debut_s, a1 = o.t1 != null ? o.t1 : o.fin_s, lim = (plan._nc || 4) * 8 + 0.01; if (!(a0 >= 0) || !(a1 <= lim)) v.push('Surimpression hors de 0–' + Math.round(lim) + ' s'); });   // v6.49 : durée du plan, et les deux notations de temps (t0/t1 ou debut_s/fin_s)
  // marque : null si la synthèse n'en fournit pas
  if (/AUCUNE MARQUE FOURNIE/i.test(synth)) {
    if (plan.end_card && plan.end_card.marque) v.push('end_card.marque = « ' + plan.end_card.marque + ' » alors que la synthèse indique [AUCUNE MARQUE FOURNIE] (doit valoir null)');
  }
  // images de référence : une image par décor ; chaque clip déclare celles qu'il utilise ; cohabitants d'un même clip sur une seule image
  const irs = plan.images_reference || [];
  const byId = {}; irs.forEach(x => { byId[x.id] = x; });
  // v6.2 — une image = la première image d'UN clip (état de départ), plus « un lieu = une image ».
  // On ne reproche donc plus à deux images de partager un lieu ; on vérifie que chaque image sert et que chaque clip a la sienne.
  const decDup = {}; irs.forEach(x => { const d = norm(x.decor || ''); if (!d) { v.push('images_reference : « ' + x.id + ' » sans champ decor'); return; } if (decDup[d]) v.push('images_reference : « ' + decDup[d] + ' » et « ' + x.id + ' » portent le même identifiant de décor : donne à chaque état de départ son propre identifiant (même pièce, objets différents = deux décors)'); else decDup[d] = x.id; });
  // v6.6 — un objet que le clip MONTRE doit être dessiné dans son image de départ (P0zero) : le modèle vidéo ne fait
  // entrer dans le cadre que ce qui s'y trouve déjà. Le code met bien produit_dans_image à true quand un clip montre
  // le produit, mais si le prompt de l'image ne le décrit pas, l'image sort sans produit et le clip demande à Veo de
  // le faire apparaître de nulle part : il invente un autre flacon, ou rien n'apparaît.
  { const MOTS_PRODUIT = /(flacon|bouteille|bottle|pot\b|jar\b|boîte|boite|box\b|sachet|pouch|tube|pack|paquet|produit|product|étiquette|label|capsule|comprim)/i;
    irs.forEach(x => {
      if (x.produit_dans_image !== true) return;
      const pg = String(x.prompt_gemini || '');
      if (!pg) return;
      if (!MOTS_PRODUIT.test(pg)) v.push('images_reference : « ' + x.id + ' » est déclarée avec le produit (produit_dans_image) mais son prompt d\'image ne le décrit pas : ajoute le produit au prompt, sinon l\'image sortira sans lui et le clip demandera à Veo de le faire apparaître de nulle part');
    }); }
  { const parClip = {}; (clips || []).forEach((c, i) => { const r = (Array.isArray(c.references) ? c.references : [])[0]; if (r) (parClip[r] = parClip[r] || []).push(i + 1); });
    Object.keys(parClip).forEach(r => { if (parClip[r].length > 1) v.push('images_reference : les clips ' + parClip[r].join(' et ') + ' partagent l\'image « ' + r +' » : légitime seulement si leur toute première seconde est identique (mêmes objets, mêmes places, mêmes poses), sinon donne à chacun son image'); }); }
  clips.forEach((c, i) => {
    const refs = Array.isArray(c.references) ? c.references : [];
    refs.forEach(r => { if (!byId[r]) v.push('Clip ' + (i + 1) + ' : references cite « ' + r + ' », image inexistante'); });
    const used = refs.filter(r => byId[r]);
    for (let x = 0; x < used.length; x++) for (let y = x + 1; y < used.length; y++) {
      const A = (byId[used[x]].personnages || []).map(norm), B = (byId[used[y]].personnages || []).map(norm), vis = (c.personnages_visibles || []).map(norm);
      if (A.some(q => vis.includes(q) && B.includes(q))) v.push('Clip ' + (i + 1) + ' : « ' + used[x] + ' » et « ' + used[y] + ' » contiennent le même personnage visible dans ce clip → une seule image pour ce décor');
    }
    if (!used.length && (c.personnages_visibles || []).length) v.push('Clip ' + (i + 1) + ' : sans image de décor alors que des personnages sont visibles (créer l\'image de ce décor avec ces personnages, ou rattacher le clip au décor d\'une image existante)');
    if (used.length === 1) { const im = byId[used[0]], has = (im.personnages || []).map(norm); (c.personnages_visibles || []).forEach(nm => { if (!has.some(h => h.includes(norm(nm)) || norm(nm).includes(h))) v.push('Clip ' + (i + 1) + ' : l\'image « ' + im.id + ' » ne contient pas « ' + nm + ' » alors que ce personnage est visible dans ce clip (l\'image du décor doit contenir tous les personnages visibles de ses clips)'); }); }
    if (used.length > 1) v.push('Clip ' + (i + 1) + ' : plus d\'une image de décor attribuée');
  });
  clips.forEach((c, i) => { const im = byId[(c.references || [])[0]]; if (c.produit_visible === true && im && !hasProduct(im)) v.push('Clip ' + (i + 1) + ' : sans le produit dans son image (Veo ne reçoit que l\'image du clip : le produit doit figurer dans l\'image de ce clip dès qu\'il apparaît, même s\'il n\'entre dans le plan qu\'en cours de clip ; si le même décor sert à un clip sans produit, crée une variante d\'image avec le produit, chaînée par suite_de)'); });
  irs.forEach(x => { // cohérence produit ↔ image : le produit n'est dans une image que si un clip de cette image le montre
    const withP = hasProduct(x), users = clips.filter(c => (c.references || []).includes(x.id));
    if (withP && users.length && !users.some(c => c.produit_visible === true)) v.push('images_reference : « ' + x.id + ' » contient le produit alors qu\'aucun de ses clips n\'a produit_visible = true (le produit n\'apparaît que là où le CT le place)');
  });
  irs.forEach(x => { if (!clips.some(c => (c.references || []).includes(x.id))) v.push('images_reference : « ' + x.id + ' » n\'est attribuée à aucun clip (champ references des clips)'); });
  { const fn = (plan.fiches_personnages || []).map(f => norm(f.nom)); clips.forEach((c, i) => (c.personnages_visibles || []).forEach(nm => { if (!fn.includes(norm(nm)) && !(Array.isArray(plan.voix) && plan.voix.some(x => norm(x.personnage) === norm(nm)))) v.push('Clip ' + (i + 1) + ' : pas de fiche_personnage pour « ' + nm + ' » (fiches_personnages)'); })); }
  const sv = norm(plan.style_visuel);
  if (/(photorealis|photoréalis|live-action|documentary)/.test(sv) && /(pixar|animated|animation|cartoon|3d render|illustrat|stylis)/.test(sv)) v.push('style_visuel contradictoire : mélange réalisme et animation/stylisation (choisir un seul registre)');
  if (/[éèàùêç]| les | des | du | est | pour /.test(' ' + String(plan.style_visuel || '').replace(/\b[A-ZÀ-Ý][\wÀ-ÿ'-]*/g, ' ').toLowerCase() + ' ')) v.push('style_visuel doit être écrit en anglais (il est collé tel quel dans les prompts Veo)');
  voix.forEach(x => { if (/[éèàùêç]| le | la | les | une? /.test(' ' + norm(x.description_exacte) + ' ')) v.push('voix « ' + x.personnage + ' » : description_exacte doit être écrite en anglais (collée telle quelle dans les prompts Veo)'); });
  // personnages visibles autres que le locuteur : doivent être décrits silencieux
  clips.forEach((c, i) => {
    const reps = VOIX_OFF_RUN ? [] : (c.repliques || []), speakers = new Set(reps.map(r => norm(repLoc(r))));
    const others = (c.personnages_visibles || []).filter(nm => !speakers.has(norm(nm)));
    if (!VOIX_OFF_RUN && reps.length && others.length && !/(mouth closed|lips closed|stays silent|remains silent|does not speak|never speaks|silent)/i.test(c.prompt_veo || '')) v.push('Clip ' + (i + 1) + ' : ' + others.join(', ') + ' visible(s) sans être décrit(s) silencieux/bouche fermée (Veo leur ferait dire la réplique)');
    others.forEach(nm => { const short = String(nm).split(/\s+/)[0]; if (short.length > 2 && new RegExp(short + '(?:\'s)? (?:is |also |then )?(?:speaking|speaks|talking|says|saying)\\b', 'i').test(c.prompt_veo || '')) v.push('Clip ' + (i + 1) + ' : « ' + nm + ' » est décrit comme parlant alors que ce n\'est pas le locuteur de ce clip'); });
  });
  // v6.53 — LA PARTITION EMOTIONNELLE (PV52). Mesure (run 94b5e103) : 15 plans sans intention, aucun plan ou le benefice promis
  // arrive (le produit aide a s'endormir, personne ne s'endort a l'image), aucun proche, aucune preuve montree. Le code compte.
  if (MINI_RUN && clips.length >= 6) {
    const R = c => norm(String(c.role || '')).replace(/[^a-z]/g, '');
    const nb = r => clips.filter(c => R(c) === r).length;
    const manque = [];
    const dispense = new Set((PP && Array.isArray(PP._rolesNonRequis)) ? PP._rolesNonRequis : []);   // v6.58 : roles que la structure de CE CT n'emploie pas (lus dans le CT) : jamais exiges
    { const sansR = [], sansRole = [], sansI = [];
      clips.forEach((c, i) => {
        if (!/^(veo|insert)$/i.test(String(c.rendu || ''))) sansR.push(i + 1);
        if (!R(c)) sansRole.push(i + 1);
        if (String(c.intention || '').trim().split(/\s+/).length < 4) sansI.push(i + 1);
      });
      if (sansRole.length) manque.push('clips sans `role` : ' + sansRole.join(', '));
      if (sansR.length) manque.push('clips sans `rendu` (veo ou insert) : ' + sansR.join(', '));
      if (sansI.length) manque.push('clips sans `intention` claire (la phrase que le spectateur se dit à cet instant) : ' + sansI.join(', ')); }
    { const nP = nb('signe') + nb('probleme'), minP = clips.some(c => /signe/i.test(String(c.role || ''))) || /[ée]num[ée]ration de signes/i.test(String(plan._ct_hook || '')) ? 3 : 2;   // v6.54 : generique a tout CT ; 3 quand le CT enumere des signes
      if (nP < minP && !(dispense.has('signe') && dispense.has('probleme'))) manque.push('seulement ' + nP + ' plan(s) `signe` ou `probleme` (' + minP + ' au moins : le problème VÉCU dans le corps, la nuit ou la journée, que le personnage touche, montre ou subit)'); }
    if (nb('resultat') < 1) manque.push('aucun plan `resultat` : le bénéfice promis n\'est jamais MONTRÉ en train d\'arriver (pour le sommeil : il s\'endort, les traits se détendent)');
    if (nb('social') < 1 && !dispense.has('social')) manque.push('aucun plan `social` : la vie reprise avec les proches n\'est jamais montrée');
    if (nb('social') + nb('consequence') < 2 && clips.length >= 10 && !dispense.has('social') && !dispense.has('consequence')) manque.push('un seul plan avec un proche : montre aussi la conséquence du problème sur un proche (elle dort, lui non) ou sous son regard');
    const ins = clips.filter(estInsert).length;
    if (ins > Math.ceil(clips.length * 0.4)) manque.push(ins + ' inserts sur ' + clips.length + ' plans (40 % au plus : au-delà c\'est un diaporama)');
    const txtTout = clips.map(c => (c.repliques || []).map(repTexte).join(' ')).join(' ');
    if (/\b(fabriqu|origine|produit en|made in|contr[oô]l|test[ée]|labo|certifi|bio\b|naturel|plantes?|ingr[ée]dient|composant|extrait)/i.test(norm(txtTout)) && !dispense.has('preuve') && !clips.some(c => estInsert(c) && /^(preuve|mecanisme)$/.test(R(c)))) manque.push('les paroles citent une preuve ou des composants, mais aucun plan `preuve` ou `mecanisme` en `rendu: "insert"` ne la MONTRE (carte stylisée du pays d\'origine, composants en nature morte, laboratoire)');
    if (clips.filter(c => c.produit_visible === true).length < 3) manque.push('le produit n\'est visible que dans ' + clips.filter(c => c.produit_visible === true).length + ' plan(s) (3 au moins, étiquette face caméra)');
    const cad = clips.map(c => norm(String(c.cadrage || '')).replace(/[^a-z_]/g, ''));
    const memes = []; cad.forEach((x, i) => { if (i && x && x === cad[i - 1]) memes.push(i + '-' + (i + 1)); });
    if (memes.length > 1) manque.push('plans voisins au même cadrage (' + memes.join(', ') + ') : alterne très gros plan, gros plan, plan moyen, insert');
    const serres = cad.filter(x => /tres_gros|gros_plan|insert/.test(x)).length;
    if (serres < Math.ceil(clips.length * 0.4)) manque.push('seulement ' + serres + ' plans serrés ou inserts sur ' + clips.length + ' (40 % au moins : la source montre l\'œil cerné, la main, le composant, de très près)');
    clips.forEach((c, i) => { if (!estInsert(c) && /\b(cup|mug|coffee|tea|sips?)\b/i.test(String(c._corps || c.prompt_veo || '')) && plan._fiche && !/(drink|powder|sachet|tea|coffee|beverage|liquid)/i.test(String(plan._fiche.description_en || '') + ' ' + String(plan._fiche.contenu || ''))) manque.push('clip ' + (i + 1) + ' : une tasse ou une boisson alors que le produit n\'est pas une boisson (le rituel de la source n\'est pas celui de ce produit)'); });
    { const dernier = clips.slice(-3).map(c => R(c));   // v6.55 : une pub qui vend finit par une offre ou un appel MONTRES
      if (!dernier.includes('appel')) manque.push('aucun plan `appel` parmi les 3 derniers : la pub doit finir par le produit et la personne qui AGIT (commande, tient, sourit)');
      let aOffre = false; try { aOffre = !!(PP && PP.bible && ((PP.bible.offre_decodee || []).length)); } catch (eO) {}
      if (aOffre && !clips.slice(-4).some(c => R(c) === 'offre')) manque.push('la synthèse contient une offre ou une garantie mais aucun plan `offre` ne la montre parmi les 4 derniers (insert ou produit héros)'); }
    if (manque.length) v.push('[PARTITION] la partition émotionnelle est incomplète (PV52) : ' + manque.slice(0, 14).join(' ; '));
  }
  return v;
}
const textOf = g => ((g.candidates?.[0]?.content?.parts || []).filter(x => x.text && !x.thought).map(x => x.text).join('')) || '';
const pipes = {};
const sizeKB = b64 => Math.round((b64 || '').length * 0.75 / 1024);
async function runPipeline(p) {
  const id = crypto.randomUUID().slice(0, 8);
  const dir = path.join(OUT, 'run_' + id); fs.mkdirSync(dir, { recursive: true });
  const P = pipes[id] = { id, stage: 'direction', log: [], steps: [], refs: [], t0: Date.now(), state: 'running', refMode: p.refMode || 'complet', dir: 'lab_out/run_' + id };
  // v6.39 — CHAQUE LIGNE DE LOG EST HORODATEE. Une production qui dure trente minutes sans qu'on sache ou passe le temps
  // ne s'optimise pas : chaque ligne porte le temps ecoule depuis le debut, et le temps pris depuis la ligne precedente
  // quand il depasse cinq secondes. L'etape lente se designe elle-meme au lieu d'etre devinee.
  let _tLog = Date.now();
  const log = m => {
    const now = Date.now(), tot = (now - (P.t0 || now)) / 1000, pas = (now - _tLog) / 1000; _tLog = now;
    const mm = String(Math.floor(tot / 60)).padStart(2, '0'), ss = String(Math.floor(tot % 60)).padStart(2, '0');
    const ligne = '[' + mm + ':' + ss + (pas >= 5 ? ' +' + pas.toFixed(0) + 's' : '') + '] ' + m;
    P.log.push(ligne); console.log('[' + id + '] ' + ligne);
  };
  const save = (name, content) => fs.writeFileSync(path.join(dir, name), typeof content === 'string' ? content : JSON.stringify(content, null, 2));
  // v6.55 — avant qu'une image soit refaite (retouche, nouvelle planche), l'ancienne est archivée dans versions/ : l'historique garde ce qui était faux ET ce qui l'a remplacé.
  const archiver = (fname, raison) => { try { const src = path.join(OUT, fname); if (!fs.existsSync(src)) return; fs.mkdirSync(path.join(dir, 'versions'), { recursive: true }); P._nVersions = (P._nVersions || 0) + 1; fs.copyFileSync(src, path.join(dir, 'versions', String(P._nVersions).padStart(2, '0') + '_' + raison + '_' + fname)); } catch (e) { } };
  try {
    save('00_entrees.json', { recu_le: new Date().toISOString(), modele_video: p.model, mode_references: p.refMode, lien_page_produit: p.lien_page_produit || null, ct_caracteres: String(p.ct || '').length, synthese_caracteres: String(p.synthese || '').length, aspects_fournis: Array.isArray(p.aspects) ? p.aspects.length : 0, ct: p.ct, synthese: p.synthese });
    if (p.produit && p.produit.data) fs.writeFileSync(path.join(dir, '00_photo_produit.' + (/png/.test(p.produit.mime || '') ? 'png' : 'jpg')), Buffer.from(p.produit.data, 'base64'));
    (Array.isArray(p.aspects) ? p.aspects : []).slice(0, 5).forEach((a, i) => { if (a && a.data) fs.writeFileSync(path.join(dir, '00_aspect_' + (i + 1) + '.' + (/png/.test(a.mime || '') ? 'png' : 'jpg')), Buffer.from(a.data, 'base64')); });
  } catch (e) { }
  const fin = g => ({ finishReason: g.candidates?.[0]?.finishReason || null, usage: g.usageMetadata || null });
  (async () => {
    // v6.71 — la page du client est lue AVANT tout : sa fiche de faits reels est ajoutee a la synthese.
    try {
      const uC = String(p.lien_page_produit || '').trim();
      if (/^https?:\/\//i.test(uC)) {
        const F = await ficheReellePage(uC);
        if (F) { P.fiche_page = F; p.synthese = String(p.synthese || '') + fiche2texte(F); save('fiche_page_client.json', F); log('Page du client lue : ' + [F.nom || F.titre, F.prix, F.couleurs && F.couleurs.length ? F.couleurs.length + ' couleur(s)' : '', Object.keys(F.rubriques || {}).join('/')].filter(Boolean).join(' · ') + '.'); }
        else log('Page du client illisible (anti-bot, accès refusé ou page vide) : la vidéo se fait sans elle, rien n\'est inventé à sa place.');
      }
    } catch (eF) { log('Page du client non lue (' + String(eF.message || eF).slice(0, 100) + ').'); }

    COUT_ALS.enterWith(P); P._couts = { lignes: [], total: 0 }; P._elAvant = await elSolde();
    // v6.54 — LA BOUSSOLE SENSORIELLE (PV53). Mesure (run 94b5e103, complement du sommeil) : chanson matinale et energique,
    // lumiere de cuisine du matin, coupes nerveuses, sous-titres jaunes a emojis — chaque variable allait dans une direction
    // differente, et la plupart a l'oppose de ce que le produit vend (s'endormir apaise). Une pub parle a UNE personne et
    // l'emmene a UN endroit. Avant d'ecrire quoi que ce soit, on fixe cette destination sensorielle une fois ; toutes les
    // etapes la recoivent (texte, chanson, voix, lit musical, jeu, camera, lumiere, montage, sous-titres) et elle prime sur
    // le registre de SURFACE du CT : le CT donne la mecanique (structure, dispositif, ordre des idees), jamais le registre.
    P.boussole = null;
    try {
      const tB0 = Date.now();
      const askB = 'Tu es le directeur de la SYMBIOSE d\'une publicité vidéo. Tu ne produis aucun texte de pub : tu fixes la DESTINATION SENSORIELLE vers laquelle chaque variable de la vidéo doit aller, à chaque seconde — musique, chanson, voix, rythme du montage, jeu des personnages, caméra, lumière, sous-titres — pour que la personne visée sente qu\'on lui parle À ELLE et qu\'on la connaît par cœur.\n'
        + 'RAISONNEMENT (dans cet ordre, en silence) :\n'
        + '1. LA DESTINATION = la transformation principale que CE produit vend à CETTE cible sous CET angle (S0, S2, S4) : ce qu\'elle ressent quand c\'est atteint. Tout le registre en découle. Un produit pour s\'endormir mène à l\'apaisement : chanson douce comme une berceuse, tempo lent, voix chaude et posée, gestes lents et amples, lumière tamisée chaude du soir, coupes plus longues, sous-titres doux. Un produit d\'énergie mène à l\'élan : tempo vif, attaques franches, lumière vive du matin, coupes nerveuses. Un produit de luxe mène au raffinement : lenteur, précision, silence, matières, lumière sculptée. Un produit de désir mène à l\'intimité : chaleur, proximité, rythme lent et appuyé. Ce sont des principes, pas des modèles : tu raisonnes sur CE produit.\n'
        + '2. L\'ARC : le registre du PROBLÈME au départ (ex. l\'insomnie agitée, la tension), puis le glissement vers la destination à partir de la bascule. Jamais un registre qui contredit la destination dans la seconde moitié.\n'
        + '3. LE MIROIR DU PERSONA (S1, S5, S6, S7) : les détails concrets qui prouvent qu\'on le connaît par cœur — son heure, ses lieux, ses objets, ses gestes, ses mots, la musique qu\'il écoute dans son pays, son environnement sonore. Ils colorent la musique, les décors, les objets et le texte.\n'
        + '4. LES CONFLITS AVEC LE CT : le CT vient d\'une pub source qui vendait autre chose (son énergie, son style musical, son moment de la journée, son rituel). Tu listes ce qui, dans la SURFACE du CT, contredit la destination de CE produit, et tu le transposes : on garde la mécanique du CT (sa structure, son dispositif, l\'ordre de ses idées, son rythme relatif), on change le registre.\n'
        + 'Réponds UNIQUEMENT en JSON.\n\n=== ANGLE === ' + (p.angle || '(angle 1 de la synthèse S2)') + '\n\n=== CT_VIDEO ===\n' + String(p.ct || '').slice(0, 40000) + '\n\n=== SYNTHESE ===\n' + String(p.synthese || '').slice(0, 60000);
      const SB = { type: 'OBJECT', properties: {
        destination: { type: 'STRING' }, sensation_destination: { type: 'STRING' },
        registre: { type: 'STRING' }, energie: { type: 'INTEGER' },
        tempo_bpm_min: { type: 'INTEGER' }, tempo_bpm_max: { type: 'INTEGER' },
        arc: { type: 'STRING' },
        musique_en: { type: 'STRING' }, musique_a_eviter_en: { type: 'ARRAY', items: { type: 'STRING' } },
        voix_en: { type: 'STRING' }, debit: { type: 'STRING', enum: ['lent', 'pose', 'vif'] },
        jeu_en: { type: 'STRING' }, camera_en: { type: 'STRING' }, lumiere_en: { type: 'STRING' },
        montage: { type: 'STRING' }, transitions: { type: 'STRING', enum: ['coupe_seche', 'coupe_douce'] },
        sous_titres_registre: { type: 'STRING', enum: ['doux', 'percutant', 'elegant'] },
        miroir_persona: { type: 'ARRAY', items: { type: 'STRING' } },
        conflits_ct: { type: 'ARRAY', items: { type: 'OBJECT', properties: { surface_du_ct: { type: 'STRING' }, transposition: { type: 'STRING' } }, required: ['surface_du_ct', 'transposition'] } }
      }, required: ['destination', 'sensation_destination', 'registre', 'energie', 'tempo_bpm_min', 'tempo_bpm_max', 'arc', 'musique_en', 'musique_a_eviter_en', 'voix_en', 'debit', 'jeu_en', 'camera_en', 'lumiere_en', 'montage', 'transitions', 'sous_titres_registre', 'miroir_persona', 'conflits_ct'] };
      const gB = await vjson(`${LOCATION}-aiplatform.googleapis.com`, `/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-2.5-pro:generateContent`, { contents: [{ role: 'user', parts: [{ text: askB }] }], generationConfig: { temperature: 0.3, maxOutputTokens: 12000, thinkingConfig: { thinkingBudget: 2048 }, responseMimeType: 'application/json', responseSchema: SB } });
      P.boussole = JSON.parse(textOf(gB));
      P.boussole.energie = Math.max(1, Math.min(10, parseInt(P.boussole.energie, 10) || 5));
      save('00b_boussole_sensorielle.json', P.boussole);
      log('Boussole sensorielle (' + Math.round((Date.now() - tB0) / 1000) + ' s) : destination « ' + String(P.boussole.destination).slice(0, 110) + ' » — registre ' + P.boussole.registre + ', énergie ' + P.boussole.energie + '/10, ' + P.boussole.tempo_bpm_min + '-' + P.boussole.tempo_bpm_max + ' BPM, voix ' + P.boussole.debit + ', ' + (P.boussole.conflits_ct || []).length + ' conflit(s) avec la surface du CT transposé(s). Toutes les étapes la reçoivent.');
    } catch (eB) { P.boussole = null; log('Boussole sensorielle indisponible (' + String(eB.message || eB).slice(0, 90) + ') : chaque étape suit le CT seul.'); }
    BOUSSOLE_VEO = P.boussole ? String(P.boussole.jeu_en || '').trim() + (P.boussole.lumiere_en ? ' Light: ' + String(P.boussole.lumiere_en).trim() : '') : '';
    // v6.55 — la boussole decrit une DESTINATION emotionnelle ; elle ne doit jamais ralentir le jeu. Les phrases timides
    // (contained, internal, micro-expressions, barely, subtle, slow, still) sont retirees du texte envoye a Veo (mesure run 88002b0d : 13 plans sur 18 quasi figes).
    if (BOUSSOLE_VEO) { const tim = /\b(contained|internal|inward|micro-?expressions?|barely|subtle|slowly|slow|still|restrained|minimal|quiet|stillness)\b/i;
      const gardees = BOUSSOLE_VEO.split(/(?<=[.;])\s+/).filter(ph => !tim.test(ph)).join(' ').trim();
      BOUSSOLE_VEO = (gardees ? gardees + ' ' : '') + (MINI_RUN ? 'Movement is bold, readable and continuous.' : ''); }   // les CT parles gardent leur jeu : la phrase d'energie ne vaut que pour les plans muets
    const BOUSSOLE_TXT = !P.boussole ? '' : '\n=== BOUSSOLE SENSORIELLE (PV53) — TOUT VA VERS ICI, À CHAQUE SECONDE ; ELLE PRIME SUR LE REGISTRE DE SURFACE DU CT ===\n'
      + 'DESTINATION : ' + P.boussole.destination + ' — ce que la personne ressent : ' + P.boussole.sensation_destination + '\n'
      + 'REGISTRE : ' + P.boussole.registre + ' (énergie ' + P.boussole.energie + '/10, ' + P.boussole.tempo_bpm_min + '-' + P.boussole.tempo_bpm_max + ' BPM). ARC : ' + P.boussole.arc + '\n'
      + 'JEU DES PERSONNAGES : ' + P.boussole.jeu_en + ' | CAMÉRA : ' + P.boussole.camera_en + ' | LUMIÈRE : ' + P.boussole.lumiere_en + ' | MONTAGE : ' + P.boussole.montage + '\n'
      + 'VOIX : ' + P.boussole.voix_en + ' (débit ' + P.boussole.debit + ') | MUSIQUE : ' + P.boussole.musique_en + '\n'
      + 'LE MIROIR DU PERSONA (montre qu\'on le connaît par cœur, dans les mots, les objets, les lieux, les heures) : ' + (P.boussole.miroir_persona || []).join(' ; ') + '\n'
      + ((P.boussole.conflits_ct || []).length ? 'CE QUE TU NE RECOPIES PAS DU CT (sa surface contredit la destination) : ' + P.boussole.conflits_ct.map(x => '« ' + x.surface_du_ct + ' » → ' + x.transposition).join(' ; ') + '\n' : '')
      + 'Règle : le texte, le ton des répliques, l\'émotion de chaque plan, le geste, sa vitesse, la lumière et le cadrage vont tous vers cette destination. Une variable qui part ailleurs casse la pub, même si elle est belle.\n';
    // v6.54 — filet de securite sur la musique : un mot de style qui contredit l'energie de la destination est retire,
    // et le registre de la boussole est pose en tete. Le modele de style lisait le CT (une pub de cafe du matin) avant le produit.
    const accorderStyles = st => {
      if (!P.boussole || !st) return st;
      const e = P.boussole.energie, out = Object.assign({}, st);
      const CALME_KO = /\b(upbeat|energetic|high[- ]energy|driving|punchy|fast|uptempo|up-tempo|dance|party|anthem|hype|bouncy|peppy|aggressive|powerful drums|edm|banger|morning)\b/i;
      const VIF_KO = /\b(lullaby|sleepy|slow|calm|soothing|ambient|drowsy|soft whisper|downtempo)\b/i;
      const ko = e <= 4 ? CALME_KO : e >= 7 ? VIF_KO : null;
      const tri = arr => (arr || []).filter(x => !(ko && ko.test(String(x))));
      const tete = String(P.boussole.musique_en || '').split(/[,;]/).map(x => x.trim()).filter(x => x && x.split(/\s+/).length <= 6).slice(0, 4);
      out.global = [...new Set(tete.concat(tri(st.global)))].slice(0, 8);
      out.sections = (st.sections || []).map(x => ko && ko.test(String(x)) ? (e <= 4 ? 'gentle, warm, soothing' : 'bright, lively') : x);
      out.negatif = [...new Set((st.negatif || []).concat((P.boussole.musique_a_eviter_en || []).slice(0, 4)).concat(e <= 4 ? ['upbeat', 'energetic drums'] : []))].slice(0, 8);
      return out;
    };
    // v6.47 — nombre de clips lu dans le CT, borne par MAX_CLIPS puis par le budget (clips Lite ou autre modele).
    let NC = p.nb_clips ? Math.max(4, Math.min(MAX_CLIPS, parseInt(p.nb_clips, 10) || 4)) : ncDuCT(p.ct);
    {
      const BUDn = parseFloat(process.env.BUDGET_USD || p.budget_usd || '10'), RESn = parseFloat(process.env.BUDGET_RESERVE || '0.15');
      if (BUDn > 0) {
        const modeleCap = (!p.model_force && process.env.REPARTITEUR !== '0' && /veo-3\.1-(fast-)?generate/.test(String(p.model))) ? 'veo-3.1-lite-generate-001' : p.model;   // v6.76 : on dimensionne la duree sur le modele le moins cher ; le repartiteur monte ensuite les plans en gamme
        const tvn = TARIFS.veo[modeleCap], muetn = modeVoixCT(p.ct) !== 'parle';   // v6.48 : voix off ou chanson = Veo muet, moins cher
        const tpsn = tvn ? (muetn && tvn.muet != null ? tvn.muet : tvn.audio) : ((MODELS[modeleCap] || {}).usdPerSec || 0);
        const nCoupesN = process.env.COUPES_ANIMEES === '0' ? 0 : Math.min(8, (String(p.ct || '').match(/"type"\s*:\s*"plan_coupe[a-z_]*"/g) || []).length), tCoupeN = (TARIFS.veo[process.env.COUPES_MODEL || 'veo-3.1-lite-generate-001'] || {}).muet || 0.05;   // v6.69 : les plans de coupe animes sont reserves AVANT de decider du nombre de clips parlants
        const parClip = 8 * tpsn + 0.15, fixe = 1.1 + 0.2 * (Math.ceil(Math.min(NC, 8) / 4) - 1) + nCoupesN * 4 * tCoupeN, ncMax = Math.floor((BUDn * (1 - RESn) - fixe) / parClip);
        if (NC > ncMax) { P._log_nc = 'Le CT demande ' + NC + ' clips mais le budget de ' + BUDn.toFixed(2) + ' $ (réserve ' + Math.round(RESn * 100) + ' %) n\'en permet que ' + Math.max(4, ncMax) + ' avec ce modèle : durée ramenée à ' + Math.max(4, ncMax) * 8 + ' s.'; NC = Math.max(4, ncMax); }
      }
    }
    // v6.52 — MINI-PLANS. Mesure (acda0d31) : 9 clips de 8 s tenus ~7 s chacun a l'ecran donnaient une video lente et figee,
    // alors que la source change d'image toutes les 2 s. En voix off ou en chanson, personne ne parle a l'image : rien n'oblige
    // a garder 8 s de Veo. On genere des clips de 4 s (moitie prix), le montage garde les 2 a 3 s les plus vivantes de chacun,
    // et l'argent economise paie PLUS de plans. Duree = min(duree du CT, 40 s) ; un plan = le rythme de la source (2 a 3 s).
    {
      const muetM = modeVoixCT(p.ct) !== 'parle';
      MINI_RUN = muetM && process.env.MINI_PLANS !== '0' && !p.nb_clips; MINI_INFO = null;
      if (MINI_RUN) {
        const mD = /Durée cible[^\n]*?(\d{2,3})\s*(?:s\b|sec)/i.exec(String(p.ct || '')); const dCT = mD ? parseInt(mD[1], 10) : 40;
        let D = Math.min(dCT, parseFloat(process.env.MINI_DUREE_MAX || '38'));   // v6.53 : 38 s vises, jamais au-dela de 40 s une fois la fin posee
        const mR = /Rythme source[^\n]*?toutes les\s*(\d+(?:[.,]\d+)?)(?:\s*(?:à|a|-)\s*(\d+(?:[.,]\d+)?))?\s*s/i.exec(String(p.ct || ''));
        let rythme = Math.max(1.8, Math.min(3.2, mR ? (parseFloat(mR[1].replace(',', '.')) + parseFloat((mR[2] || mR[1]).replace(',', '.'))) / 2 : 2.5));
        if (P.boussole) {   // v6.54 : le rythme de coupe suit la destination (une berceuse ne se coupe pas toutes les 2 s, un produit d'energie si)
          const r0 = rythme, e0 = P.boussole.energie;
          if (e0 <= 3) rythme = Math.max(rythme, 2.9); else if (e0 <= 5) rythme = Math.max(rythme, 2.5); else if (e0 >= 8) rythme = Math.min(rythme, 2.2);
          if (Math.abs(rythme - r0) > 0.05) log('Rythme de coupe ajusté à la destination (' + P.boussole.registre + ', énergie ' + e0 + '/10) : un plan toutes les ' + rythme.toFixed(1) + ' s au lieu de ' + r0.toFixed(1) + ' s.');
        }
        let nM = Math.round(D / rythme), raisonM = '';
        const BUDm = parseFloat(process.env.BUDGET_USD || p.budget_usd || '10'), RESm = parseFloat(process.env.BUDGET_RESERVE || '0.15');
        if (BUDm > 0) {
          const modeleCapM = (!p.model_force && process.env.REPARTITEUR !== '0' && /veo-3\.1-(fast-)?generate/.test(String(p.model))) ? 'veo-3.1-lite-generate-001' : p.model;
          const tvm = TARIFS.veo[modeleCapM], tpm = tvm ? (tvm.muet != null ? tvm.muet : tvm.audio) : ((MODELS[modeleCapM] || {}).usdPerSec || 0);
          const parPlan = 0.7 * 4 * tpm + 0.11, fixeM = 1.6,   /* v6.53 : ~30 % des plans sont des inserts graphiques (aucun Veo) */ maxM = Math.floor((BUDm * (1 - RESm) - fixeM) / parPlan);
          if (nM > maxM) { nM = maxM; raisonM = 'budget de ' + BUDm.toFixed(2) + ' $'; }
        }
        const MAXM = parseInt(process.env.MINI_MAX_PLANS || '18', 10);
        if (nM > MAXM) { nM = MAXM; raisonM = raisonM || 'plafond de ' + MAXM + ' plans'; }
        nM = Math.max(8, nM);
        if (D / nM > 3.2) D = Math.round(nM * 3.0);
        NC = nM; MINI_INFO = { D, plan: +(D / nM).toFixed(2), rythme, dCT, raison: raisonM, nCT: (String(p.ct || '').match(/^#{2,4}\s*ID[ÉE]E\s+\d+/gim) || []).length || ncDuCT(p.ct) };   // v6.53 : un squelette ecrit en IDÉES compte ses idees, pas des blocs de 8 s
      }
    }
    P.nbClips = NC;
    try {
      const sys = fs.readFileSync(path.join(__dirname, 'COMPETENCE_CREATIVE_VIDEO.md'), 'utf8');
      const ctxt = '=== CT_VIDEO ===\n' + p.ct, syn = '=== SYNTHESE ===\n' + p.synthese;
      // v6.2 — le niveau de conscience est une propriété du CT, pas un réglage d'écran : un CT dont le corps est l'offre
      // ne peut pas tourner en Solution Aware. Quand le CT n'en déclare qu'un (bloc JSON de ses métadonnées), il gagne.
      let niveauCT = null;
      try {
        const mj = String(p.ct || '').match(/"awareness"\s*:\s*\[([^\]]*)\]/);
        if (mj) { const lst = mj[1].split(',').map(x => x.replace(/["'\s]/g, '')).filter(Boolean); if (lst.length === 1) niveauCT = lst[0].replace(/([a-z])([A-Z])/g, '$1 $2'); }
      } catch (e) { niveauCT = null; }
      // v6.10 — la singularité visuelle est une propriété du CT, pas une invention du directeur : deux CT différents
      // tournés sur la même synthèse rendaient la même image. Quand le CT déclare sa signature, elle est imposée.
      const sigCT = { style: null, cadrage: null };
      try {
        const g = (k) => { const m = String(p.ct || '').match(new RegExp('"' + k + '"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"')); return m ? JSON.parse('"' + m[1] + '"').trim() : null; };
        sigCT.style = g('signature_visuelle'); sigCT.cadrage = g('signature_cadrage'); sigCT.lieu = g('signature_lieu');
        sigCT.hook = g('hook_framework_impose'); sigCT.chute = g('point_de_chute_prefere'); sigCT.gestes = g('gestes_signature');
        sigCT.voix = g('voix');
        sigCT.epic = g('epic_quadrant');   // v6.34 : le registre emotionnel declare par le CT sert aussi a ecrire la musique
        const ml = String(p.ct || '').match(/"lieux_interdits"\s*:\s*\[([^\]]*)\]/);
        sigCT.interdits = ml ? ml[1].split(',').map(x => x.replace(/["'\s]+/g, ' ').trim()).filter(Boolean) : [];
      } catch (e) { sigCT.style = sigCT.cadrage = sigCT.lieu = sigCT.hook = sigCT.chute = sigCT.gestes = null; sigCT.interdits = []; }
      P._sigCT = sigCT;
      // v6.58 — ROLES NON REQUIS : le controle de partition exigeait le meme squelette de roles de tous les CT (signes, consequence, proche, preuve).
      // Un recit epique ou une fable n'a pas de « proche qui remarque » : l'exiger declenchait des retries payants et deformait le CT. On lit dans le CT
      // les roles que sa structure EXCLUT ; en cas de doute on n'en dispense aucun. Offre, appel, bascule, mecanisme, resultat ne sont jamais dispenses.
      // v6.59 — POST-PRODUCTION LUE DANS LE CT, UNE FOIS, AVANT TOUT (etalonnage, camera, mouvement rapide, MUSIQUE). Le monteur et l'habillage sonore la lisent.
      // Mesure sur la source RYZE : aucune musique sous la voix (silences vrais a -38 dB) ; ajouter un lit musical a un UGC parle change le format.
      P._postCT = null;
      try {
        const gPc = await vjson(`${LOCATION}-aiplatform.googleapis.com`, `/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-2.5-flash:generateContent`, {
          contents: [{ role: 'user', parts: [{ text: 'Tu lis un CT vidéo (cahier technique d\'une publicité) et tu relèves UNIQUEMENT ce qu\'il dit de la POST-PRODUCTION, pour régler un monteur automatique. Tu ne devines pas : ce que le CT ne dit pas vaut null. '
            + 'etalonnage : "aucun" si le CT interdit tout étalonnage, filtre ou bascule de couleur (lumière plate, rendu brut de téléphone) ; "arc" s\'il demande une évolution de couleur au fil de la vidéo ; null sinon. '
            + 'camera : "immobile" si le CT veut le rendu le plus posé et neutre (téléphone sur support, aucun effet) ; "lent" s\'il impose seulement des mouvements lents et continus ; "dynamique" s\'il veut des coupes et mouvements marqués ; null sinon. '
            + 'mouvement_rapide : true si le CT autorise des effets rapides (flou de mouvement, secousse, flash) ; false s\'il les limite ou les interdit (« un seul mouvement rapide », « aucun effet ») ; null sinon. '
            + 'musique : "aucune" si le CT dit que la vidéo n\'a pas de musique (voix seule, ambiances diégétiques seulement) ; "discrete" si une musique très basse est admise sous la voix ; "libre" si le CT demande ou admet une musique de premier plan ; null s\'il n\'en parle pas (« musique éventuellement ajoutée au montage » = null). '
            + 'intention : une phrase.\n\nCT :\n' + String(p.ct || '').slice(0, 60000) }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 1500, responseMimeType: 'application/json', responseSchema: { type: 'OBJECT', properties: {
            etalonnage: { type: 'STRING', enum: ['aucun', 'arc'], nullable: true }, camera: { type: 'STRING', enum: ['immobile', 'lent', 'dynamique'], nullable: true },
            mouvement_rapide: { type: 'BOOLEAN', nullable: true }, musique: { type: 'STRING', enum: ['aucune', 'discrete', 'libre'], nullable: true }, intention: { type: 'STRING' } }, required: ['intention'] } } });
        P._postCT = JSON.parse(textOf(gPc)); save('00d_postprod_du_ct.json', P._postCT);
        log('Post-production lue dans le CT : étalonnage ' + (P._postCT.etalonnage || 'libre') + ', caméra ' + (P._postCT.camera || 'libre') + ', effets rapides ' + (P._postCT.mouvement_rapide === false ? 'limités' : P._postCT.mouvement_rapide === true ? 'permis' : 'libres') + ', musique ' + (P._postCT.musique || 'libre') + '.');
      } catch (ePc) { P._postCT = null; log('Post-production du CT illisible (' + String(ePc.message || ePc).slice(0, 80) + ') : la boussole décide.'); }
      P._rolesNonRequis = [];
      if (MINI_RUN) try {
        const gRo = await vjson(`${LOCATION}-aiplatform.googleapis.com`, `/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-2.5-flash:generateContent`, {
          contents: [{ role: 'user', parts: [{ text: 'Tu lis un CT vidéo (cahier technique). Une publicité en plans courts est écrite avec ces rôles émotionnels : signe, probleme, consequence (effet du problème sur un proche ou sur la vie), social (la vie reprise avec les proches), preuve (preuve montrée : composant, labo, origine, chiffre). '
            + 'Liste UNIQUEMENT les rôles que la structure de CE CT exclut ou ne contient jamais (exemples : un récit épique ou une fable sans proches n\'a ni consequence ni social ; un CT qui interdit toute preuve n\'a pas de preuve). En cas de doute, ne liste rien.\n\nCT :\n' + String(p.ct || '').slice(0, 60000) }] }],
          generationConfig: { temperature: 0, maxOutputTokens: 800, responseMimeType: 'application/json', responseSchema: { type: 'OBJECT', properties: {
            roles_absents: { type: 'ARRAY', items: { type: 'STRING', enum: ['signe', 'probleme', 'consequence', 'social', 'preuve'] } }, raison: { type: 'STRING' } }, required: ['roles_absents'] } } });
        const ro = JSON.parse(textOf(gRo)); P._rolesNonRequis = [...new Set((ro.roles_absents || []).filter(x => ['signe', 'probleme', 'consequence', 'social', 'preuve'].includes(x)))];
        save('00c_roles_non_requis.json', ro);
        if (P._rolesNonRequis.length) log('Rôles que la structure du CT n\'emploie pas (jamais exigés) : ' + P._rolesNonRequis.join(', ') + ' — ' + String(ro.raison || '').slice(0, 120));
      } catch (eRo) { P._rolesNonRequis = []; log('Rôles non requis illisibles (' + String(eRo.message || eRo).slice(0, 80) + ') : tous les rôles restent exigés.'); }
      if (sigCT.hook || sigCT.gestes) log('Signature d\'écriture du CT — hook : ' + (sigCT.hook || 'libre') + ' | point de chute : ' + (sigCT.chute || 'libre') + (sigCT.gestes ? ' | gestes imposés.' : '.'));
      if (sigCT.lieu) log('Lieu imposé par le CT : ' + sigCT.lieu.slice(0, 160) + (sigCT.interdits.length ? ' — lieux refusés : ' + sigCT.interdits.join(', ') + '.' : ''));
      // v6.31 — un CT peut declarer qu'il se joue EN VOIX OFF : aucun personnage ne parle, la voix vient
      // d'ElevenLabs et c'est elle qui commande le minutage. Tout le reste du pipeline s'y adapte.
      { const mv = modeVoixCT(p.ct); CHANSON_RUN = mv === 'chanson'; VOIX_OFF_RUN = mv !== 'parle'; if (mv !== 'parle' && !sigCT.voix) log('Mode de voix lu dans la fiche du CT (' + mv + ') : le marqueur machine « voix » est absent.'); }
      if (CHANSON_RUN) log('CT CHANSON : aucun personnage ne parle ni ne chante à l\'image. ElevenLabs Music chante les paroles du copywriter, Scribe/alignement les minute, Veo reste muet et le montage se cale sur la chanson (pas de lit musical par-dessus).');
      else if (VOIX_OFF_RUN) log('CT a VOIX OFF : aucun personnage ne parle. Les prompts Veo sont ecrits sans dialogue, sa piste audio sera jetee, et la voix sera dite par ElevenLabs puis imposee comme minutage au montage.');
      // v6.32 — la v6.31 decouvrait l'absence de voix APRES avoir paye les quatre clips (video muette, 1,60 $ perdus).
      // Tout ce dont la voix off a besoin est verifie ici, avant la premiere depense.
      if (VOIX_OFF_RUN && !process.env.ELEVENLABS_API_KEY) throw new Error('Ce CT se joue en voix off et ELEVENLABS_API_KEY est absente : rien n\'a ete depense, ajoute la cle puis relance.');
      const niveauDemande = p.niveau || 'Solution Aware';
      const niveau = niveauCT || niveauDemande;
      if (MINI_RUN && MINI_INFO) log('MINI-PLANS : ' + NC + ' plans d\'environ ' + MINI_INFO.plan.toFixed(1) + ' s = ' + MINI_INFO.D + ' s (CT : ' + MINI_INFO.dCT + ' s, un plan toutes les ' + MINI_INFO.rythme + ' s dans la source' + (MINI_INFO.raison ? ' ; nombre de plans borné par le ' + MINI_INFO.raison : '') + '). Chaque plan est un clip Veo de 4 s dont le montage garde le moment le plus vivant.');
      else log('Durée de la vidéo : ' + NC + ' clips de 8 s = ' + NC * 8 + ' s (lue dans « Durée cible » du CT, bornée par ' + MAX_CLIPS + ' clips et par le budget).'); if (P._log_nc && !MINI_RUN) log(P._log_nc);
      if (niveauCT && norm(niveauCT) !== norm(niveauDemande)) log('Niveau de conscience : le CT n\'en accepte qu\'un, « ' + niveauCT + ' » ; il remplace « ' + niveauDemande + ' » choisi à l\'écran.');
      let brief = '=== BRIEF ===\n' + JSON.stringify(p.brief || {}) + '\nANGLE: ' + (p.angle || 'NON IMPOSÉ : choisis toi-même dans la synthèse l\'angle le plus fort pour ce CT et indique-le dans META') + '\nNIVEAU_CONSCIENCE: ' + niveau + '\nLANGUE_VOIX: ' + (p.langue || 'langue du marché définie en S1 de la synthèse') + '\nMARQUE: ' + (p.marque || 'à extraire de la synthèse S0 si elle y figure, sinon vide');
      // v6.59 — DEBIT DE LA SOURCE. Si le CT declare `"mots_par_seconde"` (mesure sur sa video d'origine, pauses comprises), le budget de parole en
      // suit : 0,9 a 1,15 x debit x duree. Sinon : les anciennes bornes (24 a 28 mots par clip). Mesure RYZE : 197 mots en 81 s = 2,4 mots/s soit ~19 par clip.
      const RATE_CT = (() => { const m = String(p.ct || '').match(/"mots_par_seconde"\s*:\s*"?([0-9]+(?:[.,][0-9]+)?)/); const v = m ? parseFloat(m[1].replace(',', '.')) : NaN; return v >= 1.2 && v <= 4.5 ? v : null; })();
      let LIMITES_PAROLE = '\n=== LIMITES CHIFFRÉES APPLIQUÉES PAR LE CONTRÔLE (elles priment sur tout autre chiffre lu ailleurs) ===\n- 4 clips de 8 s ; 24 à 28 mots de voix par clip (la parole COMMENCE avant 0,4 s et COURT jusque vers 7,4 s : un clip de 8 s qui finit de parler à 6 s laisse une seconde de vide que le spectateur entend) ; UNE réplique par clip quand le clip porte une seule idée, DEUX seulement si le sens l\'exige, JAMAIS TROIS : Veo marque un SILENCE à chaque point, donc chaque réplique de plus est un trou. Un seul point par réplique, celui de la fin — à l\'intérieur on enchaîne à la virgule ou par un mot de liaison. Quand il y a deux répliques, la seconde COMMENCE par un mot de liaison (et, mais, parce que, alors, donc, pourtant) pour que la voix ne retombe pas. Le dernier clip en a deux : la raison d\'agir, puis l\'appel à l\'action.\n- 1 ou 2 plans par clip (jamais 3), chacun ≥ 3 s ; 1 seul lieu par clip ; 2 locuteurs maximum.\n- densité de parole par plan : 1,8 à 3,6 mots par seconde.\n- corps de prompt_veo : 200 mots maximum ; aucune phrase « reference image / as in the image » ; aucune ligne sonore.\n- Veo reçoit UN SEUL média par clip : l\'image de référence du clip (jamais la photo produit, jamais deux images) ; un clip qui montre le produit a donc son produit DANS son image (le produit est alors ajouté à l\'image à partir de la photo produit) ; un même décor servant à un clip avec produit et à un clip sans produit exige deux images (variante chaînée par suite_de).\n- une image de référence PAR CLIP (4 maximum) : un décor est l\'état de départ d\'un clip, pas une pièce — même lieu, objets ou poses différents = deux décors et deux images ; deux clips ne partagent une image que si leur toute première seconde est identique ; chaque image contient TOUS les personnages visibles dans les clips qui l\'utilisent ; aucune image sans clip.\n- chaque réplique a un champ ton (anglais) : l\'émotion de diction suit le sens de la phrase ; la description de voix ne décrit que l\'identité (âge, hauteur, timbre, grain, accent, débit), jamais une émotion ; le ton change, la voix jamais.\n- chaque réplique se comprend seule : aucun « cette / ça / leurs » dont le référent n\'a pas été dit avant ; toute peur, douleur ou bénéfice est énoncé en toutes lettres avant d\'être repris ; une cause affirmée explique réellement la conséquence.\n- chaque lieu distinct du CT est représenté par au moins un clip ; ne fusionne pas deux lieux du CT. Quand le CT a moins de lieux que de clips, les clips restants reçoivent chacun l\'image de LEUR état du même lieu, jamais la même image.\n- la bible de traduction est contrôlée sur les prompts envoyés : détails concrets de la synthèse dans les images et les clips, mots de la cible dans les répliques, règle du niveau à la lettre.\n- locuteur visible qui parle à l\'écran = « X says: » (pas de voice-over) ; autres visages : bouche fermée. Un locuteur qui parle dans un clip est TOUJOURS cadré DE FACE ou de trois quarts face, visage et bouche dans le cadre dès la première image, y compris quand sa voix court sur une scène qu\'il est en train de vivre : son regard peut suivre son geste, jamais son dos ni son profil franc. L\'option « sans_bouche » est abandonnée et REFUSÉE par le contrôle — Veo, entendant une voix sans voir de bouche, fait pivoter le personnage en pleine phrase et lui déforme le visage.\n- RYTHME : la parole est posée RÉGULIÈREMENT sur toute la durée du clip, jamais débitée vite puis suivie d\'un trou ; la dernière réplique se termine vers 7,4 s, et la PREMIÈRE commence avant 0,4 s : seules les deux ou trois dernières dixièmes de seconde sont muettes, jamais une seconde entière ; aucun mouvement de caméra rapide (whip-pan, balayage) ni effet de transition à l\'intérieur d\'un clip : la voix dérive quand le plan bouge vite ; chiffres et heures écrits en chiffres dans `texte` (le code les épelle pour Veo).\n- chaque clip se suffit à lui-même : jamais « comme dans le clip précédent », jamais un geste commencé ou terminé dans un autre clip, jamais une coupe en plein geste ; la jonction se fait par la voix et le contenu, pas par le geste.\n- aucune réplique ne promet un effet interdit par la synthèse (allégations non autorisées) : le vécu et l\'apport nutritif factuel seulement.\n- la fiche personnage ne contient ni taille absolue ni état avant/après (la taille relative se lit sur l\'image).\n';
      if (RATE_CT) LIMITES_PAROLE = LIMITES_PAROLE.replace('24 à 28 mots', Math.round(8 * RATE_CT * 0.9) + ' à ' + Math.round(8 * RATE_CT * 1.15) + ' mots');
      const LIMITES_PAROLE_FILTRE = LIMITES_PAROLE.split('\n').filter(l => /corps de prompt_veo|Veo reçoit UN SEUL|une image de référence PAR CLIP|chaque lieu distinct|la bible de traduction|chaque clip se suffit|aucune réplique ne promet|la fiche personnage|chaque réplique se comprend seule/.test(l)).join('\n') + '\n';
      // v6.32 — en voix off, presque toutes les LIMITES ci-dessus decrivent la mecanique d'un personnage qui PARLE a l'image
      // (14 a 26 mots sous 8 s de Veo, une replique = un silence, locuteur de face, 12 mots par replique) et ne s'appliquent
      // pas : elles ont genere 54 faux ecarts et fait demander une correction inutile. La voix off a ses propres limites,
      // dont la principale n'est pas un nombre de mots mais une DUREE MESUREE (ElevenLabs, avant Veo).
      const LIMITES_VO = '\n=== LIMITES APPLIQUÉES PAR LE CONTRÔLE — CT À VOIX OFF (elles priment sur tout autre chiffre lu ailleurs) ===\n'
        + '- 4 clips de 8 s. Veo ne fournit QUE l\'image : personne ne parle à l\'écran, aucune bouche ne s\'ouvre. Le texte est dit d\'un trait par une voix off (ElevenLabs) dont le code MESURE la durée de chaque bloc avant de payer Veo : un bloc doit tenir en moins de 8 s de voix, soit environ 20 à 26 mots en français ; le code compresse lui-même un bloc trop long.\n'
        + '- le narrateur n\'est PAS un personnage de l\'image : jamais dans personnages_visibles, jamais de fiche_personnage pour lui, voix déclarée hors_champ ; sa description_exacte ne décrit que l\'identité de la voix (genre, âge, hauteur, timbre, débit).\n'
        + '- UNE prise continue par clip, sans coupe. L\'idée change AU PIVOT de la voix (fin de la première réplique) par un changement visible dans la même prise : une autre action, un autre cadrage, un autre état du sujet.\n'
        + '- COMPRÉHENSION : à chaque instant, ce qu\'on voit illustre ce qu\'on entend à cet instant ; une image qui illustre l\'idée suivante ou précédente est un contresens. Chaque clip a une intention et une émotion lisibles dans le corps ou dans la lumière, voix coupée.\n'
        + '- ÉMOTION ET DÉTAIL : une voix neutre ne rend pas l\'image neutre. Le corps joue (posture, souffle, regard, mains), la matière se voit, de petits mouvements secondaires gardent le cadre vivant. Un sujet immobile sous une caméra qui avance est une faute.\n'
        + LIMITES_PAROLE_FILTRE;
      // v6.52 — LIMITES DU MODE MINI-PLANS : elles remplacent les limites de la voix off (un clip = un plan = un geste).
      const LIMITES_MINI = !(MINI_RUN && MINI_INFO) ? '' : '\n=== LIMITES APPLIQUÉES PAR LE CONTRÔLE — MODE MINI-PLANS (elles priment sur TOUT autre chiffre lu ailleurs, y compris « clips de 8 s », « deux idées par bloc », « pivot » ou la numérotation des blocs du CT) ===\n'
        + '- La vidéo dure ' + MINI_INFO.D + ' s et compte ' + NC + ' PLANS d\'environ ' + MINI_INFO.plan.toFixed(1) + ' s (un plan toutes les ' + MINI_INFO.rythme + ' s dans la source). Tu écris ' + NC + ' clips (bloc 1 à ' + NC + ') : UN clip = UN plan = UN vers.\n'
        + '- LE SQUELETTE DU CT SE LIT COMME UNE SUITE D\'IDÉES, PAS DE DURÉES : ses ' + MINI_INFO.nCT + ' idées (ou blocs) se répartissent dans l\'ordre sur tes ' + NC + ' plans (' + Array.from({ length: MINI_INFO.nCT }, (_, b) => { const a = Math.floor(b * NC / MINI_INFO.nCT) + 1, z = Math.floor((b + 1) * NC / MINI_INFO.nCT); return 'idée ' + (b + 1) + ' du CT → plan' + (z > a ? 's ' + a + ' à ' + z : ' ' + a); }).join(' ; ') + ') ; c\'est indicatif : la couverture de la partition ci-dessous prime.\n'
        + '=== LA PARTITION ÉMOTIONNELLE (v6.53, PV52) — CHAQUE PLAN A UNE RAISON D\'EXISTER ===\n'
        + 'Mesure de l\'échec précédent : 15 plans sans intention, un homme debout dans sa cuisine pendant qu\'on chante « il aide à s\'endormir », aucun plan où il s\'endort, aucun proche, aucune preuve montrée. Une pub qui vend fait VIVRE une suite d\'états au spectateur ; chaque plan en porte un. Pour CHAQUE clip tu remplis :\n'
        + '  · `role` : signe | probleme | consequence | besoin | bascule | mecanisme | effet | resultat | social | preuve | offre | appel ;\n'
        + '  · `intention` : la phrase que le spectateur se dit à cet instant, à la première personne (« c\'est exactement moi à 2 h du matin », « même elle le voit », « ah, c\'est ça qui marche », « il dort enfin », « c\'est sérieux, c\'est contrôlé ») — jamais une description du plan ;\n'
        + '  · `emotion` : l\'émotion NOMMÉE du personnage, jouée à l\'intensité d\'un long-métrage d\'animation (grande, lisible, tout le corps) ;\n'
        + '  · `cadrage` : tres_gros_plan | gros_plan | plan_moyen | plan_large | insert_mains | insert_objet ;\n'
        + '  · `rendu` : "veo" (un personnage JOUE un geste : Veo l\'anime) ou "insert" (une IMAGE CONÇUE, animée par le code d\'un lent travelling : preuve, carte, composants, produit héros, laboratoire, offre). Un insert ne coûte aucun clip Veo.\n'
        + 'COUVERTURE OBLIGATOIRE (le contrôle compte, et refuse le plan sinon) :\n'
        + '  1. au moins 2 plans `probleme` ou `signe` (3 quand le CT énumère des signes) : chacun montre le problème que la cible vit DANS SON CORPS, SA NUIT ou SA JOURNÉE, et le personnage le TOUCHE ou le MONTRE (il tire la peau sous ses yeux cernés devant le miroir, presse ses tempes, se masse la nuque, fixe le plafond les yeux grands ouverts, regarde l\'heure et se retourne) ; gros plans et très gros plans d\'abord ;\n'
        + '  2. au moins 1 plan `consequence` ou `social` qui montre l\'effet du problème sur un PROCHE ou sous son regard (sa compagne dort paisiblement à côté de lui pendant qu\'il fixe le plafond, un collègue le voit bâiller, un enfant tire sa manche) : on a le droit, et le devoir, de mettre PLUSIEURS personnages quand l\'idée l\'exige ; le héros reste au premier plan, les autres sont dans `personnages_visibles` et dans `fiches_personnages`, bouches fermées ;\n'
        + '  3. au moins 1 plan `resultat` qui MONTRE le bénéfice promis EN TRAIN D\'ARRIVER, au mot de la promesse (pour un produit du sommeil : il s\'endort, les traits se détendent, la respiration ralentit ; pour une crème : la peau change sous les doigts) — le spectateur doit VOIR la promesse se réaliser, pas un sourire dans une cuisine ;\n'
        + '  4. au moins 1 plan `social` de VIE REPRISE avec ses proches (rire avec sa compagne au réveil, jouer avec ses enfants, être félicité au travail) : la transformation se prouve dans le regard des autres ;\n'
        + '  5. chaque PREUVE chantée ou dite (origine, fabrication, contrôle, composants, certification) a SON plan `preuve` en `rendu: "insert"` : une image conçue, nette, illustrative, de grande qualité — une carte stylisée du pays d\'origine avec un repère, les composants réels disposés comme une nature morte de studio, un laboratoire propre avec le produit, le produit héros sur une matière noble. AUCUN texte dans l\'image (le texte arrive par les sous-titres) ;\n'
        + '  6. le produit est visible dans au moins 3 plans (bascule, mécanisme ou preuve, appel), étiquette face caméra ;\n'
        + '  7. les inserts font entre 2 plans et 40 % des plans : au-delà la vidéo devient un diaporama ;\n'
        + '  8. deux plans voisins n\'ont jamais le même `cadrage`, et au moins 40 % des plans sont des gros plans, très gros plans ou inserts (c\'est la grammaire de la source : l\'œil reçoit une information nouvelle à chaque coupe).\n'
        + '- LE GESTE EST DICTÉ, PHYSIQUE, DÉJÀ ENGAGÉ DANS L\'IMAGE DE DÉPART, LISIBLE EN 2 SECONDES. UN plan = UN lieu, UN geste : jamais deux temps, jamais « puis », « transition », « se transforme ». Le changement de scène se fait au MONTAGE.\n'
        + '- L\'IMAGE ILLUSTRE LE VERS AU MOT PRÈS : « tes yeux cernés » → un très gros plan d\'un œil cerné et d\'un doigt qui tire la peau ; « elle dort, pas toi » → lui les yeux ouverts, elle endormie ; « deux gélules au coucher » → la main qui les prend avec un verre d\'eau, sur la table de nuit. LE RITUEL EST CELUI DE CE PRODUIT : la source buvait un café le matin ; un produit du soir se prend le soir, comme l\'indique la synthèse — jamais une tasse si le produit n\'est pas une boisson.\n'
        + '=== v6.55 — SEPT EXIGENCES POUR UNE PUB QUI VEND (mesure run 88002b0d : note 5/10 : mou, allusif, sans offre) ===\n'
        + '  A. DERNIERS PLANS = OFFRE PUIS APPEL. Les 2 ou 3 derniers plans sont, dans l\'ordre : un plan `offre` (ce que la synthèse permet : offre, garantie, livraison, paiement à la livraison, promo, tirés de la bible — en `insert` ou en produit héros), puis un plan `appel` qui MONTRE le produit et la personne qui agit (elle le commande, le tient, sourit). Si la synthèse ne donne ni offre ni garantie, le plan `appel` montre le produit et la vie reprise. Le dernier vers chanté donne l\'ordre soudé à son bénéfice.\n'
        + '  B. ARC DE COULEUR ROUGE → VERT (SAUF si la signature visuelle ou lumineuse du CT impose une lumière constante ou un autre arc : le CT prime, tu suis le sien). Chaque plan déclare dans son `prompt_gemini` une température : le problème (signes, conséquence) est dominé par des teintes froides, désaturées, rouges, ambre sale ou bleu nuit, lumière dure, contraste agressif ; la bascule est le premier plan où la lumière se réchauffe ; le résultat, le social, l\'offre et l\'appel sont chauds, verts frais, lumineux, saturés. La progression est monotone : jamais un plan « problème » lumineux après la bascule.\n'
        + ((P._rolesNonRequis && P._rolesNonRequis.length) ? '  (Rôles que ce CT n\'emploie pas, à NE PAS ajouter : ' + P._rolesNonRequis.join(', ') + '.)\n' : '')
        + '  C. UNE INTENTION PSYCHOLOGIQUE LISIBLE PAR IMAGE : l\'image doit faire ressentir son `intention` sans le texte : visage proche + lumière + geste. Un plan dont on ne peut pas dire en un mot ce qu\'il fait ressentir (peur, honte, doute, soulagement, désir, confiance) est refait.\n'
        + '  D. LE GESTE EST LITTÉRAL AU VERS : « un simple geste suffit » = la main qui avale la gélule avec de l\'eau ; « le regard qui guette la faille » = le regard fixe, fouillant, dirigé vers la caméra ou l\'objet ; « il dort enfin » = les yeux qui se ferment. Pas de métaphore filmée : le spectateur voit ce qu\'il entend.\n'
        + '  E. MOUVEMENT : tous les plans `veo` ont un mouvement du corps lisible dès la première seconde ET une caméra qui suit l\'action ; les inserts ont un travelling franc (zoom marqué ou balayage) ; jamais deux plans de suite sans mouvement du sujet.\n'
        + '  F. LE PRODUIT RESTE FIDÈLE À L\'IMAGE FOURNIE ; l\'étiquette ne se réécrit pas.\n'
        + '  G. CHAQUE VERS EST UN PLAN : le plan i illustre exactement le vers i, jamais le vers voisin.\n'
        + '  H. LE RAISONNEMENT « À QUOI RESSEMBLE CE BÉNÉFICE DANS SA VRAIE JOURNÉE ? ». Pour chaque bénéfice promis par un vers, tu ne cherches pas un symbole : tu te demandes ce que fait, concrètement et visiblement, une personne qui a ce bénéfice, et tu filmes CETTE scène. Un vers sur la concentration = quelqu\'un penché sur son ordinateur, absorbé, productif, de bonne humeur ; sur la présence auprès des siens = elle joue avec ses enfants, les yeux dans les leurs ; sur l\'énergie = elle est debout au milieu d\'une réunion, elle présente avec élan devant ses collègues ; sur le sommeil réparé = elle se lève d\'un bond, les traits reposés. Ces exemples montrent la MANIÈRE de raisonner, jamais un contenu à recopier : tu l\'appliques à la cible, au produit et au vers réels. Le spectateur doit comprendre le bénéfice en regardant le plan sans le son.\n'
        + '- PERSONNE NE PARLE : bouches fermées. Jamais « parle », « discute ».\n'
        + '- POUR UN CLIP `veo`, INTERDIT (Veo le rate) : texte, chiffres, carte, schéma, réveil à chiffres, écran allumé lisible ; effet magique (lueur qui sort du corps, aura, particules) ; objet qui apparaît, se transforme ou tourne sur lui-même. Tout cela passe en `insert`, où l\'image est conçue d\'avance et ne bouge que par un lent travelling.\n'
        + '- `prompt_veo` d\'un clip `veo` : 60 mots au plus, ACTION D\'ABORD, UNE PARTITION DE MOUVEMENT PRÉCISE (v6.56) : Veo anime très bien ce qu\'on lui décrit exactement, et reste mou quand on reste vague. Tu nommes (1) QUELLE partie du corps bouge (main, bras, tête, épaules, torse, regard, jambes), (2) dans QUELLE direction et à QUELLE vitesse (« snaps his head up », « slowly drags both hands down his face »), (3) le temps fort daté (« at 1 s »), (4) ce que fait le visage, (5) UN mouvement de caméra nommé qui suit l\'action (« camera pushes in as he …», « camera drifts left following her hand »). Jamais « regarde », « reste », « se tient » seuls. Cette règle vaut pour les plans muets de ce mode ; un plan où le personnage parle garde son jeu de parole. Pas de décor (il est dans l\'image). Un clip `insert` a un `prompt_veo` d\'une phrase qui décrit l\'image.\n'
        + '- `images_reference` : UNE image par plan. Pour un `insert`, le `prompt_gemini` décrit une image CONÇUE pour convaincre (composition centrée, matières, lumière de studio ou du décor), dans le même registre de rendu que le reste du film.\n'
        + '- Le narrateur n\'est PAS un personnage de l\'image : jamais dans personnages_visibles ; voix déclarée hors_champ.\n';
      const LIMITES = MINI_RUN && MINI_INFO ? LIMITES_MINI : VOIX_OFF_RUN ? LIMITES_VO : LIMITES_PAROLE;
      // ---- BIBLE DE TRADUCTION : un extracteur lit la synthèse et le CT et en tire ce qu'il faut TRADUIRE à l'écran et à la voix (lieux, monde visuel, formules du marché, objection, règle du niveau)
      const HOSTP = `${LOCATION}-aiplatform.googleapis.com`, PRO = `/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-2.5-pro:generateContent`;
      // ───── v6.32 — OUTILS DE LA VOIX OFF ET DE LA COMPRESSION
      const compterMots = t4 => String(t4 || '').trim().split(/\s+/).filter(Boolean).length;
      // Bornes de longueur du texte continu : elles dependent de qui dit le texte. Un personnage a l'image est limite par
      // Veo (~4 mots/s) ; une voix off est limitee par la duree d'un clip (8 s) a debit naturel (~2,8 mots/s).
      const KN = NC / 4, sc = x => Math.round(x * KN);
      const BORNE = (MINI_RUN && MINI_INFO) ? (() => {   // v6.52 : en mini-plans la longueur suit la duree reelle (~2,4 a 3 mots chantes ou dits par seconde)
          const D = MINI_INFO.D, r = CHANSON_RUN ? [1.9, 2.35] : [2.3, 2.8],   /* v6.53 : une chanson ne se chante pas a 2,7 mots/s ; 1,9 a 2,35 avec des sections calees sur la duree */ lo = Math.round(D * r[0]), hi = Math.round(D * r[1]), cib = Math.round((lo + hi) / 2);
          return { lo, hi, bas: lo + 3, haut: hi - 3, cSi: hi - 3, cib, plancher: lo, txt: (lo + 3) + ' à ' + (hi - 3), raison: 'la vidéo dure ' + D + ' s en plans de ' + MINI_INFO.plan.toFixed(1) + ' s : au-delà, la voix déborde des plans et le rythme du CT se perd' };
        })() : VOIX_OFF_RUN
        ? { lo: sc(76), hi: sc(104), bas: sc(84), haut: sc(100), cSi: sc(100), cib: sc(93), plancher: sc(76), txt: sc(84) + ' à ' + sc(100), raison: 'la voix off dit environ 2,8 mots par seconde et chaque clip dure 8 secondes : au-dela, un bloc de voix deborde de son clip et la voix doit etre acceleree, ce qui la rend fatigante a l\'oreille' }
        : RATE_CT ? (() => { const D8 = NC * 8, lo = Math.round(D8 * RATE_CT * 0.85), hi = Math.round(D8 * RATE_CT * 1.2), bas = Math.round(D8 * RATE_CT * 0.9), haut = Math.round(D8 * RATE_CT * 1.15); return { lo, hi, bas, haut, cSi: haut, cib: Math.round(D8 * RATE_CT), plancher: lo, txt: bas + ' à ' + haut, raison: 'le débit de la vidéo d\'origine du CT est de ' + RATE_CT + ' mots par seconde : plus vite, Veo escamote des mots et la bouche ne suit plus' }; })()
        : { lo: sc(94), hi: sc(116), bas: sc(100), haut: sc(110), cSi: sc(110), cib: sc(105), plancher: sc(90), txt: sc(100) + ' à ' + sc(110), raison: 'le modele vocal ne peut pas tout prononcer en 32 secondes : il escamote des mots courts (mais, que, et, puis) et la phrase devient bancale a l\'oreille' };
      // v6.47 — les textes de consigne ecrits pour 4 clips (« 4 blocs », « 100 à 110 mots », « 32 secondes ») suivent NC.
      // A NC = 4 rien ne change. Le CT n'est jamais reecrit : c'est lui qui donne la duree.
      const adaptNC = s => NC === 4 ? s : String(s)
        .replace(/\b4 (clips|blocs|premiers clips)\b/g, NC + ' $1')
        .replace(/\bquatre (clips|blocs|gestes|générations|generations)\b/gi, (m, w) => frNum(NC) + ' ' + w)
        .replace(/\bles 4\b/g, 'les ' + NC)
        .replace(/\(4 maximum/g, '(' + NC + ' maximum')
        .replace(/\bquatre au plus\b/g, frNum(NC) + ' au plus')
        .replace(/\b100 à 110\b/g, MINI_RUN && MINI_INFO ? BORNE.txt : sc(100) + ' à ' + sc(110)).replace(/\b84 à 100\b/g, MINI_RUN && MINI_INFO ? BORNE.txt : sc(84) + ' à ' + sc(100))
        .replace(/\b32 (secondes|s)\b/g, (MINI_RUN && MINI_INFO ? MINI_INFO.D : NC * 8) + ' $1').replace(/\b8 plans perçus pour 4\b/g, (2 * NC) + ' plans perçus pour ' + NC);
      const nettoyerTexte = t5 => String(t5 || '').replace(/^```[a-z]*\s*/i, '').replace(/```\s*$/, '').trim().replace(/^\s*\{?\s*"?texte_global"?\s*:\s*/i, '').replace(/\}\s*$/, '').trim().replace(/^[«"“]\s*/, '').replace(/\s*[»"”]\s*$/, '').replace(/\s+/g, ' ').trim();
      // Compression : texte BRUT en sortie. La v6.29 demandait un JSON et echouait (« Unterminated string at position 230 »)
      // parce que les 2000 jetons de sortie etaient en partie consommes par la reflexion du modele : la reponse etait coupee.
      const comprimerTexte = async (txt, aRetirer, raison) => {
        const n0 = compterMots(txt), cible = Math.max(3, n0 - aRetirer);
        const askZ = 'Tu es le MONTEUR du texte d\'une publicite video. Une seule tache : COMPRIMER le texte ci-dessous.\n\n'
          + 'POURQUOI : ' + raison + '. Ce n\'est pas un gout, c\'est une limite physique de debit.\n\n'
          + 'CIBLE : ' + cible + ' mots. Il y en a ' + n0 + ', donc ' + aRetirer + ' a retirer. Compte tes mots avant de repondre.\n\n'
          + 'CE QUI SE COUPE EN PREMIER : les mots de liaison de l\'ecrit (donc, ainsi, en effet, c\'est-a-dire, par ailleurs), les redites, les precisions qui ne vendent rien, les adjectifs que la phrase suivante ne paie pas, les reprises d\'un sujet deja nomme.\n'
          + 'CE QUI NE SE COUPE JAMAIS : l\'image concrete, le moment vecu, le mot que la cible dit vraiment, le chiffre de l\'offre, le nom du produit, la derniere phrase, et les mots de liaison qui font tenir la phrase a l\'oreille quand elle est dite. TU COUPES DES MOTS, JAMAIS L\'EMOTION : un texte devenu court mais plat est refuse. Entre une precision et une emotion, c\'est la precision qui part.\n'
          + 'TU NE REECRIS PAS : meme ordre des idees, memes images, meme ton, memes mots partout ou c\'est possible. Aucune phrase nouvelle, aucune idee retiree — seulement des mots en moins.\n\n'
          + 'TEXTE A COMPRIMER (' + n0 + ' mots) :\n' + txt
          + '\n\nReponds UNIQUEMENT par le texte comprime, sur une seule ligne, sans guillemets, sans commentaire, sans JSON.';
        const gz = await vjson(HOSTP, PRO, { contents: [{ role: 'user', parts: [{ text: askZ }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 6000, thinkingConfig: { thinkingBudget: 512 } } });
        const out = nettoyerTexte(textOf(gz)), n1 = compterMots(out);
        if (!out || n1 >= n0 || n1 < Math.round(cible * 0.8)) throw new Error('compression inutilisable (' + n1 + ' mots pour une cible de ' + cible + ')');
        return out;
      };
      // v6.50 — LE PAROLIER. Premier essai reel du mode chanson (CT-013, plan seulement) : le copywriter avait rendu 223 mots de PROSE
      // (phrases de 15 a 20 mots, aucun refrain) malgre la consigne CHANSON, noyee sous les consignes d'ecrit (rythme de phrases
      // inegales, derniere phrase explicative). ElevenLabs Music aurait chante un paragraphe. Le code controle donc la FORME :
      // vers de 3 a 9 mots, un refrain repete, pas de ? ni de !, longueur dans la borne ; sinon un parolier reecrit, sans rien ajouter.
      const analyseParoles = txt => {
        const brut = String(txt || '').replace(/\r/g, '\n');
        const lignes = (brut.indexOf('\n') >= 0 ? brut.split('\n') : (brut.match(/[^.!?;]+[.!?;]*/g) || [])).map(x => x.replace(/\s+/g, ' ').trim()).filter(Boolean);
        const mots = x => x.split(' ').filter(Boolean).length;
        const plat = x => norm(x).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
        const freq = {}; lignes.forEach(l => { const k = plat(l); if (k && mots(k) >= 2) freq[k] = (freq[k] || 0) + 1; });
        const refrain = Math.max(0, ...Object.values(freq));
        const longues = lignes.filter(l => mots(l) > 9).length, moyen = lignes.length ? lignes.reduce((a, l) => a + mots(l), 0) / lignes.length : 0;
        const points = /[?!]/.test(brut);
        const total = compterMots(brut);
        const besoinRef = (MINI_RUN || NC < 6) ? 2 : 3;
        const ok = lignes.length >= (MINI_RUN ? NC : NC * 2) && longues === 0 && moyen <= 8 && refrain >= besoinRef && !points && total >= BORNE.lo && total <= BORNE.hi;
        return { ok, lignes: lignes.length, longues, moyen: +moyen.toFixed(1), refrain, besoinRef, points, total };
      };
      const motsInterditsParoles = txt => { const bb = P.bible || {}; const pl = x => norm(String(x || '')).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim(); const T = ' ' + pl(txt) + ' ';
        return (bb.interdits_mots || []).filter(x => { const w = pl(x); return w && w.split(' ').length <= 8 && T.includes(' ' + w + ' '); }).slice(0, 6); };
      const inventionsParoles = async (src, lyr) => {   // v6.50 : le parolier réécrit APRÈS le relecteur de cohérence ; un vers qui ajoute une image corporelle, une promesse ou un fait absents du texte est refusé
        try {
          const g = await vjson(`${LOCATION}-aiplatform.googleapis.com`, `/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-2.5-flash:generateContent`, { contents: [{ role: 'user', parts: [{ text:
            'Compare un TEXTE SOURCE et des PAROLES qui le reprennent en vers. Liste (en francais, une courte citation du vers + pourquoi) chaque vers des PAROLES qui AFFIRME quelque chose que le TEXTE SOURCE ne dit pas : une promesse de resultat (ex. dormir d\'une traite, se reveiller en forme), une image corporelle ou une sensation nouvelle, un fait, un chiffre, une propriete du produit. Reformuler ou rimer ce que dit le texte n\'est PAS une invention ; ajouter une affirmation en est une. Si rien n\'est ajoute, liste vide.\n\nTEXTE SOURCE :\n' + src + '\n\nPAROLES :\n' + lyr }] }],
            generationConfig: { temperature: 0, maxOutputTokens: 1500, responseMimeType: 'application/json', responseSchema: { type: 'OBJECT', properties: { inventions: { type: 'ARRAY', items: { type: 'STRING' } } }, required: ['inventions'] } } });
          return (JSON.parse(textOf(g)).inventions || []).map(x => String(x).slice(0, 160)).slice(0, 6);
        } catch (eI) { return []; }
      };
      const paroliser = async (txt, evite) => {
        const n0 = compterMots(txt);
        const ask = 'Tu es le PAROLIER d\'une chanson publicitaire. Une seule tache : transformer le TEXTE ci-dessous en PAROLES chantees, sans changer ce qu\'il dit.\n\n'
          + 'FORME OBLIGATOIRE (le code la controle et refuse sinon) :\n'
          + '- une ligne = un VERS de 3 a 8 mots, termine par un point. Jamais de ? ni de !. Aucune ligne de plus de 9 mots.\n'
          + '- UN REFRAIN : un vers (ou deux vers collés) de 3 a 7 mots, tire de l\'idee finale / de l\'appel a l\'action (avec le nom du produit si le texte le contient), repete A L\'IDENTIQUE au moins ' + ((MINI_RUN || NC < 6) ? 2 : 3) + ' fois, reparti dans le texte (jamais colle ' + ((!MINI_RUN && NC >= 6) ? 'trois fois d\'affilee' : 'deux fois d\'affilee') + ' sauf a la fin). Le dernier bloc chante le refrain et l\'appel a l\'action.\n'
          + (MINI_RUN && MINI_INFO ? '- UN VERS = UN PLAN DE LA VIDEO (environ ' + MINI_INFO.plan.toFixed(1) + ' s chante, la chanson entiere dure ' + MINI_INFO.D + ' s) : au moins ' + NC + ' vers, et chaque vers dit UNE chose qu\'on peut MONTRER (un geste, un signe du corps, un proche, un objet, un moment de la nuit ou de la journee, le resultat qui arrive) avec les mots concrets du TEXTE. Quand le texte dit une idee abstraite, tu gardes son sens avec le mot le plus concret que le texte contient. Tu gardes TOUS les vers de signes, de resultat, de proches et de preuves : ce sont eux qui font vendre. Tu gardes aussi les vers d\'OFFRE, de GARANTIE et d\'APPEL du texte, en fin de chanson ; le refrain (l\'appel) ne revient que 2 fois au plus, jamais 3 : chaque seconde de refrain en trop est une seconde sans argument.\n' : '')
          + '- rimes ou assonances en fin de vers quand la langue le permet, sans trahir le sens. Des mots que la cible dit vraiment, pas de langue ecrite.\n'
          + (((P.bible || {}).interdits_mots || []).length ? '- MOTS ET TOURNURES INTERDITS (ne les ecris jamais, meme transformes) : ' + (P.bible.interdits_mots || []).slice(0, 12).join(' ; ') + '.\n' : '')
          + (evite && evite.length ? '- ERREURS DE LA PASSE PRECEDENTE A NE PAS REPETER (affirmations absentes du texte) : ' + evite.join(' | ') + '\n' : '')
          + '- tout fait, chiffre, duree, nom et ingredient du texte reste avec les MEMES mots ; tu n\'ajoutes AUCUNE allegation, AUCUN fait, AUCUN chiffre nouveau ; tu ne retires aucune idee, sauf pour tenir dans la longueur.\n'
          + '- meme ordre des idees, meme arc emotionnel : on se reconnait, on admet, on mesure, on est soulage, on agit.\n'
          + (P.boussole ? '- REGISTRE (v6.54) : ces paroles seront chantees ' + P.boussole.registre + ' (' + P.boussole.tempo_bpm_min + '-' + P.boussole.tempo_bpm_max + ' BPM) : les sons et les mots vont vers « ' + P.boussole.destination + ' » ; des syllabes douces et longues pour un registre calme, des attaques franches pour un registre vif.\n' : '')
          + '- LONGUEUR : entre ' + BORNE.lo + ' et ' + BORNE.hi + ' mots au total (cible ' + BORNE.cib + '), le refrain compte chaque fois qu\'il revient. Compte avant de repondre.\n\n'
          + 'TEXTE (' + n0 + ' mots) :\n' + txt
          + '\n\nReponds UNIQUEMENT par les paroles, un vers par ligne, sans titre, sans [Refrain], sans guillemets, sans commentaire.';
        const gz = await vjson(HOSTP, PRO, { contents: [{ role: 'user', parts: [{ text: ask }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 6000, thinkingConfig: { thinkingBudget: 1024 } } });
        let out = textOf(gz).replace(/^```[a-z]*\s*/i, '').replace(/```\s*$/, '').replace(/[«»"“”]/g, '').replace(/^\s*\[[^\]]*\]\s*$/gm, '').trim();
        out = out.split('\n').map(x => x.replace(/\s+/g, ' ').trim()).filter(Boolean).map(x => /[.;]$/.test(x) ? x : x.replace(/[,:!?]+$/, '') + '.').join('\n');
        return out;
      };
      // Choix de la voix off : la variable ELEVENLABS_VOICE_ID l'impose ; a defaut on la CHOISIT dans les voix du compte
      // (genre, usage narration), puis en dernier recours une voix standard. Sans cela le CT etait inutilisable tant que
      // la variable n'etait pas posee, et on le decouvrait apres avoir paye les clips.
      const resoudreVoixOff = async genreFeminin => {
        const forcee = String(process.env.ELEVENLABS_VOICE_ID || '').trim();
        if (forcee) return { id: forcee, nom: null, source: 'ELEVENLABS_VOICE_ID' };
        try {
          const rl = await rfetch('https://api.elevenlabs.io/v1/voices', { method: 'GET', headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY } }, 2, 30000);
          if (rl.ok) {
            const jl = await rl.json();
            const note = v => { const lb = v.labels || {}; let sc = 0; const g = String(lb.gender || '').toLowerCase();
              if (g) sc += (genreFeminin ? g === 'female' : g === 'male') ? 100 : -100;
              if (/narrat|document|informative|news|audiobook|explain/i.test([lb.use_case, lb.descriptive, lb.description, v.description].join(' '))) sc += 20;
              const cible = (P._voixProfil && P._voixProfil.classe) || null, va = String(lb.age || '').toLowerCase().replace(/[ -]/g, '_');
              if (cible && va) sc += va === cible ? 40 : (va === 'middle_aged' || cible === 'middle_aged') ? 12 : -25;
              else if (/middle/i.test(va)) sc += 8;
              if (/calm|deep|warm|clear|neutral|professional/i.test([lb.descriptive, lb.description].join(' '))) sc += 6;
              return sc; };
            const best = (jl.voices || []).map(v => ({ v, sc: note(v) })).sort((x, y) => y.sc - x.sc)[0];
            if (best && best.sc > 0) return { id: best.v.voice_id, nom: best.v.name, source: 'choisie dans les voix du compte' };
          }
        } catch (eL) { /* liste indisponible (cle restreinte) : voix standard */ }
        return { id: genreFeminin ? '21m00Tcm4TlvDq8ikWAM' : 'pNInz6obpgDQGcFmaJgB', nom: genreFeminin ? 'Rachel' : 'Adam', source: 'voix standard ElevenLabs (secours)' };
      };
      // Voix off dite UNE FOIS, d'un trait, avec le minutage de chaque caractere : duree exacte de chaque bloc, fin de chaque
      // replique (le PIVOT ou l'image change), et mot a mot pour les sous-titres. blocs = [[texte, texte], [texte], …]
      const ttsVoixOff = async (blocs, genreFeminin, vitesse) => {
        const CLEV = process.env.ELEVENLABS_API_KEY || '';
        if (!CLEV) throw new Error('ELEVENLABS_API_KEY absente');
        if (!P._voixChoisie) { P._voixChoisie = await resoudreVoixOff(genreFeminin); log('Voix off : ' + (P._voixChoisie.nom ? P._voixChoisie.nom + ' (' : '(') + P._voixChoisie.id + ') — ' + P._voixChoisie.source + (P._voixChoisie.source === 'ELEVENLABS_VOICE_ID' ? '.' : '. Pose ELEVENLABS_VOICE_ID pour imposer la tienne.')); }
        const bornes = []; let txt = '';
        blocs.forEach(reps => { const rb = []; (reps || []).forEach(t6 => { const tt = String(t6).replace(/\s+/g, ' ').trim(); if (!tt) return; if (txt) txt += ' '; txt += tt; rb.push(txt.length); }); bornes.push(rb); });
        // v6.56 — Eleven v3 (plus expressif, meme prix) par defaut ; la v2 reste le secours, et la voie obligatoire quand il faut ACCELERER la voix
        // (la v3 n'a pas de reglage de vitesse). Reglable : ELEVENLABS_TTS_MODEL.
        const vsBase = Object.assign({ stability: 0.4, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true }, P.boussole ? ({ lent: { stability: 0.62, style: 0.2 }, pose: { stability: 0.5, style: 0.3 }, vif: { stability: 0.33, style: 0.5 } }[P.boussole.debit] || {}) : {}, vitesse && vitesse > 1.005 ? { speed: Math.min(1.2, vitesse) } : (P.boussole && P.boussole.debit === 'lent' ? { speed: 0.94 } : {}));
        const veutV3 = !process.env.ELEVENLABS_TTS_MODEL && !(vitesse && vitesse > 1.005);
        const snap3 = v => (v < 0.25 ? 0 : v < 0.75 ? 0.5 : 1);   // la v3 n'accepte que trois niveaux de stabilite (creative / natural / robust)
        const demandeTTS = modele => rfetch('https://api.elevenlabs.io/v1/text-to-speech/' + encodeURIComponent(P._voixChoisie.id) + '/with-timestamps?output_format=mp3_44100_128',
          { method: 'POST', headers: { 'xi-api-key': CLEV, 'content-type': 'application/json' },
            body: JSON.stringify({ text: txt, model_id: modele, voice_settings: modele === 'eleven_v3' ? { stability: snap3(vsBase.stability), similarity_boost: vsBase.similarity_boost } : vsBase }) }, 2, 180000);
        let modeleTTS = process.env.ELEVENLABS_TTS_MODEL || (veutV3 ? 'eleven_v3' : 'eleven_multilingual_v2');
        let rv = await demandeTTS(modeleTTS);
        let jv = rv.ok ? await rv.json().catch(() => null) : null;
        if ((!rv.ok || !jv || !jv.audio_base64) && modeleTTS === 'eleven_v3') {
          log('Voix off : Eleven v3 indisponible ou sans horaires (HTTP ' + rv.status + ') → repli sur Multilingual v2.');
          modeleTTS = 'eleven_multilingual_v2'; rv = await demandeTTS(modeleTTS); jv = rv.ok ? await rv.json().catch(() => null) : null;
        }
        if (!rv.ok) throw new Error('HTTP ' + rv.status + ' ' + String(await rv.text()).slice(0, 180));
        if (!jv) throw new Error('reponse vocale illisible');
        log('Voix off dite par ' + modeleTTS + '.');
        try { const tt = TARIFS.elevenlabs.usd_par_credit; coutAjoute('voix', 'elevenlabs:' + modeleTTS, { caracteres: txt.length }, tt == null ? null : txt.length * tt); } catch (eC) {}
        const al = jv.alignment || jv.normalized_alignment || {};
        const chs = al.characters || [], t0s = al.character_start_times_seconds || [], t1s = al.character_end_times_seconds || [];
        if (!jv.audio_base64 || !t1s.length) throw new Error('reponse sans audio ou sans alignement');
        const fVo = path.join(OUT, id + '_voixoff.mp3');
        fs.writeFileSync(fVo, Buffer.from(jv.audio_base64, 'base64'));
        const idx = off => Math.min(t1s.length - 1, Math.max(0, Math.round(off / Math.max(1, txt.length) * t1s.length) - 1));   // robuste si l'alignement n'a pas la meme longueur que le texte
        const fin = off => Number(t1s[t1s.length === txt.length ? Math.min(off, txt.length) - 1 : idx(off)]) || 0;
        let prec = 0; const segs = bornes.map((rb, i2) => {
          if (!rb.length) return { bloc: i2 + 1, debut: prec, fin: prec, duree: 0, pivot: [] };
          const f2 = fin(rb[rb.length - 1]);
          const sg = { bloc: i2 + 1, debut: prec, fin: f2, duree: Math.max(0.5, f2 - prec), pivot: rb.slice(0, -1).map(o => Math.max(0, fin(o) - prec)) };
          prec = f2; return sg;
        });
        const words = []; { let cur = '', a0 = null, a1 = 0;
          for (let k = 0; k < chs.length; k++) { const ch = chs[k];
            if (/\s/.test(ch)) { if (cur) { words.push({ text: cur, start: a0, end: a1 }); cur = ''; a0 = null; } continue; }
            if (a0 === null) a0 = Number(t0s[k]) || 0; cur += ch; a1 = Number(t1s[k]) || a1; }
          if (cur) words.push({ text: cur, start: a0, end: a1 }); }
        return { fichier: id + '_voixoff.mp3', duree: prec, segments: segs, words, voice_id: P._voixChoisie.id, voix_nom: P._voixChoisie.nom };
      };
      // v6.48 — MODE CHANSON. Meme contrat que ttsVoixOff (segments par bloc, pivots, mot a mot) : tout l'aval (copywriting,
      // rééquilibrage, plans Veo muets, montage, sous-titres) est inchange. La « voix » est une chanson ElevenLabs Music dont
      // les paroles sont celles du copywriter, une section par bloc. Le minutage vient de l'alignement force (texte connu),
      // sinon de Scribe. Un seul passage : refaire une chanson coute de l'argent, on ne la regenere pas pour gagner une seconde.
      const ttsChanson = async (blocs, genreFeminin) => {
        const CLEV = process.env.ELEVENLABS_API_KEY || '';
        if (!CLEV) throw new Error('ELEVENLABS_API_KEY absente');
        const net = s => String(s).replace(/\s+/g, ' ').trim();
        const lignesBloc = blocs.map(reps => (reps || []).map(net).filter(Boolean));
        const nMots = s => net(s).split(' ').filter(Boolean).length;
        // style musical : lu dans le CT (genre, tempo, voix chantante), sinon deduit du marche et des emotions ; langue = celle de la synthese
        const lg = String(((P.bible || {}).langue || {}).code || 'fr').slice(0, 2).toLowerCase();
        const emos = (P.plan && P.plan.clips || []).map(c2 => (c2.repliques || []).map(r => String((r && (r.emotion || r.ton)) || '').trim()).filter(Boolean).join(' / ')).filter(Boolean);
        let styles = null;
        try {
          const gs = await vjson(`${LOCATION}-aiplatform.googleapis.com`, `/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-2.5-flash:generateContent`, { contents: [{ role: 'user', parts: [{ text:
            'Tu prepares la commande d\'une chanson publicitaire pour ElevenLabs Music. Lis la description du CT et donne, en ANGLAIS : "global" = 4 a 7 courtes etiquettes de style (genre, tempo, instrumentation, couleur de la voix chantee, energie), "negatif" = 3 a 5 choses a eviter (ex. spoken word, choir, heavy distortion), "sections" = pour CHAQUE bloc ' + lignesBloc.length + ' une courte etiquette de couleur emotionnelle (3 a 6 mots) qui suit l\'arc des emotions. '
            + (P.boussole ? 'REGLE v6.54 — LA FORME vient du CT (chanson a refrain, voix chantee), LE REGISTRE vient de la DESTINATION du produit et PRIME sur le style de la pub source : destination « ' + P.boussole.destination + ' », registre ' + P.boussole.registre + ', energie ' + P.boussole.energie + '/10, ' + P.boussole.tempo_bpm_min + '-' + P.boussole.tempo_bpm_max + ' BPM, musique : ' + P.boussole.musique_en + ' ; a eviter : ' + (P.boussole.musique_a_eviter_en || []).join(', ') + '. Arc : ' + P.boussole.arc + '. Les etiquettes de sections suivent cet arc (le debut peut porter la tension du probleme, la suite glisse vers la destination). Couleur culturelle : ' + (P.boussole.miroir_persona || []).slice(0, 3).join(' ; ') + '. Voix chantante : ' : 'Le style vient du CT quand il le decrit (genre, tempo, type de voix) ; sinon tu le deduis du marche et de l\'intention, en restant une chanson de PUBLICITE directe, accrocheuse, a refrain simple. Voix chantante : ') + (genreFeminin ? 'feminine' : 'masculine') + ' sauf si le CT dit autre chose. Langue chantee : ' + lg + '.\nEmotions par bloc : ' + emos.join(' | ') + '\n\nCT :\n' + String(p.ct || '').slice(0, 30000) }] }],
            generationConfig: { temperature: 0.4, maxOutputTokens: 1200, responseMimeType: 'application/json', responseSchema: { type: 'OBJECT', properties: { global: { type: 'ARRAY', items: { type: 'STRING' } }, negatif: { type: 'ARRAY', items: { type: 'STRING' } }, sections: { type: 'ARRAY', items: { type: 'STRING' } } }, required: ['global', 'negatif', 'sections'] } } });
          styles = JSON.parse(textOf(gs));
        } catch (eS) { styles = null; }
        if (styles && (styles.global || []).length) styles = accorderStyles(styles);
        if (!styles || !(styles.global || []).length) styles = { global: ['catchy advertising jingle', P.boussole && P.boussole.energie <= 4 ? 'slow gentle tempo' : 'upbeat mid-tempo', 'simple memorable hook', genreFeminin ? 'warm female lead vocal' : 'warm male lead vocal', 'clean modern production'], negatif: ['spoken word', 'choir', 'long instrumental intro'], sections: [] };
        styles = accorderStyles(styles);
        save('07_chanson_style.json', styles);
        let sections = lignesBloc.map((ls, i) => {
          const lignes = []; ls.forEach(l => { String(l).match(/[^.!?;]+[.!?;]?/g).forEach(x => { x = net(x); while (x.length > 190) { const k = x.lastIndexOf(' ', 190); lignes.push(x.slice(0, k)); x = x.slice(k + 1); } if (x) lignes.push(x); }); });
          const n = nMots(ls.join(' '));
          return { lines: lignes, local: String((styles.sections || [])[i] || 'driving, catchy'), duration_ms: Math.max(4500, Math.min(8000, Math.round(n * 340))), n };
        });
        // v6.53 — LA CHANSON A LA DUREE DE LA VIDEO. Mesure (run 94b5e103) : 15 blocs, chacun impose a 4,5 s minimum = 67 s
        // de chanson quoi qu'il arrive, pour une video visee a 40 s ; la musique suit les durees de section a la lettre.
        // En mini-plans, les vers sont regroupes en sections d'au moins 3,6 s, et la somme des sections vaut la duree visee.
        if (MINI_RUN && MINI_INFO) {
          const totM = sections.reduce((a, x) => a + Math.max(1, x.n), 0) || 1, cibleMs = Math.round(MINI_INFO.D * 1000);
          const grp = []; let cur = null;
          sections.forEach((x, i) => {
            const d = cibleMs * Math.max(1, x.n) / totM;
            if (!cur) cur = { lines: [], local: x.local, duration_ms: 0 };
            cur.lines = cur.lines.concat(x.lines); cur.duration_ms += d;
            if (cur.duration_ms >= 3600 || i === sections.length - 1) { grp.push(cur); cur = null; }
          });
          if (grp.length > 1 && grp[grp.length - 1].duration_ms < 3000) { const z = grp.pop(); grp[grp.length - 1].lines = grp[grp.length - 1].lines.concat(z.lines); grp[grp.length - 1].duration_ms += z.duration_ms; }
          grp.forEach(x => { x.duration_ms = Math.round(x.duration_ms); });
          log('Chanson calée sur la vidéo : ' + grp.length + ' section(s), ' + (grp.reduce((a, x) => a + x.duration_ms, 0) / 1000).toFixed(1) + ' s pour ' + totM + ' mots (' + (totM / MINI_INFO.D).toFixed(2) + ' mots chantés par seconde).');
          sections = grp;
        }
        // v6.55 — QUEUE DE CHANSON. Mesure (run 88002b0d) : la voix s'eteignait des 34 s sur une chanson de 38 s, donc l'appel final etait
        // chante dans le fondu de sortie. On commande une section de plus (le dernier vers repete, 3,5 s) : le fondu tombe dans cette queue, que le montage coupe.
        let QUEUE_TXT = '';
        { const dl = sections[sections.length - 1], ll = dl && dl.lines && dl.lines[dl.lines.length - 1];
          if (ll) { QUEUE_TXT = ll; sections.push({ lines: [ll], local: 'final chorus, full energy, hold the last note, no fade', duration_ms: 3500, n: 0 }); log('Chanson : section de queue ajoutée (3,5 s, dernier vers répété) pour que l\'appel final soit chanté à pleine voix ; le montage la coupe.'); } }
        // music_v2_5 : plan par CHUNKS (verifie par le test de l'utilisateur : le schema sections/lines est refuse en 422 pour ce modele). Les paroles sont dans `text`, sous un nom de section entre crochets.
        const plan = { chunks: sections.map((s, i) => ({ text: '[Part ' + (i + 1) + ']\n' + s.lines.join('\n'), duration_ms: s.duration_ms, positive_styles: styles.global.slice(0, 8).concat([s.local]), negative_styles: (styles.negatif || []).slice(0, 6), context_adherence: 'high' })) };
        save('07_chanson_plan.json', plan);
        const lyricsTxt = lignesBloc.map(ls => ls.join(' ')).join(' ') + (QUEUE_TXT ? ' ' + QUEUE_TXT : '');
        const dureeVoulue = sections.reduce((a, s) => a + s.duration_ms, 0);
        let rm = await rfetch('https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128', { method: 'POST', headers: { 'xi-api-key': CLEV, 'Content-Type': 'application/json' }, body: JSON.stringify({ composition_plan: plan, model_id: 'music_v2_5' }) }, 2, 300000);
        let voie = 'plan par sections';
        if (!rm.ok) {   // secours : meme chanson demandee en une phrase, paroles imposees dans le brief
          const err1 = String(await rm.text()).slice(0, 160);
          log('Chanson : plan par sections refuse (HTTP ' + rm.status + ' ' + err1 + ') : on la demande avec les paroles dans le brief.');
          const brief = 'A sung advertising song, ' + Math.round(dureeVoulue / 1000) + ' seconds. Style: ' + styles.global.join(', ') + '. Avoid: ' + (styles.negatif || []).join(', ') + '. Sing EXACTLY these lyrics, in this order, with no added words:\n' + sections.map(s => s.lines.join('\n')).join('\n');
          rm = await rfetch('https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128', { method: 'POST', headers: { 'xi-api-key': CLEV, 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: brief.slice(0, 4000), music_length_ms: Math.max(10000, dureeVoulue), model_id: 'music_v2_5' }) }, 2, 300000);
          voie = 'brief avec paroles';
          if (!rm.ok) throw new Error('chanson refusee : HTTP ' + rm.status + ' ' + String(await rm.text()).slice(0, 160));
        }
        const fVo = path.join(OUT, id + '_voixoff.mp3');
        fs.writeFileSync(fVo, Buffer.from(await rm.arrayBuffer()));
        let dTot = 0; try { dTot = parseFloat(String(require('child_process').execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', fVo]).toString()).trim()) || 0; } catch (eP) {}
        try { coutAjoute('musique', 'eleven_music:music_v2_5', { secondes: Math.round(dTot || dureeVoulue / 1000) }, null); } catch (eC) {}
        // minutage : alignement force sur les paroles connues, sinon transcription
        let mots = null, src = '';
        try {
          const fd = new FormData(); fd.append('file', new Blob([fs.readFileSync(fVo)], { type: 'audio/mpeg' }), 'chanson.mp3'); fd.append('text', lyricsTxt);
          const ra = await rfetch('https://api.elevenlabs.io/v1/forced-alignment', { method: 'POST', headers: { 'xi-api-key': CLEV }, body: fd }, 2, 180000);
          if (ra.ok) { const ja = await ra.json(); mots = (ja.words || []).filter(w => w && String(w.text || '').trim() && typeof w.start === 'number').map(w => ({ text: String(w.text).trim(), start: w.start, end: w.end })); src = 'alignement forcé'; try { coutAjoute('transcription', 'forced_alignment', { secondes: Math.round(dTot) }, null); } catch (eC) {} }
        } catch (eA) { mots = null; }
        if (!mots || mots.length < 8) {
          const fd = new FormData(); fd.append('file', new Blob([fs.readFileSync(fVo)], { type: 'audio/mpeg' }), 'chanson.mp3'); fd.append('model_id', 'scribe_v2'); fd.append('timestamps_granularity', 'word'); fd.append('language_code', lg);
          const rs = await rfetch('https://api.elevenlabs.io/v1/speech-to-text', { method: 'POST', headers: { 'xi-api-key': CLEV }, body: fd }, 2, 180000);
          if (!rs.ok) throw new Error('minutage de la chanson impossible : HTTP ' + rs.status);
          const tr = await rs.json(); try { coutAjoute('transcription', 'scribe_v2', { secondes: Math.round(dTot) }, null); } catch (eC) {}
          mots = (tr.words || []).filter(w => w && String(w.type || 'word') === 'word' && String(w.text || '').trim() && typeof w.start === 'number').map(w => ({ text: String(w.text).trim(), start: w.start, end: w.end }));
          src = 'transcription Scribe'; if (mots.length < 8) throw new Error('minutage de la chanson inexploitable (' + mots.length + ' mots)');
        }
        const tot = lignesBloc.reduce((a, ls) => a + nMots(ls.join(' ')), 0);
        if (QUEUE_TXT && mots.length > tot) mots = mots.slice(0, tot);   // v6.55 : les mots de la queue ne servent qu'a absorber le fondu
        const L = mots.length;
        const finMot = c => Number(mots[Math.min(L - 1, Math.max(0, Math.round(c / Math.max(1, tot) * L) - 1))].end) || 0;
        let cum = 0, prec = 0; const segs = lignesBloc.map((ls, i2) => {
          if (!ls.length) return { bloc: i2 + 1, debut: prec, fin: prec, duree: 0, pivot: [] };
          const cs = []; ls.forEach(l => { cum += nMots(l); cs.push(cum); });
          const f2 = finMot(cs[cs.length - 1]); const sg = { bloc: i2 + 1, debut: prec, fin: f2, duree: Math.max(0.5, f2 - prec), pivot: cs.slice(0, -1).map(c => Math.max(0, finMot(c) - prec)) }; prec = f2; return sg;
        });
        if (QUEUE_TXT && segs.length) { const sl = segs[segs.length - 1], f0 = sl.fin; sl.fin = Math.min(f0 + 0.7, dTot > 0 ? dTot - 0.3 : f0 + 0.7); sl.duree += Math.max(0, sl.fin - f0); }   // v6.55 : l'appel final tient 0,7 s de plus, voix pleine
        log('Chanson prête (' + voie + ', minutage : ' + src + ') : ' + dTot.toFixed(1) + ' s, ' + L + ' mots minutés.');
        return { fichier: id + '_voixoff.mp3', duree: prec, segments: segs, words: mots, voice_id: 'eleven_music', voix_nom: 'chanson', chanson: true };
      };
      const buildBible = async () => {
        const ask = 'Tu es l\'extracteur de la bible de traduction d\'une publicité vidéo. Tu lis la SYNTHESE (S0 à S9) et le CT_VIDEO ci-dessous et tu en tires, SANS RIEN INVENTER (chaque élément cite sa section source), ce que la vidéo doit traduire fidèlement en images et en paroles. ' + (p.angle ? 'ANGLE IMPOSÉ : ' + p.angle + ' (une seule entrée dans angles).' : 'L\'angle n\'est pas imposé par l\'utilisateur : prends l\'ANGLE 1 de la section S2 (le premier listé, l\'angle gagnant) et fournis UNE SEULE entrée dans angles, avec son nom exact.') + ' Niveau de conscience : ' + niveau + '.\nRéponds UNIQUEMENT par un JSON : {"langue":{"code":"code ISO 2 lettres de la LANGUE DU MARCHÉ décrit par la synthèse (S1 persona, S6 voix et lexique, S8 marché) — c\'est la langue dans laquelle TOUT le texte parlé et écrit de la vidéo sera produit ; ne prends pas la langue dans laquelle la synthèse est rédigée si elle diffère de celle du marché","nom":"son nom en clair","citation":"la phrase de la synthèse qui l\'établit"},"lieux_ct":[{"lieu":"nom du lieu physique distinct","fonction":"douleur|bascule|résolution|autre"}] (les lieux DISTINCTS que LA VIDÉO À PRODUIRE doit montrer d\'après les scènes du CT à remplir — douleur, bascule, résolution — un par lieu physique et non par état de lumière ; PAS les lieux simplement cités en exemple ou présents dans l\'analyse de la pub source ; 4 au maximum, classés du plus important au moins important pour la chaîne de persuasion),"interdits":["tout ce que la synthèse interdit de montrer, dire ou promettre pour ce produit, ce marché et ce niveau (arguments de vente exclus comme livraison ou paiement à la livraison, promesses médicales ou de performance, garantie ou urgence non fournies, mots interdits S6, sujets sensibles S7, etc.), chacun avec sa section"],"interdits_mots":["les EXPRESSIONS DECLENCHEUSES de ces interdits, dans la LANGUE DU MARCHE, en minuscules, 1 a 5 par interdit, telles qu elles apparaitraient dans une phrase parlee (ex. pour un interdit sur le paiement a la livraison : paiement a la livraison, payer a la reception, tu paies quand). Elles servent a un controle automatique du texte : chaque expression est courte, specifique, et ne peut pas apparaitre dans une phrase innocente"],"banalites_du_marche":["ce que TOUS les vendeurs de ce marche proposent deja et qui n est donc PAS un argument (pratique de vente standard, mention que tout le monde affiche), tire de S2, S3, S5 ou S8 ; chacune avec sa section. Une banalite peut etre vraie et utile a dire en fin de video, mais elle ne peut etre ni le hook, ni la raison qui decide, ni le point de chute"],"regle_niveau":{"prix_offre":"interdits|autorises","citation":"phrase de la synthèse qui fixe la règle pour ce niveau"},"cta_autorise":"ce que le dernier clip doit faire dire : verbe d\'action + nom du produit, + l\'offre EXACTE de S0 seulement si le niveau l\'autorise","offre_decodee":[{"element":"un element de l\'offre ou du pricing de S0/S4 qu\'on peut dire en GAIN VECU pour la personne : prix par usage ou par jour, economie reelle d\'un lot (montant garde), duree couverte en temps de vie, cadeau, badge du site, urgence datee et ce qu\'elle fait gagner ou perdre","chiffres_exacts":"les chiffres EXACTS de la synthese pour cet element","gain_vecu":"ce que ca change concretement pour elle, en une phrase","source":"S0/S4"}] (3 a 6 entrees ; LISTE VIDE si regle_niveau.prix_offre = interdits ; jamais un chiffre absent de la synthese),"palette_et_produit":"couleurs, étiquette, matière, forme du produit et de la marque (S0)","monde_general":[{"element":"détail concret et visible du quotidien de la cible dans son pays/sa ville (lieux, objets, tenues, teints, coiffures, lumière, climat, moyens de transport, téléphone…)","source":"S1/S7…"}] (8 à 12),"angles":[{"angle":"…","monde_visuel":[{"element":"détail visuel concret qui traduit CET angle","source":"…"}] (6 à 10),"formules":[{"texte":"mot, tournure ou verbatim du marché/de la cible à réutiliser dans les répliques","source":"S5/S6…"}] (6 à 10),"objection":{"dite":"objection principale du persona, formulée comme elle la dit","dementi_visuel":"ce qu\'on montre pour la démentir"} ou null}]}.\n\n=== CT_VIDEO ===\n' + p.ct + '\n\n=== SYNTHESE ===\n' + p.synthese;
        let lastErr;
        for (const [mx, th] of [[12000, 2048], [24000, 4096], [32000, 1024]]) { try { const g = await vjson(HOSTP, PRO, { contents: [{ role: 'user', parts: [{ text: ask }] }], generationConfig: { temperature: 0.2, maxOutputTokens: mx, thinkingConfig: { thinkingBudget: th }, responseMimeType: 'application/json' } }); return JSON.parse(textOf(g)); } catch (e) { lastErr = e; } }
        throw lastErr;
      };
      try { P.bible = await buildBible(); save('00_bible_traduction.json', P.bible); P.steps.push({ etape: '0. Bible de traduction (extraite de la synthèse et du CT)', lieux_ct: (P.bible.lieux_ct || []).map(x => x.lieu), regle_niveau: P.bible.regle_niveau, cta_autorise: P.bible.cta_autorise, angles: (P.bible.angles || []).map(a => a.angle), elements_visuels: ((P.bible.monde_general || []).length + (P.bible.angles || []).reduce((n, a) => n + (a.monde_visuel || []).length, 0)), formules: (P.bible.angles || []).reduce((n, a) => n + (a.formules || []).length, 0) }); log('Bible de traduction : ' + (P.bible.lieux_ct || []).length + ' lieu(x) du CT, ' + (P.bible.angles || []).length + ' angle(s) traduit(s), règle du niveau : ' + ((P.bible.regle_niveau || {}).prix_offre || '?') + '.'); }
      catch (e) { P.bible = null; log('Bible de traduction indisponible (' + String(e.message || e).slice(0, 100) + ') : contrôle d\'usage de la synthèse désactivé pour ce run.'); }
      // v6.62 — INTENTION D'ABORD, FORME ENSUITE. Le CT decrit des dispositifs de forme (mot cle agrandi, carte, plan de preuve, rythme, gestuelle...) mesures sur UNE video
      // d'origine. Aucun n'est reproduit parce que la source le porte : chacun est lu avec son intention psychologique, puis juge pour CE client (produit, marche, persona,
      // niveau de conscience). Le temps de PREUVE est refait avec les donnees REELLES de la synthese (copiees mot pour mot, verifiees par le code) : jamais invente.
      P._intent = null; P._intentTxt = '';
      try {
        const gIn = await vjson(`${LOCATION}-aiplatform.googleapis.com`, `/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-2.5-flash:generateContent`, {
          contents: [{ role: 'user', parts: [{ text: 'Tu es directeur de creation. Tu lis (1) un CT video : un mecanisme publicitaire mesure sur UNE video d\'origine, (2) la SYNTHESE du client (produit, marche, persona, niveau de conscience, offre, preuves reelles). '
            + 'Pour les dispositifs de FORME que le CT decrit (pas les repliques) : texte a l\'ecran (sous-titres, mot cle plus gros, chiffres, cartes), temps de preuve ou plan de coupe, rythme des coupes, gestuelle et energie de la personne, camera, son, lumiere, tu donnes : '
            + 'forme (ce que fait la source), intention (ce que le dispositif fait RESSENTIR ou COMPRENDRE au spectateur, et pourquoi la source l\'a mis la), pertinent (true si cette intention sert la video finale de CE client, avec CE produit, CE marche, CE persona, CE niveau de conscience ; false sinon), adaptation (comment porter la meme intention ici ; si non pertinent, par quoi la remplacer ou « rien »). '
            + 'Un dispositif n\'est jamais garde parce que la source le fait, seulement si son intention sert la video finale. Exemples de MANIERE de raisonner (jamais des contenus a recopier) : un mot cle ecrit plus gros fait lire l\'argument sans le son, utile quand l\'argument tient en un mot fort, inutile pour un ton pose et confidentiel ; une personne tres dynamique donne de l\'energie, hors de propos pour un produit de soin intime ou un public qui doute et veut de la douceur. Au plus 10 dispositifs, les plus structurants.\n'
            + 'preuve : present_dans_ct = true si la source a un temps de PREUVE TANGIBLE (page du site, avis clients, composition, labo, equipe, certification, chiffre), meme si le CT interdit de la DESSINER (l\'interdit vise la fabrication, pas la preuve reelle). Dans ce cas : quelle preuve ce client peut-il montrer REELLEMENT d\'apres la SYNTHESE ? type : avis | composition | garantie | autorite | chiffre | aucune. '
            + 'titre court dans la langue du marche. lignes : 2 a 5 lignes COPIEES MOT POUR MOT de la synthese (jamais reformulees ; aucun chiffre, note, nom ou citation absent de la synthese). note et nb (nombre d\'avis) uniquement si la synthese les donne, sinon null. Si la synthese ne contient rien de montrable : type aucune et lignes vide : mieux vaut pas de carte qu\'une carte inventee. position : fraction 0 a 1 de la video ou le CT place ce temps de preuve, ou null. '
            + 'emphase_agrandie_pertinente : true / false / null (null si le CT n\'ecrit aucun mot cle plus gros que les autres). '
            + 'sous_titres_defaut : "discret" si l\'intention du CT est l\'authenticite d\'un temoignage ou d\'un UGC (prise de telephone, confidence, preparation en direct) : sous-titres petits, casse de phrase, blancs, bas de cadre, rien qui s\'allume ; "dynamique" si l\'intention est l\'energie et le rythme (rafale, hook percutant, mots cles) ; null si on ne peut pas trancher. Sert seulement quand le CT ne decrit pas lui-meme ses sous-titres. '
            + 'carte_fin : "plein_cadre" si la fin du CT est une carte qui REMPLACE l\'image (carte de marque ou d\'offre pleine image, fond colore, produit seul) ; "texte_sur_plan" si la fin est un texte (tagline) pose sur le dernier plan ; null si le CT n\'en parle pas. '
            + 'sous_titres_registre : "percutant" | "doux" | "elegant" | null. SYMBIOSE : le style des sous-titres (police, graisse, mouvement) doit etre en accord avec toutes les autres variables de la video : style visuel du film, ton de la voix, persona, marche, categorie du produit, palette, energie du rythme. percutant = energie, rafale, discours direct ; doux = confidence, soin, intimite, temoignage calme ; elegant = premium, sobre, cinematographique.\n\nContexte marche : ' + JSON.stringify({ langue: P.bible && P.bible.langue, regle_niveau: P.bible && P.bible.regle_niveau }) + '\n\nCT :\n' + String(p.ct || '').slice(0, 45000) + '\n\nSYNTHESE :\n' + String(p.synthese || '').slice(0, 30000) }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 4000, thinkingConfig: { thinkingBudget: 0 }, responseMimeType: 'application/json', responseSchema: { type: 'OBJECT', properties: {
            dispositifs: { type: 'ARRAY', items: { type: 'OBJECT', properties: { famille: { type: 'STRING', enum: ['texte', 'preuve', 'rythme', 'geste', 'camera', 'son', 'lumiere', 'autre'] }, forme: { type: 'STRING' }, intention: { type: 'STRING' }, pertinent: { type: 'BOOLEAN' }, adaptation: { type: 'STRING' } }, required: ['famille', 'forme', 'intention', 'pertinent'] } },
            preuve: { type: 'OBJECT', properties: { present_dans_ct: { type: 'BOOLEAN' }, type: { type: 'STRING', enum: ['avis', 'composition', 'garantie', 'autorite', 'chiffre', 'aucune'] }, titre: { type: 'STRING' }, lignes: { type: 'ARRAY', items: { type: 'STRING' } }, note: { type: 'NUMBER', nullable: true }, nb: { type: 'INTEGER', nullable: true }, position: { type: 'NUMBER', nullable: true } }, required: ['present_dans_ct', 'type'] },
            emphase_agrandie_pertinente: { type: 'BOOLEAN', nullable: true }, sous_titres_defaut: { type: 'STRING', enum: ['discret', 'dynamique'], nullable: true }, carte_fin: { type: 'STRING', enum: ['plein_cadre', 'texte_sur_plan'], nullable: true }, sous_titres_registre: { type: 'STRING', enum: ['percutant', 'doux', 'elegant'], nullable: true } }, required: ['dispositifs'] } } });
        const it0 = JSON.parse(textOf(gIn));
        // Anti-invention : une ligne de preuve n'est gardee que si elle figure telle quelle dans la synthese ; note et nombre d'avis aussi.
        const nrm = x => String(x || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9%$€.,]+/g, ' ').replace(/\s+/g, ' ').trim();
        const synN = ' ' + nrm(p.synthese) + ' ';
        const pr = it0.preuve || { present_dans_ct: false, type: 'aucune' };
        pr.lignes = (pr.lignes || []).map(x => String(x || '').trim()).filter(x => x && synN.includes(nrm(x))).slice(0, 5);
        const numOk = v => v != null && synN.includes(nrm(String(v).replace('.', ',')).replace(/,0$/, '')) || (v != null && synN.includes(nrm(String(v))));
        if (!numOk(pr.note)) pr.note = null; if (!numOk(pr.nb)) pr.nb = null;
        if (!pr.lignes.length && pr.note == null) pr.type = 'aucune';
        it0.preuve = pr; P._intent = it0; save('00e_intentions_du_ct.json', it0);
        P._intentTxt = '\n=== DISPOSITIFS DU CT : INTENTION PUIS DECISION (calcule pour CE client ; il prime sur la lettre du CT) ===\n' + (it0.dispositifs || []).map(d => '- [' + d.famille + '] ' + String(d.forme || '').slice(0, 160) + ' -> intention : ' + String(d.intention || '').slice(0, 180) + ' => ' + (d.pertinent ? 'GARDER' : 'ECARTER') + (d.adaptation ? ' (' + String(d.adaptation).slice(0, 180) + ')' : '')).join('\n')
          + '\nRegle : tu ne reproduis jamais une forme parce que la source la porte ; tu sers son intention, ou tu la laisses de cote quand elle ne sert pas cette video.\n';
        log('Intentions du CT lues : ' + (it0.dispositifs || []).length + ' dispositifs (' + (it0.dispositifs || []).filter(d => d.pertinent).length + ' gardés) ; preuve : ' + (pr.present_dans_ct ? (pr.type === 'aucune' ? 'temps de preuve dans le CT mais aucune donnée réelle dans la synthèse → pas de carte' : pr.type + ' (' + pr.lignes.length + ' ligne(s) vérifiée(s))') : 'aucun temps de preuve') + '.');
      } catch (eIn) { P._intent = null; P._intentTxt = ''; log('Intentions du CT illisibles (' + String(eIn.message || eIn).slice(0, 80) + ') : règles par défaut.'); }
      // v6.34 — FICHE PRODUIT LUE SUR LA PHOTO. Jusqu'ici chaque agent redecrivait le produit avec ses propres mots
      // (« a nude pink stick with gold bands »), et le modele d'image suivait CES MOTS plutot que la photo : l'objet
      // dessine n'etait plus celui du client. La fiche est lue UNE FOIS sur la photo elle-meme, en anglais, et c'est
      // elle — avec la photo — qui fait autorite partout (planche, retouche, controle). Elle releve aussi le CONFLIT
      // DE MARQUE : quand le nom ecrit sur la photo n'est pas celui que la synthese veut afficher, aucun modele ne peut
      // « copier l'etiquette a l'identique » ; il invente, et le produit cesse de ressembler au sien.
      P._fiche = null;
      if (p.produit) {
        try {
          const fp = await vjson(`${LOCATION}-aiplatform.googleapis.com`, `/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-2.5-flash:generateContent`, { contents: [{ role: 'user', parts: [
            { text: 'Tu regardes la PHOTO d\'un produit reel. Decris-le pour qu\'un modele d\'image le redessine a l\'identique, SANS RIEN INVENTER : si un detail n\'est pas visible, tu ne l\'ecris pas. Le produit est le CONTENANT TEL QU\'IL EST VENDU (flacon, pot, tube, boite, bouteille, sachet). Tout ce qui est POSE a cote, devant ou autour sur la photo — gelules ou comprimes sortis, accessoires, fleurs, ingredients, ombre portee — est du DECOR DE PACKSHOT : il ne va JAMAIS dans description_en, il va dans elements_hors_contenant_en. Reponds UNIQUEMENT par un JSON {"description_en":"40 a 60 mots en ANGLAIS, SUR LE CONTENANT SEUL : forme et proportions du contenant, matiere et finition, couleur exacte du contenant, forme et couleur du bouchon ou du capuchon, ce que contient le capuchon (applicateur, eponge, pinceau) avec sa couleur, couleur de fond de l\'etiquette et sa place sur le contenant, taille du produit par rapport a une main. Aucune marque, aucun texte d\'etiquette dans ce champ.","elements_hors_contenant_en":"en ANGLAIS, 2 a 8 mots : ce qui est visible sur la photo EN DEHORS du contenant (ex. two loose capsules), ou chaine vide s\'il n\'y a rien","contenu_en":"en ANGLAIS, 1 a 4 mots : ce que le contenant renferme tel que vendu (capsules, cream, powder, liquid), ou chaine vide si invisible","marque_sur_photo":"le nom de marque ecrit en gros sur la photo, ou chaine vide","texte_etiquette":"les autres mots lisibles sur l etiquette, ou chaine vide","marque_a_afficher":"le nom de marque que la FICHE MARQUE ci-dessous demande d AFFICHER dans la publicite (pas celui ecrit sur la photo), ou chaine vide"}.\n\n=== FICHE MARQUE (extraite de la synthese) ===\n' + JSON.stringify({ produit: (P.bible && P.bible.palette_et_produit) || null, interdits: (P.bible && P.bible.interdits) || [] }) },
            { inlineData: { mimeType: p.produit.mime || 'image/png', data: p.produit.data } }] }], generationConfig: { temperature: 0, maxOutputTokens: 2048, thinkingConfig: { thinkingBudget: 0 }, responseMimeType: 'application/json' } });
          const jf = JSON.parse(textOf(fp));
          const marqueBible = String(jf.marque_a_afficher || '').trim();
          const norm2 = x => String(x || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          const conflit = !!(norm2(jf.marque_sur_photo) && norm2(marqueBible) && norm2(jf.marque_sur_photo) !== norm2(marqueBible));
          const horsC = String(jf.elements_hors_contenant_en || '').replace(/\s+/g, ' ').trim();
          // filet du code : une phrase de la description qui parle de ce qui est pose a cote du contenant en est retiree
          const descC = String(jf.description_en || '').replace(/\s+/g, ' ').trim().split(/(?<=[.!?])\s+/).filter(x => !/\b(?:visible (?:in front|next to|beside|around)|in front of the (?:bottle|jar|tube|box|container|pot)|next to the (?:bottle|jar|tube|box|container|pot)|beside the|lying|scattered|loose)\b/i.test(x)).join(' ');
          P._fiche = { description_en: descC, hors_contenant: horsC, contenu: String(jf.contenu_en || '').replace(/\s+/g, ' ').trim(), marque_photo: String(jf.marque_sur_photo || '').trim(), marque_a_afficher: marqueBible, conflit };
          save('00b_fiche_produit.json', P._fiche);
          log('Produit lu sur la photo : ' + P._fiche.description_en.slice(0, 150) + (P._fiche.description_en.length > 150 ? '…' : '') + (P._fiche.hors_contenant ? ' | posé à côté sur le packshot, hors scène : ' + P._fiche.hors_contenant : ''));
          if (conflit) log('⚠ CONFLIT DE MARQUE : la photo porte « ' + P._fiche.marque_photo + ' » et la synthese demande « ' + P._fiche.marque_a_afficher + ' ». Le produit sera dessine a l\'identique (forme, couleurs, bouchon, etiquette) mais SANS nom de marque lisible : aucun modele ne sait recopier une etiquette en changeant son nom, il redessine tout l\'objet. Le nom de la marque est porte par les sous-titres et la carte de fin.');
        } catch (eF) { log('Fiche produit illisible (' + String(eF.message || eF).slice(0, 80) + ') : la photo reste la seule reference.'); }
      }
      const BIBLE_TXT = (P.bible ? '\n=== BIBLE DE TRADUCTION (extraite de la synthèse ; elle prime sur tes réflexes génériques) ===\n' + JSON.stringify(P.bible) + '\nLANGUE : tout le texte PARLÉ et ÉCRIT de la vidéo — répliques, voix off, sous-titres, surimpressions, carte de fin — est dans la LANGUE DU MARCHÉ déclarée au champ `langue` de cette bible, et dans aucune autre. Les prompts envoyés aux générateurs d\'image et de vidéo restent en anglais, c\'est leur langue de travail ; seules les PAROLES et les TEXTES À L\'ÉCRAN suivent la langue du marché.\nRÈGLES D\'USAGE (contrôlées sur les prompts réellement envoyés) :\n- `interdits` : rien de ce qui y figure n\'apparaît, ni en scène, ni en parole, ni en objet, ni comme argument ;\n- chaque image de référence et chaque clip portent au moins un détail concret de `monde_visuel` (pour l\'angle choisi) ou de `monde_general`, et la palette/le produit de `palette_et_produit` : aucun décor générique de banque d\'images ;\n- chaque clip a au moins une réplique qui reprend une formule ou un vocabulaire de `formules` (ou la douleur dans les mots de la cible) ;\n- si `objection` existe et que le CT prévoit ce mécanisme, elle est dite puis démentie en image ;\n- `regle_niveau` est absolue (aucun prix ni offre si « interdits » ; offre exacte si « autorises ») et le dernier clip suit `cta_autorise` : verbe d\'action + nom du produit, sans lieu d\'achat (« sur notre site »), sans urgence (« maintenant », « aujourd\'hui », « vite ») ni argument interdit ;\n- chaque lieu de `lieux_ct` a son propre décor, son propre clip et sa propre image (4 décors maximum, UNE image de référence par clip) ; au-delà de 4 lieux tu fusionnes par raisonnement les moins importants et tu le consignes dans `adaptations_modele`.\n' : '') + (P._intentTxt || '');
      const FICHE_TXT = P._fiche ? '\n=== PRODUIT LU SUR LA PHOTO ===\n' + JSON.stringify({ contenant_vendu: P._fiche.description_en, contenu: P._fiche.contenu || null, pose_a_cote_sur_la_photo_hors_scene: P._fiche.hors_contenant || null }) + '\nLE PACKSHOT N\'EST PAS UNE SCÈNE : le produit à l\'image est le CONTENANT, fermé, posé ou tenu. ' + (P._fiche.hors_contenant ? 'Ce qui est posé à côté sur la photo (' + P._fiche.hors_contenant + ') est du décor de photographe : tu ne le mets ni sur une table, ni au sol, ni dans un décor, ni dans une main, ' : 'Tu n\'ajoutes aucun objet autour du contenant, ') + 'sauf dans UN clip dont l\'action est précisément de sortir une pièce du contenant — une seule, dans la main qui la prend, et jamais en tas ni en vrac. Le produit ne se montre pas ouvert ni vidé pour illustrer « le contenu » : ce qu\'il renferme se dit en voix, pas en objets éparpillés.\n' : '';
      const ANGLE_FINAL = p.angle || (P.bible && (P.bible.angles || [])[0] && P.bible.angles[0].angle) || null;
      if (ANGLE_FINAL) brief = brief.replace(/ANGLE: [^\n]*/, 'ANGLE: ' + ANGLE_FINAL + ' (IMPOSÉ PAR L\'ORCHESTRATEUR : tu ne choisis pas un autre angle ; écris-le tel quel dans META)');
      const TETE = '⚠️ LIS CECI EN PREMIER. ' + (ANGLE_FINAL ? 'ANGLE IMPOSÉ : « ' + ANGLE_FINAL + ' ». ' : '') + 'NIVEAU DE CONSCIENCE IMPOSÉ : ' + niveau + '. Ta sortie est envoyée telle quelle à la production : aucune relecture ni correction ne viendra après toi, elle doit donc être parfaite dès la première fois. Avant de répondre, applique en silence ta PORTE FINALE (§15), les LIMITES CHIFFRÉES et la BIBLE DE TRADUCTION qui suivent le CT et la synthèse.\nSi un SCRIPT IMPOSÉ figure plus bas, les répliques sont déjà écrites : tu les recopies mot pour mot et tu construis les scènes autour, tu n\'en écris aucune.\nQUATRE RÈGLES DURES, vérifiées sur ta sortie : (0) la première réplique du personnage personnifié dit en clair ce qu\'il est dans la vie réelle de la cible et ce qu\'il provoque, avec les mots de la cible : « c\'est moi » ou un simple nom ne suffit pas, le spectateur ne connaît ni le CT ni la synthèse ; (1) les 24 à 28 mots de chaque clip (la parole court de 0,4 s à 7,4 s) tiennent en UNE réplique, ou DEUX si le sens l\'exige — jamais trois — avec un SEUL point par réplique, celui de la fin, et un mot de liaison en tête de la seconde ; chaque réplique a son propre ton ; (2) CHAQUE CLIP a son décor et SON IMAGE à lui : un décor est l\'état de départ d\'un clip, pas une pièce, donc deux clips du même lieu avec des objets ou des poses différents ont deux images ; aucun lieu du CT oublié tant qu\'il reste un clip libre ; (3) tu écris la dernière réplique du dernier clip avec le verbe d\'action et le nom du produit exactement comme la bible l\'autorise.\n';
      const RAPPEL = '\n⚠️ TRANSPOSITION OBLIGATOIRE (§5bis) : avant d\'écrire, tu nommes pour chacun des 4 blocs CE QU\'IL DOIT PROUVER au spectateur, puis le GESTE RÉEL DE CE PRODUIT-LÀ qui le prouve. Le geste montré par le CT appartient au produit de la pub source : si ce produit-ci ne se verse pas, ne s\'applique pas ou ne se porte pas à l\'image, tu ne supprimes pas le bloc et tu ne te rabats pas sur un visage qui parle — tu prends le geste réel le plus proche qui prouve la même chose (préparation, dose, mise en place, rangement, trace laissée, résultat tenu en main) et tu écris l\'équivalence. Tu rends ce raisonnement dans `transposition`, une entrée par bloc, et les quatre gestes sont différents et progressent. Un `fit_score` faible ne se déclare que si la SYNTHÈSE ne contient pas la matière du CT, jamais parce que le geste est difficile.'
        + '\n⚠️ RAPPEL FINAL (non négociable) : angle ' + (ANGLE_FINAL ? '« ' + ANGLE_FINAL + ' »' : 'imposé') + ' ; niveau ' + niveau + ' ; 4 clips, une image de référence PROPRE à chaque clip (4 maximum ; un décor = un état de départ, pas une pièce) ; un personnage qui parle est visible dans son clip ; chaque réplique se comprend seule et reprend les mots de la cible ; dernière réplique = verbe d\'action + nom du produit' + (P.bible && P.bible.regle_niveau && P.bible.regle_niveau.prix_offre === 'interdits' ? ', sans prix, offre, urgence ni lieu d\'achat' : '') + ' ; aucun élément de `interdits` ; aucun son de fond ; chaque clip se suffit à lui-même ; 1 ou 2 plans par clip. Tu vérifies chaque point silencieusement avant d\'émettre ===META=== puis ===PLAN_VIDEO===.\n';
      // Un appel, un métier. Le scénariste n'écrit QUE les répliques : l'arc, les mots de la cible, l'appel à l'action.
      // Mélangé au reste (décors, images, prompts Veo), le copywriting se dilue toujours : c'est ce qu'on a vu run après run.
      let SCRIPT = '';
      try {
        const bb = P.bible || {};
        const SQUELETTE = (() => {   // on extrait du CT le squelette des blocs et les fonctions de réplique : c'est la colonne vertébrale du script
          const t = String(p.ct || ''); const out = [];
          [/##\s*\d*\.?\s*SQUELETTE[\s\S]*?(?=\n##\s|$)/i, /###\s*2bis[\s\S]*?(?=\n##\s|$)/i, /##\s*\d*\.?\s*VARIANTES[\s\S]*?(?=\n##\s|$)/i].forEach(rx => { const m = t.match(rx); if (m) out.push(m[0].trim()); });
          const j = out.join('\n\n');
          return j.length > 200 && j.length < 14000 ? j : '';
        })();
        const angleBible = (() => { const a = bb.angles || []; const t = norm(ANGLE_FINAL || ''); return a.find(x => t && (norm(x.angle || '').includes(t.slice(0, 25)) || t.includes(norm(x.angle || '').slice(0, 25)))) || a[0] || {}; })();
        const ask = 'Tu es le copywriter d\'une publicité vidéo de 32 secondes. Le copywriting est ce qui fait vendre : tout le reste en découle.\n\n'
          + 'MÉTHODE, dans cet ordre strict :\n'
          + '1. Tu écris D\'ABORD UN SEUL TEXTE CONTINU, de la première à la dernière phrase, comme si une personne le disait d\'une traite. Ce texte porte toutes les étapes du framework du CT. Il se lit sans aucune cassure : aucune phrase ne doit donner l\'impression d\'un début ou d\'une fin de morceau.\n'
          + '2. Tu découpes ENSUITE ce texte en 4 clips, en coupant aux respirations naturelles. Le découpage ne change pas un seul mot : mis bout à bout, les 4 clips redonnent exactement le texte.\n\n'
          + 'LA MATIÈRE VIENT DE LA SYNTHÈSE, PAS SA FORME. La synthèse est une base de données d\'où tu tires de quoi déclencher les bonnes émotions : tu traduis, tu ne récites pas. Un chiffre réel se dit en image du quotidien plutôt qu\'en fiche technique. Interdit en revanche : une promesse médicale (soigner, guérir, une maladie nommée), et un chiffre qui contredit les données de la synthèse.\n\n'
          + 'LES RÈGLES D\'ÉCRITURE, chacune corrige une faute déjà observée et refusée :\n'
          + '— CHAÎNAGE. Une phrase ne commence jamais à côté de la précédente : elle en reprend un mot ou son idée et porte la conjonction qui fait avancer l\'argument (l\'opposition qui pivote, le « et pour ça » qui amène la réponse, le « ça tombe bien » qui transforme l\'offre en chance). Un texte sans ces articulations est une juxtaposition : chaque phrase est peut-être juste, mais la personne ne voit pas où on l\'emmène, donc elle ne suit pas. Test : retire une phrase ; si rien ne casse, elle n\'était reliée à rien.\n'
          + '— AUCUN PROCÉDÉ ÉCRIT DANS UNE PAROLE. Interdits : les deux-points qui annoncent une fiche, l\'apposition qui colle des propriétés derrière le nom du produit, les énumérations, les phrases sans verbe. Ces formes existent pour l\'œil ; dans une bouche elles sonnent packshot, et c\'est exactement ce qui rend un texte robotique. Une propriété se dit avec un verbe et pour la personne qui écoute.\n'
          + '— LA CONCESSION AUTORISE À GARDER. Elle porte un vrai bénéfice que la personne reconnaît et aime, et elle lui donne la permission de garder ce qu\'elle aime. Une phrase qui lui retire quelque chose, qui lui dit qu\'elle ne tient pas ou qu\'elle se trompe, n\'est pas une concession : c\'est un reproche, et un reproche ferme l\'écoute.\n'
          + '— LES DOULEURS SE DISENT EN SENSATIONS éprouvées dans le corps ou dans la journée, pas en données ni en horaires. L\'heure ou le lieu servent d\'ancre, la sensation fait le déclic. Cherche aussi le défaut réel de l\'habitude, celui que la cible connaît sans l\'avoir formulé.\n'
          + '— LE CRITÈRE AVANT LE NOM, ET DIT EN ÉTAT RESSENTI. On fait accepter ce qu\'il faudrait, puis le produit arrive comme la réponse évidente. Le critère s\'énonce comme l\'état que la personne veut ressentir et répond mot pour mot à la douleur nommée juste avant. Un critère dit en vocabulaire de spécialiste (apport, dosage, formule, naturel, efficace) ne fait rien désirer : personne ne veut un apport, on veut l\'effet de l\'apport.\n'
          + '— AUCUN CHIFFRE NE SORT BRUT. Tout chiffre, teneur, pourcentage, dosage, quantité ou stock se dit converti en unité vécue de la journée (repas, matins, heures, mois, trajets) : une image qui se voit, se retient et se raconte à quelqu\'un d\'autre. Un chiffre que tu ne sais pas convertir, tu le supprimes : un chiffre retiré ne coûte rien, un chiffre brut coûte l\'attention. La règle s\'applique au mécanisme (la teneur devient ce qu\'elle remplace dans la journée) ET à l\'offre (la quantité livrée devient la durée de l\'état désiré, jamais un nombre de flacons ou de boîtes).\n'
          + '— L\'UNITÉ DE CONVERSION SE PREND DANS SA JOURNÉE, JAMAIS DANS LE PRODUIT : des moments, des gestes, des états (le repas qu\'elle saute, la réunion qu\'elle doit tenir, le matin qu\'elle enchaîne). Jamais une unité de contenant ou de prise — cuillerée, verre, dose, sachet, comprimé, gorgée, flacon — sauf si cette forme est littéralement écrite en S0 ou visible sur la photo produit. Une unité de contenant n\'est pas une image : c\'est une affirmation sur ce qu\'est le produit, donc tu inventes sa forme, son dosage et sa façon d\'être pris. Le client connaît son produit : c\'est la faute qu\'il voit en premier.\n'
          + '— UNE CONVERSION EST UN CALCUL, PAS UNE LICENCE POÉTIQUE : elle doit se rattacher à un chiffre présent dans la synthèse. Si le chiffre dont elle dépend est marqué non fourni, non lisible, non sourcé ou estimé (posologie, dosage, durée de cure, teneur), la conversion est interdite : tu dis la propriété sourcée simplement, ou tu remplaces le chiffre par le moment de sa journée que le produit couvre — un bénéfice vécu ne demande aucun chiffre. Une conversion inventée est plus dangereuse qu\'un chiffre brut, parce qu\'elle est crédible.\n'
          + '— L\'OFFRE, quand elle est permise, arrive comme une chance et se convertit en ce que la personne en retire.\n'
          + '— AUCUNE DÉFENSE : on ne répond jamais par la parole à une objection que le spectateur n\'a pas formulée (« ce n\'est pas une fausse pub », « crois-moi », « ce n\'est pas une promesse »). Une objection se lève par ce qu\'on MONTRE. Ces secondes-là servent à faire désirer.\n'
          + '— LA DERNIÈRE CHOSE ENTENDUE EST UN BÉNÉFICE, JAMAIS UN ORDRE SEUL. Le verbe d\'action est soudé dans la même phrase à ce que la personne y gagne ; il ne forme jamais une phrase à lui tout seul. Un impératif isolé à la fin, avec le nom du produit répété sans rien ajouter, est le signal le plus net d\'un texte écrit par une machine, et il remplace le désir par une sommation. L\'adresse directe à la personne (deuxième personne, son prénom si le CT l\'utilise) se tient jusqu\'à la dernière phrase : dès que le produit devient le sujet, tu parles tout seul.\n'
          + '— ÉCRIT POUR L\'OREILLE : tournures parlées, contractions, phrases courtes, une idée par phrase, jamais deux fois la même idée, aucun slogan, aucun mot abstrait là où un mot concret existe.\n'
          + '— UNE SEULE QUESTION OUVERTE, FERMÉE À LA FIN. La première phrase ouvre dans la tête de la personne une question à laquelle elle veut la réponse, et la dernière phrase répond à CETTE question-là, pas à une autre. Un texte qui n\'ouvre rien se regarde ; un texte qui ouvre une question se finit.\n'
          + '— ÉCHELLE DES ENJEUX : chaque bloc coûte plus cher que le précédent à celle qui écoute (on se reconnaît, puis on admet, puis on mesure ce que ça prend, puis on est soulagé). Si un bloc a la même température émotionnelle que le précédent, le texte est plat même si chaque phrase est juste.\n'
          + '— DIS CE QU\'ELLE SE DIT À ELLE-MÊME, pas ce qu\'on observe d\'elle. La phrase qui fait mouche est celle qu\'elle s\'est déjà dite en silence, jamais une description de sa situation vue de l\'extérieur.\n'
          + '— RYTHME : les phrases n\'ont pas la même longueur. Une longue, une brève, une moyenne. La phrase qui frappe est TOUJOURS la plus courte du bloc, et elle n\'est jamais la plus explicative. Des phrases de calibre identique produisent un débit de machine, même bien écrites.\n'
          + (MINI_RUN && MINI_INFO ? '— PLANS COURTS ET PARTITION (v6.53) : la vidéo change d\'image toutes les ' + MINI_INFO.plan.toFixed(1) + ' s et dure ' + MINI_INFO.D + ' s. Chaque phrase (5 à 8 mots) est UN plan, et elle dit une chose qu\'on VOIT : un signe dans le corps ou la nuit (« tes yeux cernés dans le miroir »), une scène avec un proche (« elle dort, toi tu comptes les heures »), un geste du rituel RÉEL de ce produit, un composant réel nommé avec ce qu\'il fait, le RÉSULTAT promis en train d\'arriver (« tu t\'endors avant la fin du film »), la vie reprise avec les siens, une preuve concrète (origine, contrôle). Ton texte DOIT contenir, dans l\'ordre du CT : au moins trois signes vécus, une conséquence sur la vie ou sur un proche, la bascule vers le produit, le mécanisme, le résultat promis montré en train d\'arriver, la vie reprise avec les proches, les preuves, l\'appel. Une phrase abstraite de catalogue (routine pensée, cadre, bien-être, solution, formule qui…) ou une pensée invisible (« ta tête est restée au bureau ») ne se filme pas : elle est interdite. Pas de remplissage : la longueur est fixée par la durée, pas par l\'envie d\'en dire plus.\n'
            + '— (v6.55) SNIPER, DIRECT, DOULOUREUX : la pub source frappe, la tienne doit frapper aussi. Tu NOMMES la douleur en mots crus et concrets (« tu fixes le plafond à 3 h », « tes yeux piquent au réveil »), jamais une allusion poétique (« la faille », « le murmure », « une lumière qui guette »). Interdit : toute image qu\'on ne peut pas filmer. Les premiers vers FONT MAL (peur, honte, fatigue visible), la bascule soulage, la fin fait désirer.\n'
            + '— (v6.55) LE TEXTE FINIT PAR VENDRE : les 3 ou 4 derniers vers sont dans l\'ordre : le résultat vécu ; l\'offre ou la garantie de la synthèse dite en gain concret (ce que ça évite ou donne), SI la synthèse en fournit ; puis l\'ordre soudé à son bénéfice (« commande Vitalina Energy et retrouve tes matins »). Le spectateur doit comprendre : « je clique, je commande ». Le refrain est cet appel et ne dépasse pas 2 passages.\n'
            + '— (v6.55) CHAQUE BÉNÉFICE SE DIT PAR LA SCÈNE QUI LE PROUVE : « tu deviens plus concentré » appelle l\'image de quelqu\'un absorbé par son travail ; « plus d\'énergie » celle de quelqu\'un qui mène une réunion avec élan. Tu écris le vers en pensant à cette scène visible de la vraie journée de la cible, jamais à un symbole.\n'
            + '— (v6.55) UN VERS = UN GESTE FILMABLE qui lui correspond MOT À MOT (on avale, on regarde, on ferme les yeux, on ouvre la porte). Pas de vers qui n\'illustre rien.\n' : '')
          + '— LA DERNIÈRE PHRASE DOIT POUVOIR ÊTRE RÉPÉTÉE par quelqu\'un qui n\'a vu la vidéo qu\'une fois, le soir, à une amie. Si elle a besoin du reste du texte pour avoir un sens, ou si elle contient plus d\'une idée, elle ne sera pas retenue.\n'
          + '— LES INTERDITS NE SONT PAS UN OBJECTIF : les règles du niveau, de la plateforme et des allégations sont des bords de route, pas la destination. Un texte écrit pour ne rien enfreindre devient fade, et un texte fade ne vend pas, donc il échoue aussi. Tu écris pour l\'effet sur la personne qui écoute, puis tu vérifies les bords.\n\n'
          + 'ZONE DU CTA : le niveau de conscience gouverne le CORPS du texte, pas l\'appel à l\'action. Le corps respecte la règle du niveau (en Solution Aware : ni prix ni offre dans le corps). Le CTA, lui, a le droit de rassurer, de créer l\'urgence, de promettre ou de porter la promo, et il se termine par le verbe d\'action et le nom du produit.\n\n'
          + 'LA STRUCTURE NE S\'INVENTE PAS : elle est écrite dans le CT ci-dessous, avec la FONCTION de chaque réplique. Tu remplis ces fonctions dans l\'ordre, sans en déplacer ni en ajouter.\n'
          + (SQUELETTE ? 'SQUELETTE EXACT À REMPLIR, extrait du CT :\n' + SQUELETTE + '\n' : '')
          + (CHANSON_RUN ? '\nCHANSON : ce texte est CHANTÉ, pas dit. Tu écris des PAROLES : vers courts de 4 à 9 mots, un refrain simple qui revient (la raison de visiter la page produit y est chantée), rimes ou assonances naturelles dans la langue du marché, une idée par vers, des mots que la cible dit vraiment. Aucune phrase longue qui ne se chante pas. Les paroles portent le même arc émotionnel que le CT, et le dernier bloc chante l\'appel à l\'action. Chaque réplique est un ou deux vers.\n' : '') + (VOIX_OFF_RUN ? '\nLONGUEUR (VOIX OFF) : 84 à 100 mots au total pour le TEXTE CONTINU. Une voix off dit environ 2,8 mots par seconde et chaque clip dure 8 secondes : un bloc doit donc tenir en moins de 8 s, soit 20 à 26 mots. Personne ne parle à l\'écran ; le texte est dit d\'un trait par le narrateur. C\'est le CODE qui le coupe ensuite en 4 blocs. Ton champ `clips` porte l\'intention, le ton du narrateur (anglais) et, pour chaque réplique, le `geste` : ce que l\'IMAGE montre pendant ces mots — une action ou un changement filmable (un corps qui bouge, un état qui change, un objet qui apparaît), jamais une pose. Ce qu\'on voit illustre exactement ce qu\'on entend à cet instant.\n' : '\nLONGUEUR : 100 à 110 mots au total pour le TEXTE CONTINU, ni plus ni moins. C\'est le CODE qui le coupe ensuite en 4 clips de 24 à 28 mots, et la coupe peut tomber au MILIEU d\'une phrase : une phrase commencée dans un clip se termine dans le suivant, c\'est voulu, c\'est ce qui donne la continuité. Ton champ `clips` ne porte donc que l\'intention, le ton et le geste de chaque bloc — ce qui sera DIT, c\'est ton texte continu, mot pour mot. Un seul point par phrase enchaînée, la parole court de 0,4 s à 7,4 s dans chaque clip.\n')
          + 'Chaque réplique porte un `ton` en anglais (l\'émotion de diction, cohérente avec le sens).\n'
          + '\n⚠️ UNE PAROLE EMPRUNTÉE SE DIT ATTRIBUÉE, PUIS ON REVIENT À SA PROPRE VOIX. Quand le texte rapporte les mots de quelqu\'un d\'autre (un commentaire, une remarque, une question, la phrase qu\'elle se dit), la phrase qui précède NOMME d\'où vient cette parole, à l\'oral, avant la citation — jamais une citation nue : sans cette annonce, la personne qui parle a l\'air de se plaindre elle-même et tout le sens s\'inverse. Après la citation, la voix change de camp : une phrase à soi, dans une autre attitude (elle répond, elle relativise, elle retourne l\'argument). La source annoncée ne ment pas : si la synthèse ne contient AUCUN verbatim réel, tu ne prétends pas qu\'un client ou une cliente l\'a dit ; tu attribues la phrase à la pensée de celle qui écoute (« tu te dis peut-être », « la question qu\'on se pose ») ou à ce qu\'on lit/entend partout. Chaque réplique porte aussi `voix` : « propre » (ses mots à elle) ou « cite » (les mots d\'un autre) ; une réplique « cite » est dite sur un registre différent de ses répliques « propre » (lue, distancée, sans l\'émotion de la locutrice), et la suivante est « propre ».\n'
          + '\n⚠️ UN FAIT N\'EST UN ARGUMENT QUE S\'IL EST BON POUR ELLE. Chaque fait que tu utilises (un prix, une date, une hausse annoncée, un contenu d\'offre, une rareté) se dit AVEC ce qu\'il change pour la personne qui écoute, dans la même phrase, en mots concrets : ce qu\'elle garde, ce qu\'elle évite, ce qu\'elle perd si elle attend. Une phrase qui commente un fait sans dire ce qu\'il lui apporte (« c\'est rare », « c\'est une chance », « ils l\'ont annoncé ») est vide, et si elle contredit l\'intérêt de celle qui écoute (une hausse de prix présentée comme une bonne nouvelle) elle est absurde. Test sur chaque phrase : « et donc, pour moi qui écoute ? » — si la réponse n\'est pas déjà dans la phrase, tu la réécris. Une urgence réelle se dit comme une perte ou un gain datés et chiffrés : ce qu\'elle paie si elle agit avant, ce qui change après.\n'
          + '\n⚠️ UN MÉCANISME SE DIT EN EFFET RESSENTI, PAS EN NOM DE FICHE. Un nom d\'ingrédient, de technologie ou de caractéristique (« formule », « libération prolongée », « actifs », « complexe », un dosage) n\'est jamais dit seul : dans la MÊME phrase, tu dis ce que la personne ressent à cause de lui, avec ses mots à elle et dans l\'ordre où elle le vit (ce qui se passe quand elle le prend, puis ce qui change dans sa soirée ou sa journée). Si l\'effet ne peut pas se dire simplement, tu ne nommes pas le mécanisme : un bénéfice vécu se suffit. Test : une personne qui n\'a jamais lu l\'étiquette comprend-elle, en une seule écoute, EN QUOI cela l\'aide ?\n'
          + ((bb.offre_decodee || []).length ? '\n⚠️ L\'OFFRE EST UNE MATIÈRE PREMIÈRE, PAS UN PRIX AFFICHÉ. La synthèse permet ici de dire l\'offre en gains vécus : ' + JSON.stringify(bb.offre_decodee) + '\n→ Quand le texte porte l\'offre (corps d\'un niveau qui l\'autorise, ou zone du CTA), tu en prends au moins DEUX éléments et tu les dis en gain vécu (le prix ramené à son usage, ce que le lot fait garder, le temps que ça couvre, la date et ce qu\'elle fait perdre), jamais un chiffre nu ni un simple « pour 20 000 francs ». Seuls les chiffres de cette liste sont permis.\n' : '')
          + 'TEST AVANT DE RENDRE : lis le texte complet à voix haute. Si une personne du marché ne peut pas redire avec ses mots QUI parle, CE QUE ça lui coûte, CE QU\'IL LUI FAUT, et CE QU\'ELLE DOIT FAIRE — ou si une phrase sonne écrite plutôt que dite — tu réécris. Trois contrôles supplémentaires, ligne par ligne : chaque phrase s\'accroche-t-elle à la précédente ? chaque chiffre est-il converti en quelque chose qui se vit ? la toute dernière phrase laisse-t-elle un bénéfice dans l\'oreille plutôt qu\'un ordre ? Une seule réponse non, tu réécris.\n'
          + '\n⚠️ LE HOOK EST UN FRAMEWORK, PAS UNE PHRASE D\'INTRODUCTION. La première réplique n\'annonce pas ce qui va se passer (« on va voir ce qui te fatigue » n\'accroche personne : c\'est un sommaire). Elle produit un ARRÊT. Tu choisis UN framework dans cette liste, celui que le moteur de l\'angle rend le plus fort, et tu déclares lequel dans `hook_framework` :\n1. CONSTAT FROID — une vérité brute sur sa situation, dite sans pitié et sans question.\n2. ACCUSATION DOUCE — tu nommes ce que la cible FAIT elle-même et qui la sabote.\n3. CONTRADICTION — tu déclares faux ce qu\'elle croit vrai, tout de suite.\n4. MISE EN GARDE — tu la préviens contre quelque chose qu\'elle s\'apprête à faire ou à croire.\n5. AVEU — tu confesses quelque chose qu\'on n\'avoue pas en public, à la première personne.\n6. VERBATIM — tu mets dans sa bouche la phrase exacte qu\'elle pense déjà, entre guillemets.\n7. ANNONCE À CONTRE-EMPLOI — tu annonces un acte qui va contre l\'intérêt apparent de celui qui parle (je renvoie, j\'arrête, je ne recommande pas).\n8. CHIFFRE NU — un chiffre de la synthèse, seul, sans emballage.\nLe hook est COMPRIS EN UNE SEULE LECTURE, sans inférence, et il tient dans la première réplique du clip 1. Le hook d\'un CT qui en impose un (son §4) prime sur cette liste : tu l\'appliques, et tu déclares lequel des huit il incarne.\n'
          + '\n⚠️ RÈGLE D\'ÉLOCUTION — ON NOMME, ON NE DÉSIGNE PAS. C\'est la faute qui détruit le plus de vidéos : à force d\'allusions, plus rien n\'est compréhensible et le spectateur doit fournir un effort mental pour suivre. Il ne le fournira pas, il scrollera.\n→ Tout sujet dont on parle est NOMMÉ par son nom commun, au moins une fois, dans la réplique où il apparaît pour la première fois : « le café que tu bois », « les boissons sucrées », « tes nuits trop courtes » — jamais « ça », « ce truc », « ils », « leur affaire », « quant à ça ».\n→ EXEMPLE DE LA FAUTE : écrire « ils sont le problème » au lieu de « ce que tu bois toute la journée est le problème ». La première version ne veut rien dire pour quelqu\'un qui découvre la vidéo ; la seconde tombe juste.\n→ Un démonstratif (ça, ce, cette, celui-là, ils, les) n\'est autorisé que si le nom auquel il renvoie a été PRONONCÉ dans la MÊME réplique ou dans la réplique immédiatement précédente du MÊME clip. Jamais en s\'appuyant sur l\'image : le spectateur entend avant de regarder.\n→ Aucune réplique ne commence par un démonstratif ou un pronom dont le référent n\'a pas encore été nommé dans la vidéo.\n→ TEST : fais lire chaque réplique isolément à quelqu\'un qui n\'a rien vu. S\'il doit demander « de quoi tu parles », réécris.\n'
          + '\n⚠️ LA FIN N\'EST PAS UN ORDRE, C\'EST UN POINT DE CHUTE. « Commande Vitalina Energy » après trois phrases d\'arguments est le pire des dénouements : rien ne donne au spectateur de RAISON d\'agir maintenant, et toute l\'attention construite retombe d\'un coup.\nLa dernière réplique porte le verbe d\'action et le nom du produit, mais la réplique qui la PRÉCÈDE doit lui donner sa poussée, et c\'est OBLIGATOIRE. Elle contient au moins l\'un de ces trois éléments, pris dans la synthèse, jamais inventé :\n   • LA TRANSFORMATION — la vie de la cible une fois le problème réglé, dite en une image concrète de sa journée.\n   • L\'ATOUT COMMERCIAL — l\'offre, la promo, le cadeau, la quantité, l\'urgence réelle que la marque propose (si le niveau de conscience l\'autorise).\n   • LA RÉASSURANCE — la garantie, le retour, le paiement à la livraison, ce qui enlève le risque.\nSi la synthèse n\'en fournit aucun, c\'est la TRANSFORMATION qui est écrite : elle ne coûte rien et elle existe toujours.\nEt la chute doit ARRIVER, pas tomber : la dernière phrase du clip 3 ouvre déjà la dernière du clip 4. On ne passe jamais d\'un argument à un ordre sans une phrase qui fait le pont.\n'
          + '\n⚠️ CHAQUE RÉPLIQUE A SON GESTE, ET LE GESTE PORTE L\'INTENTION. Une vidéo où quelqu\'un parle en restant immobile n\'est pas une publicité, c\'est un témoignage. Le visuel doit produire la même émotion que les mots, au même instant — c\'est de là que vient la force des pubs source.\nPour chaque réplique tu écris un champ `geste` : une action physique courte, filmable, qui traduit le sens de CETTE phrase. Elle se choisit par son effet, jamais par décoration :\n   • PRENDRE EN MAIN / PRÉSENTER — ce dont je parle existe, le voilà, regarde-le. À faire dès qu\'une réplique nomme un objet présent.\n   • ÉCARTER / REPOUSSER / REPOSER SÈCHEMENT — ce dont je parle ne vaut rien, je m\'en sépare. C\'est ce geste qui grave le verdict.\n   • RAPPROCHER / TENIR CONTRE SOI — ceci m\'appartient, ceci me protège.\n   • OUVRIR / DÉCOUVRIR — je te montre ce qui était caché.\n   • S\'ARRÊTER NET — ce que je viens de dire pèse, je laisse le silence travailler.\nUn objet cité dans une réplique et présent dans la scène est TENU pendant qu\'on en parle, puis traité selon le verdict (reposé, écarté, gardé). Nommer un objet sans le toucher alors qu\'il est à portée de main est une occasion perdue à chaque fois.\n'
          + '\n⚠️ DES MOTS QU\'ELLE DIT, PAS DES MOTS QU\'ON ÉCRIT. Une phrase qu\'il faut relire pour comprendre est une phrase perdue : le spectateur n\'a pas trois secondes à donner. Interdits : les groupes de mots inventés pour faire savant (« un apport nutritif de fond », « un soutien structurel », « une réponse ciblée ») ; les tournures de notice (« en cas de », « il convient de », « permet de ») ; les expressions qui demandent d\'être décodées (« prendre des formes », « répondre de ses actes », « baisser la garde ») quand une phrase simple dit la même chose ; et tout terme technique que la cible n\'emploie pas elle-même.\nTEST, sur chaque phrase : est-ce qu\'elle la dirait, telle quelle, à une amie, dans sa cuisine, sans se relire ? Si non, réécris avec les mots qu\'elle emploie vraiment — ceux de la synthèse, pris dans son vocabulaire, pas dans le tien.\n'
          + '\n⚠️ LE FLUX — ON NE HACHE PAS. Veo marque un SILENCE à chaque point. Une vidéo écrite en phrases courtes empilées devient une suite de blocs séparés par des trous, et c\'est exactement ce qui fait qu\'une vidéo sonne robotique.\n→ UN SEUL POINT PAR RÉPLIQUE, celui de la fin. À l\'intérieur, tu enchaînes avec une virgule ou un mot de liaison (et, mais, parce que, alors, donc, pourtant, sauf que). Deux phrases dans une réplique, c\'est une réplique coupée en deux.\n→ UNE réplique par clip quand le clip porte une seule idée ; DEUX seulement quand le sens l\'exige. Jamais trois.\n→ Quand il y en a deux, la seconde COMMENCE par un mot de liaison : la voix ne retombe pas, elle continue.\n→ Ni point d\'interrogation ni point d\'exclamation : Veo les prononce.\n'
          + '\n⚠️ LE MOTEUR ÉMOTIONNEL — UNE SEULE ÉMOTION TRAVERSE LA VIDÉO. Un texte « correct » qui ne fait rien ressentir ne vend rien. Avant d\'écrire, tu nommes en silence le MOTEUR DOMINANT de l\'angle imposé : la peur (ce qui arrive si rien ne change), la douleur (ce qu\'elle vit déjà) ou le désir (la vie qu\'elle veut). Toutes tes phrases servent CE moteur-là ; une phrase qui sert un autre moteur dilue la vidéo et se retire.\nLe DOSAGE suit le niveau de conscience imposé :\n   • Solution Aware → environ 60 % du poids sur la peur et la douleur, concentrés sur les deux premiers clips ; 40 % sur le désir.\n   • Product Aware → équilibre, la peur partagée avec la preuve concrète et la différence du produit.\n   • Most Aware → environ 60 % sur le désir et l\'offre, portés par les deux derniers clips ; la douleur en rappel bref.\nEt le dosage se tient dans les MOTS : des choses qu\'on voit, qu\'on touche, qu\'on entend dans sa journée à elle — une heure précise, un geste, une phrase qu\'on lui a dite, un objet qu\'elle a dans la main. Jamais un mot abstrait (énergie, vitalité, bien-être, performance) là où une image concrète est possible : l\'abstrait ne provoque aucune émotion, il ne fait qu\'informer.\n'
          + (sigCT.hook ? '\n⚠️ HOOK IMPOSÉ PAR LE CT : le framework de hook de cette vidéo est « ' + sigCT.hook + ' ». Tu l\'appliques, tu ne choisis pas : c\'est lui qui fait la singularité de ce CT. Tu le recopies dans hook_framework.\n' : '')
          + (sigCT.chute ? '⚠️ POINT DE CHUTE PRÉFÉRÉ PAR LE CT : « ' + sigCT.chute + ' ». Tu l\'emploies si la synthèse le permet ; sinon tu choisis parmi les deux autres et tu dis pourquoi dans point_de_chute.\n' : '')
          + (sigCT.gestes ? '⚠️ GESTES SIGNATURE DU CT, à répartir sur les répliques dans le champ geste : ' + sigCT.gestes + '\nCes gestes ne sont pas décoratifs : ils sont le mécanisme visuel de CE CT. Une réplique qui parle d\'un objet présent sans que la main le traite est une occasion perdue.\n' : '')
          + (VOIX_OFF_RUN ? '\n⚠️ L\'ÉMOTION SE VOIT, ELLE NE SE DIT PAS. Pour chaque réplique, le champ `emotion` décrit en anglais, en 4 à 8 mots, ce que la personne À L\'ÉCRAN ressent à cet instant (celle que la cible reconnaît comme elle-même) et comment son visage, son regard, son souffle et ses mains le montrent. Les émotions forment UNE COURBE d\'un clip à l\'autre (du ressenti de départ de la cible vers son ressenti d\'arrivée), jamais la même d\'un bout à l\'autre ; un mot de ton neutre (déclaratif, informatif) n\'est pas une émotion. Chaque `geste` est une action qui change l\'image, pas une pose.\n' : '')
          + 'Réponds UNIQUEMENT par un JSON {"hook_framework":"le nom du framework de hook utilisé, parmi les huit","point_de_chute":"transformation|atout commercial|reassurance, et la phrase de la synthese qui l autorise","avantage_deloyal":"ce que CE produit ou CETTE offre a et que les autres de ce marche n ont pas, avec la section de la synthese qui l etablit","texte_global":"le texte continu, d un trait","clips":[{"bloc":1,"intention":"ce que CE clip doit faire ressentir ou comprendre, en une phrase","repliques":[{"texte":"…","voix":"propre|cite","ton":"…","geste":"l action physique qui porte cette phrase","emotion":"ENGLISH, 4 to 8 words: what the on-screen person FEELS at this instant and how her face, gaze, breath and hands show it"}]}]}.\n\n'
          + 'ANGLE IMPOSÉ : ' + (ANGLE_FINAL || '(voir synthèse)') + '\nNIVEAU DE CONSCIENCE : ' + niveau
          + '\nAPPEL À L\'ACTION AUTORISÉ : ' + (bb.cta_autorise || '(verbe d\'action + nom du produit)')
          + '\nINTERDITS (rien de cette liste ne se dit ni ne se montre, sous aucune formulation) : ' + JSON.stringify(bb.interdits || [])
          + ((bb.banalites_du_marche || []).length ? '\n⚠️ BANALITÉS DE CE MARCHÉ (ce que TOUS les vendeurs offrent déjà ici) : ' + JSON.stringify(bb.banalites_du_marche) + '\n→ Une banalité n\'est pas un argument : elle ne peut être ni ton hook, ni la raison qui fait basculer, ni ton point de chute, et elle ne se répète jamais. Ce qui décide est ce que ce produit est SEUL à avoir. Tu le déterres dans la synthèse (ce qu\'il contient, ce qu\'il remplace, ce qu\'il évite, ce que l\'offre ajoute, la façon dont il s\'utilise) et tu l\'écris dans `avantage_deloyal` : tout produit en a un, et c\'est lui qui porte la vidéo.' : '')
          + '\nRÈGLE DU NIVEAU (corps du texte) : ' + JSON.stringify(bb.regle_niveau || {})
          + '\nMOTS ET TOURNURES DE LA CIBLE : ' + JSON.stringify(angleBible.formules || []) + '\nOBJECTION (à lever en image, jamais en paroles) : ' + JSON.stringify(angleBible.objection || null)
          + BOUSSOLE_TXT + (P.boussole ? 'Pour toi, copywriter : le TON, le RYTHME des phrases et les MOTS suivent cette destination (des mots doux et lents pour l\'apaisement, des mots qui claquent pour l\'élan), et le miroir du persona doit s\'entendre dans le texte.\n' : '')
          + '\n\n=== CT_VIDEO (la mécanique à respecter) ===\n' + p.ct + '\n\n=== SYNTHESE (ta matière première) ===\n' + p.synthese;
        // v6.6 — le copywriter est l'appel le plus important de la chaîne (§6bis) : quand il échoue, le réalisateur
        // écrit les répliques lui-même et toutes les règles d'écriture sautent. Il échouait parce que son budget de
        // réflexion (8192) dépassait son budget de réponse (8000) : en Gemini 2.5 la réflexion se prend SUR la réponse,
        // donc le JSON était coupé en plein milieu. Budget de réponse porté à 24000, réflexion inchangée (ratio ~3:1,
        // comme le réalisateur), plus une réparation des défauts de forme et une seule relance en cas de JSON invalide.
        const nettoieJSON = t => String(t || '').replace(/^\uFEFF/, '').trim()
          .replace(/^```(?:json)?\s*/i, '').replace(/```$/, '')
          .replace(/,\s*([}\]])/g, '$1')      // virgule en trop avant } ou ]
          .trim();
        const demander = async (txtAsk, essai) => {
          const g = await vjson(HOSTP, PRO, { contents: [{ role: 'user', parts: [{ text: adaptNC(txtAsk) }] }], generationConfig: { temperature: 0.7, maxOutputTokens: 24000, thinkingConfig: { thinkingBudget: 8192 }, responseMimeType: 'application/json' } });
          const f = fin(g), brut = textOf(g);
          try { return JSON.parse(nettoieJSON(brut)); }
          catch (e) {
            try { save('01b_script_brut_essai' + (essai || 1) + '.txt', brut); } catch (_) {}
            const coupe = f.finishReason && f.finishReason !== 'STOP';
            throw Object.assign(new Error((coupe ? 'réponse coupée (' + f.finishReason + ')' : 'JSON invalide') + ' : ' + String(e.message || e).slice(0, 70)), { reparable: true });
          }
        };
        let sj;
        try { sj = await demander(ask, 1); }
        catch (e1) {
          if (!e1.reparable) throw e1;
          log('Copywriter : ' + String(e1.message).slice(0, 90) + ' — une seule relance, en exigeant un JSON complet.');
          sj = await demander(ask + '\n\n⚠️ TA RÉPONSE PRÉCÉDENTE N\'ÉTAIT PAS UN JSON VALIDE (' + String(e1.message).slice(0, 60) + '). Réponds UNIQUEMENT par l\'objet JSON demandé, complet, fermé par toutes ses accolades, sans texte avant ni après, sans bloc de code, sans commentaire et sans virgule en trop. Si tu manques de place, raccourcis les textes, jamais la structure.', 2);
          log('Copywriting obtenu à la relance.');
        }
        // ---- CONTRÔLE DE FORME DU PRODUIT, fait par le code : une forme galénique ou un contenant que la synthèse ne nomme pas est une invention
        // sur le produit du client. Le contrôle est gratuit et se fait avant toute image : une seule relance, puis on continue.
        const formesInventees = txt => {
          const n = norm(String(txt || '')), ns = norm(String(p.synthese || ''));
          const mots = ['cuiller', 'cuillere', 'verre', 'gorgee', 'sachet', 'dose', 'dosette', 'comprime', 'gelule', 'capsule', 'flacon', 'bouteille', 'ampoule', 'stick', 'poudre', 'sirop', 'gouttes', 'infusion', 'tisane', 'shot', 'pilule', 'tube', 'pot', 'pipette', 'spray', 'creme', 'gel', 'tasse', 'bol', 'canette'];
          return mots.filter(m => n.includes(m) && !ns.includes(m));
        };
        const txtDe = o => String((o || {}).texte_global || '') + ' ' + ((o || {}).clips || []).map(c2 => (c2.repliques || []).map(r => r.texte).join(' ')).join(' ');
        const inv1 = formesInventees(txtDe(sj));
        if (inv1.length) {
          log('Forme du produit inventée dans le copywriting (' + inv1.join(', ') + ') : absente de la synthèse, le copywriter est relancé une fois.');
          try {
            const sj2 = await demander(ask + '\n\n⚠️ TA PREMIÈRE VERSION A ÉTÉ REFUSÉE. Elle nomme une forme ou un contenant du produit que la synthèse ne mentionne nulle part : ' + JSON.stringify(inv1) + '. Tu as donc inventé la forme du produit, son dosage ou sa façon d\'être pris, et le client le verra immédiatement. Réécris le texte : la forme physique du produit ne se dit que si la synthèse l\'écrit, et une conversion se prend dans la journée de la cible (un moment, un geste, un état), jamais dans un contenant. Si tu n\'as pas de conversion légitime, remplace le chiffre par le moment de sa journée que le produit couvre.');
            const inv2 = formesInventees(txtDe(sj2));
            if (!inv2.length) { sj = sj2; log('Copywriting réécrit sans forme inventée.'); }
            else { log('La relance nomme encore ' + inv2.join(', ') + ' : la première version est conservée (aucune boucle).'); }
          } catch (e2) { log('Relance du copywriter impossible (' + String(e2.message || e2).slice(0, 60) + ') : première version conservée.'); }
        }
        // ---- v6.14 — PORTE DU COPYWRITING. Le hook, le point de chute et les gestes ne sont pas des ornements :
        // sans eux la vidéo devient une suite d'arguments qui finit par un ordre. Un seul rappel, puis on continue.
        const manquePorte = o => {
          const m = [];
          if (!String((o || {}).hook_framework || '').trim()) m.push('le framework de hook n\'est pas déclaré (hook_framework)');
          if (!String((o || {}).point_de_chute || '').trim()) m.push('le point de chute du CTA n\'est pas déclaré (point_de_chute : transformation, atout commercial ou réassurance, avec la phrase de la synthèse qui l\'autorise)');
          const cl = (o || {}).clips || [];
          const sansGeste = cl.flatMap(c2 => (c2.repliques || []).filter(r => !String((r || {}).geste || '').trim())).length;
          if (sansGeste) m.push(sansGeste + ' réplique(s) sans `geste` : chaque phrase doit être portée par une action physique filmable');
          const sansInt = cl.filter(c2 => !String(c2.intention || '').trim()).length;
          if (sansInt) m.push(sansInt + ' clip(s) sans `intention`');
          const dernier = cl.slice().sort((a, b) => (Number(a.bloc) || 0) - (Number(b.bloc) || 0)).pop();
          {   // v6.43 — UNE CITATION NUE INVERSE LE SENS : mesure, une locutrice lisait un commentaire sans annonce et semblait se plaindre elle-meme.
            const tg = String((o || {}).texte_global || '').trim();
            const iq = tg.search(/[«“"]/);
            if (iq === 0) m.push('le texte s\'ouvre directement sur une citation : la phrase qui la PRÉCÈDE doit dire à l\'oral d\'où vient cette parole (un commentaire, une remarque, ce qu\'on se dit), puis la voix change de camp après la citation');
            else if (iq > 0 && tg.slice(0, iq).trim().split(/\s+/).filter(Boolean).length < 3) m.push('une citation n\'est pas annoncée : il faut au moins une courte phrase parlée avant les guillemets qui dit qui s\'exprime');
            else if (iq > 0 && tg.slice(iq).replace(/^[«“"][^»”"]*[»”"]?\s*/, '').trim().split(/\s+/).filter(Boolean).length < 8) m.push('le texte finit presque sur la citation : après elle, la locutrice reprend sa propre voix et répond (au moins une phrase à elle)');
          }
          if (!VOIX_OFF_RUN && dernier && (dernier.repliques || []).length < 2) m.push('le dernier clip n\'a qu\'une réplique : il ne peut pas à la fois donner la raison d\'agir et l\'appel à l\'action');
          // v6.37 — INTERDITS, BANALITES DU MARCHE, AVANTAGE DELOYAL : verifies sur le TEXTE lui-meme. L'interdit etait
          // juge par un modele parmi quinze autres criteres, et il passait : un texte a dit trois fois le paiement a la
          // livraison, que la bible interdisait, et en a fait la raison qui decide — or c'est la pratique standard du
          // marche, donc un argument que tous les vendeurs offrent deja. Un argument que tout le monde a n'en est pas un.
          {
            const plat2 = x => norm(String(x || '')).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
            const cls = ((o || {}).clips || []).slice().sort((a2, b2) => (Number(a2.bloc) || 0) - (Number(b2.bloc) || 0));
            const txtC = c2 => plat2(((c2 || {}).repliques || []).map(r => r && r.texte).join(' '));
            const txtG = plat2((o || {}).texte_global || cls.map(txtC).join(' '));
            const prem = txtC(cls[0]), der = txtC(cls[cls.length - 1]);
            const expr = x => plat2(x).split(' ').filter(Boolean);
            const touches = (bb.interdits_mots || []).filter(x => { const w = expr(x); return w.length >= 2 && w.length <= 8 && txtG.includes(w.join(' ')); }).slice(0, 4);
            if (touches.length) m.push('le texte dit ce que la synthèse INTERDIT : « ' + touches.join(' », « ') + ' » — à retirer entièrement, ce n\'est pas une reformulation à trouver');
            const ban = (bb.banalites_du_marche || []).filter(x => { const w = expr(x).slice(0, 4).join(' '); return w.split(' ').length >= 2 && txtG.includes(w); });
            if (ban.length) {
              const porte = ban.filter(x => { const w = expr(x).slice(0, 4).join(' '); const i3 = txtG.indexOf(w); return prem.includes(w) || der.includes(w) || /ce qui m a decide|c est ce qui|la raison/.test(txtG.slice(Math.max(0, i3 - 70), i3 + 70)); });
              if (porte.length) m.push('« ' + String(porte[0]).slice(0, 70) + ' » est ce que TOUS les vendeurs de ce marché proposent déjà : ni hook, ni raison qui décide, ni point de chute. Porte la vidéo sur ce que ce produit est SEUL à avoir ; cette mention reste au mieux un détail de fin, dit une seule fois');
              const occ = ban.map(x => txtG.split(expr(x).slice(0, 4).join(' ')).length - 1).reduce((x, y) => Math.max(x, y), 0);
              if (occ >= 2) m.push('une pratique standard du marché est répétée ' + occ + ' fois en 32 secondes : une seule mention suffit, et seulement si elle sert à quelque chose');
            }
            const av = String((o || {}).avantage_deloyal || '').trim();
            if (av.split(/\s+/).filter(Boolean).length < 5) m.push('`avantage_deloyal` manquant : nomme ce que CE produit ou CETTE offre a et que les autres du marché n\'ont pas — une caractéristique, une combinaison, un usage, un contenu d\'offre —, pris dans la synthèse avec sa section, puis construis le hook et le point de chute dessus. Tout produit en a un : il se déterre dans S0, S2, S3 et S5');
            else if (!expr(av).some(w => w.length > 4 && txtG.includes(w))) m.push('l\'avantage déloyal déclaré (« ' + av.slice(0, 60) + ' ») n\'apparaît nulle part dans le texte : c\'est pourtant lui qui doit faire basculer');
          }
          // v6.20 — la cause des mots sautés : un texte trop long pour 32 s. Au-delà de ~4 mots/seconde Veo comprime
          // et escamote des syllabes entières ; le texte entendu n'est plus celui qui a été écrit et relu.
          const mg = String((o || {}).texte_global || '').trim().split(/\s+/).filter(Boolean).length;
          if (mg && (mg < BORNE.lo || mg > BORNE.hi)) m.push('le texte continu fait ' + mg + ' mots au lieu de ' + BORNE.txt + ' : ' + (MINI_RUN && MINI_INFO ? 'la vidéo dure ' + MINI_INFO.D + ' s (' + (mg / MINI_INFO.D).toFixed(1) + ' mots par seconde) ; ' + (mg > BORNE.hi ? 'au-delà la ' + (CHANSON_RUN ? 'chanson' : 'voix') + ' déborde et la vidéo s\'allonge pour rien. ' : 'en dessous des plans restent muets. ') : 'à ' + (mg / (NC * 8)).toFixed(1) + ' mots par seconde, ' + (VOIX_OFF_RUN ? 'la ' + (CHANSON_RUN ? 'chanson' : 'voix off') + ' ne tient pas dans ' + frNum(NC) + ' clips de 8 s. ' : 'Veo ne peut pas tout dire et il escamote des mots. ')) + (mg > BORNE.cSi ? 'RETIRE ' + (mg - BORNE.cib) + ' mots' : 'AJOUTE ' + (BORNE.cib - mg) + ' mots') + ' en gardant la mécanique du CT intacte');
          return m;
        };
        // v6.28 — la porte comparait `kp2.length < kp1.length` : le NOMBRE de manques, pas leur GRAVITÉ.
        // Un texte à 140 mots et un texte à 125 mots portent tous deux UN seul manque, donc la reprise était
        // rejetée alors qu'elle était bien meilleure, et le texte trop long partait en production : à 140 mots
        // sur 32 s, Veo escamote des mots et la fidélité de la voix tombe (81 % mesurés sur la dernière vidéo).
        // On note désormais chaque version : 100 points par manque, plus la distance hors de la bande 108-118.
        const graviteP = (liste, obj) => {
          const mg2 = String((obj || {}).texte_global || '').trim().split(/\s+/).filter(Boolean).length;
          const hors = mg2 ? Math.max(0, mg2 - BORNE.haut, BORNE.bas - mg2) : 0;
          return (liste || []).length * 100 + hors;
        };
        // v6.52 — un mot interdit par la synthese se retire par le code, sans relance du copywriter (mesure : deux relances et
        // 2,5 min perdues sur « somnifere », que le modele reecrivait a chaque fois). Seulement si on garde au moins 70 % du texte.
        if (VOIX_OFF_RUN && sj && sj.texte_global && ((P.bible || {}).interdits_mots || []).length) {
          const plI = x => norm(String(x || '')).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
          const ints = (P.bible.interdits_mots || []).map(plI).filter(w => w && w.split(' ').length <= 8);
          const phs = String(sj.texte_global).split(/(?<=[.!?…])\s+/).filter(Boolean);
          const garde = phs.filter(ph => { const t = ' ' + plI(ph) + ' '; return !ints.some(w => t.includes(' ' + w + ' ')); });
          if (garde.length < phs.length && garde.length >= phs.length * 0.7) { log('Mots interdits par la synthèse retirés par le code (' + (phs.length - garde.length) + ' phrase(s) : « ' + phs.filter(x => garde.indexOf(x) < 0).join(' ').slice(0, 160) + ' ») — sans relance du copywriter.'); sj.texte_global = garde.join(' '); }
        }
        let kp1 = manquePorte(sj);
        for (let tourC = 1; tourC <= 2 && kp1.length; tourC++) {
          log('Porte du copywriting : ' + kp1.join(' ; ') + ' → une relance.');
          try {
            const sj3 = await demander(ask + '\n\n⚠️ TA VERSION PRÉCÉDENTE EST INCOMPLÈTE : ' + kp1.join(' ; ') + '. Reprends le texte en entier en comblant ces manques, et vérifie en plus les trois points qui font échouer le plus de vidéos : (1) la première réplique produit un ARRÊT, elle n\'annonce pas ce qui va suivre ; (2) aucune réplique ne désigne par « ça », « ils » ou « ce truc » une chose qui n\'a pas été NOMMÉE juste avant ; (3) la réplique qui précède l\'appel à l\'action donne une RAISON d\'agir maintenant — transformation, atout commercial ou réassurance — et la chute arrive par un pont, jamais d\'un coup.', 3);
            const kp2 = manquePorte(sj3);
            if (graviteP(kp2, sj3) < graviteP(kp1, sj)) { sj = sj3; kp1 = kp2; log('Copywriting repris' + (kp2.length ? ' (il manque encore : ' + kp2.join(' ; ') + ')' : ' : longueur, hook, point de chute et gestes conformes.')); }
            else { log('La relance n\'améliore pas la porte : version précédente conservée (aucune boucle).'); break; }
          } catch (e3) { log('Relance impossible (' + String(e3.message || e3).slice(0, 60) + ') : version précédente conservée.'); break; }
        }
        // v6.43 — RELECTURE DE COHERENCE. Mesure sur une video livree : « une hausse de prix annoncee comme ca c'est rare », « ce
        // prix-la c'est une chance » — des phrases qui commentent un fait sans dire en quoi il est bon pour celle qui ecoute ;
        // « formule a liberation prolongee » dit sans l'effet ; une citation sans annonce ; l'offre reduite a un prix nu alors
        // que la synthese donnait le prix par nuit, l'economie du lot, la duree. Aucune regle de forme ne voit cela : il faut
        // quelqu'un qui LIT le texte avec la synthese. Un seul relecteur independant, une seule reecriture, aucune boucle.
        try {
          const iS1 = String(p.synthese || '').search(/\nS1\s*[—–-]/);
          const s0 = String(p.synthese || '').slice(0, iS1 > 1500 ? Math.min(iS1, 12000) : 9000);
          const rq = 'Tu es le RELECTEUR INDEPENDANT d\'un texte publicitaire PARLE (32 secondes). Tu n\'as pas ecrit ce texte. Tu le lis comme la personne a qui il s\'adresse, une seule fois, en l\'entendant.\n\nNIVEAU DE CONSCIENCE : ' + niveau + '. REGLE DU NIVEAU : ' + JSON.stringify(bb.regle_niveau || {}) + '.\n\nTEXTE :\n« ' + String((sj || {}).texte_global || '').trim() + ' »\n\nSYNTHESE (section produit et offre) :\n' + s0
            + '\n\nCherche SEULEMENT ces cinq defauts, et ne signale que ceux dont tu es certain :\n1. "fait_sans_benefice" — une phrase affirme un fait, une rarete, une date, un prix ou un sentiment sans dire ce que ca change POUR CELLE QUI ECOUTE, ou son raisonnement ne tient pas (ex. une hausse de prix presentee comme une bonne nouvelle ; « c\'est une chance » sans la raison).\n2. "terme_non_traduit" — un nom d\'ingredient, de technologie ou de caracteristique (formule, liberation prolongee, actifs, dosage, complexe…) dit sans que la MEME phrase donne l\'effet que la personne ressent, avec des mots de tous les jours.\n3. "citation_mal_posee" — des mots d\'un autre (guillemets) non annonces a l\'oral juste avant, ou pas de retour a la propre voix apres ; ou une source annoncee (« un client m\'a dit ») alors que la synthese ne contient aucun verbatim reel.\n4. "offre_sous_exploitee" — le niveau autorise l\'offre, la synthese donne une structure (prix par usage, economie d\'un lot, duree couverte, badge, urgence datee) et le texte n\'en tire qu\'un prix nu ou rien.\n5. "invention" — un fait, une date, un chiffre, une experience personnelle ou un temoignage absents de la synthese.\n\nReponds UNIQUEMENT par un JSON {"problemes":[{"type":"…","phrase":"les mots exacts du texte","reparation":"UNE phrase : comment la corriger avec les faits de la synthese"}]} — 5 problemes au maximum, liste vide si le texte est coherent.';
          const gR = await vjson(`${LOCATION}-aiplatform.googleapis.com`, `/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-2.5-flash:generateContent`, { contents: [{ role: 'user', parts: [{ text: rq }] }], generationConfig: { temperature: 0, maxOutputTokens: 6000, thinkingConfig: { thinkingBudget: 1024 }, responseMimeType: 'application/json' } });
          const pb = (JSON.parse(textOf(gR)).problemes || []).filter(x => x && x.phrase && x.type).slice(0, 5);
          if (pb.length) {
            log('Relecture de cohérence : ' + pb.length + ' défaut(s) — ' + pb.map(x => x.type + ' (« ' + String(x.phrase).slice(0, 50) + ' »)').join(' ; ') + ' → une réécriture.');
            const sj4 = await demander(ask + '\n\n⚠️ UN RELECTEUR INDÉPENDANT A REFUSÉ TA VERSION PRÉCÉDENTE. Voici son texte et ses défauts, à corriger TOUS en gardant le hook, le point de chute, la longueur de ' + BORNE.txt + ' mots et la mécanique du CT :\nTEXTE REFUSÉ : « ' + String((sj || {}).texte_global || '').trim() + ' »\nDÉFAUTS :\n' + pb.map((x, k) => (k + 1) + '. [' + x.type + '] « ' + x.phrase + ' » → ' + (x.reparation || '')).join('\n') + '\nRéécris le texte entier, avec les `clips`, les `voix`, les `ton`, les `geste` et les `emotion` correspondants.', 4);
            const kp4 = manquePorte(sj4);
            if (graviteP(kp4, sj4) <= graviteP(kp1, sj) + 100) { sj = sj4; kp1 = kp4; log('Texte réécrit après relecture' + (kp4.length ? ' (il manque encore : ' + kp4.join(' ; ') + ')' : ' : cohérence, longueur, hook et point de chute conformes.')); }
            else log('La réécriture dégrade la porte (' + kp4.join(' ; ').slice(0, 120) + ') : version précédente conservée (aucune boucle).');
          } else log('Relecture de cohérence : aucun défaut relevé.');
        } catch (eRc) { log('Relecture de cohérence impossible (' + String(eRc.message || eRc).slice(0, 70) + ') : texte conservé tel quel.'); }
        {
          // v6.29 — LE CODE FAIT TENIR LE TEXTE, IL NE SE CONTENTE PLUS DE SIGNALER QU'IL EST TROP LONG.
          // Mesure : un texte de 137 mots est parti en production, et Veo a escamote « mais », « que », « puis »
          // — exactement les mots de liaison, ceux dont l'absence rend la phrase bancale a l'oreille. Redemander
          // au copywriter de « reprendre le texte en entier » ne marchait pas : il reecrit, il ne comprime pas.
          // On lui donne donc SON texte et une seule tache, avec ce qui se coupe et ce qui ne se coupe jamais.
          let mgF = compterMots((sj || {}).texte_global);
          if (mgF > BORNE.cSi) {
            let meilleur = { txt: sj.texte_global, n: mgF };
            for (let tourZ = 1; tourZ <= 2 && meilleur.n > BORNE.cSi; tourZ++) {
              try {
                const out = await comprimerTexte(meilleur.txt, meilleur.n - BORNE.cib, BORNE.raison);
                const nz = compterMots(out);
                if (nz >= BORNE.plancher && Math.abs(nz - BORNE.cib) < Math.abs(meilleur.n - BORNE.cib)) meilleur = { txt: out, n: nz };
              } catch (ez) { log('Compression du texte impossible (' + String(ez.message || ez).slice(0, 90) + ').'); break; }
            }
            if (meilleur.n < mgF) {
              log('Texte comprime par le code : ' + mgF + ' → ' + meilleur.n + ' mots (' + (meilleur.n / 28).toFixed(1) + ' mots par seconde). Le decoupage en clips se refait sur ce texte.');
              sj.texte_global = meilleur.txt; mgF = meilleur.n;
            }
          }
          if (CHANSON_RUN && sj && sj.texte_global) {
            // v6.50 — la forme chanson est controlee par le code ; au plus deux passes du parolier (~0,05 $ chacune), on garde la meilleure.
            let an0 = analyseParoles(sj.texte_global);
            if (an0.ok) log('Paroles : forme chanson déjà conforme (' + an0.lignes + ' vers, refrain répété ' + an0.refrain + ' fois).');
            else {
              log('Paroles : ce n\'est pas une chanson (' + an0.lignes + ' lignes, ' + an0.longues + ' de plus de 9 mots, moyenne ' + an0.moyen + ' mots, refrain répété ' + an0.refrain + ' fois sur ' + an0.besoinRef + ' attendues' + (an0.points ? ', point d\'interrogation ou d\'exclamation' : '') + ', ' + an0.total + ' mots) → le parolier réécrit en vers et refrain, sans rien ajouter.');
              let meilleur = { txt: sj.texte_global, an: an0, sc: -50, scTot: -50, propre: false };
              let eviteP = [];
              for (let tourP = 1; tourP <= 2 && !(meilleur.an.ok && meilleur.propre); tourP++) {
                try {
                  const outP = await paroliser(sj.texte_global, eviteP), anP = analyseParoles(outP);
                  const intP = await inventionsParoles(sj.texte_global, outP), intd = motsInterditsParoles(outP);
                  const propreP = !intP.length && !intd.length;
                  const scP = (anP.refrain >= anP.besoinRef ? 1 : 0) + (anP.longues === 0 ? 1 : 0) + (anP.moyen <= 8 ? 1 : 0) + (anP.total >= BORNE.lo && anP.total <= BORNE.hi ? 1 : 0) + (anP.ok ? 4 : 0) + (propreP ? 6 : 0) - intP.length - 2 * intd.length;
                  log('Paroles, passe ' + tourP + ' : ' + anP.lignes + ' vers, ' + anP.longues + ' trop longs, moyenne ' + anP.moyen + ' mots, refrain ×' + anP.refrain + ', ' + anP.total + ' mots' + (anP.ok ? ' — forme conforme' : ' — forme encore hors limites') + (intd.length ? ' ; MOTS INTERDITS : ' + intd.join(', ') : '') + (intP.length ? ' ; AFFIRMATIONS ABSENTES DU TEXTE : ' + intP.join(' | ') : (intd.length ? '' : ' ; aucune affirmation ajoutée')) + '.');
                  if (scP > (meilleur.scTot != null ? meilleur.scTot : -99)) meilleur = { txt: outP.split('\n').join(' '), an: anP, sc: scP, scTot: scP, propre: propreP };
                  eviteP = intP.concat(intd.map(x => 'mot interdit : ' + x));
                } catch (eP2) { log('Parolier impossible (' + String(eP2.message || eP2).slice(0, 90) + ').'); break; }
              }
              if (meilleur.txt !== sj.texte_global) { sj.texte_global = meilleur.txt; mgF = compterMots(meilleur.txt); log('Paroles retenues : ' + meilleur.an.lignes + ' vers, refrain répété ' + meilleur.an.refrain + ' fois, ' + mgF + ' mots.' + (meilleur.an.ok && meilleur.propre ? '' : ' ⚠ ' + (meilleur.an.ok ? '' : 'La forme chanson n\'est pas parfaite. ') + (meilleur.propre ? '' : 'Des affirmations ou mots interdits ont pu passer : ') + 'relis les paroles avant de payer les clips.')); }
              else log('⚠ Paroles : la forme chanson n\'a pas pu être obtenue, le texte d\'origine est conservé. Relis les paroles avant de payer les clips.');
            }
          }
          if (mgF > BORNE.hi || (mgF && mgF < BORNE.lo)) log('⚠️ DÉGRADATION ACCEPTÉE : le texte part à ' + mgF + ' mots (' + (mgF / (NC * 8)).toFixed(1) + ' mots/seconde) alors que la limite est ' + BORNE.txt + '. ' + (VOIX_OFF_RUN ? 'La voix off sera acceleree pour tenir dans les clips : attends-toi a un debit tendu.' : 'Veo va escamoter des mots de liaison : attends-toi à une fidélité de voix basse et à des phrases bancales.'));
        }
        const faireLignes = () => (sj.clips || []).map(c2 => 'Clip ' + c2.bloc + (c2.intention ? ' — INTENTION : ' + String(c2.intention).replace(/\s+/g, ' ').trim() : '') + '\n  ' + (c2.repliques || []).map(r => '« ' + r.texte + ' » [ton : ' + (r.ton || '') + (r.geste ? ' | GESTE OBLIGATOIRE pendant cette réplique, à écrire dans prompt_veo : ' + String(r.geste).replace(/\s+/g, ' ').trim() : '') + ']').join('\n  ')).join('\n');
        let lignes = faireLignes();
        if (lignes.length > 80) {
          // ---- CONTRÔLE DE CONTINUITÉ, fait par le code et non par un modèle : le découpage ne doit pas avoir réécrit le texte.
          const plat = s => norm(String(s || '')).replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
          const textePlat = plat(sj.texte_global);
          const clipsPlat = plat((sj.clips || []).map(c2 => (c2.repliques || []).map(r => r.texte).join(' ')).join(' '));
          const motsTexte = textePlat ? textePlat.split(' ').length : 0, motsClips = clipsPlat ? clipsPlat.split(' ').length : 0;
          const continu = textePlat && clipsPlat ? (textePlat === clipsPlat ? 'identique' : (clipsPlat.includes(textePlat) || textePlat.includes(clipsPlat) ? 'inclus' : 'divergent')) : 'texte_global absent';
          sj.continuite = { verdict: continu, mots_texte_global: motsTexte, mots_clips: motsClips };
          // v6.28 — motsTexte vient de plat(), qui remplace les apostrophes par des espaces : « c'est » comptait
          // pour deux mots et le log annonçait 156 mots là où la porte en comptait 140. On affiche le vrai compte.
          const motsVrais = String(sj.texte_global || '').trim().split(/\s+/).filter(Boolean).length;
          if (sj.texte_global) log('Texte global (' + motsVrais + ' mots) : « ' + String(sj.texte_global).replace(/\s+/g, ' ').trim() + ' »');
          log('Hook : ' + (sj.hook_framework || '⚠️ NON DÉCLARÉ') + '  |  Point de chute : ' + (sj.point_de_chute || '⚠️ NON DÉCLARÉ'));
          P._hook = sj.hook_framework || null; P._chute = sj.point_de_chute || null;
          P.plan_gestes = (sj.clips || []).map(c2 => ({ bloc: c2.bloc, intention: c2.intention || null, gestes: (c2.repliques || []).map(r => r.geste || null) }));
          // v6.15 — LE DÉCOUPAGE EST UNE COUPURE, PAS UNE RÉÉCRITURE. « je suis riche et shape à présent » se coupe en
          // « je suis riche » / « et shape à présent » — jamais reformulé. Quand le copywriter a réécrit en découpant,
          // le code refait la coupe lui-même à partir du texte global : chaque mot est conservé, dans l'ordre.
          if (textePlat) {
            const decoupe = (txt, orig) => {
              // 1) le texte est coupé en unités de sens : phrases, puis propositions si une phrase est trop longue
              const seg = String(txt).replace(/\s+/g, ' ').trim().match(/[^.!?;]+[.!?;]*\s*/g) || [];
              let u = [];
              seg.forEach(x => { const t = x.trim(); if (!t) return;
                if (t.split(' ').length <= 9) { u.push(t); return; }   // v6.16 — seuil abaissé : une phrase longue est coupée en propositions,
                const parts = t.match(/[^,]+,?\s*/g) || [t]; let buf = '';   // ce qui permet à une phrase de commencer dans un clip et de finir dans le suivant
                parts.forEach(q => { const c = (buf ? buf + ' ' : '') + q.trim();
                  if (c.split(' ').length > 9 && buf) { u.push(buf.trim()); buf = q.trim(); } else buf = c; });
                if (buf.trim()) u.push(buf.trim());
              });
              // 2) moins de NC unités : on recoupe la plus longue, à sa virgule, sans toucher à un seul mot
              while (u.length < NC) {
                let i3 = 0; u.forEach((x, k) => { if (x.split(' ').length > u[i3].split(' ').length) i3 = k; });
                const mots = u[i3].split(' '); if (mots.length < 4) break;
                const vg = u[i3].indexOf(', ');
                const a = vg > 0 ? u[i3].slice(0, vg + 1) : mots.slice(0, Math.ceil(mots.length / 2)).join(' ');
                const b = vg > 0 ? u[i3].slice(vg + 2) : mots.slice(Math.ceil(mots.length / 2)).join(' ');
                u.splice(i3, 1, a.trim(), b.trim());
              }
              // 3) répartition en 4 blocs équilibrés, aucun bloc vide
              const total = u.reduce((a, x) => a + x.split(' ').length, 0), cible = total / NC;
              const blocs = Array.from({ length: NC }, () => []); let bi = 0, cur = 0;
              u.forEach((x, k) => { const w = x.split(' ').length, restants = u.length - k, aRemplir = NC - bi;
                if (bi < NC - 1 && cur > 0 && (cur + w / 2 >= cible || restants <= aRemplir - 1)) { bi++; cur = 0; }
                blocs[bi].push(x); cur += w; });
              // 4) chaque bloc devient 1 ou 2 répliques ; tons et gestes du copywriter sont conservés
              return blocs.map((b, i2) => {
                const o = (orig || []).find(c3 => Number(c3.bloc) === i2 + 1) || {};
                const mots = b.join(' ').split(' ').length;
                // v6.23 — au-delà de 20 mots, le bloc se dit en DEUX répliques équilibrées : une phrase de 34 mots
                // d'un seul tenant est débitée à toute vitesse puis laisse un trou, et une queue de 2 mots sonne bancale.
                let reps = [b.join(' ')];
                if (b.length > 1 && mots > 20) {
                  let best = 1, ecart = 1e9, cum = 0;
                  b.forEach((x, k6) => { cum += x.split(' ').length;
                    if (k6 < b.length - 1) { const e = Math.abs(cum - mots / 2); if (e < ecart) { ecart = e; best = k6 + 1; } } });
                  const g1 = b.slice(0, best).join(' '), g2 = b.slice(best).join(' ');
                  if (g1.split(' ').length >= 6 && g2.split(' ').length >= 6) reps = [g1, g2];
                }
                const og = o.repliques || [];
                return { bloc: i2 + 1, intention: o.intention || null,
                         repliques: reps.map((t2, k2) => ({ texte: t2, ton: /[«“"]/.test(t2) ? 'reading someone else\'s words aloud — flat, neutral and slightly distanced, NOT her own feeling' : ((og[k2] || og[0] || {}).ton || 'natural'), geste: (og[k2] || og[0] || {}).geste || null, emotion: (og[k2] || og[0] || {}).emotion || null })) };
              });
            };
            try {
              const neuf = decoupe(sj.texte_global, sj.clips);
              const okTot = plat(neuf.map(c3 => c3.repliques.map(r => r.texte).join(' ')).join(' ')) === textePlat;
              if (okTot) { sj.clips = neuf; sj.continuite.verdict = 'coupé par le code'; lignes = faireLignes();
                // v6.16 — LE TEXTE APPARTIENT AU CODE. Le réalisateur recevait l'ordre de le recopier mot pour mot et le
                // réécrivait quand même (149 mots devenus 89) : la voix de la vidéo ne disait plus le texte validé.
                // Ce découpage est désormais la référence, et il est réimposé au plan après chaque passage du réalisateur.
                P._script = neuf.map(c3 => c3.repliques.map(r => String(r.texte)));
                P._scriptTons = neuf.map(c3 => c3.repliques.map(r => ({ ton: r.ton || null, geste: r.geste || null, emotion: r.emotion || null })));
                log('Découpage fait par le code à partir du texte continu, mot pour mot (' + neuf.map(c3 => c3.repliques.map(r => r.texte.split(' ').length).join('+')).join(' | ') + ' mots) : une phrase peut commencer dans un clip et finir dans le suivant.'); }
              else log('⚠ Le découpage en clips ne redonne pas le texte global mot pour mot (' + motsTexte + ' mots contre ' + motsClips + ') et la recoupe automatique a échoué : ce sont les clips qui sont produits.');
            } catch (eD) { log('⚠ Recoupe automatique impossible (' + String(eD.message || eD).slice(0, 60) + ') : ce sont les clips qui sont produits.'); }
          }
          // v6.32 — LA VOIX OFF EST DITE ET MESUREE ICI, AVANT LE REALISATEUR, LA PLANCHE ET VEO.
          // La v6.31 la disait apres les quatre clips : sans voix configuree on decouvrait une video muette apres 1,60 $
          // de generation, et un bloc trop long n'etait connu qu'au montage. Mesurer d'abord permet (1) d'echouer a cout nul,
          // (2) de comprimer un bloc trop long sur sa DUREE REELLE, (3) de dire au realisateur ou tombe le pivot de chaque
          // bloc pour que l'image change au moment ou l'idee change.
          if (VOIX_OFF_RUN && (sj.clips || []).length >= 2) {
            try {
              const CAP = parseFloat(process.env.VOIXOFF_BLOC_MAX_S || (MINI_RUN ? '7.6' : '8.3'));
              // v6.32 — LA VOIX EST CELLE DU PERSONA QUI REGARDE LA PUB, pas une voix de narrateur par defaut. Avant, le genre
              // venait d'un mot du CT (« voix feminine ») : sans ce mot, une voix d'homme de 40 ans disait le texte d'une jeune
              // femme. On lit le persona dans la synthese (qui regarde, quel genre, quel age) et on choisit la voix qui lui ressemble.
              let profilV = { genre: null, classe: null, age: null };
              try {
                const gp = await vjson(`${LOCATION}-aiplatform.googleapis.com`, `/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-2.5-flash:generateContent`, { contents: [{ role: 'user', parts: [{ text: 'Lis la SYNTHESE ci-dessous. Elle décrit le persona CIBLE : la personne qui regardera cette publicité vidéo. Réponds UNIQUEMENT par un JSON {"genre":"female|male","age":nombre entier (âge central du persona),"classe":"young|middle_aged|old"}. Le genre et l\'âge sont ceux du persona de la synthèse (S1), jamais ceux d\'un personnage de la vidéo ni ceux du vendeur. Si la synthèse ne tranche pas le genre, choisis celui de la majorité de la cible décrite.\n\n' + String(p.synthese || '').slice(0, 24000) }] }], generationConfig: { temperature: 0, maxOutputTokens: 2048, thinkingConfig: { thinkingBudget: 0 }, responseMimeType: 'application/json' } });
                const jp = JSON.parse(textOf(gp));
                if (/^(female|male)$/i.test(String(jp.genre))) profilV.genre = String(jp.genre).toLowerCase();
                if (/^(young|middle_aged|old)$/i.test(String(jp.classe))) profilV.classe = String(jp.classe).toLowerCase();
                if (Number.isFinite(Number(jp.age))) profilV.age = Number(jp.age);
              } catch (eP) { log('⚠ Profil du persona illisible pour le choix de la voix (' + String(eP.message || eP).slice(0, 70) + ') : on retombe sur le CT.'); }
              const femCT = /(voix (?:off )?(?:f[ée]minine|de femme)|narratrice|female (?:voice|narrator))/i.test(String(p.ct || ''));
              const fem = femCT || profilV.genre === 'female';
              P._voixProfil = profilV; P._genreFem = fem;
              log('Persona cible lu dans la synthèse pour la voix : ' + (profilV.genre || 'genre inconnu') + (profilV.age ? ', ~' + profilV.age + ' ans' : '') + (profilV.classe ? ' (' + profilV.classe + ')' : '') + ' → voix ' + (fem ? 'féminine' : 'masculine') + '.');
              const blocsT = (sj.clips || []).map(c2 => (c2.repliques || []).map(r => String(r.texte || '').trim()));
              let vo = null, vitesse = 1;
              // v6.43 — LE DECOUPAGE DE LA VOIX SE FAIT SUR LE TEMPS MESURE, PAS SUR LE NOMBRE DE MOTS. Mesure : quatre blocs de
              // 23, 20, 26 et 25 mots duraient 6,6 / 9,1 / 8,7 / 9,9 s (le debit varie d'une phrase a l'autre) ; le dernier ne
              // tenait pas dans son clip de 8 s, la voix etait acceleree de 15 % et la video s'arretait AVANT la fin de la
              // derniere phrase. Le meme audio est donc redecoupe aux frontieres de phrase ou de virgule qui egalisent les
              // durees (le minutage mot a mot d'ElevenLabs le permet, sans nouvel appel), puis, si le total ne tient pas,
              // la voix est redite UNE fois plus vite (parametre `speed` d'ElevenLabs, plus naturel qu'une acceleration au montage).
              const reequilibrer = (voX, blocsX) => {
                const toks = blocsX.map(reps => reps.map(t => String(t || '').trim().split(/\s+/).filter(Boolean)));
                const flat = []; const orig = []; toks.forEach(reps => { reps.forEach(w => w.forEach(x => flat.push(x))); orig.push(flat.length); });
                const W = voX.words || []; if (!W.length || W.length !== flat.length || orig.length !== NC) return null;
                const fin = i => Number(W[i].end) || 0, deb = i => Number(W[i].start) || 0;
                const pen = i => { const t = flat[i] || ''; const base = /[.!?…]["»”]?$/.test(t) ? 0 : (CHANSON_RUN ? 3 : 1) * (/[,;:]["»”]?$/.test(t) ? 1.5 : 5); const gap = i + 1 < W.length ? Math.max(0, deb(i + 1) - fin(i)) : 0; return base - Math.min(1.5, gap * 3); };
                const dur = (a, b2) => fin(b2 - 1) - (a === 0 ? 0 : fin(a - 1));
                const n = W.length, WIN = MINI_RUN ? 8 : CHANSON_RUN ? 14 : 9, NB = NC, MINB = MINI_RUN ? 1.2 : 3.5, MW = MINI_RUN ? 2 : 4; let best = null;
                const cand = k => { const o2 = []; for (let i = Math.max(MW, orig[k] - WIN); i <= Math.min(n - MW, orig[k] + WIN); i++) o2.push(i); return o2; };
                const meanD = fin(n - 1) / NB;
                // v6.47 — programmation dynamique : le meme calcul pour 4 a 7 blocs. Pour un plafond de duree M, on cherche le
                // decoupage de moindre cout (frontieres de phrase de preference, durees voisines de la moyenne) dont AUCUN bloc
                // ne depasse M ; on garde le plus petit M faisable (+ 0,25 s de marge pour laisser la ponctuation decider).
                const solve = M => {
                  const layers = []; let layer = new Map();
                  for (const b1 of cand(0)) { const d = dur(0, b1); if (d < MINB || d > M) continue; layer.set(b1, { cost: pen(b1 - 1) + 0.5 * Math.abs(d - meanD), prev: null }); }
                  if (!layer.size) return null; layers.push(layer);
                  for (let k = 1; k < NB - 1; k++) {
                    const nl = new Map();
                    for (const b of cand(k)) {
                      let bv = null;
                      layers[k - 1].forEach((v, a2) => { if (b <= a2 + (MINI_RUN ? 1 : 3)) return; const d = dur(a2, b); if (d < MINB || d > M) return; const c = v.cost + pen(b - 1) + 0.5 * Math.abs(d - meanD); if (!bv || c < bv.cost) bv = { cost: c, prev: a2 }; });
                      if (bv) nl.set(b, bv);
                    }
                    if (!nl.size) return null; layers.push(nl);
                  }
                  let be = null;
                  layers[NB - 2].forEach((v, a2) => { const d = dur(a2, n); if (d < MINB || d > M) return; const c = v.cost + 0.5 * Math.abs(d - meanD); if (!be || c < be.cost) be = { cost: c, last: a2 }; });
                  if (!be) return null;
                  const bs2 = [n]; let a3 = be.last;
                  for (let k = NB - 2; k >= 0; k--) { bs2.push(a3); a3 = layers[k].get(a3).prev; }
                  bs2.push(0); bs2.reverse(); return { cost: be.cost, bs: bs2 };
                };
                let M0 = null; for (let M = (MINI_RUN ? 1.4 : 3.6); M <= 14; M += 0.1) { if (solve(M)) { M0 = M; break; } }
                if (M0 != null) { const sol = solve(M0 + 0.25); if (sol) best = { cost: sol.cost, bs: sol.bs, ds: sol.bs.slice(1).map((x, i) => dur(sol.bs[i], x)) }; }
                if (!best) return null;
                const blocs2 = [], segs2 = []; let prec = 0;
                for (let k = 0; k < NC; k++) {
                  const a = best.bs[k], b2 = best.bs[k + 1], nb = b2 - a, d0 = dur(a, b2), fin2 = fin(b2 - 1);
                  let reps2 = [flat.slice(a, b2).join(' ')], piv = [];
                  if (!MINI_RUN && nb >= 14) { let jb = -1, cb = 1e9;   // une seconde replique (le pivot ou l'image change) a la coupe de phrase la plus proche du milieu du temps
                    for (let j = a + 4; j <= b2 - 4; j++) { const t1 = fin(j - 1) - (a === 0 ? 0 : fin(a - 1)); if (t1 < 1.8 || d0 - t1 < 1.8) continue; const c2 = Math.abs(t1 - d0 / 2) + pen(j - 1); if (c2 < cb) { cb = c2; jb = j; } }
                    if (jb > 0) { reps2 = [flat.slice(a, jb).join(' '), flat.slice(jb, b2).join(' ')]; piv = [fin(jb - 1) - prec]; } }
                  blocs2.push(reps2); segs2.push({ bloc: k + 1, debut: prec, fin: fin2, duree: Math.max(0.5, fin2 - prec), pivot: piv }); prec = fin2;
                }
                return { blocs: blocs2, segments: segs2 };
              };
              const dursTxt = v2 => v2.segments.map(x => 'bloc ' + x.bloc + ' ' + x.duree.toFixed(1) + ' s').join(', ');
              for (let tourV = 0; tourV < 4; tourV++) {
                vo = CHANSON_RUN ? await ttsChanson(blocsT, fem) : await ttsVoixOff(blocsT, fem, vitesse);
                log('Voix off mesuree' + (tourV ? ' (essai ' + (tourV + 1) + (vitesse > 1.005 ? ', débit ×' + vitesse.toFixed(2) : '') + ')' : '') + ' : ' + vo.duree.toFixed(1) + ' s au total — ' + dursTxt(vo) + '.');
                const rb = reequilibrer(vo, blocsT);
                if (rb) { rb.blocs.forEach((reps, i7) => { blocsT[i7] = reps; }); vo.segments = rb.segments; log('Voix redécoupée sur le temps mesuré (mêmes mots, mêmes phrases, frontières déplacées) : ' + dursTxt(vo) + '.'); }
                else log('⚠ Minutage mot à mot inexploitable : découpage par nombre de mots conservé.');
                const maxb = Math.max.apply(null, vo.segments.map(x => x.duree));
                if (maxb <= CAP) break;
                if (CHANSON_RUN) { log('⚠ Chanson : le bloc le plus long dure ' + maxb.toFixed(1) + ' s (limite ' + CAP + ' s). Une chanson n\'est pas regénérée pour une seconde : la fin de la vidéo est prolongée au montage.'); break; }
                if (tourV === 0 || (tourV === 1 && vitesse < 1.14)) {
                  vitesse = Math.min(1.15, Math.max(vitesse * 1.04, vitesse * maxb / 7.9));
                  log('Le bloc le plus long dure ' + maxb.toFixed(1) + ' s pour un clip de 8 s : la voix est redite UNE fois plus vite (×' + vitesse.toFixed(2) + ', débit naturel d\'ElevenLabs) au lieu d\'être accélérée au montage.');
                  continue;
                }
                if (tourV >= 2) { log('⚠️ DÉGRADATION ACCEPTÉE : le bloc le plus long dure encore ' + maxb.toFixed(1) + ' s après la voix plus rapide et la compression ; la fin de la vidéo sera prolongée pour que la voix ne soit jamais coupée.'); break; }
                const longs = vo.segments.filter(sg => sg.duree > CAP);
                for (const sg of longs) {
                  const reps = blocsT[sg.bloc - 1], nTot = compterMots(reps.join(' '));
                  const aRetirer = Math.max(3, Math.ceil((sg.duree - (CAP - 0.6)) * nTot / sg.duree));
                  log('Bloc ' + sg.bloc + ' : ' + sg.duree.toFixed(1) + ' s de voix pour ' + nTot + ' mots, la limite est ' + CAP + ' s → le code retire ' + aRetirer + ' mots sur la durée mesurée.');
                  for (let k5 = 0; k5 < reps.length; k5++) {
                    const nk = compterMots(reps[k5]), cut = Math.max(0, Math.round(aRetirer * nk / nTot));
                    if (cut >= 1 && nk - cut >= 4) { try { reps[k5] = await comprimerTexte(reps[k5], cut, BORNE.raison); } catch (e7) { log('Compression du bloc ' + sg.bloc + ' impossible (' + String(e7.message || e7).slice(0, 80) + ').'); } }
                  }
                }
              }
              // les repliques du plan suivent le redecoupage : meme nombre de blocs, nombre de repliques libre, ton / geste / emotion repris par rang
              blocsT.forEach((reps, i7) => { const old = sj.clips[i7].repliques || []; sj.clips[i7].repliques = reps.filter(Boolean).map((t8, k7) => Object.assign({}, old[k7] || old[old.length - 1] || {}, { texte: t8 })); });
              sj.texte_global = blocsT.reduce((a8, r8) => a8.concat(r8), []).filter(Boolean).join(' ');
              if (P._scriptTons) P._scriptTons = sj.clips.map(c3 => (c3.repliques || []).map(r => ({ ton: r.ton || null, geste: r.geste || null, emotion: r.emotion || null })));
              if (P._script) P._script = blocsT.map(reps => reps.slice());
              lignes = faireLignes();
              P.voixoff = vo; VO_TIMING = vo; save('07_voixoff.json', vo);
              log('Voix off prête : ' + vo.segments.map(x => 'clip ' + x.bloc + ' = ' + x.duree.toFixed(1) + ' s' + (x.pivot && x.pivot.length ? ' (pivot ' + x.pivot[0].toFixed(1) + ' s)' : '')).join(', ') + '. Ces durées commandent le montage et sont données au réalisateur.');
            } catch (eVo0) { P._voixoffErreur = String(eVo0.message || eVo0).slice(0, 160); }
          }
          // Le texte global est transmis au réalisateur : il met en scène UN discours continu, pas 4 morceaux indépendants.
          SCRIPT = '\n=== SCRIPT IMPOSÉ (écrit par le copywriter : tu le reprends MOT POUR MOT dans `repliques` et entre guillemets dans `prompt_veo`, sans rien changer, ni ajouter, ni retirer) ===\n'
            + (sj.texte_global ? 'TEXTE CONTINU DONT LES 4 CLIPS SONT LE DÉCOUPAGE (il est dit d\'un seul trait, par la même voix, du début à la fin : tes 4 clips doivent s\'enchaîner comme une seule prise, même décor ou pas) :\n« ' + String(sj.texte_global).replace(/\s+/g, ' ').trim() + ' »\n\nDÉCOUPAGE :\n' : '')
            + lignes + '\n';
          if (MINI_RUN && VO_TIMING) SCRIPT += '\n=== PLANS MESURÉS SUR LA ' + (CHANSON_RUN ? 'CHANSON' : 'VOIX OFF') + ' (c\'est la vérité du montage) ===\n'
            + VO_TIMING.segments.map((sg, i9) => '- Clip ' + sg.bloc + ' : ' + sg.duree.toFixed(1) + ' s à l\'écran — la voix dit : « ' + ((sj.clips[i9] || {}).repliques || []).map(r => r.texte).join(' ') + ' » → montre CELA, en UN geste.').join('\n')
            + '\nRAPPEL : un clip = un lieu, un sujet, un geste déjà engagé dans l\'image de départ, une émotion nommée ; aucune transition, aucun texte, aucun effet magique, bouche fermée. Voix : ' + (P._genreFem ? 'féminine' : 'masculine') + ' ; dans `voix`, une seule entrée, hors_champ.\n';
          else if (VOIX_OFF_RUN && VO_TIMING) SCRIPT += '\n=== VOIX OFF MESURÉE (c\'est la vérité du montage : ElevenLabs a déjà dit le texte) ===\n'
            + VO_TIMING.segments.map(sg => '- Clip ' + sg.bloc + ' : voix de ' + sg.duree.toFixed(1) + ' s' + (sg.pivot && sg.pivot.length ? ' ; la première idée dure jusqu\'à ' + sg.pivot[0].toFixed(1) + ' s : le plan doit CHANGER VISIBLEMENT à cet instant' : '')).join('\n')
            + '\nCHAQUE CLIP EST UNE SCÈNE JOUÉE, PAS UNE ILLUSTRATION : dans `prompt_veo`, deux temps datés sur le pivot ; le premier temps est une ACTION (jamais « tient la pose », « reste immobile », « plan statique ») qui montre ce que dit la première idée, le second est une AUTRE action qui montre la seconde idée. Chaque temps nomme ce que le corps fait (regard, souffle, épaules, mains, objet manipulé) et ce que la matière fait (lumière qui change, liquide qui bouge, peau, tissu). L\'émotion de chaque réplique (champ `emotion`) doit se LIRE sur la personne à l\'écran, et elle change d\'un clip à l\'autre selon la courbe du texte. Quand la voix explique quelque chose d\'invisible (un mécanisme, un effet, une durée), le plan le rend visible par une image concrète de ce que la cible reconnaît (un objet, un geste, un changement de matière, un gros plan) et non par une pose. Aucun plan ne peut être compris autrement que par ce que dit la voix à cet instant.'
            + '\nChaque clip est coupé au montage à la durée de sa voix : toute l\'action de ton prompt_veo est TERMINÉE à cet instant, et l\'image montre à chaque seconde ce que la voix dit à cette seconde. Voix off : ' + (P._genreFem ? 'féminine' : 'masculine') + ' ; dans `voix`, une seule entrée, hors_champ, identité de la voix seulement (jamais dans personnages_visibles).\n';
          P.steps.push({ etape: '1b. Copywriting (texte global puis découpage)', texte_global: sj.texte_global || null, continuite: sj.continuite, clips: sj.clips });
          save('01b_script.json', sj);
          log('Copywriting écrit : ' + compterMots((sj || {}).texte_global) + ' mots de texte global découpés en ' + (sj.clips || []).length + ' clips (continuité : ' + ((sj.continuite && sj.continuite.verdict) || continu) + ').');
        }
      } catch (e) { log('⚠️ COPYWRITER INDISPONIBLE (' + String(e.message || e).slice(0, 110) + ') : le réalisateur écrit lui-même les répliques, SANS les règles d\'écriture du §6bis. Le texte sera correct mais plat — relance la production plutôt que de diffuser ce résultat.'); }
      if (VOIX_OFF_RUN && !P.voixoff) throw new Error('VOIX OFF IMPOSSIBLE (' + (P._voixoffErreur || 'texte introuvable') + '). Ce CT se joue en voix off : rien n\'a ete depense (ni image, ni clip). Corrige la cause puis relance.');
      // v6.46 — LE REALISATEUR SAIT SON BUDGET. Plafond, cout mesure d'un clip, et ce qui reste pour le raisonnement.
      const BUDGET_TXT = (() => {
        const BUD = parseFloat(process.env.BUDGET_USD || p.budget_usd || '10'), RES = parseFloat(process.env.BUDGET_RESERVE || '0.15');
        if (!(BUD > 0)) return '';
        const tv = TARIFS.veo[p.model], tps = tv ? tv.audio : ((MODELS[p.model] || {}).usdPerSec || 0), clip = MINI_RUN ? 4 * (tv && tv.muet != null ? tv.muet : tps) : 8 * tps;
        return '\n=== BUDGET DE CETTE VIDÉO ===\nPlafond : ' + BUD.toFixed(2) + ' $ tout compris (réflexion, images, clips, musique, transcription), dont ' + (BUD * RES).toFixed(2) + ' $ gardés pour les corrections. Mesuré : un clip de ' + (MINI_RUN ? 4 : 8) + ' s coûte ' + clip.toFixed(2) + ' $ avec ce modèle, soit ' + (NC * clip).toFixed(2) + ' $ pour les ' + NC + ' clips ; la planche d\'images ~0,20 $ ; une retouche produit ~0,15 $ par panneau, faite seulement si l\'écart saute aux yeux. Le reste du budget est pour TON raisonnement : lire le CT, la synthèse et le produit à fond, écrire et découper avec soin. Ce budget ne sert JAMAIS à allonger : chaque clip et chaque plan a un rôle précis (arrêter le scroll, faire passer la cible par une émotion, lui donner la raison d\'agir, l\'appeler à agir). Une correction ne se paie que si l\'erreur se voit à l\'œil nu sur un téléphone en défilement.\n';
      })();
      const parts = [{ text: adaptNC(TETE) }, { text: ctxt }, { text: syn }, { text: adaptNC(brief + BOUSSOLE_TXT + LIMITES + BIBLE_TXT + FICHE_TXT + BUDGET_TXT + SCRIPT + RAPPEL) }];
      if (p.produit) { parts.push({ text: '=== IMAGE_PRODUIT ===' }); parts.push({ inlineData: { mimeType: p.produit.mime || 'image/png', data: p.produit.data } }); }
      // ---- journal de ce qui est envoyé à la direction créative
      const compVersion = (sys.match(/VERSION:\s*([^\n(—]+)/) || [])[1]?.trim() || 'INCONNUE'; const compHash = crypto.createHash('sha256').update(sys).digest('hex').slice(0, 10);
      const dr = { competence_version: compVersion, competence_hash: compHash, competence_chars: sys.length, ct_chars: p.ct.length, synthese_chars: p.synthese.length, brief_envoye: brief, image_produit_ko: p.produit ? sizeKB(p.produit.data) : 0, modele: 'gemini-2.5-pro', maxOutputTokens: 48000, thinkingBudget: 24576 };
      save('01_direction_envoyee.json', dr); P.steps.push({ etape: '1. Envoi à la direction créative', ...dr });
      log('Direction créative (' + MODELE_ECRITURE + ') : compétence v' + compVersion + ' [' + compHash + '], ' + sys.length + ' car., CT ' + p.ct.length + ' car., synthèse ' + p.synthese.length + ' car.');
      const callDir = (contents, budget) => vjson(`${LOCATION}-aiplatform.googleapis.com`, `/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-2.5-pro:generateContent`, {
        systemInstruction: { parts: [{ text: adaptNC(sys) }] }, contents, generationConfig: { temperature: 0.4, maxOutputTokens: 48000, thinkingConfig: { thinkingBudget: budget } } });
      let g = await callDir([{ role: 'user', parts }], 24576);
      let raw = textOf(g), f = fin(g); P.raw = raw; save('02_direction_sortie_brute.txt', raw);
      P.steps.push({ etape: '2. Réponse de la direction créative', chars: raw.length, finishReason: f.finishReason, tokens: f.usage });
      if (f.finishReason && f.finishReason !== 'STOP') throw new Error('RÉPONSE DE LA DIRECTION CRÉATIVE TRONQUÉE OU BLOQUÉE (finishReason = ' + f.finishReason + '). Fin reçue : …' + raw.slice(-200));
      const clean = s => s.trim().replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
      const parse = r => { const mm = r.match(/===META===([\s\S]*?)===PLAN_VIDEO===([\s\S]*)$/); if (!mm) throw new Error('Format de sortie non respecté. Début: ' + r.slice(0, 400)); return [JSON.parse(clean(mm[1])), enrich(JSON.parse(clean(mm[2])))]; };
      [P.meta, P.plan] = parse(raw);
      // ---- contrôle indépendant : règles codées + auditeur LLM (checklist du §15), puis boucle de correction (2 tours max)
      const gate = (sys.match(/## 15\. PORTE FINALE[\s\S]*?(?=\n## 16\.)/) || [''])[0];
      const audit = async (plan, meta) => {
        const prompt = 'Tu es un AUDITEUR INDÉPENDANT. Tu ne connais pas le raisonnement de l\'auteur du plan. Vérifie le plan vidéo ci-dessous point par point contre la PORTE FINALE, la synthèse et le CT. Sois strict : un point est un écart seulement si tu peux le démontrer (cite la clé/le clip). Ne signale pas ce qui est conforme. Contrôle en plus, explicitement : pour CHAQUE promesse de bénéfice prononcée dans une réplique (énergie, concentration, clarté, durée, santé, résultat), cite la phrase de la synthèse qui l\'autorise ; si aucune phrase ne l\'autorise ou si la synthèse la déclare non prouvée, c\'est un écart. Le champ `justification` d\'une image de référence EST le défaut nommé : ne demande pas de champ supplémentaire. Une voix off est légitime quand aucun visage capable de parler n\'est visible pendant la réplique ; ne la signale pas dans ce cas. En revanche un locuteur déclaré `sans_bouche`, ou cadré de dos ou de profil franc alors qu\'il parle dans le clip, EST un écart : le locuteur se cadre de face ou de trois quarts face, bouche dans le cadre dès la première image. Ne propose jamais de corriger en supprimant un invariant du CT sans qu\'une règle du niveau de conscience l\'impose.\n\n' + gate + '\n\n=== NIVEAU / ANGLE ===\n' + JSON.stringify(meta) + '\n\n=== SYNTHESE ===\n' + p.synthese + '\n\n=== CT_VIDEO ===\n' + p.ct + '\n\n=== PLAN ===\n' + JSON.stringify(Object.assign({}, plan, { sous_titres: undefined, _imgDesc: undefined, clips: (plan.clips || []).map(c => Object.assign({}, c, { prompt_veo: c._corps || c.prompt_veo, _corps: undefined })) })) + '\n\n(NB : dans les clips, prompt_veo est ici le CORPS seul ; le code ajoute lui-même style, fiches, voix et consigne audio : ne signale jamais leur absence.)\n\nRéponds UNIQUEMENT par un JSON : {"ecarts":[{"point":"numéro de la porte","clip":"1-4 ou global","probleme":"…","correction":"…"}]} (liste vide si rien).';
        const ga = await vjson(`${LOCATION}-aiplatform.googleapis.com`, `/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-2.5-flash:generateContent`, { contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0, maxOutputTokens: 16384, responseMimeType: 'application/json' } });
        const ra = textOf(ga), fa = fin(ga); P.steps.push({ etape: 'Audit indépendant (gemini-2.5-flash)', finishReason: fa.finishReason, tokens: fa.usage, chars: ra.length });
        try { return (JSON.parse(ra).ecarts || []).map(e => '[Audit pt ' + e.point + ' / clip ' + e.clip + '] ' + e.probleme + ' → ' + e.correction); }
        catch (e) { P.steps.push({ etape: 'Audit illisible', debut: ra.slice(0, 300) }); return []; }
      };
      const flashJSON = async text => {   // Flash avec réflexion limitée, réessai si le JSON est tronqué
        let lastErr;
        for (const [maxTok, think] of [[8192, 512], [24000, 0]]) {
          try {
            const g = await vjson(`${LOCATION}-aiplatform.googleapis.com`, `/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-2.5-flash:generateContent`, { contents: [{ role: 'user', parts: [{ text }] }], generationConfig: { temperature: 0, maxOutputTokens: maxTok, thinkingConfig: { thinkingBudget: think }, responseMimeType: 'application/json' } });
            return JSON.parse(textOf(g));
          } catch (e) { lastErr = e; }
        }
        throw lastErr;
      };
      const sceneCheck = async plan => {
        const items = (plan.clips || []).map((c, i) => ({ clip: i + 1, decor_declare: c.decor, image_du_decor: ((plan.images_reference || []).find(x => x.id === (c.references || [])[0]) || {}).prompt_gemini || null, corps_du_prompt: String(c._corps || c.prompt_veo).replace(/"[^"]*"/g, '"…"') }));
        const r = await flashJSON('Tu contrôles des prompts de clips vidéo. Pour CHAQUE clip, lis le corps du prompt (les paroles des personnages sont remplacées par « … » : ce qu\'ils disent ou évoquent n\'est JAMAIS un lieu, seul compte ce qui est montré à l\'écran) et réponds : (a) lieux_distincts = nombre de lieux physiques différents où se déroule l\'action décrite (un changement de pièce, de décor, de lumière imposé par un autre lieu, un whip-pan ou une coupe vers un autre endroit comptent comme un nouveau lieu ; un gros plan sur un objet ou un visage dans la même pièce n\'en est pas un) ; (b) hors_decor = true si le corps décrit un lieu qui n\'est PAS celui de l\'image du décor fournie pour ce clip ; (c) raison courte. Réponds UNIQUEMENT par un JSON {"clips":[{"clip":1,"lieux_distincts":1,"hors_decor":false,"raison":"…"}]}.\n' + JSON.stringify(items));
P.steps.push({ etape: 'Contrôle de scène (un clip = un lieu = le lieu de son image)', resultat: r.clips });
        const out = []; (r.clips || []).forEach(x => { if (x.lieux_distincts > 1) out.push('Clip ' + x.clip + ' : ' + x.lieux_distincts + ' lieux dans un clip (maximum 1) : ' + (x.raison || '')); if (x.hors_decor) out.push('Clip ' + x.clip + ' : décrit un lieu autre que son décor déclaré ou l\'image de son décor : ' + (x.raison || '')); });
        return out;
      };
      const copyCheck = async (plan, meta, synth) => {
        const lines = (plan.clips || []).map((c, i) => ({ clip: i + 1, lieu: c.decor, personnages_visibles_a_l_ecran: c.personnages_visibles, repliques: (c.repliques || []).map(r => ({ locuteur: repLoc(r), texte: repTexte(r), ton: r && r.ton })) }));
        const r = await flashJSON('Tu es un spectateur ordinaire (le persona de la publicité) qui regarde la vidéo une seule fois, sans pouvoir revenir en arrière. Voici les répliques dans l\'ordre. Pour CHAQUE réplique, contrôle : (1) REFERENT : tout pronom ou démonstratif (cette, ce, ça, leur, il, elle, eux…) renvoie à quelque chose déjà énoncé dans une réplique précédente ou clairement visible ; une peur, une douleur, un bénéfice ou un objet présenté comme connu alors qu\'il n\'a jamais été dit en toutes lettres est un écart ; (2) LOGIQUE : ce que le locuteur s\'attribue ou affirme (cause, responsabilité, bénéfice) est vrai et cohérent avec les rôles ci-dessous ; une cause qui n\'explique pas réellement la conséquence annoncée est un écart ; (3) ALLUSION : une formule vague qui ne dit pas précisément de quoi il s\'agit (le spectateur ne saurait pas le redire avec ses mots) est un écart ; (5) CTA : la toute dernière réplique de la vidéo contient-elle un verbe d\'action adressé au spectateur (commande, essaie, clique, découvre, commence…) ET le nom du produit ? Si oui, c\'est conforme : ne réclame JAMAIS une adresse web, un lien ou un lieu d\'achat (la fin de la vidéo les porte) et n\'invente jamais d\'URL. C\'est un écart de type cta seulement s\'il manque le verbe d\'action ou le nom du produit (ex. « notre site », « fais-nous une faveur ») ; (6) CONFORMITE : une réplique qui promet un effet, un résultat de santé ou une performance que la synthèse (limites réglementaires, allégations non autorisées, ce qui ne doit jamais être promis) interdit de promettre est un écart de type conformite (le vécu et l\'apport nutritif factuel restent permis) ; (4) TON : le ton annoncé est cohérent avec le sens de la phrase (une mauvaise nouvelle, un aveu ou une peur ne se disent pas sur un ton joyeux ; une solution ou un soulagement ne se disent pas sur un ton sombre). Règles de jugement : un personnage visible à l\'écran dans le clip (personnages_visibles_a_l_ecran) est un référent valide, son prénom adressé à lui ou à elle n\'est pas un référent flottant ; « il te faut X » (il impersonnel) n\'est pas un pronom sans référent ; une réplique de CTA qui contient un verbe d\'action et le nom du produit est conforme même si elle ajoute une courte raison ou une formule de motivation ; un écart n\'existe que si le spectateur resterait avec une question sans réponse, comprendrait de travers ou ne saurait pas quoi faire. Sois strict mais ne signale que ce que tu peux démontrer. Réponds UNIQUEMENT par un JSON {"ecarts":[{"clip":1,"replique":1,"type":"referent|logique|allusion|ton|cta|conformite","probleme":"…","correction":"…"}]}.\nNIVEAU DE CONSCIENCE : ' + (meta && meta.niveau_conscience) + '\nSYNTHESE (pour la conformité) : ' + String(synth || '').slice(0, 24000) + '\nROLES : ' + JSON.stringify(meta && meta.roles) + '\nLa toute dernière réplique de la vidéo est la réplique ' + ((lines[lines.length - 1] || {}).repliques || []).length + ' du clip ' + lines.length + ' : c\'est elle, et elle seule, qui doit porter le CTA ; aucune réplique ne vient après elle.\nREPLIQUES (dans l\'ordre de lecture) : ' + JSON.stringify(lines));
P.steps.push({ etape: 'Contrôle du copywriting (lecteur naïf : référents, logique, allusion, ton)', ecarts: r.ecarts || [] });
        return (r.ecarts || []).map(e => 'Clip ' + e.clip + ' réplique ' + e.replique + ' : copywriting incohérent (' + e.type + ') : ' + e.probleme + ' → ' + e.correction);
      };
      const bAngle = () => { if (!P.bible) return null; const a = P.bible.angles || []; const t = norm((P.meta && P.meta.angle) || p.angle || ''); return a.find(x => t && (norm(x.angle || '').includes(t.slice(0, 25)) || t.includes(norm(x.angle || '').slice(0, 25)))) || null; };
      const bibleSlim = () => P.bible ? { palette_et_produit: P.bible.palette_et_produit, monde_general: P.bible.monde_general, angle: bAngle() || P.bible.angles } : null;
      const useCheck = async plan => {
        if (!P.bible) return [];
        const irs = plan.images_reference || [];
        const items = (plan.clips || []).map((c, i) => ({ clip: i + 1, decor: c.decor, prompt_image: (irs.find(x => x.id === (c.references || [])[0]) || {}).prompt_gemini || null, corps_veo: String(c._corps || c.prompt_veo).replace(/"[^"]*"/g, '"…"'), repliques: (c.repliques || []).map(r => repTexte(r)) }));
        const r = await flashJSON('Tu contrôles que des prompts de clips vidéo TRADUISENT la synthèse au lieu de rester génériques. Voici la bible de traduction (tirée de la synthèse), l\'angle choisi, le niveau de conscience et, pour chaque clip, le prompt de son image de référence, le corps du prompt vidéo et les répliques. Pour CHAQUE clip réponds : visuel_ancre = true si le prompt de l\'image OU le corps contient au moins un détail CONCRET de monde_visuel / monde_general / palette_et_produit (pas un synonyme vague : « modern office » n\'est pas un détail de la bible) ; manque_visuel = ce qu\'il faut ajouter (2 ou 3 détails précis de la bible, adaptés au lieu du clip) si faux ; verbal_ancre = true si au moins une réplique reprend une formule ou le vocabulaire de la cible listés dans formules ; manque_verbal = quelle formule reprendre si faux ; le CTA_AUTORISE dit dans le dernier clip n\'est JAMAIS une violation, et une objection dite par un personnage puis démentie en image n\'en est pas une non plus ; niveau_viol = true seulement si une réplique, une scène ou un objet contredit regle_niveau (prix/offre/garantie/urgence interdits mais présents, ou offre exigée mais absente du dernier clip) OU montre ou dit quelque chose de la liste interdits de la bible (ex. une scène entière bâtie sur un argument interdit) ; raison_niveau. Réponds aussi en global : objection_traitee = true si l\'objection de la bible est dite puis démentie en image quelque part (true aussi s\'il n\'y a pas d\'objection) ; lieux = pour CHAQUE lieu de lieux_ct, le numéro du clip dont le décor est CE lieu (null si ce lieu n\'a aucun clip à lui, ou s\'il est fusionné dans le décor d\'un autre lieu). Réponds UNIQUEMENT par un JSON {"clips":[{"clip":1,"visuel_ancre":true,"manque_visuel":"","verbal_ancre":true,"manque_verbal":"","niveau_viol":false,"raison_niveau":""}],"objection_traitee":true,"lieux":[{"lieu":"…","clip":1}]}.\nNIVEAU : ' + niveau + '\nANGLE : ' + ((P.meta && P.meta.angle) || p.angle || '') + '\nBIBLE : ' + JSON.stringify(bibleSlim()) + '\nREGLE_NIVEAU : ' + JSON.stringify(P.bible.regle_niveau) + '\nINTERDITS : ' + JSON.stringify(P.bible.interdits || []) + '\nCTA_AUTORISE : ' + (P.bible.cta_autorise || '') + '\nLIEUX_CT : ' + JSON.stringify(P.bible.lieux_ct) + '\nCLIPS : ' + JSON.stringify(items));
        P.steps.push({ etape: 'Contrôle d\'usage de la synthèse (prompts à envoyer)', resultat: r });
        const out = [];
        (r.clips || []).forEach(x => { if (x.visuel_ancre === false) out.push('Clip ' + x.clip + ' : usage de la synthèse (visuel) : image et corps restent génériques, sans détail concret de la bible. À ajouter : ' + (x.manque_visuel || '')); if (x.verbal_ancre === false) out.push('Clip ' + x.clip + ' : usage de la synthèse (verbal) : aucune réplique ne reprend les mots de la cible. À reprendre : ' + (x.manque_verbal || '')); if (x.niveau_viol) out.push('Clip ' + x.clip + ' : usage de la synthèse (niveau) : ' + (x.raison_niveau || 'la règle du niveau de conscience n\'est pas respectée')); });
        if (r.objection_traitee === false) out.push('Plan : usage de la synthèse (objection) : l\'objection de la bible n\'est ni dite ni démentie en image : ' + JSON.stringify(((bAngle() || {}).objection) || null));
        const sansClip = (r.lieux || []).filter(x => x.clip == null || x.clip === ''); const nbL = (P.bible.lieux_ct || []).length;
        if (sansClip.length && nbL <= NC) out.push('Plan : lieu du CT absent ou fusionné : « ' + sansClip.map(x => x.lieu).join(' », « ') + ' » n\'a pas son propre décor/clip/image (un lieu distinct du CT = un décor = un clip = une image de référence, 4 décors maximum).');
        else if ((P.bible.lieux_ct || []).length > NC && new Set((plan.clips || []).map(c => c.decor)).size < NC) out.push('Plan : lieu du CT absent ou fusionné : le CT a plus de 4 lieux ; utilise les 4 décors disponibles pour les 4 lieux les plus importants et consigne la fusion des autres.');
        return out;
      };
      const fullCheck = async plan => { // les trois contrôles Flash tournent en parallèle (gain de temps)
        plan._nc = NC; plan._fiche = plan._fiche || P._fiche || null; plan._ct_hook = (typeof sigCT !== 'undefined' && sigCT && sigCT.hook) || '';
        const v = validatePlan(plan, p.synthese, P);
        if (!CONTROLES) {   // v6.77 : par defaut, les controles de code + UNE relecture du copywriting par un lecteur naif (Flash, ~0,01 $) ; COPY_CHECK=0 la coupe
          if (process.env.COPY_CHECK === '0') return v;
          const cp0 = await copyCheck(plan, P.meta, p.synthese).catch(e => { log('Relecture du copywriting indisponible (' + String(e.message || e).slice(0, 80) + ').'); return []; });
          cp0.forEach(x => v.push(x)); return v;
        }
        const [cp, us, sc] = await Promise.all([
          copyCheck(plan, P.meta, p.synthese).catch(e => { log('Contrôle du copywriting indisponible (' + String(e.message || e).slice(0, 80) + ').'); return []; }),
          useCheck(plan).catch(e => { log('Contrôle d\'usage de la synthèse indisponible (' + String(e.message || e).slice(0, 80) + ').'); return []; }),
          sceneCheck(plan).catch(e => { log('Contrôle de scène indisponible (' + String(e.message || e).slice(0, 80) + ').'); return []; })]);
        cp.forEach(x => v.push(x)); us.forEach(x => v.push(x)); sc.forEach(x => { if (!v.includes(x)) v.push(x); });
        return v;
      };
      // Le code assemble les prompts (en-tête identique : style + fiches + voix + silences) et attribue les images par décor
      let sigDite = false;
      let scriptDit = false;
      const fixPlan = plan => {
        plan._nc = NC; plan._modele = p.model || null;
        if (Array.isArray(P._script) && P._script.length === NC) {   // v6.16 — le texte validé est la référence, pas ce que le réalisateur a réécrit
          let change = 0;
          (plan.clips || []).forEach(c2 => {
            const b = Number(c2.bloc); if (!(b >= 1 && b <= NC)) return;
            const voulu = P._script[b - 1] || [], tons = (P._scriptTons || [])[b - 1] || [];
            const actuel = (c2.repliques || []).map(r => repTexte(r));
            if (norm(actuel.join(' ')) === norm(voulu.join(' '))) return;
            const loc = ((c2.repliques || [])[0] || {}).locuteur || null;
            c2.repliques = voulu.map((t2, k2) => Object.assign({}, loc ? { locuteur: loc } : {}, { texte: t2, ton: (tons[k2] || {}).ton || ((c2.repliques || [])[k2] || {}).ton || 'natural', geste: (tons[k2] || {}).geste || null, emotion: (tons[k2] || {}).emotion || ((c2.repliques || [])[k2] || {}).emotion || null }));
            c2._corps = null; c2._assembled = false;   // le corps du prompt doit être réassemblé avec le bon texte
            change++;
          });
          if (change && !scriptDit) { scriptDit = true; log('Texte réimposé au plan : ' + change + ' clip(s) où le réalisateur avait réécrit les répliques — c\'est le texte validé par le copywriting qui est dit, mot pour mot.'); }
        }
        if (sigCT.style && norm(String(plan.style_visuel || '')) !== norm(sigCT.style)) { plan._styleAgent = plan.style_visuel || null; plan.style_visuel = sigCT.style; if (!sigDite) { sigDite = true; log('Signature visuelle : celle déclarée par le CT est imposée (le style écrit par le directeur est écarté) — « ' + sigCT.style.slice(0, 110) + '… ».'); } }
        if (sigCT.cadrage) plan._cadrage = sigCT.cadrage;
        if (sigCT.lieu) plan._lieuCT = sigCT.lieu;
        if (sigCT.interdits && sigCT.interdits.length) plan._lieuxInterdits = sigCT.interdits;
        plan._fiche = P._fiche || null;   // v6.41 : la fiche produit lue sur la photo suit le plan jusqu'aux prompts Veo
        return assemblePrompts(assignRefs(plan), false, log);
      };
      fixPlan(P.plan);
      let viol = await fullCheck(P.plan), auditV = [];
      save('02a_controle_initial.json', { regles_codees: viol }); P.violations_initiales = viol.slice();
      // Porte bloquante : une seule correction ciblée si une erreur de fond subsiste (lieux, images, structure) ; sinon on s'arrête AVANT de payer Veo
      // ---- retouche chirurgicale : on ne réécrit que les répliques/corps/prompts d'image des clips en écart, tout le reste du plan est conservé tel quel
      const patchPlan = async (plan, items) => {
        const nums = new Set(); items.forEach(x => { const m = String(x).match(/Clip (\d+)/); if (m) nums.add(parseInt(m[1], 10)); });
        const irs = plan.images_reference || [];
        const targets = [...nums].filter(n => plan.clips[n - 1]).map(n => { const c = plan.clips[n - 1], ir = irs.find(i => i.id === (c.references || [])[0]); return { clip: n, decor: c.decor, personnages_visibles: c.personnages_visibles, plans: c.plans, repliques: c.repliques, corps: c._corps || c.prompt_veo, image_id: ir && ir.id, prompt_image: ir && ir.prompt_gemini }; });
        if (!targets.length) return false;
        const ask = 'Tu es le correcteur chirurgical d\'un plan de publicité vidéo. Ci-dessous : les ÉCARTS à lever, les clips concernés (répliques, corps du prompt vidéo, prompt de l\'image de référence), l\'histoire complète dans l\'ordre (lecture seule) et la bible de traduction. Si un écart porte sur `transposition`, tu renvoies le tableau `transposition` complet (une entrée par bloc : `bloc`, `preuve` — ce que le bloc doit PROUVER au spectateur —, `geste` — le geste réel de CE produit qui le prouve, filmable en 8 s —, `equivalence` quand le geste du CT était impossible) ; un bloc dont le geste se résume à quelqu\'un qui parle est refusé, et les quatre gestes doivent être différents et progresser. Tu ne modifies QUE ce qui est nécessaire pour lever chaque écart ; tout le reste de chaque clip (décor, plans, horodatage, gestes, personnages, lumière) reste IDENTIQUE mot pour mot. Quand tu changes une réplique, tu la changes aussi dans le corps (entre guillemets, au même endroit), avec un `ton` cohérent avec son sens. Règles : chaque réplique de 4 à 12 mots, 24 à 28 mots de voix par clip, au plus 4,2 mots par seconde de plan ; chaque réplique se comprend seule (aucun référent flottant) ; CHAQUE PHRASE OUVRE LA SUIVANTE : après correction, le test de permutation doit échouer (si on peut échanger deux phrases voisines sans rien casser, l\'enchaînement est raté) ; aucun point d\'interrogation ni d\'exclamation dans une réplique (le modèle vocal les prononce) ; ON PARLE, ON N\'EXPLIQUE PAS : aucun mot de liaison de l\'écrit (donc, parce que, c\'est-à-dire, en effet, au total, ainsi) — on énonce et on enchaîne ; JAMAIS DEUX FOIS LA MÊME IDÉE : si un fait est déjà dit, ne le redis pas autrement, coupe ; au passé et vécu, jamais au conditionnel ; aucun superlatif qui ne soit suivi immédiatement de la chose qui le justifie ; aucun jugement sur l\'offre (« c\'est une super affaire ») à la place d\'une réaction vécue ; la dernière phrase congédie avec complicité au lieu de mettre la pression ; TU COUPES DES MOTS, JAMAIS L\'ÉMOTION : un texte rendu conforme mais devenu plat est refusé ; le dernier clip se termine par `cta_autorise` (verbe d\'action + nom du produit, sans lieu d\'achat ni urgence) ; aucun élément de `interdits` ; chaque clip se suffit à lui-même (aucune mention d\'un autre clip). Réponds UNIQUEMENT par un JSON {"clips":[{"clip":N,"repliques":[{"locuteur":"…","texte":"…","ton":"…"}],"corps":"corps complet du prompt vidéo, même structure"}],"images":[{"id":"…","prompt_gemini":"prompt complet si un écart visuel l\'exige, sinon omets"}]} limité aux clips listés.\n\nÉCARTS :\n- ' + items.join('\n- ') + '\n\nCLIPS A RETOUCHER : ' + JSON.stringify(targets) + '\n\nHISTOIRE COMPLETE (lecture seule) : ' + JSON.stringify((plan.clips || []).map((c, i) => ({ clip: i + 1, repliques: (c.repliques || []).map(r => repTexte(r)) }))) + '\n\nBIBLE : ' + JSON.stringify(P.bible ? { cta_autorise: P.bible.cta_autorise, regle_niveau: P.bible.regle_niveau, interdits: P.bible.interdits, formules: (bAngle() || {}).formules } : null);
        let r, lastErr; for (const [mx, th] of [[12000, 2048], [20000, 0]]) { try { const g = await vjson(HOSTP, PRO, { contents: [{ role: 'user', parts: [{ text: ask }] }], generationConfig: { temperature: 0.3, maxOutputTokens: mx, thinkingConfig: { thinkingBudget: th }, responseMimeType: 'application/json' } }); r = JSON.parse(textOf(g)); break; } catch (e) { lastErr = e; } }
        if (!r) { log('Retouche chirurgicale indisponible (' + String((lastErr && lastErr.message) || lastErr).slice(0, 80) + ').'); return false; }
        let n = 0; const applied = [];
        (r.clips || []).forEach(x => { const c = plan.clips[(x.clip | 0) - 1]; if (!c || !Array.isArray(x.repliques) || !x.repliques.length || !x.corps) return;
          if (!x.repliques.every(rp => String(x.corps).includes(repTexte(rp)))) { log('Retouche du clip ' + x.clip + ' ignorée : une réplique ne figure pas entre guillemets dans le corps.'); return; }
          c.repliques = x.repliques; c.prompt_veo = x.corps; c._corps = x.corps; c._assembled = false; c.mots = x.repliques.map(rp => repTexte(rp)).join(' ').split(/\s+/).filter(Boolean).length; n++; applied.push(x.clip); });
        if (Array.isArray(r.transposition) && r.transposition.length) { plan.transposition = r.transposition; n++; }   // v6.36 : la transposition fait partie du plan, le correcteur doit pouvoir la rendre
        (r.images || []).forEach(x => { const ir = irs.find(i => i.id === x.id); if (ir && x.prompt_gemini && String(x.prompt_gemini).length > 80) ir.prompt_gemini = x.prompt_gemini; });
        P.steps.push({ etape: '2b. Retouche chirurgicale', clips_modifies: applied, ecarts: items.length }); save('02b_retouche_chirurgicale.json', r);
        return n > 0;
      };
      // v6.2 — un tour de correction par défaut : ces écarts garantissent sinon un run payé pour rien (images jamais envoyées,
      // prompt tronqué, réplique absente du prompt). Un seul tour : une relance de plan coûte une requête texte, pas un clip Veo.
      const MAXTOURS = parseInt(process.env.CORRECTION_TOURS || '1', 10);
      let blocking = viol.filter(x => BLOQUANT.test(x));
      const needFix = () => blocking.length || viol.some(x => /\[VEO\]|\[PARTITION\]|usage de la synthèse|lieu du CT|allusion dans|pronom sans référent|copywriting incohérent|mots de voix|mots\/s|une réplique de \d+ mots|n'est attribuée à aucun clip|partagent l'image|prompt assemblé de|n'apparaît pas entre guillemets|plans non contigus|portent le même identifiant de décor|mais son prompt d'image ne le décrit pas/.test(x));
      for (let tour = 1; tour <= MAXTOURS && needFix(); tour++) {
        const all = viol.filter(x => BLOQUANT.test(x) || /\[VEO\]|\[PARTITION\]|fiche_personnage|décrit comme parlant|parle mais n'est pas|usage de la synthèse|lieu du CT|allusion dans|pronom sans référent|copywriting incohérent|champ ton manquant|mots de voix|mots\/s|une réplique de \d+ mots|n'est attribuée à aucun clip|partagent l'image|prompt assemblé de|n'apparaît pas entre guillemets|plans non contigus|portent le même identifiant de décor|mais son prompt d'image ne le décrit pas/.test(x));
        const PATCHABLE = /\[VEO\]|copywriting incohérent|usage de la synthèse \((?:verbal|niveau|visuel)\)|mots de voix|mots\/s|une réplique de \d+ mots|dépend d'un autre clip|champ ton manquant/;
        const structural = all.filter(x => !PATCHABLE.test(x));
        if (!structural.length && all.length) { // écarts de phrase ou de prompt seulement : retouche chirurgicale, le reste du plan reste identique mot pour mot
          log('Porte de contrôle : ' + all.length + ' écart(s) localisé(s) → retouche chirurgicale (seuls les clips concernés sont modifiés).');
          const done = await patchPlan(P.plan, all);
          if (done) { P.raw = '===META===\n' + JSON.stringify(P.meta) + '\n===PLAN_VIDEO===\n' + JSON.stringify(P.plan, (k, v) => (k[0] === '_' ? undefined : v)); fixPlan(P.plan); viol = await fullCheck(P.plan); blocking = viol.filter(x => BLOQUANT.test(x)); continue; }
        }
        log('Porte de contrôle : ' + all.length + ' écart(s) de fond (lieux, images, copywriting) → une correction ciblée demandée.');
        const g2 = await callDir([{ role: 'user', parts }, { role: 'model', parts: [{ text: P.raw }] }, { role: 'user', parts: [{ text: 'Contrôle : ces écarts sont à corriger, sans rien casser d\'autre. Un clip = un seul lieu où les personnages sont visibles, et son corps ne décrit que le lieu de son image : un changement de décor tombe sur la frontière entre deux clips, jamais à l\'intérieur (redistribue les fonctions du CT autour de cette frontière) ; un personnage ne fait que ce que son corps permet ; `prompt_veo` = corps seulement (le code ajoute style, fiches, voix) ; chaque personnage visible a sa fiche dans `fiches_personnages` ; applique la BIBLE DE TRADUCTION (détails concrets de la synthèse dans les images et les clips, mots de la cible dans les répliques, chaque clip a SA PROPRE image de référence — un décor est un état de départ, pas une pièce : même lieu avec des objets différents = deux décors et deux images ; une image qu\'aucun clip n\'utilise est à supprimer ou à attribuer ; 4 images maximum). Réémets la sortie COMPLÈTE (===META=== puis ===PLAN_VIDEO===), même format :\n- ' + all.join('\n- ') }] }], 16384);
        const raw2 = textOf(g2), f2 = fin(g2); save('02b_direction_correction_' + tour + '_brute.txt', raw2);
        P.steps.push({ etape: '2b. Correction ciblée', chars: raw2.length, finishReason: f2.finishReason, tokens: f2.usage });
        if (f2.finishReason && f2.finishReason !== 'STOP') throw new Error('CORRECTION TRONQUÉE (finishReason = ' + f2.finishReason + ')');
        [P.meta, P.plan] = parse(raw2); P.raw = raw2; fixPlan(P.plan); viol = await fullCheck(P.plan); blocking = viol.filter(x => BLOQUANT.test(x));
      }
      const auditP = CONTROLES ? audit(P.plan, P.meta).catch(e => { P.steps.push({ etape: 'Audit en échec', erreur: String(e.message || e) }); return []; }) : Promise.resolve([]);
      if (/lite/.test(p.model) && P.refMode !== 'aucune') log('Modèle Lite : les images de référence sont bien générées et envoyées comme PREMIÈRE IMAGE de chaque clip (Lite ne porte que le bloc « images-assets », que le code n\'utilise pas).');
      if (p.planOnly) { auditV = await auditP; viol = viol.concat(auditV); }
      else auditP.then(a => { P.audit_llm = a; P.violations = (P.violations || []).concat(a); save('03b_audit_llm.json', a); log('Audit indépendant (en parallèle) : ' + a.length + ' remarque(s), voir 03b_audit_llm.json.'); });
      P.violations = viol; save('03_plan.json', { meta: P.meta, plan: P.plan, violations: viol });
      log('Plan : ' + (P.plan.clips || []).length + ' clips, ' + (P.plan.images_reference || []).length + ' image(s) de référence. ' + (viol.length ? 'Remarques non bloquantes (à lire, rien n est corrigé ni bloqué) : ' + viol.length : 'Contrôle automatique : conforme.'));
      P.steps.push({ etape: '3. Plan validé', clips: (P.plan.clips || []).map(c => ({ bloc: c.bloc, mots_voix: (c.repliques || []).map(repTexte).join(' ').split(/\s+/).filter(Boolean).length, mots_prompt_veo: String(c.prompt_veo || '').split(/\s+/).filter(Boolean).length })), ecarts: viol });
      if (p.planOnly) { P.state = 'done'; P.stage = 'plan seulement'; await coutFinal(P, log, save); return; }
      if (blocking.length) throw new Error('PLAN BLOQUÉ AVANT VEO (aucun coût engagé) : ' + blocking.join(' || '));

      // v6.2 — ACCENT : Veo rend un accent national nommé en caricature, ou l'ignore et produit autre chose.
      // L'identité de la voix se décrit par des traits physiques ; la langue des répliques suffit à situer le personnage.
      // On retire donc toute mention d'accent national/régional de la description de voix, avant qu'elle ne soit collée dans les prompts.
      (P.plan.voix || []).forEach(v => {
        const av = String(v.description_exacte || '');
        const ap = av
          .replace(/\(([^)]*\b(accent|accented)\b[^)]*)\)/gi, '')
          .replace(/\b(with|in)\s+an?\s+[A-Za-zÀ-ÿ'\- ]{2,30}\s+accent\b/gi, '')
          .replace(/\b[A-Za-zÀ-ÿ'\-]{3,20}\s+accent(ed)?\b/gi, '')
          .replace(/\baccent\s+(from|of)\s+[A-Za-zÀ-ÿ'\- ]{2,30}/gi, '')
          .replace(/\s{2,}/g, ' ').replace(/\s+([,.;])/g, '$1').replace(/,\s*,/g, ',').trim();
        if (ap && ap !== av) { v.description_exacte = ap; log('Voix « ' + (v.personnage || '?') + ' » : mention d\'accent retirée (Veo la rend en caricature). Identité conservée : ' + ap.slice(0, 90)); }
      });
      // ---- images de référence : une par décor, dans l'ordre des clips ; chacune reçoit l'image précédente SEULEMENT si le plan déclare une suite logique (suite_de)
      P.stage = 'images de référence';
      // v6.19 — Lite accepte bien une PREMIÈRE IMAGE (c'est le bloc referenceImages/assets qu'il refuse, et le code
      // ne l'utilise plus pour lui). L'ancienne garde sautait toute la planche : les clips partaient sans image.
      const useRefs = P.refMode !== 'aucune';
      const genImgs = {}; // id -> { data, mime }
      if (useRefs && P.refMode === 'complet') {
        let irs = (P.plan.images_reference || []).slice(0, NC);
        if (clipSel(p.onlyClip)) { // test partiel : on ne génère que les images des clips choisis et la chaîne d'images dont elles dépendent
          const need = new Set(); const sel = clipSel(p.onlyClip);
          const add = id => { if (!id || need.has(id)) return; need.add(id); const ir = irs.find(x => x.id === id); if (ir) add(ir.suite_de); };
          sel.forEach(n => ((P.plan.clips || [])[n - 1] && (P.plan.clips[n - 1].references || []) || []).forEach(add));
          irs = irs.filter(x => need.has(x.id));
        }
        P.plan._imgDesc = P.plan._imgDesc || {};
        const describeImg = async ir => {
          try {
            const names = (ir.personnages || []).filter(q => !isProductNode(q));
            const dg = await vjson(`${LOCATION}-aiplatform.googleapis.com`, `/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-2.5-flash:generateContent`, { contents: [{ role: 'user', parts: [{ inlineData: { mimeType: genImgs[ir.id].mime, data: genImgs[ir.id].data } }, { text: 'Describe ONLY what is visible in this image, in English, as concrete physical facts for a video director. Return ONLY JSON: {"decor":"…max 60 words: type of room, wall and floor colors, furniture and its position (left/right/foreground/background), objects, windows, light direction and color, mood of light","personnages":{' + names.map(n => JSON.stringify(n) + ':"…max 50 words: apparent size RELATIVE to the furniture and to the other characters (e.g. as tall as the laptop, taller than the chair), position in the frame, body build, skin or material, face, hairstyle, outfit with colors, hands, current posture"').join(',') + '}' + (hasProduct(ir) ? ',"produit":"…max 50 words: the product object visible in the image: shape, proportions, colors, cap, packaging, label layout and colors (do not transcribe text), size relative to the hands and furniture, who holds it or where it stands"' : '') + '}. No interpretation, no guesses, no text.' }] }], generationConfig: { temperature: 0, maxOutputTokens: 2048, responseMimeType: 'application/json' } });
            const d = JSON.parse(textOf(dg)); P.plan._imgDesc[ir.id] = d; save('04_ref_' + ir.id + '_description.json', d);
            P.steps.push({ etape: '4b. Description de l\'image ' + ir.id + ' (source des textes Veo)', ...d });
          } catch (e) { log('Description de l\'image ' + ir.id + ' indisponible (' + String(e.message || e).slice(0, 80) + ') : fiches de l\'agent conservées.'); }
        };
        const directImage = async (ir, parentDesc, manque) => {
          const users = (P.plan.clips || []).filter(c => (c.references || [])[0] === ir.id);
          const fich = {}; (P.plan.fiches_personnages || []).forEach(f => { fich[norm(f.nom)] = f.description_physique; });
          const brief = { lieu_impose_par_le_CT: sigCT.lieu || null, lieux_refuses_par_le_CT: sigCT.interdits && sigCT.interdits.length ? sigCT.interdits : null, decor_id: ir.decor, role: ir.role, contenu: ir.contenu, personnages: ir.personnages, brief_de_l_agent: ir.prompt_gemini, style_visuel: P.plan.style_visuel, fiches_personnages: (ir.personnages || []).map(n => { const pk = parentDesc && parentDesc.personnages && Object.keys(parentDesc.personnages).find(k => norm(k) === norm(n)); return { nom: n, fiche: fich[norm(n)] || null, identite_fixee_par_image_precedente: pk ? parentDesc.personnages[pk] : null }; }), description_image_precedente: parentDesc || null, elements_obligatoires_issus_de_la_synthese: P.bible ? { palette_et_produit: P.bible.palette_et_produit, monde_general: P.bible.monde_general, monde_visuel_angle: (bAngle() || {}).monde_visuel || null } : null, a_corriger_absolument: manque || null, clips_qui_utilisent_cette_image: users.map(c => ({ bloc: c.bloc, etat_lumineux: c.etat_lumineux, produit_visible: c.produit_visible, personnages_visibles: c.personnages_visibles, debut_du_clip: String(c._corps || '').slice(0, 700) })) };
          const dg = await vjson(`${LOCATION}-aiplatform.googleapis.com`, `/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-2.5-pro:generateContent`, { contents: [{ role: 'user', parts: [{ text: 'Tu es le directeur artistique des images de référence d\'une publicité vidéo. Tu écris UN prompt d\'image en anglais, 300 à 420 mots, MILLIMÉTRÉ. Cette image sera la toute première image exacte d\'un clip de 8 s : un modèle vidéo va l\'animer sans rien inventer, donc tout ce qui n\'est pas précisé sera inventé au hasard. Tu pars du brief ci-dessous, tu en gardes tout le contenu sans rien retirer ni ajouter comme personnage ou objet, tu précises tout le reste.\nSections obligatoires, dans cet ordre, en phrases courtes, un fait par phrase, avec des chiffres (pourcentages du cadre, distances, tailles relatives) :\n1. CAMERA ET CADRAGE : vertical 9:16 ; hauteur et angle de caméra, distance, focale approximative ; où se tient chaque sujet dans le cadre (% depuis la gauche, % depuis le haut) ; ce qui est coupé par les bords.\n2. LIEU : nature du lieu, dimensions approximatives, matériaux et couleurs du sol, des murs, du plafond ; ouvertures (position, ce qu\'on voit à travers) ; CHAQUE meuble et objet avec sa position, sa taille, sa matière, sa couleur, son état (rangé/en désordre, neuf/usé) ; arrière-plan.\n3. LUMIERE : sources, direction, température de couleur, intensité, ombres, atmosphère ; conforme à l\'état lumineux demandé par les clips.\n4. PERSONNAGES : pour chacun : position exacte, posture, direction du regard, ce que fait chaque main, expression du visage, traits, teint de peau, coiffure, vêtements pièce par pièce avec couleurs et tissus, accessoires, TAILLE par rapport à des objets nommés et aux autres personnages (jamais une taille absolue vague) ; pour un personnage non humain : matière, surface, comment son visage se forme, parties du corps utilisables. IDENTITÉ : si description_image_precedente est fournie, pour chaque personnage COMMUN tu NE redécris PAS son identité (ni visage, ni teint, ni coiffure ou coiffe, ni corpulence, ni matière, ni forme, ni taille relative) : tu écris « same <nom> as in the reference image » puis seulement sa position, sa posture, son regard, ses mains et son expression ; sa tenue et sa coiffe restent IDENTIQUES à l\'image précédente (copie-les mot pour mot depuis identite_fixee_par_image_precedente) sauf si le brief impose explicitement une autre tenue pour ce lieu ; un personnage non humain garde exactement la même forme, matière, visage et échelle (jamais un autre objet : une tasse ne devient pas une carafe). Pour un personnage NOUVEAU, tu pars des fiches. Toute formule d\'hésitation du brief ou des fiches (souvent, ou, par exemple, peut-être) est tranchée en UNE valeur unique, sans alternative.\n5. POSE DE DEPART : la pose correspond exactement à la première seconde du clip (debut_du_clip).\n6. STYLE : recopie style_visuel mot pour mot.\n7. EXCLUSIONS : aucun texte, lettre, chiffre, logo, étiquette, légende ; aucune autre personne ni autre objet que ceux listés' + '.\nLIEU IMPOSÉ PAR LE CT — PREMIÈRE CONTRAINTE, AVANT TOUTE AUTRE : si lieu_impose_par_le_CT est rempli, le lieu que tu décris est CELUI-LÀ et rien d\'autre. Ce lieu n\'est pas un décor interchangeable : c\'est le mécanisme du CT. Il porte ce que la scène doit prouver — les objets qu\'on y trouve, ce qu\'on y fait, qui y entre, ce qui s\'y voit. Changé, le CT ne démontre plus rien. Tu ne remplaces JAMAIS ce lieu par le lieu de travail du persona (bureau, open-space, salle de réunion, salle de pause) sous prétexte que la synthèse parle de son travail : le métier du persona décrit QUI il est, pas OÙ cette scène se passe. Tout lieu listé dans lieux_refuses_par_le_CT est interdit, même en arrière-plan, même suggéré par une fenêtre ou un objet. Ce que la synthèse apporte à ce lieu, c\'est son CONTENU réel — le pays, le quartier, les matériaux, le mobilier, les objets du quotidien, la lumière, les tenues — jamais sa nature.\nELEMENTS OBLIGATOIRES : intègre dans le prompt au moins 3 détails concrets de elements_obligatoires_issus_de_la_synthese qui conviennent à CE lieu (objets, tenues, matières, lumière, couleurs de la palette), tels quels, avec leur position dans le cadre ; si a_corriger_absolument est rempli, ce sont les détails manquants à ajouter. CONTEXTE REEL : le lieu, l\'architecture, les matériaux, les objets, la lumière naturelle, les tenues, les teints, les coiffures et les détails du quotidien doivent correspondre au marché, au persona et aux codes visuels de la SYNTHESE ci-dessous (pays, ville, quartier, milieu social, métier, climat). Tu retiens les détails concrets que la synthèse fournit ; tu refuses tout décor générique de banque d\'images étrangère qui ne correspond pas à ce contexte. Si le brief de l\'agent contredit le contexte réel, le contexte réel l\'emporte, sans changer la liste des personnages ni la fonction du lieu.\nRéponds UNIQUEMENT par le prompt final, sans titre ni commentaire.\n\n=== BRIEF ===\n' + JSON.stringify(brief) + '\n\n=== SYNTHESE ===\n' + p.synthese }] }], generationConfig: { temperature: 0.4, maxOutputTokens: 6000, thinkingConfig: { thinkingBudget: 2048 } } });
          const t = textOf(dg).trim(); if (t.length < 400) throw new Error('prompt d\'image trop court'); return t;
        };
        const identFails = [];
        // ───────── PLANCHE DE RÉFÉRENCE : les 4 décors sont dessinés dans UNE SEULE image (grille 2x2), puis découpés par le code.
        // Une seule génération = un seul « cerveau » pour les personnages : leur identité ne peut plus dériver d'un décor à l'autre,
        // là où quatre générations enchaînées redessinaient un visage et un objet différents à chaque fois.
        const directPlanche = async (panels, rappel) => {
          const fich = {}; (P.plan.fiches_personnages || []).forEach(x => { fich[norm(x.nom)] = x.description_physique; });
          const noms = [...new Set(panels.reduce((a, ir) => a.concat(ir.personnages || []), []))];
          const brief = {
            style_visuel: P.plan.style_visuel,
            personnages_recurrents: noms.map(n => ({ nom: n, non_humain: isProductNode(n), fiche: fich[norm(n)] || null })),
            lieu_impose_par_le_CT: sigCT.lieu || null, lieux_refuses_par_le_CT: sigCT.interdits && sigCT.interdits.length ? sigCT.interdits : null,
            fiche_produit_lue_sur_la_photo: P._fiche ? { apparence: P._fiche.description_en, contenu_tel_que_vendu: P._fiche.contenu || null, pose_a_cote_sur_la_photo_HORS_SCENE: P._fiche.hors_contenant || null, etiquette: P._fiche.conflit ? 'NO legible brand name: same label shape, same background colour, same position, but the lettering is not readable' : 'label exactly as in the attached product photo' } : null,
            elements_obligatoires_issus_de_la_synthese: P.bible ? { palette_et_produit: P.bible.palette_et_produit, monde_general: P.bible.monde_general, monde_visuel_angle: (bAngle() || {}).monde_visuel || null } : null,
            boussole_sensorielle_PRIME_SUR_LA_LUMIERE_ET_LE_JEU_DU_CT: P.boussole ? { destination: P.boussole.destination, registre: P.boussole.registre, arc: P.boussole.arc, lumiere: P.boussole.lumiere_en, jeu: P.boussole.jeu_en, camera: P.boussole.camera_en, miroir_persona: P.boussole.miroir_persona } : null,
            panneaux: panels.map((ir, i) => { const us = (P.plan.clips || []).filter(c => (c.references || [])[0] === ir.id); return { panneau: i + 1, decor_id: ir.decor, role: ir.role, contenu: ir.contenu, personnages: ir.personnages, produit_dans_le_panneau: hasProduct(ir), brief_de_l_agent: ir.prompt_gemini, etat_lumineux: us.map(c => c.etat_lumineux), debut_du_clip: String((us[0] || {})._corps || '').slice(0, 600), rendu: (us[0] || {}).rendu || 'veo', cadrage: (us[0] || {}).cadrage || null, emotion: (us[0] || {}).emotion || null, intention: (us[0] || {}).intention || null }; })
          };
          const sys = 'Tu es le directeur artistique d\'une publicité vidéo. Tu écris UN SEUL prompt d\'image, en anglais, pour une PLANCHE : une image unique partagée en 4 panneaux (grille 2x2) où chaque panneau est la première image exacte d\'un clip de 8 s. Les mêmes personnages reviennent dans plusieurs panneaux : comme ils sont dessinés dans la même image, leur identité est garantie — tu les décris donc UNE SEULE FOIS, en détail, dans la section CHARACTERS, et JAMAIS une deuxième fois dans les panneaux (dans un panneau tu ne donnes que la position, la posture, le regard, les mains, l\'expression et, si le lieu l\'impose, la tenue).\n'
            + 'Structure imposée de ta réponse, en phrases courtes, un fait par phrase, avec des chiffres (pourcentages du cadre, tailles relatives) :\n'
            + 'CHARACTERS (une seule fois pour toute la planche) : pour chaque personnage, traits du visage, teint, coiffure ou coiffe, corpulence, tenue du lieu principal pièce par pièce avec couleurs et tissus (les autres lieux ont leur propre tenue, écrite dans leur panneau), accessoires, taille par rapport aux autres personnages et à un meuble courant ; pour un personnage non humain : matière, forme exacte de son corps, comment son visage se forme, membres utilisables, taille relative. Tu tranches toute hésitation des fiches (souvent, ou, peut-être) en UNE valeur unique. Tu ajoutes : "These same individuals appear in every panel, identical in face, skin tone, hair, build and proportions."\n'
            + 'PRÉSENCE — RÈGLE PREMIÈRE : chaque panneau contient TOUS les personnages listés pour lui, sans exception. Le modèle vidéo part de cette image : un personnage absent de l\'image n\'existera pas dans le clip et sa réplique ira à quelqu\'un d\'autre. Aucune autre règle ne justifie d\'en retirer un : si une contrainte de cadrage te gêne, tu changes l\'angle, pas la liste des personnages.\n'
            + 'CADRAGE — UNE SEULE BOUCHE TOURNÉE VERS LA CAMÉRA : le modèle vidéo fait parler le visage qu\'il voit de face. Dans chaque panneau, le personnage qui PARLE est au premier plan, net, entièrement visible, tourné vers la caméra, et occupe au moins 40 % de la hauteur du cadre (sur un téléphone, un locuteur plus petit est illisible, et un visage trop petit pousse le modèle vidéo à fabriquer une tête supplémentaire pour porter la parole) — quelle que soit sa nature, humaine ou non. Tous les personnages qui NE parlent pas dans ce clip sont présents mais détournés : vus de dos, de profil franc, ou cadrés de telle sorte que leur bouche n\'est pas visible, à l\'arrière-plan, plus petits et en légère profondeur de champ. Leur émotion passe par la posture, les épaules, les mains et la nuque. Ainsi la seule bouche offerte à la caméra est celle du locuteur.\n'
            + 'PERSONNAGE PERSONNIFIÉ (objet qui parle) : son visage fait partie de son corps — des yeux et une bouche en relief sur sa propre surface, assez grands pour être lus sur un téléphone (la bouche occupe au moins un dixième de la hauteur de l\'objet), jamais un visage imprimé ou dessiné à plat comme un autocollant. Il garde dans les quatre panneaux exactement la même forme, la même matière, le même visage, les mêmes membres, les mêmes accessoires et la même taille par rapport à un objet nommé du décor : tu écris cette taille de référence une fois et tu la répètes dans chaque panneau. Un visage trop petit ou trop plat force le modèle vidéo à inventer une tête humaine flottante pour porter la parole.\n'
            + 'RAPPEL D\'IDENTITÉ DANS CHAQUE PANNEAU — RÈGLE QUI PRIME SUR LA BRIÈVETÉ : décrire les personnages une seule fois en tête ne suffit pas, le modèle d\'image oublie en descendant la grille et redessine un autre visage, une autre coiffure, une autre tenue. CHAQUE panneau commence donc par une ligne qui ré-ancre chaque personnage présent : « Same <nom> as described above: same face, same skin tone, same <coiffure exacte>, wearing <la tenue de CE panneau, couleur et matière> ». Tu RECOPIES la coiffure mot pour mot depuis la section CHARACTERS. LA TENUE SUIT LE LIEU (v6.51) : chaque panneau donne la tenue que cette personne porte VRAIMENT dans ce lieu à cette heure — lit, nuit, réveil : tenue de nuit ; cuisine ou salon le matin : tenue d\'intérieur propre ; bureau, réunion, rendez-vous, rue, transport : tenue de ville ou de travail du marché de la synthèse (chemise ou polo, pantalon ou tenue longue, chaussures fermées) — JAMAIS short, débardeur, tee-shirt de nuit ni claquettes au bureau. Visage, teint, coiffure, corpulence ne changent jamais ; la tenue change avec le lieu, et reste identique entre deux panneaux du MÊME lieu. La tenue écrite dans la fiche personnage est celle du lieu principal : pour un autre lieu tu la remplaces par celle qui convient.\n'
            + (MINI_RUN ? 'PLANS COURTS (v6.53) : chaque panneau est la première image d\'un plan de 2 à 3 secondes. Le geste du plan y est DÉJÀ ENGAGÉ (le doigt déjà sur la peau sous l\'œil cerné, la main déjà sur la tempe, la bouche déjà ouverte sur un bâillement, le flacon déjà débouché), et le cadrage est CELUI DU PANNEAU (`cadrage`) : un très gros plan montre l\'œil cerné et le doigt qui tire la peau, un gros plan montre le visage et la main qui le touche, un insert montre les mains et l\'objet. L\'ÉMOTION du panneau (`emotion`) est jouée avec la force d\'un long-métrage d\'animation 3D : grande, lisible, tout le visage et tout le corps. Plusieurs personnages peuvent partager un panneau (le héros éveillé, sa compagne endormie à côté ; la famille au réveil) : le héros au premier plan, les autres entiers, bouches fermées.\n'
              + 'PANNEAU `rendu: insert` — IMAGE CONÇUE POUR CONVAINCRE : ce n\'est pas une scène de vie, c\'est une image de preuve ou de produit, composée comme une affiche de campagne haut de gamme dans le MÊME registre de rendu que le film : une carte stylisée du pays d\'origine en relief, propre et illustrative, avec un repère discret (jamais un nom ni une lettre) ; les composants réels du produit disposés en nature morte de studio autour du produit ; un laboratoire propre et lumineux avec le produit au premier plan ; le produit héros sur une matière noble avec une lumière de studio. Composition centrée, sujet net qui remplit le cadre, fond qui respire. AUCUN texte, aucun chiffre, aucune lettre : la preuve se lit par l\'image, le texte arrive par les sous-titres.\n' : '')
            + 'ACTION EN COURS, JAMAIS UNE POSE — v6.42. Chaque panneau saisit son personnage AU MILIEU D\'UN GESTE : le poids sur une jambe, les mains occupées par ce qu\'il fait, le regard sur son action, le corps engagé dans le mouvement que le clip va continuer. JAMAIS un portrait posé face à l\'objectif, jamais quelqu\'un planté de face qui présente un objet à la caméra, jamais un buste immobile qui sourit. Une pose pour la caméra ne s\'anime pas : le modèle vidéo n\'a plus qu\'un visage à faire bouger pendant huit secondes, et la publicité meurt là. Un personnage peut regarder l\'objectif, mais en FAISANT quelque chose. Exception unique : si le brief du panneau demande explicitement une présentation du produit, et alors seulement pour ce panneau-là.\n'
            + 'L\'IMAGE DE DÉPART EST UN POINT DE DÉPART, PAS UN SOMMET — trois règles qui décident de la qualité de l\'animation :\n'
            + (MINI_RUN ? '(a) ÉMOTION FORTE, JOUÉE COMME DANS UN LONG-MÉTRAGE D\'ANIMATION — v6.53 : le visage et le corps portent DÉJÀ l\'émotion du plan, grande et lisible à un mètre d\'un téléphone (épuisé : paupières tombantes, yeux cernés, bouche entrouverte, épaules affaissées, tête qui penche ; agacé : sourcils très froncés, mâchoire serrée, main crispée ; désemparé : sourcils relevés au centre, lèvre inférieure en avant ; soulagé : yeux fermés, épaules qui tombent, sourire paisible ; heureux avec ses proches : rire bouche fermée, yeux plissés). C\'est le jeu de la source : une émotion à moitié jouée rend la publicité fade. Seuls interdits : la bouche grande ouverte qui montre les dents, la grimace qui tord le visage.\n' : '(a) ÉMOTION LISIBLE, JAMAIS AU SOMMET — v6.52 : le visage porte DÉJÀ l\'émotion du plan, qu\'on nomme d\'un coup d\'œil (épuisé : paupières lourdes, épaules tombées ; agacé : sourcils froncés, mâchoire serrée ; inquiet : regard fixe, lèvres pincées ; soulagé : épaules relâchées, léger sourire, yeux mi-clos), tenue à mi-intensité. JAMAIS un visage neutre ou inexpressif — l\'animation partirait plate et la publicité serait fade — et jamais un rire, une grimace ou des yeux exorbités, que le modèle vidéo déformerait.\n')
            + '(b) RIEN D\'ILLISIBLE AU PREMIER PLAN : aucun objet, membre ou forme coupé par un bord du cadre ne peut rester ambigu. Un bras, une main ou une épaule qui entre dans le cadre est ENTIER et NET, main visible, forme lisible. Une masse floue coupée par le bord — un avant-bras sans main, un objet indéfini — oblige le modèle vidéo à inventer ce que c\'est, et il produit une forme mouvante qui traverse le plan. Si le cadrage crée une telle masse, tu recules la caméra.\n'
            + (MINI_RUN ? '(c) CADRAGE DU PLAN : le panneau suit son `cadrage` — très gros plan (un œil et la main qui le touche, net), gros plan (le visage entier et une main), plan moyen, plan large, insert des mains ou de l\'objet. Caméra de niveau, pas d\'inclinaison marquée ; dans un très gros plan, le visage reste entier sur au moins la moitié de sa largeur pour que le modèle vidéo garde sa géométrie.\n' : '(c) CADRAGE RESPIRABLE : le visage occupe au plus 55 % de la hauteur du panneau, les épaules restent visibles, et la caméra est de niveau — pas de très gros plan serré, pas d\'inclinaison marquée. Le modèle vidéo a besoin de voir la géométrie du corps pour l\'animer sans la tordre.\n')
            + 'RAPPEL DE STYLE DANS CHAQUE PANNEAU : chaque panneau se termine par une courte phrase qui redit le registre de rendu (même degré de stylisation, mêmes proportions de visage et de tête, même taille des yeux, même niveau de détail, même grain, même lumière que les trois autres panneaux). Un panneau plus caricatural, plus lisse ou plus photographique que ses voisins rend la vidéo inutilisable.\n'
            + 'VISAGE DU LOCUTEUR — RÈGLE ABSOLUE : dans tout panneau dont le clip contient une réplique, le locuteur est DE FACE ou de trois quarts FACE, visage entier et bouche dans le cadre, DÈS LA PREMIÈRE IMAGE. Jamais de dos, jamais de profil franc, jamais une main ou un objet seul au premier plan, jamais un visage coupé par un bord. Le modèle vidéo part de cette image : s\'il entend une voix sans voir de bouche, il fait pivoter le personnage en cours de plan et lui déforme le visage. Si la mise en scène voulait un dos ou un profil, tu changes l\'angle de caméra pour ramener le visage vers l\'objectif, sans changer le lieu ni l\'action.\n'
            + 'PANEL 1 à PANEL 4 : pour chaque panneau, dans cet ordre : le lieu (nature, matériaux et couleurs du sol, des murs, du plafond, ouvertures, chaque meuble et objet avec sa position et son état, arrière-plan) ; la lumière (sources, direction, température, intensité, ombres, atmosphère) conforme à l\'état lumineux demandé ; la caméra (hauteur, angle, distance, ce qui est coupé par les bords, composition verticale 9:16) ; la place de chaque personnage (% depuis la gauche, % depuis le haut), sa posture de départ, son regard, ses mains, son expression — exactement la première seconde du clip (debut_du_clip) ; le produit s\'il est demandé dans ce panneau.\n'
            + 'STYLE : recopie style_visuel mot pour mot, une seule fois, valable pour les 4 panneaux.\n'
            + 'LIEU IMPOSÉ PAR LE CT — PREMIÈRE CONTRAINTE, AVANT TOUTE AUTRE : si lieu_impose_par_le_CT est rempli, le lieu que tu décris est CELUI-LÀ et rien d\'autre. Ce lieu n\'est pas un décor interchangeable : c\'est le mécanisme du CT. Il porte ce que la scène doit prouver — les objets qu\'on y trouve, ce qu\'on y fait, qui y entre, ce qui s\'y voit. Changé, le CT ne démontre plus rien. Tu ne remplaces JAMAIS ce lieu par le lieu de travail du persona (bureau, open-space, salle de réunion, salle de pause) sous prétexte que la synthèse parle de son travail : le métier du persona décrit QUI il est, pas OÙ cette scène se passe. Tout lieu listé dans lieux_refuses_par_le_CT est interdit, même en arrière-plan, même suggéré par une fenêtre ou un objet. Ce que la synthèse apporte à ce lieu, c\'est son CONTENU réel — le pays, le quartier, les matériaux, le mobilier, les objets du quotidien, la lumière, les tenues — jamais sa nature.\n'
            + 'ELEMENTS OBLIGATOIRES : répartis dans les panneaux au moins 3 détails concrets de elements_obligatoires_issus_de_la_synthese, adaptés à chaque lieu, avec leur position dans le cadre. CONTEXTE REEL : lieux, architecture, matériaux, objets, lumière, tenues, teints, coiffures viennent du marché et du persona de la SYNTHESE (pays, ville, quartier, milieu social, métier, climat) ; aucun décor générique de banque d\'images étrangère. Si le brief de l\'agent contredit ce contexte, le contexte l\'emporte, sans changer la liste des personnages ni la fonction du lieu.\n'
            + 'S\'il y a moins de 4 panneaux dans le brief, complète la grille : les panneaux restants reprennent le lieu du panneau 1 avec les mêmes personnages, vus d\'un autre angle de caméra.\n'
            + 'PRODUIT — TAILLE : dans le panneau qui le montre, le produit est AU PREMIER PLAN, tourné vers la caméra, étiquette bien en face, et il occupe au moins un quart de la hauteur du panneau (tenu en main près de l\'objectif, ou posé au premier plan). Un produit petit ou de trois quarts est redessiné de travers par le modèle, car il n\'a pas assez de pixels pour copier l\'étiquette.\n'
            + 'PRODUIT — UN SEUL OBJET POUR TOUTE LA PLANCHE : le produit est le MÊME objet dans tous les panneaux où il apparaît. Seuls son orientation, sa position et le fait qu\'il soit ouvert ou fermé peuvent changer. Jamais une variante : pas d\'autre applicateur, pas de pinceau ni de tige qui apparaît, pas d\'autre forme, pas d\'autre couleur, pas d\'autre contenant. Un produit qui change d\'un panneau à l\'autre rend les quatre clips incompatibles.\n'
            + 'ÉTATS SUCCESSIFS D\'UNE TRANSFORMATION : quand les panneaux montrent les étapes d\'un même changement (avant, pendant, après), chaque panneau est un MOMENT NATUREL de ce changement — jamais une démonstration graphique coupée en deux. Aucune démarcation nette, aucun trait droit, aucune moitié traitée contre une moitié non traitée sur un visage, une peau, un cheveu, un tissu ou une surface : le modèle vidéo garde ce trait pendant tout le clip et la transformation ne se fait jamais. Le changement se montre par une zone en cours de traitement, aux bords fondus, et par ce que font les mains.\n'
            + 'PRODUIT — LE PACKSHOT N\'EST PAS LA SCÈNE : le produit est le CONTENANT seul. ' + (P._fiche && P._fiche.hors_contenant ? 'Ce qui est posé à côté de lui sur la photo (« ' + P._fiche.hors_contenant + ' ») est du décor de packshot : tu ne le dessines dans AUCUN panneau, ni sur la table, ni au sol, ni en main, sauf si l\'action de CE panneau est précisément de le sortir du contenant — et alors une seule pièce, dans la main qui la prend. ' : 'Tout objet posé à côté du contenant sur la photo est du décor de packshot, jamais de la scène. ') + 'Le contenant se pose fermé, seul, sur sa surface.\nPRODUIT — AUTORITÉ : seules la photo jointe et fiche_produit_lue_sur_la_photo décrivent le produit. Le brief_de_l_agent n\'a AUCUNE autorité sur lui : tu n\'en reprends ni couleur, ni forme, ni nom de marque, ni texte d\'étiquette. Dans chaque panneau où il apparaît, tu RECOPIES la phrase apparence de la fiche, mot pour mot, puis tu ajoutes sa position, sa taille et son orientation.' + (P._fiche && P._fiche.conflit ? ' ÉTIQUETTE : le produit garde exactement la forme, les couleurs et l\'étiquette de la photo, mais AUCUN NOM DE MARQUE N\'Y EST LISIBLE — l\'étiquette est là, aux mêmes couleurs et à la même place, et ses lettres ne se lisent pas. Tu n\'écris jamais un autre nom à la place.' : '') + '\n'
            + 'PRODUIT : s\'il figure dans un panneau, tu ne décris JAMAIS son étiquette ni son texte — tu écris seulement « the product exactly as in the attached product photo », sa position dans le cadre, sa taille par rapport à une main ou à un meuble, et son orientation (étiquette face caméra). Tu ajoutes ensuite comment il est ÉCLAIRÉ par cette scène-là : même source, même direction, même température, ombre de contact sur ce qui le porte, reflets de la pièce. Le dessin du produit vient de la photo, sa lumière vient du décor : sans cette phrase le modèle colle la photo sur l\'image et le résultat a l\'air d\'un photomontage. Toute description d\'étiquette écrite de ta part serait recopiée de travers par le modèle d\'image.\n'
            + 'OBJETS RECONNAISSABLES SANS ÉTIQUETTE : comme aucun objet autre que le produit ne porte de texte, c\'est sa SILHOUETTE qui doit le faire reconnaître, et tu la décris précisément — une canette de boisson énergisante est haute, fine, en aluminium, avec un col rétréci et une languette d\'ouverture visible sur le dessus, jamais une boîte de conserve basse et large ; une tasse de café a son anse et sa vapeur ; un sachet de sucre est souple et froissé. Pour chaque objet cité dans les paroles, tu écris la forme, les proportions, la matière et le détail qui le trahit, pour qu\'il se nomme tout seul sans une seule lettre. Un objet mal silhouetté devient autre chose à l\'écran, et la phrase qui en parle ne veut plus rien dire.\nAUCUN TEXTE LISIBLE : tu ne décris jamais de lettres, de mots, de chiffres, d\'étiquette écrite, de titre, d\'enseigne, de logo ni de marque sur un objet (dossier, papier, classeur, écran, panneau, carton, vêtement, mur). Ces surfaces sont vierges, ou leur impression est décrite comme illisible et floue. Un texte dans l\'image est recopié puis déformé par le modèle vidéo : c\'est une faute. Seule l\'étiquette du produit fait exception, dans les panneaux qui le montrent. Tu ne décris ni bordure, ni cadre, ni séparation, ni numéro, ni texte. Réponds UNIQUEMENT par le prompt final, sans titre ni commentaire.';
          const dg = await vjson(`${LOCATION}-aiplatform.googleapis.com`, `/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-2.5-pro:generateContent`, { contents: [{ role: 'user', parts: [{ text: sys + (rappel ? (/^IDENTITÉ/.test(rappel)
            ? '\n\n⚠️ TENTATIVE PRÉCÉDENTE RATÉE : ' + rappel + '. Si un panneau portait une EXPRESSION qui déforme le visage (bouche grande ouverte sur les dents, grimace), tu la gardes aussi forte mais bouche fermée — jamais un visage neutre. Si un panneau avait une FORME ILLISIBLE coupée par un bord au premier plan, tu recules la caméra pour que tout objet y soit entier et net. Cette fois, tu écris en tête de CHAQUE panneau la ligne de ré-ancrage complète (« Same <nom> as described above: same face, same skin tone, same <coiffure>, wearing the same <tenue> »), avec la coiffure et la tenue recopiées mot pour mot depuis CHARACTERS, et tu termines CHAQUE panneau par la phrase de rappel de style. Le visage du locuteur est dans le cadre dans tous les panneaux où il parle.'
            : /^PRODUIT/.test(rappel)
            ? '\n\n⚠️ TENTATIVE PRÉCÉDENTE RATÉE — LE PRODUIT DESSINÉ N\'ÉTAIT PAS CELUI DE LA PHOTO : ' + rappel + '. Dans CHAQUE panneau où le produit apparaît, tu recopies la photo du produit sur les neuf attributs verrouillés, en les écrivant explicitement dans le prompt du panneau : silhouette et proportions du contenant ; matière et transparence ; COULEUR DU CONTENANT ; FORME ET COULEUR DU BOUCHON ; couleur de fond de l\'étiquette ; couleur du texte de l\'étiquette ; position et proportion de l\'étiquette sur le contenant ; éléments graphiques de l\'étiquette ; couleur de ce qu\'on voit à l\'intérieur. Le produit est identique dans tous les panneaux. Tu ne modifies AUCUNE de ces couleurs pour l\'harmonie du cadre.'
            : '\n\n⚠️ TENTATIVE PRÉCÉDENTE RATÉE : le ou les personnages suivants manquaient dans leur panneau : ' + rappel + '. Ils doivent être entièrement visibles dans CE panneau, au premier plan s\'ils y parlent, et décrits explicitement.') : '') + '\n\n=== BRIEF ===\n' + JSON.stringify(brief) + '\n\n=== SYNTHESE ===\n' + p.synthese }] }], generationConfig: { temperature: 0.4, maxOutputTokens: 9000, thinkingConfig: { thinkingBudget: 4096 } } });
          const f2 = fin(dg); if (f2.finishReason && f2.finishReason !== 'STOP') throw new Error('prompt de planche tronqué (' + f2.finishReason + ')'); // un CT très chargé ferait sauter un panneau
          let t = textOf(dg).trim(); if (t.length < 600) throw new Error('prompt de planche trop court');
          const vus = new Set((t.match(/(?:PANEL|PANNEAU)\s*([1-4])/gi) || []).map(x => x.replace(/\D/g, '')));
          for (let k = 1; k <= 4; k++) { // la grille a toujours 4 cases : aucune ne reste vide, quel que soit le nombre de décors du CT
            if (vus.has(String(k))) continue;
            const ir = panels[k - 1];
            t += ir ? '\nPANEL ' + k + ': ' + String(ir.prompt_gemini || ir.contenu || ('the ' + (ir.decor || 'next') + ' setting')).replace(/\s+/g, ' ').slice(0, 700) + ' The characters are the same individuals described above.'
                    : '\nPANEL ' + k + ': the same setting, characters and light as PANEL 1, seen from a different camera angle and distance.';
          }
          return t;
        };
        const panelsAll = (P.plan.images_reference || []).slice(0, NC);
        // v6.47 — PLUSIEURS GRILLES. Une grille garde 4 cases (au-delà, les visages et le produit deviennent trop petits).
        // Au-delà de 4 décors : grilles équilibrées (5 -> 3+2, 7 -> 4+3). Les grilles suivantes reçoivent la première
        // en référence d'identité et de style.
        const NGRILLES = Math.max(1, Math.ceil(panelsAll.length / 4)), TGRILLE = Math.ceil(panelsAll.length / NGRILLES);
        // v6.51 — CE QU'IL RESTE A DEPENSER AVANT LE PLAFOND. Toute reprise d'image (planche, retouche) passe par ici :
        // on ne refait plus une image si l'argent des clips Veo n'est plus garanti. Une video avec un defaut vaut mieux
        // que 5 $ depenses et aucune video (consigne du fondateur).
        const budRestant = () => {
          const B = parseFloat(process.env.BUDGET_USD || p.budget_usd || '10'); if (!(B > 0)) return 99;
          const nc = (P.plan.clips || []).length, dep = (P._couts && P._couts.total) || 0;
          return B - dep - (P.plan.clips || []).reduce((a9, c9, i9) => a9 + dureeVeo(c9) * tpsM(mdl(i9)) * (PRISES[i9] ? 2 : 1), 0) - (VOIX_OFF_RUN ? 0.25 : 0.10) - 0.30;   // 0,25 $ : ElevenLabs (paye ou a payer) ; 0,30 $ : marge de montage/mesure
        };
        // v6.54 — UNE SEULE IMAGE PRODUIT PAR PLANCHE. Les modeles d'image denaturent le produit des qu'on leur donne deux photos.
        // Les aspects fournis par le client (dos, cote, contenu, en main, detail) sont classes une fois (Flash), puis, pour chaque
        // planche de 4 plans, Flash choisit ceux dont CES plans ont besoin et le code les assemble en une image unique (4 vues au plus).
        const ASPECTS_LIB = { face: 'face', cote: 'side', dos: 'back (rear label)', forme: 'the product itself (powder, capsule, liquid, texture)', prepare: 'prepared / in use', en_main: 'held in a hand', detail: 'close-up detail', kit: 'kit / bundle / free gifts sold with the product' };
        let _aspectsClasses = null;
        const classerAspects = async () => {
          if (_aspectsClasses) return _aspectsClasses;
          _aspectsClasses = [{ code: 'face', description: 'main product photo', mime: p.produit.mime || 'image/png', data: p.produit.data }];
          for (const a of (Array.isArray(p.aspects) ? p.aspects : []).slice(0, 5)) {
            try {
              const g = await vjson(`${LOCATION}-aiplatform.googleapis.com`, `/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-2.5-flash:generateContent`, { contents: [{ role: 'user', parts: [{ inlineData: { mimeType: a.mime || 'image/png', data: a.data } }, { text: 'Photo of the same product, one more aspect. Reply ONLY with JSON {"code":"face|cote|dos|forme|prepare|en_main|detail|kit","description":"max 25 words in English: what is visible"}. face = front of the container; cote = side; dos = back with rear label; forme = the product itself out of its container (powder, capsule, liquid, texture); prepare = prepared or in use (in a glass, applied); en_main = held in a hand; detail = close-up of a feature; kit = the kit, bundle or free gifts sold with the product.' }] }], generationConfig: { temperature: 0, maxOutputTokens: 400, thinkingConfig: { thinkingBudget: 0 }, responseMimeType: 'application/json' } });
              const j = JSON.parse(textOf(g)); const code = ASPECTS_LIB[j.code] ? j.code : 'detail';
              if (_aspectsClasses.some(x => x.code === code) && code !== 'detail') continue;   // un seul exemplaire par aspect
              _aspectsClasses.push({ code, description: String(j.description || '').slice(0, 160), mime: a.mime || 'image/png', data: a.data });
            } catch (eA) { log('Aspect du produit illisible (' + String(eA.message || eA).slice(0, 70) + ') : ignoré.'); }
          }
          save('00c_aspects_produit.json', _aspectsClasses.map(x => ({ code: x.code, description: x.description })));
          return _aspectsClasses;
        };
        const assemblerAspects = async (liste, nom) => {
          const n = liste.length; if (n === 1) return { mime: liste[0].mime, data: liste[0].data, codes: [liste[0].code] };
          // v6.54 — d'abord une vraie composition par le modele d'image (fond neutre propre, vues fideles), controlee ; le montage ffmpeg n'est que le repli.
          try {
            const parts = []; liste.forEach((x, i) => { parts.push({ text: 'VIEW ' + (i + 1) + ' = ' + ASPECTS_LIB[x.code] + ':' }); parts.push({ inlineData: { mimeType: x.mime, data: x.data } }); });
            parts.push({ text: 'These ' + n + ' photos show the SAME product (or set) from different aspects. Create ONE single clean product reference image showing all of them together, arranged naturally and harmoniously side by side on a plain seamless light-neutral background, soft studio light, soft contact shadows. Every item STRICTLY identical to its photo: shape, proportions, colours, material, label, printed text, quantity. Remove any hand, person or decor from the sources. Add nothing that is not in the photos. Do not crop any item. Square format.' });
            for (let e0 = 0; e0 < 2; e0++) {
              const ri = await vjsonImage('aiplatform.googleapis.com', imgPath(true), { contents: [{ role: 'user', parts }], generationConfig: { responseModalities: ['TEXT', 'IMAGE'], temperature: 0.3 } });
              const ipa = (ri.candidates?.[0]?.content?.parts || []).find(x => x.inlineData); if (!ipa) continue;
              // controle visuel : Flash recoit les images
              const gk = await vjson(`${LOCATION}-aiplatform.googleapis.com`, `/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-2.5-flash:generateContent`, { contents: [{ role: 'user', parts: [...liste.flatMap((x, i) => [{ text: 'SOURCE ' + (i + 1) + ':' }, { inlineData: { mimeType: x.mime, data: x.data } }]), { text: 'COMPOSITION:' }, { inlineData: { mimeType: ipa.inlineData.mimeType, data: ipa.inlineData.data } }, { text: 'Reply ONLY with JSON {"ok":true,"probleme":""}. ok = true only if every source item appears whole in the COMPOSITION, identical in shape, colours, quantity and printed text, and nothing was added.' }] }], generationConfig: { temperature: 0, maxOutputTokens: 300, thinkingConfig: { thinkingBudget: 0 }, responseMimeType: 'application/json' } }).then(g => JSON.parse(textOf(g))).catch(() => ({ ok: true }));
              if (gk.ok !== false) { fs.writeFileSync(path.join(dir, nom + '.jpg'), Buffer.from(ipa.inlineData.data, 'base64')); return { mime: ipa.inlineData.mimeType, data: ipa.inlineData.data, codes: liste.map(x => x.code) }; }
              log('Assemblage IA des aspects refusé au contrôle (' + String(gk.probleme || '').slice(0, 80) + ')');
            }
          } catch (eIA) { log('Assemblage IA des aspects impossible (' + String(eIA.message || eIA).slice(0, 80) + ') → montage simple.'); }
          const cell = n === 3 ? 800 : 1000, cols = n === 4 ? 2 : n, rows = n === 4 ? 2 : 1;
          const fich = liste.map((x, i) => { const f = path.join(dir, nom + '_v' + i + '.img'); fs.writeFileSync(f, Buffer.from(x.data, 'base64')); return f; });
          const filtres = fich.map((f, i) => '[' + i + ':v]scale=' + (cell - 40) + ':' + (cell - 40) + ':force_original_aspect_ratio=decrease,pad=' + cell + ':' + cell + ':(ow-iw)/2:(oh-ih)/2:white[v' + i + ']');
          const empile = n === 4 ? '[v0][v1]hstack=inputs=2[h0];[v2][v3]hstack=inputs=2[h1];[h0][h1]vstack=inputs=2[out]' : fich.map((f, i) => '[v' + i + ']').join('') + 'hstack=inputs=' + n + '[out]';
          const sortie = path.join(dir, nom + '.jpg');
          await sh('ffmpeg', ['-y', ...fich.flatMap(f => ['-i', f]), '-filter_complex', filtres.join(';') + ';' + empile, '-map', '[out]', '-frames:v', '1', '-q:v', '2', sortie], 120000);
          const data = fs.readFileSync(sortie).toString('base64'); fich.forEach(f => { try { fs.unlinkSync(f); } catch (e) { } });
          return { mime: 'image/jpeg', data, codes: liste.map(x => x.code) };
        };
        const produitPourPlanche = async (panels, suffixe) => {
          const base = { mime: p.produit.mime || 'image/png', data: p.produit.data, codes: ['face'] };
          if (!Array.isArray(p.aspects) || !p.aspects.length) return base;
          try {
            const cl = await classerAspects();
            if (cl.length < 2) return base;
            const dem = panels.filter(hasProduct).map((ir, i) => ({ panneau: panels.indexOf(ir) + 1, contenu: ir.contenu, brief: String(ir.prompt_gemini || '').slice(0, 500), debut_du_clip: String((((P.plan.clips || []).filter(c => (c.references || [])[0] === ir.id)[0]) || {})._corps || '').slice(0, 400) }));
            const r = await flashJSON('Tu prepares UNE seule image de reference du produit pour la planche de ' + panels.length + ' plans d\'une video publicitaire. Le modele d\'image ne peut recevoir qu\'UNE image : choisis, parmi les aspects disponibles, ceux dont CES plans ont besoin pour dessiner le produit exactement (face si on voit le devant, dos si l\'etiquette arriere est montree, forme pour le contenu, en_main pour l\'echelle, detail...). 1 a 4 aspects, jamais un aspect inutile. Reponds UNIQUEMENT par JSON {"aspects":["code",...]}.\nASPECTS DISPONIBLES : ' + JSON.stringify(cl.map(x => ({ code: x.code, vue: x.description }))) + '\nPLANS QUI MONTRENT LE PRODUIT : ' + JSON.stringify(dem));
            const codes = (r.aspects || []).map(x => String(x).toLowerCase()).filter((x, i, a2) => a2.indexOf(x) === i && cl.some(y => y.code === x)).slice(0, 4);
            if (codes.length < 2) { log('Planche' + suffixe + ' : aspects du produit retenus = ' + (codes[0] || 'face') + ' (image unique).'); const un = cl.find(x => x.code === (codes[0] || 'face')) || cl[0]; return { mime: un.mime, data: un.data, codes: [un.code] }; }
            const ass = await assemblerAspects(codes.map(c => cl.find(x => x.code === c)), '04_planche' + suffixe + '_produit');
            log('Planche' + suffixe + ' : produit envoyé en UNE image assemblée avec ' + ass.codes.join(' + ') + '.');
            P.steps.push({ etape: '4a. Aspects du produit pour la planche' + suffixe, aspects: ass.codes });
            return ass;
          } catch (eP) { log('Aspects du produit : assemblage impossible (' + String(eP.message || eP).slice(0, 80) + ') → photo principale seule.'); return base; }
        };
        const genPlanche = async (rappel, tolerantProduit, g) => {
          g = g || 0;
          const panels = panelsAll.slice(g * TGRILLE, (g + 1) * TGRILLE);
          const suffixe = g ? '_' + (g + 1) : '';
          const txt = await directPlanche(panels, rappel);
          const head = 'ONE single image, vertical 9:16, divided into a 2x2 grid of four panels: top-left = PANEL 1, top-right = PANEL 2, bottom-left = PANEL 3, bottom-right = PANEL 4. The four panels touch edge to edge and fill the whole image: no border, no frame, no gutter, no separating line, no rounded corner, no drop shadow, no margin. v6.40 — CRITICAL: each panel IS the photograph itself, never a photograph shown on a device. No phone, no phone frame, no bezel, no notch, no screen, no monitor, no tablet, no television, no app interface, no mockup, no device held in front of the scene, and no scene displayed inside a rectangle. The words smartphone or phone in the style describe HOW the image looks — handheld, available light — and are never a subject to draw. Each panel is a complete full-bleed cinematic frame of its own scene, composed for a vertical 9:16 crop, and each one is the exact first frame of an 8-second video: characters in their starting position inside the described setting, the whole setting clearly visible and coherent (floor, walls, furniture, light source), natural proportions between people and objects.\nTHE RECURRING CHARACTERS ARE THE SAME INDIVIDUALS IN EVERY PANEL: identical face, identical skin tone, identical hair and head covering, identical body build and proportions; a non-human character keeps exactly the same object shape, material, face and accessories in every panel. Only the setting, the lighting, the camera framing, the pose and the expression change from one panel to another.\n\n';
          const withProduct = panels.some(hasProduct);
          const foot = '\n\nEvery screen (laptop, phone, monitor, television) is switched off and shows a plain dark surface. Any clock is an analogue clock without numerals, or faces away from the camera; no digital display anywhere. Every folder, paper, document, file, sign, poster, box and garment in every panel is completely blank: no writing, no letters, no words, no numbers, no logo.\nABSOLUTELY NO TEXT anywhere in the image: no panel number, no label, no caption, no title, no letters, no digits, no signs, no watermark' + (withProduct ? ' (the product label copied from the product photo is the only text allowed, and only in the panels that show the product).' : '.') + (withProduct ? '' : ' Do not include any product bottle or packaging in any panel.');
          const ps = [{ text: head + (rappel ? (/^IDENTITÉ/.test(rappel) ? 'MANDATORY, a previous attempt failed: the recurring character did not look like the same person, or one panel was rendered in a different style (' + rappel + '). Every panel shows the SAME individual: identical face, identical skin tone, identical hairstyle, identical body proportions; the outfit is the one written for each panel\'s place (never shorts, vest or flip-flops at an office). All four panels share one rendering style: same degree of stylisation, same head and eye proportions, same level of detail, same grain, same light. The speaker face is inside the frame in every panel where that character speaks.\n' : /^PRODUIT/.test(rappel) ? 'MANDATORY, a previous attempt failed: the product drawn did not match the supplied product photo (' + rappel + '). In every panel showing the product, copy the photo exactly: same container shape and proportions, same material, same container colour, same cap shape and colour, same label background and text colours, same label position and size, same graphic elements, same visible content colour. Identical in all panels.\n' : 'MANDATORY, a previous attempt failed: ' + rappel + ' must be fully drawn inside their own panel.\n') : '') + txt + foot }];
          const prodPl = (withProduct && p.produit) ? await produitPourPlanche(panels, suffixe) : null;
          if (withProduct && p.produit) { ps.push({ text: (prodPl && prodPl.codes.length > 1 ? 'The product reference image is ONE reference sheet of the SAME product seen from ' + prodPl.codes.length + ' aspects (' + prodPl.codes.map(c => ASPECTS_LIB[c]).join(', ') + '), laid out on a white background. It is not a panel and its layout is never reproduced: use each view where a panel needs it. ' : '') + 'Product reference photo. In the panel that shows the product, it is held close to the camera or placed in the foreground, label facing the lens, filling at least a quarter of that panel height. Copy the CONTAINER ONLY, EXACTLY as in this photo — anything lying beside or in front of it in the photo' + (P._fiche && P._fiche.hors_contenant ? ' (' + P._fiche.hors_contenant + ')' : '') + ' is packshot decoration and is NOT drawn: the container stands alone, closed, unless this panel\'s action is a hand taking one piece out of it. Same container shape and proportions, same cap, same colours, same label layout' + (P._fiche && P._fiche.conflit ? ', and the label carries NO readable brand name — same label, same colours, same place, lettering not legible; never write another name on it.' : ', same wording in the same places and the same relative type sizes.') + (P._fiche && P._fiche.description_en ? ' The product is: ' + P._fiche.description_en : '') + ' Do not redesign it, do not re-letter it, do not translate it, do not simplify it. COPY THE DESIGN, NOT THE PHOTOGRAPH. The shape, the colours, the label layout and the wording come from the product photo; the LIGHT comes from this scene. The product is lit by the same light sources, from the same direction, at the same colour temperature and the same softness as the hand and the furniture around it. It casts a real contact shadow on whatever it rests on or against, it picks up the reflections and the colour bounce of the room, its edges have the same focus and the same grain as the rest of the frame, and its scale matches the hand holding it. Never a clean cut-out pasted on top of the scene, never a product sharper or brighter than its surroundings, never a product without a shadow. It is the only object in the whole image allowed to carry text:' }); ps.push({ inlineData: { mimeType: (prodPl || p.produit).mime || 'image/png', data: (prodPl || p.produit).data } }); }
          if (g && P._plancheBuf0) { ps.push({ text: 'IDENTITY AND STYLE REFERENCE — the attached image is the FIRST reference sheet of the SAME film. Every recurring character here must be exactly the same individual (face, skin tone, hairstyle, proportions — NOT the outfit: each panel wears what its own place requires, as written in the panel), the product exactly the same object, and the rendering style, grain and light exactly the same. Do NOT copy its scenes or compositions: only the people, the product and the look.' }); ps.push({ inlineData: { mimeType: 'image/png', data: P._plancheBuf0.toString('base64') } }); }
          save('04_planche' + suffixe + '_prompt.txt', head + txt + foot);
          log('Planche de référence' + (NGRILLES > 1 ? ' (grille ' + (g + 1) + '/' + NGRILLES + ')' : '') + ' : les ' + panels.length + ' décor(s) dessinés dans UNE seule image 2x2 (' + (!process.env.PLANCHE_NB && withProduct && p.produit ? MODELE_IMAGE_PRO : MODELE_IMAGE_STD) + '), puis découpés par le code…');
          const call = cfg => vjsonImage('aiplatform.googleapis.com', imgPath((!process.env.PLANCHE_NB && withProduct && p.produit)), { contents: [{ role: 'user', parts: ps }], generationConfig: cfg });
          let im = null, ip = null, cfgUsed = null;
          const cfgs = [{ responseModalities: ['TEXT', 'IMAGE'], imageConfig: { aspectRatio: '9:16', imageSize: process.env.PLANCHE_DEF || '2K' /* v6.53 : 2K par defaut (4K = 6 a 10 min par grille, mesure) ; PLANCHE_DEF=4K rend l'ancien comportement */ } }, { responseModalities: ['TEXT', 'IMAGE'], imageConfig: { aspectRatio: '9:16' } }, { responseModalities: ['TEXT', 'IMAGE'], maxOutputTokens: 8192 }];
          for (const cfg of cfgs) { // la définition maximale d'abord : chaque quadrant devient une image de décor, donc plus la planche est fine, meilleure est l'image envoyée à Veo
            try { im = await call(cfg); ip = (im.candidates?.[0]?.content?.parts || []).find(x => x.inlineData); } catch (e) { log('Planche refusée en ' + (cfg.imageConfig ? (cfg.imageConfig.imageSize || '9:16') : 'définition par défaut') + ' (' + String(e.message || e).slice(0, 90) + ') : essai suivant.'); continue; }
            if (ip) { cfgUsed = cfg; break; }
          }
          if (!ip) throw new Error('aucune image de planche (finishReason ' + (im ? fin(im).finishReason : '?') + ')');
          const buf = Buffer.from(ip.inlineData.data, 'base64');
          fs.writeFileSync(path.join(OUT, `${id}_planche${suffixe}.png`), buf); if (!g) Object.defineProperty(P, '_plancheBuf0', { value: buf, writable: true, enumerable: false, configurable: true });
          const quads = pngPanels(buf, 2, 2, 900, VIDEO_RATIO);
          P.steps.push({ etape: '4. Planche de référence (une seule image, grille 2x2)', panneaux: panels.map(x => x.id), produit_envoye_a_gemini: !!(withProduct && p.produit), prompt_chars: (head + txt + foot).length, definition_demandee: (cfgUsed && cfgUsed.imageConfig && cfgUsed.imageConfig.imageSize) || '9:16', planche_ko: sizeKB(ip.inlineData.data), definition_par_decor: quads[0].w + 'x' + quads[0].h, cellules_brutes: quads.map(q => q.brut).join(' | ') });
          log('Planche générée et découpée : ' + quads[0].w + '×' + quads[0].h + ' par décor (' + panels.map((x, i) => 'panneau ' + (i + 1) + ' = ' + x.id).join(', ') + ').');
          // v6.10 — l'ordre compte : on numérote la version, on retire les vignettes de la planche PRÉCÉDENTE, puis on
          // ajoute celles de la nouvelle. En v6.8 le filtre passait APRÈS l'ajout et supprimait les vignettes qu'on venait
          // d'écrire : plus aucune image de référence n'apparaissait dans le lab.
          P._planche = (P._planche || 0) + 1;
          P.refs = (P.refs || []).filter(r => !((r.panneau || /^planche/.test(String(r.id))) && (r.grp || 0) === g));
          quads.forEach((q, i) => { // les 4 cases sont découpées et écrites, même celles qui ne servent à aucun clip
            const ir = panels[i];
            const fname = ir ? `${id}_ref_${ir.id}.png` : `${id}_ref_panneau${i + 1 + g * TGRILLE}_libre.png`;
            archiver(fname, 'avant_nouvelle_planche');
            fs.writeFileSync(path.join(OUT, fname), q.png);
            if (ir) genImgs[ir.id] = { data: q.png.toString('base64'), mime: 'image/png' };
            P.refs.push({ id: ir ? ir.id : 'panneau_' + (i + 1 + g * TGRILLE), file: fname + (P._planche > 1 ? '?v=' + P._planche : ''), decor: ir ? ir.decor : 'case libre (aucun clip)', suite_de: null, panneau: i + 1 + g * TGRILLE, grp: g });
          });
          P.refs.push({ id: 'planche' + suffixe, file: `${id}_planche${suffixe}.png` + (P._planche > 1 ? '?v=' + P._planche : ''), decor: 'planche complète' + (NGRILLES > 1 ? ' (grille ' + (g + 1) + ')' : ' (4 panneaux)'), suite_de: null, grp: g });
          // UN SEUL contrôle, sur les 4 panneaux à la fois : les locuteurs sont-ils bien dessinés, et reste-t-il du texte ?
          // C'est le seul contrôle qui fait économiser de l'argent (un locuteur absent = un clip payé pour rien).
          // v6.8 — une planche refaite remplace la précédente : sans ça les vignettes s'empilaient en double dans le
          // lab, et comme le nom de fichier ne changeait pas, le navigateur continuait d'afficher la PREMIÈRE image
          // alors que le fichier sur le disque était la seconde — d'où l'écart entre ce qui s'affiche et ce qu'on télécharge.
          if (P._planche > 1) log('Planche refaite : les vignettes précédentes sont remplacées (la version affichée porte le numéro ' + P._planche + ').');
          const absentsLoc = [], ecartsProduit = [], koLignes = [], ecartsIdentite = [];
          const aRetoucher = new Map();   // v6.51 : panneau (0-based) -> { pose, tenue } : retouche ciblee d'UN panneau, pas de la grille
          let lignesCtrl = [];   // v6.37 : le resultat du controle sert aussi APRES le bloc try (passe produit systematique)
          try {
            const attendus = panels.map((ir, i) => ({ panneau: i + 1, image: ir.id, personnages: (ir.personnages || []).filter(Boolean) }));
            const parts2 = [];
            if (p.produit) { parts2.push({ text: 'PHOTO DU PRODUIT RÉEL (référence absolue, c\'est l\'objet que le client recevra) :' }); parts2.push({ inlineData: { mimeType: p.produit.mime, data: p.produit.data } }); }
            panels.forEach((ir, i) => { parts2.push({ text: 'PANNEAU ' + (i + 1) + ' (' + ir.id + ') :' }); parts2.push({ inlineData: { mimeType: 'image/png', data: genImgs[ir.id].data } }); });
            parts2.push({ text: 'Pour CHAQUE panneau, dis d\'abord ce que tu vois, puis réponds : (1) chacun des personnages attendus est-il dessiné dans ce panneau ? Un personnage personnifié (objet, créature, animal avec un visage) compte comme présent, et un personnage vu de dos ou de profil compte comme présent ; (2) y a-t-il du texte lisible (lettres, mots, chiffres) sur un objet, un papier, un écran ou un vêtement, hors étiquette du flacon de produit ? (3) le produit (le flacon de la marque) est-il visible dans ce panneau ? (4) le locuteur attendu occupe-t-il au moins 40 % de la hauteur du panneau ? (5) le produit dessiné est-il le MÊME OBJET que celui de la photo du produit réel ? Tu compares CINQ points, et CINQ SEULEMENT : (a) la FORME et les proportions du contenant ; (b) la COULEUR du contenant ; (c) la FORME et la COULEUR du bouchon ; (d) la COULEUR DE FOND de l\'étiquette ; (e) ' + (P._fiche && P._fiche.conflit ? 'RIEN D AUTRE : tu ne compares AUCUN texte ni AUCUN nom de marque, l etiquette de ce produit est volontairement sans nom lisible et ce n est jamais un ecart.' : 'le NOM DE MARQUE écrit en gros sur l\'étiquette.') + ' Rien d\'autre n\'existe pour toi. Réponds produit_fidele = false dès qu\'UN de ces points diffère, et dis lequel dans produit_ecart (ex. « bouchon blanc sur la photo, vert dans le panneau »). N\'EXAMINE RIEN D\'AUTRE. Tu IGNORES complètement, et tu ne les mentionnes JAMAIS, même si tu les vois : toute ligne de texte autre que le nom de marque (sous-titre, slogan, « 100% Pure & Natural », « Dietary Supplement », contenance, mentions légales), sa couleur et sa casse ; les pictogrammes, icônes, badges et logos de certification ; les bandes, liserés et éléments graphiques de l\'étiquette ; la position exacte et la taille de l\'étiquette sur le contenant ; la couleur de ce qu\'on voit à l\'intérieur du contenant. Tu ignores aussi la netteté, la définition, le flou, l\'exposition, l\'angle, la perspective, les reflets et l\'éclairage : à cette taille d\'image ces détails ne sont pas lisibles et ne le seront jamais, ils ne sont donc pas un écart. Tu juges à la distance où la vidéo sera vue : un téléphone tenu à bout de bras, sans zoomer. Un écart ne se déclare que s\'il saute aux yeux à cette distance — un flacon qui n\'a pas la même forme, une couleur franchement différente, un bouchon d\'une autre couleur, un fond d\'étiquette d\'une autre couleur, un autre nom de marque. Si tu as dû regarder de près pour le voir, ce n\'est pas un écart. RÈGLE ABSOLUE qui passe AVANT le doute : si le produit du panneau n\'a PAS d\'étiquette, ou une étiquette vierge, floue, illisible ou sans nom de marque, alors produit_fidele = false, toujours, sans hésiter — écris-le tel quel dans produit_ecart (« étiquette absente »). Un flacon nu n\'est pas le produit du client, c\'est un flacon. En dehors de ce cas, et en cas de doute sur les cinq points, produit_fidele = true : refaire une image correcte coûte plus cher que de laisser passer un détail que personne ne verra.\n(7) y a-t-il, AU PREMIER PLAN, une forme coupée par un bord du cadre que tu ne peux pas identifier avec certitude — une masse floue, un membre sans main, un objet indéfini ? Réponds forme_illisible = true et dis où ; un objet net et reconnaissable, même coupé, n\'est PAS un problème. (8) l\'expression. Deux defauts OPPOSES, et il faut les distinguer. expression_extreme = true si le visage est au SOMMET d\'une expression (grand sourire dents decouvertes, rire, yeux leves au ciel, sourcils tres hauts, grimace) : en l\'animant, Veo deforme le visage.' + (MINI_RUN ? ' EN MODE MINI-PLANS, une emotion FORTE de film d\'animation est voulue : expression_extreme = true UNIQUEMENT si la bouche est grande ouverte sur les dents ou si une grimace tord le visage.' : '') + ' expression_absente = true si le visage ne porte AUCUNE emotion lisible — neutre, inexpressif, le regard vide, un visage de photo d\'identite : la video sera plate des la premiere image. Ce qu\'on veut est entre les deux : une emotion que tu peux NOMMER en un coup d\'oeil (inquiete, lassee, amusee, determinee, soulagee) mais tenue, pas a son apogee. Si tu peux nommer l\'emotion sans hesiter et qu\'elle n\'est pas au sommet, les deux champs sont false. (6) le VISAGE du personnage attendu comme locuteur est-il VISIBLE dans ce panneau, de face ou de trois quarts, avec sa bouche dans le cadre ? Réponds visage_locuteur = false si on ne voit qu\'une main, un dos, un objet seul, ou si le visage est coupé par le bord.\nEt DEUX fois pour l\'ensemble, en comparant les panneaux entre eux :\n(A) IDENTITÉ — chaque personnage qui apparaît dans plusieurs panneaux y est-il la MÊME PERSONNE ? Compare sans indulgence : traits du visage, teint, COIFFURE (longueur, tresses, chignon, coiffe) et corpulence. La TENUE n\'entre PAS dans ce jugement : elle change légitimement d\'un lieu à l\'autre (nuit, cuisine, bureau). Réponds personnages_identiques = false dès qu\'un de ces points change, et dis quoi et entre quels panneaux dans personnages_ecart.\n(B) STYLE — les quatre panneaux sont-ils rendus dans le MÊME style ? Compare le degré de stylisation (proportions du visage et de la tête, taille des yeux), le niveau de détail, le rendu de la peau et des tissus, le grain, la lumière. Un panneau plus caricatural, plus lisse ou plus photographique que les autres casse la vidéo. Seuls comptent les panneaux qui montrent un PERSONNAGE : un panneau d\'objet, de plantes ou de produit seul n\'a pas à ressembler à un portrait, ce n\'est jamais un écart. Réponds style_identique = false uniquement si un panneau avec personnage est rendu autrement que les autres, et dis lequel et en quoi dans style_ecart.\n(E) TENUE ADAPTÉE AU LIEU — dans chaque panneau avec personnage, la tenue convient-elle au lieu et à l\'heure ? Un short, un débardeur, un tee-shirt de nuit ou des claquettes au bureau, en réunion ou dans la rue ne conviennent pas. Réponds tenue_inadaptee = true et dis laquelle dans tenue_ecart.\nEt le personnage personnifié : est-il le MÊME objet dans tous les panneaux où il apparaît (même forme, même matière, même visage, mêmes membres, même taille par rapport au mobilier) ? Si non, dis ce qui change et dans quel panneau.\n(C) PRODUIT D\'UN PANNEAU À L\'AUTRE — le produit dessiné est-il le MÊME OBJET dans tous les panneaux où il apparaît ? Compare sa forme, sa couleur, son bouchon et son applicateur. Un stick qui devient un tube à pinceau, un flacon qui change de forme ou de couleur, un applicateur qui apparaît d\'un panneau à l\'autre : réponds produit_meme_objet = false et dis ce qui change et entre quels panneaux dans produit_objet_ecart. Un même objet vu sous un autre angle, ouvert d\'un côté et fermé de l\'autre, n\'est PAS un écart.\n(C3) POSE POUR LA CAMERA — le personnage de ce panneau est-il saisi AU MILIEU D\'UNE ACTION (mains occupees, poids deplace, regard sur ce qu\'il fait) ou POSE-T-IL face a l\'objectif (buste immobile, bras le long du corps ou tendant un objet vers la camera, rien d\'autre en train de se faire) ? Reponds pose_pub = true dans le second cas. Une pose ne s\'anime pas : le clip n\'aura qu\'un visage qui bouge.\n(C2) CADRE D\'APPAREIL — un panneau montre-t-il la scene AFFICHEE SUR UN ECRAN ou DANS UN TELEPHONE (contour de telephone, encoche, bordure noire arrondie, interface) au lieu d\'etre la photo elle-meme ? Reponds ecran = true et dis dans quel panneau. Un telephone tenu PAR un personnage comme objet de la scene n\'est PAS un ecart ; ce qui l\'est, c\'est la scene entiere enfermee dans un appareil.\n(D) TRAIT DE SÉPARATION — un panneau montre-t-il une démarcation nette et droite qui coupe un visage, une peau ou un objet en deux moitiés d\'aspect différent (un côté traité, un côté non traité) ? Réponds coupure_nette = true et dis où. Le modèle vidéo garde ce trait pendant tout le clip et la transformation ne se fait jamais.\nATTENDUS : ' + JSON.stringify(attendus) + '\nLa question (5) ne se pose QUE pour les panneaux où le produit est attendu ; ailleurs, produit_fidele = true et produit_ecart vide.\nRéponds UNIQUEMENT par un JSON {"panneaux":[{"panneau":1,"ce_que_je_vois":"…","absents":["…"],"texte_lisible":false,"ou":"…","produit_visible":false,"locuteur_40pc":true,"visage_locuteur":true,"forme_illisible":false,"forme_illisible_ou":"…","expression_extreme":false,"produit_fidele":true,"produit_ecart":"…","coupure_nette":false,"coupure_ou":"…","ecran":false,"pose_pub":false,"tenue_inadaptee":false,"tenue_ecart":"…"}],"personnages_identiques":true,"personnages_ecart":"…","style_identique":true,"style_ecart":"…","mascotte_identique":true,"mascotte_ecart":"…","produit_meme_objet":true,"produit_objet_ecart":"…"}.' });
            const cg = await vjson(`${LOCATION}-aiplatform.googleapis.com`, `/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-2.5-flash:generateContent`, { contents: [{ role: 'user', parts: parts2 }], generationConfig: { temperature: 0, maxOutputTokens: 9000, thinkingConfig: { thinkingBudget: 1024 }, responseMimeType: 'application/json' } });   // v6.53 : 2000 jetons tronquaient le JSON (« Unterminated string »), le controle sautait
            const cq = JSON.parse(textOf(cg)); const lignes = Array.isArray(cq.panneaux) ? cq.panneaux : []; lignesCtrl = lignes;
            P.steps.push({ etape: 'Contrôle de la planche (présence des locuteurs, texte)', resultat: lignes });
            panels.forEach((ir, i) => {
              const l = lignes.find(x => Number(x.panneau) === i + 1) || {};
              if (l.texte_lisible) log('Remarque : du texte apparaît dans le panneau ' + (i + 1) + ' (' + String(l.ou || '').slice(0, 80) + ') ; Veo le recopiera déformé.');
              const att = (ir.personnages || []).filter(Boolean), abs = (l.absents || []).filter(nm => att.some(x => norm(x) === norm(nm)));
              if (!abs.length) return;
              if (abs.length === att.length && att.length > 1) { log('Contrôle peu fiable sur le panneau ' + (i + 1) + ' (aucun personnage reconnu) : ignoré.'); return; }
              const parlants = VOIX_OFF_RUN ? new Set() : new Set((P.plan.clips || []).filter(c2 => (c2.references || [])[0] === ir.id).flatMap(c2 => (c2.repliques || []).map(r => norm(repLoc(r)))));
              const muets = abs.filter(nm => !parlants.has(norm(nm))), locAbs = abs.filter(nm => parlants.has(norm(nm)));
              if (muets.length) log('Remarque : ' + muets.join(', ') + ' n\'est pas visible dans « ' + ir.id +' » ; ce personnage n\'apparaîtra pas dans le clip.');
              if (locAbs.length) absentsLoc.push('« ' + ir.id + ' » (décor ' + (ir.decor || '?') + ') : ' + locAbs.join(', '));
            });
            // Le produit doit être dans le panneau du clip d'appel à l'action : c'est le clip qui vend, et Veo ne peut montrer que ce qui est dans son image.
            const dernier = (P.plan.clips || []).slice().sort((x, y) => (Number(x.bloc) || 0) - (Number(y.bloc) || 0)).pop();
            const refCta = dernier && (dernier.references || [])[0];
            const iCta = panels.findIndex(ir => ir.id === refCta);
            if (iCta >= 0 && p.produit) {
              const lc = lignes.find(x => Number(x.panneau) === iCta + 1) || {};
              if (lc.produit_visible === false) absentsLoc.push('« ' + panels[iCta].id + ' » : le PRODUIT est absent du panneau du dernier clip (celui de l\'appel à l\'action)');
            }
            lignes.forEach((l2, k2) => { if (!VOIX_OFF_RUN && l2 && l2.locuteur_40pc === false) log('Remarque : dans le panneau ' + (l2.panneau || k2 + 1) + ', le locuteur occupe moins de 40 % de la hauteur ; sur un téléphone il sera illisible et Veo peut lui ajouter une tête.'); });
            // v6.18 — un panneau dont le clip contient une réplique DOIT montrer le visage du locuteur : sans visage,
            // Veo invente une tête pour porter la voix, et le personnage change d'un clip à l'autre.
            panels.forEach((ir, i4) => {
              const l3 = lignes.find(x => Number(x.panneau) === i4 + 1) || {};
              if (l3.visage_locuteur !== false) return;
              const cs = (P.plan.clips || []).filter(c2 => (c2.references || [])[0] === ir.id);
              const parle = !VOIX_OFF_RUN && cs.some(c2 => (c2.repliques || []).length > 0);   // v6.22 : plus d'exemption « sans_bouche »
              if (parle) ecartsIdentite.push('panneau ' + (i4 + 1) + ' (« ' + ir.id + ' ») : le visage du locuteur n\'est pas dans le cadre alors qu\'il parle dans ce clip — on ne voit qu\'une main ou un dos');
            });
            panels.forEach((ir, i6) => {
              const l4 = lignes.find(x => Number(x.panneau) === i6 + 1) || {};
              if (l4.forme_illisible === true) ecartsIdentite.push('panneau ' + (i6 + 1) + ' : forme illisible coupée par le bord au premier plan (' + String(l4.forme_illisible_ou || '').slice(0, 90) + ') — Veo devra inventer ce que c\'est et produira une masse mouvante');
              if (l4.expression_extreme === true) ecartsIdentite.push('panneau ' + (i6 + 1) + ' : expression trop poussée dans l\'image de départ — en l\'animant, Veo déforme le visage et le personnage cesse de se ressembler');
              // v6.29 — le defaut inverse. La regle precedente poussait vers « un sourire leger ou un visage
              // neutre », donc vers le plat : une image de depart sans emotion lisible donne un jeu sans emotion.
              // Non bloquant (refaire la planche coute plus cher que ca ne rapporte), mais dit en clair.
              if (l4.expression_absente === true) log('Remarque : panneau ' + (i6 + 1) + ' — aucune émotion lisible sur le visage de départ, l\'animation partira plate. L\'image doit porter une émotion qu\'on peut nommer, tenue, jamais à son sommet.');
            });
            if (cq.personnages_identiques === false) ecartsIdentite.push('IDENTITÉ : ' + String(cq.personnages_ecart || 'un personnage change d\'un panneau à l\'autre').slice(0, 220));
            if (cq.style_identique === false) log('Remarque : écart de style signalé (' + String(cq.style_ecart || 'un panneau est rendu dans un autre style').slice(0, 160) + ') — v6.51 : la planche n\'est PLUS refaite pour un écart de style (une planche refaite coûte 0,15 à 0,45 $ et remplaçait une planche souvent meilleure) ; regarde la vignette.');
            // v6.13 — un écart non nommé n'est pas un écart : sans description précise, le contrôle a buté sur un
            // détail illisible (petits caractères, netteté) et refaire l'image dégraderait une planche correcte.
            if (p.produit) { lignes.filter(l2 => l2 && l2.produit_fidele === false).forEach(l2 => {
              const e = String(l2.produit_ecart || '').trim();
              if (e.length < 15) { log('Remarque : le contrôle juge le produit différent dans le panneau ' + (l2.panneau || '?') + ' sans pouvoir dire en quoi : ignoré, l\'image est conservée.'); return; }
              koLignes.push(l2); ecartsProduit.push('panneau ' + (l2.panneau || '?') + ' : ' + e.slice(0, 140));
            }); }
            if (cq.produit_meme_objet === false) { const e5 = String(cq.produit_objet_ecart || 'le produit change d\'un panneau à l\'autre').slice(0, 200); koLignes.push(...panels.map((x6, i7) => ({ panneau: i7 + 1 })).filter(x6 => lignes.find(l5 => Number(l5.panneau) === x6.panneau && l5.produit_visible !== false))); ecartsProduit.push('le produit n\'est pas le même objet d\'un panneau à l\'autre : ' + e5); }
            lignes.filter(l8 => l8 && l8.pose_pub === true).forEach(l8 => { const k8 = Number(l8.panneau) - 1; if (k8 >= 0 && k8 < panels.length) aRetoucher.set(k8, Object.assign(aRetoucher.get(k8) || {}, { pose: true })); });
            lignes.filter(l8 => l8 && l8.tenue_inadaptee === true).forEach(l8 => { const k8 = Number(l8.panneau) - 1; if (k8 >= 0 && k8 < panels.length) aRetoucher.set(k8, Object.assign(aRetoucher.get(k8) || {}, { tenue: String(l8.tenue_ecart || 'tenue inadaptée au lieu').slice(0, 160) })); log('Remarque : panneau ' + (l8.panneau || '?') + ' — tenue inadaptée au lieu (' + String(l8.tenue_ecart || '').slice(0, 100) + ') : retouche ciblée de ce seul panneau.'); });
            lignes.filter(l8 => l8 && l8.pose_pub === true).forEach(l8 => log('Remarque : panneau ' + (l8.panneau || '?') + ' — le personnage POSE face à l\'objectif au lieu d\'être pris au milieu d\'un geste : le clip n\'aura qu\'un visage qui bouge pendant huit secondes.'));
            lignes.filter(l7 => l7 && l7.ecran === true).forEach(l7 => ecartsIdentite.push('panneau ' + (l7.panneau || '?') + ' : la scène est enfermée dans un écran ou un téléphone au lieu d\'être la photo elle-même — Veo animerait le cadre de l\'appareil'));
            lignes.forEach(l6 => { if (l6 && l6.coupure_nette === true) log('Remarque : panneau ' + (l6.panneau || '?') + ' — démarcation nette en deux moitiés d\'aspect différent (' + String(l6.coupure_ou || '').slice(0, 80) + ') : Veo garde ce trait pendant tout le clip, la transformation ne se jouera pas à l\'image.'); });
            if (cq.mascotte_identique === false) log('Remarque : le personnage personnifié change d\'un panneau à l\'autre (' + String(cq.mascotte_ecart || '').slice(0, 120) + ') : son identité dérivera entre les clips.');
          } catch (e) { log('Contrôle de la planche indisponible (' + String(e.message || e).slice(0, 80) + ') : on continue.'); }
          if (CONTROLES) { await Promise.all(panels.map(ir => describeImg(ir))); }
          if (absentsLoc.length) { const err = new Error('ÉLÉMENT ABSENT DE SON IMAGE (arrêt avant Veo, aucun clip payé) : ' + absentsLoc.join(' | ') + '. Veo part de l\'image : un locuteur qui n\'y figure pas ne parlera jamais, sa réplique irait à un autre visage.'); err.fatal = true; err.manquants = absentsLoc; throw err; }
          // v6.3 — le produit est le seul objet que le client recevra vraiment : une planche où il ne ressemble pas à sa photo
          // est refaite UNE fois, avant tout clip payé. Au second passage on garde la planche et on signale, pour ne jamais bloquer la production.
          if (ecartsIdentite.length && !tolerantProduit) { const err = new Error('PERSONNAGE OU STYLE INCOHÉRENT ENTRE LES PANNEAUX (arrêt avant Veo, aucun clip payé) : ' + ecartsIdentite.join(' | ')); err.fatal = true; err.identiteKo = ecartsIdentite; throw err; }
          if (ecartsIdentite.length) log('⚠ Incohérence de personnage ou de style encore présente après une reprise : ' + ecartsIdentite.join(' | ') + '. Regarde les vignettes avant de diffuser.');
          // v6.51 — RETOUCHE CIBLEE D'UN PANNEAU (pose pour la camera, tenue inadaptee au lieu). Avant, un defaut de
          // planche faisait refaire LES TROIS DECORS (0,15 a 0,45 $) et remplacait souvent une planche correcte par une pire.
          // Maintenant : une seule image, plein cadre, a partir du panneau lui-meme : meme personne, meme lieu, meme lumiere,
          // seul le defaut change. Au plus 3 panneaux, et seulement si le budget des clips reste garanti.
          // v6.55 — L'IMAGE DOIT MONTRER CE QUE LE VERS DIT. Mesure (run 88002b0d) : les plans 17 et 18 montraient une chambre qui baille puis une carte
          // au lieu de la reunion et du portrait voulus, et la planche partait telle quelle. Un seul controle bon marche (Flash) compare chaque image au
          // vers et a l'intention de son plan ; l'image qui ne montre pas la scene est redessinee SEULE (au plus 3, budget Veo garanti).
          if (MINI_RUN && process.env.CONTROLE_SCENE !== '0') {
            try {
              const att6 = panels.map((ir, i) => { const cs = (P.plan.clips || []).filter(c => (c.references || [])[0] === ir.id);
                const c0 = cs[0] || {}; return { i, txt: ((c0.repliques || []).map(r => repTexte(r)).join(' ') || '').slice(0, 160), intention: String(c0.intention || '').slice(0, 140), role: String(c0.role || ''), rendu: String(c0.rendu || ''), action: String(c0.prompt_veo || '').slice(0, 220) }; })
                .filter(x => x.txt && genImgs[panels[x.i].id]);
              if (att6.length) {
                const ps7 = [];
                att6.forEach(x => { ps7.push({ text: 'PANNEAU ' + (x.i + 1) + ' — vers chanté : « ' + x.txt + ' » ; ce que le spectateur doit ressentir : ' + x.intention + ' ; rôle : ' + x.role + ' ; action voulue : ' + x.action + ' :' }); ps7.push({ inlineData: { mimeType: genImgs[panels[x.i].id].mime || 'image/png', data: genImgs[panels[x.i].id].data } }); });
                ps7.push({ text: 'Pour CHAQUE panneau : l\'image montre-t-elle, à première vue, la scène que dit le vers (le geste, le lieu, la personne et la sensation voulus) ? correspond = false UNIQUEMENT si un spectateur qui entend le vers verrait autre chose (mauvais lieu, mauvais geste, mauvaise personne, objet sans rapport, scène vide). Un détail de style ou de pose n\'est pas un écart. Si false, `ecart` dit en ANGLAIS, en une phrase de 15 à 35 mots, ce que l\'image doit montrer à la place (lieu, personne, geste précis, lumière). JSON : {"panneaux":[{"panneau":1,"correspond":true,"ecart":""}]}' });
                const g7 = await vjson(`${LOCATION}-aiplatform.googleapis.com`, `/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-2.5-flash:generateContent`, { contents: [{ role: 'user', parts: ps7 }], generationConfig: { temperature: 0, maxOutputTokens: 4000, thinkingConfig: { thinkingBudget: 0 }, responseMimeType: 'application/json' } });
                const q7 = (JSON.parse(textOf(g7)).panneaux || []);
                const ko7 = q7.filter(x => x && x.correspond === false && String(x.ecart || '').trim().length >= 15);
                P.steps.push({ etape: 'Contrôle image / vers (v6.55)', resultat: q7 });
                ko7.forEach(x => { const k7 = Number(x.panneau) - 1; if (k7 >= 0 && k7 < panels.length) { aRetoucher.set(k7, Object.assign(aRetoucher.get(k7) || {}, { scene: String(x.ecart).slice(0, 260) })); log('Contrôle image / vers : le panneau ' + (k7 + 1) + ' ne montre pas son vers (' + String(x.ecart).slice(0, 110) + ') → redessiné seul.'); } });
                if (!ko7.length) log('Contrôle image / vers : les ' + att6.length + ' images montrent leur vers.');
              }
            } catch (e7) { log('Contrôle image / vers indisponible (' + String(e7.message || e7).slice(0, 80) + ') : on continue.'); }
          }
          if (aRetoucher.size) {
            const liste = [...aRetoucher.entries()].slice(0, 3);
            for (const [iR, why] of liste) {
              const ir = panels[iR]; if (!ir || !genImgs[ir.id]) continue;
              if (budRestant() < 0.2) { log('Retouche du panneau ' + (iR + 1) + ' non lancée : le budget des clips Veo passe avant (reste ' + budRestant().toFixed(2) + ' $ de marge). Défaut signalé, image conservée.'); continue; }
              const cs = (P.plan.clips || []).filter(c => (c.references || [])[0] === ir.id);
              const geste = cs.map(c => c.debut_du_clip || ((c.repliques || [])[0] || {}).geste || '').filter(Boolean)[0] || '';
              const dem = [];
              if (why.tenue) dem.push('OUTFIT: the clothes drawn do not suit this place (' + why.tenue + '). Dress the person as a real person of this market is dressed in this exact place at this hour: at an office, in a meeting, in the street or on a visit — tidy everyday work clothes (shirt or polo, long trousers or a long skirt, closed shoes); at home in the evening or morning — clean home clothes. Never shorts, a vest, a night T-shirt or flip-flops at an office. Same face, same skin, same hair, same build.');
              if (why.scene) dem.push('SCENE: the image does not show what the line of the song says. Redraw it so that it clearly shows: ' + why.scene + ' Same person (same face, skin tone, hair, build), same rendering style and colour grade; you MAY change the place, the framing and the gesture as needed. The emotion must be readable on the face at a glance.');
              if (why.pose) dem.push('ACTION: the person poses for the lens. Redraw them caught in the MIDDLE of a small real gesture of their own routine, eyes on what they are doing and not on the camera, hands busy' + (geste ? ' — the gesture of this clip: ' + String(geste).slice(0, 220) : '') + '. The face carries one readable mild emotion that can be named at a glance (tired, uneasy, worried, relieved), held below its peak, never a grin and never a grimace.');
              const ps6 = [
                { text: (why.scene ? 'Redraw the attached image as ONE image, same vertical 9:16 framing and same rendering style. Keep EXACTLY the identity of the person (face, skin tone, hairstyle, build) and the colour grade' : 'Redraw the attached image as ONE photograph, same vertical 9:16 framing. Keep EXACTLY: the place (same room, same furniture, same objects, same windows), the light and its direction, the camera angle and distance, the rendering style, the grain, the face, skin tone, hairstyle and build of the person') + (hasProduct(ir) ? ', and the product container exactly as drawn' : '') + '. Change ONLY what follows.\n' + dem.join('\n') + '\nNo text, no letters, no numbers, no logo anywhere. Every screen is switched off.' },
                { inlineData: { mimeType: genImgs[ir.id].mime || 'image/png', data: genImgs[ir.id].data } }
              ];
              try {
                let r6 = null, ip6 = null;
                for (const cfg of [{ responseModalities: ['TEXT', 'IMAGE'], imageConfig: { aspectRatio: '9:16', imageSize: '2K' } }, { responseModalities: ['TEXT', 'IMAGE'], imageConfig: { aspectRatio: '9:16' } }]) {
                  try { r6 = await vjsonImage('aiplatform.googleapis.com', imgPath(hasProduct(ir)), { contents: [{ role: 'user', parts: ps6 }], generationConfig: cfg }); ip6 = (r6.candidates?.[0]?.content?.parts || []).find(x => x.inlineData); } catch (e6) { continue; }
                  if (ip6) break;
                }
                if (!ip6) throw new Error('aucune image rendue');
                const fname6 = `${id}_ref_${ir.id}.png`;
                archiver(fname6, 'avant_retouche_de_la_scene');
                fs.writeFileSync(path.join(OUT, fname6), Buffer.from(ip6.inlineData.data, 'base64'));
                genImgs[ir.id] = { data: ip6.inlineData.data, mime: ip6.inlineData.mimeType || 'image/png' };
                P._rep = (P._rep || 0) + 1;
                const rr6 = (P.refs || []).find(x => x.id === ir.id); if (rr6) rr6.file = fname6 + '?v=r' + P._rep;
                log('Panneau ' + (iR + 1) + ' (« ' + ir.id + ' ») retouché seul' + (why.tenue ? ' (tenue adaptée au lieu)' : '') + (why.pose ? ' (geste pris en cours de mouvement au lieu d\'une pose)' : '') + ' : le reste de la planche est intact.');
              } catch (e6) { log('Retouche du panneau ' + (iR + 1) + ' impossible (' + String(e6.message || e6).slice(0, 90) + ') : image conservée.'); }
            }
            P.steps.push({ etape: 'Retouche ciblée de panneau (pose / tenue)', panneaux: liste.map(x => x[0] + 1), details: liste.map(x => x[1]) });
          }
          // v6.10 — refaire la planche entière ne corrige pas le produit : dans une grille 2x2, le modèle redessine
          // l'étiquette de mémoire et la rate deux fois sur deux. Le panneau fautif est donc RETOUCHÉ seul, en plein
          // cadre, par une édition d'image : « garde cette scène à l'identique, remplace le produit par celui de la photo ».
          // v6.37 — LA PASSE PRODUIT DEVIENT SYSTEMATIQUE. Mesure : dans une grille 2x2, le produit occupe trop peu de
          // pixels et le modele dessine un objet generique de la meme famille (un tube rose a la place d'un stick a
          // capuchon-eponge), SANS etiquette. Le controle, qui tranche « en cas de doute, fidele », laissait passer.
          // Chaque panneau qui montre le produit est donc repasse en PLEIN CADRE contre la photo, qu'un ecart ait ete
          // signale ou non : c'est la seule configuration ou le modele copie reellement l'objet.
          const cibles = p.produit ? panels.map((ir, i7) => ({ ir, i7 })).filter(({ ir, i7 }) => {
            const l7 = lignesCtrl.find(x => Number(x.panneau) === i7 + 1) || {};
            return hasProduct(ir) || l7.produit_visible === true;
          }).map(({ i7 }) => (koLignes.find(l8 => Number(l8.panneau) === i7 + 1) || { panneau: i7 + 1 })) : [];
          if (cibles.length) {
            // v6.46 — TRIAGE AU REGARD DE TELEPHONE. La passe produit etait systematique (0,15 $ par image) : elle
            // redessinait des panneaux deja bons pour des details qu'un client ne voit pas en faisant defiler son
            // telephone. On pose d'abord UNE question bon marche (Flash) : « un client qui regarde quelques secondes
            // voit-il un AUTRE objet ? ». Seuls les panneaux ou la reponse est oui sont repasses. Les details
            // minuscules (texte d'etiquette, logo, finition, proportions legeres) ne declenchent plus rien.
            // Un objet generique a la place du produit, lui, reste flagrant : silhouette, couleur, bouchon, etiquette.
            let aRepasser = cibles;
            if (process.env.PASSE_PRODUIT !== 'toujours') {
              try {
                const ps5 = [{ text: 'PHOTO DU PRODUIT REEL (reference) :' }, { inlineData: { mimeType: p.produit.mime, data: p.produit.data } }];
                cibles.forEach(l9 => { const ir9 = panels[Number(l9.panneau) - 1]; if (ir9 && genImgs[ir9.id]) { ps5.push({ text: 'PANNEAU ' + l9.panneau + ' :' }); ps5.push({ inlineData: { mimeType: genImgs[ir9.id].mime || 'image/png', data: genImgs[ir9.id].data } }); } });
                ps5.push({ text: 'Tu regardes chaque panneau comme un client qui fait defiler son telephone : quelques secondes, sans zoomer, sans chercher l\'erreur. Question par panneau : cet objet est-il VISIBLEMENT un autre objet que celui de la photo ? Reponds a_corriger = true UNIQUEMENT si l\'ecart saute aux yeux : silhouette differente, couleur dominante differente, bouchon ou capuchon d\'une autre forme, contenant generique a la place du produit, etiquette absente alors que la photo en a une, ou produit absent alors qu\'il devrait y etre. Reponds a_corriger = false pour tout le reste : texte d\'etiquette flou ou illisible, logo imprecis, finition, reflets, leger ecart de proportion, angle, nettete. Tu ne compares AUCUN texte. En cas de doute sur ce qu\'un client verrait, reponds false.\nReponds UNIQUEMENT par un JSON {"panneaux":[{"panneau":1,"a_corriger":false,"raison":"…"}]}' });
                const g5 = await vjson(`${LOCATION}-aiplatform.googleapis.com`, `/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-2.5-flash:generateContent`, { contents: [{ role: 'user', parts: ps5 }], generationConfig: { temperature: 0, maxOutputTokens: 1500, thinkingConfig: { thinkingBudget: 0 }, responseMimeType: 'application/json' } });
                const q5 = JSON.parse(textOf(g5)).panneaux || [];
                if (q5.length) {
                  const ko5 = new Set(q5.filter(x => x && x.a_corriger === true).map(x => Number(x.panneau)));
                  // un panneau dont le controle de planche avait deja signale le produit est toujours repasse
                  koLignes.forEach(l8 => ko5.add(Number(l8.panneau)));
                  aRepasser = cibles.filter(l9 => ko5.has(Number(l9.panneau)));
                  P.steps.push({ etape: 'Triage produit (regard de telephone)', resultat: q5 });
                  log('Triage produit (regard de téléphone) : ' + (cibles.length - aRepasser.length) + ' panneau(x) déjà fidèle(s) laissé(s) tel(s) quel(s), ' + aRepasser.length + ' à repasser' + (aRepasser.length ? ' (' + aRepasser.map(x => x.panneau).join(', ') + ')' : '') + '. Chaque retouche évitée économise environ 0,15 $.');
                }
              } catch (e5) { log('Triage produit indisponible (' + String(e5.message || e5).slice(0, 80) + ') : passe systématique comme avant.'); aRepasser = cibles; }
            }
            if (aRepasser.length) log('Passe produit : ' + aRepasser.length + ' panneau(x) repassé(s) en plein cadre contre la photo du produit (dans une planche 2x2 le produit est trop petit pour être copié fidèlement).');
            for (const l2 of aRepasser) {
              const iP = Number(l2.panneau) - 1, ir = panels[iP];
              if (!ir || !genImgs[ir.id]) continue;
              if (budRestant() < 0.2) { log('Retouche produit du panneau ' + l2.panneau + ' non lancée : le budget des clips Veo passe avant (marge ' + budRestant().toFixed(2) + ' $). Image conservée.'); continue; }   // v6.52
              const ps3 = [
                { text: 'Redraw the FIRST attached image exactly as it is: same scene, same framing, same people, same faces, same skin tones, same hair, same clothes, same poses, same hands, same expressions, same light, same shadows, same background, same colours, same rendering style. Change ONE thing only: the product container. The product drawn there is NOT the real product (' + String(l2.produit_ecart || 'it was drawn from imagination, as a generic object of the same family').slice(0, 220) + ')' + (P._fiche && P._fiche.description_en ? '. The real product is: ' + P._fiche.description_en : '') + '. Replace it with the CONTAINER of the product of the SECOND attached photo, copied exactly — only the container: whatever lies beside or in front of it in that photo' + (P._fiche && P._fiche.hors_contenant ? ' (' + P._fiche.hors_contenant + ')' : '') + ' is packshot decoration, never drawn, and anything already loose in the scene that is not held in a hand is removed. Same container shape and proportions, same material and transparency, same container colour, same cap shape and colour, same label background colour, same label text colour, same label position and size on the container, same graphic elements, same colour of the visible content' + (P._fiche && P._fiche.conflit ? ', and the label carries NO readable brand name — same label, same colours, same place, lettering not legible; never write another name on it.' : ', same wording in the same places at the same relative type sizes.') + ' Keep it in the same place in the frame, at the same size, held the same way, label facing the lens. Do not re-letter it, do not translate it, do not simplify it, do not restyle it, do not change its colours for the harmony of the frame. COPY THE DESIGN, NOT THE PHOTOGRAPH. The shape, the colours, the label layout and the wording come from the product photo; the LIGHT comes from this scene. The product is lit by the same light sources, from the same direction, at the same colour temperature and the same softness as the hand and the furniture around it. It casts a real contact shadow on whatever it rests on or against, it picks up the reflections and the colour bounce of the room, its edges have the same focus and the same grain as the rest of the frame, and its scale matches the hand holding it. Never a clean cut-out pasted on top of the scene, never a product sharper or brighter than its surroundings, never a product without a shadow. Change nothing else in the image. Vertical 9:16, full frame, no border, no caption, no device frame, no phone or screen around the scene, no text anywhere except the product label.' },
                { inlineData: { mimeType: genImgs[ir.id].mime || 'image/png', data: genImgs[ir.id].data } },
                { text: 'Real product photo — the absolute reference:' },
                { inlineData: { mimeType: p.produit.mime || 'image/png', data: p.produit.data } }
              ];
              try {
                let r3 = null, ip3 = null;
                for (const cfg of [{ responseModalities: ['TEXT', 'IMAGE'], imageConfig: { aspectRatio: '9:16', imageSize: '2K' } }, { responseModalities: ['TEXT', 'IMAGE'], imageConfig: { aspectRatio: '9:16' } }]) {
                  try { r3 = await vjsonImage('aiplatform.googleapis.com', imgPath(true), { contents: [{ role: 'user', parts: ps3 }], generationConfig: cfg }); ip3 = (r3.candidates?.[0]?.content?.parts || []).find(x => x.inlineData); } catch (e3) { continue; }
                  if (ip3) break;
                }
                if (!ip3) throw new Error('aucune image rendue');
                const fname3 = `${id}_ref_${ir.id}.png`;
                archiver(fname3, 'avant_remplacement_du_produit');
                fs.writeFileSync(path.join(OUT, fname3), Buffer.from(ip3.inlineData.data, 'base64'));
                genImgs[ir.id] = { data: ip3.inlineData.data, mime: ip3.inlineData.mimeType || 'image/png' };
                P._rep = (P._rep || 0) + 1;
                const rr = (P.refs || []).find(x => x.id === ir.id); if (rr) rr.file = fname3 + '?v=p' + P._rep;
                log('Produit retouché sur « ' + ir.id + ' » : le panneau a été redessiné en plein cadre à partir de la photo produit, le reste de la scène inchangé.');
              } catch (e3) { log('Retouche du produit impossible sur « ' + ir.id + ' » (' + String(e3.message || e3).slice(0, 90) + ').'); }
            }
            P.steps.push({ etape: 'Passe produit en plein cadre', panneaux: aRepasser.map(x => x.panneau), ecarts: ecartsProduit });
            // v6.37 — VERIFICATION APRES LA PASSE, et c'est elle qui decide. La question est posee en termes d'OBJET :
            // un objet generique de la meme famille (un tube a la place d'un stick, un flacon lisse a la place d'un pot)
            // n'est pas le produit, meme s'il est joli et de la bonne couleur.
            if (aRepasser.length) try {
              const ps4 = [{ text: 'PHOTO DU PRODUIT REEL (reference absolue) :' }, { inlineData: { mimeType: p.produit.mime, data: p.produit.data } }];
              aRepasser.forEach(l9 => { const ir9 = panels[Number(l9.panneau) - 1]; if (ir9 && genImgs[ir9.id]) { ps4.push({ text: 'PANNEAU ' + l9.panneau + ' :' }); ps4.push({ inlineData: { mimeType: 'image/png', data: genImgs[ir9.id].data } }); } });
              ps4.push({ text: 'Pour chaque panneau : l\'objet dessine est-il LE MEME OBJET que celui de la photo ? Tu compares sa SILHOUETTE et ses proportions, sa COULEUR, la FORME ET LA COULEUR de son bouchon ou de son capuchon, et la presence d\'une etiquette au meme endroit. Un objet generique de la meme famille — un tube a la place d\'un stick, un flacon lisse a la place d\'un pot, un contenant sans etiquette alors que la photo en a une — n\'est PAS le meme objet : reponds meme_objet = false. Tu ne compares AUCUN texte ni aucun nom de marque. Tu ignores la lumiere, l\'angle, la nettete et les reflets. En cas de doute sur la silhouette, reponds false : ce produit est le seul objet que le client recevra vraiment.\nReponds UNIQUEMENT par un JSON {"panneaux":[{"panneau":1,"meme_objet":true,"ecart":"…"}]}' });
              const cg4 = await vjson(`${LOCATION}-aiplatform.googleapis.com`, `/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-2.5-flash:generateContent`, { contents: [{ role: 'user', parts: ps4 }], generationConfig: { temperature: 0, maxOutputTokens: 1500, thinkingConfig: { thinkingBudget: 0 }, responseMimeType: 'application/json' } });
              const q4 = JSON.parse(textOf(cg4)), ko4 = (q4.panneaux || []).filter(x => x && x.meme_objet === false);
              P.steps.push({ etape: 'Verification du produit apres la passe', resultat: q4.panneaux || [] });
              if (ko4.length) {
                const det = ko4.map(x => 'panneau ' + (x.panneau || '?') + ' : ' + String(x.ecart || 'ce n\'est pas le meme objet').slice(0, 120));
                if (!tolerantProduit) { const err4 = new Error('PRODUIT NON FIDÈLE APRÈS LA PASSE EN PLEIN CADRE (arrêt avant Veo, aucun clip payé) : ' + det.join(' | ')); err4.fatal = true; err4.produitKo = det; throw err4; }
                log('⚠ Le produit ne ressemble toujours pas à sa photo après une planche refaite et une passe en plein cadre (' + det.join(' | ') + '). Regarde les vignettes avant de diffuser : la photo produit est peut-être trop petite, de biais ou trop sombre pour être copiée.');
              } else log('Produit vérifié après la passe : même objet que la photo sur ' + aRepasser.length + ' panneau(x).');
            } catch (e4) { if (e4 && e4.fatal) throw e4; log('Vérification du produit indisponible (' + String(e4.message || e4).slice(0, 80) + ') : on continue.'); }
          }
          if (ecartsProduit.length) log('⚠ Le contrôle de planche avait signalé le produit (' + ecartsProduit.join(' | ') + ') : la passe en plein cadre est passée dessus.');
          return true;
        };
        const lancerGrille = g => genPlanche(undefined, undefined, g).catch(e => {
          if (e && e.fatal && (e.identiteKo || e.produitKo) && !e.retente && budRestant() < 0.5) { log('⚠ ' + (e.identiteKo ? 'Incohérence de personnage' : 'Produit non fidèle') + ' signalé(e), mais la reprise de planche (0,15 à 0,45 $) n\'est pas lancée : le budget des clips Veo passe avant (marge ' + budRestant().toFixed(2) + ' $). Planche conservée, regarde les vignettes.'); e.fatal = false; e.sauter = true; return 'sauter'; }
          if (e && e.sauter) return 'sauter';
          if (e && e.fatal) throw e;   // défaut du plan, pas de la planche : on s'arrête, on ne repart pas en image par image
          log('Planche impossible (' + String(e.message || e).slice(0, 120) + ') : retour à la génération image par image.'); return false;
        }).catch(async e => {
          if (e && e.fatal && e.manquants && !e.retente) {   // une seule reprise de la planche, en exigeant nommément le personnage manquant
            log('Locuteur manquant (' + e.manquants.join(' | ') + ') : on refait la planche UNE fois en l\'exigeant nommément.');
            return await genPlanche(e.manquants.join(' ; '), undefined, g).catch(e2 => { if (e2) e2.retente = true; throw e2; });
          }
          if (e && e.fatal && e.identiteKo && !e.retente) {   // personnage ou style qui dérive : une seule reprise, puis on continue
            log('Personnage ou style incohérent entre les panneaux (' + e.identiteKo.join(' | ') + ') : on refait la planche UNE fois en verrouillant l\'identité et le style panneau par panneau. Aucun clip n\'a été payé.');
            return await genPlanche('IDENTITÉ : ' + e.identiteKo.join(' ; '), true, g).catch(e2 => { if (e2) e2.retente = true; throw e2; });
          }
          if (e && e.fatal && e.produitKo && !e.retente) {   // produit infidèle : une seule reprise, puis on continue quoi qu'il arrive
            log('Produit non fidèle à sa photo (' + e.produitKo.join(' | ') + ') : on refait la planche UNE fois en imposant les neuf attributs. Aucun clip n\'a été payé.');
            return await genPlanche('PRODUIT : ' + e.produitKo.join(' ; '), true, g).catch(e2 => { if (e2) e2.retente = true; throw e2; });
          }
          throw e;
        });
        const planche = panelsAll.length > 1 && process.env.REF_MODE !== 'sequence' ? await (async () => {
          const ok0 = await lancerGrille(0); if (!ok0) return false;   // v6.52 : la grille 1 d'abord (elle fixe l'identite), puis toutes les autres EN PARALLELE
          if (NGRILLES > 1) {
            log('Grilles 2 à ' + NGRILLES + ' lancées en parallèle (chacune reçoit la grille 1 comme référence d\'identité et de style).');
            const oks = await Promise.all(Array.from({ length: NGRILLES - 1 }, (_, g9) => lancerGrille(g9 + 1)));
            if (oks.some(x => !x)) return false;
          }
          return true;
        })() : false;
        for (const ir of (planche ? [] : irs.filter(x6 => !genImgs[x6.id]))) {
          const parent = ir.suite_de && genImgs[ir.suite_de] ? genImgs[ir.suite_de] : null;
          try { ir.prompt_gemini_agent = ir.prompt_gemini; const pd = parent ? (P.plan._imgDesc || {})[ir.suite_de] : null; ir.prompt_gemini = await directImage(ir, pd);
            if (CONTROLES) { // porte de cohérence AVANT génération : identité, personnages, produit, lumière, hésitations ; une seule réécriture du prompt (texte, quelques centimes) si un écart est démontré
              const usersI = (P.plan.clips || []).filter(c => (c.references || [])[0] === ir.id);
              const cohTxt = t => flashJSON('Tu contrôles le prompt d\'une image de référence AVANT qu\'elle soit générée. Réponds UNIQUEMENT par un JSON {"ok":true,"ecarts":["écart précis et démontrable"]}. Contrôle : (1) pour chaque personnage commun avec l\'image précédente (sa description est fournie), visage, teint, coiffure ou coiffe (voile, hijab, tresses…), corpulence et taille relative sont IDENTIQUES à cette description (seule la tenue peut différer si le lieu l\'impose) ; (2) tous les personnages de la liste sont décrits et aucun autre n\'apparaît ; (3) le produit est décrit si produit_dans_image est vrai et absent sinon ; (4) l\'éclairage décrit correspond à l\'état lumineux demandé par les clips ; (5) aucune formule d\'hésitation (souvent, ou, par exemple, peut-être, ou bien) ; (6) aucun texte lisible n\'est demandé dans l\'image ; (7) aucune contradiction interne (deux positions ou deux tenues pour le même personnage).\nPERSONNAGES : ' + JSON.stringify(ir.personnages) + '\nPRODUIT_DANS_IMAGE : ' + hasProduct(ir) + '\nETATS_LUMINEUX_DES_CLIPS : ' + JSON.stringify(usersI.map(c => c.etat_lumineux)) + '\nDESCRIPTION_IMAGE_PRECEDENTE : ' + JSON.stringify(pd || null) + '\nPROMPT : ' + t);
              let co = await cohTxt(ir.prompt_gemini).catch(() => ({ ok: true })); P.steps.push({ etape: 'Porte de cohérence du prompt d\'image ' + ir.id, ok: co.ok, ecarts: co.ecarts || [] });
              if (co.ok === false && (co.ecarts || []).length) log('Remarque : ' + co.ecarts.length + ' écart(s) possible(s) dans le prompt d\'image « ' + ir.id + ' » (informatif, aucune réécriture : l\'identité est verrouillée par l\'image précédente).');
            }
            if (CONTROLES && P.bible) { // porte sur le prompt d'image réellement envoyé : détails de la synthèse présents, sinon une seule reprise, sinon arrêt avant de payer l'image
              const imgGate = async txt => flashJSON('Ce prompt d\'image de référence contient-il au moins 3 détails CONCRETS issus de la bible (palette_et_produit, monde_general, monde_visuel de l\'angle), et non un décor générique ? Réponds UNIQUEMENT par un JSON {"ok":true,"manque":"2 ou 3 détails précis de la bible à ajouter, adaptés à ce lieu"}.\nBIBLE : ' + JSON.stringify(bibleSlim()) + '\nPROMPT : ' + txt);
              let ig = await imgGate(ir.prompt_gemini).catch(() => ({ ok: true })); P.steps.push({ etape: 'Porte du prompt d\'image ' + ir.id, ok: ig.ok, manque: ig.manque || null });
              if (ig.ok === false) log('Remarque : le prompt d\'image « ' + ir.id + ' » reste assez générique (' + (ig.manque || '') + ') ; l\'image est tout de même générée, tu juges.');
            } save('04_ref_' + ir.id + '_direction_image.txt', ir.prompt_gemini); log('Image « ' + ir.id + ' » : prompt millimétré par le directeur d\'image (' + ir.prompt_gemini.split(/\s+/).length + ' mots).'); } catch (e) { if (/PROMPT D'IMAGE GÉNÉRIQUE/.test(String(e.message))) throw e; log('Directeur d\'image indisponible pour « ' + ir.id + ' » (' + String(e.message || e).slice(0, 80) + ') : prompt de l\'agent conservé.'); }
          log('Image de référence « ' + ir.id + ' » (décor : ' + (ir.decor || '?') + (parent ? ', suite de « ' + ir.suite_de + ' »' : ', sans image précédente') + ', gemini-3-pro-image)…');
          const withProduct = hasProduct(ir);
          const ps = [];
          if (parent) ps.push({ inlineData: { mimeType: parent.mime, data: parent.data } });
          const pdP = parent ? (P.plan._imgDesc || {})[ir.suite_de] : null;
          const commons = pdP && pdP.personnages ? (ir.personnages || []).filter(n => !isProductNode(n) && Object.keys(pdP.personnages).some(k => norm(k) === norm(n))) : [];
          const lockFacts = commons.map(n => { const k = Object.keys(pdP.personnages).find(k => norm(k) === norm(n)); return '- ' + n + ': ' + pdP.personnages[k]; }).join('\n');
          const cont = parent ? 'IDENTITY LOCK. The attached image above is the IDENTITY REFERENCE of the same film. The recurring characters (' + (commons.join(', ') || 'all characters in common') + ') must be EXACTLY the same individuals as in that image: same face (nose, mouth, eyes, cheekbones), same skin tone, same hairstyle and head covering, same body build, and the outfit written in this prompt for this place (it may differ from the reference when the place requires it: office wear at the office), and for a non-human character the SAME object, shape, material, face, accessories and size ratio (never a different object). Do not redesign, restyle or reinterpret them. If any detail below seems to differ from the attached image, the attached image wins. Only the setting, camera framing, lighting, pose and expression change. Do not copy the previous background.\n' + (lockFacts ? 'Appearance of the recurring characters read from the reference image (ignore their pose, position and background in it):\n' + lockFacts + '\n' : '') : '';
          const ptxt = cont + ir.prompt_gemini + '\nThis image is the exact first frame of an 8-second video: characters in their starting position inside the described setting, the whole setting clearly visible and coherent (floor, walls, furniture, light source), natural proportions between people and objects. Format: vertical 9:16, full frame. ABSOLUTELY NO TEXT of any kind in the image: no letters, no words, no labels, no captions, no names, no numbers, no signs, no watermark' + (withProduct ? ' (the product label copied from the product photo is the only text allowed).' : '.') + (withProduct ? '' : ' Do not include any product bottle or packaging.');
          ps.push({ text: ptxt });
          if (withProduct && p.produit) { ps.push({ text: 'Product reference photo (reproduce the product exactly):' }); ps.push({ inlineData: { mimeType: p.produit.mime || 'image/png', data: p.produit.data } }); }
          save('04_ref_' + ir.id + '_prompt.txt', ptxt);
          const im = await vjsonImage('aiplatform.googleapis.com', imgPath((withProduct && p.produit)), {
            contents: [{ role: 'user', parts: ps }], generationConfig: { responseModalities: ['TEXT', 'IMAGE'], maxOutputTokens: 8192 } });
          const fi = fin(im); const ip = (im.candidates?.[0]?.content?.parts || []).find(x => x.inlineData);
          P.steps.push({ etape: '4. Image de référence ' + ir.id, decor: ir.decor, suite_de: ir.suite_de || null, produit_envoye_a_gemini: !!(withProduct && p.produit), image_precedente_fournie: !!parent, prompt_chars: ptxt.length, finishReason: fi.finishReason, image_ko: ip ? sizeKB(ip.inlineData.data) : 0 });
          if (!ip) throw new Error('Pas d\'image pour ' + ir.id + ' (finishReason ' + fi.finishReason + ')');
          const fname = `${id}_ref_${ir.id}.png`; archiver(fname, 'avant_nouvelle_image'); fs.writeFileSync(path.join(OUT, fname), Buffer.from(ip.inlineData.data, 'base64'));
          const rec = { data: ip.inlineData.data, mime: ip.inlineData.mimeType || 'image/png' }; genImgs[ir.id] = rec; P.refs.push({ id: ir.id, file: fname, decor: ir.decor, suite_de: ir.suite_de || null });
          await describeImg(ir);
          if (parent) { // contrôle visuel : le même personnage d'une image à l'autre (visage, teint, coiffure ou coiffe, corpulence) ; sinon on s'arrête AVANT Veo (aucun clip payé)
            try { const g = await vjson(`${LOCATION}-aiplatform.googleapis.com`, `/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-2.5-flash:generateContent`, { contents: [{ role: 'user', parts: [{ text: 'IMAGE A = scène précédente.' }, { inlineData: { mimeType: parent.mime, data: parent.data } }, { text: 'IMAGE B = nouvelle scène.' }, { inlineData: { mimeType: rec.mime, data: rec.data } }, { text: 'Les personnages récurrents (' + (ir.personnages || []).join(', ') + ') sont-ils les MÊMES personnes/personnages dans A et B ? Compare uniquement le visage, le teint, la coiffure ou la coiffe (voile, hijab, tresses), la corpulence et, pour un personnage non humain, sa matière, sa forme et sa taille relative. Ignore la tenue, la pose, le décor et la lumière. Réponds UNIQUEMENT par un JSON {"identiques":true,"differences":"ce qui diffère, précisément"}.' }] }], generationConfig: { temperature: 0, maxOutputTokens: 2048, thinkingConfig: { thinkingBudget: 0 }, responseMimeType: 'application/json' } });
              const q = JSON.parse(textOf(g)); P.steps.push({ etape: 'Contrôle d\'identité ' + ir.id + ' vs ' + ir.suite_de, identiques: q.identiques, differences: q.differences || null });
              if (q.identiques === false) { identFails.push('« ' + ir.suite_de + ' » / « ' + ir.id + ' » : ' + (q.differences || '?')); log('ATTENTION identité : « ' + ir.id + ' » ne ressemble pas à « ' + ir.suite_de + ' » (' + String(q.differences || '').slice(0, 160) + '). Les autres images sont quand même générées pour que tu juges.'); }
            } catch (e) { log('Contrôle d\'identité indisponible pour « ' + ir.id + ' » (' + String(e.message || e).slice(0, 60) + ').'); }
          }
        }
        if (identFails.length) throw new Error('IDENTITÉ DIFFÉRENTE entre images (arrêt avant Veo, aucun clip payé ; toutes les images sont générées, regarde-les). ' + identFails.join(' | '));
      }
      // ---- les textes Veo sont dérivés des images générées (une seule source de vérité : l'image)
      if (Object.keys(genImgs).length) { P.plan._fiche = P._fiche || null; assemblePrompts(P.plan, true, log); save('03_plan.json', { meta: P.meta, plan: P.plan, violations: viol }); }
      // ---- clips Veo, UN PAR UN, chacun suivi d'un contrôle visuel (une seule régénération si échec)
      const selC = clipSel(p.onlyClip);
      const toRun = (P.plan.clips || []).map((c, k) => ({ c, k })).filter(x => !selC || selC.includes(x.k + 1));
      if (!toRun.length) throw new Error('Plan sans clip à générer');
      P.stage = 'clips (Veo)'; P.videos = (P.plan.clips || []).map(c => ({ bloc: c.bloc, state: 'attente' }));
      // v6.75 — REPARTITEUR DE BUDGET. Le modele n'est plus un reglage : il se decide par plan, selon ce que le budget peut acheter
      // pour la qualite de la video ENTIERE (voir plus bas). MC[k] = modele du plan k ; PRISES[k] = 2 prises, la meilleure est gardee.
      const MC = {}, PRISES = {};
      const mdl = k => MC[k] || p.model;
      const tpsM = m => { const tv = TARIFS.veo[m]; return tv ? (VOIX_OFF_RUN && tv.muet != null ? tv.muet : tv.audio) : ((MODELS[m] || {}).usdPerSec || 0); };
      const choisirPrise = async (a, b, c) => {   // Gemini compare deux prises du MEME plan et garde la meilleure
        const parts = [{ text: 'PRISE A :' }, { inlineData: { mimeType: 'video/mp4', data: fs.readFileSync(path.join(OUT, a.file)).toString('base64') } }, { text: 'PRISE B :' }, { inlineData: { mimeType: 'video/mp4', data: fs.readFileSync(path.join(OUT, b.file)).toString('base64') } },
          { text: 'Deux prises du meme plan de publicite verticale (' + String(c.role || c.bloc || '') + '). Intention du plan : ' + String(c.prompt_veo || '').slice(0, 600) + '\nChoisis la meilleure pour un spectateur qui defile son fil : naturel et emotion du visage, mains et corps sans deformation, produit/etiquette fidele et lisible, mouvement fluide et vivant (ni fige ni saccade), lumiere, absence de texte parasite ou d\'objet qui fond. Reponds en JSON : {"meilleure":"A"|"B","raison":"..."}' }];
        for (const mod of ['gemini-2.5-pro', 'gemini-2.5-flash']) {
          try { const g = await vjson(`${LOCATION}-aiplatform.googleapis.com`, `/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${mod}:generateContent`, { contents: [{ role: 'user', parts }], generationConfig: { temperature: 0, maxOutputTokens: 2048, responseMimeType: 'application/json' } }); const q = JSON.parse(textOf(g)); if (q && (q.meilleure === 'A' || q.meilleure === 'B')) return q; } catch (e) { /* modele suivant */ }
        }
        return { meilleure: 'A', raison: 'comparaison indisponible : première prise gardée' };
      };
      const qaClip = async (file, c, refList, prevFile) => {
        const vb64 = fs.readFileSync(path.join(OUT, file)).toString('base64');
        const attendu = (c.repliques || []).map(r => repLoc(r) + ' : « ' + repTexte(r) + ' »').join('\n');
        const parts = [{ inlineData: { mimeType: 'video/mp4', data: vb64 } }];
        if (prevFile) { parts.push({ text: 'CLIP PRÉCÉDENT ACCEPTÉ (pour comparer la voix) :' }); parts.push({ inlineData: { mimeType: 'video/mp4', data: fs.readFileSync(path.join(OUT, prevFile)).toString('base64') } }); }
        refList.forEach(r => parts.push({ inlineData: { mimeType: r.mime, data: r.data } }));
        parts.push({ text: 'Tu contrôles un clip vidéo généré (la vidéo ci-dessus), puis les images de référence (si présentes). Répliques ATTENDUES :\n' + attendu + '\nPersonnages attendus à l\'image : ' + (c.personnages_visibles || []).join(', ') + '. Éclairage attendu : ' + (c.etat_lumineux || '?') + '. Produit attendu à l\'image : ' + (c.produit_visible ? 'oui' : 'non') + '.\nDécor attendu : ' + (c.decor || '?') + '. Aucun son de fond, aucune musique, aucun bruitage ne doit être audible : seulement les voix des locuteurs (silence total s\'il n\'y a pas de réplique).' + (prevFile ? ' Compare aussi la voix du locuteur avec celle du CLIP PRÉCÉDENT fourni après la vidéo à contrôler (la première vidéo est celle à contrôler).' : '') + '\nRéponds UNIQUEMENT par un JSON : {"decor_conforme_aux_references":true|false (le lieu, les murs, le mobilier, la lumière restent cohérents et fidèles à l\'image de référence tout le clip),"son_de_fond_ou_musique_audible":true|false,"ton_coherent_avec_le_sens":true|false (la diction exprime l\'émotion qui convient au sens de chaque phrase),"texte_parasite_visible":true|false (texte lisible non prévu à l\'image),"meme_voix_que_clip_precedent":true|false|null (null si pas de clip précédent ou pas de parole),"repliques_entendues":"transcription","mots_conformes_pct":0-100,"voix_unique_et_stable":true|false,"personnage_inattendu":true|false (un personnage ou une personne non prévu apparaît, ou un personnage change de nature),"personnages_fideles_aux_references":true|false,"lumiere_conforme":true|false,"produit_visible_conforme":true|false,"parole_derniere_seconde":true|false,"remarques":"…"}' });
        const ga = await vjson(`${LOCATION}-aiplatform.googleapis.com`, `/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-2.5-flash:generateContent`, { contents: [{ role: 'user', parts }], generationConfig: { temperature: 0, maxOutputTokens: 4096, responseMimeType: 'application/json' } });
        const q = JSON.parse(textOf(ga));
        const fails = []; if ((q.mots_conformes_pct ?? 100) < 80) fails.push('paroles conformes à ' + q.mots_conformes_pct + ' %'); if (q.voix_unique_et_stable === false) fails.push('voix instable'); if (q.personnage_inattendu) fails.push('personnage inattendu'); if (q.personnages_fideles_aux_references === false) fails.push('personnages infidèles aux références'); if (q.decor_conforme_aux_references === false) fails.push('décor incohérent'); if (q.son_de_fond_ou_musique_audible) fails.push('son de fond/musique audible'); if (q.texte_parasite_visible) fails.push('texte parasite'); if (q.ton_coherent_avec_le_sens === false) fails.push('ton de voix incohérent avec le sens'); if (q.meme_voix_que_clip_precedent === false) fails.push('voix différente du clip précédent');
        return { q, fails };
      };
      const genOne = async (c, k, essai) => {
        const hasSpeech = !VOIX_OFF_RUN && (c.repliques || []).length > 0;   // v6.32 : voix off -> Veo ne genere AUCUN audio (moins cher, et rien a jeter)
        const refsData = [];
        // Veo reçoit UN SEUL média : l'image de référence du clip (le produit y figure déjà si le clip le montre). Jamais la photo produit, jamais deux images.
        const charRefs = []; if (useRefs && P.refMode === 'complet') (c.references || []).slice(0, 1).forEach(r => { if (genImgs[r] && refsData.length < 1) { refsData.push(reduirePourVeo(genImgs[r])); charRefs.push(genImgs[r]); } });
        const vreq = { clip: k + 1, essai, modele: mdl(k), mode_references: P.refMode, decor: c.decor || null, references_images: c.references || [], nb_references_envoyees_a_veo: refsData.length, mode_image: refsData.length ? 'première image (image-to-video)' : 'aucune', references_ko: refsData.map(r => sizeKB(r.data)), duree: 8, aspectRatio: '9:16', prompt_veo_mots: String(c.prompt_veo).split(/\s+/).length, prompt_veo_complet: c.prompt_veo };
        save('05_veo_envoye_clip' + (k + 1) + '_essai' + essai + '.json', vreq); P.steps.push({ etape: '5. Envoi à Veo (clip ' + (k + 1) + ', essai ' + essai + ')', ...vreq });
        log('Veo clip ' + (k + 1) + ' (essai ' + essai + ') : ' + (refsData.length ? 'image du décor imposée comme PREMIÈRE IMAGE (' + sizeKB(refsData[0].data) + ' Ko)' : 'sans image') + ', prompt de ' + vreq.prompt_veo_mots + ' mots…');
        const muets = (c.personnages_visibles || []).filter(nm => !new Set((c.repliques || []).map(r => norm(repLoc(r)))).has(norm(nm)));
        const styleAnim = /\b(3d anim|animated|animation|cartoon|stylis|toon)\b/i.test(String(P.plan.style_visuel || '')) && !/\b(photo-?real|live-action|documentary)\b/i.test(String(P.plan.style_visuel || ''));
        const NEG = (styleAnim ? 'photorealistic, photoreal skin texture, live-action footage, real human photography, hyperrealistic metal android, ' : '') + 'subtitles, captions, closed captions, burned-in text, text overlay, lower third, title card, watermark, logo, letters, words, numbers, signage, lip-sync mismatch, out-of-sync mouth, background music, ambient noise, sound effects, second speaker, two voices, voice change mid-clip, dubbing, floating head, disembodied head, extra face in the air, ghost face, second head above a character, human head on an object, mask hovering, duplicated character, character changing size, character changing shape, morphing character, frozen frame, still photograph, slideshow, scene transition, dissolve, cross-fade, morphing object, object turning into another object, glowing light coming out of the body, magic particles, aura, map, infographic, chart, digital clock, rotating product, spinning bottle'
          + (VOIX_OFF_RUN ? ', speech, dialogue, talking, speaking, voice, voice-over, narration, lip sync, open mouth talking, singing, music' : '')
          + (muets.length ? ', ' + muets.map(nm => nm + ' talking, ' + nm + ' mouth opening, lip movement on ' + nm).join(', ') : '');
        let vid;
        const envoi = { model: mdl(k), prompt: c.prompt_veo, durationSeconds: dureeVeo(c), aspectRatio: '9:16', generateAudio: hasSpeech, negativePrompt: NEG };
        // v6.76 — 1080p natif : le montage compose en 1080x1920 mais Veo rend en 720p par defaut (image agrandie, plus molle). 1080p exige 8 s.
        // Prix du 1080p NON verifie (a lire sur la facture) ; VEO_1080=0 le coupe ; un refus de l'API relance sans.
        if (process.env.VEO_1080 !== '0' && envoi.durationSeconds === 8) envoi.resolution = '1080p';
        if (refsData[0]) envoi.firstFrame = refsData[0];   // première image imposée : Veo anime CETTE image au lieu de s'en « inspirer »
        try { vid = await startJob(envoi); }
        catch (eNeg) {
          const msg = String(eNeg.message || '');
          if (/third-party content|content providers/i.test(msg)) { // un nom propre a été pris pour une marque : on neutralise et on relance une seule fois
            const neutre = c.prompt_veo.split('\n').map((l, i) => i === 0 ? 'Modern 3D animated feature film look, cinematic CG rendering, stylized characters with large expressive eyes, soft global illumination, shallow depth of field.' : l).join('\n');
            log('Veo a refusé le prompt (contenu de marque) : relance une fois avec un style décrit en mots neutres.');
            P.steps.push({ etape: 'Prompt refusé par Veo (contenu tiers) — style neutralisé', clip: k + 1, message: msg.slice(0, 200) });
            vid = await startJob({ ...envoi, prompt: neutre });
            c.prompt_veo = neutre;
          } else if (/resolution|1080/i.test(msg) && envoi.resolution) { log('Le modèle refuse le 1080p : relance en définition par défaut.'); delete envoi.resolution; vid = await startJob(envoi);
          } else if (/negative/i.test(msg)) { log('Le modèle refuse le prompt négatif : relance sans.'); const sansNeg = { ...envoi }; delete sansNeg.negativePrompt; vid = await startJob(sansNeg); }
          else if (/reference ?image|referenceImages/i.test(msg)) { log('⚠ ' + (MODELS[p.model] || {}).label + ' refuse les images de référence. Erreur brute : ' + msg.slice(0, 400)); throw eNeg; }
          else if (/input image|image.*(unsupported|invalid|process)/i.test(msg) && envoi.firstFrame) { log('Image refusée comme première image : relance une fois avec l\'image en pleine définition.'); vid = await startJob({ ...envoi, firstFrame: genImgs[(c.references || [])[0]] }); }
          else throw eNeg;
        }
        while (jobs[vid].state === 'running') await new Promise(r => setTimeout(r, 4000));
        if (jobs[vid].state === 'error' && envoi.durationSeconds !== 8 && /duration|seconds/i.test(String(jobs[vid].error))) {   // v6.52 : un modele qui refuse 4 s repart en 8 s (le montage n'en garde que le plan)
          log('Clip ' + (k + 1) + ' : Veo refuse une durée de ' + envoi.durationSeconds + ' s (' + String(jobs[vid].error).slice(0, 100) + ') → relance en 8 s, le montage n\'en gardera que le plan.');
          envoi.durationSeconds = 8; vid = await startJob(envoi);
          while (jobs[vid].state === 'running') await new Promise(r => setTimeout(r, 4000));
        }
        if (jobs[vid].state === 'error' && envoi.resolution && /resolution|1080/i.test(String(jobs[vid].error))) { log('Clip ' + (k + 1) + ' : 1080p refusé (' + String(jobs[vid].error).slice(0, 100) + ') → relance en définition par défaut.'); delete envoi.resolution; vid = await startJob(envoi); while (jobs[vid].state === 'running') await new Promise(r => setTimeout(r, 4000)); }
        if (jobs[vid].state === 'error') throw new Error(jobs[vid].error);
        const res = { file: jobs[vid].file, cost: jobs[vid].estCost, qa: null, fails: [] };
        log('Clip ' + (k + 1) + ' essai ' + essai + ' : coût estimé $' + jobs[vid].estCost + ' (' + ((MODELS[mdl(k)] || {}).label || mdl(k)) + ', tarif indicatif ' + (MODELS[mdl(k)] || {}).usdPerSec + ' $/s, à vérifier dans la facturation Google Cloud)');
        if (CONTROLES && process.env.QA !== '0') { try { const prev = hasSpeech ? P.videos.slice(0, k).reverse().find(x => x && x.state === 'done' && x.file && x.speech) : null; const r = await qaClip(res.file, c, charRefs, prev ? prev.file : null); res.qa = r.q; res.fails = r.fails; P.steps.push({ etape: 'Contrôle visuel clip ' + (k + 1) + ' (essai ' + essai + ')', ...r }); log('Clip ' + (k + 1) + ' (essai ' + essai + ') contrôle visuel : ' + (r.fails.length ? 'ÉCHEC → ' + r.fails.join(', ') : 'conforme')); } catch (e) { log('Contrôle visuel indisponible (' + String(e.message || e).slice(0, 80) + ') : clip accepté tel quel.'); } }
        return res;
      };
      // Les clips sont indépendants : ils partent tous en même temps (quelques minutes au lieu d'un quart d'heure).
      // UNE SEULE génération par clip, jamais de régénération automatique : le contrôle visuel informe, c'est toi qui décides de relancer.
      { // v6.45 — PLAFOND DE BUDGET. Une production a un budget fixe (BUDGET_USD, 10 $ par defaut ; 0 le desactive) dont une
        // part est reservee aux corrections. Avant d'engager Veo, le poste le plus cher, on projette : depense jusqu'ici +
        // Veo + ElevenLabs. Si la projection depasse le budget moins la reserve, on s'arrete AVANT de depenser.
        const BUD = parseFloat(process.env.BUDGET_USD || p.budget_usd || '10'), RES = parseFloat(process.env.BUDGET_RESERVE || '0.15');
        if (BUD > 0) {
          // v6.51 — ON NE PERD JAMAIS UNE PRODUCTION POUR UNE PROJECTION. Mesure (run 31893949) : 2,78 $ deja depenses dont
          // 0,14 $ d'ElevenLabs ; la v6.50 ajoutait encore 0,60 $ d'ElevenLabs « prevu » (deja paye) et retirait 15 % de
          // reserve de corrections alors qu'aucune correction n'existe apres Veo (une seule generation par clip) :
          // 5,40 $ projetes contre 5,10 $ -> arret, 0 video, alors que le vrai total etait 4,94 $.
          // Regle : depense reelle (ElevenLabs inclus, mesure) + Veo = ce qui reste a payer. On s'arrete seulement si ce
          // total depasse le budget ENTIER. La reserve ne sert plus qu'avant : elle bride les reprises de planche.
          // v6.76 — REPARTITION. Tous les plans partent au modele le moins cher (Lite), puis ce qui reste apres les postes fixes
          // (voix, musique, plans de coupe, images, Gemini, reserve de 15 %) est depense dans l'ordre de ce qui change le plus la
          // video ENTIERE : (1) chaque plan Lite -> Fast, en commencant par l'ouverture, la fin, puis les autres ; (2) l'ouverture en
          // Standard ; (3) deux prises de l'ouverture (Gemini garde la meilleure) ; (4) la fin en Standard ; (5) deux prises de la fin.
          // Un achat qui ne rentre pas n'est pas fait. Un modele impose (model_force) ou REPARTITEUR=0 desactive tout.
          const ladder = ['veo-3.1-lite-generate-001', 'veo-3.1-fast-generate-001', 'veo-3.1-generate-001'];
          const repartition = { base: p.model, achats: [], refuses: [] };
          if (process.env.REPARTITEUR !== '0' && !p.model_force && ladder.includes(p.model)) {
            const veoPlans = toRun.filter(x => !estInsert(x.c));
            veoPlans.forEach(x => { MC[x.k] = ladder[0]; });
            const depR = (P._couts && P._couts.total) || 0;
            const elR = VOIX_OFF_RUN ? (CHANSON_RUN ? 0.40 : 0.25) : 0.10;
            const nCp = process.env.COUPES_ANIMEES === '0' ? 0 : Math.min(8, (String(p.ct || '').match(/"type"\s*:\s*"plan_coupe[a-z_]*"/g) || []).length);
            const apres = elR + nCp * 4 * ((TARIFS.veo['veo-3.1-lite-generate-001'] || {}).muet || 0.05) + 0.35 + BUD * RES;   // voix + plans de coupe + Gemini/montage + reserve de reprises
            let reste = BUD - depR - apres - veoPlans.reduce((a9, x9) => a9 + dureeVeo(x9.c) * tpsM(ladder[0]), 0);
            const premier = veoPlans[0], dernier = veoPlans.length > 1 ? veoPlans[veoPlans.length - 1] : null;
            const ordre = []; if (premier) ordre.push(premier); if (dernier) ordre.push(dernier); veoPlans.forEach(x => { if (x !== premier && x !== dernier) ordre.push(x); });
            const achats = [];
            ordre.forEach(x => achats.push({ k: x.k, type: 'modele', cible: ladder[1], nom: x === premier ? 'plan d\'ouverture' : x === dernier ? 'dernier plan' : 'plan ' + (x.k + 1) }));
            if (premier) { achats.push({ k: premier.k, type: 'modele', cible: ladder[2], nom: 'plan d\'ouverture' }); achats.push({ k: premier.k, type: 'prise', nom: 'plan d\'ouverture' }); }
            if (dernier) { achats.push({ k: dernier.k, type: 'modele', cible: ladder[2], nom: 'dernier plan' }); achats.push({ k: dernier.k, type: 'prise', nom: 'dernier plan' }); }
            for (const a9 of achats) {
              const x9 = toRun.find(y => y.k === a9.k), d9 = dureeVeo(x9.c), cur = MC[a9.k] || ladder[0];
              if (a9.type === 'modele') {
                if (ladder.indexOf(a9.cible) <= ladder.indexOf(cur)) continue;
                if (a9.cible === ladder[2] && cur !== ladder[1]) { repartition.refuses.push(a9.nom + ' en Standard : il faut d\'abord le Fast'); continue; }
                const delta = d9 * (tpsM(a9.cible) - tpsM(cur)) * (PRISES[a9.k] ? 2 : 1);
                if (delta <= reste) { MC[a9.k] = a9.cible; reste -= delta; repartition.achats.push(a9.nom + ' (plan ' + (a9.k + 1) + ') : ' + (MODELS[a9.cible] || {}).label + ' (+' + delta.toFixed(2) + ' $)' + ((TARIFS.veo[a9.cible] || {}).estime ? ' [tarif estimé]' : '')); }
                else repartition.refuses.push(a9.nom + ' (plan ' + (a9.k + 1) + ') en ' + (MODELS[a9.cible] || {}).label + ' : +' + delta.toFixed(2) + ' $, il ne reste que ' + Math.max(0, reste).toFixed(2) + ' $');
              } else {
                const c9 = d9 * tpsM(cur);
                if (c9 <= reste) { PRISES[a9.k] = true; reste -= c9; repartition.achats.push(a9.nom + ' (plan ' + (a9.k + 1) + ') : 2 prises, la meilleure gardée (+' + c9.toFixed(2) + ' $)'); }
                else repartition.refuses.push('2 prises du ' + a9.nom + ' : +' + c9.toFixed(2) + ' $, il ne reste que ' + Math.max(0, reste).toFixed(2) + ' $');
              }
            }
            repartition.reste_apres_achats = +Math.max(0, reste).toFixed(2);
            repartition.modeles_par_plan = veoPlans.map(x => ({ plan: x.k + 1, modele: ((MODELS[MC[x.k]] || {}).label || MC[x.k]), deux_prises: !!PRISES[x.k] }));
          }
          P.repartition = repartition; save('03bis_repartition_budget.json', repartition);
          log('RÉPARTITION DU BUDGET (' + BUD.toFixed(2) + ' $) : ' + (repartition.achats.length ? repartition.achats.join(' ; ') : 'tout au modèle de base ' + ((MODELS[p.model] || {}).label || p.model)) + (repartition.refuses.length ? ' | non acheté : ' + repartition.refuses.join(' ; ') : '') + '.');
          const veoB = toRun.reduce((a9, x9) => a9 + dureeVeo(x9.c) * tpsM(mdl(x9.k)) * (PRISES[x9.k] ? 2 : 1), 0), dep = (P._couts && P._couts.total) || 0;
          let elB = 0, elNote = 'voix non facturee ElevenLabs';
          if (VOIX_OFF_RUN) { try { const ap = await elSolde(); const upc = TARIFS.elevenlabs.usd_par_credit; if (ap && P._elAvant && upc != null) { elB = Math.max(0, (ap.utilises - P._elAvant.utilises) * upc); elNote = 'ElevenLabs deja paye, mesure'; } else { elB = CHANSON_RUN ? 0.20 : 0.10; elNote = 'ElevenLabs estime (solde illisible)'; } } catch (eEl) { elB = CHANSON_RUN ? 0.20 : 0.10; elNote = 'ElevenLabs estime'; } }
          const proj = dep + elB + veoB;
          log('BUDGET ' + BUD.toFixed(2) + ' $ : deja depense ' + dep.toFixed(2) + ' + ' + elNote + ' ' + elB.toFixed(2) + ' + Veo ' + veoB.toFixed(2) + ' (' + toRun.length + ' clip(s), ' + toRun.reduce((a9, x9) => a9 + dureeVeo(x9.c), 0) + ' s a ' + tpsB.toFixed(2) + ' $/s) = ' + proj.toFixed(2) + ' $ au total ; plafond ' + BUD.toFixed(2) + ' $, il reste ' + (BUD - proj).toFixed(2) + ' $.');
          if (proj > BUD) throw new Error('BUDGET DEPASSE AVANT VEO (aucun clip n\'a ete lance) : ' + proj.toFixed(2) + ' $ au total pour un plafond de ' + BUD.toFixed(2) + ' $ (depense ' + (dep + elB).toFixed(2) + ' + Veo ' + veoB.toFixed(2) + '). Les images et le texte sont conserves dans le dossier du run.');
        }
      }
      if (toRun.length > 1) log('Les ' + toRun.length + ' clips partent en même temps : tu les auras tous dans le temps d\'un seul.');
      // v6.5 — un incident passager chez Veo (surcharge, indisponibilité, délai) n'est pas un défaut de la vidéo :
      // c'est la météo du service. Il est réessayé tout seul, jusqu'à 3 fois, avec une attente qui s'allonge.
      // Un essai qui échoue n'est pas facturé : seul un clip réellement produit l'est.
      // Un refus de fond (filtre de sécurité, requête invalide) n'est PAS réessayé : il se reproduirait à l'identique.
      const PASSAGER = /("?code"?\s*:\s*(8|13|14)\b|RESOURCE_EXHAUSTED|UNAVAILABLE|DEADLINE_EXCEEDED|INTERNAL|high load|currently experiencing|try again later|overloaded|rate[ _-]?limit|\b(429|500|502|503|504)\b|Délai dépassé|Réseau indisponible)/i;
      const ESSAIS_MAX = parseInt(process.env.VEO_ESSAIS || '3', 10);
      // v6.53 — INSERTS GRAPHIQUES. Une preuve (carte du pays d'origine, composants, laboratoire, produit heros) est une image
      // CONCUE par le modele d'image (dans la planche, avec les autres) et animee ici par un lent travelling : Veo n'y touche
      // pas, donc il ne peut ni inventer du texte ni faire fondre un objet dans un autre, et le plan ne coute rien.
      const faireInsert = async (c, k) => {
        const ref = genImgs[(c.references || [])[0]]; if (!ref) throw new Error('image de l\'insert absente');
        const fImg = path.join(OUT, id + '_insert' + (k + 1) + '.png'); fs.writeFileSync(fImg, Buffer.from(ref.data, 'base64'));
        const fVid = id + '_insert' + (k + 1) + '.mp4', NF = 96, v3 = k % 3;
        const zz = "min(1.08+0.0055*on,1.5)";   // « zoom+pas » repart de 1 a chaque image d'une image fixe bouclee : le zoom se calcule sur le numero d'image
        const xx = v3 === 2 ? "(iw-iw/zoom)*on/" + NF : "iw/2-(iw/zoom/2)";
        const yy = v3 === 1 ? "(ih-ih/zoom)*(1-on/" + NF + ")" : "ih/2-(ih/zoom/2)";
        await sh('ffmpeg', ['-y', '-loop', '1', '-framerate', '24', '-t', '4', '-i', fImg, '-vf',
          "scale=1440:2560:force_original_aspect_ratio=increase,crop=1440:2560,zoompan=z='" + zz + "':d=1:x='" + xx + "':y='" + yy + "':s=720x1280:fps=24,setsar=1,format=yuv420p",
          '-frames:v', String(NF), '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-an', path.join(OUT, fVid)], 120000);
        return fVid;
      };
      await Promise.all(toRun.map(async ({ c, k }) => {
        P.videos[k] = { bloc: c.bloc, state: 'running' };
        if (estInsert(c)) {
          try { const fI = await faireInsert(c, k); P.videos[k] = { bloc: c.bloc, state: 'done', file: fI, cost: 0, speech: false, essais: 1, insert: true }; log('Plan ' + (k + 1) + ' : insert graphique (' + (c.role || 'preuve') + ') animé par le code, aucun clip Veo.'); return; }
          catch (eI) { log('Plan ' + (k + 1) + ' : insert impossible (' + String(eI.message || eI).slice(0, 90) + ') → il part chez Veo.'); c.rendu = 'veo'; }
        }
        let derniere = null;
        for (let essai = 1; essai <= ESSAIS_MAX; essai++) {
          try {
            let r1;
            if (PRISES[k]) {
              const [ra, rb] = await Promise.allSettled([genOne(c, k, essai), genOne(c, k, essai + 10)]);
              if (ra.status === 'rejected' && rb.status === 'rejected') throw ra.reason;
              if (ra.status === 'fulfilled' && rb.status === 'fulfilled') {
                const ch = await choisirPrise(ra.value, rb.value, c); r1 = ch.meilleure === 'B' ? rb.value : ra.value;
                log('Plan ' + (k + 1) + ' : 2 prises comparées, la ' + ch.meilleure + ' est gardée (' + String(ch.raison || '').slice(0, 160) + ').'); P.steps.push({ etape: 'Choix de la meilleure prise (plan ' + (k + 1) + ')', meilleure: ch.meilleure, raison: ch.raison });
              } else { r1 = ra.status === 'fulfilled' ? ra.value : rb.value; log('Plan ' + (k + 1) + ' : une seule des 2 prises est arrivée, elle est gardée.'); }
            } else r1 = await genOne(c, k, essai);
            P.videos[k] = { bloc: c.bloc, state: 'done', file: r1.file, cost: r1.cost, speech: !VOIX_OFF_RUN && (c.repliques || []).length > 0, essais: essai, qa_echec: r1.fails.length ? r1.fails : undefined };
            log('Clip ' + (k + 1) + ' prêt.' + (essai > 1 ? ' (au ' + essai + 'e essai)' : '') + (r1.fails.length ? ' (le contrôle visuel signale : ' + r1.fails.join(', ') + ')' : ''));
            return;
          } catch (e) {
            derniere = e; const msg = String(e.message || e);
            if (essai < ESSAIS_MAX && PASSAGER.test(msg)) {
              const attente = 30 * essai;
              log('Clip ' + (k + 1) + ' : incident passager chez Veo (' + msg.replace(/\s+/g, ' ').slice(0, 110) + ') — nouvel essai dans ' + attente + ' s. Rien n\'est facturé pour un essai raté.');
              await new Promise(r2 => setTimeout(r2, attente * 1000));
              continue;
            }
            break;
          }
        }
        P.videos[k] = { bloc: c.bloc, state: 'error', error: String((derniere && derniere.message) || derniere) };
        log('Clip ' + (k + 1) + ' : ERREUR après ' + ESSAIS_MAX + ' essai(s) — ' + String((derniere && derniere.message) || derniere).slice(0, 200));
      }));
      { const manquants = P.videos.map((v, i) => (!v || v.state !== 'done') ? i + 1 : null).filter(Boolean);
        if (manquants.length) log('⚠️ VIDÉO INCOMPLÈTE : le ou les clips ' + manquants.join(', ') + ' manquent. Le montage ci-dessous ne fait donc pas 32 s et il lui manque un morceau de l\'histoire — relance la production de ces clips avant de diffuser.'); }
      { // ───── Mesure du mouvement : le système note lui-même son animation, sans modèle et sans coût.
        // Différence de luminance entre images consécutives (0 = photo figée). Un plan de dialogue vivant est au-dessus de 4.
        const prets2 = P.videos.filter(x => x && x.state === 'done' && x.file);
        if (prets2.length) {
          try {
            const mesures = [];
            const mesurerUn = async v => {   // v6.53 : 4 mesures en parallele (93 s en sequentiel pour 15 clips, mesure)
              let sortie = '';
              try { sortie = await sh('ffmpeg', ['-nostats', '-i', path.join(OUT, v.file), '-vf', 'scale=270:-2,tblend=all_mode=difference,signalstats,metadata=print:key=lavfi.signalstats.YAVG', '-f', 'null', '-'], 300000); }
              catch (e1) { sortie = String((e1.stderr || e1.message || '')); }
              const vals = (sortie.match(/YAVG=([0-9.]+)/g) || []).map(x => Number(x.slice(5))).filter(n => Number.isFinite(n));
              if (!vals.length) return;
              const moy = vals.reduce((a, b) => a + b, 0) / vals.length;
              const fige = vals.filter(n => n < 0.6).length / vals.length;   // part des images quasi identiques à la précédente
              mesures.push({ bloc: v.bloc, mouvement: Math.round(moy * 100) / 100, part_figee: Math.round(fige * 100) + '%' });
              v.mouvement = Math.round(moy * 100) / 100;
              v.mser = vals.map(x => Math.round(x * 100) / 100);   // v6.52 : courbe du mouvement image par image, lue par le montage pour garder le meilleur moment
            };
            for (let i8 = 0; i8 < prets2.length; i8 += 4) await Promise.all(prets2.slice(i8, i8 + 4).map(mesurerUn));
            mesures.sort((a8, b8) => (Number(a8.bloc) || 0) - (Number(b8.bloc) || 0));
            if (mesures.length) {
              const seuilF = /\b(locked|static|fixed|tripod|propped)\b/i.test(String((P.plan && P.plan._cadrage) || '')) ? 1.3 : 2.5;   // v6.43 : un CT a camera fixe ne bouge que par le corps du locuteur, 2,5 y serait un faux positif
              const faibles = mesures.filter(m => m.mouvement < seuilF && !((P.videos || []).find(v9 => v9 && v9.bloc === m.bloc) || {}).insert);   // v6.53 : un insert bouge par travelling, il n'est pas « fige »
              P.steps.push({ etape: '6ter. Mesure du mouvement (0 = photo figée, > 4 = plan vivant)', mesures });
              log('Mouvement mesuré : ' + mesures.map(m => 'clip ' + m.bloc + ' = ' + m.mouvement).join(', ') + '.');
              if (faibles.length) log('⚠ ' + faibles.length + ' clip(s) sous ' + seuilF + ' : le plan est quasi figé (clip ' + faibles.map(m => m.bloc).join(', ') + '). La caméra ou l\'action du prompt n\'ont pas été suivies.');
              else log('Tous les clips sont au-dessus du seuil de plan figé.');
            }
          } catch (e) { log('Mesure du mouvement indisponible (' + String(e.message || e).slice(0, 70) + ').'); }
        }
      }
      { // ───── Voix unique sur toute la vidéo : on ne REGÉNÈRE pas la parole, on la CONVERTIT.
        // La conversion voix-à-voix repart de l'audio de Veo : elle garde la durée, les pauses et l'intonation,
        // donc la synchronisation labiale faite par Veo reste exacte ; seule l'identité de la voix change, et elle devient la même partout.
        const CLE = process.env.ELEVENLABS_API_KEY || '', VOIX = process.env.ELEVENLABS_VOICE_ID || '';
        const parlants = P.videos.filter(x => x && x.state === 'done' && x.file && x.speech);
        if (CLE && VOIX && parlants.length) {
          try {
            const { execFileSync } = require('child_process');
            execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' });
            let convertis = 0;
            for (const v of parlants) {
              const src = path.join(OUT, v.file), base = v.file.replace(/\.mp4$/, '');
              const aIn = path.join(OUT, base + '_voix_src.mp3'), aOut = path.join(OUT, base + '_voix_uni.mp3'), vOut = base + '_voix.mp4';
              try {
                await sh('ffmpeg', ['-y', '-i', src, '-vn', '-ac', '1', '-ar', '44100', '-b:a', '128k', aIn]);
                const fd = new FormData();
                fd.append('audio', new Blob([fs.readFileSync(aIn)], { type: 'audio/mpeg' }), 'voix.mp3');
                fd.append('model_id', 'eleven_multilingual_sts_v2');
                fd.append('remove_background_noise', 'true');
                const rep = await rfetch('https://api.elevenlabs.io/v1/speech-to-speech/' + encodeURIComponent(VOIX) + '?output_format=mp3_44100_128', { method: 'POST', headers: { 'xi-api-key': CLE }, body: fd }, 3, 180000);
                if (!rep.ok) throw new Error('HTTP ' + rep.status + ' ' + String(await rep.text()).slice(0, 160));
                fs.writeFileSync(aOut, Buffer.from(await rep.arrayBuffer()));
                await sh('ffmpeg', ['-y', '-i', src, '-i', aOut, '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-shortest', path.join(OUT, vOut)]);
                v.file_origine = v.file; v.file = vOut; convertis++;
              } catch (e1) { log('Voix du clip bloc ' + v.bloc + ' non convertie (' + String(e1.message || e1).slice(0, 90) + ') : la voix d\'origine est conservée pour ce clip.'); }
              finally { [aIn].forEach(f => { try { fs.unlinkSync(f); } catch (_) {} }); }
            }
            if (convertis) { P.voix_unifiee = { clips: convertis, voice_id: VOIX }; P.steps.push({ etape: '6bis. Voix unifiée (conversion voix-à-voix)', clips_convertis: convertis, voice_id: VOIX }); log('Voix unifiée sur ' + convertis + '/' + parlants.length + ' clip(s) parlés : même voix partout, synchronisation labiale inchangée.'); }
          } catch (e) { log('Unification de la voix impossible (' + (/ENOENT|not recognized|introuvable/i.test(String(e.message || e)) ? 'ffmpeg n\'est pas installé sur cette machine' : String(e.message || e).slice(0, 80)) + ') : les voix restent celles de Veo.'); }
        } else if (parlants.length && !CLE) log('Voix unifiée désactivée (ELEVENLABS_API_KEY absente) : chaque clip garde la voix produite par Veo, qui varie légèrement de l\'un à l\'autre.');
        else if (parlants.length && !VOIX) log('Voix unifiée désactivée (ELEVENLABS_VOICE_ID absente) : indique la voix cible à utiliser.');
      }
      // ───── v6.31 — VOIX OFF : la voix est dite AVANT le montage, et c'est elle qui donne le minutage.
      // Les CT 008 et 009 ne font parler aucun personnage. Veo ne fournit que l'image ; sa piste audio est jetee.
      // On envoie le texte complet a ElevenLabs avec son alignement CARACTERE par CARACTERE, ce qui donne a la
      // milliseconde la fin de chaque bloc — donc la duree exacte a laquelle recouper chaque clip.
      if (VOIX_OFF_RUN && !P.voixoff) log('⚠️ VOIX OFF ABSENTE au montage : les clips restent muets.');   // v6.32 : la voix est dite et mesuree AVANT Veo (voir « Voix off mesuree »)

      { // ───── Assemblage : le livrable n'est pas 4 fichiers, c'est une vidéo de 32 s
        const prets = P.videos.filter(x => x && x.state === 'done' && x.file);
        if (prets.length > 1) {
          try {
            const { execFileSync } = require('child_process');
            execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' });
            const sortie = id + '_video_' + (MINI_RUN && MINI_INFO ? Math.round(MINI_INFO.D) : prets.length * 8) + 's.mp4';
            // v6.24 — MONTAGE DYNAMIQUE : un léger zoom alterné par clip entretient le mouvement sans se voir,
            // et un fondu enchaîné de 0,2 s adoucit les jonctions. Quatre coupes sèches sur quatre plans fixes
            // font décrocher ; un mouvement continu retient. Dosage volontairement discret (5,5 % de zoom).
            // v6.29 — RECOUPE SUR LA PAROLE, PUIS MONTAGE.
            // Mesure faite sur la video livree (bande 350-3400 Hz, fenetre 50 ms) : trou de voix de 1,05 s a la
            // jonction 8 s, 0,50 s a 16 s, 0,40 s a 24 s. Cause : Veo finit de parler avant la fin du clip, et le
            // clip suivant demarre par un silence — les deux s'additionnent. Le lit musical masquait ces trous au
            // detecteur de silence mais pas a l'oreille. On ne demande donc plus a Veo de remplir exactement 8 s
            // (il ne le fait pas de maniere fiable) : on RECOUPE chaque clip sur sa propre parole avant d'assembler.
            // Le DERNIER clip garde une queue plus longue : c'est la seule pause legitime, celle de la fin.
            const DYN = process.env.MONTAGE_DYNAMIQUE !== '0' && prets.length > 1;
            if (DYN) {
              const { spawnSync } = require('child_process');
              const TR_MAX = Math.max(0.06, Math.min(0.4, parseFloat(process.env.MONTAGE_FONDU || '0.2')));
              const ZM = Math.max(1.0, Math.min(1.12, parseFloat(process.env.MONTAGE_ZOOM || '1.055')));
              const QUEUE = parseFloat(process.env.MONTAGE_QUEUE || '0.22');       // souffle garde apres le dernier mot
              const LEAD = parseFloat(process.env.MONTAGE_AMORCE || '0.24');       // amorce gardee devant le premier mot
              const QUEUE_FIN = parseFloat(process.env.MONTAGE_QUEUE_FIN || '0.45'); // la pause de fin de video
              const COUPE_MAX = parseFloat(process.env.MONTAGE_COUPE_MAX || '1.6'); // garde-fou : jamais plus que ca

              const duree = f2 => {
                const r = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f2], { encoding: 'utf8' });
                const v = parseFloat(String(r.stdout || '').trim());
                return isFinite(v) && v > 0 ? v : 8;
              };
              // bornes de la parole dans un clip : on filtre sur la bande de la voix puis on lit silencedetect
              const parole = async (f2, dur) => {
                let txt = '';
                try { txt = await sh('ffmpeg', ['-i', f2, '-af', 'highpass=f=300,lowpass=f=3600,silencedetect=noise=-42dB:d=0.12', '-f', 'null', '-'], 300000); }
                catch (eP2) { txt = String((eP2 && eP2.stderr) || ''); }
                const evs = [];
                let m2;
                const reS = /silence_start:\s*(-?[0-9.]+)/g, reE = /silence_end:\s*(-?[0-9.]+)/g;
                while ((m2 = reS.exec(txt))) evs.push({ t: parseFloat(m2[1]), k: 's' });
                while ((m2 = reE.exec(txt))) evs.push({ t: parseFloat(m2[1]), k: 'e' });
                evs.sort((a, b) => a.t - b.t || (a.k === 's' ? -1 : 1));
                // ffmpeg emet un silence_end de CLOTURE en fin de fichier : chercher « un debut sans fin » ne
                // trouve donc jamais la queue. On apparie, et la queue est la derniere paire qui FINIT au bout.
                const paires = []; let ouv = null;
                for (const e2 of evs) {
                  if (e2.k === 's' && ouv === null) ouv = e2.t;
                  else if (e2.k === 'e' && ouv !== null) { paires.push({ s: ouv, e: e2.t }); ouv = null; }
                }
                if (ouv !== null) paires.push({ s: ouv, e: dur });
                let debut = 0, fin = dur;
                if (paires.length && paires[0].s <= 0.06) debut = paires[0].e;
                const der = paires[paires.length - 1];
                if (der && der.e >= dur - 0.08 && der.s > debut + 0.2) fin = der.s;
                if (!(fin > debut)) { debut = 0; fin = dur; }
                // v6.59 — pauses INTERNES de la parole (souffles, fins de phrase) : ce sont les endroits ou une coupe se cache (cf. mesure sur la source
                // RYZE : 10 coupes sur 16 tombent dans un silence de 0,2 a 0,5 s).
                const pauses = paires.filter(q => q.s > debut + 0.25 && q.e < fin - 0.25 && q.e - q.s >= 0.12);
                return { debut, fin, pauses };
              };

              // v6.31 — VOIX OFF : la duree de chaque clip ne vient plus de la parole de Veo (il n'en a pas)
              // mais du MINUTAGE DE LA VOIX OFF. Si un bloc depasse ce qu'un clip peut porter, on accelere
              // legerement la voix entiere plutot que de desynchroniser un seul bloc.
              const VO = P.voixoff && Array.isArray(P.voixoff.segments) && P.voixoff.segments.length === prets.length ? P.voixoff : null;
              let voTempo = 1;
              if (VO) {
                let pire = 1;
                VO.segments.forEach((sg, i7) => {
                  const dispo = Math.max(1, Math.min(duree(path.join(OUT, prets[i7].file)), 7.95) - (i7 < prets.length - 1 ? TR_MAX : 0));
                  pire = Math.max(pire, sg.duree / dispo);
                });
                voTempo = CHANSON_RUN ? 1 : Math.min(1.15, Math.max(1, pire));   // v6.48 : on n'accelere jamais une chanson (le rythme change)
                VO.utilise = true; VO.tempo = voTempo;   // lu par l'etape des sous-titres : minutage ElevenLabs ramene au tempo reellement applique
                if (voTempo > 1.005) log('Voix off accélérée de ' + ((voTempo - 1) * 100).toFixed(1) + ' % pour tenir dans les plans (limite : 15 %).');
              }

              // v6.52 — MINI-PLANS : dans une prise de 4 s, on garde la fenetre de la duree du plan ou le corps bouge le plus,
              // sans pic brutal (un pic = un saut ou une deformation), en preferant le debut (l'identite y est la plus fidele).
              const meilleureFenetre = (ser, durF, L) => {
                const maxS = Math.max(0, durF - L - 0.05);
                if (!Array.isArray(ser) || ser.length < 10 || maxS < 0.1) return Math.min(0.12, maxS);
                const fps = ser.length / durF, srt = ser.slice().sort((a, b) => a - b), med = srt[Math.floor(srt.length / 2)] || 0, pic = Math.max(8, med * 6);
                let best = 0, bs = -1e9;
                for (let s0 = 0.1; s0 <= maxS + 1e-6; s0 += 1 / 12) {
                  const a = Math.floor(s0 * fps), b = Math.min(ser.length, Math.ceil((s0 + L) * fps)); if (b - a < 3) continue;
                  let sum = 0, mx = 0; for (let i9 = a; i9 < b; i9++) { sum += ser[i9]; if (ser[i9] > mx) mx = ser[i9]; }
                  const sc0 = sum / (b - a) - (mx > pic ? 50 : 0) - 0.12 * s0;
                  if (sc0 > bs) { bs = sc0; best = s0; }
                }
                return best;
              };
              // 1) on mesure, on recoupe, on garde la duree reelle de chaque clip recoupe
              const coupes = [];
              for (const [i7, x] of prets.entries()) {
                const src = path.join(OUT, x.file);
                const dur = duree(src);
                const b = VO ? { debut: 0, fin: dur } : await parole(src, dur);
                const dernier = i7 === prets.length - 1, premier = i7 === 0;
                if (VO) {
                  // la voix commande : le clip dure exactement son segment, plus le recouvrement du fondu
                  const vise = Math.min(MINI_RUN ? Math.max(0.5, dur - 0.1) : dur, VO.segments[i7].duree / voTempo + (dernier || MINI_RUN ? 0 : TR_MAX));
                  const deb0 = MINI_RUN ? (x.insert ? 0 : meilleureFenetre(x.mser, dur, vise)) : 0;
                  coupes.push({ fichier: x.file, duree: vise, debut: deb0, debut_parole: 0, coupe: dur - vise, _vo: true });
                  continue;
                }
                let fin = Math.min(dur, b.fin + (dernier ? QUEUE_FIN : QUEUE));
                if (dur - fin > COUPE_MAX) fin = dur - COUPE_MAX;          // garde-fou
                if (fin < dur * 0.6) fin = dur;                             // mesure aberrante : on ne touche a rien
                // TETE : on ne garde qu'une amorce courte devant le premier mot. Jamais sur le clip 1, qui ouvre
                // la video et dont l'entree est voulue. C'est cette coupe-la qui supprime le gros du trou.
                let deb = 0;
                if (!premier && b.debut > LEAD + 0.02) deb = Math.min(b.debut - LEAD, COUPE_MAX);
                const coupe = (dur - fin) + deb;
                const amorce = b.debut - deb;
                const out2 = x.file.replace(/\.mp4$/, '_rec.mp4');
                if (coupe > 0.06) {
                  try {
                    await sh('ffmpeg', ['-y', '-i', src, '-ss', deb.toFixed(3), '-t', (fin - deb).toFixed(3),
                      '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18',
                      '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', path.join(OUT, out2)]);
                    coupes.push({ fichier: out2, duree: duree(path.join(OUT, out2)), debut_parole: amorce, fin_parole: b.fin - deb, coupe: coupe, pauses: (b.pauses || []).map(q => ({ s: q.s - deb, e: q.e - deb })) });
                  } catch (eR) { coupes.push({ fichier: x.file, duree: dur, debut_parole: b.debut, fin_parole: b.fin, coupe: 0, pauses: b.pauses || [] }); }
                } else coupes.push({ fichier: x.file, duree: dur, debut_parole: b.debut, fin_parole: b.fin, coupe: 0, pauses: b.pauses || [] });
              }
              // v6.52 — plus de re-encodage des clips avant le montage (20 min mesurees sur acda0d31) : la coupe se fait dans le graphe du montage (trim).
              if (MINI_RUN && VO) log('Mini-plans : ' + coupes.map((c3, i9) => 'plan ' + (i9 + 1) + ' ' + (c3.debut || 0).toFixed(1) + '–' + ((c3.debut || 0) + c3.duree).toFixed(1) + ' s').join(', ') + ' (le moment le plus vivant de chaque prise ; le reste est jeté).');
              // v6.43 — LA VIDEO NE S'ARRETE JAMAIS AVANT LA VOIX. Mesure : 34,4 s de voix acceleree a +15 % = 29,9 s, des clips
              // plafonnes a 8 s qui donnaient 28,1 s de video, et `-shortest` coupait la derniere phrase. On compare ici la duree
              // reelle de la video montee a celle de la voix, et on prolonge le dernier plan (image figee sur son dernier
              // etat, fondue) du temps qui manque, plus une respiration d'une demi-seconde apres le dernier mot.
              let prolonge = 0;
              if (VO) {
                const Lvid = coupes.reduce((a, c3) => a + c3.duree, 0) - (MINI_RUN ? 0 : TR_MAX) * (coupes.length - 1);
                const Lvoix = VO.duree / voTempo;
                const manque = Lvoix + 0.5 - Lvid;
                if (manque > 0.02) {
                  prolonge = Math.min(manque, 3);
                  log('La vidéo montée (' + Lvid.toFixed(1) + ' s) finirait avant la voix (' + Lvoix.toFixed(1) + ' s) : le dernier plan est prolongé de ' + prolonge.toFixed(1) + ' s pour que la dernière phrase soit dite en entier' + (manque > 3 ? ' — ⚠ il manque encore ' + (manque - 3).toFixed(1) + ' s : texte trop long pour ce CT' : '') + '.');
                }
                // derive image / voix : l'image d'un bloc doit demarrer quand sa voix demarre
                let tV = 0, tI = 0, derive = 0;
                coupes.forEach((c3, i9) => { derive = Math.max(derive, Math.abs(tI - tV)); tV += VO.segments[i9].duree / voTempo; tI += c3.duree - (i9 < coupes.length - 1 ? TR_MAX : 0); });
                if (derive > 0.35) log('⚠ Dérive image/voix de ' + derive.toFixed(2) + ' s à un raccord (un clip plus court que son bloc de voix).');
              }
              const totalCoupe = coupes.reduce((a, c3) => a + c3.coupe, 0);
              if (totalCoupe > 0.1) log('Recoupe sur la parole : ' + coupes.map((c3, i7) => 'clip ' + (i7 + 1) + ' −' + c3.coupe.toFixed(2) + ' s').join(', ')
                + ' — ' + totalCoupe.toFixed(2) + ' s de silence retires aux raccords. La parole s\'enchaine d\'un clip a l\'autre ; seule la pause de fin est conservee.');

              // 2) le fondu de chaque jonction ne doit JAMAIS mordre sur le premier mot du clip suivant
              const TRs = [];
              for (let i8 = 1; i8 < coupes.length; i8++) {
                if (VO) { TRs.push(TR_MAX); continue; }   // voix off : aucun mot a proteger dans l'image, fondu plein
                // v6.43 — le fondu ne mord ni sur le premier mot du clip suivant NI SUR LE DERNIER MOT DU CLIP PRECEDENT. Avant, seule
                // l'attaque du suivant etait protegee : avec 0,08 s de souffle apres le dernier mot et un fondu de 0,2 s, le dernier
                // mot etait fondu a moitie (« une moitie du dernier mot qui n'a pas pu etre dite »).
                const marge = Math.max(0, coupes[i8].debut_parole - 0.05);
                const queueAv = coupes[i8 - 1].fin_parole != null ? Math.max(0, coupes[i8 - 1].duree - coupes[i8 - 1].fin_parole - 0.03) : TR_MAX;
                if (coupes[i8 - 1].fin_parole != null && queueAv < 0.08) log('⚠ Clip ' + i8 + ' : la parole court jusqu\'à la dernière image (' + queueAv.toFixed(2) + ' s de marge) : raccord franc pour ne pas entamer le dernier mot. Veo a rempli tout le clip : réduis le texte de ce bloc.');
                TRs.push(Math.max(0.084, Math.min(TR_MAX, marge, queueAv)));   // plancher : 2 images a 24 i/s (en dessous, xfade s'arrete net)
              }
              if (TRs.length && !MINI_RUN) log('Fondus ajustes sur l\'attaque de la voix : ' + TRs.map(t3 => t3.toFixed(2) + ' s').join(', ') + '.');

              const args = []; coupes.forEach(c3 => args.push('-i', path.join(OUT, c3.fichier)));
              let F = '';
              // v6.38 — LE RECADRAGE INTERNE. Une pub UGC qui tient l'attention change de plan toutes les 2 a 4 s ; nous
              // n'avons que 4 generations Veo. Plutot que d'en payer huit, chaque prise est COUPEE EN DEUX au pivot de la
              // voix (fin de la premiere idee) et ses deux moities sont cadrees differemment — large puis serre, ou
              // l'inverse. Meme prise, meme action continue, deux plans percus : 8 plans pour 4 clips, a cout nul.
              const RECADRE = process.env.RECADRAGE !== '0';
              const ZS = Math.max(1.15, Math.min(1.6, parseFloat(process.env.RECADRAGE_SERRE || '1.3')));
              const recadres = [];
              const segFiltre = (ent, t0, t1, z0, sens, sortieLab) => {   // une moitie de prise, cadree a elle
                const dur = Math.max(0.3, t1 - t0), pas2 = 0.045 / Math.max(1, dur * 24);
                const z = sens > 0 ? 'min(zoom+' + pas2.toFixed(6) + ',' + (z0 + 0.05).toFixed(3) + ')' : 'max(zoom-' + pas2.toFixed(6) + ',' + Math.max(1, z0 - 0.05).toFixed(3) + ')';
                const y = z0 > 1.15 ? 'ih/2-(ih/zoom/2)-ih*0.05' : 'ih/2-(ih/zoom/2)';   // un plan serre cadre un peu plus haut : c'est la que sont les visages et les mains
                return '[' + ent + ']trim=' + t0.toFixed(3) + ':' + t1.toFixed(3) + ',setpts=PTS-STARTPTS,scale=1080:1920,'
                  + 'zoompan=z=\'if(eq(on,0),' + z0.toFixed(3) + ',' + z + ')\':d=1:x=\'iw/2-(iw/zoom/2)\':y=\'' + y + '\':s=720x1280:fps=24,setsar=1[' + sortieLab + '];';
              };
              // prolongation du dernier plan : appliquee a l'ENTREE (avant le zoom), ou tpad se comporte ; le zoom continue sur les images ajoutees
              const entV = i7 => 'in' + i7;   // v6.52 : chaque entree est coupee ICI (debut choisi, duree du plan), le dernier plan prolonge si besoin
              coupes.forEach((c3, i7) => { const derP = i7 === coupes.length - 1 && prolonge > 0.02;
                F += '[' + i7 + ':v]trim=start=' + (c3.debut || 0).toFixed(3) + ':duration=' + c3.duree.toFixed(3) + ',setpts=PTS-STARTPTS' + (derP ? ',tpad=stop_mode=clone:stop_duration=' + prolonge.toFixed(3) : '') + '[in' + i7 + '];'; });
              if (prolonge > 0.02) coupes[coupes.length - 1].duree += prolonge;
              // v6.59 — RECADRAGE AU RYTHME DE LA SOURCE, COUPE SUR LE SOUFFLE. La source (RYZE, mesuree image par image) change de plan en mediane toutes les
              // 3,8 s, par sauts de cadrage sur la meme prise, et place ses coupes dans les micro-pauses de la parole. Avant : une seule coupe par clip, a 55 % de
              // sa duree, sans regarder la voix. Maintenant : autant de segments que le rythme du CT le demande (« Rythme source » du CT, borne 2,4 a 4,5 s ; defaut
              // 3,6 s), chaque coupe posee sur la pause de parole la plus proche. Le son n'est pas touche (seule l'image est recadree).
              const mRy = /Rythme source[^\n]*?toutes les\s*(\d+(?:[.,]\d+)?)(?:\s*(?:à|a|-)\s*(\d+(?:[.,]\d+)?))?\s*s/i.exec(String(p.ct || ''));
              const RYm = mRy ? (parseFloat(mRy[1].replace(',', '.')) + parseFloat((mRy[2] || mRy[1]).replace(',', '.'))) / 2 : null;
              const SEG = (RYm != null && RYm >= 6) ? 99 : Math.max(2.4, Math.min(4.5, RYm != null ? RYm : 3.6));   // v6.63 : une source qui change de plan toutes les 6 s ou plus (prise unique, ce sont les incrustations qui renouvellent l'image) n'est pas decoupee
              const pointsCoupe = c3 => {
                const dur = c3.duree, lo = 1.3, n = Math.max(1, Math.round(dur / SEG));
                if (n < 2) return [];
                const cand = (c3.pauses || []).map(q => (q.s + q.e) / 2).filter(t => t >= lo && t <= dur - lo).sort((a, b) => a - b);
                const out = []; let last = 0;
                for (let k = 1; k < n; k++) {
                  const ideal = dur * k / n; let best = null;
                  cand.forEach(t => { if (t - last >= lo && dur - t >= lo && Math.abs(t - ideal) <= SEG * 0.45 && (best === null || Math.abs(t - ideal) < Math.abs(best - ideal))) best = t; });
                  if (best === null) { if (ideal - last >= lo && dur - ideal >= lo) best = ideal; else continue; }
                  out.push(best); last = best;
                }
                return out;
              };
              coupes.forEach((c3, i7) => {
                const sg = VO && VO_TIMING && VO_TIMING.segments && VO_TIMING.segments[i7];
                const piv = sg && sg.pivot && sg.pivot.length ? sg.pivot[0] : (c3.duree * 0.55);
                const pts = (!VO && !MINI_RUN && RECADRE && c3.duree >= 4.0) ? pointsCoupe(c3) : [];
                const coupable = RECADRE && !MINI_RUN && c3.duree >= 4.6 && piv >= 1.6 && c3.duree - piv >= 1.6;
                if (pts.length) {   // n segments, cadrages alternes large / serre / moyen, chacun avec sa petite derive
                  const motifs = i7 % 2 === 1 ? [ZS, 1.0, 1.0 + (ZS - 1) * 0.5, ZS * 0.95] : [1.0, ZS, 1.0 + (ZS - 1) * 0.5, 1.0];
                  const bornes2 = [0].concat(pts, [c3.duree]);
                  F += '[' + entV(i7) + ']split=' + (bornes2.length - 1) + bornes2.slice(0, -1).map((_, k) => '[s' + i7 + 'x' + k + ']').join('') + ';';
                  bornes2.slice(0, -1).forEach((t0, k) => { F += segFiltre('s' + i7 + 'x' + k, t0, bornes2[k + 1], motifs[k % motifs.length], k % 2 === 0 ? 1 : -1, 'p' + i7 + 'x' + k); });
                  F += bornes2.slice(0, -1).map((_, k) => '[p' + i7 + 'x' + k + ']').join('') + 'concat=n=' + (bornes2.length - 1) + ':v=1:a=0[v' + i7 + '];';
                  recadres.push({ clip: i7 + 1, coupe_s: Number(pts[0].toFixed(2)), coupes_s: pts.map(t => Number(t.toFixed(2))), sens: 'large/serré alternés', sur_pause: pts.filter(t => (c3.pauses || []).some(q => t >= q.s - 0.05 && t <= q.e + 0.05)).length });
                  return;
                }
                if (!coupable) {
                  const dedans = i7 % 2 === 0;
                  const pas = (ZM - 1) / Math.max(1, c3.duree * 24);   // le zoom suit la duree REELLE du clip recoupe
                  F += '[' + entV(i7) + ']scale=1080:1920,zoompan=z=\'' + (dedans
                        ? 'if(eq(on,0),1.0,min(zoom+' + pas.toFixed(6) + ',' + ZM + '))'
                        : 'if(eq(on,0),' + ZM + ',max(zoom-' + pas.toFixed(6) + ',1.0))')
                     + '\':d=1:x=\'iw/2-(iw/zoom/2)\':y=\'ih/2-(ih/zoom/2)\':s=720x1280:fps=24,setsar=1[v' + i7 + '];';
                  return;
                }
                const serreDabord = i7 % 2 === 1;   // on alterne : large→serre, puis serre→large, pour que la coupe ne devienne pas un tic
                F += '[' + entV(i7) + ']split=2[s' + i7 + 'a][s' + i7 + 'b];';
                F += segFiltre('s' + i7 + 'a', 0, piv, serreDabord ? ZS : 1.0, 1, 'p' + i7 + 'a');
                F += segFiltre('s' + i7 + 'b', piv, c3.duree, serreDabord ? 1.0 : ZS, serreDabord ? 1 : -1, 'p' + i7 + 'b');
                F += '[p' + i7 + 'a][p' + i7 + 'b]concat=n=2:v=1:a=0[v' + i7 + '];';
                recadres.push({ clip: i7 + 1, coupe_s: Number(piv.toFixed(2)), sens: serreDabord ? 'serré→large' : 'large→serré' });
              });
              if (recadres.length) log('Recadrage interne : ' + recadres.length + ' prise(s) recadrée(s) sur les pauses de la parole (' + recadres.map(r4 => 'clip ' + r4.clip + ' à ' + (r4.coupes_s || [r4.coupe_s]).map(t5 => t5.toFixed(1)).join(' et ') + ' s' + (r4.sur_pause != null ? ' dont ' + r4.sur_pause + ' sur un souffle' : '')).join(', ') + ') — ' + (coupes.length + recadres.reduce((a5, r5) => a5 + (r5.coupes_s ? r5.coupes_s.length : 1), 0)) + ' plans perçus pour ' + coupes.length + ' clips générés.');
              let prev = 'v0', pa = '0:a', cumul = coupes[0].duree, cumulTR = 0;
              if (MINI_RUN && VO) { F += coupes.map((_, i9) => '[v' + i9 + ']').join('') + 'concat=n=' + coupes.length + ':v=1:a=0[vcat];'; prev = 'vcat'; }   // v6.52 : coupes seches, au vers pres
              else for (let i8 = 1; i8 < coupes.length; i8++) {
                const tr = TRs[i8 - 1];
                cumulTR += tr;
                const off = cumul - cumulTR;
                F += '[' + prev + '][v' + i8 + ']xfade=transition=fade:duration=' + tr.toFixed(3) + ':offset=' + off.toFixed(3) + '[x' + i8 + '];';
                if (!VO) F += '[' + pa + '][' + i8 + ':a]acrossfade=d=' + tr.toFixed(3) + '[a' + i8 + '];';   // en voix off les clips sont muets : rien a fondre
                prev = 'x' + i8; pa = 'a' + i8; cumul += coupes[i8].duree;
              }
              if (VO) {
                // la piste audio de Veo est JETEE : on monte l'image seule et on pose la voix off par-dessus.
                const fVo2 = path.join(OUT, P.voixoff.fichier);
                // la voix est prolongee d'un silence : c'est la VIDEO qui decide de la fin, jamais `-shortest` sur une voix plus courte
                const fAud = ['-filter_complex', F.replace(/;$/, '') + ';[' + prets.length + ':a]' + (voTempo > 1.005 ? 'atempo=' + voTempo.toFixed(4) + ',' : '') + 'apad=pad_dur=2[av]'];
                const mapA = '[av]';
                await sh('ffmpeg', ['-y'].concat(args, ['-i', fVo2], fAud, ['-map', '[' + prev + ']', '-map', mapA, '-shortest',
                  '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', path.join(OUT, sortie)]));
              } else
              await sh('ffmpeg', ['-y'].concat(args, ['-filter_complex', F.replace(/;$/, ''), '-map', '[' + prev + ']', '-map', '[' + pa + ']',
                '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', path.join(OUT, sortie)]));
              P.montage_dyn = { recadrages: recadres, fondus_s: TRs, zoom: ZM, recoupe_s: Number(totalCoupe.toFixed(2)), durees: coupes.map(c3 => Number(c3.duree.toFixed(2))) };
            } else {
              const liste = path.join(OUT, id + '_liste.txt');
              fs.writeFileSync(liste, prets.map(x => "file '" + path.join(OUT, x.file).replace(/\\/g, '/') + "'").join('\n'));
              await sh('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', liste, '-c', 'copy', path.join(OUT, sortie)]);
            }
            P.montage = sortie; P.steps.push({ etape: '7. Montage', fichier: sortie, clips: prets.length });
            log('Vidéo assemblée : ' + sortie + ' (' + prets.length + ' plans, ' + (() => { try { const r9 = require('child_process').spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path.join(OUT, sortie)], { encoding: 'utf8' }); const d9 = parseFloat(String(r9.stdout || '').trim()); return isFinite(d9) ? d9.toFixed(1) : '?'; } catch (eD) { return '?'; } })() + ' s)' + (prets.length < (P.plan.clips || []).length ? ' — ⚠️ INCOMPLÈTE : ' + ((P.plan.clips || []).length - prets.length) + ' clip(s) manquant(s), ce n\'est pas la vidéo finale.' : '') + '.');
          } catch (e) {
            log('Assemblage impossible (' + (/ENOENT|not recognized|introuvable/i.test(String(e.message || e)) ? 'ffmpeg n\'est pas installé sur cette machine' : String(e.message || e).slice(0, 70)) + ') : les clips restent séparés dans lab_out.');
          }
        }
      }
      // ───── v6.20 — HABILLAGE SONORE : un lit musical instrumental sous la voix, écrit pour CETTE vidéo.
      // Veo ne produit que la voix ; sans fond, une pub de 32 s sonne nue. Le lit est généré par Eleven Music à
      // partir du moteur émotionnel du plan, puis mixé TRÈS bas sous la voix, avec un ducking qui le fait reculer
      // à chaque phrase. La voix reste intacte : si quoi que ce soit échoue, le montage d'origine est conservé.
      if (P.montage && process.env.MUSIQUE !== '0' && !CHANSON_RUN && !(P._postCT && P._postCT.musique === 'aucune')) {   // v6.48 : une chanson porte déjà sa musique
        const CLEM = process.env.ELEVENLABS_API_KEY || '';
        if (!CLEM) log('Habillage sonore ignoré : ELEVENLABS_API_KEY absente (la vidéo garde la voix seule).');
        else try {
          const { execFileSync } = require('child_process');
          execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' });
          // v6.34 — LA MUSIQUE SUIT L'EMOTION DE CETTE VIDEO-LA. Avant, l'arc etait ecrit en dur (« tension et malaise au
          // debut, chaleur a la fin ») quel que soit le CT : sur une pub de confiance ou d'offre, le lit sonnait a cote et
          // n'accentuait rien. Il se compose maintenant du registre declare par le CT, des emotions reelles clip par clip et
          // de la duree REELLE du montage (et non 4x8 s, ce qui laissait de la musique apres la derniere image).
          let secs = (P.videos.filter(x => x && x.state === 'done' && x.file).length || 4) * 8;
          try { const d0 = parseFloat(String(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', path.join(OUT, P.montage)]).toString()).trim()); if (d0 > 5 && d0 < 120) secs = Math.ceil(d0); } catch (eD0) { /* duree reelle indisponible : on garde 4x8 s */ }
          const mot = String((P.meta || {}).angle || ''), niv = String((P.meta || {}).niveau_conscience || '');
          const intentions = (P.plan.clips || []).map(c2 => String(c2.intention || '').trim()).filter(Boolean).slice(0, NC).join(' ; ');
          const monde = P.bible && P.bible.monde_general ? (P.bible.monde_general || []).slice(0, 3).map(x => x.element).join(', ') : '';
          const emos = (P.plan.clips || []).map(c2 => (c2.repliques || []).map(r => String((r && (r.emotion || r.ton)) || '').replace(/\s+/g, ' ').trim()).filter(Boolean).join(' / ')).filter(Boolean);
          const registre = String((P._sigCT && P._sigCT.epic) || '').replace(/\s+/g, ' ').trim();
          const arc = emos.length >= 2 ? 'Emotional arc, clip by clip, over the ' + secs + ' seconds: ' + emos.map((e, k3) => (k3 + 1) + ') ' + e).join(' then ') + '. The music follows THIS arc and no other: it changes where the feeling changes, and it ends on the last one.'
                                       : 'Emotional arc across the ' + secs + ' seconds: it follows the ad, changes where the feeling changes, and ends settled.';
          let promptMus = null;
          const bM = P.boussole ? ' DESTINATION OF THE WHOLE AD (it overrides any style of the source ad): ' + P.boussole.destination + '; register ' + P.boussole.registre + ', energy ' + P.boussole.energie + '/10, ' + P.boussole.tempo_bpm_min + '-' + P.boussole.tempo_bpm_max + ' BPM; music: ' + P.boussole.musique_en + '; avoid: ' + (P.boussole.musique_a_eviter_en || []).join(', ') + '; arc: ' + P.boussole.arc + '.' : '';
          try {   // le brief musical est ecrit par un modele a partir de CETTE video : registre du CT, emotions, marche
            const gm = await vjson(`${LOCATION}-aiplatform.googleapis.com`, `/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-2.5-flash:generateContent`, { contents: [{ role: 'user', parts: [{ text: 'Tu ecris le brief d\'un LIT MUSICAL instrumental pour une publicite verticale de ' + secs + ' secondes. Reponds UNIQUEMENT par un JSON {"prompt":"70 a 110 mots en ANGLAIS"}. Le brief nomme : le genre et l\'instrumentation (timbres acoustiques ou electroniques precis, coherents avec le marche decrit), le tempo en BPM, la tonalite majeure ou mineure, et COMMENT la musique suit l\'arc emotionnel donne, seconde par seconde. Contraintes absolues a reecrire dans le prompt : purement instrumental, aucune voix ni choeur ni paroles, registre grave et clairseme, aucune melodie chargee, aucun coup fort soudain, de la place pour une voix par-dessus. La musique ACCENTUE l\'emotion : elle n\'est ni neutre ni generique, et elle ne plaque pas de la tension sur une publicite confiante ni de la douceur sur une publicite qui accuse.\n\n=== REGISTRE DECLARE PAR LE MODELE CREATIF ===\n' + (registre || 'non declare') + '\n=== ' + arc + '\n=== INTENTIONS CLIP PAR CLIP ===\n' + (intentions || mot || 'non declarees') + '\n=== NIVEAU DE CONSCIENCE ===\n' + (niv || 'non declare') + '\n=== MARCHE ET DECOR (pour l\'instrumentation) ===\n' + (monde || 'non declare') }] }], generationConfig: { temperature: 0.5, maxOutputTokens: 2048, thinkingConfig: { thinkingBudget: 0 }, responseMimeType: 'application/json' } });
            const jm = JSON.parse(textOf(gm)); const t3 = String(jm.prompt || '').trim();
            if (t3.split(/\s+/).length >= 40) promptMus = t3 + bM + ' Instrumental only: no vocals, no lyrics, no voices, no chanting. It sits UNDER a speaking voice: sparse, low-register, no busy melody, no sudden loud hits, clean headroom for speech on top.';
          } catch (eM0) { /* brief ecrit par le code */ }
          if (!promptMus) promptMus = 'Instrumental background score for a ' + secs + '-second vertical social-media advert.' + bM + ' No vocals, no lyrics, no voices, no spoken words, no chanting. '
            + 'It must sit UNDER a speaking voice: sparse, low-register, no busy melody, nothing that competes with speech, no sudden loud hits. '
            + arc + ' '
            + (registre ? 'Register declared for this ad: ' + registre + '. ' : '')
            + 'Mood taken from the ad: ' + (intentions || mot || 'everyday life turning into relief') + '. '
            + (niv ? 'Audience awareness level: ' + niv + '. ' : '')
            + (monde ? 'Cultural setting to colour the instrumentation: ' + monde + '. ' : '')
            + 'Texture: natural acoustic timbres, soft sustained pads, a simple warm pulse, light percussion only where the feeling turns. Clean mix, headroom for a voice on top.';
          const rm = await rfetch('https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128', {
            method: 'POST', headers: { 'xi-api-key': CLEM, 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: promptMus.slice(0, 4000), music_length_ms: secs * 1000, model_id: 'music_v2_5', force_instrumental: true })
          }, 2, 240000);
          if (!rm.ok) throw new Error('HTTP ' + rm.status + ' ' + String(await rm.text()).slice(0, 180));
          const mp3 = path.join(OUT, id + '_musique.mp3');
          fs.writeFileSync(mp3, Buffer.from(await rm.arrayBuffer()));
          save('07_musique_prompt.txt', promptMus);
          try { coutAjoute('musique', 'eleven_music:music_v2_5', { secondes: secs }, null); } catch (eC) {}
          const vIn = path.join(OUT, P.montage), vOut = P.montage.replace(/\.mp4$/, '_son.mp4');
          // v6.22 — mesuré au banc : à 0,18 avec un seuil de 0,015 et un ratio de 16, le compresseur retirait
          // 14 dB et la musique tombait 26 dB sous la voix — personne ne l'entendait. 0,35 / 0,03 / 8 donne 7,7 dB
          // de ducking : audible sous la parole, elle remonte dans les silences sans jamais couvrir la voix.
          // v6.28 — mesuré au banc sur la vidéo livrée : la musique tombait à 19 dB SOUS la voix pendant la parole
          // et 8,7 dB sous elle dans les pauses — inaudible dans le premier cas, à peine perçue dans le second.
          // Cause : on normalisait la musique mais PAS LA VOIX, donc le rapport des deux dépendait du niveau que Veo
          // avait sorti ce jour-là (ici très chaud, -12 dBFS crête). 0,85 / 0,08 / 3 avec la voix ramenée à -16 LUFS
          // donne 11,6 dB sous la parole et 5,6 dB dans les pauses : présente partout, jamais en travers des mots.
          const vol = process.env.MUSIQUE_VOL || '0.92';
          const dSeuil = process.env.MUSIQUE_SEUIL || '0.08', dRatio = process.env.MUSIQUE_RATIO || '3';
          const VOIX_LUFS = process.env.VOIX_LUFS || '-16';
          const MIX_LUFS = process.env.MIX_LUFS || '-14';
          // v6.24 — le niveau du lit rendu par Eleven Music est inconnu et varie d'un morceau à l'autre.
          // On le ramène donc à une loudness FIXE (-20 LUFS par défaut) avant d'appliquer le volume : à partir de là
          // le réglage veut dire quelque chose. Sans ça, un lit rendu bas disparaissait complètement sous la voix.
          const LUF = process.env.MUSIQUE_LUFS || '-20';
          const filtre = '[1:a]loudnorm=I=' + LUF + ':TP=-3:LRA=11,volume=' + vol + ',afade=t=in:st=0:d=1.2,afade=t=out:st=' + (secs - 1.6) + ':d=1.6,aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo[mus];'
            + '[0:a]loudnorm=I=' + VOIX_LUFS + ':TP=-1.5:LRA=11,aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo,asplit=2[vx][sc];'
            + '[mus][sc]sidechaincompress=threshold=' + dSeuil + ':ratio=' + dRatio + ':attack=20:release=350:makeup=1[duck];'
            + '[vx][duck]amix=inputs=2:duration=first:normalize=0,loudnorm=I=' + MIX_LUFS + ':TP=-1:LRA=11[a]';
          await sh('ffmpeg', ['-y', '-i', vIn, '-i', mp3, '-filter_complex', filtre, '-map', '0:v:0', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '128k', path.join(OUT, vOut)]);
          P.montage_sans_son = P.montage; P.montage = vOut;
          P.steps.push({ etape: '7bis. Habillage sonore (Eleven Music)', fichier: vOut, secondes: secs, volume: vol, prompt: promptMus.slice(0, 300) });
          log('Habillage sonore ajouté : ' + vOut + ' (lit instrumental de ' + secs + ' s, normalisé à ' + LUF + ' LUFS puis mixé à ' + Math.round(Number(vol) * 100) + ' %, reculé d\'environ 6 dB sous chaque phrase ; voix ramenée à ' + VOIX_LUFS + ' LUFS et mix final à ' + MIX_LUFS + ' LUFS). La version voix seule reste dans lab_out.');
        } catch (eM) {
          log('Habillage sonore impossible (' + (/ENOENT|not recognized|introuvable/i.test(String(eM.message || eM)) ? 'ffmpeg absent' : String(eM.message || eM).slice(0, 140)) + ') : la vidéo garde la voix seule.');
        }
      }
      // ───── v6.77 — AMBIANCE SONORE. Veo ne rend que la voix (le serveur retire les consignes de son de ses prompts) : sans fond, une prise de
      // telephone sonne dans le vide. Un souffle de piece tres bas (Eleven sound-generation, une seule generation de 30 s au plus, boucle) est
      // mixe sous tout le reste. Prix de la generation NON VERIFIE (ligne de cout sans montant). Coupe par AMBIANCE=0, ou par le CT (« aucune ambiance »).
      // Echec ou absence de cle : la video garde son audio d'origine, sans erreur.
      if (P.montage && process.env.AMBIANCE !== '0' && !CHANSON_RUN && !/(?:aucune|sans)\s+(?:ambiance|fond sonore)|ambiance\s*:\s*aucune/i.test(String(p.ct || ''))) {
        const CLEA = process.env.ELEVENLABS_API_KEY || '';
        if (CLEA) try {
          const { execFileSync } = require('child_process');
          const vA = path.join(OUT, P.montage);
          let secsA = 30; try { const dA = parseFloat(String(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', vA]).toString()).trim()); if (dA > 3 && dA < 150) secsA = dA; } catch (eA0) {}
          const aStreams = String(execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=index', '-of', 'csv=p=0', vA]).toString()).trim();
          if (!aStreams) throw new Error('la video n\'a pas de piste audio');
          const scenes = [...new Set((P.plan.images_reference || []).map(x => String(x.prompt_gemini || '').replace(/\s+/g, ' ').slice(0, 220)).filter(Boolean))].slice(0, 4);
          let txtA = 'Very quiet, realistic room tone of an ordinary home recorded by a phone: soft air, faint distant sounds of the street, nothing sudden. No music, no speech, no voices.';
          try {
            if (scenes.length) {
              const gA = await vjson(`${LOCATION}-aiplatform.googleapis.com`, `/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-2.5-flash:generateContent`, { contents: [{ role: 'user', parts: [{ text: 'Voici les lieux d\'une publicite filmee au telephone (descriptions d\'images). Ecris en ANGLAIS, en 30 mots au plus, UN souffle sonore continu et tres discret qui convient a TOUS ces lieux a la fois (le bruit de fond de la piece ou de la rue, jamais un evenement, jamais de musique, jamais de voix, jamais de paroles). Reponds UNIQUEMENT par {"prompt":"..."}.\n\n' + scenes.map((x, i) => (i + 1) + ') ' + x).join('\n') }] }], generationConfig: { temperature: 0.3, maxOutputTokens: 400, thinkingConfig: { thinkingBudget: 0 }, responseMimeType: 'application/json' } });
              const jA = JSON.parse(textOf(gA)); const tA = String(jA.prompt || '').trim();
              if (tA.split(/\s+/).length >= 6) txtA = tA + ' Very quiet, steady, no music, no speech, no voices, nothing sudden.';
            }
          } catch (eA1) { /* texte par defaut */ }
          const durA = Math.max(5, Math.min(30, Math.ceil(secsA)));
          const rA = await rfetch('https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128', { method: 'POST', headers: { 'xi-api-key': CLEA, 'Content-Type': 'application/json' }, body: JSON.stringify({ text: txtA.slice(0, 450), duration_seconds: durA, prompt_influence: 0.6 }) }, 2, 120000);
          if (!rA.ok) throw new Error('HTTP ' + rA.status + ' ' + String(await rA.text()).slice(0, 160));
          const mp3A = path.join(OUT, id + '_ambiance.mp3');
          fs.writeFileSync(mp3A, Buffer.from(await rA.arrayBuffer()));
          save('07b_ambiance_prompt.txt', txtA);
          try { coutAjoute('ambiance', 'eleven_sound_generation', { secondes: durA }, null, { prix_verifie: false }); } catch (eC) {}
          const LUFA = process.env.AMBIANCE_LUFS || '-36';
          const vOutA = P.montage.replace(/\.mp4$/, '_amb.mp4');
          const fA = '[1:a]aloop=loop=-1:size=2000000000,atrim=0:' + secsA.toFixed(2) + ',asetpts=PTS-STARTPTS,loudnorm=I=' + LUFA + ':TP=-6:LRA=7,afade=t=in:st=0:d=1.2,afade=t=out:st=' + Math.max(0, secsA - 1.4).toFixed(2) + ':d=1.4,aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo[amb];'
            + '[0:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo[v0];[v0][amb]amix=inputs=2:duration=first:normalize=0[a]';
          await sh('ffmpeg', ['-y', '-i', vA, '-i', mp3A, '-filter_complex', fA, '-map', '0:v:0', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', path.join(OUT, vOutA)]);
          P.montage_sans_ambiance = P.montage; P.montage = vOutA;
          P.steps.push({ etape: '7ter. Ambiance sonore (Eleven sound-generation)', fichier: vOutA, secondes: durA, niveau_lufs: LUFA, prompt: txtA.slice(0, 200) });
          log('Ambiance ajoutée : ' + vOutA + ' (souffle de pièce de ' + durA + ' s en boucle, à ' + LUFA + ' LUFS sous le reste ; prix de la génération non vérifié). Version sans ambiance conservée dans lab_out.');
        } catch (eA) { log('Ambiance impossible (' + String(eA.message || eA).slice(0, 140) + ') : la vidéo garde son audio d\'origine.'); }
      }
      // ───── v6.49 — INCRUSTATIONS DU CT (cartes, prix, contradiction, photos de preuve, plans de coupe).
      // Les temps du plan sont sur l'horloge « 8 s par clip » ; on les convertit sur la durée REELLE de chaque clip monte.
      // Texte : gratuit. Image (photo de preuve, plan de coupe) : une generation Gemini (~0,15 $), plafonnee par le budget.
      if (P.montage && process.env.INCRUSTATIONS !== '0') {
        try {
          const brut = (P.plan && Array.isArray(P.plan.surimpressions) ? P.plan.surimpressions : []).map(o => ({ type: String((o && o.type) || ''), texte: String((o && o.texte) || '').trim(), description: String((o && (o.description || o.image)) || '').trim(),
            a: o && (o.t0 != null ? Number(o.t0) : Number(o.debut_s)), b: o && (o.t1 != null ? Number(o.t1) : Number(o.fin_s)) })).filter(o => Number.isFinite(o.a) && Number.isFinite(o.b) && o.b > o.a && (o.texte || o.description || /page_produit|calendrier|calendar|logo_permanent|etiquette_reelle|etiquette_client|eclat_dore|eclat_blanc/i.test(o.type)));
          if (brut.length) {
            const { execFileSync } = require('child_process');
            let vIn0 = path.join(OUT, P.montage);
            let total = 0; try { total = parseFloat(String(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', vIn0]).toString()).trim()) || 0; } catch (eD) {}
            const dyn = P.montage_dyn && Array.isArray(P.montage_dyn.durees) && P.montage_dyn.durees.length ? P.montage_dyn : null;
            const starts = []; if (dyn) { let cum = 0, cumTR = 0; dyn.durees.forEach((d, i) => { starts.push(cum - cumTR); cum += d; cumTR += (dyn.fondus_s || [])[i] || 0; }); }
            const reel = tp => { if (!dyn || MINI_RUN) return tp; const k = Math.max(0, Math.min(dyn.durees.length - 1, Math.floor(tp / 8 - 1e-9))); return starts[k] + (tp - 8 * k) * (dyn.durees[k] / 8); };
            const BUDi = parseFloat(process.env.BUDGET_USD || p.budget_usd || '10'), RESi = parseFloat(process.env.BUDGET_RESERVE || '0.15');
            const MAXI = parseInt(process.env.INCRUSTATIONS_MAX_IMAGES || '8', 10), COUT_IMG = 0.15;
            // v6.69 — PLANS DE COUPE ANIMES. Un plan de coupe fige sur une voix qui continue denature la video : par defaut il est genere en CLIP
            // MUET de 4 s (Veo 3.1 Lite, 0,03 $/s mesure sur facture = 0,12 $), directement depuis le texte (pas d'image intermediaire : -0,15 $).
            // Pas de budget pour l'animer => le plan est SAUTE (le visage reste), jamais remplace par une image fixe. COUPES_ANIMEES=0 rend les images fixes.
            const ANIM_ON = process.env.COUPES_ANIMEES !== '0', DEPUIS_IMG = process.env.COUPES_DEPUIS_IMAGE === '1';
            let nImg = 0; const items = [], saute = [], speciales = [];
            let _pgC, _lgC; const urlClient = String(p.lien_page_produit || '').trim();
            const pageClientPrete = async () => { if (_pgC !== undefined) return _pgC; _pgC = null; if (!/^https?:\/\//i.test(urlClient)) return null; try { const png = await capturerPageClient(urlClient, OUT, id); _pgC = recadrerPageClient(png, await localiserBlocsPage(png)); log('Page produit du client capturée : ' + (_pgC.hl ? 'ligne de garantie repérée' : 'sans ligne de garantie') + '.'); } catch (eP) { log('Page produit du client non capturée (' + String(eP.message || eP).slice(0, 110) + ').'); } return _pgC; };
            const logoClientPret = async () => { if (_lgC !== undefined) return _lgC; _lgC = null; try { if (p.logo_base64) { const fl = path.join(OUT, id + '_logo_client.png'); fs.writeFileSync(fl, Buffer.from(String(p.logo_base64).replace(/^data:[^,]+,/, ''), 'base64')); _lgC = fl; } else if (/^https?:\/\//i.test(urlClient)) _lgC = await extraireLogoPage(urlClient, OUT, id); if (_lgC) log('Logo du client trouvé : ' + path.basename(_lgC) + '.'); } catch (eL) { log('Logo du client introuvable (' + String(eL.message || eL).slice(0, 90) + ').'); } return _lgC; };
            for (const o of brut) {
              let t0 = reel(o.a), t1 = reel(o.b); if (total) { t1 = Math.min(t1, total - 0.1); }
              const _coupeCourte = /plan_coupe|coupe_eclair/i.test(String(o.type || '')) && !!o.description && ANIM_ON;   // v6.74 : un plan eclair de rafale dure 0,17 a 0,3 s dans la source
              if (!(t1 - t0 >= (_coupeCourte ? 0.25 : 0.4))) { saute.push(o.type + ' (hors durée)'); continue; }
              if (/^(page_produit|calendrier|calendar|logo_permanent|etiquette_reelle|etiquette_client|eclat_dore|eclat_blanc)/i.test(String(o.type || ''))) {   // v6.70 : elements dessines par le monteur a partir de donnees reelles du client (jamais d'image generee)
                const sp = { type: o.type, texte: o.texte, t0, t1 };
                if (/page_produit/i.test(o.type)) { const pg = await pageClientPrete(); if (!pg) { saute.push('page_produit (lien absent ou page non capturée : rien n\'est inventé)'); continue; } sp.fichier = pg.fichier; sp.hl = pg.hl; sp.fond = pg.fond; }
                else if (/^etiquette_(reelle|client)/i.test(o.type)) { if (!p.produit) { saute.push('etiquette_reelle (aucune photo produit : rien n\'est inventé)'); continue; } try { const et = await recadrerEtiquetteReelle(p.produit, OUT, id); sp.type = 'page_produit'; sp.fichier = et.fichier; sp.hl = null; sp.fond = et.fond; log('Étiquette réelle recadrée sur la photo du client.'); } catch (eE) { saute.push('etiquette_reelle (' + String(eE.message || eE).slice(0, 70) + ')'); continue; } }
                else if (/logo_permanent/i.test(o.type)) { const lgf = await logoClientPret(); if (!lgf) { saute.push('logo_permanent (logo introuvable)'); continue; } sp.logoFichier = lgf; sp.t0 = 0; sp.t1 = total || t1; }
                speciales.push(sp); continue;
              }
              const it = { type: o.type, texte: o.texte, t0, t1, img: null, description: o.description };
              const coupeA = ANIM_ON && !!o.description && /coupe|insert|illustration|plan_/i.test(String(o.type || ''));
              if (coupeA) { it.anim = true; it.moitie = /_bas\b|moitie|ecran_bas/i.test(String(o.type || '')); }
              if (coupeA && !DEPUIS_IMG) { items.push(it); continue; }
              const veutImage = !!o.description && /photo|preuve|image|vignette|coupe|insert|illustration/i.test(o.type);
              if (veutImage) {
                const dep = (P._couts && P._couts.total) || 0;
                if (nImg >= MAXI || (BUDi > 0 && dep + COUT_IMG > BUDi * (1 - RESi))) { saute.push(o.type + ' (budget ou plafond d\'images)'); continue; }
                const coupe = /coupe|insert|illustration/i.test(o.type);
                try {
                  const style = String((P.plan && P.plan.style_visuel) || (P._sigCT && P._sigCT.style) || '').slice(0, 400);
                  const gi = await vjsonImage('aiplatform.googleapis.com', imgPath(false), { contents: [{ role: 'user', parts: [{ text: (coupe ? 'Vertical 9:16 full-frame image. ' : 'Square photograph. ') + o.description + (style ? ' Visual style, identical to the rest of the film: ' + style : '') + (/(3d anim|animated|cartoon|stylis|pixar)/i.test(style) && !/(live-action|photo-?real|documentary)/i.test(style) ? '' : ' Photorealistic photograph, natural light, real skin and fabric textures, shot on a smartphone, not an illustration and not a render.') + ' No text, no letters, no digits, no logos, no watermark, no screen showing content.' }] }],
                    generationConfig: { responseModalities: ['TEXT', 'IMAGE'], imageConfig: { aspectRatio: coupe ? '9:16' : '1:1', imageSize: '1K' } } }).catch(() => vjson('aiplatform.googleapis.com', `/v1/projects/${PROJECT_ID}/locations/global/publishers/google/models/gemini-3-pro-image:generateContent`, { contents: [{ role: 'user', parts: [{ text: (coupe ? 'Vertical 9:16 full-frame image. ' : 'Square photograph. ') + o.description + ' No text, no letters, no logos.' }] }], generationConfig: { responseModalities: ['TEXT', 'IMAGE'] } }));
                  const ipi = (gi.candidates?.[0]?.content?.parts || []).find(x => x.inlineData);
                  if (!ipi) throw new Error('aucune image rendue');
                  const fI = path.join(OUT, id + '_incrust_' + (nImg + 1) + '.png'); fs.writeFileSync(fI, Buffer.from(ipi.inlineData.data, 'base64')); it.img = fI; nImg++;
                } catch (eI) { saute.push(o.type + ' (image impossible : ' + String(eI.message || eI).slice(0, 60) + ')'); if (!o.texte) continue; }
              }
              items.push(it);
            }
            P.speciales = speciales;
            // v6.69 — generation et pose des plans de coupe animes (muets) ; la voix du montage n'est jamais touchee (-c:a copy).
            const aAnimer = items.filter(x => x.anim);
            if (aAnimer.length) {
              try {
                const modC = process.env.COUPES_MODEL || 'veo-3.1-lite-generate-001', tvc = TARIFS.veo[modC], tpsC = tvc && tvc.muet != null ? tvc.muet : 0.05, DURC = 4;
                const plafond = BUDi > 0 ? BUDi * (1 - RESi) : 1e9;
                let dep0 = (P._couts && P._couts.total) || 0;
                const styleC = String((P.plan && P.plan.style_visuel) || (P._sigCT && P._sigCT.style) || '').slice(0, 300);
                const lances = [];
                for (const x of aAnimer) {
                  const coutC = DURC * tpsC;
                  if (dep0 + coutC > plafond - 0.2) { saute.push(x.type + ' (pas de budget pour l\'animer : plan non pose, jamais une image fixe)'); continue; }
                  const envC = { model: modC, durationSeconds: DURC, aspectRatio: '9:16', generateAudio: false, negativePrompt: 'text, subtitles, captions, watermark, logo, speech, voice, music, split screen, collage',
                    prompt: 'Vertical 9:16 photoreal smartphone footage, one continuous take, natural hand-held motion, daylight, no studio lighting. ' + x.description + (styleC ? ' Visual style: ' + styleC : '') + ' Real, everyday movement in the scene. No text, no subtitles, no logo, no speech, no music.' };
                  if (x.img) envC.firstFrame = { data: fs.readFileSync(x.img).toString('base64'), mime: 'image/png' };
                  try { const jid = await startJob(envC); dep0 += coutC; lances.push({ x, jid, envC }); } catch (eS) { saute.push(x.type + ' (clip impossible : ' + String(eS.message || eS).slice(0, 60) + ')'); }
                }
                const tA = Date.now();
                for (const l of lances) {
                  let tentative8 = false;
                  while (true) {
                    const j = jobs[l.jid];
                    if (j.state === 'done') { l.x.vid = path.join(OUT, j.file); break; }
                    if (j.state === 'error') {
                      if (!tentative8 && /duration|seconds/i.test(String(j.error)) && dep0 + 8 * tpsC <= plafond - 0.2) { tentative8 = true; dep0 += 8 * tpsC; l.envC.durationSeconds = 8; l.jid = await startJob(l.envC); continue; }
                      saute.push(l.x.type + ' (clip refuse : ' + String(j.error).slice(0, 60) + ')'); break;
                    }
                    if (Date.now() - tA > 15 * 60 * 1000) { saute.push(l.x.type + ' (clip trop long)'); break; }
                    await new Promise(r8 => setTimeout(r8, 5000));
                  }
                }
                const prets = items.filter(x => x.vid && fs.existsSync(x.vid));
                if (prets.length) {
                  const vCA = P.montage.replace(/\.mp4$/, '_ca.mp4');
                  const argsC = ['-y', '-i', vIn0]; prets.forEach(x => argsC.push('-i', x.vid));
                  let chC = '', prC = '0:v';
                  prets.forEach((x, i) => {
                    const dC = Math.max(0.25, Math.min(x.t1 - x.t0, 3.8)), t0c = x.t0.toFixed(3), t1c = (x.t0 + dC).toFixed(3);
                    const hC = x.moitie ? 640 : 1280;   // v6.74 : « ecran empile » = le plan de coupe occupe la moitie basse, le haut de l'image reste visible
                    chC += '[' + (i + 1) + ':v]scale=720:' + hC + ':force_original_aspect_ratio=increase,crop=720:' + hC + ',setsar=1,fps=24,trim=start=0:duration=' + dC.toFixed(3) + ',setpts=PTS-STARTPTS+' + t0c + '/TB,format=yuv420p[ca' + i + '];';
                    chC += '[' + prC + '][ca' + i + ']overlay=0:' + (x.moitie ? 640 : 0) + ':enable=\'between(t,' + t0c + ',' + t1c + ')\':eof_action=pass[cx' + i + '];'; prC = 'cx' + i;
                  });
                  chC += '[' + prC + ']null[vout]';
                  argsC.push('-filter_complex', chC, '-map', '[vout]', '-map', '0:a?', '-c:v', 'libx264', '-preset', process.env.VIDEO_PRESET || 'medium', '-crf', process.env.VIDEO_CRF || '23', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart', '-c:a', 'copy', path.join(OUT, vCA));
                  await sh('ffmpeg', argsC);
                  P.montage = vCA; vIn0 = path.join(OUT, vCA);
                  P.coupes_animees = prets.map(x => ({ t0: +x.t0.toFixed(2), t1: +x.t1.toFixed(2), clip: path.basename(x.vid) }));
                  P.steps.push({ etape: '7bis. Plans de coupe animes', fichier: vCA, plans: prets.length, modele: modC });
                  log('Plans de coupe ANIMES posés : ' + prets.length + ' clip(s) muet(s) de ' + DURC + ' s (' + modC + '), voix du montage intacte, en ' + ((Date.now() - tA) / 1000).toFixed(0) + ' s.');
                }
              } catch (eCA) { log('Plans de coupe animés impossibles (' + String(eCA.message || eCA).slice(0, 140) + ') : plans non posés, le visage reste à l\'écran.'); }
              for (let i8 = items.length - 1; i8 >= 0; i8--) if (items[i8].anim) items.splice(i8, 1);
            }
            if (items.length) {
              const sigI = (String(P.plan.style_visuel || '') + ' ' + String((P._sigCT && P._sigCT.style) || '')).toLowerCase();
              const animI = /(3d anim|animated|cartoon|stylis)/.test(sigI) && !/(live-action|photo-?real|documentary)/.test(sigI);
              const vOutI = P.montage.replace(/\.mp4$/, '_inc.mp4'), tI = Date.now();
              const r = await incrusterVideo({ vIn: vIn0, vOut: path.join(OUT, vOutI), items, police: process.env.SOUSTITRES_POLICE || (animI ? 'Verdana' : 'Arial Black'), shFn: sh, preset: process.env.VIDEO_PRESET || 'medium', crf: process.env.VIDEO_CRF || '23', assPath: path.join(OUT, id + '_incrustations.ass') });
              P.montage_sans_incrustations = P.montage; P.montage = vOutI;
              P.incrustations = { fichier: vOutI, items: items.map(x => ({ type: x.type, t0: +x.t0.toFixed(2), t1: +x.t1.toFixed(2), texte: x.texte || null, image: !!x.img, fichier: x.img || null })), sautees: saute };
              P.steps.push({ etape: '7ter. Incrustations du CT', fichier: vOutI, textes: r.textes, photos: r.photos, coupes: r.coupes, sautees: saute });
              log('Incrustations du CT posées en ' + ((Date.now() - tI) / 1000).toFixed(0) + ' s : ' + r.textes + ' texte(s), ' + r.photos + ' photo(s) de preuve, ' + r.coupes + ' plan(s) de coupe' + (saute.length ? ' ; non posées : ' + saute.join(', ') : '') + '.');
            } else if (saute.length) log('Incrustations du CT : aucune posée (' + saute.join(', ') + ').');
          }
        } catch (eInc) { log('Incrustations du CT impossibles (' + String(eInc.message || eInc).slice(0, 140) + ') : la vidéo garde ses sous-titres seuls.'); }
      }
      // ───── v6.21 — SOUS-TITRES DYNAMIQUES, calés sur ce qui est RÉELLEMENT dit.
      // On ne sous-titre pas le texte écrit : on transcrit la voix produite par Veo (ElevenLabs Scribe, minutage
      // mot à mot), ce qui donne un calage parfait ET révèle au passage les mots que Veo a escamotés.
      // v6.45 — LES SOUS-TITRES SUIVENT LE CT. Presence, position, dynamique (mot a mot, groupes, phrase entiere, mots
      // importants seulement) sont LUS dans la description du CT : un CT sans sous-titres n'en recoit pas, un CT qui les
      // place a 40 % de la hauteur les a a 40 %. Police et couleurs restent ceux de la marque du client ; la dynamique
      // et l'intention sont ceux du CT. Un seul appel Flash.
      let stSpec = null;
      if (P.montage && process.env.SOUSTITRES !== '0') {
        try {
          const gsp = await vjson(`${LOCATION}-aiplatform.googleapis.com`, `/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-2.5-flash:generateContent`, {
            contents: [{ role: 'user', parts: [{ text: 'Tu lis la description d\'un CT (modèle de publicité vidéo). Tu extrais UNIQUEMENT ce qu\'elle dit des SOUS-TITRES, c\'est-à-dire du texte incrusté qui reprend la parole.\n'
              + 'presence : "oui" si le CT décrit des sous-titres ; "non" s\'il dit explicitement qu\'il n\'y en a pas ; "non_precise" s\'il n\'en parle pas.\n'
              + 'position_pct : hauteur du CENTRE du texte en % depuis le haut de l\'écran (0 = haut, 100 = bas), ou null si le CT ne la donne pas.\n'
              + 'mode : "mot_a_mot" (un mot à la fois), "groupes" (2 à 5 mots, le mot dit est surligné), "phrase" (la phrase entière apparaît d\'un bloc), "mots_cles" (seuls les mots ou expressions importants s\'affichent), ou null si le CT ne le dit pas.\n'
              + 'mots_par_groupe : 1 à 6, ou null. majuscules : true / false / null. taille : "petite" | "moyenne" | "grande" | null. fond : "contour" (texte à contour) | "boite" (texte noir translucide sous un texte blanc) | "boite_claire" (pastille ou boîte BLANCHE avec texte NOIR) | null.\n'
              + 'intention : UNE phrase sur la raison de ces sous-titres dans ce CT (ou "" si le CT n\'en dit rien).\n'
              + 'gras : true si le CT veut des lettres grasses ou épaisses, false s\'il veut des lettres fines, null sinon. emojis : true si le CT demande des émojis dans les sous-titres, false s\'il les exclut ou ne décrit que du texte, null s\'il ne parle pas de sous-titres. surlignage : true si le CT veut que le mot dit change de couleur, false si le texte est d\'une seule couleur (ex. « blancs à contour »), null sinon. emphase_agrandie : true si le CT dit que les mots importants sont écrits beaucoup plus gros que les autres dans la même ligne, null sinon.\n'
              + 'Tu ne devines pas : ce que le CT ne dit pas est null. Tu ne décris ni police ni couleur : ce sont celles de la marque du client.\n\nCT :\n' + String(p.ct || '').slice(0, 60000) }] }],
            generationConfig: { temperature: 0.1, maxOutputTokens: 3000, thinkingConfig: { thinkingBudget: 0 }, responseMimeType: 'application/json', responseSchema: { type: 'OBJECT', properties: {
              presence: { type: 'STRING', enum: ['oui', 'non', 'non_precise'] },
              position_pct: { type: 'NUMBER', nullable: true },
              mode: { type: 'STRING', enum: ['mot_a_mot', 'groupes', 'phrase', 'mots_cles'], nullable: true },
              mots_par_groupe: { type: 'INTEGER', nullable: true },
              majuscules: { type: 'BOOLEAN', nullable: true },
              taille: { type: 'STRING', enum: ['petite', 'moyenne', 'grande'], nullable: true },
              fond: { type: 'STRING', enum: ['contour', 'boite', 'boite_claire'], nullable: true },
              emphase_agrandie: { type: 'BOOLEAN', nullable: true }, gras: { type: 'BOOLEAN', nullable: true }, emojis: { type: 'BOOLEAN', nullable: true }, surlignage: { type: 'BOOLEAN', nullable: true },
              intention: { type: 'STRING' } }, required: ['presence', 'intention'] } }
          });
          stSpec = JSON.parse(textOf(gsp));
          // v6.65 — le CT ne decrit pas ses sous-titres : l'intention lue dans le CT (authenticite UGC ou energie) choisit le style par defaut, a la place d'un style generique.
          if (stSpec && stSpec.presence !== 'non' && P._intent && P._intent.sous_titres_defaut === 'discret') {
            if (stSpec.mode == null) stSpec.mode = 'phrase';
            if (stSpec.majuscules == null) stSpec.majuscules = false;
            if (stSpec.surlignage == null) stSpec.surlignage = false;
            if (stSpec.taille == null) stSpec.taille = 'petite';
            if (stSpec.position_pct == null) stSpec.position_pct = 76;
            if (stSpec.gras == null) stSpec.gras = false;
            if (stSpec.fond == null) stSpec.fond = 'contour';
            stSpec._defaut_discret = true;
          }
          save('08_sous_titres_du_ct.json', stSpec);
          log('Sous-titres lus dans le CT : ' + (stSpec.presence === 'non' ? 'AUCUN (le CT n\'en prévoit pas)' : stSpec.presence === 'non_precise' ? 'non précisé (style par défaut)' : ['mode ' + (stSpec.mode || 'par défaut'), stSpec.position_pct != null ? 'position ' + stSpec.position_pct + ' % du haut' : null, stSpec.mots_par_groupe ? stSpec.mots_par_groupe + ' mot(s)/groupe' : null, stSpec.taille ? 'taille ' + stSpec.taille : null, stSpec.fond ? 'fond ' + stSpec.fond : null].filter(Boolean).join(', ')) + (stSpec.intention ? ' — intention : ' + String(stSpec.intention).slice(0, 140) : '') + '.');
        } catch (eSp) { stSpec = null; log('Sous-titres du CT illisibles (' + String(eSp.message || eSp).slice(0, 80) + ') : style par défaut.'); }
      }
      if (P.montage && process.env.SOUSTITRES !== '0' && !(stSpec && stSpec.presence === 'non')) {
        const CLES = process.env.ELEVENLABS_API_KEY || '';
        if (!CLES) log('Sous-titres ignorés : ELEVENLABS_API_KEY absente.');
        else try {
          const { execFileSync } = require('child_process');
          execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' });
          const vIn = path.join(OUT, P.montage);
          const aTmp = path.join(OUT, id + '_st_audio.mp3');
          // v6.32 — voix off : la voix a ete produite par ElevenLabs, qui rend le minutage de CHAQUE caractere. On ne la
          // retranscrit pas (cout, risque d'erreur) : les sous-titres sont les mots ecrits, aux instants exacts, et la
          // fidelite est de 100 % par construction. Le minutage suit la voix acceleree au montage.
          const VOAL = !!(P.voixoff && P.voixoff.utilise && Array.isArray(P.voixoff.words) && P.voixoff.words.length >= 8);
          let tr = null, mots = null;
          if (VOAL) {
            const tv = Number(P.voixoff.tempo) > 0 ? Number(P.voixoff.tempo) : 1;
            mots = P.voixoff.words.map(w => ({ text: w.text, start: w.start / tv, end: w.end / tv, type: 'word' }));
            tr = { source: 'alignement ElevenLabs (voix off)', words: mots };
            save('08_transcription.json', tr);
          } else {
            await sh('ffmpeg', ['-y', '-i', vIn, '-vn', '-ac', '1', '-ar', '16000', '-b:a', '96k', aTmp]);
            const fd = new FormData();
            fd.append('file', new Blob([fs.readFileSync(aTmp)], { type: 'audio/mpeg' }), 'voix.mp3');
            fd.append('model_id', 'scribe_v2');
            fd.append('timestamps_granularity', 'word');
            // v6.30 — la langue n'est plus codee en dur. Elle vient de la SYNTHESE (la langue du marche),
            // extraite par la bible de traduction. P.meta n'etait jamais rempli : on retombait donc toujours
            // sur « fr » en silence, et un CT etait de fait inutilisable sur un marche anglophone ou arabophone.
            const lg = String(((P.bible || {}).langue || {}).code || (P.meta || {}).langue_voix || 'fr').slice(0, 2).toLowerCase();
            fd.append('language_code', lg);
            const rs = await rfetch('https://api.elevenlabs.io/v1/speech-to-text', { method: 'POST', headers: { 'xi-api-key': CLES }, body: fd }, 2, 180000);
            if (!rs.ok) throw new Error('HTTP ' + rs.status + ' ' + String(await rs.text()).slice(0, 180));
            tr = await rs.json();
            try { coutAjoute('transcription', 'scribe_v2', { secondes: Math.round(Number(tr.audio_duration_secs) || Math.max(0, ...(tr.words || []).map(w => Number(w.end) || 0))) }, null); } catch (eC) {}
            mots = (tr.words || []).filter(w => w && String(w.type || 'word') === 'word' && String(w.text || '').trim() && typeof w.start === 'number');
            if (mots.length < 8) throw new Error('transcription trop courte (' + mots.length + ' mots)');
            save('08_transcription.json', tr);
            log('Transcription de la voix : ' + mots.length + ' mots minutes par Scribe.');
          }

          // Fidélité : ce que Veo a réellement dit, comparé au texte validé
          const net = t2 => norm(String(t2)).replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
          const ecrits = net((P.plan.clips || []).map(c2 => (c2.repliques || []).map(r => repTexte(r)).join(' ')).join(' ')).split(' ').filter(Boolean);
          // v6.29 — les mots dits etaient places dans un ENSEMBLE : un mot ecrit trois fois et prononce une
          // seule fois comptait comme entierement dit, ce qui flattait le taux. On compte les OCCURRENCES.
          // Et le log comparait deux comptages differents — « 90 mots entendus pour 162 ecrits » melangeait
          // des jetons de transcription et des mots coupes sur les apostrophes. Les deux cotes sont alignes.
          const ditsListe = net(mots.map(w => w.text).join(' ')).split(' ').filter(Boolean);
          const reste = new Map(); ditsListe.forEach(w => reste.set(w, (reste.get(w) || 0) + 1));
          const absents = [];
          ecrits.forEach(w => { const n5 = reste.get(w) || 0; if (n5 > 0) reste.set(w, n5 - 1); else absents.push(w); });
          const taux = ecrits.length ? Math.round((ecrits.length - absents.length) / ecrits.length * 100) : 0;
          P.fidelite_voix = { mots_ecrits: ecrits.length, mots_dits: ditsListe.length, taux_pct: taux, non_prononces: absents.slice(0, 25) };
          log('Fidélité de la voix : ' + taux + ' % des mots écrits sont réellement prononcés (' + ditsListe.length + ' mots entendus pour ' + ecrits.length + ' écrits)' + (absents.length ? ' — absents : ' + absents.slice(0, 12).join(', ') + (absents.length > 12 ? '…' : '') : '') + '.');

          // v6.24 — STYLE DE MARQUE ET ÉMOJIS. Les sous-titres ne peuvent pas être identiques d'un client à l'autre :
          // la couleur d'accent vient de la palette de SA marque, la police de son registre. Un seul appel Flash,
          // qui rapporte aussi quelques émojis calés sur les mots forts du texte.
          const sig = norm(String(P.plan.style_visuel || ''));
          const anim = /(3d anim|animated|cartoon|stylis)/.test(sig) && !/(live-action|photo-?real|documentary)/.test(sig);
          const POLICES = ['Arial Black', 'Impact', 'Verdana', 'Trebuchet MS', 'Tahoma'];
          const tHab = Date.now();
          let marque = { accent_hex: null, police: null, majuscules: null, emojis: [] };
          try {
            const pal = P.bible ? String(P.bible.palette_et_produit || '').slice(0, 600) : '';
            const txtMots = mots.map(w => w.text).join(' ').slice(0, 900);
            const gm = await vjson(`${LOCATION}-aiplatform.googleapis.com`, `/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-2.5-flash:generateContent`, {
              contents: [{ role: 'user', parts: [{ text: 'Tu habilles les sous-titres incrustés d\'une publicité verticale. Tu choisis une identité de sous-titres PROPRE À CETTE MARQUE, à partir de sa palette et du registre de la vidéo.\n'
                + 'accent_hex : la couleur qui surligne le mot prononcé. Elle est tirée de la palette de la marque, VIVE et LISIBLE sur une vidéo (jamais un blanc, un noir, un gris, ni un ton très sombre) ; si la palette n\'offre rien de vif, prends une couleur complémentaire de sa dominante.\n'
                + 'police : UNE valeur parmi ' + JSON.stringify(POLICES) + ' — « Impact » et « Arial Black » pour un registre direct et populaire, « Trebuchet MS » et « Verdana » pour un registre doux ou premium, « Tahoma » pour un registre neutre.\n'
                + 'majuscules : true pour un registre direct, false pour un registre premium ou intimiste.\n'
                + 'emojis : 3 à 6 entrées maximum pour TOUTE la vidéo, pas une de plus. Chaque entrée associe un MOT exact du texte (recopié tel qu\'il apparaît) à UN émoji qui renforce son sens. Tu ne places un émoji que sur un mot fort — une douleur, un bénéfice, un objet concret, le nom du produit. Jamais sur un mot outil, jamais deux émojis à la suite, jamais un émoji décoratif. L\'émoji doit DIRE le mot, littéralement : si quelqu\'un voyait l\'émoji seul, il devinerait le mot. Un émoji qui demande une interprétation (un globe pour « secret », une planète pour « monde intérieur ») est une erreur — dans ce cas tu n\'en mets aucun. Tu n\'en places jamais sur un mot abstrait (secret, confiance, liberté, moment, vie) : ces mots n\'ont pas d\'image. S\'il n\'y a rien d\'évident, rends une liste vide.\n\n'
                + 'PALETTE ET PRODUIT DE LA MARQUE : ' + (pal || '(non fournie)') + '\nREGISTRE VISUEL : ' + String(P.plan.style_visuel || '').slice(0, 300) + '\nTEXTE DE LA VIDÉO : ' + txtMots
                + '\n\nRéponds UNIQUEMENT par {"accent_hex":"#RRGGBB","police":"…","majuscules":true,"emojis":[{"mot":"…","emoji":"…"}]}' }] }],
              // v6.29 — deux echecs d'affilee sur un JSON malforme (« Unterminated string », puis « Expected , or } »),
              // et a chaque fois TOUT l'habillage de marque tombait en silence : police par defaut, accent par defaut,
              // zero emoji. Un schema impose supprime la classe de panne : le modele ne peut plus rendre autre chose.
              generationConfig: {
                temperature: 0.4, maxOutputTokens: 5000, thinkingConfig: { thinkingBudget: 0 }, responseMimeType: 'application/json',
                responseSchema: {
                  type: 'OBJECT',
                  properties: {
                    accent_hex: { type: 'STRING' },
                    police: { type: 'STRING', enum: POLICES },
                    majuscules: { type: 'BOOLEAN' },
                    emojis: { type: 'ARRAY', items: { type: 'OBJECT', properties: { mot: { type: 'STRING' }, emoji: { type: 'STRING' } }, required: ['mot', 'emoji'] } }
                  },
                  required: ['accent_hex', 'police', 'majuscules', 'emojis']
                }
              }
            });
            // v6.28 — à 900 jetons la réponse était tronquée en plein milieu d'une chaîne (« Unterminated string »)
            // et TOUT l'habillage de marque tombait en silence : police par défaut, accent par défaut, zéro émoji.
            // Budget relevé, et un JSON tronqué est désormais réparé au lieu d'être jeté.
            const brut = textOf(gm);
            let mj = null;
            try { mj = JSON.parse(brut); }
            catch (eJ) {
              let t3 = String(brut).replace(/^[^{]*/, '').replace(/,\s*$/, '');
              const q = (t3.match(/"/g) || []).length; if (q % 2) t3 += '"';
              t3 = t3.replace(/,\s*(?=[}\]])/g, '');
              const manque = (t3.match(/\[/g) || []).length - (t3.match(/\]/g) || []).length;
              for (let i6 = 0; i6 < manque; i6++) t3 += ']';
              const manqueA = (t3.match(/\{/g) || []).length - (t3.match(/\}/g) || []).length;
              for (let i6 = 0; i6 < manqueA; i6++) t3 += '}';
              mj = JSON.parse(t3);
              log('Habillage de marque : réponse tronquée, JSON réparé.');
            }
            if (mj && typeof mj === 'object') marque = Object.assign(marque, mj);
          } catch (eM2) { log('Habillage de marque des sous-titres indisponible (' + String(eM2.message || eM2).slice(0, 70) + ') : style par défaut.'); }
          if (Date.now() - tHab > 8000) log('Habillage de marque des sous-titres : ' + ((Date.now() - tHab) / 1000).toFixed(0) + ' s.');
          const hexAss = h => { const m2 = /^#?([0-9a-f]{6})$/i.exec(String(h || '').trim()); if (!m2) return null;
            const r = m2[1].slice(0, 2), g = m2[1].slice(2, 4), b = m2[1].slice(4, 6); return '&H00' + (b + g + r).toUpperCase() + '&'; };
          // v6.53 — LE CT PRIME SUR L'HABILLAGE. Mesure (run 94b5e103) : le CT-013 veut des capitales GRASSES BLANCHES a contour
          // epais, sans emoji ; la video est sortie en Verdana fin, mot surligne jaune et cinq emojis.
          const regST = (P._intent && P._intent.sous_titres_registre) || (P.boussole ? P.boussole.sous_titres_registre : null);   // v6.67 : symbiose, le registre lu dans le CT et le contexte du client prime sur le reglage par destination   // v6.54 : doux, percutant ou elegant, selon la destination
          const POLICE = process.env.SOUSTITRES_POLICE || ((stSpec && stSpec.gras === true) ? 'Arial Black' : regST === 'percutant' ? 'Arial Black' : regST === 'elegant' ? 'Trebuchet MS' : regST === 'doux' ? 'Verdana' : (POLICES.includes(marque.police) ? marque.police : (anim ? 'Verdana' : 'Arial Black')));
          if (stSpec && stSpec.emojis !== true) marque.emojis = [];   // un emoji n'est pose que si le CT le demande
          const TAILLE = Math.round(parseInt(process.env.SOUSTITRES_TAILLE || (anim ? '58' : '62'), 10) * ((stSpec && { petite: 0.85, moyenne: 1, grande: 1.2 }[stSpec.taille]) || 1));
          const ACCENT = process.env.SOUSTITRES_ACCENT || ((stSpec && stSpec.surlignage === false) ? '&H00FFFFFF&' : (hexAss(marque.accent_hex) || '&H0000D6FF&'));
          const EMO = {}; (Array.isArray(marque.emojis) ? marque.emojis : []).slice(0, 6).forEach(e => {
            const k = norm(String((e || {}).mot || '')).replace(/[^a-z0-9]/g, ''); const v2 = String((e || {}).emoji || '').trim();
            if (k && v2 && v2.length <= 4) EMO[k] = v2; });
          const POLICE_EMOJI = process.env.SOUSTITRES_POLICE_EMOJI || 'Segoe UI Emoji';
          log('Habillage des sous-titres : police ' + POLICE + ', accent ' + (marque.accent_hex || 'par défaut') + ', ' + Object.keys(EMO).length + ' émoji(s) placé(s).');
          const MARGE = process.env.SOUSTITRES_MARGE ? parseInt(process.env.SOUSTITRES_MARGE, 10) : (stSpec && typeof stSpec.position_pct === 'number' ? Math.max(60, Math.min(1000, Math.round(1280 * (1 - stSpec.position_pct / 100) - TAILLE * 0.6))) : 380); // 9:16 : au-dessus de l'interface Meta par défaut ; sinon la position du CT
          const MAJ = process.env.SOUSTITRES_MAJUSCULES ? process.env.SOUSTITRES_MAJUSCULES !== '0' : ((stSpec && typeof stSpec.majuscules === 'boolean') ? stSpec.majuscules : (typeof marque.majuscules === 'boolean' ? marque.majuscules : true));
          const esc = t2 => String(t2).replace(/[{}]/g, '').replace(/\r?\n/g, ' ').trim();
          // v6.28 — DEBORDEMENT DES SOUS-TITRES. Deux causes cumulées, mesurées au banc : WrapStyle 2 interdit
          // tout repli (une ligne trop large s'étalait de x=0 à x=719, coupée des DEUX côtés), et les groupes étaient
          // figés à 3 mots sans regarder leur LONGUEUR : « TRANQUILLE. C'EST FORMULE » fait 25 caractères et ne tient
          // pas dans les 640 px utiles. On groupe donc par BUDGET DE CARACTèRES, et WrapStyle 0 sert de filet.
          const MODE = (stSpec && stSpec.mode) || 'groupes';
          const MPG = Math.max(1, Math.min(6, (stSpec && stSpec.mots_par_groupe) || 3));
          const CAR_MAX = parseInt(process.env.SOUSTITRES_CAR_MAX || String(MODE === 'phrase' ? 30 : Math.max(8, 5 * MPG)), 10);
          const bornesPlans = (MINI_RUN && VO_TIMING && Array.isArray(VO_TIMING.segments)) ? VO_TIMING.segments.map(sg => Number(sg.fin) || 0).filter(x => x > 0) : [];
          const planDe = t9 => { let k9 = 0; while (k9 < bornesPlans.length && t9 >= bornesPlans[k9] - 0.05) k9++; return k9; };
          const decouper = (maxMots, maxCar, coupePonct) => {
            const out = []; let cur = [], len = 0;
            for (const w of mots) {
              const l = String(w.text || '').length;
              if (cur.length && bornesPlans.length && planDe(Number(w.start) || 0) !== planDe(Number(cur[0].start) || 0)) { out.push(cur); cur = []; len = 0; }   // v6.53 : on ne chevauche jamais une coupe
              if (cur.length && (cur.length >= maxMots || len + 1 + l > maxCar)) { out.push(cur); cur = []; len = 0; }
              cur.push(w); len += (len ? 1 : 0) + l;
              if (coupePonct && /[.!?…]$/.test(String(w.text).trim())) { out.push(cur); cur = []; len = 0; }
            }
            if (cur.length) out.push(cur);
            return out;
          };
          let grp = [], MODE_EFFECTIF = MODE;
          if (MODE === 'mot_a_mot') grp = mots.map(w => [w]);
          else if (MODE === 'phrase') grp = decouper(7, CAR_MAX, true);
          else if (MODE === 'mots_cles') {
            try {
              const maxE = Math.max(4, Math.round(mots.length / 6));
              const gk = await vjson(`${LOCATION}-aiplatform.googleapis.com`, `/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-2.5-flash:generateContent`, {
                contents: [{ role: 'user', parts: [{ text: 'Voici la parole d\'une publicité, mots numérotés. Choisis les MOTS ou PETITES EXPRESSIONS qui portent le sens (une douleur, un bénéfice, un chiffre, le nom du produit, l\'appel à l\'action) pour les afficher à l\'écran.\n'
                  + 'Règles : 4 à ' + maxE + ' expressions, chacune de 1 à 4 mots CONSÉCUTIFS, jamais plus d\'un quart des mots au total, réparties sur toute la durée. Réponds par {"expressions":[{"debut":N,"fin":M}]} (indices inclus).\n\n' + mots.map((w, i) => i + ':' + w.text).join(' ') }] }],
                generationConfig: { temperature: 0.2, maxOutputTokens: 3000, thinkingConfig: { thinkingBudget: 0 }, responseMimeType: 'application/json', responseSchema: { type: 'OBJECT', properties: { expressions: { type: 'ARRAY', items: { type: 'OBJECT', properties: { debut: { type: 'INTEGER' }, fin: { type: 'INTEGER' } }, required: ['debut', 'fin'] } } }, required: ['expressions'] } }
              });
              const ex = (JSON.parse(textOf(gk)).expressions || []).filter(e => Number.isInteger(e.debut) && Number.isInteger(e.fin) && e.debut >= 0 && e.fin >= e.debut && e.fin < mots.length && e.fin - e.debut <= 3).sort((x, y) => x.debut - y.debut);
              let dern = -1; const ok = []; ex.forEach(e => { if (e.debut > dern) { ok.push(e); dern = e.fin; } });
              if (ok.length < 3) throw new Error('moins de 3 expressions exploitables');
              grp = ok.map(e => mots.slice(e.debut, e.fin + 1));
              log('Sous-titres « mots importants » : ' + grp.length + ' expression(s) affichée(s) sur ' + mots.length + ' mots.');
            } catch (eK) { log('Choix des mots importants impossible (' + String(eK.message || eK).slice(0, 80) + ') : groupes de ' + MPG + ' mots.'); MODE_EFFECTIF = 'groupes'; grp = decouper(MPG, CAR_MAX, false); }
          } else grp = decouper(MPG, CAR_MAX, false);
          if (MODE_EFFECTIF === 'groupes') for (let i8 = 1; i8 < grp.length; i8++) {   // v6.53 : jamais un mot seul en fin de vers (« miroir. ») quand le groupe d'avant peut en ceder un
            const g0 = grp[i8 - 1], g1 = grp[i8];
            if (g1.length === 1 && g0.length >= 3 && (!bornesPlans.length || planDe(Number(g0[0].start) || 0) === planDe(Number(g1[0].start) || 0))) g1.unshift(g0.pop());
          }
          const STATIQUE = MODE_EFFECTIF === 'phrase' || MODE_EFFECTIF === 'mots_cles';
          const CLAIRE = !!(stSpec && stSpec.fond === 'boite_claire');   // v6.77 : pastille blanche, texte noir (CT010 : sous-titres UGC lisibles sur n'importe quelle image)
          const BOITE = !!(stSpec && (stSpec.fond === 'boite' || CLAIRE));
          const BLANC = CLAIRE ? '&H00141414&' : '&H00FFFFFF&';
          let ass = '[Script Info]\nScriptType: v4.00+\nPlayResX: 720\nPlayResY: 1280\nWrapStyle: 0\nScaledBorderAndShadow: yes\n\n'
            + '[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n'
            + 'Style: ST,' + POLICE + ',' + TAILLE + ',' + BLANC + ',' + BLANC + ',' + (CLAIRE ? '&H00FFFFFF&' : BOITE ? '&H40000000&' : '&H00000000&') + ',&H64000000&,-1,0,0,0,100,100,1,0,' + (BOITE ? 3 : 1) + ',' + (BOITE ? 12 : (anim ? 4 : 6)) + ',2,2,40,40,' + MARGE + ',1\n\n'
            + '[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n';
          const tc = t2 => { const h = Math.floor(t2 / 3600), m2 = Math.floor((t2 % 3600) / 60), sec = t2 % 60;
            return h + ':' + String(m2).padStart(2, '0') + ':' + sec.toFixed(2).padStart(5, '0'); };
          // v6.37 — DEUX LIGNES A L'ECRAN EN MEME TEMPS. Chaque mot durait jusqu'au mot suivant de SON groupe, et le
          // dernier mot d'un groupe jusqu'a sa fin mesuree : quand cette fin depassait le debut du groupe suivant, les
          // deux lignes se superposaient et on voyait un sous-titre fantome derriere l'autre. Les evenements sont donc
          // bornes les uns aux autres, tous groupes confondus.
          const evts = [];
          if (STATIQUE) grp.forEach(g => evts.push({ g, k5: -1, t0: g[0].start, t1: Math.max(g[g.length - 1].end + (MODE_EFFECTIF === 'mots_cles' ? 0.25 : 0.12), g[0].start + 0.5) }));
          else grp.forEach((g, ig) => g.forEach((w, k5) => {
            const suiv = k5 + 1 < g.length ? g[k5 + 1].start : (grp[ig + 1] && grp[ig + 1][0] ? Math.min(g[g.length - 1].end, grp[ig + 1][0].start) : g[g.length - 1].end);
            evts.push({ g, k5, t0: w.start, t1: suiv });
          }));
          evts.forEach((e5, i5) => { const nxt = evts[i5 + 1]; if (nxt && e5.t1 > nxt.t0) e5.t1 = nxt.t0; });
          {
            evts.forEach(e5 => {
              const g = e5.g, k5 = e5.k5, w = g[k5];
              const t0 = e5.t0, t1 = Math.max(e5.t1, t0 + 0.08);
              const txt = g.map((x, j5) => { const brut = String(x.text); const mot = esc(MAJ ? brut.toUpperCase() : brut);
                const em = EMO[norm(brut).replace(/[^a-z0-9]/g, '')];
                const suffixe = em ? ' {\\fn' + POLICE_EMOJI + '\\c&H00FFFFFF&}' + em + '{\\fn' + POLICE + '}' : '';
                return ((j5 === k5 || MODE_EFFECTIF === 'mots_cles') ? '{\\c' + (CLAIRE ? BLANC : ACCENT) + (regST === 'doux' || regST === 'elegant' ? '' : '\\fscx112\\fscy112\\t(0,90,\\fscx100\\fscy100)') + '}' + mot + '{\\c' + BLANC + '}' : mot) + suffixe;
              }).join(' ');
              ass += 'Dialogue: 0,' + tc(t0) + ',' + tc(t1) + ',ST,,0,0,0,,{\\fad(60,0)}' + txt + '\n';
            });
          }
          const fAss = path.join(OUT, id + '_soustitres.ass');
          fs.writeFileSync(fAss, ass, 'utf8');
          const vOut = P.montage.replace(/\.mp4$/, '_st.mp4');
          const chemin = fAss.replace(/\\/g, '/').replace(/:/g, '\\:');
          // v6.28 — ENCODAGE DE LIVRAISON. Mesuré au banc sur la vidéo livrée (SSIM et PSNR contre la source) :
          // CRF 20 medium = 95 % de la taille ; CRF 23 slow = 67 % (SSIM 0,9916 — PSNR 45,2 dB) ; CRF 24 = 60 % ;
          // CRF 25 = 53 % (SSIM 0,9889). Au-dessus de 43 dB de PSNR l'œil ne fait plus la différence : on prend 23.
          // « faststart » déplace l'index en tête du fichier — il manquait, et sans lui la lecture web démarre tard.
          // v6.39 — le preset passe de `slow` a `medium`. Mesure au banc sur 32 s en 720x1280, deux coeurs : slow 32,7 s
          // pour 9 702 Ko, medium 18,9 s pour 9 910 Ko, fast 16,7 s pour 9 980 Ko. On paie 2 % de poids pour 42 % de
          // temps en moins sur l'etape la plus longue du montage. VIDEO_PRESET=slow rend l'ancien comportement.
          const CRF = process.env.VIDEO_CRF || '23', PRESET = process.env.VIDEO_PRESET || 'veryfast';
          const tSt = Date.now();
          await sh('ffmpeg', ['-y', '-i', vIn, '-vf', "subtitles='" + chemin + "'", '-c:v', 'libx264', '-preset', PRESET, '-crf', CRF, '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart', '-c:a', 'copy', path.join(OUT, vOut)]);
          // v6.68 — L'ACCENT DE LA VOIX, PAS LA LONGUEUR DU MOT. Quand le CT agrandit les mots importants (et que l'intention le juge pertinent),
          // la source n'agrandit pas « le plus long mot » : elle agrandit ce que la voix appuie (l'objet, le lieu, l'idee). Flash lit la parole et
          // designe ces mots ; sans reponse exploitable, le monteur retombe sur la regle de la longueur.
          try {
            if (stSpec && stSpec.emphase_agrandie === true && !(P._intent && P._intent.emphase_agrandie_pertinente === false) && mots.length >= 8) {
              const gf = await vjson(`${LOCATION}-aiplatform.googleapis.com`, `/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/gemini-2.5-flash:generateContent`, {
                contents: [{ role: 'user', parts: [{ text: 'Voici la parole d\'une publicité, mots numérotés. Désigne les mots que la VOIX APPUIE quand on la dit à voix haute : le nom de la chose, du lieu ou de la situation, le mot qui porte l\'idée ou la surprise, chaque élément d\'une énumération. Jamais un mot de liaison, un pronom, un auxiliaire ni un petit mot.\n'
                  + 'Règles : environ un mot sur quatre, jamais deux mots appuyés de suite, répartis sur toute la durée. Réponds par {"mots":[N,N,…]} (indices).\n\n' + mots.map((w, i) => i + ':' + w.text).join(' ') }] }],
                generationConfig: { temperature: 0.2, maxOutputTokens: 2000, thinkingConfig: { thinkingBudget: 0 }, responseMimeType: 'application/json', responseSchema: { type: 'OBJECT', properties: { mots: { type: 'ARRAY', items: { type: 'INTEGER' } } }, required: ['mots'] } }
              });
              const fs8 = new Set((JSON.parse(textOf(gf)).mots || []).filter(n => Number.isInteger(n) && n >= 0 && n < mots.length));
              if (fs8.size >= 3 && fs8.size <= Math.ceil(mots.length / 2.5)) { mots.forEach((w, i) => { w.fort = fs8.has(i); }); log('Sous-titres : ' + fs8.size + ' mot(s) appuyé(s) par la voix agrandis sur ' + mots.length + '.'); }
            }
          } catch (eF) { log('Mots appuyés : lecture impossible (' + String(eF.message || eF).slice(0, 80) + '), règle de la longueur du mot.'); }
          P.montage_sans_soustitres = P.montage; P.montage = vOut; P.soustitres = { fichier: id + '_soustitres.ass', mode: MODE_EFFECTIF, spec_ct: stSpec, mots: mots.length, police: POLICE, marge: MARGE, accent: marque.accent_hex || null, accent_effectif: (stSpec && stSpec.surlignage === false) ? '#FFFFFF' : (marque.accent_hex || null), majuscules: MAJ, emojis: EMO }; P.soustitres.taille = TAILLE; P.soustitres.fond = BOITE ? 'boite' : 'contour'; P.soustitres.groupes = grp.map(g8 => g8.map(w8 => ({ t: String(w8.text), s: Number(w8.start), e: Number(w8.end), f: w8.fort })));
          P.steps.push({ etape: '8. Sous-titres dynamiques (Scribe + ASS)', fichier: vOut, mots: mots.length, groupes: grp.length, police: POLICE, fidelite: P.fidelite_voix });
          if (Date.now() - tSt > 150000) log('⚠ L\'incrustation a pris ' + ((Date.now() - tSt) / 1000 / 60).toFixed(1) + ' min pour 32 s de vidéo : ce n\'est pas l\'encodage. La cause habituelle est la POLICE « ' + POLICE + ' » — si elle n\'est pas installée sur la machine, le moteur de sous-titres reconstruit son index de polices à chaque passage. Installe cette police, ou pose SOUSTITRES_POLICE sur une police déjà présente.');
          log('Sous-titres incrustés en ' + ((Date.now() - tSt) / 1000).toFixed(0) + ' s (preset ' + PRESET + ', CRF ' + CRF + ') : ' + vOut + ' — ' + mots.length + ' mots, mode ' + MODE_EFFECTIF + ', position ' + MARGE + ' px du bas, police ' + POLICE + '. Les versions sans sous-titres restent dans lab_out.');
          try { fs.unlinkSync(aTmp); } catch (_) {}
        } catch (eS) {
          log('Sous-titres impossibles (' + (/ENOENT|not recognized|introuvable/i.test(String(eS.message || eS)) ? 'ffmpeg absent' : String(eS.message || eS).slice(0, 150)) + ') : la vidéo reste sans sous-titres.');
        }
      }
      // ───── v6.57 — MONTEUR HYPERFRAMES : re-montage dynamique de la vidéo assemblée (coupes accentuées, punch-ins, secousse,
      // flash/creux, étalonnage froid→chaud suivant les rôles, bandeau offre/appel, sous-titres animés). GÉNÉRIQUE : aucun CT n'est
      // cité ; l'intensité vient de la boussole. Aucun appel payant. Au moindre échec : le montage ffmpeg ci-dessus est livré tel quel.
      // Désactivable : MONTEUR=0. Les CT parlés (voix de Veo) gardent leurs fondus : énergie plafonnée à 5 (ni secousse ni flash).
      if (P.montage && process.env.MONTEUR !== '0') {
        try {
          const MT = require('./monteur_hf.js');
          const dgM = MT.diagnostic(__dirname);
          if (!dgM.ok) log('Monteur HyperFrames ignoré : il manque ' + dgM.manque.join(', ') + ' — le montage ffmpeg est livré tel quel.');
          else {
            const tM = Date.now();
            // v6.60 — le monteur DESSINE les incrustations du CT (cartes, pastilles, chiffres, plans de coupe) : il part de la video SANS incrustations ni sous-titres.
            const itemsInc = (P.incrustations && Array.isArray(P.incrustations.items)) ? P.incrustations.items : [];
            const baseSansInc = itemsInc.length && P.montage_sans_incrustations && fs.existsSync(path.join(OUT, P.montage_sans_incrustations)) ? P.montage_sans_incrustations : null;
            const nomBase = baseSansInc || P.montage_sans_soustitres || P.montage, vBase = path.join(OUT, nomBase);
            const pr = require('child_process').spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=r_frame_rate,width,height:format=duration', '-of', 'json', vBase], { encoding: 'utf8' });
            const jp = JSON.parse(pr.stdout || '{}'), stv = (jp.streams || [])[0] || {};
            const fr = String(stv.r_frame_rate || '24/1').split('/'), fpsM = Math.max(12, Math.min(60, Math.round(Number(fr[0]) / (Number(fr[1]) || 1)) || 24));
            const DM = Number((jp.format || {}).duration) || 0;
            if (!(DM > 3)) throw new Error('durée de la vidéo illisible');
            const durs = (P.montage_dyn && Array.isArray(P.montage_dyn.durees)) ? P.montage_dyn.durees : [];
            const sec = !!(MINI_RUN && P.voixoff && P.voixoff.utilise);   // coupes sèches : les instants de coupe sont les cumuls exacts
            const trs = (P.montage_dyn && P.montage_dyn.fondus_s) || [];
            const bornesM = [0]; let cum = 0, cumT = 0;
            durs.forEach((d8, i8) => { cum += d8; if (!sec && i8 < durs.length - 1) cumT += (trs[i8] || 0); if (i8 < durs.length - 1) bornesM.push(cum - cumT); });
            bornesM.push(DM);
            const clipsM = (P.plan && P.plan.clips) || [];
            const rolesM = (clipsM.length === durs.length ? clipsM : []).map((c8, i8) => ({ t0: bornesM[i8], t1: bornesM[i8 + 1], role: String(c8.role || '') }));
            const ec = (P.plan && P.plan.end_card) || {};
            const txtOf = v8 => typeof v8 === 'string' ? v8 : (v8 && typeof v8 === 'object' ? String(v8.texte || v8.offre || v8.text || '') : '');
            const titreC = txtOf(ec.offre) || txtOf(ec.cta), sousC = txtOf(ec.offre) && txtOf(ec.cta) ? txtOf(ec.cta) : '';
            const finRoles = rolesM.filter(r8 => /^(offre|appel)$/.test(r8.role) && r8.t0 > DM - 9);
            const surs = [];   // les surimpressions du CT (cartes, pastilles, chiffres) sont deja incrustees par l'etape v6.49 : le monteur ne les double pas
            const aCarteFin = ((P.plan && P.plan.surimpressions) || []).some(x8 => x8 && /offre|cta|fin|end/i.test(String(x8.type || '')));
            // Reglages de montage LUS DANS LE CT (jamais devines : ce que le CT ne dit pas reste null et l'energie de la boussole decide).
            const regl = P._postCT || null;
            const reglages = {};
            if (regl) {
              if (regl.etalonnage === 'aucun') { reglages.grade = false; reglages.vignette = false; }
              if (regl.camera === 'immobile') { reglages.zoom = 0.35; reglages.pop = 0.3; reglages.secousse = false; reglages.flash = false; reglages.dip = false; }
              else if (regl.camera === 'lent') { reglages.zoom = 0.6; reglages.pop = 0.5; reglages.secousse = false; }
              if (regl.mouvement_rapide === false) { reglages.secousse = false; reglages.flash = false; }
            }
            // v6.62 — carte de PREUVE faite de donnees reelles du client (verifiees contre la synthese) : seulement si le CT a un temps de preuve.
            const prv = P._intent && P._intent.preuve, cartePreuve = [];
            if (prv && prv.present_dans_ct && prv.type !== 'aucune' && (prv.lignes.length || prv.note != null)) {
              const t0p = Math.max(1, Math.min(DM - 3.6, (typeof prv.position === 'number' ? prv.position : 0.55) * DM)), dur = 2.4 + 0.45 * Math.min(4, prv.lignes.length);
              cartePreuve.push({ type: 'preuve_donnee', texte: prv.titre || '', titre: prv.titre || '', lignes: prv.lignes, note: prv.note, nb: prv.nb, t0: t0p, t1: Math.min(DM - 0.2, t0p + dur) });
            }
            // v6.66 — CARTE DE FIN PLEINE IMAGE (marque, offre, garantie, photo du produit du client) quand l'intention du CT est une carte qui remplace l'image.
            const cf = !!(P._intent && P._intent.carte_fin === 'plein_cadre'), carteFin = [];
            if (cf && (titreC || (ec && ec.marque))) {
              let fProd = null; try { if (p.produit && p.produit.data) { fProd = path.join(OUT, id + '_carte_fin_produit.png'); fs.writeFileSync(fProd, Buffer.from(p.produit.data, 'base64')); } } catch (eFp) { fProd = null; }
              const gar = ((P.plan && P.plan.surimpressions) || []).find(x8 => x8 && /garantie/i.test(String(x8.type || '')) && x8.texte);
              carteFin.push({ type: 'fin_plein_cadre', marque: (ec && ec.marque) || '', titre: titreC || '', sous: sousC || '', bouton: gar ? String(gar.texte) : '', fichier: fProd, t0: Math.max(1, DM - 4.5), t1: DM });
            }
            const stM = P.soustitres && Array.isArray(P.soustitres.groupes) && P.soustitres.groupes.length ? P.soustitres : null;
            const E0 = P.boussole ? P.boussole.energie : 6;
            const S = { w: Number(stv.width) || 720, h: Number(stv.height) || 1280, fps: fpsM, duree: DM, energie: MINI_RUN ? E0 : Math.min(5, E0),
              coupes: bornesM.slice(1, -1), roles: rolesM, graine: 0, accent: (stM && (stM.accent_effectif || stM.accent)) || '#FFD600', reglages, police: stM ? stM.police : 'Arial Black', majuscules: stM ? stM.majuscules !== false : true,
              tailleSt: stM && stM.taille ? stM.taille / 66.5 : 1, stMode: stM ? stM.mode : null, stFond: stM ? stM.fond : null, stEmphase: !!(stM && stM.spec_ct && stM.spec_ct.emphase_agrandie === true && !(P._intent && P._intent.emphase_agrandie_pertinente === false)), stEmojis: stM ? stM.emojis : null, margeStPct: stM && stM.marge ? Math.max(0.05, Math.min(0.8, stM.marge / (Number(stv.height) || 1280))) : 0.2,
              sousTitres: stM ? stM.groupes : [], incrustations: surs, langue: String(((P.bible || {}).langue || {}).code || 'fr'),
              cartes: (baseSansInc ? itemsInc.filter(x8 => (x8.texte || x8.fichier) && x8.t1 > x8.t0 && !(cf && x8.t0 > DM - 6 && /marque|offre|garantie/i.test(String(x8.type || '')))).map(x8 => ({ type: x8.type, texte: x8.texte, t0: x8.t0, t1: x8.t1, fichier: x8.fichier })) : []).concat(cartePreuve).concat(carteFin).concat(P.speciales || []),
              cta: (titreC && !aCarteFin && !cf) ? { t0: finRoles.length ? Math.max(DM - 4.5, Math.min(finRoles[0].t0, DM - 2.2)) : DM - 2.6, titre: titreC, sous: sousC } : null };
            save('09_plan_de_montage.json', S);
            const nomOut = String(P.montage).replace(/(_st)?\.mp4$/, '') + '_hf.mp4';
            log('Monteur HyperFrames : ' + (bornesM.length - 1) + ' plans, énergie ' + S.energie + '/10, ' + S.sousTitres.length + ' groupes de sous-titres animés' + (S.cta ? ', bandeau « ' + titreC.slice(0, 40) + ' »' : '') + ' — rendu en cours (quelques minutes)…');
            const rm = await MT.monter(S, { video: vBase, sortie: path.join(OUT, nomOut), dossierTravail: path.join(OUT, id + '_hf'), dossierServeur: __dirname, log, workers: parseInt(process.env.MONTEUR_WORKERS || '2', 10), delaiMs: 1200000 });
            if (rm.ok) {
              P.montage_ffmpeg = P.montage; P.montage = nomOut; P.monteur = { fichier: nomOut, secondes: rm.secondes, energie: S.energie, plans: bornesM.length - 1 };
              P.steps.push({ etape: '8b. Monteur HyperFrames', fichier: nomOut, secondes: rm.secondes });
              log('Monteur HyperFrames terminé en ' + rm.secondes + ' s : ' + nomOut + '. La version ffmpeg précédente (' + P.montage_ffmpeg + ') reste dans lab_out.');
              try { fs.rmSync(path.join(OUT, id + '_hf'), { recursive: true, force: true }); } catch (_) {}
            } else log('⚠ Monteur HyperFrames impossible (' + rm.raison + ') — le montage ffmpeg est livré tel quel.');
          }
        } catch (eM) { log('⚠ Monteur HyperFrames impossible (' + String(eM.message || eM).slice(0, 200) + ') — le montage ffmpeg est livré tel quel.'); }
      }
      const okc = P.videos.filter(x => x.state === 'done');
      P.video = (okc[0] || {}).file; P.cost = Math.round(okc.reduce((t, x) => t + (x.cost || 0), 0) * 100) / 100;
      P.state = okc.length ? 'done' : 'error'; if (!okc.length) P.error = 'Aucun clip n\'a pu être généré (voir le journal).'; P.stage = 'terminé';
      save('06_resultat.json', { videos: P.videos, cout_video_estime_usd: P.cost, refs: P.refs });
      if (P.state === 'done') await sauverSurSupabase(P, log);
      await coutFinal(P, log, save);
      persisterPipe(P);
    } catch (e) { P.state = 'error'; P.error = String(e.message || e); log('ERREUR ' + P.error); try { save('99_erreur.txt', P.error); } catch (_) {} await coutFinal(P, log, save); persisterPipe(P); }
  })();
  return id;
}
// ── État des productions conservé sur le disque, relu au démarrage ──
const persisterPipe = (P) => { try { const d = path.join(OUT, 'run_' + P.id); if (!fs.existsSync(d)) return; const t = JSON.stringify(P); if (t.length < 25e6) fs.writeFileSync(path.join(d, 'etat.json'), t); } catch (_) { } };
try {
  fs.readdirSync(OUT).filter(f => /^run_[0-9a-f]{8}$/.test(f)).forEach(f => {
    const fp = path.join(OUT, f, 'etat.json'); if (!fs.existsSync(fp)) return;
    try {
      const P = JSON.parse(fs.readFileSync(fp, 'utf8')); if (!P || !P.id || pipes[P.id]) return;
      if (P.state === 'running') { P.state = 'error'; P.stage = 'interrompue'; P.error = 'Production interrompue : le service a redémarré pendant le travail. Relance-la (les clips déjà payés de cette tentative restent dans l\'historique).'; (P.log = P.log || []).push('[service] ' + P.error); }
      pipes[P.id] = P;
    } catch (_) { }
  });
} catch (_) { }
setInterval(() => { Object.values(pipes).forEach(P => { if (P.state === 'running' || !P._persiste) { persisterPipe(P); if (P.state !== 'running') P._persiste = true; } }); }, 5000).unref();
['SIGTERM', 'SIGINT'].forEach(sig => process.on(sig, () => { Object.values(pipes).forEach(P => { if (P.state === 'running') { P.state = 'error'; P.stage = 'interrompue'; P.error = 'Production interrompue : le service a été arrêté ou redéployé pendant le travail. Relance-la.'; } persisterPipe(P); }); process.exit(0); }));
const nettoyerAnciennes = () => {
  if (!EN_LIGNE || !(RETENTION_DAYS > 0)) return;   // jamais en local : on n'efface rien chez toi
  const limite = Date.now() - RETENTION_DAYS * 864e5;
  try { fs.readdirSync(OUT).forEach(f => { const fp = path.join(OUT, f); try { if (fs.statSync(fp).mtimeMs < limite) { fs.rmSync(fp, { recursive: true, force: true }); const m = /^run_([0-9a-f]{8})$/.exec(f); if (m) delete pipes[m[1]]; } } catch (_) { } }); } catch (_) { }
};
nettoyerAnciennes(); setInterval(nettoyerAnciennes, 6 * 3600 * 1000).unref();
// Copie durable de la vidéo finale dans Supabase Storage (bucket public « videos ») : elle survit au disque et peut être livrée au client.
async function sauverSurSupabase(P, log) {
  const url = String(process.env.SUPABASE_URL || '').replace(/\/+$/, ''), key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;
  if (!url || !key || !P.montage) return;
  try {
    const f = path.join(OUT, P.montage); if (!fs.existsSync(f)) return;
    const bucket = process.env.VIDEO_BUCKET || 'videos', nom = P.id + '/' + path.basename(f);
    try { await fetch(url + '/storage/v1/bucket', { method: 'POST', headers: { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' }, body: JSON.stringify({ id: bucket, name: bucket, public: true }) }); } catch (_) { }   // crée le bucket public s'il n'existe pas (sans effet s'il existe déjà)
    const r = await fetch(url + '/storage/v1/object/' + bucket + '/' + nom, { method: 'POST', headers: { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'video/mp4', 'x-upsert': 'true' }, body: fs.readFileSync(f) });
    if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + (await r.text()).slice(0, 160));
    P.video_url = url + '/storage/v1/object/public/' + bucket + '/' + nom;
    log('Vidéo finale copiée dans Supabase : ' + P.video_url);
  } catch (e) { log('⚠ Copie Supabase impossible (' + String(e.message || e).slice(0, 200) + ') : la vidéo reste sur le disque du service.'); }
}
http.createServer(async (req, res) => {
  // v6.55 — Factory (page https) pilote ce labo local : accès autorisé, y compris l'entête « réseau privé » exigé par Chrome.
  { const org = String(req.headers.origin || ''); res.setHeader('Access-Control-Allow-Origin', LAB_ORIGINS.includes('*') ? '*' : (LAB_ORIGINS.includes(org) ? org : LAB_ORIGINS[0])); if (!LAB_ORIGINS.includes('*')) res.setHeader('Vary', 'Origin'); }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, ngrok-skip-browser-warning, x-lab-key');
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Content-Length, Content-Disposition');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  const send = (c, o) => { res.writeHead(c, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(o)); };
  if (req.url.split('?')[0] === '/health') return send(200, { ok: true, version: 'v6.80-service-en-ligne', en_ligne: EN_LIGNE, productions_en_cours: Object.values(pipes).filter(x => x.state === 'running').length, max: MAX_JOBS });
  if (LAB_KEY && !cleOk(req.headers['x-lab-key'] || decodeURIComponent((/[?&]k=([^&]*)/.exec(req.url) || [])[1] || ''))) return send(401, { error: 'Clé d\'accès absente ou fausse : saisis la clé du service vidéo dans Factory.' });
  try {
    if (req.method === 'GET' && req.url === '/bench.html') { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); return res.end(fs.readFileSync(path.join(__dirname, 'bench.html'))); }
    if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); return res.end(fs.readFileSync(path.join(__dirname, 'lab.html'))); }
    // v6.56 : la « compétence » de l'agent vidéo, en lecture seule, pour l'onglet Compétence de Factory (le fichier COMPETENCE_CREATIVE_VIDEO.md s'il existe, sinon l'historique des versions de ce serveur)
    if (req.method === 'GET' && req.url === '/competence') {
      let t = ''; const fc = path.join(__dirname, 'COMPETENCE_CREATIVE_VIDEO.md');
      try { if (fs.existsSync(fc)) t = fs.readFileSync(fc, 'utf8'); } catch (e) { }
      if (!t) { try { t = '# Créative Vidéo : historique des règles du labo (lecture seule)\n\n' + fs.readFileSync(__filename, 'utf8').split('\n').filter(l => /^\/\/ VERSION /.test(l)).map(l => l.slice(3)).join('\n\n'); } catch (e) { t = 'Compétence indisponible.'; } }
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end(t);
    }
    if (req.method === 'GET' && req.url === '/models') return send(200, MODELS);
    // Les CT vivent dans le dossier du serveur : le lab les liste et les charge lui-même, plus besoin de joindre un fichier.
    if (req.method === 'GET' && req.url === '/cts') {
      const str = (t, k) => { const m = t.match(new RegExp('"' + k + '"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"')); try { return m ? JSON.parse('"' + m[1] + '"').trim() : null; } catch (e) { return null; } };
      const arr = (t, k) => { const m = t.match(new RegExp('"' + k + '"\\s*:\\s*\\[([^\\]]*)\\]')); return m ? m[1].split(',').map(x => x.replace(/["'\s]+/g, ' ').trim()).filter(Boolean) : []; };
      const liste = fs.readdirSync(__dirname).filter(f => /^CT_VIDEO_.*\.md$/i.test(f)).sort().map(f => {
        let t = ''; try { t = fs.readFileSync(path.join(__dirname, f), 'utf8'); } catch (e) { return null; }
        const num = (f.match(/CT_VIDEO_(\d+)/i) || [])[1] || '';
        const nom = str(t, 'name') || f.replace(/^CT_VIDEO_\d*_?|\.md$/gi, '').replace(/_/g, ' ');
        const aw = arr(t, 'awareness'), lieu = str(t, 'signature_lieu');
        return { file: f, num, nom, awareness: aw.join(', '), lieu: lieu ? lieu.slice(0, 120) : null, octets: Buffer.byteLength(t),
                 label: (num ? num + ' — ' : '') + nom + (aw.length ? '  ·  ' + aw.join(', ') : '') };
      }).filter(Boolean);
      return send(200, liste);
    }
    if (req.method === 'GET' && req.url.startsWith('/ct?')) {
      const f = path.basename(decodeURIComponent((req.url.split('f=')[1] || '').split('&')[0]));
      if (!/^CT_VIDEO_.*\.md$/i.test(f)) return send(400, { error: 'nom de CT invalide' });
      const fp = path.join(__dirname, f); if (!fs.existsSync(fp)) return send(404, { error: 'CT introuvable' });
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end(fs.readFileSync(fp));
    }
    if (req.method === 'POST' && req.url === '/start') {
      let b = ''; for await (const c of req) b += c; const p = JSON.parse(b);
      if (!MODELS[p.model]) return send(400, { error: 'modèle inconnu' });
      return send(200, { id: await startJob(p) });
    }
    if (req.method === 'GET' && req.url.startsWith('/status/')) { const j = jobs[req.url.split('/')[2]]; return j ? send(200, j) : send(404, { error: 'inconnu' }); }
    if (req.method === 'POST' && req.url === '/pipeline') { let b = ''; for await (const c of req) b += c; const p = JSON.parse(b); { const enCours = Object.values(pipes).filter(x => x.state === 'running').length; if (enCours >= MAX_JOBS) return send(429, { error: 'Le service produit déjà ' + enCours + ' vidéo(s) (maximum ' + MAX_JOBS + ' en même temps). Réessaie dans quelques minutes : rien n\'a été dépensé.' }); } if (!p.model || p.model === 'auto') p.model = 'veo-3.1-fast-generate-001'; else p.model_force = true; if (!MODELS[p.model]) return send(400, { error: 'modèle inconnu' }); return send(200, { id: await runPipeline(p) }); }
    if (req.method === 'GET' && /^\/pipe\/[^/?]+\/historique/.test(req.url)) {
      const pid = req.url.split('/')[2], P = pipes[pid]; if (!P) return send(404, { error: 'production inconnue' });
      const avecImages = !/[?&]images=0/.test(req.url);
      const fichiers = [], vus = new Set();
      const ajouter = (abs, nom) => {
        try {
          const st = fs.statSync(abs); if (!st.isFile() || vus.has(abs)) return; vus.add(abs);
          const ext = path.extname(abs).toLowerCase().slice(1);
          if (['json', 'txt', 'md', 'srt', 'ass', 'csv'].includes(ext)) fichiers.push({ nom, type: 'texte', taille: st.size, texte: fs.readFileSync(abs, 'utf8') });
          else if (['png', 'jpg', 'jpeg', 'webp'].includes(ext)) fichiers.push(avecImages && st.size <= 6 * 1024 * 1024 ? { nom, type: 'image', taille: st.size, data_url: 'data:image/' + (ext === 'jpg' ? 'jpeg' : ext) + ';base64,' + fs.readFileSync(abs).toString('base64') } : { nom, type: 'image', taille: st.size, omise: avecImages ? 'trop lourde' : 'export sans images' });
          else fichiers.push({ nom, type: 'autre', taille: st.size, note: 'non inclus (audio/vidéo)' });
        } catch (e) { }
      };
      const parcourir = (d, pref) => { try { fs.readdirSync(d).sort().forEach(f => { const a = path.join(d, f); fs.statSync(a).isDirectory() ? parcourir(a, pref + f + '/') : ajouter(a, pref + f); }); } catch (e) { } };
      parcourir(path.join(OUT, 'run_' + pid), '');
      try { fs.readdirSync(OUT).filter(f => f.startsWith(pid + '_')).sort().forEach(f => ajouter(path.join(OUT, f), 'sorties/' + f)); } catch (e) { }
      const copie = Object.assign({}, P); delete copie.log;
      const out = { export: 'historique_production_video', version_labo: 'v6.80-service-en-ligne', id: pid, etat: P.state, etape: P.stage, erreur: P.error || null, cout_usd: P.cost || null, journal: P.log, production: copie, nombre_de_versions_archivees: P._nVersions || 0, avec_images: avecImages, fichiers };
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Disposition': 'attachment; filename="historique_video_' + pid + (avecImages ? '' : '_texte') + '.json"' });
      return res.end(JSON.stringify(out));
    }
    if (req.method === 'GET' && req.url.startsWith('/pipe/')) { const j = pipes[req.url.split('/')[2]]; return j ? send(200, j) : send(404, {}); }
    if (req.method === 'GET' && req.url.startsWith('/video/')) {
      const f = path.join(OUT, path.basename(req.url.split('?')[0])); if (!fs.existsSync(f)) return send(404, {}); // la version (?v=N) sert à casser le cache du navigateur : elle ne fait pas partie du nom de fichier
      // v6.39 — TELECHARGEMENT. Sans en-tetes de plage, un navigateur lit la video mais refuse de l'enregistrer ;
      // avec ?dl=1 on force la piece jointe, et on annonce la taille pour que la barre de progression existe.
      const st = fs.statSync(f), dl = /[?&]dl=1/.test(req.url);
      const ent = { 'Content-Type': f.endsWith('.png') ? 'image/png' : 'video/mp4', 'Content-Length': st.size, 'Accept-Ranges': 'bytes' };
      if (dl) ent['Content-Disposition'] = 'attachment; filename="' + path.basename(f) + '"';
      const rg = /^bytes=(\d*)-(\d*)$/.exec(String(req.headers.range || ''));
      if (rg && !dl) {   // le lecteur demande un morceau : on le sert, sinon il ne peut ni avancer ni reprendre
        const deb = rg[1] ? parseInt(rg[1], 10) : 0, fin2 = rg[2] ? parseInt(rg[2], 10) : st.size - 1;
        if (deb < st.size && fin2 >= deb) {
          res.writeHead(206, Object.assign({}, ent, { 'Content-Length': fin2 - deb + 1, 'Content-Range': 'bytes ' + deb + '-' + fin2 + '/' + st.size }));
          return fs.createReadStream(f, { start: deb, end: fin2 }).pipe(res);
        }
      }
      res.writeHead(200, ent); return fs.createReadStream(f).pipe(res);
    }
    send(404, { error: 'not found' });
  } catch (e) { send(500, { error: String(e.message || e) }); }
}).listen(PORT, () => console.log(`Video Lab : http://localhost:${PORT}  (projet ${PROJECT_ID}, ${LOCATION})`));
