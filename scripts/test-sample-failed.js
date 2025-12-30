import dotenv from "dotenv";
import { Pool } from "pg";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const pool = new Pool({
  user: process.env.PG_DB_SM_USER || "postgres",
  host: process.env.PG_DB_SM_HOST || "localhost",
  database: process.env.PG_DB_SM_NAME || "criptoremesa_db",
  password: process.env.PG_DB_SM_PASSWORD,
  port: process.env.PG_DB_SM_PORT || 5432,
});

const SILT_API_BASE_URL = "https://api.siltapp.com/v1/users";
const SILT_API_CREDENTIALS = [
  {
    appId: "dcf5c568-6de1-4459-a040-038fb762366f",
    token: "2aa4b90a-ba4f-43c0-9cee-b2ecb90201dc",
  },
  {
    appId: "01f41d6d-9d4b-4c21-bd06-3bfcef36573b",
    token: "40284c41-ded8-4f27-b8ca-512d66e94a60",
  },
  {
    appId: "fb3a7896-a7cb-49b2-81b9-c97e0e3c3016",
    token: "056b6161-130c-4632-8990-a50ecc4634f6",
  },
];

async function testFailedIds() {
  try {
    console.log("\n=================================================");
    console.log("  TESTING SAMPLE OF FAILED SILT IDs");
    console.log("=================================================\n");

    // Get 10 failed SILT IDs
    const query = `
      SELECT lvl.silt_id, u.email_user
      FROM sec_cust.lnk_users_verif_level lvl
      JOIN sec_cust.ms_sixmap_users u ON u.uuid_user = lvl.uuid_user
      WHERE lvl.silt_id IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 FROM sec_cust.lnk_users_extra_data ed
        WHERE ed.id_user = u.id_user
        AND ed.id_item = (SELECT id_item FROM sec_cust.ms_item WHERE name = 'silt_full_json')
      )
      LIMIT 10
    `;

    const result = await pool.query(query);
    console.log(`Testing ${result.rows.length} failed SILT IDs...\n`);

    let successCount = 0;
    let failCount = 0;

    for (const row of result.rows) {
      const { silt_id, email_user } = row;
      console.log(`Testing: ${email_user} (${silt_id})`);

      let success = false;
      for (const { appId, token } of SILT_API_CREDENTIALS) {
        try {
          const response = await axios.get(
            `${SILT_API_BASE_URL}/${silt_id}/status/`,
            {
              headers: {
                "X-Company-App-Id": appId,
                "X-Company-App-API-Token": token,
              },
              timeout: 10000,
            }
          );

          if (response.status === 200) {
            console.log(`  ✓ SUCCESS - Data available!\n`);
            success = true;
            successCount++;
            break;
          }
        } catch (error) {
          // Try next token
          continue;
        }
      }

      if (!success) {
        console.log(
          `  ✗ FAILED - All tokens rejected (account deleted/expired)\n`
        );
        failCount++;
      }

      // Wait 1 second between requests
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log("\n=================================================");
    console.log("TEST RESULTS:");
    console.log("=================================================");
    console.log(`Tested: ${result.rows.length} IDs`);
    console.log(
      `Success: ${successCount} (${(
        (successCount / result.rows.length) *
        100
      ).toFixed(1)}%)`
    );
    console.log(
      `Failed: ${failCount} (${((failCount / result.rows.length) * 100).toFixed(
        1
      )}%)`
    );

    console.log("\n\nRECOMMENDATION:");
    console.log("================");
    if (successCount === 0) {
      console.log("✗ All tested IDs are permanently gone from SILT.");
      console.log("  Retrying all 2,912 IDs will likely fail the same way.");
      console.log("  NOT RECOMMENDED to retry.");
    } else if (successCount < 3) {
      console.log(
        "⚠ Very few IDs are recoverable (~" +
          Math.round((successCount / result.rows.length) * 2912) +
          " out of 2,912)."
      );
      console.log("  Consider if it's worth the hours of processing time.");
    } else {
      console.log("✓ Some IDs are recoverable!");
      console.log("  Run: npm run fetch-silt");
      console.log("  to retry all failed IDs.");
    }

    console.log("\n=================================================\n");
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await pool.end();
  }
}

testFailedIds();
