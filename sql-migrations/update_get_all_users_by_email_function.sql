-- Migration: Update get_all_users_by_email function to include persona_inquiry_id
-- Purpose: Add persona_inquiry_id to the return type and SELECT statement
-- Database: PRE-QA-CG
-- Schema: sec_cust

-- Step 1: Drop and recreate the function with the new field
DROP FUNCTION IF EXISTS sec_cust.get_all_users_by_email(character varying);

CREATE OR REPLACE FUNCTION sec_cust.get_all_users_by_email(_email_user character varying)
 RETURNS TABLE(
    id_uuid uuid, 
    id_user bigint, 
    first_name character varying, 
    second_name character varying, 
    last_name character varying, 
    second_last_name character varying, 
    username character varying, 
    email_user character varying, 
    password text, 
    last_session_reg character varying, 
    last_ip_reg character varying, 
    last_ip_city_reg character varying, 
    last_id_log_reg integer, 
    date_last_conn timestamp with time zone, 
    gender character, 
    date_birth timestamp with time zone, 
    ident_doc_number character varying, 
    main_phone character varying, 
    second_phone character varying, 
    delegated_phone character varying, 
    resid_city text, 
    user_active boolean, 
    user_blocked boolean, 
    uuid_profile uuid, 
    id_service integer, 
    id_services_utype integer, 
    id_ident_doc_type integer, 
    id_resid_country integer, 
    id_nationality_country integer, 
    name_profile character varying, 
    name_service character varying, 
    name_services_utype character varying, 
    name_ident_doc_type character varying, 
    name_resid_country character varying, 
    name_nationality_country character varying, 
    address text, 
    cust_cr_cod_pub character varying, 
    cod_rank character varying, 
    referral_node text, 
    main_sn_platf text, 
    user_main_sn_platf text, 
    date_legacy_reg timestamp with time zone, 
    id_verif_level integer, 
    verif_level_apb boolean, 
    state_name text, 
    iso_code_resid_country character varying, 
    iso_code_nationality_country character varying, 
    wallets json, 
    wholesale_partner_info json, 
    ok_legal_terms boolean, 
    truthful_information boolean, 
    lawful_funds boolean, 
    main_phone_code character varying, 
    main_phone_full character varying, 
    doc_type_name_country character varying, 
    id_migrated bigint, 
    country_exception boolean, 
    phone_exception boolean, 
    limit_exception boolean, 
    multi_currency_exception boolean, 
    completed_information_migrated boolean, 
    extra_info json, 
    last_remittances json, 
    pre_remittances json, 
    current_rate jsonb, 
    frequent_beneficiaries json, 
    notifications json, 
    limits json, 
    limits_by_country json, 
    full_rates jsonb, 
    show_verification_modal boolean,
    persona_inquiry_id character varying  -- NEW FIELD ADDED
)
 LANGUAGE plpgsql
AS $function$
BEGIN
    raise notice 'Estoy en la obtencion de datos del login';
    RETURN QUERY
    SELECT
        US.uuid_user,
        us.id_user,
        UP.first_name,
        UP.second_name,
        UP.last_name,
        UP.second_last_name,
        US.username,
        US.email_user,
        US.password,
        US.last_session_reg,
        US.last_ip_reg,
        US.last_ip_city_reg,
        US.last_id_log_reg,
        US.date_last_conn,
        US.gender,
        US.date_birth,
        US.ident_doc_number,
        US.main_phone,
        US.second_phone,
        US.delegated_phone,
        US.resid_city,
        US.user_active,
        US.user_blocked,
        US.uuid_profile,
        US.id_service,
        US.id_services_utype,
        US.id_ident_doc_type,
        US.id_resid_country,
        US.id_nationality_country,
        PRO.name_profile,
        SERV.tx_service,
        UTYPE.name_utype,
        (SELECT DT.name_doc_type
         FROM sec_cust.ms_doc_type AS DT
         WHERE DT.id_ident_doc_type = US.id_ident_doc_type) AS name_doc_type,
        C.name_country,
        (SELECT IPC.country_name
         FROM sec_emp.ms_ip_countries AS IPC
         WHERE IPC.id_ip_country = US.id_nationality_country) AS country_name,
        US.address,
        US.cust_cr_cod_pub,
        US.cod_rank,
        US.referral_node,
        US.main_sn_platf,
        US.user_main_sn_platf,
        US.date_legacy_reg,
        US.id_verif_level,
        US.verif_level_apb,
        (SELECT elem->>'req_type_value' as state_name
        FROM sec_cust.lnk_users_verif_level AS VL2,
            jsonb_array_elements(VL2.level_req) elem
        WHERE VL2.id_vl = 1
        AND elem->>'req_type' = 'state_name'
        AND VL2.uuid_user = US.uuid_user
        AND VL2.is_the_last_one IS TRUE) AS state_name,
        C.country_iso_code,
        (SELECT IPC.country_iso_code
         FROM sec_emp.ms_ip_countries AS IPC
         WHERE IPC.id_ip_country = US.id_nationality_country) AS country_iso_code,
        json_build_object(
                            'USDT', (SELECT W.number
                                    FROM sec_cust.ms_wallets AS W
                                    WHERE W.id_user = US.id_user
                                    AND W.is_main = TRUE
                                    AND W.id_network = 1),
                            'BTC', (SELECT W.number
                                    FROM sec_cust.ms_wallets AS W
                                    WHERE W.id_user = US.id_user
                                    AND W.is_main = TRUE
                                    AND W.id_network = 2)
                        ) AS wallets,
                        CASE
                            WHEN US.id_wholesale_partner IS NOT NULL
                            THEN	(SELECT json_agg(T.*)
                                    FROM (SELECT WP.*
                                            FROM sec_cust.ms_wholesale_partners_info AS WP
                                            WHERE WP.email_user = (SELECT U2.email_user
                                                                    FROM sec_cust.ms_sixmap_users AS U2
                                                                    WHERE U2.id_user = US.id_wholesale_partner)) AS T)->0
                            WHEN US.id_wholesale_partner IS NULL
                            THEN	(SELECT json_agg(T.*)
                                    FROM (SELECT WP.*
                                            FROM sec_cust.ms_wholesale_partners_info AS WP
                                            WHERE WP.email_user = US.email_user) AS T)->0
                        END wholesale_partner_info,
        US.ok_legal_terms,
        US.truthful_information,
        US.lawful_funds,
        (SELECT P.code
         FROM sec_cust.ms_phone AS P
         WHERE P.uuid_user = US.uuid_user
         ORDER BY P.date_creation desc
         LIMIT 1) AS main_phone_code,
        (SELECT P.full_number
         FROM sec_cust.ms_phone AS P
         WHERE P.uuid_user = US.uuid_user
         ORDER BY P.date_creation desc
         LIMIT 1) AS main_phone_full,
        (SELECT DT.name_country
         FROM sec_cust.ms_doc_type AS DT
         WHERE DT.id_ident_doc_type = US.id_ident_doc_type) AS doc_type_name_country,
        US.id_migrated,
        US.phone_exception,
        US.country_exception,
        US.limit_exception,
        US.multi_currency_exception,
        US.completed_information_migrated,
        sec_cust.sp_get_user_extra_info(us.id_user),
        sec_cust.sp_get_last_remittances_by_user(US.email_user, 4, null, null, null, false),
        sec_cust.get_pre_remittance_by_user(US.email_user),
        sec_cust.sp_ms_cr_rate_get_valid(US.id_resid_country, US.id_resid_country, 1, 1, US.email_user),
        (SELECT json_agg(row_to_json(FB))
        FROM prc_mng.sp_ms_frequents_beneficiaries_get_all(US.email_user) AS FB),
        sec_cust.v_notifications(US.email_user),
        sec_cust.get_limitations_by_user(US.cust_cr_cod_pub),
        sec_cust.get_limitations_by_country(US.id_resid_country),
        (sec_cust.sp_get_full_rates(
            US.id_resid_country,
            (SELECT cur.id_currency FROM sec_cust.ms_currencies cur WHERE cur.id_country = US.id_resid_country),
            1,
            1,
            US.email_user)),
        US.show_verification_modal,
        US.persona_inquiry_id  -- NEW FIELD ADDED IN SELECT
    FROM sec_cust.ms_profiles AS PRO,
        priv.ms_sixmap_userS AS UP,
        sec_cust.ms_sixmap_services AS SERV,
        sec_cust.ms_sixmap_services_utype AS UTYPE,
        sec_emp.MS_COUNTRIES AS C,
        sec_cust.ms_sixmap_userS AS US
    WHERE US.uuid_profile = PRO.uuid_profile
    AND US.id_user_priv = UP.id_user_priv
    AND SERV.id_service = US.id_service
    AND UTYPE.id_services_utype = US.id_services_utype
    AND C.id_country = US.id_resid_country
    AND (
            (US.user_active = true AND US.user_blocked = true)
            OR
            (US.user_active = true AND US.user_blocked = false)
            OR
            (US.user_active = false AND US.user_blocked = true)
        )
    AND US.email_user = _email_user;
END;
$function$;

-- Verify the function was updated successfully
SELECT 'Function updated successfully. The get_all_users_by_email function now returns persona_inquiry_id.' as status;
