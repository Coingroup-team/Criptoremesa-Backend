# SILT Data Fetch - First Run Results

**Date:** December 2025  
**Script:** fetch-silt-data.js  
**Database:** sec_cust.lnk_users_verif_level → lnk_users_extra_data

---

## Execution Summary

### Overall Statistics

- **Total SILT IDs Processed:** 3,722
- **Successful:** 631 (17.0%)
- **Failed:** 2,912 (83.0%)
- **Execution Time:** Several hours (exact time not recorded)
- **Images Downloaded:** Unknown (estimated ~631 based on success count)

### Data Storage

- **Database Table:** `sec_cust.lnk_users_extra_data`
- **Item:** `silt_full_json` (ms_item_id: auto-created)
- **Remote Server:** ec2-3-143-246-144.us-east-2.compute.amazonaws.com
- **Remote Path:** `/repo-cr/silt-data/{silt_id}/`
- **Remote User:** devarodriguez

---

## Critical Issue Discovered

### Authentication Problem

**Root Cause:** Mismatched App ID and Token pairs

**Original Configuration (INCORRECT):**

```javascript
const SILT_COMPANY_APP_ID = "dcf5c568-6de1-4459-a040-038fb762366f"; // Single App ID
const SILT_API_TOKENS = [
  "2aa4b90a-ba4f-43c0-9cee-b2ecb90201dc", // Token from different account
  "40284c41-ded8-4f27-b8ca-512d66e94a60", // Token from different account
  "056b6161-130c-4632-8990-a50ecc4634f6", // Token from different account
];
```

**Issue:** The script was using one App ID with three tokens from different SILT accounts. The SILT API requires matching App ID/Token pairs for authentication.

**Error Pattern:** Most failures showed "All API tokens failed for SILT ID: {id}"

---

## Fix Applied

### Correct Configuration

```javascript
const SILT_API_CREDENTIALS = [
  {
    appId: "dcf5c568-6de1-4459-a040-038fb762366f",
    token: "2aa4b90a-ba4f-43c0-9cee-b2ecb90201dc", // Pair 1
  },
  {
    appId: "01f41d6d-9d4b-4c21-bd06-3bfcef36573b",
    token: "40284c41-ded8-4f27-b8ca-512d66e94a60", // Pair 2
  },
  {
    appId: "fb3a7896-a7cb-49b2-81b9-c97e0e3c3016",
    token: "056b6161-130c-4632-8990-a50ecc4634f6", // Pair 3
  },
];
```

### Verification Test Results

**Test Script:** test-sample-failed.js  
**Sample Size:** 10 previously failed SILT IDs  
**Results:** 10/10 successful (100%)

**Test IDs:**

1. roquefaria@gmail.com (9e7edf99-9c6d-4924-aff7-f7542edae5e6) ✓
2. oswaltceballos553@gmail.com (8943102e-f3c2-403e-b5ed-1ea6316acced) ✓
3. lestanislao7@gmail.com (5fa2826f-069d-4f1e-8905-d9e445e86156) ✓
4. nanytovar17@gmail.com (6d270ed5-08dd-4cb7-ac6b-bce7f1a098fb) ✓
5. humbertico86toledo@gmail.com (f1496207-5d6c-4f0d-b4f4-5bc165c27a0a) ✓
6. el22pana22camilo@gmail.com (ff588159-5ae9-433c-8658-1650dec48eec) ✓
7. rauldanielblue2@gmail.com (8426caeb-b0ed-4f3a-89bc-56f9e8db5031) ✓
8. katyliz_29@hotmail.com (f5d915ca-3f58-470f-800c-e7abb5361e6a) ✓
9. curacron27@gmail.com (725fd572-c4a9-43fc-b1b8-bdc0cf82616a) ✓
10. jezuzmercado802@gmail.com (db415a78-e3d1-4b93-830c-166dc779340d) ✓

**Conclusion:** The authentication fix resolves the issue. Previously failed IDs are recoverable.

---

## Database Query Results

### Successful Records Sample (get-silt-stats.js)

```
Total successful SILT records: 631

Sample of 10 successful records:
1. 2959f5f7-27a4-4ba8-895f-8d80d7ca10ce
   SILT Status: APPROVED
   Name: Sebastian Jose Diaz Labrador
   JSON Size: 3,115 bytes
   Date: 2024-08-16

2. 2a09cb1f-bde1-457b-8f47-acde8a5fcfaa
   SILT Status: APPROVED
   Name: Jesus Enrique Montero Molina
   JSON Size: 3,078 bytes
   Date: 2024-11-12

[... 8 more records ...]
```

### Failed Records Count

```
Total failed/unprocessed SILT records: 2,912

These records need to be retried with correct authentication.
```

---

## Next Steps

### Retry Execution Plan

1. **Script:** `npm run fetch-silt` (already updated with fix)
2. **Expected Duration:** Several hours (~3-4 hours for 2,912 records)
3. **Expected Success Rate:** 60-80% or higher (based on test results)
4. **Skip Logic:** Script automatically skips the 631 already-successful records

### New Features Added

1. **Progress File:** `silt-fetch-progress.txt` (updates every 10 records)
2. **Final Summary:** `silt-fetch-summary-YYYYMMDD-HHMM.txt` (saved at completion)
3. **Execution Timing:** Tracks and displays total runtime

### Monitoring

- Check `silt-fetch-progress.txt` anytime during execution
- Final summary will be saved even if terminal buffer clears
- Progress updates every 10 records

---

## Technical Details

### API Endpoint

```
https://api.siltapp.com/v1/users/{silt_id}/status/
```

### Request Headers

```javascript
{
  "X-Company-App-Id": "{appId}",
  "X-Company-App-API-Token": "{token}"
}
```

### Processing Logic

1. Query all SILT IDs from `sec_cust.lnk_users_verif_level`
2. Check if data already exists in `lnk_users_extra_data`
3. If not exists, fetch from SILT API (try 3 credential pairs)
4. Save JSON response to database
5. Download and upload images to remote server via SSH
6. Delay 1 second between requests

### Database Schema

```sql
-- Stores SILT full JSON responses
SELECT
    ulv.silt_id,
    u.email_user,
    ued.json_value->'data'->>'status' as silt_status,
    length(ued.json_value::text) as json_size_bytes
FROM sec_cust.lnk_users_verif_level ulv
LEFT JOIN sec_cust.lnk_users_extra_data ued
    ON ued.uuid_user = ulv.uuid_user
    AND ued.ms_item_id = (SELECT id FROM public.ms_item WHERE name = 'silt_full_json')
LEFT JOIN sec_cust.users u ON u.uuid = ulv.uuid_user
WHERE ulv.silt_id IS NOT NULL;
```

---

## Lessons Learned

1. **Authentication:** Always pair App IDs with their corresponding tokens
2. **Output Preservation:** Long-running scripts need file-based logging
3. **Progress Tracking:** Periodic progress files help monitor multi-hour executions
4. **Testing:** Sample testing before full retry saved potential hours
5. **Skip Logic:** Implementing skip logic prevents duplicate work on retries

---

## Files Modified

1. `fetch-silt-data.js` - Fixed authentication, added progress/summary logging
2. `test-sample-failed.js` - Updated with correct credential pairs
3. `get-silt-stats.js` - Query script for database statistics
4. `retry-failed-silt.js` - Analysis script for failed records

---

**Document Created:** December 30, 2025  
**Status:** Ready for retry execution with corrected authentication
