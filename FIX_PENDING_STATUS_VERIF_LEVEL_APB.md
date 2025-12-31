# Fix: verif_level_apb Should Be NULL for PENDING Status

## Issue Description

When the Persona webhook sends a "completed" event that maps to PENDING status (all verifications passed but not yet decisioned), the system was incorrectly setting `verif_level_apb = TRUE` instead of `NULL`.

### Observed Behavior

- ❌ `id_verif_level` changed from 0 to 1 ✓ (correct)
- ❌ `verif_level_apb` changed to `TRUE` (incorrect - should be `NULL`)

### Expected Behavior

- ✅ `id_verif_level` changed from 0 to 1
- ✅ `verif_level_apb` = `NULL` (representing PENDING status)

## Root Cause

The SQL stored procedure `sp_request_level_one_persona` had logic that preserved the existing `verif_level_apb` value when the status was PENDING:

**Original Code (WRONG):**

```sql
-- NEW REQUEST branch
verif_level_apb = (
    case
        when p_persona_status = 'SUCCESS' then true
        when p_persona_status = 'ERROR' or p_persona_status = 'VERIFICATION_ERROR' then false
        else v_current_full_user.verif_level_apb  -- ❌ Keeps existing value
    end
)
```

**Problem:** When a user at level 0 with `verif_level_apb = TRUE` submits a level 1 verification that results in PENDING status, the TRUE value from level 0 was being carried over to level 1.

## Status Mapping Logic

| Database Value            | Meaning              | When Set                                  |
| ------------------------- | -------------------- | ----------------------------------------- |
| `verif_level_apb = TRUE`  | Approved/Verified    | SUCCESS status from verification provider |
| `verif_level_apb = FALSE` | Rejected/Failed      | ERROR status from verification provider   |
| `verif_level_apb = NULL`  | Pending/Under Review | PENDING status (awaiting decision)        |

## Solution Applied

Updated three locations in `003-create-persona-verification-functions.sql`:

### 1. NEW REQUEST - ms_sixmap_users table

**Lines 210-223**

```sql
-- Update info in user table
UPDATE sec_cust.ms_sixmap_users
SET id_ident_doc_type = v_id_doc_type,
    ident_doc_number = p_doc_number,
    gender = p_gender,
    id_nationality_country = v_id_nationality_country,
    verif_level_apb = (
        case
            when p_persona_status = 'SUCCESS' then true
            when p_persona_status = 'ERROR' or p_persona_status = 'VERIFICATION_ERROR' then false
            else null  -- ✅ FIXED: Set to null for PENDING status
        end
    ),
    id_verif_level = 1,
    date_birth = p_date_birth
WHERE uuid_user = v_current_full_user.uuid_user;
```

### 2. UPDATE REQUEST - lnk_users_verif_level table

**Lines 295-304**

```sql
-- Update lvl request
update sec_cust.lnk_users_verif_level
set level_apb_ok = (
    case
        when p_persona_status = 'SUCCESS' then true
        when p_persona_status = 'ERROR' or p_persona_status = 'VERIFICATION_ERROR' then false
        else null  -- ✅ FIXED: Set to null for PENDING status
    end
)
where persona_inquiry_id = p_persona_inquiry_id;
```

### 3. UPDATE REQUEST - ms_sixmap_users table

**Lines 306-315**

```sql
-- Update sixmap user
UPDATE sec_cust.ms_sixmap_users
SET verif_level_apb = (
    case
        when p_persona_status = 'SUCCESS' then true
        when p_persona_status = 'ERROR' or p_persona_status = 'VERIFICATION_ERROR' then false
        else null  -- ✅ FIXED: Set to null for PENDING status
    end
)
WHERE uuid_user = v_current_full_user.uuid_user;
```

## Deployment Steps

### Step 1: Re-apply the SQL Function

Since we're using a CREATE OR REPLACE statement, simply re-run the migration:

```bash
# Connect to your database
psql -U your_username -d criptoremesa_db

# Re-run the migration file
\i /path/to/Criptoremesa-Backend/sql-migrations/003-create-persona-verification-functions.sql
```

Or use your preferred database tool to execute the file.

### Step 2: Restart Backend Service

```bash
pm2 restart pre-prod-be-bh:api
# or
pm2 restart criptoremesa-backend
```

### Step 3: Verify the Fix

Run this query to check users with level 1:

```sql
SELECT
    email_user,
    id_verif_level,
    verif_level_apb,
    persona_inquiry_id
FROM sec_cust.ms_sixmap_users
WHERE id_verif_level = 1
  AND persona_inquiry_id IS NOT NULL
ORDER BY email_user;
```

**Expected results for PENDING inquiries:**

- `id_verif_level = 1` ✓
- `verif_level_apb = null` ✓
- `persona_inquiry_id` = inquiry ID from Persona

## Testing

### Test Case 1: New Verification with PENDING Status

1. User initiates Persona verification (level 0 → level 1)
2. Webhook received with status "completed" (not decisioned)
3. Backend maps to PENDING status
4. **Expected Database State:**
   - `ms_sixmap_users.id_verif_level = 1`
   - `ms_sixmap_users.verif_level_apb = null`
   - `lnk_users_verif_level.level_apb_ok = null`

### Test Case 2: Subsequent Update with SUCCESS Status

1. Persona makes a decision on the inquiry
2. Webhook received with status "approved" or "completed + decisioned"
3. Backend maps to SUCCESS status
4. **Expected Database State:**
   - `ms_sixmap_users.verif_level_apb = true`
   - `lnk_users_verif_level.level_apb_ok = true`

### Test Case 3: Concurrency Protection Still Works

1. User has PENDING status (verif_level_apb = null)
2. Admin manually approves (verif_level_apb = true)
3. Late PENDING webhook arrives
4. **Expected:** Concurrency protection prevents overwrite, keeps TRUE

## Related Changes

This fix works in conjunction with the previous status mapping fix from PERSONA_STATUS_MAPPING_FIX.md, which properly handles the "completed" webhook status.

**Combined Flow:**

1. Webhook Controller: Maps "completed" status → PENDING (if not decisioned)
2. Service Layer: Passes personaStatus = "PENDING" to repository
3. Repository: Calls SQL function with p_persona_status = 'PENDING'
4. SQL Function: Sets `verif_level_apb = null` ✅ (this fix)

## Files Modified

- `sql-migrations/003-create-persona-verification-functions.sql` (lines 223, 301, 313)
- `sql-migrations/004-fix-persona-pending-status.sql` (new helper script)

## Verification Queries

```sql
-- Check current state of your affected user
SELECT
    email_user,
    id_verif_level,
    verif_level_apb,
    persona_inquiry_id,
    user_active
FROM sec_cust.ms_sixmap_users
WHERE email_user = 'bithonor.2023+persona1@gmail.com';

-- Check verification level details
SELECT
    lvl.id_vl,
    lvl.level_apb_ok,
    lvl.persona_inquiry_id,
    lvl.is_the_last_one
FROM sec_cust.lnk_users_verif_level lvl
JOIN sec_cust.ms_sixmap_users u ON u.uuid_user = lvl.uuid_user
WHERE u.email_user = 'bithonor.2023+persona1@gmail.com'
  AND lvl.is_the_last_one = TRUE;
```
