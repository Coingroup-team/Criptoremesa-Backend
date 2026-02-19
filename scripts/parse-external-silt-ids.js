/**
 * Parse External SILT IDs from Untitled-1 file
 *
 * This script reads the untitled file with public_ids grouped by flow,
 * and creates the properly formatted input file for fetch-external-silt-data.js
 *
 * Input format:
 *   FlowName
 *   "public_id": "xxx-xxx-xxx-xxx"
 *   ...
 *
 * Output format:
 *   FlowName|xxx-xxx-xxx-xxx
 *
 * Usage: node scripts/parse-external-silt-ids.js <input-file> <output-file>
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Default paths
const DEFAULT_INPUT = path.join(__dirname, "../untitled-silt-ids.txt");
const DEFAULT_OUTPUT = path.join(__dirname, "external-silt-ids.txt");

function parseFile(inputPath, outputPath) {
  console.log(`Reading from: ${inputPath}`);
  console.log(`Writing to: ${outputPath}`);

  const content = fs.readFileSync(inputPath, "utf8");
  const lines = content.split("\n");

  let currentFlow = null;
  const records = [];
  const flowCounts = {};

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) continue;

    // Check if this is a flow name line (no quotes, no commas)
    if (!trimmed.includes('"') && !trimmed.includes(",")) {
      currentFlow = trimmed;
      if (!flowCounts[currentFlow]) {
        flowCounts[currentFlow] = 0;
      }
      console.log(`\nFound flow: ${currentFlow}`);
      continue;
    }

    // Extract public_id from line like: "public_id": "xxx-xxx-xxx-xxx",
    const match = trimmed.match(/"public_id":\s*"([0-9a-f-]+)"/i);
    if (match && currentFlow) {
      const publicId = match[1];
      records.push(`${currentFlow}|${publicId}`);
      flowCounts[currentFlow]++;
    }
  }

  // Write output file
  const header = [
    "# External SILT Flow IDs",
    "# Generated: " + new Date().toISOString(),
    "# Format: flow_name|public_id",
    "# Lines starting with # are comments",
    "",
  ];

  const lines_with_header = [...header, ...records];

  fs.writeFileSync(outputPath, lines_with_header.join("\n"), "utf8");

  // Print summary
  console.log("\n" + "=".repeat(60));
  console.log("PARSING COMPLETE");
  console.log("=".repeat(60));
  console.log(`Total records: ${records.length}`);
  console.log("\nBy flow:");
  Object.entries(flowCounts).forEach(([flow, count]) => {
    console.log(`  ${flow}: ${count} IDs`);
  });
  console.log("=".repeat(60));
  console.log(`\nOutput written to: ${outputPath}`);
  console.log("\nNext step:");
  console.log("  node scripts/fetch-external-silt-data.js");
}

// Main
const args = process.argv.slice(2);
const inputPath = args[0] || DEFAULT_INPUT;
const outputPath = args[1] || DEFAULT_OUTPUT;

try {
  if (!fs.existsSync(inputPath)) {
    console.error(`ERROR: Input file not found: ${inputPath}`);
    console.error(
      "\nUsage: node scripts/parse-external-silt-ids.js <input-file> [output-file]"
    );
    process.exit(1);
  }

  parseFile(inputPath, outputPath);
} catch (error) {
  console.error("ERROR:", error.message);
  process.exit(1);
}
