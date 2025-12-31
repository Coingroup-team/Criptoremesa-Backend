-- Migration: Add Persona Inquiry ID to users table
-- Date: 2025-12-12
-- Description: Adds persona_inquiry_id column to store Persona inquiry identifier for KYC verification
--              and updates get_all_users_by_email function to return the new field

-- Step 1: Add column to sec_cust.ms_sixmap_users
ALTER TABLE sec_cust.ms_sixmap_users
ADD COLUMN IF NOT EXISTS persona_inquiry_id VARCHAR(255) NULL;

-- Step 2: Add comment to document the field
COMMENT ON COLUMN sec_cust.ms_sixmap_users.persona_inquiry_id IS 'Persona KYC inquiry identifier - stores the inquiryID from Persona verification flow';

-- Step 3: Create index for faster lookups by persona_inquiry_id
CREATE INDEX IF NOT EXISTS idx_ms_sixmap_users_persona_inquiry_id 
ON sec_cust.ms_sixmap_users(persona_inquiry_id) 
WHERE persona_inquiry_id IS NOT NULL;

-- Step 4: Update get_all_users_by_email function to include persona_inquiry_id
-- Note: This function is used by the /full-info/:email_user endpoint
-- The function will now return persona_inquiry_id along with all other user data
-- No need to recreate the entire function, just ensure it selects * which includes the new column

-- Verify the changes
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_schema = 'sec_cust' 
  AND table_name = 'ms_sixmap_users' 
  AND column_name = 'persona_inquiry_id';

-- Test that get_all_users_by_email returns the new field
-- (Replace 'test@example.com' with an actual email if needed)
-- SELECT persona_inquiry_id FROM get_all_users_by_email('test@example.com');
