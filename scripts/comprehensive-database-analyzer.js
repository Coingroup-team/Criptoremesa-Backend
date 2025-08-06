const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

// Database connections
const connectionDbSixmap = {
  user: "postgres",
  host: "18.222.5.211",
  database: "PRE-QA-CG",
  password: "CGDX11456.",
  port: 5432,
  max: 8,
  keepAlive: true,
};

const connectionDbCriptoremesa = {
  user: "postgres",
  host: "18.222.5.211",
  database: "criptoremesa-cg",
  password: "CGDX11456.",
  port: 5432,
  max: 8,
  keepAlive: true,
};

class ComprehensiveDatabaseAnalyzer {
  constructor() {
    this.analysisResults = {
      sixmap: {},
      criptoremesa: {},
    };
  }

  async analyzeCompleteDatabaseSchema(pool, dbName) {
    console.log(`🎯 COMPREHENSIVE Analysis of ${dbName} database...\n`);

    const schemaInfo = {
      tables: {},
      views: {},
      functions: {},
      procedures: {},
      triggers: {},
      sequences: {},
      types: {},
      domains: {},
      constraints: {},
      indexes: {},
      rules: {},
      totalTables: 0,
      totalViews: 0,
      totalFunctions: 0,
      totalProcedures: 0,
      totalTriggers: 0,
      schemas: [],
    };

    try {
      // 1. TABLES (Enhanced)
      console.log("📋 Analyzing Tables...");
      await this.analyzeTables(pool, schemaInfo);

      // 2. VIEWS
      console.log("👁️  Analyzing Views...");
      await this.analyzeViews(pool, schemaInfo);

      // 3. FUNCTIONS & PROCEDURES (PL/pgSQL Business Logic)
      console.log("📝 Analyzing Functions & Procedures (Business Logic)...");
      await this.analyzeFunctionsAndProcedures(pool, schemaInfo);

      // 4. TRIGGERS
      console.log("⚡ Analyzing Triggers...");
      await this.analyzeTriggers(pool, schemaInfo);

      // 5. SEQUENCES
      console.log("🔢 Analyzing Sequences...");
      await this.analyzeSequences(pool, schemaInfo);

      // 6. CUSTOM TYPES & DOMAINS
      console.log("🏷️  Analyzing Custom Types & Domains...");
      await this.analyzeTypesAndDomains(pool, schemaInfo);

      // 7. CONSTRAINTS & RULES
      console.log("🔧 Analyzing Constraints & Rules...");
      await this.analyzeConstraintsAndRules(pool, schemaInfo);

      // 8. INDEXES (Detailed)
      console.log("📍 Analyzing Indexes...");
      await this.analyzeIndexes(pool, schemaInfo);

      return schemaInfo;
    } catch (error) {
      console.error(`❌ Error in comprehensive analysis of ${dbName}:`, error);
      throw error;
    }
  }

  async analyzeTables(pool, schemaInfo) {
    const tablesResult = await pool.query(`
      SELECT 
        t.table_name,
        t.table_schema,
        t.table_type,
        obj_description(c.oid, 'pg_class') as table_comment
      FROM information_schema.tables t
      LEFT JOIN pg_class c ON c.relname = t.table_name
      LEFT JOIN pg_namespace n ON n.oid = c.relnamespace AND n.nspname = t.table_schema
      WHERE t.table_schema NOT IN ('information_schema', 'pg_catalog')
      ORDER BY t.table_schema, t.table_name;
    `);

    schemaInfo.totalTables = tablesResult.rows.length;
    schemaInfo.schemas = [
      ...new Set(tablesResult.rows.map((t) => t.table_schema)),
    ];

    for (const table of tablesResult.rows) {
      const tableName = table.table_name;
      const schemaName = table.table_schema;
      const fullTableName = `${schemaName}.${tableName}`;

      // Get columns with detailed info
      const columnsResult = await pool.query(
        `
        SELECT 
          c.column_name,
          c.data_type,
          c.is_nullable,
          c.column_default,
          c.character_maximum_length,
          c.numeric_precision,
          c.numeric_scale,
          c.udt_name,
          col_description(pgc.oid, c.ordinal_position) as column_comment,
          c.is_identity,
          c.identity_generation
        FROM information_schema.columns c
        LEFT JOIN pg_class pgc ON pgc.relname = c.table_name
        LEFT JOIN pg_namespace pgn ON pgn.oid = pgc.relnamespace AND pgn.nspname = c.table_schema
        WHERE c.table_name = $1 AND c.table_schema = $2
        ORDER BY c.ordinal_position;
      `,
        [tableName, schemaName]
      );

      // Get row count with timeout
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
          // Silent fail
        }
      }

      // Get constraints
      const constraintsResult = await pool.query(
        `
        SELECT 
          tc.constraint_name,
          tc.constraint_type,
          kcu.column_name,
          ccu.table_schema AS foreign_table_schema,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name,
          rc.match_option,
          rc.update_rule,
          rc.delete_rule
        FROM information_schema.table_constraints AS tc 
        LEFT JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        LEFT JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
        LEFT JOIN information_schema.referential_constraints AS rc
          ON tc.constraint_name = rc.constraint_name
          AND tc.table_schema = rc.constraint_schema
        WHERE tc.table_name = $1 AND tc.table_schema = $2;
      `,
        [tableName, schemaName]
      );

      schemaInfo.tables[fullTableName] = {
        schema: schemaName,
        tableName: tableName,
        tableType: table.table_type,
        tableComment: table.table_comment,
        rowCount: rowCount,
        columns: columnsResult.rows,
        constraints: constraintsResult.rows,
      };
    }
  }

  async analyzeViews(pool, schemaInfo) {
    const viewsResult = await pool.query(`
      SELECT 
        schemaname,
        viewname,
        definition,
        obj_description(c.oid, 'pg_class') as view_comment
      FROM pg_views pv
      LEFT JOIN pg_class c ON c.relname = pv.viewname
      LEFT JOIN pg_namespace n ON n.oid = c.relnamespace AND n.nspname = pv.schemaname
      WHERE schemaname NOT IN ('information_schema', 'pg_catalog')
      ORDER BY schemaname, viewname;
    `);

    schemaInfo.totalViews = viewsResult.rows.length;

    for (const view of viewsResult.rows) {
      const fullViewName = `${view.schemaname}.${view.viewname}`;

      // Get view columns
      const columnsResult = await pool.query(
        `
        SELECT 
          column_name,
          data_type,
          is_nullable,
          character_maximum_length,
          numeric_precision
        FROM information_schema.columns
        WHERE table_name = $1 AND table_schema = $2
        ORDER BY ordinal_position;
      `,
        [view.viewname, view.schemaname]
      );

      schemaInfo.views[fullViewName] = {
        schema: view.schemaname,
        viewName: view.viewname,
        definition: view.definition,
        comment: view.view_comment,
        columns: columnsResult.rows,
      };
    }
  }

  async analyzeFunctionsAndProcedures(pool, schemaInfo) {
    const functionsResult = await pool.query(`
      SELECT 
        n.nspname as schema_name,
        p.proname as function_name,
        pg_catalog.pg_get_function_result(p.oid) as result_type,
        pg_catalog.pg_get_function_arguments(p.oid) as arguments,
        pg_catalog.pg_get_functiondef(p.oid) as definition,
        l.lanname as language,
        p.prokind,
        CASE p.prokind 
          WHEN 'f' THEN 'function'
          WHEN 'p' THEN 'procedure' 
          WHEN 'a' THEN 'aggregate'
          WHEN 'w' THEN 'window'
        END as object_type,
        obj_description(p.oid, 'pg_proc') as description,
        p.provolatile,
        CASE p.provolatile
          WHEN 'i' THEN 'immutable'
          WHEN 's' THEN 'stable'
          WHEN 'v' THEN 'volatile'
        END as volatility
      FROM pg_proc p
      LEFT JOIN pg_namespace n ON n.oid = p.pronamespace
      LEFT JOIN pg_language l ON l.oid = p.prolang
      WHERE n.nspname NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
        AND n.nspname NOT LIKE 'pg_temp_%'
        AND n.nspname NOT LIKE 'pg_toast_temp_%'
      ORDER BY n.nspname, p.proname;
    `);

    schemaInfo.totalFunctions = functionsResult.rows.filter(
      (f) => f.object_type === "function"
    ).length;
    schemaInfo.totalProcedures = functionsResult.rows.filter(
      (f) => f.object_type === "procedure"
    ).length;

    for (const func of functionsResult.rows) {
      const fullFunctionName = `${func.schema_name}.${func.function_name}`;

      schemaInfo.functions[fullFunctionName] = {
        schema: func.schema_name,
        name: func.function_name,
        type: func.object_type,
        language: func.language,
        arguments: func.arguments,
        returnType: func.result_type,
        definition: func.definition,
        description: func.description,
        volatility: func.volatility,
      };
    }
  }

  async analyzeTriggers(pool, schemaInfo) {
    const triggersResult = await pool.query(`
      SELECT 
        t.trigger_schema,
        t.trigger_name,
        t.event_manipulation,
        t.event_object_schema,
        t.event_object_table,
        t.action_statement,
        t.action_timing,
        t.action_orientation,
        obj_description(pg_trigger.oid, 'pg_trigger') as description
      FROM information_schema.triggers t
      LEFT JOIN pg_trigger ON pg_trigger.tgname = t.trigger_name
      WHERE t.trigger_schema NOT IN ('information_schema', 'pg_catalog')
      ORDER BY t.trigger_schema, t.event_object_table, t.trigger_name;
    `);

    schemaInfo.totalTriggers = triggersResult.rows.length;

    for (const trigger of triggersResult.rows) {
      const triggerKey = `${trigger.event_object_schema}.${trigger.event_object_table}.${trigger.trigger_name}`;

      schemaInfo.triggers[triggerKey] = {
        schema: trigger.trigger_schema,
        name: trigger.trigger_name,
        table: `${trigger.event_object_schema}.${trigger.event_object_table}`,
        event: trigger.event_manipulation,
        timing: trigger.action_timing,
        orientation: trigger.action_orientation,
        statement: trigger.action_statement,
        description: trigger.description,
      };
    }
  }

  async analyzeSequences(pool, schemaInfo) {
    const sequencesResult = await pool.query(`
      SELECT 
        schemaname,
        sequencename,
        start_value,
        min_value,
        max_value,
        increment_by,
        cycle,
        cache_size,
        last_value
      FROM pg_sequences
      WHERE schemaname NOT IN ('information_schema', 'pg_catalog')
      ORDER BY schemaname, sequencename;
    `);

    for (const seq of sequencesResult.rows) {
      const fullSeqName = `${seq.schemaname}.${seq.sequencename}`;

      schemaInfo.sequences[fullSeqName] = {
        schema: seq.schemaname,
        name: seq.sequencename,
        startValue: seq.start_value,
        minValue: seq.min_value,
        maxValue: seq.max_value,
        increment: seq.increment_by,
        cycle: seq.cycle,
        cacheSize: seq.cache_size,
        lastValue: seq.last_value,
      };
    }
  }

  async analyzeTypesAndDomains(pool, schemaInfo) {
    const typesResult = await pool.query(`
      SELECT 
        n.nspname as schema_name,
        t.typname as type_name,
        t.typtype,
        CASE t.typtype
          WHEN 'b' THEN 'base'
          WHEN 'c' THEN 'composite'
          WHEN 'd' THEN 'domain'
          WHEN 'e' THEN 'enum'
          WHEN 'p' THEN 'pseudo'
          WHEN 'r' THEN 'range'
        END as type_category,
        obj_description(t.oid, 'pg_type') as description,
        pg_catalog.format_type(t.oid, NULL) as formatted_type
      FROM pg_type t
      LEFT JOIN pg_namespace n ON n.oid = t.typnamespace
      WHERE n.nspname NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
        AND t.typtype IN ('c', 'd', 'e', 'r')  -- composite, domain, enum, range
      ORDER BY n.nspname, t.typname;
    `);

    for (const type of typesResult.rows) {
      const fullTypeName = `${type.schema_name}.${type.type_name}`;

      schemaInfo.types[fullTypeName] = {
        schema: type.schema_name,
        name: type.type_name,
        category: type.type_category,
        formattedType: type.formatted_type,
        description: type.description,
      };

      // Get enum values if it's an enum type
      if (type.type_category === "enum") {
        const enumResult = await pool.query(
          `
          SELECT enumlabel
          FROM pg_enum
          WHERE enumtypid = (
            SELECT oid FROM pg_type 
            WHERE typname = $1 
            AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = $2)
          )
          ORDER BY enumsortorder;
        `,
          [type.type_name, type.schema_name]
        );

        schemaInfo.types[fullTypeName].enumValues = enumResult.rows.map(
          (row) => row.enumlabel
        );
      }
    }
  }

  async analyzeConstraintsAndRules(pool, schemaInfo) {
    const rulesResult = await pool.query(`
      SELECT 
        schemaname,
        tablename,
        rulename,
        definition
      FROM pg_rules
      WHERE schemaname NOT IN ('information_schema', 'pg_catalog')
      ORDER BY schemaname, tablename, rulename;
    `);

    for (const rule of rulesResult.rows) {
      const ruleKey = `${rule.schemaname}.${rule.tablename}.${rule.rulename}`;

      schemaInfo.rules[ruleKey] = {
        schema: rule.schemaname,
        table: rule.tablename,
        name: rule.rulename,
        definition: rule.definition,
      };
    }
  }

  async analyzeIndexes(pool, schemaInfo) {
    const indexesResult = await pool.query(`
      SELECT 
        pi.schemaname,
        pi.tablename,
        pi.indexname,
        pi.indexdef,
        psui.idx_scan,
        psui.idx_tup_read,
        psui.idx_tup_fetch
      FROM pg_indexes pi
      LEFT JOIN pg_stat_user_indexes psui ON pi.indexname = psui.indexrelname 
        AND pi.schemaname = psui.schemaname
      WHERE pi.schemaname NOT IN ('information_schema', 'pg_catalog')
      ORDER BY pi.schemaname, pi.tablename, pi.indexname;
    `);

    for (const index of indexesResult.rows) {
      const indexKey = `${index.schemaname}.${index.tablename}.${index.indexname}`;

      schemaInfo.indexes[indexKey] = {
        schema: index.schemaname,
        table: index.tablename,
        name: index.indexname,
        definition: index.indexdef,
        scans: index.idx_scan || 0,
        tuplesRead: index.idx_tup_read || 0,
        tuplesFetched: index.idx_tup_fetch || 0,
      };
    }
  }

  async generateBusinessLogicDocumentation(schemaInfo, dbName) {
    let doc = `# ${dbName.toUpperCase()} - Complete Database Analysis\n\n`;
    doc += `**Generated:** ${new Date().toISOString()}\n\n`;

    // Overview
    doc += `## 📊 Database Overview\n\n`;
    doc += `| Component | Count |\n`;
    doc += `|-----------|-------|\n`;
    doc += `| Tables | ${schemaInfo.totalTables} |\n`;
    doc += `| Views | ${schemaInfo.totalViews} |\n`;
    doc += `| Functions | ${schemaInfo.totalFunctions} |\n`;
    doc += `| Procedures | ${schemaInfo.totalProcedures} |\n`;
    doc += `| Triggers | ${schemaInfo.totalTriggers} |\n`;
    doc += `| Sequences | ${Object.keys(schemaInfo.sequences).length} |\n`;
    doc += `| Custom Types | ${Object.keys(schemaInfo.types).length} |\n`;
    doc += `| Rules | ${Object.keys(schemaInfo.rules).length} |\n`;
    doc += `| Indexes | ${Object.keys(schemaInfo.indexes).length} |\n\n`;

    // Business Logic Functions
    if (Object.keys(schemaInfo.functions).length > 0) {
      doc += `## 📝 Business Logic Functions & Procedures\n\n`;

      const plpgsqlFunctions = Object.entries(schemaInfo.functions).filter(
        ([, func]) => func.language === "plpgsql"
      );

      doc += `### PL/pgSQL Functions (${plpgsqlFunctions.length})\n\n`;

      for (const [name, func] of plpgsqlFunctions) {
        doc += `#### ${name}\n`;
        doc += `- **Type:** ${func.type}\n`;
        doc += `- **Arguments:** \`${func.arguments || "none"}\`\n`;
        doc += `- **Returns:** \`${func.returnType || "void"}\`\n`;
        doc += `- **Volatility:** ${func.volatility}\n`;
        if (func.description) {
          doc += `- **Description:** ${func.description}\n`;
        }
        doc += `\n`;

        // Show function definition (truncated)
        if (func.definition && func.definition.length > 0) {
          const defPreview =
            func.definition.length > 500
              ? func.definition.substring(0, 500) + "..."
              : func.definition;
          doc += `\`\`\`sql\n${defPreview}\n\`\`\`\n\n`;
        }
      }
    }

    // Views Documentation
    if (Object.keys(schemaInfo.views).length > 0) {
      doc += `## 👁️ Business Views\n\n`;

      for (const [name, view] of Object.entries(schemaInfo.views)) {
        doc += `### ${name}\n`;
        if (view.comment) {
          doc += `**Description:** ${view.comment}\n\n`;
        }

        doc += `**Columns (${view.columns.length}):**\n`;
        for (const col of view.columns) {
          doc += `- ${col.column_name} (${col.data_type})\n`;
        }
        doc += `\n`;

        // Show view definition (truncated)
        const defPreview =
          view.definition.length > 300
            ? view.definition.substring(0, 300) + "..."
            : view.definition;
        doc += `\`\`\`sql\n${defPreview}\n\`\`\`\n\n`;
      }
    }

    // Triggers Documentation
    if (Object.keys(schemaInfo.triggers).length > 0) {
      doc += `## ⚡ Business Rule Triggers\n\n`;

      const triggersByTable = {};
      for (const [key, trigger] of Object.entries(schemaInfo.triggers)) {
        if (!triggersByTable[trigger.table]) {
          triggersByTable[trigger.table] = [];
        }
        triggersByTable[trigger.table].push(trigger);
      }

      for (const [tableName, triggers] of Object.entries(triggersByTable)) {
        doc += `### ${tableName}\n`;
        for (const trigger of triggers) {
          doc += `- **${trigger.name}:** ${trigger.timing} ${trigger.event}\n`;
          doc += `  - Statement: \`${trigger.statement}\`\n`;
        }
        doc += `\n`;
      }
    }

    return doc;
  }

  async analyzeAllDatabases() {
    const poolSM = new Pool(connectionDbSixmap);
    const poolCR = new Pool(connectionDbCriptoremesa);

    try {
      console.log("🚀 Starting COMPREHENSIVE database analysis...\n");

      // Test connections
      console.log("🔗 Testing database connections...");
      await poolSM.query("SELECT NOW()");
      console.log("✅ Sixmap database connected");

      await poolCR.query("SELECT NOW()");
      console.log("✅ Criptoremesa database connected\n");

      // Comprehensive analysis of Sixmap DB
      this.analysisResults.sixmap = await this.analyzeCompleteDatabaseSchema(
        poolSM,
        "Sixmap"
      );

      // Comprehensive analysis of Criptoremesa DB
      this.analysisResults.criptoremesa =
        await this.analyzeCompleteDatabaseSchema(poolCR, "Criptoremesa");

      // Generate comprehensive documentation
      console.log(
        "\n📝 Generating comprehensive business logic documentation..."
      );

      const sixmapDocs = await this.generateBusinessLogicDocumentation(
        this.analysisResults.sixmap,
        "Sixmap"
      );
      const criptoremesaDocs = await this.generateBusinessLogicDocumentation(
        this.analysisResults.criptoremesa,
        "Criptoremesa"
      );

      // Save results
      const outputDir = "./database-comprehensive-analysis";
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Save comprehensive JSON analysis
      fs.writeFileSync(
        path.join(outputDir, "comprehensive-database-analysis.json"),
        JSON.stringify(this.analysisResults, null, 2)
      );

      // Save business logic documentation
      fs.writeFileSync(
        path.join(outputDir, "sixmap-business-logic.md"),
        sixmapDocs
      );
      fs.writeFileSync(
        path.join(outputDir, "criptoremesa-business-logic.md"),
        criptoremesaDocs
      );

      console.log(
        `\n✅ COMPREHENSIVE Analysis complete! Files saved in ${outputDir}/`
      );
      console.log(
        `📊 Sixmap DB: ${this.analysisResults.sixmap.totalTables} tables, ${this.analysisResults.sixmap.totalFunctions} functions, ${this.analysisResults.sixmap.totalViews} views`
      );
      console.log(
        `📊 Criptoremesa DB: ${this.analysisResults.criptoremesa.totalTables} tables, ${this.analysisResults.criptoremesa.totalFunctions} functions, ${this.analysisResults.criptoremesa.totalViews} views`
      );
    } catch (error) {
      console.error("❌ Error during comprehensive analysis:", error);
    } finally {
      // Close connections
      await poolSM.end();
      await poolCR.end();
    }
  }
}

// Run the comprehensive analysis
const analyzer = new ComprehensiveDatabaseAnalyzer();
analyzer.analyzeAllDatabases();
