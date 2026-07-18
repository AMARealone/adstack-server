// AdStack Image Server — Zero dependencies, just Node.js built-ins
const http = require('http');
const https = require('https');
const { Resvg } = require('@resvg/resvg-js');
const PDFDocument = require('pdfkit');
const webpush = require('web-push');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const PORT = 3001;
const PROJECT_ID = 'adstack-497020';
const LOCATION = 'us-central1';
const MODEL = 'gemini-3-pro-image';
const ANTHROPIC_KEY = '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';

// ── Clés Sources Analyste de Marché ──
const YOUTUBE_API_KEY = 'AIzaSyAhujEfLY6V4-IJkuy0BoHlldwEV0zyXFg';
// GOOGLE_CSE_KEY / GOOGLE_CSE_CX retirés — Custom Search JSON API fermée aux nouveaux projets (voir Source 5/5)

const PAYS_TO_GEO = {
  'Sénégal':'SN', "Côte d'Ivoire":'CI', 'Cameroun':'CM', 'Bénin':'BJ',
  'Guinée':'GN', 'Mali':'ML', 'Burkina Faso':'BF', 'Togo':'TG', 'RD Congo':'CD'
};

const PAYS_TO_JUMIA_TLD = {
  'Sénégal':'sn', "Côte d'Ivoire":'ci', 'Cameroun':'cm'
  // Bénin/Guinée/Mali/Burkina Faso/Togo/RD Congo : pas de Jumia → source ignorée
};

// Domaines suggérés à Gemini grounding pour la recherche ciblée (V4 — 6 sources enrichies)
// Note : Gemini Search grounding est l'unique outil de recherche web (Custom Search est fermé).
// Pour atteindre la profondeur d'un vrai scraping multi-source, on demande EXPLICITEMENT
// à Gemini d'aller chercher dans ces sites lors de la Source 1.
const TARGET_DOMAINS_HINT = [
  // E-commerce avis riches en verbatims authentiques
  'aliexpress.com (reviews avec photos sur la catégorie du produit — verbatims clients authentiques)',
  'amazon.fr / amazon.com (reviews sur produits équivalents — analyses détaillées 1★ et 5★)',
  // Avis structurés
  'trustpilot.com (avis vérifiés sur la marque ET ses 3 principaux concurrents)',
  'google.com/maps (Google Reviews locales sur magasins/marques du pays cible)',
  // Conversations communautaires
  'reddit.com (sous-reddits pertinents : posts upvotés et commentaires riches)',
  'twitter.com / x.com (hashtags + mentions de la marque et catégorie produit)',
  // E-commerce local
  'jumia.com.gh, jumia.com.ng, jumia.ma (autres marchés Jumia pour comparaison prix)',
  // Forums santé/bien-être francophones
  'doctissimo.fr, aufeminin.com, futura-sciences.com (forums santé en français)',
  // Social
  'facebook.com (groupes locaux du pays cible si visibles)'
].join('\n   • ');

// ── Mindmap hosting ──
const PUBLIC_URL = process.env.PUBLIC_URL || 'https://adstackofficial.com';
const MINDMAPS_DIR = path.join(__dirname, 'mindmaps');
if (!fs.existsSync(MINDMAPS_DIR)) fs.mkdirSync(MINDMAPS_DIR, { recursive: true });

function slugify(s) {
  return String(s || 'mindmap')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'mindmap';
}

function randomId(len = 8) {
  return crypto.randomBytes(12).toString('base64')
    .replace(/[^a-z0-9]/gi, '')
    .toLowerCase()
    .slice(0, len);
}

// ── Gemini 2.5 Pro : génération du prompt creative pour le mode DÉMO ──
// (Le mode PRODUCTION utilise Gemini 2.5 Pro également, voir endpoint /creative-prod — Sonnet 4.6 n'est pas connecté actuellement)
async function callGeminiForCreativePrompt(token, systemPrompt, ctBase64, ctMime, productBase64, productMime, synthesis) {

  // Filtre la synthèse : ne garde que les sections utilisées par la compétence (S0, S1, S2, S5, S7).
  // Vague 5 : suppression du plafond de 20 lignes/section qui amputait le contenu même des sections gardées.
  function trimSynthesis(text) {
    if (!text || text.length < 800) return text;
    const keep = ['S0', 'S1', 'S2', 'S5', 'S7'];
    const lines = text.split('\n');
    let result = [];
    let capturing = false;
    for (const line of lines) {
      const sMatch = line.match(/^S(\d)\s*[—–-]/);
      if (sMatch) {
        const currentSection = 'S' + sMatch[1];
        capturing = keep.includes(currentSection);
      }
      if (capturing) {
        result.push(line);
      }
    }
    const trimmed = result.join('\n').trim();
    const ratio = Math.round((1 - trimmed.length / text.length) * 100);
    if (trimmed.length > 400) {
      console.log(`   [Creative Démo] Synthèse filtrée (S0/S1/S2/S5/S7) : ${text.length} → ${trimmed.length} chars (−${ratio}%)`);
      return trimmed;
    }
    return text;
  }

  const trimmedSynthesis = trimSynthesis(synthesis);

  // Vague 5 : vocabulaire "le CT" / "le PRODUIT FOURNI" — plus de IMAGE 1/IMAGE 2 (cause de confusion identifiée).
  // Les règles (hiérarchie produit, palette hard-lock, etc.) vivent désormais uniquement dans la compétence (systemPrompt) — plus de duplication ici.
  const userText = [
    'Les deux images ci-jointes, dans cet ordre : le CT (inspiration à décoder — structure et intention uniquement) puis le PRODUIT FOURNI (produit réel du client — vérité absolue du packaging).',
    '',
    'SYNTHÈSE MARCHÉ :',
    trimmedSynthesis
  ].join('\n');

  // Fixed header prepended to Gemini prompt
  const FIXED_HEADER = `⚠️ IMAGE FOURNIE — PRODUIT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Analyse l'image produit fournie frame par frame.
Reproduis avec une fidélité absolue : dimensions, proportions,
couleurs exactes, tons, textures, étiquette, reflets.
Rien n'est ajouté. Rien n'est modifié. Ce que tu vois = ce que tu génères.

`;

  const vertexBody = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [{
      role: 'user',
      parts: [
        { inlineData: { mimeType: ctMime || 'image/jpeg', data: ctBase64 } },
        { inlineData: { mimeType: productMime || 'image/jpeg', data: productBase64 } },
        { text: userText }
      ]
    }],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 10000,
      thinkingConfig: { thinkingBudget: 24576 }
    }
  };

  const data = await vertexRequest(token, 'gemini-2.5-pro', vertexBody);
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));

  const cand = data.candidates?.[0];
  let text = cand?.content?.parts?.[0]?.text || '';
  if (!text) throw new Error('Pas de texte dans la réponse Gemini 2.5 Pro.');

  // Log diagnostic (même format que Vague 1 côté PROD) — visibilité sur le raisonnement réel de Gemini, absente jusqu'ici côté démo.
  const finishReason = cand?.finishReason || 'inconnu';
  const usage = data.usageMetadata || {};
  console.log(`   [Creative Démo] finishReason=${finishReason} · tokens prompt=${usage.promptTokenCount ?? '?'} thinking=${usage.thoughtsTokenCount ?? 0} output=${usage.candidatesTokenCount ?? '?'} total=${usage.totalTokenCount ?? '?'}`);
  if (finishReason === 'MAX_TOKENS') {
    console.log(`   ⚠️  [Creative Démo] Réponse tronquée par maxOutputTokens (10000) — le prompt final est probablement incomplet`);
  }

  // Extrait à partir de FORMAT: — retire toute analyse écrite avant (garde-fou de sécurité)
  const formatIdx = text.indexOf('FORMAT :');
  if (formatIdx > 0) {
    text = text.slice(formatIdx);
    console.log(`   [Creative Démo] Extraction depuis FORMAT: (retiré ${formatIdx} chars d'analyse résiduelle)`);
  }

  return FIXED_HEADER + text;
}

const SA = (() => {
  const raw = process.env.GOOGLE_CREDENTIALS;
  if (!raw) return { client_email: '', private_key: '' };
  try {
    const creds = JSON.parse(raw);
    if (creds.private_key) creds.private_key = creds.private_key.replace(/\\n/g, '\n');
    return creds;
  } catch(e) {
    console.error('[SA] Erreur GOOGLE_CREDENTIALS:', e.message);
    return { client_email: '', private_key: '' };
  }
})();


// ── JWT Generation ─────────────────────────────
function b64url(str) {
  return Buffer.from(str).toString('base64').replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
}

function makeJWT() {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = b64url(JSON.stringify({
    iss: SA.client_email, sub: SA.client_email,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now, exp: now + 3600,
    scope: 'https://www.googleapis.com/auth/cloud-platform'
  }));
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(`${header}.${payload}`);
  const sig = sign.sign(SA.private_key).toString('base64').replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
  return `${header}.${payload}.${sig}`;
}

// ── Get Access Token ───────────────────────────
function getToken() {
  return new Promise((resolve, reject) => {
    const jwt = makeJWT();
    const body = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`;
    const req = https.request({
      hostname: 'oauth2.googleapis.com', path: '/token', method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(body) }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { const j = JSON.parse(d); j.access_token ? resolve(j.access_token) : reject(new Error(j.error_description || d)); }
        catch(e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body); req.end();
  });
}

// ── Vertex AI Global Request (gemini-3-pro-image) ──
function vertexRequestGlobal(token, model, body, timeoutMs = 120000, typeAppel = 'generation_image') {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify(body);
    const path = `/v1/projects/${PROJECT_ID}/locations/global/publishers/google/models/${model}:generateContent`;
    const req = https.request({
      hostname: 'aiplatform.googleapis.com', path, method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyStr)
      },
      timeout: timeoutMs
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(d);
          const usage = parsed?.usageMetadata || {};
          logCoutApi('demo', typeAppel, usage);
          resolve(parsed);
        } catch(e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error(`Timeout Vertex AI Image (${timeoutMs/1000}s)`)); });
    req.write(bodyStr); req.end();
  });
}

// Réessaie une fois automatiquement en cas d'échec (timeout, erreur réseau, etc.) avant d'abandonner —
// la génération d'image Vertex a des ralentissements ponctuels, un simple réessai suffit la plupart du temps.
async function vertexRequestGlobalAvecReessai(token, model, body, timeoutMs = 120000, typeAppel = 'generation_image') {
  try {
    return await vertexRequestGlobal(token, model, body, timeoutMs, typeAppel);
  } catch(e) {
    console.log(`⚠️  Échec 1ère tentative (${e.message}) — nouvel essai...`);
    return await vertexRequestGlobal(token, model, body, timeoutMs, typeAppel);
  }
}

// ── Vertex AI Request ──────────────────────────
// ── Suivi des coûts API (Phase 2 AdStats) ──────────────────────────
// Tarifs Gemini 2.5/3 Pro sur Vertex AI (contexte ≤200K) : $1.25/M tokens entrée, $10/M sortie texte.
// Les tokens de sortie IMAGE sont facturés à part, bien plus cher : $120/M (confirmé, pas une supposition).
const GEMINI_PRIX_IN        = 1.25 / 1_000_000;
const GEMINI_PRIX_OUT       = 10.00 / 1_000_000;
const GEMINI_PRIX_IMAGE_OUT = 120.0 / 1_000_000;

function logCoutApi(source, typeAppel, usage) {
  // Jamais bloquant — une erreur ici ne doit jamais casser la génération en cours.
  // Gemini détaille les tokens de sortie par modalité (candidatesTokensDetails) et compte
  // séparément les tokens de "réflexion" (thoughtsTokenCount) — les deux sont réels et
  // facturés, mais absents du simple candidatesTokenCount si on ne creuse pas la réponse.
  try {
    const tokensIn = usage?.promptTokenCount || 0;
    const details = usage?.candidatesTokensDetails || [];
    const tokensImage = details.filter(d => d.modality === 'IMAGE').reduce((s,d) => s + (d.tokenCount||0), 0);
    const tokensTexteDetail = details.filter(d => d.modality !== 'IMAGE').reduce((s,d) => s + (d.tokenCount||0), 0);
    // Si l'API ne détaille pas par modalité (réponse texte simple, cas le plus courant),
    // se rabattre sur le total brut candidatesTokenCount.
    const tokensTexte = details.length ? tokensTexteDetail : (usage?.candidatesTokenCount || 0);
    const tokensReflexion = usage?.thoughtsTokenCount || 0;

    const cout = tokensIn * GEMINI_PRIX_IN
               + tokensImage * GEMINI_PRIX_IMAGE_OUT
               + tokensTexte * GEMINI_PRIX_OUT
               + tokensReflexion * GEMINI_PRIX_OUT;
    const tokensOutTotal = tokensImage + tokensTexte + tokensReflexion;

    fetch(`${SUPABASE_URL_INT}/rest/v1/api_usage_log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        source, type_appel: typeAppel,
        tokens_in: tokensIn, tokens_out: tokensOutTotal,
        cout_usd: Math.round(cout * 1e6) / 1e6,
      })
    }).catch(() => {});
  } catch(e) {}
}

function vertexRequest(token, model, body, timeoutMs = 90000, typeAppel = 'texte_gemini') {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify(body);
    const path = `/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${model}:generateContent`;
    const req = https.request({
      hostname: `${LOCATION}-aiplatform.googleapis.com`, path, method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyStr)
      },
      timeout: timeoutMs
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(d);
          const usage = parsed?.usageMetadata || {};
          logCoutApi('demo', typeAppel, usage);
          resolve(parsed);
        } catch(e) { reject(new Error('Réponse Vertex invalide: ' + d.slice(0,200))); }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error(`Timeout Vertex AI (${timeoutMs/1000}s)`)); });
    req.write(bodyStr); req.end();
  });
}

// ── HTML (inline fallback) ─────────────────────
const HTML_B64 = 'PCFET0NUWVBFIGh0bWw+CjxodG1sIGxhbmc9ImZyIj4KPGhlYWQ+CjxtZXRhIGNoYXJzZXQ9IlVURi04Ij4KPG1ldGEgbmFtZT0idmlld3BvcnQiIGNvbnRlbnQ9IndpZHRoPWRldmljZS13aWR0aCwgaW5pdGlhbC1zY2FsZT0xLjAiPgo8dGl0bGU+QWRTdGFjayDigJQgSW1hZ2UgR2VuZXJhdG9yPC90aXRsZT4KPGxpbmsgaHJlZj0iaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3MyP2ZhbWlseT1TeW5lOndnaHRANDAwOzUwMDs2MDA7NzAwOzgwMCZmYW1pbHk9RE0rTW9ubzp3Z2h0QDQwMDs1MDAmZGlzcGxheT1zd2FwIiByZWw9InN0eWxlc2hlZXQiPgo8c3R5bGU+CiAgOnJvb3QgewogICAgLS1iZzogIzBBMEEwQjsKICAgIC0tc3VyZmFjZTogIzExMTExMzsKICAgIC0tc3VyZmFjZTI6ICMxODE4MUM7CiAgICAtLWJvcmRlcjogIzIyMjIyODsKICAgIC0tYm9yZGVyMjogIzJFMkUzODsKICAgIC0tYWNjZW50OiAjMUZCNkZGOwogICAgLS1hY2NlbnQyOiAjMzJGRjdFOwogICAgLS1hY2NlbnQzOiAjRkY2QjM1OwogICAgLS1hY2NlbnQ0OiAjQjQ0RkZGOwogICAgLS10ZXh0OiAjRjBGMEY1OwogICAgLS10ZXh0MjogIzg4ODhBMDsKICAgIC0tdGV4dDM6ICM0QTRBNjA7CiAgICAtLWNhcmQ6ICMxMzEzMUE7CiAgfQogICogeyBtYXJnaW46IDA7IHBhZGRpbmc6IDA7IGJveC1zaXppbmc6IGJvcmRlci1ib3g7IH0KICBib2R5IHsKICAgIGJhY2tncm91bmQ6IHZhcigtLWJnKTsKICAgIGNvbG9yOiB2YXIoLS10ZXh0KTsKICAgIGZvbnQtZmFtaWx5OiAnU3luZScsIHNhbnMtc2VyaWY7CiAgICBtaW4taGVpZ2h0OiAxMDB2aDsKICB9CiAgYm9keTo6YmVmb3JlIHsKICAgIGNvbnRlbnQ6ICcnOwogICAgcG9zaXRpb246IGZpeGVkOwogICAgaW5zZXQ6IDA7CiAgICBiYWNrZ3JvdW5kLWltYWdlOgogICAgICBsaW5lYXItZ3JhZGllbnQocmdiYSgxODAsNzksMjU1LDAuMDI1KSAxcHgsIHRyYW5zcGFyZW50IDFweCksCiAgICAgIGxpbmVhci1ncmFkaWVudCg5MGRlZywgcmdiYSgxODAsNzksMjU1LDAuMDI1KSAxcHgsIHRyYW5zcGFyZW50IDFweCk7CiAgICBiYWNrZ3JvdW5kLXNpemU6IDQwcHggNDBweDsKICAgIHBvaW50ZXItZXZlbnRzOiBub25lOwogICAgei1pbmRleDogMDsKICB9CiAgLndyYXAgeyBtYXgtd2lkdGg6IDk2MHB4OyBtYXJnaW46IDAgYXV0bzsgcGFkZGluZzogNDBweCAyNHB4IDgwcHg7IHBvc2l0aW9uOiByZWxhdGl2ZTsgei1pbmRleDogMTsgfQoKICAvKiBIRUFERVIgKi8KICBoZWFkZXIgeyBkaXNwbGF5OiBmbGV4OyBhbGlnbi1pdGVtczogY2VudGVyOyBnYXA6IDE2cHg7IG1hcmdpbi1ib3R0b206IDQ4cHg7IHBhZGRpbmctYm90dG9tOiAyNHB4OyBib3JkZXItYm90dG9tOiAxcHggc29saWQgdmFyKC0tYm9yZGVyKTsgfQogIC5sb2dvLW1hcmsgeyB3aWR0aDogNDBweDsgaGVpZ2h0OiA0MHB4OyBiYWNrZ3JvdW5kOiB2YXIoLS1hY2NlbnQ0KTsgYm9yZGVyLXJhZGl1czogMTBweDsgZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IGNlbnRlcjsganVzdGlmeS1jb250ZW50OiBjZW50ZXI7IGZvbnQtc2l6ZTogMThweDsgZm9udC13ZWlnaHQ6IDgwMDsgY29sb3I6ICNmZmY7IGZsZXgtc2hyaW5rOiAwOyB9CiAgLmhlYWRlci10ZXh0IGgxIHsgZm9udC1zaXplOiAyMHB4OyBmb250LXdlaWdodDogNzAwOyBsZXR0ZXItc3BhY2luZzogLTAuNXB4OyB9CiAgLmhlYWRlci10ZXh0IHAgeyBmb250LXNpemU6IDEycHg7IGNvbG9yOiB2YXIoLS10ZXh0Mik7IGZvbnQtZmFtaWx5OiAnRE0gTW9ubycsIG1vbm9zcGFjZTsgbWFyZ2luLXRvcDogMnB4OyB9CiAgLmJhZGdlIHsgbWFyZ2luLWxlZnQ6IGF1dG87IGJhY2tncm91bmQ6IHJnYmEoMTgwLDc5LDI1NSwwLjEpOyBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDE4MCw3OSwyNTUsMC4yNSk7IGNvbG9yOiB2YXIoLS1hY2NlbnQ0KTsgZm9udC1mYW1pbHk6ICdETSBNb25vJywgbW9ub3NwYWNlOyBmb250LXNpemU6IDExcHg7IHBhZGRpbmc6IDRweCAxMHB4OyBib3JkZXItcmFkaXVzOiAyMHB4OyB9CgoKCiAgLyogU0VDVElPTiBMQUJFTCAqLwogIC5zZWN0aW9uLWxhYmVsIHsgZm9udC1mYW1pbHk6ICdETSBNb25vJywgbW9ub3NwYWNlOyBmb250LXNpemU6IDExcHg7IGNvbG9yOiB2YXIoLS1hY2NlbnQ0KTsgbGV0dGVyLXNwYWNpbmc6IDJweDsgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTsgbWFyZ2luLWJvdHRvbTogMTJweDsgZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IGNlbnRlcjsgZ2FwOiA4cHg7IH0KICAuc2VjdGlvbi1sYWJlbDo6YWZ0ZXIgeyBjb250ZW50OiAnJzsgZmxleDogMTsgaGVpZ2h0OiAxcHg7IGJhY2tncm91bmQ6IHZhcigtLWJvcmRlcik7IH0KCiAgLyogVVBMT0FEIEdSSUQgKi8KICAudXBsb2FkLWdyaWQgeyBkaXNwbGF5OiBncmlkOyBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnI7IGdhcDogMTZweDsgbWFyZ2luLWJvdHRvbTogMTZweDsgfQogIC51cGxvYWQtY2FyZCB7IGJhY2tncm91bmQ6IHZhcigtLXN1cmZhY2UpOyBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1ib3JkZXIpOyBib3JkZXItcmFkaXVzOiAxNHB4OyBvdmVyZmxvdzogaGlkZGVuOyB0cmFuc2l0aW9uOiBib3JkZXItY29sb3IgMC4yczsgfQogIC51cGxvYWQtY2FyZDpob3ZlciB7IGJvcmRlci1jb2xvcjogdmFyKC0tYm9yZGVyMik7IH0KICAudXBsb2FkLWNhcmQtaGVhZGVyIHsgcGFkZGluZzogMTJweCAxNnB4OyBib3JkZXItYm90dG9tOiAxcHggc29saWQgdmFyKC0tYm9yZGVyKTsgZm9udC1mYW1pbHk6ICdETSBNb25vJywgbW9ub3NwYWNlOyBmb250LXNpemU6IDExcHg7IGNvbG9yOiB2YXIoLS10ZXh0Mik7IGRpc3BsYXk6IGZsZXg7IGFsaWduLWl0ZW1zOiBjZW50ZXI7IGdhcDogOHB4OyB9CiAgLmRvdCB7IHdpZHRoOiA2cHg7IGhlaWdodDogNnB4OyBib3JkZXItcmFkaXVzOiA1MCU7IGZsZXgtc2hyaW5rOiAwOyB9CiAgLmRvdC5ibHVlIHsgYmFja2dyb3VuZDogdmFyKC0tYWNjZW50KTsgfQogIC5kb3QucHVycGxlIHsgYmFja2dyb3VuZDogdmFyKC0tYWNjZW50NCk7IH0KICAuZG90LmdyZWVuIHsgYmFja2dyb3VuZDogdmFyKC0tYWNjZW50Mik7IH0KCiAgLyogVVBMT0FEIFpPTkUgKi8KICAudXBsb2FkLXpvbmUgeyBwb3NpdGlvbjogcmVsYXRpdmU7IG1pbi1oZWlnaHQ6IDE4MHB4OyBkaXNwbGF5OiBmbGV4OyBmbGV4LWRpcmVjdGlvbjogY29sdW1uOyBhbGlnbi1pdGVtczogY2VudGVyOyBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjsgY3Vyc29yOiBwb2ludGVyOyBwYWRkaW5nOiAyMHB4OyBnYXA6IDEwcHg7IHRyYW5zaXRpb246IGJhY2tncm91bmQgMC4yczsgfQogIC51cGxvYWQtem9uZTpob3ZlciB7IGJhY2tncm91bmQ6IHJnYmEoMTgwLDc5LDI1NSwwLjAzKTsgfQogIC51cGxvYWQtem9uZS5oYXMtaW1hZ2UgeyBwYWRkaW5nOiA4cHg7IH0KICAudXBsb2FkLWljb24geyB3aWR0aDogNDBweDsgaGVpZ2h0OiA0MHB4OyBib3JkZXI6IDEuNXB4IGRhc2hlZCB2YXIoLS1ib3JkZXIyKTsgYm9yZGVyLXJhZGl1czogMTBweDsgZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IGNlbnRlcjsganVzdGlmeS1jb250ZW50OiBjZW50ZXI7IGNvbG9yOiB2YXIoLS10ZXh0Myk7IGZvbnQtc2l6ZTogMThweDsgdHJhbnNpdGlvbjogYWxsIDAuMnM7IH0KICAudXBsb2FkLXpvbmU6aG92ZXIgLnVwbG9hZC1pY29uIHsgYm9yZGVyLWNvbG9yOiB2YXIoLS1hY2NlbnQ0KTsgY29sb3I6IHZhcigtLWFjY2VudDQpOyB9CiAgLnVwbG9hZC16b25lIHAgeyBmb250LXNpemU6IDEycHg7IGNvbG9yOiB2YXIoLS10ZXh0Mik7IHRleHQtYWxpZ246IGNlbnRlcjsgbGluZS1oZWlnaHQ6IDEuNTsgfQogIC51cGxvYWQtem9uZSBzcGFuIHsgZm9udC1zaXplOiAxMXB4OyBjb2xvcjogdmFyKC0tdGV4dDMpOyBmb250LWZhbWlseTogJ0RNIE1vbm8nLCBtb25vc3BhY2U7IH0KICAucHJldmlldy1pbWcgeyB3aWR0aDogMTAwJTsgaGVpZ2h0OiAxNjRweDsgb2JqZWN0LWZpdDogY29udGFpbjsgYm9yZGVyLXJhZGl1czogOHB4OyBkaXNwbGF5OiBub25lOyBiYWNrZ3JvdW5kOiB2YXIoLS1zdXJmYWNlMik7IH0KICAuY2xlYXItYnRuIHsgZGlzcGxheTogbm9uZTsgcG9zaXRpb246IGFic29sdXRlOyB0b3A6IDhweDsgcmlnaHQ6IDhweDsgd2lkdGg6IDI0cHg7IGhlaWdodDogMjRweDsgYm9yZGVyLXJhZGl1czogNTAlOyBiYWNrZ3JvdW5kOiByZ2JhKDEwLDEwLDExLDAuOCk7IGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWJvcmRlcjIpOyBjb2xvcjogdmFyKC0tdGV4dDIpOyBmb250LXNpemU6IDEycHg7IGN1cnNvcjogcG9pbnRlcjsgYWxpZ24taXRlbXM6IGNlbnRlcjsganVzdGlmeS1jb250ZW50OiBjZW50ZXI7IHotaW5kZXg6IDEwOyB0cmFuc2l0aW9uOiBhbGwgMC4xNXM7IGJhY2tkcm9wLWZpbHRlcjogYmx1cig0cHgpOyB9CiAgLmNsZWFyLWJ0bjpob3ZlciB7IGJhY2tncm91bmQ6IHJnYmEoMjU1LDEwNyw1MywwLjkpOyBib3JkZXItY29sb3I6IHZhcigtLWFjY2VudDMpOyBjb2xvcjogI2ZmZjsgfQogIGlucHV0W3R5cGU9ImZpbGUiXSB7IGRpc3BsYXk6IG5vbmU7IH0KCiAgLyogUFJPTVBUIENBUkQgKi8KICAucHJvbXB0LWNhcmQgeyBiYWNrZ3JvdW5kOiB2YXIoLS1zdXJmYWNlKTsgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tYm9yZGVyKTsgYm9yZGVyLXJhZGl1czogMTRweDsgb3ZlcmZsb3c6IGhpZGRlbjsgbWFyZ2luLWJvdHRvbTogMTZweDsgfQogIC5wcm9tcHQtY2FyZC1oZWFkZXIgeyBwYWRkaW5nOiAxMnB4IDE2cHg7IGJvcmRlci1ib3R0b206IDFweCBzb2xpZCB2YXIoLS1ib3JkZXIpOyBmb250LWZhbWlseTogJ0RNIE1vbm8nLCBtb25vc3BhY2U7IGZvbnQtc2l6ZTogMTFweDsgY29sb3I6IHZhcigtLXRleHQyKTsgZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IGNlbnRlcjsgZ2FwOiA4cHg7IGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjsgfQogIC5wYXN0ZS1oaW50IHsgZm9udC1zaXplOiAxMHB4OyBjb2xvcjogdmFyKC0tdGV4dDMpOyB9CiAgdGV4dGFyZWEucHJvbXB0LWlucHV0IHsgd2lkdGg6IDEwMCU7IG1pbi1oZWlnaHQ6IDIwMHB4OyBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDsgYm9yZGVyOiBub25lOyBvdXRsaW5lOiBub25lOyBwYWRkaW5nOiAxNnB4OyBjb2xvcjogdmFyKC0tdGV4dCk7IGZvbnQtZmFtaWx5OiAnRE0gTW9ubycsIG1vbm9zcGFjZTsgZm9udC1zaXplOiAxMnB4OyBsaW5lLWhlaWdodDogMS43OyByZXNpemU6IHZlcnRpY2FsOyB9CiAgdGV4dGFyZWEucHJvbXB0LWlucHV0OjpwbGFjZWhvbGRlciB7IGNvbG9yOiB2YXIoLS10ZXh0Myk7IH0KCiAgLyogR0VORVJBVEUgQlROICovCiAgLmdlbmVyYXRlLWJ0biB7IHdpZHRoOiAxMDAlOyBoZWlnaHQ6IDUycHg7IGJhY2tncm91bmQ6IHZhcigtLWFjY2VudDQpOyBib3JkZXI6IG5vbmU7IGJvcmRlci1yYWRpdXM6IDEycHg7IGNvbG9yOiAjZmZmOyBmb250LWZhbWlseTogJ1N5bmUnLCBzYW5zLXNlcmlmOyBmb250LXNpemU6IDE1cHg7IGZvbnQtd2VpZ2h0OiA3MDA7IGN1cnNvcjogcG9pbnRlcjsgZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IGNlbnRlcjsganVzdGlmeS1jb250ZW50OiBjZW50ZXI7IGdhcDogMTBweDsgdHJhbnNpdGlvbjogYWxsIDAuMnM7IG1hcmdpbi1ib3R0b206IDMycHg7IH0KICAuZ2VuZXJhdGUtYnRuOmhvdmVyOm5vdCg6ZGlzYWJsZWQpIHsgYmFja2dyb3VuZDogI2M1NzBmZjsgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0xcHgpOyB9CiAgLmdlbmVyYXRlLWJ0bjpkaXNhYmxlZCB7IGJhY2tncm91bmQ6IHZhcigtLXN1cmZhY2UyKTsgY29sb3I6IHZhcigtLXRleHQzKTsgY3Vyc29yOiBub3QtYWxsb3dlZDsgdHJhbnNmb3JtOiBub25lOyB9CiAgLmJ0bi1zcGlubmVyIHsgd2lkdGg6IDE4cHg7IGhlaWdodDogMThweDsgYm9yZGVyOiAycHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwwLjIpOyBib3JkZXItdG9wLWNvbG9yOiAjZmZmOyBib3JkZXItcmFkaXVzOiA1MCU7IGFuaW1hdGlvbjogc3BpbiAwLjdzIGxpbmVhciBpbmZpbml0ZTsgZGlzcGxheTogbm9uZTsgfQogIEBrZXlmcmFtZXMgc3BpbiB7IHRvIHsgdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTsgfSB9CgogIC8qIFNUQVRVUyAqLwogIC5zdGF0dXMtYmFyIHsgZGlzcGxheTogbm9uZTsgYWxpZ24taXRlbXM6IGNlbnRlcjsgZ2FwOiAxMHB4OyBwYWRkaW5nOiAxMnB4IDE2cHg7IGJhY2tncm91bmQ6IHJnYmEoMTgwLDc5LDI1NSwwLjA1KTsgYm9yZGVyOiAxcHggc29saWQgcmdiYSgxODAsNzksMjU1LDAuMik7IGJvcmRlci1yYWRpdXM6IDEwcHg7IG1hcmdpbi1ib3R0b206IDI0cHg7IGZvbnQtZmFtaWx5OiAnRE0gTW9ubycsIG1vbm9zcGFjZTsgZm9udC1zaXplOiAxMnB4OyBjb2xvcjogdmFyKC0tYWNjZW50NCk7IH0KICAuc3RhdHVzLWRvdCB7IHdpZHRoOiA4cHg7IGhlaWdodDogOHB4OyBib3JkZXItcmFkaXVzOiA1MCU7IGJhY2tncm91bmQ6IHZhcigtLWFjY2VudDQpOyBhbmltYXRpb246IHB1bHNlIDFzIGVhc2UgaW5maW5pdGU7IGZsZXgtc2hyaW5rOiAwOyB9CiAgQGtleWZyYW1lcyBwdWxzZSB7IDAlLDEwMCV7b3BhY2l0eToxO3RyYW5zZm9ybTpzY2FsZSgxKX0gNTAle29wYWNpdHk6LjU7dHJhbnNmb3JtOnNjYWxlKC44KX0gfQogIC5lcnJvci1iYXIgeyBkaXNwbGF5OiBub25lOyBhbGlnbi1pdGVtczogY2VudGVyOyBnYXA6IDEwcHg7IHBhZGRpbmc6IDEycHggMTZweDsgYmFja2dyb3VuZDogcmdiYSgyNTUsMTA3LDUzLDAuMDgpOyBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDI1NSwxMDcsNTMsMC4yKTsgYm9yZGVyLXJhZGl1czogMTBweDsgbWFyZ2luLWJvdHRvbTogMjRweDsgZm9udC1mYW1pbHk6ICdETSBNb25vJywgbW9ub3NwYWNlOyBmb250LXNpemU6IDEycHg7IGNvbG9yOiB2YXIoLS1hY2NlbnQzKTsgfQoKICAvKiBPVVRQVVQgKi8KICAjb3V0cHV0IHsgZGlzcGxheTogbm9uZTsgfQogIC5vdXRwdXQtY2FyZCB7IGJhY2tncm91bmQ6IHZhcigtLWNhcmQpOyBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1ib3JkZXIpOyBib3JkZXItcmFkaXVzOiAxNnB4OyBvdmVyZmxvdzogaGlkZGVuOyBhbmltYXRpb246IGZhZGVVcCAwLjRzIGVhc2UgZm9yd2FyZHM7IH0KICBAa2V5ZnJhbWVzIGZhZGVVcCB7IGZyb217b3BhY2l0eTowO3RyYW5zZm9ybTp0cmFuc2xhdGVZKDEycHgpfSB0b3tvcGFjaXR5OjE7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMCl9IH0KICAub3V0cHV0LWhlYWRlciB7IHBhZGRpbmc6IDE0cHggMThweDsgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHZhcigtLWJvcmRlcik7IGRpc3BsYXk6IGZsZXg7IGFsaWduLWl0ZW1zOiBjZW50ZXI7IGdhcDogMTJweDsgfQogIC5vdXRwdXQtYmFkZ2UgeyBmb250LWZhbWlseTogJ0RNIE1vbm8nLCBtb25vc3BhY2U7IGZvbnQtc2l6ZTogMTFweDsgY29sb3I6IHZhcigtLWFjY2VudDIpOyBiYWNrZ3JvdW5kOiByZ2JhKDUwLDI1NSwxMjYsMC4xKTsgYm9yZGVyOiAxcHggc29saWQgcmdiYSg1MCwyNTUsMTI2LDAuMik7IHBhZGRpbmc6IDNweCAxMHB4OyBib3JkZXItcmFkaXVzOiAyMHB4OyB9CiAgLm91dHB1dC1hY3Rpb25zIHsgbWFyZ2luLWxlZnQ6IGF1dG87IGRpc3BsYXk6IGZsZXg7IGdhcDogMTBweDsgfQogIC5hY3Rpb24tYnRuIHsgZGlzcGxheTogZmxleDsgYWxpZ24taXRlbXM6IGNlbnRlcjsgZ2FwOiA2cHg7IHBhZGRpbmc6IDdweCAxNHB4OyBib3JkZXItcmFkaXVzOiA4cHg7IGZvbnQtZmFtaWx5OiAnRE0gTW9ubycsIG1vbm9zcGFjZTsgZm9udC1zaXplOiAxMXB4OyBjdXJzb3I6IHBvaW50ZXI7IHRyYW5zaXRpb246IGFsbCAwLjJzOyBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1ib3JkZXIyKTsgYmFja2dyb3VuZDogdmFyKC0tc3VyZmFjZTIpOyBjb2xvcjogdmFyKC0tdGV4dDIpOyB9CiAgLmFjdGlvbi1idG46aG92ZXIgeyBiYWNrZ3JvdW5kOiByZ2JhKDE4MCw3OSwyNTUsMC4xKTsgYm9yZGVyLWNvbG9yOiByZ2JhKDE4MCw3OSwyNTUsMC4zKTsgY29sb3I6IHZhcigtLWFjY2VudDQpOyB9CiAgLmFjdGlvbi1idG4uZG93bmxvYWQgeyBiYWNrZ3JvdW5kOiByZ2JhKDUwLDI1NSwxMjYsMC4xKTsgYm9yZGVyLWNvbG9yOiByZ2JhKDUwLDI1NSwxMjYsMC4zKTsgY29sb3I6IHZhcigtLWFjY2VudDIpOyB9CiAgLmFjdGlvbi1idG4uZG93bmxvYWQ6aG92ZXIgeyBiYWNrZ3JvdW5kOiByZ2JhKDUwLDI1NSwxMjYsMC4yKTsgfQogIC5vdXRwdXQtaW1hZ2Utd3JhcCB7IHBhZGRpbmc6IDE2cHg7IGRpc3BsYXk6IGZsZXg7IGp1c3RpZnktY29udGVudDogY2VudGVyOyBiYWNrZ3JvdW5kOiB2YXIoLS1zdXJmYWNlMik7IH0KICAjZ2VuZXJhdGVkLWltYWdlIHsgbWF4LXdpZHRoOiAxMDAlOyBtYXgtaGVpZ2h0OiA3MHZoOyBib3JkZXItcmFkaXVzOiA4cHg7IGRpc3BsYXk6IGJsb2NrOyB9CiAgLm91dHB1dC1tZXRhIHsgcGFkZGluZzogMTJweCAxOHB4OyBmb250LWZhbWlseTogJ0RNIE1vbm8nLCBtb25vc3BhY2U7IGZvbnQtc2l6ZTogMTFweDsgY29sb3I6IHZhcigtLXRleHQzKTsgYm9yZGVyLXRvcDogMXB4IHNvbGlkIHZhcigtLWJvcmRlcik7IGRpc3BsYXk6IGZsZXg7IGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjsgfQoKICBAbWVkaWEgKG1heC13aWR0aDogNjQwcHgpIHsKICAgIC51cGxvYWQtZ3JpZCB7IGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyOyB9CiAgfQo8L3N0eWxlPgo8L2hlYWQ+Cjxib2R5Pgo8ZGl2IGNsYXNzPSJ3cmFwIj4KCiAgPGhlYWRlcj4KICAgIDxkaXYgY2xhc3M9ImxvZ28tbWFyayI+4pymPC9kaXY+CiAgICA8ZGl2IGNsYXNzPSJoZWFkZXItdGV4dCI+CiAgICAgIDxoMT5BZFN0YWNrIEltYWdlIEdlbmVyYXRvcjwvaDE+CiAgICAgIDxwPndpcmVmcmFtZSArIHByb2R1aXQgKyBwcm9tcHQg4oaSIGNyw6lhdGl2ZSBHZW1pbmk8L3A+CiAgICA8L2Rpdj4KICAgIDxkaXYgY2xhc3M9ImJhZGdlIj5nZW1pbmktMy1wcm8taW1hZ2UtcHJldmlldyDCtyBOYW5vIEJhbmFuYSBQcm88L2Rpdj4KICA8L2hlYWRlcj4KCgoKICA8IS0tIElOUFVUUyAtLT4KICA8ZGl2IGNsYXNzPSJzZWN0aW9uLWxhYmVsIj4wMSDigJQgSU1BR0VTIERFIFLDiUbDiVJFTkNFPC9kaXY+CiAgPGRpdiBjbGFzcz0idXBsb2FkLWdyaWQiPgoKICAgIDwhLS0gV2lyZWZyYW1lIC0tPgogICAgPGRpdiBjbGFzcz0idXBsb2FkLWNhcmQiIG9uY2xpY2s9InRyaWdnZXJVcGxvYWQoJ3dpcmVmcmFtZS1pbnB1dCcsIGV2ZW50KSI+CiAgICAgIDxkaXYgY2xhc3M9InVwbG9hZC1jYXJkLWhlYWRlciI+CiAgICAgICAgPGRpdiBjbGFzcz0iZG90IHB1cnBsZSI+PC9kaXY+CiAgICAgICAgV2lyZWZyYW1lIENUIChUZW1wbGF0ZSBzdHJ1Y3R1cmVsKQogICAgICA8L2Rpdj4KICAgICAgPGRpdiBjbGFzcz0idXBsb2FkLXpvbmUiIGlkPSJ6b25lLXdpcmVmcmFtZSI+CiAgICAgICAgPGJ1dHRvbiBjbGFzcz0iY2xlYXItYnRuIiBpZD0iY2xlYXItd2lyZWZyYW1lIj7inJU8L2J1dHRvbj4KICAgICAgICA8ZGl2IGNsYXNzPSJ1cGxvYWQtaWNvbiI+4oqePC9kaXY+CiAgICAgICAgPHA+SW1wb3J0ZSBsZSB3aXJlZnJhbWU8YnI+ZHUgQ1Qgc8OpbGVjdGlvbm7DqTwvcD4KICAgICAgICA8c3Bhbj5KUEcgwrcgUE5HIMK3IFdFQlA8L3NwYW4+CiAgICAgICAgPGltZyBjbGFzcz0icHJldmlldy1pbWciIGlkPSJwcmV2aWV3LXdpcmVmcmFtZSIgYWx0PSIiPgogICAgICA8L2Rpdj4KICAgICAgPGlucHV0IHR5cGU9ImZpbGUiIGlkPSJ3aXJlZnJhbWUtaW5wdXQiIGFjY2VwdD0iaW1hZ2UvKiI+CiAgICA8L2Rpdj4KCiAgICA8IS0tIFByb2R1aXQgLS0+CiAgICA8ZGl2IGNsYXNzPSJ1cGxvYWQtY2FyZCIgb25jbGljaz0idHJpZ2dlclVwbG9hZCgncHJvZHVjdC1pbnB1dCcsIGV2ZW50KSI+CiAgICAgIDxkaXYgY2xhc3M9InVwbG9hZC1jYXJkLWhlYWRlciI+CiAgICAgICAgPGRpdiBjbGFzcz0iZG90IGJsdWUiPjwvZGl2PgogICAgICAgIFBob3RvIHByb2R1aXQgKFLDqWbDqXJlbmNlIGZpZMOpbGl0w6kpCiAgICAgIDwvZGl2PgogICAgICA8ZGl2IGNsYXNzPSJ1cGxvYWQtem9uZSIgaWQ9InpvbmUtcHJvZHVjdCI+CiAgICAgICAgPGJ1dHRvbiBjbGFzcz0iY2xlYXItYnRuIiBpZD0iY2xlYXItcHJvZHVjdCI+4pyVPC9idXR0b24+CiAgICAgICAgPGRpdiBjbGFzcz0idXBsb2FkLWljb24iPis8L2Rpdj4KICAgICAgICA8cD5JbXBvcnRlIGxhIHBob3RvPGJyPmR1IHByb2R1aXQ8L3A+CiAgICAgICAgPHNwYW4+SlBHIMK3IFBORyDCtyBXRUJQPC9zcGFuPgogICAgICAgIDxpbWcgY2xhc3M9InByZXZpZXctaW1nIiBpZD0icHJldmlldy1wcm9kdWN0IiBhbHQ9IiI+CiAgICAgIDwvZGl2PgogICAgICA8aW5wdXQgdHlwZT0iZmlsZSIgaWQ9InByb2R1Y3QtaW5wdXQiIGFjY2VwdD0iaW1hZ2UvKiI+CiAgICA8L2Rpdj4KCiAgPC9kaXY+CgogIDwhLS0gUFJPTVBUIC0tPgogIDxkaXYgY2xhc3M9InNlY3Rpb24tbGFiZWwiPjAyIOKAlCBQUk9NUFQgR0VNSU5JPC9kaXY+CiAgPGRpdiBjbGFzcz0icHJvbXB0LWNhcmQiPgogICAgPGRpdiBjbGFzcz0icHJvbXB0LWNhcmQtaGVhZGVyIj4KICAgICAgPGRpdiBjbGFzcz0iZG90IGdyZWVuIj48L2Rpdj4KICAgICAgUHJvbXB0IGfDqW7DqXLDqSBwYXIgQWRTdGFjayBQcm9tcHQgRW5naW5lCiAgICAgIDxzcGFuIGNsYXNzPSJwYXN0ZS1oaW50Ij5Db2xsZSBsZSBwcm9tcHQgY29tcGxldCBpY2k8L3NwYW4+CiAgICA8L2Rpdj4KICAgIDx0ZXh0YXJlYSBjbGFzcz0icHJvbXB0LWlucHV0IiBpZD0icHJvbXB0LWlucHV0IiBwbGFjZWhvbGRlcj0iQ29sbGUgaWNpIGxlIHByb21wdCBjb21wbGV0IHNvcnRpIHBhciBsJ291dGlsIFByb21wdCBFbmdpbmUuLi4mIzEwOyYjMTA74pqg77iPIElNQUdFUyBGT1VSTklFUyYjMTA74pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSB4pSBJiMxMDtJTUFHRSAxIOKAlCBURU1QTEFURSBTVFJVQ1RVUkVMJiMxMDsuLi4iPjwvdGV4dGFyZWE+CiAgPC9kaXY+CgogIDwhLS0gR0VORVJBVEUgLS0+CiAgPGJ1dHRvbiBjbGFzcz0iZ2VuZXJhdGUtYnRuIiBpZD0iZ2VuLWJ0biIgb25jbGljaz0iZ2VuZXJhdGUoKSI+CiAgICA8ZGl2IGNsYXNzPSJidG4tc3Bpbm5lciIgaWQ9InNwaW5uZXIiPjwvZGl2PgogICAgPHNwYW4gaWQ9ImJ0bi1pY29uIj7inKY8L3NwYW4+CiAgICA8c3BhbiBpZD0iYnRuLXRleHQiPkfDqW7DqXJlciBsYSBjcsOpYXRpdmU8L3NwYW4+CiAgPC9idXR0b24+CgogIDxkaXYgY2xhc3M9InN0YXR1cy1iYXIiIGlkPSJzdGF0dXMtYmFyIj48ZGl2IGNsYXNzPSJzdGF0dXMtZG90Ij48L2Rpdj48c3BhbiBpZD0ic3RhdHVzLXRleHQiPkVudm9pIMOgIEdlbWluaS4uLjwvc3Bhbj48L2Rpdj4KICA8ZGl2IGNsYXNzPSJlcnJvci1iYXIiIGlkPSJlcnJvci1iYXIiPuKaoCA8c3BhbiBpZD0iZXJyb3ItdGV4dCI+PC9zcGFuPjwvZGl2PgoKICA8IS0tIE9VVFBVVCAtLT4KICA8ZGl2IGlkPSJvdXRwdXQiPgogICAgPGRpdiBjbGFzcz0ic2VjdGlvbi1sYWJlbCI+MDMg4oCUIENSw4lBVElWRSBHw4lOw4lSw4lFPC9kaXY+CiAgICA8ZGl2IGNsYXNzPSJvdXRwdXQtY2FyZCI+CiAgICAgIDxkaXYgY2xhc3M9Im91dHB1dC1oZWFkZXIiPgogICAgICAgIDxzcGFuIGNsYXNzPSJvdXRwdXQtYmFkZ2UiPuKckyBHw6luw6lyw6k8L3NwYW4+CiAgICAgICAgPHNwYW4gc3R5bGU9ImZvbnQtZmFtaWx5OidETSBNb25vJyxtb25vc3BhY2U7Zm9udC1zaXplOjExcHg7Y29sb3I6dmFyKC0tdGV4dDIpIiBpZD0iZ2VuLXRpbWUiPjwvc3Bhbj4KICAgICAgICA8ZGl2IGNsYXNzPSJvdXRwdXQtYWN0aW9ucyI+CiAgICAgICAgICA8YnV0dG9uIGNsYXNzPSJhY3Rpb24tYnRuIiBvbmNsaWNrPSJyZWdlbmVyYXRlKCkiPuKGuyBSw6lnw6luw6lyZXI8L2J1dHRvbj4KICAgICAgICAgIDxidXR0b24gY2xhc3M9ImFjdGlvbi1idG4gZG93bmxvYWQiIGlkPSJkbC1idG4iIG9uY2xpY2s9ImRvd25sb2FkSW1hZ2UoKSI+4oaTIFTDqWzDqWNoYXJnZXI8L2J1dHRvbj4KICAgICAgICA8L2Rpdj4KICAgICAgPC9kaXY+CiAgICAgIDxkaXYgY2xhc3M9Im91dHB1dC1pbWFnZS13cmFwIj4KICAgICAgICA8aW1nIGlkPSJnZW5lcmF0ZWQtaW1hZ2UiIGFsdD0iQ3LDqWF0aXZlIGfDqW7DqXLDqWUiPgogICAgICA8L2Rpdj4KICAgICAgPGRpdiBjbGFzcz0ib3V0cHV0LW1ldGEiPgogICAgICAgIDxzcGFuIGlkPSJvdXRwdXQtbW9kZWwiPmdlbWluaS0yLjAtZmxhc2gtZXhwLWltYWdlLWdlbmVyYXRpb248L3NwYW4+CiAgICAgICAgPHNwYW4gaWQ9Im91dHB1dC1zaXplIj48L3NwYW4+CiAgICAgIDwvZGl2PgogICAgPC9kaXY+CiAgPC9kaXY+Cgo8L2Rpdj4KCjxzY3JpcHQ+Ci8vIOKUgOKUgCBTVEFURSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIAKCmNvbnN0IHN0YXRlID0gewogIHdpcmVmcmFtZTogeyBiYXNlNjQ6IG51bGwsIG1pbWU6IG51bGwgfSwKICBwcm9kdWN0OiAgIHsgYmFzZTY0OiBudWxsLCBtaW1lOiBudWxsIH0sCiAgaW1hZ2VEYXRhOiBudWxsLAogIGltYWdlTWltZTogbnVsbCwKICBnZW5TdGFydDogIG51bGwKfTsKCi8vIOKUgOKUgCBBUEkgS0VZIENIRUNLIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgAoKLy8g4pSA4pSAIFVQTE9BRCBIQU5ETElORyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIAKZnVuY3Rpb24gdHJpZ2dlclVwbG9hZChpbnB1dElkLCBlKSB7CiAgaWYgKGUudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnY2xlYXItYnRuJykpIHJldHVybjsKICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpbnB1dElkKS5jbGljaygpOwp9CgpmdW5jdGlvbiBzZXR1cFVwbG9hZChpbnB1dElkLCB6b25lSWQsIHByZXZpZXdJZCwgY2xlYXJJZCwgc3RhdGVLZXkpIHsKICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlucHV0SWQpOwogIGNvbnN0IHpvbmUgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoem9uZUlkKTsKICBjb25zdCBwcmV2aWV3ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocHJldmlld0lkKTsKICBjb25zdCBjbGVhckJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNsZWFySWQpOwoKICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbihlKSB7CiAgICBjb25zdCBmaWxlID0gZS50YXJnZXQuZmlsZXNbMF07CiAgICBpZiAoIWZpbGUpIHJldHVybjsKICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7CiAgICByZWFkZXIub25sb2FkID0gZXYgPT4gewogICAgICBjb25zdCByZXN1bHQgPSBldi50YXJnZXQucmVzdWx0OwogICAgICBzdGF0ZVtzdGF0ZUtleV0uYmFzZTY0ID0gcmVzdWx0LnNwbGl0KCcsJylbMV07CiAgICAgIHN0YXRlW3N0YXRlS2V5XS5taW1lID0gZmlsZS50eXBlIHx8ICdpbWFnZS9qcGVnJzsKICAgICAgcHJldmlldy5zcmMgPSByZXN1bHQ7CiAgICAgIHByZXZpZXcuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7CiAgICAgIHpvbmUuY2xhc3NMaXN0LmFkZCgnaGFzLWltYWdlJyk7CiAgICAgIHpvbmUucXVlcnlTZWxlY3RvcigncCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7CiAgICAgIHpvbmUucXVlcnlTZWxlY3Rvcignc3BhbicpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7CiAgICAgIHpvbmUucXVlcnlTZWxlY3RvcignLnVwbG9hZC1pY29uJykuc3R5bGUuZGlzcGxheSA9ICdub25lJzsKICAgICAgY2xlYXJCdG4uc3R5bGUuZGlzcGxheSA9ICdmbGV4JzsKICAgIH07CiAgICByZWFkZXIucmVhZEFzRGF0YVVSTChmaWxlKTsKICB9KTsKCiAgY2xlYXJCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7CiAgICBlLnN0b3BQcm9wYWdhdGlvbigpOwogICAgc3RhdGVbc3RhdGVLZXldLmJhc2U2NCA9IG51bGw7CiAgICBzdGF0ZVtzdGF0ZUtleV0ubWltZSA9IG51bGw7CiAgICBwcmV2aWV3LnNyYyA9ICcnOwogICAgcHJldmlldy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnOwogICAgem9uZS5jbGFzc0xpc3QucmVtb3ZlKCdoYXMtaW1hZ2UnKTsKICAgIHpvbmUucXVlcnlTZWxlY3RvcigncCcpLnN0eWxlLmRpc3BsYXkgPSAnJzsKICAgIHpvbmUucXVlcnlTZWxlY3Rvcignc3BhbicpLnN0eWxlLmRpc3BsYXkgPSAnJzsKICAgIHpvbmUucXVlcnlTZWxlY3RvcignLnVwbG9hZC1pY29uJykuc3R5bGUuZGlzcGxheSA9ICcnOwogICAgY2xlYXJCdG4uc3R5bGUuZGlzcGxheSA9ICdub25lJzsKICAgIGlucHV0LnZhbHVlID0gJyc7CiAgfSk7Cn0KCnNldHVwVXBsb2FkKCd3aXJlZnJhbWUtaW5wdXQnLCAnem9uZS13aXJlZnJhbWUnLCAncHJldmlldy13aXJlZnJhbWUnLCAnY2xlYXItd2lyZWZyYW1lJywgJ3dpcmVmcmFtZScpOwpzZXR1cFVwbG9hZCgncHJvZHVjdC1pbnB1dCcsICAgJ3pvbmUtcHJvZHVjdCcsICAgJ3ByZXZpZXctcHJvZHVjdCcsICAgJ2NsZWFyLXByb2R1Y3QnLCAgICdwcm9kdWN0Jyk7CgovLyDilIDilIAgR0VORVJBVEUg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSACmFzeW5jIGZ1bmN0aW9uIGdlbmVyYXRlKCkgewogIGNvbnN0IHByb21wdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwcm9tcHQtaW5wdXQnKS52YWx1ZS50cmltKCk7CgogIGlmICghc3RhdGUud2lyZWZyYW1lLmJhc2U2NCkgeyBzaG93RXJyb3IoJ0ltcG9ydGUgbGUgd2lyZWZyYW1lIENULicpOyByZXR1cm47IH0KICBpZiAoIXN0YXRlLnByb2R1Y3QuYmFzZTY0KSAgIHsgc2hvd0Vycm9yKCdJbXBvcnRlIGxhIHBob3RvIHByb2R1aXQuJyk7IHJldHVybjsgfQogIGlmICghcHJvbXB0KSAgICAgICAgICAgICAgICAgeyBzaG93RXJyb3IoJ0NvbGxlIGxlIHByb21wdCBhdmFudCBkZSBnw6luw6lyZXIuJyk7IHJldHVybjsgfQoKICBzZXRMb2FkaW5nKHRydWUpOwogIGhpZGVFcnJvcigpOwogIHNldFN0YXR1cygnRW52b2kgw6AgVmVydGV4IEFJIOKAlCBOYW5vIEJhbmFuYSBQcm8uLi4nKTsKICBzdGF0ZS5nZW5TdGFydCA9IERhdGUubm93KCk7CgogIHRyeSB7CiAgICBjb25zdCBib2R5ID0gewogICAgICBjb250ZW50czogW3sKICAgICAgICBwYXJ0czogWwogICAgICAgICAgeyB0ZXh0OiBwcm9tcHQgfSwKICAgICAgICAgIHsgaW5saW5lX2RhdGE6IHsgbWltZV90eXBlOiBzdGF0ZS53aXJlZnJhbWUubWltZSwgZGF0YTogc3RhdGUud2lyZWZyYW1lLmJhc2U2NCB9IH0sCiAgICAgICAgICB7IGlubGluZV9kYXRhOiB7IG1pbWVfdHlwZTogc3RhdGUucHJvZHVjdC5taW1lLCAgIGRhdGE6IHN0YXRlLnByb2R1Y3QuYmFzZTY0ICAgfSB9CiAgICAgICAgXQogICAgICB9XQogICAgfTsKCiAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCgnL2dlbmVyYXRlJywgewogICAgICBtZXRob2Q6ICdQT1NUJywKICAgICAgaGVhZGVyczogeyAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nIH0sCiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGJvZHkpCiAgICB9KTsKCiAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzLmpzb24oKTsKICAgIGlmIChkYXRhLmVycm9yKSB0aHJvdyBuZXcgRXJyb3IoZGF0YS5lcnJvcik7CgogICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ291dHB1dC1tb2RlbCcpLnRleHRDb250ZW50ID0gZGF0YS5tb2RlbCArICcgwrcgVmVydGV4IEFJJzsKICAgIHN0YXRlLmltYWdlRGF0YSA9IGRhdGEuaW1hZ2VEYXRhOwogICAgc3RhdGUuaW1hZ2VNaW1lID0gZGF0YS5pbWFnZU1pbWU7CiAgICByZW5kZXJJbWFnZShzdGF0ZS5pbWFnZURhdGEsIHN0YXRlLmltYWdlTWltZSk7CiAgICBzZXRMb2FkaW5nKGZhbHNlKTsKICAgIGhpZGVTdGF0dXMoKTsKCiAgfSBjYXRjaChlcnIpIHsKICAgIHNldExvYWRpbmcoZmFsc2UpOwogICAgaGlkZVN0YXR1cygpOwogICAgc2hvd0Vycm9yKGVyci5tZXNzYWdlKTsKICAgIGNvbnNvbGUuZXJyb3IoZXJyKTsKICB9Cn0KCmZ1bmN0aW9uIHJlZ2VuZXJhdGUoKSB7CiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ291dHB1dCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7CiAgZ2VuZXJhdGUoKTsKfQoKLy8g4pSA4pSAIFJFTkRFUiBJTUFHRSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIAKZnVuY3Rpb24gcmVuZGVySW1hZ2UoYmFzZTY0LCBtaW1lKSB7CiAgY29uc3QgZWxhcHNlZCA9ICgoRGF0ZS5ub3coKSAtIHN0YXRlLmdlblN0YXJ0KSAvIDEwMDApLnRvRml4ZWQoMSk7CiAgY29uc3QgaW1nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2dlbmVyYXRlZC1pbWFnZScpOwogIGNvbnN0IHNyYyA9IGBkYXRhOiR7bWltZX07YmFzZTY0LCR7YmFzZTY0fWA7CiAgaW1nLnNyYyA9IHNyYzsKICBpbWcub25sb2FkID0gKCkgPT4gewogICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ291dHB1dC1zaXplJykudGV4dENvbnRlbnQgPQogICAgICBgJHtpbWcubmF0dXJhbFdpZHRofcOXJHtpbWcubmF0dXJhbEhlaWdodH1weGA7CiAgfTsKICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2VuLXRpbWUnKS50ZXh0Q29udGVudCA9IGAke2VsYXBzZWR9c2A7CiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ291dHB1dCcpLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snOwogIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvdXRwdXQnKS5zY3JvbGxJbnRvVmlldyh7IGJlaGF2aW9yOiAnc21vb3RoJywgYmxvY2s6ICdzdGFydCcgfSk7Cn0KCi8vIOKUgOKUgCBET1dOTE9BRCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIAKZnVuY3Rpb24gZG93bmxvYWRJbWFnZSgpIHsKICBpZiAoIXN0YXRlLmltYWdlRGF0YSkgcmV0dXJuOwogIGNvbnN0IGV4dCA9IHN0YXRlLmltYWdlTWltZT8uaW5jbHVkZXMoJ3BuZycpID8gJ3BuZycgOiAnanBnJzsKICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpOwogIGEuaHJlZiA9IGBkYXRhOiR7c3RhdGUuaW1hZ2VNaW1lfTtiYXNlNjQsJHtzdGF0ZS5pbWFnZURhdGF9YDsKICBhLmRvd25sb2FkID0gYGFkc3RhY2tfY3JlYXRpdmVfJHtEYXRlLm5vdygpfS4ke2V4dH1gOwogIGEuY2xpY2soKTsKfQoKLy8g4pSA4pSAIFVJIEhFTFBFUlMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSACmZ1bmN0aW9uIHNldExvYWRpbmcob24pIHsKICBjb25zdCBidG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZ2VuLWJ0bicpOwogIGJ0bi5kaXNhYmxlZCA9IG9uOwogIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzcGlubmVyJykuc3R5bGUuZGlzcGxheSA9IG9uID8gJ2Jsb2NrJyA6ICdub25lJzsKICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnRuLWljb24nKS5zdHlsZS5kaXNwbGF5ID0gb24gPyAnbm9uZScgOiAnYmxvY2snOwogIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdidG4tdGV4dCcpLnRleHRDb250ZW50ID0gb24gPyAnR8OpbsOpcmF0aW9uIGVuIGNvdXJzLi4uJyA6ICdHw6luw6lyZXIgbGEgY3LDqWF0aXZlJzsKfQpmdW5jdGlvbiBzZXRTdGF0dXMobXNnKSB7CiAgY29uc3QgYiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGF0dXMtYmFyJyk7CiAgYi5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnOwogIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGF0dXMtdGV4dCcpLnRleHRDb250ZW50ID0gbXNnOwp9CmZ1bmN0aW9uIGhpZGVTdGF0dXMoKSB7IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGF0dXMtYmFyJykuc3R5bGUuZGlzcGxheSA9ICdub25lJzsgfQpmdW5jdGlvbiBzaG93RXJyb3IobXNnKSB7CiAgY29uc3QgYiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlcnJvci1iYXInKTsKICBiLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7CiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vycm9yLXRleHQnKS50ZXh0Q29udGVudCA9IG1zZzsKfQpmdW5jdGlvbiBoaWRlRXJyb3IoKSB7IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlcnJvci1iYXInKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnOyB9Cjwvc2NyaXB0Pgo8L2JvZHk+CjwvaHRtbD4K';
// ────────────────────────────────────────────────────────────
// MODE TEST : Sonnet 4.6 → Gemini 2.5 Pro (texte + multimodal)
// ────────────────────────────────────────────────────────────
async function callGeminiPro(systemPrompt, contentBlocks, maxOutputTokens, options = {}) {
  // VAGUE 1 (fondations serveur) — thinkingBudget et temperature configurables par appelant.
  // Cause profonde corrigée : avant ce fix, aucun thinkingConfig n'était envoyé à Gemini 2.5 Pro.
  // Sur du "dynamic thinking" par défaut, le modèle peut sauter les chaînes de raisonnement silencieuses
  // demandées par les compétences (décodage CT étape A→G, compréhension persona/produit/angles avant écriture).
  // Défaut permissif (8192) appliqué à TOUT appelant qui ne précise rien — les endpoints critiques
  // (/creative-prod, /analyste-synthese) forcent explicitement une valeur plus haute à l'appel (voir plus bas).
  const { temperature = 0.7, thinkingBudget = 8192, logLabel = 'Gemini 2.5 Pro' } = options;
  const token = await getToken();
  const parts = (contentBlocks || []).map(b => {
    if (b.type === 'image' && b.source) {
      return { inlineData: { mimeType: b.source.media_type || 'image/jpeg', data: b.source.data } };
    }
    if (b.type === 'text' || typeof b.text === 'string') {
      return { text: b.text || '' };
    }
    return null;
  }).filter(Boolean);

  const generationConfig = { temperature, maxOutputTokens: maxOutputTokens || 8000 };
  // thinkingBudget=null désactive explicitement le forçage (comportement dynamique natif de Gemini) —
  // utile si un futur appelant veut délibérément revenir au comportement par défaut de l'API.
  if (thinkingBudget !== null) {
    generationConfig.thinkingConfig = { thinkingBudget };
  }

  const geminiBody = {
    contents: [{ role: 'user', parts }],
    systemInstruction: { parts: [{ text: systemPrompt || '' }] },
    generationConfig
  };

  const data = await vertexRequest(token, 'gemini-2.5-pro', geminiBody);
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  const cand = data.candidates?.[0];
  const text = (cand?.content?.parts || []).map(p => p.text).filter(Boolean).join('\n');

  // ── Log diagnostic (Vague 1.3) — visibilité sur le raisonnement réel de Gemini, absente jusqu'ici ──
  const finishReason = cand?.finishReason || 'inconnu';
  const usage = data.usageMetadata || {};
  console.log(`   [${logLabel}] finishReason=${finishReason} · tokens prompt=${usage.promptTokenCount ?? '?'} thinking=${usage.thoughtsTokenCount ?? 0} output=${usage.candidatesTokenCount ?? '?'} total=${usage.totalTokenCount ?? '?'}`);
  if (finishReason === 'MAX_TOKENS') {
    console.log(`   ⚠️  [${logLabel}] Réponse tronquée par maxOutputTokens (${maxOutputTokens || 8000}) — le prompt final est probablement incomplet, envisager d'augmenter la limite`);
  }

  if (!text) throw new Error('Gemini 2.5 Pro : réponse vide');
  return text;
}

const HTML_CONTENT = Buffer.from(HTML_B64, 'base64').toString('utf-8');

// ══════════════════════════════════════════════════════════════════════════
// CHARIOW INTEGRATION — Checkout + Pulses (webhooks)
// ══════════════════════════════════════════════════════════════════════════

const CHARIOW_KEY = process.env.CHARIOW_KEY || '';
const SUPABASE_URL_INT = process.env.SUPABASE_URL || 'https://mifljhsusidgzelnswma.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

const PLAN_MAP = {
  'prd_ljowq8':   { plan: 'starter', cycle: 'monthly', credits_per_week: 9,  price_fcfa: 39900,  prix_img: 1108 },
  'prd_wdya3v9h': { plan: 'starter', cycle: 'annual',  credits_per_week: 9,  price_fcfa: 29900,  prix_img: 830 },
  'prd_34w031':   { plan: 'pro',     cycle: 'monthly', credits_per_week: 18, price_fcfa: 69900,  prix_img: 970 },
  'prd_lnp4ax0b': { plan: 'pro',     cycle: 'annual',  credits_per_week: 18, price_fcfa: 54900,  prix_img: 762 },
  'prd_9fi79y':   { plan: 'scale',   cycle: 'monthly', credits_per_week: 36, price_fcfa: 109900, prix_img: 763 },
  'prd_dn4fb72l': { plan: 'scale',   cycle: 'annual',  credits_per_week: 36, price_fcfa: 79900,  prix_img: 554 },
};

const PLAN_LABELS = { starter: 'Conversion Starter', pro: 'Conversion Pro', scale: 'Conversion Scale' };

// ── Séquence email de conversion J1/J5/J12/J21 ─────────────────────────────
const SEQUENCE_PRICES = { starter: { price: 39900 } }; // Starter mensuel, référence pour les prix cités dans les emails

// Convertit un prix FCFA vers la devise de la personne (détectée et mémorisée côté AdBoard).
// Taux récupéré à chaque envoi — jamais de taux périmé, contrairement à un taux figé au moment de l'inscription.
async function formatPriceForCurrency(fcfa, currency) {
  if (!currency || currency === 'XOF') return fcfa.toLocaleString('fr-FR') + ' FCFA';
  try {
    const rates = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/xof.json').then(r => r.json());
    const rate = rates.xof?.[currency.toLowerCase()];
    if (!rate) return fcfa.toLocaleString('fr-FR') + ' FCFA';
    const val = Math.round(fcfa * rate * 1.035);
    return new Intl.NumberFormat(undefined, { style:'currency', currency, maximumFractionDigits:0 }).format(val);
  } catch(e) {
    return fcfa.toLocaleString('fr-FR') + ' FCFA';
  }
}

async function renderSequenceEmail(key, { firstName='', productName='', productPays='', currency='XOF' } = {}) {
  const prixLocal = await formatPriceForCurrency(SEQUENCE_PRICES.starter.price, currency);
  const prixParImage = await formatPriceForCurrency(Math.round(SEQUENCE_PRICES.starter.price / 36), currency);
  const wrap = (body) => `<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;color:#222;font-size:15px;line-height:1.65;">${body}</div>`;

  const templates = {
    'j1_no_product': {
      subject: 'Ton catalogue est vide — 2 minutes pour changer ça',
      html: wrap(`
        <p>Salut${firstName ? ' ' + firstName : ''},</p>
        <p>Tu t'es inscrit sur AdBoard, mais ton catalogue est encore vide.</p>
        <p>On sait que beaucoup de vendeurs bricolent leurs visuels eux-mêmes avec ChatGPT ou Canva pour aller plus vite — sauf que "plus vite" prend souvent des heures, et le résultat ne convertit pas toujours.</p>
        <p>Ajoute ton produit, on s'occupe du reste.</p>
        <p><a href="https://adstackofficial.com/adboard/products" style="color:#2D7FF9;">Ajouter mon produit →</a></p>
        <p style="margin-top:24px;">AdStack</p>
      `)
    },
    'j1_has_product': {
      subject: `🤯 ${firstName || 'Salut'} ! Découverte hallucinante sur ${productName || 'ton produit'}...`,
      html: wrap(`
        <p>Heyy${firstName ? ' ' + firstName : ''},</p>
        <p>Tu as créé ${productName || 'ton produit'} que tu vends sur ${productPays || 'ton marché'}.</p>
        <p>Et notamment nos spécialistes ont découvert un potentiel énorme sur la croissance de la demande pour ce type de produit dans les 3 prochains mois.</p>
        <p>Bref, c'est la ruée vers l'or ! Mais si t'as pas une équipe de tueurs à tes côtés tu peux dire adieu à cette opportunité, ou sinon tu peux faire le bon choix aujourd'hui.</p>
        <p><a href="https://adstackofficial.com/adboard/products" style="color:#2D7FF9;">Demander mes visuels →</a></p>
        <p style="margin-top:24px;">AdStack</p>
      `)
    },
    'j5_vision': {
      subject: '🫣 La méthode secrète qui a fait la différence pour un de nos clients',
      html: wrap(`
        <p>Salut${firstName ? ' ' + firstName : ''},</p>
        <p><strong>Maintenant :</strong> tu gères tes visuels toi-même avec l'IA, tu lances, tu croises les doigts. Si ça marche pas, tu recommences de zéro.</p>
        <p><strong>Avec AdStack :</strong> tu profites des années d'expérience en stratégie publicitaire de notre équipe, tout est fait avec précision et avec un unique but — exploser tes records de ventes sans que t'aies rien à faire.</p>
        <p>C'est exactement ce qui a convaincu un de nos clients qui vend un produit santé complexe en Afrique francophone : les angles distincts lui ont permis de tester ce qui marchait vraiment, au lieu de deviner.</p>
        <p>En conséquence il ne compte pas sur la chance pour faire "SOLD OUT".</p>
        <p><a href="https://adstackofficial.com/adboard/offers" style="color:#2D7FF9;">Découvrir Starter — ${prixLocal} →</a></p>
        <p style="margin-top:24px;">AdStack</p>
      `)
    },
    'j12_offer': {
      subject: '"C\'est cher" — parlons-en',
      html: wrap(`
        <p>Salut${firstName ? ' ' + firstName : ''},</p>
        <p>Tu regardes peut-être le prix de Starter (${prixLocal}) et tu te dis que c'est cher.</p>
        <p>Fais le calcul : ça revient à environ ${prixParImage} par image. Un freelance basique facture souvent 5x plus cher pour une seule image, sans données marché, sans stratégie ni amélioration continue.</p>
        <p>Le vrai coût, c'est pas Starter. C'est chaque jour sans bon contenu publicitaire qui brûle ton budget, sans savoir comprendre pourquoi ça n'a pas marché.</p>
        <p>La meilleure solution, elle est devant toi — pas ChatGPT que tout le monde a.</p>
        <p><a href="https://adstackofficial.com/adboard/offers" style="color:#2D7FF9;">Je démarre avec Starter →</a></p>
        <p style="margin-top:24px;">AdStack</p>
      `)
    },
    'j21_breakup': {
      subject: '🤐 je vais arrêter de t\'écrire !!!',
      html: wrap(`
        <p>Salut${firstName ? ' ' + firstName : ''},</p>
        <p>Je vais arrêter de t'écrire — pas parce qu'on perd notre temps, mais plutôt pour qualifier les personnes avec qui on travaille.</p>
        <p>Car tout e-commerçant voulant vraiment scaler son business aurait compris directement la valeur unique qu'on apporte dès le premier message.</p>
        <p><a href="https://adstackofficial.com/adboard/offers" style="color:#2D7FF9;">Passer à l'action →</a></p>
        <p style="margin-top:24px;">AdStack</p>
      `)
    },
    'monthly_social_proof': {
      subject: 'Ce qu\'un vendeur a fait avec ses images cette semaine',
      html: wrap(`
        <p>Salut${firstName ? ' ' + firstName : ''},</p>
        <p>Un de nos clients vend un produit cosmétique avec plusieurs bénéfices différents — difficile de savoir quel argument allait vraiment convaincre.</p>
        <p>On lui a livré une bonne diversité d'images publicitaires la même semaine. Il a pu tester quel angle résonnait le plus avec sa cible, au lieu de deviner.</p>
        <p>C'est exactement ce que Starter permet de faire, chaque semaine.</p>
        <p><a href="https://adstackofficial.com/adboard/offers" style="color:#2D7FF9;">Revoir les offres →</a></p>
        <p style="margin-top:24px;">AdStack</p>
      `)
    },
    'monthly_novelty': {
      subject: 'Ce qui a changé sur AdBoard depuis ta dernière visite',
      html: wrap(`
        <p>Salut${firstName ? ' ' + firstName : ''},</p>
        <p>AdBoard continue d'évoluer — nouvelles fonctionnalités, suivi de tes demandes en temps réel, assistant intégré pour répondre à tes questions direct dans la plateforme.</p>
        <p>Si tu avais mis ton inscription de côté, c'est peut-être le bon moment d'y rejeter un œil.</p>
        <p><a href="https://adstackofficial.com/adboard/products" style="color:#2D7FF9;">Retourner sur AdBoard →</a></p>
        <p style="margin-top:24px;">AdStack</p>
      `)
    },
    'monthly_checkin': {
      subject: 'On est toujours là',
      html: wrap(`
        <p>Salut${firstName ? ' ' + firstName : ''},</p>
        <p>Pas de pitch aujourd'hui — juste un mot pour savoir où tu en es.</p>
        <p>Si tu as des questions sur AdStack, ou juste besoin d'un conseil sur tes visuels publicitaires, réponds à cet email. Zéro obligation d'acheter quoi que ce soit.</p>
        <p style="margin-top:24px;">AdStack</p>
      `)
    },
  };
  return templates[key];
}

async function sendSequenceEmail(email, key, ctx) {
  const RESEND_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_KEY) return false;
  const tpl = await renderSequenceEmail(key, ctx);
  if (!tpl) return false;
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'AdStack <contact@adstackofficial.com>',
        to: [email],
        reply_to: 'amarbiranediaw@gmail.com',
        subject: tpl.subject,
        html: tpl.html,
      })
    });
    return r.ok;
  } catch(e) {
    console.error('[Sequence] Erreur envoi:', e.message);
    return false;
  }
}

async function markSequenceSent(userId, emailKey) {
  await fetch(`${SUPABASE_URL_INT}/rest/v1/email_sequence_log`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Prefer': 'resolution=ignore-duplicates',
    },
    body: JSON.stringify({ user_id: userId, email_key: emailKey })
  });
}

async function wasSequenceSent(userId, emailKey) {
  const r = await fetch(
    `${SUPABASE_URL_INT}/rest/v1/email_sequence_log?user_id=eq.${userId}&email_key=eq.${emailKey}&limit=1`,
    { headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` } }
  );
  const rows = await r.json();
  return Array.isArray(rows) && rows.length > 0;
}

// ── Web Push (notifications navigateur) ────────────────────────────────────
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:contact@adstackofficial.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

// Envoie une notification push à TOUTES les subscriptions d'un utilisateur
async function sendPushToUser(userId, { title, body, url = '/adboard' }) {
  if (!process.env.VAPID_PRIVATE_KEY) { console.warn('[Push] VAPID non configuré'); return; }
  try {
    const r = await fetch(`${SUPABASE_URL_INT}/rest/v1/push_subscriptions?user_id=eq.${userId}`, {
      headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` }
    });
    const subs = await r.json();
    if (!Array.isArray(subs) || subs.length === 0) {
      console.warn(`[Push] Aucune souscription trouvée pour user ${userId} — rien envoyé`);
      return;
    }
    console.log(`[Push] ${subs.length} souscription(s) trouvée(s) pour user ${userId}, envoi en cours...`);

    const payload = JSON.stringify({ title, body, url });
    await Promise.all(subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        );
        console.log(`[Push] ✅ Envoyé avec succès à l'endpoint ...${sub.endpoint.slice(-20)}`);
      } catch(e) {
        if (e.statusCode === 404 || e.statusCode === 410) {
          console.warn(`[Push] Souscription expirée (${e.statusCode}), suppression...`);
          fetch(`${SUPABASE_URL_INT}/rest/v1/push_subscriptions?id=eq.${sub.id}`, {
            method: 'DELETE',
            headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` }
          }).catch(()=>{});
        } else {
          console.error('[Push] Erreur envoi:', e.statusCode, e.message);
        }
      }
    }));
  } catch(e) {
    console.error('[Push] Erreur sendPushToUser:', e.message);
  }
}

// Écrit une entrée persistante dans la section Notifications d'AdBoard (indépendant du push)
async function writeInAppNotification(userId, message, type = 'info') {
  try {
    await fetch(`${SUPABASE_URL_INT}/rest/v1/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({ user_id: userId, message, type, read: false })
    });
  } catch(e) { console.error('[InAppNotif] Erreur:', e.message); }
}

// Combine push + trace persistante — à utiliser pour tout évènement asynchrone/externe important
async function notifyUserBoth(userId, { title, body, url = '/adboard', type = 'info' }) {
  await Promise.all([
    sendPushToUser(userId, { title, body, url }),
    writeInAppNotification(userId, `${title} — ${body}`, type),
  ]);
}

// Génère une facture PDF en mémoire (Buffer)
function generateInvoicePDF({ invoiceNumber, customerEmail, customerName, plan, cycle, creditsPerWeek, prixImg, priceFcfa, paymentDate, expiresAt }) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks = [];
      doc.on('data', c => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const cycleLabel = cycle === 'annual' ? 'Abonnement annuel' : 'Abonnement mensuel';
      const weeksInPeriod = Math.round((expiresAt.getTime() - paymentDate.getTime()) / (7*24*60*60*1000));
      const totalImages = weeksInPeriod * (creditsPerWeek || 0);

      // Header
      doc.fontSize(22).fillColor('#5B8DEF').font('Helvetica-Bold').text('AdStack', 50, 50);
      doc.fontSize(10).fillColor('#666666').font('Helvetica').text('Agence de créatives Meta Ads', 50, 78);

      doc.fontSize(18).fillColor('#111111').font('Helvetica-Bold').text('FACTURE', 400, 50, { align: 'right' });
      doc.fontSize(10).fillColor('#666666').font('Helvetica').text(`N° ${invoiceNumber}`, 400, 75, { align: 'right' });
      doc.text(`Date : ${paymentDate.toLocaleDateString('fr-FR')}`, 400, 90, { align: 'right' });

      doc.moveTo(50, 120).lineTo(545, 120).strokeColor('#E5E5E5').stroke();

      // Client info
      doc.fontSize(11).fillColor('#111111').font('Helvetica-Bold').text('Facturé à :', 50, 140);
      doc.fontSize(10).fillColor('#333333').font('Helvetica').text(customerName || customerEmail, 50, 158);
      doc.text(customerEmail, 50, 173);

      // Table header
      const tableTop = 210;
      doc.fontSize(10).fillColor('#666666').font('Helvetica-Bold');
      doc.text('Description', 50, tableTop);
      doc.text('Période', 320, tableTop);
      doc.text('Montant', 470, tableTop, { align: 'right' });
      doc.moveTo(50, tableTop + 18).lineTo(545, tableTop + 18).strokeColor('#E5E5E5').stroke();

      // Table row
      const rowY = tableTop + 32;
      doc.fontSize(11).fillColor('#111111').font('Helvetica-Bold').text(PLAN_LABELS[plan] || plan, 50, rowY);
      doc.fontSize(9).fillColor('#888888').font('Helvetica').text(`${cycleLabel} — livraisons hebdomadaires`, 50, rowY + 15);
      doc.fontSize(10).fillColor('#333333').text(
        `${paymentDate.toLocaleDateString('fr-FR')} → ${expiresAt.toLocaleDateString('fr-FR')}`, 320, rowY
      );
      doc.fontSize(11).fillColor('#111111').font('Helvetica-Bold').text(
        `${priceFcfa.toLocaleString('fr-FR')} FCFA`, 470, rowY, { align: 'right' }
      );

      // Détail : ce que couvre cet abonnement
      const detailTop = rowY + 45;
      doc.moveTo(50, detailTop - 8).lineTo(545, detailTop - 8).strokeColor('#F0F0F0').stroke();
      doc.fontSize(9).fillColor('#666666').font('Helvetica-Bold').text('Ce que couvre cet abonnement :', 50, detailTop);
      const detailLines = [
        `${creditsPerWeek || 0} images publicitaires livrées chaque semaine`,
        `Soit environ ${weeksInPeriod} semaine${weeksInPeriod>1?'s':''} sur cette période — ${totalImages} images au total`,
        prixImg ? `Prix moyen par image : ${prixImg.toLocaleString('fr-FR')} FCFA` : null,
        'Données marché hebdomadaires (cibles, concurrents, tendances)',
      ].filter(Boolean);
      doc.fontSize(9).fillColor('#444444').font('Helvetica');
      detailLines.forEach((line, i) => {
        doc.text(`•  ${line}`, 50, detailTop + 16 + (i * 14));
      });

      const afterDetailY = detailTop + 16 + (detailLines.length * 14) + 12;
      doc.moveTo(50, afterDetailY).lineTo(545, afterDetailY).strokeColor('#E5E5E5').stroke();

      // Total
      doc.fontSize(13).fillColor('#5B8DEF').font('Helvetica-Bold').text(
        `Total payé : ${priceFcfa.toLocaleString('fr-FR')} FCFA`, 320, afterDetailY + 15, { align: 'right', width: 225 }
      );

      // Footer
      doc.fontSize(9).fillColor('#999999').font('Helvetica').text(
        'Merci de votre confiance. Pour toute question, contactez-nous via WhatsApp ou AdBoard.',
        50, 700, { align: 'center', width: 495 }
      );
      doc.fontSize(8).fillColor('#BBBBBB').text('AdStack — Dakar, Sénégal', 50, 715, { align: 'center', width: 495 });

      doc.end();
    } catch(e) { reject(e); }
  });
}

// Envoie un email via Resend avec la facture en pièce jointe
async function sendPaymentConfirmationEmail({ email, name, plan, cycle, creditsPerWeek, prixImg, priceFcfa, paymentDate, expiresAt }) {
  const RESEND_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_KEY) { console.warn('[Email] RESEND_API_KEY manquante — email non envoyé'); return; }

  const invoiceNumber = `ADS-${paymentDate.getFullYear()}${String(paymentDate.getMonth()+1).padStart(2,'0')}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

  let pdfBuffer;
  try {
    pdfBuffer = await generateInvoicePDF({ invoiceNumber, customerEmail: email, customerName: name, plan, cycle, creditsPerWeek, prixImg, priceFcfa, paymentDate, expiresAt });
  } catch(e) {
    console.error('[Invoice] Erreur génération PDF:', e.message);
  }

  const planLabel = PLAN_LABELS[plan] || plan;
  const cycleLabel = cycle === 'annual' ? 'annuel' : 'mensuel';
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;">
      <h2 style="color:#5B8DEF;">Paiement confirmé ✅</h2>
      <p>Bonjour${name ? ' ' + name : ''},</p>
      <p>Merci pour ton abonnement <strong>${planLabel}</strong> (${cycleLabel}) ! Ton paiement a bien été reçu.</p>
      <div style="background:#F5F8FF;border-radius:10px;padding:16px 20px;margin:20px 0;">
        <p style="margin:4px 0;"><strong>Plan :</strong> ${planLabel} — ${cycleLabel}</p>
        <p style="margin:4px 0;"><strong>Images livrées :</strong> ${creditsPerWeek || 0} / semaine</p>
        <p style="margin:4px 0;"><strong>Montant :</strong> ${priceFcfa.toLocaleString('fr-FR')} FCFA</p>
        <p style="margin:4px 0;"><strong>Valide jusqu'au :</strong> ${expiresAt.toLocaleDateString('fr-FR')}</p>
      </div>
      <p>Ta facture détaillée est jointe à cet email. Tu peux dès maintenant demander tes premiers visuels depuis <a href="https://adstackofficial.com/adboard/products">AdBoard</a>.</p>
      <p style="color:#999;font-size:12px;margin-top:30px;">AdStack — Dakar, Sénégal</p>
    </div>
  `;

  const payload = {
    from: 'AdStack <factures@adstackofficial.com>',
    to: [email],
    subject: `✅ Paiement confirmé — Abonnement ${planLabel}`,
    html,
  };
  if (pdfBuffer) {
    payload.attachments = [{
      filename: `Facture_AdStack_${invoiceNumber}.pdf`,
      content: pdfBuffer.toString('base64'),
    }];
  }

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!r.ok) {
      const errText = await r.text();
      console.error('[Email] Échec envoi Resend:', r.status, errText.slice(0,200));
    } else {
      console.log(`[Email] ✅ Confirmation envoyée à ${email}`);
    }
  } catch(e) {
    console.error('[Email] Erreur envoi:', e.message);
  }
}

// Email de bienvenue — ton personnel, du fondateur, envoyé à la toute première connexion
async function sendWelcomeEmail({ email, name }) {
  const RESEND_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_KEY) { console.warn('[Email] RESEND_API_KEY manquante — welcome email non envoyé'); return; }

  const firstName = name ? name.split(' ')[0] : '';

  const html = `
    <div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;color:#222;font-size:15px;line-height:1.65;">
      <p>Salut${firstName ? ' ' + firstName : ''},</p>

      <p>Moi c'est Amar, CEO et Founder d'AdStack.</p>

      <p>J'ai lancé AdStack parce que je voyais des vendeurs comme toi perdre des heures chaque semaine à essayer de sortir des images publicitaires génériques — pendant que leurs concurrents scalent tranquillement avec des visuels qui sont faits pour vendre.</p>

      <p>L'idée est simple : tu nous donnes ton produit, on t'envoie des images prêtes à lancer chaque semaine. Toi tu te concentres sur gérer ton business.</p>

      <p>3 trucs pour bien démarrer :</p>

      <p>
        1. <a href="https://adstackofficial.com/adboard/products" style="color:#2D7FF9;">Crée ton premier produit</a><br>
        2. <a href="https://adstackofficial.com/adboard/products" style="color:#2D7FF9;">Demande des images</a><br>
        3. <a href="https://adstackofficial.com/adboard/offers" style="color:#2D7FF9;">Découvre nos offres</a>
      </p>

      <p style="margin-top:24px;">Amar<br>
      <span style="color:#888;">CEO et Founder, AdStack</span></p>
    </div>
  `;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'AdStack <contact@adstackofficial.com>',
        to: [email],
        reply_to: 'amarbiranediaw@gmail.com',
        subject: 'Bienvenue sur AdBoard — j\'ai une question pour toi',
        html,
      })
    });
    if (!r.ok) {
      const errText = await r.text();
      console.error('[Email] Échec welcome email:', r.status, errText.slice(0,200));
    } else {
      console.log(`[Email] ✅ Welcome email envoyé à ${email}`);
    }
  } catch(e) {
    console.error('[Email] Erreur welcome email:', e.message);
  }
}

// Activer un abonnement dans Supabase (upsert)
async function activateSubscription(userId, plan, cycle, creditsPerWeek, priceFcfa, prixImg, email, name) {
  const now = new Date();
  const dureeJours = cycle === 'annual' ? 365 : 30;
  const expiresAt = new Date(now.getTime() + dureeJours * 24 * 60 * 60 * 1000);
  const r = await fetch(`${SUPABASE_URL_INT}/rest/v1/subscriptions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Prefer': 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify({
      user_id: userId,
      plan: plan,
      cycle: cycle,
      credits_per_week: creditsPerWeek,
      active: true,
      started_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
    })
  });
  const data = await r.json();
  console.log(`[Chariow] ✅ Abonnement activé: ${userId} → ${plan} (${cycle}, expire le ${expiresAt.toISOString()})`);

  // Log permanent de CE paiement précis — jamais écrasé, contrairement à "subscriptions" qui ne
  // garde que l'état courant. Nécessaire pour calculer LTV et fréquence d'achat par client.
  if (priceFcfa) {
    const commission = Math.round(priceFcfa * 0.15);
    try {
      await fetch(`${SUPABASE_URL_INT}/rest/v1/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          user_id: userId, email: email || null, nom: name || null,
          plan, cycle,
          montant_fcfa: priceFcfa,
          commission_chariow_fcfa: commission,
          montant_net_fcfa: priceFcfa - commission,
        })
      });
    } catch(e) { console.error('[Transactions] Erreur log:', e.message); }
  }

  // Envoi email + facture (non bloquant, ne casse pas l'activation si ça échoue)
  if (email && priceFcfa) {
    sendPaymentConfirmationEmail({ email, name, plan, cycle, creditsPerWeek, prixImg, priceFcfa, paymentDate: now, expiresAt }).catch(e => {
      console.error('[Email] Échec non bloquant:', e.message);
    });
  }
  // Notification push + trace persistante — confirmation abonnement
  notifyUserBoth(userId, {
    title: '✅ Abonnement confirmé',
    body: `Ton plan ${PLAN_LABELS[plan] || plan} est actif. Tu peux demander tes visuels dès maintenant.`,
    url: '/adboard/products',
    type: 'payment',
  }).catch(()=>{});

  return data;
}

// Trouver un user Supabase par email
// Traite l'attribution CRM au moment d'un achat confirmé — marque automatiquement le prospect
// correspondant comme "acheteur" et enregistre quel message (démo/J+3/J+10/J+21) l'a converti.
// Ne fait rien si l'utilisateur n'a pas d'attribution attachée (ex: compte créé avant cette
// fonctionnalité, ou arrivé par un autre canal que nos liens traqués).
async function traiterAttributionCRM(userId) {
  try {
    const r = await fetch(`${SUPABASE_URL_INT}/auth/v1/admin/users/${userId}`, {
      headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` }
    });
    if (!r.ok) { console.warn('[Attribution CRM] Utilisateur introuvable:', userId); return; }
    const user = await r.json();
    const prospectId = user?.user_metadata?.crm_prospect_id;
    const campagne   = user?.user_metadata?.crm_last_campaign;
    if (!prospectId) {
      console.log('[Attribution CRM] Aucune attribution pour cet utilisateur — achat non lié à un prospect CRM');
      return;
    }

    const pRes = await fetch(`${SUPABASE_URL_INT}/rest/v1/prospects?id=eq.${prospectId}&select=id,notes,statut`, {
      headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` }
    });
    const prospects = await pRes.json();
    const prospect = prospects?.[0];
    if (!prospect) { console.warn('[Attribution CRM] Prospect introuvable:', prospectId); return; }

    let notes = {};
    try { notes = JSON.parse(prospect.notes || '{}'); } catch(e) {}
    notes.conversion_campagne = campagne || 'inconnue';
    notes.conversion_date = new Date().toISOString();

    await fetch(`${SUPABASE_URL_INT}/rest/v1/prospects?id=eq.${prospectId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ statut: 'acheteur', notes: JSON.stringify(notes) })
    });
    console.log(`[Attribution CRM] ✅ Prospect ${prospectId} marqué acheteur — converti via "${campagne}"`);
  } catch(e) {
    console.error('[Attribution CRM] Erreur:', e.message);
  }
}

async function findUserByEmail(email) {
  if (!email) return null;
  // ⚠️ L'API Admin Supabase ignore silencieusement ?email=... et renvoie TOUS les utilisateurs.
  // On doit donc filtrer nous-mêmes, sinon on récupère un utilisateur au hasard (bug confirmé, cf. supabase/supabase#29832).
  const r = await fetch(`${SUPABASE_URL_INT}/auth/v1/admin/users?per_page=1000`, {
    headers: {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    }
  });
  const data = await r.json();
  const users = data?.users || [];
  const normalizedTarget = email.trim().toLowerCase();
  const match = users.find(u => u.email?.trim().toLowerCase() === normalizedTarget);
  return match || null;
}

// ── HTTP Server ────────────────────────────────
const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, ngrok-skip-browser-warning, Authorization, X-Api-Key');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  // GET / → redirect vers le site web systeme.io
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    res.writeHead(302, { 'Location': 'https://thefirstquality01.systeme.io/' });
    res.end();
    return;
  }

  // GET /health — Usine server status
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  // GET /master-creative — serve MASTER_CREATIVE.md from server directory
  if (req.method === 'GET' && (req.url === '/master-creative' || req.url === '/master-creative.md')) {
    const candidates = [
      path.join(__dirname, 'MASTER_CREATIVE.md'),
      path.join(__dirname, '..', 'MASTER_CREATIVE.md')
    ];
    const found = candidates.find(p => fs.existsSync(p));
    if (found) {
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(fs.readFileSync(found, 'utf8'));
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('MASTER_CREATIVE.md not found');
    }
    return;
  }

  // GET /factory → AdStack Usine platform
  // Cherche tout fichier adstack_usine_v0*.html dans le dossier (peu importe le suffixe)
  if (req.method === 'GET' && (req.url === '/factory' || req.url === '/factory/')) {
    let usineFile = null;
    try {
      const files = fs.readdirSync(__dirname);
      const matches = files.filter(f => /^adstack_usine_v0.*\.html$/i.test(f));
      if (matches.length > 0) {
        matches.sort((a, b) => {
          const sa = fs.statSync(path.join(__dirname, a)).mtimeMs;
          const sb = fs.statSync(path.join(__dirname, b)).mtimeMs;
          return sb - sa;
        });
        usineFile = path.join(__dirname, matches[0]);
        console.log(`→ Serving: ${matches[0]}`);
      }
    } catch(e) {
      console.error('readdirSync error:', e.message);
    }

    if (usineFile && fs.existsSync(usineFile)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(fs.readFileSync(usineFile));
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(HTML_CONTENT);
    }
    return;
  }

  // ── POST /save-mindmap — save personalized mindmap HTML (+ OG preview image/meta), return permanent URL ──
  if (req.method === 'POST' && req.url === '/save-mindmap') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        const { html, productName, marque, ogTitle, score } = JSON.parse(body);
        if (!html || typeof html !== 'string') throw new Error('html field required');
        if (html.length > 50_000_000) throw new Error('HTML too large (max 50MB)');

        // Slug: marque + produit + id court → ex: adstack-the-anti-diabetique-kp3x
        const marqueSlug = slugify(marque || 'adstack');
        const produitSlug = slugify(productName || 'demo');
        const id = randomId(6);
        const filename = `${marqueSlug}-${produitSlug}-${id}`;
        const filepath = path.join(MINDMAPS_DIR, `${filename}.html`);
        const url = `${PUBLIC_URL}/demo/${filename}`;

        let finalHtml = html;

        // ── Image OG (miniature WhatsApp/réseaux) — teaser généré server-side, style mindmap ──
        try {
          const svg = buildTeaserSvg({ marque: marque || productName, score });
          const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
          const imgFilename = `${filename}.png`;

          // Sauvegarder en local (fallback)
          fs.writeFileSync(path.join(MINDMAPS_DIR, imgFilename), png);

          // ── Upload vers Supabase Storage (URL permanente, indépendante du serveur) ──
          let ogImageUrl = `${PUBLIC_URL}/demo/${imgFilename}`; // fallback local
          try {
            const SB_URL = 'https://mifljhsusidgzelnswma.supabase.co';
            const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pZmxqaHN1c2lkZ3plbG5zd21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MjI2MzQsImV4cCI6MjA5MzQ5ODYzNH0.AX4Xu0sP2tgjLhZSbCKhtw4Q3sd7GRMJ2aMKK3GfzUc';
            const sbHeaders = { 'Authorization': `Bearer ${SB_KEY}`, 'apikey': SB_KEY };

            // Créer le bucket s'il n'existe pas
            await new Promise((res) => {
              const body = JSON.stringify({ id: 'demos', name: 'demos', public: true });
              const r = https.request({
                hostname: 'mifljhsusidgzelnswma.supabase.co',
                path: '/storage/v1/bucket',
                method: 'POST',
                headers: { ...sbHeaders, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
              }, resp => { resp.on('data', ()=>{}); resp.on('end', res); });
              r.on('error', res); r.write(body); r.end();
            });

            // Upload du PNG
            const uploadRes = await new Promise((resolve, reject) => {
              const r = https.request({
                hostname: 'mifljhsusidgzelnswma.supabase.co',
                path: `/storage/v1/object/demos/${imgFilename}`,
                method: 'POST',
                headers: { ...sbHeaders, 'Content-Type': 'image/png', 'Content-Length': png.length, 'x-upsert': 'true' }
              }, resp => {
                let d = '';
                resp.on('data', c => d += c);
                resp.on('end', () => resolve({ status: resp.statusCode, body: d }));
              });
              r.on('error', reject); r.write(png); r.end();
            });

            if (uploadRes.status === 200 || uploadRes.status === 201) {
              ogImageUrl = `${SB_URL}/storage/v1/object/public/demos/${imgFilename}`;
              console.log(`   → OG image Supabase : ${ogImageUrl}`);
            } else {
              console.log(`   ⚠️  Supabase upload échoué (${uploadRes.status}) : ${uploadRes.body.substring(0,100)}`);
            }
          } catch(sbErr) {
            console.log(`   ⚠️  Supabase upload erreur : ${sbErr.message}`);
          }

          const escAttr = (s) => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
          const ogTitleStr = ogTitle || (marque ? `${marque} — Démo AdStack` : (productName || 'AdStack'));
          const ogDescStr  = `Analyse de marché, persona cible et créatives Meta Ads sur-mesure. Score potentiel : ${score}/100.`;
          const metaTags = `
    <meta property="og:type" content="website">
    <meta property="og:title" content="${escAttr(ogTitleStr)}">
    <meta property="og:description" content="${escAttr(ogDescStr)}">
    <meta property="og:image" content="${ogImageUrl}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:type" content="image/png">
    <meta property="og:url" content="${url}">
    <meta property="og:site_name" content="AdStack">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escAttr(ogTitleStr)}">
    <meta name="twitter:description" content="${escAttr(ogDescStr)}">
    <meta name="twitter:image" content="${ogImageUrl}">
    <meta name="description" content="${escAttr(ogDescStr)}">
    <script>
      // Redirect humains vers AdBoard — seulement si PAS dans un iframe
      (function(){
        if (window.self !== window.top) return; // dans un iframe = ne pas redirect
        var ua = navigator.userAgent || '';
        var isBot = /WhatsApp|facebookexternalhit|Facebot|Twitterbot|LinkedInBot|Googlebot|Slackbot|Discordbot/i.test(ua);
        if (!isBot) {
          window.location.replace('/adboard?demo=${filename}');
        }
      })();
    </script>
`;

          if (/<head[^>]*>/i.test(finalHtml)) {
            finalHtml = finalHtml.replace(/<head[^>]*>/i, (m) => m + metaTags);
          } else {
            finalHtml = metaTags + finalHtml;
          }
          console.log(`   → OG teaser généré : ${imgFilename} (${(png.length/1024).toFixed(1)}KB, score ${score})`);
        } catch (e) {
          console.log('   ⚠️  Génération teaser OG échouée (mindmap sauvée sans miniature) :', e.message);
        }

        fs.writeFileSync(filepath, finalHtml, 'utf-8');

        // ── Upload HTML vers Supabase Storage — survit aux redéploiements du serveur (disque Render éphémère) ──
        try {
          const SB_URL = 'https://mifljhsusidgzelnswma.supabase.co';
          const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pZmxqaHN1c2lkZ3plbG5zd21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MjI2MzQsImV4cCI6MjA5MzQ5ODYzNH0.AX4Xu0sP2tgjLhZSbCKhtw4Q3sd7GRMJ2aMKK3GfzUc';
          const sbHeaders = { 'Authorization': `Bearer ${SB_KEY}`, 'apikey': SB_KEY };
          const htmlBuffer = Buffer.from(finalHtml, 'utf-8');

          // Créer le bucket s'il n'existe pas (idempotent, indépendant du bloc image OG plus haut)
          await new Promise((res) => {
            const bBody = JSON.stringify({ id: 'demos', name: 'demos', public: true });
            const r = https.request({
              hostname: 'mifljhsusidgzelnswma.supabase.co',
              path: '/storage/v1/bucket',
              method: 'POST',
              headers: { ...sbHeaders, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(bBody) }
            }, resp => { resp.on('data', ()=>{}); resp.on('end', res); });
            r.on('error', res); r.write(bBody); r.end();
          });

          const uploadRes = await new Promise((resolve, reject) => {
            const r = https.request({
              hostname: 'mifljhsusidgzelnswma.supabase.co',
              path: `/storage/v1/object/demos/${filename}.html`,
              method: 'POST',
              headers: { ...sbHeaders, 'Content-Type': 'text/html; charset=utf-8', 'Content-Length': htmlBuffer.length, 'x-upsert': 'true' }
            }, resp => {
              let d = '';
              resp.on('data', c => d += c);
              resp.on('end', () => resolve({ status: resp.statusCode, body: d }));
            });
            r.on('error', reject); r.write(htmlBuffer); r.end();
          });

          if (uploadRes.status === 200 || uploadRes.status === 201) {
            console.log(`   → HTML sauvegardé sur Supabase (survit aux redéploiements) : ${filename}.html`);
          } else {
            console.log(`   ⚠️  Upload HTML Supabase échoué (${uploadRes.status}) : ${uploadRes.body.substring(0,100)}`);
          }
        } catch(sbErr) {
          console.log(`   ⚠️  Upload HTML Supabase erreur : ${sbErr.message}`);
        }

        console.log(`✓ Mindmap saved: ${filename}.html (${(finalHtml.length/1024).toFixed(1)}KB)`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ url, slug: filename }));
      } catch(e) {
        console.error('save-mindmap error:', e.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // ── GET /demo/:slug(.ext) — serve a saved mindmap or its OG preview image ──
  if (req.method === 'GET' && req.url.startsWith('/demo/')) {
    const raw = req.url.slice(6).split('?')[0].replace(/[^a-zA-Z0-9\-.]/g, '');
    const ext = path.extname(raw).toLowerCase();
    const contentTypes = { '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png', '.webp':'image/webp' };

    if (ext && contentTypes[ext]) {
      // Image OG (miniature WhatsApp/réseaux)
      const filepath = path.join(MINDMAPS_DIR, raw);
      if (fs.existsSync(filepath)) {
        res.writeHead(200, { 'Content-Type': contentTypes[ext], 'Cache-Control': 'public, max-age=86400' });
        res.end(fs.readFileSync(filepath));
      } else {
        res.writeHead(404); res.end('Not found');
      }
      return;
    }

    // Mindmap HTML (slug sans extension)
    const slug = raw.replace(/\.[^.]*$/, '');
    const filepath = path.join(MINDMAPS_DIR, `${slug}.html`);
    if (fs.existsSync(filepath)) {
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600'
      });
      res.end(fs.readFileSync(filepath));
      return;
    }

    // ── Fallback Supabase — le fichier local a disparu (redéploiement du serveur = disque effacé) ──
    const notFoundHtml = '<h1 style="font-family:sans-serif;color:#999;text-align:center;padding:80px;">Mindmap introuvable ou expirée</h1>';
    const supabaseHtmlUrl = `https://mifljhsusidgzelnswma.supabase.co/storage/v1/object/public/demos/${slug}.html`;
    https.get(supabaseHtmlUrl, sbRes => {
      if (sbRes.statusCode === 200) {
        let chunks = [];
        sbRes.on('data', c => chunks.push(c));
        sbRes.on('end', () => {
          res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=3600'
          });
          res.end(Buffer.concat(chunks));
        });
      } else {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(notFoundHtml);
      }
    }).on('error', () => {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(notFoundHtml);
    });
    return;
  }

  // ── Prospection auto — relais vers le wrapper local (PC via tunnel Cloudflare) ──
  const PROSPECTOR_URL = 'https://prospector.adstackofficial.com';
  const PROSPECTOR_KEY = 'adstack2024xProspectionKey99';

  function relayToProspector(path, method, res) {
    console.log(`[Prospector Relay] ${method} ${path} → ${PROSPECTOR_URL}${path}`);
    const target = new URL(PROSPECTOR_URL + path);
    const options = {
      hostname: target.hostname,
      path: target.pathname + target.search,   // .search inclus — sinon ?since=X est perdu
      method,
      headers: { 'X-Api-Key': PROSPECTOR_KEY }
    };
    const r = https.request(options, pRes => {
      let body = '';
      pRes.on('data', c => body += c);
      pRes.on('end', () => {
        console.log(`[Prospector Relay] Réponse ${pRes.statusCode} : ${body.slice(0, 150)}`);
        res.writeHead(pRes.statusCode || 200, {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
        });
        res.end(body || '{}');
      });
    });
    r.on('error', (e) => {
      console.log(`[Prospector Relay] ⚠️  Erreur réseau : ${e.message}`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ running: false, error: 'PC hors ligne ou tunnel arrêté : ' + e.message }));
    });
    r.setTimeout(15000, () => {
      console.log('[Prospector Relay] ⚠️  Timeout — PC probablement hors ligne');
      r.destroy(new Error('Timeout — PC probablement hors ligne'));
    });
    r.end();
  }

  if (req.method === 'POST' && req.url.startsWith('/prospector/start')) {
    relayToProspector(req.url, 'POST', res);
    return;
  }
  if (req.method === 'POST' && req.url.startsWith('/prospector/stop')) {
    relayToProspector(req.url, 'POST', res);
    return;
  }
  if (req.method === 'GET' && req.url.startsWith('/prospector/status')) {
    relayToProspector(req.url, 'GET', res);
    return;
  }

  // Generate endpoint
  if (req.method === 'POST' && req.url === '/generate') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        const reqBody = JSON.parse(body);
        console.log('→ Getting token...');
        const token = await getToken();
        console.log('✓ Token OK');

        console.log(`→ Calling ${MODEL}...`);
        const vertexBody = {
          contents: [{ role: 'user', parts: reqBody.contents[0].parts }],
          generationConfig: { responseModalities: ['IMAGE', 'TEXT'] }
        };
        const data = await vertexRequest(token, MODEL, vertexBody);

        if (data.error) throw new Error(data.error.message);

        const parts = data.candidates?.[0]?.content?.parts || [];
        const img = parts.find(p => (p.inlineData || p.inline_data)?.mimeType?.startsWith('image/') || (p.inlineData || p.inline_data)?.mime_type?.startsWith('image/'));
        if (!img) throw new Error('Pas d\'image dans la réponse Vertex AI.');

        const d = img.inlineData || img.inline_data;
        console.log(`✓ Image reçue — ${MODEL}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ model: MODEL, imageData: d.data, imageMime: d.mimeType || d.mime_type }));
      } catch(e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }


  // ── Text Generation endpoint (Prompt Engine) ──
  if (req.method === 'POST' && req.url === '/generate-text') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        const reqBody = JSON.parse(body);
        console.log('→ Getting token (text gen)...');
        const token = await getToken();
        console.log('✓ Token OK');

        const model = reqBody.model || 'gemini-2.5-flash';
        console.log(`→ Calling ${model} (text)...`);
        const vertexBody = {
          system_instruction: { parts: [{ text: reqBody.system }] },
          contents: [{ role: 'user', parts: reqBody.parts }],
          generationConfig: {
            temperature: reqBody.temperature !== undefined ? reqBody.temperature : 0.7,
            maxOutputTokens: reqBody.maxOutputTokens || reqBody.maxTokens || 32000
          }
        };

        const data = await vertexRequest(token, model, vertexBody);
        if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (!text) throw new Error('Pas de texte dans la réponse Vertex AI.');

        console.log('✓ Texte reçu — gemini-2.5-flash');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ text }));
      } catch(e) {
        console.error('✗ Erreur text gen:', e.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // ── Analyze endpoint — Claude Sonnet 4.6 (no Google OAuth needed) ──
  if (req.method === 'POST' && req.url === '/analyze') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        const reqBody = JSON.parse(body);
        console.log('→ Calling Claude Haiku 4.5 (endpoint /analyze)...');

        const claudeBody = JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: reqBody.maxOutputTokens || reqBody.maxTokens || 16000,
          system: reqBody.system,
          messages: [{ role: 'user', content: reqBody.parts || reqBody.prompt || '' }]
        });

        const https = require('https');
        const result = await new Promise((resolve, reject) => {
          const options = {
            hostname: 'api.anthropic.com',
            path: '/v1/messages',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': ANTHROPIC_KEY,
              'anthropic-version': '2023-06-01',
              'Content-Length': Buffer.byteLength(claudeBody)
            }
          };
          const r = https.request(options, res => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
              try {
                const parsed = JSON.parse(data);
                if (parsed.error) return reject(new Error(parsed.error.message));
                const text = parsed.content?.find(b => b.type === 'text')?.text || '';
                resolve(text);
              } catch(e) { reject(e); }
            });
          });
          r.on('error', reject);
          r.write(claudeBody);
          r.end();
        });

        console.log('✓ Claude Haiku 4.5 analyse terminée —', result.length, 'chars');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ text: result }));
      } catch(e) {
        console.error('✗ Analyse error:', e.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // ── URL Fetcher endpoint (Synthesis Tool) ─────
  if (req.method === 'POST' && req.url === '/fetch-url') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        const { url } = JSON.parse(body);
        if (!url || !url.startsWith('http')) throw new Error('URL invalide');
        console.log(`→ Fetching URL: ${url}`);
        const text = await fetchPageText(url);
        console.log(`✓ URL fetched — ${text.length} chars`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ text }));
      } catch(e) {
        console.error('✗ Fetch URL error:', e.message);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ text: '', error: e.message }));
      }
    });
    return;
  }

  // ── Synthesis endpoint (Gemini + Google Search grounding) ──
  if (req.method === 'POST' && req.url === '/synthesize') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        const reqBody = JSON.parse(body);
        // Détecter si c'est l'appel Stratège (1ère synthèse) ou un agent secondaire (Mindmap)
        // L'agent Mindmap envoie enrichWithSearch:false OU son prompt contient SYNTHÈSE COMPLÈTE
        const isSecondaryAgent = reqBody.enrichWithSearch === false
          || (reqBody.parts || []).some(p => typeof p.text === 'string' && p.text.includes('SYNTHÈSE COMPLÈTE'));
        const enrichWithSearch = !isSecondaryAgent;
        console.log('→ Getting token (synthesis)...');
        const token = await getToken();
        console.log('✓ Token OK');

        // Extraire l'URL depuis les parts et la fetcher côté serveur (Stratège uniquement)
        const _partsText = (reqBody.parts || []).map(p => p.text || '').join(' ');
        const _urlMatchSynth = enrichWithSearch ? _partsText.match(/https?:\/\/[^\s\n"]+/) : null;
        const _synthUrl = _urlMatchSynth ? _urlMatchSynth[0].replace(/[.,;)]+$/, '') : '';
        let _pageInsert = '';
        if (_synthUrl) {
          console.log(`\n→ [DEMO Stratège] Fetch page produit : ${_synthUrl}`);
          try {
            const _pageHtml = await fetchRawHtml(_synthUrl);
            const _pageText = _pageHtml
              .replace(/<script[\s\S]*?<\/script>/gi, '')
              .replace(/<style[\s\S]*?<\/style>/gi, '')
              .replace(/<[^>]+>/g, ' ')
              .replace(/\s{3,}/g, '\n')
              .slice(0, 5000);
            if (_pageText.length > 100) {
              _pageInsert = `\n\n### PAGE PRODUIT OFFICIELLE (${_synthUrl}) :\n${_pageText}\n`;
              console.log(`   ✓ ${_pageText.length} chars extraits`);
            }
          } catch(e) {
            _pageInsert = `\n\n### PAGE PRODUIT (${_synthUrl}) :\nURL fournie mais non accessible. Utilise Google Search pour trouver le contenu de cette page.\n`;
            console.log(`   ✗ fetch échoué : ${e.message}`);
          }
        }
        // Injecter dans le dernier part texte
        let _lastTextIdx = -1;
        (reqBody.parts || []).forEach((p, i) => { if (typeof p.text === 'string') _lastTextIdx = i; });
        const _enrichedParts = (reqBody.parts || []).map((p, i) =>
          i === _lastTextIdx ? { ...p, text: p.text + _pageInsert } : p
        );

        console.log(enrichWithSearch ? '→ Calling gemini-2.5-flash + Google Search grounding...' : '→ Calling gemini-2.5-flash (pas de Search — agent secondaire)...');
        const vertexBody = {
          system_instruction: { parts: [{ text: reqBody.system }] },
          contents: [{ role: 'user', parts: _enrichedParts }],
          generationConfig: { temperature: 0.8, maxOutputTokens: 8192 }
        };
        if (enrichWithSearch) {
          vertexBody.tools = [{ googleSearch: {} }];
        }

        const data = await vertexRequest(token, 'gemini-2.5-flash', vertexBody);
        if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (!text) throw new Error('Pas de texte dans la réponse');

        console.log(enrichWithSearch ? `✓ Synthèse générée — ${text.length} chars` : `✓ Réponse Gemini — ${text.length} chars`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ text }));
      } catch(e) {
        console.error('✗ Synthesis error:', e.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }


  // ── Copywriter : Claude Sonnet 4.6 text-only (sans image, sans grounding) ──
  if (req.method === 'POST' && req.url === '/copywriter') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        const reqBody = JSON.parse(body);
        const { system, parts, maxOutputTokens } = reqBody;

        console.log('\n' + '═'.repeat(60));
        console.log('✍️  COPYWRITER — Ad Copy 3 angles × (5 hooks + AIDA)');
        console.log('═'.repeat(60));

        // Conversion format Gemini-like (parts: [{text}]) → format blocs (callGeminiPro accepte les deux)
        const claudeContent = (parts || []).map(p => {
          if (typeof p.text === 'string') return { type: 'text', text: p.text };
          return p;
        });

        console.log('→ Gemini 2.5 Pro (mode test) — génération des Ad Copy...');
        const text = await callGeminiPro(system, claudeContent, maxOutputTokens || 8000, { temperature: 0.4, logLabel: 'Copywriter' });

        console.log(`✓ Ad Copy générés — ${text.length} chars`);
        console.log('═'.repeat(60) + '\n');

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ text }));
      } catch(e) {
        console.error('✗ Copywriter error:', e.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }


  // ── Analyste de Marché : recherche multi-sources + synthèse Gemini 2.5 Pro (Sonnet 4.6 non connecté actuellement) ──
  if (req.method === 'POST' && req.url === '/analyste-synthese') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        const reqBody = JSON.parse(body);
        const { system, parts, maxOutputTokens, brief } = reqBody;
        const { marque = '', produit = '', pays = '', lien_page_produit = '' } = brief || {};

        console.log('\n' + '═'.repeat(60));
        console.log(`🔍 ANALYSTE DE MARCHÉ — ${marque} / ${produit} (${pays})`);
        console.log('═'.repeat(60));

        // ── SOURCE 1/5 — Gemini 2.5 Flash + Google Search grounding ──
        console.log('\n[1/5] Gemini Search grounding (recherche multi-source enrichie)...');
        let donneesBrutes = '';
        try {
          const token = await getToken();
          const researchPrompt = `Tu es un analyste de marché senior. Tu mènes une recherche APPROFONDIE et MULTI-SOURCE sur le produit "${produit}" de la marque "${marque}" vendu en ${pays}.

OBJECTIF : ramener un MAXIMUM de DATA RÉELLE et de VERBATIMS clients authentiques — pas de paraphrase, pas de généralités. Cite les sources URL précises trouvées et les extraits textuels exacts (entre guillemets quand c\'est un verbatim).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DOMAINES À EXPLORER EN PRIORITÉ (utilise site: dans tes recherches Google)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   • ${TARGET_DOMAINS_HINT}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PLAN DE RECHERCHE (effectue PLUSIEURS requêtes Google distinctes pour couvrir chaque axe)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

0. PAGE PRODUIT OFFICIELLE : ${lien_page_produit ? `accède à cette URL et extrais son contenu exact (prix, ingrédients, descriptions, avis) : ${lien_page_produit}` : '(non fourni)'}
1. AVIS PRODUIT EXACT : "${produit}" "${marque}" + avis OU reviews OU "ça marche" (pays ${pays})
2. AVIS CATÉGORIE : "${produit}" + verbatims/témoignages (élargis à la catégorie produit, francophone)
3. REDDIT : "${produit}" reddit OR sous-reddits liés (ex : r/Skincareaddiction, r/Nutrition, r/Senegal, r/CoteDIvoire)
4. TRUSTPILOT : recherche avis sur "${marque}" + 2-3 concurrents directs identifiés
5. ALIEXPRESS / AMAZON : reviews sur produits équivalents de la catégorie — extraits 1★ ET 5★
6. X/TWITTER : mentions "${marque}" + hashtags liés à la catégorie + pays ${pays}
7. PRIX LOCAL ET CONCURRENTS : prix observés en ${pays} (devise locale) sur Jumia, sites locaux, groupes Facebook
8. CONTEXTE CULTUREL PAYS : comment cette catégorie de produit est perçue/consommée dans ${pays}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ GARDE-FOU CRITIQUE — NE JAMAIS MÉLANGER PRODUIT EXACT ET CATÉGORIE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Les étapes 1 à 6 élargissent volontairement aux avis de la CATÉGORIE (produits similaires,
pas forcément identiques) pour collecter des verbatims et du contexte. C'est voulu. MAIS deux
informations ne doivent JAMAIS venir de cette recherche élargie, UNIQUEMENT de la page produit
officielle (étape 0) :
- LE PRIX : toujours dans la devise locale exacte vue sur la page produit officielle (${pays}).
  Ne JAMAIS reporter un prix vu sur AliExpress/Amazon (souvent en USD) comme étant le prix du
  produit — ces sites servent uniquement à trouver des avis sur des produits comparables, jamais
  à déterminer le prix. Si le prix n'est pas visible sur la page produit officielle, écris
  explicitement [PRIX NON TROUVÉ SUR LA PAGE OFFICIELLE] plutôt que d'utiliser un prix externe.
- LE PROBLÈME PRINCIPAL RÉSOLU : uniquement ce qui est écrit sur la page produit officielle
  elle-même (titre, description, bénéfices annoncés). Ne JAMAIS déduire ou emprunter le problème
  résolu depuis un avis trouvé sur un produit similaire de la catégorie — un produit "brûleur de
  graisse" et un produit "anti-douleur" peuvent apparaître dans les mêmes recherches élargies
  sans être le même produit ni résoudre le même problème.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FORMAT DE TON OUTPUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Organise en sections (## AVIS PRODUIT, ## VERBATIMS REDDIT, ## VERBATIMS TRUSTPILOT, ## VERBATIMS ALIEXPRESS/AMAZON, ## VERBATIMS X-TWITTER, ## PRIX LOCAL ET CONCURRENTS, ## CONTEXTE CULTUREL).

Pour chaque verbatim ramené : cite la phrase exacte entre guillemets + l'URL de la source + (si possible) le pseudo de l'auteur. Si une section retourne ZÉRO résultat exploitable, écris explicitement [AUCUN VERBATIM TROUVÉ] pour cette section — ne fabrique rien.

Cible : 1500-3000 mots de DATA BRUTE. Pas de synthèse, pas d'interprétation — c\'est le rôle de l'analyste qui te suit, pas le tien.`;
          const geminiBody = {
            contents: [{ role: 'user', parts: [{ text: researchPrompt }] }],
            tools: [{ googleSearch: {} }],
            generationConfig: { temperature: 0.2, maxOutputTokens: 8000 }
          };
          const data = await vertexRequest(token, 'gemini-2.5-flash', geminiBody);
          if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));

          const cand = data.candidates?.[0];
          const text = (cand?.content?.parts || []).map(p => p.text).filter(Boolean).join('\n');
          const queries = cand?.groundingMetadata?.webSearchQueries || [];
          const sources = (cand?.groundingMetadata?.groundingChunks || [])
            .map(c => c.web?.uri).filter(Boolean);

          console.log(`   → ${queries.length} requête(s) Google distincte(s) effectuée(s) par Gemini`);
          queries.slice(0, 10).forEach(q => console.log(`      • ${q}`));
          console.log(`   → ${sources.length} source(s) web ramenée(s)`);
          sources.slice(0, 8).forEach(s => console.log(`      • ${s}`));

          if (text) {
            donneesBrutes += `### SOURCE — RECHERCHE GEMINI GROUNDING (multi-source enrichie)\nRequêtes effectuées : ${queries.join(' | ') || 'n/a'}\nSources URL : ${sources.slice(0,10).join(' | ') || 'n/a'}\n\n${text}\n`;
            console.log(`   ✓ ${text.length} chars de data brute récupérée`);
          } else {
            console.log('   ✗ aucune donnée retournée par Gemini');
          }
        } catch (e) {
          console.log('   ✗ erreur Gemini :', e.message);
        }

        // ── SOURCE 2/5 — Google Trends (requêtes associées) ──
        console.log('\n[2/5] Google Trends...');
        try {
          const geo = PAYS_TO_GEO[pays] || '';
          const googleTrends = require('google-trends-api');
          const raw = await googleTrends.relatedQueries({ keyword: produit, geo, hl: 'fr' });
          const j = JSON.parse(raw);
          const ranked = j?.default?.rankedList?.[0]?.rankedKeyword || [];
          const top = ranked.slice(0, 8).map(k => k.query);
          console.log(`   → geo=${geo || '(monde)'}, ${top.length} requête(s) associée(s)`);
          top.forEach(q => console.log(`      • ${q}`));
          if (top.length) {
            donneesBrutes += `### SOURCE — GOOGLE TRENDS (requêtes associées, ${geo || 'monde'})\n${top.join(', ')}\n\n`;
          } else {
            console.log('   ✗ aucune requête associée trouvée');
          }
        } catch (e) {
          const hint = e.message.includes('Cannot find module') ? ' — exécute : npm install google-trends-api' : '';
          console.log('   ✗ erreur Trends :', e.message + hint);
        }

        // ── SOURCE 3/5 — YouTube (recherche + commentaires) ──
        console.log('\n[3/5] YouTube Data API...');
        try {
          let ytQuery = `${produit} ${marque} avis test`;
          let ytQ = encodeURIComponent(ytQuery);
          let searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=3&relevanceLanguage=fr&q=${ytQ}&key=${YOUTUBE_API_KEY}`;
          let searchData = await httpsGetJson(searchUrl);
          if (searchData.error) throw new Error(searchData.error.message);
          let videos = searchData.items || [];
          console.log(`   → ${videos.length} vidéo(s) trouvée(s) pour "${ytQuery}"`);

          if (!videos.length) {
            // Fallback : élargir en retirant la marque (l'ingrédient/produit seul est souvent plus connu)
            ytQuery = `${produit} avis`;
            ytQ = encodeURIComponent(ytQuery);
            searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=3&relevanceLanguage=fr&q=${ytQ}&key=${YOUTUBE_API_KEY}`;
            searchData = await httpsGetJson(searchUrl);
            if (searchData.error) throw new Error(searchData.error.message);
            videos = searchData.items || [];
            console.log(`   → élargi à "${ytQuery}" : ${videos.length} vidéo(s) trouvée(s)`);
          }
          videos.forEach(v => console.log(`      • ${v.snippet.title}`));

          let allComments = [];
          for (const v of videos.slice(0, 2)) {
            try {
              const cUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&order=relevance&maxResults=10&videoId=${v.id.videoId}&key=${YOUTUBE_API_KEY}`;
              const cData = await httpsGetJson(cUrl);
              if (cData.error) throw new Error(cData.error.message);
              const comments = (cData.items || []).map(c => c.snippet.topLevelComment.snippet.textOriginal);
              allComments.push(...comments);
            } catch (e) {
              console.log(`      ✗ commentaires indisponibles (${v.snippet.title.slice(0,40)}...) :`, e.message);
            }
          }
          console.log(`   → ${allComments.length} commentaire(s) récupéré(s)`);
          if (allComments.length) {
            donneesBrutes += `### SOURCE — YOUTUBE (commentaires, ${videos.length} vidéo(s) sur "${ytQuery}")\n` +
              allComments.slice(0, 15).map(c => `- "${c.replace(/\n/g, ' ').slice(0, 200)}"`).join('\n') + '\n\n';
          }
        } catch (e) {
          console.log('   ✗ erreur YouTube :', e.message);
        }

        // ── SOURCE 4/5 — Jumia (prix + produits concurrents) ──
        console.log('\n[4/5] Jumia...');
        try {
          const tld = PAYS_TO_JUMIA_TLD[pays];
          if (!tld) {
            console.log(`   ✗ Jumia non disponible pour "${pays}" — source ignorée`);
          } else {
            const jq = encodeURIComponent(produit);
            const jumiaUrl = `https://www.jumia.${tld}/catalog/?q=${jq}`;
            console.log(`   → ${jumiaUrl}`);
            const html = await fetchRawHtml(jumiaUrl);
            console.log(`   → ${html.length} chars HTML reçus`);
            const names = [...html.matchAll(/<h3[^>]*class="[^"]*name[^"]*"[^>]*>([^<]+)<\/h3>/gi)].map(m => m[1].trim());
            const prices = [...html.matchAll(/<div[^>]*class="[^"]*prc[^"]*"[^>]*>([^<]+)<\/div>/gi)].map(m => m[1].trim());
            console.log(`   → ${names.length} produit(s) trouvé(s)`);
            const items = names.slice(0, 8).map((n, i) => `${n} — ${prices[i] || 'prix ?'}`);
            items.forEach(it => console.log(`      • ${it}`));
            if (items.length) {
              donneesBrutes += `### SOURCE — JUMIA ${pays} (jumia.${tld})\n${items.join('\n')}\n\n`;
            } else {
              console.log('   ✗ aucun produit extrait — extrait HTML brut pour debug :');
              console.log('   ' + html.replace(/\s+/g, ' ').slice(0, 600));
            }
          }
        } catch (e) {
          console.log('   ✗ erreur Jumia :', e.message);
        }

        // ── SOURCE 5/5 — Google Custom Search ──
        // Retirée : Custom Search JSON API fermée aux nouveaux projets GCP (et arrêt total prévu 01/2027).
        // Son intention (recherche sur sites ciblés) est repliée dans le prompt de la Source 1 (TARGET_DOMAINS_HINT).
        console.log('\n[5/5] Google Custom Search — retirée (API fermée aux nouveaux projets), repliée dans la Source 1.');

        // ── SOURCE 6 — Page produit client (lien_page_produit du brief) ──
        if (lien_page_produit && lien_page_produit.startsWith('http')) {
          console.log('\n[6/6] Page produit client...');
          console.log(`   → ${lien_page_produit}`);
          try {
            const pageHtml = await fetchRawHtml(lien_page_produit);

            // ── Extraction JSON-LD (prix, offres, disponibilité) ──
            let jsonLdSection = '';
            const jsonLdBlocks = [...pageHtml.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
            for (const block of jsonLdBlocks) {
              try {
                const parsed = JSON.parse(block[1]);
                // Chercher les infos prix/offre dans le JSON-LD
                const extract = JSON.stringify(parsed, null, 2);
                if (extract.match(/price|Price|offer|Offer|availability|priceValidUntil|discount|shippingDetails/i)) {
                  jsonLdSection += extract.slice(0, 1500) + '\n';
                }
              } catch(e) { /* JSON invalide, ignorer */ }
            }

            // ── Regex prix/livraison/promo dans HTML brut ──
            const pricePatterns = [
              // Prix en FCFA, CFA, XOF, EUR, USD, MAD, DZD, etc.
              pageHtml.match(/[\d\s,.]+\s*(?:FCFA|CFA|XOF|EUR|USD|MAD|DZD|GHS|NGN|KES|TND|XAF)\b[^"<]{0,60}/gi),
              // Livraison gratuite / offerte
              pageHtml.match(/(?:livraison|delivery|shipping)\s*(?:gratuite?|offerte?|free|express|24h|48h|72h)[^"<]{0,80}/gi),
              // Réduction, promo, solde
              pageHtml.match(/(?:promo|solde|réduction|discount|offre|remise|rabais|économis)[\w\s:€$%,.FCFA]*[^"<]{0,80}/gi),
              // Prix barré, ancien prix
              pageHtml.match(/(?:avant|ancien|before|was|Était|barrée?)\s*:?\s*[\d\s,.]+\s*(?:FCFA|CFA|EUR|USD|[€$])?[^"<]{0,60}/gi),
              // Bundle / lot
              pageHtml.match(/(?:pack|lot|bundle|kit|2\s*pour|buy\s*\d|achetez?\s*\d)[^"<]{0,100}/gi),
              // Garantie / remboursement
              pageHtml.match(/(?:satisfait?\s*ou\s*remboursé|garantie?|remboursement)[^"<]{0,80}/gi),
            ].filter(Boolean);

            const priceSection = pricePatterns.length > 0
              ? '### INFOS PRIX & OFFRES DÉTECTÉES (HTML brut) :\n' +
                pricePatterns.flat().slice(0, 20).map(s => '- ' + s.trim().replace(/\s+/g,' ')).join('\n') + '\n\n'
              : '';

            // ── Extraction texte visible standard ──
            const title = (pageHtml.match(/<title[^>]*>([^<]+)<\/title>/i) || [])[1]?.trim() || '';
            const metaDesc = (pageHtml.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) || [])[1]?.trim() || '';
            const textContent = pageHtml
              .replace(/<script[\s\S]*?<\/script>/gi, '')
              .replace(/<style[\s\S]*?<\/style>/gi, '')
              .replace(/<[^>]+>/g, ' ')
              .replace(/\s{3,}/g, '\n')
              .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
              .slice(0, 6000);

            if (textContent.length > 100) {
              donneesBrutes += `### SOURCE — PAGE PRODUIT CLIENT (${lien_page_produit})\n`;
              if (title) donneesBrutes += `Titre : ${title}\n`;
              if (metaDesc) donneesBrutes += `Meta description : ${metaDesc}\n`;
              if (jsonLdSection) donneesBrutes += `### DONNÉES STRUCTURÉES JSON-LD (prix, offres) :\n${jsonLdSection}\n`;
              if (priceSection) donneesBrutes += priceSection;
              donneesBrutes += `Contenu extrait :\n${textContent}\n\n`;
              console.log(`   ✓ ${textContent.length} chars extraits + JSON-LD: ${jsonLdSection.length} chars + Patterns prix: ${pricePatterns.flat().length}`);
            } else {
              console.log('   ✗ contenu insuffisant (page vide ou protection anti-bot)');
            }
          } catch(e) {
            console.log('   ✗ erreur fetch page produit :', e.message);
            donneesBrutes += `### SOURCE — PAGE PRODUIT CLIENT (URL présente, non accessible)\nURL : ${lien_page_produit}\nNote : contenu non chargeable (anti-bot ou timeout). L'URL EST bien fournie dans le brief.\n\n`;
            console.log("   → URL notée dans données malgré l'échec");
          }
        } else {
          console.log('\n[6/6] Page produit — absente du brief (lien_page_produit non fourni)');
        }

        // ── Injection de DONNÉES BRUTES dans le bloc texte ──
        const finalDonnees = donneesBrutes || '[Aucune donnée trouvée par les sources externes pour ce produit/marché]';
        const updatedParts = (parts || []).map(p => {
          if (typeof p.text === 'string' && p.text.includes('DONNÉES BRUTES :')) {
            const marker = 'DONNÉES BRUTES :';
            const idx = p.text.indexOf(marker);
            const before = p.text.slice(0, idx + marker.length);
            return { text: before + '\n' + finalDonnees };
          }
          return p;
        });

        // ── Conversion format Gemini (inline_data/text) → format Claude (image/text blocks) ──
        const claudeContent = updatedParts.map(p => {
          if (p.inline_data) {
            return { type: 'image', source: { type: 'base64', media_type: p.inline_data.mime_type, data: p.inline_data.data } };
          }
          if (typeof p.text === 'string') return { type: 'text', text: p.text };
          return p;
        });

        // ── Synthèse finale — Gemini 2.5 Pro (mode test) ──
        console.log('\n→ Gemini 2.5 Pro (mode test) — synthèse S0→S7...');
        const text = await callGeminiPro(system, claudeContent, maxOutputTokens || 32000, { temperature: 0.4, thinkingBudget: 24576, logLabel: 'Analyste Synthèse' });

        console.log(`✓ Synthèse reçue — ${text.length} chars`);
        console.log('═'.repeat(60) + '\n');

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ text }));
      } catch (e) {
        console.error('✗ analyste-synthese error:', e.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // ── Image Generation (Gemini 3 Pro Image · global endpoint) ──
  if (req.method === 'POST' && req.url === '/generate-image-gemini') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        const reqBody = JSON.parse(body);

        // System instruction — Creative Director Mode (déclaré avant usage)
        const CREATIVE_SYSTEM = `Tu es un directeur artistique expert en publicités Meta Ads pour le marché e-commerce africain.

🔴 PRIORITÉ ABSOLUE N°1 — REPRODUIRE LE SQUELETTE DE IMAGE 1
IMAGE 1 est ton TEMPLATE DE COMPOSITION. Ton image finale doit avoir la MÊME mise en page que IMAGE 1 :
- Même nombre de zones visuelles (produit seul, ou produit + personnage, ou split, etc.)
- Même position de chaque zone (produit à droite → produit à droite dans l'output)
- Même hiérarchie de lecture (ce qui est grand dans IMAGE 1 est grand dans l'output)
- Même style typographique (si gros titre en haut dans IMAGE 1, gros titre en haut dans l'output)
- Même nombre de callouts/encarts/badges et à la même position relative
- Même ambiance photographique (éclairage, profondeur de champ, style)
Si IMAGE 1 a 3 callouts → ton output a 3 callouts. Si IMAGE 1 a un produit centré → produit centré.
Ce qui change : les couleurs (depuis le prompt), les textes (depuis le prompt), le produit (IMAGE 2), le persona (depuis le prompt).
Ce qui NE change PAS : la structure, les positions, les proportions, le nombre d'éléments.

🔴 PRIORITÉ ABSOLUE N°2 — FIDÉLITÉ PRODUIT (IMAGE 2)
IMAGE 2 est le produit du client. Reproduis-le avec une précision photographique : même forme, même étiquette, même logo, mêmes couleurs intrinsèques. JAMAIS un produit générique inventé.

SOURCES DE VÉRITÉ :
- IMAGE 1 → STRUCTURE/SQUELETTE uniquement (pas les couleurs, pas les textes)
- IMAGE 2 → PRODUIT physique uniquement
- TEXTE DU PROMPT → couleurs (palette S0), langue, persona, copy, contexte culturel

HARD LOCKS :
- TEINTE DE PEAU : selon le marché spécifié dans le prompt
- LANGUE : selon le marché spécifié dans le prompt (jamais depuis IMAGE 1)
- FORMAT : 4:5 portrait strict, pas de bandes noires
- TEXTES : uniquement ceux entre guillemets dans le prompt, jamais inventés
- DÉCOR : Afrique locale, jamais intérieur occidental`;

        const masterCreative = reqBody.systemInstruction || CREATIVE_SYSTEM;

        console.log('\n' + '═'.repeat(60));
        console.log('🎨 CREATIVE IMAGE — Mode DÉMO');
        console.log('   Step 1 : Gemini 2.5 Pro (écriture du prompt)');
        console.log('   Step 2 : Gemini 3 Pro Image (rendu)');
        console.log('═'.repeat(60));

        // Get token once (used by both Gemini 2.5 Pro and Gemini 3 Pro Image)
        console.log('→ Getting token (Vertex AI)...');
        const token = await getToken();
        console.log('✓ Token OK');

        // ── Step 1: Gemini 2.5 Pro generates the Gemini prompt ──
        console.log('→ Step 1 (démo) : Gemini 2.5 Pro analyse CT + produit + Synthèse...');
        const geminiPrompt = await callGeminiForCreativePrompt(
          token,
          masterCreative,
          reqBody.ctBase64, reqBody.ctMime,
          reqBody.productBase64, reqBody.productMime,
          reqBody.prompt
        );
        console.log('✓ Prompt généré par Gemini 2.5 Pro —', geminiPrompt.length, 'chars');

        // ── LOG COMPLET DU PROMPT GEMINI 2.5 PRO → GEMINI 3 PRO IMAGE (pour debug) ──
        console.log('\n' + '═'.repeat(60));
        console.log('📋 PROMPT GEMINI 2.5 PRO → GEMINI 3 PRO IMAGE :');
        console.log('─'.repeat(60));
        console.log(geminiPrompt);
        console.log('═'.repeat(60) + '\n');

        // ── Step 2: Gemini 3 Pro Image generates the final image ──
        console.log('→ Step 2 (démo) : Gemini 3 Pro Image génère l\'image finale...');
        console.log('→ Calling gemini-3-pro-image (global)...');

        // Démo : Gemini Image reçoit UNIQUEMENT produit + prompt texte (CT décrit en texte dans le prompt)
        const parts = [];
        if (reqBody.productBase64) {
          parts.push({ inlineData: { mimeType: reqBody.productMime || 'image/jpeg', data: reqBody.productBase64 } });
        }
        parts.push({ text: geminiPrompt });

        const vertexBody = {
          system_instruction: { parts: [{ text: 'Tu génères une image publicitaire Meta Ads 4:5.\n\nIMAGE FOURNIE = PRODUIT CLIENT — fidélité photographique ABSOLUE : reproduis exactement sa forme, ses dimensions, proportions, couleurs, textures, étiquette, reflets. JAMAIS un produit inventé ou approximatif.\n\nSTRUCTURE : définie entièrement par le prompt texte. Respecte chaque zone décrite (positions, proportions, nombre d\'éléments, style).\n\nCOULEURS : EXCLUSIVEMENT la palette HEX définie dans le prompt. Pas d\'autres couleurs.\n\nTEXTES : uniquement ceux entre guillemets dans le prompt. Format 4:5 strict, zéro bande noire.' }] },
          contents: [{ role: 'user', parts }],
          generationConfig: {
            responseModalities: ['TEXT', 'IMAGE'],
            temperature: 1.0
          }
        };

        const data = await vertexRequestGlobalAvecReessai(token, 'gemini-3-pro-image', vertexBody, 120000, 'creative_image_demo');
        if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));

        const responseParts = data.candidates?.[0]?.content?.parts || [];
        const imgPart = responseParts.find(p => p.inlineData?.mimeType?.startsWith('image/'));
        if (!imgPart) throw new Error('Pas d\'image dans la réponse. ' + JSON.stringify(responseParts).slice(0,200));

        console.log('✓ Image générée — gemini-3-pro-image');

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          imageData: imgPart.inlineData.data,
          imageMime: imgPart.inlineData.mimeType,
          model: 'gemini-2.5-pro + gemini-3-pro-image',
          geminiPrompt
        }));
      } catch(e) {
        console.error('✗ Image gen error:', e.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // ── Creative Image PRODUCTION : Claude Sonnet (raisonne+prompt) → Gemini 3 Pro Image (rend) ──
  // Différences vs /generate-image-gemini :
  //   - 3 images en entrée (CT, produit, logo optionnel)
  //   - Synthèse complète NON tronquée (l'agent doit comprendre tout le persona/3 angles)
  //   - Logo transmis à Gemini comme IMAGE 3 si fourni
  //   - Extraction de l'angle choisi depuis la sortie Sonnet pour reporting
  if (req.method === 'POST' && req.url === '/creative-prod') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        const reqBody = JSON.parse(body);
        const { systemPrompt, synthese, brief = {}, angleInstruction = '',
                ctBase64, ctMime, productBase64, productMime, logoBase64, logoMime } = reqBody;

        console.log('\n' + '═'.repeat(60));
        console.log(`🎨 CREATIVE IMAGE PROD — ${brief.marque || '?'} / ${brief.produit || '?'} (${brief.pays || '?'})`);
        console.log('═'.repeat(60));
        console.log(`   CT, produit, logo : ${ctBase64?'✓':'✗'} / ${productBase64?'✓':'✗'} / ${logoBase64?'✓':'absent'}`);
        console.log(`   Synthèse : ${synthese.length} chars`);
        console.log(`   Angle forcé : ${angleInstruction ? 'oui' : 'non (auto)'}`);

        // ── Step 1: Gemini 2.5 Pro raisonne et écrit le prompt Gemini (Sonnet 4.6 non connecté actuellement) ──
        console.log('\n→ Step 1: Gemini 2.5 Pro — compréhension persona/angles/CT, choix d\'angle, écriture du prompt...');

        const userParts = [];
        // LOGOS SUPPRIMÉS DU WORKFLOW — Gemini reçoit seulement 2 images (produit + CT)
        // Produit en PREMIÈRE position — Gemini priorise la 1ère image en multi-vision
        if (productBase64) userParts.push({ type:'image', source:{ type:'base64', media_type: productMime || 'image/jpeg', data: productBase64 } });
        if (ctBase64) userParts.push({ type:'image', source:{ type:'base64', media_type: ctMime || 'image/jpeg', data: ctBase64 } });
        // Pas de logo image — le nom de marque est injecté en texte

        const nomMarque = brief.marque || 'la marque';
        const nomProduit = brief.produit || 'le produit';

        const briefSummary = [
          'BRIEF :',
          `- Marque : ${nomMarque}`,
          `- Produit : ${nomProduit}`,
          `- Pays : ${brief.pays || 'n/a'}`,
          brief.couleurs_marque ? `- Couleurs marque : ${brief.couleurs_marque.join(', ')}` : null,
          brief.pricing ? `- Pricing : ${brief.pricing}` : null,
          brief.offre_promo ? `- Offre promo : ${brief.offre_promo}` : null
        ].filter(Boolean).join('\n');

        // Rôles d'images : 2 images uniquement, rôle clair et non ambigu
        const imageRoles = [
          `IMAGE 1 (que TU analyses) = PRODUIT CLIENT "${nomProduit}" de "${nomMarque}" — VÉRITÉ ABSOLUE DU PACKAGING.`,
          'IMAGE 2 (que TU analyses) = CT / CREATIVE TEMPLATE — RÉFÉRENCE STRUCTURELLE UNIQUEMENT.',
          '',
          '⚠️ RÉALITÉ CRITIQUE — CE QUE VOIT GEMINI 3 PRO IMAGE (Step 2) :',
          'Step 2 reçoit UNIQUEMENT : image du produit + ton prompt texte. Il NE VOIT PAS le CT.',
          '→ Tu dois décrire la structure du CT en TEXTE avec une précision absolue dans ton prompt.',
          '→ Zones, positions (% hauteur/largeur), proportions, style, éléments, invariants — tout en texte.',
          '→ Le produit est désigné dans le prompt par "(IMAGE FOURNIE — fidélité photographique absolue, même packaging exact)".',
          '→ AUCUNE référence à "IMAGE 1"/"IMAGE 2" dans le prompt final — Gemini Image ne voit qu\'une seule image.',
          '→ Le prompt commence OBLIGATOIREMENT par : "⚠️ IMAGE FOURNIE — PRODUIT" puis le bloc fidélité, puis FORMAT :',
          `LOGO : Aucune image logo n'est fournie. Intègre "${nomMarque}" en TEXTE dans l'emplacement approprié.`
        ].join('\n');

        // Règle de fidélité + hiérarchie produit > présentation CT + palette
        const fidelityRule = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⛔ RÈGLE HIÉRARCHIQUE — PRODUIT RÉEL > PRÉSENTATION SPÉCIFIQUE DU CT

NIVEAU 1 — STRUCTURE CT (à reproduire en TEXTE dans ton prompt) :
Zones, positions (% hauteur/largeur), proportions, cadrage, fond, ambiance, typographie.
SOIS ULTRA-PRÉCIS : Gemini Image ne verra PAS le CT — c'est TON TEXTE qui est sa seule référence.

NIVEAU 2 — PRÉSENTATION PHYSIQUE DU PRODUIT (à adapter au produit réel IMAGE 1) :
Si CT montre une GÉLULE + produit réel = FLACON → décris le FLACON. Jamais la gélule.
Si CT montre un COMPRIMÉ + produit réel = SACHET → décris le SACHET. Jamais le comprimé.
❌ JAMAIS inventer un objet absent d'IMAGE 1.
❌ JAMAIS demander à Gemini de "ne pas montrer le produit fourni".
✓ Fidélité produit > fidélité présentation CT. TOUJOURS.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⛔ RÈGLE PALETTE COULEURS — HARD LOCK

Couleurs finales = EXCLUSIVEMENT la palette S0 (codes HEX). JAMAIS les couleurs du CT.
Dans chaque zone du prompt : spécifie le HEX exact. Répète dans INSTRUCTIONS GEMINI.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⛔ RÈGLE — FIDÉLITÉ PRODUIT (DANS LE PROMPT QUE TU ÉCRIS) :

À CHAQUE mention du produit dans ton prompt final, ajoute :
"(IMAGE FOURNIE — fidélité photographique absolue, même packaging exact, même étiquette, même forme)"

Dans les INSTRUCTIONS GEMINI ADDITIONNELLES, inclus OBLIGATOIREMENT :
"→ Produit (IMAGE FOURNIE) : fidélité photographique ABSOLUE — même forme exacte, même étiquette, même packaging. Ne jamais inventer un produit différent."
"→ Couleurs : EXCLUSIVEMENT la palette [HEX dominant S0] définie dans le prompt. Ignorer les couleurs du CT."

Marque "${nomMarque}" : intégrée en TEXTE à l'emplacement approprié selon la structure décrite.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

        const userText = [
          // ⚠️ ANGLE IMPOSÉ EN TÊTE pour que Gemini le lise avant la synthèse
          angleInstruction ? `⚠️⚠️⚠️ ANGLE IMPOSÉ — LIS CECI EN PREMIER AVANT TOUT LE RESTE :\n${angleInstruction}\n⚠️⚠️⚠️ FIN INSTRUCTION ANGLE — NE PAS CHOISIR UN AUTRE ANGLE\n` : '',
          imageRoles,
          fidelityRule,
          '',
          briefSummary,
          '',
          'SYNTHÈSE COMPLÈTE S0→S7 :',
          synthese,
          // Rappel angle en fin aussi
          angleInstruction ? `\n⚠️ RAPPEL FINAL ANGLE IMPOSÉ (NON-NÉGOCIABLE) :\n${angleInstruction}` : '',
          '',
          `Applique les PHASES 1 et 2 de ta compétence (compréhension totale + choix d'angle), puis écris le prompt final.\n\nDémarre OBLIGATOIREMENT par "⚠️ IMAGE FOURNIE — PRODUIT" puis le bloc fidélité, puis FORMAT :\n\nRAPPEL CRITIQUE :\n- Gemini Image NE VOIT PAS le CT. Il reçoit UNIQUEMENT : image du produit + ton prompt texte.\n- Décris chaque zone du CT avec une précision absolue (% hauteur, position, proportions, style).\n- À chaque mention du produit : ajoute "(IMAGE FOURNIE — fidélité photographique absolue, même packaging exact)".\n- Codes HEX S0 dans CHAQUE zone. Dans INSTRUCTIONS GEMINI : "→ Couleurs : EXCLUSIVEMENT [HEX S0]. → Produit (IMAGE FOURNIE) : fidélité absolue."`
        ].filter(s => s !== '').join('\n');

        userParts.push({ type:'text', text: userText });

        console.log('→ Gemini 2.5 Pro (mode test) — compréhension persona/angles/CT, choix d\'angle, écriture du prompt...');
        const geminiPrompt = await callGeminiPro(systemPrompt, userParts, 8000, { temperature: 0.4, thinkingBudget: 24576, logLabel: 'Creative Prod' });

        // Parse les blocs ===META=== et ===PROMPT_GEMINI=== — séparation raisonnement interne / prompt propre
        const metaMatch = geminiPrompt.match(/===META===([\s\S]*?)===PROMPT_GEMINI===/);
        const promptMatch = geminiPrompt.match(/===PROMPT_GEMINI===([\s\S]*)$/);

        let metaBlock = '', promptForGemini = '';
        if (metaMatch && promptMatch) {
          metaBlock = metaMatch[1].trim();
          promptForGemini = promptMatch[1].trim();
        } else {
          console.log('   ⚠️  Sonnet n\'a pas produit les balises ===META===/===PROMPT_GEMINI=== — fallback envoi brut');
          metaBlock = '(non parseable — balises manquantes)';
          promptForGemini = geminiPrompt;
        }

        const angleMatch = metaBlock.match(/ANGLE\s+CHOISI\s*:\s*([^\n]+)/i);
        const chosenAngle = angleMatch ? angleMatch[1].trim() : 'non spécifié';

        console.log(`✓ Sonnet prompt généré — ${geminiPrompt.length} chars (META ${metaBlock.length} + PROMPT ${promptForGemini.length})`);
        console.log(`   Angle choisi : ${chosenAngle}`);
        console.log('\n' + '─'.repeat(60));
        console.log('🧠 BLOC META (interne, non envoyé à Gemini) :');
        console.log('─'.repeat(60));
        console.log(metaBlock);
        console.log('─'.repeat(60));
        console.log('📋 PROMPT envoyé à GEMINI :');
        console.log('─'.repeat(60));
        console.log(promptForGemini);
        console.log('─'.repeat(60) + '\n');

        // ── Step 2: Gemini 3 Pro Image rend l'image finale ──
        console.log('→ Step 2: Gemini 3 Pro Image — rendu image finale...');
        const token = await getToken();

        const CREATIVE_SYSTEM_PROD = `Tu es un directeur artistique expert en publicités Meta Ads — MODE PRODUCTION (qualité d'utilisation réelle, téléchargeable et déployable directement sur Meta Ads).

🔴 PRIORITÉ ABSOLUE — FIDÉLITÉ PRODUIT (IMAGE FOURNIE)
L'IMAGE FOURNIE = le produit du client. Reproduis-la avec une précision photographique totale :
- Même forme exacte, proportions, silhouette
- Même étiquette, même texte imprimé sur le packaging
- Mêmes couleurs intrinsèques, textures, reflets, matières
- JAMAIS un produit générique inventé ou approximatif

SOURCES DE VÉRITÉ :
- IMAGE FOURNIE → PRODUIT physique uniquement (fidélité absolue)
- TEXTE DU PROMPT → structure/layout, couleurs (codes HEX), langue, persona, copy, contexte culturel

HARD LOCKS :
- TEINTE DE PEAU : selon le marché spécifié dans le prompt
- LANGUE : selon le marché spécifié dans le prompt
- FORMAT : 4:5 portrait strict, pas de bandes noires
- TEXTES : uniquement ceux entre guillemets dans le prompt, jamais inventés
- STRUCTURE : reproduis la mise en page décrite dans le prompt (zones, positions %, proportions)
- COULEURS : EXCLUSIVEMENT la palette HEX définie dans le prompt
- QUALITÉ : haute définition, netteté maximale, qualité d'utilisation publicitaire réelle`;

        // Step 2 : Gemini Image reçoit UNIQUEMENT image produit + prompt texte (CT décrit en texte dans le prompt)
        const geminiParts = [];
        if (productBase64) geminiParts.push({ inlineData: { mimeType: productMime || 'image/jpeg', data: productBase64 } });
        geminiParts.push({ text: promptForGemini });

        const vertexBody = {
          system_instruction: { parts: [{ text: CREATIVE_SYSTEM_PROD }] },
          contents: [{ role:'user', parts: geminiParts }],
          generationConfig: {
            responseModalities: ['TEXT', 'IMAGE'],
            temperature: 1.0
          }
        };

        const data = await vertexRequestGlobalAvecReessai(token, 'gemini-3-pro-image', vertexBody, 120000, 'creative_image_prod');
        if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));

        const responseParts = data.candidates?.[0]?.content?.parts || [];
        const imgPart = responseParts.find(p => p.inlineData?.mimeType?.startsWith('image/'));
        if (!imgPart) throw new Error('Pas d\'image dans la réponse Gemini : ' + JSON.stringify(responseParts).slice(0,200));

        console.log('✓ Image générée — gemini-3-pro-image');
        console.log('═'.repeat(60) + '\n');

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          imageData: imgPart.inlineData.data,
          imageMime: imgPart.inlineData.mimeType,
          model: 'gemini-2.5-pro + gemini-3-pro-image (mode test)',
          prompt: promptForGemini,
          meta: metaBlock,
          chosenAngle
        }));
      } catch(e) {
        console.error('✗ Creative Prod error:', e.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // ── /select-cts — Sélection intelligente des CTs par Gemini ──
  if (req.method === 'POST' && req.url === '/select-cts') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { synthesis, ctList, count } = JSON.parse(body);
        console.log('\n🎯 SELECT-CTs — Sélection de ' + count + ' CTs parmi ' + ctList.length + '...');

        const token = await getToken();
        const ctListText = ctList.map((ct, i) => `${i+1}. ID: ${ct.id} → "${ct.name}"`).join('\n');
        const synthExcerpt = (synthesis || '').substring(0, 3500);

        const systemInstruction = { parts: [{ text: `Tu es un expert en sélection de formats publicitaires Meta Ads.
Tu reçois une synthèse de marché et une liste de Creative Templates (CT) avec leurs noms descriptifs.
Tu dois choisir exactement ${count} CTs adaptés au contexte ET visuellement distincts les uns des autres.

RÈGLES DE DIVERSIFICATION (PRIORITÉ ABSOLUE) :
1. ZÉRO DOUBLON : chaque CT sélectionné doit avoir un ID unique.
2. ZÉRO STRUCTURE IDENTIQUE : pas deux CTs avec le même concept visuel (pas 2x avant/après, pas 2x testimonial, pas 2x hero produit seul, etc.)
3. COUVERTURE VARIÉE : les ${count} CTs doivent couvrir un maximum de structures différentes parmi : hero produit, split lifestyle, avant-après, grille bénéfices, screenshot témoignage, podcast 2-col, story narrative, comparatif, UGC, stats preuve sociale, etc.
4. Pour les 3 créatives d'un même angle, les 3 CTs doivent avoir des approches visuelles complémentaires (jamais 2x le même concept dans un angle).

RÈGLES DE CONTEXTUALISATION (après diversification) :
- Adapte au TYPE DE PRODUIT identifié dans la synthèse (santé, beauté, fitness, food, tech, mode...)
- Adapte au PERSONA (âge, sexe, classe sociale, culture du pays cible)
- TOF (Unaware/Problem Aware) : storytelling, lifestyle, avant-après émotionnel
- MOF (Solution Aware) : comparatifs, témoignages, preuves sociales, screenshots
- BOF (Product Aware) : hero produit, pills bénéfices, offre/prix, CTA direct

Si la liste a moins de ${count} CTs distincts, retourne tous les IDs disponibles (sans doublon).

IMPORTANT FORMAT : réponds UNIQUEMENT avec un JSON array sur UNE SEULE LIGNE, sans markdown, sans backticks, sans explication.
Format exact (copie exactement ce style) : ["ct_xxx", "ct_yyy", "ct_zzz"]` }] };

        const geminiBody = {
          systemInstruction,
          contents: [{ role: 'user', parts: [{ text:
            'SYNTHÈSE DE CAMPAGNE (extrait) :\n' + synthExcerpt +
            '\n\n---\nCT DISPONIBLES :\n' + ctListText +
            '\n\nSélectionne ' + count + ' CTs optimaux.'
          }]}],
          generationConfig: { temperature: 0.3, maxOutputTokens: 1200 }
        };

        const data = await vertexRequest(token, 'gemini-2.5-flash', geminiBody);
        if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));

        const raw = (data.candidates?.[0]?.content?.parts || []).map(p => p.text).join('').trim();
        console.log('  → Réponse brute (' + raw.length + ' chars) : ' + raw.slice(0, 200));

        // ── Parsing multi-tentatives ──────────────────────────────────────────
        let selectedIds;

        // Tentative 1 : JSON.parse direct après strip markdown
        try {
          const c1 = raw.replace(/^```(?:json)?\s*/i,'').replace(/\s*```\s*$/,'').trim();
          const parsed = JSON.parse(c1);
          if (Array.isArray(parsed)) { selectedIds = parsed; }
        } catch(e) { /* passe à la suite */ }

        // Tentative 2 : extraire le premier [...] GREEDY (tout entre le premier [ et le dernier ])
        if (!selectedIds) {
          const start = raw.indexOf('[');
          const end   = raw.lastIndexOf(']');
          if (start !== -1 && end !== -1 && end > start) {
            try {
              const slice = raw.slice(start, end + 1).replace(/,\s*]/g, ']');
              const parsed = JSON.parse(slice);
              if (Array.isArray(parsed)) { selectedIds = parsed; }
            } catch(e) { /* passe à la suite */ }
          }
        }

        // Tentative 3 : extraire les IDs individuellement via regex (fallback ultime)
        if (!selectedIds) {
          const ids = [...raw.matchAll(/"(ct_[a-zA-Z0-9_]+)"/g)].map(m => m[1]);
          if (ids.length > 0) {
            selectedIds = ids;
            console.log('  → Parsing fallback : IDs extraits un par un (' + ids.length + ')');
          }
        }

        if (!selectedIds || !Array.isArray(selectedIds) || selectedIds.length === 0) {
          throw new Error('JSON array non trouvé dans : ' + raw.slice(0, 400));
        }

        // Dédupliquer et valider
        const seen = new Set();
        const validIds = selectedIds.filter(id => {
          const ct = ctList.find(c => c.id === id);
          if (!ct || seen.has(id)) return false;
          seen.add(id);
          return true;
        });
        const names = validIds.map(id => { const ct = ctList.find(c => c.id === id); return ct ? ct.name : id; }).join(' · ');
        console.log(`  → ${validIds.length} CTs (${selectedIds.length - validIds.length} doublons supprimés) : ${names}`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ selectedIds: validIds }));
      } catch(e) {
        console.error('✗ SELECT-CTs error:', e.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // ── /name-ct — Nommage automatique CT par Gemini Vision ──
  if (req.method === 'POST' && req.url === '/name-ct') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { b64, mime } = JSON.parse(body);
        console.log('\n🖼  NAME-CT — Gemini Vision nommage CT...');

        const token = await getToken();

        const systemInstruction = { parts: [{ text: `Tu es un expert en analyse créative publicitaire Meta Ads.
Tu génères des noms de Creative Templates (CT) utilisés par des agents IA pour choisir le bon format selon le contexte.
Le nom doit permettre à un agent de comprendre la structure, l'ambiance et les éléments SANS voir l'image.

FORMAT OBLIGATOIRE :
"[Structure] [palette] — [éléments avec position/taille/fonction]"

RÈGLES DE NOMMAGE :

1. STRUCTURE (commence toujours par ça) :
   - "Split 2-col" = deux colonnes côte à côte
   - "Stack vertical" = blocs empilés de haut en bas
   - "Hero centré" = produit ou visage dominant au centre
   - "Plein-cadre produit" = produit occupe toute l'image
   - "Avant-Après split" = comparaison gauche/droite
   - "Grille 2x2" ou "3 vignettes" = mosaïque de photos

2. PALETTE (juste après la structure, en 1-2 mots évocateurs) :
   - "crème/lavande", "noir dramatique", "blanc épuré", "vert forêt", "or/brun chaud"
   - Nomme la couleur dominante + la couleur d'accent

3. SÉPARATEUR — puis liste des éléments clés

4. ÉLÉMENTS (chaque élément = type + qualificatif + position) :
   - "prix trial XL gauche" (pas juste "prix")
   - "témoignage 5★ centré" (pas juste "testimonial")
   - "3 pills bénéfices blanc" (nb + forme + couleur)
   - "produit aérosol droite" (type exact + position)
   - "headline bold violet haut" (style + couleur + position)
   - "CTA bouton arrondi bas" (type + forme + position)

5. SÉPARATEURS entre éléments :
   - "+" entre éléments de la même zone
   - "/" entre la zone gauche et la zone droite (pour les splits 2-col)

6. INTERDIT :
   - Noms génériques : "Comparatif produit", "Hero produit", "UGC", "Témoignage"
   - Troncatures : jamais couper un mot à mi-chemin
   - Dépasser 100 caractères

EXEMPLES PARFAITS (modèle à suivre) :
"Split 2-col crème/lavande — prix trial XL gauche + témoignage 5★ + 3 pills bénéfices / produit aérosol droite"
"Avant-Après split blanc/gris — peau terne avant + peau lumineuse après + avant-après texte pont centre"
"Stack vertical noir/or — headline shock haut + 3 visuels résultats + CTA bouton doré bas"
"Hero centré fond sable — portrait femme 35s plein cadre + badge prix coin haut droit + 5★ bas"
"Plein-cadre produit vert/blanc — flacon centré grand format + liste 4 bénéfices gauche + marque haut"
"Grille 3 vignettes blanc — 3 photos usage quotidien + légende sous chaque + CTA bas centre"` }] };

        const geminiBody = {
          systemInstruction,
          contents: [{ role: 'user', parts: [
            { inlineData: { mimeType: mime || 'image/jpeg', data: b64 } },
            { text: 'Génère le nom précis de ce Creative Template. Sois très descriptif et spécifique.' }
          ]}],
          generationConfig: { temperature: 0.2, maxOutputTokens: 500 }
        };

        const data = await vertexRequest(token, 'gemini-2.5-flash', geminiBody);
        if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));

        const raw = (data.candidates?.[0]?.content?.parts || []).map(p => p.text).join('').trim();
        const clean = raw.replace(/^["'«»\-]|["'«»]$/g, '').split('\n')[0].trim().substring(0, 70);
        console.log('  → "' + clean + '"');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ name: clean }));
      } catch(e) {
        console.error('✗ NAME-CT error:', e.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // ── /gen-messages : génère les messages relance via Gemini 2.5 Pro ──────────
  if (req.method === 'POST' && req.url === '/gen-messages') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        const { prompt } = JSON.parse(body);
        if (!prompt) { res.writeHead(400); res.end(JSON.stringify({ error: 'prompt requis' })); return; }
        const token = await getToken();
        const data = await vertexRequest(token, 'gemini-2.5-pro', {
          contents: [{ role:'user', parts:[{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 4000, temperature: 0.3 }
        });
        const text = (data.candidates?.[0]?.content?.parts?.[0]?.text || '').trim();
        console.log(`→ /gen-messages → ${text.length} chars`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ text }));
      } catch(e) {
        console.error('/gen-messages error:', e.message);
        res.writeHead(500); res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // ── /fill-demo-msg : remplit le template WA depuis les données de la mindmap ────────────
  if (req.method === 'POST' && req.url === '/fill-demo-msg') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        const { lien_demo, pays_code, tpl } = JSON.parse(body);
        if (!lien_demo || !tpl) { res.writeHead(400); res.end(JSON.stringify({ error: 'lien_demo et tpl requis' })); return; }

        const slug = lien_demo.split('/').pop().split('?')[0].replace('.html','');
        const filepath = path.join(MINDMAPS_DIR, slug + '.html');

        if (!fs.existsSync(filepath)) {
          res.writeHead(404); res.end(JSON.stringify({ error: `Mindmap introuvable : ${slug}.html` }));
          return;
        }

        const html = fs.readFileSync(filepath, 'utf8');

        // Extraction directe des valeurs depuis le HTML généré (les placeholders ont été remplacés)
        const extractBetween = (str, before, after) => {
          const rx = new RegExp(before + '([\\s\\S]*?)' + after);
          const m = str.match(rx);
          return m ? m[1].trim() : '';
        };

        // {PRODUIT} → <div class="prod">VALEUR</div>
        const produit = extractBetween(html, '<div class="prod">', '</div>') || '';
        // {MARQUE} → <div class="sub">MARQUE · PAYS</div>
        const subLine = extractBetween(html, '<div class="sub">', '</div>') || '';
        const marque  = subLine.split('·')[0].trim() || '';
        // {PAYS} → dans le même sub ou depuis pays_code passé en paramètre
        const paysRaw = (subLine.split('·')[1] || pays_code || '').trim();

        // Mapping code pays → adjectif
        const PAYS_ADJ = {
          'CI':'ivoirien','SN':'sénégalais','CM':'camerounais','NG':'nigérian',
          'TG':'togolais','BJ':'béninois','ML':'malien','BF':'burkinabè',
          'GN':'guinéen','CD':'congolais','CG':'congolais','GH':'ghanéen',
          'TD':'tchadien','MG':'malgache','MR':'mauritanien','GA':'gabonais'
        };
        const code = paysRaw.toUpperCase().replace(/[^A-Z]/g,'').substring(0,2);
        const paysAdj = PAYS_ADJ[code] || PAYS_ADJ[pays_code?.toUpperCase()] || paysRaw || '';

        // Niche : appel rapide à /niche (ou extraire depuis MARCHE_DESC)
        let niche = '';
        try {
          const token = await getToken();
          const nicheData = await vertexRequest(token, 'gemini-2.5-flash', {
            contents: [{ role:'user', parts:[{ text: `Grande catégorie marketing 1-2 mots max pour: "${produit || slug}". Exemples: cosmétiques, santé, mode, beauté, nutrition. UNIQUEMENT la catégorie, rien d'autre.` }] }],
            generationConfig: { maxOutputTokens: 50, temperature: 0, thinkingConfig: { thinkingBudget: 0 } }
          }, 90000, 'remplissage_message_demo');
          niche = (nicheData.candidates?.[0]?.content?.parts?.[0]?.text || '').trim().split('\n')[0].replace(/['"«».,]/g,'');
        } catch(e) { niche = produit.split(' ')[0] || ''; }

        // Remplissage local du template — 100% fiable, zéro hallucination
        const message = (tpl || '')
          .replace(/\[Niche\]/gi, niche)
          .replace(/\[Pays(?:[^\]]*)\]/gi, paysAdj)
          .replace(/\[lien_demo\]/gi, lien_demo)
          .replace(/\[Produit\]/gi, produit || '[Produit]')
          .replace(/\[nom marque\]/gi, marque || '')
          .replace(/\\n/g, '\n');

        console.log(`→ /fill-demo-msg slug:"${slug}" → produit:"${produit}" marque:"${marque}" pays:"${paysAdj}" niche:"${niche}" → ${message.length} chars`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message }));
      } catch(e) {
        console.error('/fill-demo-msg error:', e.message);
        res.writeHead(500); res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // ── /niche : détection niche produit pour le CRM ─────────────────────────
  if (req.method === 'GET' && req.url.startsWith('/niche')) {
    try {
      const urlParams = new URL(req.url, 'http://localhost').searchParams;
      const produit = (urlParams.get('produit') || '').trim();
      if (!produit) { res.writeHead(400); res.end(JSON.stringify({ error: 'produit manquant' })); return; }
      const token = await getToken();
      const data = await vertexRequest(token, 'gemini-2.5-flash', {
        contents: [{ role:'user', parts:[{ text:'Grande catégorie marketing en 1-2 mots pour ce produit: "'+produit+'". Exemples: "cosmétiques", "santé", "mode", "nutrition", "bien-être". La catégorie la plus large possible. Réponds UNIQUEMENT avec la catégorie.' }] }],
        generationConfig: { maxOutputTokens: 50, temperature: 0, thinkingConfig: { thinkingBudget: 0 } }
      });
      const niche = (data.candidates?.[0]?.content?.parts?.[0]?.text || produit).trim().replace(/['"«»]/g,'').split('\n')[0].substring(0,30);
      console.log(`→ /niche "${produit}" → "${niche}"`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ niche }));
    } catch(e) {
      res.writeHead(500); res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

// GET /push-vapid-key — donne la clé publique VAPID au client
  if (req.method === 'GET' && req.url === '/push-vapid-key') {
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(JSON.stringify({ key: process.env.VAPID_PUBLIC_KEY || '' }));
    return;
  }

// POST /push-subscribe — enregistre une souscription push pour un utilisateur OU un visiteur anonyme
  if (req.method === 'POST' && req.url === '/push-subscribe') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', async () => {
      try {
        const { user_id, anon_id, subscription } = JSON.parse(body);
        if ((!user_id && !anon_id) || !subscription?.endpoint) {
          console.warn('[Push] /push-subscribe: payload invalide', { user_id, anon_id, hasEndpoint: !!subscription?.endpoint });
          res.writeHead(400); res.end('{}'); return;
        }
        const insertRes = await fetch(`${SUPABASE_URL_INT}/rest/v1/push_subscriptions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Prefer': 'resolution=merge-duplicates',
          },
          body: JSON.stringify({
            user_id: user_id || null,
            anon_id: user_id ? null : anon_id,
            endpoint: subscription.endpoint,
            p256dh: subscription.keys?.p256dh,
            auth: subscription.keys?.auth,
          })
        });
        if (!insertRes.ok) {
          const errText = await insertRes.text();
          console.error(`[Push] /push-subscribe: échec insertion Supabase (${insertRes.status}):`, errText.slice(0,300));
          res.writeHead(500); res.end(JSON.stringify({ error: 'insert_failed' }));
          return;
        }
        console.log(`[Push] ✅ Souscription enregistrée pour ${user_id ? 'user '+user_id : 'anon '+anon_id}`);
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify({ ok: true }));
      } catch(e) {
        console.error('[Push] /push-subscribe: exception', e.message);
        res.writeHead(500); res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

// POST /push-merge-anon — relie une souscription anonyme au vrai compte, une fois connecté
  if (req.method === 'POST' && req.url === '/push-merge-anon') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', async () => {
      try {
        const { anon_id, user_id } = JSON.parse(body);
        if (!anon_id || !user_id) { res.writeHead(400); res.end('{}'); return; }
        const r = await fetch(`${SUPABASE_URL_INT}/rest/v1/push_subscriptions?anon_id=eq.${anon_id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({ user_id, anon_id: null })
        });
        console.log(`[Push] Fusion anon→user : ${anon_id} → ${user_id} (${r.ok ? 'ok' : 'échec ' + r.status})`);
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify({ ok: r.ok }));
      } catch(e) {
        console.error('[Push] /push-merge-anon: exception', e.message);
        res.writeHead(500); res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

// POST /push-test — envoie une notification de test à l'utilisateur qui clique "Tester"
  if (req.method === 'POST' && req.url === '/push-test') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', async () => {
      res.writeHead(200, {'Content-Type':'application/json'});
      res.end(JSON.stringify({ ok: true }));
      try {
        const { user_id } = JSON.parse(body);
        if (!user_id) return;
        await sendPushToUser(user_id, {
          title: '🔔 Ça marche !',
          body: 'Tes notifications AdBoard sont bien activées.',
          url: '/adboard/notifications'
        });
      } catch(e) { console.error('[Push] Erreur test:', e.message); }
    });
    return;
  }

// POST /track-event — tracking léger pour déclencheurs contextuels (ex: vu la page Tarifs)
  if (req.method === 'POST' && req.url === '/track-event') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', async () => {
      res.writeHead(200, {'Content-Type':'application/json'});
      res.end(JSON.stringify({ ok: true }));
      try {
        const { user_id, event_key } = JSON.parse(body);
        if (!user_id || !event_key) return;
        await fetch(`${SUPABASE_URL_INT}/rest/v1/user_events`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          },
          body: JSON.stringify({ user_id, event_key })
        });
      } catch(e) { console.error('[Track] Erreur:', e.message); }
    });
    return;
  }

// POST /webhook/brief — reçoit un ticket de commande depuis AdBoard
  if (req.method === 'POST' && req.url === '/webhook/brief') {

    let body = '';
    req.on('data', d => body += d);
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const briefs = loadBriefs();
        const brief = {
          id: data.brief_id || `brief_${Date.now()}`,
          created_at: new Date().toISOString(),
          status: 'pending', // pending | in_production | done
          client: {
            user_id: data.user_id,
            email: data.user_email,
            plan: data.plan || 'starter',
          },
          product: {
            id: data.product.id,
            nom: data.product.nom,
            pricing: data.product.pricing,
            pays: data.product.pays,
            cible: data.product.cible,
            utilite: data.product.utilite,
            couleurs: [data.product.couleur1, data.product.couleur2, data.product.couleur3].filter(Boolean),
            photo_url: data.product.photo_url,
            photo_base64: data.product.photo_base64 || null,
          },
          quantity: data.quantity || 9,
          history: data.history || { angles_used: [], personas_used: [], batches_count: 0 },
          photo_nobg: null,
        };
        briefs.unshift(brief);
        saveBriefs(briefs);
        console.log(`[Brief] ✅ Reçu: ${brief.id} — ${brief.product.nom} (${brief.quantity} images)`);
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify({ ok: true, id: brief.id }));
        // Notification push — confirmation de la demande
        if (brief.client.user_id) {
          sendPushToUser(brief.client.user_id, {
            title: '📦 Demande reçue',
            body: `Tes ${brief.quantity} visuels pour ${brief.product.nom} sont en cours — livraison sous 48h.`,
            url: '/adboard/tracking'
          }).catch(()=>{});
        }
        // Background removal en arrière-plan
        if (brief.product.photo_base64) {
          processProductPhoto(brief.product.photo_base64, brief.id).then(nobg => {
            if (nobg) {
              const all = loadBriefs();
              const idx = all.findIndex(b => b.id === brief.id);
              if (idx >= 0) { all[idx].photo_nobg = nobg; saveBriefs(all); }
            }
          });
        }
      } catch(e) {
        console.error('[Brief] Erreur:', e);
        res.writeHead(400); res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

// GET /commandes — liste des tickets pour la vue Factory
  if (req.method === 'GET' && req.url === '/commandes') {

    const briefs = loadBriefs();
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(JSON.stringify(briefs));
    return;
  }

// POST /commandes/:id/start — marquer en production
  if (req.method === 'POST' && req.url.match(/^\/commandes\/[^/]+\/start$/)) {

    const id = req.url.split('/')[2];
    const briefs = loadBriefs();
    const idx = briefs.findIndex(b => b.id === id);
    if (idx >= 0) {
      briefs[idx].status = 'in_production';
      briefs[idx].started_at = new Date().toISOString();
      saveBriefs(briefs);
      res.writeHead(200, {'Content-Type':'application/json'});
      res.end(JSON.stringify({ ok: true, brief: briefs[idx] }));
    } else {
      res.writeHead(404); res.end(JSON.stringify({ error: 'Brief not found' }));
    }
    return;
  }

// POST /create-checkout — crée une session Chariow et retourne l'URL
if (req.method === 'POST' && req.url === '/create-checkout') {
  let body = '';
  req.on('data', d => body += d);
  req.on('end', async () => {
    try {
      const { product_id, email, user_id, plan } = JSON.parse(body);
      if (!CHARIOW_KEY) { res.writeHead(500); res.end(JSON.stringify({error:'CHARIOW_KEY manquante'})); return; }
      const r = await fetch('https://api.chariow.com/v1/checkout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${CHARIOW_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id,
          email,
          custom_metadata: { user_id, plan, source: 'adboard' }
        })
      });
      const data = await r.json();
      if (data?.data?.step === 'payment') {
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify({ checkout_url: data.data.payment.checkout_url }));
      } else if (data?.data?.step === 'completed') {
        // Produit déjà acheté ou gratuit → activer directement
        if (user_id && plan) {
          const planInfo = PLAN_MAP[product_id] || { plan, cycle: 'monthly', credits_per_week: 9, price_fcfa: 0, prix_img: 0 };
          await activateSubscription(user_id, planInfo.plan, planInfo.cycle, planInfo.credits_per_week, planInfo.price_fcfa, planInfo.prix_img, email);
        }
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify({ checkout_url: null, already_active: true }));
      } else {
        console.error('[Checkout]', JSON.stringify(data));
        res.writeHead(400); res.end(JSON.stringify({ error: data?.message || 'Erreur Chariow', raw: data }));
      }
    } catch(e) {
      console.error('[Checkout]', e);
      res.writeHead(500); res.end(JSON.stringify({ error: e.message }));
    }
  });
  return;
}

// POST /webhook/chariow — reçoit les Pulses Chariow (vente confirmée)
if (req.method === 'POST' && req.url === '/webhook/chariow') {
  let body = '';
  req.on('data', d => body += d);
  req.on('end', async () => {
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(JSON.stringify({ ok: true }));
    try {
      const pulse = JSON.parse(body);
      console.log('[Pulse] Reçu (payload complet):', JSON.stringify(pulse));
      // Structure réelle Chariow : product/customer/store au même niveau que sale, pas imbriqués dedans
      const sale = pulse?.sale || {};
      const product = pulse?.product || {};
      const customer = pulse?.customer || {};
      // custom_fields est un tableau [{name, value}], pas un objet plat
      const customFields = {};
      (sale?.custom_fields || []).forEach(f => { if (f?.name) customFields[f.name] = f.value; });
      const userId = customFields.user_id;
      const productId = product?.id;
      const email = customer?.email;
      const planInfo = PLAN_MAP[productId];
      if (!planInfo) { console.warn('[Pulse] Produit inconnu:', productId); return; }
      // Si on a le user_id → activer directement
      if (userId) {
        console.log(`[Pulse] user_id trouvé directement dans custom_fields: ${userId}`);
        await activateSubscription(userId, planInfo.plan, planInfo.cycle, planInfo.credits_per_week, planInfo.price_fcfa, planInfo.prix_img, email, customer?.name);
        await traiterAttributionCRM(userId);
        return;
      }
      // Sinon chercher par email — chemin de secours, ne devrait quasi jamais arriver pour un achat AdBoard normal
      console.warn(`[Pulse] ⚠️ Aucun user_id dans custom_fields — fallback recherche par email: "${email}"`);
      if (email) {
        const user = await findUserByEmail(email);
        if (user) {
          console.log(`[Pulse] Fallback email: match trouvé → user_id=${user.id} pour email="${email}"`);
          await activateSubscription(user.id, planInfo.plan, planInfo.cycle, planInfo.credits_per_week, planInfo.price_fcfa, planInfo.prix_img, email, user.user_metadata?.full_name || customer?.name);
          await traiterAttributionCRM(user.id);
        } else {
          console.warn(`[Pulse] User introuvable pour email: ${email} — abonnement en attente`);
        }
      }
    } catch(e) { console.error('[Pulse] Erreur:', e); }
  });
  return;
}

// GET /cron/clarity-snapshot — déclenché 1x/jour par un cron externe (cron-job.org).
// Récupère les métriques comportementales AdBoard (clics de rage, clics morts, etc.)
// depuis l'API officielle de Microsoft Clarity, et les accumule dans notre propre table —
// l'API de Clarity ne garde que 3 jours glissants, donc on doit stocker nous-mêmes l'historique.
if (req.method === 'GET' && req.url.startsWith('/cron/clarity-snapshot')) {
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const key = urlObj.searchParams.get('key');
  if (key !== process.env.SEQUENCE_CRON_SECRET) {
    res.writeHead(403); res.end(JSON.stringify({ error: 'Clé invalide' })); return;
  }
  res.writeHead(200, {'Content-Type':'application/json'});
  res.end(JSON.stringify({ ok: true, message: 'Récupération Clarity en cours' }));

  try {
    if (!process.env.CLARITY_API_TOKEN) {
      console.warn('[Clarity] CLARITY_API_TOKEN manquant — snapshot ignoré');
      return;
    }
    const r = await fetch('https://www.clarity.ms/export-data/api/v1/project-live-insights?numOfDays=1&dimension1=URL', {
      headers: { 'Authorization': `Bearer ${process.env.CLARITY_API_TOKEN}`, 'Content-Type': 'application/json' }
    });
    if (!r.ok) {
      console.warn(`[Clarity] Échec API (${r.status}) — snapshot ignoré`);
      return;
    }
    const data = await r.json();

    // La réponse groupe par nom de métrique ("Rage Click Count", "Dead Click Count", etc.),
    // chaque groupe contenant un tableau par URL. On reconstruit une ligne par URL.
    const parPage = {};
    (data || []).forEach(bloc => {
      const nomMetrique = bloc.metricName;
      (bloc.information || []).forEach(info => {
        const url = info.URL || info.url || 'inconnue';
        if (!parPage[url]) parPage[url] = { url };
        if (nomMetrique === 'Rage Click Count')    parPage[url].rage_click_count    = parseInt(info.rageClickCount    || info.count || 0);
        if (nomMetrique === 'Dead Click Count')     parPage[url].dead_click_count     = parseInt(info.deadClickCount     || info.count || 0);
        if (nomMetrique === 'Quickback Click')      parPage[url].quickback_click      = parseInt(info.quickbackCount     || info.count || 0);
        if (nomMetrique === 'Excessive Scroll')     parPage[url].excessive_scroll     = parseInt(info.excessiveScrollCount || info.count || 0);
        if (nomMetrique === 'Traffic')              parPage[url].traffic_sessions     = parseInt(info.totalSessionCount || 0);
        if (nomMetrique === 'Scroll Depth')          parPage[url].scroll_depth         = parseFloat(info.averageScrollDepth || info.scrollDepth || 0);
        if (nomMetrique === 'Engagement Time')      parPage[url].engagement_time      = parseFloat(info.averageEngagementTime || info.engagementTime || 0);
      });
    });

    const lignes = Object.values(parPage);
    if (lignes.length) {
      await fetch(`${SUPABASE_URL_INT}/rest/v1/clarity_snapshots`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(lignes)
      });
      console.log(`[Clarity] ✅ Snapshot enregistré — ${lignes.length} page(s)`);
    } else {
      console.log('[Clarity] Snapshot vide (aucune donnée retournée)');
    }
  } catch(e) {
    console.error('[Clarity] Erreur snapshot:', e.message);
  }
  return;
}


if (req.method === 'GET' && req.url.startsWith('/cron/email-sequence')) {
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const key = urlObj.searchParams.get('key');
  if (key !== process.env.SEQUENCE_CRON_SECRET) {
    res.writeHead(403); res.end(JSON.stringify({ error: 'Clé invalide' })); return;
  }
  res.writeHead(200, {'Content-Type':'application/json'});
  res.end(JSON.stringify({ ok: true, message: 'Séquence en cours de traitement' }));

  try {
    // 1. Récupérer tous les users (Supabase Admin API)
    const usersRes = await fetch(`${SUPABASE_URL_INT}/auth/v1/admin/users?per_page=1000`, {
      headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` }
    });
    const usersData = await usersRes.json();
    const users = usersData?.users || [];

    // 2. Récupérer tous les abonnements actifs pour exclure les convertis
    const subsRes = await fetch(`${SUPABASE_URL_INT}/rest/v1/subscriptions?select=user_id,active,plan,expires_at`, {
      headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` }
    });
    const subs = await subsRes.json();
    const convertedUserIds = new Set((subs || []).filter(s => s.active).map(s => s.user_id));

    // Rappel de renouvellement — 3 jours avant expiration, 1x max par cycle
    for (const sub of (subs || [])) {
      if (!sub.active || !sub.expires_at) continue;
      const daysLeft = (new Date(sub.expires_at).getTime() - Date.now()) / (24*60*60*1000);
      if (daysLeft > 0 && daysLeft <= 3) {
        const reminderKey = `renewal_${sub.expires_at.slice(0,10)}`;
        const already = await wasSequenceSent(sub.user_id, reminderKey);
        if (!already) {
          await notifyUserBoth(sub.user_id, {
            title: '⏳ Ton abonnement expire bientôt',
            body: `Ton plan ${PLAN_LABELS[sub.plan] || sub.plan} expire dans ${Math.ceil(daysLeft)} jour(s). Renouvelle pour ne pas perdre tes livraisons.`,
            url: '/adboard/offers',
            type: 'warning',
          });
          await markSequenceSent(sub.user_id, reminderKey);
        }
      }
    }

    const DAY_MS = 24 * 60 * 60 * 1000;
    const SEQUENCE_STEPS = [
      { day: 1,  key: null }, // spécial : dépend du nb de produits (géré séparément)
      { day: 5,  key: 'j5_vision' },
      { day: 12, key: 'j12_offer' },
      { day: 21, key: 'j21_breakup' },
    ];

    let sentCount = 0;

    for (const user of users) {
      if (!user.email || convertedUserIds.has(user.id)) continue; // déjà converti → on arrête tout
      const ageMs = Date.now() - new Date(user.created_at).getTime();
      const ageDays = ageMs / DAY_MS;
      const firstName = user.user_metadata?.full_name?.split(' ')[0] || '';
      const userCurrency = user.user_metadata?.currency || 'XOF';

      // J1 — variante selon présence de produit (fenêtre 0.5 à 2 jours pour tolérance du cron quotidien)
      if (ageDays >= 0.5 && ageDays < 2) {
        const alreadySent = await wasSequenceSent(user.id, 'j1_no_product') || await wasSequenceSent(user.id, 'j1_has_product');
        if (!alreadySent) {
          const prodRes = await fetch(`${SUPABASE_URL_INT}/rest/v1/products?user_id=eq.${user.id}&select=nom,pays&limit=1`, {
            headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` }
          });
          const prods = await prodRes.json();
          const hasProduct = Array.isArray(prods) && prods.length > 0;
          const emailKey = hasProduct ? 'j1_has_product' : 'j1_no_product';
          const ok = await sendSequenceEmail(user.email, emailKey, { firstName, productName: hasProduct ? prods[0].nom : '', productPays: hasProduct ? prods[0].pays : '', currency: userCurrency });
          if (ok) { await markSequenceSent(user.id, emailKey); sentCount++; }
        }
      }

      // J5, J12, J21 — fenêtre ±0.5 jour autour du jour cible
      for (const step of SEQUENCE_STEPS) {
        if (!step.key) continue;
        if (ageDays >= step.day - 0.5 && ageDays < step.day + 0.5) {
          const alreadySent = await wasSequenceSent(user.id, step.key);
          if (!alreadySent) {
            const ok = await sendSequenceEmail(user.email, step.key, { firstName, currency: userCurrency });
            if (ok) { await markSequenceSent(user.id, step.key); sentCount++; }
          }
        }
      }

      // ── Nudges push contextuels — répétés chaque jour (rotation de 10 accroches) tant que l'action n'est pas faite ──
      if (ageDays >= 2) {
        const todayKey = new Date().toISOString().slice(0,10); // YYYY-MM-DD

        const CATALOGUE_VIDE_VARIANTS = [
          "👋 Heyy — Ajoute ton premier produit, ça prend 30 secondes.",
          "Prêt pour qu'on t'aide à exploser tes ventes ? Ça commence par ajouter ton produit !",
          "Ton catalogue attend son premier produit. On s'occupe du reste.",
          "30 secondes. C'est le temps qu'il te faut pour ajouter ton produit et démarrer.",
          "Tes concurrents publient déjà. Ajoute ton produit, ne perds plus de temps.",
          "Un produit ajouté = une semaine d'images publicitaires qui commence. On attend le tien.",
          "Toujours pas de produit dans ton catalogue ? On est prêts dès que toi tu l'es.",
          "Ajoute ton produit maintenant — tes premières images arrivent vite après.",
          "Ton compte AdBoard est prêt. Il ne manque plus qu'un produit.",
          "On ne peut rien faire sans ton produit. Ajoute-le, on prend le relais.",
        ];
        const PRET_VISUELS_VARIANTS = (nom) => [
          `💥BOOM!!! c'est le bruit de la demande qu'a ${nom} sur ton marché. Et notre équipe n'attend que toi, pour tout rafler 🫵`,
          `${nom} est dans ton catalogue. Il ne manque plus qu'un forfait pour lancer tes visuels.`,
          `Chaque jour sans forfait, c'est un jour sans nouvelles images publicitaires pour ${nom}.`,
          `Tes concurrents sur ${nom} ne t'attendent pas. Prends ton forfait, on s'occupe du reste.`,
          `${nom} mérite de vraies images publicitaires. On est prêts quand toi tu l'es.`,
          `Encore un produit sans visuels ? Débloque tes premières images dès aujourd'hui.`,
          `On a hâte de bosser sur ${nom}. Choisis ton forfait pour démarrer.`,
          `${nom} est prêt à décoller — reste juste le forfait à choisir.`,
          `Le potentiel de ${nom} mérite mieux que Canva. Passe au niveau supérieur.`,
          `Ton produit est là, tes images ne le sont pas encore. On règle ça avec un forfait.`,
        ];

        const prodRes2 = await fetch(`${SUPABASE_URL_INT}/rest/v1/products?user_id=eq.${user.id}&select=id,nom`, {
          headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` }
        });
        const userProducts = await prodRes2.json();
        const hasAnyProduct = Array.isArray(userProducts) && userProducts.length > 0;

        if (!hasAnyProduct) {
          const dailyKey = `push_no_product_${todayKey}`;
          if (!(await wasSequenceSent(user.id, dailyKey))) {
            const countRes = await fetch(`${SUPABASE_URL_INT}/rest/v1/email_sequence_log?user_id=eq.${user.id}&email_key=like.push_no_product_*&select=id`, {
              headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` }
            });
            const sentSoFar = (await countRes.json())?.length || 0;
            await sendPushToUser(user.id, {
              title: 'Ton catalogue est vide',
              body: CATALOGUE_VIDE_VARIANTS[sentSoFar % 10],
              url: '/adboard/products'
            });
            await markSequenceSent(user.id, dailyKey);
            sentCount++;
          }
        } else {
          // A un produit — vérifie s'il a un abonnement actif (pas juste une demande faite ou non)
          const subRes = await fetch(`${SUPABASE_URL_INT}/rest/v1/subscriptions?user_id=eq.${user.id}&active=eq.true&select=id&limit=1`, {
            headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` }
          });
          const hasActiveSub = (await subRes.json())?.length > 0;
          if (!hasActiveSub) {
            const dailyKey = `push_no_plan_${todayKey}`;
            if (!(await wasSequenceSent(user.id, dailyKey))) {
              const countRes = await fetch(`${SUPABASE_URL_INT}/rest/v1/email_sequence_log?user_id=eq.${user.id}&email_key=like.push_no_plan_*&select=id`, {
                headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` }
              });
              const sentSoFar = (await countRes.json())?.length || 0;
              const variants = PRET_VISUELS_VARIANTS(userProducts[0].nom);
              await sendPushToUser(user.id, {
                title: '📸 Prêt pour tes premiers visuels ?',
                body: variants[sentSoFar % 10],
                url: '/adboard/offers'
              });
              await markSequenceSent(user.id, dailyKey);
              sentCount++;
            }
          }
        }

        // Vu Tarifs sans payer — au moins 20h après la visite, 1 seule fois
        const pushSawPricing = await wasSequenceSent(user.id, 'push_saw_pricing');
        if (!pushSawPricing) {
          const evRes = await fetch(`${SUPABASE_URL_INT}/rest/v1/user_events?user_id=eq.${user.id}&event_key=eq.viewed_pricing&order=created_at.asc&limit=1`, {
            headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` }
          });
          const events = await evRes.json();
          if (Array.isArray(events) && events.length > 0) {
            const hoursSinceView = (Date.now() - new Date(events[0].created_at).getTime()) / (60*60*1000);
            if (hoursSinceView >= 20) {
              await sendPushToUser(user.id, {
                title: '💬 Des questions sur nos offres ?',
                body: 'Ava peut y répondre directement sur AdBoard, ou lance-toi avec Starter.',
                url: '/adboard/offers'
              });
              await markSequenceSent(user.id, 'push_saw_pricing');
              sentCount++;
            }
          }
        }
      }

      // Relance mensuelle après J21 — rotation social proof / nouveauté / check-in, coupure à 180 jours
      if (ageDays >= 51 && ageDays < 180) {
        const monthNumber = Math.floor((ageDays - 21) / 30); // 1, 2, 3, 4...
        const monthlyKey = `monthly_${monthNumber}`;
        const ROTATION = ['monthly_social_proof', 'monthly_novelty', 'monthly_checkin'];
        const templateKey = ROTATION[(monthNumber - 1) % ROTATION.length];
        // Fenêtre ±1 jour autour du jalon mensuel (21 + 30*n)
        const targetDay = 21 + 30 * monthNumber;
        if (ageDays >= targetDay - 1 && ageDays < targetDay + 1) {
          const alreadySent = await wasSequenceSent(user.id, monthlyKey);
          if (!alreadySent) {
            const ok = await sendSequenceEmail(user.email, templateKey, { firstName, currency: userCurrency });
            if (ok) { await markSequenceSent(user.id, monthlyKey); sentCount++; }
          }
        }
      }
    }

    // ── Rappel de renouvellement — chaque jour à partir de J-5 avant expiration ──
    try {
      const subsRes = await fetch(`${SUPABASE_URL_INT}/rest/v1/subscriptions?active=eq.true&select=user_id,plan,expires_at`, {
        headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` }
      });
      const activeSubs = await subsRes.json();
      const todayKey = new Date().toISOString().slice(0,10);
      if (Array.isArray(activeSubs)) {
        for (const sub of activeSubs) {
          if (!sub.expires_at) continue;
          const daysLeft = Math.ceil((new Date(sub.expires_at).getTime() - Date.now()) / DAY_MS);
          if (daysLeft < 0 || daysLeft > 5) continue; // fenêtre J-5 à J0 uniquement
          const dailyKey = `renewal_reminder_${todayKey}`;
          if (await wasSequenceSent(sub.user_id, dailyKey)) continue;
          const planLabelR = PLAN_LABELS[sub.plan] || sub.plan;
          const body = daysLeft === 0
            ? `Ton forfait ${planLabelR} expire aujourd'hui — renouvelle pour ne pas perdre tes images de la semaine.`
            : `Ton forfait ${planLabelR} expire dans ${daysLeft} jour${daysLeft>1?'s':''} — pense à renouveler.`;
          await notifyUserBoth(sub.user_id, {
            title: daysLeft === 0 ? '⏰ Ton forfait expire aujourd\'hui' : '⏰ Ton forfait expire bientôt',
            body,
            url: '/adboard/offers',
            type: 'warning',
          });
          await markSequenceSent(sub.user_id, dailyKey);
          sentCount++;
        }
      }
    } catch(e) {
      console.error('[Sequence] Erreur rappel renouvellement:', e.message);
    }

    console.log(`[Sequence] ✅ Traitement quotidien terminé — ${sentCount} email(s) envoyé(s)`);
  } catch(e) {
    console.error('[Sequence] Erreur cron:', e.message);
  }
  return;
}

// GET /check-subscription/:userId — vérifie si un user a un abonnement actif
// POST /send-welcome-email — envoie l'email de bienvenue (appelé côté client à la 1ère connexion)
if (req.method === 'POST' && req.url === '/send-welcome-email') {
  let body = '';
  req.on('data', d => body += d);
  req.on('end', () => {
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(JSON.stringify({ ok: true }));
    try {
      const { email, name } = JSON.parse(body);
      if (email) sendWelcomeEmail({ email, name }).catch(e => console.error('[Email] Welcome non bloquant:', e.message));
    } catch(e) { console.error('[Welcome] Erreur parsing:', e.message); }
  });
  return;
}

if (req.method === 'GET' && req.url.startsWith('/check-subscription/')) {
  const userId = req.url.split('/')[2];
  try {
    const r = await fetch(`${SUPABASE_URL_INT}/rest/v1/subscriptions?user_id=eq.${userId}&active=eq.true&limit=1`, {
      headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` }
    });
    const rows = await r.json();
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(JSON.stringify({ subscription: rows?.[0] || null }));
  } catch(e) {
    res.writeHead(500); res.end(JSON.stringify({ error: e.message }));
  }
  return;
}


// POST /chat — Ava AI Assistant
if (req.method === 'POST' && req.url === '/chat') {
  let body = '';
  req.on('data', d => body += d);
  req.on('end', async () => {
    try {
      const { message, history=[], context={}, session_id } = JSON.parse(body);
      const GEMINI_KEY = process.env.GEMINI_API_KEY || '';

      // Build system prompt with user context
      const { user, subscription, products=[], credits={}, section='', language='fr' } = context;
      const userName = user?.name?.split(' ')[0] || '';
      const planLabel = subscription?.plan ? `${subscription.plan.charAt(0).toUpperCase()+subscription.plan.slice(1)}` : 'aucun';
      const prodList = products.slice(0,5).map(p => `- ${p.nom} (${p.pays}, ${p.pricing})`).join('\n') || 'Aucun produit créé';
      const creditsInfo = subscription?.active ? `${credits.available||0} images disponibles cette semaine` : 'pas encore abonné';

      const msgCount = history.length;
      const hasSubscription = subscription?.active;
      const isConnected = !!user;
      const planActive = subscription?.plan || 'none';

      // ── Situation calculée en code, pas laissée à l'appréciation du modèle ──
      // C'est la cause profonde des incohérences passées : donner des faits épars et
      // laisser le modèle deviner la bonne action le fait retomber sur ses réflexes
      // génériques de "chatbot de vente" (proposer un plan) même quand ce n'est pas pertinent.
      let situationAction;
      if (!isConnected) {
        situationAction = "Pas encore connecté → priorité : proposer de se connecter avec Google (bouton login).";
      } else if (!hasSubscription) {
        situationAction = "Aucun abonnement actif en ce moment (jamais pris, ou expiré) → proposer un plan adapté à son besoin, avec le bouton checkout correspondant.";
      } else if (products.length === 0) {
        situationAction = "Abonné actif mais AUCUN produit créé → dire d'aller créer un produit (bouton openProductForm). C'est la seule étape qui manque avant de pouvoir demander des images. Ne JAMAIS proposer un plan, il en a déjà un actif.";
      } else if ((credits.available||0) >= 9) {
        situationAction = `Abonné actif, ${products.length} produit(s) créé(s), ${credits.available} images DISPONIBLES MAINTENANT → dire d'aller sur "Mes Produits" et cliquer "Demander mes images" sur le produit concerné, livraison sous 48h. NE JAMAIS proposer un plan ni un renouvellement, il en a déjà un actif avec des images disponibles.`;
      } else {
        situationAction = `Abonné actif, ${products.length} produit(s) créé(s), mais crédits de la semaine épuisés (0 disponible) → c'est normal et temporaire (l'abonnement lui-même reste actif, ce n'est qu'une pause hebdomadaire). Dire que les prochaines images arrivent au rechargement hebdomadaire${credits.nextCreditDate ? ' (' + new Date(credits.nextCreditDate).toLocaleDateString('fr-FR',{day:'numeric',month:'long'}) + ')' : ''}. NE JAMAIS proposer de reprendre un plan ou de "renouveler" — l'abonnement n'a pas expiré, c'est juste le cycle hebdomadaire normal.`;
      }

      const { currency='XOF', currencyRate=1 } = context;
      const formatPrice = (fcfa) => {
        if (currency === 'XOF') return fcfa.toLocaleString('fr-FR') + ' FCFA';
        const val = Math.round(fcfa * currencyRate * 1.035);
        return new Intl.NumberFormat(undefined, {style:'currency', currency, maximumFractionDigits:0}).format(val);
      };
      const userMarket = [...new Set(products.map(p => p.pays).filter(Boolean))].join(', ') || 'non précisé';
      const today = new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });

      const SYSTEM = `Tu es Ava, l'assistante d'AdStack — agence d'images publicitaires Meta Ads pour vendeurs en ligne.

DATE DU JOUR : ${today}. Utilise toujours cette date comme référence — ne suppose jamais une autre année.

━━━━━━━━━━━━━━━
SITUATION ACTUELLE DE CETTE PERSONNE (calculée, fiable à 100% — ne la recalcule jamais toi-même)
${situationAction}
Dès qu'on te demande "comment avoir mes images / comment ça marche / je fais quoi maintenant", c'est CETTE ligne
qui donne la bonne réponse — pas une réponse générique sur les plans. Relis-la avant de répondre à ce type de question.
━━━━━━━━━━━━━━━

CONTEXTE UTILISATEUR (détails à l'appui de la situation ci-dessus)
- Statut : ${isConnected ? 'Connecté (' + user?.email + ')' : 'Non connecté'}
- Plan : ${hasSubscription ? planActive.toUpperCase() : 'Aucun abonnement'}
- Marché : ${userMarket}
- Produits : ${products.length > 0 ? products.map(p => p.nom + ' (' + p.pricing + ' · ' + p.pays + ')').join(' | ') : 'aucun'}
- Images restantes : ${creditsInfo}
- Devise : ${currency}
- Messages échangés : ${msgCount}

OFFRES (toujours dans la devise de l'utilisateur — mensuel ET annuel existent, l'annuel fait économiser ~25%)
Starter : ${formatPrice(39900)}/mois (mensuel) ou ${formatPrice(29900)}/mois (annuel) · 9 images/sem · 1 produit
Pro : ${formatPrice(69900)}/mois (mensuel) ou ${formatPrice(54900)}/mois (annuel) · 18 images/sem · 1-2 produits
Scale : ${formatPrice(109900)}/mois (mensuel) ou ${formatPrice(79900)}/mois (annuel) · 36 images/sem · 1-4 produits
Plan actif : ${hasSubscription ? planActive.toUpperCase() + ' — NE JAMAIS le reproposer' : 'AUCUN'}

TU ES
Ava. Tu parles comme une vraie personne — directe, chaleureuse. Prénom utilisé MAX 1 fois dans toute la conversation.

━━━━━━━━━━━━━━━
RÈGLE 0 — TON RÔLE, STRICT ET NON NÉGOCIABLE
Tu ne fais JAMAIS le travail toi-même. Tu ne proposes JAMAIS d'angles marketing, tu ne demandes JAMAIS les couleurs
d'un produit, tu ne demandes JAMAIS quel type de visuel (avant/après, etc.) la personne veut, tu ne donnes JAMAIS
d'avis créatif ou d'analyse de marché. Ce travail est fait après la commande par notre équipe humaine — pas par toi.
Ton rôle se limite à : expliquer comment AdStack fonctionne, rassurer, rediriger vers la bonne action (créer un
produit, s'abonner, suivre une commande, voir la galerie). Si on te demande un avis créatif/marketing, réponds que
notre équipe s'en charge une fois la commande passée, et redirige vers l'action correspondante.

RÈGLE 1 — FORMAT (décide AVANT d'écrire)
→ Réponse simple = 1-3 phrases, zéro bullet
→ 2-4 éléments = bullets courts, 1 ligne max chacun
→ Explication = 1 paragraphe, 2-3 phrases
→ Jamais de bloc > 4 lignes sans saut de ligne
→ Toujours finir par UNE courte question (sauf CTA)

RÈGLE 2 — CONCISION
Maximum d'info, minimum de mots.

RÈGLE 3 — GOOGLE SEARCH
Construis toujours la requête avec : marché de l'utilisateur (${userMarket}), catégorie produit, année en cours (${new Date().getFullYear()}). Jamais de données d'un autre pays que le sien.

RÈGLE 4 — BÉNÉFICES PAS FEATURES (dans le discours, jamais dans les faits — voir RÈGLE 0)
❌ "36 images/semaine" → ✅ "Notre équipe teste plusieurs angles pour toi — quand le winner sort, tu scales."
Désir profond : plus de ventes, moins de galère, liberté financière.

RÈGLE 5 — CTA
0 bouton avant le 4ème échange. 1 seul par message. Jamais 2 de suite.
Prospect chaud → bouton checkout DIRECT au message suivant.
[BTN:login:Connecter mon compte] [BTN:openProductForm:Créer mon produit]
[BTN:checkout:starter:Démarrer →] [BTN:checkout:pro:Passer en Pro →] [BTN:checkout:scale:Passer en Scale →]
[BTN:checkout-annual:starter:Starter annuel -25% →] [BTN:checkout-annual:pro:Pro annuel -25% →] [BTN:checkout-annual:scale:Scale annuel -25% →]
[BTN:navigate:suivi:Mes demandes] [BTN:navigate:galerie:Mes images]
Utilise checkout-annual quand la personne parle d'engagement long terme, d'économiser, ou demande explicitement
l'annuel. Sinon, checkout (mensuel) reste le choix par défaut.

Langue : ${language === 'fr' ? 'français uniquement' : 'English only'}`

      // Google Grounding pour données marché en temps réel
      const contents = [
        ...history.slice(-6).map(m => ({ role: m.role, parts: [{ text: m.content }] })),
        { role: 'user', parts: [{ text: message }] }
      ];

      const vertexBody = {
        system_instruction: { parts: [{ text: SYSTEM }] },
        contents,
        generationConfig: { maxOutputTokens: 220, temperature: 0.4, thinkingConfig: { thinkingBudget: 0 } }
      };

      const CHAT_MODEL = 'gemini-2.5-flash';
      let token;
      try { token = await getToken(); }
      catch(e) { throw new Error('Token Vertex AI impossible: ' + e.message); }
      console.log('[Ava] Appel Vertex AI model=gemini-2.5-flash contents.length=', contents.length);
      const geminiData = await vertexRequest(token, CHAT_MODEL, vertexBody, 25000);
      console.log('[Ava] Réponse Vertex AI:', JSON.stringify(geminiData).slice(0, 400));
      if (!geminiData?.candidates?.[0]) {
        console.error('[Ava] Gemini error:', JSON.stringify(geminiData).slice(0,300));
      }
      const reply = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "Désolée, je n'ai pas pu répondre. Réessaie dans un instant.";

      // Save to Supabase if service key available
      if (SUPABASE_SERVICE_KEY && session_id) {
        const saveMsg = async (role, content) => {
          await fetch(`${SUPABASE_URL_INT}/rest/v1/chat_messages`, {
            method: 'POST',
            headers: { 'Content-Type':'application/json', apikey:SUPABASE_SERVICE_KEY, Authorization:`Bearer ${SUPABASE_SERVICE_KEY}` },
            body: JSON.stringify({ session_id, role, content })
          });
        };
        saveMsg('user', message).catch(()=>{});
        saveMsg('model', reply).catch(()=>{});
      }

      res.writeHead(200, {'Content-Type':'application/json'});
      res.end(JSON.stringify({ reply }));
    } catch(e) {
      console.error('[Ava] ERREUR COMPLÈTE:', e.message, e.stack?.slice(0,300));
      res.writeHead(500);
      res.end(JSON.stringify({ reply: "Une erreur s'est produite. Réessaie dans un instant.", error: e.message }));
    }
  });
  return;
}

// GET /chat/history/:sessionId — charger l'historique
if (req.method === 'GET' && req.url.startsWith('/chat/history/')) {
  const sessionId = req.url.split('/')[3];
  if (!SUPABASE_SERVICE_KEY || !sessionId) { res.writeHead(200); res.end('[]'); return; }
  try {
    const r = await fetch(`${SUPABASE_URL_INT}/rest/v1/chat_messages?session_id=eq.${sessionId}&order=created_at.asc&limit=30`, {
      headers: { apikey: SUPABASE_SERVICE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` }
    });
    const rows = await r.json();
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(JSON.stringify(rows||[]));
  } catch(e) { res.writeHead(200); res.end('[]'); }
  return;
}

// POST /commandes/:id/cancel — annulation depuis AdBoard
if (req.method === 'POST' && req.url.match(/^\/commandes\/[^/]+\/cancel$/)) {
  const id = req.url.split('/')[2];
  const briefs = loadBriefs();
  const idx = briefs.findIndex(b => b.id === id);
  if (idx >= 0) {
    briefs[idx].status = 'cancelled';
    briefs[idx].cancelled_at = new Date().toISOString();
    saveBriefs(briefs);
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(JSON.stringify({ ok: true }));
  } else {
    res.writeHead(404); res.end(JSON.stringify({ error: 'Brief not found' }));
  }
  return;
}

// POST /commandes/:id/delete — suppression depuis Factory
if (req.method === 'POST' && req.url.match(/^\/commandes\/[^/]+\/delete$/)) {
  const id = req.url.split('/')[2];
  const briefs = loadBriefs();
  const filtered = briefs.filter(b => b.id !== id);
  saveBriefs(filtered);
  res.writeHead(200, {'Content-Type':'application/json'});
  res.end(JSON.stringify({ ok: true }));
  return;
}

// POST /notify-action — notifs push+in-app pour des actions déclenchées côté client
// (création produit, annulation demande, suppression produit — pas de round-trip serveur existant sinon)
const ACTION_NOTIFS = {
  product_created:   (name) => ({ title: '✅ Produit créé',      body: `"${name}" a été ajouté à ton catalogue.`,          url: '/adboard/products', type: 'product' }),
  request_cancelled: (name) => ({ title: 'Demande annulée',      body: `Ta demande pour "${name}" a bien été annulée.`,     url: '/adboard/tracking', type: 'warning' }),
  product_deleted:   (name) => ({ title: 'Produit supprimé',     body: `"${name}" a été retiré de ton catalogue.`,          url: '/adboard/products', type: 'info' }),
};
if (req.method === 'POST' && req.url === '/notify-action') {
  let body = '';
  req.on('data', d => body += d);
  req.on('end', async () => {
    try {
      const { user_id, action, name } = JSON.parse(body);
      const builder = ACTION_NOTIFS[action];
      if (!user_id || !builder) { res.writeHead(400); res.end('{}'); return; }
      await notifyUserBoth(user_id, builder(name || ''));
      res.writeHead(200, {'Content-Type':'application/json'});
      res.end(JSON.stringify({ ok: true }));
    } catch(e) {
      console.error('[NotifyAction] Erreur:', e.message);
      res.writeHead(500); res.end(JSON.stringify({ error: e.message }));
    }
  });
  return;
}

// Garde-fou simple contre les réponses manifestement bâclées/du n'importe quoi — pas d'appel IA, juste des heuristiques rapides
function isLowEffortAnswer(text) {
  const t = (text || '').trim();
  if (t.length < 8) return true; // trop court pour être une vraie réponse
  const words = t.split(/\s+/).filter(w => w.length > 1);
  if (words.length < 2) return true; // moins de 2 mots réels
  if (/(.)\1{5,}/.test(t)) return true; // "aaaaaaa", répétition abusive d'un caractère
  const uniqueChars = new Set(t.toLowerCase().replace(/\s/g, '')).size;
  if (t.length > 15 && uniqueChars < 5) return true; // charabia clavier ("asdasdasdasd")
  return false;
}

// Les 4 messages validés — sans accents volontairement (au-delà de 160 caractères GSM sinon la limite tombe à 70)
const SMS_TEMPLATES = {
  intro: (m) => `Bonjour ${m.marque}, vu votre pub ${m.produit}. On aide des vendeurs a booster leurs ventes avec de meilleures images pub. Voici votre demo gratuite : ${m.lien}`,
  j3:    (m) => `Salut ${m.marque}, vous avez vu la demo pour ${m.produit} ? On sait ce qui pousse vos clients a acheter. Vos prochaines images peuvent en parler : ${m.lien}`,
  j10:   (m) => `Bonjour ${m.marque}, les boutiques qui gagnent du terrain sur ${m.produit} misent sur plusieurs angles pub. On peut faire pareil pour vous : ${m.lien}`,
  j21:   (m) => `Hello ${m.marque}, ${m.produit} a un vrai potentiel selon notre analyse. Le jour ou vous etes pret, on est la : ${m.lien}`,
};

const AT_USERNAME = 'AdStack';
const AT_API_KEY = process.env.AT_API_KEY;

// Normalise un numéro vers le format international E.164 (nécessaire pour Africa's Talking)
function normalizePhone(phone, defaultCountryCode = '221') { // 221 = Sénégal
  let cleaned = (phone || '').replace(/[\s\-().]/g, '');
  if (cleaned.startsWith('+')) return cleaned;
  if (cleaned.startsWith('00')) return '+' + cleaned.slice(2);
  if (cleaned.startsWith('0')) return `+${defaultCountryCode}${cleaned.slice(1)}`;
  return `+${defaultCountryCode}${cleaned}`;
}

// POST /send-prospect-sms — envoie un SMS de prospection (intro/j3/j10/j21), raccourcit le lien, appelle Africa's Talking
if (req.method === 'POST' && req.url === '/send-prospect-sms') {
  let body = '';
  req.on('data', d => body += d);
  req.on('end', async () => {
    try {
      const { phone, template, marque, produit, dest_url, country_code } = JSON.parse(body);
      const builder = SMS_TEMPLATES[template];
      if (!phone || !builder || !marque || !produit || !dest_url) {
        res.writeHead(400); res.end(JSON.stringify({ error: 'missing_fields' })); return;
      }
      if (!AT_API_KEY) {
        res.writeHead(500); res.end(JSON.stringify({ error: 'AT_API_KEY manquante sur le serveur' })); return;
      }

      // 1. Raccourcir le lien avec tracking UTM déjà inclus dans dest_url
      const code = crypto.randomBytes(4).toString('hex');
      await fetch(`${SUPABASE_URL_INT}/rest/v1/short_links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` },
        body: JSON.stringify({ code, long_url: dest_url })
      });
      const shortUrl = `https://adstackofficial.com/s/${code}`;

      // 2. Construire le message
      const message = builder({ marque, produit, lien: shortUrl });

      // 3. Envoyer via Africa's Talking (API live, form-urlencoded)
      const toNumber = normalizePhone(phone, country_code || '221');
      const params = new URLSearchParams({ username: AT_USERNAME, to: toNumber, message });
      const atRes = await fetch('https://api.africastalking.com/version1/messaging', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'apiKey': AT_API_KEY,
        },
        body: params.toString(),
      });
      const atData = await atRes.json();
      const recipient = atData?.SMSMessageData?.Recipients?.[0];

      console.log(`[SMS] ${template} → ${toNumber} : ${recipient?.status || 'inconnu'} (${recipient?.cost || '?'})`);
      res.writeHead(200, {'Content-Type':'application/json'});
      res.end(JSON.stringify({ ok: recipient?.status === 'Success', status: recipient?.status, cost: recipient?.cost, message_id: recipient?.messageId, short_url: shortUrl }));
    } catch(e) {
      console.error('[SMS] Erreur:', e.message);
      res.writeHead(500); res.end(JSON.stringify({ error: e.message }));
    }
  });
  return;
}

// GET /setup-thumbnails — génère et upload les 3 miniatures AdStack vers Supabase (à usage unique)
if (req.method === 'GET' && req.url === '/setup-thumbnails') {
  (async () => {
    const SB_URL2 = 'https://mifljhsusidgzelnswma.supabase.co';
    const SB_KEY2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pZmxqaHN1c2lkZ3plbG5zd21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5MjI2MzQsImV4cCI6MjA5MzQ5ODYzNH0.AX4Xu0sP2tgjLhZSbCKhtw4Q3sd7GRMJ2aMKK3GfzUc';
    const resultats = [];
    for (const v of THUMBS_ADSTACK) {
      try {
        const svg = buildAdStackThumb(v);
        const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
        const uploadRes = await new Promise((resolve, reject) => {
          const r = https.request({
            hostname: 'mifljhsusidgzelnswma.supabase.co',
            path: `/storage/v1/object/demos/${v.nom}.png`,
            method: 'POST',
            headers: { 'Authorization': `Bearer ${SB_KEY2}`, 'apikey': SB_KEY2, 'Content-Type': 'image/png', 'Content-Length': png.length, 'x-upsert': 'true' }
          }, resp => { let d=''; resp.on('data', c=>d+=c); resp.on('end', () => resolve({status: resp.statusCode, body: d})); });
          r.on('error', reject); r.write(png); r.end();
        });
        resultats.push({ nom: v.nom, ok: uploadRes.status === 200 || uploadRes.status === 201, status: uploadRes.status, url: `${SB_URL2}/storage/v1/object/public/demos/${v.nom}.png` });
      } catch(e) {
        resultats.push({ nom: v.nom, ok: false, erreur: e.message });
      }
    }
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end(JSON.stringify(resultats, null, 2));
  })();
  return;
}

// POST /shorten — crée un lien court auto-hébergé (utilisé pour les SMS, limite de caractères,
// et les relances J+10/J+21 qui ont besoin d'une miniature différente du lien direct)
if (req.method === 'POST' && req.url === '/shorten') {
  let body = '';
  req.on('data', d => body += d);
  req.on('end', async () => {
    try {
      const { url, thumbnail, campagne } = JSON.parse(body);
      if (!url) { res.writeHead(400); res.end(JSON.stringify({ error: 'missing_url' })); return; }
      const code = crypto.randomBytes(4).toString('hex'); // 8 caractères, ex: a1b2c3d4
      const insertRes = await fetch(`${SUPABASE_URL_INT}/rest/v1/short_links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
        body: JSON.stringify({ code, long_url: url, thumbnail: thumbnail || null, campagne: campagne || null })
      });
      if (!insertRes.ok) {
        const errText = await insertRes.text();
        console.error('[Shorten] Échec insertion:', insertRes.status, errText.slice(0,300));
        res.writeHead(500); res.end(JSON.stringify({ error: 'insert_failed' })); return;
      }
      res.writeHead(200, {'Content-Type':'application/json'});
      res.end(JSON.stringify({ short_url: `https://adstackofficial.com/s/${code}` }));
    } catch(e) {
      console.error('[Shorten] Erreur:', e.message);
      res.writeHead(500); res.end(JSON.stringify({ error: e.message }));
    }
  });
  return;
}

// GET /s/:code — redirige vers le lien d'origine, compte le clic. Si une miniature a été
// configurée sur ce lien (J+10/J+21), sert d'abord une page avec les bonnes balises OG,
// puis redirige en JS — sinon un simple 302 direct (miniature par défaut d'AdBoard).
if (req.method === 'GET' && req.url.startsWith('/s/')) {
  const code = req.url.split('/s/')[1]?.split('?')[0];
  if (!code) { res.writeHead(404); res.end('Not found'); return; }
  try {
    const r = await fetch(`${SUPABASE_URL_INT}/rest/v1/short_links?code=eq.${code}&select=id,long_url,clicks,thumbnail`, {
      headers: { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` }
    });
    const rows = await r.json();
    const link = rows?.[0];
    if (!link) { res.writeHead(404); res.end('Lien introuvable ou expiré'); return; }
    // Comptage du clic — non bloquant, ne retarde pas la redirection
    fetch(`${SUPABASE_URL_INT}/rest/v1/short_links?id=eq.${link.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ clicks: (link.clicks || 0) + 1 })
    }).catch(()=>{});

    if (link.thumbnail) {
      const imgUrl = `https://mifljhsusidgzelnswma.supabase.co/storage/v1/object/public/demos/${link.thumbnail}.png`;
      const escAttr = (s) => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
      const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
<meta property="og:type" content="website">
<meta property="og:title" content="AdStack">
<meta property="og:image" content="${escAttr(imgUrl)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${escAttr(imgUrl)}">
<script>
  (function(){
    if (window.self !== window.top) return;
    var ua = navigator.userAgent || '';
    var isBot = /WhatsApp|facebookexternalhit|Facebot|Twitterbot|LinkedInBot|Googlebot|Slackbot|Discordbot/i.test(ua);
    if (!isBot) window.location.replace(${JSON.stringify(link.long_url)});
  })();
</script>
</head><body></body></html>`;
      res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
      res.end(html);
      return;
    }

    res.writeHead(302, { 'Location': link.long_url });
    res.end();
  } catch(e) {
    console.error('[Shorten] Erreur redirection:', e.message);
    res.writeHead(500); res.end('Erreur serveur');
  }
  return;
}

// POST /save-form-response — reçoit les réponses du formulaire pré-achat ou post-achat
if (req.method === 'POST' && req.url === '/save-form-response') {
  let body = '';
  req.on('data', d => body += d);
  req.on('end', async () => {
    try {
      const { user_id, email, source, answers } = JSON.parse(body);
      if (!source || !Array.isArray(answers) || answers.length === 0) {
        res.writeHead(400); res.end(JSON.stringify({ error: 'invalid_payload' })); return;
      }

      // Garde-fou uniquement sur le formulaire pré-achat (obligatoire) — le post-achat est facultatif, pas de blocage
      if (source === 'prepurchase_form') {
        const lowEffortCount = answers.filter(a => isLowEffortAnswer(a.answer)).length;
        if (lowEffortCount > 2) {
          res.writeHead(422, {'Content-Type':'application/json'});
          res.end(JSON.stringify({ error: 'low_effort', message: 'Essaie de répondre un peu plus en détail à certaines questions.' }));
          return;
        }
      }

      const rows = answers.map(a => ({
        source, user_id: user_id || null, email: email || null,
        question: a.question, answer: a.answer,
      }));
      const insertRes = await fetch(`${SUPABASE_URL_INT}/rest/v1/data_insights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
        body: JSON.stringify(rows)
      });
      if (!insertRes.ok) {
        const errText = await insertRes.text();
        console.error('[DataInsights] Échec insertion:', insertRes.status, errText.slice(0,300));
        res.writeHead(500); res.end(JSON.stringify({ error: 'insert_failed' })); return;
      }

      console.log(`[DataInsights] ✅ ${rows.length} réponse(s) enregistrée(s) — source: ${source}`);
      res.writeHead(200, {'Content-Type':'application/json'});
      // Code promo uniquement pour le pré-achat — code fixe, à créer une seule fois dans le dashboard Chariow
      res.end(JSON.stringify({ ok: true, promo_code: source === 'prepurchase_form' ? 'MERCI10' : null }));
    } catch(e) {
      console.error('[DataInsights] Erreur:', e.message);
      res.writeHead(500); res.end(JSON.stringify({ error: e.message }));
    }
  });
  return;
}

// POST /commandes/:id/done — marquer livré
  if (req.method === 'POST' && req.url.match(/^\/commandes\/[^/]+\/done$/)) {

    const id = req.url.split('/')[2];
    const briefs = loadBriefs();
    const idx = briefs.findIndex(b => b.id === id);
    if (idx >= 0) {
      briefs[idx].status = 'done';
      briefs[idx].done_at = new Date().toISOString();
      saveBriefs(briefs);
      res.writeHead(200, {'Content-Type':'application/json'});
      res.end(JSON.stringify({ ok: true }));
      // Notification push + trace persistante — livrables prêts
      const userId = briefs[idx].client?.user_id;
      if (userId) {
        notifyUserBoth(userId, {
          title: '🎉 Tes visuels sont prêts',
          body: `Les images pour ${briefs[idx].product?.nom || 'ton produit'} sont livrées — va les récupérer sur AdBoard.`,
          url: '/adboard/gallery',
          type: 'brief',
        }).catch(()=>{});
      }
    } else {
      res.writeHead(404); res.end(JSON.stringify({ error: 'Brief not found' }));
    }
    return;
  }

  res.writeHead(404); res.end('Not found');
});

// ── HTTPS GET → JSON ────────────────────────────
function httpsGetJson(targetUrl) {
  return new Promise((resolve, reject) => {
    https.get(targetUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch(e) { reject(new Error('JSON invalide: ' + d.slice(0,200))); }
      });
    }).on('error', reject);
  });
}

// ── HTTPS GET → HTML brut (pour parsing regex, ex. Jumia) ──
function fetchRawHtml(targetUrl, depth) {
  depth = depth || 0;
  return new Promise((resolve, reject) => {
    const urlObj = new URL(targetUrl);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + (urlObj.search || ''),
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        'Accept-Language': 'fr-FR,fr;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,*/*;q=0.9'
      },
      timeout: 15000
    };
    const r = https.request(options, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && depth < 3) {
        const redir = new URL(res.headers.location, targetUrl).href;
        res.resume(); // drain
        fetchRawHtml(redir, depth + 1).then(resolve).catch(reject);
        return;
      }
      let data = '';
      res.on('data', c => { data += c; if (data.length > 1_500_000) res.destroy(); });
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });
    r.on('error', reject);
    r.on('timeout', () => { r.destroy(); reject(new Error('Timeout')); });
    r.end();
  });
}

// ── Teaser SVG (miniature OG style mindmap) ────────
// ── Miniatures de marque AdStack (principale + 2 variantes J+10/J+21) ──
// Générées une seule fois via /setup-thumbnails, puis servies statiquement depuis Supabase.
function buildAdStackThumb({ accent, accentGlow, label }) {
  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.10)"/>
    </pattern>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${accentGlow}" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="${accentGlow}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#0D1828"/>
  <rect width="1200" height="630" fill="url(#dots)"/>
  <circle cx="600" cy="315" r="420" fill="url(#glow)"/>
  <rect x="790" y="90"  width="230" height="290" rx="16" fill="#16222F" stroke="#233247" stroke-width="1.5" opacity="0.9"/>
  <rect x="815" y="115" width="180" height="130" rx="10" fill="#1D2F45"/>
  <rect x="815" y="260" width="140" height="10" rx="5" fill="#2C4060"/>
  <rect x="815" y="280" width="180" height="8"  rx="4" fill="#233247"/>
  <rect x="815" y="296" width="120" height="8"  rx="4" fill="#233247"/>
  <rect x="815" y="325" width="180" height="34" rx="8" fill="${accent}" opacity="0.9"/>
  <rect x="1050" y="150" width="120" height="150" rx="14" fill="#16222F" stroke="#233247" stroke-width="1.5" opacity="0.55" transform="rotate(8 1110 225)"/>
  <text x="80" y="270" fill="#FFFFFF" font-size="90" font-weight="900" font-family="Arial,sans-serif" letter-spacing="-2">AdStack</text>
  <rect x="82" y="292" width="230" height="6" rx="3" fill="${accent}"/>
  <text x="80" y="345" fill="#B0C4D8" font-size="27" font-weight="600" font-family="Arial,sans-serif">Images publicitaires Meta Ads,</text>
  <text x="80" y="382" fill="#B0C4D8" font-size="27" font-weight="600" font-family="Arial,sans-serif">basées sur une vraie analyse de marché.</text>
  <text x="80" y="450" fill="${accent}" font-size="20" font-weight="800" letter-spacing="2" font-family="Arial,sans-serif">${label}</text>
  <text x="80" y="580" fill="#5A7290" font-size="19" font-weight="700" letter-spacing="1" font-family="Arial,sans-serif">ADSTACKOFFICIAL.COM</text>
</svg>`;
}

const THUMBS_ADSTACK = [
  { nom: 'adstack_thumb_main', accent: '#1FB6FF', accentGlow: '#1FB6FF', label: 'AGENCE DE CRÉATIVES PUBLICITAIRES' },
  { nom: 'adstack_thumb_j10',  accent: '#32FF7E', accentGlow: '#32FF7E', label: 'VOS PROCHAINES IMAGES VOUS ATTENDENT' },
  { nom: 'adstack_thumb_j21',  accent: '#FFB547', accentGlow: '#FFB547', label: 'DERNIÈRE RELANCE — POTENTIEL À EXPLOITER' },
];

function buildTeaserSvg({ marque, score }) {
  const escXml = (s) => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');

  const s = Math.max(0, Math.min(100, Number(score) || 75));
  const tier = s >= 85 ? 'Exceptionnel' : s >= 75 ? 'Très élevé' : s >= 65 ? 'Élevé' : 'Modéré';

  const cx = 320, cy = 315, r = 145, sw = 26;
  const circumference = 2 * Math.PI * r;
  const dash = (s/100) * circumference;
  const gap = circumference - dash;

  const ghostCards = [
    { x: 660, y: 60,  w: 230, h: 100 },
    { x: 930, y: 195, w: 230, h: 110 },
    { x: 660, y: 330, w: 230, h: 100 },
    { x: 930, y: 460, w: 230, h: 110 },
  ];

  const connectors = ghostCards.map(c =>
    `<line x1="${cx + r + 10}" y1="${cy}" x2="${c.x}" y2="${c.y + c.h/2}" stroke="#2C4060" stroke-width="2" opacity="0.55"/>`
  ).join('\n      ');

  const ghosts = ghostCards.map(c =>
    `<rect x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" rx="13" fill="#1D2F45" stroke="#2C4060" stroke-width="1.5" opacity="0.55"/>
      <rect x="${c.x+18}" y="${c.y+18}" width="60" height="8" rx="4" fill="#2C4060" opacity="0.8"/>
      <rect x="${c.x+18}" y="${c.y+36}" width="${c.w-36}" height="6" rx="3" fill="#2C4060" opacity="0.6"/>
      <rect x="${c.x+18}" y="${c.y+50}" width="${c.w-70}" height="6" rx="3" fill="#2C4060" opacity="0.6"/>`
  ).join('\n      ');

  return `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.12)"/>
    </pattern>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1FB6FF" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#1FB6FF" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="#0D1828"/>
  <rect width="1200" height="630" fill="url(#dots)"/>

  ${connectors}

  ${ghosts}

  <circle cx="${cx}" cy="${cy}" r="${r+50}" fill="url(#glow)"/>

  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#16222F" stroke-width="${sw}"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#1FB6FF" stroke-width="${sw}"
    stroke-dasharray="${dash.toFixed(1)} ${gap.toFixed(1)}" stroke-linecap="round"
    transform="rotate(-90 ${cx} ${cy})"/>

  <text x="${cx}" y="${cy - 8}" text-anchor="middle" fill="#FFFFFF" font-size="92" font-weight="900" font-family="Arial,sans-serif">${s}</text>
  <text x="${cx}" y="${cy + 38}" text-anchor="middle" fill="#6A84A0" font-size="22" font-weight="700" font-family="Arial,sans-serif">/100</text>

  <text x="${cx}" y="${cy + r + 50}" text-anchor="middle" fill="#6A84A0" font-size="18" font-weight="700" letter-spacing="3" font-family="Arial,sans-serif">POTENTIEL</text>
  <text x="${cx}" y="${cy + r + 82}" text-anchor="middle" fill="#1FB6FF" font-size="26" font-weight="900" font-family="Arial,sans-serif">${escXml(tier)}</text>

  <text x="60" y="60" fill="#B0C4D8" font-size="20" font-weight="800" letter-spacing="2" font-family="Arial,sans-serif">${escXml((marque||'').toUpperCase())}</text>

  <text x="1140" y="600" text-anchor="end" fill="#6A84A0" font-size="16" font-weight="700" letter-spacing="2" font-family="Arial,sans-serif">ADSTACK</text>
</svg>`;
}

// ── URL Page Fetcher ────────────────────────────
function fetchPageText(targetUrl, depth) {
  depth = depth || 0;
  return new Promise((resolve, reject) => {
    try {
      const urlObj = new URL(targetUrl);
      const isHttps = urlObj.protocol === 'https:';
      const lib = isHttps ? https : http;
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || (isHttps ? 443 : 80),
        path: urlObj.pathname + (urlObj.search || ''),
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
          'Accept': 'text/html,application/xhtml+xml,*/*;q=0.9',
          'Accept-Language': 'fr-FR,fr;q=0.9',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'close'
        },
        timeout: 20000
      };
      const r = lib.request(options, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && depth < 3) {
          const redir = new URL(res.headers.location, targetUrl).href;
          fetchPageText(redir, depth + 1).then(resolve).catch(reject);
          return;
        }
        let data = '';
        res.on('data', c => { data += c; if (data.length > 200000) res.destroy(); });
        res.on('end', () => {
          const text = data
            .replace(/<script[\s\S]*?<\/script>/gi, ' ')
            .replace(/<style[\s\S]*?<\/style>/gi, ' ')
            .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
            .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
            .replace(/<header[\s\S]*?<\/header>/gi, ' ')
            .replace(/<[^>]+>/g, ' ')
            .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
            .replace(/\s{2,}/g, ' ').trim()
            .slice(0, 12000);
          resolve(text);
        });
        res.on('error', reject);
      });
      r.on('error', reject);
      r.on('timeout', () => { r.destroy(); reject(new Error('Timeout URL')); });
      r.end();
    } catch(e) { reject(e); }
  });
}


// ══════════════════════════════════════════════════════════════════════════
// SYSTÈME COMMANDES — AdBoard → Factory
// ══════════════════════════════════════════════════════════════════════════

const BRIEFS_FILE = path.join(__dirname, 'briefs_queue.json');

function loadBriefs() {
  try { return JSON.parse(fs.readFileSync(BRIEFS_FILE, 'utf8')); }
  catch(e) { return []; }
}

function saveBriefs(briefs) {
  fs.writeFileSync(BRIEFS_FILE, JSON.stringify(briefs, null, 2));
}

function removeBackground(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const { exec } = require('child_process');
    exec(`rembg i "${inputPath}" "${outputPath}"`, { timeout: 60000 }, (err, stdout, stderr) => {
      if (err) { reject(new Error(stderr || err.message)); }
      else { resolve(outputPath); }
    });
  });
}

async function processProductPhoto(photoBase64, briefId) {
  if (!photoBase64 || !photoBase64.startsWith('data:')) return null;
  try {
    const tmpDir = path.join(__dirname, 'tmp_briefs');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
    const ext = photoBase64.match(/data:image\/(\w+);/)?.[1] || 'jpg';
    const inputPath  = path.join(tmpDir, `${briefId}_input.${ext}`);
    const outputPath = path.join(tmpDir, `${briefId}_nobg.png`);
    const base64Data = photoBase64.replace(/^data:image\/\w+;base64,/, '');
    fs.writeFileSync(inputPath, Buffer.from(base64Data, 'base64'));
    await removeBackground(inputPath, outputPath);
    const pngBuffer = fs.readFileSync(outputPath);
    const pngBase64 = 'data:image/png;base64,' + pngBuffer.toString('base64');
    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);
    console.log(`[ReBG] ✅ Background supprimé pour brief ${briefId}`);
    return pngBase64;
  } catch(e) {
    console.warn(`[ReBG] ⚠️ Échec background removal: ${e.message} → image originale conservée`);
    return null;
  }
}


server.listen(PORT, () => {
  console.log(`\n✅ AdStack Server → http://localhost:${PORT}\n`);
});

// ── Auto-ping — empêche Render (offre gratuite) de mettre le serveur en veille ──
// Sans ça, après 15 min sans trafic, Render endort le service, et le 1er visiteur
// suivant (souvent un prospect qui clique sur sa démo) tombe sur l'écran de réveil
// générique de Render — mauvaise impression, surtout en pleine prospection à froid.
const RENDER_URL_PUBLIC = 'https://adstack-server.onrender.com';
setInterval(() => {
  https.get(`${RENDER_URL_PUBLIC}/`, (res) => {
    res.on('data', () => {});
    res.on('end', () => console.log(`[Auto-ping] OK (${res.statusCode})`));
  }).on('error', (e) => console.log(`[Auto-ping] Erreur : ${e.message}`));
}, 10 * 60 * 1000); // toutes les 10 minutes — bien en dessous du seuil de 15 min de Render
