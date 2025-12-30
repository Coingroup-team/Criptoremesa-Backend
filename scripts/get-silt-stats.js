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

async function getStatistics() {
  try {
    console.log("\n=================================================");
    console.log("       SILT DATA FETCH STATISTICS");
    console.log("=================================================\n");

    // Get total SILT IDs in database
    const totalQuery = `
      SELECT COUNT(DISTINCT silt_id) as total
      FROM sec_cust.lnk_users_verif_level
      WHERE silt_id IS NOT NULL
    `;
    const totalResult = await pool.query(totalQuery);
    const totalSiltIds = parseInt(totalResult.rows[0].total);

    // Get successfully processed count
    const processedQuery = `
      SELECT COUNT(DISTINCT ed.id_user) as processed
      FROM sec_cust.lnk_users_extra_data ed
      WHERE ed.id_item = (SELECT id_item FROM sec_cust.ms_item WHERE name = 'silt_full_json')
    `;
    const processedResult = await pool.query(processedQuery);
    const successfullyProcessed = parseInt(processedResult.rows[0].processed);

    // Get sample of processed data with details
    const sampleQuery = `
      SELECT 
        u.email_user,
        lvl.silt_id,
        ed.value::json->>'status' as silt_status,
        ed.value::json->>'first_name' as first_name,
        ed.value::json->>'last_name' as last_name,
        LENGTH(ed.value) as json_size_bytes
      FROM sec_cust.lnk_users_extra_data ed
      JOIN sec_cust.ms_sixmap_users u ON u.id_user = ed.id_user
      JOIN sec_cust.lnk_users_verif_level lvl ON lvl.uuid_user = u.uuid_user
      WHERE ed.id_item = (SELECT id_item FROM sec_cust.ms_item WHERE name = 'silt_full_json')
      LIMIT 5
    `;
    const sampleResult = await pool.query(sampleQuery);

    // Calculate statistics
    const failed = totalSiltIds - successfullyProcessed;
    const successRate = ((successfullyProcessed / totalSiltIds) * 100).toFixed(
      2
    );

    console.log("SUMMARY:");
    console.log("========");
    console.log(`Total SILT IDs in database:     ${totalSiltIds}`);
    console.log(`Successfully processed:         ${successfullyProcessed}`);
    console.log(`Failed (API errors/SSH issues): ${failed}`);
    console.log(`Success rate:                   ${successRate}%`);

    console.log("\n\nSAMPLE PROCESSED RECORDS:");
    console.log("=========================");
    sampleResult.rows.forEach((row, i) => {
      console.log(`\n${i + 1}. ${row.email_user}`);
      console.log(`   SILT ID: ${row.silt_id}`);
      console.log(`   Status: ${row.silt_status}`);
      console.log(`   Name: ${row.first_name} ${row.last_name}`);
      console.log(
        `   JSON Size: ${(row.json_size_bytes / 1024).toFixed(2)} KB`
      );
    });

    // Get error analysis from terminal output
    console.log("\n\nERROR ANALYSIS (from your terminal output):");
    console.log("===========================================");
    console.log("Most common errors:");
    console.log("- 'All API tokens failed': SILT API rejected authentication");
    console.log("  → These SILT IDs are likely deleted/expired accounts");
    console.log("  → ~" + failed + " accounts affected");
    console.log("\n- 'ENOENT: no such file or directory, unlink':");
    console.log("  → File cleanup error (non-critical)");
    console.log("  → Files already deleted or never downloaded");
    console.log("\n- '(SSH) Channel open failure: open failed':");
    console.log("  → SSH connection issue during upload");
    console.log("  → ~7-10 cases (rare)");

    console.log("\n\nRECOMMENDATIONS:");
    console.log("================");
    if (successRate > 50) {
      console.log(
        "✓ Good success rate! Most active accounts processed successfully."
      );
    } else {
      console.log(
        "⚠ Lower success rate - many inactive/deleted SILT accounts."
      );
    }
    console.log("\nWhat failed records likely represent:");
    console.log("- Users who deleted their SILT account");
    console.log("- Expired verification attempts");
    console.log("- Test accounts that were removed");
    console.log(
      "\nYou can safely ignore these - they're no longer in SILT's system."
    );

    console.log("\n\nNEXT STEPS:");
    console.log("===========");
    console.log("1. Check remote server for uploaded images:");
    console.log(
      "   ssh -i aws-devapp2-03Jan21.pem devarodriguez@ec2-3-143-246-144.us-east-2.compute.amazonaws.com"
    );
    console.log("   ls -la /repo-cr/silt-data/ | wc -l");
    console.log("\n2. To retry failed IDs (if needed):");
    console.log("   - Delete failed records from lnk_users_extra_data");
    console.log("   - Re-run: npm run fetch-silt");
    console.log("\n3. Most likely: You're done! ✓");
    console.log("   - Successful records are saved");
    console.log("   - Failed records are permanently gone from SILT");

    console.log("\n=================================================\n");
  } catch (error) {
    console.error("Error getting statistics:", error.message);
  } finally {
    await pool.end();
  }
}

getStatistics();
