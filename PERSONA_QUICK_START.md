# Persona Integration - Quick Start Guide

## 🚀 Quick Setup (5 Steps)

### 1. Run Database Migration
```bash
psql -h 18.222.5.211 -U postgres -d PRE-QA-CG -f sql-migrations/add_persona_inquiry_id_to_users.sql
```

### 2. Configure Environment Variables
Add to `.env`:
```bash
PERSONA_API_URL=https://withpersona.com/api/v1
PERSONA_API_KEY=<your_api_key>
PERSONA_INQUIRY_TEMPLATE_ID=<your_template_id>
```

### 3. Restart Server
```bash
npm run dev
```

### 4. Test API
```bash
# Create inquiry
curl -X POST http://localhost:5031/veriflevels/persona/create-inquiry \
  -H "Content-Type: application/json" \
  -d '{"email_user": "test@example.com"}'
```

### 5. Use Response in Frontend
```javascript
const { inquiryId, sessionToken } = response.data;
// Use these to embed Persona verification flow
```

## 📡 API Reference

### Create Inquiry
```
POST /veriflevels/persona/create-inquiry
Body: { "email_user": "user@example.com" }

Returns:
{
  "inquiryId": "inq_xxxxx",
  "sessionToken": "sess_xxxxx",
  "status": "created",
  "isNewInquiry": true
}
```

### Check Status
```
GET /veriflevels/persona/inquiry-status/:email_user

Returns:
{
  "hasInquiry": true,
  "inquiryId": "inq_xxxxx",
  "status": "approved",
  "createdAt": "2025-12-12T10:30:00Z"
}
```

## 🎨 Frontend Integration

```html
<script src="https://cdn.withpersona.com/dist/persona-v4.9.0.js"></script>
<script>
const client = new Persona.Client({
  inquiryId: 'inq_xxxxx',      // From backend
  sessionToken: 'sess_xxxxx',   // From backend
  onComplete: ({ inquiryId, status }) => {
    console.log('Verification complete!', status);
    // Update your UI or redirect user
  }
});

client.open();
</script>
```

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Column does not exist" | Run database migration |
| "API Key not defined" | Add PERSONA_API_KEY to .env |
| "User not found" | Check email_user exists in database |
| "Session token expired" | Get fresh token (call API again) |

## 📞 Support

- Documentation: See `PERSONA_INTEGRATION_PHASE1.md`
- Persona Docs: https://docs.withpersona.com
- Migration Guide: https://silt.notion.site/Migration-to-Persona-1a631a3963d880f4a3ffdbd57989dfde

---
**Phase 1 Status:** ✅ Complete - Ready for Testing
