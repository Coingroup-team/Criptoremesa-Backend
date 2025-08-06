const DatabaseQueryTool = require("./database-query-tool");
const fs = require("fs");

class BusinessLogicQueryTool extends DatabaseQueryTool {
  constructor() {
    super();
    this.businessLogicData = null;
    this.loadBusinessLogicData();
  }

  loadBusinessLogicData() {
    try {
      const data = fs.readFileSync(
        "./database-comprehensive-analysis/comprehensive-database-analysis.json",
        "utf8"
      );
      this.businessLogicData = JSON.parse(data);
      console.log("✅ Business logic analysis data loaded successfully");
      console.log(
        `📊 Loaded: ${
          Object.keys(this.businessLogicData.sixmap.functions).length
        } functions, ${
          Object.keys(this.businessLogicData.sixmap.views).length
        } views, ${
          Object.keys(this.businessLogicData.sixmap.triggers).length
        } triggers`
      );
    } catch (err) {
      console.log("⚠️  Could not load business logic data:", err.message);
    }
  }

  async findFunctions(searchTerm) {
    if (!this.businessLogicData) {
      console.log("❌ Business logic data not available");
      return;
    }

    console.log(`🔍 Searching for functions containing: "${searchTerm}"\n`);

    const results = [];

    for (const [dbName, dbInfo] of Object.entries(this.businessLogicData)) {
      for (const [functionName, functionInfo] of Object.entries(
        dbInfo.functions || {}
      )) {
        if (
          functionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (functionInfo.definition &&
            functionInfo.definition
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
        ) {
          results.push({
            database: dbName,
            functionName: functionName,
            type: functionInfo.type,
            language: functionInfo.language,
            arguments: functionInfo.arguments,
            returnType: functionInfo.returnType,
            description: functionInfo.description,
          });
        }
      }
    }

    if (results.length === 0) {
      console.log("No functions found matching your search term.");
      return;
    }

    console.log("📝 Found functions:");
    results.forEach((func) => {
      console.log(`  • ${func.database}: ${func.functionName}`);
      console.log(`    Type: ${func.type}, Language: ${func.language}`);
      console.log(`    Args: ${func.arguments || "none"}`);
      console.log(`    Returns: ${func.returnType || "void"}`);
      if (func.description) console.log(`    Description: ${func.description}`);
      console.log("");
    });

    return results;
  }

  async describeFunctionLogic(functionName, dbName = "sixmap") {
    if (!this.businessLogicData) {
      console.log("❌ Business logic data not available");
      return;
    }

    const dbInfo = this.businessLogicData[dbName];
    if (!dbInfo) {
      console.log(`❌ Database "${dbName}" not found`);
      return;
    }

    const functionInfo = dbInfo.functions[functionName];
    if (!functionInfo) {
      console.log(
        `❌ Function "${functionName}" not found in ${dbName} database`
      );
      console.log("Available functions:");
      Object.keys(dbInfo.functions)
        .filter((f) => f.includes(functionName.split(".").pop()))
        .forEach((f) => {
          console.log(`  • ${f}`);
        });
      return;
    }

    console.log(`📝 Function: ${functionName}`);
    console.log(`📊 Database: ${dbName}`);
    console.log(`🔧 Type: ${functionInfo.type}`);
    console.log(`💻 Language: ${functionInfo.language}`);
    console.log(`📥 Arguments: ${functionInfo.arguments || "none"}`);
    console.log(`📤 Returns: ${functionInfo.returnType || "void"}`);
    console.log(`⚡ Volatility: ${functionInfo.volatility}`);

    if (functionInfo.description) {
      console.log(`📄 Description: ${functionInfo.description}`);
    }

    console.log(`\n💡 Function Definition:`);
    console.log("═".repeat(80));
    console.log(functionInfo.definition || "Definition not available");
    console.log("═".repeat(80));

    return functionInfo;
  }

  async findViews(searchTerm) {
    if (!this.businessLogicData) {
      console.log("❌ Business logic data not available");
      return;
    }

    console.log(`🔍 Searching for views containing: "${searchTerm}"\n`);

    const results = [];

    for (const [dbName, dbInfo] of Object.entries(this.businessLogicData)) {
      for (const [viewName, viewInfo] of Object.entries(dbInfo.views || {})) {
        if (
          viewName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (viewInfo.definition &&
            viewInfo.definition
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
        ) {
          results.push({
            database: dbName,
            viewName: viewName,
            comment: viewInfo.comment,
            columnCount: viewInfo.columns ? viewInfo.columns.length : 0,
          });
        }
      }
    }

    if (results.length === 0) {
      console.log("No views found matching your search term.");
      return;
    }

    console.log("👁️  Found views:");
    results.forEach((view) => {
      console.log(
        `  • ${view.database}: ${view.viewName} (${view.columnCount} columns)`
      );
      if (view.comment) console.log(`    Description: ${view.comment}`);
      console.log("");
    });

    return results;
  }

  async describeViewLogic(viewName, dbName = "sixmap") {
    if (!this.businessLogicData) {
      console.log("❌ Business logic data not available");
      return;
    }

    const dbInfo = this.businessLogicData[dbName];
    const viewInfo = dbInfo.views[viewName];

    if (!viewInfo) {
      console.log(`❌ View "${viewName}" not found`);
      return;
    }

    console.log(`👁️  View: ${viewName}`);
    console.log(`📊 Database: ${dbName}`);
    if (viewInfo.comment) {
      console.log(`📄 Description: ${viewInfo.comment}`);
    }

    console.log(`📊 Columns (${viewInfo.columns.length}):`);
    viewInfo.columns.forEach((col) => {
      console.log(`  • ${col.column_name}: ${col.data_type}`);
    });

    console.log(`\n💡 View Definition:`);
    console.log("═".repeat(80));
    console.log(viewInfo.definition);
    console.log("═".repeat(80));

    return viewInfo;
  }

  async findTriggers(searchTerm) {
    if (!this.businessLogicData) {
      console.log("❌ Business logic data not available");
      return;
    }

    console.log(`🔍 Searching for triggers containing: "${searchTerm}"\n`);

    const results = [];

    for (const [dbName, dbInfo] of Object.entries(this.businessLogicData)) {
      for (const [triggerKey, triggerInfo] of Object.entries(
        dbInfo.triggers || {}
      )) {
        if (
          triggerKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
          triggerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (triggerInfo.statement &&
            triggerInfo.statement
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
        ) {
          results.push({
            database: dbName,
            triggerName: triggerInfo.name,
            table: triggerInfo.table,
            event: triggerInfo.event,
            timing: triggerInfo.timing,
            statement: triggerInfo.statement,
          });
        }
      }
    }

    if (results.length === 0) {
      console.log("No triggers found matching your search term.");
      return;
    }

    console.log("⚡ Found triggers:");
    results.forEach((trigger) => {
      console.log(`  • ${trigger.database}: ${trigger.triggerName}`);
      console.log(`    Table: ${trigger.table}`);
      console.log(`    Event: ${trigger.timing} ${trigger.event}`);
      console.log(`    Statement: ${trigger.statement}`);
      console.log("");
    });

    return results;
  }

  async analyzeBusinessWorkflow(workflowTerm) {
    console.log(`🔍 Analyzing business workflow for: "${workflowTerm}"\n`);

    // Find related functions
    console.log("📝 Related Functions:");
    await this.findFunctions(workflowTerm);

    console.log("\n👁️  Related Views:");
    await this.findViews(workflowTerm);

    console.log("\n⚡ Related Triggers:");
    await this.findTriggers(workflowTerm);

    console.log("\n📋 Related Tables:");
    await this.findTables(workflowTerm);
  }

  async explainBusinessProcess(processName) {
    console.log(`🎯 BUSINESS PROCESS ANALYSIS: ${processName.toUpperCase()}\n`);

    const commonProcesses = {
      remittance: ["remit", "transfer", "send", "beneficiary"],
      exchange: ["exchange", "rate", "buy", "sell", "trade"],
      user: ["user", "customer", "profile", "account"],
      verification: ["verif", "kyc", "document", "identity"],
      payment: ["payment", "pay", "transaction", "balance"],
      notification: ["notif", "message", "alert", "email"],
      audit: ["log", "audit", "track", "history"],
    };

    const searchTerms = commonProcesses[processName.toLowerCase()] || [
      processName,
    ];

    for (const term of searchTerms) {
      console.log(`🔍 Searching for: "${term}"`);
      await this.analyzeBusinessWorkflow(term);
      console.log("\n" + "═".repeat(100) + "\n");
    }
  }

  showAvailableBusinessProcesses() {
    console.log(`
🎯 Available Business Process Analysis Commands:
==============================================

Business Logic Discovery:
  findFunctions('search_term')          - Find PL/pgSQL functions
  describeFunctionLogic('function_name') - Show function code & logic
  findViews('search_term')              - Find business views
  describeViewLogic('view_name')        - Show view definition
  findTriggers('search_term')           - Find triggers
  
Workflow Analysis:
  analyzeBusinessWorkflow('process')    - Complete workflow analysis
  explainBusinessProcess('remittance')  - Explain remittance process
  explainBusinessProcess('exchange')    - Explain exchange process
  explainBusinessProcess('verification') - Explain KYC process
  explainBusinessProcess('payment')     - Explain payment process
  
Examples:
  findFunctions('remittance')           - Find remittance functions
  describeFunctionLogic('prc_mng.validate_exchange_amount')
  explainBusinessProcess('remittance')  - Complete remittance analysis
    `);
  }
}

module.exports = BusinessLogicQueryTool;

// Example usage if run directly
if (require.main === module) {
  const tool = new BusinessLogicQueryTool();

  console.log(`
🎯 Business Logic Query Tool Ready!
==================================

Your business logic is now fully analyzed:
📊 Sixmap: 804 functions, 49 views, 5,418 triggers
📊 Criptoremesa: 65 functions

I can now answer questions about:
✅ Business rules and workflows
✅ Function implementations  
✅ Data transformations
✅ Automated processes (triggers)
✅ Business calculations
✅ Validation logic

Type: tool.showAvailableBusinessProcesses() for all commands
  `);
}
