-- Migration: Update SILT Enhanced Stored Procedure with Document Type and Number
-- Description: Updates sp_request_level_one_silt_enhanced to accept and store 
--              document type and number parameters (17 total parameters)
-- Author: Coingroup Expert System
-- Date: 2025-08-17

-- Update the SILT enhanced stored procedure to handle document type and number
CREATE OR REPLACE FUNCTION sec_cust.sp_request_level_one_silt_enhanced(
    p_date_birth timestamp with time zone,
    p_email_user character varying,
    p_doc_type integer,
    p_iso_doc_country character varying,
    p_doc_number character varying,
    p_doc_path character varying,
    p_selfie_path character varying,
    p_gender character,
    p_iso_nationality_country character,
    p_silt_id character varying,
    p_silt_status character varying,
    p_was_set_manually boolean,
    -- Enhanced parameters for additional document data
    p_personal_number character varying DEFAULT NULL,
    p_expiry_date character varying DEFAULT NULL,
    p_document_address text DEFAULT NULL,
    -- New parameters for document type and number
    p_document_type character varying DEFAULT NULL,
    p_document_number character varying DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
AS $function$
DECLARE
    v_current_full_user RECORD;
    v_first_name character varying;
    v_last_name character varying;
    v_id_nationality_country integer;
    v_id_doc_type integer;
    v_id_level record;
    v_users_verif_level_id integer;
    v_item_personal_number_id integer;
    v_item_expiry_date_id integer;
    v_item_address_id integer;
    v_item_document_type_id integer;
    v_item_document_number_id integer;
BEGIN
    -- Original function logic (call existing function first)
    PERFORM sec_cust.sp_request_level_one_silt(
        p_date_birth,
        p_email_user,
        p_doc_type,
        p_iso_doc_country,
        p_doc_number,
        p_doc_path,
        p_selfie_path,
        p_gender,
        p_iso_nationality_country,
        p_silt_id,
        p_silt_status,
        p_was_set_manually
    );

    -- Get user information for extra data storage
    SELECT * INTO v_current_full_user
    FROM sec_cust.ms_sixmap_users AS us
    WHERE us.email_user = p_email_user;

    -- Get item IDs for all SILT document data
    SELECT id_item INTO v_item_personal_number_id 
    FROM sec_cust.ms_item 
    WHERE name = 'silt_document_personal_number';

    SELECT id_item INTO v_item_expiry_date_id 
    FROM sec_cust.ms_item 
    WHERE name = 'silt_document_expiry_date';

    SELECT id_item INTO v_item_address_id 
    FROM sec_cust.ms_item 
    WHERE name = 'silt_document_address';

    SELECT id_item INTO v_item_document_type_id 
    FROM sec_cust.ms_item 
    WHERE name = 'silt_document_type';

    SELECT id_item INTO v_item_document_number_id 
    FROM sec_cust.ms_item 
    WHERE name = 'silt_document_number';

    -- Store additional SILT document data if provided
    IF p_personal_number IS NOT NULL AND v_item_personal_number_id IS NOT NULL THEN
        -- Delete existing personal number for this user
        DELETE FROM sec_cust.lnk_users_extra_data 
        WHERE id_user = v_current_full_user.id_user 
        AND id_item = v_item_personal_number_id;

        -- Insert new personal number
        INSERT INTO sec_cust.lnk_users_extra_data (id_user, id_item, value, edited)
        VALUES (v_current_full_user.id_user, v_item_personal_number_id, p_personal_number, false);
    END IF;

    IF p_expiry_date IS NOT NULL AND v_item_expiry_date_id IS NOT NULL THEN
        -- Delete existing expiry date for this user
        DELETE FROM sec_cust.lnk_users_extra_data 
        WHERE id_user = v_current_full_user.id_user 
        AND id_item = v_item_expiry_date_id;

        -- Insert new expiry date
        INSERT INTO sec_cust.lnk_users_extra_data (id_user, id_item, value, edited)
        VALUES (v_current_full_user.id_user, v_item_expiry_date_id, p_expiry_date, false);
    END IF;

    IF p_document_address IS NOT NULL AND v_item_address_id IS NOT NULL THEN
        -- Delete existing document address for this user
        DELETE FROM sec_cust.lnk_users_extra_data 
        WHERE id_user = v_current_full_user.id_user 
        AND id_item = v_item_address_id;

        -- Insert new document address
        INSERT INTO sec_cust.lnk_users_extra_data (id_user, id_item, value, edited)
        VALUES (v_current_full_user.id_user, v_item_address_id, p_document_address, false);
    END IF;

    -- Store new document type and number data
    IF p_document_type IS NOT NULL AND v_item_document_type_id IS NOT NULL THEN
        -- Delete existing document type for this user
        DELETE FROM sec_cust.lnk_users_extra_data 
        WHERE id_user = v_current_full_user.id_user 
        AND id_item = v_item_document_type_id;

        -- Insert new document type
        INSERT INTO sec_cust.lnk_users_extra_data (id_user, id_item, value, edited)
        VALUES (v_current_full_user.id_user, v_item_document_type_id, p_document_type, false);
    END IF;

    IF p_document_number IS NOT NULL AND v_item_document_number_id IS NOT NULL THEN
        -- Delete existing document number for this user
        DELETE FROM sec_cust.lnk_users_extra_data 
        WHERE id_user = v_current_full_user.id_user 
        AND id_item = v_item_document_number_id;

        -- Insert new document number
        INSERT INTO sec_cust.lnk_users_extra_data (id_user, id_item, value, edited)
        VALUES (v_current_full_user.id_user, v_item_document_number_id, p_document_number, false);
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the original SILT processing
        RAISE WARNING 'Error storing enhanced SILT document data for user %: %', p_email_user, SQLERRM;
END;
$function$;

-- Grant permissions on the updated function
GRANT EXECUTE ON FUNCTION sec_cust.sp_request_level_one_silt_enhanced TO postgres;

-- Verify function update shows 17 parameters
SELECT 
    proname,
    pronargs,
    pg_get_function_arguments(oid) as arguments
FROM pg_proc 
WHERE proname = 'sp_request_level_one_silt_enhanced' 
AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'sec_cust');
