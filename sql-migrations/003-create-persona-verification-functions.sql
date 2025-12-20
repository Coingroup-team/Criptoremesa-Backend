-- Migration: Create Persona verification functions (Phase 2)
-- Description: Creates base and enhanced Persona verification functions following the SILT pattern
-- This includes concurrency protection and extra data storage

-- ============================================================================
-- BASE FUNCTION: sp_request_level_one_persona (12 parameters + boolean for concurrency)
-- ============================================================================
-- This function handles the core Persona verification logic with concurrency protection
-- It prevents PENDING webhooks from overwriting already approved statuses

CREATE OR REPLACE FUNCTION sec_cust.sp_request_level_one_persona(
    p_date_birth timestamp with time zone,
    p_email_user character varying,
    p_doc_type integer,
    p_iso_doc_country character varying,
    p_doc_number character varying,
    p_doc_path character varying,
    p_selfie_path character varying,
    p_gender character,
    p_iso_nationality_country character,
    p_persona_inquiry_id character varying,
    p_persona_status character varying,
    p_was_set_manually boolean
)
RETURNS void
LANGUAGE plpgsql
AS $function$
DECLARE
    v_current_full_user             sec_cust.ms_sixmap_users %ROWTYPE;
    v_id_level                      int;
    v_id_nationality_country        int;
    v_id_doc_type                   int;
    v_first_name                    varchar;
    v_last_name                     varchar;
    v_concurrency_condition         boolean DEFAULT TRUE;
BEGIN
    -- Raise notice for debugging
    raise notice 'p_persona_status %', p_persona_status;
    
    -- Look for the full user
    SELECT * INTO v_current_full_user
    FROM sec_cust.ms_sixmap_users AS us
    WHERE us.email_user = p_email_user;

    -- Get user's name from private schema
    select us.first_name, us.last_name
    into v_first_name, v_last_name
    from priv.ms_sixmap_users us
    where us.id_user_priv = v_current_full_user.id_user_priv;

    -- Look for the id nationality country
    select cou.id_all_country into v_id_nationality_country
    from sec_emp.ms_all_countries cou
    where cou.country_iso_code = p_iso_nationality_country;

    -- Look for the id doc type
    case
        -- national_id
        when p_doc_type = 1 then
            select doc.id_ident_doc_type into v_id_doc_type
            from sec_cust.ms_doc_type doc
            where doc.name_country = (
                select cou.country_name
                from sec_emp.ms_all_countries cou
                where cou.country_iso_code = p_iso_doc_country
            )
            and (doc.type_doc_type = 'Primario' or doc.type_doc_type = 'Principal')
            and (
                (doc.name_country != 'Venezuela' and doc.name_country != 'Brazil')
                or (doc.name_country = 'Venezuela' and doc.acronym = 'CI')
                or (doc.name_country = 'Brazil' and doc.acronym = 'RG')
            );

        -- passport
        when p_doc_type = 2 then
            select doc.id_ident_doc_type into v_id_doc_type
            from sec_cust.ms_doc_type doc
            where doc.name_country = (
                select cou.country_name
                from sec_emp.ms_all_countries cou
                where cou.country_iso_code = p_iso_doc_country
            )
            and doc.type_doc_type = 'Secundario'
            and doc.acronym = 'P';

        -- license
        when p_doc_type = 3 then
            select doc.id_ident_doc_type into v_id_doc_type
            from sec_cust.ms_doc_type doc
            where doc.name_country = (
                select cou.country_name
                from sec_emp.ms_all_countries cou
                where cou.country_iso_code = p_iso_doc_country
            )
            and doc.type_doc_type = 'Terciario'
            and doc.acronym = 'LDC';

        else
            v_id_doc_type = null;
    end case;

    -- Check if this is a new inquiry or an update
    if (not exists(
        select lvl.id_users_verif_level
        from sec_cust.lnk_users_verif_level lvl
        where lvl.persona_inquiry_id = p_persona_inquiry_id
    )) then  -- NEW REQUEST

        -- Look for id of the template with fields according to level, service, utype and country
        SELECT * INTO v_id_level
        FROM sec_cust.v_ms_verif_level_get_id_by_id_vl_service_utype_country(
            1,
            v_current_full_user.id_service,
            v_current_full_user.id_services_utype,
            v_current_full_user.id_resid_country
        );

        -- Set the last one as false
        UPDATE sec_cust.lnk_users_verif_level
        SET is_the_last_one = FALSE
        WHERE uuid_user = v_current_full_user.uuid_user
        AND id_vl = 1
        AND is_the_last_one IS TRUE;

        -- Insert new request
        INSERT INTO sec_cust.LNK_USERS_VERIF_LEVEL(
            id_vl,
            level_apb_ok,
            level_req,
            id_service,
            uuid_user,
            id_verif_level,
            id_resid_country,
            persona_inquiry_id,
            active,
            is_the_last_one
        )
        VALUES (
            1,
            (
                case
                    when p_persona_status = 'SUCCESS' then true
                    when p_persona_status = 'ERROR' or p_persona_status = 'VERIFICATION_ERROR' then false
                    else null  -- For PENDING or other statuses
                end
            ),
            (
                SELECT json_agg(t)
                FROM (
                    SELECT VL.*, CASE
                    WHEN VL.id_vl IS NOT NULL THEN true
                    END is_the_last_one
                    FROM Sec_cust.MS_VERIF_LEVEL AS VL
                ) AS t
                WHERE t.id_vl = 1
                AND t.id_service = v_current_full_user.id_service
                AND t.id_services_utype = v_current_full_user.id_services_utype
                AND t.id_resid_country = v_current_full_user.id_resid_country
            ),
            1,
            v_current_full_user.uuid_user,
            v_id_level::BIGINT,
            v_current_full_user.id_resid_country,
            p_persona_inquiry_id,
            true,
            true
        );

        raise notice 'iso doc country::text %', p_iso_doc_country::text;
        raise notice 'selfie_path::text %', p_selfie_path::text;
        raise notice 'doc_path::text %', p_doc_path::text;
        raise notice 'id_doc_type::text %', v_id_doc_type::text;
        raise notice 'doc_number::text %', p_doc_number::text;
        raise notice 'persona inquiry id::text %', p_persona_inquiry_id::text;
        raise notice 'persona status::text %', p_persona_status::text;
        raise notice 'manual review %', p_was_set_manually;

        -- Set values in new request
        UPDATE sec_cust.lnk_users_verif_level
        SET level_req = (
            SELECT jsonb_agg(
                CASE
                    WHEN elem->>'req_type' = 'selfie' THEN jsonb_set(elem, '{req_use_path}', to_jsonb(p_selfie_path::text))
                    WHEN elem->>'req_type' = 'doc' THEN jsonb_set(elem, '{req_use_path}', to_jsonb(p_doc_path::text))
                    WHEN elem->>'req_type' = 'id_ident_doc_type' THEN jsonb_set(elem, '{req_type_value}', to_jsonb(v_id_doc_type::text))
                    WHEN elem->>'req_type' = 'ident_doc_number' THEN jsonb_set(elem, '{req_type_value}', to_jsonb(p_doc_number::text))
                    ELSE elem
                END
            )
            FROM jsonb_array_elements(level_req) AS elem
        )
        WHERE uuid_user = v_current_full_user.uuid_user
        AND id_vl = 1
        AND is_the_last_one IS TRUE;

        -- Update info in user table
        UPDATE sec_cust.ms_sixmap_users
        SET id_ident_doc_type = v_id_doc_type,
            ident_doc_number = p_doc_number,
            gender = p_gender,
            id_nationality_country = v_id_nationality_country,
            verif_level_apb = (
                case
                    when p_persona_status = 'SUCCESS' then true
                    when p_persona_status = 'ERROR' or p_persona_status = 'VERIFICATION_ERROR' then false
                    else v_current_full_user.verif_level_apb  -- Keep existing value for PENDING
                end
            ),
            id_verif_level = 1,
            date_birth = p_date_birth
        WHERE uuid_user = v_current_full_user.uuid_user;

        IF (v_current_full_user.id_migrated IS NOT NULL) THEN
            UPDATE sec_cust.ms_sixmap_users
            SET completed_information_migrated = true
            WHERE uuid_user = v_current_full_user.uuid_user;
        END IF;

        -- Notify by sockets for new requests only if status is final (SUCCESS/ERROR)
        IF p_persona_status IN ('SUCCESS', 'ERROR', 'VERIFICATION_ERROR') THEN
            PERFORM pg_notify('level_upgrade',json_build_object(
                'id_verif_level', 1,
                'verif_level_apb', (
                    case
                        when p_persona_status = 'SUCCESS' then true
                        when p_persona_status = 'ERROR' or p_persona_status = 'VERIFICATION_ERROR' then false
                    end
                ), 
                'email_user', v_current_full_user.email_user, 
                'first_name', v_first_name, 
                'last_name', v_last_name, 
                'id_resid_country', v_current_full_user.id_resid_country
            )::text);
        END IF;

    else -- UPDATE REQUEST

        raise notice 'update- id_doc_type::text %', v_id_doc_type::text;
        raise notice 'update- doc_number::text %', p_doc_number::text;
        raise notice 'update- id_nationality::text %', v_id_nationality_country::text;
        raise notice 'update- persona inquiry id::text %', p_persona_inquiry_id::text;
        raise notice 'update - persona status::text %', p_persona_status::text;
        raise notice 'update - manual review %', p_was_set_manually;

        -- Update level_req with document paths
        UPDATE sec_cust.lnk_users_verif_level
        SET level_req = (
            SELECT jsonb_agg(
                CASE
                    WHEN elem->>'req_type' = 'selfie' THEN jsonb_set(elem, '{req_use_path}', to_jsonb(p_selfie_path::text))
                    WHEN elem->>'req_type' = 'doc' THEN jsonb_set(elem, '{req_use_path}', to_jsonb(p_doc_path::text))
                    WHEN elem->>'req_type' = 'id_ident_doc_type' THEN jsonb_set(elem, '{req_type_value}', to_jsonb(v_id_doc_type::text))
                    WHEN elem->>'req_type' = 'ident_doc_number' THEN jsonb_set(elem, '{req_type_value}', to_jsonb(p_doc_number::text))
                    ELSE elem
                END
            )
            FROM jsonb_array_elements(level_req) AS elem
        )
        WHERE persona_inquiry_id = p_persona_inquiry_id;

        -- Update info in user table (always update document data)
        UPDATE sec_cust.ms_sixmap_users
        SET id_ident_doc_type = v_id_doc_type,
            ident_doc_number = p_doc_number,
            gender = p_gender,
            id_nationality_country = v_id_nationality_country,
            date_birth = p_date_birth
        WHERE uuid_user = v_current_full_user.uuid_user;

        raise notice 'ENTRO EN EL ELSE - UPDATE BRANCH';
        
        -- CONCURRENCY PROTECTION: Prevent PENDING webhooks from overwriting approved status
        if (p_persona_status = 'PENDING' 
            AND p_was_set_manually = FALSE 
            AND v_current_full_user.id_verif_level = 1 
            AND v_current_full_user.verif_level_apb = TRUE) THEN
            v_concurrency_condition = FALSE;
            RAISE NOTICE 'CONCURRENCY VALIDATION MET - SKIPPING STATUS UPDATE';
        end if;
        
        -- Only update approval status if concurrency condition passes
        if (v_concurrency_condition = TRUE) then
            raise notice 'UPDATING APPROVAL STATUS';
            
            -- Update lvl request
            update sec_cust.lnk_users_verif_level
            set level_apb_ok = (
                case
                    when p_persona_status = 'SUCCESS' then true
                    when p_persona_status = 'ERROR' or p_persona_status = 'VERIFICATION_ERROR' then false
                    else level_apb_ok  -- Keep existing value for other statuses
                end
            )
            where persona_inquiry_id = p_persona_inquiry_id;

            -- Update sixmap user
            UPDATE sec_cust.ms_sixmap_users
            SET verif_level_apb = (
                case
                    when p_persona_status = 'SUCCESS' then true
                    when p_persona_status = 'ERROR' or p_persona_status = 'VERIFICATION_ERROR' then false
                    else verif_level_apb  -- Keep existing value for other statuses
                end
            )
            WHERE uuid_user = v_current_full_user.uuid_user;

            -- Send notification only if status is final
            IF p_persona_status IN ('SUCCESS', 'ERROR', 'VERIFICATION_ERROR') THEN
                PERFORM pg_notify('level_upgrade',json_build_object(
                    'id_verif_level', 1,
                    'verif_level_apb', (
                        case
                            when p_persona_status = 'SUCCESS' then true
                            when p_persona_status = 'ERROR' or p_persona_status = 'VERIFICATION_ERROR' then false
                        end
                    ), 
                    'email_user', v_current_full_user.email_user, 
                    'first_name', v_first_name, 
                    'last_name', v_last_name, 
                    'id_resid_country', v_current_full_user.id_resid_country
                )::text);
            END IF;
        end if;

    end if;
END
$function$;


-- ============================================================================
-- ENHANCED FUNCTION: sp_request_level_one_persona_enhanced (17 parameters)
-- ============================================================================
-- This function wraps the base function and stores additional Persona document data
-- in the lnk_users_extra_data table

CREATE OR REPLACE FUNCTION sec_cust.sp_request_level_one_persona_enhanced(
    p_date_birth timestamp with time zone,
    p_email_user character varying,
    p_doc_type integer,
    p_iso_doc_country character varying,
    p_doc_number character varying,
    p_doc_path character varying,
    p_selfie_path character varying,
    p_gender character,
    p_iso_nationality_country character,
    p_persona_inquiry_id character varying,
    p_persona_status character varying,
    p_was_set_manually boolean,
    p_personal_number character varying DEFAULT NULL,
    p_expiry_date character varying DEFAULT NULL,
    p_document_address text DEFAULT NULL,
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
    -- Call base function first to handle core verification logic
    PERFORM sec_cust.sp_request_level_one_persona(
        p_date_birth,
        p_email_user,
        p_doc_type,
        p_iso_doc_country,
        p_doc_number,
        p_doc_path,
        p_selfie_path,
        p_gender,
        p_iso_nationality_country,
        p_persona_inquiry_id,
        p_persona_status,
        p_was_set_manually
    );

    -- Get user information for extra data storage
    SELECT * INTO v_current_full_user
    FROM sec_cust.ms_sixmap_users AS us
    WHERE us.email_user = p_email_user;

    -- Get item IDs for all Persona document data fields
    SELECT id_item INTO v_item_personal_number_id
    FROM sec_cust.ms_item
    WHERE name = 'persona_document_personal_number';

    SELECT id_item INTO v_item_expiry_date_id
    FROM sec_cust.ms_item
    WHERE name = 'persona_document_expiry_date';

    SELECT id_item INTO v_item_address_id
    FROM sec_cust.ms_item
    WHERE name = 'persona_document_address';

    SELECT id_item INTO v_item_document_type_id
    FROM sec_cust.ms_item
    WHERE name = 'persona_document_type';

    SELECT id_item INTO v_item_document_number_id
    FROM sec_cust.ms_item
    WHERE name = 'persona_document_number';

    -- Store additional Persona document data if provided (UPSERT pattern: DELETE + INSERT)
    IF p_personal_number IS NOT NULL AND v_item_personal_number_id IS NOT NULL THEN
        DELETE FROM sec_cust.lnk_users_extra_data
        WHERE id_user = v_current_full_user.id_user
        AND id_item = v_item_personal_number_id;

        INSERT INTO sec_cust.lnk_users_extra_data (id_user, id_item, value, edited)
        VALUES (v_current_full_user.id_user, v_item_personal_number_id, p_personal_number, false);
    END IF;

    IF p_expiry_date IS NOT NULL AND v_item_expiry_date_id IS NOT NULL THEN
        DELETE FROM sec_cust.lnk_users_extra_data
        WHERE id_user = v_current_full_user.id_user
        AND id_item = v_item_expiry_date_id;

        INSERT INTO sec_cust.lnk_users_extra_data (id_user, id_item, value, edited)
        VALUES (v_current_full_user.id_user, v_item_expiry_date_id, p_expiry_date, false);
    END IF;

    IF p_document_address IS NOT NULL AND v_item_address_id IS NOT NULL THEN
        DELETE FROM sec_cust.lnk_users_extra_data
        WHERE id_user = v_current_full_user.id_user
        AND id_item = v_item_address_id;

        INSERT INTO sec_cust.lnk_users_extra_data (id_user, id_item, value, edited)
        VALUES (v_current_full_user.id_user, v_item_address_id, p_document_address, false);
    END IF;

    IF p_document_type IS NOT NULL AND v_item_document_type_id IS NOT NULL THEN
        DELETE FROM sec_cust.lnk_users_extra_data
        WHERE id_user = v_current_full_user.id_user
        AND id_item = v_item_document_type_id;

        INSERT INTO sec_cust.lnk_users_extra_data (id_user, id_item, value, edited)
        VALUES (v_current_full_user.id_user, v_item_document_type_id, p_document_type, false);
    END IF;

    IF p_document_number IS NOT NULL AND v_item_document_number_id IS NOT NULL THEN
        DELETE FROM sec_cust.lnk_users_extra_data
        WHERE id_user = v_current_full_user.id_user
        AND id_item = v_item_document_number_id;

        INSERT INTO sec_cust.lnk_users_extra_data (id_user, id_item, value, edited)
        VALUES (v_current_full_user.id_user, v_item_document_number_id, p_document_number, false);
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the original Persona processing
        RAISE WARNING 'Error storing enhanced Persona document data for user %: %', p_email_user, SQLERRM;
END;
$function$;


-- ============================================================================
-- INSERT ITEM RECORDS FOR PERSONA EXTRA DATA
-- ============================================================================
-- These items are used to store Persona-specific document data in lnk_users_extra_data

INSERT INTO sec_cust.ms_item (name, description, type_item, active)
VALUES 
    ('persona_document_personal_number', 'Personal number from Persona document verification', 'text', true),
    ('persona_document_expiry_date', 'Expiry date from Persona document verification', 'text', true),
    ('persona_document_address', 'Address from Persona document verification', 'text', true),
    ('persona_document_type', 'Document type from Persona verification', 'text', true),
    ('persona_document_number', 'Document number from Persona verification', 'text', true)
ON CONFLICT (name) DO NOTHING;
