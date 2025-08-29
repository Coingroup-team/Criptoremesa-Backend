const DatabaseQueryTool = require("./database-query-tool");
const tool = new DatabaseQueryTool();

async function getFunctionDefinition() {
  try {
    const query = `
      SELECT 
        p.proname as function_name,
        pg_get_functiondef(p.oid) as function_definition
      FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE n.nspname = 'prc_mng'
        AND p.proname = 'sp_lnk_cr_remittances_complete'
    `;

    const result = await tool.executeQuery(query, "sixmap");

    if (result && result.length > 0) {
      console.log("=== CURRENT FUNCTION DEFINITION ===");
      console.log(result[0].function_definition);
    } else {
      console.log("Function not found");
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    process.exit(0);
  }
}

getFunctionDefinition();
