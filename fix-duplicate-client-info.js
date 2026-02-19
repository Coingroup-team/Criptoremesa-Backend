const fs = require("fs");
const path = require("path");

/**
 * Script para eliminar líneas duplicadas de log.client_info
 */

const controllersDir = path.join(__dirname, "src", "modules");

function fixDuplicates(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    const originalContent = content;

    // Buscar bloques donde hay dos líneas consecutivas de client_info
    const duplicatePattern =
      /(\s+log\.client_info = req\.header\("Client-Info"\) \|\| null;)\s*\1/g;

    // Reemplazar con una sola línea
    content = content.replace(duplicatePattern, "$1");

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`✓ Fixed duplicates in: ${filePath}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      if (file !== "node_modules" && file !== ".git") {
        results = results.concat(walkDir(filePath));
      }
    } else if (file.endsWith(".controller.js")) {
      results.push(filePath);
    }
  });

  return results;
}

console.log(
  "🔍 Searching for controller files with duplicate client_info lines...\n",
);
const controllerFiles = walkDir(controllersDir);

console.log(`📄 Found ${controllerFiles.length} controller files\n`);

let fixedCount = 0;
controllerFiles.forEach((file) => {
  if (fixDuplicates(file)) {
    fixedCount++;
  }
});

console.log(`\n✅ Fixed ${fixedCount} controller files`);
