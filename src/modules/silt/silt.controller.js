import pool from "../../db/pg.connection";

/**
 * Get all SILT records with pagination
 */
export const getSiltRecords = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Get total count
    const countQuery = `
      SELECT COUNT(DISTINCT ulv.silt_id) as total
      FROM sec_cust.lnk_users_verif_level ulv
      LEFT JOIN sec_cust.lnk_users_extra_data ued 
        ON ued.uuid_user = ulv.uuid_user 
        AND ued.ms_item_id = (SELECT id FROM public.ms_item WHERE name = 'silt_full_json')
      WHERE ulv.silt_id IS NOT NULL 
        AND ued.json_value IS NOT NULL
    `;

    const countResult = await pool.query(countQuery);
    const total = parseInt(countResult.rows[0].total);

    // Get paginated records
    const dataQuery = `
      SELECT 
        ulv.silt_id,
        u.email_user,
        ued.json_value as silt_data,
        ued.date_entry as fetch_date
      FROM sec_cust.lnk_users_verif_level ulv
      LEFT JOIN sec_cust.lnk_users_extra_data ued 
        ON ued.uuid_user = ulv.uuid_user 
        AND ued.ms_item_id = (SELECT id FROM public.ms_item WHERE name = 'silt_full_json')
      LEFT JOIN sec_cust.users u ON u.uuid = ulv.uuid_user
      WHERE ulv.silt_id IS NOT NULL 
        AND ued.json_value IS NOT NULL
      ORDER BY ued.date_entry DESC
      LIMIT $1 OFFSET $2
    `;

    const dataResult = await pool.query(dataQuery, [limit, offset]);

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

    const query = `
      SELECT 
        ulv.silt_id,
        u.email_user,
        u.uuid as user_uuid,
        ued.json_value as silt_data,
        ued.date_entry as fetch_date
      FROM sec_cust.lnk_users_verif_level ulv
      LEFT JOIN sec_cust.lnk_users_extra_data ued 
        ON ued.uuid_user = ulv.uuid_user 
        AND ued.ms_item_id = (SELECT id FROM public.ms_item WHERE name = 'silt_full_json')
      LEFT JOIN sec_cust.users u ON u.uuid = ulv.uuid_user
      WHERE ulv.silt_id = $1
        AND ued.json_value IS NOT NULL
    `;

    const result = await pool.query(query, [silt_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "SILT record not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
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
