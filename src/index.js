import "@babel/polyfill";
import { logger } from "./utils/logger";
import ObjLog from "./utils/ObjLog";
import app from "./app/server";
import path from "path";
import { SocketServer } from "./modules/sockets/sockets.coordinator";

///////////////////////////
// Para usar el certificado
///////////////////////////

const https = require("https");

const fs = require("fs");
let httpsServer;

if (process.env.ENVIROMENT === "local") {
  httpsServer = https.createServer(
    {
      key: fs.readFileSync("src/utils/cert/key.pem"),
      cert: fs.readFileSync("src/utils/cert/cert.pem"),
      // ca: fs.readFileSync('/etc/ssl/certs/zero-ssl/ssl-bundle.crt'),
      requestCert: true,
      rejectUnauthorized: false,
    },
    app
  );
} else {
  httpsServer = https.createServer(
    {
      key: fs.readFileSync("/etc/ssl/certs/zero-ssl/private.key"),
      cert: fs.readFileSync("/etc/ssl/certs/zero-ssl/certificate.crt"),
      ca: fs.readFileSync("/etc/ssl/certs/zero-ssl/ssl-bundle.crt"),
      requestCert: true,
      rejectUnauthorized: false,
    },
    app
  );
}

httpsServer.listen(app.get("port"), "0.0.0.0", () => {
  logger.info(`Server on port ${app.get("port")}`);
  ObjLog.log(`Server on port ${app.get("port")}`);
});

////////////////////////////////
// Sin el certificado - forma 1
///////////////////////////////

// const https = require("https");

// const httpsServer = https.createServer(app);

// httpsServer.listen(app.get("port"), () => {
//   logger.info(`Server on port ${app.get("port")}`);
//   ObjLog.log(`Server on port ${app.get("port")}`);
// });

////////////////////////////////
// Sin el certificado - forma 2
///////////////////////////////

// const server = app.listen(app.get("port"), () => {
//   logger.info(`Server on port ${app.get("port")}`);
//   ObjLog.log(`Server on port ${app.get("port")}`);
// });

SocketServer(httpsServer);