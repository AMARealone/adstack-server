// cycle-client-v1 (19 nov. 2026) — LE PROGRAMME EMAIL DES CLIENTS AdStack (après le paiement).
// But : que le client reste longtemps (temps) et monte d'offre quand il en a besoin (argent).
// Trois familles, dans cet ordre de priorité chaque jour :
//   1. DÉCLENCHÉS par ce que fait le client : 50 % / 75 % / 100 % des créatives du mois, bilan 5 jours avant la fin,
//      dernier jour, retour 7 et 30 jours après un départ. Un seul par seuil et par mois.
//   2. ACCUEIL : J+1, J+3, J+7, J+10 après le premier paiement.
//   3. LETTRE DE LA SEMAINE : une tous les 7 jours, en alternant ENGAGEMENT (la marque AdStack, les coulisses) et
//      ÉDUCATION (un sujet de stratégie), sans jamais répéter une lettre.
// Règles : jamais deux emails le même jour à un client ; aucun chiffre inventé (tout vient de son compte) ;
// toujours « vous » ; c'est « l'équipe AdStack » qui écrit, jamais une personne.
// Le texte, le titre et le bouton sont du vrai texte ; l'illustration est une image (PNG hébergée sur le site).
'use strict';

const SITE = 'https://www.adstackofficial.com';
const IMG = (n) => `${SITE}/emails/${n}.png`;
const ADBOARD = `${SITE}/adboard`;
const JOUR = 86400000;

const esc = (t) => String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fcfa = (n) => Math.round(Number(n) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' FCFA';
const dateFr = (d) => new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });

// ── MISE EN PAGE : une lettre, pas une page de vente. Tableaux + styles en ligne (Gmail, Outlook, mobiles).
function lettre({ apercu = '', rubrique = '', titre = '', corps = [], corps2 = [], figure = null, vignettes = [], desinscription = '', pied = '', encadre = '', tableau = null, bouton = null, ps = '' }) {
  const p = (t) => `<p style="margin:0 0 16px;font-size:16px;line-height:1.68;color:#30343D;">${t}</p>`;
  const rendre = (liste) => liste.map((x) => (typeof x === 'string' ? p(x) : x && x.liste ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">${x.liste.map((l, i) => `<tr><td valign="top" style="padding:0 12px 10px 0;"><span style="display:inline-block;width:24px;height:24px;line-height:24px;text-align:center;border-radius:12px;background:#EEF2FB;color:#2D6BEF;font-weight:700;font-size:12px;font-family:Helvetica,Arial,sans-serif;">${i + 1}</span></td><td style="padding:0 0 10px;font-size:15.5px;line-height:1.6;color:#30343D;">${l}</td></tr>`).join('')}</table>` : '')).join('');
  const blocs = rendre(corps), blocs2 = rendre(corps2 || []);
  const fig = figure ? `<tr><td style="padding:6px 36px 4px;"><img src="${figure.src}" alt="${esc(figure.alt || '')}" width="528" style="display:block;width:100%;max-width:528px;height:auto;border:0;border-radius:8px;"><p style="margin:8px 0 18px;font-size:12.5px;line-height:1.5;color:#8A8F99;text-align:center;">${figure.legende || ''}</p></td></tr>` : '';
  const tab = tableau ? `<tr><td style="padding:2px 36px 6px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FBFAF7;border:1px solid #ECE9E2;border-radius:10px;"><tr><td style="padding:16px 20px;"><div style="font-weight:700;font-size:15px;color:#12151C;margin-bottom:4px;">${tableau.titre}</div><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${tableau.lignes.map(([l, v]) => `<tr><td style="padding:9px 0;border-bottom:1px dashed #E3E0D9;font-size:14.5px;color:#4A4F59;">${l}</td><td align="right" style="padding:9px 0;border-bottom:1px dashed #E3E0D9;font-size:14.5px;font-weight:700;color:#12151C;">${v}</td></tr>`).join('')}</table>${tableau.note ? `<div style="font-size:12px;color:#8A8F99;margin-top:10px;">${tableau.note}</div>` : ''}</td></tr></table></td></tr>` : '';
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(titre)}</title></head>
<body style="margin:0;padding:0;background:#EEECE7;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(apercu)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EEECE7;"><tr><td align="center" style="padding:24px 10px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border-radius:6px;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;">
<tr><td style="padding:20px 36px;border-bottom:1px solid #EFEDE8;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td><img src="${SITE}/emails/logo.png" alt="AdStack" width="112" height="26" style="display:block;border:0;"></td>
<td align="right" style="font-size:12px;color:#8A8F99;">${esc(rubrique)}</td></tr></table></td></tr>
<tr><td style="padding:30px 36px 6px;"><h1 style="margin:0 0 18px;font-size:27px;line-height:1.2;letter-spacing:-0.5px;color:#12151C;font-weight:800;">${titre}</h1>${blocs}</td></tr>
${vignettes && vignettes.length ? `<tr><td style="padding:4px 32px 18px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${vignettes.slice(0, 3).map((u) => `<td width="33%" style="padding:0 4px;"><img src="${esc(u)}" alt="" width="170" style="display:block;width:100%;height:auto;border-radius:8px;border:1px solid #ECE9E2;"></td>`).join('')}</tr></table></td></tr>` : ''}${fig}${tab}
${blocs2 ? `<tr><td style="padding:4px 36px 0;">${blocs2}</td></tr>` : ''}
${encadre ? `<tr><td style="padding:0 36px 6px;"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-left:3px solid #2D6BEF;padding:4px 0 4px 16px;font-size:17px;line-height:1.55;color:#12151C;font-weight:600;">${encadre}</td></tr></table><div style="height:16px"></div></td></tr>` : ''}
${bouton ? `<tr><td style="padding:6px 36px 24px;"><a href="${bouton.lien}" style="display:inline-block;background:#12151C;color:#FFFFFF;text-decoration:none;font-weight:700;font-size:15px;padding:13px 22px;border-radius:8px;">${bouton.texte} &rarr;</a></td></tr>` : ''}
<tr><td style="padding:0 36px;"><div style="border-top:1px solid #EFEDE8;padding:18px 0 ${ps ? '14' : '26'}px;font-size:14.5px;color:#12151C;"><b>L'équipe AdStack</b><br><span style="font-size:13px;color:#8A8F99;">Stratégie et créatives publicitaires</span></div></td></tr>
${ps ? `<tr><td style="padding:0 36px 26px;"><div style="font-size:14.5px;line-height:1.6;color:#4A4F59;background:#F7F6F3;border-radius:8px;padding:14px 16px;"><b>P.S.</b> ${ps}</div></td></tr>` : ''}
<tr><td style="padding:18px 36px 22px;font-size:11.5px;line-height:1.6;color:#9A9EA6;text-align:center;background:#FAFAF8;border-top:1px solid #EFEDE8;border-radius:0 0 6px 6px;">${pied ? pied + '<br>' : ''}Vous recevez cet email parce que vous êtes client d'AdStack.<br>AdStack · Dakar, Sénégal${desinscription ? ` · <a href="${desinscription}" style="color:#9A9EA6;">Ne plus recevoir ces lettres</a>` : ''}</td></tr>
</table></td></tr></table></body></html>`;
}

// ── TEXTE BRUT (alternative lue par les filtres et certaines messageries) ──
const texteBrut = (m) => [m.titre.replace(/<[^>]+>/g, ''), '', ...m.corps.map((x) => (typeof x === 'string' ? x : (x.liste || []).map((l, i) => `${i + 1}. ${l}`).join('\n'))).map((t) => t.replace(/<[^>]+>/g, '')), '', m.bouton ? `${m.bouton.texte} : ${m.bouton.lien}` : '', '', "L'équipe AdStack"].join('\n');

// ════════════════════════════════════════════════════════════════════════════════════════════════
// LES LETTRES — ÉDUCATION (dans cet ordre) et ENGAGEMENT. Chaque lettre : un sujet, une idée, une action.
// ════════════════════════════════════════════════════════════════════════════════════════════════
const EDUCATION = [
  { id: 'edu_angles', objet: 'La pub que vous préférez n\'est souvent pas celle qui vend', apercu: 'Pourquoi on teste plusieurs angles à la fois.', rubrique: 'Stratégie · 3 min',
    titre: 'La pub que vous préférez n\'est souvent pas celle qui vend',
    corps: ['Personne ne sait à l\'avance quelle publicité va vendre. Ni vous, ni nous, ni Meta. Ce qu\'on sait, c\'est qu\'un même produit peut être vendu pour des raisons très différentes : gagner du temps, être rassuré, plaire à quelqu\'un, arrêter d\'avoir honte.',
      'Chacune de ces raisons, c\'est un <b>angle</b>. Et un angle qui ne parle pas à votre marché, aucune belle image ne le sauvera.'],
    figure: { src: IMG('edu_angles'), alt: 'Deux angles testés en même temps, un seul gagne', legende: 'Plusieurs angles lancés ensemble : vos clients choisissent le gagnant à votre place.' },
    encadre: 'Le bon réflexe : lancer tous les angles d\'un lot en même temps, avec le même budget, et laisser les chiffres trancher.',
    corps2: ['Attendez quelques jours, pas quelques heures. Coupez ce qui ne vend pas. Gardez ce qui vend, et continuez dessus.'],
    bouton: { texte: 'Voir mes angles en cours', lien: `${ADBOARD}/gallery` }, ps: 'La semaine prochaine : ce qui fait un <b>bon</b> angle, et comment le reconnaître avant même de le tester.' },
  { id: 'edu_bon_angle', objet: 'Un bon angle tient en une phrase', apercu: 'Le test simple pour savoir si votre message va accrocher.', rubrique: 'Stratégie · 3 min',
    titre: 'Un bon angle tient en une phrase, et votre client pourrait l\'avoir dite',
    corps: ['Un angle n\'est pas un slogan. C\'est la raison précise pour laquelle une personne précise achète, dite avec ses mots à elle.',
      'Trois questions suffisent pour juger un angle avant de le lancer :',
      { liste: ['<b>Qui</b> exactement ? « Les femmes » n\'est pas une cible. « Une mère de 35 ans qui n\'a plus le temps de cuisiner » en est une.', '<b>Quel moment</b> de sa vie ? Le matin pressé, la soirée gênante, le mariage dans deux semaines.', '<b>Quelle transformation</b> ? Pas le produit : ce qui change pour elle après.']}],
    figure: { src: IMG('edu_bon_angle'), alt: 'Un angle = qui + quel moment + quelle transformation', legende: 'Si l\'une des trois cases est vide, l\'angle est trop flou pour vendre.' },
    encadre: 'Si votre client peut se dire « c\'est exactement moi » en une seconde, l\'angle est bon.',
    bouton: { texte: 'Relire mes angles dans AdBoard', lien: `${ADBOARD}/copies` }, ps: 'Prochaine lettre : pourquoi le même angle doit être dit autrement selon ce que votre client sait déjà.' },
  { id: 'edu_conscience', objet: 'Votre client ne lit pas votre pub. Il lit sa situation.', apercu: 'Les 5 niveaux de conscience, en 3 minutes.', rubrique: 'Stratégie · 3 min',
    titre: 'Pourquoi la même pub vend chez l\'un et fait un flop chez l\'autre',
    corps: ['Prenez deux personnes devant la même publicité pour une crème anti-taches. La première ne sait même pas que ses taches ont une cause. La seconde a déjà essayé trois crèmes et compare les prix.',
      'Si vous leur parlez de la même façon, vous perdez au moins l\'une des deux. C\'est l\'idée des <b>niveaux de conscience</b>, décrite par Eugene Schwartz en 1966, et toujours à la base de toute bonne publicité.'],
    figure: { src: IMG('edu_conscience'), alt: 'Les 5 niveaux de conscience', legende: 'Plus votre client monte, plus votre pub peut aller droit au produit.' },
    corps2: ['<b>Ce que ça change concrètement :</b> au niveau 1, on ouvre sur une situation de vie, pas sur le produit. Au niveau 4, on ouvre sur une preuve ou une offre. Une même campagne a besoin des deux.'],
    encadre: 'Regardez vos pubs actives : à quel niveau parle chacune ? Si toutes parlent au même, une partie de votre marché ne vous entend pas.',
    bouton: { texte: 'Voir mes créatives', lien: `${ADBOARD}/gallery` }, ps: 'La semaine prochaine : le jour où « naturel et efficace » ne suffit plus à vendre.' },
  { id: 'edu_sophistication', objet: 'Le jour où « naturel et efficace » ne suffit plus', apercu: 'Quand votre marché a déjà tout entendu.', rubrique: 'Stratégie · 3 min',
    titre: 'Le jour où « naturel et efficace » ne suffit plus à vendre',
    corps: ['Le premier vendeur d\'un produit dans un pays peut dire « ça marche » et vendre. Le dixième ne peut plus : son client a déjà entendu cette promesse neuf fois.',
      'C\'est la <b>sophistication</b> du marché : combien de promesses votre client a déjà entendues. Plus elle monte, plus il faut expliquer <b>comment</b> ça marche, puis <b>pourquoi vous êtes différent</b>.'],
    figure: { src: IMG('edu_sophistication'), alt: 'Les 3 étapes de sophistication d\'un marché', legende: 'Une promesse simple → un mécanisme → une identité. Chaque marché avance sur cette ligne.' },
    encadre: 'Si vos concurrents disent tous la même chose que vous, ce n\'est pas la promesse qu\'il faut crier plus fort : c\'est le mécanisme qu\'il faut montrer.',
    bouton: { texte: 'Voir les données de mon marché', lien: `${ADBOARD}/market` }, ps: 'Prochaine lettre : pourquoi Meta récompense les comptes qui varient leurs créatives.' },
  { id: 'edu_diversite', objet: 'Pourquoi 10 versions de la même pub ne font pas 10 tests', apercu: 'La diversité créative, expliquée simplement.', rubrique: 'Stratégie · 3 min',
    titre: 'Dix versions de la même pub ne font pas dix tests',
    corps: ['Changer la couleur du fond ou le titre d\'une image ne crée pas une nouvelle publicité. Pour Meta, c\'est presque la même : elle montre les deux aux mêmes personnes, et vous payez deux fois pour apprendre une seule chose.',
      'Une vraie diversité joue sur ce qui change la personne touchée : <b>l\'angle</b>, <b>le format</b> (vidéo, image, témoignage) et <b>la personne montrée</b>.'],
    figure: { src: IMG('edu_diversite'), alt: 'Variations de surface contre vraie diversité', legende: 'À gauche, 4 copies. À droite, 4 portes d\'entrée différentes vers votre produit.' },
    encadre: 'Plus vos créatives sont différentes entre elles, plus Meta trouve de nouveaux acheteurs, et moins chaque vente vous coûte cher.',
    bouton: { texte: 'Voir la diversité de mes créatives', lien: `${ADBOARD}/gallery` }, ps: 'La semaine prochaine : l\'ordre dans lequel on étudie un marché, et pourquoi il change tout.' },
  { id: 'edu_recherche', objet: 'L\'ordre dans lequel on étudie un marché', apercu: 'Des données sans ordre, c\'est du bruit.', rubrique: 'Méthode · 4 min',
    titre: 'Des données sans ordre, c\'est du bruit',
    corps: ['Beaucoup de vendeurs collectionnent les infos : un chiffre ici, un commentaire là, une pub de concurrent. Résultat : beaucoup de choses vues, aucune décision claire.',
      'Une bonne recherche suit un ordre précis, parce que chaque étape éclaire la suivante :',
      { liste: ['<b>Le client</b> : ce qu\'il vit, ce qu\'il craint, les mots qu\'il emploie.', '<b>Le marché</b> : ce qu\'il a déjà entendu, ce qui l\'a déçu.', '<b>Les concurrents</b> : ce qu\'ils promettent, et ce qu\'ils oublient.', '<b>Les angles</b> : seulement à la fin, quand on sait où est la place libre.'] }],
    figure: { src: IMG('edu_recherche'), alt: 'Les 4 étapes d\'une recherche de marché', legende: 'On commence par la personne, jamais par le produit.' },
    encadre: 'Commencer par les concurrents, c\'est copier leurs angles. Commencer par le client, c\'est trouver ceux qu\'ils n\'ont pas vus.',
    bouton: { texte: 'Lire l\'étude de mon marché', lien: `${ADBOARD}/market` }, ps: 'Prochaine lettre : ce qui se passe entre votre demande et la livraison de vos créatives.' },
  { id: 'edu_production', objet: 'Ce qui se passe entre votre demande et la livraison', apercu: 'Les 4 étapes d\'une créative qui vend.', rubrique: 'Coulisses · 3 min',
    titre: 'Une créative qui vend se décide avant d\'être dessinée',
    corps: ['Une belle image ne vend pas toute seule. Ce qui la fait vendre est décidé avant : à qui elle parle, ce qu\'elle promet, et le format qui porte le mieux ce message.',
      'Chaque créative passe par quatre décisions, toujours dans cet ordre :',
      { liste: ['<b>L\'angle</b> : la raison d\'acheter, tirée de l\'étude de marché.', '<b>Le modèle</b> : une structure de pub qui a déjà fait ses preuves, adaptée à votre produit.', '<b>Le texte</b> : l\'accroche des trois premières secondes, puis la preuve, puis l\'offre.', '<b>Le contrôle</b> : produit fidèle, texte lisible, rien d\'inventé sur votre offre.'] }],
    figure: { src: IMG('edu_production'), alt: 'Les 4 décisions d\'une créative', legende: 'Angle, modèle, texte, contrôle : sauter une étape se voit tout de suite dans les résultats.' },
    encadre: 'Vos remarques dans « Votre regard » entrent dans ces décisions : chaque production tient compte des précédentes.',
    bouton: { texte: 'Donner mon regard', lien: `${ADBOARD}/feedback` }, ps: 'La semaine prochaine : les 5 vérifications à faire avant de publier une pub.' },
  { id: 'edu_risques', objet: '5 vérifications avant de publier une pub', apercu: 'Ce qui fait refuser une pub, ou perdre la confiance.', rubrique: 'Méthode · 3 min',
    titre: 'Cinq vérifications à faire avant de publier une pub',
    corps: ['Une publicité refusée coûte du temps. Une publicité acceptée mais qui promet trop coûte la confiance de vos clients, et vos avis. Avant de publier, cinq questions :',
      { liste: ['La promesse est-elle <b>vraie</b> pour la plupart de vos clients ?', 'Le prix et l\'offre affichés sont-ils <b>exactement</b> ceux de votre page ?', 'Montre-t-on un « avant / après » ou une partie du corps de façon trop crue ?', 'Le texte vise-t-il la personne sur un défaut (« vous êtes trop… ») ?', 'La page où mène la pub dit-elle <b>la même chose</b> que la pub ?'] }],
    figure: { src: IMG('edu_risques'), alt: 'Liste de contrôle avant publication', legende: 'Cinq oui : vous pouvez lancer.' },
    encadre: 'La règle qui protège à la fois votre compte et vos ventes : la pub et la page doivent raconter la même histoire.',
    bouton: { texte: 'Voir mes créatives', lien: `${ADBOARD}/gallery` }, ps: 'Prochaine lettre : vendre un produit « sensible » sans faire bloquer son compte.' },
  { id: 'edu_sensibles', objet: 'Produit sensible : vendre sans se faire bloquer', apercu: 'Santé, minceur, intimité : ce que Meta regarde vraiment.', rubrique: 'Méthode · 4 min',
    titre: 'Produit sensible : vendre sans se faire bloquer',
    corps: ['Minceur, santé intime, peau, cheveux : ces produits se vendent très bien, et Meta les surveille de près. La plupart des blocages ne viennent pas du produit, mais de la façon d\'en parler.',
      'Trois principes gardent le même message, en restant dans les règles :',
      { liste: ['<b>Parler du bénéfice, pas du défaut</b> : « retrouvez votre énergie » plutôt que « vous êtes épuisé ».', '<b>Montrer la vie après</b>, pas le corps avant : une scène, un sourire, un moment retrouvé.', '<b>Rester vérifiable</b> : aucun résultat garanti, aucun chiffre qui ne vient pas d\'une vraie source.'] }],
    figure: { src: IMG('edu_sensibles'), alt: 'Même message, deux façons de le dire', legende: 'Le message ne change pas : seule la façon de le dire change.' },
    encadre: 'Un compte publicitaire qui dure vaut plus qu\'une pub agressive qui fait une semaine.',
    bouton: { texte: 'Voir mes créatives', lien: `${ADBOARD}/gallery` }, ps: 'La semaine prochaine : la page produit, la moitié de la vente qu\'on oublie.' },
  { id: 'edu_page', objet: 'Votre pub fait cliquer. Votre page fait acheter.', apercu: 'La moitié de la vente qu\'on oublie souvent.', rubrique: 'Méthode · 3 min',
    titre: 'Votre pub fait cliquer. Votre page fait acheter.',
    corps: ['Une bonne pub amène les bonnes personnes sur votre page. Si la page ne reprend pas la promesse de la pub dans les premières secondes, elles repartent, et c\'est la pub qu\'on accuse.',
      'Ce que le visiteur doit voir sans faire défiler :',
      { liste: ['La <b>même promesse</b> que la pub qui l\'a amené.', 'Le <b>produit en vrai</b>, en situation.', '<b>Le prix et l\'offre</b>, clairs, sans calcul à faire.', 'Ce qui <b>rassure</b> : livraison, paiement, retour.'] }],
    figure: { src: IMG('edu_page'), alt: 'La pub et la page racontent la même histoire', legende: 'Quand la page continue la pub, le visiteur n\'a pas l\'impression d\'avoir changé de magasin.' },
    encadre: 'Test simple : ouvrez votre pub, puis votre page. Si vous ne reconnaissez pas la même promesse en trois secondes, votre visiteur non plus.',
    bouton: { texte: 'Voir mes créatives', lien: `${ADBOARD}/gallery` }, ps: 'Prochaine lettre : fixer son prix par rapport à son marché, sans se brader.' },
  { id: 'edu_prix', objet: 'Fixer son prix sans se brader', apercu: 'Le prix n\'est pas un chiffre : c\'est un message.', rubrique: 'Stratégie · 3 min',
    titre: 'Votre prix n\'est pas un chiffre. C\'est un message.',
    corps: ['Un prix trop bas ne dit pas « bonne affaire ». Il dit souvent « qualité douteuse ». Un prix plus haut que vos concurrents peut mieux vendre, à condition que tout autour le justifie.',
      'Trois repères pour fixer le vôtre :',
      { liste: ['<b>Situez-vous</b> : regardez la fourchette de prix de vos concurrents, et choisissez consciemment le bas, le milieu ou le haut.', '<b>Justifiez</b> : plus vous êtes cher, plus la pub et la page doivent montrer pourquoi.', '<b>Ancrez</b> : un prix barré ou une offre en lot n\'a de sens que s\'il est vrai.'] }],
    figure: { src: IMG('edu_prix'), alt: 'Bas, milieu ou haut de gamme', legende: 'Chaque place est rentable, à condition de la choisir et de l\'assumer.' },
    encadre: 'On ne gagne presque jamais une guerre des prix. On gagne en étant le choix évident pour une partie précise du marché.',
    bouton: { texte: 'Voir les prix de mon marché', lien: `${ADBOARD}/market` }, ps: 'Merci de nous avoir lus jusqu\'ici : d\'autres sujets arrivent, gardés pour les marques qui avancent avec nous.' },
];

const ENGAGEMENT = [
  { id: 'eng_histoire', objet: 'Pourquoi AdStack existe', apercu: 'Un problème que vous connaissez sans doute.', rubrique: 'Les coulisses',
    titre: 'Pourquoi AdStack existe',
    corps: ['Nous avons commencé en observant des vendeurs en ligne d\'Abidjan, de Dakar ou de Lomé faire presque tout bien : un bon produit, une page propre, un budget publicitaire. Et perdre de l\'argent quand même.',
      'Le problème n\'était presque jamais le produit. C\'était la <b>publicité</b> : la même image, retournée dans tous les sens, sans savoir pourquoi elle marchait ou non.'],
    figure: { src: IMG('eng_histoire'), alt: 'De la première pub faite à la main jusqu\'à aujourd\'hui', legende: 'De quelques pubs faites à la main à une équipe et des outils dédiés à votre marque.' },
    corps2: ['AdStack est né de là : étudier le marché avant de créer, et livrer des publicités pensées pour être <b>testées</b>, pas seulement admirées.'],
    encadre: 'Vous faites partie des premières marques à avancer avec nous. Nous voulions que vous sachiez d\'où l\'on vient.',
    ps: 'Une question compte beaucoup pour nous : qu\'est-ce qui vous a décidé à travailler avec AdStack ? Une ligne de réponse suffit, nous lisons tout.' },
  { id: 'eng_ambition', objet: 'Où nous allons (et pourquoi ça vous concerne)', apercu: '20 pays d\'Afrique, puis plus loin.', rubrique: 'Les coulisses',
    titre: 'Où nous allons, et pourquoi ça vous concerne',
    corps: ['Notre objectif est simple à dire et difficile à faire : que les marques africaines aient des publicités au niveau des meilleures du monde.',
      'D\'abord dans 20 pays d\'Afrique francophone et anglophone, avec leurs langues et leurs codes. Puis au-delà.'],
    figure: { src: IMG('eng_ambition'), alt: 'Carte des marchés visés', legende: 'Chaque nouveau marché apporte des données qui servent à toutes les marques qu\'on accompagne.' },
    corps2: ['Pour vous, ça veut dire une chose concrète : plus nous travaillons sur des marchés différents, plus nous savons ce qui vend, et plus vite vos créatives s\'améliorent.'],
    encadre: 'Une marque qui grandit avec nous profite de tout ce que nous apprenons ailleurs.',
    ps: 'Vous vendez déjà dans plusieurs pays, ou vous y pensez ? Dites-le-nous : c\'est le genre de projet sur lequel nous aimons aider.' },
  { id: 'eng_principes', objet: 'Trois règles qu\'on ne casse jamais', apercu: 'Ce qui ne changera pas, même quand on grandira.', rubrique: 'Les coulisses',
    titre: 'Trois règles que nous ne cassons jamais',
    corps: ['En grandissant, beaucoup d\'agences changent. Voici trois choses qui ne changeront pas chez nous :',
      { liste: ['<b>Rien d\'inventé.</b> Pas de faux avis, pas de faux chiffres, pas de fausse rareté dans vos publicités.', '<b>Le marché d\'abord.</b> Chaque créative part d\'une étude de votre client, jamais d\'une simple envie de « faire joli ».', '<b>Vos remarques comptent.</b> Ce que vous dites dans « Votre regard » guide les productions suivantes.'] }],
    figure: { src: IMG('eng_principes'), alt: 'Nos trois règles', legende: 'Trois règles, toutes au service d\'une seule chose : des pubs qui vendent longtemps.' },
    encadre: 'Une publicité honnête vend parfois un peu moins vite. Elle vend beaucoup plus longtemps.',
    bouton: { texte: 'Donner mon regard', lien: `${ADBOARD}/feedback` } },
  { id: 'eng_equipe_ia', objet: 'Comment une petite équipe livre autant', apercu: 'Ce que font les humains, ce que font les machines.', rubrique: 'Les coulisses',
    titre: 'Comment une petite équipe livre autant, et aussi vite',
    corps: ['On nous demande souvent comment nous livrons des vidéos et des images en 24 à 48 heures. La réponse : nous avons construit nos propres outils.',
      'Ce que font les machines : rassembler les données du marché, produire les premières versions, vérifier ce qui se vérifie (le produit, le texte, les chiffres). Ce que font les humains : choisir la stratégie, juger la qualité, et améliorer les outils à chaque production.'],
    figure: { src: IMG('eng_equipe_ia'), alt: 'Ce que font les outils, ce que fait l\'équipe', legende: 'La machine fait vite. L\'équipe décide de ce qui est bon.' },
    encadre: 'C\'est pour cela que chaque production profite de toutes les précédentes : les outils apprennent de chaque marque.',
    ps: 'Une fonctionnalité vous manque dans AdBoard ? Dites-le-nous, la liste des prochaines améliorations se construit avec vous.' },
];

// ════════════════════════════════════════════════════════════════════════════════════════════════
// LES EMAILS DÉCLENCHÉS — construits avec les vrais chiffres du client.
// ════════════════════════════════════════════════════════════════════════════════════════════════
function emailDeclenche(type, c, o) {
  const plan = c.planNom, prochain = o && o.suivant;
  const listeAngles = (c.angles || []).slice(0, 4);
  if (type === 'bienvenue') return { objet: 'Vos 3 premiers gestes sur AdBoard', apercu: 'Ce qui fait la différence dès la première semaine.', rubrique: 'Bienvenue',
    titre: 'Bienvenue chez AdStack. Voici vos 3 premiers gestes.',
    corps: [`Votre forfait ${esc(plan)} est actif. Pour que vos premières créatives arrivent vite et visent juste, trois choses comptent plus que toutes les autres :`,
      { liste: ['<b>Une fiche produit complète</b> : de bonnes photos, votre vraie offre, votre marché. C\'est ce que lit notre équipe avant de créer.', '<b>Une demande par lot</b> : chaque lot, ce sont 2 angles, chacun en 1 vidéo et 2 images.', '<b>Votre regard</b> après chaque livraison : ce que vous aimez, ce qui vous gêne. Les productions suivantes en tiennent compte.'] }],
    figure: { src: IMG('trs_bienvenue'), alt: 'Produit, demande, livraison', legende: 'Votre fiche produit est la base de tout ce que nous créons.' },
    bouton: { texte: 'Compléter ma fiche produit', lien: `${ADBOARD}/products` }, ps: 'Dans deux jours, une première lettre courte : pourquoi on vous livre plusieurs angles plutôt qu\'une seule « belle pub ».' };
  if (type === 'usage50') return { objet: `${c.used} créatives livrées ce mois-ci : laquelle gagne ?`, apercu: 'Le bon moment pour regarder vos chiffres.', rubrique: 'Votre mois · mi-parcours',
    titre: `Vous avez déjà ${c.used} créatives ce mois-ci. Laquelle gagne ?`,
    corps: [`Vous avez utilisé ${c.used} de vos ${c.total} créatives du mois. C'est le bon moment pour regarder lesquelles vendent, avant de demander la suite.`,
      { liste: ['<b>Lancez tout</b>, pas seulement votre préférée : chaque angle est un test.', '<b>Notez vos résultats</b> dans AdBoard : ouvrez une créative, touchez « Ajouter mes résultats ».', '<b>Continuez sur ce qui marche</b> : « Nouvelle production sur cet angle », depuis la créative gagnante.'] }],
    tableau: { titre: 'Votre mois jusqu\'ici', lignes: [['Créatives utilisées', `${c.used} sur ${c.total}`], ['Vidéos · images', `${c.nbVid} · ${c.nbImg}`], ['Angles testés', String(c.nbAngles)]], note: 'Chiffres tirés de votre espace AdBoard.' },
    bouton: { texte: 'Voir mes créatives', lien: `${ADBOARD}/gallery` } };
  if (type === 'usage75') return { objet: 'Vous produisez plus vite que votre forfait', apercu: `${c.used} créatives sur ${c.total}, et ${c.joursRestants} jours restants.`, rubrique: 'Votre mois · 75 %',
    titre: 'Vous produisez plus vite que votre forfait',
    corps: [`Vous avez utilisé ${c.used} de vos ${c.total} créatives, et il reste ${c.joursRestants} jours avant votre renouvellement. C'est bon signe : vous testez beaucoup.`,
      prochain ? `Si ce rythme vous convient, <b>${esc(prochain.nom)}</b> vous donne ${prochain.creatives} créatives par mois au lieu de ${o.actuel.creatives}, jusqu'à ${prochain.produits} produits et une production en ${esc(prochain.delai)}. Tout ce qui est déjà livré reste à vous.` : 'Vous êtes sur notre plus grande offre : si vous avez besoin de plus de volume, répondez simplement à cet email.'],
    tableau: prochain ? { titre: `${esc(plan)} et ${esc(prochain.nom)}`, lignes: [['Créatives par mois', `${o.actuel.creatives} → <span style="color:#2D6BEF">${prochain.creatives}</span>`], ['Produits couverts', `${o.actuel.produits} → <span style="color:#2D6BEF">${prochain.produits}</span>`], ['Délai de production', `${esc(o.actuel.delai)} → <span style="color:#2D6BEF">${esc(prochain.delai)}</span>`], ['Prix par mois', `${fcfa(o.actuel.prix)} → ${fcfa(prochain.prix)}`]] } : null,
    bouton: prochain ? { texte: `Passer à ${prochain.nom}`, lien: `${ADBOARD}/offers` } : { texte: 'Voir mes créatives', lien: `${ADBOARD}/gallery` } };
  if (type === 'usage100') return { objet: 'Vos créatives du mois sont toutes utilisées', apercu: `Prochain renouvellement le ${dateFr(c.expiresAt)}.`, rubrique: 'Votre mois · 100 %',
    titre: 'Vos créatives du mois sont toutes utilisées',
    corps: [`Vous avez utilisé vos ${c.total} créatives du mois. Les nouvelles arrivent avec votre renouvellement, le <b>${dateFr(c.expiresAt)}</b>.`,
      prochain ? `Vous pouvez aussi passer dès maintenant à <b>${esc(prochain.nom)}</b> : ${prochain.creatives} créatives par mois, disponibles tout de suite.` : 'Besoin de plus d\'ici là ? Répondez à cet email, nous trouverons une solution.'],
    encadre: 'D\'ici là, c\'est le moment idéal pour regarder vos résultats et noter vos créatives gagnantes : la prochaine production partira d\'elles.',
    bouton: prochain ? { texte: `Passer à ${prochain.nom}`, lien: `${ADBOARD}/offers` } : { texte: 'Noter mes résultats', lien: `${ADBOARD}/gallery` } };
  if (type === 'bilan') return { objet: `Votre mois avec AdStack, en une page`, apercu: `${c.livrees} créatives, ${c.nbAngles} angles, et la suite.`, rubrique: 'Bilan du mois',
    titre: 'Votre mois avec AdStack, en une page',
    corps: [`Votre forfait ${esc(plan)} se renouvelle le <b>${dateFr(c.expiresAt)}</b>. Voici ce que vous avez reçu, et ce qui vient ensuite.`],
    tableau: { titre: 'Reçu ce mois-ci', lignes: [['Créatives livrées', String(c.livrees)], ['Vidéos · images', `${c.nbVid} · ${c.nbImg}`], ['Angles marketing testés', String(c.nbAngles)], ['Produits travaillés', String(c.nbProduits)]], note: 'Chiffres tirés de votre espace AdBoard.' },
    corps2: [listeAngles.length ? `Les angles testés : ${listeAngles.map((a) => '« ' + esc(a) + ' »').join(', ')}.` : '', c.topAngle ? `Celui que vous avez noté comme le plus fort : <b>« ${esc(c.topAngle)} »</b>. Le mois prochain, nous pouvons repartir de lui.` : 'Notez vos résultats dans AdBoard : le mois prochain, nous repartirons de vos meilleurs angles.'].filter(Boolean),
    encadre: 'Le mois prochain : de nouveaux angles, et vos remarques déjà prises en compte.',
    bouton: { texte: `Renouveler ${plan}`, lien: `${ADBOARD}/offers` } };
  if (type === 'dernier_jour') return { objet: 'Votre forfait se termine aujourd\'hui', apercu: 'Pour ne pas interrompre vos productions.', rubrique: 'Votre forfait',
    titre: 'Votre forfait se termine aujourd\'hui',
    corps: [`Votre forfait ${esc(plan)} arrive à son terme aujourd'hui. Vos créatives livrées restent dans votre galerie.`, 'Pour continuer à recevoir de nouvelles créatives, et garder l\'avance prise sur votre marché, il suffit de renouveler.'],
    bouton: { texte: `Renouveler ${plan}`, lien: `${ADBOARD}/offers` } };
  if (type === 'retour7') return { objet: 'Vos créatives vous attendent toujours', apercu: 'Et votre marché, lui, continue d\'avancer.', rubrique: 'AdStack',
    titre: 'Vos créatives vous attendent toujours',
    corps: ['Votre forfait est arrivé à son terme il y a une semaine. Votre galerie, votre étude de marché et vos angles sont toujours là, dans AdBoard.', 'Si quelque chose ne vous a pas convenu, nous voulons le savoir : une ligne de réponse suffit, et nous la lisons.'],
    bouton: { texte: 'Reprendre où j\'en étais', lien: `${ADBOARD}/offers` } };
  if (type === 'retour30') return { objet: 'Ce qui a changé depuis votre départ', apercu: 'Un mois, et beaucoup de nouveautés.', rubrique: 'AdStack',
    titre: 'Ce qui a changé depuis votre départ',
    corps: ['Depuis un mois, nous avons continué à améliorer nos créatives et AdBoard, avec les retours de toutes les marques que nous accompagnons.', 'Votre espace, votre étude de marché et vos angles sont toujours là. Si vous voulez reprendre, tout repart de ce que nous savons déjà de votre marque.'],
    bouton: { texte: 'Voir les offres', lien: `${ADBOARD}/offers` } };
  return null;
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
// DÉCISION : quel email (au plus un) envoyer aujourd'hui à ce client.
// ════════════════════════════════════════════════════════════════════════════════════════════════
function choisirEmail(c, deja, maintenant = Date.now()) {
  // c : { actif, type ('pack'|'subscription'), premierPaiement, startedAt, expiresAt, used, total, dernierEnvoi, finAncienne }
  const cle = (k) => `cc_${k}`;
  const deja1 = (k) => deja.has(cle(k));
  const periode = c.expiresAt ? String(c.expiresAt).slice(0, 10) : 'x';
  if (c.dernierEnvoi && maintenant - c.dernierEnvoi < 20 * 3600000) return null;   // jamais deux le même jour

  // 1. départ : retour à J+7 et J+30
  if (!c.actif) {
    if (!c.finAncienne) return null;
    const j = (maintenant - c.finAncienne) / JOUR;
    if (j >= 30 && j < 37 && !deja1(`retour30_${periode}`)) return { type: 'retour30', cle: cle(`retour30_${periode}`) };
    if (j >= 7 && j < 14 && !deja1(`retour7_${periode}`)) return { type: 'retour7', cle: cle(`retour7_${periode}`) };
    return null;
  }
  const joursRestants = c.expiresAt ? (new Date(c.expiresAt).getTime() - maintenant) / JOUR : 99;
  const pct = c.total > 0 ? c.used / c.total : 0;
  // 2. déclenchés (abonnement mensuel seulement pour l'upgrade et le bilan)
  if (c.type !== 'pack') {
    if (joursRestants <= 1 && joursRestants > -0.5 && !deja1(`dernier_${periode}`)) return { type: 'dernier_jour', cle: cle(`dernier_${periode}`) };
    if (joursRestants <= 5 && joursRestants > 1 && !deja1(`bilan_${periode}`)) return { type: 'bilan', cle: cle(`bilan_${periode}`) };
    if (pct >= 1 && !deja1(`u100_${periode}`)) return { type: 'usage100', cle: cle(`u100_${periode}`) };
    if (pct >= 0.75 && pct < 1 && !deja1(`u75_${periode}`)) return { type: 'usage75', cle: cle(`u75_${periode}`) };
    if (pct >= 0.5 && pct < 0.75 && !deja1(`u50_${periode}`)) return { type: 'usage50', cle: cle(`u50_${periode}`) };
  }
  // 3. accueil
  const age = c.premierPaiement ? (maintenant - c.premierPaiement) / JOUR : 0;
  if (age >= 1 && age < 3 && !deja1('bienvenue')) return { type: 'bienvenue', cle: cle('bienvenue') };
  // 4. lettre de la semaine : la 1re à J+3, puis une tous les 7 jours, en alternant éducation / engagement
  const lettres = [...deja].filter((k) => k.startsWith('cc_lettre_'));
  const derniere = c.derniereLettre || 0;
  // une lettre ne suit jamais de près un autre email (2 jours d'écart au moins) : le client ne doit pas se sentir bombardé
  if (!deja1('stop') && age >= 3 && (!derniere || maintenant - derniere >= 6.5 * JOUR) && (!c.dernierEnvoi || maintenant - c.dernierEnvoi >= 2 * JOUR)) {
    const edu = EDUCATION.find((l) => !deja1('lettre_' + l.id));
    const eng = ENGAGEMENT.find((l) => !deja1('lettre_' + l.id));
    const nbEdu = lettres.filter((k) => k.startsWith('cc_lettre_edu_')).length, nbEng = lettres.filter((k) => k.startsWith('cc_lettre_eng_')).length;
    // ordre : éducation, engagement, éducation, éducation, engagement… (2 sujets d'éducation pour 1 d'engagement)
    const l = (eng && nbEng * 2 < nbEdu) ? eng : (edu || eng);
    if (l) return { type: 'lettre', lettre: l, cle: cle('lettre_' + l.id) };
  }
  return null;
}

function construire(choix, c, o, desinscription = '') {
  const m = choix.type === 'lettre' ? { ...choix.lettre } : emailDeclenche(choix.type, c, o);
  if (!m) return null;
  const html = lettre({ ...m, corps: m.corps || [], corps2: m.corps2 || [], desinscription: choix.type === 'lettre' ? desinscription : '' });
  return { objet: m.objet, html, texte: texteBrut({ ...m, corps: [...(m.corps || []), ...(m.corps2 || [])] }), cle: choix.cle };
}

// ════════════════════════════════════════════════════════════════════════════════════════════════
// DONNÉES D'UN CLIENT (lues dans Supabase) → l'objet `c` utilisé ci-dessus. Partagé avec le score de santé.
// ════════════════════════════════════════════════════════════════════════════════════════════════
const compte = (b) => b && (b.status === 'pending' || b.status === 'in_production' || b.status === 'done');
function etatClient({ subs, briefs, produits, journal, offres, labels }, maintenant = Date.now()) {
  const tri = [...(subs || [])].sort((a, b) => new Date(b.started_at) - new Date(a.started_at));
  const sub = tri[0]; if (!sub) return null;
  const actif = !!sub.active && (!sub.expires_at || new Date(sub.expires_at).getTime() > maintenant);
  const debut = sub.started_at ? new Date(sub.started_at).getTime() : 0;
  const mesBriefs = (briefs || []).filter((b) => sub.type === 'pack' || !debut || new Date(b.created_at).getTime() >= debut - 60000);
  const used = mesBriefs.filter(compte).reduce((s, b) => s + (b.credits_used || 6), 0);
  const total = sub.type === 'pack' ? (sub.total_credits || 0) : (sub.credits_per_week || 0) * 4;
  const crea = (produits || []).flatMap((p) => (Array.isArray(p.creatives) ? p.creatives : []).map((x) => ({ ...x, _p: p.id })));
  const duMois = crea.filter((x) => !debut || !x.date || new Date(x.date).getTime() >= debut - 60000);
  const angles = [...new Set(duMois.map((x) => String(x.angle || '').split('*')[0].trim()).filter(Boolean))];
  const top = crea.filter((x) => x.topPerformer).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))[0];
  const envois = (journal || []).filter((j) => String(j.email_key || '').startsWith('cc_') && j.email_key !== 'cc_stop');
  const stop = (journal || []).some((j) => j.email_key === 'cc_stop');
  const tEnvoi = (j) => new Date(j.created_at || j.sent_at || 0).getTime();
  const dernierEnvoi = envois.reduce((m, j) => Math.max(m, tEnvoi(j)), 0) || null;
  const derniereLettre = envois.filter((j) => j.email_key.startsWith('cc_lettre_')).reduce((m, j) => Math.max(m, tEnvoi(j)), 0) || null;
  const premierPaiement = Math.min(...tri.map((s) => new Date(s.started_at).getTime()).filter(Number.isFinite));
  const anciens = tri.filter((s) => s.expires_at && new Date(s.expires_at).getTime() <= maintenant);
  const finAncienne = !actif && anciens[0] ? new Date(anciens[0].expires_at).getTime() : null;
  const derniereDemande = (briefs || []).reduce((m, b) => Math.max(m, new Date(b.created_at || 0).getTime()), 0) || null;
  const ordre = ['starter', 'pro', 'scale'], i = ordre.indexOf(sub.plan);
  const fiche = (k) => (offres && offres[k]) ? { nom: offres[k].name, creatives: offres[k].creativesPerMonth, produits: offres[k].produits, delai: offres[k].monthly.delivery, prix: offres[k].monthly.price } : null;
  return {
    actif, type: sub.type === 'pack' ? 'pack' : 'subscription', plan: sub.plan, planNom: (labels && labels[sub.plan]) || sub.plan,
    startedAt: debut, expiresAt: sub.expires_at, premierPaiement: Number.isFinite(premierPaiement) ? premierPaiement : debut,
    used, total, joursRestants: sub.expires_at ? Math.max(0, Math.ceil((new Date(sub.expires_at).getTime() - maintenant) / JOUR)) : 0,
    livrees: duMois.length, nbVid: duMois.filter((x) => x.type === 'video').length, nbImg: duMois.filter((x) => x.type !== 'video').length,
    nbAngles: angles.length, angles, nbProduits: new Set(duMois.map((x) => x._p)).size, topAngle: top ? String(top.angle || '').split('*')[0].trim() : '',
    dernierEnvoi, derniereLettre, finAncienne, derniereDemande, deja: new Set([...envois.map((j) => j.email_key), ...(stop ? ['cc_stop'] : [])]),
    offres: { actuel: fiche(sub.plan) || { nom: sub.plan, creatives: total, produits: '—', delai: '—', prix: 0 }, suivant: i >= 0 && i < 2 ? fiche(ordre[i + 1]) : null },
  };
}

// ── SCORE DE SANTÉ (0-100) — remonté dans le CRM. Vert ≥ 70, orange 40-69, rouge < 40.
// Poids : usage 35 · activité récente 25 · emails 15 · relation (avis, top performers) 15 · paiement 10 (méthode des scores
// de santé SaaS : usage d'abord, puis adoption, relation et signaux commerciaux).
function scoreSante(c, { clics30 = 0, ouvertures30 = 0, avis = 0 } = {}, maintenant = Date.now()) {
  if (!c) return null;
  const raisons = [];
  const tempsEcoule = c.expiresAt && c.startedAt ? Math.min(1, Math.max(0.05, (maintenant - c.startedAt) / (new Date(c.expiresAt).getTime() - c.startedAt))) : 0.5;
  const pct = c.total > 0 ? c.used / c.total : 0;
  const usage = Math.min(100, Math.round((pct / tempsEcoule) * 70));   // utilise-t-il ses créatives au rythme du mois ?
  if (pct / tempsEcoule < 0.5) raisons.push('Utilise peu ses créatives');
  const jDemande = c.derniereDemande ? (maintenant - c.derniereDemande) / JOUR : 99;
  const activite = jDemande <= 7 ? 100 : jDemande <= 14 ? 70 : jDemande <= 30 ? 35 : 0;
  if (jDemande > 14) raisons.push(c.derniereDemande ? `Aucune demande depuis ${Math.round(jDemande)} jours` : 'Aucune demande de production');
  const emails = Math.min(100, clics30 * 35 + ouvertures30 * 8);
  if (!clics30 && !ouvertures30) raisons.push('N\'ouvre pas nos emails');
  const relation = Math.min(100, avis * 25 + (c.topAngle ? 40 : 0));
  let paiement = c.actif ? 100 : 0;
  if (!c.actif) raisons.push('Forfait terminé');
  let score = Math.round(usage * 0.35 + activite * 0.25 + emails * 0.15 + relation * 0.15 + paiement * 0.10);
  if (c.actif && c.joursRestants <= 5 && jDemande > 14) { score = Math.min(score, 35); raisons.unshift('Fin de forfait proche sans activité'); }
  if (c.actif && pct >= 0.75) raisons.unshift('Prêt pour une offre supérieure');
  return { score, couleur: score >= 70 ? 'vert' : score >= 40 ? 'orange' : 'rouge', raisons: raisons.slice(0, 3) };
}

// ── LE PASSAGE QUOTIDIEN : appelé par /cron/email-sequence. Au plus un email par client et par jour.
async function traiterCycle({ lire, envoyer, marquer, users, offres, labels, journalDe, lienDesinscription }, maintenant = Date.now()) {
  const subs = await lire('subscriptions?select=user_id,plan,type,active,started_at,expires_at,credits_per_week,total_credits');
  const parUser = new Map();
  (Array.isArray(subs) ? subs : []).forEach((s) => { if (!parUser.has(s.user_id)) parUser.set(s.user_id, []); parUser.get(s.user_id).push(s); });
  const bilan = { envoyes: 0, erreurs: 0 };
  for (const [uid, sList] of parUser) {
    try {
      const u = (users || []).find((x) => x.id === uid); if (!u || !u.email) continue;
      const [briefs, produits, journal] = await Promise.all([
        lire(`briefs?user_id=eq.${uid}&select=status,credits_used,created_at`),
        lire(`products?user_id=eq.${uid}&select=id,creatives`),
        journalDe(uid),
      ]);
      const c = etatClient({ subs: sList, briefs, produits, journal, offres, labels }, maintenant);
      if (!c) continue;
      const choix = choisirEmail(c, c.deja, maintenant); if (!choix) continue;
      const m = construire(choix, c, c.offres, lienDesinscription ? lienDesinscription(uid) : ''); if (!m) continue;
      const ok = await envoyer({ to: u.email, objet: m.objet, html: m.html, texte: m.texte, cle: m.cle, userId: uid });
      if (ok) { await marquer(uid, m.cle); bilan.envoyes++; }
    } catch (e) { bilan.erreurs++; console.error('[Cycle client] ' + uid + ' : ' + e.message); }
  }
  return bilan;
}

module.exports = { EDUCATION, ENGAGEMENT, lettre, emailDeclenche, choisirEmail, construire, etatClient, scoreSante, traiterCycle };
