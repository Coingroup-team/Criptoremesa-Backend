# How to Check SILT Images on Remote Server

This guide shows how to verify that SILT images are properly stored and readable on the remote server.

---

## Quick Steps

### 1. Find SILT IDs on Server

List all SILT ID directories:

```powershell
ssh -i C:\Users\Anthony\Documents\Coingroup\Criptoremesa-Backend\aws-devapp2-03Jan21.pem devarodriguez@ec2-3-143-246-144.us-east-2.compute.amazonaws.com "ls /repo-cr/silt-data | head -10"
```

### 2. Check Images for a Specific SILT ID

Replace `{SILT_ID}` with the actual SILT ID:

```powershell
ssh -i C:\Users\Anthony\Documents\Coingroup\Criptoremesa-Backend\aws-devapp2-03Jan21.pem devarodriguez@ec2-3-143-246-144.us-east-2.compute.amazonaws.com "ls -lh /repo-cr/silt-data/{SILT_ID}/"
```

**Example:**

```powershell
ssh -i C:\Users\Anthony\Documents\Coingroup\Criptoremesa-Backend\aws-devapp2-03Jan21.pem devarodriguez@ec2-3-143-246-144.us-east-2.compute.amazonaws.com "ls -lh /repo-cr/silt-data/0026a5a0-34fc-4af7-964c-e8cf5659269f/"
```

**Output shows:**

- File names (image IDs)
- File sizes (should be ~300-400KB each)
- Upload dates

### 3. Download an Image to View

Replace `{SILT_ID}` and `{FILENAME}` with actual values:

```powershell
scp -i C:\Users\Anthony\Documents\Coingroup\Criptoremesa-Backend\aws-devapp2-03Jan21.pem devarodriguez@ec2-3-143-246-144.us-east-2.compute.amazonaws.com:"/repo-cr/silt-data/{SILT_ID}/{FILENAME}.jpg" C:\Users\Anthony\Downloads\silt-image.jpg
```

**Example:**

```powershell
scp -i C:\Users\Anthony\Documents\Coingroup\Criptoremesa-Backend\aws-devapp2-03Jan21.pem devarodriguez@ec2-3-143-246-144.us-east-2.compute.amazonaws.com:"/repo-cr/silt-data/0026a5a0-34fc-4af7-964c-e8cf5659269f/0026a5a0-34fc-4af7-964c-e8cf5659269f_V-98e3d932-c7c2-4178-8177-23649292dac8.jpg" C:\Users\Anthony\Downloads\silt-image.jpg
```

### 4. Open and View the Image

```powershell
Invoke-Item C:\Users\Anthony\Downloads\silt-image.jpg
```

This will open the image in Windows Photos (or your default image viewer).

---

## Full Working Example (Copy & Paste)

```powershell
# Step 1: Get a SILT ID
ssh -i C:\Users\Anthony\Documents\Coingroup\Criptoremesa-Backend\aws-devapp2-03Jan21.pem devarodriguez@ec2-3-143-246-144.us-east-2.compute.amazonaws.com "ls /repo-cr/silt-data | head -1"

# Step 2: Check images for that SILT ID (replace SILT_ID from step 1)
ssh -i C:\Users\Anthony\Documents\Coingroup\Criptoremesa-Backend\aws-devapp2-03Jan21.pem devarodriguez@ec2-3-143-246-144.us-east-2.compute.amazonaws.com "ls -lh /repo-cr/silt-data/0026a5a0-34fc-4af7-964c-e8cf5659269f/"

# Step 3: Download first image (copy full filename from step 2)
scp -i C:\Users\Anthony\Documents\Coingroup\Criptoremesa-Backend\aws-devapp2-03Jan21.pem devarodriguez@ec2-3-143-246-144.us-east-2.compute.amazonaws.com:"/repo-cr/silt-data/0026a5a0-34fc-4af7-964c-e8cf5659269f/0026a5a0-34fc-4af7-964c-e8cf5659269f_V-98e3d932-c7c2-4178-8177-23649292dac8.jpg" C:\Users\Anthony\Downloads\silt-image.jpg

# Step 4: View the image
Invoke-Item C:\Users\Anthony\Downloads\silt-image.jpg
```

---

## Understanding Image Filenames

SILT images follow this pattern:

```
{SILT_ID}_{IMAGE_TYPE}-{IMAGE_ID}.jpg
```

**Image Types:**

- `V` - Video/Selfie verification
- `IF` - ID Front
- `IB` - ID Back
- `HG` - Handwritten/Signature document
- etc.

**Example:**

```
0026a5a0-34fc-4af7-964c-e8cf5659269f_V-98e3d932-c7c2-4178-8177-23649292dac8.jpg
├─ SILT_ID: 0026a5a0-34fc-4af7-964c-e8cf5659269f
├─ Type: V (video/selfie)
└─ Image ID: 98e3d932-c7c2-4178-8177-23649292dac8
```

---

## Server Statistics

Check total number of stored images:

```powershell
ssh -i C:\Users\Anthony\Documents\Coingroup\Criptoremesa-Backend\aws-devapp2-03Jan21.pem devarodriguez@ec2-3-143-246-144.us-east-2.compute.amazonaws.com "find /repo-cr/silt-data -type f | wc -l"
```

Check number of SILT ID directories:

```powershell
ssh -i C:\Users\Anthony\Documents\Coingroup\Criptoremesa-Backend\aws-devapp2-03Jan21.pem devarodriguez@ec2-3-143-246-144.us-east-2.compute.amazonaws.com "ls /repo-cr/silt-data | wc -l"
```

Check total storage used:

```powershell
ssh -i C:\Users\Anthony\Documents\Coingroup\Criptoremesa-Backend\aws-devapp2-03Jan21.pem devarodriguez@ec2-3-143-246-144.us-east-2.compute.amazonaws.com "du -sh /repo-cr/silt-data"
```

---

## Troubleshooting

### Issue: "Permission denied"

- Check that the SSH key file exists: `aws-devapp2-03Jan21.pem`
- Verify key permissions (should be read-only for owner)

### Issue: "No such file or directory"

- Verify the SILT ID exists on the server
- Check that the image filename is correct (including full UUID)
- Ensure quotes around the remote path

### Issue: Image won't open

- Check file size (should be >100KB, typically 300-400KB)
- Verify file downloaded completely
- Try opening with a different image viewer

---

## Quick Reference - Server Info

**Server:** ec2-3-143-246-144.us-east-2.compute.amazonaws.com  
**User:** devarodriguez  
**SSH Key:** `C:\Users\Anthony\Documents\Coingroup\Criptoremesa-Backend\aws-devapp2-03Jan21.pem`  
**Base Path:** `/repo-cr/silt-data`  
**Structure:** `/repo-cr/silt-data/{SILT_ID}/{IMAGE_FILES}.jpg`

---

**Last Verified:** December 30, 2025  
**Total Images on Server:** 2,392 files  
**Status:** ✅ All images verified as readable
