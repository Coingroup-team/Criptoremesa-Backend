/**
 * Disable 2FA for a specific user.
 *
 * Usage (from project root):
 *   node scripts/disable-2fa.js
 *
 * Uses PG_DB_CR_* credentials from .env automatically.
 */

const path = require("path");
const { Client } = require("pg");

// ── Load .env with dotenv (handles special chars correctly) ──
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const EMAIL = "bithonor.2023+06@gmail.com";

// Debug: show what credentials were loaded
console.log("DB User:", process.env.PG_DB_SM_USER);
console.log("DB Host:", process.env.PG_DB_SM_HOST);
console.log("DB Name:", process.env.PG_DB_SM_NAME);
console.log("DB Pass length:", process.env.PG_DB_SM_PASSWORD?.length, "first 3:", process.env.PG_DB_SM_PASSWORD?.slice(0, 3));

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
