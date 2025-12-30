# SILT Data Fetcher Script

## Overview

This script fetches complete SILT verification data for all users, saves the full JSON response to the database, and downloads all associated images to a remote server.

## Features

- ✅ Fetches all `silt_id` values from `sec_cust.lnk_users_verif_level`
- ✅ Calls SILT API with automatic token retry (3 tokens available)
- ✅ Saves full JSON response to `sec_cust.lnk_users_extra_data`
- ✅ Extracts all image URLs from response (`file_url`, `s3_url`)
- ✅ Downloads images locally (temporary)
- ✅ Uploads images to remote server via SSH/SCP
- ✅ Automatically cleans up local temp files after upload
- ✅ Skips already processed SILT IDs
- ✅ Comprehensive error handling and logging
- ✅ Progress tracking and statistics

## Prerequisites

### 1. Install Dependencies

```bash
cd scripts
npm install
```

### 2. Environment Variables

Ensure your `.env` file in the backend root contains:

```env
PG_DB_SM_USER=postgres
PG_DB_SM_HOST=localhost
PG_DB_SM_NAME=criptoremesa_db
PG_DB_SM_PASSWORD=your_password
PG_DB_SM_PORT=5432
```

### 3. SSH Private Key

Place the SSH private key file `aws-devapp2-03Jan21.pem` in the backend root directory:

```
Criptoremesa-Backend/
├── aws-devapp2-03Jan21.pem  ← Place here
└── scripts/
    └── fetch-silt-data.js
```

**Important:** Set correct permissions on the key file:

```bash
chmod 400 aws-devapp2-03Jan21.pem
```

## Usage

### Run the Script

```bash
cd scripts
npm run fetch-silt
```

Or directly:

```bash
node fetch-silt-data.js
```

### What Happens

1. **Database Setup**

   - Creates `SILT Information` category if not exists
   - Creates `silt_full_json` item in `ms_item` if not exists
   - Fetches all distinct `silt_id` from `lnk_users_verif_level`

2. **For Each SILT ID:**

   - Checks if data already exists (skips if yes)
   - Calls SILT API: `GET https://api.siltapp.com/v1/users/{silt_id}/status/`
   - Retries with different tokens if authentication fails
   - Saves JSON to database linked to user via `lnk_users_extra_data`

3. **Image Processing:**

   - Extracts all `file_url` and `s3_url` from JSON
   - Downloads images to `temp-silt-images/` locally
   - Creates remote directory: `/repo-cr/silt-data/{silt_id}/`
   - Uploads images via SCP
   - Deletes local temp files after successful upload

4. **Completion:**
   - Prints statistics (total, success, failed, skipped)
   - Lists any errors encountered

## Database Structure

### New Item Created

```sql
-- Category
INSERT INTO sec_cust.ms_category (name, description)
VALUES ('SILT Information', 'Full SILT API response data');

-- Item
INSERT INTO sec_cust.ms_item (id_category, name, description)
VALUES ({category_id}, 'silt_full_json', 'Full JSON response from SILT API');
```

### Data Storage

```sql
-- For each user with SILT verification
INSERT INTO sec_cust.lnk_users_extra_data (id_user, id_item, value, edited)
VALUES (
  {user_id},
  {silt_full_json_item_id},
  '{...complete SILT JSON response...}',
  false
);
```

## API Configuration

### SILT API Details

**Endpoint:** `GET https://api.siltapp.com/v1/users/{silt_id}/status/`

**Headers:**

- `X-Company-App-Id: dcf5c568-6de1-4459-a040-038fb762366f`
- `X-Company-App-API-Token: {token}` (3 tokens available with auto-retry)

**Tokens (in order of use):**

1. `2aa4b90a-ba4f-43c0-9cee-b2ecb90201dc`
2. `40284c41-ded8-4f27-b8ca-512d66e94a60` (fallback)
3. `056b6161-130c-4632-8990-a50ecc4634f6` (fallback)

## Remote Server Configuration

**Host:** `ec2-3-143-246-144.us-east-2.compute.amazonaws.com`  
**User:** `devarodriguez`  
**Auth:** Private key (`aws-devapp2-03Jan21.pem`)  
**Base Directory:** `/repo-cr/silt-data/`

### Remote Directory Structure

```
/repo-cr/silt-data/
├── {silt_id_1}/
│   ├── {silt_id_1}_IF-6a6b45af-14c0-427c-8806-e73c78690801.jpg
│   ├── {silt_id_1}_IB-f3920a93-60d4-4feb-859c-0c28a922846a.jpg
│   └── {silt_id_1}_V-1a67839f-26df-4afd-b7ef-7586d0dbf076.jpg
├── {silt_id_2}/
│   └── ...
└── ...
```

## Example SILT Response Structure

The script handles various image types found in the response:

- **Selfie:** `selfie.file_url`, `selfie.s3_url`
- **National ID Front:** `national_id.files[].file_url`
- **National ID Back:** `national_id.files[].file_url`
- **Processed Files:** `national_id.files[].processed_files[].s3_url`
- **Passport:** `passport.files[].file_url` (if present)
- **Driving License:** `driving_license.files[].file_url` (if present)

All URLs starting with `http` are downloaded and uploaded.

## Error Handling

### Authentication Errors (401/403)

- Automatically tries next available API token
- Fails only if all 3 tokens fail

### Network Errors

- Logs error and continues with next SILT ID
- Tracks failed IDs in error summary

### SSH/Upload Errors

- Logs error and continues
- Local files remain for manual inspection

### Database Errors

- Logs error and continues
- Failed records tracked in error summary

## Logs and Output

### Console Output Example

```
=================================================
     SILT Data Fetcher Script
=================================================

[INFO] 2025-12-30T10:00:00.000Z - Created temp directory: /path/to/temp-silt-images
[INFO] 2025-12-30T10:00:00.100Z - Item 'silt_full_json' already exists with id: 123
[INFO] 2025-12-30T10:00:00.200Z - Found 50 unique SILT IDs
[INFO] 2025-12-30T10:00:00.300Z - Starting to process 50 SILT IDs...

--- Processing 1/50 ---
[INFO] 2025-12-30T10:00:01.000Z - Fetching SILT data for ID: abc-123...
[SUCCESS] 2025-12-30T10:00:02.000Z - Successfully fetched SILT data for ID: abc-123
[SUCCESS] 2025-12-30T10:00:02.100Z - Inserted SILT JSON for user uuid-456
[INFO] 2025-12-30T10:00:02.200Z - Found 5 image URLs in SILT response
[SUCCESS] 2025-12-30T10:00:03.000Z - Downloaded image: abc-123_selfie.jpg
[INFO] 2025-12-30T10:00:04.000Z - SSH connection established
[SUCCESS] 2025-12-30T10:00:05.000Z - Uploaded: abc-123_selfie.jpg
[SUCCESS] 2025-12-30T10:00:05.100Z - Completed processing SILT ID: abc-123

--- Processing 2/50 ---
[WARN] 2025-12-30T10:00:06.000Z - SILT data already exists for def-456, skipping...

=================================================
     Processing Complete
=================================================
Total SILT IDs: 50
Successful: 45
Skipped (already exists): 3
Failed: 2
Images Downloaded: 225
=================================================
```

## Verification

### Check Database

```sql
-- Verify item was created
SELECT * FROM sec_cust.ms_item WHERE name = 'silt_full_json';

-- Check saved data
SELECT
  u.email_user,
  lvl.silt_id,
  ed.value::json->>'status' as silt_status,
  LENGTH(ed.value) as json_size,
  ed.date_creation
FROM sec_cust.lnk_users_extra_data ed
JOIN sec_cust.ms_sixmap_users u ON u.id_user = ed.id_user
JOIN sec_cust.lnk_users_verif_level lvl ON lvl.uuid_user = u.uuid_user
WHERE ed.id_item = (SELECT id_item FROM sec_cust.ms_item WHERE name = 'silt_full_json')
ORDER BY ed.date_creation DESC;

-- Count processed vs total
SELECT
  (SELECT COUNT(DISTINCT silt_id) FROM sec_cust.lnk_users_verif_level WHERE silt_id IS NOT NULL) as total_silt_ids,
  (SELECT COUNT(*) FROM sec_cust.lnk_users_extra_data WHERE id_item = (SELECT id_item FROM sec_cust.ms_item WHERE name = 'silt_full_json')) as processed_count;
```

### Check Remote Server

```bash
# SSH into server
ssh -i "aws-devapp2-03Jan21.pem" devarodriguez@ec2-3-143-246-144.us-east-2.compute.amazonaws.com

# Check directories
ls -la /repo-cr/silt-data/

# Count images per SILT ID
find /repo-cr/silt-data/ -type f -name "*.jpg" | wc -l

# Check specific SILT ID
ls -lh /repo-cr/silt-data/{silt_id}/
```

## Troubleshooting

### "All API tokens failed"

- Check if tokens are still valid
- Verify SILT API is accessible
- Check network/firewall settings

### "SSH connection error"

- Verify private key file exists and has correct permissions (400)
- Check if remote server is accessible
- Verify username and hostname are correct

### "User not found for uuid"

- Data inconsistency between tables
- Check if `uuid_user` exists in `ms_sixmap_users`

### "Failed to create remote directory"

- Check SSH permissions on remote server
- Verify `/repo-cr/` directory exists and is writable

### Images not uploading

- Check disk space on remote server
- Verify SFTP subsystem is enabled on SSH server
- Check local temp directory has write permissions

## Performance Considerations

- **Rate Limiting:** 1-second delay between API requests
- **Sequential Processing:** Processes one SILT ID at a time to avoid overwhelming resources
- **Memory:** Local temp files are deleted immediately after upload
- **Bandwidth:** Images are streamed (not loaded entirely into memory)

## Maintenance

### Re-run for Failed Records

The script automatically skips already-processed SILT IDs. To re-run for failed records:

1. Delete the failed records from database:

```sql
DELETE FROM sec_cust.lnk_users_extra_data
WHERE id_item = (SELECT id_item FROM sec_cust.ms_item WHERE name = 'silt_full_json')
AND id_user IN (
  SELECT id_user FROM sec_cust.ms_sixmap_users
  WHERE uuid_user IN (
    SELECT uuid_user FROM sec_cust.lnk_users_verif_level
    WHERE silt_id IN ('failed_silt_id_1', 'failed_silt_id_2')
  )
);
```

2. Re-run the script

### Clean Up Remote Server

```bash
# SSH into server
ssh -i "aws-devapp2-03Jan21.pem" devarodriguez@ec2-3-143-246-144.us-east-2.compute.amazonaws.com

# Remove specific SILT ID
rm -rf /repo-cr/silt-data/{silt_id}

# Clean up all (careful!)
rm -rf /repo-cr/silt-data/*
```

## Security Notes

- Private key file should never be committed to git (add to .gitignore)
- API tokens should be rotated periodically
- Database passwords should use environment variables
- Remote server access should be restricted by IP if possible

## Support

For issues or questions, check:

1. Script logs for detailed error messages
2. Database constraints and foreign keys
3. Network connectivity to SILT API and remote server
4. SSH key permissions and validity
