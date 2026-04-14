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
  user: process.env.PG_DB_CR_USER,
  host: process.env.PG_DB_CR_HOST,
  database: process.env.PG_DB_CR_NAME,
  password: process.env.PG_DB_CR_PASSWORD,
  port: process.env.PG_DB_CR_PORT || 5432,
  ssl: sslConfig,
});

(async () => {
  try {
    await client.connect();
    console.log("Connected to DB:", process.env.PG_DB_CR_NAME);

    const r = await client.query(
      `UPDATE users SET two_factor_enabled = FALSE, two_factor_factor_sid = NULL
       WHERE email_user = $1
       RETURNING email_user, two_factor_enabled, two_factor_factor_sid`,
      [EMAIL]
    );

    if (r.rowCount === 0) {
      // Try with schema prefix
      const r2 = await client.query(
        `SELECT schemaname, tablename FROM pg_tables WHERE tablename = 'users'`
      );
      console.log("Table 'users' found in schemas:", r2.rows);

      if (r2.rows.length > 0) {
        const schema = r2.rows[0].schemaname;
        const r3 = await client.query(
          `UPDATE ${schema}.users SET two_factor_enabled = FALSE, two_factor_factor_sid = NULL
           WHERE email_user = $1
           RETURNING email_user, two_factor_enabled, two_factor_factor_sid`,
          [EMAIL]
        );
        console.log("Rows updated:", r3.rowCount, r3.rows[0]);
      }
    } else {
      console.log("Rows updated:", r.rowCount, r.rows[0]);
    }

    await client.end();
  } catch (err) {
    console.error("Error:", err.message);
    await client.end();
    process.exit(1);
  }
})();
