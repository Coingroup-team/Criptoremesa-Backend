-- Migration: Add persona_inquiry_id column to lnk_users_verif_level
-- Description: Adds persona_inquiry_id column to track Persona inquiries in verification level records
--              This mirrors the silt_id column pattern for SILT verification tracking
-- Author: Coingroup Expert System
-- Date: 2024-12-20
-- Phase: 2 (Webhook Processing)

-- Add persona_inquiry_id column to lnk_users_verif_level table
-- This column links verification records to Persona inquiry IDs
ALTER TABLE sec_cust.lnk_users_verif_level
ADD COLUMN IF NOT EXISTS persona_inquiry_id VARCHAR(255);

-- Add index for faster lookups by persona_inquiry_id
CREATE INDEX IF NOT EXISTS idx_lnk_users_verif_level_persona_inquiry_id 
ON sec_cust.lnk_users_verif_level(persona_inquiry_id);

-- Add comment to document the column purpose
COMMENT ON COLUMN sec_cust.lnk_users_verif_level.persona_inquiry_id IS 
'Persona inquiry ID from Persona verification webhook. Links to Persona inquiry for tracking and updates. Mirrors silt_id pattern.';

-- Verify the column was added
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'sec_cust'
  AND table_name = 'lnk_users_verif_level'
  AND column_name = 'persona_inquiry_id';
