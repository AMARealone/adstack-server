// patch_serveur_tp.cjs — TOP PERFORMER v2 + APPRENTISSAGE côté serveur (16 nov. 2026)
// 1. Calcul du classement v2 (même code que AdBoard), placé AU NIVEAU DU MODULE (avant, il était déclaré dans le gestionnaire de requêtes : routes antérieures en erreur d'initialisation).
// 2. CT gagnants du planificateur : seuls les gagnants au classement fiable comptent (indice ≥ 105 et données non légères).
// 3. À chaque livraison, fiche complète de la créative (CT, niveau, hooks, prompt, script/direction) gardée sur R2 — jamais renvoyée au client.
// 4. GET /learning/winners (administrateur) : créatives, angles et concepts gagnants, tous clients.
// Usage : node patch_serveur_tp.cjs [chemin vers serveur.js]   (idempotent ; s'arrête sans rien écrire si une ancre manque)
const fs = require('fs'), path = require('path');
const cible = process.argv[2] || path.join(process.cwd(), 'serveur.js');
if (!fs.existsSync(cible)) { console.error('Fichier introuvable : ' + cible); process.exit(1); }
let s = fs.readFileSync(cible, 'utf8');
if (s.includes('tp-v2-apprentissage')) { console.log('Déjà appliqué.'); process.exit(0); }
const crlf = s.includes('\r\n'); if (crlf) s = s.replace(/\r\n/g, '\n');
const lire = (f) => fs.readFileSync(path.join(__dirname, f), 'utf8').replace(/\r\n/g, '\n');
const un = (old, label) => { const n = s.split(old).length - 1; if (n !== 1) { console.error('ANCRE ' + label + ' : ' + n + ' occurrence(s) au lieu de 1 — rien n\'est écrit.'); process.exit(2); } };
const remplace = (old, nouveau, label) => { un(old, label); s = s.replace(old, () => nouveau); console.log('  ✓ ' + label); };

// 1. retirer l'ancien bloc (dans le gestionnaire) et poser le nouveau + l'apprentissage au niveau du module
const deb = s.indexOf('// ══ TOP PERFORMER — copie exacte de src/topPerformer.js (AdBoard) ══'), finMarq = '// ══ fin TOP PERFORMER ══', fin = s.indexOf(finMarq);
if (deb < 0 || fin < deb) { console.error('ANCRE bloc Top Performer introuvable — rien n\'est écrit.'); process.exit(2); }
s = s.slice(0, deb) + s.slice(fin + finMarq.length);
remplace("const server = http.createServer(async (req, res) => {", lire('serveur_tp_bloc.js') + '\n' + lire('serveur_apprentissage.js') + "\nconst server = http.createServer(async (req, res) => {", 'bloc au niveau du module');
// 2. CT gagnants fiables
remplace("ctGagnants = tp.map(c => ({ ctId", "ctGagnants = tp.filter(c => { const s2 = sc[c.id]; return !s2 || !s2.chiffre || !s2.comparable || (s2.score >= 1.05 && s2.fiabilite !== 'faible'); }).map(c => ({ ctId", 'CT gagnants (renewal-context)');
remplace("const gagn = (pr.creatives || []).filter(c => c.topPerformer && (c.ct || c.ctId)).map(c => ({ ctId: c.ct || c.ctId }));",
  "const gagn = (() => { const parCible = {}; (pr.creatives || []).filter(c => c.topPerformer && (c.ct || c.ctId)).forEach(c => { const d0 = deliveries.find(x => x.semaine === c.week); const k0 = (d0 && (d0.cible_signature || d0.cible)) || c.cible || '?'; (parCible[k0] = parCible[k0] || []).push(c); }); const out = []; Object.values(parCible).forEach(g0 => { const sc0 = scoresTopPerformer(g0); g0.forEach(c => { const s0 = sc0[c.id]; if (!s0 || !s0.chiffre || !s0.comparable || (s0.score >= 1.05 && s0.fiabilite !== 'faible')) out.push({ ctId: c.ct || c.ctId }); }); }); return out; })();", 'CT gagnants (lot/plan)');
// 3. fiche d'apprentissage à la livraison
remplace("        newlyPushedIndices.push(i);\n      } catch(eUp)", `        try { // tp-v2-apprentissage : fiche complète gardée côté serveur (R2), jamais renvoyée au client
          const jb = c.job || {};
          ecrireApprentissage(idCandidat, { id: idCandidat, productId, ticketId, generation: generationVersion, semaine: weekLabel, angle: angleCreative, angle_brut: angleBrutCreative, cible: cibleCeLot, ct: c.ct || null, ct_nom: jb.ctNom || c.ctNom || null, niveau: c.niveau || null, format: c.videoUrl ? 'video' : 'image', raison_ct: c.ctRaison || jb.raison || null, hooks: (((deliverables.copies || [])[c.angleIdx || 0]) || {}).hooks || [], prompt: c.prompt ? String(c.prompt).slice(0, 4000) : null, meta: c.meta ? String(c.meta).slice(0, 1500) : null, qa: _compactApprentissage(c.qa, 6000), video: c.videoUrl ? { direction: _compactApprentissage(jb.direction), execution: _compactApprentissage(jb.execution, 6000), ct_video_url: jb.ctVideoUrl || null, cout_usd: jb.cout_usd != null ? jb.cout_usd : null } : null, cree_le: new Date().toISOString() });
        } catch (_) {}
        newlyPushedIndices.push(i);
      } catch(eUp)`, 'fiche à la livraison');
// 4. route
remplace("// POST /products/:id/mark-top-performer — marque/démarque", lire('serveur_route_apprentissage.js') + "// POST /products/:id/mark-top-performer — marque/démarque", 'route /learning/winners');
if (crlf) s = s.replace(/\n/g, '\r\n');
fs.copyFileSync(cible, cible + '.avant_tp');
fs.writeFileSync(cible, s);
console.log('OK — serveur.js corrigé (sauvegarde : serveur.js.avant_tp).');
