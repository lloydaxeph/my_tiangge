-- Before running this file, create two buckets via Supabase Dashboard -> Storage:
--   product-images  (Public)
--   gcash-qr        (Public)
-- Public read is a deliberate MVP simplicity trade-off: no money moves through
-- the app, product photos aren't sensitive, and the GCash QR is meant to be
-- shown to customers anyway. Writes are still locked to the owner's own folder.
-- Files are stored at {user_id}/{filename}.

create policy "product_images_insert_own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'product-images' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "product_images_update_own" on storage.objects
  for update to authenticated
  using (bucket_id = 'product-images' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "product_images_delete_own" on storage.objects
  for delete to authenticated
  using (bucket_id = 'product-images' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "gcash_qr_insert_own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'gcash-qr' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "gcash_qr_update_own" on storage.objects
  for update to authenticated
  using (bucket_id = 'gcash-qr' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "gcash_qr_delete_own" on storage.objects
  for delete to authenticated
  using (bucket_id = 'gcash-qr' and (storage.foldername(name))[1] = auth.uid()::text);
