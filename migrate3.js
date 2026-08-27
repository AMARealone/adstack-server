// migrate-database.js
// Migration complète schéma + données + policies RLS, sans pg_dump/pg_restore — juste le
// package "pg" (npm install pg). Lit dynamiquement TOUTES les tables du schéma public, donc
// pas besoin de connaître leurs noms à l'avance.
//
// Lance avec : node migrate-database.js

// migrate-database.js — VERSION 3 (batch insert + priorité + --skip-logs)
console.log('=== SCRIPT VERSION 3 ===\n');

const { Client } = require('pg');

const OLD_CONNECTION = 'postgresql://postgres.mifljhsusidgzelnswma:1dstack01112003@aws-1-eu-central-1.pooler.supabase.com:5432/postgres';
const NEW_CONNECTION = 'postgresql://postgres.hgxcpkrqdahmxhmpouvm:0dstack01112003@aws-1-eu-west-1.pooler.supabase.com:5432/postgres';

async function main() {
  const oldDb = new Client({ connectionString: OLD_CONNECTION });
  const newDb = new Client({ connectionString: NEW_CONNECTION });

  console.log('→ Connexion à l\'ANCIEN projet (mifljhsusidgzelnswma)...');
  await oldDb.connect();
  console.log('✓ Ancien projet connecté.');

  console.log('→ Connexion au NOUVEAU projet (hgxcpkrqdahmxhmpouvm)...');
  await newDb.connect();
  console.log('✓ Nouveau projet connecté.\n');

  // ── 1. Liste des tables du schéma public ──
  const tablesRes = await oldDb.query(`
    select table_name from information_schema.tables
    where table_schema = 'public' and table_type = 'BASE TABLE'
    order by table_name
  `);
  const tables = tablesRes.rows.map(r => r.table_name);

  // Priorité aux vraies données métier — les tables de logs/analytics peuvent être énormes et
  // ne sont pas nécessaires pour qu'AdBoard/Factory/CRM refonctionnent. Migrées en dernier.
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
    console.log(`\n📋 Table "${table}"`);

    // ── 2. Colonnes ──
    const colsRes = await oldDb.query(`
      select column_name, data_type, udt_name, is_nullable, column_default,
             character_maximum_length
      from information_schema.columns
      where table_schema='public' and table_name=$1
      order by ordinal_position
    `, [table]);

    // ── 3. Clé primaire ──
    const pkRes = await oldDb.query(`
      select kcu.column_name
      from information_schema.table_constraints tc
      join information_schema.key_column_usage kcu
        on tc.constraint_name = kcu.constraint_name and tc.table_schema = kcu.table_schema
      where tc.table_schema='public' and tc.table_name=$1 and tc.constraint_type='PRIMARY KEY'
    `, [table]);
    const pkCols = pkRes.rows.map(r => r.column_name);

    // ── 4. Génère le CREATE TABLE ──
    const colDefs = colsRes.rows.map(c => {
      let type = c.udt_name;
      // Mapping des types internes Postgres vers leur syntaxe SQL lisible
      const typeMap = { varchar: `varchar${c.character_maximum_length ? '('+c.character_maximum_length+')' : ''}`,
        bpchar: 'char', int4: 'integer', int8: 'bigint', int2: 'smallint', float4: 'real',
        float8: 'double precision', bool: 'boolean', timestamptz: 'timestamptz',
        timestamp: 'timestamp', jsonb: 'jsonb', json: 'json', uuid: 'uuid', text: 'text',
        numeric: 'numeric', date: 'date' };
      type = typeMap[c.udt_name] || c.udt_name;
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
      continue;
    }

    // ── 5. Policies RLS ──
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
          const roles = p.roles && p.roles.length ? p.roles.join(', ') : 'public';
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

    // ── 6. Données — un seul INSERT multi-lignes par lot de 200 (au lieu d'un aller-retour
    // réseau par ligne, qui rendait les grosses tables extrêmement lentes avec le pooler).
    const countRes = await oldDb.query(`SELECT COUNT(*) FROM "${table}"`);
    const total = parseInt(countRes.rows[0].count, 10);
    if (total === 0) { console.log('  (table vide)'); continue; }
    console.log(`  ${total} ligne(s) à copier...`);

    const colNames = colsRes.rows.map(c => c.column_name);
    let copied = 0;
    const batchSize = 200;
    for (let offset = 0; offset < total; offset += batchSize) {
      const dataRes = await oldDb.query(`SELECT * FROM "${table}" ORDER BY ${pkCols[0] ? `"${pkCols[0]}"` : colNames[0]} LIMIT ${batchSize} OFFSET ${offset}`);
      if (!dataRes.rows.length) break;

      const valueRows = [];
      const flatValues = [];
      let paramIdx = 1;
      for (const row of dataRes.rows) {
        const placeholders = colNames.map(c => { flatValues.push(row[c]); return `$${paramIdx++}`; });
        valueRows.push(`(${placeholders.join(', ')})`);
      }
      const insertSQL = `INSERT INTO "${table}" (${colNames.map(c=>`"${c}"`).join(', ')}) VALUES ${valueRows.join(', ')} ON CONFLICT DO NOTHING`;
      try {
        await newDb.query(insertSQL, flatValues);
        copied += dataRes.rows.length;
      } catch (e) {
        // Le lot entier a échoué (souvent une seule ligne à problème dans le tas) — on
        // retente ligne par ligne UNIQUEMENT pour ce lot-là, pour isoler le fautif sans
        // perdre tout le reste du lot.
        console.warn(`  ⚠ Lot ${offset}-${offset+dataRes.rows.length} échoué en bloc (${e.message}), reprise ligne par ligne...`);
        for (const row of dataRes.rows) {
          const values = colNames.map(c => row[c]);
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

  await oldDb.end();
  await newDb.end();
  console.log('\n✅ Migration base de données terminée.');
}

main().catch(e => { console.error('✗ Erreur fatale :', e); process.exit(1); });
