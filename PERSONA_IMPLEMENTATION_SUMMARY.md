# Persona Integration - Implementation Summary

## ✅ What Was Changed (Latest Update)

### Problem Identified
The previous implementation was not using the correct service from the `/users` module. We needed to:
1. Use `usersService.getFullInfo()` - the EXACT same service as `GET /users/full-info/:email_user`
2. Update the SQL function `get_all_users_by_email()` to include `persona_inquiry_id` in its return type and SELECT statement

### Solution Implemented

#### 1. Database Migrations (2 Files Required)

**File 1:** [sql-migrations/add_persona_inquiry_id_to_users.sql](sql-migrations/add_persona_inquiry_id_to_users.sql)
```sql
-- Adds the column to the table
ALTER TABLE sec_cust.ms_sixmap_users 
ADD COLUMN IF NOT EXISTS persona_inquiry_id VARCHAR(255);
```

**File 2:** [sql-migrations/update_get_all_users_by_email_function.sql](sql-migrations/update_get_all_users_by_email_function.sql)  
**⚠️ CRITICAL - Must run after File 1**
```sql
-- Updates the PL/pgSQL function to return persona_inquiry_id in the JSON response
-- This function is called by GET /users/full-info/:email_user endpoint
DROP FUNCTION IF EXISTS sec_cust.get_all_users_by_email(character varying);
CREATE OR REPLACE FUNCTION sec_cust.get_all_users_by_email(_email_user character varying)
  RETURNS TABLE(
    ... 
    show_verification_modal boolean,
    persona_inquiry_id character varying  -- NEW FIELD ADDED
  )
-- ... full function recreated with persona_inquiry_id in SELECT
```

#### 2. Service Layer Changes

**File:** [src/modules/veriflevels/services/veriflevels.service.js](src/modules/veriflevels/services/veriflevels.service.js)

**Import Added:**
```javascript
import usersService from "../../users/services/users.service";
```

**Updated createPersonaInquiry method:**
```javascript
// BEFORE (Using authenticationPGRepository directly):
const userInfo = await authenticationPGRepository.getUserByEmail(email_user.toLowerCase());

// AFTER (Using usersService - same as /full-info endpoint):
const mockReq = { params: { email_user: email_user.toLowerCase() } };
const userInfoResponse = await usersService.getFullInfo(mockReq, res, next);
const userInfo = userInfoResponse.data;
```

### Why This Approach Is Correct

#### Service Call Chain
```
POST /veriflevels/persona/create-inquiry
  ↓
veriflevelsController.createPersonaInquiry()
  ↓
veriflevelsService.createPersonaInquiry()
  ↓
usersService.getFullInfo()  ← SAME as GET /users/full-info/:email_user
  ↓
authenticationPGRepository.getUserByEmail()
  ↓
SQL: SELECT * FROM get_all_users_by_email(_email_user)
  ↓
Returns JSON with ALL user fields including persona_inquiry_id
```

#### Benefits
✅ **Single Source of Truth**: Uses the exact same service as `/users/full-info/:email_user`  
✅ **No Code Duplication**: Follows DRY principles  
✅ **Consistent Data**: Guaranteed to get same data structure  
✅ **Easy Maintenance**: Changes to user data retrieval only need to be made in one place  

### SQL Function Update - Why It's Required

The `get_all_users_by_email()` function explicitly defines its return type as a TABLE with specific columns. Simply adding a column to `ms_sixmap_users` is NOT enough because:

1. The function's RETURN TYPE must list `persona_inquiry_id`
2. The function's SELECT statement must include `persona_inquiry_id`

**Without the SQL function update:**
- The column exists in the database ✅
- But the function doesn't return it ❌
- So the `/users/full-info/:email_user` endpoint won't include it ❌
- And our Persona integration can't access it ❌

**With the SQL function update:**
- The column exists in the database ✅
- The function returns it in the JSON ✅
- The `/users/full-info/:email_user` endpoint includes it ✅
- Our Persona integration can access it ✅

### Migration Order (IMPORTANT)

```bash
# Step 1: Add column to table
psql -h 18.222.5.211 -U postgres -d PRE-QA-CG \
  -f sql-migrations/add_persona_inquiry_id_to_users.sql

# Step 2: Update SQL function to return the new field
psql -h 18.222.5.211 -U postgres -d PRE-QA-CG \
  -f sql-migrations/update_get_all_users_by_email_function.sql

# Step 3: Test the endpoint
curl http://localhost:5031/users/full-info/test@example.com
# Should now include "persona_inquiry_id": null (or the actual ID if set)
```

### Files Modified

1. ✅ [src/modules/veriflevels/services/veriflevels.service.js](src/modules/veriflevels/services/veriflevels.service.js)
   - Added `usersService` import
   - Updated `createPersonaInquiry()` to use `usersService.getFullInfo()`

2. ✅ [sql-migrations/add_persona_inquiry_id_to_users.sql](sql-migrations/add_persona_inquiry_id_to_users.sql)
   - Simplified to only add column and index
   - Added note about running function update migration

3. ✅ [sql-migrations/update_get_all_users_by_email_function.sql](sql-migrations/update_get_all_users_by_email_function.sql) **(NEW FILE)**
   - Complete function recreation with `persona_inquiry_id` in return type
   - Adds `US.persona_inquiry_id` to SELECT statement

### Testing After Migration

```bash
# 1. Verify column exists
psql -h 18.222.5.211 -U postgres -d PRE-QA-CG -c "\d sec_cust.ms_sixmap_users" | grep persona_inquiry_id

# 2. Verify function returns the field
psql -h 18.222.5.211 -U postgres -d PRE-QA-CG -c "
  SELECT persona_inquiry_id 
  FROM sec_cust.get_all_users_by_email('your_test_email@example.com');
"

# 3. Test /full-info endpoint
curl http://localhost:5031/users/full-info/your_test_email@example.com | jq '.persona_inquiry_id'

# 4. Test Persona integration
curl -X POST http://localhost:5031/veriflevels/persona/create-inquiry \
  -H "Content-Type: application/json" \
  -d '{"email_user": "your_test_email@example.com"}'
```

### Summary

**Before:** 
- ❌ Used `authenticationPGRepository.getUserByEmail()` directly
- ❌ Didn't update SQL function to return new field
- ❌ Not following existing patterns in codebase

**After:**
- ✅ Uses `usersService.getFullInfo()` - same as `/users/full-info/:email_user`
- ✅ Updated SQL function `get_all_users_by_email()` to include `persona_inquiry_id`
- ✅ Follows DRY principles and existing codebase patterns
- ✅ Single source of truth for user data

---

**Status:** Ready for migration and testing  
**Next:** Run both SQL migrations in order, then test endpoints
