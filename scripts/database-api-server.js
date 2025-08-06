const DatabaseQueryTool = require("./database-query-tool");
const express = require("express");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Initialize the database tool
const dbTool = new DatabaseQueryTool();

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Database Analysis API is running",
    timestamp: new Date().toISOString(),
  });
});

// Get database overview
app.get("/api/databases", (req, res) => {
  try {
    if (!dbTool.analysisData) {
      return res.status(500).json({ error: "Analysis data not available" });
    }

    const overview = {};
    for (const [dbName, dbInfo] of Object.entries(dbTool.analysisData)) {
      const totalRows = Object.values(dbInfo.tables).reduce(
        (sum, table) => sum + (table.rowCount || 0),
        0
      );
      overview[dbName] = {
        totalTables: dbInfo.totalTables,
        schemas: dbInfo.schemas,
        totalRows: totalRows,
      };
    }

    res.json(overview);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search tables
app.get("/api/tables/search", async (req, res) => {
  try {
    const { q: searchTerm, db: dbName = "sixmap" } = req.query;

    if (!searchTerm) {
      return res.status(400).json({ error: "Search term is required" });
    }

    const results = await dbTool.findTables(searchTerm);
    res.json({ searchTerm, results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all tables
app.get("/api/tables", (req, res) => {
  try {
    const { db: dbName = "sixmap" } = req.query;

    if (!dbTool.analysisData || !dbTool.analysisData[dbName]) {
      return res.status(404).json({ error: `Database ${dbName} not found` });
    }

    const tables = Object.entries(dbTool.analysisData[dbName].tables).map(
      ([name, info]) => ({
        name,
        schema: info.schema,
        tableName: info.tableName,
        rowCount: info.rowCount,
        columnCount: info.columns.length,
      })
    );

    res.json({ database: dbName, tables });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search columns
app.get("/api/columns/search", async (req, res) => {
  try {
    const { q: searchTerm, db: dbName = "sixmap" } = req.query;

    if (!searchTerm) {
      return res.status(400).json({ error: "Search term is required" });
    }

    const results = await dbTool.findColumns(searchTerm);
    res.json({ searchTerm, results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Describe table
app.get("/api/table/:tableName", async (req, res) => {
  try {
    const { tableName } = req.params;
    const { db: dbName = "sixmap" } = req.query;

    const tableInfo = await dbTool.describeTable(tableName, dbName);

    if (!tableInfo) {
      return res
        .status(404)
        .json({ error: `Table ${tableName} not found in ${dbName}` });
    }

    res.json({
      database: dbName,
      tableName,
      ...tableInfo,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get sample data
app.get("/api/table/:tableName/sample", async (req, res) => {
  try {
    const { tableName } = req.params;
    const { db: dbName = "sixmap", size = 5 } = req.query;

    const sampleData = await dbTool.getTableSample(
      tableName,
      dbName,
      parseInt(size)
    );

    res.json({
      database: dbName,
      tableName,
      sampleSize: parseInt(size),
      data: sampleData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Execute query
app.post("/api/query", async (req, res) => {
  try {
    const { query, database = "sixmap", limit = 100 } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const results = await dbTool.executeQuery(query, database, limit);

    res.json({
      database,
      query,
      rowCount: results.length,
      data: results,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get table relationships
app.get("/api/table/:tableName/relationships", async (req, res) => {
  try {
    const { tableName } = req.params;
    const { db: dbName = "sixmap" } = req.query;

    const relationships = await dbTool.analyzeTableRelationships(
      tableName,
      dbName
    );

    res.json({
      database: dbName,
      tableName,
      ...relationships,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get largest tables
app.get("/api/tables/largest", (req, res) => {
  try {
    const { db: dbName = "sixmap", limit = 20 } = req.query;

    if (!dbTool.analysisData || !dbTool.analysisData[dbName]) {
      return res.status(404).json({ error: `Database ${dbName} not found` });
    }

    const tables = Object.entries(dbTool.analysisData[dbName].tables)
      .sort(([, a], [, b]) => (b.rowCount || 0) - (a.rowCount || 0))
      .slice(0, parseInt(limit))
      .map(([name, info]) => ({
        name,
        rowCount: info.rowCount,
        columnCount: info.columns.length,
      }));

    res.json({ database: dbName, largestTables: tables });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(port, () => {
  console.log(
    `🚀 Database Analysis API Server running at http://localhost:${port}`
  );
  console.log(`📖 API Documentation:`);
  console.log(`   GET  /health                              - Health check`);
  console.log(
    `   GET  /api/databases                       - Database overview`
  );
  console.log(`   GET  /api/tables?db=sixmap               - Get all tables`);
  console.log(`   GET  /api/tables/search?q=user&db=sixmap - Search tables`);
  console.log(`   GET  /api/columns/search?q=email         - Search columns`);
  console.log(`   GET  /api/table/sec_cust.ms_currencies   - Describe table`);
  console.log(
    `   GET  /api/table/sec_cust.ms_currencies/sample?size=10 - Sample data`
  );
  console.log(
    `   POST /api/query                          - Execute SQL query`
  );
  console.log(
    `   GET  /api/table/tableName/relationships  - Table relationships`
  );
  console.log(`   GET  /api/tables/largest?limit=10        - Largest tables`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n⏹️  Shutting down server...");
  await dbTool.close();
  process.exit(0);
});
