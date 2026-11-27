// appel_khalil.js — KHALIL, l'agent qui mène les appels de vente AdStack dans Google Meet (khalil-v1, 27 nov. 2026).
//
// Comment ça marche :
//   1. Amar remplit adstackofficial.com/khalil-lancer.html (lien Meet + prospect) → POST /khalil/lancer.
//   2. Le serveur crée un bot Recall.ai (région EU) qui rejoint le Meet et partage une page web : adstackofficial.com/khalil.html.
//   3. Cette page ouvre la conversation vocale ElevenLabs (l'agent « Khalil ») : elle entend le Meet, parle dans le Meet,
//      et affiche l'accueil, la page produit du prospect ou les slides selon ce que Khalil décide.
//   4. Khalil envoie le lien de paiement dans le chat du Meet (POST /khalil/chat) et quitte l'appel à la fin (POST /khalil/fin).
//
// Variables Render : RECALL_API_KEY (obligatoire), ELEVENLABS_API_KEY (obligatoire),
//   ELEVENLABS_VOICE_ID (voix de Khalil ; sinon une voix par défaut), RECALL_REGION (défaut eu-central-1),
//   KHALIL_SORTIE (screenshare | camera, défaut screenshare), KHALIL_LLM et KHALIL_TTS (pour forcer un modèle ; sinon le meilleur disponible est choisi).
// Aucune clé n'est jamais envoyée à la page : elle reçoit seulement un lien de conversation signé, valable pour un appel.

const crypto = require('crypto');
const { SCRIPT, PREMIER_MESSAGE } = require('./khalil_script');

const VERSION = 'khalil-v2';
const SITE = 'https://www.adstackofficial.com';
const NOM_AGENT = 'Khalil · AdStack (appels de vente)';
const NOM_BOT = "Khalil · AdStack";
const VOIX_DEFAUT = 'pNInz6obpgDQGcFmaJgB';   // voix masculine de la bibliothèque ElevenLabs ; à remplacer par ELEVENLABS_VOICE_ID
const SESSIONS = new Map();                    // session → { ctx, bot_id, cree, journal[] }
const DUREE_SESSION_MS = 6 * 3600 * 1000;
let AGENT_ID = null;
let REGLAGE = { llm: null, tts: null };   // ce qui a été accepté par ElevenLabs à la dernière installation
// khalil-v2 — cerveau : le raisonnement d'abord (ElevenLabs recommande Claude Sonnet pour le raisonnement complexe), puis des replis si le compte ne l'a pas.
const CERVEAUX = ['claude-sonnet-5-5', 'claude-sonnet-5', 'claude-sonnet-4-6', 'claude-sonnet-4-5', 'gemini-2.5-flash'];
// voix : Eleven v4 Turbo est fait pour les agents en direct (clones plus fidèles, intonation plus stable) ; replis si indisponible.
const VOIX_MODELES = ['eleven_v4_turbo', 'eleven_v3_conversational', 'eleven_turbo_v2_5', 'eleven_flash_v2_5'];
let OFFRES_CACHE = { t: 0, v: null };

const recallBase = () => `https://${process.env.RECALL_REGION || 'eu-central-1'}.recall.ai/api/v1`;
const cleRecall = () => process.env.RECALL_API_KEY || '';
const cleEleven = () => process.env.ELEVENLABS_API_KEY || '';
const secret = () => process.env.KHALIL_SECRET || cleRecall() || 'khalil';
const signe = (s) => crypto.createHmac('sha256', secret()).update(String(s)).digest('hex').slice(0, 32);
const signatureOk = (s, t) => !!s && !!t && SESSIONS.has(s) && crypto.timingSafeEqual(Buffer.from(signe(s)), Buffer.from(String(t).padEnd(32, '0').slice(0, 32)));

function repondre(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(obj));
}
function lireCorps(req) {
  return new Promise((ok) => {
    let b = ''; req.on('data', (c) => { b += c; if (b.length > 2e5) req.destroy(); });
    req.on('end', () => { try { ok(b ? JSON.parse(b) : {}); } catch (_) { ok({}); } });
    req.on('error', () => ok({}));
  });
}
function noter(s, quoi) {
  const S = SESSIONS.get(s); const ligne = `${new Date().toISOString().slice(11, 19)} ${String(quoi).slice(0, 300)}`;
  if (S) { S.journal.push(ligne); if (S.journal.length > 300) S.journal.shift(); }
  console.log(`[Khalil ${String(s).slice(0, 6)}] ${String(quoi).slice(0, 300)}`);
}
function nettoyer() {
  const t = Date.now();
  for (const [k, v] of SESSIONS) if (t - v.cree > DUREE_SESSION_MS) SESSIONS.delete(k);
}

// ── Recall.ai ─────────────────────────────────────────────────────────────
async function recall(chemin, methode, corps) {
  const essai = async (auth) => fetch(`${recallBase()}${chemin}`, {
    method: methode, headers: { Authorization: auth, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: corps ? JSON.stringify(corps) : undefined,
  });
  let r = await essai(`Token ${cleRecall()}`);
  if (r.status === 401) r = await essai(cleRecall());   // les deux formes d'en-tête existent dans la doc Recall
  const txt = await r.text(); let j = null; try { j = JSON.parse(txt); } catch (_) {}
  if (!r.ok) throw new Error(`Recall ${methode} ${chemin} → HTTP ${r.status} : ${txt.slice(0, 400)}`);
  return j || {};
}

// ── ElevenLabs ────────────────────────────────────────────────────────────
async function eleven(chemin, methode, corps) {
  const r = await fetch(`https://api.elevenlabs.io${chemin}`, {
    method: methode, headers: { 'xi-api-key': cleEleven(), 'Content-Type': 'application/json' },
    body: corps ? JSON.stringify(corps) : undefined,
  });
  const txt = await r.text(); let j = null; try { j = JSON.parse(txt); } catch (_) {}
  if (!r.ok) throw new Error(`ElevenLabs ${methode} ${chemin} → HTTP ${r.status} : ${txt.slice(0, 500)}`);
  return j || {};
}

function configAgent(llm, tts) {
  llm = llm || process.env.KHALIL_LLM || CERVEAUX[0]; tts = tts || process.env.KHALIL_TTS || VOIX_MODELES[0];
  const outil = (name, description, proprietes, requis) => ({
    type: 'client', name, description, expects_response: true, response_timeout_secs: 10,
    parameters: { type: 'object', properties: proprietes || {}, required: requis || [] },
  });
  return {
    name: NOM_AGENT,
    tags: ['adstack', 'appels-de-vente'],
    conversation_config: {
      agent: {
        first_message: PREMIER_MESSAGE,
        language: 'fr',
        prompt: {
          prompt: SCRIPT,
          llm,
          temperature: 0.6,
          tools: [
            outil('montrer_accueil', "Affiche l'écran d'accueil de l'appel sur l'écran partagé."),
            outil('montrer_page_produit', "Affiche la page produit du prospect sur l'écran partagé.",
              { endroit: { type: 'string', description: 'Partie de la page à montrer : haut, milieu ou bas.', enum: ['haut', 'milieu', 'bas'] } }),
            outil('montrer_slide', 'Affiche une slide de la présentation par son numéro.',
              { numero: { type: 'number', description: 'Numéro de la slide, à partir de 1.' } }, ['numero']),
            outil('montrer_annexe', "Affiche une annexe de la présentation : la comparaison des offres, ou l'autre façon de démarrer quand le budget ne suit pas.",
              { annexe: { type: 'string', description: 'comparer ou reduite', enum: ['comparer', 'reduite'] } }, ['annexe']),
            outil('envoyer_lien_paiement', "Envoie le lien de paiement de l'offre choisie dans le chat du Meet.",
              { offre: { type: 'string', description: "principale (l'offre des slides) ou reduite (l'autre façon de démarrer)", enum: ['principale', 'reduite'] } }, ['offre']),
            { type: 'system', name: 'end_call', description: "Termine l'appel après avoir dit au revoir, ou si le prospect est parti.", params: { system_tool_type: 'end_call' } },
          ],
        },
      },
      // stabilité moyenne-haute : la voix garde le même timbre et le même volume d'une phrase à l'autre ; similarité haute : elle reste celle du clone
      tts: { model_id: tts, voice_id: process.env.ELEVENLABS_VOICE_ID || VOIX_DEFAUT, stability: 0.6, similarity_boost: 0.85, text_normalisation_type: 'elevenlabs' },
      // « patient » : Khalil laisse le prospect finir ses phrases et ses silences de réflexion avant de reprendre
      turn: { turn_eagerness: 'patient', turn_timeout: 10 },
      conversation: { max_duration_seconds: 3600 },
    },
    platform_settings: { auth: { enable_auth: true } },
  };
}

// Crée l'agent s'il n'existe pas, sinon le met à jour avec le script de ce fichier (le script vit dans le code, versionné).
async function installerAgent() {
  let id = AGENT_ID;
  if (!id) {
    const l = await eleven(`/v1/convai/agents?search=${encodeURIComponent('Khalil')}&page_size=30`, 'GET');
    const trouve = (l.agents || []).find((a) => a.name === NOM_AGENT);
    if (trouve) id = trouve.agent_id;
  }
  // On essaie le meilleur cerveau et la meilleure voix ; si ElevenLabs refuse un modèle (pas disponible sur ce compte), on passe au suivant.
  const uniq = (t) => t.filter((x, i) => x && t.indexOf(x) === i);
  const cerveaux = uniq([process.env.KHALIL_LLM, ...CERVEAUX]), voix = uniq([process.env.KHALIL_TTS, ...VOIX_MODELES]);
  let derniere = null;
  for (const llm of cerveaux) {
    for (const tts of voix) {
      try {
        const cfg = configAgent(llm, tts);
        if (id) await eleven(`/v1/convai/agents/${id}`, 'PATCH', cfg);
        else id = (await eleven('/v1/convai/agents/create', 'POST', cfg)).agent_id;
        AGENT_ID = id; REGLAGE = { llm, tts };
        console.log(`[Khalil] agent ${id} installé : cerveau ${llm}, voix ${tts}`);
        return id;
      } catch (e) {
        derniere = e;
        if (!/HTTP 4(00|22)/.test(e.message)) throw e;   // autre chose qu'un réglage refusé (clé, réseau) : inutile d'insister
        console.log(`[Khalil] réglage refusé (${llm} + ${tts}) : ${e.message.slice(0, 160)}`);
      }
    }
  }
  throw derniere || new Error('aucun réglage accepté par ElevenLabs');
}
async function agentPret() { return AGENT_ID || installerAgent(); }

// ── Offres (source unique : offres.json du site) ──────────────────────────
async function offres() {
  if (OFFRES_CACHE.v && Date.now() - OFFRES_CACHE.t < 10 * 60 * 1000) return OFFRES_CACHE.v;
  const r = await fetch(`${SITE}/offres.json`, { headers: { 'Cache-Control': 'no-cache' } });
  const j = await r.json();
  OFFRES_CACHE = { t: Date.now(), v: j };
  return j;
}
const milliers = (n) => String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
async function offresDeLAppel(deck) {
  const o = await offres();
  const parId = (id) => (o.offres || []).find((x) => x.id === id) || {};
  const perf = parId('starter'), growth = parId('pro'), one = o.oneshot || {};
  if (deck === 'growth') {
    return { principale: { nom: growth.nom || 'GROWTH', prix: growth.prix, lien: growth.checkout, rythme: 'par mois' },
             reduite: { nom: perf.nom || 'PERF+', prix: perf.prix, lien: perf.checkout, rythme: 'par mois' } };
  }
  return { principale: { nom: perf.nom || 'PERF+', prix: perf.prix, lien: perf.checkout, rythme: 'par mois' },
           reduite: { nom: one.nom || 'ONE SHOT', prix: one.prix, lien: one.checkout, rythme: 'une seule fois' } };
}

// ── Routes ────────────────────────────────────────────────────────────────
async function routes(req, res, deps = {}) {
  const url = new URL(req.url, 'http://x');
  const p = url.pathname;
  if (!p.startsWith('/khalil/')) return false;
  nettoyer();
  const adminOk = async () => (deps.adminOk ? deps.adminOk(req) : false);

  try {
    if (p === '/khalil/etat' && req.method === 'GET') {
      return repondre(res, 200, { version: VERSION, recall: !!cleRecall(), elevenlabs: !!cleEleven(), voix_choisie: !!process.env.ELEVENLABS_VOICE_ID,
        region: process.env.RECALL_REGION || 'eu-central-1', sortie: process.env.KHALIL_SORTIE || 'screenshare', agent: AGENT_ID, cerveau: REGLAGE.llm, voix_modele: REGLAGE.tts, appels_en_memoire: SESSIONS.size }), true;
    }

    if (p === '/khalil/agent' && req.method === 'POST') {
      if (!(await adminOk())) return repondre(res, 401, { error: 'admin requis' }), true;
      if (!cleEleven()) return repondre(res, 400, { error: 'ELEVENLABS_API_KEY manquante dans Render' }), true;
      AGENT_ID = null;
      const id = await installerAgent();
      return repondre(res, 200, { ok: true, agent_id: id, cerveau: REGLAGE.llm, voix_modele: REGLAGE.tts }), true;
    }

    if (p === '/khalil/lancer' && req.method === 'POST') {
      if (!(await adminOk())) return repondre(res, 401, { error: 'admin requis' }), true;
      if (!cleEleven()) return repondre(res, 400, { error: 'ELEVENLABS_API_KEY manquante dans Render' }), true;
      const b = await lireCorps(req);
      const meet = String(b.meet || '').trim();
      if (meet && !/^https:\/\/(meet\.google\.com|[\w.-]*zoom\.us|teams\.(microsoft|live)\.com)\//i.test(meet)) return repondre(res, 400, { error: 'lien de réunion invalide' }), true;
      if (meet && !cleRecall()) return repondre(res, 400, { error: 'RECALL_API_KEY manquante dans Render' }), true;
      const deck = /growth/i.test(b.offre || '') ? 'growth' : 'perf';
      const of = await offresDeLAppel(deck);
      await agentPret();
      const s = crypto.randomBytes(9).toString('base64url');
      const ctx = {
        prenom: String(b.prenom || '').trim().slice(0, 40), marque: String(b.marque || '').trim().slice(0, 80),
        produit: String(b.produit || '').trim().slice(0, 120), page_produit: String(b.page_produit || '').trim().slice(0, 500),
        pays: String(b.pays || '').trim().slice(0, 60), contexte: String(b.contexte || '').trim().slice(0, 3500), deck,
        offre_nom: of.principale.nom, offre_prix: milliers(of.principale.prix),
        offre_reduite_nom: of.reduite.nom, offre_reduite_prix: milliers(of.reduite.prix), offre_reduite_rythme: of.reduite.rythme,
      };
      SESSIONS.set(s, { ctx, offres: of, bot_id: null, cree: Date.now(), journal: [] });
      const t = signe(s);
      const page = `${SITE}/khalil.html?s=${s}&t=${t}${deck === 'growth' ? '&offre=growth' : ''}`;
      // l'aperçu de la page produit se prépare pendant que le bot rejoint (le service d'aperçu met quelques secondes la première fois)
      if (ctx.page_produit) fetch(`https://s.wordpress.com/mshots/v1/${encodeURIComponent(ctx.page_produit)}?w=1280&h=2400`).catch(() => {});
      noter(s, `appel créé pour ${ctx.prenom || '?'} · ${ctx.marque || '?'} · ${deck} · ${meet ? 'Meet' : 'test navigateur'}`);
      if (!meet) return repondre(res, 200, { ok: true, session: s, page: page + '&test=1', test: true }), true;
      const sortie = (process.env.KHALIL_SORTIE || 'screenshare') === 'camera' ? 'camera' : 'screenshare';
      const bot = await recall('/bot/', 'POST', {
        meeting_url: meet, bot_name: NOM_BOT,
        variant: { google_meet: 'web_4_core', zoom: 'web_4_core', microsoft_teams: 'web_4_core' },
        output_media: { [sortie]: { kind: 'webpage', config: { url: page } } },
      });
      SESSIONS.get(s).bot_id = bot.id;
      noter(s, `bot Recall ${bot.id} envoyé dans le Meet (${sortie})`);
      return repondre(res, 200, { ok: true, session: s, bot_id: bot.id, page }), true;
    }

    // ── khalil-v2 : transcriptions des appels et des tests (pour qu'Amar relise et corrige Khalil) ──
    if (p === '/khalil/conversations' && req.method === 'GET') {
      if (!(await adminOk())) return repondre(res, 401, { error: 'admin requis' }), true;
      const id = await agentPret();
      const l = await eleven(`/v1/convai/conversations?agent_id=${encodeURIComponent(id)}&page_size=15`, 'GET');
      return repondre(res, 200, { conversations: (l.conversations || []).map((c) => ({ id: c.conversation_id, debut: c.start_time_unix_secs ? c.start_time_unix_secs * 1000 : null, duree_s: c.call_duration_secs || 0, messages: c.message_count || 0, statut: c.status || '', resume: c.transcript_summary || c.call_summary_title || '' })) }), true;
    }
    if (p === '/khalil/conversation' && req.method === 'GET') {
      if (!(await adminOk())) return repondre(res, 401, { error: 'admin requis' }), true;
      const cid = String(url.searchParams.get('id') || '');
      if (!/^[\w-]{6,80}$/.test(cid)) return repondre(res, 400, { error: 'identifiant invalide' }), true;
      const c = await eleven(`/v1/convai/conversations/${cid}`, 'GET');
      const mmss = (t) => `${String(Math.floor((t || 0) / 60)).padStart(2, '0')}:${String(Math.floor((t || 0) % 60)).padStart(2, '0')}`;
      const lignes = (c.transcript || []).map((m) => {
        const outils = (m.tool_calls || []).map((o) => `[${o.tool_name}${o.params_as_json ? ' ' + o.params_as_json : ''}]`).join(' ');
        const txt = [m.message || '', outils].filter(Boolean).join(' ');
        return txt ? `${mmss(m.time_in_call_secs)} ${m.role === 'agent' ? 'Khalil' : 'Prospect'} : ${txt}` : null;
      }).filter(Boolean);
      return repondre(res, 200, { id: cid, duree_s: (c.metadata && c.metadata.call_duration_secs) || 0, resume: (c.analysis && c.analysis.transcript_summary) || '', texte: lignes.join('\n') }), true;
    }

    // ── appelé par la page khalil.html (lien signé, pas de compte admin) ──
    const b = req.method === 'POST' ? await lireCorps(req) : {};
    const s = url.searchParams.get('s') || b.s, t = url.searchParams.get('t') || b.t;

    if (p === '/khalil/session' && req.method === 'GET') {
      if (!signatureOk(s, t)) return repondre(res, 403, { error: 'appel inconnu ou expiré' }), true;
      const id = await agentPret();
      const r = await eleven(`/v1/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(id)}`, 'GET');
      noter(s, 'page Khalil ouverte, conversation signée');
      return repondre(res, 200, { ctx: SESSIONS.get(s).ctx, signed_url: r.signed_url }), true;
    }
    if (p === '/khalil/chat' && req.method === 'POST') {
      if (!signatureOk(s, t)) return repondre(res, 403, { error: 'appel inconnu ou expiré' }), true;
      const S = SESSIONS.get(s);
      const o = S.offres[b.offre === 'reduite' ? 'reduite' : 'principale'];
      if (!o || !o.lien) return repondre(res, 500, { error: 'lien de paiement introuvable dans offres.json' }), true;
      const texte = `Lien de paiement ${o.nom} (${milliers(o.prix)} FCFA ${o.rythme}) : ${o.lien}\nLa facture arrive par mail dès le paiement. Ensuite : ${SITE}/adboard , connexion avec le compte Google de cet email.`;
      if (!S.bot_id) { noter(s, `lien ${o.nom} (test navigateur, pas de chat)`); return repondre(res, 200, { ok: true, test: true, texte }), true; }
      await recall(`/bot/${S.bot_id}/send_chat_message/`, 'POST', { to: 'everyone', message: texte.slice(0, 500) });
      noter(s, `lien de paiement ${o.nom} envoyé dans le chat`);
      return repondre(res, 200, { ok: true }), true;
    }
    if (p === '/khalil/fin' && req.method === 'POST') {
      if (!signatureOk(s, t)) return repondre(res, 403, { error: 'appel inconnu ou expiré' }), true;
      const S = SESSIONS.get(s);
      noter(s, `fin de l'appel (${String(b.raison || '').slice(0, 80)})`);
      if (S.bot_id) { try { await recall(`/bot/${S.bot_id}/leave_call/`, 'POST'); } catch (e) { noter(s, `départ du bot : ${e.message}`); } }
      return repondre(res, 200, { ok: true }), true;
    }
    if (p === '/khalil/journal' && req.method === 'POST') {
      if (!signatureOk(s, t)) return repondre(res, 403, { error: 'appel inconnu ou expiré' }), true;
      noter(s, String(b.evenement || ''));
      return repondre(res, 200, { ok: true }), true;
    }
    if (p === '/khalil/suivi' && req.method === 'GET') {   // pour Amar : où en est l'appel
      if (!(await adminOk())) return repondre(res, 401, { error: 'admin requis' }), true;
      const S = SESSIONS.get(url.searchParams.get('session'));
      if (!S) return repondre(res, 404, { error: 'appel inconnu (le serveur a peut-être redémarré)' }), true;
      let bot = null;
      if (S.bot_id) { try { const j = await recall(`/bot/${S.bot_id}/`, 'GET'); bot = (j.status_changes || []).slice(-3).map((x) => x.code); } catch (e) { bot = e.message; } }
      return repondre(res, 200, { ctx: S.ctx, bot_id: S.bot_id, statut_bot: bot, journal: S.journal.slice(-40) }), true;
    }
    return repondre(res, 404, { error: 'route Khalil inconnue' }), true;
  } catch (e) {
    console.error('[Khalil]', e.message);
    return repondre(res, 502, { error: e.message }), true;
  }
}

module.exports = { routes, configAgent, VERSION, _interne: { SESSIONS, signe, offresDeLAppel } };
