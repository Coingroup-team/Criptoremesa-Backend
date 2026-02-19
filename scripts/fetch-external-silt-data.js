/**
 * External SILT Data Fetcher Script
 *
 * This script fetches SILT data for external flows (not linked to internal users):
 * - Venezolanos.es
 * - R-CONECTA
 * - ChilePoz
 * - EuropaChilePoz
 *
 * Features:
 * 1. Reads public_ids from input file (format: flow_name|public_id)
 * 2. Calls SILT API using new credentials
 * 3. Stores JSON in sec_cust.lnk_external_silt_data
 * 4. Downloads images to flow-specific directories
 * 5. NO FILE SIZE LIMITS (learned from previous issues)
 *
 * Usage:
 *   node scripts/fetch-external-silt-data.js
 *   node scripts/fetch-external-silt-data.js --flow Venezolanos.es
 *   node scripts/fetch-external-silt-data.js --retry-failed
 */

import dotenv from "dotenv";
import { Pool } from "pg";
import axios from "axios";
import fs from "fs";
import path from "path";
import { Client } from "ssh2";
import { promisify } from "util";
import { pipeline } from "stream";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const streamPipeline = promisify(pipeline);

// ============================================================================
// CONFIGURATION
// ============================================================================

const SILT_API_BASE_URL = "https://api.siltapp.com/v1/users";

// NEW CREDENTIALS - Four credential pairs for external flows
const SILT_API_CREDENTIALS = [
  {
    name: "Venezolanos.es",
    appId: "407ac740-daf8-4b89-bd38-5dc614a11f68",
    token: "d13ddc2f-2704-4ea1-8333-9471379240d2",
  },
  {
    name: "R-CONECTA",
    appId: "0fcbc14b-172c-49df-850a-8615caa46182",
    token: "bfd9de07-fb91-47f7-8b30-55b2ba75bf43",
  },
  {
    name: "ChilePoz",
    appId: "112aa700-c2bd-4fca-87a4-a620ae2f2cea",
    token: "d82eb364-27aa-4dde-a667-bb6ce6715c19",
  },
  {
    name: "EuropaChilePoz",
    appId: "0e348ff7-2562-4110-93e1-513a01b0159f",
    token: "561b110d-6050-444f-880b-404628d963b8",
  },
];

// Remote server configuration (same as existing SILT setup)
const REMOTE_SERVER = {
  host: "ec2-3-143-246-144.us-east-2.compute.amazonaws.com",
  port: 22,
  username: "devarodriguez",
  privateKey: fs.readFileSync(
    path.join(__dirname, "../aws-devapp2-03Jan21.pem")
  ),
};

// Base directory structure: /repo-cr/external-silt-data/{flow_name}/{public_id}/
const REMOTE_BASE_DIR = "/repo-cr/external-silt-data";
const LOCAL_TEMP_DIR = path.join(__dirname, "../temp-external-silt");

// Input file with flow_name|public_id format
const INPUT_FILE = path.join(__dirname, "external-silt-ids.txt");
const FAILED_FILE = path.join(__dirname, "external-silt-failed.txt");

// Database configuration
const pool = new Pool({
  user: process.env.PG_DB_SM_USER || "postgres",
  host: process.env.PG_DB_SM_HOST || "localhost",
  database: process.env.PG_DB_SM_NAME || "criptoremesa_db",
  password: process.env.PG_DB_SM_PASSWORD,
  port: process.env.PG_DB_SM_PORT || 5432,
});

// ============================================================================
// LOGGER & STATISTICS
// ============================================================================

const log = {
  info: (msg) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`),
  error: (msg) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`),
  success: (msg) =>
    console.log(`[SUCCESS] ${new Date().toISOString()} - ${msg}`),
  warn: (msg) => console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`),
};

const stats = {
  total: 0,
  success: 0,
  failed: 0,
  skipped: 0,
  imagesDownloaded: 0,
  byFlow: {},
  errors: [],
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function ensureLocalDir() {
  if (!fs.existsSync(LOCAL_TEMP_DIR)) {
    fs.mkdirSync(LOCAL_TEMP_DIR, { recursive: true });
    log.info(`Created temp directory: ${LOCAL_TEMP_DIR}`);
  }
}

/**
 * Read input file with format: flow_name|public_id
 */
function readInputFile(filterFlow = null) {
  try {
    if (!fs.existsSync(INPUT_FILE)) {
      throw new Error(`Input file not found: ${INPUT_FILE}`);
    }

    const fileContent = fs.readFileSync(INPUT_FILE, "utf8");
    const records = fileContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const [flow_name, public_id] = line.split("|");
        return { flow_name: flow_name?.trim(), public_id: public_id?.trim() };
      })
      .filter((r) => r.flow_name && r.public_id);

    let filteredRecords = records;
    if (filterFlow) {
      filteredRecords = records.filter((r) => r.flow_name === filterFlow);
      log.info(
        `Filtered ${filteredRecords.length} records for flow: ${filterFlow}`
      );
    }

    log.info(`Read ${filteredRecords.length} records from input file`);

    // Initialize stats by flow
    [...new Set(filteredRecords.map((r) => r.flow_name))].forEach((flow) => {
      stats.byFlow[flow] = { total: 0, success: 0, failed: 0 };
    });

    return filteredRecords;
  } catch (error) {
    log.error(`Error reading input file: ${error.message}`);
    throw error;
  }
}

/**
 * Get credentials for a specific flow
 */
function getCredentialsForFlow(flowName) {
  const creds = SILT_API_CREDENTIALS.find(
    (c) => c.name.toLowerCase() === flowName.toLowerCase()
  );

  if (!creds) {
    // Fallback: try to match partial names
    const match = SILT_API_CREDENTIALS.find((c) =>
      flowName.toLowerCase().includes(c.name.toLowerCase())
    );
    if (match) return match;

    // Default to first credentials if no match
    log.warn(`No specific credentials found for ${flowName}, using default`);
    return SILT_API_CREDENTIALS[0];
  }

  return creds;
}

/**
 * Check if record already exists in database
 */
async function recordExists(flowName, publicId) {
  try {
    const result = await pool.query(
      `SELECT id_external_silt FROM sec_cust.lnk_external_silt_data 
       WHERE flow_name = $1 AND public_id = $2`,
      [flowName, publicId]
    );
    return result.rows.length > 0;
  } catch (error) {
    log.error(`Error checking if record exists: ${error.message}`);
    return false;
  }
}

/**
 * Fetch SILT data from API
 */
async function fetchSiltData(flowName, publicId) {
  const credentials = getCredentialsForFlow(flowName);
  const url = `${SILT_API_BASE_URL}/${publicId}/status/`;

  try {
    log.info(`Fetching data for ${flowName}/${publicId}`);

    const response = await axios.get(url, {
      headers: {
        "X-Company-App-Id": credentials.appId,
        "X-Company-App-API-Token": credentials.token,
      },
      timeout: 30000,
      maxContentLength: Infinity, // ✅ NO SIZE LIMIT
      maxBodyLength: Infinity, // ✅ NO SIZE LIMIT
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`API returned status ${response.status}`);
    }
  } catch (error) {
    if (error.response) {
      throw new Error(
        `API Error ${error.response.status}: ${
          error.response.data?.message || error.response.statusText
        }`
      );
    } else {
      throw new Error(`Network Error: ${error.message}`);
    }
  }
}

/**
 * Save SILT data to database
 */
async function saveSiltData(flowName, publicId, siltData) {
  try {
    // Add flow_name to the JSON before storing
    const dataWithFlow = {
      ...siltData,
      flow_name: flowName,
      public_id: publicId,
    };

    const query = `
      INSERT INTO sec_cust.lnk_external_silt_data 
        (flow_name, public_id, silt_data, date_creation, date_modification)
      VALUES ($1, $2, $3, NOW(), NOW())
      ON CONFLICT (flow_name, public_id) 
      DO UPDATE SET 
        silt_data = EXCLUDED.silt_data,
        date_modification = NOW()
      RETURNING id_external_silt
    `;

    const result = await pool.query(query, [
      flowName,
      publicId,
      JSON.stringify(dataWithFlow),
    ]);

    log.success(
      `Saved SILT data for ${flowName}/${publicId} (ID: ${result.rows[0].id_external_silt})`
    );
    return true;
  } catch (error) {
    log.error(`Error saving to database: ${error.message}`);
    throw error;
  }
}

/**
 * Download image from URL (NO SIZE LIMIT)
 */
async function downloadImage(imageUrl, localPath) {
  try {
    const response = await axios({
      method: "GET",
      url: imageUrl,
      responseType: "stream",
      timeout: 60000,
      maxContentLength: Infinity, // ✅ NO SIZE LIMIT
      maxBodyLength: Infinity, // ✅ NO SIZE LIMIT
    });

    await streamPipeline(response.data, fs.createWriteStream(localPath));
    return true;
  } catch (error) {
    log.error(`Error downloading image ${imageUrl}: ${error.message}`);
    return false;
  }
}

/**
 * Extract image URLs from SILT data
 */
function extractImageUrls(siltData) {
  const images = [];

  try {
    // Log the structure for debugging (first time only)
    if (stats.success === 0) {
      log.info("SILT API Response Structure:");
      log.info(JSON.stringify(siltData, null, 2).substring(0, 500) + "...");
    }

    const data = siltData.data || siltData;

    // Method 1: Check standard fields
    const imageFields = {
      front_document_path: "front",
      back_document_path: "back",
      selfie_path: "selfie",
      document_front_url: "front",
      document_back_url: "back",
      selfie_url: "selfie",
      front_document: "front",
      back_document: "back",
      selfie: "selfie",
    };

    Object.entries(imageFields).forEach(([field, type]) => {
      const url = data[field];
      if (
        url &&
        typeof url === "string" &&
        (url.startsWith("http") || url.startsWith("https"))
      ) {
        images.push({ url, type });
      }
    });

    // Method 2: Check documents array
    if (data.documents && Array.isArray(data.documents)) {
      data.documents.forEach((doc, idx) => {
        if (doc.front_url)
          images.push({ url: doc.front_url, type: `front-${idx}` });
        if (doc.back_url)
          images.push({ url: doc.back_url, type: `back-${idx}` });
        if (doc.url) images.push({ url: doc.url, type: `doc-${idx}` });
        if (doc.image_url)
          images.push({ url: doc.image_url, type: `doc-${idx}` });
      });
    }

    // Method 3: Check images array
    if (data.images && Array.isArray(data.images)) {
      data.images.forEach((img, idx) => {
        const url = typeof img === "string" ? img : img.url;
        if (url && (url.startsWith("http") || url.startsWith("https"))) {
          images.push({ url, type: img.type || `image-${idx}` });
        }
      });
    }

    // Method 4: Check verification_data nested structure
    if (data.verification_data) {
      const vd = data.verification_data;
      if (vd.document_front)
        images.push({ url: vd.document_front, type: "front" });
      if (vd.document_back)
        images.push({ url: vd.document_back, type: "back" });
      if (vd.selfie) images.push({ url: vd.selfie, type: "selfie" });
    }

    // Method 5: Deep search for any URL-like strings
    const findUrls = (obj, prefix = "") => {
      if (!obj || typeof obj !== "object") return;

      Object.entries(obj).forEach(([key, value]) => {
        if (
          typeof value === "string" &&
          (value.startsWith("http://") || value.startsWith("https://"))
        ) {
          // Check if it looks like an image URL
          if (
            value.match(/\.(jpg|jpeg|png|gif|webp|pdf)($|\?)/i) ||
            key.toLowerCase().includes("image") ||
            key.toLowerCase().includes("document") ||
            key.toLowerCase().includes("selfie") ||
            key.toLowerCase().includes("photo")
          ) {
            images.push({ url: value, type: key });
          }
        } else if (typeof value === "object" && value !== null) {
          findUrls(value, `${prefix}${key}.`);
        }
      });
    };

    findUrls(data);

    return images;
  } catch (error) {
    log.error(`Error extracting image URLs: ${error.message}`);
    return [];
  }
}

/**
 * Upload directory to remote server via SSH
 */
async function uploadToRemote(flowName, publicId, localDir) {
  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn
      .on("ready", () => {
        log.info(`SSH connection established for ${flowName}/${publicId}`);

        const remoteFlowDir = `${REMOTE_BASE_DIR}/${flowName}`;
        const remoteDir = `${remoteFlowDir}/${publicId}`;

        // Create flow directory and public_id subdirectory
        conn.exec(`mkdir -p "${remoteDir}"`, (err, stream) => {
          if (err) {
            conn.end();
            return reject(err);
          }

          stream.on("close", (code) => {
            if (code !== 0) {
              conn.end();
              return reject(
                new Error(
                  `Failed to create remote directory, exit code: ${code}`
                )
              );
            }

            log.info(`Created remote directory: ${remoteDir}`);

            // Get list of files to upload
            const files = fs.readdirSync(localDir);

            if (files.length === 0) {
              log.warn(`No files to upload for ${flowName}/${publicId}`);
              conn.end();
              return resolve(0);
            }

            // Upload each file using fastPut for better large file handling
            const uploadPromises = files.map((file) => {
              return new Promise((resolveUpload, rejectUpload) => {
                const localFile = path.join(localDir, file);
                const remoteFile = `${remoteDir}/${file}`;

                conn.sftp((err, sftp) => {
                  if (err) return rejectUpload(err);

                  // Use fastPut for better large file support
                  sftp.fastPut(localFile, remoteFile, (err) => {
                    if (err) {
                      log.error(`Error uploading ${file}: ${err.message}`);
                      return rejectUpload(err);
                    }

                    log.success(`Uploaded: ${remoteFile}`);
                    stats.imagesDownloaded++;
                    resolveUpload({ filename: file, remotePath: remoteFile });
                  });
                });
              });
            });

            // Wait for all uploads to complete
            Promise.all(uploadPromises)
              .then((results) => {
                conn.end();
                resolve(results.length);
              })
              .catch((error) => {
                conn.end();
                reject(error);
              });
          });

          stream.on("data", (data) => {
            // Suppress stdout
          });

          stream.stderr.on("data", (data) => {
            log.warn(`STDERR: ${data}`);
          });
        });
      })
      .on("error", (err) => {
        log.error(`SSH connection error: ${err.message}`);
        reject(err);
      })
      .connect(REMOTE_SERVER);
  });
}

/**
 * Process images for a record
 */
async function processImages(flowName, publicId, siltData) {
  const imageUrls = extractImageUrls(siltData);

  if (imageUrls.length === 0) {
    log.warn(`No images found for ${flowName}/${publicId}`);
    return 0;
  }

  log.info(`Found ${imageUrls.length} images for ${flowName}/${publicId}`);

  // Create local directory for this record
  const localRecordDir = path.join(LOCAL_TEMP_DIR, flowName, publicId);
  if (!fs.existsSync(localRecordDir)) {
    fs.mkdirSync(localRecordDir, { recursive: true });
  }

  // Download all images
  let downloadedCount = 0;
  for (let i = 0; i < imageUrls.length; i++) {
    const { url, type } = imageUrls[i];
    const filename = `${publicId}_${type}-${i + 1}.jpg`;
    const localPath = path.join(localRecordDir, filename);

    const success = await downloadImage(url, localPath);
    if (success) downloadedCount++;
  }

  if (downloadedCount > 0) {
    // Upload to remote server
    try {
      await uploadToRemote(flowName, publicId, localRecordDir);
      log.success(
        `Uploaded ${downloadedCount} images for ${flowName}/${publicId}`
      );
    } catch (error) {
      log.error(`Error uploading images: ${error.message}`);
    }

    // Clean up local files
    fs.rmSync(localRecordDir, { recursive: true, force: true });
  }

  return downloadedCount;
}

/**
 * Process a single record
 */
async function processRecord(flowName, publicId, force = false) {
  try {
    stats.byFlow[flowName].total++;

    // Check if already processed
    if (!force && (await recordExists(flowName, publicId))) {
      log.info(`Skipping ${flowName}/${publicId} - already exists`);
      stats.skipped++;
      return { success: true, skipped: true };
    }

    // Fetch data from SILT API
    const siltData = await fetchSiltData(flowName, publicId);

    // Save to database
    await saveSiltData(flowName, publicId, siltData);

    // Process images
    await processImages(flowName, publicId, siltData);

    stats.success++;
    stats.byFlow[flowName].success++;

    return { success: true };
  } catch (error) {
    log.error(`Failed to process ${flowName}/${publicId}: ${error.message}`);
    stats.failed++;
    stats.byFlow[flowName].failed++;
    stats.errors.push({ flowName, publicId, error: error.message });

    // Write to failed file
    fs.appendFileSync(FAILED_FILE, `${flowName}|${publicId}\n`);

    return { success: false, error: error.message };
  }
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const filterFlow = args.find((a) => a.startsWith("--flow="))?.split("=")[1];
  const force = args.includes("--force");
  const retryFailed = args.includes("--retry-failed");

  log.info("=".repeat(80));
  log.info("EXTERNAL SILT DATA FETCHER");
  log.info("=".repeat(80));
  log.info(`Filter Flow: ${filterFlow || "ALL"}`);
  log.info(`Force Mode: ${force ? "YES" : "NO"}`);
  log.info(`Retry Failed: ${retryFailed ? "YES" : "NO"}`);
  log.info("=".repeat(80));

  ensureLocalDir();

  // Clear failed file if not retrying
  if (!retryFailed && fs.existsSync(FAILED_FILE)) {
    fs.unlinkSync(FAILED_FILE);
  }

  // Read input file
  const records = readInputFile(filterFlow);
  stats.total = records.length;

  if (records.length === 0) {
    log.warn("No records to process!");
    return;
  }

  // Process records
  log.info(`Processing ${records.length} records...`);

  for (let i = 0; i < records.length; i++) {
    const { flow_name, public_id } = records[i];
    log.info(
      `\n[${i + 1}/${records.length}] Processing ${flow_name}/${public_id}`
    );

    await processRecord(flow_name, public_id, force);

    // Small delay to avoid rate limiting
    if (i < records.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  // Print summary
  log.info("\n" + "=".repeat(80));
  log.info("SUMMARY");
  log.info("=".repeat(80));
  log.info(`Total Records: ${stats.total}`);
  log.info(`Successful: ${stats.success}`);
  log.info(`Failed: ${stats.failed}`);
  log.info(`Skipped: ${stats.skipped}`);
  log.info(`Images Downloaded: ${stats.imagesDownloaded}`);
  log.info("\nBy Flow:");
  Object.entries(stats.byFlow).forEach(([flow, s]) => {
    log.info(`  ${flow}: ${s.success}/${s.total} success, ${s.failed} failed`);
  });

  if (stats.errors.length > 0) {
    log.info(`\nFailed records written to: ${FAILED_FILE}`);
    log.info("Run with --retry-failed to retry failed records");
  }

  log.info("=".repeat(80));

  await pool.end();
  process.exit(stats.failed > 0 ? 1 : 0);
}

// Run
main().catch((error) => {
  log.error(`Fatal error: ${error.message}`);
  pool.end();
  process.exit(1);
});
