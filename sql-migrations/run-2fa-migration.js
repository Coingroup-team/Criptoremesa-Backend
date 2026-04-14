/**
 * Run 2FA SQL migration using the same DB connection as the backend.
 *
 * ONE-TIME manual execution from project root:
 *
 *   # Default — uses PG_DB_SM_* credentials from .env
 *   node sql-migrations/run-2fa-migration.js
 *
 *   # With admin/owner credentials (needed if app user isn't table owner)
 *   node sql-migrations/run-2fa-migration.js --user ADMIN_USER --password ADMIN_PASS
 *
 *   # Diagnose: show current user, table owner and permissions
 *   node sql-migrations/run-2fa-migration.js --diagnose
 *
 * SAFE: Everything runs inside a TRANSACTION.
 * If ANY step fails, ALL changes are rolled back — nothing breaks.
 * Idempotent: safe to run multiple times (IF NOT EXISTS, CREATE OR REPLACE).
 *
 * Reads .env from project root automatically.
 */

const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

// ── Parse CLI arguments ──
const args = process.argv.slice(2);
function getArg(flag) {
  const idx = args.indexOf(flag);
  return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : null;
}
const isDiagnose = args.includes("--diagnose");
const cliUser = getArg("--user");
const cliPassword = getArg("--password");

// ── Load .env manually (no dotenv dependency needed) ──
const envPath = path.resolve(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

const sslConfig =
  process.env.PG_DB_SSL === "true" ? { rejectUnauthorized: false } : false;

// CLI --user / --password override .env credentials
const dbUser = cliUser || process.env.PG_DB_SM_USER;
const dbPassword = cliPassword || process.env.PG_DB_SM_PASSWORD;

const client = new Client({
  user: dbUser,
  host: process.env.PG_DB_SM_HOST,
  database: process.env.PG_DB_SM_NAME,
  password: dbPassword,
  port: process.env.PG_DB_SM_PORT || 5432,
  ssl: sslConfig,
});

// ── Split SQL file into individual statements ──
// Handles $$ function bodies correctly
function splitStatements(sql) {
  const stmts = [];
  let current = "";
  let inDollarQuote = false;
  const lines = sql.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    // Skip pure comment lines and blank lines outside functions
    if (!inDollarQuote && (trimmed.startsWith("--") || trimmed === "")) {
      if (current.trim()) current += "\n" + line;
      continue;
    }

    current += (current ? "\n" : "") + line;

    // Track $$ dollar-quoting for function bodies
    const dollarMatches = line.match(/\$\$/g);
    if (dollarMatches) {
      for (const _ of dollarMatches) inDollarQuote = !inDollarQuote;
    }
    // Also handle $function$ style
    const funcMatches = line.match(/\$function\$/g);
    if (funcMatches) {
      for (const _ of funcMatches) inDollarQuote = !inDollarQuote;
    }

    // Statement ends with ; outside of a dollar-quoted block
    if (!inDollarQuote && trimmed.endsWith(";")) {
      const clean = current.trim();
      // Only keep actual SQL statements (skip comment-only blocks)
      if (clean && !clean.match(/^--[\s\S]*$/)) {
        stmts.push(clean);
      }
      current = "";
    }
  }

  return stmts;
}

async function run() {
  console.log(
    `Connecting to DB: ${process.env.PG_DB_SM_HOST} / ${process.env.PG_DB_SM_NAME}`,
  );
  console.log(
    `Connecting as user: ${dbUser}${cliUser ? " (CLI override)" : " (from .env)"}\n`,
  );

  await client.connect();

  // ── DIAGNOSE MODE ──
  if (isDiagnose) {
    console.log("🔍 Running diagnostics...\n");

    const whoami = await client.query("SELECT current_user, session_user");
    console.log(`  Current user:  ${whoami.rows[0].current_user}`);
    console.log(`  Session user:  ${whoami.rows[0].session_user}\n`);

    const owner = await client.query(
      "SELECT tableowner FROM pg_tables WHERE schemaname = 'sec_cust' AND tablename = 'ms_sixmap_users'",
    );
    if (owner.rows.length > 0) {
      console.log(`  Table owner:   ${owner.rows[0].tableowner}`);
      const isSame = owner.rows[0].tableowner === whoami.rows[0].current_user;
      console.log(
        `  You are owner: ${isSame ? "✅ YES" : "❌ NO — you need to connect as '" + owner.rows[0].tableowner + "'"}\n`,
      );
    } else {
      console.log("  ⚠️  Table sec_cust.ms_sixmap_users not found\n");
    }

    // Check if current user is superuser or has rds_superuser
    const roles = await client.query(
      "SELECT rolname, rolsuper FROM pg_roles WHERE rolname = current_user",
    );
    if (roles.rows.length > 0) {
      console.log(`  Is superuser:  ${roles.rows[0].rolsuper ? "YES" : "NO"}`);
    }

    const memberOf = await client.query(
      "SELECT r.rolname FROM pg_roles r " +
        "JOIN pg_auth_members m ON m.roleid = r.oid " +
        "WHERE m.member = (SELECT oid FROM pg_roles WHERE rolname = current_user)",
    );
    if (memberOf.rows.length > 0) {
      console.log(
        `  Member of:     ${memberOf.rows.map((r) => r.rolname).join(", ")}`,
      );
    }

    // Check existing 2FA columns (already migrated?)
    const cols = await client.query(
      "SELECT column_name FROM information_schema.columns " +
        "WHERE table_schema='sec_cust' AND table_name='ms_sixmap_users' " +
        "AND column_name IN ('two_factor_enabled','two_factor_factor_sid') " +
        "ORDER BY column_name",
    );
    if (cols.rows.length > 0) {
      console.log(
        `\n  2FA columns already exist: ${cols.rows.map((r) => r.column_name).join(", ")}`,
      );
    } else {
      console.log("\n  2FA columns: not yet created");
    }

    console.log("\n💡 To run migration as the table owner:");
    if (owner.rows.length > 0) {
      console.log(
        `   node sql-migrations/run-2fa-migration.js --user ${owner.rows[0].tableowner} --password YOUR_PASSWORD`,
      );
    }

    await client.end();
    return;
  }

  // ── MIGRATION MODE ──
  const sqlFile = path.resolve(__dirname, "2fa_setup.sql");
  const sql = fs.readFileSync(sqlFile, "utf8");
  const statements = splitStatements(sql);

  console.log(`Found ${statements.length} SQL statements to execute\n`);

  try {
    // ── BEGIN TRANSACTION ──
    await client.query("BEGIN");
    console.log("🔒 Transaction started\n");

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      // Show a short preview of each statement
      const preview = stmt.replace(/\s+/g, " ").substring(0, 80);
      console.log(`  [${i + 1}/${statements.length}] ${preview}...`);
      await client.query(stmt);
      console.log(`       ✅ OK`);
    }

    // ── COMMIT ──
    await client.query("COMMIT");
    console.log("\n🔓 Transaction committed\n");
    console.log("✅ Migration completed successfully!\n");

    // ── Verification ──
    const colCheck = await client.query(
      "SELECT column_name FROM information_schema.columns " +
        "WHERE table_schema='sec_cust' AND table_name='ms_sixmap_users' " +
        "AND column_name IN ('two_factor_enabled','two_factor_factor_sid') " +
        "ORDER BY column_name",
    );
    console.log(
      "Columns added:",
      colCheck.rows.map((r) => r.column_name).join(", ") || "⚠️  NONE",
    );

    const funcCheck = await client.query(
      "SELECT routine_name FROM information_schema.routines " +
        "WHERE routine_schema='sec_cust' " +
        "AND routine_name IN ('get_2fa_status_by_email','sp_save_pending_2fa_factor','sp_enable_2fa','sp_disable_2fa') " +
        "ORDER BY routine_name",
    );
    console.log(
      "Functions created:",
      funcCheck.rows.map((r) => r.routine_name).join(", ") || "⚠️  NONE",
    );

    const sigCheck = await client.query(
      "SELECT pg_get_function_result(oid) as result FROM pg_proc " +
        "WHERE proname='get_all_users_by_email' " +
        "AND pronamespace=(SELECT oid FROM pg_namespace WHERE nspname='sec_cust')",
    );
    if (
      sigCheck.rows.length > 0 &&
      sigCheck.rows[0].result.includes("two_factor_enabled")
    ) {
      console.log("get_all_users_by_email includes two_factor_enabled: ✅");
    } else {
      console.log(
        "⚠️  WARNING: get_all_users_by_email may not include two_factor_enabled",
      );
    }
  } catch (err) {
    // ── ROLLBACK — nothing changes ──
    await client.query("ROLLBACK");
    console.error("\n🔓 Transaction ROLLED BACK — no changes were applied\n");
    console.error("❌ Migration failed at:", err.message);
    console.error(err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
