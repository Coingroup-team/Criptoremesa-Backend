import express, { json } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { logger } from "../utils/logger";
import ObjLog from "../utils/ObjLog";
import { env } from "../utils/enviroment";
import "../utils/sentry";
import routerIndex from "../routes/index.routes";
import passport from "passport";
import session from "express-session";
let pgSession = require("connect-pg-simple")(session);
import { poolSM } from "../db/pg.connection";
import ObjUserSessionData from "../utils/ObjUserSessionData";
import authenticationPGRepository from "../modules/authentication/repositories/authentication.pg.repository";
import operationRoutesRepository from '../modules/operation_routes/repositories/operation_routes.pg.repository'
import ws from '../utils/websocketTradeAPIs'
import bodyParser from "body-parser";
import whatsapp from "../utils/whatsapp";
import queue from 'express-queue';
import * as Sentry from "@sentry/node";

//jobs
import transactionsJob from '../utils/jobs/transactions'

// SETTINGS
const app = express();

// si no se quiere enviar nunca 304
// app.disable('etag');

app.use(bodyParser.json({limit: '50mb'})); 
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.set("port", env.PORT || 3000);

// MIDDLEWARES
app.use(morgan("dev", { stream: logger.stream }));
app.use(json());

app.use(
  cors({
    origin: [
      "https://bithonor.com",
      "https://www.bithonor.com",
      "https://bhdev.bithonor.com",
      "https://bhdev.bithonor.es",
      "https://bhtest.bithonor.es",
      "http://localhost:8080",
      "https://localhost:8080",
      "http://localhost:8081",
      "https://localhost:8081",
      "https://www.bithonor.es",
      "https://bithonor.es",
      "https://3.143.246.144:5011",
      "https://3.143.246.144:4053",
      "https://bhtest.bithonor.com",
      "https://qa.bithonor.com"
    ],
    methods: "GET,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  })
);
app.use(helmet());
app.use(
  session({
    store: new pgSession({
      pool: poolSM,
      tableName: "session_obj", // Use another table-name than the default "session" one
      schemaName: "sec_cust",
    }),
    secret: process.env.COOKIE_SECRET,
    resave: true, // true: inserta el usuario en la sesion despues de hacer login / false: solo lo hace cuando la tabla de sesion está vacía
    saveUninitialized: true,
    cookie: {
      expires: 900000,
      secure: true,
    }, // 1 day (1000 ms / sec * 60 sec /1 min * 60 min /1 h * 24 h/1 day)
  })
);
app.use(passport.initialize());
app.use(passport.session());

// app.use(queue({ activeLimit: 1, queuedLimit: -1, rejectHandler: (req, res) => { res.sendStatus(500); } }));

app.use((req, res, next) => {
  logger.debug(`[Request]: ${req.method} ${req.originalUrl}`);
  ObjLog.log(`[Request]: ${req.method} ${req.originalUrl}`);

  if (req.session.views) {
    // Increment the number of views.
    req.session.views++;

    // Session will expires after 1 min
    // of in activity
  } else {
    req.session.views = 1;
  }

  logger.silly('ANTES DEL REQUEST SEGUN YO')

  next();
});

// ROUTES
app.get("/", async (req, res, next) => {
  res.status(200).send("Server running");
  next();
});

app.use("/cr", routerIndex);

app.use(async (req, res, next) => {
  logger.silly('DESPUES DEL REQUEST SEGUN YO')

  try {
    ObjUserSessionData.set({
      session: {
        session_id: req.session ? req.session.id : null,
        cookie: req.session ? req.session.cookie : null,
      },
      user: req.user,
    });
    next();
  } catch (error) {
    next(error)
  }
});

Sentry.setupExpressErrorHandler(app);

// ERROR HANDLER
// app.use(queue.errorHandler());

app.use(async function (err, req, res,next) {

  const context = "ERROR HANDLER";

  logger.error(`${context}: ${err.message}`);
  ObjLog.log(`${context}: ${err.message}`);
  
  // declaring log object
  const logConst = {
    is_auth: null,
    success: true,
    failed: false,
    ip: null,
    country: null,
    route: null,
    session: null,
  };

  // filling log object info
  let log = logConst;

  const businessError = {
                          error: "BUSINESS_ERROR",
                          msg: "Esa dirección de correo ya está en uso. Prueba con otro.",
                        }
  const serverError = { 
                        error: "SERVER_ERROR", 
                        msg: err.message 
                      }

  log.success = false;
  log.failed = true;
  log.is_auth = req.isAuthenticated();
  log.ip = req.header("Client-Ip");
  log.route = req.method + " " + req.originalUrl;
  log.params = req.params;
  log.query = req.query;
  log.body = req.body;
  log.status = 500;
  
  const resp = await authenticationPGRepository.getIpInfo(
    req.header("Client-Ip")
  );
  if (resp)
    log.country = resp.country_name ? resp.country_name : "Probably Localhost";
  if (await authenticationPGRepository.getSessionById(req.sessionID))
    log.session = req.sessionID;

  if ( err.message === 'duplicate key value violates unique constraint \\"ms_sixmap_users_email_user_key\\"') 
  {
    log.response = businessError;
    await authenticationPGRepository.insertLogMsg(log);
    res.status(500).send(businessError);
  }
  else {
    log.response = serverError;
    await authenticationPGRepository.insertLogMsg(log);
    res.status(500).send(serverError);
  }
});

// GLOBAL VARIABLES

global.routes = []

export function replaceOperationRoute(val){
  routes.forEach((el,i) => {
    if (el.id_operation_route === val.operationRoute.id_operation_route) 
    el = val.operationRoute.id_operation_route
  })
}

if (routes.length === 0) {
  operationRoutesRepository.getoperation_routes().then((val) => {
    routes = val
  })
}

// ENV WHA MESSAGE

if (env.NOTIFY_ENV === 'TRUE') {
  let msg

  if (env.PG_DB_SM_NAME === 'sixmap-tig') msg = '🔶_*Mensaje enviado desde CriptoRemesa*_🔶\n\nSistema corriendo en ambiente 🧑🏻‍💻*DEV*\n\n⚠️NO UTILIZAR nimobot'
  else if (env.PG_DB_SM_NAME === 'sixmap-cg') msg = '🔶_*Mensaje enviado desde CriptoRemesa*_🔶\n\nSistema corriendo en ambiente 🧪*TEST*\n\n✅Testers pueden utilizar nimobot'
  
  whatsapp.sendGroupWhatsappMessage(msg)
}

export default app;