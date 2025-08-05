-- Update company_settings table with new simplified structure
-- Drop old columns that are not needed
ALTER TABLE public.company_settings 
DROP COLUMN IF EXISTS legal_name,
DROP COLUMN IF EXISTS contact_person_position_genitive,
DROP COLUMN IF EXISTS contact_person_authorities_prepositional,
DROP COLUMN IF EXISTS address,
DROP COLUMN IF EXISTS tax_id,
DROP COLUMN IF EXISTS registration_number,
DROP COLUMN IF EXISTS bank_name,
DROP COLUMN IF EXISTS bank_account,
DROP COLUMN IF EXISTS bank_routing,
DROP COLUMN IF EXISTS website,
DROP COLUMN IF EXISTS document_prefix,
DROP COLUMN IF EXISTS act_prefix,
DROP COLUMN IF EXISTS contract_prefix,
DROP COLUMN IF EXISTS logo_url;

-- Add new columns
ALTER TABLE public.company_settings 
ADD COLUMN IF NOT EXISTS country text DEFAULT 'Беларусь',
ADD COLUMN IF NOT EXISTS bank_details text;