-- Add missing contact_person column to company_settings table
ALTER TABLE public.company_settings 
ADD COLUMN contact_person text;