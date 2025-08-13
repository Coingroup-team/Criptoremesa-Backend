-- Migration: SILT Document Data View
-- Description: Creates a view to easily retrieve additional SILT document data for users
-- Author: System Migration
-- Date: 2024

-- Create view to retrieve SILT document data for users
CREATE OR REPLACE VIEW sec_cust.v_user_silt_document_data AS
SELECT 
    u.id_user_priv,
    u.email_user,
    u.first_name,
    u.last_name,
    personal_num.value AS personal_number,
    expiry.value AS document_expiry_date,
    addr.value AS document_address,
    personal_num.edited AS personal_number_edited,
    expiry.edited AS document_expiry_date_edited,
    addr.edited AS document_address_edited
FROM sec_cust.ms_app_users u
LEFT JOIN sec_cust.lnk_users_extra_data personal_num ON (
    personal_num.id_user = u.id_user_priv 
    AND personal_num.id_item = (SELECT id_item FROM sec_cust.ms_item WHERE name = 'silt_document_personal_number')
)
LEFT JOIN sec_cust.lnk_users_extra_data expiry ON (
    expiry.id_user = u.id_user_priv 
    AND expiry.id_item = (SELECT id_item FROM sec_cust.ms_item WHERE name = 'silt_document_expiry_date')
)
LEFT JOIN sec_cust.lnk_users_extra_data addr ON (
    addr.id_user = u.id_user_priv 
    AND addr.id_item = (SELECT id_item FROM sec_cust.ms_item WHERE name = 'silt_document_address')
)
WHERE (personal_num.value IS NOT NULL OR expiry.value IS NOT NULL OR addr.value IS NOT NULL);

-- Grant permissions on the view
GRANT SELECT ON sec_cust.v_user_silt_document_data TO postgres;

-- Test the view creation
SELECT COUNT(*) as view_exists 
FROM information_schema.views 
WHERE table_schema = 'sec_cust' 
AND table_name = 'v_user_silt_document_data';
