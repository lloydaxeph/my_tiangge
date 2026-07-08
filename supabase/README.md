# Supabase setup

1. Create a free-tier Supabase project. Copy the Project URL and anon public key (Settings -> API) into your `.env` (see `.env.example`).
2. Open the SQL Editor and run the files in `migrations/` **in order**: `0001` -> `0002` -> `0003` -> `0004` -> `0005`.
3. Storage -> create two buckets before running `0005_storage_policies.sql`:
   - `product-images` (Public)
   - `gcash-qr` (Public)
4. Authentication -> URL Configuration: set the Site URL to your deployed app URL (e.g. `https://mytiangge.pages.dev`), and add it plus `http://localhost:5173` to Redirect URLs (needed for the "Forgot Password" email link and `/reset-password`).
5. Sign up your own account through the running app, find your user UUID in Authentication -> Users, then run once in the SQL Editor:
   ```sql
   update public.profiles set is_admin = true where id = '<your-user-uuid>';
   ```
   There is no self-serve way to become admin -- this is intentional.
