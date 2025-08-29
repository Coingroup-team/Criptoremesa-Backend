-- Test Script: Verify SILT Enhancement Implementation
-- Description: Tests that all database changes work correctly for SILT document data storage
-- Author: System Migration
-- Date: 2024

-- Test 1: Verify ms_item entries were created
SELECT 'Test 1: Verify ms_item entries' as test_name;
SELECT id_item, name, description 
FROM sec_cust.ms_item 
WHERE name LIKE 'silt_%'
ORDER BY id_item;

-- Test 2: Verify enhanced function exists
SELECT 'Test 2: Verify enhanced function exists' as test_name;
SELECT proname, pronargs 
FROM pg_proc 
WHERE proname = 'sp_request_level_one_silt_enhanced' 
AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'sec_cust');

-- Test 3: Verify view exists
SELECT 'Test 3: Verify view exists' as test_name;
SELECT COUNT(*) as view_exists 
FROM information_schema.views 
WHERE table_schema = 'sec_cust' 
AND table_name = 'v_user_silt_document_data';

-- Test 4: Test the enhanced function with sample data (replace with actual test email)
-- NOTE: Uncomment and replace 'test@example.com' with actual user email to test
/*
SELECT 'Test 4: Test enhanced function' as test_name;
SELECT sec_cust.sp_request_level_one_silt_enhanced(
    '1990-01-01'::timestamp with time zone,  -- birth date
    'test@example.com',                       -- email user
    1,                                        -- doc type (national id)
    'US',                                     -- iso doc country
    '123456789',                              -- doc number
    'https://example.com/doc.jpg',            -- doc path
    'https://example.com/selfie.jpg',         -- selfie path
    'M',                                      -- gender
    'US',                                     -- iso nationality country
    'silt_test_id',                           -- silt id
    'SUCCESS',                                -- silt status
    false,                                    -- was set manually
    'PERSONAL123',                            -- personal number
    '2030-12-31',                             -- expiry date
    '123 Test Street, Test City'              -- document address
);
*/

-- Test 5: Query view to see sample data structure
SELECT 'Test 5: Query view structure' as test_name;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'sec_cust' 
AND table_name = 'v_user_silt_document_data'
ORDER BY ordinal_position;

-- Test 6: Check if any test data exists in extra data table
SELECT 'Test 6: Check extra data table' as test_name;
SELECT COUNT(*) as silt_extra_data_count
FROM sec_cust.lnk_users_extra_data led
JOIN sec_cust.ms_item mi ON led.id_item = mi.id_item
WHERE mi.name LIKE 'silt_%';

SELECT 'All tests completed' as final_message;
