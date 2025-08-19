const { Pool } = require("pg");
const fs = require("fs");

// Database connections
const connectionDbSixmap = {
  user: "postgres",
  host: "18.222.5.211",
  database: "dev-cg",
  password: "CGDX11456.",
  port: 5432,
  max: 8,
  keepAlive: true,
};

const connectionDbCriptoremesa = {
  user: "postgres",
  host: "18.222.5.211",
  database: "dev-cg-aux",
  password: "CGDX11456.",
  port: 5432,
  max: 8,
  keepAlive: true,
};

class DatabaseQueryTool {
  constructor() {
    this.poolSM = new Pool(connectionDbSixmap);
    this.poolCR = new Pool(connectionDbCriptoremesa);
    this.analysisData = null;
    this.loadAnalysisData();
  }

  loadAnalysisData() {
    try {
      const data = fs.readFileSync(
        "./database-analysis/database-analysis.json",
        "utf8"
      );
      this.analysisData = JSON.parse(data);
      console.log("✅ Database analysis data loaded successfully");
    } catch (err) {
      console.log("⚠️  Could not load analysis data:", err.message);
    }
  }

  async findTables(searchTerm) {
    if (!this.analysisData) {
      console.log("❌ Analysis data not available");
      return;
    }

    console.log(`🔍 Searching for tables containing: "${searchTerm}"\n`);

    const results = [];

    for (const [dbName, dbInfo] of Object.entries(this.analysisData)) {
      for (const [tableName, tableInfo] of Object.entries(dbInfo.tables)) {
        if (tableName.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push({
            database: dbName,
            tableName: tableName,
            rowCount: tableInfo.rowCount,
            columns: tableInfo.columns.length,
          });
        }
      }
    }

    if (results.length === 0) {
      console.log("No tables found matching your search term.");
      return;
    }

    console.log("📋 Found tables:");
    results.forEach((table) => {
      console.log(
        `  • ${table.database}: ${
          table.tableName
        } (${table.rowCount.toLocaleString()} rows, ${table.columns} columns)`
      );
    });

    return results;
  }

  async findColumns(searchTerm) {
    if (!this.analysisData) {
      console.log("❌ Analysis data not available");
      return;
    }

    console.log(`🔍 Searching for columns containing: "${searchTerm}"\n`);

    const results = [];

    for (const [dbName, dbInfo] of Object.entries(this.analysisData)) {
      for (const [tableName, tableInfo] of Object.entries(dbInfo.tables)) {
        for (const column of tableInfo.columns) {
          if (
            column.column_name.toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            results.push({
              database: dbName,
              tableName: tableName,
              columnName: column.column_name,
              dataType: column.data_type,
              nullable: column.is_nullable,
            });
          }
        }
      }
    }

    if (results.length === 0) {
      console.log("No columns found matching your search term.");
      return;
    }

    console.log("📊 Found columns:");
    results.forEach((col) => {
      console.log(
        `  • ${col.database}: ${col.tableName}.${col.columnName} (${col.dataType})`
      );
    });

    return results;
  }

  async describeTable(tableName, dbName = "sixmap") {
    if (!this.analysisData) {
      console.log("❌ Analysis data not available");
      return;
    }

    const dbInfo = this.analysisData[dbName];
    if (!dbInfo) {
      console.log(`❌ Database "${dbName}" not found`);
      return;
    }

    const tableInfo = dbInfo.tables[tableName];
    if (!tableInfo) {
      console.log(`❌ Table "${tableName}" not found in ${dbName} database`);
      return;
    }

    console.log(`📋 Table: ${tableName}`);
    console.log(`📊 Database: ${dbName}`);
    console.log(`📈 Row Count: ${tableInfo.rowCount.toLocaleString()}`);
    console.log(
      `🔑 Primary Keys: ${tableInfo.primaryKeys.join(", ") || "None"}`
    );
    console.log(`🔗 Foreign Keys: ${tableInfo.foreignKeys.length}`);
    console.log(`📍 Indexes: ${tableInfo.indexes.length}`);

    console.log(`\n📊 Columns (${tableInfo.columns.length}):`);
    tableInfo.columns.forEach((col) => {
      const type = col.character_maximum_length
        ? `${col.data_type}(${col.character_maximum_length})`
        : col.numeric_precision
        ? `${col.data_type}(${col.numeric_precision})`
        : col.data_type;

      console.log(
        `  • ${col.column_name}: ${type} ${
          col.is_nullable === "NO" ? "(NOT NULL)" : ""
        }`
      );
    });

    if (tableInfo.foreignKeys.length > 0) {
      console.log(`\n🔗 Foreign Key Relationships:`);
      tableInfo.foreignKeys.forEach((fk) => {
        console.log(
          `  • ${fk.column_name} → ${fk.foreign_table_schema}.${fk.foreign_table_name}.${fk.foreign_column_name}`
        );
      });
    }

    return tableInfo;
  }

  async executeQuery(query, dbName = "sixmap", limit = 100) {
    const pool = dbName === "sixmap" ? this.poolSM : this.poolCR;

    try {
      console.log(`🔍 Executing query on ${dbName} database...`);
      console.log(`📝 Query: ${query}`);

      // Add LIMIT if not present and it's a SELECT query
      let finalQuery = query;
      if (
        query.trim().toLowerCase().startsWith("select") &&
        !query.toLowerCase().includes("limit")
      ) {
        finalQuery = `${query} LIMIT ${limit}`;
      }

      const start = Date.now();
      const result = await pool.query(finalQuery);
      const duration = Date.now() - start;

      console.log(`✅ Query executed in ${duration}ms`);
      console.log(`📊 Returned ${result.rows.length} rows\n`);

      if (result.rows.length > 0) {
        // Show column names
        console.log("📋 Columns:", Object.keys(result.rows[0]).join(", "));

        // Show first few rows
        const rowsToShow = Math.min(5, result.rows.length);
        console.log(`\n📈 First ${rowsToShow} rows:`);
        for (let i = 0; i < rowsToShow; i++) {
          console.log(`${i + 1}.`, JSON.stringify(result.rows[i], null, 2));
        }

        if (result.rows.length > rowsToShow) {
          console.log(`... and ${result.rows.length - rowsToShow} more rows`);
        }
      }

      return result.rows;
    } catch (error) {
      console.error("❌ Query error:", error.message);
      throw error;
    }
  }

  async getTableSample(tableName, dbName = "sixmap", sampleSize = 5) {
    const pool = dbName === "sixmap" ? this.poolSM : this.poolCR;

    try {
      console.log(`📊 Getting sample data from ${tableName}...`);

      const query = `SELECT * FROM ${tableName} LIMIT ${sampleSize}`;
      const result = await pool.query(query);

      console.log(`✅ Sample data from ${tableName}:`);
      console.log(`📊 ${result.rows.length} sample rows\n`);

      if (result.rows.length > 0) {
        result.rows.forEach((row, index) => {
          console.log(`${index + 1}.`, JSON.stringify(row, null, 2));
          console.log("---");
        });
      }

      return result.rows;
    } catch (error) {
      console.error("❌ Sample query error:", error.message);
      throw error;
    }
  }

  async analyzeTableRelationships(tableName, dbName = "sixmap") {
    if (!this.analysisData) {
      console.log("❌ Analysis data not available");
      return;
    }

    const dbInfo = this.analysisData[dbName];
    const tableInfo = dbInfo.tables[tableName];

    if (!tableInfo) {
      console.log(`❌ Table "${tableName}" not found`);
      return;
    }

    console.log(`🔗 Relationship Analysis for: ${tableName}\n`);

    // Tables this table references
    if (tableInfo.foreignKeys.length > 0) {
      console.log("🔗 This table references:");
      tableInfo.foreignKeys.forEach((fk) => {
        const refTable = `${fk.foreign_table_schema}.${fk.foreign_table_name}`;
        console.log(
          `  • ${fk.column_name} → ${refTable}.${fk.foreign_column_name}`
        );
      });
      console.log("");
    }

    // Tables that reference this table
    const referencedBy = [];
    for (const [otherTableName, otherTableInfo] of Object.entries(
      dbInfo.tables
    )) {
      for (const fk of otherTableInfo.foreignKeys) {
        const refTable = `${fk.foreign_table_schema}.${fk.foreign_table_name}`;
        if (refTable === tableName) {
          referencedBy.push({
            table: otherTableName,
            column: fk.column_name,
            referencesColumn: fk.foreign_column_name,
          });
        }
      }
    }

    if (referencedBy.length > 0) {
      console.log("🔙 Tables that reference this table:");
      referencedBy.forEach((ref) => {
        console.log(`  • ${ref.table}.${ref.column} → ${ref.referencesColumn}`);
      });
    }

    return { foreignKeys: tableInfo.foreignKeys, referencedBy };
  }

  async close() {
    await this.poolSM.end();
    await this.poolCR.end();
    console.log("🔒 Database connections closed");
  }
}

module.exports = DatabaseQueryTool;

// Example usage if run directly
if (require.main === module) {
  const tool = new DatabaseQueryTool();

  console.log(`
🎯 Database Analysis Tool Ready!

Available Commands:
- tool.findTables('search_term') - Find tables by name
- tool.findColumns('search_term') - Find columns by name  
- tool.describeTable('table_name', 'db_name') - Get table details
- tool.executeQuery('SQL query', 'db_name') - Execute custom query
- tool.getTableSample('table_name', 'db_name', 5) - Get sample data
- tool.analyzeTableRelationships('table_name', 'db_name') - Show relationships

Databases available: 'sixmap' (253 tables), 'criptoremesa' (5 tables)

Example:
tool.findTables('user')
tool.describeTable('sec_cust.ms_sixmap_users', 'sixmap')
tool.executeQuery('SELECT * FROM sec_cust.ms_currencies', 'sixmap')
  `);
}
