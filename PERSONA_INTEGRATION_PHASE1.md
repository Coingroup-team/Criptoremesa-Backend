# Persona Integration - Phase 1 Implementation Guide

## 📋 Overview

This document describes Phase 1 of the migration from SILT to Persona for KYC verification. Phase 1 focuses on creating Persona inquiries and obtaining session tokens to enable the verification flow.

## 🎯 Phase 1 Scope

✅ **Implemented:**
- Create Persona inquiry via API
- Store `persona_inquiry_id` in database
- Get session token for verification flow
- Database schema migration

🔜 **Phase 2 (Future):**
- Webhook integration for inquiry status updates
- Manual review workflow
- Report handling (PEP, AML)
- Complete SILT to Persona migration

## 🗄️ Database Changes

### Migration File
Location: `sql-migrations/add_persona_inquiry_id_to_users.sql`

### Changes Made
```sql
ALTER TABLE sec_cust.ms_sixmap_users
ADD COLUMN persona_inquiry_id VARCHAR(255) NULL;

-- Index for performance
CREATE INDEX idx_ms_sixmap_users_persona_inquiry_id 
ON sec_cust.ms_sixmap_users(persona_inquiry_id);
```

### How to Apply Migration
```bash
# Connect to your database
psql -h 18.222.5.211 -U postgres -d PRE-QA-CG

# Run the migration
\i sql-migrations/add_persona_inquiry_id_to_users.sql

# Verify the change
\d sec_cust.ms_sixmap_users
```

## ⚙️ Configuration

### Environment Variables (.env)

Add these variables to your `.env` file:

```bash
# Persona Configuration
PERSONA_API_URL=https://withpersona.com/api/v1
PERSONA_API_KEY=your_persona_api_key_here
PERSONA_INQUIRY_TEMPLATE_ID=your_inquiry_template_id_here
```

### How to Get Persona Credentials

1. **API Key:**
   - Log in to Persona Dashboard
   - Go to Settings → API Keys
   - Create a new API key or copy existing one
   - Use the **Production** or **Sandbox** key depending on environment

2. **Inquiry Template ID:**
   - Go to Dashboard → Inquiry Templates
   - Create or select your KYC verification template
   - Copy the Template ID (format: `itmpl_xxxxxxxxxxxxx`)

## 🚀 API Endpoints

### 1. Create Inquiry & Get Session Token

**Endpoint:** `POST /veriflevels/persona/create-inquiry`

**Request Body:**
```json
{
  "email_user": "user@example.com"
}
```

**Response (New Inquiry):**
```json
{
  "inquiryId": "inq_xxxxxxxxxxxxxx",
  "sessionToken": "sess_xxxxxxxxxxxxxxxxxxxxx",
  "status": "created",
  "isNewInquiry": true,
  "message": "Persona inquiry created successfully"
}
```

**Response (Existing Inquiry):**
```json
{
  "inquiryId": "inq_xxxxxxxxxxxxxx",
  "sessionToken": "sess_xxxxxxxxxxxxxxxxxxxxx",
  "status": "pending",
  "isNewInquiry": false,
  "message": "Using existing Persona inquiry"
}
```

### 2. Get Inquiry Status

**Endpoint:** `GET /veriflevels/persona/inquiry-status/:email_user`

**Response:**
```json
{
  "hasInquiry": true,
  "inquiryId": "inq_xxxxxxxxxxxxxx",
  "status": "approved",
  "createdAt": "2025-12-12T10:30:00Z",
  "completedAt": "2025-12-12T10:45:00Z",
  "referenceId": "user@example.com"
}
```

**Inquiry Statuses:**
- `created` - Just created, not started
- `pending` - User is in progress
- `completed` - User completed flow
- `approved` - Verification approved
- `declined` - Verification declined
- `needs_review` - Requires manual review

## 📁 File Structure

```
src/modules/veriflevels/
├── controllers/
│   └── veriflevels.controller.js       # Added createPersonaInquiry, getPersonaInquiryStatus
├── services/
│   └── veriflevels.service.js          # Added Persona service methods
├── repositories/
│   ├── veriflevels.pg.repository.js    # Added DB methods for persona_inquiry_id
│   └── persona.http.repository.js      # NEW - Persona API integration
└── veriflevels.routes.js               # Added Persona endpoints

sql-migrations/
└── add_persona_inquiry_id_to_users.sql # Database migration
```

## 🔄 Integration Flow

### Backend Flow (Phase 1)

```
1. Frontend calls: POST /veriflevels/persona/create-inquiry
   └─> Body: { email_user }

2. Backend gets user full information (reuses existing endpoint logic)
   └─> Calls: authenticationPGRepository.getUserByEmail()
   └─> This is the SAME function used by GET /users/full-info/:email_user

3. If user has persona_inquiry_id (from full user info):
   ├─> Get existing inquiry session token
   └─> Return: { inquiryId, sessionToken, isNewInquiry: false }

4. If user has NO persona_inquiry_id:
   ├─> Create inquiry in Persona API
   ├─> Store persona_inquiry_id in database
   ├─> Get session token
   └─> Return: { inquiryId, sessionToken, isNewInquiry: true }
```

### Why This Approach Is Better

✅ **Reuses Existing Code**: The `/users/full-info/:email_user` endpoint already exists and is used throughout the application. We leverage `authenticationPGRepository.getUserByEmail()` instead of creating redundant code.

✅ **Single Source of Truth**: The `get_all_users_by_email()` database function automatically returns ALL user fields including the new `persona_inquiry_id` - no need for separate queries.

✅ **Maintainability**: If user data structure changes, we only update one place (the existing function) rather than multiple scattered queries.

### Frontend Integration (Next Steps)

Once you have the `sessionToken` and `inquiryId`, embed Persona in your frontend:

```javascript
// Example: Embedded Flow
const client = new Persona.Client({
  templateId: 'itmpl_xxxxx', // Your template ID
  environmentId: 'env_xxxxx', // Your environment ID
  inquiryId: 'inq_xxxxx',    // From API response
  sessionToken: 'sess_xxxxx',  // From API response
  onComplete: ({ inquiryId, status, fields }) => {
    // Handle completion
    console.log('Inquiry completed:', inquiryId, status);
  },
  onCancel: ({ inquiryId }) => {
    // Handle cancellation
    console.log('Inquiry cancelled:', inquiryId);
  },
  onError: (error) => {
    // Handle errors
    console.error('Inquiry error:', error);
  }
});

client.open();
```

## 🧪 Testing

### Test the Endpoints

```bash
# 1. Create inquiry and get session token
curl -X POST http://localhost:5031/veriflevels/persona/create-inquiry \
  -H "Content-Type: application/json" \
  -d '{"email_user": "test@example.com"}'

# Expected Response:
# {
#   "inquiryId": "inq_xxxxx",
#   "sessionToken": "sess_xxxxx",
#   "status": "created",
#   "isNewInquiry": true
# }

# 2. Check inquiry status
curl http://localhost:5031/veriflevels/persona/inquiry-status/test@example.com

# Expected Response:
# {
#   "hasInquiry": true,
#   "inquiryId": "inq_xxxxx",
#   "status": "created",
#   "createdAt": "2025-12-12T..."
# }
```

### Verify Database

```sql
-- Check if persona_inquiry_id is stored
SELECT email_user, persona_inquiry_id 
FROM sec_cust.ms_sixmap_users 
WHERE email_user = 'test@example.com';
```

## 🔍 Troubleshooting

### Issue: "User not found"
**Solution:** Ensure the user exists in `sec_cust.ms_sixmap_users` with the provided email

### Issue: "PERSONA_API_KEY is not defined"
**Solution:** Add `PERSONA_API_KEY` to your `.env` file and restart the server

### Issue: "Persona API error: Invalid template ID"
**Solution:** Verify `PERSONA_INQUIRY_TEMPLATE_ID` in `.env` matches your Persona dashboard

### Issue: "Session token expired"
**Solution:** Session tokens are short-lived. Call the create-inquiry endpoint again to get a fresh token

## 📊 Monitoring & Logs

All Persona operations are logged with:
- Request/response details
- Error messages
- User email for traceability

Check logs for:
```javascript
[Persona HTTP Repository]: Creating Persona inquiry
[Persona HTTP Repository]: Getting session token
[veriflevels Service]: Persona inquiry created successfully
```

## 🔐 Security Considerations

1. **API Key Protection:**
   - Never commit `.env` file
   - Use environment-specific keys
   - Rotate keys periodically

2. **Session Tokens:**
   - Tokens are single-use
   - Tokens expire quickly (~1 hour)
   - Always get fresh token before opening flow

3. **Reference ID:**
   - Uses `email_user` as reference
   - Links Persona inquiry to your user

## 🚧 Phase 2 Preview

Phase 2 will include:

1. **Webhooks:**
   - `POST /veriflevels/persona/webhook`
   - Handle inquiry status changes
   - Auto-update user verification status

2. **Manual Review:**
   - Case management integration
   - Reviewer actions tracking

3. **Reports:**
   - PEP, AML, Watchlist checks
   - Report result handling

## 📚 Additional Resources

- [Persona API Documentation](https://docs.withpersona.com/api-reference)
- [Embedded Flow Guide](https://docs.withpersona.com/embedded-flow)
- [Inquiry Lifecycle](https://docs.withpersona.com/inquiries)
- [Webhook Events](https://docs.withpersona.com/webhooks)

## ✅ Checklist for Deployment

- [ ] Run database migration
- [ ] Update `.env` with Persona credentials
- [ ] Test create-inquiry endpoint
- [ ] Test inquiry-status endpoint
- [ ] Verify database storage
- [ ] Update frontend to use new endpoints
- [ ] Test complete user flow
- [ ] Monitor logs for errors

---

**Status:** Phase 1 Complete ✅  
**Next:** Frontend Integration → Phase 2 (Webhooks)
