/**
 * Disable 2FA for a specific user.
 *
 * Usage (from project root):
 *   node scripts/disable-2fa.js
 *
 * Uses PG_DB_CR_* credentials from .env automatically.
 */

const { execSync } = require("child_process");
const { Client } = require("pg");

// ── Get env vars from the running PM2 process (production has correct creds) ──
let pm2Env = {};
try {
  const pm2List = JSON.parse(execSync("pm2 jlist", { encoding: "utf8" }));
  const app = pm2List.find((p) => p.name === "prod-be-bh:api");
  if (app && app.pm2_env) {
    pm2Env = app.pm2_env;
    console.log("✅ Loaded env from PM2 process 'prod-be-bh:api'");
  } else {
    console.log("⚠️  PM2 process not found, falling back to .env");
    require("dotenv").config({ path: require("path").resolve(__dirname, "..", ".env") });
    pm2Env = process.env;
  }
} catch (e) {
  console.log("⚠️  PM2 not available, falling back to .env");
  require("dotenv").config({ path: require("path").resolve(__dirname, "..", ".env") });
  pm2Env = process.env;
}

const EMAIL = "bithonor.2023+06@gmail.com";

console.log("DB User:", pm2Env.PG_DB_SM_USER);
console.log("DB Host:", pm2Env.PG_DB_SM_HOST);
console.log("DB Name:", pm2Env.PG_DB_SM_NAME);
console.log("DB Pass length:", pm2Env.PG_DB_SM_PASSWORD?.length);

const sslConfig =
  pm2Env.PG_DB_SSL === "true" ? { rejectUnauthorized: false } : false;

const client = new Client({
  user: pm2Env.PG_DB_SM_USER,
  host: pm2Env.PG_DB_SM_HOST,
  database: pm2Env.PG_DB_SM_NAME,
  password: pm2Env.PG_DB_SM_PASSWORD,
  port: pm2Env.PG_DB_SM_PORT || 5432,
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
