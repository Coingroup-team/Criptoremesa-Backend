# SILT to Persona Full Migration - Production Deployment Guide

**Date**: December 31, 2025  
**Purpose**: Complete step-by-step guide for deploying SILT to Persona migration to production  
**Status**: Ready for Production Deployment

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Migrations - Criptoremesa-Backend](#database-migrations-criptoremesa-backend)
3. [Database Migrations - backend-sixm](#database-migrations-backend-sixm)
4. [Persona Dashboard Configuration](#persona-dashboard-configuration)
5. [Environment Variables](#environment-variables)
6. [Backend Code Deployment](#backend-code-deployment)
7. [Frontend Code Deployment](#frontend-code-deployment)
8. [Verification & Testing](#verification--testing)
9. [Rollback Plan](#rollback-plan)

---

## Prerequisites

### ✅ What You Need

- [ ] **Database Access**: PostgreSQL superuser or owner of `criptoremesa_db`
- [ ] **Persona Account**: Production environment with API keys
- [ ] **Server Access**: SSH access to production servers
- [ ] **Backup**: Full database backup completed
- [ ] **Code Commits**: All changes committed to main/master branch
- [ ] **Environment Files**: Production `.env` files configured

### 📦 Dependencies Already Installed

- Node.js v18+
- PostgreSQL 12+
- Redis (for Bull queues)
- NGINX (reverse proxy)

---

## Database Migrations - Criptoremesa-Backend

### Migration Order

Execute these migrations in **EXACT ORDER** on the `criptoremesa_db` database:

#### 1️⃣ Add Persona Inquiry ID to Users Table

**File**: `sql-migrations/add_persona_inquiry_id_to_users.sql`

```bash
psql -U postgres -d criptoremesa_db -f sql-migrations/add_persona_inquiry_id_to_users.sql
```

**What it does**:
- Adds `persona_inquiry_id` column to `sec_cust.ms_sixmap_users`
- Creates index for faster lookups

**Verify**:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'sec_cust' 
  AND table_name = 'ms_sixmap_users' 
  AND column_name = 'persona_inquiry_id';
```

---

#### 2️⃣ Add Persona Inquiry ID to Verification Level

**File**: `sql-migrations/002-add-persona-inquiry-id-to-verif-level.sql`

```bash
psql -U postgres -d criptoremesa_db -f sql-migrations/002-add-persona-inquiry-id-to-verif-level.sql
```

**What it does**:
- Adds `persona_inquiry_id` column to `sec_cust.lnk_users_verif_level`
- Creates index: `idx_lnk_users_verif_level_persona_inquiry_id`

**Verify**:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'sec_cust' 
  AND table_name = 'lnk_users_verif_level' 
  AND column_name = 'persona_inquiry_id';
```

---

#### 3️⃣ Create Persona Verification Functions

**File**: `sql-migrations/003-create-persona-verification-functions.sql`

```bash
psql -U postgres -d criptoremesa_db -f sql-migrations/003-create-persona-verification-functions.sql
```

**What it does**:
- Creates `Persona Information` category in `sec_cust.ms_category`
- Creates 5 Persona items in `sec_cust.ms_item`:
  - `persona_inquiry_id`
  - `persona_reference_id`
  - `persona_status`
  - `persona_webhook_full_json`
  - `persona_created_at`
- Creates stored procedures:
  - `sp_request_level_one_persona()` - Core verification logic with concurrency protection
  - `sp_request_level_one_persona_enhanced()` - Wrapper with extra data storage

**Verify**:
```sql
-- Check category
SELECT id_category, name, description 
FROM sec_cust.ms_category 
WHERE name = 'Persona Information';

-- Check items
SELECT id_item, name 
FROM sec_cust.ms_item 
WHERE id_category = (
  SELECT id_category FROM sec_cust.ms_category WHERE name = 'Persona Information'
);

-- Check functions exist
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'sec_cust' 
  AND routine_name LIKE '%persona%';
```

---

#### 3️⃣-B **CRITICAL FIX**: Race Condition Protection

**File**: `sql-migrations/005-fix-race-condition-persona-function.sql`

```bash
psql -U postgres -d criptoremesa_db -f sql-migrations/005-fix-race-condition-persona-function.sql
```

**What it does**:
- ⚠️ **CRITICAL**: Fixes race condition that causes duplicate `is_the_last_one = TRUE` records
- Adds `FOR UPDATE` row-level lock to prevent simultaneous webhooks from creating duplicates
- **When race condition occurs**: Multiple webhooks arrive at same time → both insert records with `is_the_last_one = TRUE` → causes "more than one row returned by a subquery" error
- **How lock fixes it**: First webhook locks the user's row → second webhook waits → processes sequentially

**Why this is critical**:
Without this fix, simultaneous Persona webhooks (common during testing or Persona retries) will create data integrity issues causing login failures with error: `"more than one row returned by a subquery used as an expression"`

**Verify**:
```sql
-- Verify function has FOR UPDATE lock
SELECT prosrc 
FROM pg_proc 
WHERE proname = 'sp_request_level_one_persona' 
  AND prosrc LIKE '%FOR UPDATE%';
  
-- Should return the function source with "FOR UPDATE" in the SELECT statement
```

---

#### 4️⃣ Update Get Client Profile Function

**File**: `sql-migrations/004-update-get-client-profile-with-verif-levels.sql`

```bash
psql -U postgres -d criptoremesa_db -f sql-migrations/004-update-get-client-profile-with-verif-levels.sql
```

**What it does**:
- Updates `sp_get_client_profile_with_verif_levels()` to include `persona_inquiry_id`
- Adds Persona data to client profile API response

**Verify**:
```sql
-- Test the function (replace with real user email)
SELECT sec_cust.sp_get_client_profile_with_verif_levels('test@example.com');
```

---

#### 5️⃣ Update Get All Users By Email Function

**File**: `sql-migrations/update_get_all_users_by_email_function.sql`

```bash
psql -U postgres -d criptoremesa_db -f sql-migrations/update_get_all_users_by_email_function.sql
```

**What it does**:
- Updates `sp_get_all_users_by_email()` to include `persona_inquiry_id`
- Exposes Persona data in user search results

**Verify**:
```sql
-- Test the function
SELECT sec_cust.sp_get_all_users_by_email('test@example.com');
```

---

## Database Migrations - backend-sixm

### Migration Order

Execute on the same `criptoremesa_db` database (backend-sixm shares the database):

#### 6️⃣ Update Verification Levels List Function

**File**: `backend-sixm/src/db/update_sp_list_verif_levels_requirements_add_persona_inquiry_id.sql`

```bash
psql -U postgres -d criptoremesa_db -f backend-sixm/src/db/update_sp_list_verif_levels_requirements_add_persona_inquiry_id.sql
```

**What it does**:
- Updates `sec_cust.v_verification_level` view to include `persona_inquiry_id`
- Updates `sp_list_verif_levels_requirements()` to return `persona_inquiry_id` in API response
- Enables admin panel to display Persona inquiry IDs in verification list

**Verify**:
```sql
-- Check view definition
\d+ sec_cust.v_verification_level

-- Test function
SELECT sec_cust.sp_list_verif_levels_requirements(true, false);
```

---

## Persona Dashboard Configuration

### 1. Create Production Environment

1. Log in to [https://app.withpersona.com](https://app.withpersona.com)
2. Navigate to **Settings** → **Environments**
3. Create a new **Production** environment (if not already created)
4. Note the **Environment ID**

---

### 2. Generate API Keys

1. In Production environment, go to **Settings** → **API Keys**
2. Click **Create API Key**
3. Name it: `Criptoremesa Production Backend`
4. Permissions needed:
   - ✅ **Read** - Inquiries
   - ✅ **Read** - Accounts
   - ✅ **Read** - Documents
   - ✅ **Read** - Verifications
5. Copy and save:
   - **API Key ID**: `per_xxx...`
   - **API Secret**: Keep this secure!

---

### 3. Configure Webhook

1. Go to **Settings** → **Webhooks**
2. Click **Add Webhook**
3. Configure:
   - **URL**: `https://criptoremesa.com/api/webhook/persona`
   - **Version**: Latest (v2024-12-01 or newer)
   - **Events to subscribe**:
     - ✅ `inquiry.completed`
     - ✅ `inquiry.failed`
     - ✅ `inquiry.expired`
     - ✅ `inquiry.marked-for-review`
     - ✅ `inquiry.approved`
     - ✅ `inquiry.declined`
   - **Secret**: Generate and save it (used for signature verification)

4. Click **Create Webhook**
5. Copy the **Webhook Secret** (starts with `whsec_`)

---

### 4. Create Inquiry Template

1. Go to **Inquiry Templates**
2. Click **Create Template**
3. Configure:
   - **Name**: `Criptoremesa Level 1 Verification`
   - **Type**: `Standard Verification`
   - **Flow**:
     - Document Upload (Government ID)
     - Selfie Capture (Liveness Check)
     - Personal Information Form
   - **Required Fields**:
     - First Name
     - Last Name
     - Date of Birth
     - Nationality
     - Document Number
   - **Document Types Accepted**:
     - National ID
     - Passport
     - Driver's License
   - **Countries**: Select all countries you operate in

4. **Save** and note the **Template ID**: `itmpl_xxx...`

---

### 5. Configure Verification Checks

1. In your Inquiry Template, go to **Verification Checks**
2. Enable:
   - ✅ **Document Authentication** - Verify document is authentic
   - ✅ **Face Match** - Compare selfie to document photo
   - ✅ **Liveness Check** - Ensure selfie is a live person
   - ✅ **Watchlist Screening** (optional) - Check against sanctions lists
   - ✅ **Database Verification** (optional) - Cross-reference with external databases

3. Set **Decision Logic**:
   - **Auto-approve** if all checks pass
   - **Manual review** if any check fails or is inconclusive

4. **Save Changes**

---

## Environment Variables

### Criptoremesa-Backend Production `.env`

Add or update these variables:

```bash
# Persona API Configuration
PERSONA_API_KEY=per_xxx...
PERSONA_API_SECRET=your_secret_here
PERSONA_ENVIRONMENT_ID=your_env_id
PERSONA_TEMPLATE_ID=itmpl_xxx...
PERSONA_WEBHOOK_SECRET=whsec_xxx...
PERSONA_API_BASE_URL=https://withpersona.com/api/v1

# Redis Configuration (for Bull queues)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# Database Configuration (ensure these are correct)
PG_DB_SM_HOST=your_db_host
PG_DB_SM_PORT=5432
PG_DB_SM_NAME=criptoremesa_db
PG_DB_SM_USER=postgres
PG_DB_SM_PASSWORD=your_db_password

# Application URLs
FRONTEND_URL=https://criptoremesa.com
BACKEND_URL=https://criptoremesa.com/api
```

**Security Notes**:
- ⚠️ Never commit `.env` to version control
- ⚠️ Keep API secrets encrypted at rest
- ⚠️ Rotate secrets every 90 days

---

### backend-sixm Production `.env`

Add or update:

```bash
# Same database connection as Criptoremesa-Backend
PG_DB_SM_HOST=your_db_host
PG_DB_SM_PORT=5432
PG_DB_SM_NAME=criptoremesa_db
PG_DB_SM_USER=postgres
PG_DB_SM_PASSWORD=your_db_password
```

---

## Backend Code Deployment

### Criptoremesa-Backend

#### 1. Stop Current Services

```bash
ssh user@production-server
cd /repo-cr/Criptoremesa-Backend
pm2 stop criptoremesa-backend
```

#### 2. Pull Latest Code

```bash
git pull origin main
```

#### 3. Install Dependencies

```bash
npm install
```

#### 4. Verify Environment Variables

```bash
# Check .env file exists and has Persona variables
cat .env | grep PERSONA
```

#### 5. Start Services

```bash
pm2 start ecosystem.config.js
pm2 save
```

#### 6. Monitor Logs

```bash
pm2 logs criptoremesa-backend --lines 100
```

**Look for**:
- ✅ `Persona queue initialized`
- ✅ `Persona worker started`
- ✅ `📊 Queues monitored: SILT, Persona, Remittance`
- ❌ Any error messages related to Persona

---

### backend-sixm

#### 1. Stop Current Services

```bash
cd /repo-cr/backend-sixm
pm2 stop backend-sixm
```

#### 2. Pull Latest Code

```bash
git pull origin main
```

#### 3. Install Dependencies

```bash
npm install
```

#### 4. Start Services

```bash
pm2 start ecosystem.config.js
pm2 save
```

#### 5. Verify

```bash
pm2 logs backend-sixm --lines 50
```

---

## Frontend Code Deployment

### Criptoremesa-Frontend

#### 1. Stop NGINX (Temporarily)

```bash
sudo systemctl stop nginx
```

#### 2. Pull Latest Code

```bash
cd /var/www/criptoremesa-frontend
git pull origin main
```

#### 3. Install Dependencies

```bash
npm install
```

#### 4. Build Production Assets

```bash
npm run build
```

#### 5. Update NGINX Config (if needed)

Ensure `/etc/nginx/sites-available/criptoremesa` has:

```nginx
location /api/webhook/persona {
    proxy_pass http://localhost:3010/api/webhook/persona;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

#### 6. Restart NGINX

```bash
sudo systemctl start nginx
sudo systemctl status nginx
```

---

### Sixmap-Frontend-Vuero

#### 1. Pull Latest Code

```bash
cd /var/www/sixmap-frontend
git pull origin main
```

#### 2. Build

```bash
npm install
npm run build
```

#### 3. Restart Services

```bash
sudo systemctl restart nginx
```

---

## Verification & Testing

### 1. Database Verification

```sql
-- Check Persona category and items exist
SELECT 
    c.name as category_name,
    i.name as item_name
FROM sec_cust.ms_category c
JOIN sec_cust.ms_item i ON i.id_category = c.id_category
WHERE c.name = 'Persona Information';

-- Expected 5 items:
-- persona_inquiry_id
-- persona_reference_id
-- persona_status
-- persona_webhook_full_json
-- persona_created_at

-- Check functions exist
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'sec_cust' 
  AND routine_name LIKE '%persona%';

-- Expected:
-- sp_request_level_one_persona
-- sp_request_level_one_persona_enhanced
```

---

### 2. API Health Check

```bash
# Check backend is running
curl https://criptoremesa.com/api/health

# Check Bull Board (queue monitor)
# Open in browser: https://criptoremesa.com/api/admin/queues
# Should see: SILT, Persona, Remittance queues
```

---

### 3. Test Persona Inquiry Creation

**Via Postman/cURL**:

```bash
curl -X POST https://criptoremesa.com/api/verification/persona/create-inquiry \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "email": "test@example.com",
    "referenceId": "TEST-001"
  }'
```

**Expected Response**:

```json
{
  "success": true,
  "data": {
    "inquiryId": "inq_xxx...",
    "inquiryUrl": "https://withpersona.com/verify?inquiry-id=inq_xxx..."
  }
}
```

---

### 4. Test Webhook Reception

#### A. Send Test Webhook from Persona Dashboard

1. Go to Persona Dashboard → **Settings** → **Webhooks**
2. Find your webhook
3. Click **Send Test Event**
4. Select event type: `inquiry.completed`
5. Click **Send**

#### B. Monitor Backend Logs

```bash
pm2 logs criptoremesa-backend | grep persona
```

**Expected Logs**:
```
[INFO] Received Persona webhook: inquiry.completed
[INFO] Persona inquiry inq_xxx... status: completed
[INFO] Processed Persona webhook successfully
```

#### C. Check Database

```sql
SELECT 
    u.email_user,
    l.persona_inquiry_id,
    l.verif_level_apb
FROM sec_cust.lnk_users_verif_level l
JOIN sec_cust.ms_sixmap_users u ON u.uuid_user = l.uuid_user
WHERE l.persona_inquiry_id IS NOT NULL
ORDER BY l.date_creation DESC
LIMIT 5;
```

---

### 5. End-to-End User Flow Test

1. **Create Test User** (if needed):
   ```bash
   # Use your existing user creation endpoint
   ```

2. **Initiate Verification** via frontend or API

3. **User completes Persona inquiry** (use real documents in production or Persona sandbox)

4. **Webhook triggers** → Backend processes → Database updates

5. **Verify User Status**:
   ```sql
   SELECT 
       u.email_user,
       l.id_vl as verification_level,
       l.verif_level_apb as approved,
       l.persona_inquiry_id,
       e.value as persona_status
   FROM sec_cust.ms_sixmap_users u
   JOIN sec_cust.lnk_users_verif_level l ON l.uuid_user = u.uuid_user
   LEFT JOIN sec_cust.lnk_users_extra_data e 
       ON e.uuid_user = u.uuid_user 
       AND e.id_item = (SELECT id_item FROM sec_cust.ms_item WHERE name = 'persona_status')
   WHERE u.email_user = 'test@example.com';
   ```

6. **Check Admin Panel** (backend-sixm):
   - Navigate to verification list
   - Verify `persona_inquiry_id` column shows
   - Click user → View Persona data

---

## Rollback Plan

### If Issues Occur After Deployment

#### 1. Stop Services Immediately

```bash
pm2 stop criptoremesa-backend
pm2 stop backend-sixm
```

#### 2. Restore Previous Code Version

```bash
cd /repo-cr/Criptoremesa-Backend
git reset --hard HEAD~1  # or specific commit hash
pm2 start ecosystem.config.js
```

#### 3. Rollback Database (if needed)

⚠️ **CRITICAL**: Only if migrations caused issues

```bash
# Restore from backup
psql -U postgres criptoremesa_db < backup_before_persona_migration.sql

# Or manually drop changes
psql -U postgres -d criptoremesa_db <<EOF
-- Drop functions
DROP FUNCTION IF EXISTS sec_cust.sp_request_level_one_persona CASCADE;
DROP FUNCTION IF EXISTS sec_cust.sp_request_level_one_persona_enhanced CASCADE;

-- Drop columns
ALTER TABLE sec_cust.lnk_users_verif_level DROP COLUMN IF EXISTS persona_inquiry_id;
ALTER TABLE sec_cust.ms_sixmap_users DROP COLUMN IF EXISTS persona_inquiry_id;

-- Drop items and category
DELETE FROM sec_cust.ms_item WHERE id_category = (
    SELECT id_category FROM sec_cust.ms_category WHERE name = 'Persona Information'
);
DELETE FROM sec_cust.ms_category WHERE name = 'Persona Information';
EOF
```

#### 4. Disable Persona Webhook

1. Go to Persona Dashboard
2. Settings → Webhooks
3. Click your webhook → **Disable**

---

## Post-Deployment Monitoring

### 1. Monitor Queue Health

Visit: `https://criptoremesa.com/api/admin/queues`

**Watch for**:
- ❌ Failed jobs in Persona queue
- ⚠️ Stuck jobs (processing > 5 minutes)
- ✅ Completed job count increasing

### 2. Monitor Logs

```bash
# Watch for errors
pm2 logs --err | grep -i persona

# Watch for successful webhook processing
pm2 logs | grep "Persona webhook"
```

### 3. Database Monitoring

```sql
-- Monitor verification creation rate
SELECT 
    date_trunc('hour', date_creation) as hour,
    COUNT(*) as verifications_created
FROM sec_cust.lnk_users_verif_level
WHERE persona_inquiry_id IS NOT NULL
  AND date_creation > NOW() - INTERVAL '24 hours'
GROUP BY hour
ORDER BY hour DESC;

-- Check for processing errors
SELECT 
    u.email_user,
    l.persona_inquiry_id,
    l.date_creation,
    e.value as status
FROM sec_cust.lnk_users_verif_level l
JOIN sec_cust.ms_sixmap_users u ON u.uuid_user = l.uuid_user
LEFT JOIN sec_cust.lnk_users_extra_data e 
    ON e.uuid_user = u.uuid_user 
    AND e.id_item = (SELECT id_item FROM sec_cust.ms_item WHERE name = 'persona_status')
WHERE l.persona_inquiry_id IS NOT NULL
  AND l.date_creation > NOW() - INTERVAL '1 hour'
ORDER BY l.date_creation DESC;
```

---

## Summary Checklist

### Pre-Deployment

- [ ] Database backup completed
- [ ] Code committed to version control
- [ ] Persona production account configured
- [ ] Environment variables set in production `.env`
- [ ] Team notified of deployment window

### During Deployment

- [ ] All 7 SQL migrations executed successfully
  - [ ] Migration 1: add_persona_inquiry_id_to_users.sql
  - [ ] Migration 2: 002-add-persona-inquiry-id-to-verif-level.sql
  - [ ] Migration 3: 003-create-persona-verification-functions.sql
  - [ ] Migration 3-B: **005-fix-race-condition-persona-function.sql** (CRITICAL)
  - [ ] Migration 4: 004-update-get-client-profile-with-verif-levels.sql
  - [ ] Migration 5: update_get_all_users_by_email_function.sql
  - [ ] Migration 6: backend-sixm update_sp_list_verif_levels_requirements_add_persona_inquiry_id.sql
- [ ] Functions and views created/updated
- [ ] Backend code deployed (Criptoremesa-Backend + backend-sixm)
- [ ] Frontend code built and deployed
- [ ] Services restarted
- [ ] No errors in logs

### Post-Deployment

- [ ] Webhook test successful
- [ ] API health check passes
- [ ] Queue monitoring active
- [ ] End-to-end user flow tested
- [ ] Admin panel shows Persona data
- [ ] Monitoring alerts configured
- [ ] Documentation updated

---

## Support & Troubleshooting

### Common Issues

#### Issue: Webhook returns 401 Unauthorized

**Solution**: Check `PERSONA_WEBHOOK_SECRET` in `.env` matches Persona Dashboard

#### Issue: Database function not found

**Solution**: Verify migrations ran successfully:
```sql
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'sec_cust' AND routine_name LIKE '%persona%';
```

#### Issue: Queue jobs failing

**Solution**: Check Redis connection:
```bash
redis-cli ping  # Should return PONG
```

### Contact

- **Database Issues**: DBA Team
- **API Issues**: Backend Team
- **Frontend Issues**: Frontend Team
- **Persona Dashboard**: support@withpersona.com

---

**End of Deployment Guide**
