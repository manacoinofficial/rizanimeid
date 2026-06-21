DROP POLICY IF EXISTS "Anyone can log a visit" ON public.visits;
CREATE POLICY "Log own visit"
  ON public.visits FOR INSERT
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());