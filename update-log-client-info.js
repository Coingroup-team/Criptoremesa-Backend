const fs = require("fs");
const path = require("path");

/**
 * Script para agregar soporte de Client-Info header en todos los controladores
 * Actualiza:
 * 1. logConst para incluir client_info
 * 2. Todas las asignaciones de log.ip para también incluir log.client_info
 */

const controllersDir = path.join(__dirname, "src", "modules");

// Patrón para encontrar logConst
const logConstPattern = /const logConst = \{[\s\S]*?session: null,?\s*\};/g;

// Nuevo logConst con client_info
const newLogConst = `const logConst = {
  is_auth: null,
  success: true,
  failed: false,
  ip: null,
  country: null,
  route: null,
  session: null,
  client_info: null,
};`;

// Patrón para encontrar log.ip = req.header("Client-Ip");
const logIpPattern = /(log\.ip = req\.header\("Client-Ip"\);)/g;

// Nuevo código que incluye client_info
const newLogIpCode = `log.ip = req.header("Client-Ip");
    log.client_info = req.header("Client-Info") || null;`;

function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    let modified = false;

    // Actualizar logConst
    if (content.match(logConstPattern)) {
      content = content.replace(logConstPattern, newLogConst);
      modified = true;
      console.log(`✓ Updated logConst in: ${filePath}`);
    }

    // Actualizar log.ip assignments
    const matches = content.match(logIpPattern);
    if (matches) {
      content = content.replace(logIpPattern, newLogIpCode);
      modified = true;
      console.log(
        `✓ Updated ${matches.length} log.ip assignment(s) in: ${filePath}`,
      );
    }

    if (modified) {
      fs.writeFileSync(filePath, content, "utf8");
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

console.log("🔍 Searching for controller files...\n");
const controllerFiles = walkDir(controllersDir);

console.log(`📄 Found ${controllerFiles.length} controller files\n`);

let updatedCount = 0;
controllerFiles.forEach((file) => {
  if (updateFile(file)) {
    updatedCount++;
  }
});

console.log(`\n✅ Updated ${updatedCount} controller files`);
console.log("\n⚠️  Next steps:");
console.log(
  "1. Update the database stored procedure SP_LOGS_ACTIONS_OBJ_INSERT to accept client_info parameter",
);
console.log("2. Update authentication.pg.repository.js insertLogMsg function");
console.log("3. Test the changes");
