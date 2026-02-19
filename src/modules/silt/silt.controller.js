import { poolSM } from "../../db/pg.connection";
import fs from "fs";
import path from "path";

/**
 * Get all SILT records with pagination
 */
export const getSiltRecords = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const siltIdFilter = req.query.silt_id || "";
    const flowFilter = req.query.flow_name || ""; // New flow filter parameter

    // Build WHERE clause for flow filtering
    const flowCondition =
      flowFilter && flowFilter !== "All Flows"
        ? `AND flow_name = '${flowFilter}'`
        : "";

    // Get total count from both tables
    const countQuery = `
      SELECT COUNT(*) as total FROM (
        SELECT ulv.silt_id as identifier, 'Bithonor' as flow_name
        FROM sec_cust.lnk_users_verif_level ulv
        INNER JOIN sec_cust.ms_sixmap_users u ON u.uuid_user = ulv.uuid_user
        LEFT JOIN sec_cust.lnk_users_extra_data ued 
          ON ued.id_user = u.id_user 
          AND ued.id_item = (SELECT id_item FROM sec_cust.ms_item WHERE name = 'silt_full_json')
        WHERE ulv.silt_id IS NOT NULL 
          AND ued.value IS NOT NULL
          ${siltIdFilter ? `AND ulv.silt_id ILIKE '%${siltIdFilter}%'` : ""}
          ${
            flowFilter === "Bithonor" ||
            !flowFilter ||
            flowFilter === "All Flows"
              ? ""
              : "AND 1=0"
          }
        
        UNION ALL
        
        SELECT esd.public_id::text as identifier, esd.flow_name
        FROM sec_cust.lnk_external_silt_data esd
        WHERE esd.active = TRUE
          ${
            siltIdFilter
              ? `AND esd.public_id::text ILIKE '%${siltIdFilter}%'`
              : ""
          }
          ${
            flowFilter &&
            flowFilter !== "All Flows" &&
            flowFilter !== "Bithonor"
              ? `AND esd.flow_name = '${flowFilter}'`
              : ""
          }
          ${flowFilter === "Bithonor" ? "AND 1=0" : ""}
      ) combined
    `;

    const countResult = await poolSM.query(countQuery);
    const total = parseInt(countResult.rows[0].total);

    // Get paginated records from both tables
    const dataQuery = `
      SELECT * FROM (
        SELECT 
          ulv.silt_id as identifier,
          'Bithonor' as flow_name,
          u.email_user,
          ued.value as silt_data,
          ulv.date_creation as fetch_date
        FROM sec_cust.lnk_users_verif_level ulv
        INNER JOIN sec_cust.ms_sixmap_users u ON u.uuid_user = ulv.uuid_user
        LEFT JOIN sec_cust.lnk_users_extra_data ued 
          ON ued.id_user = u.id_user 
          AND ued.id_item = (SELECT id_item FROM sec_cust.ms_item WHERE name = 'silt_full_json')
        WHERE ulv.silt_id IS NOT NULL 
          AND ued.value IS NOT NULL
          ${siltIdFilter ? `AND ulv.silt_id ILIKE '%${siltIdFilter}%'` : ""}
          ${
            flowFilter === "Bithonor" ||
            !flowFilter ||
            flowFilter === "All Flows"
              ? ""
              : "AND 1=0"
          }
        
        UNION ALL
        
        SELECT 
          esd.public_id::text as identifier,
          esd.flow_name,
          NULL as email_user,
          esd.silt_data::text as silt_data,
          esd.date_creation as fetch_date
        FROM sec_cust.lnk_external_silt_data esd
        WHERE esd.active = TRUE
          ${
            siltIdFilter
              ? `AND esd.public_id::text ILIKE '%${siltIdFilter}%'`
              : ""
          }
          ${
            flowFilter &&
            flowFilter !== "All Flows" &&
            flowFilter !== "Bithonor"
              ? `AND esd.flow_name = '${flowFilter}'`
              : ""
          }
          ${flowFilter === "Bithonor" ? "AND 1=0" : ""}
      ) combined
      ORDER BY fetch_date DESC
      LIMIT $1 OFFSET $2
    `;

    const dataResult = await poolSM.query(dataQuery, [limit, offset]);

    res.json({
      success: true,
      data: dataResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching SILT records:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching SILT records",
      error: error.message,
    });
  }
};

/**
 * Get single SILT record by ID
 */
export const getSiltById = async (req, res) => {
  try {
    const { silt_id } = req.params;

    // Try to find in internal table first (Bithonor)
    const internalQuery = `
      SELECT 
        ulv.silt_id as identifier,
        'Bithonor' as flow_name,
        u.email_user,
        u.uuid_user as user_uuid,
        ued.value as silt_data,
        ulv.date_creation as fetch_date
      FROM sec_cust.lnk_users_verif_level ulv
      INNER JOIN sec_cust.ms_sixmap_users u ON u.uuid_user = ulv.uuid_user
      LEFT JOIN sec_cust.lnk_users_extra_data ued 
        ON ued.id_user = u.id_user 
        AND ued.id_item = (SELECT id_item FROM sec_cust.ms_item WHERE name = 'silt_full_json')
      WHERE ulv.silt_id = $1
        AND ued.value IS NOT NULL
    `;

    let result = await poolSM.query(internalQuery, [silt_id]);
    let isExternal = false;

    // If not found, try external table
    if (result.rows.length === 0) {
      const externalQuery = `
        SELECT 
          esd.public_id::text as identifier,
          esd.flow_name,
          NULL as email_user,
          NULL as user_uuid,
          esd.silt_data::text as silt_data,
          esd.date_creation as fetch_date
        FROM sec_cust.lnk_external_silt_data esd
        WHERE esd.public_id::text = $1
          AND esd.active = TRUE
      `;

      result = await poolSM.query(externalQuery, [silt_id]);
      isExternal = true;
    }

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "SILT record not found",
      });
    }

    // Get images from filesystem directory
    const record = result.rows[0];
    const imageDir = isExternal
      ? `/repo-cr/external-silt-data/${record.flow_name}/${silt_id}`
      : `/repo-cr/silt-data/${silt_id}`;
    let images = [];

    try {
      if (fs.existsSync(imageDir)) {
        const files = fs.readdirSync(imageDir);
        images = files
          .filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
          .map((file) => ({
            img_name: file,
            img_type: file.split("_")[1]?.split("-")[0] || "UNKNOWN",
            img_storage_path: `/silt/${silt_id}/image/${file}`,
          }));
        console.log(`Found ${images.length} images in ${imageDir}`);
      } else {
        console.log(`Directory not found: ${imageDir}`);
      }
    } catch (error) {
      console.error(
        `Error reading image directory for ${silt_id}:`,
        error.message
      );
    }

    // Parse silt_data for display
    try {
      record.silt_data =
        typeof record.silt_data === "string"
          ? JSON.parse(record.silt_data)
          : record.silt_data;
    } catch (parseError) {
      console.error("Error parsing SILT data:", parseError);
    }

    record.images = images;

    res.json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.error("Error fetching SILT record:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching SILT record",
      error: error.message,
    });
  }
};

// Get SILT image file
export const getSiltImage = async (req, res) => {
  try {
    const { silt_id, filename } = req.params;
    const flow_name = req.query.flow_name; // Optional flow name for external images

    // Determine image path based on whether it's internal or external
    let imagePath;
    if (flow_name && flow_name !== "Bithonor") {
      // External SILT data
      imagePath = path.join(
        "/repo-cr/external-silt-data",
        flow_name,
        silt_id,
        filename
      );
    } else {
      // Internal Bithonor data
      imagePath = path.join("/repo-cr/silt-data", silt_id, filename);
    }

    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    res.sendFile(imagePath);
  } catch (error) {
    console.error("Error serving image:", error);
    res.status(500).json({
      success: false,
      message: "Error serving image",
      error: error.message,
    });
  }
};
