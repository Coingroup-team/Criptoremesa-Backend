const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

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

class DatabaseAnalyzer {
  constructor() {
    this.analysisResults = {
      sixmap: {},
      criptoremesa: {},
    };
  }

  async analyzeDatabaseSchema(pool, dbName) {
    console.log(`📊 Analyzing ${dbName} database schema...`);

    try {
      // Get all tables
      const tablesResult = await pool.query(`
        SELECT 
          table_name,
          table_schema,
          table_type
        FROM information_schema.tables 
        WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
        ORDER BY table_schema, table_name;
      `);

      const tables = tablesResult.rows;
      console.log(`Found ${tables.length} tables in ${dbName}`);

      const schemaInfo = {
        tables: {},
        totalTables: tables.length,
        schemas: [...new Set(tables.map((t) => t.table_schema))],
      };

      // Get detailed info for each table
      for (let i = 0; i < tables.length; i++) {
        const table = tables[i];
        const tableName = table.table_name;
        const schemaName = table.table_schema;
        const fullTableName = `${schemaName}.${tableName}`;

        console.log(
          `  📋 Analyzing table: ${fullTableName} (${i + 1}/${tables.length})`
        );

        // Get columns info
        const columnsResult = await pool.query(
          `
          SELECT 
            column_name,
            data_type,
            is_nullable,
            column_default,
            character_maximum_length,
            numeric_precision,
            numeric_scale,
            udt_name
          FROM information_schema.columns 
          WHERE table_name = $1 AND table_schema = $2
          ORDER BY ordinal_position;
        `,
          [tableName, schemaName]
        );

        // Get row count (with timeout)
        let rowCount = 0;
        try {
          const countResult = await Promise.race([
            pool.query(
              `SELECT COUNT(*) as count FROM "${schemaName}"."${tableName}"`
            ),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Timeout")), 5000)
            ),
          ]);
          rowCount = parseInt(countResult.rows[0].count);
        } catch (err) {
          console.log(
            `    ⚠️  Could not get row count for ${fullTableName}: ${err.message}`
          );
          // Get estimated row count instead
          try {
            const estimateResult = await pool.query(
              `
              SELECT n_tup_ins - n_tup_del AS estimate
              FROM pg_stat_user_tables 
              WHERE relname = $1 AND schemaname = $2;
            `,
              [tableName, schemaName]
            );

            if (
              estimateResult.rows.length > 0 &&
              estimateResult.rows[0].estimate !== null
            ) {
              rowCount = parseInt(estimateResult.rows[0].estimate);
            }
          } catch (estimateErr) {
            console.log(`    ⚠️  Could not get estimate for ${fullTableName}`);
          }
        }

        // Get primary keys
        const pkResult = await pool.query(
          `
          SELECT column_name
          FROM information_schema.table_constraints tc
          JOIN information_schema.key_column_usage kcu 
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
          WHERE tc.constraint_type = 'PRIMARY KEY'
            AND tc.table_name = $1 
            AND tc.table_schema = $2;
        `,
          [tableName, schemaName]
        );

        // Get foreign keys
        const fkResult = await pool.query(
          `
          SELECT
            kcu.column_name,
            ccu.table_schema AS foreign_table_schema,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name
          FROM information_schema.table_constraints AS tc
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
          JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
          WHERE tc.constraint_type = 'FOREIGN KEY'
            AND tc.table_name = $1
            AND tc.table_schema = $2;
        `,
          [tableName, schemaName]
        );

        // Get indexes
        const indexResult = await pool.query(
          `
          SELECT 
            indexname,
            indexdef
          FROM pg_indexes 
          WHERE tablename = $1 AND schemaname = $2;
        `,
          [tableName, schemaName]
        );

        schemaInfo.tables[fullTableName] = {
          schema: schemaName,
          tableName: tableName,
          tableType: table.table_type,
          rowCount: rowCount,
          columns: columnsResult.rows,
          primaryKeys: pkResult.rows.map((row) => row.column_name),
          foreignKeys: fkResult.rows,
          indexes: indexResult.rows,
        };
      }

      return schemaInfo;
    } catch (error) {
      console.error(`❌ Error analyzing ${dbName}:`, error);
      throw error;
    }
  }

  async generateDatabaseDocumentation(schemaInfo, dbName) {
    let documentation = `# ${dbName.toUpperCase()} Database Schema Documentation\n\n`;
    documentation += `**Generated on:** ${new Date().toISOString()}\n`;
    documentation += `**Total Tables:** ${schemaInfo.totalTables}\n`;
    documentation += `**Schemas:** ${schemaInfo.schemas.join(", ")}\n\n`;

    // Summary statistics
    const totalRows = Object.values(schemaInfo.tables).reduce(
      (sum, table) => sum + (table.rowCount || 0),
      0
    );
    documentation += `**Estimated Total Rows:** ${totalRows.toLocaleString()}\n\n`;

    // Table of contents
    documentation += `## Table of Contents\n\n`;
    const sortedTables = Object.keys(schemaInfo.tables).sort();
    for (const tableName of sortedTables) {
      const anchorName = tableName
        .replace(/\./g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
      documentation += `- [${tableName}](#${anchorName})\n`;
    }
    documentation += `\n`;

    // Quick Stats
    documentation += `## Quick Statistics\n\n`;
    documentation += `| Table | Row Count | Columns | Has PK | Foreign Keys |\n`;
    documentation += `|-------|-----------|---------|--------|-------------|\n`;

    const tableStats = Object.entries(schemaInfo.tables)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([tableName, tableInfo]) => ({
        name: tableName,
        rowCount: tableInfo.rowCount || 0,
        columnCount: tableInfo.columns.length,
        hasPK: tableInfo.primaryKeys.length > 0 ? "✅" : "❌",
        fkCount: tableInfo.foreignKeys.length,
      }));

    for (const stat of tableStats) {
      documentation += `| ${stat.name} | ${stat.rowCount.toLocaleString()} | ${
        stat.columnCount
      } | ${stat.hasPK} | ${stat.fkCount} |\n`;
    }
    documentation += `\n`;

    // Detailed table information
    for (const [tableName, tableInfo] of Object.entries(schemaInfo.tables)) {
      const anchorName = tableName
        .replace(/\./g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
      documentation += `## ${tableName} {#${anchorName}}\n\n`;
      documentation += `**Type:** ${tableInfo.tableType}\n`;
      documentation += `**Row Count:** ${tableInfo.rowCount.toLocaleString()}\n`;
      documentation += `**Primary Keys:** ${
        tableInfo.primaryKeys.join(", ") || "None"
      }\n\n`;

      // Columns
      documentation += `### Columns\n\n`;
      documentation += `| Column | Type | Nullable | Default | Length/Precision |\n`;
      documentation += `|--------|------|----------|---------|------------------|\n`;

      for (const col of tableInfo.columns) {
        const typeInfo = col.character_maximum_length
          ? `${col.data_type}(${col.character_maximum_length})`
          : col.numeric_precision
          ? `${col.data_type}(${col.numeric_precision}${
              col.numeric_scale ? "," + col.numeric_scale : ""
            })`
          : col.data_type;

        documentation += `| ${col.column_name} | ${typeInfo} | ${
          col.is_nullable
        } | ${col.column_default || "NULL"} | ${
          col.character_maximum_length || col.numeric_precision || "-"
        } |\n`;
      }
      documentation += `\n`;

      // Foreign Keys
      if (tableInfo.foreignKeys.length > 0) {
        documentation += `### Foreign Keys\n\n`;
        documentation += `| Column | References |\n`;
        documentation += `|--------|------------|\n`;
        for (const fk of tableInfo.foreignKeys) {
          documentation += `| ${fk.column_name} | ${fk.foreign_table_schema}.${fk.foreign_table_name}.${fk.foreign_column_name} |\n`;
        }
        documentation += `\n`;
      }

      // Indexes
      if (tableInfo.indexes.length > 0) {
        documentation += `### Indexes\n\n`;
        for (const idx of tableInfo.indexes) {
          documentation += `- **${idx.indexname}:** \`${idx.indexdef}\`\n`;
        }
        documentation += `\n`;
      }

      documentation += `---\n\n`;
    }

    return documentation;
  }

  generateSummary() {
    let summary = `# Database Analysis Summary\n\n`;
    summary += `**Analysis Date:** ${new Date().toISOString()}\n\n`;

    summary += `## Overview\n\n`;
    summary += `| Database | Tables | Schemas | Total Rows (approx) |\n`;
    summary += `|----------|--------|---------|--------------------|\n`;

    const sixmapTotal = Object.values(
      this.analysisResults.sixmap.tables || {}
    ).reduce((sum, table) => sum + (table.rowCount || 0), 0);
    const criptoremesaTotal = Object.values(
      this.analysisResults.criptoremesa.tables || {}
    ).reduce((sum, table) => sum + (table.rowCount || 0), 0);

    summary += `| Sixmap | ${this.analysisResults.sixmap.totalTables || 0} | ${(
      this.analysisResults.sixmap.schemas || []
    ).join(", ")} | ${sixmapTotal.toLocaleString()} |\n`;
    summary += `| Criptoremesa | ${
      this.analysisResults.criptoremesa.totalTables || 0
    } | ${(this.analysisResults.criptoremesa.schemas || []).join(
      ", "
    )} | ${criptoremesaTotal.toLocaleString()} |\n\n`;

    // Largest tables
    summary += `## Largest Tables by Row Count\n\n`;
    const allTables = [];

    for (const [dbName, dbInfo] of Object.entries(this.analysisResults)) {
      for (const [tableName, tableInfo] of Object.entries(
        dbInfo.tables || {}
      )) {
        allTables.push({
          database: dbName,
          table: tableName,
          rows: tableInfo.rowCount || 0,
        });
      }
    }

    allTables.sort((a, b) => b.rows - a.rows);
    summary += `| Database | Table | Row Count |\n`;
    summary += `|----------|-------|----------|\n`;

    for (const table of allTables.slice(0, 20)) {
      summary += `| ${table.database} | ${
        table.table
      } | ${table.rows.toLocaleString()} |\n`;
    }

    return summary;
  }

  async analyzeAllDatabases() {
    const poolSM = new Pool(connectionDbSixmap);
    const poolCR = new Pool(connectionDbCriptoremesa);

    try {
      console.log("🚀 Starting database analysis...\n");

      // Test connections
      console.log("🔗 Testing database connections...");
      await poolSM.query("SELECT NOW()");
      console.log("✅ Sixmap database connected");

      await poolCR.query("SELECT NOW()");
      console.log("✅ Criptoremesa database connected\n");

      // Analyze Sixmap DB
      console.log("📊 Analyzing Sixmap Database...");
      this.analysisResults.sixmap = await this.analyzeDatabaseSchema(
        poolSM,
        "Sixmap"
      );

      // Analyze Criptoremesa DB
      console.log("\n📊 Analyzing Criptoremesa Database...");
      this.analysisResults.criptoremesa = await this.analyzeDatabaseSchema(
        poolCR,
        "Criptoremesa"
      );

      // Generate documentation
      console.log("\n📝 Generating documentation...");

      const sixmapDocs = await this.generateDatabaseDocumentation(
        this.analysisResults.sixmap,
        "Sixmap"
      );
      const criptoremesaDocs = await this.generateDatabaseDocumentation(
        this.analysisResults.criptoremesa,
        "Criptoremesa"
      );

      // Save results
      const outputDir = "./database-analysis";
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Save JSON analysis
      fs.writeFileSync(
        path.join(outputDir, "database-analysis.json"),
        JSON.stringify(this.analysisResults, null, 2)
      );

      // Save documentation
      fs.writeFileSync(path.join(outputDir, "sixmap-schema.md"), sixmapDocs);
      fs.writeFileSync(
        path.join(outputDir, "criptoremesa-schema.md"),
        criptoremesaDocs
      );

      // Generate summary
      const summary = this.generateSummary();
      fs.writeFileSync(path.join(outputDir, "database-summary.md"), summary);

      console.log(`\n✅ Analysis complete! Files saved in ${outputDir}/`);
      console.log(
        `📊 Sixmap DB: ${this.analysisResults.sixmap.totalTables} tables`
      );
      console.log(
        `📊 Criptoremesa DB: ${this.analysisResults.criptoremesa.totalTables} tables`
      );

      const sixmapTotal = Object.values(
        this.analysisResults.sixmap.tables || {}
      ).reduce((sum, table) => sum + (table.rowCount || 0), 0);
      const criptoremesaTotal = Object.values(
        this.analysisResults.criptoremesa.tables || {}
      ).reduce((sum, table) => sum + (table.rowCount || 0), 0);

      console.log(
        `📈 Total estimated rows: ${(
          sixmapTotal + criptoremesaTotal
        ).toLocaleString()}`
      );
    } catch (error) {
      console.error("❌ Error during analysis:", error);
    } finally {
      // Close connections
      await poolSM.end();
      await poolCR.end();
    }
  }
}

// Run the analysis
const analyzer = new DatabaseAnalyzer();
analyzer.analyzeAllDatabases();
