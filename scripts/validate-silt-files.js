import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SILT_DATA_DIR = "/repo-cr/silt-data";

// Common truncation sizes (powers of 2 and common buffer sizes)
const SUSPICIOUS_SIZES = [
  65536, // 64 KB
  131072, // 128 KB
  196608, // 192 KB
  262144, // 256 KB
  524288, // 512 KB
  1048576, // 1 MB
  2097152, // 2 MB
];

console.log("🔍 Comprehensive SILT File Validation\n");
console.log("Checking for:");
console.log("  1. Files truncated at suspicious buffer sizes");
console.log("  2. Corrupted PDF files (missing EOF marker)");
console.log("  3. PDFs disguised as JPG files");
console.log("  4. Suspiciously small files\n");

const issues = {
  truncatedAtBufferSize: new Set(),
  corruptedPDFs: new Set(),
  pdfAsJpg: new Set(),
  tooSmall: new Set(),
};

let totalFiles = 0;
let totalPDFs = 0;
let totalImages = 0;

// Read all SILT directories
const siltDirs = fs.readdirSync(SILT_DATA_DIR);

for (const siltId of siltDirs) {
  const dirPath = path.join(SILT_DATA_DIR, siltId);

  if (!fs.statSync(dirPath).isDirectory()) continue;

  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    if (!/\.(jpg|jpeg|png|gif|webp|pdf)$/i.test(file)) continue;

    totalFiles++;
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    const isClaimedPDF = file.toLowerCase().endsWith(".pdf");

    if (isClaimedPDF) totalPDFs++;
    else totalImages++;

    // Check 1: Truncated at suspicious buffer sizes
    if (SUSPICIOUS_SIZES.includes(stats.size)) {
      issues.truncatedAtBufferSize.add(siltId);
      console.log(
        `⚠️  SUSPICIOUS SIZE: ${siltId}/${file} (${stats.size} bytes = ${
          stats.size / 1024
        } KB)`
      );
    }

    // Check 2 & 3: Read first 8 bytes to detect file type
    const fd = fs.openSync(filePath, "r");
    const header = Buffer.alloc(8);
    fs.readSync(fd, header, 0, 8, 0);

    const isPDFContent = header.toString("ascii", 0, 4) === "%PDF";

    // Check 3: PDF content saved as JPG
    if (isPDFContent && !isClaimedPDF) {
      issues.pdfAsJpg.add(siltId);
      console.log(
        `🔴 PDF AS JPG: ${siltId}/${file} (PDF content with .jpg extension)`
      );
    }

    // Check 2: Corrupted PDF (missing EOF marker)
    if (isPDFContent || isClaimedPDF) {
      // Read last 1024 bytes to check for %%EOF
      const tailSize = Math.min(1024, stats.size);
      const tail = Buffer.alloc(tailSize);
      fs.readSync(fd, tail, 0, tailSize, stats.size - tailSize);
      fs.closeSync(fd);

      const tailStr = tail.toString("ascii");
      if (!tailStr.includes("%%EOF")) {
        issues.corruptedPDFs.add(siltId);
        console.log(
          `❌ CORRUPTED PDF: ${siltId}/${file} (missing %%EOF marker, likely truncated)`
        );
      }
    } else {
      fs.closeSync(fd);
    }

    // Check 4: Suspiciously small files (less than 10 KB)
    if (stats.size < 10240 && !file.match(/^.*_V-/)) {
      // Exclude video frames which can be small
      issues.tooSmall.add(siltId);
      console.log(
        `⚠️  SMALL FILE: ${siltId}/${file} (${stats.size} bytes = ${(
          stats.size / 1024
        ).toFixed(2)} KB)`
      );
    }
  }
}

// Combine all affected SILT IDs
const allAffectedIds = new Set([
  ...issues.truncatedAtBufferSize,
  ...issues.corruptedPDFs,
  ...issues.pdfAsJpg,
  ...issues.tooSmall,
]);

console.log("\n========================================");
console.log("📊 VALIDATION SUMMARY");
console.log("========================================");
console.log(`Total files scanned: ${totalFiles}`);
console.log(`  - PDFs: ${totalPDFs}`);
console.log(`  - Images: ${totalImages}`);
console.log("");
console.log("🔴 ISSUES FOUND:");
console.log(
  `  - Truncated at buffer sizes: ${issues.truncatedAtBufferSize.size} SILT IDs`
);
console.log(
  `  - Corrupted PDFs (no EOF): ${issues.corruptedPDFs.size} SILT IDs`
);
console.log(`  - PDFs disguised as JPG: ${issues.pdfAsJpg.size} SILT IDs`);
console.log(`  - Suspiciously small files: ${issues.tooSmall.size} SILT IDs`);
console.log("");
console.log(`✅ TOTAL AFFECTED SILT IDs: ${allAffectedIds.size}`);
console.log(`✅ HEALTHY SILT IDs: ${siltDirs.length - allAffectedIds.size}`);
console.log("========================================\n");

// Save affected SILT IDs to file
if (allAffectedIds.size > 0) {
  const outputFile = path.join(__dirname, "corrupted-silt-ids.txt");
  fs.writeFileSync(outputFile, Array.from(allAffectedIds).sort().join("\n"));
  console.log(`✅ Saved affected SILT IDs to: ${outputFile}\n`);
  console.log("To fix these records, run:");
  console.log(
    "node fetch-silt-data.js --retry-from corrupted-silt-ids.txt --force\n"
  );
} else {
  console.log("🎉 All files appear to be valid!\n");
}
