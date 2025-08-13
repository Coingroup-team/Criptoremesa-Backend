-- Migration: Add SILT Document Data Items to ms_item table
-- Description: Adds new item categories for storing additional SILT document data 
--              (personal number, expiry date, address) in lnk_users_extra_data table
-- Author: System Migration
-- Date: 2024

-- Insert new items for SILT document data storage
-- These will be used as foreign keys in lnk_users_extra_data.id_item

INSERT INTO sec_cust.ms_item (name, description) VALUES 
    ('silt_document_personal_number', 'Personal number from SILT document verification'),
    ('silt_document_expiry_date', 'Document expiry date from SILT verification'),
    ('silt_document_address', 'Address extracted from SILT document verification');

-- Verify the insertion
SELECT id_item, name, description 
FROM sec_cust.ms_item 
WHERE name LIKE 'silt_%'
ORDER BY id_item;
