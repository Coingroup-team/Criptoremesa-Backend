// Query actual database for SILT function definitions
require("dotenv").config();
const { Pool } = require("pg");

const poolSM = new Pool({
  user: process.env.PG_DB_SM_USER,
  host: process.env.PG_DB_SM_HOST,
  database: process.env.PG_DB_SM_NAME,
  password: process.env.PG_DB_SM_PASSWORD,
  port: process.env.PG_DB_SM_PORT,
  ssl: false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

async function getFunctionDefinitions() {
  try {
    console.log("\n=== LISTING ALL sp_request_level_one_silt VERSIONS ===\n");

    const listBase = await poolSM.query(`
      SELECT 
        p.proname,
        p.pronargs as param_count,
        pg_get_function_arguments(p.oid) as arguments,
        p.oid
      FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE n.nspname = 'sec_cust'
      AND p.proname = 'sp_request_level_one_silt'
      ORDER BY p.pronargs
    `);

    console.log(
      "Found",
      listBase.rows.length,
      "version(s) of sp_request_level_one_silt:"
    );
    listBase.rows.forEach((row, i) => {
      console.log(
        `\n--- Version ${i + 1}: ${row.param_count} parameters (OID: ${
          row.oid
        }) ---`
      );
      console.log(row.arguments);
    });

    console.log(
      "\n\n=== LISTING ALL sp_request_level_one_silt_enhanced VERSIONS ===\n"
    );

    const listEnhanced = await poolSM.query(`
      SELECT 
        p.proname,
        p.pronargs as param_count,
        pg_get_function_arguments(p.oid) as arguments,
        p.oid
      FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE n.nspname = 'sec_cust'
      AND p.proname = 'sp_request_level_one_silt_enhanced'
      ORDER BY p.pronargs
    `);

    console.log(
      "Found",
      listEnhanced.rows.length,
      "version(s) of sp_request_level_one_silt_enhanced:"
    );
    listEnhanced.rows.forEach((row, i) => {
      console.log(
        `\n--- Version ${i + 1}: ${row.param_count} parameters (OID: ${
          row.oid
        }) ---`
      );
      console.log(row.arguments);
    });

    // Now get full definitions of all versions
    console.log("\n\n=== GETTING ALL FUNCTION DEFINITIONS ===\n");

    const allFuncs = await poolSM.query(`
      SELECT 
        p.proname,
        p.pronargs,
        pg_get_functiondef(p.oid) as definition
      FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE n.nspname = 'sec_cust'
      AND (p.proname = 'sp_request_level_one_silt' OR p.proname = 'sp_request_level_one_silt_enhanced')
      ORDER BY p.proname, p.pronargs
    `);

    allFuncs.rows.forEach((row) => {
      console.log(`\n${"=".repeat(80)}`);
      console.log(`FUNCTION: ${row.proname} (${row.pronargs} parameters)`);
      console.log("=".repeat(80));
      console.log(row.definition);
    });

    await poolSM.end();
    process.exit(0);
  } catch (error) {
    console.error("Error querying database:", error);
    process.exit(1);
  }
}

getFunctionDefinitions();
