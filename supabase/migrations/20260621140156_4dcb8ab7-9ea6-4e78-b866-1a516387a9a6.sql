CREATE TABLE IF NOT EXISTS public.visits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  path text NOT NULL,
  user_agent text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.visits TO authenticated;
GRANT SELECT, INSERT ON public.visits TO anon;
GRANT ALL ON public.visits TO service_role;

ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log a visit"
  ON public.visits FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins and owners can view visits"
  ON public.visits FOR SELECT
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'owner'));

CREATE INDEX IF NOT EXISTS visits_created_at_idx ON public.visits(created_at DESC);
CREATE INDEX IF NOT EXISTS visits_user_id_idx ON public.visits(user_id);