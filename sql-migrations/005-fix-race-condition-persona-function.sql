-- Migration: Fix race condition in Persona verification function
-- Issue: Multiple webhooks arriving simultaneously cause duplicate is_the_last_one = TRUE records
-- Root Cause: RACE CONDITION
--   Timeline:
--   - Webhook A arrives: Checks if persona_inquiry_id exists → NO
--   - Webhook B arrives: Checks if persona_inquiry_id exists → NO (before A inserts)
--   - Webhook A: UPDATE sets old records to FALSE
--   - Webhook B: UPDATE sets old records to FALSE
--   - Webhook A: INSERT new record with is_the_last_one = TRUE
--   - Webhook B: INSERT new record with is_the_last_one = TRUE
--   - Result: TWO records with is_the_last_one = TRUE for same user+level
-- Solution: Add row-level locking (FOR UPDATE) to prevent concurrent modifications
-- Date: 2026-01-07
-- Author: Coingroup Expert System

-- ============================================================================
-- FIX: Add FOR UPDATE lock to prevent race conditions
-- ============================================================================

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
    
    -- ✅ FIX: Lock the user's row to prevent race conditions
    -- This ensures only ONE transaction can modify this user's data at a time
    -- FOR UPDATE locks the row until the transaction commits
    SELECT * INTO v_current_full_user
    FROM sec_cust.ms_sixmap_users AS us
    WHERE us.email_user = p_email_user
    FOR UPDATE;  -- 🔒 ROW-LEVEL LOCK prevents concurrent modifications

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
        -- ✅ This is now safe from race condition because we hold the user's row lock
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
                    else null  -- Set to null for PENDING status
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
                    else null  -- Set to null for PENDING status
                end
            )
            where persona_inquiry_id = p_persona_inquiry_id;

            -- Update sixmap user
            UPDATE sec_cust.ms_sixmap_users
            SET verif_level_apb = (
                case
                    when p_persona_status = 'SUCCESS' then true
                    when p_persona_status = 'ERROR' or p_persona_status = 'VERIFICATION_ERROR' then false
                    else null  -- Set to null for PENDING status
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
-- VERIFICATION
-- ============================================================================
SELECT 'Migration 005 completed: Added FOR UPDATE lock to prevent race condition in sp_request_level_one_persona()' as status;
