# Persona Migration Execution Order

## Overview

This document outlines the correct order to run SQL migrations for the Persona integration.

---

## Migration Sequence

### Phase 1 (Already Completed - Inquiry Creation)

```bash
001-add-persona-inquiry-id-column.sql
```

- **What it does**: Adds `persona_inquiry_id` column to `sec_cust.ms_sixmap_users`
- **Status**: ✅ Should already be applied from Phase 1
- **Verification**: `SELECT persona_inquiry_id FROM sec_cust.ms_sixmap_users LIMIT 1;`

---

### Phase 2 (Webhook Processing) - **Run These Now**

#### Step 1: Add Column to Verification Level Table

```bash
psql -U <user> -d <database> -f sql-migrations/002-add-persona-inquiry-id-to-verif-level.sql
```

- **What it does**:
  - Adds `persona_inquiry_id` column to `sec_cust.lnk_users_verif_level`
  - Creates index `idx_lnk_users_verif_level_persona_inquiry_id`
  - Adds column comment for documentation
- **Critical**: ⚠️ **Must run BEFORE migration 003**
- **Verification**:
  ```sql
  SELECT column_name, data_type
  FROM information_schema.columns
  WHERE table_schema = 'sec_cust'
    AND table_name = 'lnk_users_verif_level'
    AND column_name = 'persona_inquiry_id';
  ```

#### Step 2: Create Functions and Categories

```bash
psql -U <user> -d <database> -f sql-migrations/003-create-persona-verification-functions.sql
```

- **What it does**:
  - Creates `'Persona Information'` category in `sec_cust.ms_category`
  - Creates 5 items in `sec_cust.ms_item` linked to the category
  - Creates `sp_request_level_one_persona()` base function (12 params)
  - Creates `sp_request_level_one_persona_enhanced()` wrapper function (17 params)
- **Dependencies**: Requires migration 002 to be applied first
- **Verification**:

  ```sql
  -- Check category
  SELECT * FROM sec_cust.ms_category WHERE name = 'Persona Information';

  -- Check items
  SELECT i.name, c.name as category_name
  FROM sec_cust.ms_item i
  JOIN sec_cust.ms_category c ON i.id_category = c.id_category
  WHERE c.name = 'Persona Information';

  -- Check functions
  SELECT proname, pronargs
  FROM pg_proc
  WHERE proname LIKE 'sp_request_level_one_persona%';
  ```

---

## Complete Migration Command

Run all Phase 2 migrations in one go:

```bash
# From Criptoremesa-Backend directory
psql -U your_username -d your_database <<EOF
\i sql-migrations/002-add-persona-inquiry-id-to-verif-level.sql
\i sql-migrations/003-create-persona-verification-functions.sql
EOF
```

---

## Rollback (If Needed)

### Rollback Migration 003

```sql
-- Drop functions
DROP FUNCTION IF EXISTS sec_cust.sp_request_level_one_persona_enhanced;
DROP FUNCTION IF EXISTS sec_cust.sp_request_level_one_persona;

-- Remove items
DELETE FROM sec_cust.ms_item
WHERE name LIKE 'persona_%';

-- Remove category
DELETE FROM sec_cust.ms_category
WHERE name = 'Persona Information';
```

### Rollback Migration 002

```sql
-- Drop index
DROP INDEX IF EXISTS sec_cust.idx_lnk_users_verif_level_persona_inquiry_id;

-- Remove column
ALTER TABLE sec_cust.lnk_users_verif_level
DROP COLUMN IF EXISTS persona_inquiry_id;
```

---

## Migration Files Reference

| File                                            | Purpose                                         | Dependencies   |
| ----------------------------------------------- | ----------------------------------------------- | -------------- |
| `001-add-persona-inquiry-id-column.sql`         | Add persona_inquiry_id to ms_sixmap_users       | None (Phase 1) |
| `002-add-persona-inquiry-id-to-verif-level.sql` | Add persona_inquiry_id to lnk_users_verif_level | Migration 001  |
| `003-create-persona-verification-functions.sql` | Create functions, category, and items           | Migration 002  |

---

## Post-Migration Checklist

After running all migrations, verify:

- [ ] Column exists in `lnk_users_verif_level`: `persona_inquiry_id`
- [ ] Index exists: `idx_lnk_users_verif_level_persona_inquiry_id`
- [ ] Category exists: `'Persona Information'`
- [ ] 5 items exist linked to Persona category
- [ ] Base function exists: `sp_request_level_one_persona` (12 params)
- [ ] Enhanced function exists: `sp_request_level_one_persona_enhanced` (17 params)
- [ ] No errors in PostgreSQL logs

---

**Ready to proceed with Persona webhook testing!** ✅
