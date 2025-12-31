-- Get the actual current definition of SILT functions from the database

-- Get sp_request_level_one_silt
SELECT 
    'sp_request_level_one_silt' as function_name,
    pg_get_functiondef(p.oid) as definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'sec_cust'
AND p.proname = 'sp_request_level_one_silt';

-- Separator
SELECT '------- ENHANCED FUNCTION -------' as separator;

-- Get sp_request_level_one_silt_enhanced
SELECT 
    'sp_request_level_one_silt_enhanced' as function_name,
    pg_get_functiondef(p.oid) as definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'sec_cust'
AND p.proname = 'sp_request_level_one_silt_enhanced';
