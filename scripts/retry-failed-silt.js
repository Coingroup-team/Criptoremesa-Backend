import dotenv from "dotenv";
import { Pool } from "pg";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

const pool = new Pool({
  user: process.env.PG_DB_SM_USER || "postgres",
  host: process.env.PG_DB_SM_HOST || "localhost",
  database: process.env.PG_DB_SM_NAME || "criptoremesa_db",
  password: process.env.PG_DB_SM_PASSWORD,
  port: process.env.PG_DB_SM_PORT || 5432,
});

async function getFailedSiltIds() {
  try {
    console.log("\n=================================================");
    console.log("     FAILED SILT IDs ANALYSIS");
    console.log("=================================================\n");

    // Get all SILT IDs that failed (not in lnk_users_extra_data)
    const failedQuery = `
      SELECT 
        lvl.silt_id,
        lvl.uuid_user,
        u.email_user
      FROM sec_cust.lnk_users_verif_level lvl
      JOIN sec_cust.ms_sixmap_users u ON u.uuid_user = lvl.uuid_user
      WHERE lvl.silt_id IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 
        FROM sec_cust.lnk_users_extra_data ed
        WHERE ed.id_user = u.id_user
        AND ed.id_item = (SELECT id_item FROM sec_cust.ms_item WHERE name = 'silt_full_json')
      )
      ORDER BY u.email_user
    `;

    const result = await pool.query(failedQuery);
    const failedCount = result.rows.length;

    console.log(`Total failed SILT IDs: ${failedCount}\n`);

    if (failedCount === 0) {
      console.log("✓ No failed IDs found - all were processed successfully!");
      console.log("\n=================================================\n");
      return;
    }

    // Show first 10 failed IDs as examples
    console.log("Sample failed IDs (first 10):");
    console.log("=============================");
    result.rows.slice(0, 10).forEach((row, i) => {
      console.log(`${i + 1}. ${row.email_user}`);
      console.log(`   SILT ID: ${row.silt_id}`);
    });

    console.log("\n\nWARNING:");
    console.log("========");
    console.log("Most failed IDs have 'All API tokens failed' errors.");
    console.log("This means:");
    console.log("- The SILT account was deleted");
    console.log("- The verification expired");
    console.log("- It was a test account removed from SILT");
    console.log("\nRetrying will likely fail again with the same errors.");
    console.log(
      "Only retry if you believe there was a temporary network issue."
    );

    console.log("\n\nOPTIONS:");
    console.log("========");
    console.log("1. Retry ALL failed IDs (will take hours):");
    console.log("   npm run fetch-silt");
    console.log("   (Script automatically skips successful ones)");
    console.log("\n2. Export failed SILT IDs to file for review:");
    console.log("   node export-failed-silt-ids.js");
    console.log("\n3. Check specific SILT ID manually:");
    console.log(
      "   curl -H 'X-Company-App-Id: dcf5c568-6de1-4459-a040-038fb762366f' \\"
    );
    console.log(
      "        -H 'X-Company-App-API-Token: 2aa4b90a-ba4f-43c0-9cee-b2ecb90201dc' \\"
    );
    console.log("        https://api.siltapp.com/v1/users/{silt_id}/status/");

    console.log("\n=================================================\n");
  } catch (error) {
    console.error("Error getting failed IDs:", error.message);
  } finally {
    await pool.end();
  }
}

getFailedSiltIds();
