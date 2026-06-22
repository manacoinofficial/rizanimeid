
-- Realtime for visits
ALTER TABLE public.visits REPLICA IDENTITY FULL;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='visits'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.visits';
  END IF;
END$$;

-- Profile banner fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS banner_url text,
  ADD COLUMN IF NOT EXISTS banner_type text CHECK (banner_type IN ('image','video'));

-- Allow public read of profile basics (avatar/banner) for display
DROP POLICY IF EXISTS "Public profiles are viewable" ON public.profiles;
CREATE POLICY "Public profiles are viewable"
  ON public.profiles
  FOR SELECT
  USING (true);

GRANT SELECT ON public.profiles TO anon;
