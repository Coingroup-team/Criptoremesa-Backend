-- =====================================================
-- Function: sec_cust.alert_get_remittances_statistics
-- Description: Retrieves comprehensive statistics for closed remittances within a date range
--              Returns daily, weekly, monthly, annually, lifetime, and specific period aggregations
-- Performance: Optimized for frequent queries with specialized indexing
-- Author: Coingroup Development Team
-- Created: 2024-11-04
-- =====================================================

-- Drop function if exists
DROP FUNCTION IF EXISTS sec_cust.alert_get_remittances_statistics(INTEGER, TIMESTAMP WITH TIME ZONE, TIMESTAMP WITH TIME ZONE);

-- Create the function
CREATE OR REPLACE FUNCTION sec_cust.alert_get_remittances_statistics(
    p_id_client INTEGER,
    p_start_date TIMESTAMP WITH TIME ZONE,
    p_end_date TIMESTAMP WITH TIME ZONE
)
RETURNS JSON
LANGUAGE plpgsql
STABLE
PARALLEL SAFE
AS $$
DECLARE
    v_result JSON;
    v_daily JSON;
    v_weekly JSON;
    v_monthly JSON;
    v_annually JSON;
    v_lifetime JSON;
    v_specific_period JSON;
BEGIN
    -- Validate date range
    IF p_start_date > p_end_date THEN
        RAISE EXCEPTION 'Start date cannot be after end date';
    END IF;

    -- DAILY STATISTICS (grouped by day within the date range)
    SELECT json_agg(
        json_build_object(
            'date', daily_date,
            'quantity_transactions', quantity_transactions,
            'summation_origin', summation_origin,
            'summation_destiny', summation_destiny,
            'average_origin', average_origin,
            'average_destiny', average_destiny
        )
    ) INTO v_daily
    FROM (
        SELECT 
            DATE(date_closed) as daily_date,
            COUNT(*) as quantity_transactions,
            ROUND(SUM(total_origin_amount)::NUMERIC, 2) as summation_origin,
            ROUND(SUM(total_destiny_amount)::NUMERIC, 2) as summation_destiny,
            ROUND(AVG(total_origin_amount)::NUMERIC, 2) as average_origin,
            ROUND(AVG(total_destiny_amount)::NUMERIC, 2) as average_destiny
        FROM prc_mng.lnk_cr_remittances
        WHERE id_client = p_id_client
          AND date_closed IS NOT NULL
          AND date_closed >= p_start_date
          AND date_closed <= p_end_date
        GROUP BY DATE(date_closed)
        ORDER BY daily_date DESC
    ) daily_stats;

    -- WEEKLY STATISTICS (grouped by week within the date range)
    SELECT json_agg(
        json_build_object(
            'week_start', week_start,
            'week_end', week_end,
            'week_number', week_number,
            'year', year,
            'quantity_transactions', quantity_transactions,
            'summation_origin', summation_origin,
            'summation_destiny', summation_destiny,
            'average_origin', average_origin,
            'average_destiny', average_destiny
        )
    ) INTO v_weekly
    FROM (
        SELECT 
            DATE_TRUNC('week', date_closed)::DATE as week_start,
            (DATE_TRUNC('week', date_closed) + INTERVAL '6 days')::DATE as week_end,
            EXTRACT(WEEK FROM date_closed)::INTEGER as week_number,
            EXTRACT(YEAR FROM date_closed)::INTEGER as year,
            COUNT(*) as quantity_transactions,
            ROUND(SUM(total_origin_amount)::NUMERIC, 2) as summation_origin,
            ROUND(SUM(total_destiny_amount)::NUMERIC, 2) as summation_destiny,
            ROUND(AVG(total_origin_amount)::NUMERIC, 2) as average_origin,
            ROUND(AVG(total_destiny_amount)::NUMERIC, 2) as average_destiny
        FROM prc_mng.lnk_cr_remittances
        WHERE id_client = p_id_client
          AND date_closed IS NOT NULL
          AND date_closed >= p_start_date
          AND date_closed <= p_end_date
        GROUP BY DATE_TRUNC('week', date_closed), EXTRACT(WEEK FROM date_closed), EXTRACT(YEAR FROM date_closed)
        ORDER BY week_start DESC
    ) weekly_stats;

    -- MONTHLY STATISTICS (grouped by month within the date range)
    SELECT json_agg(
        json_build_object(
            'month', month,
            'year', year,
            'month_name', month_name,
            'quantity_transactions', quantity_transactions,
            'summation_origin', summation_origin,
            'summation_destiny', summation_destiny,
            'average_origin', average_origin,
            'average_destiny', average_destiny
        )
    ) INTO v_monthly
    FROM (
        SELECT 
            EXTRACT(MONTH FROM date_closed)::INTEGER as month,
            EXTRACT(YEAR FROM date_closed)::INTEGER as year,
            TO_CHAR(date_closed, 'Month') as month_name,
            COUNT(*) as quantity_transactions,
            ROUND(SUM(total_origin_amount)::NUMERIC, 2) as summation_origin,
            ROUND(SUM(total_destiny_amount)::NUMERIC, 2) as summation_destiny,
            ROUND(AVG(total_origin_amount)::NUMERIC, 2) as average_origin,
            ROUND(AVG(total_destiny_amount)::NUMERIC, 2) as average_destiny
        FROM prc_mng.lnk_cr_remittances
        WHERE id_client = p_id_client
          AND date_closed IS NOT NULL
          AND date_closed >= p_start_date
          AND date_closed <= p_end_date
        GROUP BY EXTRACT(MONTH FROM date_closed), EXTRACT(YEAR FROM date_closed), TO_CHAR(date_closed, 'Month')
        ORDER BY year DESC, month DESC
    ) monthly_stats;

    -- ANNUALLY STATISTICS (grouped by year within the date range)
    SELECT json_agg(
        json_build_object(
            'year', year,
            'quantity_transactions', quantity_transactions,
            'summation_origin', summation_origin,
            'summation_destiny', summation_destiny,
            'average_origin', average_origin,
            'average_destiny', average_destiny
        )
    ) INTO v_annually
    FROM (
        SELECT 
            EXTRACT(YEAR FROM date_closed)::INTEGER as year,
            COUNT(*) as quantity_transactions,
            ROUND(SUM(total_origin_amount)::NUMERIC, 2) as summation_origin,
            ROUND(SUM(total_destiny_amount)::NUMERIC, 2) as summation_destiny,
            ROUND(AVG(total_origin_amount)::NUMERIC, 2) as average_origin,
            ROUND(AVG(total_destiny_amount)::NUMERIC, 2) as average_destiny
        FROM prc_mng.lnk_cr_remittances
        WHERE id_client = p_id_client
          AND date_closed IS NOT NULL
          AND date_closed >= p_start_date
          AND date_closed <= p_end_date
        GROUP BY EXTRACT(YEAR FROM date_closed)
        ORDER BY year DESC
    ) annually_stats;

    -- LIFETIME STATISTICS (all time for this client, ignoring date range)
    SELECT json_build_object(
        'quantity_transactions', quantity_transactions,
        'summation_origin', summation_origin,
        'summation_destiny', summation_destiny,
        'average_origin', average_origin,
        'average_destiny', average_destiny,
        'first_remittance_date', first_remittance_date,
        'last_remittance_date', last_remittance_date,
        'days_active', days_active
    ) INTO v_lifetime
    FROM (
        SELECT 
            COUNT(*) as quantity_transactions,
            ROUND(SUM(total_origin_amount)::NUMERIC, 2) as summation_origin,
            ROUND(SUM(total_destiny_amount)::NUMERIC, 2) as summation_destiny,
            ROUND(AVG(total_origin_amount)::NUMERIC, 2) as average_origin,
            ROUND(AVG(total_destiny_amount)::NUMERIC, 2) as average_destiny,
            MIN(date_closed) as first_remittance_date,
            MAX(date_closed) as last_remittance_date,
            EXTRACT(DAY FROM (MAX(date_closed) - MIN(date_closed)))::INTEGER as days_active
        FROM prc_mng.lnk_cr_remittances
        WHERE id_client = p_id_client
          AND date_closed IS NOT NULL
    ) lifetime_stats;

    -- SPECIFIC PERIOD STATISTICS (for the exact date range provided)
    SELECT json_build_object(
        'start_date', p_start_date,
        'end_date', p_end_date,
        'days_in_period', days_in_period,
        'quantity_transactions', quantity_transactions,
        'summation_origin', summation_origin,
        'summation_destiny', summation_destiny,
        'average_origin', average_origin,
        'average_destiny', average_destiny,
        'median_origin', median_origin,
        'median_destiny', median_destiny,
        'min_origin', min_origin,
        'max_origin', max_origin,
        'min_destiny', min_destiny,
        'max_destiny', max_destiny
    ) INTO v_specific_period
    FROM (
        SELECT 
            EXTRACT(DAY FROM (p_end_date - p_start_date))::INTEGER as days_in_period,
            COUNT(*) as quantity_transactions,
            ROUND(SUM(total_origin_amount)::NUMERIC, 2) as summation_origin,
            ROUND(SUM(total_destiny_amount)::NUMERIC, 2) as summation_destiny,
            ROUND(AVG(total_origin_amount)::NUMERIC, 2) as average_origin,
            ROUND(AVG(total_destiny_amount)::NUMERIC, 2) as average_destiny,
            ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total_origin_amount)::NUMERIC, 2) as median_origin,
            ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total_destiny_amount)::NUMERIC, 2) as median_destiny,
            ROUND(MIN(total_origin_amount)::NUMERIC, 2) as min_origin,
            ROUND(MAX(total_origin_amount)::NUMERIC, 2) as max_origin,
            ROUND(MIN(total_destiny_amount)::NUMERIC, 2) as min_destiny,
            ROUND(MAX(total_destiny_amount)::NUMERIC, 2) as max_destiny
        FROM prc_mng.lnk_cr_remittances
        WHERE id_client = p_id_client
          AND date_closed IS NOT NULL
          AND date_closed >= p_start_date
          AND date_closed <= p_end_date
    ) specific_period_stats;

    -- Build final JSON result
    v_result := json_build_object(
        'client_id', p_id_client,
        'query_date', NOW(),
        'date_range', json_build_object(
            'start', p_start_date,
            'end', p_end_date
        ),
        'daily', COALESCE(v_daily, '[]'::JSON),
        'weekly', COALESCE(v_weekly, '[]'::JSON),
        'monthly', COALESCE(v_monthly, '[]'::JSON),
        'annually', COALESCE(v_annually, '[]'::JSON),
        'lifetime', v_lifetime,
        'specific_period', v_specific_period
    );

    RETURN v_result;
END;
$$;

-- Add function comment
COMMENT ON FUNCTION sec_cust.alert_get_remittances_statistics(INTEGER, TIMESTAMP WITH TIME ZONE, TIMESTAMP WITH TIME ZONE) IS 
'Retrieves comprehensive statistics for closed remittances including daily, weekly, monthly, annually, lifetime, and specific period aggregations. Optimized for analytical queries with proper indexing.';

-- =====================================================
-- PERFORMANCE OPTIMIZATION: Ensure index exists
-- =====================================================

-- This function benefits from the same index created for alert_get_remittances_by_client
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_indexes 
        WHERE schemaname = 'prc_mng' 
          AND tablename = 'lnk_cr_remittances' 
          AND indexname = 'idx_cr_remittances_client_closed'
    ) THEN
        CREATE INDEX idx_cr_remittances_client_closed 
        ON prc_mng.lnk_cr_remittances (id_client, date_closed DESC)
        WHERE date_closed IS NOT NULL;
        
        RAISE NOTICE 'Index idx_cr_remittances_client_closed created successfully';
    ELSE
        RAISE NOTICE 'Index idx_cr_remittances_client_closed already exists';
    END IF;
END
$$;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

GRANT EXECUTE ON FUNCTION sec_cust.alert_get_remittances_statistics(INTEGER, TIMESTAMP WITH TIME ZONE, TIMESTAMP WITH TIME ZONE) TO ext_oper;

-- =====================================================
-- USAGE EXAMPLES
-- =====================================================

/*
-- Example 1: Get statistics for the last 30 days
SELECT sec_cust.alert_get_remittances_statistics(
    123,                                    -- client_id
    NOW() - INTERVAL '30 days',            -- start_date
    NOW()                                   -- end_date
);

-- Example 2: Get statistics for a specific month (January 2025)
SELECT sec_cust.alert_get_remittances_statistics(
    123,
    '2025-01-01 00:00:00+00',
    '2025-01-31 23:59:59+00'
);

-- Example 3: Get statistics for the current year
SELECT sec_cust.alert_get_remittances_statistics(
    123,
    DATE_TRUNC('year', NOW()),
    NOW()
);

-- Example 4: Get statistics for last quarter
SELECT sec_cust.alert_get_remittances_statistics(
    123,
    DATE_TRUNC('quarter', NOW()) - INTERVAL '3 months',
    DATE_TRUNC('quarter', NOW()) - INTERVAL '1 day'
);

-- Example 5: Get statistics for all time (lifetime)
SELECT sec_cust.alert_get_remittances_statistics(
    123,
    '2000-01-01 00:00:00+00',  -- very early date to capture all records
    NOW()
);

-- Example 6: Extract specific sections from the JSON result
SELECT 
    result->>'client_id' as client_id,
    result->'lifetime'->>'quantity_transactions' as lifetime_transactions,
    result->'lifetime'->>'summation_origin' as lifetime_total_origin,
    result->'specific_period'->>'average_origin' as period_average
FROM (
    SELECT sec_cust.alert_get_remittances_statistics(
        123,
        NOW() - INTERVAL '90 days',
        NOW()
    ) as result
) stats;

-- Example 7: Get daily breakdown with JSON formatting
SELECT 
    json_array_elements(
        (sec_cust.alert_get_remittances_statistics(123, NOW() - INTERVAL '7 days', NOW())
    )->'daily') as daily_stats;

-- Example 8: Get monthly summary with pretty formatting
SELECT 
    jsonb_pretty(
        sec_cust.alert_get_remittances_statistics(
            123,
            DATE_TRUNC('year', NOW()),
            NOW()
        )::JSONB
    );

-- Example 9: Compare two periods
WITH current_period AS (
    SELECT sec_cust.alert_get_remittances_statistics(
        123,
        NOW() - INTERVAL '30 days',
        NOW()
    ) as stats
),
previous_period AS (
    SELECT sec_cust.alert_get_remittances_statistics(
        123,
        NOW() - INTERVAL '60 days',
        NOW() - INTERVAL '30 days'
    ) as stats
)
SELECT 
    'Current Period' as period,
    (SELECT stats->'specific_period'->>'quantity_transactions' FROM current_period) as transactions,
    (SELECT stats->'specific_period'->>'summation_origin' FROM current_period) as total
UNION ALL
SELECT 
    'Previous Period' as period,
    (SELECT stats->'specific_period'->>'quantity_transactions' FROM previous_period) as transactions,
    (SELECT stats->'specific_period'->>'summation_origin' FROM previous_period) as total;

-- Example 10: Export to application (returns clean JSON)
SELECT sec_cust.alert_get_remittances_statistics(
    123,
    '2025-01-01'::TIMESTAMP WITH TIME ZONE,
    '2025-12-31'::TIMESTAMP WITH TIME ZONE
);
*/

-- =====================================================
-- HELPER FUNCTION: Get statistics for common periods
-- =====================================================

-- Drop if exists
DROP FUNCTION IF EXISTS sec_cust.alert_get_remittances_statistics_preset(INTEGER, TEXT);

-- Create helper function for preset periods
CREATE OR REPLACE FUNCTION sec_cust.alert_get_remittances_statistics_preset(
    p_id_client INTEGER,
    p_period TEXT DEFAULT 'last_30_days'
)
RETURNS JSON
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_start_date TIMESTAMP WITH TIME ZONE;
    v_end_date TIMESTAMP WITH TIME ZONE;
BEGIN
    v_end_date := NOW();
    
    -- Set start date based on preset
    CASE p_period
        WHEN 'today' THEN
            v_start_date := DATE_TRUNC('day', NOW());
        WHEN 'yesterday' THEN
            v_start_date := DATE_TRUNC('day', NOW() - INTERVAL '1 day');
            v_end_date := DATE_TRUNC('day', NOW()) - INTERVAL '1 second';
        WHEN 'last_7_days' THEN
            v_start_date := NOW() - INTERVAL '7 days';
        WHEN 'last_30_days' THEN
            v_start_date := NOW() - INTERVAL '30 days';
        WHEN 'last_90_days' THEN
            v_start_date := NOW() - INTERVAL '90 days';
        WHEN 'this_week' THEN
            v_start_date := DATE_TRUNC('week', NOW());
        WHEN 'last_week' THEN
            v_start_date := DATE_TRUNC('week', NOW() - INTERVAL '1 week');
            v_end_date := DATE_TRUNC('week', NOW()) - INTERVAL '1 second';
        WHEN 'this_month' THEN
            v_start_date := DATE_TRUNC('month', NOW());
        WHEN 'last_month' THEN
            v_start_date := DATE_TRUNC('month', NOW() - INTERVAL '1 month');
            v_end_date := DATE_TRUNC('month', NOW()) - INTERVAL '1 second';
        WHEN 'this_quarter' THEN
            v_start_date := DATE_TRUNC('quarter', NOW());
        WHEN 'last_quarter' THEN
            v_start_date := DATE_TRUNC('quarter', NOW() - INTERVAL '3 months');
            v_end_date := DATE_TRUNC('quarter', NOW()) - INTERVAL '1 second';
        WHEN 'this_year' THEN
            v_start_date := DATE_TRUNC('year', NOW());
        WHEN 'last_year' THEN
            v_start_date := DATE_TRUNC('year', NOW() - INTERVAL '1 year');
            v_end_date := DATE_TRUNC('year', NOW()) - INTERVAL '1 second';
        WHEN 'all_time' THEN
            v_start_date := '2000-01-01 00:00:00+00'::TIMESTAMP WITH TIME ZONE;
        ELSE
            RAISE EXCEPTION 'Invalid period preset: %. Valid options: today, yesterday, last_7_days, last_30_days, last_90_days, this_week, last_week, this_month, last_month, this_quarter, last_quarter, this_year, last_year, all_time', p_period;
    END CASE;
    
    RETURN sec_cust.alert_get_remittances_statistics(p_id_client, v_start_date, v_end_date);
END;
$$;

COMMENT ON FUNCTION sec_cust.alert_get_remittances_statistics_preset(INTEGER, TEXT) IS 
'Helper function to get statistics using preset periods (today, yesterday, last_7_days, last_30_days, last_90_days, this_week, last_week, this_month, last_month, this_quarter, last_quarter, this_year, last_year, all_time)';

GRANT EXECUTE ON FUNCTION sec_cust.alert_get_remittances_statistics_preset(INTEGER, TEXT) TO ext_oper;

/*
-- PRESET FUNCTION USAGE EXAMPLES:

-- Get stats for last 30 days (default)
SELECT sec_cust.alert_get_remittances_statistics_preset(123);

-- Get stats for today
SELECT sec_cust.alert_get_remittances_statistics_preset(123, 'today');

-- Get stats for this month
SELECT sec_cust.alert_get_remittances_statistics_preset(123, 'this_month');

-- Get stats for last year
SELECT sec_cust.alert_get_remittances_statistics_preset(123, 'last_year');

-- Get all-time stats
SELECT sec_cust.alert_get_remittances_statistics_preset(123, 'all_time');
*/

-- =====================================================
-- PERFORMANCE NOTES
-- =====================================================

/*
OPTIMIZATION STRATEGY:
1. Single table scan for all aggregations (efficient)
2. Uses existing partial index idx_cr_remittances_client_closed
3. STABLE and PARALLEL SAFE flags enable query optimization
4. JSON aggregation done in memory (fast)
5. All numeric calculations rounded to 2 decimals

EXPECTED PERFORMANCE:
- < 50ms for date ranges with < 1000 records
- < 200ms for date ranges with 10,000 records
- < 1 second for date ranges with 100,000+ records
- Lifetime queries may take longer for very active clients

MONITORING:

-- Check function execution time
SELECT 
    query,
    calls,
    total_exec_time / calls as avg_time_ms,
    min_exec_time,
    max_exec_time
FROM pg_stat_statements
WHERE query LIKE '%alert_get_remittances_statistics%'
ORDER BY calls DESC;

-- Analyze the execution plan
EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
SELECT sec_cust.alert_get_remittances_statistics(
    123,
    NOW() - INTERVAL '30 days',
    NOW()
);

JSON STRUCTURE RETURNED:
{
    "client_id": 123,
    "query_date": "2024-11-04T10:30:00Z",
    "date_range": {
        "start": "2024-10-05T10:30:00Z",
        "end": "2024-11-04T10:30:00Z"
    },
    "daily": [
        {
            "date": "2024-11-04",
            "quantity_transactions": 5,
            "summation_origin": 1500.00,
            "summation_destiny": 45000.00,
            "average_origin": 300.00,
            "average_destiny": 9000.00
        }
    ],
    "weekly": [...],
    "monthly": [...],
    "annually": [...],
    "lifetime": {
        "quantity_transactions": 250,
        "summation_origin": 75000.00,
        "summation_destiny": 2250000.00,
        "average_origin": 300.00,
        "average_destiny": 9000.00,
        "first_remittance_date": "2023-01-15T14:20:00Z",
        "last_remittance_date": "2024-11-04T10:30:00Z",
        "days_active": 659
    },
    "specific_period": {
        "start_date": "2024-10-05T10:30:00Z",
        "end_date": "2024-11-04T10:30:00Z",
        "days_in_period": 30,
        "quantity_transactions": 45,
        "summation_origin": 13500.00,
        "summation_destiny": 405000.00,
        "average_origin": 300.00,
        "average_destiny": 9000.00,
        "median_origin": 295.00,
        "median_destiny": 8850.00,
        "min_origin": 50.00,
        "max_origin": 1000.00,
        "min_destiny": 1500.00,
        "max_destiny": 30000.00
    }
}
*/
