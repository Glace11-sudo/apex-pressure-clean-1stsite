-- The bucket's "public" flag only allows direct object downloads.
-- Listing/reading object metadata (used by storage.list()) is still gated
-- by RLS on storage.objects, so the anon role needs an explicit policy.
create policy "Public can list and read gallery objects"
  on storage.objects
  for select
  to anon
  using (bucket_id = 'gallery');
