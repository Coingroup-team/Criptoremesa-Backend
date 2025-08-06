# CRIPTOREMESA - Complete Database Analysis

**Generated:** 2025-08-06T17:01:40.946Z

## 📊 Database Overview

| Component | Count |
|-----------|-------|
| Tables | 4 |
| Views | 0 |
| Functions | 65 |
| Procedures | 0 |
| Triggers | 5 |
| Sequences | 2 |
| Custom Types | 7 |
| Rules | 0 |
| Indexes | 4 |

## 📝 Business Logic Functions & Procedures

### PL/pgSQL Functions (14)

#### basics.check_session
- **Type:** function
- **Arguments:** `none`
- **Returns:** `trigger`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION basics.check_session()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN

	IF (NEW.expire < NOW())
	THEN
        NEW.expired = true;
    ELSE
	    NEW.expired = false;
    END IF;
	return NEW;

END;
$function$

```

#### basics.get_session_by_id
- **Type:** function
- **Arguments:** `_sid character varying`
- **Returns:** `TABLE(sid character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION basics.get_session_by_id(_sid character varying)
 RETURNS TABLE(sid character varying)
 LANGUAGE plpgsql
AS $function$ BEGIN RETURN QUERY
SELECT S.sid
FROM BASICS.session_obj AS S
where S.sid = _sid;
END;
$function$

```

#### basics.get_some_session
- **Type:** function
- **Arguments:** `none`
- **Returns:** `TABLE(sid character varying)`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION basics.get_some_session()
 RETURNS TABLE(sid character varying)
 LANGUAGE plpgsql
AS $function$ BEGIN RETURN QUERY
SELECT S.sid
FROM BASICS.session_obj AS S
Limit 1;
END;
$function$

```

#### basics.sp_cryptomiles_activate_by_id
- **Type:** function
- **Arguments:** `_id_cryptomile bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION basics.sp_cryptomiles_activate_by_id(_id_cryptomile bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$ 
	DECLARE
		resp_obj JSONB;
		succesfully_updated BIGINT;
	BEGIN 
		UPDATE basics.ms_cryptomiles
		SET 
			active = true
		WHERE id_cryptomile = _id_cryptomile
		RETURNING id_cryptomile INTO succesfully_updated;

		IF (succesfully_updated IS NOT NULL)
		THEN
			resp_obj := json_build_object(
					'message', 'cryptomile succesfully activated.'
					);
		ELSE
			resp...
```

#### basics.sp_cryptomiles_deactivate_by_id
- **Type:** function
- **Arguments:** `_id_cryptomile bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION basics.sp_cryptomiles_deactivate_by_id(_id_cryptomile bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$ 
	DECLARE
		resp_obj JSONB;
		succesfully_updated BIGINT;
	BEGIN 
		UPDATE basics.ms_cryptomiles
		SET 
			active = false
		WHERE id_cryptomile = _id_cryptomile
		RETURNING id_cryptomile INTO succesfully_updated;

		IF (succesfully_updated IS NOT NULL)
		THEN
			resp_obj := json_build_object(
					'message', 'cryptomile succesfully deactivated.'
					);
		ELSE
		...
```

#### basics.sp_cryptomiles_get_all
- **Type:** function
- **Arguments:** `_active boolean, _email_user character varying, _id_currency integer, _id_country integer, _start_date bigint, _end_date bigint`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION basics.sp_cryptomiles_get_all(_active boolean, _email_user character varying, _id_currency integer, _id_country integer, _start_date bigint, _end_date bigint)
 RETURNS json
 LANGUAGE plpgsql
AS $function$ 
	DECLARE
		resp_obj JSONB;
		cryptomiles JSONB;
		total_credit FLOAT;
		total_debit FLOAT;
		available_cryptomile FLOAT;
		CO_query_string VARCHAR;
		CU_query_string VARCHAR;
		R_query_string VARCHAR;
		U_query_string VARCHAR;
		ok_connection VARCHAR;
		is_connected ...
```

#### basics.sp_get_id_ambassador_fee_by_remittance
- **Type:** function
- **Arguments:** `_id_remittance integer, _email_user character varying`
- **Returns:** `integer`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION basics.sp_get_id_ambassador_fee_by_remittance(_id_remittance integer, _email_user character varying)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$ 
	DECLARE
		_id_ambassador_fee INT;
		_id_client_remittance INT;
		is_referral BOOLEAN;
		_cust_cr_cod_pub VARCHAR;
		_referral_node_client_remittance VARCHAR;
    	query_string TEXT;
    	client_uuid_profile uuid;
		is_connected BOOLEAN;
		ok_connection VARCHAR;
		DBLINK_DB_NAME TEXT;
    	DBLINK_DB_STRING_CONN TEXT;
	BE...
```

#### basics.sp_is_referral
- **Type:** function
- **Arguments:** `_cod_pub_client character varying, _id_client_remittance integer`
- **Returns:** `boolean`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION basics.sp_is_referral(_cod_pub_client character varying, _id_client_remittance integer)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$ 
	DECLARE
		_resp BOOLEAN;
    	query_string TEXT;
		is_connected BOOLEAN;
		ok_connection VARCHAR;
    	DBLINK_DB_NAME TEXT;
    	DBLINK_DB_STRING_CONN TEXT;
	BEGIN 
		SELECT ENV.value INTO DBLINK_DB_NAME
		FROM basics.env_variables AS ENV
		WHERE ENV.key = 'dblink_name_sm_bd';

		SELECT ENV.value INTO DBLINK_DB_STRING_CONN
		FROM ba...
```

#### basics.sp_ms_ambassador_fees
- **Type:** function
- **Arguments:** `_fee double precision, _uuid_profile uuid, _direct_ref boolean, _indirect_ref boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION basics.sp_ms_ambassador_fees(_fee double precision, _uuid_profile uuid, _direct_ref boolean, _indirect_ref boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$ 
DECLARE
    resp_obj JSONB;
    succesfully_inserted BIGINT;
BEGIN 
    INSERT INTO basics.ms_ambassador_fees(
            fee,
			uuid_profile,
			direct_ref,
			indirect_ref
        )
    VALUES (
            _fee,
			_uuid_profile,
			_direct_ref,
			_indirect_ref
        )
    RETURNING id_ambassador_fee ...
```

#### basics.sp_ms_cryptomiles_get
- **Type:** function
- **Arguments:** `_email_user character varying`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION basics.sp_ms_cryptomiles_get(_email_user character varying)
 RETURNS json
 LANGUAGE plpgsql
AS $function$ 
DECLARE
    resp_obj JSONB;
	CO_query_string VARCHAR;
	CU_query_string VARCHAR;
	ok_connection VARCHAR;
	is_connected BOOLEAN;
	DBLINK_DB_NAME TEXT;
    DBLINK_DB_STRING_CONN TEXT;
	BEGIN 
		SELECT ENV.value INTO DBLINK_DB_NAME
		FROM basics.env_variables AS ENV
		WHERE ENV.key = 'dblink_name_sm_bd';

		SELECT ENV.value INTO DBLINK_DB_STRING_CONN
		FROM basics.env...
```

#### basics.sp_ms_cryptomiles_insert
- **Type:** function
- **Arguments:** `_amount double precision, _email_user character varying, _emp_username character varying, _trans_type character varying, _trans_description text, _trans_comment text, _id_operation character varying, _operation_type text, _id_currency integer, _id_country integer, _was_charged boolean`
- **Returns:** `json`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION basics.sp_ms_cryptomiles_insert(_amount double precision, _email_user character varying, _emp_username character varying, _trans_type character varying, _trans_description text, _trans_comment text, _id_operation character varying, _operation_type text, _id_currency integer, _id_country integer, _was_charged boolean)
 RETURNS json
 LANGUAGE plpgsql
AS $function$ 
DECLARE
    resp_obj JSONB;
    succesfully_inserted BIGINT;
    query_string TEXT;
    foreign_email_user ...
```

#### basics.sp_session_obj_update
- **Type:** function
- **Arguments:** `cols character varying[], vals character varying[], _sid character varying, hasuuid boolean`
- **Returns:** `void`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION basics.sp_session_obj_update(cols character varying[], vals character varying[], _sid character varying, hasuuid boolean)
 RETURNS void
 LANGUAGE plpgsql
AS $function$ BEGIN IF (array_length(cols, 1) <> array_length(vals, 1)) THEN RAISE NOTICE 'Los arreglos deben tener la misma cantidad de elementos';
ELSEIF (array_length(cols, 1) = 1) THEN EXECUTE 'UPDATE BASICS.session_obj SET ' || cols [1] || ' = $1 ' || 'WHERE SID = $2' USING vals [1],
_sid;
ELSEIF (array_length(co...
```

#### basics.update_date_function
- **Type:** function
- **Arguments:** `none`
- **Returns:** `trigger`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION basics.update_date_function()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$ 
BEGIN 

	NEW.date_last_modif = NOW();
	return NEW;

END;
$function$

```

#### basics.user_has_an_active_session
- **Type:** function
- **Arguments:** `_email_user character varying`
- **Returns:** `boolean`
- **Volatility:** volatile

```sql
CREATE OR REPLACE FUNCTION basics.user_has_an_active_session(_email_user character varying)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
    DECLARE
        _sid VARCHAR;
    BEGIN
        SELECT S.sid INTO _sid
        FROM BASICS.session_obj AS S
        WHERE S.sess->'passport' IS NOT NULL
        AND S.sess->'passport'->>'user'::text = _email_user
        AND S.expire > NOW();

        IF (_sid IS NOT NULL)
        THEN
            DELETE FROM BASICS.session_obj
            WHERE sid = _...
```

## ⚡ Business Rule Triggers

### basics.ms_ambassador_fees
- **update_ambassador_fees_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION basics.update_date_function()`

### basics.ms_cryptomiles
- **update_cryptomiles_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION basics.update_date_function()`

### basics.session_obj
- **check_session:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION basics.check_session()`
- **update_session_date:** BEFORE UPDATE
  - Statement: `EXECUTE FUNCTION basics.update_date_function()`

