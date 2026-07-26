-- Migration 011: Sync user legal names from approved Persona verification
--
-- When a Persona webhook arrives with final status SUCCESS (approval), the
-- user's names in priv.ms_sixmap_users are replaced with the names verified
-- by Persona (extracted from the webhook JSON the SP already receives).
-- The names the user typed manually at registration are preserved ONCE
-- (first approval only) in sec_cust.lnk_users_extra_data under the new
-- catalog item 'persona_original_registered_name' (category: Persona
-- Information), as a JSON snapshot of the four name columns.
--
-- Verified against real stored webhooks (item persona_webhook_full_json):
-- names live at data.attributes.payload.data.attributes.fields.name_first.value
-- (snake_case, {type,value} wrapper); name_last carries BOTH surnames
-- (e.g. "ORDAZ MOLINA"), so it maps whole into last_name and
-- second_last_name is set to NULL. Fallback paths (kebab-case fields and
-- included[] government-id attributes) are kept for older/other formats.
--
-- Apply to BOTH new-cluster DBs: PRODUC-CG (Europe) and LPRODUC-CG (Latam).
-- Signature of the 18-arg SP is unchanged: no backend code changes needed.

-- 1) New catalog item (idempotent)
INSERT INTO sec_cust.ms_item (name, description, id_category)
SELECT 'persona_original_registered_name',
       'User''s original registered names (JSON: first_name, second_name, last_name, second_last_name) preserved before Persona verification name sync',
       (SELECT id_category FROM sec_cust.ms_category WHERE value = 'persona_information')
WHERE NOT EXISTS (
    SELECT 1 FROM sec_cust.ms_item WHERE name = 'persona_original_registered_name'
);

-- 2) Enhanced SP: same 18-arg signature + name sync on SUCCESS
CREATE OR REPLACE FUNCTION sec_cust.sp_request_level_one_persona_enhanced(p_date_birth timestamp with time zone, p_email_user character varying, p_doc_type integer, p_iso_doc_country character varying, p_doc_number character varying, p_doc_path character varying, p_selfie_path character varying, p_gender character, p_iso_nationality_country character, p_persona_inquiry_id character varying, p_persona_status character varying, p_was_set_manually boolean, p_personal_number character varying DEFAULT NULL::character varying, p_expiry_date character varying DEFAULT NULL::character varying, p_document_address text DEFAULT NULL::text, p_document_type character varying DEFAULT NULL::character varying, p_document_number character varying DEFAULT NULL::character varying, p_webhook_full_json text DEFAULT NULL::text)
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
    v_item_webhook_full_json_id integer;
    v_item_original_name_id integer;
    v_payload jsonb;
    v_name_first character varying;
    v_name_middle character varying;
    v_name_last character varying;
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

    SELECT id_item INTO v_item_webhook_full_json_id
    FROM sec_cust.ms_item
    WHERE name = 'persona_webhook_full_json';

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

    IF p_webhook_full_json IS NOT NULL AND v_item_webhook_full_json_id IS NOT NULL THEN
        DELETE FROM sec_cust.lnk_users_extra_data
        WHERE id_user = v_current_full_user.id_user
        AND id_item = v_item_webhook_full_json_id;

        INSERT INTO sec_cust.lnk_users_extra_data (id_user, id_item, value, edited)
        VALUES (v_current_full_user.id_user, v_item_webhook_full_json_id, p_webhook_full_json, false);
    END IF;

    -- Sync user's legal names from the approved Persona verification.
    -- The original registered names are preserved once (first approval only)
    -- under item 'persona_original_registered_name'.
    IF p_persona_status = 'SUCCESS' AND p_webhook_full_json IS NOT NULL
       AND v_current_full_user.id_user IS NOT NULL THEN
        BEGIN
            v_payload := p_webhook_full_json::jsonb;

            -- Current format: inquiry fields as {type, value} (snake_case)
            v_name_first  := v_payload#>>'{data,attributes,payload,data,attributes,fields,name_first,value}';
            v_name_middle := v_payload#>>'{data,attributes,payload,data,attributes,fields,name_middle,value}';
            v_name_last   := v_payload#>>'{data,attributes,payload,data,attributes,fields,name_last,value}';

            -- Fallback: kebab-case field names
            IF v_name_first IS NULL OR v_name_last IS NULL THEN
                v_name_first  := coalesce(v_name_first,  v_payload#>>'{data,attributes,payload,data,attributes,fields,name-first,value}');
                v_name_middle := coalesce(v_name_middle, v_payload#>>'{data,attributes,payload,data,attributes,fields,name-middle,value}');
                v_name_last   := coalesce(v_name_last,   v_payload#>>'{data,attributes,payload,data,attributes,fields,name-last,value}');
            END IF;

            -- Fallback: government-id document attributes in included[]
            IF v_name_first IS NULL OR v_name_last IS NULL THEN
                SELECT coalesce(v_name_first,  elem->'attributes'->>'name-first'),
                       coalesce(v_name_middle, elem->'attributes'->>'name-middle'),
                       coalesce(v_name_last,   elem->'attributes'->>'name-last')
                  INTO v_name_first, v_name_middle, v_name_last
                FROM jsonb_array_elements(coalesce(v_payload#>'{data,attributes,payload,included}', '[]'::jsonb)) elem
                WHERE elem->>'type' = 'document/government-id'
                  AND elem->'attributes'->>'name-first' IS NOT NULL
                LIMIT 1;
            END IF;

            v_name_first  := nullif(nullif(btrim(v_name_first), ''), 'null');
            v_name_middle := nullif(nullif(btrim(v_name_middle), ''), 'null');
            v_name_last   := nullif(nullif(btrim(v_name_last), ''), 'null');

            -- Only sync when Persona actually provided the required names
            -- (first_name and last_name are NOT NULL in priv.ms_sixmap_users)
            IF v_name_first IS NOT NULL AND v_name_last IS NOT NULL THEN
                SELECT id_item INTO v_item_original_name_id
                FROM sec_cust.ms_item
                WHERE name = 'persona_original_registered_name';

                -- Preserve the FIRST (manually registered) names forever:
                -- insert only if no snapshot exists yet for this user
                IF v_item_original_name_id IS NOT NULL AND NOT EXISTS (
                    SELECT 1 FROM sec_cust.lnk_users_extra_data
                    WHERE id_user = v_current_full_user.id_user
                      AND id_item = v_item_original_name_id
                ) THEN
                    INSERT INTO sec_cust.lnk_users_extra_data (id_user, id_item, value, edited)
                    SELECT v_current_full_user.id_user,
                           v_item_original_name_id,
                           json_build_object(
                               'first_name', pv.first_name,
                               'second_name', pv.second_name,
                               'last_name', pv.last_name,
                               'second_last_name', pv.second_last_name,
                               'saved_at', now()
                           )::text,
                           false
                    FROM priv.ms_sixmap_users pv
                    WHERE pv.id_user_priv = v_current_full_user.id_user_priv;
                END IF;

                -- Replace names with the Persona-verified ones. name_last
                -- carries both surnames, so second_last_name is cleared to
                -- avoid mixing old and new name parts.
                UPDATE priv.ms_sixmap_users
                SET first_name = v_name_first,
                    second_name = v_name_middle,
                    last_name = v_name_last,
                    second_last_name = NULL
                WHERE id_user_priv = v_current_full_user.id_user_priv;

                RAISE NOTICE 'Persona name sync applied for user %', p_email_user;
            END IF;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE WARNING 'Error syncing Persona names for user %: %', p_email_user, SQLERRM;
        END;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the original Persona processing
        RAISE WARNING 'Error storing enhanced Persona document data for user %: %', p_email_user, SQLERRM;
END;
$function$;
