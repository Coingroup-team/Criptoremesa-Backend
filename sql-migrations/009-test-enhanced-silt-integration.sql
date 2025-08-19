-- Migration: Test Enhanced SILT Document Type and Number Integration
-- Description: Comprehensive test to verify document type and number are properly
--              integrated into the SILT processing pipeline
-- Author: Coingroup Expert System
-- Date: 2025-08-17

-- Test 1: Verify all SILT document items exist
SELECT 
    'SILT Items Check' as test_name,
    item_name,
    item_desc,
    CASE WHEN id_item IS NOT NULL THEN 'EXISTS' ELSE 'MISSING' END as status
FROM (
    VALUES 
        ('silt_document_personal_number'),
        ('silt_document_expiry_date'),
        ('silt_document_address'),
        ('silt_document_type'),
        ('silt_document_number')
) AS expected_items(item_name)
LEFT JOIN sec_cust.ms_item ON ms_item.name = expected_items.item_name
ORDER BY item_name;

-- Test 2: Verify stored procedure accepts 17 parameters
SELECT 
    'Stored Procedure Check' as test_name,
    proname as function_name,
    pronargs as parameter_count,
    CASE WHEN pronargs = 17 THEN 'CORRECT' ELSE 'INCORRECT' END as status
FROM pg_proc 
WHERE proname = 'sp_request_level_one_silt_enhanced' 
AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'sec_cust');

-- Test 3: Verify view includes all SILT fields
SELECT 
    'View Columns Check' as test_name,
    column_name,
    data_type,
    CASE 
        WHEN column_name IN ('document_type', 'document_number', 'document_type_edited', 'document_number_edited') 
        THEN 'NEW_FIELD' 
        ELSE 'EXISTING_FIELD' 
    END as field_status
FROM information_schema.columns 
WHERE table_schema = 'sec_cust' 
AND table_name = 'v_user_silt_document_data'
AND column_name LIKE '%document%'
ORDER BY ordinal_position;

-- Test 4: Verify client profile function returns enhanced SILT data
SELECT 
    'Client Profile Function Check' as test_name,
    proname as function_name,
    pg_get_function_result(oid) as return_structure,
    CASE 
        WHEN pg_get_function_result(oid) LIKE '%silt_document_data%' 
        THEN 'INCLUDES_SILT_DATA' 
        ELSE 'MISSING_SILT_DATA' 
    END as status
FROM pg_proc 
WHERE proname = 'get_client_profile_with_verif_levels' 
AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'sec_cust');

-- Test 5: Check if any test users have SILT document data
SELECT 
    'Sample SILT Data Check' as test_name,
    COUNT(*) as users_with_silt_data,
    COUNT(CASE WHEN personal_number IS NOT NULL THEN 1 END) as users_with_personal_number,
    COUNT(CASE WHEN document_expiry_date IS NOT NULL THEN 1 END) as users_with_expiry_date,
    COUNT(CASE WHEN document_address IS NOT NULL THEN 1 END) as users_with_address,
    COUNT(CASE WHEN document_type IS NOT NULL THEN 1 END) as users_with_document_type,
    COUNT(CASE WHEN document_number IS NOT NULL THEN 1 END) as users_with_document_number
FROM sec_cust.v_user_silt_document_data 
WHERE has_silt_document_data = true;
