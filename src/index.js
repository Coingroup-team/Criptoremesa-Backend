import "@babel/polyfill";
import { logger } from "./utils/logger";
import ObjLog from "./utils/ObjLog";
import app from "./app/server";
import path from "path";
import { SocketServer } from "./modules/sockets/sockets.coordinator";
import { env } from "./utils/enviroment";

const https = require("https");
const fs = require("fs");

let server;

// Determine if we should use HTTPS based on environment
const useHttps = process.env.USE_HTTPS === "true";
const isLocal = process.env.ENVIROMENT === "local";

if (isLocal) {
  // Local development — try local self-signed certs, fallback to HTTP
  try {
    server = https.createServer(
      {
        key: fs.readFileSync("src/utils/cert/key.pem"),
        cert: fs.readFileSync("src/utils/cert/cert.pem"),
        requestCert: true,
        rejectUnauthorized: false,
      },
      app
    );
    logger.info("HTTPS server configured with local self-signed certs");
  } catch (error) {
    logger.warn(`Local SSL certs not found: ${error.message}`);
    logger.info("Falling back to HTTP server");
    server = require("http").createServer(app);
  }
} else if (useHttps) {
  // Production/Dev with SSL certificates
  try {
    const sslKeyPath = process.env.SSL_KEY_PATH || "/etc/ssl/certs/zero-ssl/private.key";
    const sslCertPath = process.env.SSL_CERT_PATH || "/etc/ssl/certs/zero-ssl/certificate.crt";
    const sslCaPath = process.env.SSL_CA_PATH || "/etc/ssl/certs/zero-ssl/ssl-bundle.crt";

    server = https.createServer(
      {
        key: fs.readFileSync(sslKeyPath),
        cert: fs.readFileSync(sslCertPath),
        ca: fs.readFileSync(sslCaPath),
        requestCert: true,
        rejectUnauthorized: false,
      },
      app
    );
    logger.info(`HTTPS server configured for environment: ${process.env.ENVIROMENT}`);
  } catch (error) {
    logger.error(`Failed to load SSL certificates: ${error.message}`);
    logger.info("Falling back to HTTP server");
    server = require("http").createServer(app);
  }
} else {
  // No HTTPS — plain HTTP (e.g. behind a load balancer/reverse proxy)
  server = require("http").createServer(app);
  logger.info(`HTTP server configured for environment: ${process.env.ENVIROMENT}`);
}

server.listen(app.get("port"), "0.0.0.0", () => {
  logger.info(`Server on port ${app.get("port")}`);
  ObjLog.log(`Server on port ${app.get("port")}`);
});

SocketServer(server);