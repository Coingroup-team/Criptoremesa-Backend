# ⚡ SILT Flow Complete Documentation

> **⚠️ SECURITY NOTICE**: This documentation contains technical workflow information with placeholder values for sensitive configuration. Contact the development team for actual API endpoints, credentials, and environment-specific details.

## **🌟 Overview** SILT Flow Complete Documentation

## **🌟 Overview**

**SILT** is an external **third-party identity verification service** that provides **KYC (Know Your Customer)** verification for **Level 1 user verification** in the Criptoremesa platform. It performs identity document validation, facial recognition, and compliance checks (AML, PEP, MISCONDUCT).

---

## **🏗️ System Architecture**

### **📡 API Integration**

```
External SILT Service → Webhook → Criptoremesa Backend → Queue → Worker → Database
```

### **🔄 Processing Components**

- **Webhook Endpoint**: `POST /cr/veriflevels/silt/webhook`
- **Queue System**: Bull queue with Redis backend
- **Worker Process**: Dedicated `silt.worker.js` for background processing
- **Database Function**: `sec_cust.sp_request_level_one_silt()`

---

## **📋 Complete Workflow**

### **Phase 1: SILT Webhook Reception**

**1. External SILT Service → Criptoremesa Backend**

```javascript
// Route: POST /cr/veriflevels/silt/webhook
veriflevelsRouter.post(
  "/silt/webhook",
  veriflevelsController.levelOneVerfificationSilt
);
```

**Webhook Payload Processing:**

- **User Data**: Birth date, email, gender, nationality
- **Document Data**: Type (National ID=1, Passport=2, Driving License=3), country, number, file URLs
- **Verification Results**: SILT ID, status, verifications (AML, PEP, MISCONDUCT)
- **Files**: Document images and selfie URLs

**Status Evaluation Logic:**

```javascript
const getEvaluatedStatus = (
  globalStatus,
  userStatus,
  verifications,
  manualReviewStatus
) => {
  if (manualReviewStatus) return manualReviewStatus;

  if (userStatus === "SUCCESS") {
    const hasAML = verifications.some((v) => v.verification_type === "AML");
    const hasPEP = verifications.some((v) => v.verification_type === "PEP");
    const hasMisconduct = verifications.some(
      (v) => v.verification_type === "MISCONDUCT"
    );

    if (!hasAML || !hasPEP || !hasMisconduct) return "PENDING";
    return "SUCCESS";
  }

  if (
    globalStatus === "SUCCESS" &&
    (userStatus === "MANUAL_REVIEW" || userStatus === "BLOCKED")
  ) {
    return "PENDING";
  }

  if (
    globalStatus === "ERROR" ||
    globalStatus === "VERIFICATION_ERROR" ||
    (userStatus === "ERROR" && globalStatus === "SUCCESS")
  ) {
    return "ERROR";
  }

  return "PENDING";
};
```

### **Phase 2: Service Layer Processing**

**2. Controller → Service Layer**

```javascript
// Service converts country codes and prepares queue data
veriflevelsService.levelOneVerfificationSilt(
  dateBirth,
  emailUser,
  docType,
  countryDoc,
  identDocNumber,
  docPath,
  selfie,
  gender,
  nationalityCountry,
  siltID,
  siltStatus,
  manualReviewStatus
);
```

**Country Code Resolution:**

```javascript
// Convert 3-letter country codes (CCA3) to 2-letter codes (CCA2) via GeoNames API
const countryIsoCodeDoc = await veriflevelsHTTPRepository.getCountryIsoCodeCCA2(
  countryDoc
);
const nationalityCountryIsoCode =
  await veriflevelsHTTPRepository.getCountryIsoCodeCCA2(nationalityCountry);
```

### **Phase 3: Queue System**

**3. Service → SILT Queue**

```javascript
// Add request to Redis-backed Bull queue
addSiltRequestToQueue(siltRequest);
```

**Queue Configuration:**

```javascript
export const siltQueue = new Queue("siltQueue", {
  redis: {
    port: env.REDIS_PORT,
    host: env.REDIS_HOST,
    db: env.REDIS_DB_SILT_QUEUE, // Dedicated Redis database
    password: env.REDIS_PASSWORD,
  },
});
```

### **Phase 4: Background Worker Processing**

**4. SILT Worker Processes Queue**

```javascript
// Worker processes one job at a time (concurrency = 1)
siltQueue.process(1, async (job, done) => {
  try {
    const siltRequest = job.data;
    await veriflevelsPGRepository.levelOneVerfificationSilt(siltRequest);
    logger.info(`[SILT Queue] SILT request processed`);
    done();
  } catch (error) {
    logger.error(`[SILT Queue] SILT request error: ${error}`);
    done(error);
  }
});
```

### **Phase 5: Database Processing**

**5. Repository → Database Function**

```javascript
// PostgreSQL function call with 12 parameters
await poolSM.query({
  text: `select sec_cust.sp_request_level_one_silt($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
  values: [
    dateBirth,
    emailUser,
    docType,
    countryIsoCodeDoc,
    identDocNumber,
    docPath,
    selfie,
    gender,
    nationalityCountryIsoCode,
    siltID,
    siltStatus,
    manualReviewStatus,
  ],
});
```

---

## **🗄️ Database Business Logic**

### **📊 Core Database Function: `sp_request_level_one_silt`**

**Function Signature:**

```sql
sec_cust.sp_request_level_one_silt(
    p_date_birth timestamp with time zone,
    p_email_user character varying,
    p_doc_type integer,
    p_iso_doc_country character varying,
    p_doc_number character varying,
    p_doc_path character varying,
    p_selfie_path character varying,
    p_gender character,
    p_iso_nationality_country character,
    p_silt_id character varying,
    p_silt_status character varying,
    p_was_set_manually boolean
)
```

### **🔄 Database Processing Logic**

**1. User Validation & Lookup:**

```sql
-- Find user by email
SELECT * INTO v_current_full_user
FROM sec_cust.ms_app_users AS us
WHERE us.email_user = p_email_user;

-- Get user's name from private schema
select us.first_name, us.last_name
into v_first_name, v_last_name
from priv.ms_app_users us
where us.id_user_priv = v_current_full_user.id_user_priv;
```

**2. Country & Document Type Resolution:**

```sql
-- Resolve nationality country ID
select cou.id_all_country into v_id_nationality_country
from sec_emp.ms_all_countries cou
where cou.country_iso_code = p_iso_nationality_country;

-- Map document types based on country and type
CASE p_doc_type
    WHEN 1 THEN -- National ID
        SELECT id_doc_type INTO v_id_doc_type FROM sec_emp.ms_doc_type...
    WHEN 2 THEN -- Passport
        SELECT id_doc_type INTO v_id_doc_type FROM sec_emp.ms_doc_type...
    WHEN 3 THEN -- Driving License
        SELECT id_doc_type INTO v_id_doc_type FROM sec_emp.ms_doc_type...
END CASE;
```

**3. Duplicate Check & Processing:**

```sql
-- Check if SILT ID already exists
if (not exists(
    select lvl.id_users_verif_level
    from sec_cust.lnk_users_verif_level lvl
    where lvl.silt_id = p_silt_id
)) then
    -- NEW REQUEST: Insert new verification level
ELSE
    -- EXISTING REQUEST: Update existing verification
```

**4. New Verification Request:**

```sql
-- Get verification level template
SELECT * INTO v_id_level
FROM sec_cust.v_ms_verif_level_get_id_by_id_vl_service_utype_country(
    1,  -- Level 1 verification
    v_current_full_user.id_service,
    v_current_full_user.id_services_utype,
    v_current_full_user.id_resid_country
);

-- Deactivate previous level 1 verifications
UPDATE sec_cust.lnk_users_verif_level
SET is_the_last_one = FALSE
WHERE uuid_user = v_current_full_user.uuid_user
AND id_vl = 1
AND is_the_last_one IS TRUE;

-- Insert new verification level
INSERT INTO sec_cust.LNK_USERS_VERIF_LEVEL(
    id_vl, level_apb_ok, level_req, id_service, uuid_user,
    id_verif_level, id_resid_country, silt_id, active, is_the_last_one
) VALUES (
    1,
    CASE
        WHEN p_silt_status = 'SUCCESS' THEN true
        WHEN p_silt_status = 'ERROR' OR p_silt_status = 'VERIFICATION_ERROR' THEN false
        ELSE NULL
    END,
    -- JSON requirements object...
);
```

**5. Requirements Processing:**

```sql
-- Store document and selfie requirements
INSERT INTO sec_cust.LNK_USERS_VERIF_LEVEL_REQUIREMENTS(
    id_users_verif_level, id_verif_level_requirements,
    req_use_path, req_use_value, active
) VALUES (
    -- Document requirement
    (currval('sec_cust.lnk_users_verif_level_id_users_verif_level_seq'), doc_req_id, p_doc_path, p_doc_number, TRUE),
    -- Selfie requirement
    (currval('sec_cust.lnk_users_verif_level_id_users_verif_level_seq'), selfie_req_id, p_selfie_path, NULL, TRUE)
);
```

---

## **📊 Database Tables Involved**

### **🔗 Primary Tables:**

1. **`sec_cust.lnk_users_verif_level`** - Main verification level records

   - Links users to verification levels
   - Stores SILT ID and approval status
   - Tracks verification history

2. **`sec_cust.lnk_users_verif_level_requirements`** - Document storage

   - Stores document and selfie file paths
   - Links requirements to verification levels
   - Tracks requirement fulfillment

3. **`sec_cust.ms_app_users`** - User master data

   - User identification and service mapping
   - Links to private user information

4. **`priv.ms_app_users`** - Private user data
   - Names and sensitive information
   - Separated for security compliance

### **🌍 Reference Tables:**

- **`sec_emp.ms_all_countries`** - Country codes and mappings
- **`sec_emp.ms_doc_type`** - Document type definitions
- **`sec_cust.ms_verif_level`** - Verification level templates

---

## **⚡ Production Deployment**

### **🚀 PM2 Configuration:**

```javascript
{
  name: '<ask_team_for_worker_name>:silt-worker',
  script: 'node_modules/.bin/babel-node',
  args: 'src/utils/workers/silt.worker.js',
  instances: 1,  // Single instance for ordered processing
  exec_mode: 'fork',
  autorestart: true,
  watch: false,
  error_file: './logs/silt-err.log',
  out_file: './logs/silt-out.log'
}
```

### **📊 Bull Board Monitoring:**

- **Dashboard**: `/admin/queues` - Monitor SILT queue status
- **Metrics**: Job counts, processing times, failure rates
- **Real-time**: Live queue monitoring and job details

---

## **🎯 Business Impact**

### **✅ Verification Outcomes:**

1. **SUCCESS**: User achieves Level 1 verification

   - Can perform basic remittances
   - Access to platform features unlocked
   - Compliance requirements satisfied

2. **PENDING**: Requires manual review

   - AML/PEP/MISCONDUCT checks incomplete
   - Document quality issues
   - Manual intervention needed

3. **ERROR**: Verification failed
   - Document rejected
   - Identity mismatch
   - Compliance flags triggered

### **📈 System Benefits:**

- **Scalability**: Asynchronous processing handles high volumes
- **Reliability**: Queue system ensures no lost requests
- **Monitoring**: Comprehensive logging and error tracking
- **Compliance**: Full audit trail of verification attempts
- **Performance**: Non-blocking webhook responses

---

## **🛠️ Development & Testing**

### **Environment Variables:**

```bash
REDIS_HOST=<ask_team_for_redis_host>
REDIS_PORT=<ask_team_for_redis_port>
REDIS_PASSWORD=<ask_team_for_redis_password>
REDIS_DB_SILT_QUEUE=2
```

### **Running SILT Worker:**

```bash
# Development
npm run dev:silt

# Production
npm run start:silt
```

### **Testing Webhook:**

```bash
curl -X POST http://localhost:3000/cr/veriflevels/silt/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "user": {
      "id": "silt_test_id",
      "birth_date": "1990-01-01",
      "sex": "M",
      "nationality": "USA",
      "national_id": {
        "country": "USA",
        "document_number": "123456789",
        "files": [{"file_url": "https://example.com/doc.jpg"}]
      },
      "selfie": {"file_url": "https://example.com/selfie.jpg"}
    },
    "user_meta": {"email_user": "user@example.com"},
    "status": "SUCCESS",
    "processing_attempt": true
  }'
```

---

## **🔧 Troubleshooting**

### **Common Issues:**

1. **Queue Not Processing:**

   - Check Redis connection
   - Verify worker is running
   - Check Bull Board dashboard

2. **Database Errors:**

   - Validate user exists in system
   - Check country code mappings
   - Verify document type configuration

3. **SILT ID Conflicts:**
   - Check for duplicate SILT IDs
   - Review verification level history
   - Verify webhook payload format

### **Monitoring Commands:**

```bash
# Check queue status
node scripts/database-api-server.js

# View logs
tail -f logs/silt-out.log
tail -f logs/silt-err.log

# Bull Board dashboard
open http://localhost:3000/admin/queues
```

This SILT integration provides a robust, scalable identity verification system that ensures regulatory compliance while maintaining excellent user experience through asynchronous processing and comprehensive error handling.
