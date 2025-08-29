# 🚀 Criptoremesa Backend

**Enterprise-grade Node.js backend for cryptocurrency remittance platform with comprehensive business logic and dual-database architecture.**

> **⚠️ SECURITY NOTICE**: This documentation contains placeholder values for sensitive configuration. All actual credentials, API keys, database connections, and production URLs must be obtained from the development team. Never commit real credentials to version control.

[![Node.js](https://img.shields.io/badge/Node.js-16.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13.x-blue.svg)](https://postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-6.x-red.svg)](https://redis.io/)
[![PM2](https://img.shields.io/badge/PM2-Production-yellow.svg)](https://pm2.keymetrics.io/)

---

## **🌟 Overview**

Criptoremesa Backend is a sophisticated **cryptocurrency remittance platform** built with Node.js and Express.js, implementing enterprise-grade architecture patterns for secure, scalable financial transactions between multiple countries and currencies.

### **🎯 Key Features**

- 🏦 **Multi-Currency Remittances**: Support for 10+ countries and currencies
- 🔐 **Enterprise Security**: Multi-layer authentication with PostgreSQL sessions
- ⚡ **Asynchronous Processing**: Redis-backed Bull queues for background jobs
- 🗄️ **Dual Database Architecture**: Primary business logic + secondary file storage
- 🔄 **Real-time Communication**: Socket.IO for live updates
- 📱 **Payment Gateway Integration**: Transbank, MercadoPago, Tumipay
- 🛡️ **KYC/AML Compliance**: SILT identity verification integration
- 📊 **Comprehensive Analytics**: Business intelligence and reporting
- 🚀 **Production-Ready**: PM2 deployment with SSL/HTTPS

---

## **🚀 Quick Start**

### **Prerequisites**

```bash
Node.js 16.x+
PostgreSQL 13.x+
Redis 6.x+
PM2 (for production)
```

### **Installation**

```bash
# Clone repository
git clone <repository-url>
cd Criptoremesa-Backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# ⚠️ IMPORTANT: Contact development team for actual configuration values
# Configure your database and service credentials

# Start development server
npm run dev:api

# Start background workers
npm run dev:rem    # Remittance worker
npm run dev:silt   # SILT verification worker
```

### **Production Deployment**

```bash
# Start all services with PM2
pm2 start ecosystem.config.js

# Monitor services
pm2 monit

# View logs
pm2 logs
```

---

## **🏗️ Architecture Overview**

### **System Architecture**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │───▶│   Express API    │───▶│   PostgreSQL    │
│   (React/Vue)   │    │   (25+ modules)  │    │   (Dual DBs)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │   Redis Queues   │───▶│   Background    │
                       │   (Bull Jobs)    │    │   Workers       │
                       └──────────────────┘    └─────────────────┘
```

### **Database Schema**

```sql
-- Primary Database (Sixmap): 305 tables, 804 functions
sec_cust.*    -- Customer security & management
sec_emp.*     -- Employee & admin management
prc_mng.*     -- Process management (rates, limits)
ord_sch.*     -- Orders & transactions
priv.*        -- Private user information
public.*      -- Public reference data

-- Secondary Database (Criptoremesa): 4 tables
files.*       -- File metadata & storage
```

### **Module Architecture**

```
src/
├── modules/              # 25+ business modules
│   ├── authentication/   # User login & sessions
│   ├── remittances/      # Core remittance logic
│   ├── veriflevels/      # KYC/AML compliance
│   ├── banks/            # Banking integrations
│   ├── rates/            # Exchange rates
│   └── ...
├── utils/
│   ├── queues/           # Redis queue configurations
│   ├── workers/          # Background job processors
│   └── jobs/             # Scheduled tasks
└── routes/               # API route definitions
```

---

## **📚 Documentation**

Comprehensive technical documentation is available in the `/docs` directory:

### **🔍 Core Documentation**

| Document                                                              | Description                                         |
| --------------------------------------------------------------------- | --------------------------------------------------- |
| 📘 [**API Architecture**](docs/API_ARCHITECTURE.md)                   | Complete system architecture and design patterns    |
| 📋 [**Module Reference**](docs/MODULE_REFERENCE.md)                   | All 25+ modules with endpoints and functions        |
| 🗄️ [**Database Expert Knowledge**](docs/DATABASE_EXPERT_KNOWLEDGE.md) | Complete database schema and 804 business functions |
| ⚡ [**SILT Flow Documentation**](docs/SILT_FLOW_DOCUMENTATION.md)     | Complete identity verification workflow             |

### **🛠️ Development Resources**

| Document                                                     | Description                              |
| ------------------------------------------------------------ | ---------------------------------------- |
| 🔧 [**Database Analysis**](docs/DATABASE_ANALYSIS_README.md) | Database exploration tools and utilities |
| 🚀 [**Quick Start Guide**](docs/QUICK_START_NEW_CHAT.md)     | Development setup and common workflows   |
| 📖 [**Documentation Index**](docs/README.md)                 | Complete documentation navigation        |

---

## **🔧 Development**

### **Available Scripts**

```bash
# Development
npm run dev:api          # Start API server with hot reload
npm run dev:rem          # Start remittance worker
npm run dev:silt         # Start SILT worker

# Production
npm run start:api        # Start production API
npm run start:rem        # Start production remittance worker
npm run start:silt       # Start production SILT worker

# Utilities
npm run test             # Run test suite
npm run lint             # Code linting
npm run build            # Build for production
```

### **Environment Configuration**

Required environment variables (51 total):

> **🔒 SECURITY**: All values below are placeholders. Contact the development team for actual configuration values.

```bash
# Core Configuration
NODE_ENV=development
PORT=3000
ENVIROMENT=local

# Database Connections
PG_DB_SM_NAME=<ask_team_for_database_name>
PG_DB_SM_HOST=<ask_team_for_host>
PG_DB_CR_NAME=<ask_team_for_database_name>

# Redis Configuration
REDIS_HOST=<ask_team_for_redis_host>
REDIS_PORT=<ask_team_for_redis_port>
REDIS_DB_REM_QUEUE=<ask_team_for_queue_db>
REDIS_DB_SILT_QUEUE=<ask_team_for_queue_db>

# External API Keys
CURRENCY_FREAKS_API_KEY=<ask_team_for_api_key>
BINANCE_API_KEY=<ask_team_for_api_key>
TWILIO_ACCOUNT_SID=<ask_team_for_twilio_sid>

# Security
COOKIE_SECRET=<ask_team_for_secret>
JWT_SECRET=<ask_team_for_jwt_secret>

# SSL Certificates (Production)
SSL_CERT_PATH=/etc/ssl/certs/
SSL_KEY_PATH=/etc/ssl/private/
```

---

## **🚀 Deployment**

### **Production Stack**

- **Process Manager**: PM2 with ecosystem configuration
- **SSL/HTTPS**: Zero SSL certificates with automatic renewal
- **Database**: PostgreSQL with connection pooling
- **Caching**: Redis with multiple database separation
- **Monitoring**: Bull Board dashboard for queue monitoring
- **Logging**: Winston with Sentry error tracking

### **PM2 Configuration**

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "prod-be-bh:api",
      script: "src/index.js",
      instances: 1,
      env: { NODE_ENV: "production" },
    },
    {
      name: "prod-be-bh:rem-worker",
      script: "src/utils/workers/createRemittance.worker.js",
      instances: 1,
    },
    {
      name: "prod-be-bh:silt-worker",
      script: "src/utils/workers/silt.worker.js",
      instances: 1,
    },
  ],
};
```

---

## **🔐 Security Features**

- 🛡️ **Session-based Authentication**: PostgreSQL session store
- 🔒 **HTTPS/SSL**: Production-grade certificate management
- 🌐 **CORS Protection**: Configured allowed origins
- ⚡ **Rate Limiting**: Express queue middleware
- 📝 **Audit Logging**: Comprehensive security event tracking
- 🔍 **Input Validation**: Multi-layer request validation
- 🚫 **SQL Injection Protection**: Parameterized queries only

---

## **🔌 Integrations**

### **Payment Gateways**

- 🇨🇱 **Transbank** (Chile): WebPay Plus integration
- 💳 **MercadoPago**: Payment processing for multiple countries
- 🏦 **Tumipay**: Alternative payment methods

### **External Services**

- 🆔 **SILT**: Identity verification and KYC compliance
- 💱 **Currency APIs**: Real-time exchange rates
- 📱 **Twilio**: SMS notifications
- 📞 **WhatsApp Business**: Messaging integration
- 📊 **Binance API**: Cryptocurrency price feeds

---

## **📊 Monitoring & Analytics**

### **Real-time Monitoring**

- **Queue Dashboard**: Bull Board at `/admin/queues`
- **Socket.IO Events**: Real-time transaction updates
- **Health Checks**: System status endpoints
- **Performance Metrics**: Response time tracking

### **Business Intelligence**

- 📈 **Transaction Analytics**: Volume and trend analysis
- 💰 **Revenue Tracking**: Commission and fee reports
- 🌍 **Geographic Insights**: Country-wise performance
- 👥 **User Behavior**: Engagement and conversion metrics

---

## **� Testing**

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit        # Unit tests
npm run test:integration # Integration tests
npm run test:api         # API endpoint tests
npm run test:db          # Database function tests
```

---

## **🤝 Contributing**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### **Code Standards**

- Follow ESLint configuration
- Maintain test coverage above 80%
- Document all public APIs
- Use conventional commit messages

---

## **📞 Support**

For technical support and questions:

- 📧 **Email**: <ask_team_for_contact_email>
- 📖 **Documentation**: `/docs` directory
- 🐛 **Bug Reports**: GitHub Issues
- 💬 **Discussions**: GitHub Discussions

---

## **📄 License**

This project is proprietary software owned by <ask_team_for_license_info>. All rights reserved.

---

## **� Version History**

- **v3.0.0** - Current: Complete architecture with dual databases and queue system
- **v2.5.0** - SILT integration and advanced verification
- **v2.0.0** - Multi-country support and payment gateways
- **v1.0.0** - Initial release with basic remittance functionality

---

**Built with ❤️ by the Development Team**
