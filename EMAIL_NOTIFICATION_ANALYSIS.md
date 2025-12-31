# Email Notification Analysis for Persona Flow

## Issue

Email notifications for verification approvals/rejections are not being sent for Persona verifications, even though they work correctly for SILT verifications.

## Root Cause Analysis

### How Email Notifications Work

#### 1. Database Functions Emit pg_notify

**SILT Function:**

- Located in database function `sec_cust.sp_request_level_one_silt()`
- Emits `pg_notify('level_upgrade', json_payload)` when verification status is final (SUCCESS/ERROR)

**Persona Function:**

- Located in `sql-migrations/003-create-persona-verification-functions.sql`
- **Lines 232-246 (NEW REQUEST):**

  ```sql
  IF p_persona_status IN ('SUCCESS', 'ERROR', 'VERIFICATION_ERROR') THEN
      PERFORM pg_notify('level_upgrade',json_build_object(
          'id_verif_level', 1,
          'verif_level_apb', (
              case
                  when p_persona_status = 'SUCCESS' then true
                  when p_persona_status = 'ERROR' or p_persona_status = 'VERIFICATION_ERROR' then false
              end
          ),
          'email_user', v_current_full_user.email_user,
          'first_name', v_first_name,
          'last_name', v_last_name,
          'id_resid_country', v_current_full_user.id_resid_country
      )::text);
  END IF;
  ```

- **Lines 323-337 (UPDATE REQUEST):**
  ```sql
  IF p_persona_status IN ('SUCCESS', 'ERROR', 'VERIFICATION_ERROR') THEN
      PERFORM pg_notify('level_upgrade',json_build_object(
          'id_verif_level', 1,
          'verif_level_apb', (
              case
                  when p_persona_status = 'SUCCESS' then true
                  when p_persona_status = 'ERROR' or p_persona_status = 'VERIFICATION_ERROR' then false
              end
          ),
          'email_user', v_current_full_user.email_user,
          'first_name', v_first_name,
          'last_name', v_last_name,
          'id_resid_country', v_current_full_user.id_resid_country
      )::text);
  END IF;
  ```

✅ **Persona function DOES emit pg_notify correctly**

#### 2. Backend-Sixm Service Listens to pg_notify

**Listener Setup:**

- File: `backend-sixm/src/db/pg.connection.js`
- Lines 136-143: Sets up database notification listeners

  ```javascript
  client.query("listen level_upgrade");
  client.query("listen verif_code");
  // ... other channels
  ```

- Lines 144-207: Handles notifications

  ```javascript
  client.on("notification", async (data) => {
    if (data.channel === "level_upgrade") {
      const level = JSON.parse(data.payload);

      // Lines 188-197: Approval email
      if (level.verif_level_apb === true && level.id_verif_level === 1) {
        await mailSender.sendApprovedLevelMail({
          email_user: level.email_user,
          first_name: level.first_name,
          last_name: level.last_name,
          level: getLevelName(1),
          atcNumber,
        });

        await mailSender.sendAfterVerificationMail({
          email_user: level.email_user,
          first_name: level.first_name,
          last_name: level.last_name,
        });
      }

      // Lines 198-206: Rejection email
      else if (level.verif_level_apb === false && level.id_verif_level === 1) {
        await mailSender.sendDisapprovedLevelMail({
          email_user: level.email_user,
          first_name: level.first_name,
          last_name: level.last_name,
          rejectedList: [],
          level: getLevelName(1),
          atcNumber,
        });
      }
    }
  });
  ```

✅ **Listener is properly configured**

#### 3. Mail Sender Sends Emails

**Mail Service:**

- Server: `coingroup-mail-server` (port configured in env)
- Endpoints:
  - `POST /sendApprovedLevelMail` - Sends approval notification
  - `POST /sendDisapprovedLevelMail` - Sends rejection notification
- Uses templates: `levelApproved.html` and `levelDisapproved.html`

## ⚠️ Potential Issues

### Issue 1: SQL Migration Not Applied

**Symptom:** pg_notify is not being emitted because the new Persona function hasn't been deployed to the database.

**Verification:**

```sql
-- Check if function exists and has pg_notify
SELECT pg_get_functiondef(p.oid)
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'sec_cust'
AND p.proname = 'sp_request_level_one_persona';
```

**Fix:** Run the migration file:

```bash
psql -U postgres -d criptoremesa_db -f sql-migrations/003-create-persona-verification-functions.sql
```

### Issue 2: Backend-Sixm Service Not Running

**Symptom:** Listener is not active to receive pg_notify events.

**Verification:**

```bash
pm2 list | grep sixm
# or
pm2 status
```

**Expected Output:**

```
│ sixmap-backend        │ online    │ ...
```

**Fix:** Start/restart the service:

```bash
pm2 restart sixmap-backend
# or start if not running
pm2 start ecosystem.config.js
```

### Issue 3: Database Connection Issue

**Symptom:** Backend-sixm is running but not connected to database (listener client disconnected).

**Verification:** Check backend-sixm logs:

```bash
pm2 logs sixmap-backend --lines 100 | grep -i "connected\|listen\|level_upgrade"
```

**Expected Output:**

```
PG-DB is connected
PG-DB client-listener is connected
```

**Fix:** Restart backend-sixm service or check database credentials in `.env` file.

### Issue 4: Webhook Not Calling Database Function

**Symptom:** Webhook is received but doesn't call the Persona SQL function, so pg_notify is never emitted.

**Verification:** Check Criptoremesa-Backend logs for webhook processing:

```bash
pm2 logs pre-prod-be-bh:api --lines 200 | grep -i "persona\|webhook\|inquiry"
```

**Expected Output:**

```
[veriflevels Controller]: Persona webhook received
Persona completed inquiry - Verifications passed: true, Decisioned: true
Mapped status: SUCCESS
Calling Persona verification function with status: SUCCESS
```

**Fix:** Ensure the webhook controller is calling the database function after receiving SUCCESS/ERROR status.

### Issue 5: PENDING Status (Expected Behavior)

**Symptom:** No email sent for "completed" inquiries that are not decisioned yet.

**Explanation:** This is **CORRECT BEHAVIOR**. The Persona function only emits pg_notify for final statuses (SUCCESS, ERROR, VERIFICATION_ERROR). PENDING status means:

- All verifications passed
- But Persona has not made a final decision yet
- No approval/rejection email should be sent

Emails will be sent when:

1. Persona makes a final decision → sends approved/declined webhook
2. Webhook triggers SUCCESS/ERROR status
3. SQL function emits pg_notify
4. Backend-sixm receives notification and sends email

## Testing Checklist

### 1. Verify SQL Function Deployment

```bash
# Connect to database
psql -U postgres -d criptoremesa_db

# Check function exists
\df sec_cust.sp_request_level_one_persona

# Verify pg_notify is in function
SELECT pg_get_functiondef(p.oid)
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'sec_cust'
AND p.proname = 'sp_request_level_one_persona';
-- Look for "PERFORM pg_notify('level_upgrade'" in output
```

### 2. Verify Backend-Sixm Service Status

```bash
pm2 list
pm2 logs sixmap-backend --lines 50
```

**Expected in logs:**

- "PG-DB is connected"
- "PG-DB client-listener is connected"
- No database connection errors

### 3. Verify Listener is Active

```bash
# Check if backend-sixm is listening to the channel
pm2 logs sixmap-backend --lines 200 | grep "listen level_upgrade"
```

### 4. Test with Approved Persona Verification

**Steps:**

1. Create new Persona verification that gets approved
2. Wait for approved/declined webhook from Persona
3. Check Criptoremesa-Backend logs:

   ```bash
   pm2 logs pre-prod-be-bh:api --lines 100
   ```

   Expected: "Calling Persona verification function with status: SUCCESS"

4. Check database for pg_notify emission:

   ```sql
   -- Enable notification logging in PostgreSQL (requires superuser)
   ALTER SYSTEM SET log_statement = 'all';
   SELECT pg_reload_conf();

   -- Check logs for NOTIFY
   -- Look in PostgreSQL log files for:
   -- "PERFORM pg_notify('level_upgrade'"
   ```

5. Check backend-sixm logs:

   ```bash
   pm2 logs sixmap-backend --lines 100
   ```

   Expected:

   ```
   channel : level_upgrade
   channel : {"id_verif_level":1,"verif_level_apb":true,"email_user":"user@example.com",...}
   ```

6. Check user email inbox for approval notification

### 5. Test with Rejected Persona Verification

Same steps as above, but expect:

- "Mapped status: ERROR"
- "verif_level_apb": false
- Rejection email sent

## Common Issues and Solutions

### No Email Sent for Approved Verification

**Diagnostic Steps:**

1. ✅ Check Criptoremesa-Backend logs → Is webhook received?
2. ✅ Check webhook mapping → Is status mapped to SUCCESS?
3. ✅ Check database function call → Is Persona function called?
4. ✅ Check SQL migration → Does function have pg_notify?
5. ✅ Check backend-sixm status → Is service running?
6. ✅ Check backend-sixm logs → Is notification received?
7. ✅ Check mail server → Is email service responding?

### Backend-Sixm Not Receiving Notifications

**Possible Causes:**

1. **Client disconnected:** Check logs for "client-listener is connected"
2. **Not listening to channel:** Verify `client.query("listen level_upgrade")` is executed on startup
3. **Database connection error:** Check environment variables and database accessibility
4. **Firewall/network issue:** Ensure backend-sixm can reach database server

**Fix:**

```bash
# Restart backend-sixm to re-establish listener connection
pm2 restart sixmap-backend

# Verify connection
pm2 logs sixmap-backend --lines 50 | grep connected
```

### Function Emits pg_notify But Nothing Happens

**Diagnostic:**

```sql
-- Check active listeners in database
SELECT * FROM pg_stat_activity WHERE state = 'idle in transaction';

-- Check if client is connected
SELECT pid, usename, application_name, client_addr, state
FROM pg_stat_activity
WHERE application_name LIKE '%node%';
```

**Fix:** Restart backend-sixm service to re-establish listener

## Deployment Checklist

When deploying Persona integration with email notifications:

- [ ] Run SQL migration: `003-create-persona-verification-functions.sql`
- [ ] Verify pg_notify exists in function (grep for "PERFORM pg_notify")
- [ ] Restart Criptoremesa-Backend: `pm2 restart pre-prod-be-bh:api`
- [ ] Restart backend-sixm: `pm2 restart sixmap-backend`
- [ ] Verify backend-sixm logs show "client-listener is connected"
- [ ] Test with approval scenario
- [ ] Test with rejection scenario
- [ ] Verify emails are received

## Important Notes

1. **PENDING status does NOT trigger emails** - This is by design. Emails are only sent when Persona makes a final decision (approved/declined).

2. **Both functions required:**

   - Persona SQL function (emits pg_notify)
   - Backend-sixm listener (receives pg_notify and sends email)
   - If either is missing/broken, no emails will be sent

3. **Migration must be applied:**

   - The pg_notify code exists in the migration file but won't work until deployed to the database
   - Re-running the migration is safe (uses CREATE OR REPLACE FUNCTION)

4. **Backend-sixm is critical:**
   - This service MUST be running for email notifications to work
   - It's separate from Criptoremesa-Backend
   - Check both services are running in production

## Next Steps

1. **Verify current state:**

   ```bash
   # Check if SQL function has pg_notify
   psql -U postgres -d criptoremesa_db -c "SELECT pg_get_functiondef(p.oid) FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid WHERE n.nspname = 'sec_cust' AND p.proname = 'sp_request_level_one_persona';" | grep "pg_notify"

   # Check if backend-sixm is running and listening
   pm2 logs sixmap-backend --lines 100 | grep -i "connected\|listen"
   ```

2. **If function doesn't have pg_notify:** Run migration
3. **If backend-sixm not connected:** Restart service
4. **Test with new verification:** Create approval scenario and verify email

---

**Status:** Persona function implementation is CORRECT. Email notifications should work once:

1. SQL migration is applied to database (pg_notify is present)
2. Backend-sixm service is running and connected (listener is active)
3. Persona sends final decision webhook (approved/declined, not just completed/pending)
