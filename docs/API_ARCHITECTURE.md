# 🏗️ API Architecture Documentation

> **⚠️ SECURITY NOTICE**: This documentation uses placeholder values for sensitive configuration. All production URLs, API keys, and credentials must be obtained from the development team.

## **🌟 Overview**

The Criptoremesa Backend follows a **modular Express.js architecture** with **controller-service-repository pattern**, implementing enterprise-grade cryptocurrency remittance platform with comprehensive business logic separation.

---

## **📦 Project Structure**

```
src/
├── app/
│   └── server.js              # Express server configuration
├── index.js                   # Application entry point
├── db/
│   └── pg.connection.js       # PostgreSQL connection pools
├── modules/                   # Business logic modules (25+ modules)
│   ├── authentication/
│   ├── remittances/
│   ├── users/
│   ├── veriflevels/
│   ├── banks/
│   ├── rates/
│   └── ...
├── routes/
│   └── index.routes.js        # Main route aggregator
├── utils/                     # Shared utilities
│   ├── queues/               # Bull queue configurations
│   ├── workers/              # Background workers
│   ├── jobs/                 # Scheduled jobs
│   └── ...
```

---

## **🔄 Architecture Pattern**

### **Controller-Service-Repository Pattern**

Each module follows the three-layer architecture:

```javascript
// 1. Controller Layer (HTTP handling)
modulesController.methodName = async (req, res, next) => {
  // Request validation
  // Authentication check
  // Call service layer
  // Response formatting
  // Error handling
};

// 2. Service Layer (Business logic)
modulesService.methodName = async (req, res, next) => {
  // Business rules validation
  // Data transformation
  // External API calls
  // Call repository layer
  // Return formatted response
};

// 3. Repository Layer (Data access)
modulesPGRepository.methodName = async (params) => {
  // Database queries
  // PL/pgSQL function calls
  // Data mapping
  // Return raw data
};
```

---

## **🌐 Request Flow**

```
Client Request
    ↓
Express Router (index.routes.js)
    ↓
Module Router (module.routes.js)
    ↓
Controller (authentication, logging, validation)
    ↓
Service (business logic, external APIs)
    ↓
Repository (database operations)
    ↓
PostgreSQL Database (business functions)
    ↓
Response (JSON format)
```

---

## **🗄️ Database Architecture**

### **Dual Database Setup**

```javascript
// Primary Database (Sixmap) - Business Logic
export const poolSM = new Pool({
  host: env.PG_DB_SM_HOST,
  database: env.PG_DB_SM_NAME, // 305 tables, 804 functions
  user: env.PG_DB_SM_USER,
  password: env.PG_DB_SM_PASSWORD,
  port: env.PG_DB_SM_PORT,
  max: 8,
  keepAlive: true,
});

// Secondary Database (Application) - File Storage
export const poolCR = new Pool({
  host: env.PG_DB_CR_HOST,
  database: env.PG_DB_CR_NAME, // 4 tables, file metadata
  user: env.PG_DB_CR_USER,
  password: env.PG_DB_CR_PASSWORD,
  port: env.PG_DB_CR_PORT,
  max: 8,
  keepAlive: true,
});
```

### **Schema Organization**

```sql
-- Business Logic Schemas
sec_cust.*    -- Customer security and management
sec_emp.*     -- Employee and admin management
prc_mng.*     -- Process management (rates, limits)
msg_app.*     -- Messaging and notifications
ord_sch.*     -- Order and transaction schema
priv.*        -- Private user information
public.*      -- Public reference data
```

---

## **⚡ Asynchronous Processing**

### **Bull Queue System**

```javascript
// Queue Configuration
const remittanceQueue = new Queue("createRemittances", {
  redis: {
    port: env.REDIS_PORT,
    host: env.REDIS_HOST,
    db: env.REDIS_DB_REM_QUEUE,
    password: env.REDIS_PASSWORD,
  },
});

const siltQueue = new Queue("siltQueue", {
  redis: {
    port: env.REDIS_PORT,
    host: env.REDIS_HOST,
    db: env.REDIS_DB_SILT_QUEUE,
    password: env.REDIS_PASSWORD,
  },
});
```

### **Worker Processes**

```javascript
// PM2 Configuration
apps: [
  {
    name: "<ask_team_for_app_name>:api",
    script: "src/index.js",
    instances: 1,
  },
  {
    name: "<ask_team_for_app_name>:rem-worker",
    script: "src/utils/workers/createRemittance.worker.js",
    instances: 1,
  },
  {
    name: "<ask_team_for_app_name>:silt-worker",
    script: "src/utils/workers/silt.worker.js",
    instances: 1,
  },
];
```

---

## **🔐 Security Architecture**

### **Authentication & Sessions**

```javascript
// PostgreSQL Session Store
app.use(
  session({
    store: new pgSession({
      pool: poolSM,
      tableName: "session_obj",
      schemaName: "sec_cust",
    }),
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      expires: 900000,
      secure: true,
    },
  })
);

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
```

### **Route Protection**

```javascript
// Production Route Guard
if (!req.isAuthenticated() && env.ENVIROMENT === ENVIROMENTS.PRODUCTION) {
  req.session.destroy();
  return res.status(401).json({ message: "Unauthorized" });
}
```

### **CORS Configuration**

```javascript
app.use(
  cors({
    origin: ["<ask_team_for_frontend_urls>"],
    methods: "GET,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
```

---

## **📊 Real-time Communication**

### **Socket.IO Integration**

```javascript
// Socket Server Setup
export async function SocketServer(server) {
  const io = socketIO(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: [
      "websocket",
      "flashsocket",
      "htmlfile",
      "xhr-polling",
      "jsonp-polling",
      "polling",
    ],
  });

  // Real-time notifications
  io.on("connection", (socket) => {
    socket.on("join_room", (data) => {
      socket.join(data.email_user);
    });
  });
}

// Notification Broadcasting
export function notifyChanges(event, data) {
  if (socketServer) {
    socketServer.emit(event, data);
  }
}
```

---

## **🎯 Business Module Architecture**

### **Core Modules**

1. **Authentication Module**

   - User login/logout
   - Session management
   - Security logging

2. **Remittances Module**

   - Pre-remittance system
   - Queue-based processing
   - Payment integrations
   - Status tracking

3. **Verification Levels Module**

   - KYC/AML compliance
   - SILT integration
   - Document management
   - Risk assessment

4. **Users Module**

   - Profile management
   - Verification status
   - Notification preferences

5. **Banks Module**
   - Banking partner integration
   - Fee calculations
   - Transfer processing

### **Module Structure Example**

```
modules/remittances/
├── controllers/
│   └── remittances.controller.js    # HTTP request handling
├── services/
│   └── remittances.service.js       # Business logic
├── repositories/
│   └── remittances.pg.repository.js # Database operations
└── remittances.routes.js            # Route definitions
```

---

## **🔧 External Integrations**

### **Payment Gateways**

```javascript
// Transbank (Chile)
import transbankService from "./transbank/services/transbank.service";

// Tumipay
import tumipayService from "./tumipay/services/tumipay.service";
```

### **API Integrations**

```javascript
// Currency Exchange Rates
const rateAPI = `https://api.currencyfreaks.com/latest?base=${baseCurrency}&symbols=${targetCurrencies}&apikey=${env.CURRENCY_FREAKS_API_KEY}`;

// Binance Cryptocurrency Prices
const binanceAPI = `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`;

// SMS Notifications
import { sendSMS } from "./utils/whatsapp";
```

---

## **📈 Monitoring & Observability**

### **Logging Architecture**

```javascript
// Winston Logger Configuration
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// Custom Business Logging
import ObjLog from "./utils/ObjLog";
ObjLog.log(`[${context}]: Business event occurred`);
```

### **Error Monitoring**

```javascript
// Sentry Integration
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

// Express Error Handler
Sentry.setupExpressErrorHandler(app);
```

### **Queue Monitoring**

```javascript
// Bull Board Dashboard
const { createBullBoard } = require("@bull-board/api");
const { BullAdapter } = require("@bull-board/api/bullAdapter");
const { ExpressAdapter } = require("@bull-board/express");

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullAdapter(remittanceQueue), new BullAdapter(siltQueue)],
  serverAdapter,
});

app.use("/admin/queues", serverAdapter.getRouter());
```

---

## **🚀 Deployment Architecture**

### **SSL/HTTPS Setup**

```javascript
// Environment-based Certificate Loading
if (process.env.ENVIROMENT === "local") {
  httpsServer = https.createServer(
    {
      key: fs.readFileSync("src/utils/cert/key.pem"),
      cert: fs.readFileSync("src/utils/cert/cert.pem"),
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
```

### **Environment Configuration**

```javascript
// Environment Variables (51 total)
export const env = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,

  // Database Connections
  PG_DB_SM_NAME: process.env.PG_DB_SM_NAME,
  PG_DB_SM_HOST: process.env.PG_DB_SM_HOST,
  PG_DB_CR_NAME: process.env.PG_DB_CR_NAME,

  // Redis Configuration
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_DB_REM_QUEUE: process.env.REDIS_DB_REM_QUEUE,
  REDIS_DB_SILT_QUEUE: process.env.REDIS_DB_SILT_QUEUE,

  // API Keys
  CURRENCY_FREAKS_API_KEY: process.env.CURRENCY_FREAKS_API_KEY,
  BINANCE_API_KEY: process.env.BINANCE_API_KEY,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
};
```

---

## **⚡ Performance Optimizations**

### **Connection Pooling**

```javascript
// PostgreSQL Pool Configuration
const connectionConfig = {
  max: 8, // Maximum connections
  keepAlive: true, // Keep connections alive
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};
```

### **Redis Caching**

```javascript
// Rate Caching Example
const pairInfo = req.params.countryIsoCodOrigin + req.params.countryIsoCodDestiny;
const redisInfo = await getFromRedis(pairInfo);

if (redisInfo) {
  data = JSON.parse(redisInfo);
} else {
  data = await repository.getInfoByOriginAndDestination(...);
  redisClient.set(pairInfo, JSON.stringify(data));
}
```

### **Request Rate Limiting**

```javascript
// Express Queue Middleware
import queue from "express-queue";
app.use(
  queue({
    activeLimit: 1,
    queuedLimit: -1,
    rejectHandler: (req, res) => {
      res.sendStatus(500);
    },
  })
);
```

---

## **🧪 Testing Strategy**

### **Testing Layers**

1. **Unit Tests**: Individual function testing
2. **Integration Tests**: Module interaction testing
3. **API Tests**: Endpoint validation
4. **Database Tests**: PL/pgSQL function testing
5. **Queue Tests**: Background job processing

### **Development Commands**

```bash
# Start Development Server
npm run dev:api

# Start Workers
npm run dev:rem    # Remittance worker
npm run dev:silt   # SILT worker

# Production
npm run start:api
npm run start:rem
npm run start:silt
```

This architecture provides a scalable, maintainable, and secure foundation for the cryptocurrency remittance platform with comprehensive business logic separation and enterprise-grade reliability.
