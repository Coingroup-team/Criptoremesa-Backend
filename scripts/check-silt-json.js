import pg from "pg";
const { Pool } = pg;

const poolSM = new Pool({
  host: process.env.SIXMAP_DB_HOST,
  port: process.env.SIXMAP_DB_PORT,
  database: process.env.SIXMAP_DB_DATABASE,
  user: process.env.SIXMAP_DB_USER,
  password: process.env.SIXMAP_DB_PASSWORD,
});

async function checkSiltJson() {
  try {
    const siltId = "9e7edf99-9c6d-4924-aff7-f7542edae5e6";

    const result = await poolSM.query(
      `
      SELECT ued.value 
      FROM sec_cust.lnk_users_verif_level ulv 
      INNER JOIN sec_cust.ms_sixmap_users u ON u.uuid_user = ulv.uuid_user 
      LEFT JOIN sec_cust.lnk_users_extra_data ued 
        ON ued.id_user = u.id_user 
        AND ued.id_item = (SELECT id_item FROM sec_cust.ms_item WHERE name = 'silt_full_json') 
      WHERE ulv.silt_id = $1 
      LIMIT 1
    `,
      [siltId]
    );

    if (result.rows[0]) {
      const data = JSON.parse(result.rows[0].value);
      console.log("Full JSON structure:");
      console.log(JSON.stringify(data, null, 2));
      console.log("\n\nChecking for images in different paths:");
      console.log("data.verification_images:", data.verification_images);
      console.log(
        "data.data.verification_images:",
        data.data?.verification_images
      );
      console.log("data.data.images:", data.data?.images);
    } else {
      console.log("No data found for this SILT ID");
    }

    await poolSM.end();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkSiltJson();
