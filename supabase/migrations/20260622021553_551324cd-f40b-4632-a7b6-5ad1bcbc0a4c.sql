
-- Read profile-media publicly (so avatars/banners can be displayed)
DROP POLICY IF EXISTS "profile-media public read" ON storage.objects;
CREATE POLICY "profile-media public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-media');

-- Users can upload to their own folder (path starts with their uid)
DROP POLICY IF EXISTS "profile-media user upload" ON storage.objects;
CREATE POLICY "profile-media user upload"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'profile-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "profile-media user update" ON storage.objects;
CREATE POLICY "profile-media user update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'profile-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "profile-media user delete" ON storage.objects;
CREATE POLICY "profile-media user delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'profile-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
