/**
 * Disable 2FA for a specific user.
 *
 * Usage (from project root):
 *   node scripts/disable-2fa.js
 *
 * Uses PG_DB_CR_* credentials from .env automatically.
 */

const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

// ── Load .env manually ──
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

const EMAIL = "bithonor.2023+06@gmail.com";

const sslConfig =
  process.env.PG_DB_SSL === "true" ? { rejectUnauthorized: false } : false;

const client = new Client({
  user: process.env.PG_DB_SM_USER,
  host: process.env.PG_DB_SM_HOST,
  database: process.env.PG_DB_SM_NAME,
  password: process.env.PG_DB_SM_PASSWORD,
  port: process.env.PG_DB_SM_PORT || 5432,
  ssl: sslConfig,
});

(async () => {
  try {
    await client.connect();
    console.log("Connected to DB:", process.env.PG_DB_SM_NAME);

    // Find which schema has the users table
    const schemas = await client.query(
      `SELECT schemaname FROM pg_tables WHERE tablename = 'users'`
    );
    console.log("Schemas with 'users' table:", schemas.rows.map(r => r.schemaname));

    if (schemas.rows.length === 0) {
      console.error("No 'users' table found in any schema!");
      await client.end();
      process.exit(1);
    }

    for (const row of schemas.rows) {
      const schema = row.schemaname;
      try {
        const r = await client.query(
          `UPDATE "${schema}".users SET two_factor_enabled = FALSE, two_factor_factor_sid = NULL
           WHERE email_user = $1
           RETURNING email_user, two_factor_enabled, two_factor_factor_sid`,
          [EMAIL]
        );
        if (r.rowCount > 0) {
          console.log(`✅ Updated in ${schema}.users:`, r.rowCount, r.rows[0]);
        } else {
          console.log(`Schema ${schema}: user not found`);
        }
      } catch (e) {
        console.log(`Schema ${schema}: ${e.message}`);
      }
    }

    await client.end();
  } catch (err) {
    console.error("Error:", err.message);
    await client.end();
    process.exit(1);
  }
})();
