-- Add currency column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS currency text DEFAULT 'BYN';