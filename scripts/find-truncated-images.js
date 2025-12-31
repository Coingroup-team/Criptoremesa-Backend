import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SILT_DATA_DIR = "/repo-cr/silt-data";
const TRUNCATED_SIZE_192KB = 196608; // 192 KB in bytes
const TRUNCATED_SIZE_256KB = 262144; // 256 KB in bytes

console.log("Scanning for truncated files (192 KB or 256 KB)...\n");

const truncatedRecords = new Set();
let totalFiles = 0;
let truncated192Count = 0;
let truncated256Count = 0;

// Read all SILT directories
const siltDirs = fs.readdirSync(SILT_DATA_DIR);

for (const siltId of siltDirs) {
  const dirPath = path.join(SILT_DATA_DIR, siltId);

  if (!fs.statSync(dirPath).isDirectory()) continue;

  // Read all images AND PDFs in this SILT directory
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    // Check for images AND PDFs
    if (/\.(jpg|jpeg|png|gif|webp|pdf)$/i.test(file)) {
      totalFiles++;
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);

      if (stats.size === TRUNCATED_SIZE_192KB) {
        truncated192Count++;
        truncatedRecords.add(siltId);
        const fileType = file.toLowerCase().endsWith(".pdf") ? "PDF" : "IMAGE";
        console.log(`❌ TRUNCATED ${fileType} (192 KB): ${siltId}/${file}`);
      } else if (stats.size === TRUNCATED_SIZE_256KB) {
        truncated256Count++;
        truncatedRecords.add(siltId);
        const fileType = file.toLowerCase().endsWith(".pdf") ? "PDF" : "IMAGE";
        console.log(`❌ TRUNCATED ${fileType} (256 KB): ${siltId}/${file}`);
      }
    }
  }
}

console.log(`\n========================================`);
console.log(`Total files scanned (images + PDFs): ${totalFiles}`);
console.log(`Truncated at 192 KB: ${truncated192Count}`);
console.log(`Truncated at 256 KB: ${truncated256Count}`);
console.log(`Total truncated: ${truncated192Count + truncated256Count}`);
console.log(`SILT records affected: ${truncatedRecords.size}`);
console.log(`========================================\n`);

if (truncatedRecords.size > 0) {
  console.log("SILT IDs with truncated files (images + PDFs):");
  console.log(Array.from(truncatedRecords).join("\n"));

  // Save to file for easy re-fetching
  const outputFile = path.join(__dirname, "truncated-silt-ids.txt");
  fs.writeFileSync(outputFile, Array.from(truncatedRecords).join("\n"));
  console.log(`\n✅ Saved list to: ${outputFile}`);
  console.log("\nTo re-fetch these records, run:");
  console.log("node fetch-silt-data.js --retry-from truncated-silt-ids.txt");
} else {
  console.log("✅ No truncated files found! All files are complete.");
}
