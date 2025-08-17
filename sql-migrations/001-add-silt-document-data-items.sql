-- Migration: Add SILT Document Data Items to ms_item table
-- Description: Adds new item categories for storing additional SILT document data 
--              (personal number, expiry date, address) from SILT webhook responses
-- Author: Coingroup Expert System
-- Date: 2025-08-13

-- Step 1: Create new category for SILT-provided information
-- ms_category table structure: (id_category, name, value) - id_category auto-increments
INSERT INTO sec_cust.ms_category (name, value) VALUES
    ('SILT Information', 'silt_information');

-- Step 2: Get the new category ID and insert SILT document items
-- Using the newly created category for SILT-provided verification data
-- Safe insertion that prevents duplicates
INSERT INTO sec_cust.ms_item (name, description, id_category)
SELECT 
    new_items.item_name,
    new_items.item_description,
    cat.id_category
FROM (VALUES
    ('silt_document_personal_number', 'Personal number extracted by SILT from document verification'),
    ('silt_document_expiry_date', 'Document expiry date extracted by SILT from verification'),
    ('silt_document_address', 'Address information extracted by SILT from document verification')
) AS new_items(item_name, item_description)
CROSS JOIN (
    SELECT id_category FROM sec_cust.ms_category WHERE name = 'SILT Information'
) AS cat
WHERE NOT EXISTS (
    SELECT 1 FROM sec_cust.ms_item WHERE ms_item.name = new_items.item_name
);

-- Step 3: Verify the insertion shows proper category assignment
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
