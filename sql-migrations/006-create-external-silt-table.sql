-- Migration: Create table for external SILT verification flows
-- Date: 2026-01-14
-- Purpose: Store SILT verification data from external flows (Venezolanos.es, R-CONECTA, ChilePoz, EuropaChilePoz)
-- These records are NOT linked to users in our database

-- ============================================================================
-- Create table for external SILT records
-- ============================================================================

CREATE TABLE IF NOT EXISTS sec_cust.lnk_external_silt_data (
    id_external_silt BIGSERIAL PRIMARY KEY,
    flow_name VARCHAR(100) NOT NULL,  -- 'Venezolanos.es', 'R-CONECTA', 'ChilePoz', 'EuropaChilePoz'
    public_id UUID NOT NULL,  -- SILT public_id (the ID used in API calls)
    silt_data JSONB NOT NULL,  -- Full JSON response from SILT API
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date_modification TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    active BOOLEAN DEFAULT TRUE,
    CONSTRAINT unique_flow_public_id UNIQUE (flow_name, public_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_external_silt_flow ON sec_cust.lnk_external_silt_data(flow_name);
CREATE INDEX IF NOT EXISTS idx_external_silt_public_id ON sec_cust.lnk_external_silt_data(public_id);
CREATE INDEX IF NOT EXISTS idx_external_silt_date ON sec_cust.lnk_external_silt_data(date_creation DESC);
CREATE INDEX IF NOT EXISTS idx_external_silt_active ON sec_cust.lnk_external_silt_data(active) WHERE active = TRUE;

-- Add comments
COMMENT ON TABLE sec_cust.lnk_external_silt_data IS 'Stores SILT verification data from external flows not linked to internal users';
COMMENT ON COLUMN sec_cust.lnk_external_silt_data.flow_name IS 'External flow identifier (Venezolanos.es, R-CONECTA, ChilePoz, EuropaChilePoz)';
COMMENT ON COLUMN sec_cust.lnk_external_silt_data.public_id IS 'SILT public_id used in API endpoint /users/{public_id}/status';
COMMENT ON COLUMN sec_cust.lnk_external_silt_data.silt_data IS 'Complete JSON response from SILT API including user data, documents, and image URLs';

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON sec_cust.lnk_external_silt_data TO prod_role_be_bh;
GRANT USAGE, SELECT ON SEQUENCE sec_cust.lnk_external_silt_data_id_external_silt_seq TO prod_role_be_bh;

SELECT 'Migration 006 completed: Created lnk_external_silt_data table for external SILT flows' as status;
