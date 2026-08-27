// migrate-database.js — VERSION 5 (resilience reconnexion + fix JSON + fix policies)
console.log('=== SCRIPT VERSION 5 ===\n');

const { Client } = require('pg');

const OLD_CONNECTION = 'postgresql://postgres.mifljhsusidgzelnswma:1dstack01112003@aws-1-eu-central-1.pooler.supabase.com:5432/postgres';
const NEW_CONNECTION = 'postgresql://postgres.hgxcpkrqdahmxhmpouvm:0dstack01112003@aws-1-eu-west-1.pooler.supabase.com:5432/postgres';

async function connecterAvecRetry(label, connectionString, tentatives = 3) {
  for (let i = 1; i <= tentatives; i++) {
    const client = new Client({ connectionString });
    // Sans ce handler, une coupure réseau fait planter tout le processus Node (unhandled
    // 'error' event) au lieu de juste faire échouer la requête en cours.
    client.on('error', () => {});
    try {
      await client.connect();
      return client;
    } catch (e) {
      console.warn(`  ⚠ Connexion ${label} échouée (essai ${i}/${tentatives}) :`, e.message);
      if (i === tentatives) throw e;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

async function migrerUneTable(oldDb, newDb, table) {
  console.log(`\n📋 Table "${table}"`);

  // ── Colonnes ──
  const colsRes = await oldDb.query(`
    select column_name, data_type, udt_name, is_nullable, column_default,
           character_maximum_length
    from information_schema.columns
    where table_schema='public' and table_name=$1
    order by ordinal_position
  `, [table]);

  // ── Clé primaire ──
  const pkRes = await oldDb.query(`
    select kcu.column_name
    from information_schema.table_constraints tc
    join information_schema.key_column_usage kcu
      on tc.constraint_name = kcu.constraint_name and tc.table_schema = kcu.table_schema
    where tc.table_schema='public' and tc.table_name=$1 and tc.constraint_type='PRIMARY KEY'
  `, [table]);
  const pkCols = pkRes.rows.map(r => r.column_name);

  // ── CREATE TABLE ──
  const colDefs = colsRes.rows.map(c => {
    const typeMap = { varchar: `varchar${c.character_maximum_length ? '('+c.character_maximum_length+')' : ''}`,
      bpchar: 'char', int4: 'integer', int8: 'bigint', int2: 'smallint', float4: 'real',
      float8: 'double precision', bool: 'boolean', timestamptz: 'timestamptz',
      timestamp: 'timestamp', jsonb: 'jsonb', json: 'json', uuid: 'uuid', text: 'text',
      numeric: 'numeric', date: 'date' };
    const type = typeMap[c.udt_name] || c.udt_name;
    let def = `"${c.column_name}" ${type}`;
    if (c.is_nullable === 'NO') def += ' NOT NULL';
    if (c.column_default) def += ` DEFAULT ${c.column_default}`;
    return def;
  });
  if (pkCols.length) colDefs.push(`PRIMARY KEY (${pkCols.map(c=>`"${c}"`).join(', ')})`);

  const createSQL = `CREATE TABLE IF NOT EXISTS "${table}" (\n  ${colDefs.join(',\n  ')}\n);`;
  try {
    await newDb.query(createSQL);
    console.log('  ✓ Table créée (ou déjà existante)');
  } catch (e) {
    console.error('  ✗ Erreur création table :', e.message);
    console.error('  SQL généré :', createSQL);
    return;
  }

  // ── Policies RLS ──
  const rlsEnabledRes = await oldDb.query(`
    select relrowsecurity from pg_class where relname=$1 and relnamespace = 'public'::regnamespace
  `, [table]);
  if (rlsEnabledRes.rows[0]?.relrowsecurity) {
    await newDb.query(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`);
    const policiesRes = await oldDb.query(`
      select policyname, permissive, roles, cmd, qual, with_check
      from pg_policies where schemaname='public' and tablename=$1
    `, [table]);
    for (const p of policiesRes.rows) {
      try {
        let rolesArr = p.roles;
        if (typeof rolesArr === 'string') rolesArr = rolesArr.replace(/^\{|\}$/g, '').split(',').filter(Boolean);
        const roles = Array.isArray(rolesArr) && rolesArr.length ? rolesArr.join(', ') : 'public';
        let sql = `CREATE POLICY "${p.policyname}" ON "${table}" AS ${p.permissive === 'PERMISSIVE' ? 'PERMISSIVE' : 'RESTRICTIVE'} FOR ${p.cmd} TO ${roles}`;
        if (p.qual) sql += ` USING (${p.qual})`;
        if (p.with_check) sql += ` WITH CHECK (${p.with_check})`;
        await newDb.query(sql + ';');
      } catch (e) {
        console.warn(`  ⚠ Policy "${p.policyname}" non recréée :`, e.message);
      }
    }
    console.log(`  ✓ RLS + ${policiesRes.rows.length} policy(ies)`);
  }

  // ── Données ──
  const countRes = await oldDb.query(`SELECT COUNT(*) FROM "${table}"`);
  const total = parseInt(countRes.rows[0].count, 10);
  if (total === 0) { console.log('  (table vide)'); return; }
  console.log(`  ${total} ligne(s) à copier...`);

  const colNames = colsRes.rows.map(c => c.column_name);
  // pg lit jsonb/json en objet JS automatiquement, mais ne le refait PAS en sens inverse à
  // l'écriture — sans ça, un objet part comme "[object Object]", d'où "invalid input syntax
  // for type json". On sérialise nous-mêmes ces colonnes avant d'insérer.
  const jsonCols = new Set(colsRes.rows.filter(c => c.udt_name === 'json' || c.udt_name === 'jsonb').map(c => c.column_name));
  const serialize = (colName, val) => {
    if (val === null || val === undefined) return val;
    if (jsonCols.has(colName) && typeof val !== 'string') return JSON.stringify(val);
    return val;
  };

  let copied = 0;
  const batchSize = 200;
  for (let offset = 0; offset < total; offset += batchSize) {
    const dataRes = await oldDb.query(`SELECT * FROM "${table}" ORDER BY ${pkCols[0] ? `"${pkCols[0]}"` : colNames[0]} LIMIT ${batchSize} OFFSET ${offset}`);
    if (!dataRes.rows.length) break;

    const valueRows = [];
    const flatValues = [];
    let paramIdx = 1;
    for (const row of dataRes.rows) {
      const placeholders = colNames.map(c => { flatValues.push(serialize(c, row[c])); return `$${paramIdx++}`; });
      valueRows.push(`(${placeholders.join(', ')})`);
    }
    const insertSQL = `INSERT INTO "${table}" (${colNames.map(c=>`"${c}"`).join(', ')}) VALUES ${valueRows.join(', ')} ON CONFLICT DO NOTHING`;
    try {
      await newDb.query(insertSQL, flatValues);
      copied += dataRes.rows.length;
    } catch (e) {
      console.warn(`  ⚠ Lot ${offset}-${offset+dataRes.rows.length} échoué en bloc (${e.message}), reprise ligne par ligne...`);
      for (const row of dataRes.rows) {
        const values = colNames.map(c => serialize(c, row[c]));
        const placeholders = colNames.map((_, i) => `$${i+1}`).join(', ');
        try {
          await newDb.query(`INSERT INTO "${table}" (${colNames.map(c=>`"${c}"`).join(', ')}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`, values);
          copied++;
        } catch (e2) {
          console.warn(`  ⚠ Ligne non copiée (${table}) :`, e2.message);
        }
      }
    }
    console.log(`  ... ${Math.min(offset+batchSize, total)}/${total}`);
  }
  console.log(`  ✓ ${copied}/${total} ligne(s) copiée(s)`);
}

async function main() {
  console.log('→ Connexion à l\'ANCIEN projet (mifljhsusidgzelnswma)...');
  let oldDb = await connecterAvecRetry('ancien projet', OLD_CONNECTION);
  console.log('✓ Ancien projet connecté.');

  console.log('→ Connexion au NOUVEAU projet (hgxcpkrqdahmxhmpouvm)...');
  let newDb = await connecterAvecRetry('nouveau projet', NEW_CONNECTION);
  console.log('✓ Nouveau projet connecté.\n');

  const tablesRes = await oldDb.query(`
    select table_name from information_schema.tables
    where table_schema = 'public' and table_type = 'BASE TABLE'
    order by table_name
  `);
  const tables = tablesRes.rows.map(r => r.table_name);

  const TABLES_PRIORITAIRES = ['products', 'briefs', 'subscriptions', 'pending_activations',
    'prospects', 'transactions', 'commandes', 'templates', 'ct_library', 'demos', 'demo_sessions',
    'short_links', 'push_subscriptions', 'notifications'];
  const TABLES_LOGS = ['api_usage_log', 'chat_messages', 'clarity_snapshots', 'data_insights',
    'email_sequence_log', 'funnel_events', 'user_events'];
  tables.sort((a, b) => {
    const rank = t => TABLES_PRIORITAIRES.includes(t) ? 0 : TABLES_LOGS.includes(t) ? 2 : 1;
    return rank(a) - rank(b);
  });
  const SAUTER_LOGS = process.argv.includes('--skip-logs');
  if (SAUTER_LOGS) console.log('⏭ --skip-logs actif : les tables de logs seront ignorées.\n');
  console.log(`${tables.length} table(s) trouvée(s) : ${tables.join(', ')}\n`);

  for (const table of tables) {
    if (SAUTER_LOGS && TABLES_LOGS.includes(table)) {
      console.log(`\n📋 Table "${table}" — SAUTÉE (--skip-logs)`);
      continue;
    }

    let tentativeTable = 0;
    while (true) {
      tentativeTable++;
      try {
        await migrerUneTable(oldDb, newDb, table);
        break;
      } catch (e) {
        const erreurConnexion = /Connection terminated|ECONNRESET|ETIMEDOUT|connection.*closed/i.test(e.message || '');
        if (!erreurConnexion || tentativeTable >= 3) {
          console.error(`  ✗ Table "${table}" abandonnée après erreur :`, e.message);
          break;
        }
        console.warn(`  ⚠ Connexion perdue pendant "${table}", reconnexion... (tentative ${tentativeTable}/3)`);
        try { await oldDb.end(); } catch(_) {}
        try { await newDb.end(); } catch(_) {}
        oldDb = await connecterAvecRetry('ancien projet', OLD_CONNECTION);
        newDb = await connecterAvecRetry('nouveau projet', NEW_CONNECTION);
      }
    }
  }

  await oldDb.end();
  await newDb.end();
  console.log('\n✅ Migration base de données terminée.');
}

main().catch(e => { console.error('✗ Erreur fatale :', e); process.exit(1); });
