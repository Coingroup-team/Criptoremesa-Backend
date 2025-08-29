-- Migration: Add verification levels data to client profile endpoint
-- Date: 2025-08-15
-- Description: This change is handled in the backend service layer only.
--              No database function changes needed.
--              The backend will query lnk_users_verif_level table directly
--              and add verification_levels array to the existing profile data.

-- This file is kept for documentation purposes but no SQL changes are required.
-- The existing sec_cust.get_client_profile_by_email function remains unchanged.

-- Backend changes:
-- 1. Added usersPGRepository.getVerificationLevelsByUserId method
-- 2. Modified usersService.getClientProfile to include verification levels
-- 3. Added processing of level_req JSON to extract document type and number

-- Frontend changes:
-- 1. Added DocumentVerificationInfo interface and component
-- 2. Updated ClientDetail type to include verification_levels and documentVerificationInfo
-- 3. Added DocumentVerificationInfo component to client profile page

SELECT 'Migration completed - no database changes required' as status;
