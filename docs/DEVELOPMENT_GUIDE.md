# 🛠️ Development Guide

> **⚠️ SECURITY NOTICE**: This guide contains placeholder values for all sensitive configuration. Contact the development team for actual database credentials, API keys, and environment-specific values before starting development.

## **🎯 Development Environment Setup**

Complete guide for setting up and maintaining the Criptoremesa Backend development environment.

---

## **📋 Prerequisites**

### **Required Software**

```bash
# Core Requirements
Node.js 16.x or higher
PostgreSQL 13.x or higher
Redis 6.x or higher
Git 2.x or higher

# Development Tools (Recommended)
VS Code with extensions:
  - ESLint
  - Prettier
  - PostgreSQL syntax highlighting
  - Thunder Client (API testing)
  - GitLens

# Production Tools
PM2 (for process management)
nginx (for reverse proxy)
certbot (for SSL certificates)
```

### **Hardware Requirements**

```
Development:
- RAM: 8GB minimum, 16GB recommended
- Storage: 10GB free space minimum
- CPU: 4 cores recommended

Production:
- RAM: 16GB minimum, 32GB recommended
- Storage: 100GB free space minimum
- CPU: 8 cores minimum
```

---

## **🚀 Initial Setup**

### **1. Clone and Configure**

```bash
# Clone repository
git clone <repository-url>
cd Criptoremesa-Backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### **2. Environment Configuration**

Edit `.env` file with your configurations:

> **🔒 IMPORTANT**: Replace all `<ask_team_for_*>` placeholders with actual values from the development team.

```bash
# Core Configuration
NODE_ENV=development
PORT=3000
ENVIROMENT=local

# Database Connections
PG_DB_SM_NAME=<ask_team_for_database_name>
PG_DB_SM_HOST=<ask_team_for_host>
PG_DB_SM_USER=<ask_team_for_user>
PG_DB_SM_PASSWORD=<ask_team_for_password>
PG_DB_SM_PORT=<ask_team_for_port>

PG_DB_CR_NAME=<ask_team_for_database_name>
PG_DB_CR_HOST=<ask_team_for_host>
PG_DB_CR_USER=<ask_team_for_user>
PG_DB_CR_PASSWORD=<ask_team_for_password>
PG_DB_CR_PORT=<ask_team_for_port>

# Redis Configuration
REDIS_HOST=<ask_team_for_host>
REDIS_PORT=<ask_team_for_port>
REDIS_PASSWORD=<ask_team_for_password>
REDIS_DB_REM_QUEUE=<ask_team_for_db_number>
REDIS_DB_SILT_QUEUE=<ask_team_for_db_number>

# External API Keys (Development)
CURRENCY_FREAKS_API_KEY=<ask_team_for_api_key>
BINANCE_API_KEY=<ask_team_for_api_key>
TWILIO_ACCOUNT_SID=<ask_team_for_sid>
TWILIO_AUTH_TOKEN=<ask_team_for_token>

# Security
COOKIE_SECRET=<ask_team_for_secret>
JWT_SECRET=<ask_team_for_secret>

# File Upload Configuration
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png

# Logging
LOG_LEVEL=debug
LOG_FILE_PATH=./logs/
```

### **3. Database Setup**

```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# Create development databases
CREATE DATABASE <ask_team_for_database_name>;
CREATE DATABASE <ask_team_for_database_name>;

# Create development user (optional)
CREATE USER <ask_team_for_username> WITH PASSWORD '<ask_team_for_password>';
GRANT ALL PRIVILEGES ON DATABASE <ask_team_for_database_name> TO <ask_team_for_username>;
GRANT ALL PRIVILEGES ON DATABASE <ask_team_for_database_name> TO <ask_team_for_username>;

# Exit PostgreSQL
\q
```

### **4. Redis Setup**

```bash
# Install Redis (Ubuntu/Debian)
sudo apt update
sudo apt install redis-server

# Install Redis (macOS)
brew install redis

# Install Redis (Windows)
# Download and install from https://redis.io/download

# Start Redis service
redis-server

# Test Redis connection
redis-cli ping
# Should return: PONG
```

---

## **🔧 Development Workflow**

### **Daily Development Commands**

```bash
# Start development server with hot reload
npm run dev:api

# Start background workers (in separate terminals)
npm run dev:rem     # Remittance processing worker
npm run dev:silt    # SILT verification worker

# Monitor Redis queues
redis-cli monitor

# Check database connections
npm run db:check

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

### **Package.json Scripts Reference**

```json
{
  "scripts": {
    "dev:api": "nodemon src/index.js",
    "dev:rem": "nodemon src/utils/workers/createRemittance.worker.js",
    "dev:silt": "nodemon src/utils/workers/silt.worker.js",
    "start:api": "node src/index.js",
    "start:rem": "node src/utils/workers/createRemittance.worker.js",
    "start:silt": "node src/utils/workers/silt.worker.js",
    "test": "jest",
    "test:unit": "jest --testPathPattern=unit",
    "test:integration": "jest --testPathPattern=integration",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "format": "prettier --write src/",
    "db:migrate": "node scripts/migrate.js",
    "db:seed": "node scripts/seed.js",
    "db:check": "node scripts/healthcheck.js",
    "build": "babel src --out-dir dist",
    "pm2:start": "pm2 start ecosystem.config.js",
    "pm2:stop": "pm2 stop ecosystem.config.js",
    "pm2:restart": "pm2 restart ecosystem.config.js",
    "pm2:logs": "pm2 logs",
    "pm2:monit": "pm2 monit"
  }
}
```

---

## **📁 Project Structure Understanding**

### **Core Directories**

```
src/
├── app/
│   └── server.js              # Express server configuration
├── index.js                   # Application entry point
├── db/
│   └── pg.connection.js       # Database connection pools
├── modules/                   # Business logic modules
│   ├── authentication/
│   │   ├── controllers/       # HTTP request handlers
│   │   ├── services/          # Business logic
│   │   ├── repositories/      # Data access layer
│   │   └── routes.js          # Route definitions
│   ├── remittances/
│   ├── users/
│   └── ...
├── routes/
│   └── index.routes.js        # Main route aggregator
├── utils/
│   ├── queues/               # Bull queue configurations
│   ├── workers/              # Background job processors
│   ├── jobs/                 # Scheduled tasks
│   ├── cert/                 # SSL certificates
│   ├── ObjLog.js             # Custom logging utility
│   └── ...
└── assets/                   # Static files and uploads
```

### **Module Development Pattern**

When creating a new module, follow this structure:

```
modules/newmodule/
├── controllers/
│   └── newmodule.controller.js
├── services/
│   └── newmodule.service.js
├── repositories/
│   └── newmodule.pg.repository.js
├── newmodule.routes.js
└── tests/
    ├── newmodule.controller.test.js
    ├── newmodule.service.test.js
    └── newmodule.repository.test.js
```

---

## **🧪 Testing Strategy**

### **Test Structure**

```
tests/
├── unit/                     # Unit tests for individual functions
│   ├── controllers/
│   ├── services/
│   └── repositories/
├── integration/              # Integration tests for modules
│   ├── api/
│   ├── database/
│   └── queues/
├── e2e/                      # End-to-end tests
│   ├── remittance-flow/
│   ├── user-registration/
│   └── payment-processing/
└── fixtures/                 # Test data and mocks
    ├── database/
    ├── api-responses/
    └── queue-jobs/
```

### **Testing Commands**

```bash
# Run all tests
npm test

# Run specific test categories
npm run test:unit
npm run test:integration
npm run test:e2e

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- --testNamePattern="remittance"

# Run tests for specific module
npm test modules/remittances/
```

### **Test Environment Setup**

```bash
# Create test environment file
cp .env .env.test

# Modify test-specific values
NODE_ENV=test
PG_DB_SM_NAME=<ask_team_for_test_database>
PG_DB_CR_NAME=<ask_team_for_test_database>
REDIS_DB_REM_QUEUE=<ask_team_for_test_queue_db>
REDIS_DB_SILT_QUEUE=<ask_team_for_test_queue_db>
```

---

## **🔍 Debugging Guide**

### **Common Debugging Tools**

```bash
# Debug with VS Code
# Add to launch.json:
{
  "type": "node",
  "request": "launch",
  "name": "Debug API",
  "program": "${workspaceFolder}/src/index.js",
  "env": {
    "NODE_ENV": "development"
  }
}

# Debug with Node.js inspector
node --inspect-brk src/index.js

# Debug background workers
node --inspect-brk src/utils/workers/createRemittance.worker.js
```

### **Database Debugging**

```sql
-- Enable query logging in PostgreSQL
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_min_duration_statement = 0;
SELECT pg_reload_conf();

-- Monitor active connections
SELECT * FROM pg_stat_activity WHERE state = 'active';

-- Check database locks
SELECT * FROM pg_locks WHERE NOT granted;

-- Monitor slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC;
```

### **Redis Debugging**

```bash
# Monitor Redis commands
redis-cli monitor

# Check memory usage
redis-cli info memory

# List all keys
redis-cli keys "*"

# Monitor specific queue
redis-cli monitor | grep "remittance"

# Check queue length
redis-cli llen "bull:createRemittances:waiting"
```

---

## **🚀 Performance Optimization**

### **Development Performance Tips**

```bash
# Use nodemon for faster restarts
npm install -g nodemon

# Enable source maps for better debugging
NODE_OPTIONS="--enable-source-maps" npm run dev:api

# Use Redis for session storage in development
# (Already configured in production)

# Monitor memory usage
node --inspect src/index.js
# Then open chrome://inspect in Chrome
```

### **Database Optimization**

```sql
-- Create indexes for frequently queried columns
CREATE INDEX CONCURRENTLY idx_users_email ON sec_cust.users(email);
CREATE INDEX CONCURRENTLY idx_remittances_status ON ord_sch.remittances(status);

-- Analyze query performance
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM your_query;

-- Update table statistics
ANALYZE sec_cust.users;
ANALYZE ord_sch.remittances;
```

---

## **📊 Monitoring & Logging**

### **Development Monitoring**

```bash
# Monitor API requests
curl -X GET http://localhost:3000/api/health

# Check queue status
curl -X GET http://localhost:3000/admin/queues

# Monitor logs in real-time
tail -f logs/combined.log

# Monitor error logs
tail -f logs/error.log

# Monitor PM2 processes (if using PM2 in dev)
pm2 monit
```

### **Log Levels**

```javascript
// Configure Winston log levels
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  levels: {
    error: 0, // Critical errors
    warn: 1, // Warnings
    info: 2, // General information
    http: 3, // HTTP requests
    verbose: 4, // Detailed information
    debug: 5, // Debug information
    silly: 6, // Very detailed debug
  },
});
```

---

## **🔧 Common Development Issues**

### **Database Connection Issues**

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql

# Check connection from Node.js
node -e "
const { Pool } = require('pg');
const pool = new Pool({
  host: '<ask_team_for_host>',
  database: '<ask_team_for_database>',
  user: '<ask_team_for_user>',
  password: '<ask_team_for_password>'
});
pool.query('SELECT NOW()', (err, res) => {
  console.log(err ? err : res.rows[0]);
  process.exit();
});
"
```

### **Redis Connection Issues**

```bash
# Check Redis status
redis-cli ping

# Check Redis configuration
redis-cli config get "*"

# Restart Redis
sudo systemctl restart redis

# Clear Redis cache (development only)
redis-cli flushall
```

### **Port Conflicts**

```bash
# Check what's using port 3000
lsof -i :3000

# Kill process on port 3000
kill -9 $(lsof -t -i:3000)

# Use different port
PORT=3001 npm run dev:api
```

### **SSL Certificate Issues (Development)**

```bash
# Generate self-signed certificates for development
openssl req -x509 -newkey rsa:4096 -keyout src/utils/cert/key.pem -out src/utils/cert/cert.pem -days 365 -nodes

# Skip certificate verification for development APIs
NODE_TLS_REJECT_UNAUTHORIZED=0 node src/index.js
```

---

## **📚 Helpful Resources**

### **Internal Documentation**

- [API Architecture](./API_ARCHITECTURE.md)
- [Module Reference](./MODULE_REFERENCE.md)
- [Database Expert Knowledge](./DATABASE_EXPERT_KNOWLEDGE.md)
- [SILT Flow Documentation](./SILT_FLOW_DOCUMENTATION.md)

### **External Resources**

- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/documentation)
- [Bull Queue Documentation](https://github.com/OptimalBits/bull)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)

### **Development Tools**

- [Postman Collections](./postman/) - API testing collections
- [Database Scripts](./scripts/) - Utility scripts
- [Docker Setup](./docker/) - Containerized development environment

---

## **🤝 Contributing Guidelines**

### **Code Style**

```javascript
// Use ESLint configuration
{
  "extends": ["eslint:recommended"],
  "rules": {
    "indent": ["error", 2],
    "quotes": ["error", "single"],
    "semi": ["error", "always"]
  }
}

// Follow naming conventions
const getUserById = async (id) => { ... };  // camelCase for functions
const USER_ROLES = { ... };                 // UPPER_CASE for constants
class UserService { ... }                   // PascalCase for classes
```

### **Git Workflow**

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make commits with conventional commit format
git commit -m "feat: add user authentication endpoint"
git commit -m "fix: resolve database connection issue"
git commit -m "docs: update API documentation"

# Push and create pull request
git push origin feature/your-feature-name
```

### **Pull Request Checklist**

- [ ] Code follows style guidelines
- [ ] Tests are written and passing
- [ ] Documentation is updated
- [ ] No breaking changes (or documented)
- [ ] Performance impact considered
- [ ] Security implications reviewed

This development guide provides a comprehensive foundation for working with the Criptoremesa Backend efficiently and effectively.
