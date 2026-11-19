// GET /learning/winners — carnet d'apprentissage (créatives, angles et concepts gagnants, tous clients). RÉSERVÉ à l'administrateur (session Supabase ou clé du prospecteur). tp-v2-apprentissage
if (req.method === 'GET' && (req.url || '').split('?')[0] === '/learning/winners') {
  (async () => {
    try {
      if (!(await crmAdminOk(req))) { res.writeHead(403, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: 'réservé à l\'administrateur' })); return; }
      const c = await carnetApprentissage();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(c, (k, v) => v instanceof Set ? [...v] : v, 2));
    } catch (e) { res.writeHead(500, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: e.message })); }
  })();
  return;
}

