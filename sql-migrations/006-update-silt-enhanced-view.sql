-- Migration: Update SILT Enhanced View with Document Type and Number
-- Description: Extends v_user_silt_document_data view to include document type and number
--              extracted from SILT webhook responses
-- Author: Coingroup Expert System
-- Date: 2025-08-17

-- Drop the existing view to avoid column renaming issues
DROP VIEW IF EXISTS sec_cust.v_user_silt_document_data;

-- Create the updated SILT document data view to include document type and number
CREATE VIEW sec_cust.v_user_silt_document_data AS
SELECT 
    u.id_user,
    u.email_user,
    personal_num.value AS personal_number,
    expiry.value AS document_expiry_date,
    addr.value AS document_address,
    doc_type.value AS document_type,
    doc_number.value AS document_number,
    personal_num.edited AS personal_number_edited,
    expiry.edited AS document_expiry_date_edited,
    addr.edited AS document_address_edited,
    doc_type.edited AS document_type_edited,
    doc_number.edited AS document_number_edited,
    CASE 
        WHEN personal_num.value IS NOT NULL 
             OR expiry.value IS NOT NULL 
             OR addr.value IS NOT NULL 
             OR doc_type.value IS NOT NULL 
             OR doc_number.value IS NOT NULL 
        THEN true 
        ELSE false 
    END AS has_silt_document_data
FROM sec_cust.ms_sixmap_users u
LEFT JOIN sec_cust.lnk_users_extra_data personal_num ON (
    personal_num.id_user = u.id_user 
    AND personal_num.id_item = (SELECT id_item FROM sec_cust.ms_item WHERE name = 'silt_document_personal_number')
)
LEFT JOIN sec_cust.lnk_users_extra_data expiry ON (
    expiry.id_user = u.id_user 
    AND expiry.id_item = (SELECT id_item FROM sec_cust.ms_item WHERE name = 'silt_document_expiry_date')
)
LEFT JOIN sec_cust.lnk_users_extra_data addr ON (
    addr.id_user = u.id_user 
    AND addr.id_item = (SELECT id_item FROM sec_cust.ms_item WHERE name = 'silt_document_address')
)
LEFT JOIN sec_cust.lnk_users_extra_data doc_type ON (
    doc_type.id_user = u.id_user 
    AND doc_type.id_item = (SELECT id_item FROM sec_cust.ms_item WHERE name = 'silt_document_type')
)
LEFT JOIN sec_cust.lnk_users_extra_data doc_number ON (
    doc_number.id_user = u.id_user 
    AND doc_number.id_item = (SELECT id_item FROM sec_cust.ms_item WHERE name = 'silt_document_number')
);

-- Grant permissions on the updated view
GRANT SELECT ON sec_cust.v_user_silt_document_data TO postgres;

-- Verify the view update shows all SILT fields
SELECT 
    column_name,
    data_type
FROM information_schema.columns 
WHERE table_schema = 'sec_cust' 
AND table_name = 'v_user_silt_document_data'
ORDER BY ordinal_position;
