# External SILT Flows Integration - Deployment Guide

## Overview
This integration adds support for external SILT verification flows (Venezolanos.es, R-CONECTA, ChilePoz, EuropaChilePoz) alongside the existing Bithonor flow. External flows are stored separately as they don't have corresponding user records in the database.

**Total External IDs**: 774 across 4 flows
- Venezolanos.es: 25 IDs
- R-CONECTA: 88 IDs  
- ChilePoz: 647 IDs
- EuropaChilePoz: 14 IDs

---

## Files Created/Modified

### Database Migration
- **sql-migrations/006-create-external-silt-table.sql**
  - Creates `sec_cust.lnk_external_silt_data` table
  - Stores flow_name, public_id, silt_data (JSONB)
  - Unique constraint on (flow_name, public_id)
  - Indexes for performance

### Backend Scripts
- **scripts/fetch-external-silt-data.js** (NEW - 603 lines)
  - Fetches SILT data from API using flow-specific credentials
  - NO file size limits (maxContentLength: Infinity)
  - Downloads images to `/repo-cr/external-silt-data/{flow_name}/{public_id}/`
  - Stores data in lnk_external_silt_data table
  - Supports --flow, --force, --retry-failed flags

- **scripts/external-silt-ids.txt** (NEW - 774 records)
  - Input file format: `flow_name|public_id`
  - Generated from external-flows-ids.json

- **scripts/parse-untitled-ids.js** (NEW)
  - Helper script to parse JSON flow IDs
  - Creates properly formatted input file

### Backend Controller
- **src/modules/silt/silt.controller.js** (MODIFIED)
  - `getSiltRecords()`: UNION queries both internal and external tables
  - Supports `flow_name` query parameter for filtering
  - `getSiltById()`: Checks both tables, handles flow-specific image paths
  - `getSiltImage()`: Serves images from flow-specific directories

### Frontend Service
- **src/service/siltService.ts** (MODIFIED)
  - `getSiltRecords()`: Added `flowName` parameter
  - Passes flow_name to backend API

### Frontend UI
- **src/pages/silt/index.vue** (MODIFIED)
  - Added flow filter dropdown: All Flows, Bithonor, Venezolanos.es, R-CONECTA, ChilePoz, EuropaChilePoz
  - Updated interface to use `identifier` and `flow_name` fields
  - Added flow badge to record display
  - Shows "External Flow" for records without email_user

---

## Deployment Steps

### 1. Run Database Migration
```bash
cd C:\Users\Anthony\Documents\Coingroup\Criptoremesa-Backend

# Connect to database and run migration
psql -U postgres -d criptoremesa_db -f sql-migrations/006-create-external-silt-table.sql
```

**Verify Migration:**
```sql
-- Check table exists
\d sec_cust.lnk_external_silt_data

-- Verify indexes
\di sec_cust.idx_external_silt_*

-- Check permissions
\dp sec_cust.lnk_external_silt_data
```

---

### 2. Fetch External SILT Data

**Option A: Fetch All Flows**
```bash
cd scripts
node fetch-external-silt-data.js
```

**Option B: Fetch One Flow at a Time (Recommended for Monitoring)**
```bash
# Start with smallest flow for testing
node fetch-external-silt-data.js --flow=EuropaChilePoz    # 14 IDs

# Then proceed with others
node fetch-external-silt-data.js --flow=Venezolanos.es    # 25 IDs
node fetch-external-silt-data.js --flow=R-CONECTA         # 88 IDs
node fetch-external-silt-data.js --flow=ChilePoz          # 647 IDs (largest)
```

**Monitor Progress:**
- Script outputs real-time progress per flow
- Check `external-silt-failed.txt` for any failures
- Images saved to `/repo-cr/external-silt-data/{flow_name}/{public_id}/`

**Retry Failed Records:**
```bash
node fetch-external-silt-data.js --retry-failed
```

**Force Reprocess Existing:**
```bash
node fetch-external-silt-data.js --force
```

---

### 3. Verify Data Ingestion

```sql
-- Check record counts by flow
SELECT flow_name, COUNT(*) as total, COUNT(DISTINCT public_id) as unique_ids
FROM sec_cust.lnk_external_silt_data
GROUP BY flow_name
ORDER BY flow_name;

-- Expected results:
-- Venezolanos.es:  25
-- R-CONECTA:       88
-- ChilePoz:       647
-- EuropaChilePoz:  14
-- TOTAL:          774

-- Check for any inactive records
SELECT flow_name, active, COUNT(*)
FROM sec_cust.lnk_external_silt_data
GROUP BY flow_name, active;

-- Sample data verification
SELECT 
  flow_name, 
  public_id, 
  silt_data->>'status' as status,
  date_creation
FROM sec_cust.lnk_external_silt_data
LIMIT 5;
```

---

### 4. Restart Backend Service

```bash
cd C:\Users\Anthony\Documents\Coingroup\Criptoremesa-Backend

# Using PM2
pm2 restart criptoremesa-backend

# Or using batch file
.\start-all.bat

# Verify backend is running
pm2 status
pm2 logs criptoremesa-backend --lines 50
```

---

### 5. Deploy Frontend (if needed)

```bash
cd C:\Users\Anthony\Documents\Coingroup\Sixmap-Frontend-Vuero

# Build frontend
npm run build

# Or if using dev server
npm run dev
```

---

## Testing the Integration

### Backend API Tests

**Test 1: Get All Flows**
```bash
curl http://localhost:3000/api/silt?page=1&limit=10
```

**Test 2: Filter by Bithonor**
```bash
curl "http://localhost:3000/api/silt?page=1&limit=10&flow_name=Bithonor"
```

**Test 3: Filter by External Flow**
```bash
curl "http://localhost:3000/api/silt?page=1&limit=10&flow_name=ChilePoz"
```

**Test 4: Get External Record by ID** (use a public_id from external-silt-ids.txt)
```bash
curl "http://localhost:3000/api/silt/a6388b29-e412-48a6-b918-9d6f17081935"
```

**Test 5: Get Image** (after fetch completes)
```bash
curl "http://localhost:3000/api/silt/a6388b29-e412-48a6-b918-9d6f17081935/image/filename.jpg?flow_name=ChilePoz"
```

### Frontend UI Tests

1. Navigate to `/silt` page
2. Verify flow dropdown appears with all 5 options
3. Test filtering:
   - Select "All Flows" → Should show both internal and external
   - Select "Bithonor" → Should show only internal Bithonor records
   - Select "ChilePoz" → Should show only ChilePoz records
4. Verify flow badge displays correctly next to status
5. Verify "External Flow" shows for records without email
6. Click "View Details" on an external record → Should load images from flow-specific path

---

## API Credentials Used

**IMPORTANT**: These credentials are hardcoded in fetch-external-silt-data.js

| Flow | App ID | Token (First 8 chars) |
|------|--------|----------------------|
| Venezolanos.es | 407ac740-daf8-4b89-bd38-5dc614a11f68 | d13ddc2f-... |
| R-CONECTA | 0fcbc14b-172c-49df-850a-8615caa46182 | bfd9de07-... |
| ChilePoz | 112aa700-c2bd-4fca-87a4-a620ae2f2cea | d82eb364-... |
| EuropaChilePoz | 0e348ff7-2562-4110-93e1-513a01b0159f | 561b110d-... |

---

## File Storage Structure

```
/repo-cr/
├── silt-data/                          # Existing Bithonor data
│   └── {silt_id}/
│       └── *.jpg
└── external-silt-data/                 # NEW: External flows
    ├── Venezolanos.es/
    │   └── {public_id}/
    │       └── *.jpg
    ├── R-CONECTA/
    │   └── {public_id}/
    │       └── *.jpg
    ├── ChilePoz/
    │   └── {public_id}/
    │       └── *.jpg
    └── EuropaChilePoz/
        └── {public_id}/
            └── *.jpg
```

---

## Troubleshooting

### Issue: Migration fails with "relation already exists"
**Solution**: Drop the table first (CAUTION: Only in dev/test)
```sql
DROP TABLE IF EXISTS sec_cust.lnk_external_silt_data CASCADE;
-- Then rerun migration
```

### Issue: Fetch script fails with "ENOENT: no such file or directory"
**Solution**: Ensure input file exists
```bash
cd scripts
ls -la external-silt-ids.txt
# If missing, regenerate:
node parse-untitled-ids.js
```

### Issue: API returns 401 Unauthorized for certain flows
**Solution**: Verify credentials in fetch-external-silt-data.js match those provided
- Check SILT_API_CREDENTIALS array around line 15
- Ensure X-Company-App-Id and X-Company-App-API-Token match exactly

### Issue: Images not displaying in UI
**Solution**: 
1. Check remote directory exists: `ls -la /repo-cr/external-silt-data/`
2. Verify permissions: `ls -la /repo-cr/external-silt-data/ChilePoz/`
3. Check backend logs for image serving errors
4. Ensure flow_name parameter is passed in image URL

### Issue: File size limit errors during fetch
**Solution**: Already handled - script uses `maxContentLength: Infinity`
- If still occurring, check axios version and network configuration

### Issue: Frontend doesn't show flow dropdown
**Solution**: 
1. Check browser console for errors
2. Verify VSelect component is imported
3. Rebuild frontend: `npm run build`
4. Clear browser cache

---

## Performance Notes

- **Initial Fetch Time**: Expect ~30-60 seconds per flow depending on network
- **ChilePoz Flow**: Largest (647 IDs) - may take 5-10 minutes
- **Database Performance**: Indexes created on flow_name, public_id, date_creation
- **Image Storage**: ~2-5MB per record (varies by document count)
- **Total Storage Estimate**: 774 records × 3MB avg = ~2.3GB

---

## Maintenance

### Regular Tasks
- Monitor disk space in `/repo-cr/external-silt-data/`
- Check for failed fetches periodically
- Archive old failed records from external-silt-failed.txt

### Periodic Refresh (if needed)
```bash
# Reprocess all external flows with latest data
node fetch-external-silt-data.js --force
```

### Database Maintenance
```sql
-- Check table size
SELECT pg_size_pretty(pg_total_relation_size('sec_cust.lnk_external_silt_data'));

-- Clean up test data (if needed)
UPDATE sec_cust.lnk_external_silt_data 
SET active = FALSE 
WHERE flow_name = 'test_flow';
```

---

## Summary

✅ Database table created for external SILT flows  
✅ Fetch script with NO file size limits ready  
✅ Input file with 774 IDs parsed and formatted  
✅ Backend controller updated with UNION queries and flow filtering  
✅ Frontend UI updated with flow dropdown and badges  

**Next Steps:**
1. Run database migration
2. Execute fetch script (start with small flows first)
3. Restart backend service
4. Test in browser at /silt page
5. Monitor for any errors in external-silt-failed.txt

**Estimated Total Time**: 1-2 hours (mostly waiting for ChilePoz fetch)
