# CRIPTOREMESA Database Schema Documentation

**Generated on:** 2025-08-06T15:11:52.750Z
**Total Tables:** 5
**Schemas:** basics

**Estimated Total Rows:** 122

## Table of Contents

- [basics.Coingroup-2024_12_26_18_27_51-dump](#basicscoingroup20241226182751dump)
- [basics.env_variables](#basicsenvvariables)
- [basics.ms_ambassador_fees](#basicsmsambassadorfees)
- [basics.ms_cryptomiles](#basicsmscryptomiles)
- [basics.session_obj](#basicssessionobj)

## Quick Statistics

| Table | Row Count | Columns | Has PK | Foreign Keys |
|-------|-----------|---------|--------|-------------|
| basics.Coingroup-2024_12_26_18_27_51-dump | 0 | 5 | ❌ | 0 |
| basics.env_variables | 2 | 2 | ❌ | 0 |
| basics.ms_ambassador_fees | 8 | 8 | ✅ | 0 |
| basics.ms_cryptomiles | 0 | 16 | ✅ | 1 |
| basics.session_obj | 112 | 53 | ✅ | 0 |

## basics.Coingroup-2024_12_26_18_27_51-dump {#basicscoingroup20241226182751dump}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| c1 | text | YES | NULL | - |
| c2 | text | YES | NULL | - |
| c3 | text | YES | NULL | - |
| c4 | text | YES | NULL | - |
| c5 | text | YES | NULL | - |

---

## basics.env_variables {#basicsenvvariables}

**Type:** BASE TABLE
**Row Count:** 2
**Primary Keys:** None

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| key | text | YES | NULL | - |
| value | text | YES | NULL | - |

---

## basics.ms_ambassador_fees {#basicsmsambassadorfees}

**Type:** BASE TABLE
**Row Count:** 8
**Primary Keys:** id_ambassador_fee

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_ambassador_fee | bigint(64) | NO | nextval('basics.ms_ambassador_fees_id_ambassador_fee_seq'::regclass) | 64 |
| fee | double precision(53) | NO | NULL | 53 |
| uuid_profile | uuid | NO | NULL | - |
| direct_ref | boolean | YES | NULL | - |
| indirect_ref | boolean | YES | NULL | - |
| active | boolean | NO | true | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Indexes

- **ms_ambassador_fees_pkey:** `CREATE UNIQUE INDEX ms_ambassador_fees_pkey ON basics.ms_ambassador_fees USING btree (id_ambassador_fee)`

---

## basics.ms_cryptomiles {#basicsmscryptomiles}

**Type:** BASE TABLE
**Row Count:** 0
**Primary Keys:** id_cryptomile

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| id_cryptomile | bigint(64) | NO | nextval('basics.ms_cryptomiles_id_cryptomile_seq'::regclass) | 64 |
| amount | double precision(53) | NO | NULL | 53 |
| email_user | character varying | YES | NULL | - |
| emp_username | character varying | YES | NULL | - |
| trans_type | character varying | YES | NULL | - |
| trans_description | text | NO | NULL | - |
| trans_comment | text | YES | NULL | - |
| id_operation | character varying | YES | NULL | - |
| id_currency | integer(32) | NO | NULL | 32 |
| id_country | integer(32) | NO | NULL | 32 |
| operation_type | character varying | YES | NULL | - |
| id_ambassador_fee | integer(32) | YES | NULL | 32 |
| was_charged | boolean | NO | NULL | - |
| active | boolean | NO | true | - |
| date_creation | timestamp with time zone | NO | now() | - |
| date_last_modif | timestamp with time zone | NO | now() | - |

### Foreign Keys

| Column | References |
|--------|------------|
| id_ambassador_fee | basics.ms_ambassador_fees.id_ambassador_fee |

### Indexes

- **ms_cryptomiles_pkey:** `CREATE UNIQUE INDEX ms_cryptomiles_pkey ON basics.ms_cryptomiles USING btree (id_cryptomile)`

---

## basics.session_obj {#basicssessionobj}

**Type:** BASE TABLE
**Row Count:** 112
**Primary Keys:** sid

### Columns

| Column | Type | Nullable | Default | Length/Precision |
|--------|------|----------|---------|------------------|
| sid | character varying | NO | NULL | - |
| sess | json | NO | NULL | - |
| expire | timestamp without time zone | NO | NULL | - |
| expired | boolean | YES | NULL | - |
| is_authenticated | boolean | YES | NULL | - |
| uuid_user | uuid | YES | NULL | - |
| username | character varying(100) | YES | NULL | 100 |
| first_name | text | YES | NULL | - |
| second_name | text | YES | NULL | - |
| last_name | text | YES | NULL | - |
| second_last_name | text | YES | NULL | - |
| email_user | character varying(100) | YES | NULL | 100 |
| password | text | YES | NULL | - |
| ops_password | text | YES | NULL | - |
| uuid_profile | uuid | YES | NULL | - |
| cust_cr_cod_pub | character varying(100) | YES | NULL | 100 |
| id_verif_level | integer(32) | YES | NULL | 32 |
| cod_rank | character varying(100) | YES | NULL | 100 |
| verif_level_apb | boolean | YES | NULL | - |
| multi_country | boolean | YES | false | - |
| last_session_reg | character varying | YES | NULL | - |
| last_ip_reg | character varying(100) | YES | NULL | 100 |
| last_ip_city_reg | character varying(100) | YES | NULL | 100 |
| last_id_log_reg | integer(32) | YES | NULL | 32 |
| date_last_conn | timestamp with time zone | YES | NULL | - |
| gender | character(1) | YES | NULL | 1 |
| date_birth | timestamp with time zone | YES | NULL | - |
| ident_doc_number | character varying(30) | YES | NULL | 30 |
| main_phone | character varying(30) | YES | NULL | 30 |
| second_phone | character varying(30) | YES | NULL | 30 |
| delegated_phone | character varying(30) | YES | NULL | 30 |
| address | text | YES | NULL | - |
| resid_city | text | YES | NULL | - |
| resid_postal_code | character varying(100) | YES | NULL | 100 |
| referral_node | character varying(30) | YES | NULL | 30 |
| main_sn_platf | character varying(30) | YES | NULL | 30 |
| ok_legal_terms | boolean | YES | NULL | - |
| user_active | boolean | YES | NULL | - |
| user_blocked | boolean | YES | NULL | - |
| date_legacy_reg | timestamp with time zone | YES | now() | - |
| date_creation | timestamp with time zone | YES | now() | - |
| date_last_modif | timestamp with time zone | YES | now() | - |
| roles | json | YES | NULL | - |
| ip_current_con | character varying(100) | YES | NULL | 100 |
| country_ip_current_con | character varying(100) | YES | NULL | 100 |
| routes | json | YES | NULL | - |
| id_user_priv | integer(32) | YES | NULL | 32 |
| id_over_quota | integer(32) | YES | NULL | 32 |
| id_service | integer(32) | YES | NULL | 32 |
| id_services_utype | integer(32) | YES | NULL | 32 |
| id_ident_doc_type | integer(32) | YES | NULL | 32 |
| id_resid_country | integer(32) | YES | NULL | 32 |
| id_nationality_country | integer(32) | YES | NULL | 32 |

### Indexes

- **session_pkey:** `CREATE UNIQUE INDEX session_pkey ON basics.session_obj USING btree (sid)`
- **IDX_session_expire:** `CREATE INDEX "IDX_session_expire" ON basics.session_obj USING btree (expire)`

---

