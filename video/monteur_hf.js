'use strict';
// ─────────────────────────────────────────────────────────────────────────────
// MONTEUR HYPERFRAMES (v6.57) — couche de montage dynamique, GENERIQUE (aucun CT n'y est cite).
// Entree : la video deja assemblee (coupes, voix, musique) + un « plan de montage » (JSON).
// Sortie : la meme video re-montee par HyperFrames (HTML + GSAP rendus image par image dans Chrome) :
//   - punch-ins / pull-outs / derives de camera par plan, accent de coupe (pop, secousse, flash, dip)
//   - etalonnage en arc (froid -> chaud) suivant les roles emotionnels
//   - incrustations (photo produit, preuve, mot-cle) et bandeau offre/appel
//   - sous-titres animes mot par mot
// Aucun appel API payant ici. Toute erreur -> la fonction rend { ok:false } et l'appelant garde le montage ffmpeg.
// ─────────────────────────────────────────────────────────────────────────────
const fs = require('fs');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const r3 = x => Math.round(x * 1000) / 1000;

function trouverChrome() {
  if (process.env.HYPERFRAMES_BROWSER_PATH && fs.existsSync(process.env.HYPERFRAMES_BROWSER_PATH)) return process.env.HYPERFRAMES_BROWSER_PATH;
  const cand = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    (process.env.LOCALAPPDATA || '') + '\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'];
  return cand.find(p => p && fs.existsSync(p)) || null;
}

function trouverGsap(dossierServeur) {
  const c = [path.join(dossierServeur, 'node_modules', 'gsap', 'dist', 'gsap.min.js'), path.join(__dirname, 'node_modules', 'gsap', 'dist', 'gsap.min.js')];
  return c.find(p => fs.existsSync(p)) || null;
}
function trouverCli(dossierServeur) {
  const nom = process.platform === 'win32' ? 'hyperframes.cmd' : 'hyperframes';
  const c = [path.join(dossierServeur, 'node_modules', '.bin', nom), path.join(__dirname, 'node_modules', '.bin', nom)];
  return c.find(p => fs.existsSync(p)) || null;
}

// Disponibilite : l'appelant sait AVANT de payer quoi que ce soit si le monteur peut tourner.
function diagnostic(dossierServeur) {
  const manque = [];
  const major = parseInt(process.versions.node.split('.')[0], 10);
  if (major < 22) manque.push('Node 22 ou plus (ici ' + process.versions.node + ')');
  if (!trouverCli(dossierServeur)) manque.push('hyperframes (npm i hyperframes)');
  if (!trouverGsap(dossierServeur)) manque.push('gsap (npm i gsap)');
  if (!trouverChrome()) manque.push('Chrome ou Edge');
  try { const r = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' }); if (r.error || r.status !== 0) manque.push('ffmpeg'); } catch (_) { manque.push('ffmpeg'); }
  return { ok: manque.length === 0, manque };
}

// ── Construction de la composition ───────────────────────────────────────────
function construireHtml(S) {
  const W = S.w, H = S.h, D = r3(S.duree), fps = S.fps;
  const E = Math.max(1, Math.min(10, Number(S.energie) || 6));          // 1 = calme, 10 = nerveux
  // Reglages lus dans le CT (jamais devines) : null = le CT ne dit rien -> c'est l'energie de la boussole qui decide.
  const R = Object.assign({ grade: true, vignette: true, zoom: 1, secousse: null, flash: null, dip: null, pop: 1 }, S.reglages || {});
  const cuts = (S.coupes || []).filter(t => t > 0.2 && t < D - 0.2).sort((a, b) => a - b);
  const bornes = [0].concat(cuts, [D]);
  const accent = /^#[0-9a-f]{6}$/i.test(S.accent || '') ? S.accent : '#FFD600';
  const police = String(S.police || 'Arial Black').replace(/[^\w \-]/g, '');
  const maj = S.majuscules !== false;
  const tailleCap = Math.round(H * 0.052 * (S.tailleSt || 1));
  const margeCap = Math.round(H * (S.margeStPct != null ? S.margeStPct : 0.2));
  const caps = (S.sousTitres || []).filter(g => g && g.length);
  // Meme grammaire que l'etape ASS : phrase = blanche et fixe ; mots_cles = tout le groupe en accent, fixe ; groupes / mot_a_mot = le mot dit s'allume.
  const modeSt = S.stMode || 'groupes', fixe = modeSt === 'phrase' || modeSt === 'mots_cles', toutAccent = modeSt === 'mots_cles';
  const normMot = x => String(x).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
  const emo = S.stEmojis && typeof S.stEmojis === 'object' ? S.stEmojis : {};

  // intensite de mouvement selon l'energie de la boussole
  const zMax = (0.05 + E * 0.012) * R.zoom;   // 6 -> 0.12
  const pop = (0.03 + E * 0.007) * R.pop;     // accent de coupe
  const secousse = R.secousse != null ? !!R.secousse : E >= 6;
  const flashCada = R.flash === false ? 0 : (E >= 8 ? 2 : (E >= 6 ? 3 : 0));
  const dipOk = R.dip != null ? !!R.dip : E >= 4;

  // etalonnage : un niveau « froid » et un niveau « chaud » par plan, deduits des roles
  const FROID = new Set(['signe', 'probleme', 'consequence']);
  const CHAUD = new Set(['mecanisme', 'effet', 'resultat', 'social', 'preuve', 'offre', 'appel']);
  const roleA = t => { const r = (S.roles || []).find(x => t >= x.t0 - 0.001 && t < x.t1); return r ? r.role : null; };

  const L = [];            // lignes de script GSAP
  L.push('const tl = gsap.timeline({ paused: true });');
  L.push('const cam = document.getElementById("cam"), shake = document.getElementById("shake"), flash = document.getElementById("flash"), dip = document.getElementById("dip"), gF = document.getElementById("gradeF"), gC = document.getElementById("gradeC");');
  L.push('gsap.set(cam, { transformOrigin: "50% 50%" });');

  // 1) camera par plan
  const origines = ['50% 38%', '42% 45%', '58% 40%', '50% 55%', '46% 36%', '54% 48%'];
  bornes.slice(0, -1).forEach((t0, i) => {
    const t1 = bornes[i + 1], dur = r3(Math.max(0.3, t1 - t0));
    const type = (i + (S.graine || 0)) % 4;   // 0 push, 1 pull, 2 push-droite, 3 pull-gauche
    const s0 = (type === 1 || type === 3) ? 1 + zMax : 1.0;
    const s1 = (type === 1 || type === 3) ? 1.0 : 1 + zMax;
    const dx = type === 2 ? -14 : type === 3 ? 14 : 0;
    L.push('gsap.set(cam, { transformOrigin: "' + origines[i % origines.length] + '" }, ' + r3(t0) + ');');
    if (i > 0) {   // accent de coupe : le plan arrive un peu trop grand et se pose
      const pp = r3(Math.min(0.24, dur * 0.4));
      L.push('tl.fromTo(cam, { scale: ' + r3(s0 + pop) + ', x: ' + (dx * 2) + ' }, { scale: ' + r3(s0) + ', x: ' + dx + ', duration: ' + pp + ', ease: "power3.out" }, ' + r3(t0) + ');');
      L.push('tl.to(cam, { scale: ' + r3(s1) + ', x: 0, duration: ' + r3(Math.max(0.1, dur - pp)) + ', ease: "none" }, ' + r3(t0 + pp) + ');');
    } else {
      L.push('tl.fromTo(cam, { scale: ' + r3(s0) + ', x: ' + dx + ' }, { scale: ' + r3(s1) + ', x: 0, duration: ' + dur + ', ease: "none" }, 0);');
    }
    if (i > 0 && secousse) {   // secousse deterministe de 6 images
      const a = 3 + E * 0.9, sg = i % 2 ? 1 : -1, pas = 1 / fps;
      [[a * sg, -a * 0.6], [-a * 0.7 * sg, a * 0.5], [a * 0.4 * sg, -a * 0.3], [0, 0]].forEach((o, k) =>
        L.push('tl.to(shake, { x: ' + r3(o[0]) + ', y: ' + r3(o[1]) + ', rotation: ' + r3(o[0] * 0.05) + ', duration: ' + r3(pas) + ', ease: "none" }, ' + r3(t0 + k * pas) + ');'));
    }
    if (i > 0 && flashCada && i % flashCada === 0) {   // flash blanc tres bref sur une coupe sur N
      L.push('tl.fromTo(flash, { opacity: 0.0 }, { opacity: ' + r3(0.18 + E * 0.02) + ', duration: 0.04, ease: "none" }, ' + r3(t0) + ');');
      L.push('tl.to(flash, { opacity: 0, duration: 0.12, ease: "power2.out" }, ' + r3(t0 + 0.04) + ');');
    } else if (i > 0 && dipOk) {   // sinon : creux sombre de 3 images avant la coupe, pour que la coupe se lise voulue
      L.push('tl.fromTo(dip, { opacity: 0 }, { opacity: 0.38, duration: ' + r3(2 / fps) + ', ease: "none" }, ' + r3(Math.max(0, t0 - 3 / fps)) + ');');
      L.push('tl.set(dip, { opacity: 0 }, ' + r3(t0) + ');');
    }
    // etalonnage : on glisse vers le niveau du plan en 0.35 s
    const rl = roleA((t0 + t1) / 2);
    const froid = !R.grade ? 0 : rl && FROID.has(rl) ? 0.30 : (rl && CHAUD.has(rl) ? 0.0 : 0.12);
    const chaud = !R.grade ? 0 : rl && CHAUD.has(rl) ? 0.26 : (rl && FROID.has(rl) ? 0.0 : 0.10);
    L.push('tl.to(gF, { opacity: ' + froid + ', duration: 0.35, ease: "power2.inOut" }, ' + r3(t0) + ');');
    L.push('tl.to(gC, { opacity: ' + chaud + ', duration: 0.35, ease: "power2.inOut" }, ' + r3(t0) + ');');
  });

  // 2) incrustations
  let htmlInc = '';
  (S.incrustations || []).forEach((it, k) => {
    const a = r3(Math.max(0, it.t0)), b = r3(Math.min(D, it.t1)), id = 'inc' + k;
    if (b - a < 0.4) return;
    const pos = it.pos || 'bas-droite';
    const st = pos === 'haut-gauche' ? 'left:5%;top:9%' : pos === 'haut-droite' ? 'right:5%;top:9%' : pos === 'bas-gauche' ? 'left:5%;bottom:27%' : pos === 'centre' ? 'left:50%;top:44%;margin-left:-' + Math.round(W * 0.2) + 'px' : 'right:5%;bottom:27%';
    if (it.type === 'image' && it.src) {
      htmlInc += '<div id="' + id + '" class="inc" style="' + st + '"><img src="' + esc(it.src) + '" alt=""></div>\n';
      L.push('gsap.set("#' + id + '", { opacity: 0, scale: 0.6, rotation: -4 });');
      L.push('tl.to("#' + id + '", { opacity: 1, scale: 1, rotation: ' + (k % 2 ? 3 : -3) + ', duration: 0.38, ease: "back.out(1.5)" }, ' + a + ');');
      L.push('tl.to("#' + id + '", { opacity: 0, scale: 0.85, duration: 0.18, ease: "power2.in" }, ' + r3(b - 0.18) + ');');
    } else if (it.text) {
      htmlInc += '<div id="' + id + '" class="inc tag" style="' + st + '">' + esc(maj ? String(it.text).toUpperCase() : it.text) + '</div>\n';
      L.push('gsap.set("#' + id + '", { opacity: 0, y: 24 });');
      L.push('tl.to("#' + id + '", { opacity: 1, y: 0, duration: 0.3, ease: "expo.out" }, ' + a + ');');
      L.push('tl.to("#' + id + '", { opacity: 0, y: -10, duration: 0.15, ease: "power2.in" }, ' + r3(b - 0.15) + ');');
    }
    L.push('tl.set("#' + id + '", { opacity: 0 }, ' + b + ');');
  });

  // 2bis) CARTES DU CT (commentaire, pastille, prix, chiffre, offre, contradiction, titre, plan de coupe) : dessinees ici, en HTML, au lieu du texte plat de l'ancienne etape.
  const kindCarte = (t, img, txtC) => {
    const x = String(t || '').toLowerCase();
    if (img && /coupe|insert|illustration|plan_/.test(x)) return 'coupe';
    if (img) return 'photo';
    if (/titre/.test(x) && /[\n|—–]/.test(String(txtC || ''))) return 'identite';
    if (/natif|simple|brut/.test(x)) return 'natif';
    if (/jauge|gauge/.test(x)) return 'jauge';
    if (/sticker|emoji|clin/.test(x)) return 'sticker';
    if (/commentaire|comment/.test(x)) return 'commentaire';
    if (/titre|plainte|hook|accroche|l[eé]gende/.test(x)) return 'legende';
    if (/identit|cr[eé]dit|expert|auteur|lower|pr[eé]sentat|signature/.test(x)) return 'identite';
    if (/prix|etiquette|étiquette|pastille|valeur/.test(x)) return 'pastille';
    if (/contradiction/.test(x)) return 'contradiction';
    if (/offre|fin|reduction|réduction|code/.test(x)) return 'offre';
    if (/gros|chiffre|garantie|economie|économie|cout|coût/.test(x)) return 'gros';
    return 'carte';
  };
  const ENTETE = { fr: 'Réponse à un commentaire', en: 'Reply to a comment', es: 'Respuesta a un comentario', pt: 'Resposta a um comentário', ar: 'رد على تعليق' };
  const lg = String(S.langue || 'fr').slice(0, 2).toLowerCase();
  (S.cartes || []).forEach((c, k) => {
    const a = r3(Math.max(0, c.t0)), b = r3(Math.min(D, c.t1)), id = 'car' + k, kind = /^eclat_/i.test(String(c.type || '')) ? 'eclat' : (/manuscri|annotation/i.test(String(c.type || '')) && c.texte) ? 'manuscrit' : c.type === 'fin_plein_cadre' ? 'finpc' : (c.type === 'page_produit' && c.src) ? 'page' : /calendrier|calendar/i.test(String(c.type || '')) ? 'calendrier' : (/logo/i.test(String(c.type || '')) && c.logoSrc) ? 'logo' : ((c.lignes && c.lignes.length) || c.note != null) ? 'preuve' : kindCarte(c.type, c.src, c.texte), T = esc(c.texte || '');
    if (b - a < 0.4) return;
    const fin = r3(Math.max(a + 0.3, b - 0.18));
    if (kind === 'coupe') {
      htmlInc += '<div id="' + id + '" class="coupe"><img src="' + esc(c.src) + '" alt=""></div>\n';
      L.push('gsap.set("#' + id + '", { opacity: 0 });');
      L.push('tl.to("#' + id + '", { opacity: 1, duration: 0.16, ease: "power2.out" }, ' + a + ');');
      L.push('tl.fromTo("#' + id + ' img", { scale: 1 }, { scale: 1.14, duration: ' + r3(b - a) + ', ease: "none" }, ' + a + ');');
    } else if (kind === 'photo') {
      const gch = k % 2 === 0;   // incrustation a plat a cote de la personne, un cote puis l'autre (comme les photos posees sur la voix dans une prise unique)
      htmlInc += '<div id="' + id + '" class="pip" style="' + (gch ? 'left:0' : 'right:0') + '"><img src="' + esc(c.src) + '" alt=""></div>\n';
      L.push('gsap.set("#' + id + '", { opacity: 0, x: ' + (gch ? -50 : 50) + ' });');
      L.push('tl.to("#' + id + '", { opacity: 1, x: 0, duration: 0.3, ease: "expo.out" }, ' + a + ');');
    } else if (kind === 'commentaire') {
      htmlInc += '<div id="' + id + '" class="ccom"><div class="ch"><span class="av"><i></i></span><span class="cl">' + esc(c.entete || ENTETE[lg] || ENTETE.fr) + '</span></div><div class="ct2">' + T + '</div></div>\n';
      L.push('gsap.set("#' + id + '", { opacity: 0, y: -26, scale: 0.94 });');
      L.push('tl.to("#' + id + '", { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "expo.out" }, ' + a + ');');
    } else if (kind === 'finpc') {
      const hx = String(accent).replace('#', ''), lum = (parseInt(hx.slice(0, 2), 16) * 0.299 + parseInt(hx.slice(2, 4), 16) * 0.587 + parseInt(hx.slice(4, 6), 16) * 0.114) / 255, tc = lum > 0.62 ? '#111' : '#fff';
      htmlInc += '<div id="' + id + '" class="fpc" style="color:' + tc + '">' + (c.logoSrc ? '<div class="fm"><img class="fl" src="' + esc(c.logoSrc) + '" alt=""></div>' : (c.marque ? '<div class="fm">' + esc(c.marque) + '</div>' : '')) + (c.titre ? '<div class="ft">' + esc(c.titre) + '</div>' : '') + (c.sous ? '<div class="fs">' + esc(c.sous) + '</div>' : '')
        + (c.src ? '<div class="fp"><img src="' + esc(c.src) + '" alt=""></div>' : '') + (c.bouton ? '<div class="fb" style="color:' + accent + '">' + esc(c.bouton) + '</div>' : '') + '</div>\n';
      L.push('gsap.set("#' + id + '", { opacity: 0 }); gsap.set("#' + id + ' > *", { opacity: 0, y: 24 });');
      L.push('tl.to("#' + id + '", { opacity: 1, duration: 0.3, ease: "power2.out" }, ' + a + ');');
      L.push('tl.to("#' + id + ' > *", { opacity: 1, y: 0, duration: 0.4, stagger: 0.18, ease: "power3.out" }, ' + r3(a + 0.15) + ');');
    } else if (kind === 'page') {   // v6.70 : la VRAIE page produit du client, animee (entree en perspective, leger zoom, surlignage de la ligne garantie)
      const hl = c.hl && Number(c.hl.w) > 0 && Number(c.hl.h) > 0 ? c.hl : null, pc = v => (Math.max(0, Math.min(1, Number(v))) * 100).toFixed(2);
      htmlInc += '<div id="' + id + '" class="pgw" style="background:' + esc(c.fond || '#f7f4ee') + '"><div id="' + id + 'i" class="pgi"><img src="' + esc(c.src) + '" alt="">' + (hl ? '<div id="' + id + 'h" class="pghl" style="left:' + pc(hl.x) + '%;top:' + pc(hl.y) + '%;width:' + pc(hl.w) + '%;height:' + pc(hl.h) + '%"></div>' : '') + '</div></div>\n';
      L.push('gsap.set("#' + id + '", { opacity: 0 });');
      L.push('tl.to("#' + id + '", { opacity: 1, duration: 0.14, ease: "power2.out" }, ' + a + ');');
      L.push('tl.fromTo("#' + id + 'i", { rotationX: 16, rotationZ: -2.5, scale: 0.9, y: 50, transformPerspective: 1100 }, { rotationX: 0, rotationZ: 0, scale: 1, y: 0, duration: 0.55, ease: "power3.out" }, ' + a + ');');
      L.push('tl.to("#' + id + 'i", { scale: 1.07, duration: ' + r3(Math.max(0.2, b - a - 0.55)) + ', ease: "none" }, ' + r3(a + 0.55) + ');');
      if (hl) { L.push('gsap.set("#' + id + 'h", { opacity: 0, scaleX: 0.15, transformOrigin: "0% 50%" });'); L.push('tl.to("#' + id + 'h", { opacity: 1, scaleX: 1, duration: 0.35, ease: "power2.out" }, ' + r3(Math.min(b - 0.4, a + 0.75)) + ');'); }
    } else if (kind === 'calendrier') {   // v6.70 : le temps qui passe, dessine par le code (croix qui se posent une a une)
      const NX = 31, NC = 35;
      htmlInc += '<div id="' + id + '" class="calw"><div class="calp">' + Array.from({ length: NC }, (_, i) => '<span class="cx">' + (i < NX ? '\u2715' : '') + '</span>').join('') + '</div>' + (c.texte ? '<div class="calt">' + esc(c.texte) + '</div>' : '') + '</div>\n';
      L.push('gsap.set("#' + id + '", { opacity: 0 }); gsap.set("#' + id + ' .cx", { opacity: 0, scale: 1.9 });');
      L.push('tl.to("#' + id + '", { opacity: 1, duration: 0.18, ease: "power2.out" }, ' + a + ');');
      L.push('tl.to("#' + id + ' .cx", { opacity: 1, scale: 1, duration: 0.1, ease: "back.out(2)", stagger: ' + r3(Math.max(0.01, (b - a - 0.5) / NX)) + ' }, ' + r3(a + 0.2) + ');');
    } else if (kind === 'manuscrit') {   // v6.74 : annotation ecrite a la main avec une fleche courbe qui se dessine (« nothing artificial », « focus and energy gummies »)
      htmlInc += '<div id="' + id + '" class="man"><div class="mant">' + T + '</div><svg class="mans" viewBox="0 0 120 70"><path id="' + id + 'p" d="M8 6 C 40 2, 78 14, 96 52" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><path id="' + id + 'q" d="M84 46 L 97 56 L 99 39" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>\n';
      L.push('gsap.set("#' + id + '", { opacity: 0, rotation: -3 });');
      L.push('tl.to("#' + id + '", { opacity: 1, duration: 0.14, ease: "power2.out" }, ' + a + ');');
      L.push('{ const p1 = document.getElementById("' + id + 'p"), p2 = document.getElementById("' + id + 'q"), l1 = p1.getTotalLength(), l2 = p2.getTotalLength(); gsap.set(p1, { strokeDasharray: l1, strokeDashoffset: l1 }); gsap.set(p2, { strokeDasharray: l2, strokeDashoffset: l2 }); tl.to(p1, { strokeDashoffset: 0, duration: 0.3, ease: "power1.inOut" }, ' + r3(a + 0.12) + '); tl.to(p2, { strokeDashoffset: 0, duration: 0.12, ease: "none" }, ' + r3(a + 0.4) + '); }');
      L.push('tl.to("#' + id + '", { opacity: 0, duration: 0.12 }, ' + fin + ');');
    } else if (kind === 'eclat') {   // v6.72 : transition lumineuse posee SUR la coupe (eclat_dore : le produit arrive comme une lumiere ; eclat_blanc : le temps saute)
      const dore = /dore/i.test(c.type), dur = r3(Math.min(0.5, Math.max(0.3, b - a)));
      htmlInc += '<div id="' + id + '" class="ecl" style="background:' + (dore ? 'radial-gradient(circle at 50% 56%,rgba(255,226,150,.98) 0%,rgba(255,176,64,.62) 38%,rgba(255,140,40,0) 78%)' : '#fff') + '"></div>\n';
      L.push('gsap.set("#' + id + '", { opacity: 0 });');
      L.push('tl.to("#' + id + '", { opacity: ' + (dore ? 1 : 0.92) + ', duration: ' + r3(dur * 0.35) + ', ease: "power2.out" }, ' + a + ');');
      L.push('tl.to("#' + id + '", { opacity: 0, duration: ' + r3(dur * 0.65) + ', ease: "power2.in" }, ' + r3(a + dur * 0.35) + ');');
    } else if (kind === 'logo') {   // v6.70 : logo du client, fixe pendant toute la video (seulement si le CT le decrit et que le logo est disponible)
      htmlInc += '<div id="' + id + '" class="lgo"><img src="' + esc(c.logoSrc) + '" alt=""></div>\n';
      L.push('gsap.set("#' + id + '", { opacity: 0 }); tl.to("#' + id + '", { opacity: 0.95, duration: 0.4, ease: "power2.out" }, ' + a + ');');
    } else if (kind === 'preuve') {
      const AVIS = { fr: 'avis', en: 'reviews', es: 'reseñas', pt: 'avaliações', ar: 'تقييم' };
      const nt = c.note != null ? Number(c.note) : null, ns = nt != null ? Math.max(0, Math.min(5, Math.round(nt))) : 0;
      htmlInc += '<div id="' + id + 'b" class="cprb"></div><div id="' + id + '" class="cpr">' + (c.titre ? '<div class="cpt">' + esc(c.titre) + '</div>' : '')
        + (nt != null ? '<div class="cps"><span class="st">' + '★'.repeat(ns) + '<u>' + '★'.repeat(5 - ns) + '</u></span><span class="sn">' + String(nt).replace('.', ',') + (c.nb != null ? ' · ' + Number(c.nb).toLocaleString('fr-FR') + ' ' + (AVIS[lg] || AVIS.fr) : '') + '</span></div>' : '')
        + (c.lignes || []).map((x, xi) => '<div id="' + id + 'l' + xi + '" class="cpl"><i>✓</i><span>' + esc(x) + '</span></div>').join('') + '</div>\n';
      L.push('gsap.set("#' + id + 'b", { opacity: 0 }); gsap.set("#' + id + '", { opacity: 0, y: 60, scale: 0.96 });');
      L.push('tl.to("#' + id + 'b", { opacity: 1, duration: 0.2 }, ' + a + ');');
      L.push('tl.to("#' + id + '", { opacity: 1, y: 0, scale: 1, duration: 0.38, ease: "expo.out" }, ' + a + ');');
      (c.lignes || []).forEach((x, xi) => { L.push('gsap.set("#' + id + 'l' + xi + '", { opacity: 0, x: -24 }); tl.to("#' + id + 'l' + xi + '", { opacity: 1, x: 0, duration: 0.28, ease: "power3.out" }, ' + r3(a + 0.45 + xi * 0.4) + ');'); });
      L.push('tl.to("#' + id + 'b", { opacity: 0, duration: 0.18 }, ' + fin + ');');
      L.push('tl.set("#' + id + 'b", { opacity: 0, visibility: "hidden" }, ' + b + ');');
    } else if (kind === 'natif') {
      htmlInc += '<div id="' + id + '" class="nat">' + T + '</div>\n';
      L.push('gsap.set("#' + id + '", { opacity: 0, y: 8 });');
      L.push('tl.to("#' + id + '", { opacity: 1, y: 0, duration: 0.16, ease: "power2.out" }, ' + a + ');');
    } else if (kind === 'legende') {
      htmlInc += '<div id="' + id + '" class="clg">' + T + '</div>\n';
      L.push('gsap.set("#' + id + '", { opacity: 0, scale: 0.9 });');
      L.push('tl.to("#' + id + '", { opacity: 1, scale: 1, duration: 0.22, ease: "back.out(1.6)" }, ' + a + ');');
    } else if (kind === 'sticker') {
      htmlInc += '<div id="' + id + '" class="stk">' + T + '</div>\n';
      L.push('gsap.set("#' + id + '", { opacity: 0, scale: 0.2, rotation: -18 });');
      L.push('tl.to("#' + id + '", { opacity: 1, scale: 1, rotation: 8, duration: 0.4, ease: "back.out(2.4)" }, ' + a + ');');
    } else if (kind === 'jauge') {
      htmlInc += '<div id="' + id + '" class="jau"><svg viewBox="0 0 200 110" width="100%"><path d="M20 100 A80 80 0 0 1 73 25" fill="none" stroke="#2fbf5b" stroke-width="18"/><path d="M73 25 A80 80 0 0 1 127 25" fill="none" stroke="#f5c400" stroke-width="18"/><path d="M127 25 A80 80 0 0 1 180 100" fill="none" stroke="#e5352b" stroke-width="18"/><g id="' + id + 'n" style="transform-origin:100px 100px"><line x1="100" y1="100" x2="100" y2="34" stroke="#111" stroke-width="6" stroke-linecap="round"/><circle cx="100" cy="100" r="9" fill="#111"/></g></svg><div class="jl">' + T + '</div></div>\n';
      L.push('gsap.set("#' + id + '", { opacity: 0, y: 30 }); gsap.set("#' + id + 'n", { rotation: 62 });');
      L.push('tl.to("#' + id + '", { opacity: 1, y: 0, duration: 0.3, ease: "expo.out" }, ' + a + ');');
      L.push('tl.to("#' + id + 'n", { rotation: -58, duration: ' + r3(Math.max(0.8, (b - a) * 0.7)) + ', ease: "power2.inOut" }, ' + r3(a + 0.5) + ');');
    } else if (kind === 'identite') {
      const pp = String(c.texte || '').split(/\s*(?:\n|\||—|–)\s*/).filter(Boolean);
      htmlInc += '<div id="' + id + '" class="cid"><b>' + esc(pp[0] || '') + '</b>' + (pp[1] ? '<i>' + esc(pp.slice(1).join(' ')) + '</i>' : '') + '</div>\n';
      L.push('gsap.set("#' + id + '", { opacity: 0, x: -40 });');
      L.push('tl.to("#' + id + '", { opacity: 1, x: 0, duration: 0.3, ease: "expo.out" }, ' + a + ');');
    } else if (kind === 'pastille') {
      htmlInc += '<div id="' + id + '" class="past">' + T + '</div>\n';
      L.push('gsap.set("#' + id + '", { opacity: 0, scale: 0.4, rotation: -10 });');
      L.push('tl.to("#' + id + '", { opacity: 1, scale: 1, rotation: ' + (k % 2 ? 5 : -5) + ', duration: 0.34, ease: "back.out(2)" }, ' + a + ');');
    } else if (kind === 'gros') {
      // v6.77 : « LEGENDE | 59 % » ou « LEGENDE \n 6,00 $ » : la legende en petites capitales au-dessus, le chiffre en tres gros qui DEFILE jusqu'a sa valeur (CT010 : 59 %, cout par jour)
      const pg = String(c.texte || '').split(/\s*(?:\n|\|)\s*/).filter(Boolean), iN = pg.findIndex(x => /\d/.test(x)), mN = iN >= 0 && pg.length === 2 ? /^([^\d]*)(\d+(?:[.,]\d+)?)(.*)$/.exec(pg[iN]) : null;
      if (mN) {
        const cap = pg[1 - iN], dec = (mN[2].split(/[.,]/)[1] || '').length, val = parseFloat(mN[2].replace(',', '.')), sep = /,/.test(mN[2]) ? ',' : '.';
        htmlInc += '<div id="' + id + '" class="gros gnb"><div class="gcap">' + esc(cap) + '</div><div class="gnum">' + esc(mN[1]) + '<span id="' + id + 'n">' + (0).toFixed(dec).replace('.', sep) + '</span>' + esc(mN[3]) + '</div></div>\n';
        L.push('gsap.set("#' + id + '", { opacity: 0, scale: 1.25 });');
        L.push('tl.to("#' + id + '", { opacity: 1, scale: 1, duration: 0.26, ease: "power3.out" }, ' + a + ');');
        L.push('{ const o' + k + ' = { v: 0 }, e' + k + ' = document.getElementById("' + id + 'n"); tl.to(o' + k + ', { v: ' + val + ', duration: ' + r3(Math.min(0.9, Math.max(0.4, (b - a) * 0.5))) + ', ease: "power2.out", onUpdate: () => { e' + k + '.textContent = o' + k + '.v.toFixed(' + dec + ').replace(".", "' + sep + '"); } }, ' + r3(a + 0.08) + '); }');
      } else {
        htmlInc += '<div id="' + id + '" class="gros">' + T + '</div>\n';
        L.push('gsap.set("#' + id + '", { opacity: 0, scale: 1.7 });');
        L.push('tl.to("#' + id + '", { opacity: 1, scale: 1, duration: 0.26, ease: "power3.out" }, ' + a + ');');
      }
    } else if (kind === 'offre') {
      htmlInc += '<div id="' + id + '" class="coff">' + T + '</div>\n';
      L.push('gsap.set("#' + id + '", { opacity: 0, y: 70 });');
      L.push('tl.to("#' + id + '", { opacity: 1, y: 0, duration: 0.42, ease: "expo.out" }, ' + a + ');');
    } else if (kind === 'contradiction') {
      htmlInc += '<div id="' + id + '" class="ccon">' + T + '</div>\n';
      L.push('gsap.set("#' + id + '", { opacity: 0, y: 30 });');
      L.push('tl.to("#' + id + '", { opacity: 1, y: 0, duration: 0.3, ease: "expo.out" }, ' + a + ');');
    } else {
      htmlInc += '<div id="' + id + '" class="ccar">' + T + '</div>\n';
      L.push('gsap.set("#' + id + '", { opacity: 0, y: -20 });');
      L.push('tl.to("#' + id + '", { opacity: 1, y: 0, duration: 0.3, ease: "expo.out" }, ' + a + ');');
    }
    L.push('tl.to("#' + id + '", { opacity: 0, duration: 0.18, ease: "power2.in" }, ' + fin + ');');
    L.push('tl.set("#' + id + '", { opacity: 0, visibility: "hidden" }, ' + b + ');');
  });

  // 3) bandeau offre / appel
  let htmlCta = '';
  if (S.cta && (S.cta.titre || S.cta.sous)) {
    const a = r3(Math.max(0, Math.min(D - 1.2, S.cta.t0 != null ? S.cta.t0 : D - 2.6)));
    htmlCta = '<div id="cta"><div class="ct">' + esc(S.cta.titre || '') + '</div>' + (S.cta.sous ? '<div class="cs">' + esc(S.cta.sous) + '</div>' : '') + (S.cta.bouton ? '<div class="cb">' + esc(S.cta.bouton) + '</div>' : '') + '</div>\n';
    L.push('gsap.set("#cta", { opacity: 0, y: 60 });');
    L.push('tl.to("#cta", { opacity: 1, y: 0, duration: 0.45, ease: "expo.out" }, ' + a + ');');
    if (S.cta.bouton) L.push('tl.fromTo("#cta .cb", { scale: 1 }, { scale: 1.07, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 1 }, ' + r3(a + 0.9) + ');');
  }

  // 4) sous-titres animes
  let htmlCap = '';
  caps.forEach((g, gi) => {
    const ws = g.map(w => ({ t: maj ? String(w.t).toUpperCase() : String(w.t), s: Number(w.s), e: Number(w.e), f: w.f })).filter(w => isFinite(w.s) && isFinite(w.e));
    if (!ws.length) return;
    const nxt = caps[gi + 1] && caps[gi + 1][0] ? Number(caps[gi + 1][0].s) : D;
    const a = r3(Math.max(0.05, ws[0].s - 0.04));
    let fin = Math.min(D, Math.max(ws[ws.length - 1].e + 0.12, a + 0.3));
    if (fin > nxt - 0.03) fin = Math.max(a + 0.14, nxt - 0.03);   // jamais deux groupes a l'ecran en meme temps
    fin = r3(Math.min(D, fin));
    let iGros = -1;   // CT qui ecrit les mots importants beaucoup plus gros : le mot le plus long (>= 6 lettres) de chaque groupe
    if (S.stEmphase && ws.some(w => w.f !== undefined)) ws.forEach((w, wi) => { if (w.f === true && iGros < 0) iGros = wi; });   // v6.68 : l'accent de la voix, lu par le serveur, prime sur la longueur du mot
    else if (S.stEmphase) ws.forEach((w, wi) => { const L6 = String(w.t).replace(/[^\p{L}]/gu, '').length; if (L6 >= 6 && (iGros < 0 || L6 > String(ws[iGros].t).replace(/[^\p{L}]/gu, '').length)) iGros = wi; });
    htmlCap += '<div id="g' + gi + '" class="grp">' + ws.map((w, wi) => '<span id="g' + gi + 'w' + wi + '" class="w"' + ((toutAccent || wi === iGros) ? ' style="' + (toutAccent ? 'color:' + accent + ';' : '') + (wi === iGros ? 'font-size:1.7em;line-height:1;' : '') + '"' : '') + '>' + esc(w.t) + (emo[normMot(w.t)] ? ' ' + esc(emo[normMot(w.t)]) : '') + '</span>').join(' ') + '</div>\n';
    L.push('gsap.set("#g' + gi + '", { opacity: 0 });');
    L.push('tl.fromTo("#g' + gi + '", { opacity: 0, y: 18, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.12, ease: "power3.out" }, ' + a + ');');
    if (!fixe) ws.forEach((w, wi) => {
      const sel = '#g' + gi + 'w' + wi;
      const wEnd = r3(Math.max(w.e, w.s + 0.12));
      L.push('tl.fromTo("' + sel + '", { color: "#FFFFFF", scale: 1 }, { color: "' + accent + '", scale: 1.14, duration: 0.09, ease: "back.out(2)" }, ' + r3(Math.max(a, w.s)) + ');');
      L.push('tl.to("' + sel + '", { color: "#FFFFFF", scale: 1, duration: 0.1, ease: "power2.out" }, ' + wEnd + ');');
    });
    L.push('tl.to("#g' + gi + '", { opacity: 0, duration: 0.1, ease: "power2.in" }, ' + r3(Math.max(a + 0.1, fin - 0.1)) + ');');
    L.push('tl.set("#g' + gi + '", { opacity: 0, visibility: "hidden" }, ' + fin + ');');
  });

  L.push('window.__timelines = window.__timelines || {};');
  L.push('window.__timelines["main"] = tl;');

  return '<!doctype html>\n<html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=' + W + ', height=' + H + '">\n'
    + '<script src="gsap.min.js"></script>\n<style>\n'
    + '*{margin:0;padding:0;box-sizing:border-box}html,body{width:' + W + 'px;height:' + H + 'px;overflow:hidden;background:#000}\n'
    + '#root{position:absolute;inset:0;overflow:hidden;background:#000}\n'
    + '#shake,#cam{position:absolute;inset:0}\n#cam video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}\n'
    + '.ov{position:absolute;inset:0;pointer-events:none}\n'
    + '#gradeF{background:linear-gradient(180deg,rgba(30,70,120,1),rgba(20,40,70,1));mix-blend-mode:soft-light;opacity:0}\n'
    + '#gradeC{background:linear-gradient(180deg,rgba(255,170,60,1),rgba(255,110,40,1));mix-blend-mode:soft-light;opacity:0}\n'
    + '#vig{background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(0,0,0,' + (R.vignette ? (0.28 + E * 0.02) : 0).toFixed(2) + ') 100%)}\n'
    + '#flash{background:#fff;opacity:0}#dip{background:#000;opacity:0}\n'
    + '.inc{position:absolute;width:' + Math.round(W * 0.34) + 'px;border-radius:18px;overflow:hidden;box-shadow:0 14px 40px rgba(0,0,0,.5);background:#fff}.inc img{display:block;width:100%;height:auto}\n'
    + '.inc.tag{width:auto;max-width:' + Math.round(W * 0.8) + 'px;padding:14px 26px;border-radius:14px;background:' + accent + ';color:#111;font:900 ' + Math.round(H * 0.026) + 'px "' + police + '",Impact,sans-serif;letter-spacing:.5px}\n'
    + '.grp{position:absolute;left:0;right:0;bottom:' + margeCap + 'px;text-align:center;' + (S.stFond === 'boite' ? 'background:rgba(0,0,0,.62);border-radius:14px;width:fit-content;max-width:90%;margin:0 auto;' : '') + 'padding:' + (S.stFond === 'boite' ? '10px ' : '0 ') + Math.round(W * 0.06) + 'px;font:900 ' + tailleCap + 'px/1.12 "' + police + '",Impact,sans-serif;color:#fff;text-shadow:0 0 0 #000,-3px -3px 0 #000,3px -3px 0 #000,-3px 3px 0 #000,3px 3px 0 #000,0 6px 14px rgba(0,0,0,.55);overflow:visible}\n'
    + '.w{display:inline-block;margin:0 .1em;will-change:transform}\n'
    + '.coupe{position:absolute;inset:0;overflow:hidden;background:#000}.coupe img{width:100%;height:100%;object-fit:cover;display:block}\n'
    + '.ccom{position:absolute;left:5%;top:6.5%;width:66%;background:#fff;color:#111;border-radius:20px;padding:14px 18px;box-shadow:0 10px 30px rgba(0,0,0,.35);font-family:Arial,Helvetica,sans-serif}\n'
    + '.ccom .ch{display:flex;align-items:center;gap:10px;color:#6b6b6b;font-size:' + Math.round(H * 0.0155) + 'px;margin-bottom:8px}.ccom .av{width:' + Math.round(H * 0.034) + 'px;height:' + Math.round(H * 0.034) + 'px;border-radius:50%;background:linear-gradient(135deg,#9aa4b2,#5d6673);display:inline-block;position:relative;overflow:hidden}.ccom .av i{position:absolute;left:30%;top:18%;width:40%;height:40%;border-radius:50%;background:#e6e9ee}.ccom .av:after{content:"";position:absolute;left:14%;top:62%;width:72%;height:60%;border-radius:50%;background:#e6e9ee}\n'
    + '.ccom .ct2{font-size:' + Math.round(H * 0.0215) + 'px;line-height:1.22;font-weight:700}\n'
    + '.cprb{position:absolute;inset:0;background:rgba(0,0,0,.58)}.cpr{position:absolute;left:7%;right:7%;top:50%;transform:translateY(-50%);margin-top:0;background:#fff;color:#111;border-radius:22px;padding:26px 28px;box-shadow:0 18px 50px rgba(0,0,0,.5);font-family:Arial,Helvetica,sans-serif}\n'
    + '.cpt{font-weight:900;font-size:' + Math.round(H * 0.03) + 'px;line-height:1.1;margin-bottom:12px;padding-bottom:12px;border-bottom:4px solid ' + accent + '}\n'
    + '.cps{display:flex;align-items:center;gap:12px;margin-bottom:12px}.cps .st{color:#F5B301;font-size:' + Math.round(H * 0.034) + 'px;letter-spacing:2px}.cps .st u{text-decoration:none;color:#d8d8d8}.cps .sn{font-weight:800;font-size:' + Math.round(H * 0.02) + 'px;color:#444}\n'
    + '.cpl{display:flex;gap:12px;align-items:flex-start;margin-top:10px;font-weight:700;font-size:' + Math.round(H * 0.0215) + 'px;line-height:1.22}.cpl i{font-style:normal;flex:none;width:' + Math.round(H * 0.03) + 'px;height:' + Math.round(H * 0.03) + 'px;border-radius:50%;background:' + accent + ';color:#111;text-align:center;line-height:' + Math.round(H * 0.03) + 'px;font-size:' + Math.round(H * 0.018) + 'px;font-weight:900}\n'
    + '.nat{position:absolute;left:6%;top:47%;max-width:72%;color:#fff;font:700 ' + Math.round(H * 0.03) + 'px/1.2 Arial,Helvetica,"Segoe UI Emoji","Noto Color Emoji",sans-serif;text-shadow:0 2px 6px rgba(0,0,0,.65),0 0 2px rgba(0,0,0,.5)}\n'
    + '.pip{position:absolute;top:35%;width:46%;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.45);background:#000}.pip img{display:block;width:100%;height:auto}\n'
    + '.clg{position:absolute;left:8%;right:8%;top:42%;text-align:center;background:#fff;color:#111;padding:12px 18px;border-radius:6px;font:800 ' + Math.round(H * 0.027) + 'px/1.2 Arial,Helvetica,"Segoe UI Emoji","Noto Color Emoji",sans-serif;box-shadow:0 6px 20px rgba(0,0,0,.3)}\n'
    + '.stk{position:absolute;right:9%;top:46%;font-size:' + Math.round(H * 0.15) + 'px;line-height:1;font-family:"Segoe UI Emoji","Noto Color Emoji",sans-serif}\n'
    + '.jau{position:absolute;left:4%;top:33%;width:46%;background:#fff;color:#111;border-radius:14px;padding:14px 16px 12px;box-shadow:0 10px 30px rgba(0,0,0,.45);text-align:center}.jau .jl{margin-top:4px;font:900 ' + Math.round(H * 0.026) + 'px Arial,Helvetica,sans-serif;text-transform:uppercase;letter-spacing:.04em}\n'
    + '.pgw{position:absolute;inset:0;overflow:hidden;display:flex;align-items:center;justify-content:center}.pgi{position:relative;width:100%}.pgi img{display:block;width:100%}.pghl{position:absolute;border-radius:12px;background:rgba(126,217,87,.34);box-shadow:inset 0 0 0 3px rgba(96,190,60,.95)}\n'
    + '.ecl{position:absolute;inset:0;opacity:0;pointer-events:none}.man{position:absolute;left:9%;top:34%;width:46%;color:#fff;text-shadow:0 2px 8px rgba(0,0,0,.55)}.mant{font-family:"Segoe Script","Ink Free","Bradley Hand","Snell Roundhand","Brush Script MT","Comic Sans MS",cursive;font-size:' + Math.round(H * 0.031) + 'px;line-height:1.15}.mans{width:46%;margin-top:6px;margin-left:22%;overflow:visible;filter:drop-shadow(0 2px 6px rgba(0,0,0,.5))}\n'
    + '.calw{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(160deg,#f3e6cf,#e8d3ae)}.calp{width:78%;display:grid;grid-template-columns:repeat(7,1fr);gap:' + Math.round(H * 0.012) + 'px;background:#fffdf7;padding:' + Math.round(H * 0.025) + 'px;border-radius:18px;box-shadow:0 18px 50px rgba(80,50,10,.28)}.cx{display:flex;align-items:center;justify-content:center;aspect-ratio:1;font:900 ' + Math.round(H * 0.03) + 'px Arial,sans-serif;color:' + accent + ';border:2px solid #e6dcc6;border-radius:8px}.calt{margin-top:' + Math.round(H * 0.03) + 'px;font:800 ' + Math.round(H * 0.032) + 'px "' + police + '",Arial,sans-serif;color:#5a4320}\n'
    + '.lgo{position:absolute;left:5%;top:3.2%;width:20%}.lgo img{display:block;width:100%;filter:drop-shadow(0 2px 6px rgba(0,0,0,.35))}.fl{display:block;max-width:46%;max-height:' + Math.round(H * 0.1) + 'px;object-fit:contain;margin:0 auto}\n'
    + '.fpc{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:' + Math.round(H * 0.022) + 'px;padding:0 9%;text-align:center;background:radial-gradient(ellipse at 50% 35%,' + accent + ' 0%,' + accent + ' 55%,rgba(0,0,0,.35) 140%),' + accent + ';font-family:Arial,Helvetica,sans-serif}\n'
    + '.fpc .fm{font-weight:900;letter-spacing:.3em;font-size:' + Math.round(H * 0.022) + 'px;text-transform:uppercase}.fpc .ft{font-weight:900;font-size:' + Math.round(H * 0.044) + 'px;line-height:1.08;text-transform:uppercase}.fpc .fs{font-weight:700;font-size:' + Math.round(H * 0.0185) + 'px;opacity:.92}\n'
    + '.fpc .fp{width:64%;background:#fff;border-radius:18px;padding:14px;box-shadow:0 14px 40px rgba(0,0,0,.35)}.fpc .fp img{display:block;width:100%;height:' + Math.round(H * 0.25) + 'px;object-fit:contain}.fpc .fb{background:#fff;font-weight:900;font-size:' + Math.round(H * 0.021) + 'px;padding:14px 26px;border-radius:10px}\n'
    + '.cid{position:absolute;left:4%;bottom:21%;display:flex;flex-direction:column;align-items:flex-start;gap:4px;font-family:Arial,Helvetica,sans-serif;text-transform:uppercase}.cid b,.cid i{background:#fff;color:#111;font-style:normal;font-weight:900;padding:5px 12px;letter-spacing:.02em;box-shadow:0 4px 14px rgba(0,0,0,.25)}.cid b{font-size:' + Math.round(H * 0.022) + 'px}.cid i{font-size:' + Math.round(H * 0.0125) + 'px;font-weight:800}\n'
    + '.past{position:absolute;right:6%;top:30%;padding:12px 26px;border-radius:999px;background:' + accent + ';color:#111;font:900 ' + Math.round(H * 0.034) + 'px "' + police + '",Impact,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.4)}\n'
    + '.gros{position:absolute;left:0;right:0;top:27%;text-align:center;padding:0 6%;color:#fff;font:900 ' + Math.round(H * 0.075) + 'px/1.05 "' + police + '",Impact,sans-serif;text-shadow:-4px -4px 0 #000,4px -4px 0 #000,-4px 4px 0 #000,4px 4px 0 #000,0 8px 20px rgba(0,0,0,.6)}\n'
    + '.gnb{top:44%}.gcap{font:800 ' + Math.round(H * 0.026) + 'px/1.1 "' + police + '",Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase;margin-bottom:8px;text-shadow:0 2px 10px rgba(0,0,0,.7)}.gnum{font-size:' + Math.round(H * 0.095) + 'px;font-variant-numeric:tabular-nums}\n'
    + '.coff{position:absolute;left:6%;right:6%;bottom:12%;padding:18px 24px;border-radius:18px;background:' + accent + ';color:#111;text-align:center;font:900 ' + Math.round(H * 0.032) + 'px/1.12 "' + police + '",Impact,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.45)}\n'
    + '.ccon{position:absolute;left:6%;right:6%;bottom:22%;padding:16px 22px;border-radius:14px;background:rgba(0,0,0,.78);color:#fff;text-align:center;font:800 ' + Math.round(H * 0.028) + 'px/1.15 "' + police + '",Impact,sans-serif}\n'
    + '.ccar{position:absolute;left:5%;top:7%;max-width:62%;padding:12px 18px;border-radius:14px;background:rgba(10,10,10,.8);color:#fff;font:800 ' + Math.round(H * 0.026) + 'px/1.15 "' + police + '",Impact,sans-serif;border:2px solid ' + accent + '}\n'
    + '#cta{position:absolute;left:6%;right:6%;top:7%;padding:22px 26px;border-radius:22px;background:rgba(10,10,10,.82);text-align:center;color:#fff;box-shadow:0 14px 40px rgba(0,0,0,.5);border:3px solid ' + accent + ';font-family:"' + police + '",Impact,sans-serif}\n'
    + '#cta .ct{font-size:' + Math.round(H * 0.036) + 'px;line-height:1.1;font-weight:900}#cta .cs{margin-top:10px;font-size:' + Math.round(H * 0.024) + 'px;opacity:.92;font-weight:700}\n'
    + '#cta .cb{display:inline-block;margin-top:16px;padding:12px 30px;border-radius:999px;background:' + accent + ';color:#111;font-size:' + Math.round(H * 0.03) + 'px;font-weight:900}\n'
    + '</style></head><body>\n'
    + '<div id="root" data-composition-id="main" data-start="0" data-duration="' + D + '" data-width="' + W + '" data-height="' + H + '" data-fps="' + fps + '">\n'
    + '<div id="shake"><div id="cam"><video id="v" class="clip" src="base.mp4" data-start="0" data-duration="' + D + '" data-track-index="0" data-has-audio="true" playsinline></video></div></div>\n'
    + '<div id="gradeF" class="ov"></div><div id="gradeC" class="ov"></div><div id="vig" class="ov"></div>\n'
    + htmlInc + htmlCta + htmlCap
    + '<div id="dip" class="ov"></div><div id="flash" class="ov"></div>\n'
    + '</div>\n<script>\n' + L.join('\n') + '\n</script></body></html>\n';
}

// ── Rendu ────────────────────────────────────────────────────────────────────
function lancer(cmd, args, opts, delaiMs) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, Object.assign({ windowsHide: true, shell: process.platform === 'win32' }, opts));
    let out = ''; const maxi = 20000;
    const add = d => { out += d; if (out.length > maxi) out = out.slice(-maxi); };
    p.stdout.on('data', add); p.stderr.on('data', add);
    const to = setTimeout(() => { try { p.kill('SIGKILL'); } catch (_) {} reject(new Error('delai depasse (' + Math.round(delaiMs / 1000) + ' s)')); }, delaiMs);
    p.on('error', e => { clearTimeout(to); reject(e); });
    p.on('close', c => { clearTimeout(to); c === 0 ? resolve(out) : reject(new Error('code ' + c + ' : ' + out.replace(/\x1b\[[0-9;]*m/g, '').slice(-600))); });
  });
}

async function monter(S, o) {
  // S : plan de montage ; o : { video, sortie, dossierTravail, dossierServeur, log, delaiMs }
  const log = o.log || (() => {});
  const diag = diagnostic(o.dossierServeur);
  if (!diag.ok) return { ok: false, raison: 'prerequis manquants : ' + diag.manque.join(', ') };
  const t0 = Date.now();
  try {
    const dir = o.dossierTravail;
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    fs.copyFileSync(o.video, path.join(dir, 'base.mp4'));
    fs.copyFileSync(trouverGsap(o.dossierServeur), path.join(dir, 'gsap.min.js'));
    (S.incrustations || []).forEach(it => { if (it.type === 'image' && it.fichier && fs.existsSync(it.fichier)) { const nom = 'inc_' + path.basename(it.fichier).replace(/[^\w.\-]/g, '_'); fs.copyFileSync(it.fichier, path.join(dir, nom)); it.src = nom; } });
    (S.cartes || []).forEach(c => { if (c.fichier && fs.existsSync(c.fichier)) { const nom = 'car_' + path.basename(c.fichier).replace(/[^\w.\-]/g, '_'); fs.copyFileSync(c.fichier, path.join(dir, nom)); c.src = nom; } if (c.logoFichier && fs.existsSync(c.logoFichier)) { const nl = 'logo_' + path.basename(c.logoFichier).replace(/[^\w.\-]/g, '_'); fs.copyFileSync(c.logoFichier, path.join(dir, nl)); c.logoSrc = nl; } });
    S.incrustations = (S.incrustations || []).filter(it => it.type !== 'image' || it.src);
    fs.writeFileSync(path.join(dir, 'index.html'), construireHtml(S), 'utf8');
    fs.writeFileSync(path.join(dir, 'hyperframes.json'), JSON.stringify({ $schema: 'https://hyperframes.heygen.com/schema/hyperframes.json', registry: 'https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry' }), 'utf8');
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ name: 'monteur', private: true }), 'utf8');
    const sortie = path.resolve(o.sortie);
    const env = Object.assign({}, process.env, { HYPERFRAMES_BROWSER_PATH: trouverChrome(), HYPERFRAMES_NO_TELEMETRY: '1', DO_NOT_TRACK: '1' });
    const cli = trouverCli(o.dossierServeur);
    const args = ['render', '.', '-o', sortie, '--fps', String(S.fps), '--quality', 'looks', '--quiet', '--workers', String(o.workers || 2)];
    await lancer(cli, args, { cwd: dir, env }, o.delaiMs || 900000);
    if (!fs.existsSync(sortie) || fs.statSync(sortie).size < 20000) throw new Error('fichier de sortie absent ou vide');
    // controle : duree et piste audio conservees
    const pr = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=codec_type', '-of', 'json', sortie], { encoding: 'utf8' });
    const j = JSON.parse(pr.stdout || '{}');
    const dur = Number((j.format || {}).duration) || 0;
    const aAudio = (j.streams || []).some(s => s.codec_type === 'audio');
    if (Math.abs(dur - S.duree) > 0.6) throw new Error('duree rendue ' + dur.toFixed(2) + ' s au lieu de ' + S.duree.toFixed(2) + ' s');
    if (!aAudio) throw new Error('la piste audio a disparu au rendu');
    return { ok: true, secondes: Math.round((Date.now() - t0) / 1000), duree: dur };
  } catch (e) {
    return { ok: false, raison: String(e.message || e).slice(0, 500), secondes: Math.round((Date.now() - t0) / 1000) };
  }
}

module.exports = { monter, construireHtml, diagnostic, trouverChrome };
