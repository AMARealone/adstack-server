// AdStack — Creative Image v10 (Render) : /creative-prod-v10 (brief complet, logo réel, niveau de conscience, correction)
// et /creative-qa (contrôle qualité avant livraison). Branché par video_jobs.js ; dépendances passées par serveur.js.
module.exports = async function creativeV10(req, res, deps) {
  const { callGeminiPro, MODELES, getToken, vertexRequestGlobalAvecReessai, preparerImageProduitPourCreative, aspectsDisponibles, LIBELLE_ASPECT } = deps
  if (req.url !== '/creative-prod-v10' && req.url !== '/creative-qa') return false
  if (!callGeminiPro || !vertexRequestGlobalAvecReessai || !preparerImageProduitPourCreative) { res.writeHead(500, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'serveur.js : dépendances v10 non branchées (ligne video_jobs)' })); return true }
  if (req.method === 'POST' && req.url === '/creative-prod-v10') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', async () => {
      try {
        const reqBody = JSON.parse(body);
        const { systemPrompt, synthese, brief = {}, angleInstruction = '',
                ctBase64, ctMime, productBase64, productMime, logoBase64, logoMime, isTest, niveau = '', reprise = null } = reqBody;

        console.log('\n' + '═'.repeat(60));
        console.log(`🎨 CREATIVE IMAGE PROD v10${reprise ? ' (CORRECTION après contrôle qualité)' : ''}${niveau ? ' · ' + niveau : ''} — ${brief.marque || '?'} / ${brief.produit || '?'} (${brief.pays || '?'})`);
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
        // v10 — le LOGO OFFICIEL du client est joint (IMAGE 3) quand la commande en a un
        if (logoBase64) userParts.push({ type:'image', source:{ type:'base64', media_type: logoMime || 'image/png', data: logoBase64 } });

        // Cause profonde corrigée ("la marque" affiché littéralement comme texte sur les
        // créatives, malgré un avertissement explicite plus bas dans le prompt) : cette valeur
        // de repli injectait la CHAÎNE LITTÉRALE "la marque" dans le texte d'entrée lu par
        // Gemini — qui la traitait alors comme une vraie donnée de brief à potentiellement
        // afficher, pas comme un simple placeholder de code. On omet maintenant complètement
        // la ligne marque quand elle est vide, au lieu d'y substituer un texte qui ressemble à
        // une vraie valeur.
        const nomMarque = brief.marque || null;
        const nomProduit = brief.produit || 'le produit';

        const briefSummary = [
          'BRIEF :',
          nomMarque ? `- Marque : ${nomMarque}` : null,
          `- Produit : ${nomProduit}`,
          `- Pays : ${brief.pays || 'n/a'}`,
          (Array.isArray(brief.marches) && brief.marches.length > 1) ? `- MODE MULTI-MARCHÉ (${brief.marches.join(', ')}) : n'écris AUCUN nom de pays, de ville, de quartier ni de région dans la créative ; aucun dialecte ni argot local, aucune référence locale (marque, plat, monument) ; décors génériques mais crédibles pour tous ces marchés.` : null,
          brief.prix_affichable === false ? `- PRIX : il diffère selon les pays de cette demande → n'affiche AUCUN prix, AUCUNE remise chiffrée ni prix barré, même si la zone du CT en prévoit un (remplace-la par un élément sans chiffre : garantie, bénéfice, appel à l'action).` : null,
          (brief.couleurs_marque || brief.couleurs) && (brief.couleurs_marque || brief.couleurs).length ? `- Couleurs marque : ${(brief.couleurs_marque || brief.couleurs).join(', ')}` : null,
          brief.pricing ? `- Pricing : ${brief.pricing}` : null,
          (brief.offre_promo || brief.promo) ? `- Offre promo : ${brief.offre_promo || brief.promo}` : null,
          brief.garantie ? `- Garantie (vérité client, ne jamais la contredire) : ${brief.garantie}` : null,
          // v10 — TOUT le brief client sert la créative (avant : marque, prix, couleurs, garantie seulement)
          (brief.cible || brief.cible_suggeree) ? `- Cible : ${brief.cible || brief.cible_suggeree}` : null,
          brief.utilite ? `- Ce que fait le produit (mots du client) : ${String(brief.utilite).slice(0, 900)}` : null,
          brief.livraison_paiement ? `- Livraison et paiement (vérité client, à utiliser tel quel quand la zone du CT le permet) : ${brief.livraison_paiement}` : null,
          brief.notes ? `- NOTES DU CLIENT (consignes à respecter) : ${String(brief.notes).slice(0, 900)}` : null,
          (Array.isArray(brief.avis_textes) && brief.avis_textes.length) ? `- AVIS RÉELS DE CLIENTS (les seuls témoignages autorisés ; cite-les mot pour mot, prénom compris s'il est donné, en les raccourcissant si besoin sans changer le sens) :\n${brief.avis_textes.slice(0, 8).map((a, i) => '   ' + (i + 1) + '. ' + String(typeof a === 'string' ? a : (a && (a.texte || a.text || JSON.stringify(a))) || '').slice(0, 320)).join('\n')}` : '- AVIS RÉELS : aucun fourni → AUCUN témoignage, avis, note étoilée, pseudo ou nom de cliente dans la créative.',
          (Array.isArray(brief.marches_ecartes) && brief.marches_ecartes.length) ? `- Marchés écartés (ne jamais les évoquer) : ${brief.marches_ecartes.join(', ')}` : null,
          niveau ? `- NIVEAU DE CONSCIENCE IMPOSÉ À CETTE CRÉATIVE : ${niveau}` : null,
          `- ⛔ VÉRITÉ DES CHIFFRES ET DES PREUVES : n'écris AUCUN chiffre, pourcentage, nombre de clients ou de ventes, note, durée de garantie, délai, ville de livraison, témoignage, pseudo ou nom de cliente qui ne figure pas tel quel dans ce brief ou dans la synthèse. Pas de « 91 % des femmes », pas de « 1 500+ clientes », pas de « @Aya_Beauté » inventés. Une preuve absente se remplace par un bénéfice ou une démonstration visuelle.`
        ].filter(Boolean).join('\n');

        // Rôles d'images : 2 images uniquement, rôle clair et non ambigu
        const imageRoles = [
          nomMarque
            ? `IMAGE 1 (que TU analyses) = PRODUIT CLIENT "${nomProduit}" de "${nomMarque}" — VÉRITÉ ABSOLUE DU PACKAGING.`
            : `IMAGE 1 (que TU analyses) = PRODUIT CLIENT "${nomProduit}" (aucune marque vendeur fournie — n'invente aucun nom, n'écris aucune zone marque) — VÉRITÉ ABSOLUE DU PACKAGING.`,
          'IMAGE 2 (que TU analyses) = CT / CREATIVE TEMPLATE — RÉFÉRENCE STRUCTURELLE UNIQUEMENT.',
          '',
          '⚠️ RÉALITÉ CRITIQUE — CE QUE VOIT GEMINI 3 PRO IMAGE (Step 2) :',
          'Step 2 reçoit UNIQUEMENT : image du produit + ton prompt texte. Il NE VOIT PAS le CT.',
          '→ Tu dois décrire la structure du CT en TEXTE avec une précision absolue dans ton prompt.',
          '→ Zones, positions (% hauteur/largeur), proportions, style, éléments, invariants — tout en texte.',
          '→ Le produit est désigné dans le prompt par "(IMAGE FOURNIE — fidélité photographique absolue, même packaging exact)".',
          '→ AUCUNE référence à "IMAGE 1"/"IMAGE 2" dans le prompt final — Gemini Image ne voit qu\'une seule image.',
          '→ Le prompt commence OBLIGATOIREMENT par : "⚠️ IMAGE FOURNIE — PRODUIT" puis le bloc fidélité, puis FORMAT :',
          logoBase64
            ? `IMAGE 3 (que TU analyses) = LOGO OFFICIEL DU CLIENT. Gemini Image le recevra AUSSI, en image jointe après le produit. Dans ton prompt, à l'emplacement marque du CT, écris : « LOGO FOURNI (image jointe) reproduit à l'identique, sans le redessiner ni le modifier ». Ne décris PAS le logo en texte, n'écris PAS la marque en lettres à côté du logo. EXCEPTION à la règle « une seule image » : Gemini Image reçoit le produit ET le logo.`
            : nomMarque
            ? `LOGO : Aucune image logo n'est fournie. Intègre "${nomMarque}" en TEXTE dans l'emplacement approprié.`
            : `LOGO : Aucune image logo n'est fournie. Aucun nom de marque n'est fourni non plus — n'ajoute AUCUN nom de marque, générique ou inventé, nulle part sur le visuel.`
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

${nomMarque ? `Marque "${nomMarque}" : intégrée en TEXTE à l'emplacement approprié selon la structure décrite.` : `Aucune marque vendeur fournie dans ce brief : n'écris AUCUN nom de marque, générique ou inventé ("la marque", "le vendeur", etc.), nulle part dans le prompt final. Aucune zone dédiée à un nom de marque ne doit exister.`}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

        // v5.61 — aspects disponibles (photos préparées) : l'agent choisit lesquels envoyer à Gemini Image pour CETTE créative.
        const _dispoAsp = aspectsDisponibles(brief);
        const blocAspects = _dispoAsp.length >= 2 ? [
          '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
          'ASPECTS DU PRODUIT DISPONIBLES (tu choisis lesquels Gemini Image recevra pour CETTE créative) :',
          ..._dispoAsp.map(a => `- ${a.code} : ${LIBELLE_ASPECT[a.code] || a.code}${a.principale ? ' (photo principale = IMAGE 1)' : ''}${a.description ? ' — ' + a.description : ''}`),
          'Règle : choisis le ou les aspects dont CETTE scène a besoin (le produit de face, le dos si l\'étiquette arrière est montrée, le contenu, le produit en main, le détail...). 1 à 4 aspects maximum. Si la scène a besoin de PLUSIEURS éléments (ex. un pot ET sa capsule), choisis-les tous : le code les assemble en UNE seule image de référence. Ne choisis que ce qui sert la scène : chaque aspect en trop dilue la fidélité.',
          'Déclare ton choix dans le bloc ===META=== : ASPECTS ENVOYÉS À GEMINI IMAGE : [codes séparés par des virgules]',
          '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
        ].join('\n') : '';
        const userText = [
          // ⚠️ ANGLE IMPOSÉ EN TÊTE pour que Gemini le lise avant la synthèse
          angleInstruction ? `⚠️⚠️⚠️ ANGLE IMPOSÉ — LIS CECI EN PREMIER AVANT TOUT LE RESTE :\n${angleInstruction}\n⚠️⚠️⚠️ FIN INSTRUCTION ANGLE — NE PAS CHOISIR UN AUTRE ANGLE\n` : '',
          imageRoles,
          fidelityRule,
          blocAspects,
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
        const geminiPrompt = reprise ? '' : await callGeminiPro(systemPrompt, userParts, 8000, {
          modele: MODELES.creative, temperature: 0.4, thinkingBudget: 24576, logLabel: 'Creative Prod', timeoutMs: 150000,
          typeAppel: isTest ? 'creative_prod_texte_test' : 'creative_prod_texte_prod'
        });

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
        // v10 — CORRECTION : on reprend le prompt validé et on y ajoute les défauts relevés par le contrôle qualité (pas de nouveau raisonnement)
        if (reprise && reprise.prompt) {
          metaBlock = String(reprise.meta || '');
          promptForGemini = String(reprise.prompt) + '\n\n⛔ CORRECTIONS OBLIGATOIRES — la version précédente a été REFUSÉE au contrôle qualité pour ces raisons ; corrige-les toutes sans rien changer d\'autre à la mise en page :\n' + String(reprise.corrections || '').slice(0, 1500);
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
- QUALITÉ : haute définition, netteté maximale, qualité d'utilisation publicitaire réelle
- LOGO : si un LOGO FOURNI est joint, il est reproduit à l'identique ; sinon aucun logo inventé
- PREUVES : aucun chiffre, avis, note ou nom de client absent du prompt`;

        // Step 2 : Gemini Image reçoit UNIQUEMENT image produit + prompt texte (CT décrit en texte dans le prompt)
        // v5.61 — UNE seule image de référence : la photo principale, ou une planche (2 à 4 aspects choisis par l'agent).
        let aspectsUtilises = ['face'];
        const geminiParts = [];
        try {
          const asp = await preparerImageProduitPourCreative(brief, metaBlock, productBase64, productMime);
          aspectsUtilises = asp.codes;
          if (asp.image) geminiParts.push({ inlineData: { mimeType: asp.image.mime, data: asp.image.b64 } });
          if (asp.bloc) promptForGemini = asp.bloc + promptForGemini;
          console.log('   Aspects envoyés à Gemini Image : ' + aspectsUtilises.join(' + ') + (asp.bloc ? ' (planche assemblée)' : ''));
        } catch (e) {
          console.log('   ⚠️ assemblage des aspects impossible (' + e.message + ') → photo principale seule');
          if (productBase64) geminiParts.push({ inlineData: { mimeType: productMime || 'image/jpeg', data: productBase64 } });
        }
        if (logoBase64) { geminiParts.push({ text: 'LOGO FOURNI — logo officiel du client : à reproduire à l\'identique (formes, couleurs, typographie) à l\'emplacement marque décrit dans le prompt. Ne pas le redessiner, ne pas ajouter d\'autre logo.' }); geminiParts.push({ inlineData: { mimeType: logoMime || 'image/png', data: logoBase64 } }); }
        geminiParts.push({ text: promptForGemini });

        const vertexBody = {
          system_instruction: { parts: [{ text: CREATIVE_SYSTEM_PROD }] },
          contents: [{ role:'user', parts: geminiParts }],
          generationConfig: {
            responseModalities: ['TEXT', 'IMAGE'],
            temperature: 1.0,
            // Ajouté par prudence — aucun maxOutputTokens n'était fixé jusqu'ici, ce modèle
            // utilisait son défaut interne. Sur une composition dense (beaucoup de texte, CT
            // complexe), un défaut trop juste pourrait limiter la marge que le modèle a pour
            // "finir" proprement la composition avant de rendre l'image — cohérent avec
            // l'observation d'une qualité parfois meilleure au 2e essai. Pas une certitude,
            // mais une marge de sécurité qui ne coûte rien à ajouter.
            maxOutputTokens: 8192,
          }
        };

        const data = await vertexRequestGlobalAvecReessai(token, MODELES.image, vertexBody, 120000, isTest ? 'creative_image_prod_test' : 'creative_image_prod');
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
          model: MODELES.creative + ' + ' + MODELES.image + ' (mode test)',
          prompt: promptForGemini,
          meta: metaBlock,
          chosenAngle,
          aspectsUtilises,
          niveau,
          correction: !!reprise
        }));
      } catch(e) {
        console.error('✗ Creative Prod error:', e.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return true;
  }

  // ── v10 — CONTRÔLE QUALITÉ d'une créative image (avant livraison) ──
  // Compare l'image produite au produit réel, au logo, au prompt validé et au brief. Un défaut BLOQUANT déclenche une
  // correction automatique côté Factory (dans la limite du budget). Réponse : JSON strict.
  if (req.method === 'POST' && req.url === '/creative-qa') {
    let body = '';
    req.on('data', c => { body += c; if (body.length > 25e6) req.destroy(); });
    req.on('end', async () => {
      try {
        const b = JSON.parse(body || '{}');
        if (!b.imageBase64) throw new Error('imageBase64 requis');
        const br = b.brief || {};
        const parts = [
          { type: 'text', text: 'IMAGE A = la publicité produite, à contrôler :' },
          { type: 'image', source: { type: 'base64', media_type: b.imageMime || 'image/jpeg', data: b.imageBase64 } },
        ];
        if (b.productBase64) { parts.push({ type: 'text', text: 'IMAGE B = le VRAI produit du client (référence de fidélité) :' }); parts.push({ type: 'image', source: { type: 'base64', media_type: b.productMime || 'image/jpeg', data: b.productBase64 } }); }
        if (b.logoBase64) { parts.push({ type: 'text', text: 'IMAGE C = le VRAI logo du client :' }); parts.push({ type: 'image', source: { type: 'base64', media_type: b.logoMime || 'image/png', data: b.logoBase64 } }); }
        const avis = Array.isArray(br.avis_textes) ? br.avis_textes.map(a => typeof a === 'string' ? a : (a && (a.texte || a.text)) || '').filter(Boolean) : [];
        parts.push({ type: 'text', text: [
          'PROMPT VALIDÉ QUI A SERVI À PRODUIRE IMAGE A :', String(b.prompt || '').slice(0, 9000), '',
          'BRIEF CLIENT (seules vérités autorisées) :',
          '- Marque : ' + (br.marque || '—'), '- Produit : ' + (br.produit || '—'), '- Pays / langue : ' + (br.pays || '—'),
          '- Prix : ' + (br.pricing || '—') + (br.promo ? ' · offre : ' + br.promo : '') + (br.prix_affichable === false ? ' · PRIX NON AFFICHABLE' : ''),
          '- Garantie : ' + (br.garantie || '—'), '- Livraison / paiement : ' + (br.livraison_paiement || '—'),
          '- Couleurs de marque : ' + ((br.couleurs || []).join(', ') || '—'),
          '- Avis réels : ' + (avis.length ? avis.map(a => '« ' + String(a).slice(0, 200) + ' »').join(' ') : 'AUCUN'),
          '- Niveau de conscience voulu : ' + (b.niveau || '—') + ' · Angle : ' + String(b.angle || '').split('*')[0].slice(0, 200),
          b.verite ? '\n' + String(b.verite).slice(0, 3000) : '',
          b.meta ? '\n' + String(b.meta).slice(0, 3500) : '',
        ].filter(Boolean).join('\n') });
        const SYS = `Tu es le contrôleur qualité d'une agence de publicités Meta Ads. Tu juges si IMAGE A peut être livrée TELLE QUELLE à un client exigeant qui va la diffuser. Tu es strict mais juste : tu ne refuses que pour un défaut réel et visible.
DÉFAUTS BLOQUANTS (verdict "corriger") :
1. produit : le produit montré n'est pas le produit de IMAGE B (forme, couleur, matière, étiquette ou packaging différents ; produit inventé ou en double non prévu ; produit déformé).
2. texte : faute d'orthographe ou de grammaire, mot coupé, lettres illisibles ou inventées, texte dans une autre langue que celle du marché, texte absent du prompt, texte tronqué par le cadre.
3. preuve : chiffre, pourcentage, nombre de clients, note, témoignage, pseudo, durée de garantie, délai ou ville qui n'est NI dans le brief NI dans le prompt validé (affirmation inventée).
4. marque : logo différent de IMAGE C ou déformé, nom de marque mal écrit, logo ou marque d'un concurrent visible.
5. rendu : anatomie déformée (mains, doigts, visage), artefact visible, zone vide ou cassée, format qui n'est pas plein cadre 4:5, bande noire.
6. structure : la mise en page ne suit pas le prompt (zone manquante, élément clé absent, CTA présent alors que le prompt l'interdit ou absent alors qu'il l'exige).
7. verite : si une FICHE DE VÉRITÉ DE L'ANGLE est donnée, un texte de IMAGE A la contredit nettement (nie une cause qu'elle reconnaît, promet ce qu'elle exclut, affiche une rareté ou une échéance absente) ; ou un nom de société autre que le nom de marque indiqué est écrit.
${b.meta ? `8. meta (PRODUIT SENSIBLE — meta-sensible-v1, règles données plus haut) : un texte de IMAGE A attribue directement l'état ou le défaut au spectateur (« vous êtes… », « votre ventre… », « tu souffres de… ») ; avant/après côte à côte ; gros plan sur une partie du corps visée (ventre, poitrine, entrejambe, fesses, peau malade) ; nudité ou geste suggestif ; promesse de résultat corporel chiffrée ou datée (« -10 kg en 7 jours ») ; mot de guérison médicale (guérit, soigne, traitement) ; mot listé « à éviter » écrit en clair. NE COMPTE PAS comme défaut : un ton direct, une douleur psychologique nommée à la troisième personne ou en désir, un témoignage — le ton direct est VOULU.
` : ''}DÉFAUTS MINEURS (n'empêchent pas la livraison) : nuance de couleur, légère différence de position, style typographique.
Réponds UNIQUEMENT par un objet JSON strict :
{"verdict":"ok"|"corriger","score":0-10,"defauts":[{"type":"produit|texte|preuve|marque|rendu|structure|verite${b.meta ? '|meta' : ''}","gravite":"bloquant|mineur","detail":"phrase courte et précise, en français"}],"consignes_correction":"instructions précises pour corriger les défauts bloquants (ce qu'il faut écrire, retirer, montrer), vide si ok","resume":"une phrase"${b.meta ? ',"mention":"ok|absente|illisible — une petite mention légale (responsabilité de la marque, résultats variables…) est-elle écrite LISIBLEMENT dans IMAGE A, même en très petit ?"' : ''}}`;
        const raw = await callGeminiPro(SYS, parts, 3000, { modele: MODELES.creative, temperature: 0.1, thinkingBudget: 4096, logLabel: 'Contrôle qualité image', timeoutMs: 120000, typeAppel: 'controle_qualite_image' });
        const t = String(raw || ''), i = t.indexOf('{'), j = t.lastIndexOf('}');
        let d = null; try { d = JSON.parse(t.slice(i, j + 1)); } catch (_) { }
        if (!d) throw new Error('réponse du contrôle illisible');
        const defauts = Array.isArray(d.defauts) ? d.defauts.slice(0, 8).map(x => ({ type: String(x.type || ''), gravite: x.gravite === 'bloquant' ? 'bloquant' : 'mineur', detail: String(x.detail || '').slice(0, 300) })) : [];
        const verdict = defauts.some(x => x.gravite === 'bloquant') ? 'corriger' : 'ok';
        console.log('🔎 CONTRÔLE QUALITÉ — ' + verdict + ' (' + (d.score ?? '?') + '/10)' + (defauts.length ? ' : ' + defauts.map(x => x.gravite[0].toUpperCase() + ':' + x.detail).join(' | ').slice(0, 300) : ''));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mention: b.meta ? (['ok', 'absente', 'illisible'].includes(String(d.mention || '').split(/[\s|—-]/)[0]) ? String(d.mention).split(/[\s|—-]/)[0] : 'absente') : null, verdict, score: typeof d.score === 'number' ? d.score : null, defauts, consignes_correction: String(d.consignes_correction || '').slice(0, 1500), resume: String(d.resume || '').slice(0, 300) }));
      } catch (e) {
        console.error('✗ Contrôle qualité :', e.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return true;
  }
  return false
}
