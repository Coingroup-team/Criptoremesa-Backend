# 🎯 Comprehensive Database & Business Logic Analysis Suite

This comprehensive toolkit provides **complete access** to your PostgreSQL databases and **all business logic** implemented in PL/pgSQL.

## 📊 What's Analyzed

Your databases have been **comprehensively analyzed** including all business logic:

### **Database Schema & Data:**

- **Sixmap Database (PRE-QA-CG)**: 305 tables across 7 schemas
- **Criptoremesa Database (criptoremesa-cg)**: 4 tables
- **Complete schema documentation** with relationships, indexes, and constraints

### **🧠 Business Logic Layer (NEW!):**

- **804 PL/pgSQL Functions** - All your business rules and calculations
- **49 Business Views** - Computed data and complex queries
- **5,418 Triggers** - Automated business rules and validations
- **449 Custom Types** - Your domain-specific data types
- **192 Sequences** - ID generation logic
- **Complete business workflow understanding**

## 🚀 Available Tools

### 1. **Business Logic Query Tool** (⭐ NEW - RECOMMENDED)

Advanced tool for exploring your complete business logic layer.

```bash
node scripts/business-logic-query-tool.js
```

**Business Logic Commands:**

- `findFunctions('remittance')` - Find all remittance-related functions
- `describeFunctionLogic('prc_mng.validate_exchange')` - Show complete function code
- `findViews('user')` - Find business views
- `describeViewLogic('v_user_balances')` - Show view definition
- `findTriggers('audit')` - Find triggers
- `explainBusinessProcess('remittance')` - Complete workflow analysis
- `analyzeBusinessWorkflow('kyc')` - End-to-end process analysis

### 2. **Interactive CLI Tool**

Real-time command-line interface for database exploration.

```bash
node scripts/database-cli.js
```

**Commands:**

- `tables user` - Find tables containing "user"
- `describe sec_cust.ms_sixmap_users` - Show table structure
- `sample sec_cust.ms_currencies 10` - Get sample data
- `query SELECT * FROM sec_cust.ms_currencies LIMIT 5` - Execute SQL
- `columns email` - Find columns with "email"
- `relationships sec_cust.ms_sixmap_users` - Show FK relationships
- `largest` - Show biggest tables
- `stats` - Database statistics

### 3. **REST API Server**

HTTP API for programmatic database access.

```bash
node scripts/database-api-server.js
```

**API Endpoints:**

- `GET /api/databases` - Overview of all databases
- `GET /api/tables?db=sixmap` - List all tables
- `GET /api/tables/search?q=user&db=sixmap` - Search tables
- `GET /api/columns/search?q=email` - Search columns
- `GET /api/table/sec_cust.ms_currencies` - Describe table
- `POST /api/query` - Execute SQL queries
- `GET /api/tables/largest` - Biggest tables by rows

### 3. **Web Dashboard**

Visual interface for database exploration.

1. Start the API server: `node scripts/database-api-server.js`
2. Open `scripts/database-dashboard.html` in your browser
3. Explore tables, search columns, execute queries visually

### 4. **Comprehensive Documentation**

Pre-generated documentation including **complete business logic analysis**.

**Files created:**

- `database-comprehensive-analysis/sixmap-business-logic.md` - Complete business logic documentation (16,900+ lines)
- `database-comprehensive-analysis/criptoremesa-business-logic.md` - Criptoremesa business logic
- `database-comprehensive-analysis/comprehensive-database-analysis.json` - Complete analysis data
- `database-analysis/database-summary.md` - High-level overview (legacy)

## 🔍 Quick Start Examples

### Business Logic Analysis (NEW!)

```bash
# Find all remittance-related business functions
findFunctions('remittance')

# Show complete function implementation
describeFunctionLogic('prc_mng.sp_create_remittance')

# Analyze complete exchange workflow
explainBusinessProcess('exchange')

# Find all KYC/verification triggers
findTriggers('verification')
```

### Schema & Data Analysis

```bash
# CLI
tables user

# API
curl "http://localhost:3001/api/tables/search?q=user&db=sixmap"
```

### Explore a Specific Table

```bash
# CLI
describe sec_cust.ms_sixmap_users
sample sec_cust.ms_sixmap_users 5

# API
curl "http://localhost:3001/api/table/sec_cust.ms_sixmap_users"
```

### Custom Queries

```bash
# CLI
query SELECT currency_code, currency_name FROM sec_cust.ms_currencies LIMIT 10

# API
curl -X POST "http://localhost:3001/api/query" \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT * FROM sec_cust.ms_currencies LIMIT 10", "database": "sixmap"}'
```

## 📋 Complete System Overview

### **Database Schema Analysis:**

- **305 tables** with complete structure analysis
- **242 indexes** with performance metrics
- **All relationships** and foreign key mappings
- **Complete constraints** and validation rules

### **🧠 Business Logic Layer:**

- **804 PL/pgSQL Functions** containing all business rules:
  - Customer management functions
  - Exchange rate calculations
  - Remittance processing logic
  - KYC/verification workflows
  - Payment processing rules
  - Risk assessment algorithms
- **49 Business Views** with computed data:
  - User balance calculations
  - Exchange rate comparisons
  - Transaction summaries
  - Audit trails
- **5,418 Triggers** implementing automated business rules:
  - Data validation triggers
  - Audit logging triggers
  - Status update automation
  - Business rule enforcement

### **Key Business Functions Available:**

- **Remittance Processing**: Complete send/receive workflow
- **Exchange Operations**: Rate calculations, buy/sell logic
- **User Management**: Registration, verification, profiles
- **Payment Processing**: Transaction handling, balance updates
- **Risk Assessment**: Customer scoring, compliance checks
- **Audit & Compliance**: Complete activity tracking

### Largest Tables (by rows):

1. `sec_emp.geoip_blocks` - 3,806,136 rows (GeoIP data)
2. `sec_emp.ms_ip_countries` - 3,802,379 rows (IP location mapping)
3. `sec_emp.asn_blocks` - 536,807 rows (ASN data)
4. `sec_emp.geoip_locations` - 122,275 rows (Geographic locations)
5. `sec_cust.logs_actions_obj` - 61,206 rows (Action logs)

### Key Business Tables:

- **Users**: `sec_cust.ms_sixmap_users` (5,061 users)
- **Exchanges**: `prc_mng.lnk_cr_exchanges` (Exchange data)
- **Remittances**: `prc_mng.lnk_cr_remittances` (Remittance records)
- **Transactions**: `prc_mng.ms_cr_origin_transactions` (Transaction origins)
- **Currencies**: `sec_cust.ms_currencies` (Currency definitions)
- **Banks**: `sec_cust.ms_banks` (Bank information)

### Schema Breakdown:

- `msg_app` - WhatsApp messaging system
- `ord_sch` - Order schema (markets, exchanges, rates)
- `prc_mng` - Process management (exchanges, remittances, cycles)
- `sec_cust` - Customer security (users, auth, verification)
- `sec_emp` - Employee security (admin users, geo data)
- `priv` - Private/internal user data
- `public` - Public access tables

## 🛠️ Advanced Business Logic Analysis

### Analyze Complete Business Workflows

```sql
-- Example: Complete remittance workflow analysis
explainBusinessProcess('remittance')

-- This will show you:
-- 1. All remittance-related functions
-- 2. Business views for remittance data
-- 3. Triggers that fire during remittance process
-- 4. Tables involved in remittance workflow
```

### Understand Function Implementations

```bash
# See the actual PL/pgSQL code
describeFunctionLogic('prc_mng.sp_validate_exchange_limits')

# This shows:
# - Complete function source code
# - Input/output parameters
# - Business logic implementation
# - Error handling procedures
```

### Business Intelligence Queries

```sql
-- Find all tables that reference users
SELECT
    tc.table_schema,
    tc.table_name,
    kcu.column_name,
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND ccu.table_name = 'ms_sixmap_users';
```

### Business Intelligence Queries

````sql
-- User activity analysis
SELECT
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as user_registrations
FROM sec_cust.ms_sixmap_users
WHERE created_at > CURRENT_DATE - INTERVAL '12 months'
GROUP BY month
ORDER BY month;

### Business Intelligence Queries
```sql
-- Analyze user activity with business functions
SELECT
    u.user_email,
    msg_app.get_loyalty_level_value(u.id_loyalty_level) as loyalty_level,
    msg_app.get_risk_level_value(u.id_risk_level) as risk_level
FROM sec_cust.ms_sixmap_users u
WHERE u.created_at > CURRENT_DATE - INTERVAL '30 days';

-- Use business views for complex analysis
SELECT * FROM prc_mng.v_exchanges_full_info
WHERE exchange_status = 'completed'
ORDER BY created_at DESC;
````

### Function Dependency Analysis

```bash
# Find all functions that call a specific function
findFunctions('sp_validate_user')

# Analyze trigger chains
findTriggers('after_insert')

# Understand business process flows
analyzeBusinessWorkflow('kyc_verification')
```

## 🚨 Performance Notes

- **Large tables** (3M+ rows) may have slow COUNT(\*) operations
- **Query limits** are enforced (default 100 rows) to prevent memory issues
- **Timeouts** are set for row count operations (5 seconds)
- **Connection pooling** is used for efficiency

## 💡 Use Cases

### Business Logic Understanding

- **Understand business rules**: See exactly how functions implement business logic
- **Trace workflows**: Follow complete business processes from start to finish
- **Analyze triggers**: Understand automated business rule enforcement
- **Function dependencies**: See how business functions call each other

### Development & Maintenance

- **Debug business logic**: Examine function implementations for issues
- **Impact analysis**: Understand what changes when you modify a function
- **Documentation**: Generate business logic documentation
- **Code review**: Analyze PL/pgSQL implementations

### Business Analysis

- Track user growth and activity using business functions
- Analyze transaction patterns through business views
- Monitor currency exchange volumes with computed views
- Audit user verification levels using business logic

### Operations & Compliance

- **Monitor business processes**: Track function execution and performance
- **Audit trail analysis**: Use business views for compliance reporting
- **Risk assessment**: Analyze customer risk using business functions
- **Performance optimization**: Identify slow business logic functions

## 🆘 Troubleshooting

### Connection Issues

- Verify your `.env` file has correct database credentials
- Check if the database servers are accessible
- Ensure firewall allows connections on port 5432

### Query Performance

- Use LIMIT clauses for large result sets
- Add WHERE conditions to filter data
- Consider using table samples for exploration

### Memory Issues

- Reduce query result limits
- Process data in smaller chunks
- Close unused connections

## 📚 Next Steps

With this comprehensive analysis suite, you can now:

1. **🧠 Understand Complete Business Logic** - Access all 804 PL/pgSQL functions implementing your business rules
2. **🔍 Trace Business Workflows** - Follow complete processes from user registration to transaction completion
3. **⚡ Analyze Automated Rules** - Understand all 5,418 triggers enforcing business logic
4. **📊 Query Business Data** - Use 49 business views for complex analysis
5. **🎯 Ask Specific Questions** about any business process and get accurate answers
6. **🔧 Debug & Optimize** business logic performance and implementation
7. **📋 Generate Documentation** of your complete business logic layer

### **🎯 I'm Now Your Database Expert!**

**Ask me anything about your business logic:**

- "How does the remittance approval workflow work?"
- "Show me the exchange rate calculation functions"
- "What triggers fire when a user registers?"
- "How is customer risk level determined?"
- "What business rules validate large transactions?"

**Ready to explore your database!** 🚀

Start with the Business Logic tool: `node scripts/business-logic-query-tool.js`
