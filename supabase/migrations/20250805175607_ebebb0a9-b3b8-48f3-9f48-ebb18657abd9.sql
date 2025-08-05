-- Update invalid work_days_type values
UPDATE public.projects 
SET work_days_type = 'calendar' 
WHERE work_days_type NOT IN ('calendar', 'business') OR work_days_type IS NULL;

-- Now add the constraint
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_work_days_type_check;
ALTER TABLE public.projects ADD CONSTRAINT projects_work_days_type_check CHECK (work_days_type IN ('calendar', 'business'));