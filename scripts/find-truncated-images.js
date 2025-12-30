import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SILT_DATA_DIR = "/repo-cr/silt-data";
const TRUNCATED_SIZE = 196608; // 192 KB in bytes

console.log("Scanning for truncated images (exactly 192 KB)...\n");

const truncatedRecords = new Set();
let totalImages = 0;
let truncatedCount = 0;

// Read all SILT directories
const siltDirs = fs.readdirSync(SILT_DATA_DIR);

for (const siltId of siltDirs) {
  const dirPath = path.join(SILT_DATA_DIR, siltId);

  if (!fs.statSync(dirPath).isDirectory()) continue;

  // Read all images in this SILT directory
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(file)) {
      totalImages++;
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);

      if (stats.size === TRUNCATED_SIZE) {
        truncatedCount++;
        truncatedRecords.add(siltId);
        console.log(`❌ TRUNCATED: ${siltId}/${file} (${stats.size} bytes)`);
      }
    }
  }
}

console.log(`\n========================================`);
console.log(`Total images scanned: ${totalImages}`);
console.log(`Truncated images found: ${truncatedCount}`);
console.log(`SILT records affected: ${truncatedRecords.size}`);
console.log(`========================================\n`);

if (truncatedRecords.size > 0) {
  console.log("SILT IDs with truncated images:");
  console.log(Array.from(truncatedRecords).join("\n"));

  // Save to file for easy re-fetching
  const outputFile = path.join(__dirname, "truncated-silt-ids.txt");
  fs.writeFileSync(outputFile, Array.from(truncatedRecords).join("\n"));
  console.log(`\n✅ Saved list to: ${outputFile}`);
  console.log("\nTo re-fetch these records, run:");
  console.log("node fetch-silt-data.js --retry-from truncated-silt-ids.txt");
}
