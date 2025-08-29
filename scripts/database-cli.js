const DatabaseQueryTool = require("./database-query-tool");
const readline = require("readline");

class InteractiveDatabaseCLI {
  constructor() {
    this.tool = new DatabaseQueryTool();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.currentDB = "sixmap";
  }

  async start() {
    console.log(`
🎯 Interactive Database Analysis CLI
====================================

Your databases have been analyzed:
📊 Sixmap: 253 tables with 8.4M+ rows
📊 Criptoremesa: 5 tables with 122 rows

Current database: ${this.currentDB}

Commands:
  help                          - Show all commands
  switch [db]                   - Switch database (sixmap/criptoremesa)
  tables [search]               - Find tables (optional search term)
  columns [search]              - Find columns (optional search term)
  describe <table>              - Describe table structure
  sample <table> [rows]         - Show sample data (default 5 rows)
  query <sql>                   - Execute SQL query
  relationships <table>         - Show table relationships  
  stats                         - Show database statistics
  largest                       - Show largest tables
  schemas                       - Show all schemas
  quit/exit                     - Exit CLI

Type a command to start exploring your database!
    `);

    this.promptUser();
  }

  promptUser() {
    this.rl.question(`\n[${this.currentDB}]> `, async (input) => {
      const trimmed = input.trim();

      if (!trimmed) {
        this.promptUser();
        return;
      }

      await this.processCommand(trimmed);
      this.promptUser();
    });
  }

  async processCommand(input) {
    const parts = input.split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    try {
      switch (command) {
        case "help":
          this.showHelp();
          break;

        case "switch":
          this.switchDatabase(args[0]);
          break;

        case "tables":
          if (args.length > 0) {
            await this.tool.findTables(args.join(" "));
          } else {
            this.showAllTables();
          }
          break;

        case "columns":
          if (args.length > 0) {
            await this.tool.findColumns(args.join(" "));
          } else {
            console.log("❌ Please provide a search term for columns");
          }
          break;

        case "describe":
          if (args.length > 0) {
            await this.tool.describeTable(args.join(" "), this.currentDB);
          } else {
            console.log("❌ Please provide a table name");
          }
          break;

        case "sample":
          if (args.length > 0) {
            const tableName = args[0];
            const sampleSize = args[1] ? parseInt(args[1]) : 5;
            await this.tool.getTableSample(
              tableName,
              this.currentDB,
              sampleSize
            );
          } else {
            console.log("❌ Please provide a table name");
          }
          break;

        case "query":
          if (args.length > 0) {
            const query = args.join(" ");
            await this.tool.executeQuery(query, this.currentDB);
          } else {
            console.log("❌ Please provide a SQL query");
          }
          break;

        case "relationships":
          if (args.length > 0) {
            await this.tool.analyzeTableRelationships(
              args.join(" "),
              this.currentDB
            );
          } else {
            console.log("❌ Please provide a table name");
          }
          break;

        case "stats":
          this.showStats();
          break;

        case "largest":
          this.showLargestTables();
          break;

        case "schemas":
          this.showSchemas();
          break;

        case "quit":
        case "exit":
          await this.tool.close();
          this.rl.close();
          console.log("👋 Goodbye!");
          process.exit(0);

        default:
          console.log(
            `❌ Unknown command: ${command}. Type 'help' for available commands.`
          );
          break;
      }
    } catch (error) {
      console.error("❌ Error executing command:", error.message);
    }
  }

  showHelp() {
    console.log(`
📖 Available Commands:
======================

Database Management:
  switch <db>                   - Switch between 'sixmap' and 'criptoremesa'
  stats                         - Show database overview statistics
  schemas                       - List all database schemas

Table Discovery:
  tables                        - Show all tables in current database
  tables <search>               - Find tables containing search term
  largest                       - Show tables with most rows

Column Discovery:
  columns <search>              - Find columns containing search term

Table Analysis:
  describe <table>              - Show table structure and details
  sample <table> [rows]         - Show sample data (default 5 rows)
  relationships <table>         - Show foreign key relationships

Query Execution:
  query <sql>                   - Execute custom SQL query

System:
  help                          - Show this help message
  quit/exit                     - Close connections and exit

Examples:
  tables user                   - Find tables with 'user' in name
  describe sec_cust.ms_sixmap_users
  sample sec_cust.ms_currencies 10
  query SELECT * FROM sec_cust.ms_currencies LIMIT 5
  columns email                 - Find columns with 'email' in name
    `);
  }

  switchDatabase(dbName) {
    if (dbName === "sixmap" || dbName === "criptoremesa") {
      this.currentDB = dbName;
      console.log(`✅ Switched to ${dbName} database`);
    } else {
      console.log('❌ Invalid database. Use "sixmap" or "criptoremesa"');
    }
  }

  showAllTables() {
    if (!this.tool.analysisData) {
      console.log("❌ Analysis data not available");
      return;
    }

    const dbInfo = this.tool.analysisData[this.currentDB];
    const tables = Object.keys(dbInfo.tables).sort();

    console.log(
      `📋 All tables in ${this.currentDB} database (${tables.length}):\n`
    );

    // Group by schema
    const schemas = {};
    tables.forEach((table) => {
      const [schema, tableName] = table.split(".");
      if (!schemas[schema]) schemas[schema] = [];
      schemas[schema].push({
        name: table,
        count: dbInfo.tables[table].rowCount,
      });
    });

    Object.keys(schemas)
      .sort()
      .forEach((schema) => {
        console.log(`📂 ${schema}:`);
        schemas[schema].forEach((table) => {
          console.log(
            `  • ${table.name} (${table.count.toLocaleString()} rows)`
          );
        });
        console.log("");
      });
  }

  showStats() {
    if (!this.tool.analysisData) {
      console.log("❌ Analysis data not available");
      return;
    }

    const dbInfo = this.tool.analysisData[this.currentDB];
    const totalRows = Object.values(dbInfo.tables).reduce(
      (sum, table) => sum + (table.rowCount || 0),
      0
    );
    const totalColumns = Object.values(dbInfo.tables).reduce(
      (sum, table) => sum + table.columns.length,
      0
    );

    console.log(`📊 Statistics for ${this.currentDB} database:`);
    console.log(`  • Tables: ${dbInfo.totalTables}`);
    console.log(
      `  • Schemas: ${dbInfo.schemas.length} (${dbInfo.schemas.join(", ")})`
    );
    console.log(`  • Total Rows: ${totalRows.toLocaleString()}`);
    console.log(`  • Total Columns: ${totalColumns.toLocaleString()}`);
    console.log(
      `  • Avg Columns per Table: ${Math.round(
        totalColumns / dbInfo.totalTables
      )}`
    );
    console.log(
      `  • Avg Rows per Table: ${Math.round(
        totalRows / dbInfo.totalTables
      ).toLocaleString()}`
    );
  }

  showLargestTables() {
    if (!this.tool.analysisData) {
      console.log("❌ Analysis data not available");
      return;
    }

    const dbInfo = this.tool.analysisData[this.currentDB];
    const tables = Object.entries(dbInfo.tables)
      .sort(([, a], [, b]) => (b.rowCount || 0) - (a.rowCount || 0))
      .slice(0, 15);

    console.log(`📈 Largest tables in ${this.currentDB} database:\n`);
    tables.forEach(([tableName, tableInfo], index) => {
      console.log(
        `${index + 1}. ${tableName}: ${(
          tableInfo.rowCount || 0
        ).toLocaleString()} rows`
      );
    });
  }

  showSchemas() {
    if (!this.tool.analysisData) {
      console.log("❌ Analysis data not available");
      return;
    }

    const dbInfo = this.tool.analysisData[this.currentDB];
    console.log(`📂 Schemas in ${this.currentDB} database:\n`);

    dbInfo.schemas.forEach((schema) => {
      const schemaTables = Object.keys(dbInfo.tables).filter((table) =>
        table.startsWith(schema + ".")
      );
      const schemaRows = schemaTables.reduce(
        (sum, table) => sum + (dbInfo.tables[table].rowCount || 0),
        0
      );

      console.log(
        `  • ${schema}: ${
          schemaTables.length
        } tables, ${schemaRows.toLocaleString()} rows`
      );
    });
  }
}

// Start the CLI
const cli = new InteractiveDatabaseCLI();
cli.start().catch(console.error);
