import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the external flows IDs file
const inputPath = path.join(__dirname, "external-flows-ids.json");
const content = fs.readFileSync(inputPath, "utf8");

let currentFlow = null;
const records = [];
const flowCounts = {};

content.split("\n").forEach((line) => {
  const trimmed = line.trim();

  // Skip empty lines
  if (!trimmed) return;

  // Check if this is a flow name line (no quotes, no commas)
  if (!trimmed.includes('"') && !trimmed.includes(",")) {
    currentFlow = trimmed;
    if (!flowCounts[currentFlow]) {
      flowCounts[currentFlow] = 0;
    }
    console.log(`Found flow: ${currentFlow}`);
    return;
  }

  // Extract public_id from line like: "public_id": "xxx-xxx-xxx-xxx",
  const match = trimmed.match(/"public_id":\s*"([0-9a-f-]+)"/i);
  if (match && currentFlow) {
    const publicId = match[1];
    records.push(`${currentFlow}|${publicId}`);
    flowCounts[currentFlow]++;
  }
});

// Write output file
const output = [
  "# External SILT Flow IDs",
  "# Generated: " + new Date().toISOString(),
  "# Format: flow_name|public_id",
  "# Lines starting with # are comments",
  "",
  ...records,
];

const outputPath = path.join(__dirname, "external-silt-ids.txt");
fs.writeFileSync(outputPath, output.join("\n"), "utf8");

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
