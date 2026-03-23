/**
 * SILT Data Fetcher Script
 *
 * This script:
 * 1. Fetches all silt_id from sec_cust.lnk_users_verif_level
 * 2. Calls SILT API for each silt_id
 * 3. Saves full JSON response to sec_cust.lnk_users_extra_data
 * 4. Downloads all images from URLs in the response
 * 5. Uploads images to remote server via SSH/SCP
 *
 * Usage: node scripts/fetch-silt-data.js
 */

import dotenv from "dotenv";
import { Pool } from "pg";
import axios from "axios";
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import { Client } from "ssh2";
import { promisify } from "util";
import { pipeline } from "stream";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from parent directory's .env file
dotenv.config({ path: path.join(__dirname, "../.env") });

const streamPipeline = promisify(pipeline);

// Configuration
const SILT_API_BASE_URL = "https://api.siltapp.com/v1/users";
const SILT_API_CREDENTIALS = [
  {
    appId: "dcf5c568-6de1-4459-a040-038fb762366f",
    token: "2aa4b90a-ba4f-43c0-9cee-b2ecb90201dc",
  },
  {
    appId: "01f41d6d-9d4b-4c21-bd06-3bfcef36573b",
    token: "40284c41-ded8-4f27-b8ca-512d66e94a60",
  },
  {
    appId: "fb3a7896-a7cb-49b2-81b9-c97e0e3c3016",
    token: "056b6161-130c-4632-8990-a50ecc4634f6",
  },
];

// Remote server configuration
const REMOTE_SERVER = {
  host: "ec2-3-143-246-144.us-east-2.compute.amazonaws.com",
  port: 22,
  username: "devarodriguez",
  privateKey: fs.readFileSync(
    path.join(__dirname, "../aws-devapp2-03Jan21.pem")
  ),
};

const REMOTE_BASE_DIR = "/repo-cr/silt-data";
const LOCAL_TEMP_DIR = path.join(__dirname, "../temp-silt-images");

// Database configuration
const pool = new Pool({
  user: process.env.PG_DB_SM_USER || "postgres",
  host: process.env.PG_DB_SM_HOST || "localhost",
  database: process.env.PG_DB_SM_NAME || "criptoremesa_db",
  password: process.env.PG_DB_SM_PASSWORD,
  port: process.env.PG_DB_SM_PORT || 5432,
});

// Logger
const log = {
  info: (msg) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`),
  error: (msg) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`),
  success: (msg) =>
    console.log(`[SUCCESS] ${new Date().toISOString()} - ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`),
};

// Statistics
const stats = {
  total: 0,
  success: 0,
  failed: 0,
  skipped: 0,
  imagesDownloaded: 0,
  errors: [],
};

/**
 * Ensure local temp directory exists
 */
function ensureLocalDir() {
  if (!fs.existsSync(LOCAL_TEMP_DIR)) {
    fs.mkdirSync(LOCAL_TEMP_DIR, { recursive: true });
    log.info(`Created temp directory: ${LOCAL_TEMP_DIR}`);
  }
}

/**
 * Get or create the ms_item for silt_full_json
 */
async function ensureSiltJsonItem() {
  try {
    // Check if item exists
    const checkResult = await pool.query(
      `SELECT id_item FROM sec_cust.ms_item WHERE name = 'silt_full_json'`
    );

    if (checkResult.rows.length > 0) {
      log.info(
        `Item 'silt_full_json' already exists with id: ${checkResult.rows[0].id_item}`
      );
      return checkResult.rows[0].id_item;
    }

    // Get or create category for SILT data
    let categoryResult = await pool.query(
      `SELECT id_category FROM sec_cust.ms_category WHERE name = 'SILT Information'`
    );

    let categoryId;
    if (categoryResult.rows.length === 0) {
      const insertCategory = await pool.query(
        `INSERT INTO sec_cust.ms_category (name, description) 
         VALUES ('SILT Information', 'Full SILT API response data') 
         RETURNING id_category`
      );
      categoryId = insertCategory.rows[0].id_category;
      log.info(`Created category 'SILT Information' with id: ${categoryId}`);
    } else {
      categoryId = categoryResult.rows[0].id_category;
    }

    // Create the item
    const insertItem = await pool.query(
      `INSERT INTO sec_cust.ms_item (id_category, name, description) 
       VALUES ($1, 'silt_full_json', 'Full JSON response from SILT API') 
       RETURNING id_item`,
      [categoryId]
    );

    const itemId = insertItem.rows[0].id_item;
    log.success(`Created item 'silt_full_json' with id: ${itemId}`);
    return itemId;
  } catch (error) {
    log.error(`Error ensuring silt_full_json item: ${error.message}`);
    throw error;
  }
}

/**
 * Fetch all distinct silt_ids from database
 */
async function fetchSiltIds() {
  try {
    const result = await pool.query(`
      SELECT DISTINCT silt_id, uuid_user
      FROM sec_cust.lnk_users_verif_level
      WHERE silt_id IS NOT NULL
      AND silt_id != ''
      ORDER BY silt_id
    `);

    log.info(`Found ${result.rows.length} unique SILT IDs`);
    return result.rows;
  } catch (error) {
    log.error(`Error fetching SILT IDs: ${error.message}`);
    throw error;
  }
}

/**
 * Read SILT IDs from a file (one per line)
 */
async function fetchSiltIdsFromFile(filePath) {
  try {
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(__dirname, filePath);

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File not found: ${absolutePath}`);
    }

    const fileContent = fs.readFileSync(absolutePath, "utf8");
    const siltIds = fileContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#")); // Filter empty lines and comments

    log.info(`Read ${siltIds.length} SILT IDs from ${path.basename(filePath)}`);

    // Fetch uuid_user for each SILT ID from database
    const result = await pool.query(
      `
      SELECT DISTINCT silt_id, uuid_user
      FROM sec_cust.lnk_users_verif_level
      WHERE silt_id = ANY($1::text[])
      ORDER BY silt_id
    `,
      [siltIds]
    );

    if (result.rows.length < siltIds.length) {
      log.warn(
        `Only found ${result.rows.length} of ${siltIds.length} SILT IDs in database`
      );
    }

    return result.rows;
  } catch (error) {
    log.error(`Error reading SILT IDs from file: ${error.message}`);
    throw error;
  }
}

/**
 * Fetch SILT data from API with retry logic for different credential pairs
 */
async function fetchSiltData(siltId) {
  for (let i = 0; i < SILT_API_CREDENTIALS.length; i++) {
    const { appId, token } = SILT_API_CREDENTIALS[i];
    try {
      log.info(
        `Fetching SILT data for ID: ${siltId} (credential pair ${i + 1}/${
          SILT_API_CREDENTIALS.length
        })`
      );

      const response = await axios.get(
        `${SILT_API_BASE_URL}/${siltId}/status/`,
        {
          headers: {
            "X-Company-App-Id": appId,
            "X-Company-App-API-Token": token,
          },
          timeout: 30000,
        }
      );

      log.success(`Successfully fetched SILT data for ID: ${siltId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        log.warn(
          `Authentication failed for SILT ID ${siltId} with credential pair ${
            i + 1
          }, trying next pair...`
        );
        if (i === SILT_API_CREDENTIALS.length - 1) {
          throw new Error(`All credential pairs failed for SILT ID: ${siltId}`);
        }
        continue;
      }

      log.error(`Error fetching SILT data for ${siltId}: ${error.message}`);
      throw error;
    }
  }
}

/**
 * Check if SILT data already exists for user
 */
async function checkExistingSiltData(uuidUser, itemId) {
  try {
    const result = await pool.query(
      `
      SELECT id_user, value
      FROM sec_cust.lnk_users_extra_data
      WHERE id_user = (SELECT id_user FROM sec_cust.ms_sixmap_users WHERE uuid_user = $1)
      AND id_item = $2
    `,
      [uuidUser, itemId]
    );

    return result.rows.length > 0;
  } catch (error) {
    log.error(`Error checking existing SILT data: ${error.message}`);
    return false;
  }
}

/**
 * Save SILT JSON to database
 */
async function saveSiltJsonToDatabase(uuidUser, siltData, itemId) {
  try {
    // Get id_user from uuid_user
    const userResult = await pool.query(
      `SELECT id_user FROM sec_cust.ms_sixmap_users WHERE uuid_user = $1`,
      [uuidUser]
    );

    if (userResult.rows.length === 0) {
      throw new Error(`User not found for uuid: ${uuidUser}`);
    }

    const idUser = userResult.rows[0].id_user;

    // Check if data already exists
    const existingResult = await pool.query(
      `SELECT id_extra_data FROM sec_cust.lnk_users_extra_data 
       WHERE id_user = $1 AND id_item = $2`,
      [idUser, itemId]
    );

    const jsonValue = JSON.stringify(siltData);

    if (existingResult.rows.length > 0) {
      // Update existing record
      await pool.query(
        `UPDATE sec_cust.lnk_users_extra_data 
         SET value = $1, edited = false 
         WHERE id_extra_data = $2`,
        [jsonValue, existingResult.rows[0].id_extra_data]
      );
      log.success(`Updated SILT JSON for user ${uuidUser}`);
    } else {
      // Insert new record
      await pool.query(
        `INSERT INTO sec_cust.lnk_users_extra_data (id_user, id_item, value, edited) 
         VALUES ($1, $2, $3, false)`,
        [idUser, itemId, jsonValue]
      );
      log.success(`Inserted SILT JSON for user ${uuidUser}`);
    }
  } catch (error) {
    log.error(`Error saving SILT JSON to database: ${error.message}`);
    throw error;
  }
}

/**
 * Extract all image URLs from SILT response
 */
function extractImageUrls(siltData) {
  const urls = [];

  // Helper function to extract URLs from object
  function extractFromObject(obj, prefix = "") {
    if (!obj || typeof obj !== "object") return;

    for (const [key, value] of Object.entries(obj)) {
      if (
        key === "file_url" &&
        typeof value === "string" &&
        value.startsWith("http")
      ) {
        urls.push({ url: value, type: prefix || "unknown" });
      } else if (
        key === "s3_url" &&
        typeof value === "string" &&
        value.startsWith("http")
      ) {
        urls.push({ url: value, type: `${prefix}_s3` || "unknown_s3" });
      } else if (typeof value === "object") {
        extractFromObject(value, key);
      }
    }
  }

  extractFromObject(siltData);

  log.info(`Found ${urls.length} image URLs in SILT response`);
  return urls;
}

/**
 * Download image or PDF from URL using native Node.js https module
 * This avoids axios buffer size limitations
 */
async function downloadImage(url, siltId, index) {
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(url);
      const protocol = urlObj.protocol === "https:" ? https : http;

      const request = protocol.get(url, { timeout: 60000 }, (response) => {
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302) {
          const redirectUrl = response.headers.location;
          log.info(`Following redirect to: ${redirectUrl}`);
          return downloadImage(redirectUrl, siltId, index).then(resolve);
        }

        if (response.statusCode !== 200) {
          return resolve({
            success: false,
            error: `HTTP ${response.statusCode}: ${response.statusMessage}`,
          });
        }

        // Detect file type from Content-Type header
        const contentType = response.headers["content-type"] || "";
        const isPdf = contentType.includes("application/pdf");

        // Generate filename from URL or use index
        const pathParts = urlObj.pathname.split("/");
        let filename = pathParts[pathParts.length - 1] || `file_${index}`;

        // If filename from URL has no extension, add appropriate one based on content type
        if (!path.extname(filename)) {
          filename += isPdf ? ".pdf" : ".jpg";
        }

        // If Content-Type says PDF but filename doesn't end with .pdf, fix it
        if (isPdf && !filename.toLowerCase().endsWith(".pdf")) {
          filename = filename.replace(/\.(jpg|jpeg|png|gif)$/i, ".pdf");
        }

        const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");

        const localPath = path.join(
          LOCAL_TEMP_DIR,
          `${siltId}_${sanitizedFilename}`
        );

        const fileStream = fs.createWriteStream(localPath);
        let downloadedBytes = 0;

        response.on("data", (chunk) => {
          downloadedBytes += chunk.length;
        });

        response.pipe(fileStream);

        fileStream.on("finish", () => {
          fileStream.close();
          const fileType = isPdf ? "PDF" : "image";
          const sizeMB = (downloadedBytes / 1024 / 1024).toFixed(2);
          log.success(
            `Downloaded ${fileType}: ${sanitizedFilename} (${sizeMB} MB)`
          );
          resolve({
            success: true,
            localPath,
            filename: `${siltId}_${sanitizedFilename}`,
            fileType,
            size: downloadedBytes,
          });
        });

        fileStream.on("error", (error) => {
          log.error(
            `Error writing file ${sanitizedFilename}: ${error.message}`
          );
          resolve({ success: false, error: error.message });
        });
      });

      request.on("error", (error) => {
        log.error(`Error downloading from ${url}: ${error.message}`);
        resolve({ success: false, error: error.message });
      });

      request.on("timeout", () => {
        request.destroy();
        log.error(`Timeout downloading from ${url}`);
        resolve({ success: false, error: "Request timeout" });
      });
    } catch (error) {
      log.error(`Error downloading file from ${url}: ${error.message}`);
      resolve({ success: false, error: error.message });
    }
  });
}

/**
 * Upload files to remote server via SCP
 */
async function uploadFilesToRemote(localFiles, siltId) {
  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn.on("ready", () => {
      log.info(`SSH connection established to remote server`);

      // Create remote directory for this silt_id
      const remoteDir = `${REMOTE_BASE_DIR}/${siltId}`;

      conn.exec(`mkdir -p ${remoteDir}`, (err, stream) => {
        if (err) {
          conn.end();
          return reject(err);
        }

        stream.on("close", async (code) => {
          if (code !== 0) {
            conn.end();
            return reject(
              new Error(`Failed to create remote directory, exit code: ${code}`)
            );
          }

          log.info(`Created remote directory: ${remoteDir}`);

          // Upload each file using fastPut for better large file handling
          const uploadPromises = localFiles.map((file) => {
            return new Promise((resolveUpload, rejectUpload) => {
              const remotePath = `${remoteDir}/${file.filename}`;

              conn.sftp((err, sftp) => {
                if (err) return rejectUpload(err);

                // Use fastPut instead of streaming for better large file support
                sftp.fastPut(file.localPath, remotePath, (err) => {
                  if (err) return rejectUpload(err);

                  log.success(`Uploaded: ${file.filename} -> ${remotePath}`);

                  // Delete local file after successful upload
                  try {
                    fs.unlinkSync(file.localPath);
                  } catch (unlinkErr) {
                    // File might have been deleted already, ignore error
                    log.warn(
                      `Could not delete local file: ${unlinkErr.message}`
                    );
                  }

                  resolveUpload({ filename: file.filename, remotePath });
                });
              });
            });
          });

          try {
            const results = await Promise.all(uploadPromises);
            conn.end();
            resolve(results);
          } catch (error) {
            conn.end();
            reject(error);
          }
        });

        stream.on("data", (data) => {
          // Suppress stdout
        });

        stream.stderr.on("data", (data) => {
          log.warn(`STDERR: ${data}`);
        });
      });
    });

    conn.on("error", (err) => {
      log.error(`SSH connection error: ${err.message}`);
      reject(err);
    });

    conn.connect(REMOTE_SERVER);
  });
}

/**
 * Process a single SILT ID
 */
async function processSiltId(siltId, uuidUser, itemId, force = false) {
  try {
    // Check if already processed (skip check if force flag is set)
    if (!force) {
      const exists = await checkExistingSiltData(uuidUser, itemId);
      if (exists) {
        log.warn(`SILT data already exists for ${siltId}, skipping...`);
        stats.skipped++;
        return;
      }
    } else {
      log.info(
        `Force mode: Re-processing ${siltId} even though data may exist...`
      );
    }

    // Fetch SILT data from API
    const siltData = await fetchSiltData(siltId);

    // Save JSON to database
    await saveSiltJsonToDatabase(uuidUser, siltData, itemId);

    // Extract and download images
    const imageUrls = extractImageUrls(siltData);

    if (imageUrls.length === 0) {
      log.warn(`No images found for SILT ID: ${siltId}`);
      stats.success++;
      return;
    }

    // Download all images
    const downloadPromises = imageUrls.map((urlObj, index) =>
      downloadImage(urlObj.url, siltId, index)
    );

    const downloadResults = await Promise.all(downloadPromises);
    const successfulDownloads = downloadResults.filter((r) => r.success);

    if (successfulDownloads.length === 0) {
      log.warn(`No images successfully downloaded for SILT ID: ${siltId}`);
      stats.success++;
      return;
    }

    stats.imagesDownloaded += successfulDownloads.length;

    // Upload images to remote server
    log.info(
      `Uploading ${successfulDownloads.length} images to remote server...`
    );
    await uploadFilesToRemote(successfulDownloads, siltId);

    log.success(`Completed processing SILT ID: ${siltId}`);
    stats.success++;
  } catch (error) {
    log.error(`Failed to process SILT ID ${siltId}: ${error.message}`);
    stats.failed++;
    stats.errors.push({ siltId, error: error.message });
  }
}

/**
 * Main execution function
 */
async function main() {
  const startTime = new Date();

  console.log("\n=================================================");
  console.log("     SILT Data Fetcher Script");
  console.log("=================================================\n");

  try {
    // Ensure local temp directory exists
    ensureLocalDir();

    // Ensure database item exists
    const itemId = await ensureSiltJsonItem();

    // Check for command-line arguments
    const args = process.argv.slice(2);
    const retryFromIndex = args.indexOf("--retry-from");
    const retryFailedIndex = args.indexOf("--retry-failed");
    const forceMode = args.includes("--force");

    if (forceMode) {
      log.info(
        "🔄 Force mode enabled: Will re-download files even if data exists"
      );
    }

    let siltRecords;

    if (retryFromIndex !== -1 && args[retryFromIndex + 1]) {
      // Read SILT IDs from file
      const filePath = args[retryFromIndex + 1];
      log.info(`Reading SILT IDs from: ${filePath}`);
      siltRecords = await fetchSiltIdsFromFile(filePath);
    } else if (retryFailedIndex !== -1) {
      // Fetch only failed SILT IDs (those without silt_full_json data)
      log.info("Fetching only failed/missing SILT records...");
      const result = await pool.query(`
        SELECT DISTINCT v.silt_id, v.uuid_user
        FROM sec_cust.lnk_users_verif_level v
        LEFT JOIN sec_cust.lnk_users_extra_data e 
          ON v.uuid_user = e.uuid_user 
          AND e.id_item = (SELECT id_item FROM sec_cust.ms_item WHERE name = 'silt_full_json')
        WHERE v.silt_id IS NOT NULL
        AND v.silt_id != ''
        AND e.id IS NULL
        ORDER BY v.silt_id
      `);
      siltRecords = result.rows;
      log.info(`Found ${siltRecords.length} SILT IDs without data`);
    } else {
      // Fetch all SILT IDs (default behavior)
      siltRecords = await fetchSiltIds();
    }

    stats.total = siltRecords.length;

    if (siltRecords.length === 0) {
      log.warn("No SILT IDs found to process");
      return;
    }

    // Checkpoint file to track processed IDs
    const checkpointFile = path.join(__dirname, "silt-fetch-checkpoint.json");
    let processedIds = new Set();

    // Load checkpoint if it exists
    if (fs.existsSync(checkpointFile)) {
      try {
        const checkpoint = JSON.parse(fs.readFileSync(checkpointFile, "utf8"));
        processedIds = new Set(checkpoint.processedIds || []);
        log.info(
          `📋 Resuming from checkpoint: ${processedIds.size} IDs already processed`
        );
      } catch (err) {
        log.warn(`Could not load checkpoint: ${err.message}`);
      }
    }

    // Filter out already processed IDs
    const remainingRecords = siltRecords.filter(
      (r) => !processedIds.has(r.silt_id)
    );

    if (remainingRecords.length === 0) {
      log.info("✅ All records already processed! Checkpoint complete.");
      return;
    }

    log.info(
      `Starting to process ${remainingRecords.length} SILT IDs (${processedIds.size} already done)...\n`
    );

    const progressFile = path.join(__dirname, "silt-fetch-progress.txt");

    // Process each SILT ID sequentially (to avoid overwhelming API/SSH)
    for (let i = 0; i < remainingRecords.length; i++) {
      const record = remainingRecords[i];
      console.log(
        `\n--- Processing ${i + 1}/${remainingRecords.length} (${
          processedIds.size + i + 1
        }/${siltRecords.length} total) ---`
      );
      await processSiltId(record.silt_id, record.uuid_user, itemId, forceMode);

      // Save checkpoint after each successful processing
      processedIds.add(record.silt_id);
      fs.writeFileSync(
        checkpointFile,
        JSON.stringify({
          processedIds: Array.from(processedIds),
          lastUpdate: new Date().toISOString(),
        })
      );

      // Update progress file every 10 records
      if ((i + 1) % 10 === 0 || i === remainingRecords.length - 1) {
        const currentTime = new Date();
        const elapsed = Math.round((currentTime - startTime) / 1000);
        const progressPercent = (
          (processedIds.size / siltRecords.length) *
          100
        ).toFixed(1);
        const progressText = [
          "=================================================",
          "     SILT FETCH - PROGRESS UPDATE",
          "=================================================",
          `Last Updated: ${currentTime.toISOString()}`,
          `Progress: ${processedIds.size}/${siltRecords.length} (${progressPercent}%)`,
          `Elapsed Time: ${Math.floor(elapsed / 3600)}h ${Math.floor(
            (elapsed % 3600) / 60
          )}m ${elapsed % 60}s`,
          "",
          `Successful: ${stats.success}`,
          `Skipped: ${stats.skipped}`,
          `Failed: ${stats.failed}`,
          `Images Downloaded: ${stats.imagesDownloaded}`,
          "=================================================",
        ].join("\n");
        fs.writeFileSync(progressFile, progressText, "utf8");
      }

      // Small delay between requests to be nice to the API
      if (i < remainingRecords.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    // Delete checkpoint file after successful completion
    if (fs.existsSync(checkpointFile)) {
      fs.unlinkSync(checkpointFile);
      log.info("✅ Checkpoint file deleted - all records processed");
    }

    // Calculate execution time
    const endTime = new Date();
    const executionTime = Math.round((endTime - startTime) / 1000); // seconds
    const hours = Math.floor(executionTime / 3600);
    const minutes = Math.floor((executionTime % 3600) / 60);
    const seconds = executionTime % 60;

    // Build summary text
    const summaryLines = [
      "=================================================",
      "     SILT DATA FETCH - EXECUTION SUMMARY",
      "=================================================",
      `Start Time: ${startTime.toISOString()}`,
      `End Time: ${endTime.toISOString()}`,
      `Execution Time: ${hours}h ${minutes}m ${seconds}s`,
      "",
      "RESULTS:",
      `Total SILT IDs: ${stats.total}`,
      `Successful: ${stats.success} (${(
        (stats.success / stats.total) *
        100
      ).toFixed(1)}%)`,
      `Skipped (already exists): ${stats.skipped} (${(
        (stats.skipped / stats.total) *
        100
      ).toFixed(1)}%)`,
      `Failed: ${stats.failed} (${((stats.failed / stats.total) * 100).toFixed(
        1
      )}%)`,
      `Images Downloaded: ${stats.imagesDownloaded}`,
      "",
    ];

    if (stats.errors.length > 0) {
      summaryLines.push("ERRORS:");
      stats.errors.forEach((err) => {
        summaryLines.push(`  - ${err.siltId}: ${err.error}`);
      });
      summaryLines.push("");
    }

    summaryLines.push("=================================================");

    // Print to console
    console.log("\n" + summaryLines.join("\n") + "\n");

    // Save to file
    const summaryFile = path.join(
      __dirname,
      `silt-fetch-summary-${endTime.getFullYear()}${String(
        endTime.getMonth() + 1
      ).padStart(2, "0")}${String(endTime.getDate()).padStart(2, "0")}-${String(
        endTime.getHours()
      ).padStart(2, "0")}${String(endTime.getMinutes()).padStart(2, "0")}.txt`
    );
    fs.writeFileSync(summaryFile, summaryLines.join("\n"), "utf8");
    console.log(`📄 Summary saved to: ${summaryFile}\n`);
  } catch (error) {
    log.error(`Fatal error: ${error.message}`);
    console.error(error);
    process.exit(1);
  } finally {
    await pool.end();
    log.info("Database connection closed");
  }
}

// Run the script
main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
