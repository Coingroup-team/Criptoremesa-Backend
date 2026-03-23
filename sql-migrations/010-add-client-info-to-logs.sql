-- Migration: Add client_info field to logs_actions table and update stored procedure
-- Description: Adds a new JSONB field to store client device/browser information
-- Date: 2026-02-19

-- Step 1: Add client_info column to LOGS_ACTIONS_OBJ table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'sec_cust' 
        AND LOWER(table_name) = 'logs_actions_obj' 
        AND column_name = 'client_info'
    ) THEN
        ALTER TABLE sec_cust.LOGS_ACTIONS_OBJ 
        ADD COLUMN client_info JSONB NULL;
        
        RAISE NOTICE 'Column client_info added to sec_cust.LOGS_ACTIONS_OBJ';
    ELSE
        RAISE NOTICE 'Column client_info already exists in sec_cust.LOGS_ACTIONS_OBJ';
    END IF;
END $$;

-- Step 2: Create or replace the stored procedure to accept client_info
CREATE OR REPLACE FUNCTION sec_cust.SP_LOGS_ACTIONS_OBJ_INSERT(
    _is_authenticated BOOLEAN,
    _success_req BOOLEAN,
    _failed_req BOOLEAN,
    _ip_orig VARCHAR,
    _country_ip_orig VARCHAR,
    _route VARCHAR,
    _params JSON,
    _query JSON,
    _body JSON,
    _status INTEGER,
    _response JSON,
    _sid_session VARCHAR,
    _client_info JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO sec_cust.LOGS_ACTIONS_OBJ (
        is_authenticated,
        success_req,
        failed_req,
        ip_orig,
        country_ip_orig,
        route,
        params,
        query,
        body,
        status,
        response,
        sid_session,
        client_info
    ) VALUES (
        _is_authenticated,
        _success_req,
        _failed_req,
        _ip_orig,
        _country_ip_orig,
        _route,
        _params,
        _query,
        _body,
        _status,
        _response,
        _sid_session,
        _client_info
    );
END;
$$ LANGUAGE plpgsql;

-- Step 3: Add comment to the new column
COMMENT ON COLUMN sec_cust.LOGS_ACTIONS_OBJ.client_info IS 'JSON object containing client device and browser information (browser, OS, device type, screen resolution, etc.)';

-- Step 4: Verify the changes
DO $$
DECLARE
    column_exists BOOLEAN;
    function_exists BOOLEAN;
BEGIN
    -- Check if column exists
    SELECT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'sec_cust' 
        AND LOWER(table_name) = 'logs_actions_obj' 
        AND column_name = 'client_info'
    ) INTO column_exists;
    
    -- Check if function exists
    SELECT EXISTS (
        SELECT 1 
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'sec_cust'
        AND p.proname = 'sp_logs_actions_obj_insert'
    ) INTO function_exists;
    
    IF column_exists AND function_exists THEN
        RAISE NOTICE '✓ Migration completed successfully';
        RAISE NOTICE '  - Column client_info exists: %', column_exists;
        RAISE NOTICE '  - Function SP_LOGS_ACTIONS_OBJ_INSERT updated: %', function_exists;
    ELSE
        RAISE WARNING '✗ Migration incomplete';
        RAISE WARNING '  - Column client_info exists: %', column_exists;
        RAISE WARNING '  - Function SP_LOGS_ACTIONS_OBJ_INSERT updated: %', function_exists;
    END IF;
END $$;
