/**
 * Analyze SILT File Types
 * 
 * This script analyzes the SILT JSON data stored in the database
 * to identify all file URLs and determine their actual content types.
 */

import dotenv from "dotenv";
import { Pool } from "pg";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const pool = new Pool({
  user: process.env.PG_DB_SM_USER || "postgres",
  host: process.env.PG_DB_SM_HOST || "localhost",
  database: process.env.PG_DB_SM_NAME || "criptoremesa_db",
  password: process.env.PG_DB_SM_PASSWORD,
  port: process.env.PG_DB_SM_PORT || 5432,
});

const fileTypeStats = {
  byExtension: {},
  byContentType: {},
  byFilePrefix: {},
  urlsChecked: 0,
  errors: 0,
  samples: [],
};

/**
 * Extract all file URLs from SILT JSON
 */
function extractFileUrls(siltData) {
  const urls = [];

  function extractFromObject(obj, parentKey = "") {
    if (!obj || typeof obj !== "object") return;

    for (const [key, value] of Object.entries(obj)) {
      if (
        (key === "file_url" || key === "s3_url") &&
        typeof value === "string" &&
        value.startsWith("http")
      ) {
        urls.push({
          url: value,
          context: parentKey || "root",
          key: key,
        });
      } else if (typeof value === "object") {
        extractFromObject(value, key);
      }
    }
  }

  extractFromObject(siltData);
  return urls;
}

/**
 * Check file type by making a HEAD request
 */
async function checkFileType(url, context) {
  try {
    const response = await axios.head(url, {
      timeout: 10000,
      validateStatus: (status) => status < 500,
    });

    const contentType = response.headers["content-type"] || "unknown";
    const contentLength = response.headers["content-length"] || 0;

    // Extract extension from URL
    const urlPath = new URL(url).pathname;
    const extension = path.extname(urlPath).toLowerCase() || ".unknown";

    // Extract file prefix (like IF, IB, PF, HG, etc.)
    const filename = path.basename(urlPath);
    const prefixMatch = filename.match(/^([A-Z]+)-/);
    const prefix = prefixMatch ? prefixMatch[1] : "UNKNOWN";

    return {
      success: true,
      contentType,
      contentLength: parseInt(contentLength),
      extension,
      prefix,
      context,
      url,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      url,
      context,
    };
  }
}

/**
 * Analyze all SILT records
 */
async function analyzeSiltFileTypes() {
  try {
    console.log("Fetching SILT data from database...\n");

    // Get all SILT records with JSON data
    const result = await pool.query(`
      SELECT 
        ulv.silt_id,
        ued.value as silt_json
      FROM sec_cust.lnk_users_verif_level ulv
      INNER JOIN sec_cust.ms_sixmap_users u ON u.uuid_user = ulv.uuid_user
      LEFT JOIN sec_cust.lnk_users_extra_data ued 
        ON ued.id_user = u.id_user 
        AND ued.id_item = (SELECT id_item FROM sec_cust.ms_item WHERE name = 'silt_full_json')
      WHERE ued.value IS NOT NULL
      LIMIT 100
    `);

    console.log(`Found ${result.rows.length} SILT records with JSON data\n`);
    console.log("Analyzing file URLs (this may take a few minutes)...\n");

    let recordsProcessed = 0;

    for (const row of result.rows) {
      try {
        const siltData = JSON.parse(row.silt_json);
        const urls = extractFileUrls(siltData);

        for (const urlInfo of urls) {
          const fileInfo = await checkFileType(urlInfo.url, urlInfo.context);

          if (fileInfo.success) {
            fileTypeStats.urlsChecked++;

            // Track by extension
            fileTypeStats.byExtension[fileInfo.extension] =
              (fileTypeStats.byExtension[fileInfo.extension] || 0) + 1;

            // Track by content type
            fileTypeStats.byContentType[fileInfo.contentType] =
              (fileTypeStats.byContentType[fileInfo.contentType] || 0) + 1;

            // Track by file prefix
            fileTypeStats.byFilePrefix[fileInfo.prefix] =
              (fileTypeStats.byFilePrefix[fileInfo.prefix] || 0) + 1;

            // Store sample
            if (fileTypeStats.samples.length < 20) {
              fileTypeStats.samples.push({
                siltId: row.silt_id,
                prefix: fileInfo.prefix,
                extension: fileInfo.extension,
                contentType: fileInfo.contentType,
                size: fileInfo.contentLength,
                url: fileInfo.url.substring(0, 100) + "...",
              });
            }
          } else {
            fileTypeStats.errors++;
          }
        }

        recordsProcessed++;
        if (recordsProcessed % 10 === 0) {
          console.log(`Processed ${recordsProcessed}/${result.rows.length} records...`);
        }
      } catch (error) {
        console.error(`Error processing SILT ID ${row.silt_id}: ${error.message}`);
        fileTypeStats.errors++;
      }
    }

    // Print results
    console.log("\n" + "=".repeat(60));
    console.log("SILT FILE TYPE ANALYSIS RESULTS");
    console.log("=".repeat(60));

    console.log(`\nTotal URLs checked: ${fileTypeStats.urlsChecked}`);
    console.log(`Errors: ${fileTypeStats.errors}`);

    console.log("\n📁 BY FILE EXTENSION:");
    console.log("-".repeat(40));
    for (const [ext, count] of Object.entries(fileTypeStats.byExtension).sort(
      (a, b) => b[1] - a[1]
    )) {
      console.log(`  ${ext.padEnd(20)} ${count} files`);
    }

    console.log("\n📄 BY CONTENT TYPE:");
    console.log("-".repeat(40));
    for (const [type, count] of Object.entries(fileTypeStats.byContentType).sort(
      (a, b) => b[1] - a[1]
    )) {
      console.log(`  ${type.padEnd(30)} ${count} files`);
    }

    console.log("\n🏷️  BY FILE PREFIX (Document Type):");
    console.log("-".repeat(40));
    for (const [prefix, count] of Object.entries(fileTypeStats.byFilePrefix).sort(
      (a, b) => b[1] - a[1]
    )) {
      const description = getFileTypeDescription(prefix);
      console.log(`  ${prefix.padEnd(10)} ${count.toString().padEnd(6)} ${description}`);
    }

    console.log("\n📋 SAMPLE FILES:");
    console.log("-".repeat(40));
    fileTypeStats.samples.forEach((sample, i) => {
      console.log(`\n${i + 1}. SILT ID: ${sample.siltId}`);
      console.log(`   Prefix: ${sample.prefix}`);
      console.log(`   Extension: ${sample.extension}`);
      console.log(`   Content-Type: ${sample.contentType}`);
      console.log(`   Size: ${(sample.size / 1024).toFixed(2)} KB`);
    });

    console.log("\n" + "=".repeat(60));

    // Check for PDF files specifically
    const pdfCount = fileTypeStats.byContentType["application/pdf"] || 0;
    const pdfExtCount = fileTypeStats.byExtension[".pdf"] || 0;

    console.log("\n🔍 PDF FILE DETECTION:");
    console.log("-".repeat(40));
    console.log(`PDFs by Content-Type: ${pdfCount}`);
    console.log(`PDFs by Extension: ${pdfExtCount}`);

    if (pdfCount > 0 || pdfExtCount > 0) {
      console.log("\n⚠️  WARNING: PDF files detected!");
      console.log("The current fetch-silt-data.js script may not handle PDFs correctly.");
      console.log("All files are being saved with image extensions.");
    } else {
      console.log("\n✅ No PDF files detected in sample.");
      console.log("All SILT files appear to be images.");
    }

    await pool.end();
  } catch (error) {
    console.error("Error:", error);
    await pool.end();
    process.exit(1);
  }
}

/**
 * Get human-readable description for file prefix
 */
function getFileTypeDescription(prefix) {
  const descriptions = {
    V: "Video/Selfie Verification",
    IF: "ID Front",
    IB: "ID Back",
    HG: "Hoja de Garantía (Guarantee Sheet)",
    PF: "Proof Document",
    DB: "Driver's License Back",
    DF: "Driver's License Front",
  };
  return descriptions[prefix] || "Unknown Type";
}

// Run the analysis
analyzeSiltFileTypes();
