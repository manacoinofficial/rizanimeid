-- Make github columns nullable and add display_name/avatar_url for native auth
ALTER TABLE public.comments ALTER COLUMN github_username DROP NOT NULL;
ALTER TABLE public.comments ALTER COLUMN github_avatar DROP NOT NULL;
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS display_name text;
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS avatar_url text;