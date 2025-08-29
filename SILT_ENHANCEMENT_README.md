# SILT Document Data Enhancement Implementation

## Overview

This implementation extends the existing SILT flow to capture and store additional document data (personal number, expiry date, and address) that SILT may provide via webhook. The data is stored in the existing `lnk_users_extra_data` table using the established item-based categorization pattern and displayed in the client profile page following the system's architectural patterns.

## 🗄️ Database Changes

### 1. New Item Categories (`001-add-silt-document-data-items.sql`)

Adds new categories to `sec_cust.ms_item` table:
- `silt_document_personal_number` - Personal number from SILT document verification
- `silt_document_expiry_date` - Document expiry date from SILT verification  
- `silt_document_address` - Address extracted from SILT document verification

### 2. Enhanced SILT Function (`002-create-enhanced-silt-function.sql`)

Creates `sec_cust.sp_request_level_one_silt_enhanced()` function that:
- Calls the original `sp_request_level_one_silt()` function for backward compatibility
- Stores additional SILT document data in `lnk_users_extra_data` table
- Uses item-based categorization system
- Handles NULL values gracefully
- Includes error handling to not disrupt original SILT flow

### 3. Data Retrieval View (`003-create-silt-document-data-view.sql`)

Creates `sec_cust.v_user_silt_document_data` view for easy data retrieval:
- Joins user data with extra data items
- Returns personal number, expiry date, and address
- Includes edit status for each field
- Only returns rows where at least one SILT field has data

## 🚀 Backend Changes

### 1. Enhanced Controller (`veriflevels.controller.js`)

**Modified `levelOneVerfificationSilt()` method:**
- Extracts additional fields from SILT webhook payload
- Supports multiple field name variations (personal_number, personal_id, etc.)
- Handles all document types (national_id, passport, driving_license)
- Falls back gracefully if fields are not present

**New webhook data extraction:**
```javascript
// Extract additional SILT document data for each document type
personalNumber = req.body.user.national_id.personal_number || req.body.user.national_id.personal_id || null;
expiryDate = req.body.user.national_id.expiry_date || req.body.user.national_id.date_of_expiry || null;
documentAddress = req.body.user.national_id.address || req.body.user.address || null;
```

**New controller method:**
- `getUserSiltDocumentData()` - Retrieves SILT document data for client profile display

### 2. Enhanced Service (`veriflevels.service.js`)

**New service methods:**
- `levelOneVerfificationSiltEnhanced()` - Processes enhanced SILT data through queue
- `getUserSiltDocumentData()` - Service layer for data retrieval

### 3. Enhanced Repository (`veriflevels.pg.repository.js`)

**New repository methods:**
- `levelOneVerfificationSiltEnhanced()` - Calls enhanced database function
- `getUserSiltDocumentData()` - Queries the SILT document data view

### 4. Enhanced Worker (`silt.worker.js`)

**Smart processing logic:**
- Detects if SILT request contains enhanced data
- Routes to appropriate function (standard vs enhanced)
- Maintains backward compatibility

### 5. New API Route

**New endpoint:**
- `GET /veriflevels/silt/document-data/:emailUser` - Retrieves SILT document data

## 🎨 Frontend Changes

### 1. Enhanced Types (`clients/types/index.ts`)

**New interfaces:**
```typescript
export interface SiltDocumentData {
  id_user_priv: number
  email_user: string
  first_name: string
  last_name: string
  personal_number: string | null
  document_expiry_date: string | null
  document_address: string | null
  personal_number_edited: boolean
  document_expiry_date_edited: boolean
  document_address_edited: boolean
}
```

### 2. Enhanced API (`clients/api/index.ts`)

**New API method:**
- `getSiltDocumentData()` - Fetches SILT document data from backend

### 3. Enhanced Store (`stores/clients.ts`)

**New store features:**
- `siltDocumentData` reactive state
- `getSiltDocumentDataByEmail()` action method

### 4. New Component (`components/pages/clients/SiltDocumentInfo.vue`)

**Features:**
- Automatically loads SILT document data on mount
- Displays only available data fields
- Formats dates appropriately
- Follows existing component styling patterns
- Responsive design with proper text wrapping

### 5. Enhanced Client Profile Page (`pages/persons/clients/[id].vue`)

**Integration:**
- Added `SiltDocumentInfo` component to client profile
- Positioned below basic client information
- Auto-imports component (Vue 3 pattern)

## 📋 Implementation Features

### ✅ **Backward Compatibility**
- Original SILT flow continues unchanged
- Enhanced function calls original function first
- Worker intelligently routes based on data presence

### ✅ **Data Integrity**
- Uses existing table structure and patterns
- Follows item-based categorization system
- Includes proper error handling

### ✅ **Flexible Field Mapping**
- Supports multiple field name variations from SILT
- Handles all document types (national_id, passport, driving_license)
- Gracefully handles missing or NULL data

### ✅ **User Experience**
- Seamless integration into existing client profile
- Only displays when data is available
- Consistent styling with existing components

### ✅ **System Patterns**
- Follows established architectural patterns
- Uses existing stores and composables
- Maintains code consistency

## 🧪 Testing

### Database Testing
Run the test script to verify all changes:
```sql
-- Execute: 999-test-silt-enhancements.sql
```

### Backend Testing
Test the enhanced webhook endpoint:
```bash
curl -X POST http://localhost:3000/cr/veriflevels/silt/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "user": {
      "id": "silt_test_enhanced",
      "birth_date": "1990-01-01",
      "sex": "M",
      "nationality": "USA",
      "national_id": {
        "country": "USA",
        "document_number": "123456789",
        "personal_number": "PERSONAL123",
        "expiry_date": "2030-12-31",
        "address": "123 Test Street",
        "files": [{"file_url": "https://example.com/doc.jpg"}]
      },
      "selfie": {"file_url": "https://example.com/selfie.jpg"}
    },
    "user_meta": {"email_user": "test@example.com"},
    "status": "SUCCESS",
    "processing_attempt": true
  }'
```

### Frontend Testing
1. Navigate to client profile page
2. Verify SILT document info displays (if data exists)
3. Check responsive design and data formatting

## 📁 File Structure

```
sql-migrations/
├── 001-add-silt-document-data-items.sql
├── 002-create-enhanced-silt-function.sql
├── 003-create-silt-document-data-view.sql
└── 999-test-silt-enhancements.sql

backend/
├── controllers/veriflevels.controller.js (modified)
├── services/veriflevels.service.js (modified)
├── repositories/veriflevels.pg.repository.js (modified)
├── routes/veriflevels.routes.js (modified)
└── workers/silt.worker.js (modified)

frontend/
├── utils/clients/types/index.ts (modified)
├── utils/clients/api/index.ts (modified)
├── stores/clients.ts (modified)
├── components/pages/clients/SiltDocumentInfo.vue (new)
└── pages/persons/clients/[id].vue (modified)
```

## 🚀 Deployment Steps

1. **Database Migration:**
   ```sql
   -- Run in DataGrip or PostgreSQL client:
   -- 1. Execute 001-add-silt-document-data-items.sql
   -- 2. Execute 002-create-enhanced-silt-function.sql  
   -- 3. Execute 003-create-silt-document-data-view.sql
   -- 4. Execute 999-test-silt-enhancements.sql (for testing)
   ```

2. **Backend Deployment:**
   - Deploy modified backend files
   - Restart SILT worker process
   - Test webhook endpoint

3. **Frontend Deployment:**
   - Deploy modified frontend files
   - Clear build caches if needed
   - Test client profile pages

## 🔧 Troubleshooting

### Database Issues
- Verify all SQL scripts executed successfully
- Check function permissions
- Ensure item IDs are correctly referenced

### Backend Issues
- Check SILT worker logs for processing errors
- Verify new route is accessible
- Test API endpoint responses

### Frontend Issues
- Verify component auto-import works
- Check console for TypeScript errors
- Ensure API calls return expected data

## 📚 Additional Notes

- **Queue Processing:** Enhanced data flows through the same Redis queue system
- **Error Handling:** All errors are logged but don't disrupt the original SILT flow
- **Performance:** No impact on existing functionality, minimal additional overhead
- **Scalability:** Solution scales with existing infrastructure
- **Monitoring:** Use existing Bull Board dashboard for queue monitoring

This implementation provides a robust, scalable solution that enhances the SILT flow while maintaining full backward compatibility and following established system patterns.
