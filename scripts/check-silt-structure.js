import pkg from "../src/db/pg.connection.js";
const { poolSM: pool } = pkg;

async function checkSiltData() {
  try {
    const result = await pool.query(
      `SELECT silt_data FROM sec_cust.lnk_external_silt_data 
       WHERE flow_name = 'Venezolanos.es' 
       LIMIT 1`
    );

    if (result.rows.length > 0) {
      console.log("=".repeat(80));
      console.log("SILT DATA STRUCTURE:");
      console.log("=".repeat(80));
      console.log(JSON.stringify(result.rows[0].silt_data, null, 2));
      console.log("=".repeat(80));
    } else {
      console.log("No records found");
    }

    await pool.end();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

checkSiltData();
