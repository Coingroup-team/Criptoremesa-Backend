# Quick Action Items - Persona Integration

## 🎯 What You Need To Do Now

### 1. Run Database Migrations (IN THIS ORDER)

```bash
# Migration 1: Add column to table
psql -h 18.222.5.211 -U postgres -d PRE-QA-CG -f sql-migrations/add_persona_inquiry_id_to_users.sql

# Migration 2: Update SQL function  (⚠️ MUST run after migration 1)
psql -h 18.222.5.211 -U postgres -d PRE-QA-CG -f sql-migrations/update_get_all_users_by_email_function.sql
```

### 2. Configure Environment Variables

Add to `.env`:
```bash
PERSONA_API_URL=https://withpersona.com/api/v1
PERSONA_API_KEY=<your_api_key_from_persona_dashboard>
PERSONA_INQUIRY_TEMPLATE_ID=<your_template_id_from_persona>
```

### 3. Restart the Server

```bash
npm run dev
```

### 4. Test

```bash
# Test 1: Verify /full-info includes persona_inquiry_id
curl http://localhost:5031/users/full-info/test@example.com

# Test 2: Create Persona inquiry
curl -X POST http://localhost:5031/veriflevels/persona/create-inquiry \
  -H "Content-Type: application/json" \
  -d '{"email_user": "test@example.com"}'
```

## 📝 Summary of Changes Made

### Code Changes ✅
- [x] Updated `veriflevelsService.createPersonaInquiry()` to use `usersService.getFullInfo()`
- [x] Now uses the EXACT same service as `GET /users/full-info/:email_user`
- [x] No code duplication - follows DRY principles

### Database Changes 📊
- [x] Created migration to add `persona_inquiry_id` column
- [x] Created migration to update `get_all_users_by_email()` SQL function
- [x] Function now returns `persona_inquiry_id` in its JSON response

### Files Created 📁
1. `sql-migrations/add_persona_inquiry_id_to_users.sql`
2. `sql-migrations/update_get_all_users_by_email_function.sql` **(NEW - CRITICAL)**
3. `src/modules/veriflevels/repositories/persona.http.repository.js`
4. `PERSONA_INTEGRATION_PHASE1.md`
5. `PERSONA_QUICK_START.md`
6. `PERSONA_IMPLEMENTATION_SUMMARY.md` **(NEW - READ THIS)**
7. `postman/Persona_Integration_Phase1.postman_collection.json`

### Files Modified 🔧
1. `src/modules/veriflevels/services/veriflevels.service.js` - Uses usersService now
2. `src/modules/veriflevels/repositories/veriflevels.pg.repository.js` - Added Persona methods
3. `src/modules/veriflevels/controllers/veriflevels.controller.js` - Added Persona endpoints
4. `src/modules/veriflevels/veriflevels.routes.js` - Added Persona routes
5. `.env` - Added Persona configuration

## ⚠️ CRITICAL: Why 2 Migrations Are Needed

**Migration 1** (`add_persona_inquiry_id_to_users.sql`):
- Adds `persona_inquiry_id` column to `ms_sixmap_users` table

**Migration 2** (`update_get_all_users_by_email_function.sql`):
- Updates the PL/pgSQL function used by `/users/full-info/:email_user`
- Without this, the field exists in DB but isn't returned by the API
- The function explicitly defines return columns - we must add `persona_inquiry_id`

## 🔍 How To Verify It's Working

After running both migrations, this SQL should return the new field:
```sql
SELECT persona_inquiry_id 
FROM sec_cust.get_all_users_by_email('test@example.com');
```

And this endpoint should include it:
```bash
curl http://localhost:5031/users/full-info/test@example.com | grep persona_inquiry_id
```

---

**Status:** ✅ Implementation Complete  
**Action Required:** Run 2 migrations (in order), configure .env, restart server, test
