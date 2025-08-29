-- Migration: Add SILT Document Type and Number Items
-- Description: Extends SILT functionality to include document type and document number 
--              extracted from SILT webhook responses
-- Author: Coingroup Expert System
-- Date: 2025-08-15

-- Step 1: Add new SILT document items for document type and number
-- Using the existing SILT Information category
INSERT INTO sec_cust.ms_item (name, description, id_category)
SELECT 
    new_items.item_name,
    new_items.item_description,
    cat.id_category
FROM (VALUES
    ('silt_document_type', 'Document type extracted by SILT from document verification'),
    ('silt_document_number', 'Document number extracted by SILT from document verification')
) AS new_items(item_name, item_description)
CROSS JOIN (
    SELECT id_category FROM sec_cust.ms_category WHERE name = 'SILT Information'
) AS cat
WHERE NOT EXISTS (
    SELECT 1 FROM sec_cust.ms_item WHERE ms_item.name = new_items.item_name
);

-- Step 2: Verify the insertion shows proper category assignment
SELECT
    ms_item.id_item,
    ms_item.name,
    ms_item.description,
    ms_item.id_category,
    ms_category.name as category_name
FROM sec_cust.ms_item 
LEFT JOIN sec_cust.ms_category ON ms_item.id_category = ms_category.id_category
WHERE ms_item.name LIKE 'silt_%' OR ms_category.name = 'SILT Information'
ORDER BY ms_item.id_item;
