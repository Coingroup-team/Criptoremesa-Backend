# SIXMAP - Complete Database Analysis

**Generated:** 2025-08-06T17:01:40.943Z

## 📊 Database Overview

| Component | Count |
|-----------|-------|
| Tables | 305 |
| Views | 49 |
| Functions | 804 |
| Procedures | 0 |
| Triggers | 5418 |
| Sequences | 192 |
| Custom Types | 449 |
| Rules | 0 |
| Indexes | 242 |

## 📝 Business Logic Functions & Procedures

### PL/pgSQL Functions (681)

#### msg_app.get_atc_number_by_id_resid_country
- **Type:** function
- **Arguments:** `id integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.get_atc_number_by_id_resid_country(id integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					res JSON;
				BEGIN
					SELECT json_agg(P.atc_phone) INTO res
					FROM  msg_app.ms_whatsapp_atc_phones AS p
					WHERE P.id_country = id;

					RETURN res;
				END;
$function$

```

#### msg_app.get_loyalty_level_value
- **Type:** function
- **Arguments:** `p_id_loyalty_level integer`
- **Returns:** `character varying`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.get_loyalty_level_value(p_id_loyalty_level integer)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
declare
    v_loyalty_level_name            varchar;
begin
    select loy.level into v_loyalty_level_name
    from sec_cust.loyalty_levels loy
    where loy.id_loyalty = p_id_loyalty_level;
    case
        when v_loyalty_level_name is not null then
            return v_loyalty_level_name;
        else
            return 'Cliente Regular';
    end case...
```

#### msg_app.get_risk_level_value
- **Type:** function
- **Arguments:** `p_id_risk_level integer`
- **Returns:** `character varying`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.get_risk_level_value(p_id_risk_level integer)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
declare
    v_risk_level_name               varchar;
begin
    select ris.level into v_risk_level_name
    from sec_cust.risk_levels ris
    where ris.id_risk = p_id_risk_level;
    case
        when v_risk_level_name is not null then
            return v_risk_level_name;
        else
            return 'Bajo';
    end case;
end;
$function$

```

#### msg_app.sp_app_msg_insert
- **Type:** function
- **Arguments:** `_email_user character varying, emp_username character varying, message_body json, file_route character varying, msg_date timestamp with time zone, is_sent boolean, _uniq_id character varying, _time_zone character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_app_msg_insert(_email_user character varying, emp_username character varying, message_body json, file_route character varying, msg_date timestamp with time zone, is_sent boolean, _uniq_id character varying, _time_zone character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
				v_id_chat                   bigint;
				v_msg_action                varchar;
				v_date_epoch            	bigint;
				uuid_user_cust            	uuid;
				v_id_msg    ...
```

#### msg_app.sp_app_msg_insert_auto
- **Type:** function
- **Arguments:** `_email_user character varying, _uniq_id character varying, _id_chat bigint, message_body json, msg_date timestamp with time zone, is_sent boolean, chat_type character varying`
- **Returns:** `boolean`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_app_msg_insert_auto(_email_user character varying, _uniq_id character varying, _id_chat bigint, message_body json, msg_date timestamp with time zone, is_sent boolean, chat_type character varying)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
declare
				v_id_chat                   bigint;
				v_date_epoch            	bigint;
				uuid_user_cust            	uuid;
				v_id_msg                    bigint;
				v_id_whatsapp_json          bigint;
				socket_chan...
```

#### msg_app.sp_chat_get_last_msg_date
- **Type:** function
- **Arguments:** `p_id_chat bigint`
- **Returns:** `bigint`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_chat_get_last_msg_date(p_id_chat bigint)
 RETURNS bigint
 LANGUAGE plpgsql
AS $function$
declare
    v_epoch_msg                     bigint;
begin
    select epoch_whatsapp into v_epoch_msg from msg_app.lnk_atc_whatsapp_msgs
    where id_chat = p_id_chat
    and msg_action != 'notification'
    order by date_whatsapp desc
    limit 1;
    return v_epoch_msg;
end;
$function$

```

#### msg_app.sp_chat_get_last_msg_id
- **Type:** function
- **Arguments:** `p_id_chat bigint`
- **Returns:** `bigint`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_chat_get_last_msg_id(p_id_chat bigint)
 RETURNS bigint
 LANGUAGE plpgsql
AS $function$
declare
				v_id_msg                    bigint;
			begin
				select id_whatsapp_msg into v_id_msg from msg_app.lnk_atc_whatsapp_msgs
				where id_chat = p_id_chat
				order by date_whatsapp desc
				limit 1;
				return v_id_msg;
			end;
$function$

```

#### msg_app.sp_chat_get_last_msg_json
- **Type:** function
- **Arguments:** `p_id_chat bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_chat_get_last_msg_json(p_id_chat bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_json_msg                      json;
begin
    select js.json_body into v_json_msg from msg_app.lnk_atc_whatsapp_msgs msg
    inner join msg_app.ms_whatsapp_msg_json js on msg.id_whatsapp_msg = js.id_whatsapp_msg
    where msg.id_chat = p_id_chat
    order by date_whatsapp desc
    limit 1;
    return v_json_msg;
end;
$function$

```

#### msg_app.sp_chat_msgs_get
- **Type:** function
- **Arguments:** `p_id_chat bigint, p_id_delimeter bigint, p_id_type_date boolean, p_prev_msg boolean`
- **Returns:** `TABLE(id_msg bigint, action character varying, id_chat bigint, date bigint, msg json, username_atc character varying, customer_name character varying, customer_last_name character varying, atc_user_name character varying, atc_user_lastname character varying, conn integer, notification character varying, profile character varying, attached_file character varying, mode character varying, message_today boolean)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_chat_msgs_get(p_id_chat bigint, p_id_delimeter bigint, p_id_type_date boolean, p_prev_msg boolean)
 RETURNS TABLE(id_msg bigint, action character varying, id_chat bigint, date bigint, msg json, username_atc character varying, customer_name character varying, customer_last_name character varying, atc_user_name character varying, atc_user_lastname character varying, conn integer, notification character varying, profile character varying, attached_file characte...
```

#### msg_app.sp_chat_msgs_get_by_email
- **Type:** function
- **Arguments:** `_email_user character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_chat_msgs_get_by_email(_email_user character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				_fake_name           		varchar(100);
				messages					json;
				resp_obj					json;
				BEGIN
                    raise notice 'EEEEEEEEEEEEEEMAAAAAAAAAAAAAAAAAAAAIIIIIIL: %', _email_user;

					SELECT UEL.fake_name INTO _fake_name
					FROM sec_cust.ms_sixmap_users UCL, sec_emp.ms_sixmap_users UEL, msg_app.ms_chats_whatsapp C, prc_mng.lnk_user_cons...
```

#### msg_app.sp_chat_msgs_get_by_uniq_id
- **Type:** function
- **Arguments:** `_uniq_id character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_chat_msgs_get_by_uniq_id(_uniq_id character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				_fake_name           		varchar(100);
				messages					json;
				resp_obj					json;
				BEGIN
					SELECT UEL.fake_name INTO _fake_name
					FROM sec_emp.ms_sixmap_users UEL, msg_app.ms_chats_whatsapp C, prc_mng.lnk_user_consult UC, prc_mng.ms_user_process_asings P
					WHERE UEL.uuid_user = P.uuid_sixmap_user_asing
					AND P.id_consult = UC.id_cons...
```

#### msg_app.sp_get_chat_rates
- **Type:** function
- **Arguments:** `p_id_origin_country integer, p_id_origin_currency integer, p_id_destiny_country integer, p_id_destiny_currency integer, p_client_email character varying`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_get_chat_rates(p_id_origin_country integer, p_id_origin_currency integer, p_id_destiny_country integer, p_id_destiny_currency integer, p_client_email character varying)
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
				v_promo_rates                   json;
				v_promo_rate_info               json;
				v_promo_rate                    float;
				v_manual_rates                  json;
				v_json_rate                     json;
				v_rates               ...
```

#### msg_app.sp_get_doc_types
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE(id integer, name character varying, country character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_get_doc_types()
 RETURNS TABLE(id integer, name character varying, country character varying)
 LANGUAGE plpgsql
AS $function$
begin
				return query
					select
						d.id_ident_doc_type::int, d.name_doc_type, d.name_country
					from sec_cust.ms_doc_type d;
			end;
$function$

```

#### msg_app.sp_get_headers_counters
- **Type:** function
- **Arguments:** `p_username character varying, p_op_header character varying, p_init_date bigint, p_close_date bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_get_headers_counters(p_username character varying, p_op_header character varying, p_init_date bigint, p_close_date bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
				v_register_consult          record;
				v_register_remittance       record;
				v_consults_rows             cursor for
					select c.*, p.id_country, u.username from
					prc_mng.lnk_user_consult c
					inner join prc_mng.ms_user_process_asings a on a.id_consult = c.id_consult
			...
```

#### msg_app.sp_get_last_remittance_open_date
- **Type:** function
- **Arguments:** `p_id_user bigint`
- **Returns:** `bigint`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_get_last_remittance_open_date(p_id_user bigint)
 RETURNS bigint
 LANGUAGE plpgsql
AS $function$
declare
				v_open_date                     bigint;
			begin
				if (exists(
					select * from prc_mng.lnk_cr_remittances re
					where re.id_client = p_id_user
					and re.date_closed is null
				)) then
					select extract(epoch from min(re.date_created))::bigint
					into v_open_date
					from prc_mng.lnk_cr_remittances re
					where re.id_client = p_id_user
	...
```

#### msg_app.sp_get_range_rates
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_get_range_rates()
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
				v_json_return               json;
			begin
				select sec_cust.v_range_rates() into v_json_return;
				return v_json_return;
			end;
$function$

```

#### msg_app.sp_get_user_level
- **Type:** function
- **Arguments:** `p_level character varying`
- **Returns:** `integer`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_get_user_level(p_level character varying)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
begin
				if (p_level = 'Oro') then
					return 3;
				elsif (p_level = 'Plata') then
					return 2;
				elsif (p_level is null) then
					return null;
				else
					return 1;
				end if;
			end;
$function$

```

#### msg_app.sp_get_user_profile
- **Type:** function
- **Arguments:** `p_id_chat bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_get_user_profile(p_id_chat bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_json_resp                     json;
begin
    select json_build_object(
        'name', concat(ch.customer_name, ' ', ch.customer_last_name),
        'crId', customer_public_cod,
        'phone', customer_phone,
        'email', ch.customer_email,
        'idCountry', cou.id_country,
        'country', cou.viewing_name,
        'countryCode', cou.country_iso_code,
...
```

#### msg_app.sp_get_user_status
- **Type:** function
- **Arguments:** `p_id_customer bigint`
- **Returns:** `character varying`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_get_user_status(p_id_customer bigint)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
declare
    v_seconds_by_day                bigint;
    v_last_remittance_date          bigint;
    v_time_since_last_remittance    bigint;
begin
    v_seconds_by_day := 86400;
    if (p_id_customer is not null) then
        select extract(epoch from rem.date_created)::bigint into v_last_remittance_date
        from prc_mng.lnk_cr_remittances rem
        where re...
```

#### msg_app.sp_get_user_type
- **Type:** function
- **Arguments:** `p_id_customer bigint`
- **Returns:** `character varying`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_get_user_type(p_id_customer bigint)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
declare
    v_type_name                 varchar;
begin
    select pro.name_profile into v_type_name
    from sec_cust.ms_sixmap_users cust
    inner join sec_cust.ms_profiles pro on cust.uuid_profile = pro.uuid_profile
    where cust.id_user = p_id_customer;
    return v_type_name;
end;
$function$

```

#### msg_app.sp_lnk_atc_whatsapp_msgs_get_date_by_id
- **Type:** function
- **Arguments:** `p_id_msg bigint`
- **Returns:** `bigint`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_lnk_atc_whatsapp_msgs_get_date_by_id(p_id_msg bigint)
 RETURNS bigint
 LANGUAGE plpgsql
AS $function$
declare
				v_date_msg                  bigint;
			begin
				select m.epoch_msg into v_date_msg
				from msg_app.v_msg m
				where m.id = p_id_msg;
				return v_date_msg;
			end;
$function$

```

#### msg_app.sp_lnk_atc_whatsapp_msgs_get_notification_content
- **Type:** function
- **Arguments:** `p_id_msg bigint`
- **Returns:** `character varying`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_lnk_atc_whatsapp_msgs_get_notification_content(p_id_msg bigint)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
declare
				v_notf_content              varchar(200);
			begin
				select e.description into v_notf_content
				from msg_app.ms_chat_events e
				where e.id_msg = p_id_msg;
				return v_notf_content;
			end;
$function$

```

#### msg_app.sp_lnk_consult_user_time_between
- **Type:** function
- **Arguments:** `p_id_chat bigint, p_init_date timestamp with time zone, p_end_date timestamp with time zone`
- **Returns:** `boolean`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_lnk_consult_user_time_between(p_id_chat bigint, p_init_date timestamp with time zone, p_end_date timestamp with time zone)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
declare
				v_result                    boolean;
			begin
				select count(*) > 0 into v_result
				from prc_mng.lnk_user_consult co
				where co.id_chat = id_chat
				and (
					p_init_date between co.date_created and co.date_close
					or p_end_date between co.date_created and co.date_cl...
```

#### msg_app.sp_lnk_cr_remittances_init
- **Type:** function
- **Arguments:** `p_remittance_body json`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_lnk_cr_remittances_init(p_remittance_body json)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_id_chat                           bigint;
    v_notepad                           json;
    v_id_origin_country                 int;
    v_id_origin_currency                int;
    v_id_origin_bank                    int;
    v_id_account_origin                 int;
    v_json_third_party_trans            json;
    v_captures                 ...
```

#### msg_app.sp_lnk_default_msgs_get
- **Type:** function
- **Arguments:** `p_id_country integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_lnk_default_msgs_get(p_id_country integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
begin
				return json_build_object(
					'rule', msg_app.sp_lnk_default_msgs_get_by_type_and_country(p_id_country,msg_app.sp_ms_default_msg_types_get_id_by_name('rule')),
					'schedule', msg_app.sp_lnk_default_msgs_get_by_type_and_country(p_id_country,msg_app.sp_ms_default_msg_types_get_id_by_name('schedule')),
					'greeting', msg_app.sp_lnk_default_msgs_get_by_type_an...
```

#### msg_app.sp_lnk_default_msgs_get_by_type_and_country
- **Type:** function
- **Arguments:** `p_id_country integer, p_id_type integer`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_lnk_default_msgs_get_by_type_and_country(p_id_country integer, p_id_type integer)
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
				v_json_resp                 json[];
			begin
				select array(
					select json_build_object(
						'idMsg', m.id_default_msg,
						'title', m.msg_title,
						'content', m.msg_text
					)
					from msg_app.lnk_default_msgs m
					where m.id_country = p_id_country
					and m.id_default_type = p_id_type
					and m.acti...
```

#### msg_app.sp_lnk_default_msgs_update
- **Type:** function
- **Arguments:** `p_id_msg bigint, p_new_content text`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_lnk_default_msgs_update(p_id_msg bigint, p_new_content text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
				update msg_app.lnk_default_msgs
				set msg_text = p_new_content
				where id_default_msg = p_id_msg
				and active is true;
			end;
$function$

```

#### msg_app.sp_ms_atc_phones_get
- **Type:** function
- **Arguments:** `cant integer`
- **Returns:** `TABLE(id bigint, phone character varying, country character varying, credential character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_atc_phones_get(cant integer)
 RETURNS TABLE(id bigint, phone character varying, country character varying, credential character varying)
 LANGUAGE plpgsql
AS $function$
begin
				if (cant is null) then
					return query
						select p.id_phone, p.phone, p.country, p.credential::varchar from msg_app.v_phones_with_country p;
				else
					return query
						select p.id_phone, p.phone, p.country, p.credential::varchar from msg_app.v_phones_with_country p
			...
```

#### msg_app.sp_ms_atc_phones_insert
- **Type:** function
- **Arguments:** `phone character varying, country character varying, json_credentials json, is_active boolean`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_atc_phones_insert(phone character varying, country character varying, json_credentials json, is_active boolean)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
				v_country_id                integer;
			begin
				if (phone is null or country is null or is_active is null) then
					raise exception 'Phone, country and is_active cannot be null';
				else
					select m.id_country into v_country_id from sec_emp.ms_countries m
					where m.name_country =...
```

#### msg_app.sp_ms_atc_phones_update_credential
- **Type:** function
- **Arguments:** `phone character varying, credential json`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_atc_phones_update_credential(phone character varying, credential json)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
				if (phone is not null and credential is not null) then
					update msg_app.ms_whatsapp_atc_phones
					set whatsapp_credentials = credential
					where atc_phone = phone;
				end if;
			end
$function$

```

#### msg_app.sp_ms_bank_accounts_get
- **Type:** function
- **Arguments:** `p_id_bank integer, p_id_currency integer`
- **Returns:** `TABLE("idBankAccount" integer, "holderName" character varying, "accountNumber" character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_bank_accounts_get(p_id_bank integer, p_id_currency integer)
 RETURNS TABLE("idBankAccount" integer, "holderName" character varying, "accountNumber" character varying)
 LANGUAGE plpgsql
AS $function$
begin
				return query
					select
						a.id_bank_account, a.account_holder_name, a.account_number
					from sec_cust.ms_bank_accounts a
					where a.id_currency = p_id_currency
					and a.id_bank = p_id_bank;
			end;
$function$

```

#### msg_app.sp_ms_banks_get_client_origin_banks
- **Type:** function
- **Arguments:** `p_id_country integer[]`
- **Returns:** `TABLE("idBank" integer, name character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_banks_get_client_origin_banks(p_id_country integer[])
 RETURNS TABLE("idBank" integer, name character varying)
 LANGUAGE plpgsql
AS $function$
declare
    v_array_id_country              int[];
    v_array_id_currency             int[];
begin
    if (0 = any(p_id_country)) then
        select array(
            select id_country
            from sec_emp.ms_countries
        ) into v_array_id_country;
    else
        v_array_id_country := p_id_country;
  ...
```

#### msg_app.sp_ms_banks_get_destiny_banks
- **Type:** function
- **Arguments:** `p_id_country integer[], p_id_currency integer[], p_id_pay_method integer[]`
- **Returns:** `TABLE("idBank" integer, name character varying, ident_code character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_banks_get_destiny_banks(p_id_country integer[], p_id_currency integer[], p_id_pay_method integer[])
 RETURNS TABLE("idBank" integer, name character varying, ident_code character varying)
 LANGUAGE plpgsql
AS $function$
declare
	v_array_id_country              int[];
	v_array_id_currency             int[];
	v_array_id_pay_method           int[];
begin
	if (0 = any(p_id_country)) then
		select array(
			select id_country
			from sec_emp.ms_countries
		) int...
```

#### msg_app.sp_ms_banks_get_origin_banks
- **Type:** function
- **Arguments:** `p_id_country integer[], p_id_currency integer[]`
- **Returns:** `TABLE("idBank" integer, name character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_banks_get_origin_banks(p_id_country integer[], p_id_currency integer[])
 RETURNS TABLE("idBank" integer, name character varying)
 LANGUAGE plpgsql
AS $function$
declare
				v_array_id_country              int[];
				v_array_id_currency             int[];
			begin
				if (0 = any(p_id_country)) then
					select array(
						select id_country
						from sec_emp.ms_countries
					) into v_array_id_country;
				else
					v_array_id_country := p_id_country;
		...
```

#### msg_app.sp_ms_chat_events_insert_msg_consult_updates
- **Type:** function
- **Arguments:** `p_type character varying, p_id_chat bigint, p_sixmap_user_username character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_chat_events_insert_msg_consult_updates(p_type character varying, p_id_chat bigint, p_sixmap_user_username character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
				v_description               varchar(200);
				v_insert_notification       boolean;
				v_id_msg                    bigint;
				v_uuid_sixmap_user          uuid;
				v_username                  varchar(30);
			begin
				if (p_sixmap_user_username is not null) then
					v_usern...
```

#### msg_app.sp_ms_chat_events_requests_updates
- **Type:** function
- **Arguments:** `p_type character varying, p_id_chat bigint, p_sixmap_username_asing character varying, p_request_pub_cod character varying, p_sixmap_username_action character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_chat_events_requests_updates(p_type character varying, p_id_chat bigint, p_sixmap_username_asing character varying, p_request_pub_cod character varying, p_sixmap_username_action character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
				v_description               varchar(200);
				v_insert_notification       boolean;
				v_id_msg                    bigint;
				v_uuid_sixmap_user          uuid;
			begin
				if (p_type = 'request init') t...
```

#### msg_app.sp_ms_chats_delete
- **Type:** function
- **Arguments:** `p_only_whatsapp boolean`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_chats_delete(p_only_whatsapp boolean)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    v_chats_id_to_delete            bigint[];
begin
    select array(
        select ch.id_chat
        from msg_app.ms_chats_whatsapp ch
        where (p_only_whatsapp = false or ch.mode = 'whatsapp')
    )::bigint[] into v_chats_id_to_delete;
    delete from prc_mng.ms_user_process_asings asi
    where exists(
        select *
        from msg_app.ms_chats_whatsa...
```

#### msg_app.sp_ms_chats_different_country
- **Type:** function
- **Arguments:** `p_id_chat bigint`
- **Returns:** `boolean`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_chats_different_country(p_id_chat bigint)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
declare
				v_customer_phone            varchar;
				v_country                   varchar;
				v_mode                      varchar;
				v_resp                      boolean;
			begin
				select
					ch.customer_phone, ch.country, ch.mode
				into
					v_customer_phone, v_country, v_mode
				from msg_app.v_chats_info ch
				where ch.id_chat = p_id_chat;
				if (v_mode ...
```

#### msg_app.sp_ms_chats_get_id
- **Type:** function
- **Arguments:** `p_id_atc_phone bigint, p_peer_phone character varying`
- **Returns:** `bigint`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_chats_get_id(p_id_atc_phone bigint, p_peer_phone character varying)
 RETURNS bigint
 LANGUAGE plpgsql
AS $function$
declare
				v_id_chat                   bigint;
			begin
				select id_chat into v_id_chat from msg_app.ms_chats_whatsapp
				where p_id_atc_phone = id_atc_phone
				and p_peer_phone = peer_phone;
				return v_id_chat;
			end;
$function$

```

#### msg_app.sp_ms_chats_get_info
- **Type:** function
- **Arguments:** `p_type character varying, p_id_user_assign integer[], p_id_country integer[], p_no_resp boolean, p_consult_open boolean`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_chats_get_info(p_type character varying, p_id_user_assign integer[], p_id_country integer[], p_no_resp boolean, p_consult_open boolean)
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
    v_json_resp                 json[];
begin
    select array(
        select
            json_build_object(
                'idChat', ch.id_chat,
                'type', ch.mode,
                'lastMessageDate', msg_app.sp_chat_get_last_msg_date(ch.id_chat),
    ...
```

#### msg_app.sp_ms_chats_get_remittances_info
- **Type:** function
- **Arguments:** `p_uuid_user uuid, p_rem_close boolean`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_chats_get_remittances_info(p_uuid_user uuid, p_rem_close boolean)
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
    v_resp                              json[];
    v_init_date                         bigint;
    v_end_date                          bigint;
begin
    v_init_date = msg_app.sp_ms_default_range_time_get_init();
    v_end_date = extract(epoch from now());
    select array(
        select json_build_object(
            'publicIDRequest...
```

#### msg_app.sp_ms_chats_id_connection_get_by_id_chat
- **Type:** function
- **Arguments:** `p_id_chat integer`
- **Returns:** `TABLE(conn integer, phone character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_chats_id_connection_get_by_id_chat(p_id_chat integer)
 RETURNS TABLE(conn integer, phone character varying)
 LANGUAGE plpgsql
AS $function$
begin
				return query
					select
						c.id_connection::int, c.customer_phone
					from msg_app.v_chats_info c
					where c.id_chat = p_id_chat;
			end;
$function$

```

#### msg_app.sp_ms_chats_link_user
- **Type:** function
- **Arguments:** `p_id_chat integer, p_public_code character varying, p_ident_doc_number character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_chats_link_user(p_id_chat integer, p_public_code character varying, p_ident_doc_number character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
				v_pub_code_chat             varchar(30);
				v_user_uuid                 uuid;
				v_phone_number              varchar(30);
				v_id_ms_phone               int;
			begin
				select c.customer_public_cod, c.customer_phone
				into v_pub_code_chat, v_phone_number
				from msg_app.v_chats_info c
	...
```

#### msg_app.sp_ms_chats_whatsapp_get_remittances
- **Type:** function
- **Arguments:** `p_id_chat bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_chats_whatsapp_get_remittances(p_id_chat bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
				v_resp                      json;
			begin
				select json_build_object(
					'requestInProgress', ch.requests_in_progress,
					'finishedRequests', ch.requests_finished
				) into v_resp
				from msg_app.v_chats_info ch
				where ch.id_chat = p_id_chat;
				return v_resp;
			end;
$function$

```

#### msg_app.sp_ms_chats_whatsapp_notify_changes
- **Type:** function
- **Arguments:** `p_id_chat bigint`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_chats_whatsapp_notify_changes(p_id_chat bigint)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    v_json_resp                 json;
begin
    select
        json_build_object(
            'idChat', ch.id_chat,
            'type', ch.mode,
            'lastMessageDate', msg_app.sp_chat_get_last_msg_date(ch.id_chat),
            'name', (
                case
                    when ch.customer_name is not null then concat(ch.customer_name, ' ', ch...
```

#### msg_app.sp_ms_countries_get_destiny_countries
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE("idCountry" bigint, name character varying, code character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_countries_get_destiny_countries()
 RETURNS TABLE("idCountry" bigint, name character varying, code character varying)
 LANGUAGE plpgsql
AS $function$
begin
				return query
					select
						c.id_country, c.viewing_name, c.country_iso_code
					from sec_emp.ms_countries c
					where (
						c.criptoremesa_active = true
						or c.sixmap_active = true
					)
					and c.country_active = true;
			end
$function$

```

#### msg_app.sp_ms_countries_get_id
- **Type:** function
- **Arguments:** `p_country_name character varying`
- **Returns:** `integer`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_countries_get_id(p_country_name character varying)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
declare
				v_id_country                int;
			begin
				select c.id_country into v_id_country
				from sec_emp.ms_countries c
				where c.name_country = p_country_name;
				return v_id_country;
			end;
$function$

```

#### msg_app.sp_ms_countries_get_origin_countries
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE("idCountry" bigint, name character varying, code character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_countries_get_origin_countries()
 RETURNS TABLE("idCountry" bigint, name character varying, code character varying)
 LANGUAGE plpgsql
AS $function$
begin
				return query
					select
						c.id_country, c.viewing_name, c.country_iso_code
					from sec_emp.ms_countries c
					where c.criptoremesa_active = true
					and c.country_active = true;
			end
$function$

```

#### msg_app.sp_ms_cr_rate_get
- **Type:** function
- **Arguments:** `p_id_currency_origin integer, p_id_currency_destiny integer, p_id_country_origin integer, p_id_country_destiny integer, p_id_rate_type integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_cr_rate_get(p_id_currency_origin integer, p_id_currency_destiny integer, p_id_country_origin integer, p_id_country_destiny integer, p_id_rate_type integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
				resp_obj               jsonb;
			begin
				IF (
					p_id_currency_origin IS NULL AND
					p_id_currency_destiny IS NULL AND
					p_id_country_origin IS NULL AND
					p_id_country_destiny IS NULL AND
					p_id_rate_type IS NULL
				)
				THEN
		...
```

#### msg_app.sp_ms_cr_rate_get_init_remittance
- **Type:** function
- **Arguments:** `p_id_currency_origin integer, p_id_currency_destiny integer, p_id_country_origin integer, p_id_country_destiny integer, p_id_rate_type integer, p_id_chat bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_cr_rate_get_init_remittance(p_id_currency_origin integer, p_id_currency_destiny integer, p_id_country_origin integer, p_id_country_destiny integer, p_id_rate_type integer, p_id_chat bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_email                     varchar;
    v_rates                     json;
    v_manual_rates              json;
    v_rate                      json;
begin
    v_rate := null;
    select ch.customer_email into ...
```

#### msg_app.sp_ms_cr_rate_type_get
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE("idRateType" integer, name character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_cr_rate_type_get()
 RETURNS TABLE("idRateType" integer, name character varying)
 LANGUAGE plpgsql
AS $function$
begin
				return query
					select
						r.id_rate_type, r.rate_type_name
					from sec_cust.ms_cr_rate_type r;
			end;
$function$

```

#### msg_app.sp_ms_currencies_get_by_country_destiny
- **Type:** function
- **Arguments:** `p_id_country integer[]`
- **Returns:** `TABLE("idCourrency" integer, name character varying, "isoCode" character varying, type character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_currencies_get_by_country_destiny(p_id_country integer[])
 RETURNS TABLE("idCourrency" integer, name character varying, "isoCode" character varying, type character varying)
 LANGUAGE plpgsql
AS $function$
begin
				if (0 = any(p_id_country)) then
					return query
						select
							c.id_currency, c.name, c.iso_cod, c.type
						from sec_cust.ms_currencies c
						where c.active = true
						and c.destiny_currency = true;
				else
					return query
					...
```

#### msg_app.sp_ms_currencies_get_by_country_origin
- **Type:** function
- **Arguments:** `p_id_country integer[]`
- **Returns:** `TABLE("idCourrency" integer, name character varying, "isoCode" character varying, type character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_currencies_get_by_country_origin(p_id_country integer[])
 RETURNS TABLE("idCourrency" integer, name character varying, "isoCode" character varying, type character varying)
 LANGUAGE plpgsql
AS $function$
begin
				if (0 = any(p_id_country)) then
					return query
						select
							c.id_currency, c.name, c.iso_cod, c.type
						from sec_cust.ms_currencies c
						where c.active = true
						and c.origin_currency = true;
				else
					return query
						s...
```

#### msg_app.sp_ms_default_msg_types_get_id_by_name
- **Type:** function
- **Arguments:** `p_type_name character varying`
- **Returns:** `integer`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_default_msg_types_get_id_by_name(p_type_name character varying)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
declare
				v_id_type                   int;
			begin
				select t.id_default_type into v_id_type
				from msg_app.ms_default_msg_types t
				where name = p_type_name;
				return v_id_type;
			end;
$function$

```

#### msg_app.sp_ms_default_range_time_get_init
- **Type:** function
- **Arguments:** `none`
- **Returns:** `bigint`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_default_range_time_get_init()
 RETURNS bigint
 LANGUAGE plpgsql
AS $function$
declare
				v_epoch_range               bigint;
			begin
				select
					epoch_range into v_epoch_range
				from msg_app.ms_default_range_time
				where active_default = true;
				if (v_epoch_range = 0) then
					return extract(epoch from current_date)::bigint;
				else
					return extract(epoch from now())::bigint - v_epoch_range;
				end if;
			end;
$function$

```

#### msg_app.sp_ms_doc_type_get
- **Type:** function
- **Arguments:** `p_id_country bigint`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_doc_type_get(p_id_country bigint)
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
    v_json_resp                 json[];
begin
    select array(
        select json_build_object(
            'id_ident_doc_type', doc.id_ident_doc_type,
            'name', concat(doc.acronym, ' - ', doc.name_doc_type)
        )
        from sec_cust.ms_doc_type doc
        where doc.id_resid_country = p_id_country
    ) into v_json_resp;
    return v_json_resp;
end...
```

#### msg_app.sp_ms_pay_methods_get
- **Type:** function
- **Arguments:** `p_id_country integer, p_id_currency integer, p_only_pay boolean`
- **Returns:** `TABLE("idPayMethod" integer, name character varying, fields json[])`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_pay_methods_get(p_id_country integer, p_id_currency integer, p_only_pay boolean)
 RETURNS TABLE("idPayMethod" integer, name character varying, fields json[])
 LANGUAGE plpgsql
AS $function$
begin

				IF (p_only_pay = false)
				THEN
					return query
						select
							m.id_pay_method, m.name, (
														select array(
															select json_build_object(
																'id_field', f.id_field,
																'name_field', f.name_field,
							...
```

#### msg_app.sp_ms_sixmap_user_atc_get
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE(id integer, username character varying, name character varying, lastname character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_sixmap_user_atc_get()
 RETURNS TABLE(id integer, username character varying, name character varying, lastname character varying)
 LANGUAGE plpgsql
AS $function$
begin
				return query
					select
						u.id_user::int, u.username, p.first_name, p.last_name
					from sec_emp.ms_sixmap_users u
					inner join priv.ms_sixmap_users p on u.id_user_priv = p.id_user_priv
					inner join prc_mng.v_ms_emp_sixmap_to_asing emp on u.id_user = emp.id_emp
					inner joi...
```

#### msg_app.sp_ms_sixmap_users_verify_pub_code
- **Type:** function
- **Arguments:** `p_ident_type integer, p_ident_number character varying, p_main_phone character varying, p_old_pub_code character varying`
- **Returns:** `character varying`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_sixmap_users_verify_pub_code(p_ident_type integer, p_ident_number character varying, p_main_phone character varying, p_old_pub_code character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
declare
				v_pub_code                  varchar(30);
			begin
				if (p_old_pub_code != '') then
					select u.cust_cr_cod_pub into v_pub_code
					from sec_cust.ms_sixmap_users u
					inner join sec_cust.ms_phone p on p.uuid_user = u.uuid_user
				...
```

#### msg_app.sp_ms_user_consult_asings_reasing
- **Type:** function
- **Arguments:** `p_username character varying, p_id_chat bigint`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_user_consult_asings_reasing(p_username character varying, p_id_chat bigint)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
				v_uuid_sixmap_user          uuid;
				v_id_consult                bigint;
				v_id_action                 int;
				_fake_name           		varchar(100);
				_email_user           		varchar(100);
				_uniq_id           			varchar;
			begin
				v_uuid_sixmap_user = msg_app.sp_sixmap_user_uuid_get(p_username);
				if (v_uuid_si...
```

#### msg_app.sp_ms_user_consult_types_get
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE(id integer, name character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_user_consult_types_get()
 RETURNS TABLE(id integer, name character varying)
 LANGUAGE plpgsql
AS $function$
begin
				return query
					select id_user_consult_type, type_name from prc_mng.ms_user_consult_types;
			end;
$function$

```

#### msg_app.sp_ms_user_notification_types
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE("idNotificationType" integer, name character varying, fields character varying[])`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_user_notification_types()
 RETURNS TABLE("idNotificationType" integer, name character varying, fields character varying[])
 LANGUAGE plpgsql
AS $function$
begin
				return query
					select
						t.id_notification, t.type_name, array(
							select f.name_field
							from sec_cust.ms_fields f
							where f.id_notification = t.id_notification
							and f.active = true
						)
					from sec_cust.ms_user_notification_types t
					where active = true;
			e...
```

#### msg_app.sp_ms_whatsapp_chats_archive
- **Type:** function
- **Arguments:** `p_id_chat bigint`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_whatsapp_chats_archive(p_id_chat bigint)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    v_actual_archived           boolean;
    v_consult                   boolean;
    v_remittance                boolean;
begin
    select ch.consult, (array_length(ch.requests_in_progress, 1) > 0), ch.archived
    into v_consult, v_remittance, v_actual_archived
    from msg_app.v_chats_info ch
    where ch.id_chat = p_id_chat;
    if (v_actual_archived is null...
```

#### msg_app.sp_ms_whatsapp_msg_json_get_by_id_msg
- **Type:** function
- **Arguments:** `p_id_msg bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_ms_whatsapp_msg_json_get_by_id_msg(p_id_msg bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
				v_json_msg                  json;
			begin
				select j.json_body into v_json_msg
				from msg_app.ms_whatsapp_msg_json j
				where j.id_whatsapp_msg = p_id_msg;
				return v_json_msg;
			end;
$function$

```

#### msg_app.sp_sixmap_user_uuid_get
- **Type:** function
- **Arguments:** `p_username character varying`
- **Returns:** `uuid`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_sixmap_user_uuid_get(p_username character varying)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$
declare
				v_uuid_user                 uuid;
			begin
				select uuid_user into v_uuid_user from sec_emp.ms_sixmap_users
				where username = p_username;
				return v_uuid_user;
			end;
$function$

```

#### msg_app.sp_user_consult_close
- **Type:** function
- **Arguments:** `p_username character varying, p_id_chat bigint, p_consult_type character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_user_consult_close(p_username character varying, p_id_chat bigint, p_consult_type character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
				v_user_uuid                 uuid;
				v_id_msg_close              bigint;
				v_id_consult_type           integer;
				v_id_consult                int;
			begin
				v_user_uuid := msg_app.sp_sixmap_user_uuid_get(p_username);
				v_id_msg_close := msg_app.sp_chat_get_last_msg_id(p_id_chat);
				select i...
```

#### msg_app.sp_validate_chat_firts_header
- **Type:** function
- **Arguments:** `p_username character varying, p_username_asing character varying, p_op_header character varying, p_consult boolean, p_requests_in_progress json[]`
- **Returns:** `boolean`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_validate_chat_firts_header(p_username character varying, p_username_asing character varying, p_op_header character varying, p_consult boolean, p_requests_in_progress json[])
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
begin
				if (p_op_header = 'general') then
					return true;
				elsif (p_op_header = 'toDo') then
					return ((p_consult = true or array_length(p_requests_in_progress, 1) > 0) and p_username = p_username_asing);
				elsif (p_op_header =...
```

#### msg_app.sp_validate_first_header_process
- **Type:** function
- **Arguments:** `p_op_header character varying, p_date_close_process timestamp with time zone, p_username_asing character varying, p_username_param character varying`
- **Returns:** `boolean`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_validate_first_header_process(p_op_header character varying, p_date_close_process timestamp with time zone, p_username_asing character varying, p_username_param character varying)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
begin
				if (p_op_header = 'general' and p_date_close_process is null) then
					return true;
				elsif (p_op_header = 'toDo' and p_date_close_process is null and p_username_asing = p_username_param) then
					return true;
				elsif...
```

#### msg_app.sp_verify_range_date
- **Type:** function
- **Arguments:** `p_init_range bigint, p_close_range bigint, p_init_date_process timestamp with time zone, p_close_date_process timestamp with time zone`
- **Returns:** `boolean`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_verify_range_date(p_init_range bigint, p_close_range bigint, p_init_date_process timestamp with time zone, p_close_date_process timestamp with time zone)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
declare
				v_init_date                 timestamptz;
				v_close_date                timestamptz;
				v_close_date_process        timestamptz;
			begin
				if (p_init_range = 0) then
					v_init_date = to_timestamp(msg_app.sp_ms_default_range_time_get_init())...
```

#### msg_app.sp_whatsapp_msg_insert
- **Type:** function
- **Arguments:** `p_username character varying, message_body json, p_atc_phone character varying, file_route character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.sp_whatsapp_msg_insert(p_username character varying, message_body json, p_atc_phone character varying, file_route character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
				v_id_chat                   bigint;
				v_id_whatsapp               varchar(40);
				v_msg_action                varchar(8);
				v_peer_phone                varchar(30);
				v_peer_phone_account        varchar(50);
				v_whatsapp_epoch            bigint;
				v_whatsapp_date...
```

#### msg_app.tf_after_insert_whatsapp_msg
- **Type:** function
- **Arguments:** `none`
- **Returns:** `trigger`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.tf_after_insert_whatsapp_msg()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare
				v_id_consult                bigint;
				v_json_notf                 json;
				v_user_asing                varchar(30);
			begin
				if (new.msg_action = 'received') then
					select id_consult into v_id_consult from prc_mng.lnk_user_consult
					where consult_open = true
					and id_chat = new.id_chat
					limit 1;
					if (v_id_consult is null) then
						v_user_asing =...
```

#### msg_app.tf_after_insert_whatsapp_msg_json
- **Type:** function
- **Arguments:** `none`
- **Returns:** `trigger`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.tf_after_insert_whatsapp_msg_json()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare
    v_id_chat                   bigint;
    v_action                    varchar(8);
    v_id_connection             integer;
    v_date                      integer;
    v_username                  varchar(30);
    v_msg                  		json;
    v_atc_user_name             varchar(30);
    v_atc_user_lastname         varchar(30);
    v_id_msg                    inte...
```

#### msg_app.tf_before_insert_whatsapp_msg
- **Type:** function
- **Arguments:** `none`
- **Returns:** `trigger`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.tf_before_insert_whatsapp_msg()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
				if (new.msg_action = 'received') then
					new.atc_respond = false;
				end if;
				return new;
			end;
$function$

```

#### msg_app.update_date_function
- **Type:** function
- **Arguments:** `none`
- **Returns:** `trigger`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION msg_app.update_date_function()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
					NEW.date_last_modif = NOW();
					return NEW;
				END;

$function$

```

#### ord_sch.calculate_public_rates
- **Type:** function
- **Arguments:** `none`
- **Returns:** `trigger`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION ord_sch.calculate_public_rates()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
        cost_rate FLOAT;
        route prc_mng.ms_operation_routes%ROWTYPE;
    BEGIN
        -- look for rate cost
        SELECT CR.rate_value INTO cost_rate
        FROM ord_sch.ms_cost_rates AS CR
        WHERE CR.id_operation_route = NEW.id_route;

        -- look for route
        SELECT R.* INTO route
        FROM prc_mng.ms_operation_routes AS R
        WHERE R.id_operatio...
```

#### ord_sch.cost_rate_update
- **Type:** function
- **Arguments:** `none`
- **Returns:** `trigger`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION ord_sch.cost_rate_update()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
            operation_routes        JSONB;
            operation_route         JSONB;
            inside_function_resp    JSONB;
            final_buy_rate          FLOAT;
            final_sell_rate         FLOAT;
            rate_value              FLOAT;
            prev_rate_value         BOOLEAN;
        BEGIN
            raise notice 'ID MARKET RATE:  %', NEW.id_market_rates;
    ...
```

#### ord_sch.deactivate_old_rates
- **Type:** function
- **Arguments:** `none`
- **Returns:** `trigger`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION ord_sch.deactivate_old_rates()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
BEGIN
    UPDATE ord_sch.ms_market_rates
    SET active = false
    WHERE id_currency = NEW.id_currency
    AND id_market_rates <> NEW.id_market_rates;

    return NEW;
END;
$function$

```

#### ord_sch.rate_cost_update
- **Type:** function
- **Arguments:** `none`
- **Returns:** `trigger`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION ord_sch.rate_cost_update()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
	operation_routes JSONB;
BEGIN
	SELECT * FROM ord_sch.sp_get_operation_routes_cost('fiat') INTO operation_routes;
	RAISE NOTICE 'operation_routes %',operation_routes;
	RAISE NOTICE 'TASA DE MERCADO ACTUALIZADA %',NEW.id_market_rates;
	RETURN NEW;
END;
$function$

```

#### ord_sch.sp_clean_old_consults
- **Type:** function
- **Arguments:** `none`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION ord_sch.sp_clean_old_consults()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    v_consults_to_delete                bigint[];
    v_offers_to_delete                  uuid[];
begin
    select array(
        select con.id_consult
        from ord_sch.ms_consults con
        where con.current_active = false
    ) into v_consults_to_delete;
    select array(
        select of.id_offer
        from ord_sch.lnk_currencies_pairs_offers of
        where of.id_consult...
```

#### ord_sch.sp_cost_rate_update
- **Type:** function
- **Arguments:** `_id_operation_route bigint, _rate_value double precision, _keep_value boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION ord_sch.sp_cost_rate_update(_id_operation_route bigint, _rate_value double precision, _keep_value boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
            resp_obj         JSONB;
            returning_id     INT;
            _err             TEXT;
            _updated_group   BIGINT;
            _prev_rate_value FLOAT;
        BEGIN
            UPDATE ord_sch.ms_cost_rates
            SET active = FALSE
            WHERE id_operation_route = _id_opera...
```

#### ord_sch.sp_cost_rates_update
- **Type:** function
- **Arguments:** `_id_operation_route bigint, _rate_value double precision`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION ord_sch.sp_cost_rates_update(_id_operation_route bigint, _rate_value double precision)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
            resp_obj JSONB;
            returning_id INT;
            _err TEXT;
        BEGIN
            UPDATE ord_sch.ms_cost_rates
            SET active = FALSE
            WHERE id_operation_route = _id_operation_route;

            INSERT INTO ord_sch.ms_cost_rates(id_operation_route,rate_value) VALUES(_id_operation_route,...
```

#### ord_sch.sp_generate_name
- **Type:** function
- **Arguments:** `_id_market_fee bigint`
- **Returns:** `character varying`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION ord_sch.sp_generate_name(_id_market_fee bigint)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
    market_fee ord_sch.ms_market_fees%rowtype;
    platform_name VARCHAR;
    country_name VARCHAR;
    market_type_name VARCHAR;
BEGIN
    -- se obtiene el market_fee y nombres a concatenar
    SELECT * INTO market_fee
    FROM ord_sch.ms_market_fees AS MF
    WHERE MF.id_market_fees = _id_market_fee;

    IF (market_fee.id_platform IS NOT NULL) THEN
    ...
```

#### ord_sch.sp_get_cost_rates
- **Type:** function
- **Arguments:** `_currency_type character varying, _id_country bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION ord_sch.sp_get_cost_rates(_currency_type character varying, _id_country bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
            fiat_type VARCHAR;
            cost_rates JSON;
        BEGIN
            fiat_type = 'fiat';
            IF (_currency_type = fiat_type) THEN
                SELECT json_agg(RR.*) INTO cost_rates
                FROM
                    (   SELECT OC1.id_origin_country,CO1.viewing_name, ( SELECT json_agg(DES.*)
             ...
```

#### ord_sch.sp_get_cost_rates_history
- **Type:** function
- **Arguments:** `_currency_type character varying, _id_country bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION ord_sch.sp_get_cost_rates_history(_currency_type character varying, _id_country bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
            fiat_type VARCHAR;
            cost_rates JSON;
        BEGIN
            fiat_type = 'fiat';
            IF (_id_country IS NULL) THEN
                RAISE EXCEPTION 'id_country must not be null';
            END IF;
            IF (_currency_type = fiat_type) THEN
                SELECT json_agg(RR.*) INTO cost_rat...
```

#### ord_sch.sp_get_fee_comparative
- **Type:** function
- **Arguments:** `p_id_fiat_currency integer[], p_id_exchange integer[]`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION ord_sch.sp_get_fee_comparative(p_id_fiat_currency integer[], p_id_exchange integer[])
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
			v_resp                              json[];
		begin
			select array(
				select json_build_object(
					'exchange', fee.exchange,
					'pair', fee.pair_name,
					'marketFee', fee.market_fee,
					'limitFee', fee.limit_fee,
					'spread', fee.spread_fee,
					'fiatIsoCod', fee.fiat_iso_cod
				)
				from ord_sch.v_exchanges_fe...
```

#### ord_sch.sp_get_limit_fee_by_exchange
- **Type:** function
- **Arguments:** `p_id_exchange integer, p_id_pair integer, p_p2p_offers boolean`
- **Returns:** `double precision`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION ord_sch.sp_get_limit_fee_by_exchange(p_id_exchange integer, p_id_pair integer, p_p2p_offers boolean)
 RETURNS double precision
 LANGUAGE plpgsql
AS $function$
declare
			v_price_limit               float;
		begin
			if (p_p2p_offers = true) then
				select max(o.price) into v_price_limit
				from ord_sch.v_active_offers o
				where o.type_offer = 'BUY'
				and o.id_exchange = p_id_exchange
				and o.id_pair = p_id_pair;
			else
				select max(ord.price) into v_price_li...
```

#### ord_sch.sp_get_market_fee_by_exchange
- **Type:** function
- **Arguments:** `p_id_exchange integer, p_id_pair integer, p_p2p_offers boolean`
- **Returns:** `double precision`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION ord_sch.sp_get_market_fee_by_exchange(p_id_exchange integer, p_id_pair integer, p_p2p_offers boolean)
 RETURNS double precision
 LANGUAGE plpgsql
AS $function$
declare
			v_price_limit               float;
		begin
			if (p_p2p_offers = true) then
				select min(o.price) into v_price_limit
				from ord_sch.v_active_offers o
				where o.type_offer = 'SELL'
				and o.id_exchange = p_id_exchange
				and o.id_pair = p_id_pair;
			else
				select min(ord.price) into v_price_...
```

#### ord_sch.sp_get_operation_routes_cost
- **Type:** function
- **Arguments:** `currency_type character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION ord_sch.sp_get_operation_routes_cost(currency_type character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
        fiat_type VARCHAR;
        rate_costs JSON;
    BEGIN
        fiat_type = 'fiat';
        IF (currency_type = fiat_type) THEN
            SELECT json_agg(RR.*) INTO rate_costs
                    FROM (
                            SELECT R.id_operation_route,R.cost_factor,OA.id_country AS id_origin_country,DA.id_country AS id_destiny_count...
```

#### ord_sch.sp_lnk_currencies_pairs_offers_binance_insert
- **Type:** function
- **Arguments:** `p_id_exchange integer, p_offers jsonb[], p_id_consult bigint, p_id_pair integer`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION ord_sch.sp_lnk_currencies_pairs_offers_binance_insert(p_id_exchange integer, p_offers jsonb[], p_id_consult bigint, p_id_pair integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
			v_offer                     jsonb;
			v_trade_type                varchar(4);
			v_adv_no                    varchar(30);
			v_max_trans_amount          float;
			v_min_trans_amount          float;
			v_price                     float;
			v_count_pay_types           int;
			v_id_o...
```

#### ord_sch.sp_lnk_currencies_pairs_offers_localbitcoins_insert
- **Type:** function
- **Arguments:** `p_id_exchange integer, p_offers jsonb[], p_id_consult bigint, p_id_pair integer`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION ord_sch.sp_lnk_currencies_pairs_offers_localbitcoins_insert(p_id_exchange integer, p_offers jsonb[], p_id_consult bigint, p_id_pair integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
			v_offer                     jsonb;
			v_trade_type                varchar(200);
			v_adv_no                    varchar(30);
			v_max_trans_amount          float;
			v_min_trans_amount          float;
			v_price                     float;
			v_tradeble                  boolea...
```

#### ord_sch.sp_lnk_currencies_pairs_orders_buda_insert
- **Type:** function
- **Arguments:** `p_id_exchange integer, p_orders jsonb[], p_id_consult bigint, p_id_pair integer`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION ord_sch.sp_lnk_currencies_pairs_orders_buda_insert(p_id_exchange integer, p_orders jsonb[], p_id_consult bigint, p_id_pair integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
			v_order                     jsonb;
			v_price                     float;
			v_amount                    float;
			v_trade_type_consult        varchar(10);
			v_trade_type                varchar(10);
			v_counter                   int;
		begin
			v_counter := 1;
			select c.type_offer...
```

#### ord_sch.sp_lnk_currencies_pairs_orders_kraken_insert
- **Type:** function
- **Arguments:** `p_id_exchange integer, p_orders jsonb[], p_id_consult bigint, p_id_pair integer`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION ord_sch.sp_lnk_currencies_pairs_orders_kraken_insert(p_id_exchange integer, p_orders jsonb[], p_id_consult bigint, p_id_pair integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
			v_order                     jsonb;
			v_price                     float;
			v_amount                    float;
			v_trade_type_consult        varchar(10);
			v_trade_type                varchar(10);
			v_counter                   int;
		begin
			v_counter := 1;
			select c.type_off...
```

#### ord_sch.sp_market_rate_insert
- **Type:** function
- **Arguments:** `market_rate jsonb`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION ord_sch.sp_market_rate_insert(market_rate jsonb)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
        resp_obj JSONB;
        message VARCHAR;
        id_element BIGINT;
        _err TEXT;
    BEGIN
        INSERT INTO ord_sch.ms_market_rates(id_currency, buy_rate, id_buy_fee, sell_rate, id_sell_fee, final_buy_rate, final_sell_rate, current_fiat_crypto_rate, percentage_difference, current_usd_fiat_rate)
        VALUES ((market_rate->>'idCurrency')::BIGINT, (ma...
```

#### ord_sch.sp_market_rates_get
- **Type:** function
- **Arguments:** `_id_currency integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION ord_sch.sp_market_rates_get(_id_currency integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
    resp_obj JSONB;
    market_rates JSONB;
    platforms JSONB;
    order_types JSONB;
    market_fees JSONB;
    risks JSONB;
    _err TEXT;
BEGIN
    -- se consultan los market rates
    IF (_id_currency IS NOT NULL) THEN
        SELECT json_agg(T) INTO market_rates
        FROM (SELECT MR.id_market_rates AS "id", id_currency AS "idCurrency", buy_rate AS "buyRate"...
```

#### ord_sch.sp_market_rates_insert
- **Type:** function
- **Arguments:** `market_rates jsonb`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION ord_sch.sp_market_rates_insert(market_rates jsonb)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
        resp_obj JSONB;
        message VARCHAR;
        inside_function_resp JSONB;
        _err TEXT;
        market_rate JSONB;
    BEGIN
        -- se recorre el arreglo de market_rates y se insertan
        FOR market_rate IN SELECT * FROM jsonb_array_elements(market_rates) LOOP
            SELECT * FROM ord_sch.sp_market_rate_insert(market_rate::JSONB) INTO in...
```

#### ord_sch.sp_ms_currencies_pairs_get_all
- **Type:** function
- **Arguments:** `p_exchange character varying`
- **Returns:** `TABLE(id integer, name character varying, "fiatCod" character varying, "cryptoCod" character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION ord_sch.sp_ms_currencies_pairs_get_all(p_exchange character varying)
 RETURNS TABLE(id integer, name character varying, "fiatCod" character varying, "cryptoCod" character varying)
 LANGUAGE plpgsql
AS $function$
begin
			if (p_exchange is null) then
				return query
					select
						p.id_pair, p.name, p.fiat_cod, p.crypto_cod
					from ord_sch.v_currencies_pairs p;
			elsif (p_exchange = 'binance') then
				return query
					select
						p.id_pair, p.name, p.fiat_cod,...
```

#### ord_sch.sp_ms_extract_data_insert
- **Type:** function
- **Arguments:** `p_offers jsonb[], p_exchange character varying, p_pair_name character varying, p_type_offer character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION ord_sch.sp_ms_extract_data_insert(p_offers jsonb[], p_exchange character varying, p_pair_name character varying, p_type_offer character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
			v_id_exchange               int;
			v_id_pair                   int;
			v_id_consult_active         bigint;
			v_id_consult                bigint;
		begin
			if (p_type_offer != 'Sell' and p_type_offer != 'Buy') then
				raise exception 'Invalid Offer type';
			end if;
	...
```

#### ord_sch.sp_public_fee_update
- **Type:** function
- **Arguments:** `public_fee jsonb`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION ord_sch.sp_public_fee_update(public_fee jsonb)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
        resp_obj JSONB;
        message VARCHAR;
        id_element BIGINT;
        _err TEXT;
    BEGIN
        UPDATE ord_sch.ms_public_fees
        SET fee = (public_fee->>'fee')::FLOAT
        WHERE id_public_fee = (public_fee->>'idPublicFee')::BIGINT
        RETURNING id_public_fee INTO id_element;

        message := 'Public fee successfully updated.';

        re...
```

#### ord_sch.sp_public_fees_get
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION ord_sch.sp_public_fees_get()
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
        resp_obj JSONB;
        data JSONB;
        _err TEXT;
    BEGIN
        SELECT json_agg(T) INTO data
        FROM (SELECT DISTINCT ON (PF.id_route) PF.id_route AS "idRoute", (SELECT json_agg(T.*) AS fees
                                                                           FROM (SELECT PF2.id_public_fee AS "idPublicFee", PF2.fee, PF2.id_rate AS "idRate", (SELECT CU.iso_cod
...
```

#### ord_sch.sp_public_fees_update
- **Type:** function
- **Arguments:** `public_fees jsonb`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION ord_sch.sp_public_fees_update(public_fees jsonb)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
        resp_obj JSONB;
        message VARCHAR;
        inside_function_resp JSONB;
        _err TEXT;
        public_fee JSONB;
    BEGIN
        -- se recorre el arreglo de public_fees y se actualizan
        FOR public_fee IN SELECT * FROM jsonb_array_elements(public_fees) LOOP
            SELECT * FROM ord_sch.sp_public_fee_update(public_fee::JSONB) INTO inside_f...
```

#### ord_sch.sp_route_cost_factor_update
- **Type:** function
- **Arguments:** `_id_operation_route bigint, _cost_factor double precision`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION ord_sch.sp_route_cost_factor_update(_id_operation_route bigint, _cost_factor double precision)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
        resp_obj JSONB;
        succesfully_updated INT;
        _err TEXT;
    BEGIN
        UPDATE prc_mng.ms_operation_routes
        SET cost_factor = _cost_factor
        WHERE id_operation_route = _id_operation_route
        RETURNING id_operation_route INTO succesfully_updated;

        IF (succesfully_updated IS NO...
```

#### ord_sch.sp_routes_cost_factor_update
- **Type:** function
- **Arguments:** `operation_routes jsonb`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION ord_sch.sp_routes_cost_factor_update(operation_routes jsonb)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
begin
    -- missing source code
end;
$function$

```

#### ord_sch.tf_ms_extract_data_after_insert
- **Type:** function
- **Arguments:** `none`
- **Returns:** `trigger`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION ord_sch.tf_ms_extract_data_after_insert()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare
			v_offers                    jsonb[];
		begin
			v_offers := new.json_data::jsonb[];
			case
				when new.id_exchange = 1 then
					perform ord_sch.sp_lnk_currencies_pairs_offers_binance_insert(new.id_exchange, v_offers, new.id_consult, new.id_pair);
				when new.id_exchange = 2 then
					perform ord_sch.sp_lnk_currencies_pairs_offers_localbitcoins_insert(new.id_exchang...
```

#### prc_mng.get_exchange_route
- **Type:** function
- **Arguments:** `p_id_exchange_origin_address bigint, p_id_exchange_destiny_address bigint`
- **Returns:** `character varying`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.get_exchange_route(p_id_exchange_origin_address bigint, p_id_exchange_destiny_address bigint)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
declare
				v_origin_name                   varchar;
				v_destiny_name                  varchar;
			begin
				select coalesce(add.iso_code, add.name)
				into v_origin_name
				from prc_mng.ms_exchange_address add
				where add.id_exchange_address = p_id_exchange_origin_address;
				select coalesce(add.iso_cod...
```

#### prc_mng.get_pre_exchange_by_user
- **Type:** function
- **Arguments:** `_email_user character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.get_pre_exchange_by_user(_email_user character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					pre_exchange JSONB;
					created_date INT;
					_id_pre_exchange INT;
					date_last_shown BIGINT;
					_active BOOLEAN;
					_was_expired BOOLEAN;
				BEGIN
					SELECT ER.id_pre_exchange,ER.pre_exchange, extract(epoch from ER.date_creation), ER.date_last_shown, ER.active, ER.was_expired INTO _id_pre_exchange, pre_exchange, cr...
```

#### prc_mng.get_remittance_route
- **Type:** function
- **Arguments:** `p_id_remittance bigint`
- **Returns:** `character varying`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.get_remittance_route(p_id_remittance bigint)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
declare
				v_id_origin_country             int;
				v_id_dest_country               int;
				v_origin_country_cod            varchar;
				v_destiny_country_cod           varchar;
			begin
				select (
					case
						when rem.id_manual_rate is not null then
							man.id_origin_country
						when rem.id_special_rate is not null then
							spe.id_origin_coun...
```

#### prc_mng.get_remittances_stats
- **Type:** function
- **Arguments:** `p_init_date bigint, p_close_date bigint, p_id_origin_currency integer[], p_id_destiny_currency integer[]`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.get_remittances_stats(p_init_date bigint, p_close_date bigint, p_id_origin_currency integer[], p_id_destiny_currency integer[])
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_init_date                 bigint;
    v_close_date                bigint;
    v_ranking_origin            json[];
    v_ranking_destiny           json[];
    v_stats                     json;
begin
    if (p_init_date = 0) then
        v_init_date = msg_app.sp_ms_default_range...
```

#### prc_mng.lnk_cr_remittances_update_amounts
- **Type:** function
- **Arguments:** `p_id_remittance bigint, p_new_origin_amount double precision, p_new_origin_local_amount double precision, p_new_origin_dolar_amount double precision, p_new_commission double precision, p_new_destiny_amount double precision`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.lnk_cr_remittances_update_amounts(p_id_remittance bigint, p_new_origin_amount double precision, p_new_origin_local_amount double precision, p_new_origin_dolar_amount double precision, p_new_commission double precision, p_new_destiny_amount double precision)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
				if (p_new_origin_amount is not null) then
					update prc_mng.lnk_cr_remittances
					set
						total_origin_amount = p_new_origin_amount, total_origin...
```

#### prc_mng.sp_assign_bank_account_to_transfer
- **Type:** function
- **Arguments:** `p_id_bank_account integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_assign_bank_account_to_transfer(p_id_bank_account integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_id_bank                               int;
    v_transfers_to_assign                   json[];
    v_transfer                              json;
    v_actual_balance                        float;
    v_new_balance                           float;
    v_new_balance_json                      json;
    v_count                                 in...
```

#### prc_mng.sp_bank_verif_status_change_repercussion
- **Type:** function
- **Arguments:** `p_id_ver_status_actual integer, p_id_ver_status_new integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_bank_verif_status_change_repercussion(p_id_ver_status_actual integer, p_id_ver_status_new integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
				v_ver_status_actual                         varchar;
				v_ver_status_new                            varchar;
				v_json_resp                                 json;
			begin
				if (p_id_ver_status_new = p_id_ver_status_actual) then
					return json_build_object(
						'error', 'Estatus actual y nuevo son...
```

#### prc_mng.sp_beneficiary_transfers_get_all
- **Type:** function
- **Arguments:** `p_pending boolean, p_id_country integer, p_id_bank integer`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_beneficiary_transfers_get_all(p_pending boolean, p_id_country integer, p_id_bank integer)
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
    v_json_resp                         json[];
begin
    select array(
        select jsonb_build_object(
            'idOperation', ben.id_beneficiary,
            'idRemittance', rem.id_remittance,
            'crId', rem.id_remittance_pub,
            'idDestinyCountry', cou.id_country,
            'd...
```

#### prc_mng.sp_buy_operations_close_btc
- **Type:** function
- **Arguments:** `p_id_buy_operation integer, p_btc_amount double precision, p_btc_close boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_buy_operations_close_btc(p_id_buy_operation integer, p_btc_amount double precision, p_btc_close boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_id_buy_operation                  int;
    v_actual_btc_close                  boolean;
    v_json_resp                         json;
begin
    select op.id_buy_operation, op.btc_close into v_id_buy_operation, v_actual_btc_close
    from prc_mng.lnk_buy_cycle_operations op
    where op.id_buy_ope...
```

#### prc_mng.sp_cancel_exchange
- **Type:** function
- **Arguments:** `_id_exchange integer, _username character varying, _comment character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_cancel_exchange(_id_exchange integer, _username character varying, _comment character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				current_exchange	                    prc_mng.lnk_cr_exchanges%ROWTYPE;
				successful_ppl_and_pub_status_change    INT;
				current_ppl_status			            prc_mng.ms_exchange_principal_status%ROWTYPE;
				new_ppl_status_1                        prc_mng.ms_exchange_principal_status%ROWTYPE;
				new_pub_stat...
```

#### prc_mng.sp_cancel_pre_exchange
- **Type:** function
- **Arguments:** `_id_pre_exchange integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_cancel_pre_exchange(_id_pre_exchange integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					_date_creation BIGINT;
					_date_last_shown BIGINT;
					_there_is_id_pre_exchange BIGINT;
					_email_user VARCHAR;
					_pre_exchange JSON;
				BEGIN
					SELECT PR.id_pre_exchange, EXTRACT(EPOCH FROM (PR.date_creation)), PR.email_user INTO _there_is_id_pre_exchange, _date_creation, _email_user
					FROM prc_mng.ms_pre_exchange PR
...
```

#### prc_mng.sp_change_auto_assign_action_method
- **Type:** function
- **Arguments:** `p_id_action integer, p_assign_method character varying, p_username character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_change_auto_assign_action_method(p_id_action integer, p_assign_method character varying, p_username character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
    if not exists(
        select *
        from sec_emp.ms_sixmap_users us
        inner join sec_emp.ms_profiles pr on us.uuid_profile = pr.uuid_profile
        inner join sec_emp.lnk_profiles_roles lpr on pr.uuid_profile = lpr.uuid_profile
        inner join sec_emp.ms_roles ro on lpr.uu...
```

#### prc_mng.sp_change_exchange_atc_rev_status
- **Type:** function
- **Arguments:** `_id_exchange integer, _id_new_status integer, _username character varying, _comment character varying, _alert boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_change_exchange_atc_rev_status(_id_exchange integer, _id_new_status integer, _username character varying, _comment character varying, _alert boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				current_exchange				prc_mng.lnk_cr_exchanges%ROWTYPE;
				current_exchange_type			TEXT;
				new_rev_status					prc_mng.ms_exchange_atc_revision_status%ROWTYPE;
				current_atc_rev_status			prc_mng.ms_exchange_atc_revision_status%ROWTYPE;
				current_awar...
```

#### prc_mng.sp_change_exchange_award_status
- **Type:** function
- **Arguments:** `_id_exchange integer, _id_new_status integer, _username character varying, _comment character varying, _alert boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_change_exchange_award_status(_id_exchange integer, _id_new_status integer, _username character varying, _comment character varying, _alert boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				current_exchange	prc_mng.lnk_cr_exchanges%ROWTYPE;
				current_exchange_type	TEXT;
				new_award_status	prc_mng.ms_exchange_award_status%ROWTYPE;
				current_award_status	prc_mng.ms_exchange_award_status%ROWTYPE;
				current_atc_rev_status	prc_mng.ms_excha...
```

#### prc_mng.sp_change_exchange_bank_verif_status
- **Type:** function
- **Arguments:** `_id_exchange integer, _id_new_status integer, _verif_numbers json[], _username character varying, _comment character varying, _alert boolean, _manual_amount double precision, _new_wallet integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_change_exchange_bank_verif_status(_id_exchange integer, _id_new_status integer, _verif_numbers json[], _username character varying, _comment character varying, _alert boolean, _manual_amount double precision, _new_wallet integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				current_exchange	                prc_mng.lnk_cr_exchanges%ROWTYPE;
				current_exchange_type			    TEXT;
				new_bank_verif_status	            prc_mng.ms_exchange_bank_verif_...
```

#### prc_mng.sp_change_exchange_buy_cycle_status
- **Type:** function
- **Arguments:** `_id_exchange integer, _id_new_status integer, _username character varying, _comment character varying, _alert boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_change_exchange_buy_cycle_status(_id_exchange integer, _id_new_status integer, _username character varying, _comment character varying, _alert boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				current_exchange	prc_mng.lnk_cr_exchanges%ROWTYPE;
				new_buy_cycle_status	prc_mng.ms_exchange_buy_cycle_status%ROWTYPE;
				current_buy_cycle_status	prc_mng.ms_exchange_buy_cycle_status%ROWTYPE;
				current_atc_rev_status	prc_mng.ms_exchange_atc_revi...
```

#### prc_mng.sp_change_exchange_claim_status
- **Type:** function
- **Arguments:** `_id_exchange integer, _id_new_status integer, _username character varying, _comment character varying, _alert boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_change_exchange_claim_status(_id_exchange integer, _id_new_status integer, _username character varying, _comment character varying, _alert boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				current_exchange	            prc_mng.lnk_cr_exchanges%ROWTYPE;
				new_claim_status	            prc_mng.ms_exchange_claim_status%ROWTYPE;
				current_claim_status	        prc_mng.ms_exchange_claim_status%ROWTYPE;
				first_rule	                    BOOLEAN;...
```

#### prc_mng.sp_change_exchange_modified_status
- **Type:** function
- **Arguments:** `_id_exchange integer, _id_new_status integer, _username character varying, _comment character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_change_exchange_modified_status(_id_exchange integer, _id_new_status integer, _username character varying, _comment character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				resp_obj JSON;
			BEGIN
				UPDATE prc_mng.lnk_cr_exchanges
				SET id_modified_status = _id_new_status
				WHERE id_exchange = _id_exchange;
				IF FOUND THEN
					resp_obj := json_build_object(
												'message', 'Modified status successfully changed.'
										...
```

#### prc_mng.sp_change_exchange_notif_client_status
- **Type:** function
- **Arguments:** `_id_exchange integer, _id_new_status integer, _email_notif boolean, _sms_notif boolean, _whatsapp_notif boolean, _username character varying, _comment character varying, _alert boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_change_exchange_notif_client_status(_id_exchange integer, _id_new_status integer, _email_notif boolean, _sms_notif boolean, _whatsapp_notif boolean, _username character varying, _comment character varying, _alert boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				current_exchange	                    prc_mng.lnk_cr_exchanges%ROWTYPE;
				current_exchange_type			        TEXT;
				new_notif_client_status	                prc_mng.ms_exchange_notif...
```

#### prc_mng.sp_change_exchange_ok_award_status
- **Type:** function
- **Arguments:** `_id_exchange integer, _id_new_status integer, _username character varying, _comment character varying, manual_change boolean, _alert boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_change_exchange_ok_award_status(_id_exchange integer, _id_new_status integer, _username character varying, _comment character varying, manual_change boolean, _alert boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				current_exchange	prc_mng.lnk_cr_exchanges%ROWTYPE;
				current_exchange_type	TEXT;
				new_ok_award_status	prc_mng.ms_exchange_ok_award_status%ROWTYPE;
				current_ok_award_status	prc_mng.ms_exchange_ok_award_status%ROWTYPE;
				c...
```

#### prc_mng.sp_change_exchange_ok_transf_status
- **Type:** function
- **Arguments:** `_id_exchange integer, _id_new_status integer, _username character varying, _comment character varying, _id_company_account integer, _alert boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_change_exchange_ok_transf_status(_id_exchange integer, _id_new_status integer, _username character varying, _comment character varying, _id_company_account integer, _alert boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				current_exchange	                prc_mng.lnk_cr_exchanges%ROWTYPE;
				current_exchange_type               TEXT;
				new_ok_transf_status     	        prc_mng.ms_exchange_ok_transf_status%ROWTYPE;
				current_ok_transf_stat...
```

#### prc_mng.sp_change_exchange_pause_status
- **Type:** function
- **Arguments:** `_id_exchange integer, _id_new_status integer, _username character varying, _comment character varying, _alert boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_change_exchange_pause_status(_id_exchange integer, _id_new_status integer, _username character varying, _comment character varying, _alert boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				current_exchange	            prc_mng.lnk_cr_exchanges%ROWTYPE;
				new_pause_status     	        prc_mng.ms_exchange_pause_status%ROWTYPE;
				current_pause_status	        prc_mng.ms_exchange_pause_status%ROWTYPE;
				current_principal_status	    prc_mng.m...
```

#### prc_mng.sp_change_exchange_sell_cycle_status
- **Type:** function
- **Arguments:** `_id_exchange integer, _id_new_status integer, _username character varying, _comment character varying, _alert boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_change_exchange_sell_cycle_status(_id_exchange integer, _id_new_status integer, _username character varying, _comment character varying, _alert boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				current_exchange				prc_mng.lnk_cr_exchanges%ROWTYPE;
				current_exchange_type			TEXT;
				new_sell_cycle_status			prc_mng.ms_exchange_sell_cycle_status%ROWTYPE;
				current_sell_cycle_status		prc_mng.ms_exchange_sell_cycle_status%ROWTYPE;
				curren...
```

#### prc_mng.sp_change_exchange_transf_status
- **Type:** function
- **Arguments:** `_id_exchange integer, _id_new_status integer, _username character varying, _comment character varying, confirmation_number character varying, capture text, _alert boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_change_exchange_transf_status(_id_exchange integer, _id_new_status integer, _username character varying, _comment character varying, confirmation_number character varying, capture text, _alert boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				current_exchange	                prc_mng.lnk_cr_exchanges%ROWTYPE;
				current_exchange_type               TEXT;
				new_transf_status     	            prc_mng.ms_exchange_transf_status%ROWTYPE;
				cur...
```

#### prc_mng.sp_change_turn
- **Type:** function
- **Arguments:** `p_username character varying, p_id_users_out integer[], p_id_users_in integer[]`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_change_turn(p_username character varying, p_id_users_out integer[], p_id_users_in integer[])
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_asings_rows                   cursor for
        select pr.id_proccess_asing, pr.id_action, pr.id_remittance, pr.id_consult, pr.id_exchange
        from prc_mng.ms_user_process_asings pr
        inner join sec_emp.ms_sixmap_users us on pr.uuid_sixmap_user_asing = us.uuid_user
        where pr.current_active ...
```

#### prc_mng.sp_change_user_turn_actions
- **Type:** function
- **Arguments:** `p_id_user bigint, p_actions json[], p_username character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_change_user_turn_actions(p_id_user bigint, p_actions json[], p_username character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_action                        json;
    v_id_action_user                int;
    v_user_name                     varchar;
    v_action_name                   varchar;
    v_action_names                  varchar[];
    v_msg                           varchar;
    v_first_action                  boolean;
begin
 ...
```

#### prc_mng.sp_complete_remittanes_massive
- **Type:** function
- **Arguments:** `p_date integer`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_complete_remittanes_massive(p_date integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    v_id_remittances                    int[];
    v_id_remittance                     int;
    v_id_bank_account_origin            int;
    v_id_bank_account_destiny           int;
    v_id_origin_transaction             int;
    v_uuid_user                         uuid;
    v_id_destiny_currency               int;
begin
    select array(
        sel...
```

#### prc_mng.sp_confirm_exchange
- **Type:** function
- **Arguments:** `_id_exchange integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_confirm_exchange(_id_exchange integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				resp_obj JSON;
				_err TEXT;
			BEGIN
			-- se confirma el exchange

				UPDATE prc_mng.lnk_cr_exchanges
				SET auto_confirm = TRUE
				WHERE id_exchange = _id_exchange;
				IF FOUND THEN
					resp_obj := json_build_object(
													'message', 'Exchange successfuly confirmed.'
													);
				ELSIF NOT FOUND THEN
					RAISE EXCEPTION 'There was an error...
```

#### prc_mng.sp_cust_third_party_users_used_get
- **Type:** function
- **Arguments:** `p_id_bh_user integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_cust_third_party_users_used_get(p_id_bh_user integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_json_resp                         json;
begin
    select json_build_object(
        'idThirdPartyUser', th.id_third_party_user,
        'name', th.name,
        'lastname', th.lastname,
        'docType', doc.name_doc_type,
        'docNumber', th.doc_number,
        'idThirdPartyAccount', acc.id_third_party_account,
        'bank', ba...
```

#### prc_mng.sp_data_massive_pay_get
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_data_massive_pay_get()
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_transactions                  varchar[];
begin
    v_transactions := array['J00000411146471VES']::varchar[] || (
        select array(
            select concat(
                (
                    case
                        when (split_part(ben.identification, '-', 1) = any(array['V','J','G','P','C'])) then
                            split_part(ben.identification, '-', 1...
```

#### prc_mng.sp_expire_pre_exchange
- **Type:** function
- **Arguments:** `_id_pre_exchange integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_expire_pre_exchange(_id_pre_exchange integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					_date_creation BIGINT;
					_date_last_shown BIGINT;
					_there_is_id_pre_exchange BIGINT;
					_email_user VARCHAR;
					_pre_exchange JSON;
				BEGIN
					SELECT ER.id_pre_exchange, EXTRACT(EPOCH FROM (ER.date_creation)), ER.email_user INTO _there_is_id_pre_exchange, _date_creation, _email_user
					FROM prc_mng.ms_pre_exchange ER
...
```

#### prc_mng.sp_format_data_massive_pay
- **Type:** function
- **Arguments:** `p_max_character integer, p_data character varying`
- **Returns:** `character varying`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_format_data_massive_pay(p_max_character integer, p_data character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
declare
    v_zero_varchar_length           int;
    v_zero_varchar                  varchar;
    v_counter                       int;
begin
    v_zero_varchar := '';
    v_zero_varchar_length := p_max_character - length(p_data);
    for v_counter in 1..v_zero_varchar_length loop
        v_zero_varchar := concat(v_zero_varchar...
```

#### prc_mng.sp_generate_exchange_pub_code
- **Type:** function
- **Arguments:** `user_id_client bigint, user_id_resid_country integer`
- **Returns:** `character varying`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_generate_exchange_pub_code(user_id_client bigint, user_id_resid_country integer)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
				generated_code VARCHAR;
				exchanges_count               		int;
				country_iso_code               		VARCHAR;
			BEGIN
				-- busca las remesas que tiene un usuario

				SELECT count(*) INTO exchanges_count
				FROM prc_mng.lnk_cr_exchanges
				WHERE id_client = user_id_client;

				-- se busca el iso code d...
```

#### prc_mng.sp_get_action_auto_asing
- **Type:** function
- **Arguments:** `p_username character varying`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_action_auto_asing(p_username character varying)
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
    v_json_resp                 json[];
begin
    if not exists(
        select *
        from sec_emp.ms_sixmap_users us
        inner join sec_emp.ms_profiles pr on us.uuid_profile = pr.uuid_profile
        inner join sec_emp.lnk_profiles_roles lpr on pr.uuid_profile = lpr.uuid_profile
        inner join sec_emp.ms_roles ro on lpr.uuid_role = ro.uuid...
```

#### prc_mng.sp_get_asing_emp
- **Type:** function
- **Arguments:** `p_entity character varying, p_grp_step character varying, p_action character varying, p_profile character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_asing_emp(p_entity character varying, p_grp_step character varying, p_action character varying, p_profile character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
					v_id_action                 int;
					v_grp_stp                   varchar(20);
					v_grp_coord                 boolean;
					v_asing_type                varchar(20);
					v_uuid_user_asing           uuid;
					v_username_asing            varchar(30);
					v_min_id         ...
```

#### prc_mng.sp_get_asing_emp_by_dealer
- **Type:** function
- **Arguments:** `p_id_action integer`
- **Returns:** `uuid`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_asing_emp_by_dealer(p_id_action integer)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$
declare
    v_id_action                 int;
    v_grp_stp                   varchar(20);
    v_grp_coord                 boolean;
    v_asing_type                varchar(20);
    v_uuid_user_asing           uuid;
    v_username_asing            varchar(30);
    v_min_id                    bigint;
    v_max_id                    bigint;
    v_id_emp_last_asing         ...
```

#### prc_mng.sp_get_auto_pay_record
- **Type:** function
- **Arguments:** `p_id_beneficiary bigint`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_auto_pay_record(p_id_beneficiary bigint)
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
    v_json_resp                         json[];
begin
    select array(
        select json_build_object(
            'idBeneficiary', ben.id_beneficiary,
            'refNumber', res.ref_number,
            'serviceCode', res.service_code,
            'date', extract(epoch from res.date_result),
            'payMethod', pay.viewing_name,
         ...
```

#### prc_mng.sp_get_bank_accounts_balances
- **Type:** function
- **Arguments:** `p_id_country bigint`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_bank_accounts_balances(p_id_country bigint)
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
    v_json_resp                             json[];
begin
    select array(
        select json_build_object(
            'idBankAccount', acc.id_bank_account,
            'idBank', acc.id_bank,
            'account', concat(ban.name, ' - ', account_holder_name),
            'actualBalance', bal.amount::decimal(10,2),
            'assignBalance', bal.actua...
```

#### prc_mng.sp_get_banks_cycles_operations
- **Type:** function
- **Arguments:** `p_id_currency integer`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_banks_cycles_operations(p_id_currency integer)
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
    v_json_resp                         json[];
begin
    select array(
        select json_build_object(
            'idBank', ban.id_bank,
            'name', ban.name
        )
        from sec_cust.ms_banks ban
        where ban.id_country = p_id_currency
    ) into v_json_resp;
    return v_json_resp;
end;
$function$

```

#### prc_mng.sp_get_beneficiaries_emails
- **Type:** function
- **Arguments:** `p_id_remittance bigint`
- **Returns:** `character varying[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_beneficiaries_emails(p_id_remittance bigint)
 RETURNS character varying[]
 LANGUAGE plpgsql
AS $function$
declare
    v_beneficiaries_emails              varchar[];
begin
    select array(
        select ben.email_notif
        from prc_mng.ms_cr_beneficiaries ben
        where ben.id_remittance = p_id_remittance
        and ben.active = true
    ) into v_beneficiaries_emails;
    return v_beneficiaries_emails;
end;
$function$

```

#### prc_mng.sp_get_bithonor_user_info_by_pub_id
- **Type:** function
- **Arguments:** `p_pub_bh_id character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_bithonor_user_info_by_pub_id(p_pub_bh_id character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_json_resp                 json;
begin
    select json_build_object(
        'pubId', us.cust_cr_cod_pub,
        'clientId', us.id_user,
        'name', concat(pr.first_name, ' ', pr.last_name),
        'verifLevel', us.id_verif_level,
        'idResidCountry', cou.id_country,
        'residCountry', cou.viewing_name,
        'docType',...
```

#### prc_mng.sp_get_buy_cycle_operations_record
- **Type:** function
- **Arguments:** `p_id_buy_cycle integer, p_id_currency integer[]`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_buy_cycle_operations_record(p_id_buy_cycle integer, p_id_currency integer[])
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
    v_id_buy_cycle                      int;
    v_json_resp                         json[];
begin
    if (p_id_buy_cycle = 0) then
        select bc.id_buy_cycle into v_id_buy_cycle
        from prc_mng.ms_buy_cycles bc
        where bc.date_closed is null;
    else
        v_id_buy_cycle := p_id_buy_cycle;
    end if;
   ...
```

#### prc_mng.sp_get_buy_cycle_pending_transactions
- **Type:** function
- **Arguments:** `p_id_currency integer, p_id_buy_cycle integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_buy_cycle_pending_transactions(p_id_currency integer, p_id_buy_cycle integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
begin
    return json_build_object(
        'general', prc_mng.sp_get_buy_cycle_pending_transactions_general(p_id_currency),
        'bankAccounts', prc_mng.sp_get_buy_cycle_pending_transactions_bank_accounts_details(p_id_currency)
    );
end;
$function$

```

#### prc_mng.sp_get_buy_cycle_pending_transactions_bank_accounts_details
- **Type:** function
- **Arguments:** `p_id_currency integer`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_buy_cycle_pending_transactions_bank_accounts_details(p_id_currency integer)
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
    v_json_resp                         json[];
begin
    select array(
        select json_build_object(
            'country', cou.viewing_name,
            'countryIsoCod', cou.country_iso_code,
            'bank', ban.name,
            'idAccount', acc.id_bank_account,
            'account', acc.account_holder_name,
    ...
```

#### prc_mng.sp_get_buy_cycle_pending_transactions_general
- **Type:** function
- **Arguments:** `p_id_currency integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_buy_cycle_pending_transactions_general(p_id_currency integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_currency_iso_cod                  varchar;
    v_id_buy_cycle                      int;
    v_total_to_use                      float;
    v_total_to_use_verified             float;
    v_total_fiat_used                   float;
    v_btc_obtained                      float;
    v_usdt_obtained                     float;
    v_total_b...
```

#### prc_mng.sp_get_buy_cycles
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_buy_cycles()
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
begin
    return array(
        select json_build_object(
            'idBuyCycle', bc.id_buy_cycle,
            'name', bc.name_cycle
        )
        from prc_mng.ms_buy_cycles bc
    );
end;
$function$

```

#### prc_mng.sp_get_client_doc_types
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_client_doc_types()
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
begin
    return array(
        select json_build_object(
            'idDocType', ty.id_ident_doc_type,
            'name', concat(ty.name_doc_type, ' - ', ty.name_country)
        )
        from sec_cust.ms_doc_type ty
        where ty.active = true
        order by ty.id_resid_country, ty.name_country
    )::json[];
end;
$function$

```

#### prc_mng.sp_get_crypto_currencies
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_crypto_currencies()
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
    v_json_resp                         json[];
begin
    select array(
        select json_build_object(
            'idCryptoCurrency', cur.id_currency,
            'name', cur.iso_cod
        )
        from sec_cust.ms_currencies cur
        where cur.type = 'crypto'
    );
end;
$function$

```

#### prc_mng.sp_get_currency_amount_to_obtain
- **Type:** function
- **Arguments:** `p_id_sell_cycle bigint, p_id_currency bigint`
- **Returns:** `numeric`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_currency_amount_to_obtain(p_id_sell_cycle bigint, p_id_currency bigint)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
declare
				v_total_amount_rem              float;
				v_total_amount_exc              float;
			begin
				select coalesce(sum(rem.total_destiny_amount), 0) into v_total_amount_rem
				from prc_mng.lnk_cr_remittances rem
				inner join prc_mng.ms_remittance_principal_status ppl on rem.id_ppl_status = ppl.id_ppl_status
				left join sec...
```

#### prc_mng.sp_get_currency_amount_to_obtain_verified
- **Type:** function
- **Arguments:** `p_id_sell_cycle bigint, p_id_currency bigint`
- **Returns:** `numeric`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_currency_amount_to_obtain_verified(p_id_sell_cycle bigint, p_id_currency bigint)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
declare
				v_total_amount_rem              float;
				v_total_amount_exc              float;
			begin
				select coalesce(sum(rem.total_destiny_amount), 0) into v_total_amount_rem
				from prc_mng.lnk_cr_remittances rem
				inner join prc_mng.ms_remittance_principal_status ppl on rem.id_ppl_status = ppl.id_ppl_status
				left...
```

#### prc_mng.sp_get_currency_amount_to_use
- **Type:** function
- **Arguments:** `p_id_buy_cycle bigint, p_id_currency bigint`
- **Returns:** `numeric`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_currency_amount_to_use(p_id_buy_cycle bigint, p_id_currency bigint)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
declare
				v_total_amount_rem              float;
				v_total_amount_exc              float;
			begin
				select coalesce(sum(rem.total_origin_amount), 0) into v_total_amount_rem
				from prc_mng.lnk_cr_remittances rem
				inner join prc_mng.ms_remittance_principal_status ppl on rem.id_ppl_status = ppl.id_ppl_status
				left join sec_cust...
```

#### prc_mng.sp_get_currency_amount_to_use_verified
- **Type:** function
- **Arguments:** `p_id_buy_cycle bigint, p_id_currency bigint`
- **Returns:** `numeric`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_currency_amount_to_use_verified(p_id_buy_cycle bigint, p_id_currency bigint)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
declare
				v_total_amount_rem              float;
				v_total_amount_exc              float;
			begin
				select coalesce(sum(rem.total_origin_amount), 0) into v_total_amount_rem
				from prc_mng.lnk_cr_remittances rem
				inner join prc_mng.ms_remittance_principal_status ppl on rem.id_ppl_status = ppl.id_ppl_status
				left join...
```

#### prc_mng.sp_get_destiny_commission
- **Type:** function
- **Arguments:** `p_id_currency integer, p_amount double precision`
- **Returns:** `double precision`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_destiny_commission(p_id_currency integer, p_amount double precision)
 RETURNS double precision
 LANGUAGE plpgsql
AS $function$
declare
    v_percentage                        float;
begin
    select per.percentage_fee into v_percentage
    from prc_mng.ms_destiny_fee_commission_percentages per
    where per.id_destiny_currency = p_id_currency;
    if (v_percentage is null) then
        raise exception 'Currency without percentage';
    end if;
    return...
```

#### prc_mng.sp_get_destiny_commission_fee_percentages
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_destiny_commission_fee_percentages()
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
begin
    -- missing source code
end;
$function$

```

#### prc_mng.sp_get_exchange_accounts_by_id_fiat_currency
- **Type:** function
- **Arguments:** `p_id_fiat_currency integer`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_exchange_accounts_by_id_fiat_currency(p_id_fiat_currency integer)
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
    v_json_resp                         json[];
begin
    select array(
        select json_build_object(
            'idExchangeAccount', acc.id_account,
            'name', acc.username,
            'idExchange', exc.id_exchange
        )
        from prc_mng.ms_exchange_accounts acc
        inner join prc_mng.lnk_exchange_accounts_...
```

#### prc_mng.sp_get_exchange_details
- **Type:** function
- **Arguments:** `_id_exchange bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_exchange_details(_id_exchange bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				exchange_info	JSON;
			BEGIN
				SELECT json_agg(T.*) INTO exchange_info
					FROM (SELECT
								EXC.id_exchange AS "NroExc",
								EXC.id_exchange_pub AS "IDPubExc",
								EXC.type AS type,
								EXC.id_origin_address AS "idOriginAddress",
								EXC.id_origin_currency AS "idOriginCurrency",
								EXC.id_destiny_address AS "idDestinyAddress",
					...
```

#### prc_mng.sp_get_exchange_limits
- **Type:** function
- **Arguments:** `_id_operation_route integer, _id_verification integer, _id_exchange_type integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_exchange_limits(_id_operation_route integer, _id_verification integer, _id_exchange_type integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				resp_obj JSONB;
				min_amount JSONB;
				max_amount JSONB;
				amount_limits JSON;
			BEGIN

				IF (_id_operation_route IS NULL AND _id_verification IS NULL AND _id_exchange_type IS NULL)
				THEN
					SELECT json_agg(ALS.*) INTO amount_limits
					FROM (
							SELECT
									AL.id_amount_limit,
	...
```

#### prc_mng.sp_get_exchange_logs
- **Type:** function
- **Arguments:** `_id_exchange bigint`
- **Returns:** `TABLE("idLogAction" integer, "idExchange" character varying, "logActionDate" integer, department character varying, username character varying, action character varying, "actionValue" character varying, comment character varying, active boolean)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_exchange_logs(_id_exchange bigint)
 RETURNS TABLE("idLogAction" integer, "idExchange" character varying, "logActionDate" integer, department character varying, username character varying, action character varying, "actionValue" character varying, comment character varying, active boolean)
 LANGUAGE plpgsql
AS $function$
BEGIN
				return query
					select
						laci.id_log_action::int,
						laci.id_exchange_pub,
						EXTRACT(EPOCH FROM laci.log_action_d...
```

#### prc_mng.sp_get_exchange_range_rates
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_exchange_range_rates()
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				resp_obj JSON;
				range_rates JSON;
			BEGIN
				SELECT json_agg(ST.*) INTO range_rates
				FROM (
						SELECT RR.id_exchange_range_rate,RR.lower_limit,RR.upper_limit,RR.id_rate_type,
							RR.id_operation_route,RR.active,
							EXTRACT(EPOCH FROM RR.date_creation) AS date_creation,
							EXTRACT(EPOCH FROM RR.date_last_modif) AS date_last_modif,
							RT.rate_type_nam...
```

#### prc_mng.sp_get_exchange_rates
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_exchange_rates()
 RETURNS json
 LANGUAGE plpgsql
AS $function$
begin
    -- missing source code
end;
$function$

```

#### prc_mng.sp_get_exchange_status
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_exchange_status()
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				resp_obj JSON;
				ppl_status JSON;
				pub_status JSON;
				atc_rev_status JSON;
				buy_cycle_status JSON;
				sell_cycle_status JSON;
				bank_verif_status JSON;
				pause_status JSON;
				claim_status JSON;
				ok_transf_status JSON;
				transf_status JSON;
				ok_award_status JSON;
				award_status JSON;
				notif_client_status JSON;
				modified_status JSON;
			BEGIN
				SE...
```

#### prc_mng.sp_get_exchange_types
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_exchange_types()
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				resp_obj JSON;
				exchange_types JSON;
			BEGIN
				SELECT json_agg(ST.*) INTO exchange_types
				FROM prc_mng.ms_exchange_types AS ST;

				resp_obj := json_build_object(
												'exchange_types', exchange_types
											);
				RETURN resp_obj;
			END;
$function$

```

#### prc_mng.sp_get_exchanges
- **Type:** function
- **Arguments:** `p_id_currency integer`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_exchanges(p_id_currency integer)
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
    v_json_resp                         json[];
begin
    select array(
        select json_build_object(
            'idExchange', exc.id_exchange,
            'name', exc.name
        )
        from ord_sch.ms_exchanges exc
        where exists(
            select *
            from prc_mng.ms_exchange_accounts acc
            inner join prc_mng.lnk_exchange_accoun...
```

#### prc_mng.sp_get_exchanges_info
- **Type:** function
- **Arguments:** `p_origin_address integer[], p_origin_currency integer[], p_destiny_address integer[], p_destiny_currency integer[], p_full_range boolean, p_init_date bigint, p_close_date bigint, p_pub_id_client character varying, p_pub_id_exchange character varying, p_id_exchange bigint, p_init_exchange boolean, p_match_word character varying`
- **Returns:** `TABLE("NroExc" bigint, "IDPubExc" character varying, type character varying, "idOriginAddress" integer, "idOriginCurrency" integer, "idDestinyAddress" integer, "idDestinyCurrency" integer, "originAddress" text, "originDecimalsQuant" integer, "originAddressIsoCode" character varying, "originCurrencyIsoCode" character varying, "destinyAddress" text, "destinyDecimalsQuant" integer, "destinyAddressIsoCode" character varying, "destinyCurrencyIsoCode" character varying, "dateCreated" bigint, "dateClosed" bigint, "pplStatus" character varying, "atcRevStatus" character varying, "verifBankStatus" character varying, "buyCycleStatus" character varying, "sellCycleStatus" character varying, "okAwardStatus" character varying, "awardStatus" character varying, "okTransfStatus" character varying, "transfStatus" character varying, "notifClientStatus" character varying, "pauseStatus" character varying, "claimStatus" character varying, "pubStatus" character varying, "modifiedStatus" character varying, "clientPubCode" character varying, "depAmount" double precision, fee double precision, "totalOriginAmount" double precision, "totalDestinyAmount" double precision, "rateType" character varying, rate double precision, "rsAtc" character varying, "rsVrfBnk" character varying, "rsBuyCycle" character varying, "rsSellCycle" character varying, "rsTransf" character varying, "rsNotif" character varying, "clientName" character varying, "clientDocNumber" character varying, "clientEmail" character varying, "clientPhone" character varying, "originBank" character varying, "accountNumber" character varying, "exchangeType" text, network json)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_exchanges_info(p_origin_address integer[], p_origin_currency integer[], p_destiny_address integer[], p_destiny_currency integer[], p_full_range boolean, p_init_date bigint, p_close_date bigint, p_pub_id_client character varying, p_pub_id_exchange character varying, p_id_exchange bigint, p_init_exchange boolean, p_match_word character varying)
 RETURNS TABLE("NroExc" bigint, "IDPubExc" character varying, type character varying, "idOriginAddress" integer, ...
```

#### prc_mng.sp_get_operation_routes
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_operation_routes()
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				resp_obj JSON;
				operation_routes JSON;
			BEGIN
				SELECT json_agg(ST.*) INTO operation_routes
				FROM (SELECT OP.id_operation_route,
							OP.cost_factor,
							OP.operation,
							EXTRACT(EPOCH FROM OP.date_cost_modif)::BIGINT AS date_cost_modif,
							OP.id_origin_address,
							OP.id_destiny_address,
							OP.id_origin_currency,
							OP.id_destiny_currency,
				...
```

#### prc_mng.sp_get_origin_commission
- **Type:** function
- **Arguments:** `p_id_currency integer, p_type character varying, p_amount double precision`
- **Returns:** `double precision`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_origin_commission(p_id_currency integer, p_type character varying, p_amount double precision)
 RETURNS double precision
 LANGUAGE plpgsql
AS $function$
declare
    v_percentage                        float;
begin
    case
        when p_type = 'Normal' then
            select per.normal_fee into v_percentage
            from prc_mng.ms_origin_fee_commission_percentages per
            where id_origin_currency = p_id_currency;
        when p_type = 'Prefe...
```

#### prc_mng.sp_get_origin_commission_fee_percentages
- **Type:** function
- **Arguments:** `p_percentages json[]`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_origin_commission_fee_percentages(p_percentages json[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    v_percentage                        json;
begin
    foreach v_percentage in array p_percentages loop
        update prc_mng.ms_origin_fee_commission_percentages
        set normal_fee = (v_percentage ->> 'normalFee')::float, preferential_fee = (v_percentage ->> 'preferentialFee')::float, mayor_fee = (v_percentage ->> 'mayorFee')::float
      ...
```

#### prc_mng.sp_get_origin_transaction_country
- **Type:** function
- **Arguments:** `p_id_transaction bigint`
- **Returns:** `integer`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_origin_transaction_country(p_id_transaction bigint)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
declare
    v_id_origin_country                 int;
begin
    select rat.id_origin_country
    into v_id_origin_country
    from prc_mng.ms_cr_origin_transactions tr
    inner join prc_mng.lnk_cr_remittances rem on tr.id_remittance = rem.id_remittance
    inner join sec_cust.ms_cr_manual_rate rat on rem.id_manual_rate = rat.id_manual_rate
    where tr.id...
```

#### prc_mng.sp_get_origin_transaction_types
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_origin_transaction_types()
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
    v_json_resp                     json[];
begin
    select array(
        select json_build_object(
            'idType', typ.id_transaction_type,
            'name', typ.name
        )
        from prc_mng.ms_origin_transaction_types typ
    )::json[] into v_json_resp;
    return v_json_resp;
end
$function$

```

#### prc_mng.sp_get_pending_external_transaction_exchanges
- **Type:** function
- **Arguments:** `_id_client integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_pending_external_transaction_exchanges(_id_client integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				pending_exchanges JSON;
			BEGIN
					SELECT json_agg(T.*) INTO pending_exchanges
						FROM (SELECT
									EX.*
								FROM prc_mng.lnk_cr_exchanges AS EX
								WHERE EX.id_client = _id_client
								AND EX.external_transaction_status = 'pending'
								AND EX.active = TRUE
								) AS T;

				return pending_exchanges;
			END
$fun...
```

#### prc_mng.sp_get_pending_transactions
- **Type:** function
- **Arguments:** `manual_transactions boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_pending_transactions(manual_transactions boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				resp_obj JSON;
			BEGIN
				SELECT json_agg(PT.id_pending_transaction) INTO resp_obj
				FROM prc_mng.lnk_pending_transactions AS PT
				WHERE PT.manual_transaction = manual_transactions
				AND PT.pending =  TRUE
				AND PT.active = TRUE;

				return resp_obj;
			END;
$function$

```

#### prc_mng.sp_get_range_rates_and_fee
- **Type:** function
- **Arguments:** `p_id_currency_origin integer, p_id_currency_destiny integer, p_id_country_origin integer, p_id_country_destiny integer, p_id_bh_user character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_range_rates_and_fee(p_id_currency_origin integer, p_id_currency_destiny integer, p_id_country_origin integer, p_id_country_destiny integer, p_id_bh_user character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_json_resp                             json;
    v_email                                 varchar;
    v_rates                                 json;
    v_manual_rates                          json;
    v_rate                   ...
```

#### prc_mng.sp_get_remittance_data_to_third
- **Type:** function
- **Arguments:** `p_origin_country character, p_destiny_country character`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_remittance_data_to_third(p_origin_country character, p_destiny_country character)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_id_origin_country                 int;
    v_origin_country_in_eu              boolean;
    v_id_destiny_country                int;
    v_destiny_country_in_eu             boolean;
    v_json_resp                         json;
begin

    -- se buscan los id de los paises que se van a requerir para la remesa

    s...
```

#### prc_mng.sp_get_remittance_extract_data
- **Type:** function
- **Arguments:** `p_id_remittances bigint[], p_username character varying`
- **Returns:** `TABLE("NroRem" bigint, "IDPubRem" character varying, type character varying, "originCountry" character varying, "originCurrency" character varying, "destinyCountry" character varying, "destinyCurrency" character varying, "dateCreated" timestamp without time zone, "statusPpl" character varying, "atcRev" character varying, "verifBank" character varying, "buyCycle" character varying, "sellCycle" character varying, "toTranfDest" character varying, "tranfDest" character varying, "notifClient" character varying, "notifBenef" character varying, "pauseStatus" character varying, "claimStatus" character varying, "pubStatus" character varying, "clientPubCode" character varying, "totalBenef" integer, "depAmount" double precision, comission double precision, "totalOriginAmount" double precision, "rateType" character varying, rate double precision, "totalDestinyAmount" double precision, "rsAtc" character varying, "rsVrfBnk" character varying, "rsBuyCycle" character varying, "rsSellCycle" character varying, "rsTranf" character varying, "rsNotif" character varying, "clientName" character varying, "clientDocNumber" character varying, "clientEmail" character varying, "clientPhone" character varying, "originBank" character varying, "accountNumber" character varying, "beneficiaryName" character varying, "payType" character varying, "benefBank" character varying, "benefaAccountNumber" character varying, "docType" character varying, "benefIdentNumber" character varying, "partialOriginAmount" double precision, "partialDestinyAmount" double precision, "phoneChanged" boolean)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_remittance_extract_data(p_id_remittances bigint[], p_username character varying)
 RETURNS TABLE("NroRem" bigint, "IDPubRem" character varying, type character varying, "originCountry" character varying, "originCurrency" character varying, "destinyCountry" character varying, "destinyCurrency" character varying, "dateCreated" timestamp without time zone, "statusPpl" character varying, "atcRev" character varying, "verifBank" character varying, "buyCycle" cha...
```

#### prc_mng.sp_get_remittance_info
- **Type:** function
- **Arguments:** `p_origin_country character, p_destiny_country character`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_remittance_info(p_origin_country character, p_destiny_country character)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_id_origin_country                 int;
    v_origin_country_in_eu              boolean;
    v_id_destiny_country                int;
    v_destiny_country_in_eu             boolean;
    v_id_origin_currency                 int;
    v_json_resp                         json;
begin

    -- se buscan los id de los pai...
```

#### prc_mng.sp_get_remittance_log_actions
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_remittance_log_actions()
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				resp_obj JSON;
			BEGIN
				SELECT json_agg(L.*) INTO resp_obj
				FROM prc_mng.ms_remittance_log_actions AS L;

				RETURN resp_obj;
			END;
$function$

```

#### prc_mng.sp_get_remittance_min_amounts
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_remittance_min_amounts()
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				resp_obj JSON;
			BEGIN
				SELECT json_agg(RR.*) INTO resp_obj
					FROM (SELECT DISTINCT
							R.min_amount,
							(SELECT CC.id_country
							FROM sec_cust.lnk_country_currency AS CC
							WHERE CC.id_cou_cur = R.id_cou_cur_origin) AS id_country_origin,
							(SELECT CC.id_currency
							FROM sec_cust.lnk_country_currency AS CC
							WHERE CC.id_cou_cur = R.id_co...
```

#### prc_mng.sp_get_remittance_status
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_remittance_status()
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				resp_obj JSON;
				ppl_status JSON;
				pub_status JSON;
				atc_rev_status JSON;
				buy_cycle_status JSON;
				sell_cycle_status JSON;
				bank_verif_status JSON;
				pause_status JSON;
				claim_status JSON;
				benef_notif_status JSON;
			BEGIN
				SELECT json_agg(ST.*) INTO ppl_status
				FROM prc_mng.ms_remittance_principal_status AS ST;

				SELECT json_agg(ST.*) INTO pu...
```

#### prc_mng.sp_get_remittances_by_month
- **Type:** function
- **Arguments:** `p_month integer, p_year integer`
- **Returns:** `TABLE(client_name character varying, id_pub_client character varying, verif_level integer, total_benef integer, origin_country character varying, destiny_country character varying, origin_currency double precision, destiny_currency double precision, rate double precision, rate_type character varying, date_created timestamp with time zone, date_closed timestamp with time zone)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_remittances_by_month(p_month integer, p_year integer)
 RETURNS TABLE(client_name character varying, id_pub_client character varying, verif_level integer, total_benef integer, origin_country character varying, destiny_country character varying, origin_currency double precision, destiny_currency double precision, rate double precision, rate_type character varying, date_created timestamp with time zone, date_closed timestamp with time zone)
 LANGUAGE plpgsq...
```

#### prc_mng.sp_get_sell_cycle_operations_record
- **Type:** function
- **Arguments:** `p_id_sell_cycle integer, p_id_currency integer[]`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_sell_cycle_operations_record(p_id_sell_cycle integer, p_id_currency integer[])
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
    v_id_sell_cycle                     int;
    v_json_resp                         json[];
begin
    if (p_id_sell_cycle = 0) then
        select sc.id_sell_cycle into v_id_sell_cycle
        from prc_mng.ms_sell_cycles sc
        where sc.date_closed is null;
    else
        v_id_sell_cycle := p_id_sell_cycle;
    end...
```

#### prc_mng.sp_get_sell_cycle_pending_transactions
- **Type:** function
- **Arguments:** `p_id_currency integer, p_id_sell_cycle integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_sell_cycle_pending_transactions(p_id_currency integer, p_id_sell_cycle integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_id_sell_cycle                     int;
begin
    if (p_id_sell_cycle is null or p_id_sell_cycle = 0) then
        select cyc.id_sell_cycle into v_id_sell_cycle
        from prc_mng.ms_sell_cycles cyc
        where cyc.date_closed is null;
    else
        v_id_sell_cycle := p_id_sell_cycle;
    end if;
    return jso...
```

#### prc_mng.sp_get_sell_cycle_pending_transactions_bank_accounts_details
- **Type:** function
- **Arguments:** `p_id_currency integer, p_id_sell_cycle integer`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_sell_cycle_pending_transactions_bank_accounts_details(p_id_currency integer, p_id_sell_cycle integer)
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
    v_json_resp                         json[];
begin
    select array(
        select json_build_object(
            'country', cou.viewing_name,
            'countryIsoCod', cou.country_iso_code,
            'bank', ban.name,
            'balance', (
                select sum(bal.amount)::decimal...
```

#### prc_mng.sp_get_sell_cycle_pending_transactions_general
- **Type:** function
- **Arguments:** `p_id_currency integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_sell_cycle_pending_transactions_general(p_id_currency integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_currency_iso_cod                  varchar;
    v_id_sell_cycle                     int;
    v_total_to_obtain                   float;
    v_total_to_obtain_verified          float;
    v_total_fiat_obtained               float;
    v_btc_used                          float;
    v_usdt_used                         float;
    v_total_...
```

#### prc_mng.sp_get_sell_cycles
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_sell_cycles()
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
begin
    return array(
        select json_build_object(
            'idSellCycle', sc.id_sell_cycle,
            'name', sc.name_cycle
        )
        from prc_mng.ms_sell_cycles sc
    );
end;
$function$

```

#### prc_mng.sp_get_transaction_by_conf_number
- **Type:** function
- **Arguments:** `_confirmation_number character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_transaction_by_conf_number(_confirmation_number character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				id_transaction	INT;
				or_transaction	JSON;
			BEGIN
				SELECT json_agg(OT.*) INTO or_transaction
				FROM prc_mng.ms_cr_origin_transactions OT
				WHERE OT.active = TRUE
				AND OT.confirmation_number = _confirmation_number;

				RETURN or_transaction->0;
			END
$function$

```

#### prc_mng.sp_get_transfers_to_do_ven
- **Type:** function
- **Arguments:** `p_rate_ved_usd double precision`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_transfers_to_do_ven(p_rate_ved_usd double precision)
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
begin
    -- missing source code
end;
$function$

```

#### prc_mng.sp_get_unconfirmed_exchanges
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_unconfirmed_exchanges()
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				resp_obj JSON;
			BEGIN
				SELECT json_agg(T.*) INTO resp_obj
				FROM 	(SELECT EXC.id_exchange, CU.iso_cod as "nameCurrency", OT.confirmation_number AS "confirmationNumber", WA.number AS wallet
						FROM prc_mng.lnk_cr_exchanges AS EXC, prc_mng.ms_operation_routes AS OPR, sec_cust.ms_currencies AS CU, prc_mng.ms_cr_origin_transactions AS OT, sec_cust.ms_wallets AS WA
			...
```

#### prc_mng.sp_get_user_actions
- **Type:** function
- **Arguments:** `p_id_user bigint, p_username character varying`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_user_actions(p_id_user bigint, p_username character varying)
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
				v_resp                      json[];
			begin
				if not exists(
					select *
					from sec_emp.ms_sixmap_users us
					inner join sec_emp.ms_profiles pr on us.uuid_profile = pr.uuid_profile
					inner join sec_emp.lnk_profiles_roles lpr on pr.uuid_profile = lpr.uuid_profile
					inner join sec_emp.ms_roles ro on lpr.uuid_role = ro.uui...
```

#### prc_mng.sp_get_users_in_turn
- **Type:** function
- **Arguments:** `p_username character varying`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_users_in_turn(p_username character varying)
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
    v_profile_user                  varchar;
    v_resp                          json[];
begin
    select pr.name_profile into v_profile_user
    from sec_emp.ms_sixmap_users us
    inner join sec_emp.ms_profiles pr on us.uuid_profile = pr.uuid_profile
    where us.username = p_username;
    select array(
        select json_build_object(
            'idUs...
```

#### prc_mng.sp_get_wallets
- **Type:** function
- **Arguments:** `only_company boolean, _email_user character varying, _id_currency integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_get_wallets(only_company boolean, _email_user character varying, _id_currency integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				wallets	JSON;
			BEGIN

				IF (only_company = TRUE) THEN
					SELECT json_agg(T.*) INTO wallets
						FROM (SELECT
									WA.*,
									(SELECT CU.id_currency
									FROM sec_cust.ms_currencies AS CU, prc_mng.ms_networks AS N
									WHERE CU.id_currency = N.id_currency
									AND WA.id_network = N.id_netwo...
```

#### prc_mng.sp_insert_exchange_address
- **Type:** function
- **Arguments:** `none`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_insert_exchange_address()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
				INSERT INTO prc_mng.ms_exchange_address(name,id_country,iso_code)
					SELECT CO.viewing_name, CO.id_country, CO.country_iso_code
					FROM sec_emp.ms_countries CO
					ORDER BY CO.id_country;

				INSERT INTO prc_mng.ms_exchange_address(name,id_platform)
					SELECT CO.name, CO.id_exchange
					FROM ord_sch.ms_exchanges CO
					ORDER BY CO.id_exchange;

				UPDATE prc_mng.ms_e...
```

#### prc_mng.sp_insert_exchange_log
- **Type:** function
- **Arguments:** `_action_value character varying, _action_comment character varying, _username character varying, _id_exchange integer, _id_action integer, _alert boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_insert_exchange_log(_action_value character varying, _action_comment character varying, _username character varying, _id_exchange integer, _id_action integer, _alert boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					succesfully_updated INT;
					_uuid_user UUID;
				BEGIN
					SELECT uuid_user INTO _uuid_user
					FROM sec_emp.ms_sixmap_users
					WHERE username = _username;

					INSERT INTO prc_mng.ms_log_action_com(
...
```

#### prc_mng.sp_insert_exchange_rate
- **Type:** function
- **Arguments:** `_id_exchange_rate integer, _rate_factor double precision, _profit_margin double precision`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_insert_exchange_rate(_id_exchange_rate integer, _rate_factor double precision, _profit_margin double precision)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					resp_obj_socket JSONB;
					current_exchange_rate prc_mng.ms_exchange_rates%ROWTYPE;
					succesfully_updated INT;
				BEGIN
					UPDATE prc_mng.ms_exchange_rates
					SET active = false
					WHERE id_exchange_rate = _id_exchange_rate
					RETURNING * INTO current_excha...
```

#### prc_mng.sp_insert_exchange_response
- **Type:** function
- **Arguments:** `_id_exchange_pub character varying, _response json`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_insert_exchange_response(_id_exchange_pub character varying, _response json)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				resp_obj JSON;
				_err TEXT;
			BEGIN
				-- se guarda la respuesta
					INSERT INTO prc_mng.exchanges_responses(id_exchange_pub,response)
					VALUES(_id_exchange_pub,_response);
					IF FOUND THEN
						resp_obj := json_build_object(
								'message', 'Response successfuly inserted.'
								);
					ELSE
						RAISE EXCEP...
```

#### prc_mng.sp_insert_pending_balance
- **Type:** function
- **Arguments:** `_id_pending_transaction integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_insert_pending_balance(_id_pending_transaction integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				full_pending_transaction prc_mng.lnk_pending_transactions%ROWTYPE;
				current_exchange prc_mng.lnk_cr_exchanges%ROWTYPE;
				_done_id_bank_verif_status INT;
				_done_id_award_status INT;
				balance_resp JSON;
				resp_obj JSON;
				_err TEXT;
			BEGIN
			-- se busca la transaccion pendiente
				SELECT PT.* INTO full_pending_transaction
				FRO...
```

#### prc_mng.sp_insert_pending_transaction
- **Type:** function
- **Arguments:** `_id_operation text, _transaction_body json, _manual_transaction boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_insert_pending_transaction(_id_operation text, _transaction_body json, _manual_transaction boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				remittance_found INT;
				exchange_found INT;
				resp_obj JSON;
			BEGIN
				-- se busca si existe un intercambio o una remesa con ese id público

				SELECT R.id_remittance INTO remittance_found
				FROM prc_mng.lnk_cr_remittances AS R
				WHERE R.id_remittance_pub = _id_operation;

				SELECT E.id_ex...
```

#### prc_mng.sp_lnk_buy_cycle_operations_insert
- **Type:** function
- **Arguments:** `p_id_origin_currency bigint, p_id_exchange integer, p_id_crypto_currency bigint, p_id_bank_account bigint, p_id_exchange_account bigint, p_fiat_amount_used double precision, p_crypto_amount_obtained double precision, p_operation_cod character varying, p_username character varying, p_btc_amount_obtained double precision, p_fee_type character varying, p_ex_user character varying, p_ex_username character varying, p_id_ex_ident_type integer, p_ex_ident_number character varying, p_id_ex_bank integer, p_ex_bank_account character varying, p_ex_bank_account_holder character varying, p_ex_bank_verif_cod character varying, p_path_name character varying, p_btc_close boolean`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_lnk_buy_cycle_operations_insert(p_id_origin_currency bigint, p_id_exchange integer, p_id_crypto_currency bigint, p_id_bank_account bigint, p_id_exchange_account bigint, p_fiat_amount_used double precision, p_crypto_amount_obtained double precision, p_operation_cod character varying, p_username character varying, p_btc_amount_obtained double precision, p_fee_type character varying, p_ex_user character varying, p_ex_username character varying, p_id_ex_ident_ty...
```

#### prc_mng.sp_lnk_cr_exchange_init
- **Type:** function
- **Arguments:** `exchange_body json, _exchange_type character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_lnk_cr_exchange_init(exchange_body json, _exchange_type character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				_id_operation_route                	int;
				_id_origin_address                 	int;
				_id_origin_currency                	int;
				_id_destiny_address                	int;
				_id_destiny_currency               	int;
				_id_pay_method                    	int;
				_id_origin_bank                    	int;
				_id_account_ori...
```

#### prc_mng.sp_lnk_cr_exchanges_asing_emp
- **Type:** function
- **Arguments:** `_id_exchange bigint`
- **Returns:** `character varying`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_lnk_cr_exchanges_asing_emp(_id_exchange bigint)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
declare
				v_json_atc_asing	json;
				v_json_verf_asing	json;
			begin
				-- se asigna al operador ATC que se encargara de notificar al cliente sobre su remesa

				select prc_mng.sp_get_asing_emp('INTERCAMBIO', 'ATC', 'TO-NOTIF-CLIENTE', 'Oper%ATC') into v_json_atc_asing;
				insert into prc_mng.ms_user_process_asings (uuid_sixmap_user_asing, id_exch...
```

#### prc_mng.sp_lnk_cr_remittance_status_update_multiple
- **Type:** function
- **Arguments:** `p_id_remittance integer, p_status_change_info json, p_username character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_lnk_cr_remittance_status_update_multiple(p_id_remittance integer, p_status_change_info json, p_username character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_bank_verif_info                   json;
    v_ok_tranf_info                     json;
    v_tranf_info                        json;
    v_notif_benef_info                  json;
    v_notif_client_info                 json;
    v_status_modified                   varchar;
    v_...
```

#### prc_mng.sp_lnk_cr_remittances_asing_emp
- **Type:** function
- **Arguments:** `p_remittance_id bigint`
- **Returns:** `character varying`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_lnk_cr_remittances_asing_emp(p_remittance_id bigint)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
declare
    v_json_atc_asing                        json;
begin

    -- se asigna al operador ATC que se encargara de notificar al cliente sobre su remesa

    select prc_mng.sp_get_asing_emp('REMESA', 'ATC', 'TO-NOTIF-CLIENTE', 'Oper%ATC') into v_json_atc_asing;
    insert into prc_mng.ms_user_process_asings (uuid_sixmap_user_asing, id_remittance,...
```

#### prc_mng.sp_lnk_cr_remittances_atc_rev_status_change
- **Type:** function
- **Arguments:** `p_id_remittance integer, p_id_rev_status integer, p_username character varying, p_comment character varying, p_alert boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_lnk_cr_remittances_atc_rev_status_change(p_id_remittance integer, p_id_rev_status integer, p_username character varying, p_comment character varying, p_alert boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
				v_rev_actual_status                 varchar;
				v_rev_new_status                    varchar;
				v_ppl_actual_status                 varchar;
				v_id_atc_rev_asing                  bigint;
			begin
				if not exists(
					select *
				...
```

#### prc_mng.sp_lnk_cr_remittances_bank_verif_status_change
- **Type:** function
- **Arguments:** `p_id_remittance integer, p_id_ver_status integer, p_verif_number json[], p_username character varying, p_comment character varying, p_alert boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_lnk_cr_remittances_bank_verif_status_change(p_id_remittance integer, p_id_ver_status integer, p_verif_number json[], p_username character varying, p_comment character varying, p_alert boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_ver_actual_status                 varchar;
    v_rev_actual_status                 varchar;
    v_tranf_status                      boolean;
    v_ver_new_status                    varchar;
    v_capture      ...
```

#### prc_mng.sp_lnk_cr_remittances_buy_cycle_status_change
- **Type:** function
- **Arguments:** `p_id_remittance integer, p_id_buy_cycle_status integer, p_username character varying, p_comment character varying, p_alert boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_lnk_cr_remittances_buy_cycle_status_change(p_id_remittance integer, p_id_buy_cycle_status integer, p_username character varying, p_comment character varying, p_alert boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
				v_buy_cycle_actual_status       varchar;
				v_buy_cycle_new_status          varchar;
				v_ppl_actual_status             varchar;
			begin
				if not exists(
					select *
					from sec_emp.ms_sixmap_users us
					inner join sec...
```

#### prc_mng.sp_lnk_cr_remittances_cancel
- **Type:** function
- **Arguments:** `p_id_remittance integer, p_username character varying, p_comment character varying, p_alert boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_lnk_cr_remittances_cancel(p_id_remittance integer, p_username character varying, p_comment character varying, p_alert boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_ppl_actual_status             varchar;
    v_pub_actual_status             varchar;
begin
    select ppl.name, pub.name into v_ppl_actual_status, v_pub_actual_status
    from prc_mng.lnk_cr_remittances rem
    inner join prc_mng.ms_remittance_principal_status ppl on rem.id_p...
```

#### prc_mng.sp_lnk_cr_remittances_claim_status_change
- **Type:** function
- **Arguments:** `p_id_remittance integer, p_id_claim_status integer, p_username character varying, p_comment character varying, p_alert boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_lnk_cr_remittances_claim_status_change(p_id_remittance integer, p_id_claim_status integer, p_username character varying, p_comment character varying, p_alert boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
				v_claim_actual_status           varchar;
				v_claim_new_status              varchar;
				v_pause_actual_status           varchar;
				v_ppl_actual_status             varchar;
				v_status_change                 json;
			begin
				v_stat...
```

#### prc_mng.sp_lnk_cr_remittances_complete
- **Type:** function
- **Arguments:** `p_id_remittance integer, p_transfer_name character varying, p_verif_number character varying, p_confirm_number character varying, p_beneficiaries jsonb[], p_username character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_lnk_cr_remittances_complete(p_id_remittance integer, p_transfer_name character varying, p_verif_number character varying, p_confirm_number character varying, p_beneficiaries jsonb[], p_username character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_id_remittance                 int;
    v_rem_date_closed               int;
    v_id_origin_transaction         int;
    v_id_bank_account_origin        int;
    v_beneficiary        ...
```

#### prc_mng.sp_lnk_cr_remittances_get_info
- **Type:** function
- **Arguments:** `p_full_range boolean, p_id_public_status integer, p_init_date bigint, p_close_date bigint, p_pub_id_client character varying, p_id_remittance bigint`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_lnk_cr_remittances_get_info(p_full_range boolean, p_id_public_status integer, p_init_date bigint, p_close_date bigint, p_pub_id_client character varying, p_id_remittance bigint)
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
begin
    -- missing source code
end;
$function$

```

#### prc_mng.sp_lnk_cr_remittances_get_info_pag
- **Type:** function
- **Arguments:** `p_full_range boolean, p_id_public_status integer, p_init_date bigint, p_close_date bigint, p_pub_id_client character varying, p_id_remittance bigint, p_type character varying, p_id_origin_country integer, p_id_destiny_country integer, p_match_word character varying, quantity integer, page integer`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_lnk_cr_remittances_get_info_pag(p_full_range boolean, p_id_public_status integer, p_init_date bigint, p_close_date bigint, p_pub_id_client character varying, p_id_remittance bigint, p_type character varying, p_id_origin_country integer, p_id_destiny_country integer, p_match_word character varying, quantity integer, page integer)
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
    v_json_resp                     json[];
    v_init_date             ...
```

#### prc_mng.sp_lnk_cr_remittances_get_info_pag_fix
- **Type:** function
- **Arguments:** `p_full_range boolean, p_init_date bigint, p_close_date bigint, p_id_public_status integer, p_pub_id_client character varying, p_id_remittance bigint, p_type character varying, p_id_origin_country integer, p_id_destiny_country integer, p_quantity integer, p_page integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_lnk_cr_remittances_get_info_pag_fix(p_full_range boolean, p_init_date bigint, p_close_date bigint, p_id_public_status integer, p_pub_id_client character varying, p_id_remittance bigint, p_type character varying, p_id_origin_country integer, p_id_destiny_country integer, p_quantity integer, p_page integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_init_date                     bigint;
    v_close_date                    bigint;
    v_tot...
```

#### prc_mng.sp_lnk_cr_remittances_init
- **Type:** function
- **Arguments:** `p_id_cr_user integer, p_notepad text[], p_id_origin_country integer, p_id_origin_currency integer, p_id_origin_bank integer, p_id_origin_account integer, p_third_party_transfer json, p_captures json[], p_total_origin_amount double precision, p_comission double precision, p_total_origin_remittance double precision, p_total_local_origin_remittance double precision, p_total_dollar_origin_remittance double precision, p_id_rate_type integer, p_id_destiny_country integer, p_id_destiny_currency integer, p_total_destiny_remittance double precision, p_beneficiaries json[], p_comments json[], _mode character varying, p_rate_category character varying, p_id_automatic_rate bigint, p_id_manual_rate bigint, p_id_special_rate bigint, p_id_vip_rate bigint, p_operation character varying, p_rate_factor double precision, _wholesale_partner_profit_local_currency double precision, _wholesale_partner_profit_dollar double precision, _wholesale_partner_profit double precision, _total_wholesale_partner_origin_amount double precision`
- **Returns:** `character varying`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_lnk_cr_remittances_init(p_id_cr_user integer, p_notepad text[], p_id_origin_country integer, p_id_origin_currency integer, p_id_origin_bank integer, p_id_origin_account integer, p_third_party_transfer json, p_captures json[], p_total_origin_amount double precision, p_comission double precision, p_total_origin_remittance double precision, p_total_local_origin_remittance double precision, p_total_dollar_origin_remittance double precision, p_id_rate_type intege...
```

#### prc_mng.sp_lnk_cr_remittances_notif_benef_status_change
- **Type:** function
- **Arguments:** `p_id_remittance integer, p_notif_benef_status integer, p_username character varying, p_comment character varying, p_alert boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_lnk_cr_remittances_notif_benef_status_change(p_id_remittance integer, p_notif_benef_status integer, p_username character varying, p_comment character varying, p_alert boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_notif_client_actual_status        boolean;
    v_notif_benef_actual_status         varchar;
    v_transf_status                     boolean;
    v_notif_benef_new_status            varchar;
    v_ppl_actual_status             ...
```

#### prc_mng.sp_lnk_cr_remittances_notif_client_status_change
- **Type:** function
- **Arguments:** `p_id_remittance integer, p_notif_client_status boolean, p_username character varying, p_comment character varying, p_alert boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_lnk_cr_remittances_notif_client_status_change(p_id_remittance integer, p_notif_client_status boolean, p_username character varying, p_comment character varying, p_alert boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_notif_client_actual_status        boolean;
    v_notif_client_actual_status_value  varchar;
    v_notif_client_new_status_value     varchar;
    v_notif_benef_actual_status         varchar;
    v_transf_status               ...
```

#### prc_mng.sp_lnk_cr_remittances_ok_transf_status_change
- **Type:** function
- **Arguments:** `p_id_remittance integer, p_ok_tranf_status boolean, p_bank_accounts json[], p_username character varying, p_comment character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_lnk_cr_remittances_ok_transf_status_change(p_id_remittance integer, p_ok_tranf_status boolean, p_bank_accounts json[], p_username character varying, p_comment character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_bank_verif_status             varchar;
    v_tranf_status                  boolean;
    v_bank_account                  json;
    v_ppl_actual_status             varchar;
    v_to_tranf_actual_status        boolean;
    v_st...
```

#### prc_mng.sp_lnk_cr_remittances_pause_status_change
- **Type:** function
- **Arguments:** `p_id_remittance integer, p_id_pause_status integer, p_username character varying, p_comment character varying, p_alert boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_lnk_cr_remittances_pause_status_change(p_id_remittance integer, p_id_pause_status integer, p_username character varying, p_comment character varying, p_alert boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
				v_pause_actual_status           varchar;
				v_pause_new_status              varchar;
				v_ok_tranf_status               boolean;
				v_pub_actual_status             varchar;
				v_ppl_actual_status             varchar;
				v_status_cha...
```

#### prc_mng.sp_lnk_cr_remittances_register_billing_data
- **Type:** function
- **Arguments:** `p_id_remittance character varying, p_id_billing integer, p_billing_doc text, p_generic_doc boolean`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_lnk_cr_remittances_register_billing_data(p_id_remittance character varying, p_id_billing integer, p_billing_doc text, p_generic_doc boolean)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
    update prc_mng.lnk_cr_remittances
    set id_billing = p_id_billing, billing_doc = p_billing_doc, generic_doc_number = p_generic_doc
    where id_remittance_pub = p_id_remittance;
end;
$function$

```

#### prc_mng.sp_lnk_cr_remittances_register_transaction
- **Type:** function
- **Arguments:** `p_id_transaction bigint, p_fee double precision, p_ref_number character varying, p_file character varying, p_comment character varying, p_username character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_lnk_cr_remittances_register_transaction(p_id_transaction bigint, p_fee double precision, p_ref_number character varying, p_file character varying, p_comment character varying, p_username character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_id_remittance                     bigint;
    v_transaction_done                  boolean;
    v_id_bank_account                   int;
    v_uuid_user                         uuid;
    v_id...
```

#### prc_mng.sp_lnk_cr_remittances_sell_cycle_status_change
- **Type:** function
- **Arguments:** `p_id_remittance integer, p_id_sell_cycle_status integer, p_username character varying, p_comment character varying, p_alert boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_lnk_cr_remittances_sell_cycle_status_change(p_id_remittance integer, p_id_sell_cycle_status integer, p_username character varying, p_comment character varying, p_alert boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
				v_sell_cycle_actual_status      varchar;
				v_sell_cycle_new_status         varchar;
				v_ppl_actual_status             varchar;
			begin
				if not exists(
					select *
					from sec_emp.ms_sixmap_users us
					inner join s...
```

#### prc_mng.sp_lnk_cr_remittances_transf_status_change
- **Type:** function
- **Arguments:** `p_id_remittance integer, p_tranf_status boolean, p_tranfs_info json[], p_username character varying, p_comment character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_lnk_cr_remittances_transf_status_change(p_id_remittance integer, p_tranf_status boolean, p_tranfs_info json[], p_username character varying, p_comment character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_ok_tranf_status               boolean;
    v_tranf_info                    json;
    v_tranf_actual_status           boolean;
    v_ppl_actual_status             varchar;
    v_status_change                 json;
    v_id_tranf_asin...
```

#### prc_mng.sp_lnk_internal_operations
- **Type:** function
- **Arguments:** `p_id_origin_bank_account integer, p_id_destiny_bank_account integer, p_amount double precision, p_commission_type character varying, p_commission double precision, p_ref_number character varying, p_file_route character varying, p_comment character varying, p_username character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_lnk_internal_operations(p_id_origin_bank_account integer, p_id_destiny_bank_account integer, p_amount double precision, p_commission_type character varying, p_commission double precision, p_ref_number character varying, p_file_route character varying, p_comment character varying, p_username character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_uuid_user                             uuid;
    v_id_cycle_balance                      big...
```

#### prc_mng.sp_lnk_netted_operations_insert
- **Type:** function
- **Arguments:** `p_id_bank_account integer, p_amount double precision, p_username character varying, p_btc_rate double precision, p_operation_cod character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_lnk_netted_operations_insert(p_id_bank_account integer, p_amount double precision, p_username character varying, p_btc_rate double precision, p_operation_cod character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    v_uuid_user                 uuid;
    v_id_buy_cycle              bigint;
    v_id_sell_cycle             bigint;
begin
    select u.uuid_user into v_uuid_user
    from sec_emp.ms_sixmap_users u
    where u.username = p_usernam...
```

#### prc_mng.sp_lnk_sell_cycle_operations_insert
- **Type:** function
- **Arguments:** `p_id_destiny_currency bigint, p_id_exchange integer, p_id_crypto_currency bigint, p_id_bank_account bigint, p_id_exchange_account bigint, p_fiat_amount_obtained double precision, p_crypto_amount_used double precision, p_operation_cod character varying, p_username character varying, p_btc_amount_used double precision, p_fee_type character varying, p_ex_user character varying, p_ex_username character varying, p_id_ex_ident_type integer, p_ex_ident_number character varying, p_id_ex_bank integer, p_ex_bank_account character varying, p_ex_bank_account_holder character varying, p_ex_bank_verif_cod character varying, p_path_name character varying, p_btc_close boolean`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_lnk_sell_cycle_operations_insert(p_id_destiny_currency bigint, p_id_exchange integer, p_id_crypto_currency bigint, p_id_bank_account bigint, p_id_exchange_account bigint, p_fiat_amount_obtained double precision, p_crypto_amount_used double precision, p_operation_cod character varying, p_username character varying, p_btc_amount_used double precision, p_fee_type character varying, p_ex_user character varying, p_ex_username character varying, p_id_ex_ident_type...
```

#### prc_mng.sp_lnk_user_consults_asing_emp
- **Type:** function
- **Arguments:** `p_consult prc_mng.lnk_user_consult`
- **Returns:** `character varying`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_lnk_user_consults_asing_emp(p_consult prc_mng.lnk_user_consult)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
declare
					v_json_asing                json;
				begin
					select prc_mng.sp_get_asing_emp('CONSULTA', 'ATC', 'RESP-CONSULTA', 'Oper%ATC') into v_json_asing;
					insert into prc_mng.ms_user_process_asings (uuid_sixmap_user_asing, id_consult, id_action)
					values ((v_json_asing ->> 'uuidUser')::uuid, p_consult.id_consult, (v_json_as...
```

#### prc_mng.sp_ms_bank_accounts_get_actual_balances
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE("idBankAccount" bigint, name character varying, amount double precision, currency character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_ms_bank_accounts_get_actual_balances()
 RETURNS TABLE("idBankAccount" bigint, name character varying, amount double precision, currency character varying)
 LANGUAGE plpgsql
AS $function$
begin
				return query
					select
						b.id_bank_account, b.name, b.amount, b.currency
					from prc_mng.v_bank_accounts_actual_balances b;
			end;
$function$

```

#### prc_mng.sp_ms_bank_accounts_get_movements_balance
- **Type:** function
- **Arguments:** `p_id_bank_account bigint`
- **Returns:** `double precision`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_ms_bank_accounts_get_movements_balance(p_id_bank_account bigint)
 RETURNS double precision
 LANGUAGE plpgsql
AS $function$
declare
				v_initial_balance               float;
				v_movement_balance              float;
			begin
				select ib.amount into v_initial_balance
				from prc_mng.lnk_bank_account_initial_balances ib
				inner join prc_mng.ms_cycle_balances b on ib.id_balance = b.id_balance
				where b.current_active = true
				and ib.id_bank_account = ...
```

#### prc_mng.sp_ms_bank_accounts_get_operations
- **Type:** function
- **Arguments:** `p_id_bank_account bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_ms_bank_accounts_get_operations(p_id_bank_account bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
				v_bank_account_info         json;
				v_bank_account_movements    json[];
			begin
				select json_build_object(
					'holder', ac.account_holder_name,
					'holderType', ac.account_holder_type,
					'accountType', ac.account_type,
					'currency', cu.iso_cod,
					'currencyAbrev', cu.currency_abrev,
					'bank', b.name
				) into v_bank_accoun...
```

#### prc_mng.sp_ms_buy_cycles_close
- **Type:** function
- **Arguments:** `none`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_ms_buy_cycles_close()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
				v_id_buy_cycle              bigint;
				v_buy_cycle_currencies      json;
				v_currency_info             json;
				v_cont                      int;
				v_to_use                    decimal(20,2);
				v_used                      decimal(20,2);
				v_diff                      decimal(20,2);
				v_btc_amount                decimal(20,8);
			begin
				select bc.id_buy_cycle into v_id...
```

#### prc_mng.sp_ms_buy_cycles_get_info
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_ms_buy_cycles_get_info()
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
				v_detail                    json;
				v_currencies                json[];
				v_operations                json[];
			begin
				select json_build_object(
					'idBuyCycle', bc.id_buy_cycle,
					'name', bc.name_cycle,
					'operations', bc.partial_operations,
					'buyBtc', (bc.total_buy_btc_amount)::decimal(20,8),
					'buyUsdt', (bc.total_buy_usdt_amount)::decimal(20,8),
				...
```

#### prc_mng.sp_ms_buy_cycles_open_new_cycle
- **Type:** function
- **Arguments:** `none`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_ms_buy_cycles_open_new_cycle()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
				v_name_cycle                varchar;
				v_id_buy_cycle              bigint;
				v_id_balance                bigint;
				v_origin_currencies         int[];
				v_id_origin_currency        int;
				v_asing_emp                 json;
			begin
				select b.id_balance into v_id_balance
				from prc_mng.ms_cycle_balances b
				where current_active = true;
				if v_id_balance i...
```

#### prc_mng.sp_ms_cr_destiny_transactions_get_by_id
- **Type:** function
- **Arguments:** `p_id_transaction bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_ms_cr_destiny_transactions_get_by_id(p_id_transaction bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_json_resp                             json;
begin
    select json_build_object(
        'idTransaction', ben.id_beneficiary,
        'amount', ben.partial_amount,
        'fee', coalesce(fee.amount, 0),
        'fiatIsoCod', cur.iso_cod,
        'reference', ben.tranf_ref_number,
        'file', ben.path_name,
        'name', b...
```

#### prc_mng.sp_ms_cr_origin_transaction_verify_no_duplicate_code
- **Type:** function
- **Arguments:** `p_id_bank_account bigint, p_bank_code character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_ms_cr_origin_transaction_verify_no_duplicate_code(p_id_bank_account bigint, p_bank_code character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_origin_transactions               varchar[];
begin
    select array(
        select rem.id_remittance_pub
        from prc_mng.ms_cr_origin_transactions tr
        inner join prc_mng.v_remittances_status_info rem on tr.id_remittance = rem.id_remittance
        inner join sec_cust.ms_ban...
```

#### prc_mng.sp_ms_cr_origin_transactions_get_all
- **Type:** function
- **Arguments:** `p_pending boolean, p_id_country integer, p_id_bank integer`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_ms_cr_origin_transactions_get_all(p_pending boolean, p_id_country integer, p_id_bank integer)
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
    v_json_resp                         json[];
begin
    select array(
        select json_build_object(
            'idOperation', tr.id_transaction,
            'idRemittance', rem.id_remittance,
            'crId', rem.id_remittance_pub,
            'name', concat(pri.first_name, ' ', pri.last_name...
```

#### prc_mng.sp_ms_cr_origin_transactions_get_by_id
- **Type:** function
- **Arguments:** `p_id_transaction bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_ms_cr_origin_transactions_get_by_id(p_id_transaction bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_json_resp                 json;
begin
    select json_build_object(
        'name', concat(pri.first_name, ' ', pri.last_name),
        'docType', dt.name_doc_type,
        'remittanceType', rem.type,
        'idOriginCountry', cou.id_country,
        'originCountry', cou.viewing_name,
        'originCountryIsoCod', cou.country_iso_code,
 ...
```

#### prc_mng.sp_ms_cr_origin_transactions_update
- **Type:** function
- **Arguments:** `p_id_remittance bigint, p_new_captures json[]`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_ms_cr_origin_transactions_update(p_id_remittance bigint, p_new_captures json[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
				v_capture                           json;
			begin
				update prc_mng.ms_cr_origin_transactions
				set active = false
				where id_remittance = p_id_remittance;
				foreach v_capture in array p_new_captures loop
					insert into prc_mng.ms_cr_origin_transactions
					(path_name, id_remittance, amount, confirmation_number)...
```

#### prc_mng.sp_ms_cr_origin_transactions_verify_transaction
- **Type:** function
- **Arguments:** `p_id_transaction bigint, p_verify boolean, p_id_origin_trans_type integer, p_id_bank_account integer, p_transfer_name character varying, p_date_received date, p_verif_number character varying, p_confirm_number character varying, p_comment character varying, p_username character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_ms_cr_origin_transactions_verify_transaction(p_id_transaction bigint, p_verify boolean, p_id_origin_trans_type integer, p_id_bank_account integer, p_transfer_name character varying, p_date_received date, p_verif_number character varying, p_confirm_number character varying, p_comment character varying, p_username character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    v_id_remittance                 bigint;
    v_verify_successful     ...
```

#### prc_mng.sp_ms_cycle_balance_open_new_balance
- **Type:** function
- **Arguments:** `p_initial_balances json[]`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_ms_cycle_balance_open_new_balance(p_initial_balances json[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    v_initial_balance           json;
    v_id_balance                bigint;
    v_id_accounts               int[];
    v_id_account                int;
begin
    if exists(
        select *
        from prc_mng.ms_cycle_balances b
        where current_active = true
    ) then
        raise exception 'Error opened daily balance. Is still open ...
```

#### prc_mng.sp_ms_exchange_accounts_get_operations
- **Type:** function
- **Arguments:** `p_id_exchange_account bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_ms_exchange_accounts_get_operations(p_id_exchange_account bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
				v_exchange_account_info         json;
				v_exchange_account_movements    json[];
			begin
				select json_build_object(
					'user', exa.username,
					'cod', exa.user_cod,
					'platform', ex.name
				) into v_exchange_account_info
				from prc_mng.ms_exchange_accounts exa
				inner join ord_sch.ms_exchanges ex on exa.id_exchange = ex...
```

#### prc_mng.sp_ms_frequents_beneficiaries_delete
- **Type:** function
- **Arguments:** `_id_beneficiary integer`
- **Returns:** `integer`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_ms_frequents_beneficiaries_delete(_id_beneficiary integer)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
BEGIN
						UPDATE prc_mng.ms_cr_frequents_beneficiaries
						SET active = false
						WHERE id_beneficiary = _id_beneficiary
						RETURNING id_beneficiary into _id_beneficiary;
						IF (_id_beneficiary IS NULL) THEN
							RAISE EXCEPTION 'Could not delete the object';
						ELSE
							RETURN _id_beneficiary;
						END IF;
					END;
$function$

```

#### prc_mng.sp_ms_frequents_beneficiaries_get_all
- **Type:** function
- **Arguments:** `_email_user character varying`
- **Returns:** `TABLE(id_beneficiary bigint, nickname character varying, owner_name character varying, identification character varying, account character varying, account_type character varying, phone_number character varying, email character varying, id_optional_field bigint, name_optional_field character varying, name_bank character varying, name_pay_method character varying, name_doc_type character varying, id_doc_type integer, id_bank integer, id_pay_method integer, country_code character varying, id_country integer, currency_name character varying, notification json, relation_type character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_ms_frequents_beneficiaries_get_all(_email_user character varying)
 RETURNS TABLE(id_beneficiary bigint, nickname character varying, owner_name character varying, identification character varying, account character varying, account_type character varying, phone_number character varying, email character varying, id_optional_field bigint, name_optional_field character varying, name_bank character varying, name_pay_method character varying, name_doc_type charact...
```

#### prc_mng.sp_ms_frequents_beneficiaries_insert
- **Type:** function
- **Arguments:** `_nickname character varying, _owner_name character varying, _identification character varying, _account character varying, _account_type character varying, _phone_number character varying, _email character varying, _id_doc_type integer, _id_bank integer, _email_user character varying, _id_pay_method integer, _id_optional_field integer, _relation_type character varying, _id_notification_type integer, _email_notif character varying, _phone_notif character varying, _address_notif character varying, _city_notif character varying`
- **Returns:** `TABLE(id_beneficiary bigint, nickname character varying, owner_name character varying, identification character varying, account character varying, account_type character varying, phone_number character varying, email character varying, id_doc_type integer, id_bank integer, id_pay_method integer, relation_type character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_ms_frequents_beneficiaries_insert(_nickname character varying, _owner_name character varying, _identification character varying, _account character varying, _account_type character varying, _phone_number character varying, _email character varying, _id_doc_type integer, _id_bank integer, _email_user character varying, _id_pay_method integer, _id_optional_field integer, _relation_type character varying, _id_notification_type integer, _email_notif character va...
```

#### prc_mng.sp_ms_frequents_beneficiaries_update
- **Type:** function
- **Arguments:** `_id_beneficiary integer, beneficiaryinfo jsonb`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_ms_frequents_beneficiaries_update(_id_beneficiary integer, beneficiaryinfo jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
						_query text;
						_property text;
					BEGIN
							_property := '';
							_query := 'update prc_mng.ms_cr_frequents_beneficiaries set ';
							IF (beneficiaryInfo->>'nickname' IS NOT NULL) THEN
								_property := beneficiaryInfo->>'nickname';
								_query := _query || 'nickname = ' || '''' || _property || '''';...
```

#### prc_mng.sp_ms_log_action_com_get
- **Type:** function
- **Arguments:** `p_id_remittance bigint`
- **Returns:** `TABLE("idLogAction" integer, "idRemittance" character varying, "logActionDate" bigint, department character varying, username character varying, action character varying, "actionValue" character varying, comment character varying, "operType" text, alert boolean, active boolean)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_ms_log_action_com_get(p_id_remittance bigint)
 RETURNS TABLE("idLogAction" integer, "idRemittance" character varying, "logActionDate" bigint, department character varying, username character varying, action character varying, "actionValue" character varying, comment character varying, "operType" text, alert boolean, active boolean)
 LANGUAGE plpgsql
AS $function$
begin
				return query
					select
						laci.id_log_action::int,
						laci.id_remittance_pub,
...
```

#### prc_mng.sp_ms_log_action_com_insert
- **Type:** function
- **Arguments:** `p_action_value character varying, p_action_comment character varying, p_username character varying, p_id_remittance integer, p_id_action integer, p_alert boolean`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_ms_log_action_com_insert(p_action_value character varying, p_action_comment character varying, p_username character varying, p_id_remittance integer, p_id_action integer, p_alert boolean)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
				id uuid;
			begin
				select uuid_user into id from sec_emp.ms_sixmap_users where username = p_username;
				insert into prc_mng.ms_log_action_com(action_value, action_comment, id_uuid_user, id_remittance, id_action,...
```

#### prc_mng.sp_ms_req_workflow_asing_actions_change_asing_method
- **Type:** function
- **Arguments:** `p_id_action integer, p_asing_type character varying, p_to_coordinator boolean`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_ms_req_workflow_asing_actions_change_asing_method(p_id_action integer, p_asing_type character varying, p_to_coordinator boolean)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
				v_actual_asing_type         varchar;
				v_actual_to_coord           boolean;
			begin
				if ((p_asing_type != 'DEALER' and p_asing_type != 'BALANCING') or p_to_coordinator is null) then
					raise exception 'Invalid asing type';
				end if;
				select w.asig_type, w.to_grp...
```

#### prc_mng.sp_ms_sell_cycles_close
- **Type:** function
- **Arguments:** `none`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_ms_sell_cycles_close()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
				v_id_sell_cycle             bigint;
				v_sell_cycle_currencies     json;
				v_currency_info             json;
				v_cont                      int;
				v_to_obtain                 decimal(20,2);
				v_obtained                  decimal(20,2);
				v_diff                      decimal(20,2);
				v_btc_amount                decimal(20,8);
			begin
				select sc.id_sell_cycle into v_...
```

#### prc_mng.sp_ms_sell_cycles_get_info
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_ms_sell_cycles_get_info()
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
				v_detail                    json;
				v_currencies                json[];
				v_operations                json[];
			begin
				select json_build_object(
					'idSellCycle', sc.id_sell_cycle,
					'name', sc.name_cycle,
					'operations', sc.partial_operations,
					'sellBtc', (sc.total_sell_btc_amount)::decimal(20,8),
					'sellUsdt', (sc.total_sell_usdt_amount)::decimal(20,8...
```

#### prc_mng.sp_ms_sell_cycles_open_new_cycle
- **Type:** function
- **Arguments:** `none`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_ms_sell_cycles_open_new_cycle()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
				v_name_cycle                varchar;
				v_id_sell_cycle             bigint;
				v_id_balance                bigint;
				v_destiny_currencies        int[];
				v_id_destiny_currency       int;
				v_asing_emp                 json;
			begin
				select b.id_balance into v_id_balance
				from prc_mng.ms_cycle_balances b
				where current_active = true;
				if v_id_balance ...
```

#### prc_mng.sp_ms_user_consult_asings_reasing
- **Type:** function
- **Arguments:** `p_id_asing bigint, p_uuid_user uuid, p_username character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_ms_user_consult_asings_reasing(p_id_asing bigint, p_uuid_user uuid, p_username character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
				v_id_action                 int;
				v_id_remittance             bigint;
				v_id_consult                bigint;
				v_id_exchange               bigint;
				v_id_buy_cycle              bigint;
				v_id_sell_cycle             bigint;
				v_id_new_asing              bigint;
				v_resp                      j...
```

#### prc_mng.sp_ms_user_consults_insert
- **Type:** function
- **Arguments:** `p_id_chat bigint, p_id_init_msg bigint`
- **Returns:** `character varying`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_ms_user_consults_insert(p_id_chat bigint, p_id_init_msg bigint)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
declare
					v_consult                   prc_mng.lnk_user_consult%rowtype;
					v_username_asing            varchar(30);
					_fake_name           		varchar(100);
					_email_user           		varchar(100);
					_uniq_id					varchar;
				begin
					insert into prc_mng.lnk_user_consult
					(id_chat, id_whatsapp_msg_init)
					values (p_id...
```

#### prc_mng.sp_ms_user_process_asings_get
- **Type:** function
- **Arguments:** `p_username character varying`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_ms_user_process_asings_get(p_username character varying)
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
				v_resp                          json[];
			begin
				if not exists(
					select *
					from sec_emp.ms_sixmap_users us
					inner join sec_emp.ms_profiles pr on us.uuid_profile = pr.uuid_profile
					inner join sec_emp.lnk_profiles_roles lpr on pr.uuid_profile = lpr.uuid_profile
					inner join sec_emp.ms_roles ro on lpr.uuid_role = ro.uuid_ro...
```

#### prc_mng.sp_ms_user_process_asings_get_current_asings
- **Type:** function
- **Arguments:** `p_username character varying, p_init_date bigint, p_end_date bigint, p_action integer[], p_asing character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_ms_user_process_asings_get_current_asings(p_username character varying, p_init_date bigint, p_end_date bigint, p_action integer[], p_asing character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_init_date                     timestamptz;
    v_close_date                    timestamptz;
    v_current_asings                json[];
    -- VARIABLES PARA LOS CONTADORES
    v_asing                         record;
    v_asings_rows          ...
```

#### prc_mng.sp_ms_user_process_asings_get_current_coord_asings
- **Type:** function
- **Arguments:** `p_username character varying, p_init_date bigint, p_end_date bigint, p_action integer[], p_asing character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_ms_user_process_asings_get_current_coord_asings(p_username character varying, p_init_date bigint, p_end_date bigint, p_action integer[], p_asing character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
				v_init_date                     timestamptz;
				v_close_date                    timestamptz;
				v_current_asings                json[];
				-- VARIABLES PARA LOS CONTADORES
				v_asing                         record;
				v_asings_rows    ...
```

#### prc_mng.sp_ms_user_process_asings_get_users_to_asing
- **Type:** function
- **Arguments:** `p_id_assign bigint, p_username character varying`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_ms_user_process_asings_get_users_to_asing(p_id_assign bigint, p_username character varying)
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
    v_uuid_user                     uuid;
    v_id_action                     int;
    v_resp                          json[];
begin
    if not exists(
        select *
        from sec_emp.ms_sixmap_users us
        inner join sec_emp.ms_profiles pr on us.uuid_profile = pr.uuid_profile
        inner join sec_emp...
```

#### prc_mng.sp_origin_transactions_verify_exchange_transaction
- **Type:** function
- **Arguments:** `p_id_transaction bigint, p_verify boolean`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_origin_transactions_verify_exchange_transaction(p_id_transaction bigint, p_verify boolean)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
				v_verify_status                 boolean;
				v_id_exchange                 bigint;
				v_id_action                     int;
				v_json_atc_asing                json;
			begin
				-- se verifica que la transaccion no haya sido verificada aun

				select
					o.bank_verification, o.id_exchange
				into
					v_veri...
```

#### prc_mng.sp_process_get_info
- **Type:** function
- **Arguments:** `p_origin_country integer[], p_origin_currency integer[], p_destiny_country integer[], p_destiny_currency integer[], p_full_range boolean, p_init_date bigint, p_close_date bigint, p_pub_id_client character varying, p_pub_id_remittance character varying, p_id_remittance bigint, p_init_remittance boolean, p_match_word character varying`
- **Returns:** `TABLE("NroRem" bigint, "IDPubRem" character varying, type character varying, "idOriginCountry" integer, "originCountry" character varying, "idOriginCurrency" integer, "originCurrency" character varying, "idDestinyCountry" integer, "destinyCountry" character varying, "idDestinyCurrency" integer, "destinyCurrency" character varying, "dateCreated" bigint, "dateClosed" bigint, "statusPpl" character varying, "atcRev" character varying, "verifBank" character varying, "buyCycle" character varying, "sellCycle" character varying, "toTranfDest" boolean, "tranfDest" boolean, "notifClient" boolean, "notifBenef" character varying, "pauseStatus" character varying, "claimStatus" character varying, "pubStatus" character varying, "clientPubCode" character varying, "totalBenef" integer, "depAmount" double precision, comission double precision, "totalOriginAmount" double precision, "rateType" character varying, rate double precision, "totalDestinyAmount" double precision, "rsAtc" character varying, "rsVrfBnk" character varying, "rsBuyCycle" character varying, "rsSellCycle" character varying, "rsTranf" character varying, "rsNotif" character varying, "clientName" character varying, beneficiaries json[], "clientDocNumber" character varying, "clientEmail" character varying, "clientPhone" character varying, "originBank" character varying, "accountNumber" character varying, "wholesalePartnerProfit" double precision, "wholesalePartnerProfitDollar" double precision, "wholesalePartnerProfitLocalCurrency" double precision, "totalWholesalePartnerOriginAmount" double precision, "wholesalePartnerInfo" json, "countryOriginIsoCode" character varying, "countryDestinyIsoCode" character varying, selected boolean)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_process_get_info(p_origin_country integer[], p_origin_currency integer[], p_destiny_country integer[], p_destiny_currency integer[], p_full_range boolean, p_init_date bigint, p_close_date bigint, p_pub_id_client character varying, p_pub_id_remittance character varying, p_id_remittance bigint, p_init_remittance boolean, p_match_word character varying)
 RETURNS TABLE("NroRem" bigint, "IDPubRem" character varying, type character varying, "idOriginCountry" integ...
```

#### prc_mng.sp_reassign_transaction_bank_account
- **Type:** function
- **Arguments:** `p_id_transaction bigint, p_id_bank_account bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_reassign_transaction_bank_account(p_id_transaction bigint, p_id_bank_account bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_id_old_bank_account                   bigint;
    v_transfer_successful                   boolean;
    v_id_currency_old_account               int;
    v_id_currency_new_account               int;
    v_json_account_balances                 json[];
    v_new_account_balance                   float;
    v_tra...
```

#### prc_mng.sp_register_automatic_transfer_ven
- **Type:** function
- **Arguments:** `p_success_transfers json[], p_failed_transfers json[]`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_register_automatic_transfer_ven(p_success_transfers json[], p_failed_transfers json[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    v_success_transfer                  json;
    v_failed_transfer                   json;
    v_id_remittance                     bigint;
begin
    foreach v_success_transfer in array p_success_transfers loop

        -- se busca el id de la remesa

        select ben.id_remittance
        into v_id_remitta...
```

#### prc_mng.sp_remittance_priority
- **Type:** function
- **Arguments:** `p_uuid_client uuid, p_urgent boolean`
- **Returns:** `boolean`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_remittance_priority(p_uuid_client uuid, p_urgent boolean)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
declare
    v_id_client                         bigint;
    v_total_remittance                  int;
    v_client_status                     varchar;
begin
    -- se verifica si la remesa es urgente

    if (p_urgent = true) then
        return true;
    end if;

    -- se obtiene el id del cliente, sus operaciones realizadas y su estatus
...
```

#### prc_mng.sp_request_level_two
- **Type:** function
- **Arguments:** `residency_proof_path character varying, _job_title text, q_and_a json[], _email_user character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_request_level_two(residency_proof_path character varying, _job_title text, q_and_a json[], _email_user character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    current_full_user sec_cust.ms_sixmap_users %ROWTYPE;
    obj JSON;
    question_number INT;
    v_id_industry_extra_data int;
    v_industry_extra_data varchar;
    v_id_range_extra_data int;
    v_range_extra_data varchar;
BEGIN
    -- look for the full user
        SEL...
```

#### prc_mng.sp_retry_auto_transfers
- **Type:** function
- **Arguments:** `p_transactions_id integer[], p_all boolean`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_retry_auto_transfers(p_transactions_id integer[], p_all boolean)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
    update prc_mng.ms_cr_beneficiaries
    set add_transfer_to_auto_payment = true
    where failed_payment_service = true
    and add_transfer_to_auto_payment = false
    and transfer_successful is null
    and (p_all = true or id_beneficiary = any(p_transactions_id));
end;
$function$

```

#### prc_mng.sp_reverse_balance
- **Type:** function
- **Arguments:** `_id_pub_operation character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_reverse_balance(_id_pub_operation character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				full_balance_to_reverse sec_cust.ms_balances%ROWTYPE;
				full_reversed_balance sec_cust.ms_balances%ROWTYPE;
				reverse_trans_type VARCHAR;
				current_exchange prc_mng.lnk_cr_exchanges%ROWTYPE;
				balance_resp JSON;
				balances_to_reverse INT[];
				bal INT;
				resp_obj JSON;
				_err TEXT;
			BEGIN
				SELECT array_agg(B.id_balance) INTO bala...
```

#### prc_mng.sp_revision_status_change_repercussion
- **Type:** function
- **Arguments:** `p_id_rev_status_actual integer, p_id_rev_status_new integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_revision_status_change_repercussion(p_id_rev_status_actual integer, p_id_rev_status_new integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
				v_rev_status_actual                         varchar;
				v_rev_status_new                            varchar;
				v_json_resp                                 json;
			begin
				if (p_id_rev_status_new = p_id_rev_status_actual) then
					return json_build_object(
						'error', 'Estatus actual y nuevo son i...
```

#### prc_mng.sp_route_cost_factor_update
- **Type:** function
- **Arguments:** `_id_operation_route integer, _cost_factor double precision`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_route_cost_factor_update(_id_operation_route integer, _cost_factor double precision)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
        resp_obj JSONB;
        succesfully_updated INT;
        _err TEXT;
    BEGIN
        UPDATE prc_mng.ms_operation_routes
        SET cost_factor = _cost_factor
        WHERE id_operation_route = _id_operation_route
        RETURNING id_operation_route INTO succesfully_updated;

        IF (succesfully_updated IS N...
```

#### prc_mng.sp_script_pending_verifications_in_cancel_remittances
- **Type:** function
- **Arguments:** `none`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_script_pending_verifications_in_cancel_remittances()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    v_verification                      record;
    v_verification_rows                 cursor for
        select tr.id_transaction, tr.bank_verification, rem.cr_rem_status_ppl, tr.modification_date as tr_end_date, to_timestamp(rem.date_closed)::timestamptz as rem_end_date
        from prc_mng.ms_cr_origin_transactions tr
        inner join prc_mn...
```

#### prc_mng.sp_sell_operations_close_btc
- **Type:** function
- **Arguments:** `p_id_sell_operation integer, p_btc_amount double precision, p_btc_close boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_sell_operations_close_btc(p_id_sell_operation integer, p_btc_amount double precision, p_btc_close boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_id_sell_operation                 int;
    v_actual_btc_close                  boolean;
    v_json_resp                         json;
begin
    select op.id_sell_operation, op.btc_close into v_id_sell_operation, v_actual_btc_close
    from prc_mng.lnk_sell_cycle_operations op
    where op.id_se...
```

#### prc_mng.sp_set_external_transaction_status
- **Type:** function
- **Arguments:** `_id_exchange_pub character varying, _status character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_set_external_transaction_status(_id_exchange_pub character varying, _status character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				resp_obj JSON;
				_err TEXT;
				full_exchange prc_mng.lnk_cr_exchanges%ROWTYPE;
			BEGIN
				-- se actualiza el estatus
					UPDATE prc_mng.lnk_cr_exchanges
					SET external_transaction_status = _status
					WHERE id_exchange_pub = _id_exchange_pub
					RETURNING * INTO full_exchange;

					resp_obj := js...
```

#### prc_mng.sp_sixmap_init_remittances
- **Type:** function
- **Arguments:** `p_id_bh_cust integer, p_id_country_origin integer, p_id_country_dest integer, p_id_currency_origin integer, p_id_currency_dest integer, p_id_bank_account integer, p_total_deposit_amount double precision, p_total_comission double precision, p_origin_amount double precision, p_destiny_amount double precision, p_id_rate integer, p_rate_type character varying, p_beneficiaries json[], p_path_name character varying, p_ref_number character varying, p_username character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_sixmap_init_remittances(p_id_bh_cust integer, p_id_country_origin integer, p_id_country_dest integer, p_id_currency_origin integer, p_id_currency_dest integer, p_id_bank_account integer, p_total_deposit_amount double precision, p_total_comission double precision, p_origin_amount double precision, p_destiny_amount double precision, p_id_rate integer, p_rate_type character varying, p_beneficiaries json[], p_path_name character varying, p_ref_number character v...
```

#### prc_mng.sp_status_change_repercussion
- **Type:** function
- **Arguments:** `p_id_actual_status integer, p_id_new_status integer, p_actual_status_boolean boolean, p_new_status_boolean boolean, p_status character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_status_change_repercussion(p_id_actual_status integer, p_id_new_status integer, p_actual_status_boolean boolean, p_new_status_boolean boolean, p_status character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
begin
				case
					when p_status = 'ATC-Revision' then
						return prc_mng.sp_revision_status_change_repercussion(p_id_actual_status, p_id_new_status);
					when p_status = 'Bank-Verif' then
						return prc_mng.sp_bank_verif_status_change_rep...
```

#### prc_mng.sp_store_pre_exchange
- **Type:** function
- **Arguments:** `_pre_exchange json, _email_user character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_store_pre_exchange(_pre_exchange json, _email_user character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					_id_pre_exchange BIGINT;
					_there_is_id_pre_exchange BIGINT;
				BEGIN
					SELECT ER.id_pre_exchange INTO _there_is_id_pre_exchange
					FROM prc_mng.ms_pre_exchange ER
					WHERE ER.email_user = _email_user
					AND ER.active = true
					ORDER BY ER.date_creation DESC
					LIMIT 1;

					IF (_there_is_id_p...
```

#### prc_mng.sp_third_party_users_create
- **Type:** function
- **Arguments:** `p_name character varying, p_lastname character varying, p_doc_number character varying, p_id_doc_type integer, p_id_nationality integer, p_id_resid_country integer, p_profession character varying, p_email character varying, p_phone_number character varying, p_account_number character varying, p_id_bank integer`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_third_party_users_create(p_name character varying, p_lastname character varying, p_doc_number character varying, p_id_doc_type integer, p_id_nationality integer, p_id_resid_country integer, p_profession character varying, p_email character varying, p_phone_number character varying, p_account_number character varying, p_id_bank integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    v_id_third_party_user               bigint;
begin
    insert i...
```

#### prc_mng.sp_to_tranf_status_change_repercussion
- **Type:** function
- **Arguments:** `p_to_tranf_status_actual boolean, p_to_tranf_status_new boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_to_tranf_status_change_repercussion(p_to_tranf_status_actual boolean, p_to_tranf_status_new boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
begin
				if (p_to_tranf_status_actual = p_to_tranf_status_new) then
					return json_build_object(
						'error', 'Estatus actual y nuevo son iguales'
					);
				end if;
				case
					when p_to_tranf_status_new = true then
						return json_build_object(
							'pplStatus', 'OK-Transferir',
							'pubStatus', '...
```

#### prc_mng.sp_tranf_status_change_repercussion
- **Type:** function
- **Arguments:** `p_tranf_status_actual boolean, p_tranf_status_new boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_tranf_status_change_repercussion(p_tranf_status_actual boolean, p_tranf_status_new boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
begin
				if (p_tranf_status_actual = p_tranf_status_new) then
					return json_build_object(
						'error', 'Estatus actual y nuevo son iguales'
					);
				end if;
				case
					when p_tranf_status_new = true then
						return json_build_object(
							'pplStatus', 'Transferida',
							'pubStatus', 'En proceso'
						);...
```

#### prc_mng.sp_transfer_bank_selection
- **Type:** function
- **Arguments:** `p_id_bank_beneficiary integer`
- **Returns:** `integer`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_transfer_bank_selection(p_id_bank_beneficiary integer)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
declare
    v_id_destiny_country                    int;
    v_id_transfer_bank                      int;
begin
    select ban.id_country into v_id_destiny_country
    from sec_cust.ms_banks ban
    where ban.id_bank = p_id_bank_beneficiary;
    if (v_id_destiny_country = (
        select cou.id_country
        from sec_emp.ms_countries cou
        where c...
```

#### prc_mng.sp_update_exchange_rate
- **Type:** function
- **Arguments:** `_id_exchange_rate integer, _rate_factor double precision, _profit_margin double precision`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_update_exchange_rate(_id_exchange_rate integer, _rate_factor double precision, _profit_margin double precision)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					current_exchange_rate prc_mng.ms_exchange_rates%ROWTYPE;
					succesfully_updated INT;
				BEGIN
					UPDATE prc_mng.ms_exchange_rates
					SET profit_margin = _profit_margin
					WHERE id_exchange_rate = _id_exchange_rate
					RETURNING id_exchange_rate INTO succesfull...
```

#### prc_mng.sp_update_exchange_routes_rates
- **Type:** function
- **Arguments:** `routes_arr json[], only_cost boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_update_exchange_routes_rates(routes_arr json[], only_cost boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					el JSONB;
					rate JSONB;
				BEGIN
					FOREACH el IN array routes_arr LOOP
						SELECT prc_mng.sp_update_route_cost_factor(
																		(el->'route'->>'id_operation_route')::INT,
																		(el->'route'->>'cost_factor')::FLOAT
																	) INTO resp_obj;
						raise notice 'RESP: %',resp_obj...
```

#### prc_mng.sp_update_route_cost_factor
- **Type:** function
- **Arguments:** `_id_operation_route integer, _cost_factor double precision`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.sp_update_route_cost_factor(_id_operation_route integer, _cost_factor double precision)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					succesfully_updated INT;
				BEGIN
					raise notice '_cost_factor a actualizar: %',_cost_factor;

					UPDATE prc_mng.ms_operation_routes
					SET cost_factor = _cost_factor
					WHERE id_operation_route = _id_operation_route
					RETURNING id_operation_route INTO succesfully_updated;

					IF (...
```

#### prc_mng.update_operation_route
- **Type:** function
- **Arguments:** `none`
- **Returns:** `trigger`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION prc_mng.update_operation_route()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
			BEGIN
				PERFORM pg_notify('operation_route_update',json_build_object('operationRoute',NEW)::text);

				return NEW;
			END;
$function$

```

#### public.sp_get_countries_currencies
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION public.sp_get_countries_currencies()
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					_origin JSONB;
					_destiny JSONB;
				BEGIN
					SELECT json_agg(T.*) INTO _origin
					FROM (SELECT COCU.id_country, CO.name_country, CO.viewing_name, CO.country_iso_code, COCU.id_currency, CU.iso_cod
						FROM sec_emp.ms_countries CO, sec_cust.ms_currencies CU, sec_cust.lnk_country_currency COCU
						WHERE CO.id_country = COCU.id_country
						AND ...
```

#### public.sp_get_full_rates
- **Type:** function
- **Arguments:** `_id_origin_country integer, _id_origin_currency integer, _id_destiny_country integer, _id_destiny_currency integer, _email_user character varying`
- **Returns:** `jsonb`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION public.sp_get_full_rates(_id_origin_country integer, _id_origin_currency integer, _id_destiny_country integer, _id_destiny_currency integer, _email_user character varying)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare
				resp_obj       				JSONB;
				manual_rates	       		JSONB;
				user_manual_rates	       	JSONB;
				user_special_rates	       	JSONB;
				user_individual_rate	    JSONB;
				user_rates	       			JSONB;
				regular_rate	       		JSONB;
				imp...
```

#### public.sp_get_remittance_extract_data
- **Type:** function
- **Arguments:** `p_id_remittances bigint[], p_username character varying`
- **Returns:** `TABLE("NroRem" bigint, "IDPubRem" character varying, type character varying, "originCountry" character varying, "originCurrency" character varying, "destinyCountry" character varying, "destinyCurrency" character varying, "dateCreated" timestamp without time zone, "statusPpl" character varying, "atcRev" character varying, "verifBank" character varying, "buyCycle" character varying, "sellCycle" character varying, "toTranfDest" character varying, "tranfDest" character varying, "notifClient" character varying, "notifBenef" character varying, "pauseStatus" character varying, "claimStatus" character varying, "pubStatus" character varying, "clientPubCode" character varying, "totalBenef" integer, "depAmount" double precision, comission double precision, "totalOriginAmount" double precision, "rateType" character varying, rate double precision, "totalDestinyAmount" double precision, "rsAtc" character varying, "rsVrfBnk" character varying, "rsBuyCycle" character varying, "rsSellCycle" character varying, "rsTranf" character varying, "rsNotif" character varying, "clientName" character varying, "clientDocNumber" character varying, "clientEmail" character varying, "clientPhone" character varying, "originBank" character varying, "accountNumber" character varying, "beneficiaryName" character varying, "payType" character varying, "benefBank" character varying, "benefaAccountNumber" character varying, "docType" character varying, "benefIdentNumber" character varying, "partialOriginAmount" double precision, "partialDestinyAmount" double precision)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION public.sp_get_remittance_extract_data(p_id_remittances bigint[], p_username character varying)
 RETURNS TABLE("NroRem" bigint, "IDPubRem" character varying, type character varying, "originCountry" character varying, "originCurrency" character varying, "destinyCountry" character varying, "destinyCurrency" character varying, "dateCreated" timestamp without time zone, "statusPpl" character varying, "atcRev" character varying, "verifBank" character varying, "buyCycle" char...
```

#### public.sp_set_sequence_number
- **Type:** function
- **Arguments:** `none`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION public.sp_set_sequence_number()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    v_sequences_name                varchar[];
    v_sequence_name                 varchar;
begin
    select array(
        SELECT sequence_schema || '.' || sequence_name
        FROM information_schema.sequences
        ORDER BY sequence_name
    ) into v_sequences_name;
    foreach v_sequence_name in array v_sequences_name loop
        raise notice '%', v_sequence_name;
...
```

#### sec_cust.ambassador_assign
- **Type:** function
- **Arguments:** `none`
- **Returns:** `trigger`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.ambassador_assign()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
				current_profile	VARCHAR;
				referrals	JSON;
				active_plus_absent_referrals	INT;
			BEGIN
				IF (NEW.referral_node IS NOT NULL AND NEW.referral_node <> '')
				THEN
					SELECT sec_cust.sp_get_referrals_by_user(NEW.referral_node) INTO referrals;

					active_plus_absent_referrals := (referrals->>'active_referrals')::INT +  (referrals->>'absent_referrals')::INT;

			...
```

#### sec_cust.amount_client_registered_active_desactived
- **Type:** function
- **Arguments:** `p_country character varying, p_month character varying, p_date character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.amount_client_registered_active_desactived(p_country character varying, p_month character varying, p_date character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
resp_obj JSONB;
resp_obj2 JSONB;
registered integer;
actived integer;
desactived integer;
BEGIN
IF((p_country is null or p_country = '' or p_country = 'undefined') and (p_month is null or p_month = '' or p_country = 'undefined') and (p_date is null or p_date = '' or p_country ...
```

#### sec_cust.amount_operation_by_user
- **Type:** function
- **Arguments:** `p_country character varying, p_month character varying, p_date character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.amount_operation_by_user(p_country character varying, p_month character varying, p_date character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
resp_obj JSONB;
resp_obj2 JSONB;
resp_obj3 JSONB;
registered integer;
actived integer;
desactived integer;
BEGIN
IF((p_country is null or p_country = '') and (p_month is null or p_month = '') and (p_date is null or p_date = ''))
	THEN
	raise notice 'Entra en nada';
	SELECT
    json_build_o...
```

#### sec_cust.are_allied_banks
- **Type:** function
- **Arguments:** `_id_origin_bank integer, _id_destiny_bank integer`
- **Returns:** `boolean`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.are_allied_banks(_id_origin_bank integer, _id_destiny_bank integer)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
					_id_allied_banks INT;
				BEGIN
                    -- prueba para migrar
                    -- prueba para migrar
					SELECT AB.id_allied_bank INTO _id_allied_banks
					FROM sec_cust.ms_allied_banks AB
					WHERE AB.first_id_bank IN (_id_origin_bank,_id_destiny_bank)
					AND AB.second_id_bank IN (_id_origin_bank,_id_destiny_ban...
```

#### sec_cust.average_frequency_remittance
- **Type:** function
- **Arguments:** `p_country character varying, p_month character varying, p_date character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.average_frequency_remittance(p_country character varying, p_month character varying, p_date character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
resp_obj JSONB;
resp_obj2 JSONB;
resp_obj3 JSONB;
BEGIN
IF((p_country is null or p_country = '' or p_country = 'undefined') and (p_month is null or p_month = '' or p_country = 'undefined') and (p_date is null or p_date = '' or p_country = 'undefined'))
	THEN
	raise notice 'Entra en nada';
...
```

#### sec_cust.average_remittance_amount
- **Type:** function
- **Arguments:** `p_country character varying, p_month character varying, p_date character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.average_remittance_amount(p_country character varying, p_month character varying, p_date character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
resp_obj JSONB;
resp_obj2 JSONB;
resp_obj3 JSONB;
registered double precision;
actived varchar;
desactived double precision;
BEGIN
IF((p_country is null or p_country = '' or p_country = 'undefined') and (p_month is null or p_month = '' or p_country = 'undefined') and (p_date is null or p_date...
```

#### sec_cust.concat_amount_to_def
- **Type:** function
- **Arguments:** `none`
- **Returns:** `trigger`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.concat_amount_to_def()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
				format_local_amount VARCHAR;
				format_local_amount_2 VARCHAR;
			BEGIN
				IF (NEW.local_amount IS NOT null)
				THEN
					SELECT * INTO format_local_amount
					FROM sec_cust.number_to_hispanic_format(NEW.local_amount);

					NEW.def = REPLACE(NEW.def,'$',format_local_amount || ' ' || (SELECT CU.iso_cod
																	FROM sec_cust.ms_currencies AS CU, sec_cust.lnk_country...
```

#### sec_cust.cryptomiles_assign
- **Type:** function
- **Arguments:** `_id_remittance bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.cryptomiles_assign(_id_remittance bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				resp JSON;
				ok_connection VARCHAR;
				is_connected BOOLEAN;
				query_string TEXT;
				_amount FLOAT;
				_email_user  VARCHAR;
				_emp_username  VARCHAR;
				_trans_type  VARCHAR;
				_trans_description  TEXT;
				_trans_comment  TEXT;
				_id_operation  VARCHAR;
				_operation_type  TEXT;
				_id_currency  INT;
				_id_country  INT;
				_was_charged  BOOL...
```

#### sec_cust.enable_phone_and_email
- **Type:** function
- **Arguments:** `_phone text, _email text`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.enable_phone_and_email(_phone text, _email text)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					_id_phone INT;
					_id_email INT;
					resp_obj JSON;
				BEGIN

					IF (_phone IS NOT NULL)
					THEN
						UPDATE sec_cust.ms_phone
						SET full_number = '❌- ' || full_number
						WHERE full_number = _phone
						RETURNING id_phone INTO _id_phone;
					END IF;
					IF (_email IS NOT NULL)
					THEN
						UPDATE sec_cust.ms_sixmap_users
						SET e...
```

#### sec_cust.get_all_manual_rates
- **Type:** function
- **Arguments:** `_id_origin_country integer, _id_origin_currency integer, _id_destiny_country integer, _id_destiny_currency integer`
- **Returns:** `jsonb`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_all_manual_rates(_id_origin_country integer, _id_origin_currency integer, _id_destiny_country integer, _id_destiny_currency integer)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare
				resp_obj               	  	JSONB;
			begin
				SELECT json_agg(T.*) INTO resp_obj
				FROM (SELECT
							MR.id_manual_rate,
							MR.rate_factor,
							MR.id_origin_country,
							MR.id_origin_currency,
							(SELECT CU.iso_cod
							FROM sec_cust.ms_currencies ...
```

#### sec_cust.get_all_user_manual_rates
- **Type:** function
- **Arguments:** `_id_origin_country integer, _id_origin_currency integer, _id_destiny_country integer, _id_destiny_currency integer, _is_valid_for_birthday boolean, _is_valid_for_first_oper boolean, _email_user character varying`
- **Returns:** `jsonb`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_all_user_manual_rates(_id_origin_country integer, _id_origin_currency integer, _id_destiny_country integer, _id_destiny_currency integer, _is_valid_for_birthday boolean, _is_valid_for_first_oper boolean, _email_user character varying)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare
				resp_obj               	  	JSONB;
				_id_client               	INT;
			begin
				-- obtener las 3 tasas manuales que le apliquen al usuario

				SELECT U.id_user INT...
```

#### sec_cust.get_all_user_special_rates
- **Type:** function
- **Arguments:** `_id_origin_country integer, _id_origin_currency integer, _id_destiny_country integer, _id_destiny_currency integer, _email_user character varying`
- **Returns:** `jsonb`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_all_user_special_rates(_id_origin_country integer, _id_origin_currency integer, _id_destiny_country integer, _id_destiny_currency integer, _email_user character varying)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare
				resp_obj               	  	JSONB;
				_id_client				  	BIGINT;
			begin
				SELECT U.id_user INTO _id_client
				FROM sec_cust.ms_sixmap_users U
				WHERE U.email_user = _email_user;


				SELECT json_agg(T.*) INTO resp_obj
				FRO...
```

#### sec_cust.get_all_users_by_email
- **Type:** function
- **Arguments:** `_email_user character varying`
- **Returns:** `TABLE(id_uuid uuid, id_user bigint, first_name character varying, second_name character varying, last_name character varying, second_last_name character varying, username character varying, email_user character varying, password text, last_session_reg character varying, last_ip_reg character varying, last_ip_city_reg character varying, last_id_log_reg integer, date_last_conn timestamp with time zone, gender character, date_birth timestamp with time zone, ident_doc_number character varying, main_phone character varying, second_phone character varying, delegated_phone character varying, resid_city text, user_active boolean, user_blocked boolean, uuid_profile uuid, id_service integer, id_services_utype integer, id_ident_doc_type integer, id_resid_country integer, id_nationality_country integer, name_profile character varying, name_service character varying, name_services_utype character varying, name_ident_doc_type character varying, name_resid_country character varying, name_nationality_country character varying, address text, cust_cr_cod_pub character varying, cod_rank character varying, referral_node text, main_sn_platf text, user_main_sn_platf text, date_legacy_reg timestamp with time zone, id_verif_level integer, verif_level_apb boolean, state_name text, iso_code_resid_country character varying, iso_code_nationality_country character varying, wallets json, wholesale_partner_info json, ok_legal_terms boolean, truthful_information boolean, lawful_funds boolean, main_phone_code character varying, main_phone_full character varying, doc_type_name_country character varying, id_migrated bigint, country_exception boolean, phone_exception boolean, limit_exception boolean, multi_currency_exception boolean, completed_information_migrated boolean, extra_info json, last_remittances json, pre_remittances json, current_rate jsonb, frequent_beneficiaries json, notifications json, limits json, limits_by_country json, full_rates jsonb, show_verification_modal boolean)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_all_users_by_email(_email_user character varying)
 RETURNS TABLE(id_uuid uuid, id_user bigint, first_name character varying, second_name character varying, last_name character varying, second_last_name character varying, username character varying, email_user character varying, password text, last_session_reg character varying, last_ip_reg character varying, last_ip_city_reg character varying, last_id_log_reg integer, date_last_conn timestamp with time zon...
```

#### sec_cust.get_bank_account_by_id
- **Type:** function
- **Arguments:** `_id_bank_account integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_bank_account_by_id(_id_bank_account integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    bank_account JSONB;
--     v_id_banks_account int; -- variable del parche
begin
    -- parche
--     case
--         when _id_bank_account = 100019 then
--             v_id_banks_account := 100024;
--         when _id_bank_account = 100016 then
--             v_id_banks_account := 100021;
--         when _id_bank_account = 100017 then
--             v_id_...
```

#### sec_cust.get_bank_accounts_by_country
- **Type:** function
- **Arguments:** `_id_country integer, _id_currency integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_bank_accounts_by_country(_id_country integer, _id_currency integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					bank_accounts JSONB;
				BEGIN
                    IF (_id_currency = 9)
                    THEN
                        SELECT json_agg(BA.*) INTO bank_accounts
                        FROM (SELECT b.name as bank_name, a.id_bank, a.id_bank_account, a.account_holder_name, a.account_holder_type, a.account_type, a.account_hol...
```

#### sec_cust.get_best_vip_rate
- **Type:** function
- **Arguments:** `_id_origin_country integer, _id_origin_currency integer, _id_destiny_country integer, _id_destiny_currency integer, _email_user character varying`
- **Returns:** `jsonb`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_best_vip_rate(_id_origin_country integer, _id_origin_currency integer, _id_destiny_country integer, _id_destiny_currency integer, _email_user character varying)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare
				resp_obj               	  	JSONB;
			begin
				-- obtener todas las tasas especiales a las que aplica el usuario

					-- mismos paises y monedas
					-- from_date < NOW() < to_date
					-- activa
					-- publicada
						-- si es tasa de cu...
```

#### sec_cust.get_client_profile_by_email
- **Type:** function
- **Arguments:** `_uuid uuid`
- **Returns:** `TABLE(uuid uuid, "firstName" character varying, "secondName" character varying, "lastName" character varying, "secondLastName" character varying, email character varying, phone character varying, "lastIp" character varying, "lastIpCity" character varying, "residCity" text, active boolean, blocked boolean, "countryName" character varying, "countryIsoCode" character varying, "crPubCode" character varying, "dateLegacy" bigint, "idVerifLevel" integer, "verifLevelApb" boolean, "userType" character varying, "verifLevelReq" json, transactions json, beneficiaries json, referrals json)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_client_profile_by_email(_uuid uuid)
 RETURNS TABLE(uuid uuid, "firstName" character varying, "secondName" character varying, "lastName" character varying, "secondLastName" character varying, email character varying, phone character varying, "lastIp" character varying, "lastIpCity" character varying, "residCity" text, active boolean, blocked boolean, "countryName" character varying, "countryIsoCode" character varying, "crPubCode" character varying, "dateLeg...
```

#### sec_cust.get_cod_rank_by_uuid
- **Type:** function
- **Arguments:** `_uuid_user uuid`
- **Returns:** `TABLE(cod_rank text)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_cod_rank_by_uuid(_uuid_user uuid)
 RETURNS TABLE(cod_rank text)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT CR.cod_rank
			FROM sec_cust.ms_cod_users_ranks AS CR
			WHERE CR.uuid_user = _uuid_user;
			END;
$function$

```

#### sec_cust.get_full_user_by_email
- **Type:** function
- **Arguments:** `_email character varying`
- **Returns:** `TABLE(first_name character varying, second_name character varying, last_name character varying, second_last_name character varying, username character varying, email_user character varying, last_session_reg character varying, last_ip_reg character varying, last_ip_city_reg character varying, last_id_log_reg integer, date_last_conn timestamp with time zone, gender character, date_birth timestamp with time zone, ident_doc_number character varying, main_phone character varying, second_phone character varying, delegated_phone character varying, resid_city text, user_active boolean, user_blocked boolean, uuid_profile uuid, id_service integer, id_services_utype integer, id_ident_doc_type integer, id_resid_country integer, id_nationality_country integer, name_profile character varying, name_service character varying, name_services_utype character varying, name_ident_doc_type character varying, name_resid_country character varying, name_nationality_country character varying, address text, cust_cr_cod_pub character varying, cod_rank character varying, referral_node text, main_sn_platf text, user_main_sn_platf text, date_legacy_reg timestamp with time zone, id_verif_level integer, verif_level_apb boolean)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_full_user_by_email(_email character varying)
 RETURNS TABLE(first_name character varying, second_name character varying, last_name character varying, second_last_name character varying, username character varying, email_user character varying, last_session_reg character varying, last_ip_reg character varying, last_ip_city_reg character varying, last_id_log_reg integer, date_last_conn timestamp with time zone, gender character, date_birth timestamp with tim...
```

#### sec_cust.get_id_by_username
- **Type:** function
- **Arguments:** `_username character varying`
- **Returns:** `TABLE(user_id_priv uuid)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_id_by_username(_username character varying)
 RETURNS TABLE(user_id_priv uuid)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT sec_cust.MS_SIXMAP_USERS.uuid_user
			FROM sec_cust.MS_SIXMAP_USERS
			WHERE sec_cust.MS_SIXMAP_USERS.username = _username;
			END;
$function$

```

#### sec_cust.get_id_department_by_name
- **Type:** function
- **Arguments:** `_name character varying`
- **Returns:** `TABLE(id_dpt bigint)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_id_department_by_name(_name character varying)
 RETURNS TABLE(id_dpt bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT D.id_dpt
			FROM sec_cust.ms_departments AS D
			WHERE D.name_dpt = _name;
			END;
$function$

```

#### sec_cust.get_id_doc_type_by_name
- **Type:** function
- **Arguments:** `_name character varying`
- **Returns:** `TABLE(id_ident_doc_type bigint)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_id_doc_type_by_name(_name character varying)
 RETURNS TABLE(id_ident_doc_type bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT DT.id_ident_doc_type
			FROM sec_cust.ms_doc_type AS DT
			WHERE DT.name_doc_type = _name;
			END;
$function$

```

#### sec_cust.get_id_ip_country_by_name
- **Type:** function
- **Arguments:** `_name character varying`
- **Returns:** `TABLE(id_ip_country bigint)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_id_ip_country_by_name(_name character varying)
 RETURNS TABLE(id_ip_country bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT C.id_ip_country
			FROM sec_emp.ms_ip_countries AS C
			WHERE C.country_name = _name
			LIMIT 1;
			END;
$function$

```

#### sec_cust.get_id_resid_country_by_name
- **Type:** function
- **Arguments:** `_name character varying`
- **Returns:** `TABLE(id_country bigint)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_id_resid_country_by_name(_name character varying)
 RETURNS TABLE(id_country bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT C.id_country
			FROM sec_emp.ms_countries AS C
			WHERE C.name_country = _name;
			END;
$function$

```

#### sec_cust.get_id_service_by_name
- **Type:** function
- **Arguments:** `_name character varying`
- **Returns:** `TABLE(id_service bigint)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_id_service_by_name(_name character varying)
 RETURNS TABLE(id_service bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT S.id_service
			FROM sec_cust.ms_sixmap_services AS S
			WHERE S.tx_service = _name;
			END;
$function$

```

#### sec_cust.get_id_utype_by_name
- **Type:** function
- **Arguments:** `_name character varying`
- **Returns:** `TABLE(id_services_utype bigint)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_id_utype_by_name(_name character varying)
 RETURNS TABLE(id_services_utype bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT UT.id_services_utype
			FROM sec_cust.ms_sixmap_services_utype AS UT
			WHERE UT.name_utype = _name;
			END;
$function$

```

#### sec_cust.get_id_verif_level_by_name
- **Type:** function
- **Arguments:** `_name integer`
- **Returns:** `TABLE(id_verif_level bigint)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_id_verif_level_by_name(_name integer)
 RETURNS TABLE(id_verif_level bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT VL.id_verif_level
			FROM sec_cust.ms_verif_level AS VL
			WHERE VL.id_vl = _name;
			END;
$function$

```

#### sec_cust.get_limitations_by_country
- **Type:** function
- **Arguments:** `_id_country integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_limitations_by_country(_id_country integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					limitations JSONB;
					name_limitations JSONB;
				BEGIN
					SELECT json_agg(LS.*) INTO limitations
					FROM (SELECT LVL.id_limitation, LVL.id_verification, LVL.def,LVL.local_amount,LVL.local_amount_2,LVL.beneficiaries_num,LVL.is_allowed, array(SELECT json_build_object('viewing_name',C.viewing_name,'id_country',LVLC.id_country,'name_country',C.name_cou...
```

#### sec_cust.get_limitations_by_country_and_verif_level
- **Type:** function
- **Arguments:** `_id_country integer, _id_verification integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_limitations_by_country_and_verif_level(_id_country integer, _id_verification integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					limitations JSONB;
				BEGIN
					SELECT json_agg(LS.*) INTO limitations
					FROM (SELECT LVL.id_limitation,ML.ident_name, LVL.id_verification, LVL.def,LVL.local_amount,LVL.local_amount_2,LVL.beneficiaries_num,LVL.is_allowed, array(SELECT json_build_object('viewing_name',C.viewing_name,'id_country',LVLC.id_countr...
```

#### sec_cust.get_limitations_by_user
- **Type:** function
- **Arguments:** `_cust_cr_cod_pub character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_limitations_by_user(_cust_cr_cod_pub character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					full_user sec_cust.ms_sixmap_users %ROWTYPE;
					limits JSONB;
					weekly_acum FLOAT;
					monthly_acum FLOAT;
					total_acum FLOAT;
					_currency VARCHAR;
					final_obj JSONB;
				BEGIN
					SELECT U.* INTO full_user
					FROM sec_cust.ms_sixmap_users AS U
					WHERE U.cust_cr_cod_pub = _cust_cr_cod_pub;

					SELECT CU.iso_cod into _cur...
```

#### sec_cust.get_migrated_info_to_complete
- **Type:** function
- **Arguments:** `id_migrated bigint`
- **Returns:** `jsonb`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_migrated_info_to_complete(id_migrated bigint)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
        migrated_user sec_emp.ms_users_migrated%ROWTYPE;
    BEGIN

        SELECT * INTO migrated_user
        FROM sec_emp.ms_users_migrated
        WHERE id_migration = id_migrated;

        RETURN jsonb_build_object(
                'state_name', migrated_user.state_name,
                'occupation', migrated_user.occupation,
                'main_sn_p...
```

#### sec_cust.get_phones_by_uuid_user
- **Type:** function
- **Arguments:** `id uuid`
- **Returns:** `TABLE(type character varying, code character varying, number character varying, full_number character varying, mobile boolean, home boolean, office boolean, whatsapp boolean, telegram boolean)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_phones_by_uuid_user(id uuid)
 RETURNS TABLE(type character varying, code character varying, number character varying, full_number character varying, mobile boolean, home boolean, office boolean, whatsapp boolean, telegram boolean)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT PHO.type,
				PHO.code,
				PHO.number,
				PHO.full_number,
				PHO.mobile,
				PHO.home,
				PHO.office,
				PHO.whatsapp,
				PHO.telegram
			FROM sec_cust.ms_phone ...
```

#### sec_cust.get_pre_remittance_by_user
- **Type:** function
- **Arguments:** `_email_user character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_pre_remittance_by_user(_email_user character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					pre_remittance JSONB;
					created_date INT;
					_id_pre_remittance INT;
					date_last_shown BIGINT;
					_active BOOLEAN;
					_was_expired BOOLEAN;
				BEGIN
					SELECT PR.id_pre_remittance,PR.pre_remittance, extract(epoch from PR.date_creation), PR.date_last_shown, PR.active, PR.was_expired INTO _id_pre_remittance, pre...
```

#### sec_cust.get_queued_mails
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_queued_mails()
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
    resp_obj JSONB;
    queued_mails JSONB;
BEGIN
    SELECT json_agg(T.*) INTO queued_mails
    FROM (SELECT Q.*
            FROM sec_cust.lnk_mail_user Q
        ) AS T;

    resp_obj := json_build_object(
            'queued_mails', queued_mails
            );

    RETURN resp_obj;
END;
$function$

```

#### sec_cust.get_regular_rate
- **Type:** function
- **Arguments:** `_id_origin_country integer, _id_origin_currency integer, _id_destiny_country integer, _id_destiny_currency integer`
- **Returns:** `jsonb`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_regular_rate(_id_origin_country integer, _id_origin_currency integer, _id_destiny_country integer, _id_destiny_currency integer)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare
				resp_obj               	  	JSONB;
			begin
				SELECT json_agg(T.*) INTO resp_obj
				FROM (SELECT
							MR.id_manual_rate,
							MR.rate_factor,
							MR.id_origin_country,
							MR.id_origin_currency,
							MR.id_destiny_country,
							MR.id_destiny_currency,
				...
```

#### sec_cust.get_session_by_id
- **Type:** function
- **Arguments:** `_sid character varying`
- **Returns:** `TABLE(sid character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_session_by_id(_sid character varying)
 RETURNS TABLE(sid character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT S.sid
			FROM sec_cust.session_obj AS S
			where S.sid = _sid;
			END;
$function$

```

#### sec_cust.get_some_session
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE(sid character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_some_session()
 RETURNS TABLE(sid character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT S.sid
			FROM sec_cust.session_obj AS S
			Limit 1;
			END;
$function$

```

#### sec_cust.get_user_automatic_rates
- **Type:** function
- **Arguments:** `_id_origin_country integer, _id_origin_currency integer, _id_destiny_country integer, _id_destiny_currency integer`
- **Returns:** `jsonb`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_user_automatic_rates(_id_origin_country integer, _id_origin_currency integer, _id_destiny_country integer, _id_destiny_currency integer)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare
				resp_obj               	  	JSONB;
			begin
				-- obtener las 3 tasas manuales que le apliquen al usuario

				SELECT json_agg(T.*) INTO resp_obj
				FROM (SELECT AR.id_rate,
							AR.rate_factor,
							AR.id_origin_country,
							AR.id_currency_origin,
							...
```

#### sec_cust.get_user_by_email
- **Type:** function
- **Arguments:** `_email_user character varying`
- **Returns:** `TABLE(id_uuid uuid, first_name character varying, second_name character varying, last_name character varying, second_last_name character varying, username character varying, email_user character varying, password text, last_session_reg character varying, last_ip_reg character varying, last_ip_city_reg character varying, last_id_log_reg integer, date_last_conn timestamp with time zone, gender character, date_birth timestamp with time zone, ident_doc_number character varying, main_phone character varying, second_phone character varying, delegated_phone character varying, resid_city text, user_active boolean, user_blocked boolean, uuid_profile uuid, id_service integer, id_services_utype integer, id_ident_doc_type integer, id_resid_country integer, id_nationality_country integer, name_profile character varying, name_service character varying, name_services_utype character varying, name_ident_doc_type character varying, name_resid_country character varying, name_nationality_country character varying, address text, cust_cr_cod_pub character varying, cod_rank character varying, referral_node text, main_sn_platf text, user_main_sn_platf text, date_legacy_reg timestamp with time zone, id_verif_level integer, verif_level_apb boolean, state_name text, iso_code_resid_country character varying, iso_code_nationality_country character varying, wallets json, wholesale_partner_info json, ok_legal_terms boolean, truthful_information boolean, lawful_funds boolean, main_phone_code character varying, main_phone_full character varying, doc_type_name_country character varying, id_migrated bigint, country_exception boolean, phone_exception boolean, limit_exception boolean, multi_currency_exception boolean, completed_information_migrated boolean)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_user_by_email(_email_user character varying)
 RETURNS TABLE(id_uuid uuid, first_name character varying, second_name character varying, last_name character varying, second_last_name character varying, username character varying, email_user character varying, password text, last_session_reg character varying, last_ip_reg character varying, last_ip_city_reg character varying, last_id_log_reg integer, date_last_conn timestamp with time zone, gender character, ...
```

#### sec_cust.get_user_by_id
- **Type:** function
- **Arguments:** `id uuid`
- **Returns:** `TABLE(id_uuid uuid, first_name character varying, second_name character varying, last_name character varying, second_last_name character varying, username character varying, email_user character varying, password text, last_session_reg character varying, last_ip_reg character varying, last_ip_city_reg character varying, last_id_log_reg integer, date_last_conn timestamp with time zone, gender character, date_birth timestamp with time zone, ident_doc_number character varying, main_phone character varying, second_phone character varying, delegated_phone character varying, resid_city text, user_active boolean, user_blocked boolean, uuid_profile uuid, id_service integer, id_services_utype integer, id_ident_doc_type integer, id_resid_country integer, id_nationality_country integer, name_profile character varying, name_service character varying, name_services_utype character varying, name_ident_doc_type character varying, name_resid_country character varying, name_nationality_country character varying, address text, cust_cr_cod_pub character varying, cod_rank character varying, referral_node text, main_sn_platf text, user_main_sn_platf text, date_legacy_reg timestamp with time zone, id_verif_level integer, verif_level_apb boolean, state_name text, iso_code_resid_country character varying, iso_code_nationality_country character varying, wallets json, wholesale_partner_info json, ok_legal_terms boolean, truthful_information boolean, lawful_funds boolean, main_phone_code character varying, main_phone_full character varying, doc_type_name_country character varying, id_migrated bigint, country_exception boolean, phone_exception boolean, limit_exception boolean, multi_currency_exception boolean, completed_information_migrated boolean)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_user_by_id(id uuid)
 RETURNS TABLE(id_uuid uuid, first_name character varying, second_name character varying, last_name character varying, second_last_name character varying, username character varying, email_user character varying, password text, last_session_reg character varying, last_ip_reg character varying, last_ip_city_reg character varying, last_id_log_reg integer, date_last_conn timestamp with time zone, gender character, date_birth timestamp with...
```

#### sec_cust.get_user_by_username
- **Type:** function
- **Arguments:** `_username character varying`
- **Returns:** `TABLE(id_uuid uuid, username character varying, password text)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_user_by_username(_username character varying)
 RETURNS TABLE(id_uuid uuid, username character varying, password text)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT S.uuid_user,
				S.username,
				S.password
			FROM sec_cust.ms_sixmap_userS AS S
			WHERE S.username = _username;
			END;
$function$

```

#### sec_cust.get_user_manual_rates
- **Type:** function
- **Arguments:** `_id_origin_country integer, _id_origin_currency integer, _id_destiny_country integer, _id_destiny_currency integer, _is_valid_for_birthday boolean, _is_valid_for_first_oper boolean, _email_user character varying`
- **Returns:** `jsonb`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_user_manual_rates(_id_origin_country integer, _id_origin_currency integer, _id_destiny_country integer, _id_destiny_currency integer, _is_valid_for_birthday boolean, _is_valid_for_first_oper boolean, _email_user character varying)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare
				resp_obj               	  	JSONB;
				_id_client               	INT;
			begin
				-- obtener las 3 tasas manuales que le apliquen al usuario

				SELECT U.id_user INTO _i...
```

#### sec_cust.get_uuid_by_doc_public_cod
- **Type:** function
- **Arguments:** `_ident_doc_number character varying, _cust_cr_cod_pub character varying`
- **Returns:** `TABLE(uuid_user uuid)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_uuid_by_doc_public_cod(_ident_doc_number character varying, _cust_cr_cod_pub character varying)
 RETURNS TABLE(uuid_user uuid)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT U.uuid_user
			FROM sec_cust.ms_sixmap_userS AS U
			WHERE U.ident_doc_number = _ident_doc_number
				AND U.cust_cr_cod_pub = _cust_cr_cod_pub;
			END;
$function$

```

#### sec_cust.get_uuid_profile_by_name
- **Type:** function
- **Arguments:** `_name character varying`
- **Returns:** `TABLE(uuid_profile uuid)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_uuid_profile_by_name(_name character varying)
 RETURNS TABLE(uuid_profile uuid)
 LANGUAGE plpgsql
AS $function$
BEGIN RAISE NOTICE 'CUUUUSTTTT';
			RETURN QUERY
			SELECT P.uuid_profile
			FROM sec_cust.ms_profiles AS P
			WHERE P.name_profile = _name;
			END;
$function$

```

#### sec_cust.get_verif_level_by_uuid
- **Type:** function
- **Arguments:** `_uuid_user uuid`
- **Returns:** `TABLE(id_verif_level integer)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.get_verif_level_by_uuid(_uuid_user uuid)
 RETURNS TABLE(id_verif_level integer)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT LVL.id_verif_level
			FROM sec_cust.lnk_users_verif_level AS LVL
			WHERE LVL.uuid_user = _uuid_user;
			END;
$function$

```

#### sec_cust.is_valid_for_birthday
- **Type:** function
- **Arguments:** `_email_user character varying`
- **Returns:** `boolean`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.is_valid_for_birthday(_email_user character varying)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
					_date_birth TIMESTAMPTZ;
				BEGIN
					SELECT U.date_birth INTO _date_birth
					FROM sec_cust.ms_sixmap_users U
					WHERE U.email_user = _email_user;

					IF (
						EXTRACT(month from _date_birth) = EXTRACT(month from NOW())
					)
					THEN
						RETURN TRUE;
					ELSE
						RETURN FALSE;
					END IF;
				END;
$function$

```

#### sec_cust.is_valid_for_first_oper
- **Type:** function
- **Arguments:** `_email_user character varying`
- **Returns:** `boolean`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.is_valid_for_first_oper(_email_user character varying)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
					operations INT;
				BEGIN
					SELECT COUNT(R.id_remittance) INTO operations
					FROM prc_mng.lnk_cr_remittances R
					WHERE R.id_client = (SELECT U.id_user
										FROM sec_cust.ms_sixmap_users U
										WHERE U.email_user = _email_user);

					IF (
						operations = 0
					)
					THEN
						RETURN TRUE;
					ELSE
						RETURN FALSE;
			...
```

#### sec_cust.migrate_some_users
- **Type:** function
- **Arguments:** `first_migrated integer, last_migrated integer`
- **Returns:** `character varying`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.migrate_some_users(first_migrated integer, last_migrated integer)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
    counter INT;
    BEGIN
        FOR counter IN first_migrated..last_migrated LOOP
            RAISE NOTICE 'Migrating user: %', counter;
            PERFORM sec_cust.migrate_user(counter);
            RAISE NOTICE 'Successfully migrated';
        END LOOP;
        RETURN 'Successful migration.';
    END;
$function$

```

#### sec_cust.migrate_user
- **Type:** function
- **Arguments:** `none`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.migrate_user()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
    -- missing source code
end;
$function$

```

#### sec_cust.monthly_accumulated_by_user
- **Type:** function
- **Arguments:** `_cust_cr_cod_pub character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.monthly_accumulated_by_user(_cust_cr_cod_pub character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					acum FLOAT;
					current_week INT;
				BEGIN
					current_week := date_part('month',NOW());

					SELECT CASE WHEN SUM(R.total_origin_local_amount) is null THEN 0
								ELSE SUM(R.total_origin_local_amount)
							END		INTO 	acum
					FROM prc_mng.lnk_cr_remittances AS R, sec_cust.ms_sixmap_users AS U
					WHERE R.id_client = U.id_user
	...
```

#### sec_cust.number_to_hispanic_format
- **Type:** function
- **Arguments:** `num double precision`
- **Returns:** `character varying`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.number_to_hispanic_format(num double precision)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
					format_num VARCHAR;
				BEGIN

					SELECT to_char(num, '999,999,999,999,999,999,999.99') INTO format_num;

					format_num := REPLACE(format_num,'.','#');
					format_num := REPLACE(format_num,',','.');
					format_num := REPLACE(format_num,'#',',');

					RETURN format_num;
				END;
$function$

```

#### sec_cust.operation_cant_remittance
- **Type:** function
- **Arguments:** `p_country character varying, p_month character varying, p_date character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.operation_cant_remittance(p_country character varying, p_month character varying, p_date character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
resp_obj JSONB;
resp_obj2 JSONB;
registered integer;
actived integer;
desactived integer;
BEGIN
IF((p_country is null or p_country = '' or p_country = 'undefined') and (p_month is null or p_month = '' or p_country = 'undefined') and (p_date is null or p_date = '' or p_country = 'undefined'))
...
```

#### sec_cust.profile_notification
- **Type:** function
- **Arguments:** `none`
- **Returns:** `trigger`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.profile_notification()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
				new_name_profile	VARCHAR;
				new_id_global_notification	INT;
				new_id_notification	INT;
				noti sec_cust.ms_notifications%ROWTYPE;
				noti_obj JSON;
			BEGIN
				SELECT P.name_profile INTO new_name_profile
				FROM sec_cust.ms_profiles AS P
				WHERE P.uuid_profile = NEW.uuid_profile;

				IF (new_name_profile = 'Embajador-1')
				THEN
					SELECT GN.id_global_notification...
```

#### sec_cust.quantity_of_remittance
- **Type:** function
- **Arguments:** `p_country character varying, p_month character varying, p_date character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.quantity_of_remittance(p_country character varying, p_month character varying, p_date character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
resp_obj JSONB;
resp_obj2 JSONB;
resp_obj3 JSONB;
registered integer;
actived integer;
BEGIN
IF((p_country is null or p_country = '') and (p_month is null or p_month = '') and (p_date is null or p_date = ''))
	THEN
	raise notice 'Entra en nada';
	select count(*) into registered from sec_cust.m...
```

#### sec_cust.quantity_refers_users_by_client
- **Type:** function
- **Arguments:** `p_country character varying, p_month character varying, p_date character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.quantity_refers_users_by_client(p_country character varying, p_month character varying, p_date character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
resp_obj JSONB;
resp_obj2 JSONB;
resp_obj3 JSONB;
registered integer;
actived integer;
BEGIN
IF((p_country is null or p_country = '') and (p_month is null or p_month = '') and (p_date is null or p_date = ''))
	THEN
	raise notice 'Entra en nada';
	select COUNT(u.*) as "Referidos" into ...
```

#### sec_cust.quantity_remittance_mode
- **Type:** function
- **Arguments:** `p_country character varying, p_month character varying, p_date character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.quantity_remittance_mode(p_country character varying, p_month character varying, p_date character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
resp_obj JSONB;
resp_obj2 JSONB;
resp_obj3 JSONB;
registered integer;
actived integer;
BEGIN
IF((p_country is null or p_country = '') and (p_month is null or p_month = '') and (p_date is null or p_date = ''))
	THEN
	raise notice 'Entra en nada';
	SELECT json_build_object(
    'Chat', COUNT(...
```

#### sec_cust.quantity_type_status_client
- **Type:** function
- **Arguments:** `p_country character varying, p_month character varying, p_date character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.quantity_type_status_client(p_country character varying, p_month character varying, p_date character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
resp_obj JSONB;
resp_obj2 JSONB;
resp_obj3 JSONB;
registered integer;
actived integer;
BEGIN
IF((p_country is null or p_country = '') and (p_month is null or p_month = '') and (p_date is null or p_date = ''))
	THEN
	raise notice 'Entra en nada';
	SELECT json_build_object(
    'Constante'...
```

#### sec_cust.random_between
- **Type:** function
- **Arguments:** `low integer, high integer`
- **Returns:** `integer`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.random_between(low integer, high integer)
 RETURNS integer
 LANGUAGE plpgsql
 STRICT
AS $function$
BEGIN
			RETURN floor(random()* (high-low + 1) + low);
			END;
$function$

```

#### sec_cust.ranking_quantity_of_remittance_mode
- **Type:** function
- **Arguments:** `p_country character varying, p_month character varying, p_date character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.ranking_quantity_of_remittance_mode(p_country character varying, p_month character varying, p_date character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
resp_obj JSONB;
resp_obj2 JSONB;
resp_obj4 JSONB;
resp_obj3 JSONB;
registered integer;
actived integer;
BEGIN
IF((p_country is null or p_country = '') and (p_month is null or p_month = '') and (p_date is null or p_date = ''))
	THEN
	raise notice 'Entra en nada';
	SELECT json_agg(...
```

#### sec_cust.ranking_quantity_of_remittance_mode_operation
- **Type:** function
- **Arguments:** `p_country character varying, p_month character varying, p_date character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.ranking_quantity_of_remittance_mode_operation(p_country character varying, p_month character varying, p_date character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
resp_obj JSONB;
resp_obj2 JSONB;
resp_obj3 JSONB;
resp_obj4 JSONB;
registered integer;
actived integer;
BEGIN
IF((p_country is null or p_country = '') and (p_month is null or p_month = '') and (p_date is null or p_date = ''))
	THEN
	raise notice 'Entra en nada';
	SELECT...
```

#### sec_cust.rate_change
- **Type:** function
- **Arguments:** `none`
- **Returns:** `trigger`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.rate_change()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare
				_rate_type_name             VARCHAR;
				rate                 		json;
				resp_obj                 	json;
			begin

				SELECT json_agg(T.*) INTO rate
				FROM (SELECT
						R.id_rate,
						R.rate_factor,
						R.id_origin_country,
						R.id_currency_origin,
						R.id_destiny_country,
						R.id_currency_destiny,
						R.operation,
						R.id_rate_type,
						R.active,
						EXTRACT(...
```

#### sec_cust.remittance_cant_rate_operation
- **Type:** function
- **Arguments:** `p_country character varying, p_month character varying, p_date character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.remittance_cant_rate_operation(p_country character varying, p_month character varying, p_date character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
resp_obj JSONB;
resp_obj2 JSONB;
registered double precision;
actived double precision;
desactived double precision;
pause double precision;
BEGIN
IF((p_country is null or p_country = '' or p_country = 'undefined') and (p_month is null or p_month = '' or p_country = 'undefined') and (p_d...
```

#### sec_cust.remittance_cant_rate_operation_amount
- **Type:** function
- **Arguments:** `p_country character varying, p_month character varying, p_date character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.remittance_cant_rate_operation_amount(p_country character varying, p_month character varying, p_date character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
resp_obj JSONB;
resp_obj2 JSONB;
registered double precision;
actived double precision;
desactived double precision;
pause double precision;
BEGIN
IF((p_country is null or p_country = '' or p_country = 'undefined') and (p_month is null or p_month = '' or p_country = 'undefined') a...
```

#### sec_cust.report_amount_sent_by_benef
- **Type:** function
- **Arguments:** `_from_date bigint, _to_date bigint, _id_country bigint, _id_currency bigint, _id_beneficiary bigint, _email_user character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.report_amount_sent_by_benef(_from_date bigint, _to_date bigint, _id_country bigint, _id_currency bigint, _id_beneficiary bigint, _email_user character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					report JSONB;
				BEGIN
					SELECT json_agg(T.*) INTO report
					FROM (
						SELECT SUM(B.partial_local_amount) AS origin_sum, date_part('month',R.date_closed) as month, date_part('year',R.date_closed) as year, ((SELECT s...
```

#### sec_cust.report_amount_sent_by_currency
- **Type:** function
- **Arguments:** `_email_user character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.report_amount_sent_by_currency(_email_user character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					report JSONB;
				BEGIN
					SELECT json_agg(T.*) INTO report
					FROM (
							SELECT
								SUM(R.total_origin_amount) AS local_sum,
								SUM(R.total_origin_dollar_amount) AS dollar_sum,
								((SELECT sec_cust.sp_get_currency_by_remittance(R.id_remittance))->>'id_country')::int AS id_country,
								((SELECT s...
```

#### sec_cust.report_cou_and_cur_with_most_money_transfered_by_range_time
- **Type:** function
- **Arguments:** `_from_date bigint, _to_date bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.report_cou_and_cur_with_most_money_transfered_by_range_time(_from_date bigint, _to_date bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					report JSONB;
					report_top_five JSONB;
				BEGIN

					SELECT json_agg(T) INTO report
					FROM (SELECT SUM(total_origin_dollar_amount) AS total_amount, viewing_name, id_country, iso_cod, id_currency
							FROM (SELECT *
									FROM
										(
										SELECT R.total_origin_dolla...
```

#### sec_cust.report_cou_with_most_money_transfered_by_range_time
- **Type:** function
- **Arguments:** `_from_date bigint, _to_date bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.report_cou_with_most_money_transfered_by_range_time(_from_date bigint, _to_date bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					report JSONB;
					report_top_five JSONB;
				BEGIN

					SELECT json_agg(T) INTO report
					FROM (SELECT COUNT(id_remittance) AS total_transactions, viewing_name, id_country
							FROM (SELECT *
									FROM
										(
										SELECT R.id_remittance, CO.viewing_name, CO.id_country
							...
```

#### sec_cust.report_rates_taken_advantage
- **Type:** function
- **Arguments:** `_email_user character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.report_rates_taken_advantage(_email_user character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					report JSONB;
				BEGIN
					SELECT json_agg(T.*) INTO report
					FROM (
							SELECT
									CASE
										WHEN R.id_manual_rate IS NOT NULL
										THEN (SELECT RT2.rate_type_name
											FROM sec_cust.ms_cr_manual_rate AS MR2, sec_cust.ms_cr_rate_type RT2
											WHERE MR2.id_rate_type = RT2.id_rate_type
			...
```

#### sec_cust.report_remittances_by_month
- **Type:** function
- **Arguments:** `_email_user character varying, _month bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.report_remittances_by_month(_email_user character varying, _month bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					report JSONB;
				BEGIN
					SELECT json_agg(T.*) INTO report
					FROM (
							SELECT
								COUNT(R.id_remittance) AS total, date_part('month',R.date_closed) AS month,date_part('year',R.date_closed) AS year
							FROM prc_mng.lnk_cr_remittances AS R
							WHERE R.id_client = (SELECT U.id_user
										...
```

#### sec_cust.report_remittances_by_status
- **Type:** function
- **Arguments:** `_email_user character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.report_remittances_by_status(_email_user character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					report JSONB;
					by_status JSONB;
					total_remittances JSONB;
				BEGIN
					SELECT json_agg(T.*) INTO by_status
					FROM (
							SELECT
								COUNT(R.id_remittance) AS total, R.public_status
							FROM prc_mng.lnk_cr_remittances AS R
							WHERE R.id_client = (SELECT U.id_user
												FROM sec_cust.ms_sixmap...
```

#### sec_cust.report_top_frequent_beneficiaries
- **Type:** function
- **Arguments:** `_email_user character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.report_top_frequent_beneficiaries(_email_user character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					report JSONB;
				BEGIN
					SELECT json_agg(T.*) INTO report
					FROM (
							SELECT COUNT(B.id_frequent_beneficiary), B.id_frequent_beneficiary, FB.owner_name
							FROM prc_mng.lnk_cr_remittances AS R, prc_mng.ms_cr_beneficiaries AS B, prc_mng.ms_cr_frequents_beneficiaries FB
							WHERE R.id_client = (SELECT U...
```

#### sec_cust.report_top_frequent_destinations
- **Type:** function
- **Arguments:** `_email_user character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.report_top_frequent_destinations(_email_user character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					report JSONB;
				BEGIN
					SELECT json_agg(T.*) INTO report
					FROM (
							SELECT
								COUNT(((SELECT sec_cust.sp_get_destiny_currency_by_remittance(R.id_remittance))->>'id_country')::int),
								(((SELECT sec_cust.sp_get_destiny_currency_by_remittance(R.id_remittance))->>'id_country')::int) AS id_country,
	...
```

#### sec_cust.report_users_with_money_transfered_by_range_time_and_country
- **Type:** function
- **Arguments:** `_from_date bigint, _to_date bigint, _id_country bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.report_users_with_money_transfered_by_range_time_and_country(_from_date bigint, _to_date bigint, _id_country bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					report JSONB;
					report_top_ten JSONB;
				BEGIN

					SELECT json_agg(T) INTO report
					FROM (SELECT SUM(R.total_origin_dollar_amount) AS total_amount, UC.cust_cr_cod_pub, UP.first_name, UP.last_name, UC.id_verif_level, C.country_iso_code
					FROM sec_cust.ms_s...
```

#### sec_cust.report_users_with_most_transactions_by_range_time_and_country
- **Type:** function
- **Arguments:** `_from_date bigint, _to_date bigint, _id_country bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.report_users_with_most_transactions_by_range_time_and_country(_from_date bigint, _to_date bigint, _id_country bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					report JSONB;
					report_top_ten JSONB;
				BEGIN

					SELECT json_agg(T) INTO report
					FROM (SELECT COUNT(R.id_remittance) AS total_transactions, UC.cust_cr_cod_pub, UP.first_name, UP.last_name, UC.id_verif_level, C.country_iso_code
					FROM sec_cust.ms_sixma...
```

#### sec_cust.report_wholesale_partner_profit
- **Type:** function
- **Arguments:** `_slug character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.report_wholesale_partner_profit(_slug character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					local_currency_iso_code VARCHAR;
					local_currency_profit JSONB;
					usd_profit JSONB;
				BEGIN
					SELECT SUM(R.wholesale_partner_profit_local_currency) INTO local_currency_profit
					FROM prc_mng.lnk_cr_remittances AS R, sec_cust.ms_wholesale_partners_info WPI, sec_cust.ms_sixmap_users AS U
					WHERE U.id_wholesale_p...
```

#### sec_cust.report_wholesale_partner_profit_by_currency
- **Type:** function
- **Arguments:** `_slug character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.report_wholesale_partner_profit_by_currency(_slug character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					profit JSONB;
				BEGIN
					SELECT json_agg(T.*) INTO profit
					FROM (SELECT
								SUM(CASE
										WHEN B.trans_type = 'C'
										THEN B.amount
										ELSE 0
									END
									) AS credits,
								SUM(CASE
										WHEN B.trans_type = 'D'
										THEN B.amount
										ELSE 0
									END
		...
```

#### sec_cust.report_wholesale_partner_remittances_quantity
- **Type:** function
- **Arguments:** `_slug character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.report_wholesale_partner_remittances_quantity(_slug character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					op_quant JSONB;
				BEGIN
					SELECT COUNT(R.id_remittance) INTO op_quant
					FROM prc_mng.lnk_cr_remittances AS R, sec_cust.ms_wholesale_partners_info WPI, sec_cust.ms_sixmap_users AS U
					WHERE U.id_wholesale_partner = (SELECT U.id_user
													FROM sec_cust.ms_sixmap_users AS U
													WHERE U.e...
```

#### sec_cust.report_wholesale_partner_top_5_clients
- **Type:** function
- **Arguments:** `_slug character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.report_wholesale_partner_top_5_clients(_slug character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					top_3 JSONB;
				BEGIN
					SELECT json_agg(T) INTO top_3
					FROM (
						SELECT COUNT(R.id_remittance), (UP.first_name || ' ' || UP.last_name) AS client_name
						FROM prc_mng.lnk_cr_remittances AS R, sec_cust.ms_wholesale_partners_info WPI, sec_cust.ms_sixmap_users AS U, priv.ms_sixmap_users AS UP
						WHERE U.id...
```

#### sec_cust.send_status_message
- **Type:** function
- **Arguments:** `none`
- **Returns:** `trigger`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.send_status_message()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
				_email_user	VARCHAR;
				v_id_chat	BIGINT;
				message_body	JSON;
			BEGIN
				SELECT U.email_user INTO _email_user
				FROM sec_cust.ms_sixmap_users U
				WHERE U.id_user = NEW.id_client;

				SELECT C.id_chat INTO v_id_chat
				FROM msg_app.v_chats_info C
				WHERE C.customer_email = _email_user;

				message_body := '{"msg": "El estatus de su remesa ' || NEW.id_remittance_pub...
```

#### sec_cust.set_mail_as_sent
- **Type:** function
- **Arguments:** `_id_mail_user bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.set_mail_as_sent(_id_mail_user bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
    resp_obj JSONB;
    updated_id_mail_user BIGINT;
BEGIN
    UPDATE sec_cust.lnk_mail_user
    SET sent = TRUE
    WHERE id_mail_user = _id_mail_user
    RETURNING id_mail_user INTO updated_id_mail_user;

    IF (updated_id_mail_user IS NULL)
    THEN
        RAISE EXCEPTION 'There was a problem setting mail as sent.';
    END IF;

    resp_obj := json...
```

#### sec_cust.similar_strings
- **Type:** function
- **Arguments:** `str1 character varying, str2 character varying`
- **Returns:** `boolean`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.similar_strings(str1 character varying, str2 character varying)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp BOOLEAN;
				BEGIN

					SELECT str1 ILIKE '%' || str2 || '%' INTO resp;

					RETURN resp;
				END;
$function$

```

#### sec_cust.sp__range_rate_update__by_id
- **Type:** function
- **Arguments:** `_lower_limit double precision, _upper_limit double precision, _id_range_rates integer, _id_cou_cur_origin integer, _id_cou_cur_destiny integer, _min_amount double precision`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp__range_rate_update__by_id(_lower_limit double precision, _upper_limit double precision, _id_range_rates integer, _id_cou_cur_origin integer, _id_cou_cur_destiny integer, _min_amount double precision)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					succesfully_updated_value INT;
					succesfully_updated_values JSON;
					current_range_rate sec_cust.lnk_range_rates%ROWTYPE;
				BEGIN
					raise notice 'LLEGANDO: %' ,_lower_limi...
```

#### sec_cust.sp_aditional_detail_verif_levels_requirements
- **Type:** function
- **Arguments:** `p_id integer, p_level integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_aditional_detail_verif_levels_requirements(p_id integer, p_level integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					level_one_detail JSONB;
					level_two_detail JSONB;
				BEGIN
				IF p_level = 1 then

					select json_build_object('Name', V.name, 'LastName', V.lastname, 'BirthDate', U.date_birth, 'Gender', U.gender, 'Nacionality', P.country_name, 'IdentType', D.name_doc_type, 'Phone', U.main_phone) into level_one_detail
					from sec_cus...
```

#### sec_cust.sp_approve_level_cero
- **Type:** function
- **Arguments:** `_email_user character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_approve_level_cero(_email_user character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE current_full_user sec_cust.ms_sixmap_users %ROWTYPE;
				id_noti INT;
				noti JSON;
			BEGIN
				SELECT * INTO current_full_user
				FROM sec_cust.ms_sixmap_users AS U
				WHERE email_user = _email_user;

				IF (current_full_user.uuid_user IS NOT NULL)
				THEN

					UPDATE sec_cust.lnk_users_verif_level
					SET level_req = jsonb_set(
							level_req,...
```

#### sec_cust.sp_approve_level_one
- **Type:** function
- **Arguments:** `doc_approved boolean, selfie_approved boolean, state_name_approved boolean, resid_city_approved boolean, id_doc_type_approved boolean, doc_number_approved boolean, occupation_approved boolean, main_sn_platf_approved boolean, user_main_sn_platf_approved boolean, address boolean, _email_user character varying, _file character varying, _comment character varying, disable_country_exc boolean, disable_phone_exc boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_approve_level_one(doc_approved boolean, selfie_approved boolean, state_name_approved boolean, resid_city_approved boolean, id_doc_type_approved boolean, doc_number_approved boolean, occupation_approved boolean, main_sn_platf_approved boolean, user_main_sn_platf_approved boolean, address boolean, _email_user character varying, _file character varying, _comment character varying, disable_country_exc boolean, disable_phone_exc boolean)
 RETURNS json
 LANGUAGE ...
```

#### sec_cust.sp_approve_level_one_test
- **Type:** function
- **Arguments:** `doc_approved boolean, selfie_approved boolean, state_name_approved boolean, resid_city_approved boolean, id_doc_type_approved boolean, doc_number_approved boolean, occupation_approved boolean, main_sn_platf_approved boolean, user_main_sn_platf_approved boolean, address boolean, _email_user character varying, _file character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_approve_level_one_test(doc_approved boolean, selfie_approved boolean, state_name_approved boolean, resid_city_approved boolean, id_doc_type_approved boolean, doc_number_approved boolean, occupation_approved boolean, main_sn_platf_approved boolean, user_main_sn_platf_approved boolean, address boolean, _email_user character varying, _file character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
begin
    -- missing source code
end;
$function$

```

#### sec_cust.sp_approve_level_two
- **Type:** function
- **Arguments:** `funds_source_approved boolean, residency_proof_approved boolean, account_uses_approved boolean, monthly_amount_approved boolean, work_industry_approved boolean, _email_user character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_approve_level_two(funds_source_approved boolean, residency_proof_approved boolean, account_uses_approved boolean, monthly_amount_approved boolean, work_industry_approved boolean, _email_user character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
begin
    -- missing source code
end;
$function$

```

#### sec_cust.sp_approve_level_two_test
- **Type:** function
- **Arguments:** `funds_source_approved boolean, residency_proof_approved boolean, account_uses_approved boolean, monthly_amount_approved boolean, work_industry_approved boolean, _email_user character varying, _file character varying, _comment character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_approve_level_two_test(funds_source_approved boolean, residency_proof_approved boolean, account_uses_approved boolean, monthly_amount_approved boolean, work_industry_approved boolean, _email_user character varying, _file character varying, _comment character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE current_full_user sec_cust.ms_sixmap_users %ROWTYPE;
				id_noti INT;
				noti JSON;
				BEGIN
					SELECT * INTO current_full_user
					FR...
```

#### sec_cust.sp_approve_wholesale_partner
- **Type:** function
- **Arguments:** `reasons_approved boolean, strenghts_approved boolean, remittance_service_approved boolean, old_resid_client_countries_approved boolean, profession_approved boolean, resid_country_approved boolean, migration_status_approved boolean, new_resid_client_countries_approved boolean, clients_number_approved boolean, monthly_amount_approved boolean, monetary_growth_approved boolean, clients_growth_approved boolean, bussiness_name_approved boolean, web_page_exp_approved boolean, logo_approved boolean, _email_user character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_approve_wholesale_partner(reasons_approved boolean, strenghts_approved boolean, remittance_service_approved boolean, old_resid_client_countries_approved boolean, profession_approved boolean, resid_country_approved boolean, migration_status_approved boolean, new_resid_client_countries_approved boolean, clients_number_approved boolean, monthly_amount_approved boolean, monetary_growth_approved boolean, clients_growth_approved boolean, bussiness_name_approved b...
```

#### sec_cust.sp_asign_wallet_to_client
- **Type:** function
- **Arguments:** `_email_user character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_asign_wallet_to_client(_email_user character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				full_user sec_cust.ms_sixmap_users%ROWTYPE;
				kraken_btc_wallet sec_cust.ms_wallets%ROWTYPE;
				kraken_usdt_wallet sec_cust.ms_wallets%ROWTYPE;
				binance_btc_wallet sec_cust.ms_wallets%ROWTYPE;
				binance_usdt_wallet sec_cust.ms_wallets%ROWTYPE;
				id_spain INT;
				resp_obj JSON;
				_err TEXT;
			BEGIN
			-- se busca la informacion para i...
```

#### sec_cust.sp_balances_activate_by_id
- **Type:** function
- **Arguments:** `_id_balance bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_balances_activate_by_id(_id_balance bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					succesfully_updated BIGINT;
				BEGIN
					UPDATE sec_cust.ms_balances
					SET
						active = true
					WHERE id_balance = _id_balance
					RETURNING id_balance INTO succesfully_updated;

					IF (succesfully_updated IS NOT NULL)
					THEN
						resp_obj := json_build_object(
								'message', 'Balance succesfully activated.'
							...
```

#### sec_cust.sp_balances_deactivate_by_id
- **Type:** function
- **Arguments:** `_id_balance bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_balances_deactivate_by_id(_id_balance bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					succesfully_updated BIGINT;
				BEGIN
					UPDATE sec_cust.ms_balances
					SET
						active = false
					WHERE id_balance = _id_balance
					RETURNING id_balance INTO succesfully_updated;

					IF (succesfully_updated IS NOT NULL)
					THEN
						resp_obj := json_build_object(
								'message', 'Balance succesfully deactivated.'
		...
```

#### sec_cust.sp_balances_get_all
- **Type:** function
- **Arguments:** `_active boolean, _email_user character varying, _id_currency integer, _start_date bigint, _end_date bigint, _id_wallet integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_balances_get_all(_active boolean, _email_user character varying, _id_currency integer, _start_date bigint, _end_date bigint, _id_wallet integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					balances JSONB;
					total_credit FLOAT;
					total_debit FLOAT;
					available_balance FLOAT;
				BEGIN
					SELECT json_agg(T.*) INTO balances
					FROM (SELECT
								B.id_balance,
								B.amount,
								B.id_currency,
								(S...
```

#### sec_cust.sp_bh_users_info_cursor
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE(verif_level text, signup_date timestamp with time zone, level_1_aprov_date timestamp with time zone, level_2_aprov_date timestamp with time zone, last_ip_country text, client_type text, original_pub_id text, sixmap_pub_id character varying, signup_country text, resid_country text, names text, last_names text, date_birth timestamp with time zone, sex character, nationality_country text, email_user character varying, phone_number character varying, doc_type character varying, doc_country character varying, doc_number character varying, state text, resid_city text, address text, referral_id text, main_sn_platf text, user_main_sn_platf text, funds_source text, monthly_income text, job_title text, work_industry text, total_referreds integer, active_referreds integer, first_remittance_date timestamp with time zone, last_remittance_date timestamp with time zone, total_app_remittances bigint, total_chat_remittances bigint)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_bh_users_info_cursor()
 RETURNS TABLE(verif_level text, signup_date timestamp with time zone, level_1_aprov_date timestamp with time zone, level_2_aprov_date timestamp with time zone, last_ip_country text, client_type text, original_pub_id text, sixmap_pub_id character varying, signup_country text, resid_country text, names text, last_names text, date_birth timestamp with time zone, sex character, nationality_country text, email_user character varying, phon...
```

#### sec_cust.sp_block_user
- **Type:** function
- **Arguments:** `_email_user character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_block_user(_email_user character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
			UPDATE sec_cust.ms_sixmap_users
			SET user_blocked = true,
				user_active = false
			WHERE email_user = _email_user;
			END;
$function$

```

#### sec_cust.sp_calculate_bank_fee
- **Type:** function
- **Arguments:** `_id_origin_bank integer, _id_destiny_bank integer, _id_pay_method integer`
- **Returns:** `jsonb`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_calculate_bank_fee(_id_origin_bank integer, _id_destiny_bank integer, _id_pay_method integer)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
					_fee JSONB;
					are_allied_banks	BOOLEAN;
				BEGIN
					IF (_id_origin_bank = _id_destiny_bank)
					THEN
						-- si ambos bancos son el mismo
						SELECT json_agg(T.*) INTO _fee
						FROM (SELECT F.id_country, F.id_bank, F.id_pay_method, F.transfer_type, F.amount_fee, F.percent_fee
							FROM sec_cu...
```

#### sec_cust.sp_cancel_pre_remittance
- **Type:** function
- **Arguments:** `_id_pre_remittance integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_cancel_pre_remittance(_id_pre_remittance integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					_date_creation BIGINT;
					_date_last_shown BIGINT;
					_there_is_id_pre_remittance BIGINT;
					_email_user VARCHAR;
					_pre_remittance JSON;
				BEGIN
					SELECT PR.id_pre_remittance, EXTRACT(EPOCH FROM (PR.date_creation)), PR.email_user INTO _there_is_id_pre_remittance, _date_creation, _email_user
					FROM sec_cust.ms_pr...
```

#### sec_cust.sp_chat_remittance_get_by_email
- **Type:** function
- **Arguments:** `_email_user character varying, _mode character varying`
- **Returns:** `TABLE(id_remittance bigint, email_user character varying, id_remittance_pub character varying, id_account integer, origin_deposit_amount double precision, origin_comission double precision, id_rate integer, total_destiny_amount double precision, date_created bigint, cr_rem_status_ppl character varying, origin_iso_code character varying, destiny_iso_code character varying, origin_currency character varying, destiny_currency character varying, public_status character varying, mode character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_chat_remittance_get_by_email(_email_user character varying, _mode character varying)
 RETURNS TABLE(id_remittance bigint, email_user character varying, id_remittance_pub character varying, id_account integer, origin_deposit_amount double precision, origin_comission double precision, id_rate integer, total_destiny_amount double precision, date_created bigint, cr_rem_status_ppl character varying, origin_iso_code character varying, destiny_iso_code character v...
```

#### sec_cust.sp_cod_pub_exists
- **Type:** function
- **Arguments:** `_cust_cr_cod_pub character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_cod_pub_exists(_cust_cr_cod_pub character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				resp_obj JSONB;
				message VARCHAR;
				_exists INT;
			BEGIN
				SELECT U.id_user INTO _exists
				FROM sec_cust.ms_sixmap_users AS U
				WHERE U.cust_cr_cod_pub = _cust_cr_cod_pub
				AND (
					(
						U.id_verif_level = 1
						AND U.verif_level_apb = TRUE
					)
					OR U.id_verif_level = 2
				);

				IF (_exists IS NOT NULL)
				THEN
					mes...
```

#### sec_cust.sp_create_user_extra_data
- **Type:** function
- **Arguments:** `p_id_user integer, p_extra_data_items json[]`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_create_user_extra_data(p_id_user integer, p_extra_data_items json[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    v_extra_data_item                   json;
begin
    foreach v_extra_data_item in array p_extra_data_items loop
        insert into sec_cust.lnk_users_extra_data (value, id_user, id_item)
        values (v_extra_data_item ->> 'value', p_id_user, (v_extra_data_item ->> 'idItem')::int);
    end loop;
end;
$function$

```

#### sec_cust.sp_create_user_extra_data_third_modal
- **Type:** function
- **Arguments:** `p_id_user integer, p_industry character varying, p_amount character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_create_user_extra_data_third_modal(p_id_user integer, p_industry character varying, p_amount character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
begin
    insert into sec_cust.lnk_users_extra_data (value, id_user, id_item)
    values (p_industry, p_id_user, (
        select it.id_item
        from sec_cust.ms_item it
        where it.name = 'Industria en la que trabaja'
    ));

    insert into sec_cust.lnk_users_extra_data (value, id_...
```

#### sec_cust.sp_deactivate_user
- **Type:** function
- **Arguments:** `_email_user character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_deactivate_user(_email_user character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				resp_obj JSON;
				__email_user VARCHAR;
			BEGIN
				UPDATE sec_cust.ms_sixmap_users
				SET user_active = false
				WHERE email_user = _email_user
				RETURNING email_user INTO __email_user;

				IF (__email_user IS NOT NULL)
				THEN
					resp_obj := json_build_object(
							'message', 'User succesfully deactivated'
							);
					RETURN resp_obj;
		...
```

#### sec_cust.sp_deactive_notification
- **Type:** function
- **Arguments:** `_id_notification integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_deactive_notification(_id_notification integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
BEGIN
					UPDATE sec_cust.ms_notifications
					SET active = false
					WHERE id_notification = _id_notification;

					RETURN json_build_object(
								'msg', 'Notification succesfully deactivated'
							);
				END;
$function$

```

#### sec_cust.sp_detail_verif_levels_requirements
- **Type:** function
- **Arguments:** `p_id integer, p_pending boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_detail_verif_levels_requirements(p_id integer, p_pending boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
    level_cero JSONB;
    level_one JSONB;
    level_two JSONB;
BEGIN
IF p_pending = true then

    SELECT json_agg(elem) into level_cero
    FROM sec_cust.LNK_USERS_VERIF_LEVEL AS L, sec_cust.ms_sixmap_users AS U,
    jsonb_array_elements(L.level_req) elem
    WHERE L.id_vl = 0
    AND L.uuid_user = U.uuid_user
    AND L.id_u...
```

#### sec_cust.sp_expire_pre_remittance
- **Type:** function
- **Arguments:** `_id_pre_remittance integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_expire_pre_remittance(_id_pre_remittance integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					_date_creation BIGINT;
					_date_last_shown BIGINT;
					_there_is_id_pre_remittance BIGINT;
					_email_user VARCHAR;
					_pre_remittance JSON;
				BEGIN
					SELECT PR.id_pre_remittance, EXTRACT(EPOCH FROM (PR.date_creation)), PR.email_user INTO _there_is_id_pre_remittance, _date_creation, _email_user
					FROM sec_cust.ms_pr...
```

#### sec_cust.sp_generate_code
- **Type:** function
- **Arguments:** `_ident_user character varying, mode character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_generate_code(_ident_user character varying, mode character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				generated_code INT;
				code_found VARCHAR;
			BEGIN
						generated_code := (SELECT sec_cust.random_between(100000,999999));

						SELECT T.code INTO code_found
						FROM sec_cust.MS_TEMP_CODES AS T
						WHERE T.ident_user = _ident_user;

						IF (code_found IS NOT NULL)
							THEN
								DELETE FROM sec_cust.MS_TEMP_CODES AS...
```

#### sec_cust.sp_generate_pub_code
- **Type:** function
- **Arguments:** `fullchar character varying, previous_cod character varying`
- **Returns:** `character varying`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_generate_pub_code(fullchar character varying, previous_cod character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
				generated_pub_cod VARCHAR;
			BEGIN
				IF (previous_cod IS NOT NULL)
				THEN
                    RAISE NOTICE '1 GENERATE CODE';
					generated_pub_cod := UPPER(RIGHT(fullChar, 3)) || 'CR' || UPPER(RIGHT(previous_cod, 5));
					generated_pub_cod := replace(generated_pub_cod,' ','');
                 ...
```

#### sec_cust.sp_get_balances_by_user
- **Type:** function
- **Arguments:** `_email_user character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_balances_by_user(_email_user character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					balances JSONB;
					resid_currency JSONB;
				BEGIN
					SELECT json_agg(T.*) INTO balances
					FROM (SELECT
								SUM(
									CASE
									WHEN B.trans_type = 'C'
									THEN B.amount
									WHEN B.trans_type = 'D'
									THEN -1 * (B.amount)
									END
									) AS balance,
								(SELECT * FROM sec_cust.sp_g...
```

#### sec_cust.sp_get_bank_accounts_by_pay_method
- **Type:** function
- **Arguments:** `_id_pay_method integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_bank_accounts_by_pay_method(_id_pay_method integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
        resp_obj JSONB;
    BEGIN
        SELECT json_agg(T.*) INTO resp_obj
        FROM (SELECT
                    (SELECT b.name
                    FROM sec_cust.ms_banks b
                    WHERE b.id_bank = a.id_bank) as bank_name,
                    a.id_bank,
                    a.id_bank_account,
                    a.account_holder_nam...
```

#### sec_cust.sp_get_banks_by_pay_method
- **Type:** function
- **Arguments:** `_id_pay_method integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_banks_by_pay_method(_id_pay_method integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
				BEGIN
					SELECT json_agg(T.*) INTO resp_obj
					FROM (SELECT B.id_bank, B.name, B.ident_code, B.id_country
						FROM sec_cust.lnk_bank_pay_method BPM, sec_cust.ms_pay_methods PM, sec_cust.ms_banks B
						WHERE BPM.id_pay_method = PM.id_pay_method
						AND BPM.id_bank = B.id_bank
						AND PM.id_pay_method = _id_pay_me...
```

#### sec_cust.sp_get_basic_by_type
- **Type:** function
- **Arguments:** `_currency_type character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_basic_by_type(_currency_type character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
				BEGIN
					IF (_currency_type IS NULL)
					THEN
						SELECT jsonb_agg(T.*) INTO resp_obj
						FROM	(SELECT CU.*
								FROM sec_cust.ms_currencies CU
								WHERE CU.active = TRUE) AS T;
					ELSE
						SELECT jsonb_agg(T.*) INTO resp_obj
						FROM	(SELECT CU.*
								FROM sec_cust.ms_currencies CU
								WHERE CU.type =...
```

#### sec_cust.sp_get_client_status
- **Type:** function
- **Arguments:** `p_uuid_client uuid`
- **Returns:** `character varying`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_client_status(p_uuid_client uuid)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
declare
    v_id_client                         bigint;
    v_date_now                          bigint;
    v_total_remittance                  int;
    v_date_last_remittance              bigint;
    v_client_status                     varchar;
begin
    -- se obtiene la fecha actual y el id del cliente

    v_date_now := extract(epoch from now())::bigint;

   ...
```

#### sec_cust.sp_get_countries_currencies
- **Type:** function
- **Arguments:** `_email_user character varying`
- **Returns:** `jsonb`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_countries_currencies(_email_user character varying)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
begin
    -- missing source code
end;
$function$

```

#### sec_cust.sp_get_country_referrals_by_user
- **Type:** function
- **Arguments:** `_email_user character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_country_referrals_by_user(_email_user character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					_cust_cr_cod_pub VARCHAR;
				BEGIN
					SELECT U.cust_cr_cod_pub INTO _cust_cr_cod_pub
					FROM sec_cust.ms_sixmap_users as U
					WHERE U.email_user = _email_user;

					SELECT json_agg(T.*) INTO resp_obj
					FROM (
							SELECT
									COUNT(US.id_user) AS total_referrals, C.viewing_name
								FROM sec_cust.ms...
```

#### sec_cust.sp_get_currencies_by_type
- **Type:** function
- **Arguments:** `_currency_type character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_currencies_by_type(_currency_type character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
				BEGIN
					IF (_currency_type IS NULL)
					THEN
						SELECT jsonb_agg(T.*) INTO resp_obj
						FROM	(SELECT CU.*
								FROM sec_cust.ms_currencies CU
								WHERE CU.active = TRUE) AS T;
					ELSE
						SELECT jsonb_agg(T.*) INTO resp_obj
						FROM	(SELECT CU.*,
								( SELECT json_agg(T.*)
								FROM (SELECT NET....
```

#### sec_cust.sp_get_currency_by_remittance
- **Type:** function
- **Arguments:** `_id_remittance bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_currency_by_remittance(_id_remittance bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
				BEGIN
					SELECT
							CASE
								WHEN R.id_rate IS NOT NULL
								THEN (SELECT json_agg(T.*)
										FROM (	SELECT C.*, CO.id_country, CO.viewing_name, CO.country_iso_code, C.iso_cod, CO.name_country
												FROM sec_cust.ms_currencies as C, sec_cust.ms_cr_rate as AR, sec_emp.ms_countries CO
												WHERE C.id_cur...
```

#### sec_cust.sp_get_deposit_methods_by_bank
- **Type:** function
- **Arguments:** `_id_bank bigint`
- **Returns:** `jsonb`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_deposit_methods_by_bank(_id_bank bigint)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					deposit_methods JSONB;
				BEGIN
					SELECT json_agg(T.*) INTO deposit_methods
					FROM (SELECT P.id_pay_method, P.name, P.id_country, P.id_currency
						FROM sec_cust.ms_pay_methods P, sec_cust.lnk_bank_pay_method BP
						WHERE BP.id_pay_method = P.id_pay_method
						AND P.is_deposit_method = TRUE
						AND BP.id_bank = _id_ban...
```

#### sec_cust.sp_get_destiny_currency_by_remittance
- **Type:** function
- **Arguments:** `_id_remittance bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_destiny_currency_by_remittance(_id_remittance bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
				BEGIN
					SELECT
							CASE
								WHEN R.id_rate IS NOT NULL
								THEN (SELECT json_agg(T.*)
										FROM (	SELECT C.*, CO.id_country, CO.viewing_name, CO.country_iso_code, CO.name_country
												FROM sec_cust.ms_currencies as C, sec_cust.ms_cr_rate as AR, sec_emp.ms_countries CO
												WHERE C.id_curren...
```

#### sec_cust.sp_get_doc_type_by_id
- **Type:** function
- **Arguments:** `_id_doc_type integer`
- **Returns:** `TABLE(id_ident_doc_type bigint, acronym character varying, name_doc_type character varying, id_resid_country integer, type_doc_type character varying, id_ip_country integer, name_country character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_doc_type_by_id(_id_doc_type integer)
 RETURNS TABLE(id_ident_doc_type bigint, acronym character varying, name_doc_type character varying, id_resid_country integer, type_doc_type character varying, id_ip_country integer, name_country character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN
					RETURN QUERY
					SELECT dt.id_ident_doc_type,dt.acronym,dt.name_doc_type,dt.id_resid_country,dt.type_doc_type,dt.id_ip_country,dt.name_country
					FROM sec_cust...
```

#### sec_cust.sp_get_equivalent_amounts
- **Type:** function
- **Arguments:** `_amount double precision, _id_origin_country integer, _email_user character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_equivalent_amounts(_amount double precision, _id_origin_country integer, _email_user character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					amounts JSONB;
				BEGIN
					SELECT json_agg(T.*) INTO amounts
					FROM (	SELECT CASE
									WHEN jsonb_typeof((SELECT * FROM sec_cust.sp_ms_cr_rate_get_valid(_id_origin_country,_id_origin_country,COCUS.id_country,COCUS.id_currency,_email_user))->'rates') = 'object'
		...
```

#### sec_cust.sp_get_full_rates
- **Type:** function
- **Arguments:** `_id_origin_country integer, _id_origin_currency integer, _id_destiny_country integer, _id_destiny_currency integer, _email_user character varying`
- **Returns:** `jsonb`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_full_rates(_id_origin_country integer, _id_origin_currency integer, _id_destiny_country integer, _id_destiny_currency integer, _email_user character varying)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare
				resp_obj       				JSONB;
				manual_rates	       		JSONB;
				user_manual_rates	       	JSONB;
				user_special_rates	       	JSONB;
				user_individual_rate	    JSONB;
				user_rates	       			JSONB;
				regular_rate	       		JSONB;
				i...
```

#### sec_cust.sp_get_info_for_rate_api
- **Type:** function
- **Arguments:** `_email_user character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_info_for_rate_api(_email_user character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				_wholesale_partner_info JSON;
				_origin_currency_iso_code VARCHAR;
				_wholesale_partner_origin_currency_iso_code VARCHAR;
				current_client	sec_cust.ms_sixmap_users%ROWTYPE;
			BEGIN
				-- se obtiene la info del usuario

					SELECT U.* INTO current_client
					FROM sec_cust.ms_sixmap_users AS U
					WHERE U.email_user = _email_user;

				-- ...
```

#### sec_cust.sp_get_last_exchanges_by_user
- **Type:** function
- **Arguments:** `_email_user character varying, last_rem integer, _start_date bigint, _end_date bigint, _mode character varying`
- **Returns:** `jsonb`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_last_exchanges_by_user(_email_user character varying, last_rem integer, _start_date bigint, _end_date bigint, _mode character varying)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
				BEGIN
					SELECT jsonb_agg(T.*) INTO resp_obj
					FROM
						(
							SELECT U.*
							FROM
								(
										(SELECT
											EX.id_exchange AS "idExchange",
											EX.id_exchange_pub AS "idExchangePub",
											((SELECT jsonb_...
```

#### sec_cust.sp_get_last_passwords
- **Type:** function
- **Arguments:** `_email_user character varying`
- **Returns:** `TABLE(password text)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_last_passwords(_email_user character varying)
 RETURNS TABLE(password text)
 LANGUAGE plpgsql
AS $function$
DECLARE
				current_full_user sec_cust.MS_SIXMAP_USERS%ROWTYPE;
			BEGIN
				SELECT * INTO current_full_user
				FROM sec_cust.MS_SIXMAP_USERS AS u
				WHERE u.email_user = _email_user;

				RETURN QUERY
				SELECT P.pwd
				FROM sec_cust.LNK_PWDS_REGISTRED_BY_USER AS P
				WHERE P.uuid_user = current_full_user.uuid_user
				ORDER BY P.date_creati...
```

#### sec_cust.sp_get_last_remittances_by_user
- **Type:** function
- **Arguments:** `_email_user character varying, last_rem integer, _start_date bigint, _end_date bigint, _mode character varying, _only_wholesale_partner boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_last_remittances_by_user(_email_user character varying, last_rem integer, _start_date bigint, _end_date bigint, _mode character varying, _only_wholesale_partner boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
    resp_obj JSONB;
BEGIN
    IF (_only_wholesale_partner IS TRUE) THEN
        SELECT jsonb_agg(T.*) INTO resp_obj
        FROM	(SELECT
                    R.id_remittance,
                    R.id_remittance_pub,
         ...
```

#### sec_cust.sp_get_lvl_2_info
- **Type:** function
- **Arguments:** `p_level_answers jsonb, p_atribute character varying`
- **Returns:** `character varying`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_lvl_2_info(p_level_answers jsonb, p_atribute character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
declare
    v_index                             int;
begin
    v_index := 0;
    while (true) loop
        if (p_level_answers -> v_index is null or v_index = 99) then
            exit;
        end if;
        if (p_level_answers -> v_index ->> 'req_type' = p_atribute and (p_level_answers -> v_index ->> 'is_the_last_one')::boolean =...
```

#### sec_cust.sp_get_manual_rate_by_rate_type_and_countries
- **Type:** function
- **Arguments:** `_id_rate_type integer, _id_origin_country integer, _id_destiny_country integer`
- **Returns:** `double precision`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_manual_rate_by_rate_type_and_countries(_id_rate_type integer, _id_origin_country integer, _id_destiny_country integer)
 RETURNS double precision
 LANGUAGE plpgsql
AS $function$
DECLARE
					_rate_factor FLOAT;
				BEGIN
					SELECT MR.rate_factor INTO _rate_factor
					FROM sec_cust.ms_cr_manual_rate MR
					WHERE MR.id_rate_type = _id_rate_type
					AND MR.active = true
					AND MR.id_origin_country = _id_origin_country
					AND MR.id_destiny_country =...
```

#### sec_cust.sp_get_operations_number_by_user
- **Type:** function
- **Arguments:** `_email_user character varying`
- **Returns:** `integer`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_operations_number_by_user(_email_user character varying)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
					_operations_number INT;
					_id_client INT;
				BEGIN
					SELECT U.id_user INTO _id_client
					FROM sec_cust.ms_sixmap_users as U
					WHERE U.email_user = _email_user;

					SELECT COUNT(*) INTO _operations_number
					FROM prc_mng.lnk_cr_remittances R
					WHERE R.id_client = _id_client;

					RETURN _operations_number;
				END;
$f...
```

#### sec_cust.sp_get_origin_banks_by_country_and_currency
- **Type:** function
- **Arguments:** `p_id_country integer, p_id_currency integer`
- **Returns:** `TABLE("idBank" integer, name character varying, ident_code character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_origin_banks_by_country_and_currency(p_id_country integer, p_id_currency integer)
 RETURNS TABLE("idBank" integer, name character varying, ident_code character varying)
 LANGUAGE plpgsql
AS $function$
declare
			begin
                IF (p_id_country = 1 AND p_id_currency = 1) THEN
                    return query
						select
							b.id_bank, b.name, b.ident_code
						from sec_cust.ms_banks b, sec_emp.ms_countries CO, sec_cust.lnk_country_currency CO...
```

#### sec_cust.sp_get_rate_type_by_amount_and_countries
- **Type:** function
- **Arguments:** `_amount double precision, _id_origin_country integer, _id_destiny_country integer`
- **Returns:** `integer`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_rate_type_by_amount_and_countries(_amount double precision, _id_origin_country integer, _id_destiny_country integer)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
					_id_rate_type INT;
					_min INT;
				BEGIN
					SELECT	R.min_amount INTO _min
					FROM sec_cust.LNK_RANGE_RATES AS R
					WHERE R.active = true
					AND R.id_cou_cur_origin = _id_origin_country
					AND R.id_cou_cur_destiny = _id_destiny_country;

					IF (_amount < _min)
			...
```

#### sec_cust.sp_get_referral_operations_by_user
- **Type:** function
- **Arguments:** `_email_user character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_referral_operations_by_user(_email_user character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					operations JSONB;
					total_operations INT;
					_active_referrals INT;
					_cust_cr_cod_pub VARCHAR;
					CRY_query_string VARCHAR;
					AF_query_string VARCHAR;
					ok_connection VARCHAR;
					is_connected BOOLEAN;
					DBLINK_DB_NAME TEXT;
					DBLINK_DB_STRING_CONN TEXT;
				BEGIN
					SELECT * INTO _active_re...
```

#### sec_cust.sp_get_referral_status
- **Type:** function
- **Arguments:** `_email_user character varying`
- **Returns:** `character varying`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_referral_status(_email_user character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
					_final_status VARCHAR;
					_id_client INT;
					difference INT;
					_last_operation_date_closed TIMESTAMPTZ;
				BEGIN
					SELECT U.id_user INTO _id_client
					FROM sec_cust.ms_sixmap_users as U
					WHERE U.email_user = _email_user;

					SELECT R.date_closed INTO _last_operation_date_closed
					FROM prc_mng.lnk_cr_remittances R
	...
```

#### sec_cust.sp_get_referrals_by_user
- **Type:** function
- **Arguments:** `_cust_cr_cod_pub character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_referrals_by_user(_cust_cr_cod_pub character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					referrals JSONB;
					total_referrals INT;
					active_referrals INT;
					absent_referrals INT;
					inactive_referrals INT;
				BEGIN
					SELECT json_agg(T.*) INTO referrals
					FROM (SELECT
                            UP.first_name,
                            UP.second_name,
                            UP.last_name,...
```

#### sec_cust.sp_get_required_contact_countries
- **Type:** function
- **Arguments:** `_id_country integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_required_contact_countries(_id_country integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					required_contact BOOLEAN;
				BEGIN
					SELECT C.beneficiaries_full_contact_required INTO required_contact
					FROM sec_emp.ms_countries AS C
					WHERE C.id_country = _id_country;

					IF (required_contact IS NULL)
					THEN
						resp_obj := json_build_object(
								'message', 'Country not found.'
								);
					ELSE
		...
```

#### sec_cust.sp_get_resid_country_iso_code_by_id
- **Type:** function
- **Arguments:** `_id_country integer`
- **Returns:** `TABLE(country_iso_code character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_resid_country_iso_code_by_id(_id_country integer)
 RETURNS TABLE(country_iso_code character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT C.country_iso_code
			FROM sec_emp.ms_countries AS C
			WHERE id_country = _id_country;
			END;
$function$

```

#### sec_cust.sp_get_special_rates_by_country_and_currency
- **Type:** function
- **Arguments:** `_id_origin_country integer, _id_origin_currency integer, _id_destiny_country integer, _id_destiny_currency integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_special_rates_by_country_and_currency(_id_origin_country integer, _id_origin_currency integer, _id_destiny_country integer, _id_destiny_currency integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
				BEGIN
					SELECT jsonb_agg(T.*) INTO resp_obj
					FROM	(SELECT
							SR.id_special_rate,
							SR.special_rate_name,
							SR.rate_factor,
							SR.operation,
							SR.id_origin_country,
							SR.id_destiny_country,
...
```

#### sec_cust.sp_get_status_referrals_by_user
- **Type:** function
- **Arguments:** `_email_user character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_status_referrals_by_user(_email_user character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					_cust_cr_cod_pub VARCHAR;
				BEGIN
					SELECT U.cust_cr_cod_pub INTO _cust_cr_cod_pub
					FROM sec_cust.ms_sixmap_users as U
					WHERE U.email_user = _email_user;

					SELECT json_agg(T.*) INTO resp_obj
					FROM (
							SELECT
									COUNT(US.id_user) AS total_referrals, (SELECT * FROM sec_cust.sp_get_referral_...
```

#### sec_cust.sp_get_total_active_referrals_by_user
- **Type:** function
- **Arguments:** `_email_user character varying`
- **Returns:** `integer`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_total_active_referrals_by_user(_email_user character varying)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
					_active_referrals INT;
					_cust_cr_cod_pub VARCHAR;
				BEGIN
					SELECT U.cust_cr_cod_pub INTO _cust_cr_cod_pub
					FROM sec_cust.ms_sixmap_users as U
					WHERE U.email_user = _email_user;

					SELECT
							COUNT(US.email_user) INTO _active_referrals
						FROM sec_cust.ms_profiles AS PRO,
							priv.ms_sixmap_userS AS UP,...
```

#### sec_cust.sp_get_user_extra_info
- **Type:** function
- **Arguments:** `p_id_user bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_user_extra_info(p_id_user bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_json_resp                 json;
begin
    select json_build_object(
        cat.value, json_build_object(
            'category', cat.name,
            'items', array(
                select json_build_object(
                    'name', it.name,
                    'value', ext.value
                )
                from sec_cust.lnk_users_extra_d...
```

#### sec_cust.sp_get_vipf_acum
- **Type:** function
- **Arguments:** `_id_origin_country integer, _id_origin_currency integer, _id_destiny_country integer, _id_destiny_currency integer, _email_user character varying`
- **Returns:** `jsonb`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_vipf_acum(_id_origin_country integer, _id_origin_currency integer, _id_destiny_country integer, _id_destiny_currency integer, _email_user character varying)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare
				acum			FLOAT;
				_id_client		INT;
			begin
				SELECT U.id_user INTO _id_client
				FROM sec_cust.ms_sixmap_users U
				WHERE U.email_user = _email_user;

				SELECT SUM(R.total_origin_dollar_amount) INTO acum
				FROM prc_mng.lnk_cr_remitt...
```

#### sec_cust.sp_get_wholesale_partner_clients
- **Type:** function
- **Arguments:** `_slug character varying, _full boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_wholesale_partner_clients(_slug character varying, _full boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				resp_obj JSON;
				_id_wholesale_partner INT;
			BEGIN
				SELECT U.id_user INTO _id_wholesale_partner
				FROM sec_cust.ms_sixmap_users AS U
				WHERE U.email_user = (SELECT WP.email_user
										FROM sec_cust.ms_wholesale_partners_info AS WP
										WHERE WP.slug = _slug);

				IF (_full = TRUE) THEN
					SELECT json_agg(T.*)...
```

#### sec_cust.sp_get_wholesale_partner_info
- **Type:** function
- **Arguments:** `_slug character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_wholesale_partner_info(_slug character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				resp_obj JSON;
			BEGIN
				SELECT json_agg(T.*) INTO resp_obj
				FROM 	(SELECT WPI.*
						FROM sec_cust.ms_wholesale_partners_info AS WPI
						WHERE WPI.slug = _slug) AS T;

				return resp_obj->0;
			END;
$function$

```

#### sec_cust.sp_get_wholesale_partner_rates
- **Type:** function
- **Arguments:** `_slug character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_get_wholesale_partner_rates(_slug character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				resp_obj JSON;
			BEGIN
				SELECT json_agg(T.*) INTO resp_obj
				FROM 	(SELECT
							MR.id_manual_rate,
							MR.rate_factor,
							CASE
								WHEN MR.operation = 'mul'
								THEN MR.rate_factor - (((SELECT WP.percent_profit
														FROM sec_cust.ms_wholesale_partners_info AS WP
														WHERE WP.slug = _slug) * MR.rate_factor) ...
```

#### sec_cust.sp_global_notifications_activate_by_id
- **Type:** function
- **Arguments:** `_id_global_notification bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_global_notifications_activate_by_id(_id_global_notification bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					succesfully_updated BIGINT;
				BEGIN
					UPDATE sec_cust.ms_global_notifications
					SET
						active = true
					WHERE id_global_notification = _id_global_notification
					RETURNING id_global_notification INTO succesfully_updated;

					IF (succesfully_updated IS NOT NULL)
					THEN
						resp_obj := json_b...
```

#### sec_cust.sp_global_notifications_deactivate_by_id
- **Type:** function
- **Arguments:** `_id_global_notification bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_global_notifications_deactivate_by_id(_id_global_notification bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					succesfully_updated BIGINT;
				BEGIN
					UPDATE sec_cust.ms_global_notifications
					SET
						is_published = false,
						active = false
					WHERE id_global_notification = _id_global_notification
					RETURNING id_global_notification INTO succesfully_updated;

					IF (succesfully_updated IS NOT NULL)
			...
```

#### sec_cust.sp_global_notifications_get_all
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_global_notifications_get_all()
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
				BEGIN
					SELECT json_agg(T.*) INTO resp_obj
					FROM (SELECT
								GN.id_global_notification,
								GN.title,
								GN.msg,
								GN.type,
								GN.id_country,
								C.country_iso_code,
								GN.id_verif_level,
								GN.is_published,
								GN.non_deletable
						FROM sec_cust.ms_global_notifications GN FULL OUTER JOIN sec_emp.ms...
```

#### sec_cust.sp_global_notifications_insert
- **Type:** function
- **Arguments:** `_title text, _msg text, _type text, _id_country integer, _id_verif_level integer, _non_deletable boolean, _is_published boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_global_notifications_insert(_title text, _msg text, _type text, _id_country integer, _id_verif_level integer, _non_deletable boolean, _is_published boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					succesfully_inserted BIGINT;
				BEGIN
					IF (_non_deletable IS NOT NULL)
					THEN
						INSERT INTO sec_cust.ms_global_notifications(
																	title,
																	msg,
																	type,
																	...
```

#### sec_cust.sp_global_notifications_publish_by_id
- **Type:** function
- **Arguments:** `_id_global_notification bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_global_notifications_publish_by_id(_id_global_notification bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					succesfully_updated BIGINT;
				BEGIN
					UPDATE sec_cust.ms_global_notifications
					SET
						is_published = true
					WHERE id_global_notification = _id_global_notification
					RETURNING id_global_notification INTO succesfully_updated;

					IF (succesfully_updated IS NOT NULL)
					THEN
						resp_obj := j...
```

#### sec_cust.sp_global_notifications_unpublish_by_id
- **Type:** function
- **Arguments:** `_id_global_notification bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_global_notifications_unpublish_by_id(_id_global_notification bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					succesfully_updated BIGINT;
				BEGIN
					UPDATE sec_cust.ms_global_notifications
					SET
						is_published = false
					WHERE id_global_notification = _id_global_notification
					RETURNING id_global_notification INTO succesfully_updated;

					IF (succesfully_updated IS NOT NULL)
					THEN
						resp_obj :...
```

#### sec_cust.sp_global_notifications_update_by_id
- **Type:** function
- **Arguments:** `_id_global_notification integer, _title text, _msg text, _type text, _id_country integer, _id_verif_level integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_global_notifications_update_by_id(_id_global_notification integer, _title text, _msg text, _type text, _id_country integer, _id_verif_level integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					succesfully_updated BIGINT;
				BEGIN
					UPDATE sec_cust.ms_global_notifications
					SET
						title = _title,
						msg = _msg,
						type = _type,
						id_country = _id_country,
						id_verif_level = _id_verif_level
					WHER...
```

#### sec_cust.sp_insert_driver_licenses
- **Type:** function
- **Arguments:** `none`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_insert_driver_licenses()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    v_doc_country_rows                  cursor for
        select typ.name_country, typ.id_resid_country, typ.id_ip_country
        from sec_cust.ms_doc_type typ
        where typ.name_country is not null
        group by typ.name_country, typ.id_resid_country, typ.id_ip_country;
    v_doc_country                       record;
begin
    for v_doc_country in v_doc_country_rows loo...
```

#### sec_cust.sp_insert_notification
- **Type:** function
- **Arguments:** `_optional_text text, _id_global_notification integer, _email_user character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_insert_notification(_optional_text text, _id_global_notification integer, _email_user character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					_final_text VARCHAR;
					_id_notification INT;
				BEGIN

					IF (_optional_text IS NOT NULL AND _id_global_notification IS NULL)
					THEN
						INSERT INTO sec_cust.ms_notifications(notification_date,final_text,is_read,active,email_user)
						VALUES(now(),_optional_text,...
```

#### sec_cust.sp_insert_wholesale_partner_info
- **Type:** function
- **Arguments:** `_name character varying, _slug character varying, _logo text, _theme character varying, _percent_profit double precision, _email_user character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_insert_wholesale_partner_info(_name character varying, _slug character varying, _logo text, _theme character varying, _percent_profit double precision, _email_user character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				resp_obj 				JSON;
				_err 					TEXT;
				valid_partner			BOOLEAN;
				info_already_exists		INT;
			BEGIN
				-- se valida si el usuario es un asociado mayorista aprobado

					SELECT WP.apb_ok INTO valid_partner
					F...
```

#### sec_cust.sp_is_pol_exp_country
- **Type:** function
- **Arguments:** `_id_country integer`
- **Returns:** `TABLE(is_pol_exp boolean)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_is_pol_exp_country(_id_country integer)
 RETURNS TABLE(is_pol_exp boolean)
 LANGUAGE plpgsql
AS $function$
BEGIN
				RETURN QUERY
				SELECT C.pol_exp
				FROM sec_emp.ms_countries AS C
				WHERE C.id_country = _id_country;
			END;
$function$

```

#### sec_cust.sp_list_verif_levels_requirements
- **Type:** function
- **Arguments:** `p_pending boolean, p_no_market_country boolean`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_list_verif_levels_requirements(p_pending boolean, p_no_market_country boolean)
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
    v_json_resp                             jsonb[];
begin
    select array(
        select jsonb_build_object(
            'idUserVerifLevel', U.id_users_verif_level,
            'CRID', U.cust_cr_cod_pub,
            'residency', U.name_country,
            'verifLevel', U.id_vl,
            'status', U.level_apb...
```

#### sec_cust.sp_lnk_opspwds_registred_by_user_insert
- **Type:** function
- **Arguments:** `_opspwd text, _uuid_user uuid`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_lnk_opspwds_registred_by_user_insert(_opspwd text, _uuid_user uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
			INSERT INTO sec_cust.LNK_OPSPWDS_REGISTRED_BY_USER(opspwd, uuid_user, active)
			VALUES (_opspwd, _uuid_user, true);
			END;
$function$

```

#### sec_cust.sp_lnk_profiles_roles_insert
- **Type:** function
- **Arguments:** `_uuid_role uuid, _uuid_profile uuid`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_lnk_profiles_roles_insert(_uuid_role uuid, _uuid_profile uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
			INSERT INTO sec_cust.LNK_PROFILES_ROLES(uuid_role, uuid_profile, active)
			VALUES (_uuid_role, _uuid_profile, true);
			END;
$function$

```

#### sec_cust.sp_lnk_pwds_registred_by_user_insert
- **Type:** function
- **Arguments:** `_pwd text, _uuid_user uuid`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_lnk_pwds_registred_by_user_insert(_pwd text, _uuid_user uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
			INSERT INTO sec_cust.LNK_PWDS_REGISTRED_BY_USER(pwd, uuid_user, active)
			VALUES (_pwd, _uuid_user, true);
			END;
$function$

```

#### sec_cust.sp_lnk_roles_routes_insert
- **Type:** function
- **Arguments:** `_uuid_role uuid, _uuid_route uuid`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_lnk_roles_routes_insert(_uuid_role uuid, _uuid_route uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
			INSERT INTO sec_cust.LNK_ROLES_ROUTES(uuid_role, uuid_route, active)
			VALUES (_uuid_role, _uuid_route, true);
			END;
$function$

```

#### sec_cust.sp_lnk_user_loyalty_levels_insert
- **Type:** function
- **Arguments:** `p_uuid_user uuid, p_id_loyalty_level integer`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_lnk_user_loyalty_levels_insert(p_uuid_user uuid, p_id_loyalty_level integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
				if (not exists(
					select id_user
					from sec_cust.ms_sixmap_users cust
					where cust.uuid_user = p_uuid_user
				) or not exists(
					select
					from sec_cust.loyalty_levels loy
					where loy.id_loyalty = p_id_loyalty_level
				)) then
					raise exception 'User or loyalty level not found';
				end if;
				if (exists...
```

#### sec_cust.sp_lnk_user_risk_levels_insert
- **Type:** function
- **Arguments:** `p_uuid_user uuid, p_id_risk_level integer`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_lnk_user_risk_levels_insert(p_uuid_user uuid, p_id_risk_level integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
				if (not exists(
					select id_user
					from sec_cust.ms_sixmap_users cust
					where cust.uuid_user = p_uuid_user
				) or not exists(
					select
					from sec_cust.risk_levels ris
					where ris.id_risk = p_id_risk_level
				)) then
					raise exception 'User or risk level not found';
				end if;
				if (exists(
					select lnk....
```

#### sec_cust.sp_lnk_users_departments_insert
- **Type:** function
- **Arguments:** `_uuid_user uuid, _id_dpt integer`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_lnk_users_departments_insert(_uuid_user uuid, _id_dpt integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
			INSERT INTO sec_cust.LNK_USERS_DEPARTMENTS(uuid_user, id_dpt, active)
			VALUES (_uuid_user, _id_dpt, true);
			END;
$function$

```

#### sec_cust.sp_lnk_users_verif_level_insert
- **Type:** function
- **Arguments:** `_id_vl bigint, _level_apb_ok boolean, _level_req json, _id_service bigint, _uuid_user uuid, _id_verif_level bigint, _id_resid_country bigint`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_lnk_users_verif_level_insert(_id_vl bigint, _level_apb_ok boolean, _level_req json, _id_service bigint, _uuid_user uuid, _id_verif_level bigint, _id_resid_country bigint)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN

				raise notice '_level_req: %',_level_req;
						INSERT INTO sec_cust.LNK_USERS_VERIF_LEVEL(
								id_vl,
								level_apb_ok,
								level_req,
								id_service,
								uuid_user,
								id_verif_level,
								id_resid_countr...
```

#### sec_cust.sp_login_failed
- **Type:** function
- **Arguments:** `_email_user character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_login_failed(_email_user character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
    log_a INT;
    last_attempt TIMESTAMPTZ;
    difference DOUBLE PRECISION;
    atcPhone VARCHAR DEFAULT 'NA';
    isBlocked BOOLEAN;
BEGIN
    -- se obtiene último intento, número de intentos, tiempo (segundos) que pasó desde el último intento y si está bloqueado o no
    SELECT U.last_login_attempt, U.login_attempts, EXTRACT(EPOCH FROM (now() - U.l...
```

#### sec_cust.sp_logs_actions_obj_insert
- **Type:** function
- **Arguments:** `_is_authenticated boolean, _success_req boolean, _failed_req boolean, _ip_orig character varying, _country_ip_orig character varying, _route character varying, _params json, _query json, _body json, _status integer, _response json, _sid_session character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_logs_actions_obj_insert(_is_authenticated boolean, _success_req boolean, _failed_req boolean, _ip_orig character varying, _country_ip_orig character varying, _route character varying, _params json, _query json, _body json, _status integer, _response json, _sid_session character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
					INSERT INTO sec_cust.LOGS_ACTIONS_OBJ(
															is_authenticated,
															success_req,
															f...
```

#### sec_cust.sp_mail_logs_insert
- **Type:** function
- **Arguments:** `_url text, _from_mail text, _to_mail text, _subject text, _response text`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_mail_logs_insert(_url text, _from_mail text, _to_mail text, _subject text, _response text)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					_id_mail_log INT;
					resp_obj JSON;
				BEGIN

					INSERT INTO sec_cust.mail_logs (
														url,
														from_mail,
														to_mail,
														subject,
														response
													)
					VALUES (
								_url,
								_from_mail,
								_to_mail,
								_subject,
								_res...
```

#### sec_cust.sp_mail_logs_insert_call_to_mail_server
- **Type:** function
- **Arguments:** `_to_mail text, _url text, _body json, _response text`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_mail_logs_insert_call_to_mail_server(_to_mail text, _url text, _body json, _response text)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					_id_mail_log INT;
					resp_obj JSON;
				BEGIN

					INSERT INTO sec_cust.mail_logs (
														to_mail,
														url,
														body,
														response
													)
					VALUES (
								_to_mail,
								_url,
								_body,
								_response
							)
					RETURNING id_mail_log INTO _id_...
```

#### sec_cust.sp_manual_change_verif_level
- **Type:** function
- **Arguments:** `p_cr_id character varying, p_verif_level_apb boolean`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_manual_change_verif_level(p_cr_id character varying, p_verif_level_apb boolean)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    v_uuid_user                     uuid;
begin
    select us.uuid_user
    into v_uuid_user
    from sec_cust.ms_sixmap_users us
    where us.cust_cr_cod_pub = p_cr_id;
    if (v_uuid_user is null) then
        raise exception 'User not found';
    end if;
    update sec_cust.lnk_users_verif_level
    set level_apb_ok = p_ve...
```

#### sec_cust.sp_ms_address_insert
- **Type:** function
- **Arguments:** `_full_address text, _uuid_user uuid`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_address_insert(_full_address text, _uuid_user uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
			INSERT INTO sec_cust.MS_ADDRESS(full_address, uuid_user, active)
			VALUES (_full_address, _uuid_user, true);
			END;
$function$

```

#### sec_cust.sp_ms_balance_insert
- **Type:** function
- **Arguments:** `_amount double precision, _id_currency integer, _email_user character varying, _emp_username character varying, _trans_type character varying, _trans_date bigint, _trans_description text, _trans_comment text, _id_operation character varying, _operation_type character varying, _id_reversed_balance integer, _id_wallet integer, _wholesale_partner_balance boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_balance_insert(_amount double precision, _id_currency integer, _email_user character varying, _emp_username character varying, _trans_type character varying, _trans_date bigint, _trans_description text, _trans_comment text, _id_operation character varying, _operation_type character varying, _id_reversed_balance integer, _id_wallet integer, _wholesale_partner_balance boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				resp_obj JSONB;
				su...
```

#### sec_cust.sp_ms_bank_by_id
- **Type:** function
- **Arguments:** `_id_bank integer`
- **Returns:** `TABLE(idbank integer, name character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_bank_by_id(_id_bank integer)
 RETURNS TABLE(idbank integer, name character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN
					RETURN QUERY
					SELECT b.id_bank, b.name FROM sec_cust.ms_banks as b WHERE b.id_bank =_id_bank;
				END;

$function$

```

#### sec_cust.sp_ms_cod_users_ranks_insert
- **Type:** function
- **Arguments:** `_cod_rank text, _uuid_user uuid, _id_service bigint, _id_services_utype bigint`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_cod_users_ranks_insert(_cod_rank text, _uuid_user uuid, _id_service bigint, _id_services_utype bigint)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN RAISE NOTICE 'Solo se insertará si se recibe Oro, plata o bronce';
			IF (
				_cod_rank = 'Oro'
				OR _cod_rank = 'oro'
				OR _cod_rank = 'ORO'
			) THEN
			INSERT INTO sec_cust.MS_COD_USERS_RANKS(
					tx_rank,
					cod_rank,
					uuid_user,
					id_service,
					id_services_utype,
					active
				...
```

#### sec_cust.sp_ms_cod_users_ranks_update
- **Type:** function
- **Arguments:** `_cod_rank text, _uuid_user uuid`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_cod_users_ranks_update(_cod_rank text, _uuid_user uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN RAISE NOTICE 'Solo se actualizará si se recibe Oro, plata o bronce';
			IF (
				_cod_rank = 'Oro'
				OR _cod_rank = 'oro'
				OR _cod_rank = 'ORO'
			) THEN
			UPDATE sec_cust.MS_COD_USERS_RANKS
			SET cod_rank = 'Oro',
				tx_rank = 1
			WHERE uuid_user = _uuid_user;
			ELSIF (
				_cod_rank = 'Plata'
				OR _cod_rank = 'plata'
				OR _cod_rank ...
```

#### sec_cust.sp_ms_cr_manual_rate_get_all
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_cr_manual_rate_get_all()
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
  resp_obj JSONB;
BEGIN
  WITH route AS (
    SELECT
      OPR.id_operation_route,
      OPR.id_origin_address,
      OPR.id_destiny_address,
      OPR.id_origin_currency,
      OPR.id_destiny_currency
    FROM prc_mng.ms_operation_routes OPR
  ),
  countries AS (
    SELECT
      C.id_country,
      C.country_iso_code
    FROM sec_emp.ms_countries C
  ),
  ...
```

#### sec_cust.sp_ms_cr_manual_rate_get_by_id
- **Type:** function
- **Arguments:** `_id_manual_rate integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_cr_manual_rate_get_by_id(_id_manual_rate integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
				BEGIN
					SELECT json_agg(T.*) INTO resp_obj
					FROM (SELECT MR.id_manual_rate, MR.rate_factor, MR.id_origin_country, (SELECT C.country_iso_code
																									FROM sec_emp.ms_countries C
																									WHERE C.id_country = MR.id_origin_country) as origin_country_iso_code, MR.id_origin_currency, (SELECT C...
```

#### sec_cust.sp_ms_cr_manual_rate_insert
- **Type:** function
- **Arguments:** `_rate_factor double precision, _id_origin_country integer, _id_origin_currency integer, _id_destiny_country integer, _id_destiny_currency integer, _operation character varying, _id_rate_type integer, _amount_limit double precision, _amount_days_limit integer, _rate_cost double precision, _with_margins boolean, _margin double precision`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_cr_manual_rate_insert(_rate_factor double precision, _id_origin_country integer, _id_origin_currency integer, _id_destiny_country integer, _id_destiny_currency integer, _operation character varying, _id_rate_type integer, _amount_limit double precision, _amount_days_limit integer, _rate_cost double precision, _with_margins boolean, _margin double precision)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					succesfully_insert...
```

#### sec_cust.sp_ms_cr_manual_rate_update_cost_by_id
- **Type:** function
- **Arguments:** `_rate_cost double precision, _id_manual_rate integer, _margin double precision`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_cr_manual_rate_update_cost_by_id(_rate_cost double precision, _id_manual_rate integer, _margin double precision)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					succesfully_updated INT;
				BEGIN
					UPDATE sec_cust.ms_cr_manual_rate
					SET rate_cost = _rate_cost,
						margin = _margin
					WHERE id_manual_rate = _id_manual_rate
					RETURNING id_manual_rate INTO succesfully_updated;

					IF (succesfully_updated IS NO...
```

#### sec_cust.sp_ms_cr_manual_rate_update_factor_by_id
- **Type:** function
- **Arguments:** `_rate_factor double precision, _rate_cost double precision, _with_margins boolean, _id_manual_rate integer, _amount_limit double precision, _amount_days_limit integer, _operation character varying, _margin double precision`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_cr_manual_rate_update_factor_by_id(_rate_factor double precision, _rate_cost double precision, _with_margins boolean, _id_manual_rate integer, _amount_limit double precision, _amount_days_limit integer, _operation character varying, _margin double precision)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					resp_obj_socket JSONB;
					current_manual_rate sec_cust.ms_cr_manual_rate%ROWTYPE;
					succesfully_updated JSONB;
			...
```

#### sec_cust.sp_ms_cr_rate_get_valid
- **Type:** function
- **Arguments:** `_id_origin_country integer, _id_origin_currency integer, _id_destiny_country integer, _id_destiny_currency integer, _email_user character varying`
- **Returns:** `jsonb`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_cr_rate_get_valid(_id_origin_country integer, _id_origin_currency integer, _id_destiny_country integer, _id_destiny_currency integer, _email_user character varying)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare
				is_valid_for_birthday       BOOLEAN;
				is_valid_for_first_oper     BOOLEAN;
				resp_obj       				JSONB;
				best_special_rate       	JSONB;
				best_vip_rate       		JSONB;
				manual_rates	       		JSONB;
				automatic_rates     ...
```

#### sec_cust.sp_ms_cr_special_rate_activate_by_id
- **Type:** function
- **Arguments:** `_id_special_rate bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_cr_special_rate_activate_by_id(_id_special_rate bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					succesfully_updated BIGINT;
				BEGIN
					UPDATE sec_cust.ms_cr_special_rate
					SET
						active = true
					WHERE id_special_rate = _id_special_rate
					RETURNING id_special_rate INTO succesfully_updated;

					IF (succesfully_updated IS NOT NULL)
					THEN
						resp_obj := json_build_object(
								'message', 'Sp...
```

#### sec_cust.sp_ms_cr_special_rate_deactivate_by_id
- **Type:** function
- **Arguments:** `_id_special_rate bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_cr_special_rate_deactivate_by_id(_id_special_rate bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					succesfully_updated BIGINT;
				BEGIN
					UPDATE sec_cust.ms_cr_special_rate
					SET
						active = false
					WHERE id_special_rate = _id_special_rate
					RETURNING id_special_rate INTO succesfully_updated;

					IF (succesfully_updated IS NOT NULL)
					THEN
						resp_obj := json_build_object(
								'message', ...
```

#### sec_cust.sp_ms_cr_special_rate_get_all
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_cr_special_rate_get_all()
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
				BEGIN
					SELECT json_agg(T.*) INTO resp_obj
					FROM (SELECT
								SR.id_special_rate,
								SR.special_rate_name,
								SR.rate_factor,
								SR.operation,
								SR.id_origin_country,
								(SELECT C.country_iso_code
								FROM sec_emp.ms_countries C
								WHERE C.id_country = SR.id_origin_country) as origin_country_iso_code,
					...
```

#### sec_cust.sp_ms_cr_special_rate_get_by_id
- **Type:** function
- **Arguments:** `_id_special_rate bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_cr_special_rate_get_by_id(_id_special_rate bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
				BEGIN
					SELECT json_agg(T.*) INTO resp_obj
					FROM (SELECT
								SR.id_special_rate,
								SR.special_rate_name,
								SR.rate_factor,
								SR.operation,
								SR.id_origin_country,
								(SELECT C.country_iso_code
								FROM sec_emp.ms_countries C
								WHERE C.id_country = SR.id_origin_country) as origi...
```

#### sec_cust.sp_ms_cr_special_rate_insert
- **Type:** function
- **Arguments:** `_special_rate_name text, _rate_factor double precision, _id_origin_country integer, _id_origin_currency integer, _id_destiny_country integer, _id_destiny_currency integer, _amount_limit double precision, _amount_days_limit integer, _transaction_limit integer, _transaction_days_limit integer, _from_date bigint, _to_date bigint, _is_published boolean, _icon_name character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_cr_special_rate_insert(_special_rate_name text, _rate_factor double precision, _id_origin_country integer, _id_origin_currency integer, _id_destiny_country integer, _id_destiny_currency integer, _amount_limit double precision, _amount_days_limit integer, _transaction_limit integer, _transaction_days_limit integer, _from_date bigint, _to_date bigint, _is_published boolean, _icon_name character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE...
```

#### sec_cust.sp_ms_cr_special_rate_publish_by_id
- **Type:** function
- **Arguments:** `_id_special_rate bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_cr_special_rate_publish_by_id(_id_special_rate bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					succesfully_updated BIGINT;
				BEGIN
					UPDATE sec_cust.ms_cr_special_rate
					SET
						is_published = true
					WHERE id_special_rate = _id_special_rate
					RETURNING id_special_rate INTO succesfully_updated;

					IF (succesfully_updated IS NOT NULL)
					THEN
						resp_obj := json_build_object(
								'message'...
```

#### sec_cust.sp_ms_cr_special_rate_unpublish_by_id
- **Type:** function
- **Arguments:** `_id_special_rate bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_cr_special_rate_unpublish_by_id(_id_special_rate bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					succesfully_updated BIGINT;
				BEGIN
					UPDATE sec_cust.ms_cr_special_rate
					SET
						is_published = false
					WHERE id_special_rate = _id_special_rate
					RETURNING id_special_rate INTO succesfully_updated;

					IF (succesfully_updated IS NOT NULL)
					THEN
						resp_obj := json_build_object(
								'messa...
```

#### sec_cust.sp_ms_cr_special_rate_update_by_id
- **Type:** function
- **Arguments:** `_id_special_rate integer, _special_rate_name text, _rate_factor double precision, _id_origin_country integer, _id_origin_currency integer, _id_destiny_country integer, _id_destiny_currency integer, _amount_limit double precision, _amount_days_limit integer, _transaction_limit integer, _transaction_days_limit integer, _from_date bigint, _to_date bigint, _icon_name character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_cr_special_rate_update_by_id(_id_special_rate integer, _special_rate_name text, _rate_factor double precision, _id_origin_country integer, _id_origin_currency integer, _id_destiny_country integer, _id_destiny_currency integer, _amount_limit double precision, _amount_days_limit integer, _transaction_limit integer, _transaction_days_limit integer, _from_date bigint, _to_date bigint, _icon_name character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function...
```

#### sec_cust.sp_ms_cr_vip_rate_activate_by_id
- **Type:** function
- **Arguments:** `_id_vip_rate bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_cr_vip_rate_activate_by_id(_id_vip_rate bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					succesfully_updated BIGINT;
				BEGIN
					UPDATE sec_cust.ms_cr_vip_rate
					SET
						active = true
					WHERE id_vip_rate = _id_vip_rate
					RETURNING id_vip_rate INTO succesfully_updated;

					IF (succesfully_updated IS NOT NULL)
					THEN
						resp_obj := json_build_object(
								'message', 'vip rate succesfully activ...
```

#### sec_cust.sp_ms_cr_vip_rate_deactivate_by_id
- **Type:** function
- **Arguments:** `_id_vip_rate bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_cr_vip_rate_deactivate_by_id(_id_vip_rate bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					succesfully_updated BIGINT;
				BEGIN
					UPDATE sec_cust.ms_cr_vip_rate
					SET
						active = false
					WHERE id_vip_rate = _id_vip_rate
					RETURNING id_vip_rate INTO succesfully_updated;

					IF (succesfully_updated IS NOT NULL)
					THEN
						resp_obj := json_build_object(
								'message', 'vip rate succesfully de...
```

#### sec_cust.sp_ms_cr_vip_rate_get_all
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_cr_vip_rate_get_all()
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
				BEGIN
					SELECT json_agg(T.*) INTO resp_obj
					FROM (SELECT
								VIPR.id_vip_rate,
								VIPR.email_user,
								VIPR.rate_factor,
								VIPR.operation,
								VIPR.id_origin_country,
								(SELECT C.country_iso_code
								FROM sec_emp.ms_countries C
								WHERE C.id_country = VIPR.id_origin_country) as origin_country_iso_code,
								...
```

#### sec_cust.sp_ms_cr_vip_rate_insert
- **Type:** function
- **Arguments:** `_email_user character varying, _rate_factor double precision, _id_origin_country integer, _id_origin_currency integer, _id_destiny_country integer, _id_destiny_currency integer, _from_date bigint, _to_date bigint, _is_published boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_cr_vip_rate_insert(_email_user character varying, _rate_factor double precision, _id_origin_country integer, _id_origin_currency integer, _id_destiny_country integer, _id_destiny_currency integer, _from_date bigint, _to_date bigint, _is_published boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					succesfully_inserted BIGINT;
				BEGIN
					INSERT INTO sec_cust.ms_cr_vip_rate(
																email_user,
													...
```

#### sec_cust.sp_ms_cr_vip_rate_publish_by_id
- **Type:** function
- **Arguments:** `_id_vip_rate bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_cr_vip_rate_publish_by_id(_id_vip_rate bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					succesfully_updated BIGINT;
				BEGIN
					UPDATE sec_cust.ms_cr_vip_rate
					SET
						is_published = true
					WHERE id_vip_rate = _id_vip_rate
					RETURNING id_vip_rate INTO succesfully_updated;

					IF (succesfully_updated IS NOT NULL)
					THEN
						resp_obj := json_build_object(
								'message', 'vip rate succesfully ...
```

#### sec_cust.sp_ms_cr_vip_rate_unpublish_by_id
- **Type:** function
- **Arguments:** `_id_vip_rate bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_cr_vip_rate_unpublish_by_id(_id_vip_rate bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					succesfully_updated BIGINT;
				BEGIN
					UPDATE sec_cust.ms_cr_vip_rate
					SET
						is_published = false
					WHERE id_vip_rate = _id_vip_rate
					RETURNING id_vip_rate INTO succesfully_updated;

					IF (succesfully_updated IS NOT NULL)
					THEN
						resp_obj := json_build_object(
								'message', 'vip rate succesful...
```

#### sec_cust.sp_ms_cr_vip_rate_update_by_id
- **Type:** function
- **Arguments:** `_id_vip_rate integer, _email_user character varying, _rate_factor double precision, _id_origin_country integer, _id_origin_currency integer, _id_destiny_country integer, _id_destiny_currency integer, _from_date bigint, _to_date bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_cr_vip_rate_update_by_id(_id_vip_rate integer, _email_user character varying, _rate_factor double precision, _id_origin_country integer, _id_origin_currency integer, _id_destiny_country integer, _id_destiny_currency integer, _from_date bigint, _to_date bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					resp_obj_socket JSONB;
					succesfully_updated BIGINT;
					current_rate sec_cust.ms_cr_vip_rate%ROWTYPE;
				BEGIN
...
```

#### sec_cust.sp_ms_departments_insert
- **Type:** function
- **Arguments:** `_name_dpt character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_departments_insert(_name_dpt character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
			INSERT INTO sec_cust.MS_DEPARTMENTS(name_dpt, active)
			VALUES (_name_dpt, true);
			END;
$function$

```

#### sec_cust.sp_ms_doc_type_insert
- **Type:** function
- **Arguments:** `_acronym character varying, _name_doc_type character varying, _id_resid_country bigint, _id_ip_country bigint, _type_doc_type character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_doc_type_insert(_acronym character varying, _name_doc_type character varying, _id_resid_country bigint, _id_ip_country bigint, _type_doc_type character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE _name_country VARCHAR;
			BEGIN IF (_id_ip_country = null) THEN
			INSERT INTO sec_cust.MS_DOC_TYPE(
					acronym,
					name_doc_type,
					id_resid_country,
					id_ip_country,
					type_doc_type,
					name_country,
					id_service,
					acti...
```

#### sec_cust.sp_ms_pay_methods_by_id_get
- **Type:** function
- **Arguments:** `_id_pay_method integer`
- **Returns:** `TABLE("idPayMethod" integer, name character varying, "idCountry" integer, "nameCountry" character varying, "idCurrency" integer, "nameCurrency" character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_pay_methods_by_id_get(_id_pay_method integer)
 RETURNS TABLE("idPayMethod" integer, name character varying, "idCountry" integer, "nameCountry" character varying, "idCurrency" integer, "nameCurrency" character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN
					RETURN QUERY
					SELECT py.id_pay_method, py.name, py.id_country,
					(select co.viewing_name
					from sec_emp.ms_countries as co
					where co.id_country =py.id_country),
					py.id_currency,
	...
```

#### sec_cust.sp_ms_phone_insert
- **Type:** function
- **Arguments:** `_uuid_user uuid, _type character varying, _code character varying, _number character varying, _full_number character varying, _mobile boolean, _home boolean, _office boolean, _whatsapp boolean, _telegram boolean`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_phone_insert(_uuid_user uuid, _type character varying, _code character varying, _number character varying, _full_number character varying, _mobile boolean, _home boolean, _office boolean, _whatsapp boolean, _telegram boolean)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    current_phone sec_cust.ms_phone%ROWTYPE;
BEGIN
            SELECT * INTO current_phone
            FROM sec_cust.ms_phone
            WHERE uuid_user = _uuid_user
    ...
```

#### sec_cust.sp_ms_profiles_insert
- **Type:** function
- **Arguments:** `_name_profile character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_profiles_insert(_name_profile character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
			INSERT INTO sec_cust.MS_PROFILES(name_profile, active)
			VALUES (_name_profile, true);
			END;
$function$

```

#### sec_cust.sp_ms_roles_insert
- **Type:** function
- **Arguments:** `_name_role character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_roles_insert(_name_role character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
			INSERT INTO sec_cust.MS_ROLES(name_role, active)
			VALUES (_name_role, true);
			END;
$function$

```

#### sec_cust.sp_ms_routes_get_main_menu
- **Type:** function
- **Arguments:** `_uuid_user uuid`
- **Returns:** `TABLE(uuid_route uuid, name_route character varying, icon character varying, url text, component text)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_routes_get_main_menu(_uuid_user uuid)
 RETURNS TABLE(uuid_route uuid, name_route character varying, icon character varying, url text, component text)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT ROU.uuid_route,
				ROU.name_route,
				ROU.icon,
				ROU.url,
				ROU.component
			FROM sec_cust.ms_routes AS ROU,
				sec_cust.lnk_roles_routes AS LROL_ROU,
				sec_cust.ms_roles AS ROL,
				sec_cust.lnk_profiles_roles AS LPRO_ROL,
				sec_cust....
```

#### sec_cust.sp_ms_routes_insert
- **Type:** function
- **Arguments:** `_name_route character varying, _icon character varying, _url text, _component text`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_routes_insert(_name_route character varying, _icon character varying, _url text, _component text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
			INSERT INTO sec_cust.MS_ROUTES(name_route, icon, url, component, active)
			VALUES (_name_route, _icon, _url, _component, true);
			END;
$function$

```

#### sec_cust.sp_ms_sixmap_services_insert
- **Type:** function
- **Arguments:** `_name_service character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_sixmap_services_insert(_name_service character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
			INSERT INTO sec_cust.MS_SIXMAP_SERVICES(tx_service, active)
			VALUES (_name_service, true);
			END;
$function$

```

#### sec_cust.sp_ms_sixmap_services_users_public_codes_insert
- **Type:** function
- **Arguments:** `_uuid_user uuid, _cust_cr_cod_pub text, _id_service bigint`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_sixmap_services_users_public_codes_insert(_uuid_user uuid, _cust_cr_cod_pub text, _id_service bigint)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
			INSERT INTO sec_cust.MS_SIXMAP_SERVICES_USERS_PUBLIC_CODES(
					uuid_user,
					cust_cr_cod_pub,
					id_service,
					active
				)
			VALUES (
					_uuid_user,
					_cust_cr_cod_pub,
					_id_service,
					true
				);
			END;
$function$

```

#### sec_cust.sp_ms_sixmap_services_utype_insert
- **Type:** function
- **Arguments:** `_name_utype character varying, _id_service bigint`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_sixmap_services_utype_insert(_name_utype character varying, _id_service bigint)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
			INSERT INTO sec_cust.MS_SIXMAP_SERVICES_UTYPE(name_utype, id_service, active)
			VALUES (_name_utype, _id_service, true);
			END;
$function$

```

#### sec_cust.sp_ms_sixmap_users_get_all
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE(id_uuid uuid, first_name character varying, second_name character varying, last_name character varying, second_last_name character varying, username character varying, email_user character varying, last_session_reg character varying, last_ip_reg character varying, last_ip_city_reg character varying, last_id_log_reg integer, date_last_conn bigint, gender character, date_birth bigint, ident_doc_number character varying, main_phone character varying, second_phone character varying, delegated_phone character varying, resid_city text, user_active boolean, user_blocked boolean, uuid_profile uuid, id_service integer, id_services_utype integer, id_ident_doc_type integer, id_resid_country integer, id_nationality_country integer, name_profile character varying, name_service character varying, name_services_utype character varying, name_ident_doc_type character varying, name_resid_country character varying, name_nationality_country character varying, address text, cust_cr_cod_pub character varying, cod_rank character varying, referral_node text, main_sn_platf text, user_main_sn_platf text, date_legacy_reg bigint, id_verif_level integer, verif_level_apb boolean, full_number character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_sixmap_users_get_all()
 RETURNS TABLE(id_uuid uuid, first_name character varying, second_name character varying, last_name character varying, second_last_name character varying, username character varying, email_user character varying, last_session_reg character varying, last_ip_reg character varying, last_ip_city_reg character varying, last_id_log_reg integer, date_last_conn bigint, gender character, date_birth bigint, ident_doc_number character varying...
```

#### sec_cust.sp_ms_sixmap_users_insert
- **Type:** function
- **Arguments:** `_first_name character varying, _second_name character varying, _last_name character varying, _second_last_name character varying, _username character varying, _email_user character varying, _password text, _cust_cr_cod_pub text, _cod_rank text, _verif_level_apb boolean, _multi_country boolean, _gender character, _date_birth timestamp without time zone, _ident_doc_number character varying, _main_phone character varying, _main_phone_wha boolean, _second_phone character varying, _second_phone_wha boolean, _delegated_phone character varying, _delegated_phone_wha boolean, _resid_city text, _address text, _referral_node text, _main_sn_platf text, _user_main_sn_platf text, _ok_legal_terms boolean, _date_legacy_reg timestamp without time zone, _departments integer[], _uuid_profile uuid, _id_service bigint, _id_services_utype bigint, _id_ident_doc_type bigint, _id_resid_country bigint, _id_nationality_country bigint, _id_verif_level bigint, _main_phone_code character varying, _main_phone_full character varying, _second_phone_code character varying, _second_phone_full character varying, _delegated_phone_code character varying, _delegated_phone_full character varying, _pol_exp_per boolean`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_sixmap_users_insert(_first_name character varying, _second_name character varying, _last_name character varying, _second_last_name character varying, _username character varying, _email_user character varying, _password text, _cust_cr_cod_pub text, _cod_rank text, _verif_level_apb boolean, _multi_country boolean, _gender character, _date_birth timestamp without time zone, _ident_doc_number character varying, _main_phone character varying, _main_phone_wha...
```

#### sec_cust.sp_ms_sixmap_users_insert_new
- **Type:** function
- **Arguments:** `_first_name character varying, _second_name character varying, _last_name character varying, _second_last_name character varying, _email_user character varying, _password text, _referral_node text, _ok_legal_terms boolean, _id_resid_country bigint, _wholesale_partner_slug character varying`
- **Returns:** `character varying`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_sixmap_users_insert_new(_first_name character varying, _second_name character varying, _last_name character varying, _second_last_name character varying, _email_user character varying, _password text, _referral_node text, _ok_legal_terms boolean, _id_resid_country bigint, _wholesale_partner_slug character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
				id_priv BIGINT;
				current_full_user sec_cust.ms_sixmap_users %ROWT...
```

#### sec_cust.sp_ms_sixmap_users_insert_signup
- **Type:** function
- **Arguments:** `_first_name character varying, _second_name character varying, _last_name character varying, _second_last_name character varying, _username character varying, _email_user character varying, _password text, _gender character, _date_birth timestamp without time zone, _ident_doc_number character varying, _main_phone character varying, _main_phone_wha boolean, _second_phone character varying, _second_phone_wha boolean, _delegated_phone character varying, _delegated_phone_wha boolean, _resid_city text, _departments integer[], _id_ident_doc_type bigint, _id_resid_country bigint, _id_nationality_country bigint, _main_phone_code character varying, _main_phone_full character varying, _second_phone_code character varying, _second_phone_full character varying, _delegated_phone_code character varying, _delegated_phone_full character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_sixmap_users_insert_signup(_first_name character varying, _second_name character varying, _last_name character varying, _second_last_name character varying, _username character varying, _email_user character varying, _password text, _gender character, _date_birth timestamp without time zone, _ident_doc_number character varying, _main_phone character varying, _main_phone_wha boolean, _second_phone character varying, _second_phone_wha boolean, _delegated_p...
```

#### sec_cust.sp_ms_sixmap_users_update
- **Type:** function
- **Arguments:** `cols character varying[], vals character varying[], _email_user character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_sixmap_users_update(cols character varying[], vals character varying[], _email_user character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE i INT;
				_id_user_priv INT;
				current_verif_level INT;
				id_level INT;
			BEGIN
				RAISE NOTICE 'BEGIN';
				SELECT id_user_priv INTO _id_user_priv
				FROM sec_cust.ms_sixmap_userS
				WHERE email_user = _email_user;

				IF (array_length(cols, 1) <> array_length(vals, 1))
				THEN
					RAISE...
```

#### sec_cust.sp_ms_user_accounts_delete
- **Type:** function
- **Arguments:** `_id_user_account bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_user_accounts_delete(_id_user_account bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
BEGIN
					UPDATE sec_cust.ms_user_accounts
					SET active = false
					WHERE id_user_account = _id_user_account
					RETURNING id_user_account into _id_user_account;
					IF (_id_user_account IS NULL) THEN
						RAISE EXCEPTION 'Could not delete the object';
					ELSE
						RETURN json_build_object(
							'message', 'User account successfully deleted',
							'...
```

#### sec_cust.sp_ms_user_accounts_get_all
- **Type:** function
- **Arguments:** `_email_user character varying`
- **Returns:** `TABLE(id_user_account bigint, owner_name text, owner_id character varying, account_id text, account_type character varying, phone_number character varying, email character varying, id_doc_type integer, id_bank integer, id_pay_method integer, id_optional_field bigint, id_user integer, active boolean, name_optional_field character varying, bank_name character varying, pay_method_name character varying, doc_type_name character varying, fields character varying[])`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_user_accounts_get_all(_email_user character varying)
 RETURNS TABLE(id_user_account bigint, owner_name text, owner_id character varying, account_id text, account_type character varying, phone_number character varying, email character varying, id_doc_type integer, id_bank integer, id_pay_method integer, id_optional_field bigint, id_user integer, active boolean, name_optional_field character varying, bank_name character varying, pay_method_name character v...
```

#### sec_cust.sp_ms_user_accounts_insert
- **Type:** function
- **Arguments:** `_email_user character varying, _owner_name character varying, _owner_id character varying, _account_id character varying, _account_type character varying, _phone_number character varying, _email character varying, _id_doc_type integer, _id_bank integer, _id_pay_method integer, _id_optional_field bigint`
- **Returns:** `TABLE(id_user_account bigint, owner_name text, owner_id character varying, account_id text, account_type character varying, phone_number character varying, email character varying, id_doc_type integer, id_bank integer, id_pay_method integer, id_optional_field bigint, id_user integer, bank_name character varying, pay_method_name character varying, doc_type_name character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_user_accounts_insert(_email_user character varying, _owner_name character varying, _owner_id character varying, _account_id character varying, _account_type character varying, _phone_number character varying, _email character varying, _id_doc_type integer, _id_bank integer, _id_pay_method integer, _id_optional_field bigint)
 RETURNS TABLE(id_user_account bigint, owner_name text, owner_id character varying, account_id text, account_type character varying,...
```

#### sec_cust.sp_ms_verif_level_insert
- **Type:** function
- **Arguments:** `_id_vl bigint, _req_type character varying, _req_type_value character varying, _req_use_path character varying, _req_confirm_action boolean, _id_service integer, _id_services_utype integer, _id_resid_country integer`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_ms_verif_level_insert(_id_vl bigint, _req_type character varying, _req_type_value character varying, _req_use_path character varying, _req_confirm_action boolean, _id_service integer, _id_services_utype integer, _id_resid_country integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
			INSERT INTO sec_cust.MS_VERIF_LEVEL(
					id_vl,
					req_type,
					req_type_value,
					req_use_path,
					req_confirm_action,
					id_service,
					id_services_utyp...
```

#### sec_cust.sp_read_notification
- **Type:** function
- **Arguments:** `_id_notification integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_read_notification(_id_notification integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
BEGIN
					UPDATE sec_cust.ms_notifications
					SET is_read = true
					WHERE id_notification = _id_notification;

					RETURN json_build_object(
								'msg', 'Notification read'
							);
				END;
$function$

```

#### sec_cust.sp_request_level_one_1st_q
- **Type:** function
- **Arguments:** `_state_name character varying, _resid_city character varying, _email_user character varying, id_doc_type integer, doc_number character varying, _occupation character varying, doc_path character varying, selfie_path character varying, _main_sn_platf character varying, _user_main_sn_platf character varying, _address text, _gender character, _id_nationality_country integer, _main_phone character varying, _main_phone_code character varying, _main_phone_full character varying, _pol_exp_per boolean, _truthful_information boolean, _lawful_funds boolean, _legal_terms boolean, _new_password text, _new_email character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_request_level_one_1st_q(_state_name character varying, _resid_city character varying, _email_user character varying, id_doc_type integer, doc_number character varying, _occupation character varying, doc_path character varying, selfie_path character varying, _main_sn_platf character varying, _user_main_sn_platf character varying, _address text, _gender character, _id_nationality_country integer, _main_phone character varying, _main_phone_code character varyi...
```

#### sec_cust.sp_request_level_one_2nd_q
- **Type:** function
- **Arguments:** `_state_name character varying, _resid_city character varying, _email_user character varying, id_country integer, doc_number character varying, _occupation character varying, doc_path character varying, selfie_path character varying, _main_sn_platf character varying, _user_main_sn_platf character varying, _address text, _gender character, _id_nationality_country integer, _main_phone character varying, _main_phone_code character varying, _main_phone_full character varying, _pol_exp_per boolean, _truthful_information boolean, _lawful_funds boolean, _legal_terms boolean`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_request_level_one_2nd_q(_state_name character varying, _resid_city character varying, _email_user character varying, id_country integer, doc_number character varying, _occupation character varying, doc_path character varying, selfie_path character varying, _main_sn_platf character varying, _user_main_sn_platf character varying, _address text, _gender character, _id_nationality_country integer, _main_phone character varying, _main_phone_code character varyin...
```

#### sec_cust.sp_request_level_one_3rd_q
- **Type:** function
- **Arguments:** `_state_name character varying, _resid_city character varying, _email_user character varying, id_country integer, doc_number character varying, _occupation character varying, doc_path character varying, selfie_path character varying, _main_sn_platf character varying, _user_main_sn_platf character varying, _address text, _gender character, _id_nationality_country integer, _main_phone character varying, _main_phone_code character varying, _main_phone_full character varying, _pol_exp_per boolean, _truthful_information boolean, _lawful_funds boolean, _legal_terms boolean, _new_password text`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_request_level_one_3rd_q(_state_name character varying, _resid_city character varying, _email_user character varying, id_country integer, doc_number character varying, _occupation character varying, doc_path character varying, selfie_path character varying, _main_sn_platf character varying, _user_main_sn_platf character varying, _address text, _gender character, _id_nationality_country integer, _main_phone character varying, _main_phone_code character varyin...
```

#### sec_cust.sp_request_level_one_silt
- **Type:** function
- **Arguments:** `p_date_birth timestamp with time zone, p_email_user character varying, p_doc_type integer, p_iso_doc_country character varying, p_doc_number character varying, p_doc_path character varying, p_selfie_path character varying, p_gender character, p_iso_nationality_country character, p_silt_id character varying, p_silt_status character varying, p_was_set_manually boolean`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_request_level_one_silt(p_date_birth timestamp with time zone, p_email_user character varying, p_doc_type integer, p_iso_doc_country character varying, p_doc_number character varying, p_doc_path character varying, p_selfie_path character varying, p_gender character, p_iso_nationality_country character, p_silt_id character varying, p_silt_status character varying, p_was_set_manually boolean)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_current_...
```

#### sec_cust.sp_request_level_two
- **Type:** function
- **Arguments:** `_funds_source text, residency_proof_path character varying, q_and_a json[], other_industry text, _email_user character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_request_level_two(_funds_source text, residency_proof_path character varying, q_and_a json[], other_industry text, _email_user character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
					current_full_user sec_cust.ms_sixmap_users %ROWTYPE;
					obj JSON;
					question_number INT;
				BEGIN
					-- look for the full user
                        SELECT * INTO current_full_user
                        FROM sec_cust.ms_sixmap_users AS U
      ...
```

#### sec_cust.sp_request_wholesale_partner
- **Type:** function
- **Arguments:** `_reasons text, _strenghts text, _remittance_service boolean, _old_resid_client_countries text, _profession text, _resid_country integer, _migration_status integer, _new_resid_client_countries text, _clients_number text, _monthly_amount character varying, _monetary_growth character varying, _clients_growth text, _bussiness_name character varying, _web_page_exp boolean, _logo boolean, _email_user character varying, reasons_status boolean, strenghts_status boolean, remittance_service_status boolean, old_resid_client_countries_status boolean, profession_status boolean, resid_country_status boolean, migration_status_status boolean, new_resid_client_countries_status boolean, clients_number_status boolean, monthly_amount_status boolean, monetary_growth_status boolean, clients_growth_status boolean, bussiness_name_status boolean, web_page_exp_status boolean, logo_status boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_request_wholesale_partner(_reasons text, _strenghts text, _remittance_service boolean, _old_resid_client_countries text, _profession text, _resid_country integer, _migration_status integer, _new_resid_client_countries text, _clients_number text, _monthly_amount character varying, _monetary_growth character varying, _clients_growth text, _bussiness_name character varying, _web_page_exp boolean, _logo boolean, _email_user character varying, reasons_status boo...
```

#### sec_cust.sp_session_obj_update
- **Type:** function
- **Arguments:** `cols character varying[], vals character varying[], _sid character varying, hasuuid boolean`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_session_obj_update(cols character varying[], vals character varying[], _sid character varying, hasuuid boolean)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN IF (array_length(cols, 1) <> array_length(vals, 1)) THEN RAISE NOTICE 'Los arreglos deben tener la misma cantidad de elementos';
			ELSEIF (array_length(cols, 1) = 1) THEN EXECUTE 'UPDATE sec_cust.session_obj SET ' || cols [1] || ' = $1 ' || 'WHERE SID = $2' USING vals [1],
			_sid;
			ELSEIF (ar...
```

#### sec_cust.sp_set_client_profile
- **Type:** function
- **Arguments:** `_email_user character varying, _uuid_profile uuid`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_set_client_profile(_email_user character varying, _uuid_profile uuid)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				resp_obj JSON;
				_id_client VARCHAR;
			BEGIN
				UPDATE sec_cust.ms_sixmap_users
				SET uuid_profile = _uuid_profile
				WHERE email_user = _email_user
				RETURNING id_user INTO _id_client;

				IF (_id_client IS NOT NULL)
				THEN
					resp_obj := json_build_object(
							'message', 'User profile succesfully updated'
							...
```

#### sec_cust.sp_store_pre_remittance
- **Type:** function
- **Arguments:** `_pre_remittance json, _email_user character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_store_pre_remittance(_pre_remittance json, _email_user character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					_id_pre_remittance BIGINT;
					_there_is_id_pre_remittance BIGINT;
				BEGIN

					SELECT PR.id_pre_remittance INTO _there_is_id_pre_remittance
					FROM sec_cust.ms_pre_remittance PR
					WHERE PR.email_user = _email_user
					AND PR.active = true
					ORDER BY PR.date_creation DESC
					LIMI...
```

#### sec_cust.sp_unblock_user
- **Type:** function
- **Arguments:** `_uuid_user uuid`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_unblock_user(_uuid_user uuid)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				resp_obj JSON;
				_email_user VARCHAR;
			BEGIN
				UPDATE sec_cust.ms_sixmap_users
				SET user_active = false
				WHERE uuid_user = _uuid_user
				RETURNING email_user INTO _email_user;

				IF (_email_user IS NOT NULL)
				THEN
					resp_obj := json_build_object(
							'message', 'User succesfully unblocked'
							);
					RETURN resp_obj;
				ELSE
...
```

#### sec_cust.sp_update_percent_profit
- **Type:** function
- **Arguments:** `_percent_profit double precision, _slug character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_update_percent_profit(_percent_profit double precision, _slug character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					succesfully_updated VARCHAR;
				BEGIN
					UPDATE sec_cust.ms_wholesale_partners_info
					SET percent_profit = _percent_profit
					WHERE slug = _slug
					RETURNING slug INTO succesfully_updated;

					IF (succesfully_updated IS NOT NULL)
					THEN
						resp_obj := json_build_object(
								'me...
```

#### sec_cust.sp_update_user_password
- **Type:** function
- **Arguments:** `_pwd text, _email_user character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_update_user_password(_pwd text, _email_user character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				current_full_user sec_cust.MS_SIXMAP_USERS%ROWTYPE;
			BEGIN
				SELECT * INTO current_full_user
				FROM sec_cust.MS_SIXMAP_USERS AS u
				WHERE u.email_user = _email_user;

				IF (current_full_user.email_user IS NOT NULL)
					THEN
						UPDATE sec_cust.MS_SIXMAP_USERS
						SET password = _pwd
						WHERE email_user = _email_user;

		...
```

#### sec_cust.sp_verif_code
- **Type:** function
- **Arguments:** `_ident_user character varying, _code integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_verif_code(_ident_user character varying, _code integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
				temp_code_found sec_cust.MS_TEMP_CODES%ROWTYPE;
				difference DOUBLE PRECISION;
			BEGIN
            RAISE NOTICE 'EN EL SPPP _ident_user %', _ident_user;
            RAISE NOTICE 'EN EL SPPP _code %', _code;

				SELECT * INTO temp_code_found
				FROM sec_cust.MS_TEMP_CODES AS T
				WHERE T.ident_user = _ident_user;

				IF (temp_code_found I...
```

#### sec_cust.sp_verif_levels_requirements
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE("idUsersVerifLevel" bigint, "idVl" integer, "levelOne" json, "levelTwo" json, "dateCreation" bigint, "dateLastModified" bigint, "emailUser" character varying, username character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_verif_levels_requirements()
 RETURNS TABLE("idUsersVerifLevel" bigint, "idVl" integer, "levelOne" json, "levelTwo" json, "dateCreation" bigint, "dateLastModified" bigint, "emailUser" character varying, username character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN
	return query
					select luvl.id_users_verif_level, luvl.id_vl, (SELECT json_agg(elem)
					FROM sec_cust.LNK_USERS_VERIF_LEVEL AS L, sec_cust.ms_sixmap_users AS U,
					jsonb_array_elements(L...
```

#### sec_cust.sp_verif_levels_requirements_get
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_verif_levels_requirements_get()
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_id_verif_levels                 int[];
    v_json_resp                             jsonb;
    v_id_verif_level                  int;
	BEGIN
	 v_json_resp := '{}'::jsonb;
    select array(
        select luvl.id_users_verif_level
        from sec_cust.LNK_USERS_VERIF_LEVEL luvl
        where luvl.level_apb_ok is null
    )::int[] into v_id_verif_levels;
	foreach v_id_...
```

#### sec_cust.sp_verif_levels_requirements_get_all
- **Type:** function
- **Arguments:** `p_id_verif_level integer`
- **Returns:** `jsonb[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_verif_levels_requirements_get_all(p_id_verif_level integer)
 RETURNS jsonb[]
 LANGUAGE plpgsql
AS $function$
declare
    v_json_resp                             jsonb[];
	BEGIN
	raise notice 'llega: %', p_id_verif_level;
	 v_json_resp := '{}'::jsonb;
	 select array(
		 select jsonb_build_object (
			 'json', luvl.level_req -> 0)
			 from sec_cust.LNK_USERS_VERIF_LEVEL luvl where luvl.id_users_verif_level = p_id_verif_level and luvl.level_apb_ok is null and ...
```

#### sec_cust.sp_verify_phone_and_id
- **Type:** function
- **Arguments:** `p_full_phone character varying, p_id_number character varying`
- **Returns:** `boolean`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_verify_phone_and_id(p_full_phone character varying, p_id_number character varying)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
declare
    v_exists             boolean;
begin
    select exists(
        select ph.id_phone
        from sec_cust.ms_phone ph
        where ph.full_number = p_full_phone
    ) into v_exists;
    if (v_exists = false) then
        select exists(
            select us.id_user
            from sec_cust.ms_sixmap_user...
```

#### sec_cust.sp_verify_route_by_ip
- **Type:** function
- **Arguments:** `_route character varying, _ip character varying`
- **Returns:** `jsonb`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.sp_verify_route_by_ip(_route character varying, _ip character varying)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
				resp_obj JSONB;
				found_id_limit_route INT;
				found_id_limit_route_ip INT;
				_attempts_limit INT;
				_time_limit INT;
				_attempts INT;
				difference INT;
				BEGIN

					SELECT LR.id_limit_route, LR.attempts_limit, LR.time_limit INTO found_id_limit_route, _attempts_limit, _time_limit
					FROM sec_cust.ms_limit_routes LR
	...
```

#### sec_cust.total_accumulated_by_user
- **Type:** function
- **Arguments:** `_cust_cr_cod_pub character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.total_accumulated_by_user(_cust_cr_cod_pub character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					acum FLOAT;
				BEGIN

					SELECT CASE WHEN SUM(R.total_origin_local_amount) is null THEN 0
								ELSE SUM(R.total_origin_local_amount)
							END		INTO 	acum
					FROM prc_mng.lnk_cr_remittances AS R, sec_cust.ms_sixmap_users AS U
					WHERE R.id_client = U.id_user
					AND U.cust_cr_cod_pub = _cust_cr_cod_pub;
					RETURN acum;
				END;...
```

#### sec_cust.total_amount_by_country
- **Type:** function
- **Arguments:** `p_country character varying, p_month character varying, p_date character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.total_amount_by_country(p_country character varying, p_month character varying, p_date character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
resp_obj JSONB;
resp_obj2 JSONB;
resp_obj3 JSONB;
registered double precision;
actived varchar;
desactived double precision;
BEGIN
IF((p_country is null or p_country = '' or p_country = 'undefined') and (p_month is null or p_month = '' or p_country = 'undefined') and (p_date is null or p_date =...
```

#### sec_cust.update_cost_date_function
- **Type:** function
- **Arguments:** `none`
- **Returns:** `trigger`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.update_cost_date_function()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN

				NEW.date_last_modif = NOW();

				IF ((OLD.rate_cost IS NULL AND NEW.rate_cost IS NOT NULL) OR (OLD.rate_cost IS NOT NULL AND NEW.rate_cost <> OLD.rate_cost))
				THEN
					NEW.date_cost_modif = NOW();
				END IF;

				return NEW;

			END;
$function$

```

#### sec_cust.update_data_array
- **Type:** function
- **Arguments:** `json_obj jsonb`
- **Returns:** `jsonb`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.update_data_array(json_obj jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
    key text;
    value jsonb;
BEGIN
    IF json_obj IS NULL THEN
        RETURN NULL;
    END IF;

    -- Recorrer cada par clave-valor del objeto JSON
    FOR key, value IN SELECT * FROM jsonb_each(json_obj)
    LOOP
        -- Verificar si la clave es 'data' y el valor es un array
        IF key = 'data' AND jsonb_typeof(value) = 'array' THEN
            j...
```

#### sec_cust.update_date_function
- **Type:** function
- **Arguments:** `none`
- **Returns:** `trigger`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.update_date_function()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN

				NEW.date_last_modif = NOW();
				return NEW;

			END;
$function$

```

#### sec_cust.update_level_one_info
- **Type:** function
- **Arguments:** `_state_name character varying, _resid_city character varying, _email_user character varying, _occupation character varying, _address character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.update_level_one_info(_state_name character varying, _resid_city character varying, _email_user character varying, _occupation character varying, _address character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    current_full_user sec_cust.ms_sixmap_users %ROWTYPE;
BEGIN
    -- validate information is full
    IF (
        _state_name IS NULL OR
        _resid_city IS NULL OR
        _email_user IS NULL OR
        _occupation IS NUL...
```

#### sec_cust.update_loyalty_function
- **Type:** function
- **Arguments:** `none`
- **Returns:** `trigger`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.update_loyalty_function()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE ops INT;
			BEGIN RAISE NOTICE '(%)',
			NEW.uuid_user;
			SELECT COUNT(*) INTO ops
			FROM sec_cust.ms_operation AS OP
			WHERE OP.uuid_user = NEW.uuid_user;
			IF (ops <= 2) THEN RAISE NOTICE 'UNO con (%)',
			ops;
			UPDATE sec_cust.lnk_users_loyalty_levels
			SET id_loyalty = (
					SELECT L.id_loyalty
					FROM sec_cust.loyalty_levels AS L
					WHERE L.level = 'Nuevo Client...
```

#### sec_cust.update_risk_function
- **Type:** function
- **Arguments:** `none`
- **Returns:** `trigger`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.update_risk_function()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE ops INT;
			BEGIN
                RAISE NOTICE '(%)',
                NEW.uuid_user;
                SELECT COUNT(*) INTO ops
                FROM sec_cust.ms_suspicious_activities AS OP
                WHERE OP.uuid_user = NEW.uuid_user;
                IF (ops <= 2) THEN RAISE NOTICE 'UNO con (%)',
                ops;
                UPDATE sec_cust.lnk_users_risk_levels
       ...
```

#### sec_cust.users_quantity_resid_city
- **Type:** function
- **Arguments:** `p_country character varying, p_month character varying, p_date character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.users_quantity_resid_city(p_country character varying, p_month character varying, p_date character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
resp_obj JSONB;
registered varchar;
actived integer;
BEGIN
IF((p_country is null or p_country = '') and (p_month is null or p_month = '') and (p_date is null or p_date = ''))
	THEN
	raise notice 'Entra en nada';
	SELECT json_object_agg(city, count)
	FROM (
		SELECT resid_city AS city, count...
```

#### sec_cust.usets_quantity_gender
- **Type:** function
- **Arguments:** `p_country character varying, p_month character varying, p_date character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.usets_quantity_gender(p_country character varying, p_month character varying, p_date character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
resp_obj JSONB;
registered integer;
actived integer;
BEGIN
IF((p_country is null or p_country = '') and (p_month is null or p_month = '') and (p_date is null or p_date = ''))
	THEN
	raise notice 'Entra en nada';
	SELECT COUNT(u.id_user) into registered
	FROM sec_cust.ms_sixmap_users u
	where u....
```

#### sec_cust.v_countries_get_criptoremesa_active
- **Type:** function
- **Arguments:** `type character varying`
- **Returns:** `TABLE(id_country bigint, name_country character varying, id_ip_country integer, country_iso_code character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.v_countries_get_criptoremesa_active(type character varying)
 RETURNS TABLE(id_country bigint, name_country character varying, id_ip_country integer, country_iso_code character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN
				IF (type = 'latam')
				THEN
					RETURN QUERY
					SELECT C.id_country,
						C.name_country,
						C.id_ip_country,
						C.country_iso_code
					FROM sec_emp.ms_countries AS C
					WHERE C.criptoremesa_active = true
					AND C.country...
```

#### sec_cust.v_countries_get_quantity_of_users_by_nationality_countrie
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE(id_ip_country bigint, country_iso_code character varying, name_country character varying, quantity bigint)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.v_countries_get_quantity_of_users_by_nationality_countrie()
 RETURNS TABLE(id_ip_country bigint, country_iso_code character varying, name_country character varying, quantity bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT C.id_ip_country, C.country_iso_code, c.country_name, COUNT(C.id_ip_country) as quantity
			FROM sec_emp.ms_ip_countries AS C, sec_cust.ms_sixmap_users AS U
			WHERE C.id_ip_country = U.id_nationality_country
			GROUP BY C...
```

#### sec_cust.v_countries_get_quantity_of_users_by_resid_countrie
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE(id_country bigint, country_iso_code character varying, name_country character varying, quantity bigint)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.v_countries_get_quantity_of_users_by_resid_countrie()
 RETURNS TABLE(id_country bigint, country_iso_code character varying, name_country character varying, quantity bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT C.id_country, C.country_iso_code, c.name_country, COUNT(U.id_resid_country) as quantity
			FROM sec_emp.ms_countries AS C, sec_cust.ms_sixmap_users AS U
			WHERE C.id_country = U.id_resid_country
			GROUP BY C.id_country, C.countr...
```

#### sec_cust.v_countries_get_sixmap_active
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE(id_country bigint, name_country character varying, id_ip_country integer)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.v_countries_get_sixmap_active()
 RETURNS TABLE(id_country bigint, name_country character varying, id_ip_country integer)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT C.id_country,
				C.name_country,
				C.id_ip_country
			FROM sec_emp.ms_countries AS C
			WHERE C.sixmap_active = true
				AND C.country_active = true;
			END;
$function$

```

#### sec_cust.v_departments_get_active
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE(id_dpt bigint, name_dpt text)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.v_departments_get_active()
 RETURNS TABLE(id_dpt bigint, name_dpt text)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT D.id_dpt,
				D.name_dpt
			FROM sec_cust.ms_departments AS D
			WHERE D.active = true;
			END;
$function$

```

#### sec_cust.v_frequent_beneficiary_data
- **Type:** function
- **Arguments:** `p_client_country_name character varying, p_beneficiary_country_name character varying`
- **Returns:** `TABLE(crid character varying, client_name character varying, client_email character varying, client_phone character varying, resid_country character varying, beneficiary_name character varying, beneficiary_email character varying, beneficiary_phone character varying, beneficiary_country character varying, beneficiary_city character varying, beneficiary_doc_number character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.v_frequent_beneficiary_data(p_client_country_name character varying, p_beneficiary_country_name character varying)
 RETURNS TABLE(crid character varying, client_name character varying, client_email character varying, client_phone character varying, resid_country character varying, beneficiary_name character varying, beneficiary_email character varying, beneficiary_phone character varying, beneficiary_country character varying, beneficiary_city character varyin...
```

#### sec_cust.v_ident_doc_type_by_country
- **Type:** function
- **Arguments:** `_id_resid_country integer`
- **Returns:** `TABLE(id_ident_doc_type bigint, name_doc_type character varying, id_resid_country integer)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.v_ident_doc_type_by_country(_id_resid_country integer)
 RETURNS TABLE(id_ident_doc_type bigint, name_doc_type character varying, id_resid_country integer)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT DT.id_ident_doc_type,
				DT.name_doc_type,
				DT.id_resid_country
			FROM sec_cust.ms_doc_type AS DT
			WHERE DT.active = true
				AND DT.id_resid_country = _id_resid_country;
			END;
$function$

```

#### sec_cust.v_ident_doc_type_get_active
- **Type:** function
- **Arguments:** `_id_country integer, _person_type character varying, signup_or_payment character varying`
- **Returns:** `TABLE(id_ident_doc_type bigint, acronym character varying, name_doc_type character varying, type_doc_type character varying, id_resid_country integer, id_ip_country integer, name_country character varying, id_service integer, person_type character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.v_ident_doc_type_get_active(_id_country integer, _person_type character varying, signup_or_payment character varying)
 RETURNS TABLE(id_ident_doc_type bigint, acronym character varying, name_doc_type character varying, type_doc_type character varying, id_resid_country integer, id_ip_country integer, name_country character varying, id_service integer, person_type character varying)
 LANGUAGE plpgsql
AS $function$
DECLARE
				signup BOOLEAN;
				payment BOOLEAN;...
```

#### sec_cust.v_level_answers_get_active
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE(id_level_answer bigint, level integer, id_level_question integer, answer text, alert boolean)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.v_level_answers_get_active()
 RETURNS TABLE(id_level_answer bigint, level integer, id_level_question integer, answer text, alert boolean)
 LANGUAGE plpgsql
AS $function$
begin
    -- missing source code
end;
$function$

```

#### sec_cust.v_level_questions_get_active
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE(id_level_question bigint, level integer, question_number integer, question text, question_type character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.v_level_questions_get_active()
 RETURNS TABLE(id_level_question bigint, level integer, question_number integer, question text, question_type character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT Q.id_level_question,
				Q.level,
				Q.question_number,
				Q.question,
				Q.question_type
			FROM sec_cust.MS_LEVEL_QUESTIONS AS Q
			WHERE Q.active = true;
			END;
$function$

```

#### sec_cust.v_main_doc_type_by_country_name
- **Type:** function
- **Arguments:** `_id_ip_country integer`
- **Returns:** `TABLE(id_ident_doc_type bigint, name_doc_type character varying, type_doc_type character varying, id_ip_country integer)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.v_main_doc_type_by_country_name(_id_ip_country integer)
 RETURNS TABLE(id_ident_doc_type bigint, name_doc_type character varying, type_doc_type character varying, id_ip_country integer)
 LANGUAGE plpgsql
AS $function$
DECLARE country_name VARCHAR;
			BEGIN
			SELECT C.country_name INTO country_name
			FROM sec_emp.ms_ip_countries AS C
			WHERE C.id_ip_country = _id_ip_country
			LIMIT 1;
			RETURN QUERY
			SELECT DT.id_ident_doc_type,
				DT.name_doc_type,
			...
```

#### sec_cust.v_migration_status
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.v_migration_status()
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					mig_status JSONB;
				BEGIN
					SELECT json_agg(M.*) INTO mig_status
					FROM (SELECT MS.id_migration_status,MS.name_migration_status
					FROM sec_cust.MS_migration_status AS MS
					WHERE MS.active = true) AS M;

					RETURN mig_status;
				END;
$function$

```

#### sec_cust.v_ms_verif_level_get_id_by_id_vl_service_utype_country
- **Type:** function
- **Arguments:** `_id_vl bigint, _id_service bigint, _id_services_utype bigint, _id_resid_country bigint`
- **Returns:** `TABLE(id_verif_level bigint)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.v_ms_verif_level_get_id_by_id_vl_service_utype_country(_id_vl bigint, _id_service bigint, _id_services_utype bigint, _id_resid_country bigint)
 RETURNS TABLE(id_verif_level bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT VL.id_verif_level
			FROM sec_cust.ms_verif_level AS VL
			WHERE VL.active = true
				AND VL.id_vl = _id_vl
				AND VL.id_service = _id_service
				AND VL.id_services_utype = _id_services_utype
				AND VL.id_resid_country ...
```

#### sec_cust.v_ms_verif_level_get_id_vl_by_service_utype_country
- **Type:** function
- **Arguments:** `_id_service bigint, _id_services_utype bigint, _id_resid_country bigint`
- **Returns:** `TABLE(id_vl integer)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.v_ms_verif_level_get_id_vl_by_service_utype_country(_id_service bigint, _id_services_utype bigint, _id_resid_country bigint)
 RETURNS TABLE(id_vl integer)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT DISTINCT VL.id_vl
			FROM sec_cust.ms_verif_level AS VL
			WHERE VL.active = true
				AND VL.id_service = _id_service
				AND VL.id_services_utype = _id_services_utype
				AND VL.id_resid_country = _id_resid_country;
			END;
$function$

```

#### sec_cust.v_notifications
- **Type:** function
- **Arguments:** `_email_user character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.v_notifications(_email_user character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					nots JSONB;
					current_noti int;
					global_nots int[];
					full_user sec_cust.ms_sixmap_users %ROWTYPE;
				BEGIN
					SELECT U.* INTO full_user
					FROM sec_cust.ms_sixmap_users AS U
					WHERE U.email_user = _email_user;

					-- se insertan las global notifications que correspondan el usuario por país y por nivel de verificación

					SELECT array...
```

#### sec_cust.v_profiles_get_active
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE(uuid_profile uuid, name_profile character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.v_profiles_get_active()
 RETURNS TABLE(uuid_profile uuid, name_profile character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT P.uuid_profile,
				P.name_profile
			FROM sec_cust.ms_profiles AS P
			WHERE P.active = true;
			END;
$function$

```

#### sec_cust.v_range_rates
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.v_range_rates()
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					rates JSONB;
				BEGIN
					SELECT json_agg(RR.*) INTO rates
					FROM (SELECT R.id_range_rates,
							R.min_amount,
							R.lower_limit,
							R.upper_limit,
							R.id_rate_type,
							RT.rate_type_name,
							R.id_cou_cur_origin,
							R.id_cou_cur_destiny,
							(SELECT CC.id_country
							FROM sec_cust.lnk_country_currency AS CC
							WHERE CC.id_cou_cur = R.id_cou_cur_or...
```

#### sec_cust.v_remittance_beneficiary_data
- **Type:** function
- **Arguments:** `p_client_country_name character varying, p_beneficiary_country_name character varying`
- **Returns:** `TABLE(crid character varying, client_name character varying, client_email character varying, client_phone character varying, resid_country character varying, beneficiary_name character varying, beneficiary_email character varying, beneficiary_phone character varying, beneficiary_country character varying, beneficiary_city character varying, beneficiary_doc_number character varying, remittance_type character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.v_remittance_beneficiary_data(p_client_country_name character varying, p_beneficiary_country_name character varying)
 RETURNS TABLE(crid character varying, client_name character varying, client_email character varying, client_phone character varying, resid_country character varying, beneficiary_name character varying, beneficiary_email character varying, beneficiary_phone character varying, beneficiary_country character varying, beneficiary_city character vary...
```

#### sec_cust.v_secondary_doc_type_by_country_name
- **Type:** function
- **Arguments:** `_id_ip_country integer`
- **Returns:** `TABLE(id_ident_doc_type bigint, name_doc_type character varying, type_doc_type character varying, id_ip_country integer)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.v_secondary_doc_type_by_country_name(_id_ip_country integer)
 RETURNS TABLE(id_ident_doc_type bigint, name_doc_type character varying, type_doc_type character varying, id_ip_country integer)
 LANGUAGE plpgsql
AS $function$
DECLARE country_name VARCHAR;
			BEGIN
			SELECT C.country_name INTO country_name
			FROM sec_emp.ms_ip_countries AS C
			WHERE C.id_ip_country = _id_ip_country
			LIMIT 1;
			RETURN QUERY
			SELECT DT.id_ident_doc_type,
				DT.name_doc_type...
```

#### sec_cust.v_services_get_active
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE(id_service bigint, tx_service character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.v_services_get_active()
 RETURNS TABLE(id_service bigint, tx_service character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT S.id_service,
				S.tx_service
			FROM sec_cust.ms_sixmap_services AS S
			WHERE S.active = true;
			END;
$function$

```

#### sec_cust.v_services_utype_get_active
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE(id_services_utype bigint, name_utype character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.v_services_utype_get_active()
 RETURNS TABLE(id_services_utype bigint, name_utype character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT UT.id_services_utype,
				UT.name_utype
			FROM sec_cust.ms_sixmap_services_utype AS UT
			WHERE UT.active = true;
			END;
$function$

```

#### sec_cust.v_verif_levels_requirements
- **Type:** function
- **Arguments:** `_email_user character varying, _id_users_verif_level bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.v_verif_levels_requirements(_email_user character varying, _id_users_verif_level bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					level_one JSONB;
					level_two JSONB;
                    full_user JSONB;
				BEGIN
					SELECT json_agg(elem) INTO level_one
					FROM sec_cust.LNK_USERS_VERIF_LEVEL AS L, sec_cust.ms_sixmap_users AS U,
					jsonb_array_elements(L.level_req) elem
					WHERE L.id_vl = 1
					AND L.uuid_user = U.uuid_user
					AND...
```

#### sec_cust.v_verif_levels_requirements_disapproved
- **Type:** function
- **Arguments:** `_email_user character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.v_verif_levels_requirements_disapproved(_email_user character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					level_one JSONB;
					level_two JSONB;
				BEGIN
					SELECT json_agg(elem) INTO level_one
					FROM sec_cust.LNK_USERS_VERIF_LEVEL AS L, sec_cust.ms_sixmap_users AS U,
					jsonb_array_elements(L.level_req) elem
					WHERE L.id_vl = 1
					AND L.uuid_user = U.uuid_user
					AND U.email_user = _email_user
					AND L.is_the_last_one ...
```

#### sec_cust.v_wholesale_partners_requests_countries
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.v_wholesale_partners_requests_countries()
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					countries JSONB;
				BEGIN
					SELECT json_agg(M.*) INTO countries
					FROM (SELECT C.id_all_country,
							C.country_name,
							C.country_iso_code,
							C.is_latin
						FROM sec_emp.ms_all_countries AS C
						WHERE C.active = true
						AND C.is_latin = true
						OR C.country_iso_code = 'ES') AS M;

					RETURN countries;
				END;
$function$

```

#### sec_cust.v_wholesale_partners_requests_get_active
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE(id_partner bigint, apb_ok boolean, date_creation bigint, email_user character varying, current_request boolean)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.v_wholesale_partners_requests_get_active()
 RETURNS TABLE(id_partner bigint, apb_ok boolean, date_creation bigint, email_user character varying, current_request boolean)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT A.id_partner,
				A.apb_ok,
				EXTRACT(EPOCH FROM A.date_creation)::BIGINT,
				A.email_user, CASE WHEN A.id_partner = (SELECT A2.id_partner
														FROM sec_cust.MS_WHOLESALE_PARTNERS AS A2
														WHERE A2.email_user =...
```

#### sec_cust.v_wholesale_partners_requests_requirements_by_email
- **Type:** function
- **Arguments:** `_email_user character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.v_wholesale_partners_requests_requirements_by_email(_email_user character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					reqs JSONB;
				BEGIN
					SELECT json_agg(Q.*) INTO reqs
					FROM sec_cust.ms_wholesale_partners AS R, sec_cust.ms_wholesale_partners_questions AS Q
					WHERE R.id_partner = Q.id_partner
					AND R.email_user = _email_user
					AND Q.id_partner = (SELECT Q2.id_partner
										FROM sec_cust.ms_wholesale_partners AS Q...
```

#### sec_cust.v_wholesale_partners_requests_requirements_by_id
- **Type:** function
- **Arguments:** `_id_partner integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.v_wholesale_partners_requests_requirements_by_id(_id_partner integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					reqs JSONB;
					_email_user VARCHAR;
				BEGIN
					SELECT json_agg(Q.*) INTO reqs
					FROM sec_cust.ms_wholesale_partners AS R, sec_cust.ms_wholesale_partners_questions AS Q
					WHERE R.id_partner = Q.id_partner
					AND Q.id_partner = _id_partner;

					SELECT R.email_user INTO _email_user
					FROM sec_cust.ms_wholesale_partner...
```

#### sec_cust.v_wholesale_partners_requests_requirements_disapproved
- **Type:** function
- **Arguments:** `_email_user character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.v_wholesale_partners_requests_requirements_disapproved(_email_user character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					reqs JSONB;
				BEGIN
					SELECT json_agg(Q.*) INTO reqs
					FROM sec_cust.ms_wholesale_partners AS R, sec_cust.ms_wholesale_partners_questions AS Q
					WHERE R.id_partner = Q.id_partner
					AND R.email_user = _email_user
					AND Q.question_apb_ok = false;

					RETURN json_build_object(
						'questions', reqs,
...
```

#### sec_cust.validate_atc_hours
- **Type:** function
- **Arguments:** `id_resid_country integer, f_time_zone character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.validate_atc_hours(id_resid_country integer, f_time_zone character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					_time_zone VARCHAR;
					_from_hour VARCHAR;
					_to_hour VARCHAR;
					current_time_destiny_country TIMESTAMPTZ;
					resp_obj json;
					valid_hour	BOOLEAN;
				BEGIN
					IF (id_resid_country IS NOT NULL)
					THEN
						SELECT A.from_hour, A.to_hour, A.time_zone INTO _from_hour,_to_hour,_time_zone
						FROM sec_emp.ms_atc...
```

#### sec_cust.validate_bank_country_and_remittance_country
- **Type:** function
- **Arguments:** `id_country_bank integer, user_doc character varying, full_user_ident_doc_number character varying, full_user_id_resid_country integer`
- **Returns:** `character varying`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.validate_bank_country_and_remittance_country(id_country_bank integer, user_doc character varying, full_user_ident_doc_number character varying, full_user_id_resid_country integer)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
					doc_is_similar_1 BOOLEAN;
					doc_is_similar_2 BOOLEAN;
					doc_is_similar_def BOOLEAN;
				BEGIN

					SELECT * FROM sec_cust.similar_strings(user_doc,full_user_ident_doc_number) INTO doc_is_similar_1;
					SE...
```

#### sec_cust.validate_email
- **Type:** function
- **Arguments:** `_new_email character varying`
- **Returns:** `boolean`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.validate_email(_new_email character varying)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
        current_client sec_cust.ms_sixmap_users%ROWTYPE;
    BEGIN

        SELECT * INTO current_client
        FROM sec_cust.ms_sixmap_users
        WHERE email_user = LOWER(_new_email);

        IF (current_client IS NULL) THEN
            RETURN true;
        ELSE
            RETURN FALSE;
        end if;

    END;
$function$

```

#### sec_cust.validate_remittance
- **Type:** function
- **Arguments:** `remittance jsonb`
- **Returns:** `jsonb`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.validate_remittance(remittance jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					limits JSONB;
					final_bool BOOLEAN;
					final_msg VARCHAR;
					no_limit VARCHAR;
					limit_1 VARCHAR;
					limit_2 VARCHAR;
					limit_3 VARCHAR;
					limit_4 VARCHAR;
					limit_5 VARCHAR;
					limit_6 VARCHAR;
					limit_7 VARCHAR;
					limit_8 VARCHAR;
					limit_9 VARCHAR;
					limit_10 VARCHAR;
					limit_11 VARCHAR;
					account_ty...
```

#### sec_cust.verif_ident_user
- **Type:** function
- **Arguments:** `_email_user character varying, _phone_number character varying`
- **Returns:** `jsonb`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.verif_ident_user(_email_user character varying, _phone_number character varying)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					found_email_user VARCHAR;
					found_phone_number VARCHAR;
				BEGIN
					SELECT U.email_user INTO found_email_user
					FROM sec_cust.ms_sixmap_users U
					WHERE U.email_user = _email_user;

					SELECT P.full_number INTO found_phone_number
					FROM sec_cust.ms_sixmap_users U, sec_cust.ms_phone P
	...
```

#### sec_cust.verif_ident_user_except_themself
- **Type:** function
- **Arguments:** `_phone_number character varying, _email_user character varying`
- **Returns:** `jsonb`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.verif_ident_user_except_themself(_phone_number character varying, _email_user character varying)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
    resp_obj JSONB;
    found_phone_number VARCHAR;
BEGIN
    SELECT P.full_number INTO found_phone_number
    FROM sec_cust.ms_sixmap_users U, sec_cust.ms_phone P
    WHERE P.uuid_user = U.uuid_user
    AND P.full_number = _phone_number
    AND P.active IS TRUE
    AND U.email_user <> _email_user;

    IF (fou...
```

#### sec_cust.verif_level_by_user
- **Type:** function
- **Arguments:** `p_country character varying, p_month character varying, p_date character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.verif_level_by_user(p_country character varying, p_month character varying, p_date character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
resp_obj JSONB;
resp_obj2 JSONB;
resp_obj3 JSONB;
registered integer;
actived integer;
desactived integer;
BEGIN
IF((p_country is null or p_country = '') and (p_month is null or p_month = '') and (p_date is null or p_date = ''))
	THEN
	raise notice 'Entra en nada';
	SELECT json_build_object(
		...
```

#### sec_cust.weekly_accumulated_by_user
- **Type:** function
- **Arguments:** `_cust_cr_cod_pub character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.weekly_accumulated_by_user(_cust_cr_cod_pub character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					acum FLOAT;
					current_week INT;
				BEGIN
					current_week := date_part('week',NOW());

					SELECT CASE WHEN SUM(R.total_origin_local_amount) is null THEN 0
								ELSE SUM(R.total_origin_local_amount)
							END		INTO 	acum
					FROM prc_mng.lnk_cr_remittances AS R, sec_cust.ms_sixmap_users AS U
					WHERE R.id_client = U.id_user
			...
```

#### sec_cust.wholesale_partner_reports
- **Type:** function
- **Arguments:** `_slug character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_cust.wholesale_partner_reports(_slug character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
					resp_obj JSONB;
					report_1 JSONB;
					report_2 JSONB;
					report_3 JSONB;
					report_4 JSONB;
				BEGIN
					SELECT sec_cust.report_wholesale_partner_profit(_slug) INTO report_1;
					SELECT sec_cust.report_wholesale_partner_profit_by_currency(_slug) INTO report_2;
					SELECT sec_cust.report_wholesale_partner_remittances_quantity(_slug) INTO rep...
```

#### sec_emp.get_all_captures
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE(id_competition_capture bigint, id_company_competition bigint, id_country bigint, name_country character varying, name_company character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.get_all_captures()
 RETURNS TABLE(id_competition_capture bigint, id_company_competition bigint, id_country bigint, name_country character varying, name_company character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN
        RETURN QUERY
        SELECT cc.id_competition_capture, cc.id_company_competition, c.id_country, cu.name_country, c.name_company
        FROM sec_emp.MS_COMPETITIONS_CAPTURES AS cc, sec_emp.MS_COMPANIES_COMPETITION AS c, sec_emp.MS_COUNTRIES...
```

#### sec_emp.get_bithonor_users
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE(uuid uuid, "firstName" character varying, "secondName" character varying, "lastName" character varying, "secondLastName" character varying, email character varying, phone character varying, "lastIp" character varying, "lastIpCity" character varying, "residCity" text, active boolean, blocked boolean, "countryName" character varying, "countryIsoCode" character varying, "crPubCode" character varying, "dateLegacy" bigint, "idVerifLevel" integer, "verifLevelApb" boolean, "userType" character varying, "idMigrated" bigint, "phoneChanged" boolean)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.get_bithonor_users()
 RETURNS TABLE(uuid uuid, "firstName" character varying, "secondName" character varying, "lastName" character varying, "secondLastName" character varying, email character varying, phone character varying, "lastIp" character varying, "lastIpCity" character varying, "residCity" text, active boolean, blocked boolean, "countryName" character varying, "countryIsoCode" character varying, "crPubCode" character varying, "dateLegacy" bigint, "idVeri...
```

#### sec_emp.get_bithonor_users_pag
- **Type:** function
- **Arguments:** `p_quantity integer, p_page integer`
- **Returns:** `TABLE(uuid uuid, "firstName" character varying, "secondName" character varying, "lastName" character varying, "secondLastName" character varying, email character varying, phone character varying, "lastIp" character varying, "lastIpCity" character varying, "residCity" text, active boolean, blocked boolean, "countryName" character varying, "countryIsoCode" character varying, "crPubCode" character varying, "dateLegacy" bigint, "idVerifLevel" integer, "verifLevelApb" boolean, "userType" character varying, "idMigrated" bigint, "phoneChanged" boolean)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.get_bithonor_users_pag(p_quantity integer, p_page integer)
 RETURNS TABLE(uuid uuid, "firstName" character varying, "secondName" character varying, "lastName" character varying, "secondLastName" character varying, email character varying, phone character varying, "lastIp" character varying, "lastIpCity" character varying, "residCity" text, active boolean, blocked boolean, "countryName" character varying, "countryIsoCode" character varying, "crPubCode" character...
```

#### sec_emp.get_capture_by_id
- **Type:** function
- **Arguments:** `_id_competition_capture bigint`
- **Returns:** `TABLE(id_competition_capture bigint, name_path character varying, id_company_competition bigint, id_country bigint, name_country character varying, name_company character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.get_capture_by_id(_id_competition_capture bigint)
 RETURNS TABLE(id_competition_capture bigint, name_path character varying, id_company_competition bigint, id_country bigint, name_country character varying, name_company character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN
        RETURN QUERY
        SELECT cc.id_competition_capture, cc.name_path, cc.id_company_competition, c.id_country, cu.name_country, c.name_company
        FROM sec_emp.MS_COMPETITIONS_C...
```

#### sec_emp.get_captures_by_country
- **Type:** function
- **Arguments:** `_id_country bigint`
- **Returns:** `TABLE(id_competition_capture bigint, id_company_competition bigint, id_country bigint, name_country character varying, name_company character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.get_captures_by_country(_id_country bigint)
 RETURNS TABLE(id_competition_capture bigint, id_company_competition bigint, id_country bigint, name_country character varying, name_company character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN
        RETURN QUERY
        SELECT cc.id_competition_capture, cc.id_company_competition, c.id_country, cu.name_country, c.name_company
        FROM sec_emp.MS_COMPETITIONS_CAPTURES AS cc, sec_emp.MS_COMPANIES_COMPETITION A...
```

#### sec_emp.get_departments_by_uuid_user
- **Type:** function
- **Arguments:** `id uuid`
- **Returns:** `TABLE(id_dpt integer, name_dpt text)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.get_departments_by_uuid_user(id uuid)
 RETURNS TABLE(id_dpt integer, name_dpt text)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT LD.id_dpt,
				D.name_dpt
			FROM sec_emp.lnk_users_departments AS LD,
				sec_emp.ms_sixmap_userS AS U,
				sec_emp.ms_departments AS D
			WHERE LD.uuid_user = U.uuid_user
				AND LD.id_dpt = D.id_dpt
				AND LD.uuid_user = id;
			END;
$function$

```

#### sec_emp.get_full_user_by_username
- **Type:** function
- **Arguments:** `_username character varying`
- **Returns:** `TABLE(email_user character varying, username character varying, id_resid_country integer, first_name character varying, last_name character varying, name_profile character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.get_full_user_by_username(_username character varying)
 RETURNS TABLE(email_user character varying, username character varying, id_resid_country integer, first_name character varying, last_name character varying, name_profile character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			select msu.email_user,
			msu.username,
			msu.id_resid_country,
			pmsu.first_name,
			pmsu.last_name,
			mp.name_profile
			from sec_emp.ms_sixmap_users msu,
			pri...
```

#### sec_emp.get_id_by_username
- **Type:** function
- **Arguments:** `_username character varying`
- **Returns:** `TABLE(user_id_priv uuid)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.get_id_by_username(_username character varying)
 RETURNS TABLE(user_id_priv uuid)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT sec_emp.MS_SIXMAP_USERS.uuid_user
			FROM sec_emp.MS_SIXMAP_USERS
			WHERE sec_emp.MS_SIXMAP_USERS.username = _username;
			END;
$function$

```

#### sec_emp.get_id_department_by_name
- **Type:** function
- **Arguments:** `_name character varying`
- **Returns:** `TABLE(id_dpt bigint)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.get_id_department_by_name(_name character varying)
 RETURNS TABLE(id_dpt bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT D.id_dpt
			FROM sec_emp.ms_departments AS D
			WHERE D.name_dpt = _name;
			END;
$function$

```

#### sec_emp.get_id_doc_type_by_name
- **Type:** function
- **Arguments:** `_name character varying`
- **Returns:** `TABLE(id_ident_doc_type bigint)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.get_id_doc_type_by_name(_name character varying)
 RETURNS TABLE(id_ident_doc_type bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT DT.id_ident_doc_type
			FROM sec_emp.ms_doc_type AS DT
			WHERE DT.name_doc_type = _name;
			END;
$function$

```

#### sec_emp.get_id_ip_country_by_name
- **Type:** function
- **Arguments:** `_name character varying`
- **Returns:** `TABLE(id_ip_country bigint)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.get_id_ip_country_by_name(_name character varying)
 RETURNS TABLE(id_ip_country bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT C.id_ip_country
			FROM sec_emp.ms_ip_countries AS C
			WHERE C.country_name = _name
			LIMIT 1;
			END;
$function$

```

#### sec_emp.get_id_resid_country_by_name
- **Type:** function
- **Arguments:** `_name character varying`
- **Returns:** `TABLE(id_country bigint)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.get_id_resid_country_by_name(_name character varying)
 RETURNS TABLE(id_country bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT C.id_country
			FROM sec_emp.ms_countries AS C
			WHERE C.name_country = _name;
			END;
$function$

```

#### sec_emp.get_id_service_by_name
- **Type:** function
- **Arguments:** `_name character varying`
- **Returns:** `TABLE(id_service bigint)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.get_id_service_by_name(_name character varying)
 RETURNS TABLE(id_service bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT S.id_service
			FROM sec_emp.ms_sixmap_services AS S
			WHERE S.tx_service = _name;
			END;
$function$

```

#### sec_emp.get_id_utype_by_name
- **Type:** function
- **Arguments:** `_name character varying`
- **Returns:** `TABLE(id_services_utype bigint)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.get_id_utype_by_name(_name character varying)
 RETURNS TABLE(id_services_utype bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT UT.id_services_utype
			FROM sec_emp.ms_sixmap_services_utype AS UT
			WHERE UT.name_utype = _name;
			END;
$function$

```

#### sec_emp.get_ip_info
- **Type:** function
- **Arguments:** `_ip character varying`
- **Returns:** `TABLE(network cidr, city_name character varying, country_name character varying, country_iso_code character varying, time_zone character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.get_ip_info(_ip character varying)
 RETURNS TABLE(network cidr, city_name character varying, country_name character varying, country_iso_code character varying, time_zone character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN
			_ip := replace(_ip,'::ffff:','');
			RETURN QUERY
			SELECT  ip_t.network
				,ip_t.city_name
				,ip_t.country_name
				,ip_t.country_iso_code
				,ip_t.time_zone
			FROM
			( sec_emp.geoip_blocks
				INNER JOIN sec_emp.geoip_locatio...
```

#### sec_emp.get_phones_by_uuid_user
- **Type:** function
- **Arguments:** `id uuid`
- **Returns:** `TABLE(type character varying, code character varying, number character varying, full_number character varying, mobile boolean, home boolean, office boolean, whatsapp boolean, telegram boolean)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.get_phones_by_uuid_user(id uuid)
 RETURNS TABLE(type character varying, code character varying, number character varying, full_number character varying, mobile boolean, home boolean, office boolean, whatsapp boolean, telegram boolean)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT PHO.type,
				PHO.code,
				PHO.number,
				PHO.full_number,
				PHO.mobile,
				PHO.home,
				PHO.office,
				PHO.whatsapp,
				PHO.telegram
			FROM sec_emp.ms_phone AS...
```

#### sec_emp.get_profile_routes
- **Type:** function
- **Arguments:** `p_uuid_roles uuid[], p_uuid_route_father uuid`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.get_profile_routes(p_uuid_roles uuid[], p_uuid_route_father uuid)
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
    v_resp                          json[];
begin
    if (p_uuid_route_father is null or exists(
        select *
        from sec_emp.ms_routes rou
        where rou.uuid_route_father = p_uuid_route_father
    )) then
        case
            when p_uuid_route_father is null then
                select array(
                    select sec_...
```

#### sec_emp.get_properties_by_company
- **Type:** function
- **Arguments:** `_id_company_competition integer`
- **Returns:** `TABLE(id_property bigint, value_property character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.get_properties_by_company(_id_company_competition integer)
 RETURNS TABLE(id_property bigint, value_property character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN
        RETURN QUERY
        SELECT P.id_property, P.value_property
        FROM sec_emp.MS_PROPERTIES AS P
        WHERE P.id_company_competition = _id_company_competition;
    END;
$function$

```

#### sec_emp.get_session_by_id
- **Type:** function
- **Arguments:** `_sid character varying`
- **Returns:** `TABLE(sid character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.get_session_by_id(_sid character varying)
 RETURNS TABLE(sid character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT S.sid
			FROM sec_emp.session_obj AS S
			where S.sid = _sid;
			END;
$function$

```

#### sec_emp.get_some_session
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE(sid character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.get_some_session()
 RETURNS TABLE(sid character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT S.sid
			FROM sec_emp.session_obj AS S
			Limit 1;
			END;
$function$

```

#### sec_emp.get_user_by_id
- **Type:** function
- **Arguments:** `id uuid`
- **Returns:** `TABLE(id_uuid uuid, first_name character varying, second_name character varying, last_name character varying, second_last_name character varying, username character varying, email_user character varying, last_session_reg character varying, last_ip_reg character varying, last_ip_city_reg character varying, last_id_log_reg integer, date_last_conn timestamp with time zone, gender character, date_birth timestamp with time zone, ident_doc_number character varying, main_phone character varying, second_phone character varying, delegated_phone character varying, resid_city text, user_active boolean, user_blocked boolean, uuid_profile uuid, id_service integer, id_services_utype integer, id_ident_doc_type integer, id_resid_country integer, id_nationality_country integer, name_profile character varying, name_service character varying, name_services_utype character varying, name_ident_doc_type character varying, name_resid_country character varying, name_nationality_country character varying, routes json[])`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.get_user_by_id(id uuid)
 RETURNS TABLE(id_uuid uuid, first_name character varying, second_name character varying, last_name character varying, second_last_name character varying, username character varying, email_user character varying, last_session_reg character varying, last_ip_reg character varying, last_ip_city_reg character varying, last_id_log_reg integer, date_last_conn timestamp with time zone, gender character, date_birth timestamp with time zone, iden...
```

#### sec_emp.get_user_by_username
- **Type:** function
- **Arguments:** `_username character varying`
- **Returns:** `TABLE(id_uuid uuid, username character varying, password text)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.get_user_by_username(_username character varying)
 RETURNS TABLE(id_uuid uuid, username character varying, password text)
 LANGUAGE plpgsql
AS $function$
BEGIN
				RETURN QUERY
				SELECT
					S.uuid_user,
					S.username,
					S.password
				FROM
					sec_emp.ms_sixmap_userS AS S
				WHERE
					S.username = _username;
			END;
$function$

```

#### sec_emp.get_user_routes
- **Type:** function
- **Arguments:** `p_uuid_user uuid, p_uuid_route_father uuid`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.get_user_routes(p_uuid_user uuid, p_uuid_route_father uuid)
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
    v_uuid_profile                  uuid;
    v_uuid_roles                    uuid[];
    v_json_resp                     json[];
begin
    select us.uuid_profile into v_uuid_profile
    from sec_emp.ms_sixmap_users us
    where us.uuid_user = p_uuid_user;
    select sec_emp.sp_get_roles_by_profile(v_uuid_profile) into v_uuid_roles;
    select sec...
```

#### sec_emp.get_uuid_profile_by_name
- **Type:** function
- **Arguments:** `_name character varying`
- **Returns:** `TABLE(uuid_profile uuid)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.get_uuid_profile_by_name(_name character varying)
 RETURNS TABLE(uuid_profile uuid)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT P.uuid_profile
			FROM sec_emp.ms_profiles AS P
			WHERE P.name_profile = _name;
			RAISE NOTICE 'EMMMPPPP';
			END;
$function$

```

#### sec_emp.json_build_principal_route_object
- **Type:** function
- **Arguments:** `p_uuid_roles uuid[], p_uuid_route uuid, p_id_route character varying, p_name_route character varying, p_label character varying, p_icon character varying, p_url character varying, p_external_url character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.json_build_principal_route_object(p_uuid_roles uuid[], p_uuid_route uuid, p_id_route character varying, p_name_route character varying, p_label character varying, p_icon character varying, p_url character varying, p_external_url character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
begin
    case
        when p_url is not null then
            return json_build_object(
                'id', p_id_route,
                'dataContent', p_name_route,
   ...
```

#### sec_emp.json_build_route_object
- **Type:** function
- **Arguments:** `p_uuid_roles uuid[], p_uuid_route uuid, p_name_route character varying, p_url character varying, p_external_url character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.json_build_route_object(p_uuid_roles uuid[], p_uuid_route uuid, p_name_route character varying, p_url character varying, p_external_url character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
begin
    case
        when p_url is not null then
            return json_build_object(
                'title', p_name_route,
                'to', p_url
            );
        when p_external_url is not null then
            return json_build_object(
          ...
```

#### sec_emp.json_build_route_object_test
- **Type:** function
- **Arguments:** `p_uuid_roles uuid[], p_uuid_route uuid, p_name_route character varying, p_url character varying, p_external_url character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.json_build_route_object_test(p_uuid_roles uuid[], p_uuid_route uuid, p_name_route character varying, p_url character varying, p_external_url character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
begin
    case
        when p_url is not null then
            return json_build_object(
                'title', p_name_route,
                'to', p_url
            );
        when p_external_url is not null then
            return json_build_object(
     ...
```

#### sec_emp.ms_delete_banks_account
- **Type:** function
- **Arguments:** `p_id_bank_account integer`
- **Returns:** `boolean`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.ms_delete_banks_account(p_id_bank_account integer)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
BEGIN
						delete from sec_cust.ms_bank_accounts
						where id_bank_account = p_id_bank_account;
						return true;
					END;

$function$

```

#### sec_emp.ms_delete_competition_company
- **Type:** function
- **Arguments:** `p_id_competition_company integer`
- **Returns:** `boolean`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.ms_delete_competition_company(p_id_competition_company integer)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
BEGIN
						update sec_emp.ms_companies_competition
						set active = false
						where id_company_competition = p_id_competition_company;
						return true;
					END;

$function$

```

#### sec_emp.ms_get_account_type
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.ms_get_account_type()
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
	v_resp                              json[];
begin
	select array(
		select json_build_object(
			'name', mpd.account_type
		) from sec_emp.v_account_type mpd
	)
    into v_resp;
	return v_resp;
end;
$function$

```

#### sec_emp.ms_get_banks_accounts
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.ms_get_banks_accounts()
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
	v_resp                              json[];
begin
	select array(
		select json_build_object(
			'idBankAccount', vba.id_bank_account,
			'accountHolderType', vba.account_holder_type,
			'accountHolderName', vba.account_holder_name,
			'accountType', vba.account_type,
			'accountNumber', vba.account_number,
			'accountHolderIdDoc', vba.account_holder_id_doc,
			'status', vba.status,...
```

#### sec_emp.ms_get_competition_company
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.ms_get_competition_company()
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
	v_resp                              json[];
begin
	select array(
		select json_build_object(
			'idCompanyCompetition', vcc.id_company_competition,
			'nameCompany', vcc.name_company,
			'typeUrl', vcc.type_url,
			'urlCompany', vcc.url_company,
			'dateCreation', vcc.date_creation,
			'dateModified', vcc.date_modified,
			'idCountry', vcc.id_country,
			'nameCountry', vcc.nam...
```

#### sec_emp.ms_get_competition_rates
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.ms_get_competition_rates()
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
	v_resp                              json[];
begin
	select array (
		select json_build_object(
			'idCompetitionRate', vcr.id_competition_rate,
			'rateFactor', vcr.rate_factor,
			'operation', vcr.operation,
			'idCompetitionCompany', vcr.id_competition_company,
			'idOriginCountry', vcr.id_origin_country,
			'idDestinyCountry', vcr.id_destiny_country,
			'idCurrencyOrigin', vcr...
```

#### sec_emp.ms_get_currency
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.ms_get_currency()
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
	v_resp                              json[];
begin
	select array(
		select json_build_object(
			'name', mc.name,
			'isoCod', mc.iso_cod
		) from sec_cust.ms_currencies mc
	)
    into v_resp;
	return v_resp;
end;
$function$

```

#### sec_emp.ms_get_historical_competition_rates
- **Type:** function
- **Arguments:** `p_origin_currency integer[], p_destiny_currency integer[]`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.ms_get_historical_competition_rates(p_origin_currency integer[], p_destiny_currency integer[])
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
	v_resp                              json[];
begin
	select array (
		select json_build_object(
			'idCompetitionRate', vcr.id_competition_rate,
			'rateFactor', vcr.rate_factor,
			'operation', vcr.operation,
			'idCompetitionCompany', vcr.id_competition_company,
			'idOriginCountry', vcr.id_origin_country,
			'i...
```

#### sec_emp.ms_get_pay
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.ms_get_pay()
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
	v_resp                              json[];
begin
	select array(
		select json_build_object(
			'name', mpd.name
		) from sec_emp.v_pay_method mpd
	)
    into v_resp;
	return v_resp;
end;
$function$

```

#### sec_emp.ms_get_ranking_competition_rates
- **Type:** function
- **Arguments:** `origen integer`
- **Returns:** `TABLE(id bigint, name character varying, rate_factor double precision, date_last_modif timestamp with time zone, id_origin_currency bigint, id_destiny_currency bigint)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.ms_get_ranking_competition_rates(origen integer)
 RETURNS TABLE(id bigint, name character varying, rate_factor double precision, date_last_modif timestamp with time zone, id_origin_currency bigint, id_destiny_currency bigint)
 LANGUAGE plpgsql
AS $function$
begin
    return query
        select
            rcr.id, rcr.name, rcr.rate_factor, rcr.date_last_modif,
            rcr.id_origin_currency, rcr.id_destiny_currency
        from sec_emp.v_ranking_competitio...
```

#### sec_emp.sp_block_user
- **Type:** function
- **Arguments:** `p_username character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_block_user(p_username character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
						UPDATE sec_emp.ms_sixmap_users
						SET user_blocked = true,
							user_active = false
						WHERE username = p_username;
					END;
$function$

```

#### sec_emp.sp_competition_rate_insert
- **Type:** function
- **Arguments:** `_id_origin_country bigint, _id_origin_currency bigint, _id_destiny_country bigint, _id_destiny_currency bigint, _id_company_competition bigint, _rate_factor double precision, _updated_group bigint`
- **Returns:** `jsonb`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_competition_rate_insert(_id_origin_country bigint, _id_origin_currency bigint, _id_destiny_country bigint, _id_destiny_currency bigint, _id_company_competition bigint, _rate_factor double precision, _updated_group bigint)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
            resp_obj         JSONB;
            _err             TEXT;
            returning_id     BIGINT;
            _operation       VARCHAR;
        BEGIN
            SELECT CR.ope...
```

#### sec_emp.sp_competition_rate_update
- **Type:** function
- **Arguments:** `_id_competition_rate bigint, _rate_factor double precision, _keep_value boolean`
- **Returns:** `jsonb`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_competition_rate_update(_id_competition_rate bigint, _rate_factor double precision, _keep_value boolean)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
            resp_obj         JSONB;
            origin     BIGINT;
			origin_currency BIGINT;
            destiny     BIGINT;
			destiny_currency BIGINT;
            company     BIGINT;
            _prev_operation VARCHAR;
            _err             TEXT;
            _updated_group   BIGINT;
       ...
```

#### sec_emp.sp_competition_rates_get
- **Type:** function
- **Arguments:** `p_id_origin_currency integer`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_competition_rates_get(p_id_origin_currency integer)
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
    v_json_resp                             json[];
	v_json_resp_acum                             json[];
begin
    select array(
            select jsonb_build_object(
            'idDestinyCountry', vcr.id_destiny_country,
            'name', vcr.destiny_country,
			'nameCompany', vcr.name_company,
			'rateFactor', vcr.rate_factor,
			'operation', vc...
```

#### sec_emp.sp_competition_rates_get_all
- **Type:** function
- **Arguments:** `p_id_origin_currency integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_competition_rates_get_all(p_id_origin_currency integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_id_destiny_currencies                 int[];
    v_json_resp                             jsonb;
    v_id_destiny_currency                   int;
begin
	v_json_resp := '{}'::jsonb;
	v_json_resp := v_json_resp || jsonb_build_object(
            'destinations', sec_emp.sp_competition_rates_get(p_id_origin_currency)
		);
    return v_json_resp::jso...
```

#### sec_emp.sp_competition_rates_get_all_destinations
- **Type:** function
- **Arguments:** `p_id_origin_currency integer`
- **Returns:** `jsonb[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_competition_rates_get_all_destinations(p_id_origin_currency integer)
 RETURNS jsonb[]
 LANGUAGE plpgsql
AS $function$
declare
    v_id_destiny_currencies                 int[];
    v_json_resp                             jsonb[];
    v_id_destiny_currency                   int;
begin
    v_json_resp := '{}'::jsonb[];
    select array(
        select cur.id_currency
        from sec_cust.ms_currencies cur
        where cur.id_currency != p_id_origin_currency
...
```

#### sec_emp.sp_competition_rates_update
- **Type:** function
- **Arguments:** `competition_rates jsonb`
- **Returns:** `jsonb`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_competition_rates_update(competition_rates jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
        resp_obj                JSONB;
        inside_function_resp    JSONB;
        _err                    TEXT;
        competition_company     JSONB;
        origin_country          JSONB;
        updated_groups          JSONB;
		updated 				JSONB;
		first_element			JSONB;
        found                   BOOLEAN;
    BEGIN
		FOR first_element IN SELE...
```

#### sec_emp.sp_email_send_failed
- **Type:** function
- **Arguments:** `p_username character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_email_send_failed(p_username character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
						log_a INT;
						p_id_user int;
						last_attempt TIMESTAMPTZ;
						difference DOUBLE PRECISION;
						atcPhone VARCHAR;
						isBlocked BOOLEAN;
					BEGIN
						atcPhone := 'NA';

						SELECT U.id_user, U.user_blocked INTO p_id_user, isBlocked
						FROM sec_emp.ms_sixmap_users AS U
						WHERE U.username = p_username;

						SELECT U.last_email_a...
```

#### sec_emp.sp_generate_code
- **Type:** function
- **Arguments:** `_ident_user character varying, mode character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_generate_code(_ident_user character varying, mode character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
						generated_code INT;
						code_found VARCHAR;
					BEGIN
								generated_code := (SELECT sec_cust.random_between(100000,999999));

								SELECT T.code INTO code_found
								FROM sec_emp.MS_TEMP_CODES AS T
								WHERE T.ident_user = _ident_user;

								IF (code_found IS NOT NULL)
									THEN
										DELETE FROM sec_emp...
```

#### sec_emp.sp_get_code
- **Type:** function
- **Arguments:** `none`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_get_code()
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
						p_code integer;
						p_username varchar;
					BEGIN
						select t.code into p_code FROM sec_emp.MS_TEMP_CODES as t order by date_start desc limit 1;
						select t.ident_user into p_username FROM sec_emp.MS_TEMP_CODES as t order by date_start desc limit 1;
						RETURN json_build_object(
							'code', p_code,
							'username', p_username
						);
					END;
$function$

```

#### sec_emp.sp_get_competition_rates_by_origin
- **Type:** function
- **Arguments:** `_id_origin_country bigint`
- **Returns:** `TABLE("idCompanyCompetition" bigint, "nameCompany" character varying, "idOriginCountry" bigint, "idOriginCurrency" integer, destinations json)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_get_competition_rates_by_origin(_id_origin_country bigint)
 RETURNS TABLE("idCompanyCompetition" bigint, "nameCompany" character varying, "idOriginCountry" bigint, "idOriginCurrency" integer, destinations json)
 LANGUAGE plpgsql
AS $function$
BEGIN
	RETURN QUERY
	SELECT CC1.id_company_competition AS "idCompanyCompetition", CC1.name_company AS "nameCompany", CC1.id_country AS "idOriginCountry",
    CD1.id_currency AS "idOriginCurrency",
    (SELECT json_agg(D...
```

#### sec_emp.sp_get_competition_rates_historical
- **Type:** function
- **Arguments:** `_id_origin_country bigint, _id_destiny_country bigint`
- **Returns:** `jsonb`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_get_competition_rates_historical(_id_origin_country bigint, _id_destiny_country bigint)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
        competition_rates              JSONB;
	BEGIN

	    SELECT json_agg(RR.*) INTO competition_rates
                FROM
                    (
                        SELECT groups.updated_group, ( SELECT json_agg(DES.*)
                                                            FROM
                             ...
```

#### sec_emp.sp_get_country_phone_code
- **Type:** function
- **Arguments:** `p_name_country character varying`
- **Returns:** `character varying`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_get_country_phone_code(p_name_country character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
begin
    case
        when p_name_country = 'Venezuela' then
            return '58';
        when p_name_country = 'Colombia' then
            return '57';
        when p_name_country = 'USA' then
            return '1';
        when p_name_country = 'Argentina' then
            return '54';
        when p_name_country = 'Brazil' t...
```

#### sec_emp.sp_get_last_passwords
- **Type:** function
- **Arguments:** `_username character varying`
- **Returns:** `TABLE(password text)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_get_last_passwords(_username character varying)
 RETURNS TABLE(password text)
 LANGUAGE plpgsql
AS $function$
DECLARE
						current_full_user sec_emp.MS_SIXMAP_USERS%ROWTYPE;
					BEGIN
						SELECT * INTO current_full_user
						FROM sec_emp.MS_SIXMAP_USERS AS u
						WHERE u.username = _username;

						RETURN QUERY
						SELECT P.password
						FROM sec_emp.MS_SIXMAP_USERS AS P
						WHERE P.id_user = current_full_user.id_user;
					END;

$function$

```

#### sec_emp.sp_get_roles_by_profile
- **Type:** function
- **Arguments:** `p_uuid_profile uuid`
- **Returns:** `uuid[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_get_roles_by_profile(p_uuid_profile uuid)
 RETURNS uuid[]
 LANGUAGE plpgsql
AS $function$
declare
    v_profile_son_uuid              uuid;
    v_son_roles                     uuid[];
    v_roles                         uuid[];
begin
    select pr.uuid_profile_son into v_profile_son_uuid
    from sec_emp.ms_profiles pr
    where pr.uuid_profile = p_uuid_profile;
    if (v_profile_son_uuid is not null) then
        v_son_roles := sec_emp.sp_get_roles_by_profi...
```

#### sec_emp.sp_get_userstatus
- **Type:** function
- **Arguments:** `p_username character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_get_userstatus(p_username character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
						p_status BOOLEAN;
						p_attempt int;
					BEGIN
						select user_blocked, password_attempt into p_status, p_attempt from sec_emp.ms_sixmap_users
						where username = p_username;
						RETURN json_build_object(
									'user_blocked', p_status,
									'password_attempt', p_attempt
								);
					END;
$function$

```

#### sec_emp.sp_historical_competition_rates_get
- **Type:** function
- **Arguments:** `p_id_origin_currency integer, p_id_destiny_currency integer`
- **Returns:** `jsonb[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_historical_competition_rates_get(p_id_origin_currency integer, p_id_destiny_currency integer)
 RETURNS jsonb[]
 LANGUAGE plpgsql
AS $function$
declare
    v_json_resp                             jsonb[];
	v_json_resp_acum                             jsonb[];
	v_id_rates                              int[];
	v_id_rate                              int;
begin
	select array(
        select vcr.id_competition_rate
        from sec_emp.v_historical_competition_rate...
```

#### sec_emp.sp_historical_competition_rates_get_all
- **Type:** function
- **Arguments:** `p_id_origin_currency integer, p_id_destiny_currency integer`
- **Returns:** `jsonb[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_historical_competition_rates_get_all(p_id_origin_currency integer, p_id_destiny_currency integer)
 RETURNS jsonb[]
 LANGUAGE plpgsql
AS $function$
declare
    v_json_resp                             jsonb[];
begin
    v_json_resp := '{}'::jsonb;
        select array(
        select jsonb_build_object(
			'idCompetitionRate', vcr.id_competition_rate,
			'idCompetitionCompany', vcr.id_competition_company,
            'nameCompany', vcr.name_company,
			'idOrig...
```

#### sec_emp.sp_historical_competition_rates_get_all_destinations
- **Type:** function
- **Arguments:** `p_id_origin_currency integer, p_id_destiny_currency integer`
- **Returns:** `jsonb[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_historical_competition_rates_get_all_destinations(p_id_origin_currency integer, p_id_destiny_currency integer)
 RETURNS jsonb[]
 LANGUAGE plpgsql
AS $function$
declare
    v_id_destiny_currencies                 int[];
    v_json_resp                             jsonb[];
    v_id_destiny_currency                   int;
begin
    v_json_resp := '{}'::jsonb[];
	v_json_resp := sec_emp.sp_historical_competition_rates_get(p_id_origin_currency, p_id_destiny_curren...
```

#### sec_emp.sp_insert_banks_account
- **Type:** function
- **Arguments:** `p_id_bank character varying, p_id_pay_method character varying, p_id_currency character varying, p_account_holder_type character varying, p_account_holder_name character varying, p_account_type character varying, p_account_number character varying, p_account_holder_id_doc character varying`
- **Returns:** `boolean`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_insert_banks_account(p_id_bank character varying, p_id_pay_method character varying, p_id_currency character varying, p_account_holder_type character varying, p_account_holder_name character varying, p_account_type character varying, p_account_number character varying, p_account_holder_id_doc character varying)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
p_bank INT;
p_currency int;
p_pay_method int;

begin

select id_bank into p_bank from sec_cu...
```

#### sec_emp.sp_insert_companies_competition
- **Type:** function
- **Arguments:** `p_name_company character varying, p_type_url character varying, p_url_company character varying, p_id_country character varying[]`
- **Returns:** `boolean`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_insert_companies_competition(p_name_company character varying, p_type_url character varying, p_url_company character varying, p_id_country character varying[])
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
v_country character varying;
v_resp character varying;
v_origin bigint;
begin
	foreach v_country in array p_id_country
	loop
	v_resp := TRIM(both '""' from v_country);
	select id_currency into v_origin from sec_cust.ms_currencies where iso_cod =...
```

#### sec_emp.sp_insert_user_migrated
- **Type:** function
- **Arguments:** `p_user json`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_insert_user_migrated(p_user json)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    v_custom_migrated           boolean;
    v_exc_multi_cou_dest        boolean;
    v_exc_limit_send            boolean;
    v_exc_resid_country         boolean;
    v_exc_phone_country         boolean;
    v_id_exc_resid_country      int;
    v_id_exc_phone_country      int;
    v_id_country_default        int;
    v_id_doc_type               int;
    v_id_nationality_...
```

#### sec_emp.sp_insert_user_migrated_error_report
- **Type:** function
- **Arguments:** `p_user_number integer, p_user_cr_id character varying, p_error character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_insert_user_migrated_error_report(p_user_number integer, p_user_cr_id character varying, p_error character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
begin
    insert into sec_emp.ms_migration_error_reports (user_number, user_cr_id, report_text)
    values (p_user_number, p_user_cr_id, p_error);
end;
$function$

```

#### sec_emp.sp_lnk_opspwds_registred_by_user_insert
- **Type:** function
- **Arguments:** `_opspwd text, _uuid_user uuid`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_lnk_opspwds_registred_by_user_insert(_opspwd text, _uuid_user uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
			INSERT INTO sec_emp.LNK_OPSPWDS_REGISTRED_BY_USER(opspwd, uuid_user, active)
			VALUES (_opspwd, _uuid_user, true);
			END;
$function$

```

#### sec_emp.sp_lnk_profiles_roles_insert
- **Type:** function
- **Arguments:** `_uuid_role uuid, _uuid_profile uuid`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_lnk_profiles_roles_insert(_uuid_role uuid, _uuid_profile uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
			INSERT INTO sec_emp.LNK_PROFILES_ROLES(uuid_role, uuid_profile, active)
			VALUES (_uuid_role, _uuid_profile, true);
			END;
$function$

```

#### sec_emp.sp_lnk_pwds_registred_by_user_insert
- **Type:** function
- **Arguments:** `_pwd text, _uuid_user uuid`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_lnk_pwds_registred_by_user_insert(_pwd text, _uuid_user uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
			INSERT INTO sec_emp.LNK_PWDS_REGISTRED_BY_USER(pwd, uuid_user, active)
			VALUES (_pwd, _uuid_user, true);
			END;
$function$

```

#### sec_emp.sp_lnk_roles_routes_insert
- **Type:** function
- **Arguments:** `_uuid_role uuid, _uuid_route uuid`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_lnk_roles_routes_insert(_uuid_role uuid, _uuid_route uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
			INSERT INTO sec_emp.LNK_ROLES_ROUTES(uuid_role, uuid_route, active)
			VALUES (_uuid_role, _uuid_route, true);
			END;
$function$

```

#### sec_emp.sp_lnk_users_departments_insert
- **Type:** function
- **Arguments:** `_uuid_user uuid, _id_dpt integer`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_lnk_users_departments_insert(_uuid_user uuid, _id_dpt integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
			INSERT INTO sec_emp.LNK_USERS_DEPARTMENTS(uuid_user, id_dpt, active)
			VALUES (_uuid_user, _id_dpt, true);
			END;
$function$

```

#### sec_emp.sp_login_failed
- **Type:** function
- **Arguments:** `p_username character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_login_failed(p_username character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
						log_a INT;
						last_attempt TIMESTAMPTZ;
						difference DOUBLE PRECISION;
						atcPhone VARCHAR;
						isBlocked BOOLEAN;
					BEGIN
						atcPhone := 'NA';

						SELECT U.last_login_attempt, U.user_blocked INTO last_attempt, isBlocked
						FROM sec_emp.ms_sixmap_users AS U
						WHERE U.username = p_username;

						IF (last_attempt = null)
						TH...
```

#### sec_emp.sp_logs_actions_obj_insert
- **Type:** function
- **Arguments:** `_is_authenticated boolean, _success_req boolean, _failed_req boolean, _ip_orig character varying, _country_ip_orig character varying, _route character varying, _sid_session character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_logs_actions_obj_insert(_is_authenticated boolean, _success_req boolean, _failed_req boolean, _ip_orig character varying, _country_ip_orig character varying, _route character varying, _sid_session character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
			INSERT INTO sec_emp.LOGS_ACTIONS_OBJ(
					is_authenticated,
					success_req,
					failed_req,
					ip_orig,
					country_ip_orig,
					route,
					sid_session,
					active
				)
			VALUES (...
```

#### sec_emp.sp_ms_bank_account_get_all
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE("idBankAccount" bigint, name character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_ms_bank_account_get_all()
 RETURNS TABLE("idBankAccount" bigint, name character varying)
 LANGUAGE plpgsql
AS $function$
begin
				return query
					select
						ac.id_bank_account::bigint, concat(ac.account_holder_name, ' - ', b.name)::varchar
					from sec_cust.ms_bank_accounts ac
					inner join sec_cust.ms_banks b on ac.id_bank = b.id_bank
					where ac.active = true;
			end;
$function$

```

#### sec_emp.sp_ms_competitions_captures_insert
- **Type:** function
- **Arguments:** `_name_path character varying, _id_company_competition bigint`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_ms_competitions_captures_insert(_name_path character varying, _id_company_competition bigint)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    INSERT INTO
        sec_emp.MS_COMPETITIONS_CAPTURES(name_path,id_company_competition)
    VALUES
        (_name_path, _id_company_competition);
END;
$function$

```

#### sec_emp.sp_ms_countries_insert
- **Type:** function
- **Arguments:** `_name_country character varying, _viewing_name character varying, _sixmap_active boolean, _criptoremesa_active boolean, _bithonor_active boolean, _criptoefectivo_active boolean`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_ms_countries_insert(_name_country character varying, _viewing_name character varying, _sixmap_active boolean, _criptoremesa_active boolean, _bithonor_active boolean, _criptoefectivo_active boolean)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE id_ip_c INT;
			DECLARE iso_code VARCHAR;
			BEGIN
			SELECT id_ip_country INTO id_ip_c
			FROM sec_emp.MS_IP_COUNTRIES
			WHERE country_name = _name_country;
			IF id_ip_c IS NOT null THEN
			SELECT country_is...
```

#### sec_emp.sp_ms_departments_insert
- **Type:** function
- **Arguments:** `_name_dpt character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_ms_departments_insert(_name_dpt character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
				INSERT INTO
					sec_emp.MS_DEPARTMENTS(name_dpt, active)
				VALUES
					(_name_dpt, true);
			END;
$function$

```

#### sec_emp.sp_ms_doc_type_insert
- **Type:** function
- **Arguments:** `_name_doc_type character varying, _id_resid_country bigint`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_ms_doc_type_insert(_name_doc_type character varying, _id_resid_country bigint)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
			INSERT INTO sec_emp.MS_DOC_TYPE(name_doc_type, id_resid_country, active)
			VALUES (_name_doc_type, _id_resid_country, TRUE);
			END;
$function$

```

#### sec_emp.sp_ms_exchange_account_get_all
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE("idExchangeAccount" bigint, name character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_ms_exchange_account_get_all()
 RETURNS TABLE("idExchangeAccount" bigint, name character varying)
 LANGUAGE plpgsql
AS $function$
begin
				return query
					select
						exa.id_account::bigint, concat(exa.username, ' - ', ex.name)::varchar
					from prc_mng.ms_exchange_accounts exa
					inner join ord_sch.ms_exchanges ex on exa.id_exchange = ex.id_exchange
					where exa.active = true;
			end;
$function$

```

#### sec_emp.sp_ms_ip_countries_populate
- **Type:** function
- **Arguments:** `none`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_ms_ip_countries_populate()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
			INSERT INTO sec_emp.MS_IP_COUNTRIES(
					network,
					city_name,
					country_name,
					country_iso_code,
					time_zone
				)
			SELECT network,
				city_name,
				country_name,
				country_iso_code,
				time_zone
			FROM sec_emp.geoip_blocks
				INNER JOIN sec_emp.geoip_locations ON sec_emp.geoip_blocks.geoname_id = sec_emp.geoip_locations.geoname_id
			WHERE country_name ...
```

#### sec_emp.sp_ms_over_quota_insert
- **Type:** function
- **Arguments:** `_uuid_user uuid, _routes jsonb`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_ms_over_quota_insert(_uuid_user uuid, _routes jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
			INSERT INTO sec_emp.MS_OVER_QUOTA(routes, uuid_user, active)
			VALUES (_routes, _uuid_user, TRUE);
			END;
$function$

```

#### sec_emp.sp_ms_phone_insert
- **Type:** function
- **Arguments:** `_uuid_user uuid, _type character varying, _code character varying, _number character varying, _full_number character varying, _mobile boolean, _home boolean, _office boolean, _whatsapp boolean, _telegram boolean`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_ms_phone_insert(_uuid_user uuid, _type character varying, _code character varying, _number character varying, _full_number character varying, _mobile boolean, _home boolean, _office boolean, _whatsapp boolean, _telegram boolean)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
			INSERT INTO sec_emp.MS_PHONE(
					uuid_user,
					type,
					code,
					number,
					full_number,
					mobile,
					home,
					office,
					whatsapp,
					telegram,
					active
...
```

#### sec_emp.sp_ms_profiles_insert
- **Type:** function
- **Arguments:** `_name_profile character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_ms_profiles_insert(_name_profile character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
			INSERT INTO sec_emp.MS_PROFILES(name_profile, active)
			VALUES (_name_profile, true);
			END;
$function$

```

#### sec_emp.sp_ms_roles_insert
- **Type:** function
- **Arguments:** `_name_role character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_ms_roles_insert(_name_role character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
				INSERT INTO
					sec_emp.MS_ROLES(name_role, active)
				VALUES
					(_name_role, true);
			END;
$function$

```

#### sec_emp.sp_ms_routes_get_main_menu
- **Type:** function
- **Arguments:** `_uuid_user uuid`
- **Returns:** `TABLE(uuid_route uuid, name_route character varying, icon character varying, url text, component text)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_ms_routes_get_main_menu(_uuid_user uuid)
 RETURNS TABLE(uuid_route uuid, name_route character varying, icon character varying, url text, component text)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT ROU.uuid_route,
				ROU.name_route,
				ROU.icon,
				ROU.url,
				ROU.component
			FROM sec_emp.ms_routes AS ROU,
				sec_emp.lnk_roles_routes AS LROL_ROU,
				sec_emp.ms_roles AS ROL,
				sec_emp.lnk_profiles_roles AS LPRO_ROL,
				sec_emp.ms_pro...
```

#### sec_emp.sp_ms_routes_insert
- **Type:** function
- **Arguments:** `_name_route character varying, _icon character varying, _url text, _component text`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_ms_routes_insert(_name_route character varying, _icon character varying, _url text, _component text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
				INSERT INTO
					sec_emp.MS_ROUTES(name_route, icon, url, component, active)
				VALUES
					(_name_route, _icon, _url, _component, true);
			END;
$function$

```

#### sec_emp.sp_ms_sixmap_services_insert
- **Type:** function
- **Arguments:** `_name_service character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_ms_sixmap_services_insert(_name_service character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
			INSERT INTO sec_emp.MS_SIXMAP_SERVICES(tx_service, active)
			VALUES (_name_service, true);
			END;
$function$

```

#### sec_emp.sp_ms_sixmap_services_utype_insert
- **Type:** function
- **Arguments:** `_name_utype character varying, _id_service bigint`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_ms_sixmap_services_utype_insert(_name_utype character varying, _id_service bigint)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
			INSERT INTO sec_emp.MS_SIXMAP_SERVICES_UTYPE(name_utype, id_service, active)
			VALUES (_name_utype, _id_service, true);
			END;
$function$

```

#### sec_emp.sp_ms_sixmap_users_get_all
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE(id_uuid uuid, first_name character varying, second_name character varying, last_name character varying, second_last_name character varying, username character varying, email_user character varying, last_session_reg character varying, last_ip_reg character varying, last_ip_city_reg character varying, last_id_log_reg integer, date_last_conn character varying, gender character, date_birth character varying, ident_doc_number character varying, main_phone character varying, second_phone character varying, delegated_phone character varying, resid_city text, user_active boolean, user_blocked boolean, uuid_profile uuid, id_service integer, id_services_utype integer, id_ident_doc_type integer, id_resid_country integer, id_nationality_country integer, name_profile character varying, name_service character varying, name_services_utype character varying, name_ident_doc_type character varying, name_resid_country character varying, name_nationality_country character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_ms_sixmap_users_get_all()
 RETURNS TABLE(id_uuid uuid, first_name character varying, second_name character varying, last_name character varying, second_last_name character varying, username character varying, email_user character varying, last_session_reg character varying, last_ip_reg character varying, last_ip_city_reg character varying, last_id_log_reg integer, date_last_conn character varying, gender character, date_birth character varying, ident_doc_num...
```

#### sec_emp.sp_ms_sixmap_users_insert
- **Type:** function
- **Arguments:** `_first_name character varying, _second_name character varying, _last_name character varying, _second_last_name character varying, _username character varying, _email_user character varying, _password text, _gender character, _date_birth timestamp without time zone, _ident_doc_number character varying, _main_phone character varying, _main_phone_wha boolean, _second_phone character varying, _second_phone_wha boolean, _delegated_phone character varying, _delegated_phone_wha boolean, _resid_city text, _departments integer[], _uuid_profile character varying, _id_service integer, _id_services_utype integer, _id_ident_doc_type integer, _id_resid_country integer, _id_nationality_country integer, _main_phone_code character varying, _main_phone_full character varying, _second_phone_code character varying, _second_phone_full character varying, _delegated_phone_code character varying, _delegated_phone_full character varying, _fake_name character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_ms_sixmap_users_insert(_first_name character varying, _second_name character varying, _last_name character varying, _second_last_name character varying, _username character varying, _email_user character varying, _password text, _gender character, _date_birth timestamp without time zone, _ident_doc_number character varying, _main_phone character varying, _main_phone_wha boolean, _second_phone character varying, _second_phone_wha boolean, _delegated_phone cha...
```

#### sec_emp.sp_ms_sixmap_users_insert_signup
- **Type:** function
- **Arguments:** `_first_name character varying, _second_name character varying, _last_name character varying, _second_last_name character varying, _username character varying, _email_user character varying, _password text, _gender character, _date_birth timestamp without time zone, _ident_doc_number character varying, _main_phone character varying, _main_phone_wha boolean, _second_phone character varying, _second_phone_wha boolean, _delegated_phone character varying, _delegated_phone_wha boolean, _resid_city text, _departments integer[], _id_ident_doc_type bigint, _id_resid_country bigint, _id_nationality_country bigint, _main_phone_code character varying, _main_phone_full character varying, _second_phone_code character varying, _second_phone_full character varying, _delegated_phone_code character varying, _delegated_phone_full character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_ms_sixmap_users_insert_signup(_first_name character varying, _second_name character varying, _last_name character varying, _second_last_name character varying, _username character varying, _email_user character varying, _password text, _gender character, _date_birth timestamp without time zone, _ident_doc_number character varying, _main_phone character varying, _main_phone_wha boolean, _second_phone character varying, _second_phone_wha boolean, _delegated_ph...
```

#### sec_emp.sp_ms_sixmap_users_update
- **Type:** function
- **Arguments:** `cols character varying[], vals character varying[], _username character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_ms_sixmap_users_update(cols character varying[], vals character varying[], _username character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
    DECLARE i INT;
    _id_user_priv INT;
    full_user sec_emp.ms_sixmap_users %ROWTYPE;
    full_user_priv priv.ms_sixmap_users %ROWTYPE;
    BEGIN RAISE NOTICE 'AQUIFF';
    IF (array_length(cols, 1) <> array_length(vals, 1)) THEN RAISE NOTICE 'Los arreglos deben tener la misma cantidad de elementos';
    EL...
```

#### sec_emp.sp_ms_sixmap_users_verify_role
- **Type:** function
- **Arguments:** `p_uuid_user uuid, p_uri character varying`
- **Returns:** `boolean`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_ms_sixmap_users_verify_role(p_uuid_user uuid, p_uri character varying)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
begin
				if(
					exists(
						select
						from sec_emp.ms_sixmap_users u
						inner join sec_emp.ms_profiles p on p.uuid_profile = u.uuid_profile
						inner join sec_emp.lnk_profiles_roles lpr on lpr.uuid_profile = p.uuid_profile
						inner join sec_emp.ms_roles r on lpr.uuid_role = r.uuid_role
						inner join sec_emp.lnk_roles_rout...
```

#### sec_emp.sp_password_attempt
- **Type:** function
- **Arguments:** `p_username character varying`
- **Returns:** `integer`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_password_attempt(p_username character varying)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
						p_attempt INT;
					BEGIN
						Select password_attempt into p_attempt from sec_emp.ms_sixmap_users
						where username = p_username;
						return p_attempt;
					END;
$function$

```

#### sec_emp.sp_password_attempt_successful
- **Type:** function
- **Arguments:** `p_username character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_password_attempt_successful(p_username character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
						p_attempt INT;
					BEGIN
						update sec_emp.ms_sixmap_users
						set password_attempt = 0
						where username = p_username;
					END;
$function$

```

#### sec_emp.sp_password_failed
- **Type:** function
- **Arguments:** `p_username character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_password_failed(p_username character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
						log_a INT;
						last_attempt TIMESTAMPTZ;
						difference DOUBLE PRECISION;
						atcPhone VARCHAR;
						isBlocked BOOLEAN;
					BEGIN
						atcPhone := 'NA';

						SELECT U.last_password_attempt, U.user_blocked INTO last_attempt, isBlocked
						FROM sec_emp.ms_sixmap_users AS U
						WHERE U.username = p_username;

						IF (last_attempt = null)
		...
```

#### sec_emp.sp_ranking_competition_rates_get
- **Type:** function
- **Arguments:** `p_id_origin_currency integer, p_id_destiny_currency integer`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_ranking_competition_rates_get(p_id_origin_currency integer, p_id_destiny_currency integer)
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
    v_operation                             varchar;
    v_json_resp                             json[];
begin
    select rat.operation into v_operation
    from sec_cust.ms_cr_manual_rate rat
    where rat.id_origin_currency = p_id_origin_currency
    and rat.id_destiny_currency = p_id_destiny_currency
    and ra...
```

#### sec_emp.sp_ranking_competition_rates_get_all
- **Type:** function
- **Arguments:** `p_id_origin_currency integer, p_id_destiny_currency integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_ranking_competition_rates_get_all(p_id_origin_currency integer, p_id_destiny_currency integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
    v_id_destiny_currencies                 int[];
    v_json_resp                             jsonb;
    v_id_destiny_currency                   int;
begin
    v_json_resp := '{}'::jsonb;
    select array(
        select cur.id_currency
        from sec_cust.ms_currencies cur
        where cur.id_currency != p_...
```

#### sec_emp.sp_ranking_competition_rates_get_div_rates
- **Type:** function
- **Arguments:** `p_id_origin_currency integer, p_id_destiny_currency integer`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_ranking_competition_rates_get_div_rates(p_id_origin_currency integer, p_id_destiny_currency integer)
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
    v_best_rate_factor                      float;
    v_bithonor_in_top                       boolean;
    v_json_resp                             jsonb[];
begin
    select rat.rate_factor into v_best_rate_factor
    from sec_emp.v_ranking_competition_rates rat
    where rat.id_origin_currency = p_id_or...
```

#### sec_emp.sp_ranking_competition_rates_get_mul_rates
- **Type:** function
- **Arguments:** `p_id_origin_currency integer, p_id_destiny_currency integer`
- **Returns:** `json[]`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_ranking_competition_rates_get_mul_rates(p_id_origin_currency integer, p_id_destiny_currency integer)
 RETURNS json[]
 LANGUAGE plpgsql
AS $function$
declare
    v_best_rate_factor                      float;
    v_bithonor_in_top                       boolean;
    v_json_resp                             jsonb[];
begin
    select rat.rate_factor into v_best_rate_factor
    from sec_emp.v_ranking_competition_rates rat
    where rat.id_origin_currency = p_id_or...
```

#### sec_emp.sp_reset_password
- **Type:** function
- **Arguments:** `p_username character varying, p_password character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_reset_password(p_username character varying, p_password character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
						update sec_emp.ms_sixmap_users
						set password = p_password
						where username = p_username;
					END;
$function$

```

#### sec_emp.sp_reset_password_attempt
- **Type:** function
- **Arguments:** `p_username character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_reset_password_attempt(p_username character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
						p_id_user integer;
					BEGIN
						SELECT id_user INTO p_id_user from sec_emp.ms_sixmap_users
						where username = p_username;

						UPDATE sec_emp.ms_forgot_password_attempt
						SET email_attempt = 0
						WHERE id_user = p_id_user;
					END;
$function$

```

#### sec_emp.sp_session_obj_update
- **Type:** function
- **Arguments:** `cols character varying[], vals character varying[], _sid character varying, hasuuid boolean`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_session_obj_update(cols character varying[], vals character varying[], _sid character varying, hasuuid boolean)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN IF (array_length(cols, 1) <> array_length(vals, 1)) THEN RAISE NOTICE 'Los arreglos deben tener la misma cantidad de elementos';
			ELSEIF (array_length(cols, 1) = 1) THEN EXECUTE 'UPDATE sec_emp.session_obj SET ' || cols [1] || ' = $1 ' || 'WHERE SID = $2' USING vals [1],
			_sid;
			ELSEIF (arra...
```

#### sec_emp.sp_states_get_by_country_id
- **Type:** function
- **Arguments:** `_id_country integer`
- **Returns:** `TABLE(id_state_country bigint, state_name character varying, id_country integer)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_states_get_by_country_id(_id_country integer)
 RETURNS TABLE(id_state_country bigint, state_name character varying, id_country integer)
 LANGUAGE plpgsql
AS $function$
DECLARE
				BEGIN
					RETURN QUERY
					SELECT sc.id_state_country, sc.state_name,sc.id_country
					FROM sec_emp.ms_state_countries as sc
					WHERE sc.id_country = _id_country
					ORDER BY sc.state_name;
				END;
$function$

```

#### sec_emp.sp_update_banks_account
- **Type:** function
- **Arguments:** `p_id integer, p_id_bank character varying, p_id_pay_method character varying, p_id_currency character varying, p_account_holder_type character varying, p_account_holder_name character varying, p_account_type character varying, p_account_number character varying, p_account_holder_id_doc character varying`
- **Returns:** `boolean`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_update_banks_account(p_id integer, p_id_bank character varying, p_id_pay_method character varying, p_id_currency character varying, p_account_holder_type character varying, p_account_holder_name character varying, p_account_type character varying, p_account_number character varying, p_account_holder_id_doc character varying)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
p_bank INT;
p_currency int;
p_pay_method int;
BEGIN

select id_bank into p_ban...
```

#### sec_emp.sp_update_companies_competition
- **Type:** function
- **Arguments:** `p_id integer, p_name_company character varying, p_type_url character varying, p_url_company character varying, p_id_country character varying`
- **Returns:** `boolean`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_update_companies_competition(p_id integer, p_name_company character varying, p_type_url character varying, p_url_company character varying, p_id_country character varying)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
v_id_currency int;
BEGIN
	select mco.id_currency into v_id_currency from sec_emp.ms_countries mc, sec_cust.ms_currencies mco where mco.id_country = mc.id_country and mc.name_country = p_id_country;
	raise notice 'es: %', v_id_currenc...
```

#### sec_emp.sp_update_competition_rates
- **Type:** function
- **Arguments:** `p_rates jsonb[]`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_update_competition_rates(p_rates jsonb[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    v_rates                     jsonb;
    v_id_competition_rates      int;
    v_rate_factor               numeric;
    v_operation                 varchar(3);
    v_id_origin_country         bigint;
    v_id_destiny_country        bigint;
    v_id_currency_origin        bigint;
    v_id_currency_destiny       bigint;
    v_id_competition_company      bigint;

be...
```

#### sec_emp.sp_update_competition_rates_test
- **Type:** function
- **Arguments:** `p_rates jsonb[]`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_update_competition_rates_test(p_rates jsonb[])
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    v_rates                     jsonb;
    v_id_competition_rates      int;
    v_rate_factor               numeric;
    v_operation                 varchar(3);
    v_id_origin_country         bigint;
    v_id_destiny_country        bigint;
    v_id_currency_origin        bigint;
    v_id_currency_destiny       bigint;
    v_id_competition_company      bigint...
```

#### sec_emp.sp_update_status_banks_account
- **Type:** function
- **Arguments:** `p_id integer`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_update_status_banks_account(p_id integer)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
	p_active BOOLEAN;
	p_result BOOLEAN;
BEGIN
	select status into p_active
	from sec_cust.ms_bank_accounts
	where id_bank_account = p_id;

	IF (p_active = true) THEN
		UPDATE sec_cust.ms_bank_accounts
		SET status = false
		WHERE id_bank_account = p_id;
		select status into p_result from sec_cust.ms_bank_accounts where id_bank_account = p_id;
		RETURN json_build_obj...
```

#### sec_emp.sp_update_user_password
- **Type:** function
- **Arguments:** `_pwd text, _username character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_update_user_password(_pwd text, _username character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
						current_full_user sec_emp.MS_SIXMAP_USERS%ROWTYPE;
					BEGIN
						SELECT * INTO current_full_user
						FROM sec_emp.MS_SIXMAP_USERS AS u
						WHERE u.username = _username;

						IF (current_full_user.username IS NOT NULL)
							THEN
								UPDATE sec_emp.MS_SIXMAP_USERS
								SET password = _pwd
								WHERE username = _username;...
```

#### sec_emp.sp_verify_migration_excel_row
- **Type:** function
- **Arguments:** `p_user_number integer, p_user_cr_id character varying, p_bit_exc_multi_dest integer, p_bit_exc_limit_send integer, p_bit_exc_country_resd integer, p_bit_exc_country_ph integer, p_exc_country_resd character varying, p_exc_country_ph character varying, p_country_default character varying, p_resid_country character varying, p_phone_code character varying`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.sp_verify_migration_excel_row(p_user_number integer, p_user_cr_id character varying, p_bit_exc_multi_dest integer, p_bit_exc_limit_send integer, p_bit_exc_country_resd integer, p_bit_exc_country_ph integer, p_exc_country_resd character varying, p_exc_country_ph character varying, p_country_default character varying, p_resid_country character varying, p_phone_code character varying)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
    v_id_excep_country_res...
```

#### sec_emp.update_date_function
- **Type:** function
- **Arguments:** `none`
- **Returns:** `trigger`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.update_date_function()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
					NEW.date_last_modif = NOW();
					return NEW;
				END;
$function$

```

#### sec_emp.v_all_countries_get_active
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE(id_all_country bigint, spanish_name character varying, name_country character varying, country_iso_code character varying, is_latin boolean)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.v_all_countries_get_active()
 RETURNS TABLE(id_all_country bigint, spanish_name character varying, name_country character varying, country_iso_code character varying, is_latin boolean)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT C.id_all_country,
				C.spanish_name,
				C.country_name,
				C.country_iso_code,
				C.is_latin
			FROM sec_emp.ms_all_countries AS C
			WHERE C.active = true
			ORDER BY C.is_latin DESC,C.spanish_name;
			END;
$functi...
```

#### sec_emp.v_countries_get_criptoremesa_active
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE(id_country bigint, name_country character varying, viewing_name character varying, id_ip_country integer, country_iso_code character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.v_countries_get_criptoremesa_active()
 RETURNS TABLE(id_country bigint, name_country character varying, viewing_name character varying, id_ip_country integer, country_iso_code character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT C.id_country,
				C.name_country,
				C.viewing_name,
				C.id_ip_country,
				C.country_iso_code
			FROM sec_emp.ms_countries AS C
			WHERE C.criptoremesa_active = true
				AND C.country_active = true;
			END...
```

#### sec_emp.v_countries_get_id_by_name
- **Type:** function
- **Arguments:** `_name_country character varying`
- **Returns:** `TABLE(id_country bigint)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.v_countries_get_id_by_name(_name_country character varying)
 RETURNS TABLE(id_country bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT C.id_country
			FROM sec_emp.ms_countries AS C
			WHERE C.name_country = _name_country
			LIMIT 1;
			END;
$function$

```

#### sec_emp.v_countries_get_sixmap_active
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE(id_country bigint, name_country character varying, id_ip_country integer, country_iso_code character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.v_countries_get_sixmap_active()
 RETURNS TABLE(id_country bigint, name_country character varying, id_ip_country integer, country_iso_code character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT C.id_country,
				C.name_country,
				C.id_ip_country,
				C.country_iso_code
			FROM sec_emp.ms_countries AS C
			WHERE C.sixmap_active = true
				AND C.country_active = true;
			END;
$function$

```

#### sec_emp.v_departments_get_active
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE(id_dpt bigint, name_dpt text)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.v_departments_get_active()
 RETURNS TABLE(id_dpt bigint, name_dpt text)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT D.id_dpt,
				D.name_dpt
			FROM sec_emp.ms_departments AS D
			WHERE D.active = true;
			END;
$function$

```

#### sec_emp.v_ident_doc_type_get_active
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE(id_ident_doc_type bigint, name_doc_type character varying, id_resid_country integer)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.v_ident_doc_type_get_active()
 RETURNS TABLE(id_ident_doc_type bigint, name_doc_type character varying, id_resid_country integer)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT DT.id_ident_doc_type,
				DT.name_doc_type,
				DT.id_resid_country
			FROM sec_emp.ms_doc_type AS DT
			WHERE DT.active = true;
			END;
$function$

```

#### sec_emp.v_ip_countries_get_id_by_name
- **Type:** function
- **Arguments:** `_country_name character varying`
- **Returns:** `TABLE(id_ip_country bigint)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.v_ip_countries_get_id_by_name(_country_name character varying)
 RETURNS TABLE(id_ip_country bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN
				raise notice 'PAIIIIIIIISSSSSSSSS: %', _country_name;
				RETURN QUERY
				SELECT IPC.id_ip_country
				FROM sec_emp.ms_ip_countries AS IPC
				WHERE IPC.country_name = _country_name
				LIMIT 1;
			END;
$function$

```

#### sec_emp.v_ip_countries_get_names_active
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE(country_name character varying, country_iso_code character varying, is_latin boolean)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.v_ip_countries_get_names_active()
 RETURNS TABLE(country_name character varying, country_iso_code character varying, is_latin boolean)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT DISTINCT C.country_name,
				C.country_iso_code,
				C.is_latin
			FROM sec_emp.MS_ALL_COUNTRIES AS C
			ORDER BY C.is_latin DESC,
				C.country_name;
			END;
$function$

```

#### sec_emp.v_profiles_get_active
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE(uuid_profile uuid, name_profile character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.v_profiles_get_active()
 RETURNS TABLE(uuid_profile uuid, name_profile character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT P.uuid_profile,
				P.name_profile
			FROM sec_emp.ms_profiles AS P
			WHERE P.active = true;
			END;
$function$

```

#### sec_emp.v_services_get_active
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE(id_service bigint, tx_service character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.v_services_get_active()
 RETURNS TABLE(id_service bigint, tx_service character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT S.id_service,
				S.tx_service
			FROM sec_emp.ms_sixmap_services AS S
			WHERE S.active = true;
			END;
$function$

```

#### sec_emp.v_services_utype_get_active
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE(id_services_utype bigint, name_utype character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION sec_emp.v_services_utype_get_active()
 RETURNS TABLE(id_services_utype bigint, name_utype character varying)
 LANGUAGE plpgsql
AS $function$
BEGIN RETURN QUERY
			SELECT UT.id_services_utype,
				UT.name_utype
			FROM sec_emp.ms_sixmap_services_utype AS UT
			WHERE UT.active = true;
			END;
$function$

```

## 👁️ Business Views

### msg_app.v_chats_event_log
**Columns (9):**
- id_event (bigint)
- id_chat (bigint)
- id_msg (bigint)
- type (character varying)
- description (character varying)
- date_created (timestamp with time zone)
- uuid_sixmap_user (uuid)
- first_name (character varying)
- last_name (character varying)

```sql
 SELECT e.id_event,
    e.id_chat,
    e.id_msg,
    e.type,
    e.description,
    e.date_created,
    e.uuid_sixmap_user,
    p.first_name,
    p.last_name
   FROM ((msg_app.ms_chat_events e
     LEFT JOIN sec_emp.ms_sixmap_users u ON ((e.uuid_sixmap_user = u.uuid_user)))
     LEFT JOIN priv.ms_si...
```

### msg_app.v_chats_info
**Columns (35):**
- id_chat (bigint)
- customer_phone (character varying)
- id_connection (bigint)
- respond (boolean)
- consult (boolean)
- requests_in_progress (ARRAY)
- last_consult_create_date (timestamp with time zone)
- id_customer (bigint)
- customer_name (character varying)
- customer_last_name (character varying)
- customer_email (character varying)
- customer_public_cod (character varying)
- username_asing (character varying)
- name_asing (character varying)
- lastname_asing (character varying)
- verify_level (integer)
- country (character varying)
- id_country (bigint)
- country_code (character varying)
- last_consult_close_date (timestamp with time zone)
- ident_number (character varying)
- doc_type (character varying)
- level (character varying)
- last_remittance_open (bigint)
- last_remittance_close (bigint)
- mode (character varying)
- uniq_id (character varying)
- archived (boolean)
- requests_finished (ARRAY)
- id_risk_level (integer)
- id_loyalty_level (integer)
- migration_status (character varying)
- msg_no_resp (bigint)
- id_user_asing (bigint)
- uuid_user_asing (uuid)

```sql
 SELECT c.id_chat,
    c.peer_phone AS customer_phone,
    c.id_atc_phone AS id_connection,
    ((( SELECT count(*) AS count
           FROM (msg_app.ms_chats_whatsapp ch
             JOIN prc_mng.lnk_user_consult co ON ((ch.id_chat = co.id_chat)))
          WHERE ((co.consult_open = true) AND (ch.i...
```

### msg_app.v_msg
**Columns (16):**
- id (bigint)
- whatsapp_id_msg (character varying)
- action (character varying)
- id_chat (bigint)
- date_msg (timestamp with time zone)
- respond (boolean)
- username_resp (character varying)
- msg (json)
- atc_user_name (character varying)
- atc_user_last_name (character varying)
- atc_user_fake_name (character varying)
- event_type (character varying)
- description (character varying)
- profile (character varying)
- epoch_msg (bigint)
- attached_file (character varying)

```sql
 SELECT m.id_whatsapp_msg AS id,
    m.id_whatsapp AS whatsapp_id_msg,
    m.msg_action AS action,
    m.id_chat,
    m.date_whatsapp AS date_msg,
    m.atc_respond AS respond,
    u.username AS username_resp,
    j.json_body AS msg,
    p.first_name AS atc_user_name,
    p.last_name AS atc_user_las...
```

### msg_app.v_phones_with_country
**Columns (6):**
- id_phone (bigint)
- phone (character varying)
- account (character varying)
- id_country (bigint)
- country (character varying)
- credential (text)

```sql
 SELECT p.id_phone,
    p.atc_phone AS phone,
    p.atc_phone_acct AS account,
    c.id_country,
    c.name_country AS country,
    p.whatsapp_credentials AS credential
   FROM msg_app.ms_whatsapp_atc_phones p,
    sec_emp.ms_countries c
  WHERE ((p.id_country = c.id_country) AND (p.active = true));
```

### ord_sch.v_active_consults
**Columns (5):**
- id_consult (bigint)
- date (timestamp with time zone)
- id_exchange (integer)
- id_pair (integer)
- type_offer (character varying)

```sql
 SELECT c.id_consult,
    c.date,
    e.id_exchange,
    e.id_pair,
    c.type_offer
   FROM (ord_sch.ms_consults c
     JOIN ord_sch.ms_extract_data e ON ((c.id_consult = e.id_consult)))
  WHERE (c.current_active = true);
```

### ord_sch.v_active_offers
**Columns (14):**
- id_offer (uuid)
- type_offer (character varying)
- adv_no (character varying)
- price (double precision)
- max_trans_amount (double precision)
- min_trans_amount (double precision)
- id_exchange (integer)
- id_consult (bigint)
- id_pair (integer)
- date (timestamp with time zone)
- user_grade (integer)
- total_orders_count (character varying)
- orders_rate (double precision)
- username (character varying)

```sql
 SELECT o.id_offer,
    o.type_offer,
    o.adv_no,
    o.price,
    o.max_trans_amount,
    o.min_trans_amount,
    o.id_exchange,
    o.id_consult,
    o.id_pair,
    c.date,
    o.user_grade,
    o.total_orders_count,
    o.orders_rate,
    o.username
   FROM (ord_sch.lnk_currencies_pairs_offers ...
```

### ord_sch.v_active_orders
**Columns (7):**
- id_order (uuid)
- type_offer (character varying)
- price (double precision)
- id_exchange (integer)
- id_pair (integer)
- date (timestamp with time zone)
- id_consult (bigint)

```sql
 SELECT o.id_order,
    o.type_offer,
    o.price,
    o.id_exchange,
    o.id_pair,
    c.date,
    o.id_consult
   FROM (ord_sch.ms_exchange_orders o
     JOIN ord_sch.v_active_consults c ON ((c.id_consult = o.id_consult)));
```

### ord_sch.v_currencies_pairs
**Columns (11):**
- id_pair (integer)
- name (character varying)
- fiat_cod (character varying)
- crypto_cod (character varying)
- fiat_country_name (character varying)
- fiat_id_country (integer)
- active_binance (boolean)
- active_localbitcoins (boolean)
- active_buda (boolean)
- active_foxbit (boolean)
- active_kraken (boolean)

```sql
 SELECT p.id_pair,
    p.pair_name AS name,
    cf.iso_cod AS fiat_cod,
    cc.iso_cod AS crypto_cod,
    co.name_country AS fiat_country_name,
    cf.id_country AS fiat_id_country,
    p.active_binance,
    p.active_localbitcoins,
    p.active_buda,
    p.active_foxbit,
    p.active_kraken
   FROM ...
```

### ord_sch.v_exchanges
**Columns (2):**
- id_exchange (integer)
- name (character varying)

```sql
 SELECT e.id_exchange,
    e.name
   FROM ord_sch.ms_exchanges e
  WHERE (e.active = true);
```

### ord_sch.v_exchanges_fee_comparative
**Columns (9):**
- exchange (text)
- id_exchange (integer)
- pair_name (character varying)
- id_pair (integer)
- market_fee (double precision)
- limit_fee (double precision)
- spread_fee (double precision)
- fiat_iso_cod (character varying)
- id_fiat_currency (integer)

```sql
 SELECT ((ex.name)::text || '-P2P'::text) AS exchange,
    of.id_exchange,
    p.pair_name,
    of.id_pair,
    ord_sch.sp_get_market_fee_by_exchange(of.id_exchange, of.id_pair, true) AS market_fee,
    ord_sch.sp_get_limit_fee_by_exchange(of.id_exchange, of.id_pair, true) AS limit_fee,
    (ord_sch...
```

### prc_mng.v_bank_accounts_actual_balances
**Columns (5):**
- id_bank_account (bigint)
- name (character varying)
- amount (double precision)
- currency (character varying)
- actual_assign_amount (double precision)

```sql
 SELECT vba."idBankAccount" AS id_bank_account,
    vba.name,
    ( SELECT prc_mng.sp_ms_bank_accounts_get_movements_balance(vba."idBankAccount") AS sp_ms_bank_accounts_get_movements_balance) AS amount,
    cu.iso_cod AS currency,
    COALESCE(( SELECT sum(ben.partial_amount) AS sum
           FROM ...
```

### prc_mng.v_bank_accounts_movements
**Columns (7):**
- date_created (timestamp with time zone)
- concept (text)
- amount (double precision)
- id_bank_account (bigint)
- id_buy_cycle (bigint)
- id_sell_cycle (bigint)
- id_balance (bigint)

```sql
 SELECT bco.date_created,
    'OPERACION DE COMPRA'::text AS concept,
    (bco.fiat_amount_used * ('-1'::integer)::double precision) AS amount,
    bco.id_bank_account,
    bco.id_buy_cycle,
    NULL::bigint AS id_sell_cycle,
    cb.id_balance
   FROM ((prc_mng.lnk_buy_cycle_operations bco
     JOIN...
```

### prc_mng.v_bh_app_remittance_info
**Columns (10):**
- id_remittance (bigint)
- id_remittance_pub (character varying)
- client_name (text)
- origin_country (character varying)
- destiny_country (character varying)
- origin_amount (double precision)
- destiny_amount (double precision)
- date_created (timestamp with time zone)
- date_closed (timestamp with time zone)
- array (ARRAY)

```sql
 SELECT rem.id_remittance,
    rem.id_remittance_pub,
    concat(pr.first_name, ' ', pr.last_name) AS client_name,
    ocou.viewing_name AS origin_country,
    dcou.viewing_name AS destiny_country,
    rem.total_origin_amount AS origin_amount,
    rem.total_destiny_amount AS destiny_amount,
    rem....
```

### prc_mng.v_buy_cycle_currencies_detail
**Columns (12):**
- id_buy_cycle_currency (bigint)
- id_buy_cycle (bigint)
- name_cycle (character varying)
- id_currency (integer)
- name (character varying)
- iso_cod (character varying)
- total_amount_to_use (double precision)
- total_amount_to_use_verified (double precision)
- total_amount_used (double precision)
- total_buy_btc (double precision)
- total_buy_usdt (double precision)
- total_obtained_btc (double precision)

```sql
 SELECT lcc.id_buy_cycle_currency,
    mbc.id_buy_cycle,
    mbc.name_cycle,
    cu.id_currency,
    cu.name,
    cu.iso_cod,
    (prc_mng.sp_get_currency_amount_to_use(mbc.id_buy_cycle, (cu.id_currency)::bigint))::double precision AS total_amount_to_use,
    (prc_mng.sp_get_currency_amount_to_use_v...
```

### prc_mng.v_buy_cycle_operations_detail
**Columns (21):**
- id_buy_cycle (bigint)
- uuid_sixmap_user (uuid)
- username (character varying)
- type (text)
- id_origin_currency (bigint)
- iso_cod (character varying)
- currency_abrev (character varying)
- id_bank_account (bigint)
- account_number (character varying)
- account_holder_name (character varying)
- id_exchange (integer)
- name (character varying)
- fiat_amount_used (double precision)
- id_crypto_currency (bigint)
- crypto_amount_obtained (double precision)
- btc_amount_obtained (double precision)
- btc_rate_price (double precision)
- operation_cod (character varying)
- date_created (timestamp with time zone)
- id_exchange_account (bigint)
- exchange_account_name (character varying)

```sql
 SELECT bo.id_buy_cycle,
    bo.uuid_sixmap_user,
    msu.username,
    'COMPRA'::text AS type,
    bo.id_origin_currency,
    cu.iso_cod,
    cu.currency_abrev,
    bo.id_bank_account,
    ac.account_number,
    ac.account_holder_name,
    bo.id_exchange,
    ex.name,
    bo.fiat_amount_used,
    b...
```

### prc_mng.v_exchange_account_movements
**Columns (10):**
- date_created (timestamp with time zone)
- concept (text)
- amount (double precision)
- id_exchange_account (bigint)
- id_buy_cycle (bigint)
- id_sell_cycle (bigint)
- id_balance (bigint)
- currency (character varying)
- currency_abrev (character varying)
- id_currency (integer)

```sql
 SELECT bco.date_created,
    'OPERACION DE COMPRA'::text AS concept,
    (bco.fiat_amount_used * ('-1'::integer)::double precision) AS amount,
    bco.id_exchange_account,
    bco.id_buy_cycle,
    NULL::bigint AS id_sell_cycle,
    cb.id_balance,
    cu.iso_cod AS currency,
    cu.currency_abrev,
...
```

### prc_mng.v_exchanges_full_info
**Columns (74):**
- id_exchange (bigint)
- id_exchange_pub (character varying)
- id_origin_address (integer)
- id_destiny_address (integer)
- id_origin_currency (integer)
- id_destiny_currency (integer)
- origin_address_name (text)
- origin_decimals_quant (integer)
- iso_code_origin_address (character varying)
- iso_code_origin_currency (character varying)
- destiny_address_name (text)
- destiny_decimals_quant (integer)
- iso_code_destiny_address (character varying)
- iso_code_destiny_currency (character varying)
- date_created (bigint)
- date_last_modif (bigint)
- date_closed (bigint)
- exc_status_ppl (character varying)
- exc_atc_revision (character varying)
- exc_status_vf_bnk_org (character varying)
- exc_buy_cycle_status (character varying)
- exc_sell_cycle_status (character varying)
- exc_ok_award_status (character varying)
- exc_award_status (character varying)
- exc_ok_transf_status (character varying)
- exc_transf_status (character varying)
- exc_status_notif_cust (character varying)
- exc_status_pause (character varying)
- exc_in_claim (character varying)
- exc_status_pub (character varying)
- exc_modified_status (character varying)
- cust_cr_pub_id (character varying)
- deposit_amount (double precision)
- fee (double precision)
- total_origin_amount (double precision)
- total_destiny_amount (double precision)
- rate_factor (double precision)
- rate_type (character varying)
- cr_exc_rs_atc (character varying)
- cr_exc_rs_notif_client (character varying)
- cr_exc_rs_vrf_bco (character varying)
- cr_exc_rs_transf (character varying)
- cr_exc_rs_buy_cycle (character varying)
- cr_exc_rs_sell_cycle (character varying)
- dep_rs_atc (text)
- dep_rs_vrf_bnk (text)
- dep_rs_buy_cycle (character varying)
- dep_rs_sell_cycle (character varying)
- dep_rs_transf (text)
- dep_rs_notif (text)
- client_name (text)
- client_first_name (character varying)
- client_gender (character)
- id_pub_cod_client (character varying)
- type (character varying)
- id_exchange_rate (integer)
- ident_doc_number (character varying)
- email_client (character varying)
- phone_client (character varying)
- origin_bank (character varying)
- account_number (character varying)
- is_whatsapp (boolean)
- buy_cycle (character varying)
- sell_cycle (character varying)
- modif_version (integer)
- pay_method (character varying)
- exchange_type (text)
- network (json)
- user_account (json)
- user_wallet (json)
- captures (json)
- company_wallet (json)
- transf_to_client_conf_num (character varying)
- transf_to_client_cap (text)

```sql
 SELECT fex.id_exchange,
    fex.id_exchange_pub,
    opr.id_origin_address,
    opr.id_destiny_address,
    opr.id_origin_currency,
    opr.id_destiny_currency,
    ( SELECT ea.name
           FROM prc_mng.ms_exchange_address ea
          WHERE (ea.id_exchange_address = opr.id_origin_address)) AS o...
```

### prc_mng.v_full_exchange_rates
**Columns (9):**
- id_exchange_rate (bigint)
- id_operation_route (integer)
- id_rate_type (integer)
- rate_factor (double precision)
- profit_margin (double precision)
- active (boolean)
- date_creation (timestamp with time zone)
- date_last_modif (timestamp with time zone)
- used_cost_factor (double precision)

```sql
 SELECT er.id_exchange_rate,
    er.id_operation_route,
    er.id_rate_type,
    er.rate_factor,
    er.profit_margin,
    er.active,
    er.date_creation,
    er.date_last_modif,
        CASE
            WHEN ((opr.operation)::text = 'mul'::text) THEN (((100)::double precision * er.rate_factor) / (...
```

### prc_mng.v_lnk_cr_remittances_info
**Columns (35):**
- id_remittance (bigint)
- id_remittance_pub (character varying)
- id_rate (integer)
- id_origin_country (integer)
- id_destiny_country (integer)
- cr_rem_status_ppl (character varying)
- cr_rem_status_sec (character varying)
- cr_rem_status_detour (character varying)
- cr_rem_status_vf_bnk_org (boolean)
- cr_rem_ok_trans_dest (boolean)
- cr_rem_status_notif_cust (boolean)
- cr_rem_in_claim (boolean)
- date_created (timestamp with time zone)
- date_closed (timestamp with time zone)
- id_currency_origin (integer)
- origin_deposit_amount (double precision)
- origin_comission (double precision)
- total_origin_amount (double precision)
- id_currency_destiny (integer)
- total_destiny_amount (double precision)
- id_client (integer)
- username (character varying)
- first_name (character varying)
- last_name (character varying)
- name_profile (character varying)
- uuid_user_asing (uuid)
- id_origin_account (integer)
- account_number (character varying)
- country_origin (character varying)
- country_destiny (character varying)
- currency_origin_iso_code (character varying)
- currency_destiny_iso_code (character varying)
- beneficiaries (ARRAY)
- id_origin_bank (integer)
- origin_bank (character varying)

```sql
 SELECT re.id_remittance,
    re.id_remittance_pub,
    re.id_rate,
    ra.id_origin_country,
    ra.id_destiny_country,
    re.cr_rem_status_ppl,
    re.cr_rem_status_sec,
    re.cr_rem_status_detour,
    (( SELECT count(*) AS count
           FROM prc_mng.ms_cr_origin_transactions t
          WHER...
```

### prc_mng.v_ms_buy_cycle_detail
**Columns (8):**
- id_buy_cycle (bigint)
- name_cycle (character varying)
- date_created (timestamp with time zone)
- date_closed (timestamp with time zone)
- partial_operations (bigint)
- total_buy_btc_amount (double precision)
- total_buy_usdt_amount (double precision)
- total_btc_obtained (double precision)

```sql
 SELECT bc.id_buy_cycle,
    bc.name_cycle,
    bc.date_created,
    bc.date_closed,
    ( SELECT count(*) AS count
           FROM prc_mng.v_buy_cycle_operations_detail bco
          WHERE (bco.id_buy_cycle = bc.id_buy_cycle)) AS partial_operations,
    ( SELECT sum(bco.crypto_amount_obtained) AS s...
```

### prc_mng.v_ms_emp_sixmap_to_asing
**Columns (6):**
- id_emp (bigint)
- uuid_user (uuid)
- name_emp (character varying)
- lastname_emp (character varying)
- username (character varying)
- profile (character varying)

```sql
 SELECT u.id_user AS id_emp,
    u.uuid_user,
    p.first_name AS name_emp,
    p.last_name AS lastname_emp,
    u.username,
    pr.name_profile AS profile
   FROM ((sec_emp.ms_sixmap_users u
     JOIN priv.ms_sixmap_users p ON ((p.id_user_priv = u.id_user_priv)))
     JOIN sec_emp.ms_profiles pr ON...
```

### prc_mng.v_ms_log_action_com_info
**Columns (14):**
- id_log_action (integer)
- id_remittance_pub (character varying)
- log_action_date (timestamp with time zone)
- name_dpt (text)
- username (character varying)
- action (character varying)
- action_value (character varying)
- action_comment (character varying)
- active (boolean)
- id_remittance (bigint)
- id_exchange_pub (character varying)
- id_exchange (bigint)
- oper_type (text)
- alert (boolean)

```sql
 SELECT lcc.id_log_action,
    cr.id_remittance_pub,
    lcc.log_action_date,
    dep.name_dpt,
    ( SELECT u.username
           FROM sec_emp.ms_sixmap_users u
          WHERE (u.uuid_user = lcc.id_uuid_user)) AS username,
    rla.name AS action,
    lcc.action_value,
    lcc.action_comment,
    l...
```

### prc_mng.v_ms_sell_cycle_detail
**Columns (8):**
- id_sell_cycle (bigint)
- name_cycle (character varying)
- date_created (timestamp with time zone)
- date_closed (timestamp with time zone)
- partial_operations (bigint)
- total_sell_btc_amount (double precision)
- total_sell_usdt_amount (double precision)
- total_btc_used (double precision)

```sql
 SELECT sc.id_sell_cycle,
    sc.name_cycle,
    sc.date_created,
    sc.date_closed,
    ( SELECT count(*) AS count
           FROM prc_mng.v_sell_cycle_operations_detail sco
          WHERE (sco.id_sell_cycle = sc.id_sell_cycle)) AS partial_operations,
    ( SELECT sum(sco.crypto_amount_used) AS s...
```

### prc_mng.v_ms_sixmap_users_current_asings_by_user
**Columns (8):**
- id_emp (bigint)
- uuid_user (uuid)
- name_emp (character varying)
- lastname_emp (character varying)
- username (character varying)
- profile (character varying)
- total_asings (bigint)
- last_asing_date (timestamp with time zone)

```sql
 SELECT u.id_emp,
    u.uuid_user,
    u.name_emp,
    u.lastname_emp,
    u.username,
    u.profile,
    count(
        CASE a.current_active
            WHEN true THEN 1
            ELSE NULL::integer
        END) AS total_asings,
    max(a.create_date) AS last_asing_date
   FROM (prc_mng.v_ms_emp...
```

### prc_mng.v_queue_balances
**Columns (3):**
- id_bank (integer)
- quantity (bigint)
- amount (numeric)

```sql
 SELECT ban.id_bank,
    count(*) AS quantity,
    COALESCE((sum(ben.partial_amount))::numeric(10,2), (0)::numeric) AS amount
   FROM (sec_cust.ms_banks ban
     LEFT JOIN prc_mng.ms_cr_beneficiaries ben ON ((ban.id_bank = ben.id_transfer_bank)))
  WHERE ((ban.active = true) AND (EXISTS ( SELECT acc...
```

### prc_mng.v_remittances_status_info
**Columns (64):**
- id_remittance (bigint)
- id_remittance_pub (character varying)
- id_origin_country (integer)
- id_origin_currency (integer)
- id_destiny_country (integer)
- id_destiny_currency (integer)
- date_created (bigint)
- date_closed (bigint)
- cr_rem_status_ppl (character varying)
- cr_rem_atc_revision (character varying)
- cr_rem_status_vf_bnk_org (character varying)
- cr_rem_to_tranf_status (boolean)
- cr_rem_ok_trans_dest (boolean)
- cr_rem_status_notif_cust (boolean)
- cr_rem_status_notif_benef (character varying)
- cr_rem_status_detour (character varying)
- cr_rem_in_claim (character varying)
- cr_rem_status_pub (character varying)
- cust_cr_pub_id (character varying)
- deposit_amount (double precision)
- comission (double precision)
- cr_rem_total_origin_amount (double precision)
- rate_factor (double precision)
- cr_rem_total_dest_amount (double precision)
- cust_name (text)
- id_pub_cod_client (character varying)
- type (character varying)
- id_manual_rate (integer)
- rate_type (character varying)
- ident_doc_number (character varying)
- email_client (character varying)
- phone_client (character varying)
- origin_bank (character varying)
- account_number (character varying)
- date_last_modif (bigint)
- is_whatsapp (boolean)
- rate_operation (character)
- uuid_user_cust (uuid)
- pay_method (character varying)
- id_bank_account (integer)
- id_resid_country (bigint)
- resid_country (character varying)
- phone_exception (boolean)
- country_exception (boolean)
- limit_exception (boolean)
- multi_currency_exception (boolean)
- verif_level (integer)
- id_nationality_country (integer)
- urgent (boolean)
- priority (boolean)
- client_status (text)
- cr_rem_total_benef (integer)
- phone_changed (boolean)
- origin_country (character varying)
- destiny_country (character varying)
- origin_currency (character varying)
- destiny_currency (character varying)
- cr_id_rem_status_ppl (integer)
- cr_id_rem_atc_revision (integer)
- cr_id_rem_status_vf_bnk_org (integer)
- cr_id_rem_status_notif_benef (integer)
- cr_id_rem_status_detour (integer)
- cr_id_rem_in_claim (integer)
- cr_id_rem_status_pub (integer)

```sql
 SELECT rem.id_remittance,
    rem.id_remittance_pub,
    mra.id_origin_country,
    mra.id_origin_currency,
    mra.id_destiny_country,
    mra.id_destiny_currency,
    (date_part('epoch'::text, rem.date_created))::bigint AS date_created,
    (date_part('epoch'::text, rem.date_closed))::bigint AS d...
```

### prc_mng.v_remittances_status_info_test
**Columns (64):**
- id_remittance (bigint)
- id_remittance_pub (character varying)
- id_origin_country (integer)
- id_origin_currency (integer)
- id_destiny_country (integer)
- id_destiny_currency (integer)
- date_created (bigint)
- date_closed (bigint)
- cr_rem_status_ppl (character varying)
- cr_rem_atc_revision (character varying)
- cr_rem_status_vf_bnk_org (character varying)
- cr_rem_to_tranf_status (boolean)
- cr_rem_ok_trans_dest (boolean)
- cr_rem_status_notif_cust (boolean)
- cr_rem_status_notif_benef (character varying)
- cr_rem_status_detour (character varying)
- cr_rem_in_claim (character varying)
- cr_rem_status_pub (character varying)
- cust_cr_pub_id (character varying)
- deposit_amount (double precision)
- comission (double precision)
- cr_rem_total_origin_amount (double precision)
- rate_factor (double precision)
- cr_rem_total_dest_amount (double precision)
- cust_name (text)
- id_pub_cod_client (character varying)
- type (character varying)
- id_manual_rate (integer)
- rate_type (character varying)
- ident_doc_number (character varying)
- email_client (character varying)
- phone_client (character varying)
- origin_bank (character varying)
- account_number (character varying)
- date_last_modif (bigint)
- is_whatsapp (boolean)
- rate_operation (character)
- uuid_user_cust (uuid)
- pay_method (character varying)
- id_bank_account (integer)
- id_resid_country (bigint)
- resid_country (character varying)
- phone_exception (boolean)
- country_exception (boolean)
- limit_exception (boolean)
- multi_currency_exception (boolean)
- verif_level (integer)
- id_nationality_country (integer)
- urgent (boolean)
- priority (boolean)
- client_status (text)
- cr_rem_total_benef (integer)
- phone_changed (boolean)
- origin_country (character varying)
- destiny_country (character varying)
- origin_currency (character varying)
- destiny_currency (character varying)
- cr_id_rem_status_ppl (integer)
- cr_id_rem_atc_revision (integer)
- cr_id_rem_status_vf_bnk_org (integer)
- cr_id_rem_status_notif_benef (integer)
- cr_id_rem_status_detour (integer)
- cr_id_rem_in_claim (integer)
- cr_id_rem_status_pub (integer)

```sql
 SELECT rem.id_remittance,
    rem.id_remittance_pub,
    mra.id_origin_country,
    mra.id_origin_currency,
    mra.id_destiny_country,
    mra.id_destiny_currency,
    (date_part('epoch'::text, rem.date_created))::bigint AS date_created,
    (date_part('epoch'::text, rem.date_closed))::bigint AS d...
```

### prc_mng.v_sell_cycle_currencies_detail
**Columns (12):**
- id_sell_cycle_currency (bigint)
- id_sell_cycle (bigint)
- name_cycle (character varying)
- id_currency (integer)
- name (character varying)
- iso_cod (character varying)
- total_amount_to_obtain (double precision)
- total_amount_to_obtain_verified (double precision)
- total_amount_obtained (double precision)
- total_sell_btc (double precision)
- total_sell_usdt (double precision)
- total_used_btc (double precision)

```sql
 SELECT lsc.id_sell_cycle_currency,
    lsc.id_sell_cycle,
    msc.name_cycle,
    cu.id_currency,
    cu.name,
    cu.iso_cod,
    (prc_mng.sp_get_currency_amount_to_obtain(lsc.id_sell_cycle, (cu.id_currency)::bigint))::double precision AS total_amount_to_obtain,
    (prc_mng.sp_get_currency_amount...
```

### prc_mng.v_sell_cycle_operations_detail
**Columns (21):**
- id_sell_cycle (bigint)
- uuid_sixmap_user (uuid)
- username (character varying)
- type (text)
- id_destiny_currency (bigint)
- iso_cod (character varying)
- currency_abrev (character varying)
- id_bank_account (bigint)
- account_number (character varying)
- account_holder_name (character varying)
- id_exchange (integer)
- name (character varying)
- fiat_amount_obtained (double precision)
- id_crypto_currency (bigint)
- crypto_amount_used (double precision)
- btc_amount_used (double precision)
- btc_rate_price (double precision)
- operation_cod (character varying)
- date_created (timestamp with time zone)
- id_exchange_account (bigint)
- exchange_account_name (character varying)

```sql
 SELECT so.id_sell_cycle,
    so.uuid_sixmap_user,
    msu.username,
    'VENTA'::text AS type,
    so.id_destiny_currency,
    cu.iso_cod,
    cu.currency_abrev,
    so.id_bank_account,
    ac.account_number,
    ac.account_holder_name,
    so.id_exchange,
    ex.name,
    so.fiat_amount_obtained,
...
```

### prc_mng.v_transfers_to_do
**Columns (16):**
- id_remittance (bigint)
- date_created (bigint)
- verif_bank_date (bigint)
- to_tranf_date (bigint)
- id_beneficiary (bigint)
- name (character varying)
- doc_type (character varying)
- ident_number (character varying)
- pay_type (character varying)
- bank_code (character varying)
- country (character varying)
- currency (character varying)
- amount (double precision)
- account (character varying)
- account_type (character varying)
- phone_number (character varying)

```sql
 SELECT rem.id_remittance,
    (date_part('epoch'::text, rem.date_created))::bigint AS date_created,
    (date_part('epoch'::text, tr.modification_date))::bigint AS verif_bank_date,
    (date_part('epoch'::text, tr.modification_date))::bigint AS to_tranf_date,
    ben.id_beneficiary,
    ben.owner_n...
```

### prc_mng.v_transfers_to_do_massive_data
**Columns (16):**
- id_remittance (bigint)
- date_created (bigint)
- verif_bank_date (bigint)
- to_tranf_date (bigint)
- id_beneficiary (bigint)
- name (character varying)
- doc_type (character varying)
- ident_number (character varying)
- pay_type (character varying)
- bank_code (character varying)
- country (character varying)
- currency (character varying)
- amount (double precision)
- account (character varying)
- account_type (character varying)
- phone_number (character varying)

```sql
 SELECT rem.id_remittance,
    (date_part('epoch'::text, rem.date_created))::bigint AS date_created,
    (date_part('epoch'::text, tr.modification_date))::bigint AS verif_bank_date,
    (date_part('epoch'::text, tr.modification_date))::bigint AS to_tranf_date,
    ben.id_beneficiary,
    ben.owner_n...
```

### public.v_remittances_status_info
**Columns (54):**
- id_remittance (bigint)
- id_remittance_pub (character varying)
- id_origin_country (integer)
- id_origin_currency (integer)
- id_destiny_country (integer)
- id_destiny_currency (integer)
- date_created (bigint)
- date_closed (bigint)
- cr_rem_status_ppl (character varying)
- cr_rem_atc_revision (character varying)
- cr_rem_status_vf_bnk_org (character varying)
- cr_rem_to_tranf_status (boolean)
- cr_rem_ok_trans_dest (boolean)
- cr_rem_status_notif_cust (boolean)
- cr_rem_status_notif_benef (character varying)
- cr_rem_status_detour (character varying)
- cr_rem_in_claim (character varying)
- cr_rem_status_pub (character varying)
- cust_cr_pub_id (character varying)
- deposit_amount (double precision)
- comission (double precision)
- cr_rem_total_origin_amount (double precision)
- rate_factor (double precision)
- cr_rem_total_dest_amount (double precision)
- cust_name (text)
- id_pub_cod_client (character varying)
- type (character varying)
- id_manual_rate (integer)
- rate_type (character varying)
- ident_doc_number (character varying)
- email_client (character varying)
- phone_client (character varying)
- origin_bank (character varying)
- account_number (character varying)
- date_last_modif (bigint)
- is_whatsapp (boolean)
- rate_operation (character)
- uuid_user_cust (uuid)
- pay_method (character varying)
- id_bank_account (integer)
- id_resid_country (bigint)
- resid_country (character varying)
- phone_exception (boolean)
- country_exception (boolean)
- limit_exception (boolean)
- multi_currency_exception (boolean)
- verif_level (integer)
- id_nationality_country (integer)
- sixmap_user (character varying)
- urgent (boolean)
- priority (boolean)
- client_status (character varying)
- cr_rem_total_benef (bigint)
- phone_changed (boolean)

```sql
 SELECT rem.id_remittance,
    rem.id_remittance_pub,
    mra.id_origin_country,
    mra.id_origin_currency,
    mra.id_destiny_country,
    mra.id_destiny_currency,
    (date_part('epoch'::text, rem.date_created))::bigint AS date_created,
    (date_part('epoch'::text, rem.date_closed))::bigint AS d...
```

### sec_cust.pg_stat_statements
**Columns (32):**
- userid (oid)
- dbid (oid)
- queryid (bigint)
- query (text)
- plans (bigint)
- total_plan_time (double precision)
- min_plan_time (double precision)
- max_plan_time (double precision)
- mean_plan_time (double precision)
- stddev_plan_time (double precision)
- calls (bigint)
- total_exec_time (double precision)
- min_exec_time (double precision)
- max_exec_time (double precision)
- mean_exec_time (double precision)
- stddev_exec_time (double precision)
- rows (bigint)
- shared_blks_hit (bigint)
- shared_blks_read (bigint)
- shared_blks_dirtied (bigint)
- shared_blks_written (bigint)
- local_blks_hit (bigint)
- local_blks_read (bigint)
- local_blks_dirtied (bigint)
- local_blks_written (bigint)
- temp_blks_read (bigint)
- temp_blks_written (bigint)
- blk_read_time (double precision)
- blk_write_time (double precision)
- wal_records (bigint)
- wal_fpi (bigint)
- wal_bytes (numeric)

```sql
 SELECT pg_stat_statements.userid,
    pg_stat_statements.dbid,
    pg_stat_statements.queryid,
    pg_stat_statements.query,
    pg_stat_statements.plans,
    pg_stat_statements.total_plan_time,
    pg_stat_statements.min_plan_time,
    pg_stat_statements.max_plan_time,
    pg_stat_statements.mean_...
```

### sec_cust.v_bh_users_info
**Columns (36):**
- verif_level (text)
- signup_date (timestamp with time zone)
- level_1_aprov_date (timestamp with time zone)
- level_2_aprov_date (timestamp with time zone)
- last_ip_country (character varying)
- client_type (character varying)
- original_pub_id (character varying)
- sixmap_pub_id (character varying)
- signup_country (character varying)
- resid_country (character varying)
- names (text)
- last_names (text)
- date_birth (timestamp with time zone)
- sex (character)
- nationality_country (character varying)
- email_user (character varying)
- phone_number (character varying)
- doc_type (character varying)
- doc_country (character varying)
- doc_number (character varying)
- state (text)
- resid_city (text)
- address (text)
- referral_id (text)
- main_sn_platf (text)
- user_main_sn_platf (text)
- funds_source (character varying)
- monthly_income (character varying)
- job_title (character varying)
- work_industry (character varying)
- total_referreds (integer)
- active_referreds (integer)
- first_remittance_date (timestamp with time zone)
- last_remittance_date (timestamp with time zone)
- total_app_remittances (bigint)
- total_chat_remittances (bigint)

```sql
 SELECT
        CASE
            WHEN (us.id_verif_level = 0) THEN 'Básico'::text
            WHEN ((us.id_verif_level = 1) AND (us.verif_level_apb = false)) THEN 'Básico'::text
            WHEN ((us.id_verif_level = 1) AND (us.verif_level_apb = true)) THEN 'Intermedio'::text
            WHEN ((us.i...
```

### sec_cust.v_users_to_zoho_campaign
**Columns (9):**
- nombre (text)
- apellido (text)
- email (character varying)
- cr_id (character varying)
- telefono (character varying)
- resid_country (character varying)
- nacionalidad (character varying)
- sexo (character)
- estado (character varying)

```sql
 SELECT
        CASE
            WHEN ((pr.second_name IS NULL) OR ((pr.second_name)::text = ''::text)) THEN (pr.first_name)::text
            ELSE concat(pr.first_name, ' ', pr.second_name)
        END AS nombre,
        CASE
            WHEN ((pr.second_last_name IS NULL) OR ((pr.second_last_name)...
```

### sec_cust.v_users_to_zoho_campaign_eu
**Columns (9):**
- nombre (text)
- apellido (text)
- email (character varying)
- cr_id (character varying)
- telefono (character varying)
- resid_country (character varying)
- nacionalidad (character varying)
- sexo (character)
- estado (character varying)

```sql
 SELECT
        CASE
            WHEN ((pr.second_name IS NULL) OR ((pr.second_name)::text = ''::text)) THEN (pr.first_name)::text
            ELSE concat(pr.first_name, ' ', pr.second_name)
        END AS nombre,
        CASE
            WHEN ((pr.second_last_name IS NULL) OR ((pr.second_last_name)...
```

### sec_cust.v_verification_level
**Columns (15):**
- id_users_verif_level (bigint)
- cust_cr_cod_pub (character varying)
- name_country (character varying)
- id_vl (integer)
- level_apb_ok (boolean)
- doc (character varying)
- comment (character varying)
- name (character varying)
- lastname (character varying)
- fecha (bigint)
- name_utype (character varying)
- last_ip_city_reg (character varying)
- email_user (character varying)
- id_migrated (bigint)
- silt_id (character varying)

```sql
 SELECT l.id_users_verif_level,
    u.cust_cr_cod_pub,
    c.name_country,
    l.id_vl,
    l.level_apb_ok,
    l.doc,
    l.comment,
    ((((su.first_name)::text || ' '::text) || (su.second_name)::text))::character varying AS name,
    ((((su.last_name)::text || ' '::text) || (su.second_last_name):...
```

### sec_emp.v_account_type
**Columns (1):**
- account_type (character varying)

```sql
 SELECT DISTINCT mba.account_type
   FROM sec_cust.ms_bank_accounts mba;
```

### sec_emp.v_banks_accounts
**Columns (13):**
- id_bank_account (integer)
- account_holder_type (character varying)
- account_holder_name (character varying)
- account_type (character varying)
- account_number (character varying)
- account_holder_id_doc (character varying)
- status (boolean)
- bank_name (character varying)
- currency_name (character varying)
- iso_cod (character varying)
- type (character varying)
- pay_method_type (character varying)
- viewing_name (character varying)

```sql
 SELECT mba.id_bank_account,
    mba.account_holder_type,
    mba.account_holder_name,
    mba.account_type,
    mba.account_number,
    mba.account_holder_id_doc,
    mba.status,
    mb.name AS bank_name,
    mc.name AS currency_name,
    mc.iso_cod,
    mc.type,
    mpd.name AS pay_method_type,
  ...
```

### sec_emp.v_competition_company
**Columns (11):**
- id_company_competition (bigint)
- name_company (character varying)
- type_url (character varying)
- url_company (character varying)
- active (boolean)
- date_creation (bigint)
- date_modified (bigint)
- id_country (bigint)
- name_country (character varying)
- viewing_name (character varying)
- iso_cod (character varying)

```sql
 SELECT mcc.id_company_competition,
    mcc.name_company,
    mcc.type_url,
    mcc.url_company,
    mcc.active,
    (date_part('epoch'::text, mcc.date_creation))::bigint AS date_creation,
    (date_part('epoch'::text, mcc.date_last_modif))::bigint AS date_modified,
    mcc.id_country,
    mc.name_c...
```

### sec_emp.v_competition_rates
**Columns (14):**
- id_competition_rate (bigint)
- rate_factor (double precision)
- operation (character varying)
- id_competition_company (bigint)
- id_origin_country (bigint)
- id_destiny_country (bigint)
- id_currency_origin (bigint)
- id_currency_destiny (bigint)
- date_last_modif (timestamp with time zone)
- name_company (character varying)
- origin_currency (character varying)
- origin_country (character varying)
- destiny_currency (character varying)
- destiny_country (character varying)

```sql
 SELECT mcr.id_competition_rate,
    mcr.rate_factor,
    mcr.operation,
    mcr.id_competition_company,
    mcr.id_origin_country,
    mcr.id_destiny_country,
    mcr.id_currency_origin,
    mcr.id_currency_destiny,
    mcr.date_last_modif,
    mcc.name_company,
    mc.iso_cod AS origin_currency,
 ...
```

### sec_emp.v_historical_competition_rates
**Columns (15):**
- id_competition_rate (bigint)
- rate_factor (double precision)
- operation (character varying)
- id_competition_company (bigint)
- id_origin_country (bigint)
- id_destiny_country (bigint)
- id_currency_origin (bigint)
- id_currency_destiny (bigint)
- date_creation (bigint)
- date_modified (bigint)
- name_company (character varying)
- origin_currency (character varying)
- origin_country (character varying)
- destiny_currency (character varying)
- destiny_country (character varying)

```sql
 SELECT ra.id_manual_rate AS id_competition_rate,
    (ra.rate_factor)::numeric AS rate_factor,
    (ra.operation)::character varying(3) AS operation,
    (0)::bigint AS id_competition_company,
    ra.id_origin_country,
    ra.id_destiny_country,
    ra.id_origin_currency AS id_currency_origin,
    ...
```

### sec_emp.v_pay_method
**Columns (1):**
- name (character varying)

```sql
 SELECT DISTINCT mpd.name
   FROM sec_cust.ms_pay_methods mpd;
```

### sec_emp.v_ranking_competition_rates
**Columns (10):**
- id (bigint)
- name (character varying)
- rate_factor (double precision)
- date_last_modif (timestamp with time zone)
- id_origin_currency (bigint)
- id_destiny_currency (bigint)
- active (boolean)
- id_country (bigint)
- competition_rate (boolean)
- operation (character varying)

```sql
 SELECT ra.id_manual_rate AS id,
    'Bithonor'::character varying AS name,
    ra.rate_factor,
    ra.date_last_modif,
    ra.id_origin_currency,
    ra.id_destiny_currency,
    ra.active,
    0 AS id_country,
    false AS competition_rate,
    (ra.operation)::character varying AS operation
   FROM...
```

### sec_emp.v_verification_level
**Columns (14):**
- id_users_verif_level (bigint)
- cust_cr_cod_pub (character varying)
- name_country (character varying)
- id_vl (integer)
- level_apb_ok (boolean)
- doc (character varying)
- comment (character varying)
- name (character varying)
- lastname (character varying)
- fecha (bigint)
- name_utype (character varying)
- last_ip_city_reg (character varying)
- email_user (character varying)
- id_migrated (bigint)

```sql
 SELECT l.id_users_verif_level,
    u.cust_cr_cod_pub,
    c.name_country,
    l.id_vl,
    l.level_apb_ok,
    l.doc,
    l.comment,
    ((((su.first_name)::text || ' '::text) || (su.second_name)::text))::character varying AS name,
    ((((su.last_name)::text || ' '::text) || (su.second_last_name):...
```

## ⚡ Business Rule Triggers

### msg_app.lnk_atc_whatsapp_msgs
- **t_atc_respond_msg:** BEFORE INSERT
  - Statement: `EXECUTE FUNCTION msg_app.tf_before_insert_whatsapp_msg()`
- **t_generate_user_consult:** AFTER INSERT
  - Statement: `EXECUTE FUNCTION msg_app.tf_after_insert_whatsapp_msg()`

### msg_app.ms_whatsapp_msg_json
- **t_atc_notify_changes:** AFTER INSERT
  - Statement: `EXECUTE FUNCTION msg_app.tf_after_insert_whatsapp_msg_json()`

### msg_app.session_obj
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION msg_app.update_date_function()`

### ord_sch.ms_extract_data
- **t_model_data:** AFTER INSERT
  - Statement: `EXECUTE FUNCTION ord_sch.tf_ms_extract_data_after_insert()`

### ord_sch.ms_market_rates
- **cost_rate_update:** AFTER INSERT
  - Statement: `EXECUTE FUNCTION ord_sch.cost_rate_update()`
- **deactivate_old_rates:** AFTER INSERT
  - Statement: `EXECUTE FUNCTION ord_sch.deactivate_old_rates()`
- **rate_cost_update:** AFTER INSERT
  - Statement: `EXECUTE FUNCTION ord_sch.rate_cost_update()`

### prc_mng.exchanges_responses
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### prc_mng.lnk_amount_limits
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### prc_mng.lnk_cr_exchanges
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### prc_mng.lnk_cr_remittances
- **send_remittance_status:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.send_status_message()`

### prc_mng.lnk_exchange_range_rates
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### prc_mng.ms_exchange_address
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### prc_mng.ms_exchange_rates
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### prc_mng.ms_exchange_types
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### prc_mng.ms_networks
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### prc_mng.ms_operation_routes
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`
- **update_operation_route:** AFTER UPDATE
  - Statement: `EXECUTE FUNCTION prc_mng.update_operation_route()`

### prc_mng.ms_pre_exchange
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.lnk_limit_vl
- **replace_def_value:** BEFORE INSERT
  - Statement: `EXECUTE FUNCTION sec_cust.concat_amount_to_def()`
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.lnk_limit_vl_country
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.lnk_opspwds_registred_by_user
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.lnk_profiles_roles
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.lnk_pwds_registred_by_user
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.lnk_range_rates
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.lnk_roles_routes
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.lnk_users_departments
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.lnk_users_loyalty_levels
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.lnk_users_risk_levels
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.logs_actions_obj
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.loyalty_levels
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.ms_cr_manual_rate
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_cost_date_function()`

### sec_cust.ms_cr_rate
- **notify_rate_change:** AFTER UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.rate_change()`
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.ms_cr_special_rate
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.ms_cr_vip_rate
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.ms_departments
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.ms_doc_type
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.ms_global_notifications
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.ms_level_answers
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.ms_level_questions
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.ms_limitations
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.ms_migration_status
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.ms_notifications
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.ms_operation
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`
- **update_user_loyalty:** AFTER INSERT
  - Statement: `EXECUTE FUNCTION sec_cust.update_loyalty_function()`

### sec_cust.ms_over_quota
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.ms_phone
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.ms_pre_remittance
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.ms_profiles
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.ms_roles
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.ms_routes
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.ms_sixmap_services
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.ms_sixmap_services_utype
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.ms_sixmap_users
- **ambassador_assign:** AFTER INSERT
  - Statement: `EXECUTE FUNCTION sec_cust.ambassador_assign()`
- **profile_notification:** AFTER UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.profile_notification()`
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.ms_suspicious_activities
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`
- **update_user_risk:** AFTER INSERT
  - Statement: `EXECUTE FUNCTION sec_cust.update_risk_function()`

### sec_cust.ms_temp_codes
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.ms_user_accounts
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.ms_verifications
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.ms_wallets
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.ms_wholesale_partners
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.ms_wholesale_partners_config
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.ms_wholesale_partners_info
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.ms_wholesale_partners_questions
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_cust.session_obj
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_cust.update_date_function()`

### sec_emp.lnk_opspwds_registred_by_user
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_emp.update_date_function()`

### sec_emp.lnk_profiles_roles
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_emp.update_date_function()`

### sec_emp.lnk_pwds_registred_by_user
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_emp.update_date_function()`

### sec_emp.lnk_roles_routes
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_emp.update_date_function()`

### sec_emp.lnk_users_departments
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_emp.update_date_function()`

### sec_emp.ms_countries
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_emp.update_date_function()`

### sec_emp.ms_departments
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_emp.update_date_function()`

### sec_emp.ms_doc_type
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_emp.update_date_function()`

### sec_emp.ms_ip_countries
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_emp.update_date_function()`

### sec_emp.ms_over_quota
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_emp.update_date_function()`

### sec_emp.ms_phone
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_emp.update_date_function()`

### sec_emp.ms_profiles
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_emp.update_date_function()`

### sec_emp.ms_roles
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_emp.update_date_function()`

### sec_emp.ms_routes
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_emp.update_date_function()`

### sec_emp.ms_sixmap_services
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_emp.update_date_function()`

### sec_emp.ms_sixmap_services_utype
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_emp.update_date_function()`

### sec_emp.ms_sixmap_users
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_emp.update_date_function()`

### sec_emp.session_obj
- **update_country_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION sec_emp.update_date_function()`

