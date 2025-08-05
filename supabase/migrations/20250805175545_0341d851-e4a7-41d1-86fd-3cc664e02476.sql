-- Fix work_days_type check constraint
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_work_days_type_check;
ALTER TABLE public.projects ADD CONSTRAINT projects_work_days_type_check CHECK (work_days_type IN ('calendar', 'business'));

-- Fix company_settings to allow updates instead of inserts only
-- The issue is that upsert is trying to insert when it should update