# MyTiangge — Developer's README

MyTiangge is a mobile-first POS + inventory + utang (credit) tracker for sari-sari
store owners. This doc is for developers who need to read, debug, or extend the
code. For product/architecture rationale see the plan this was built from; this
file just explains what lives where.

## Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4 + React Router
- **Backend**: Supabase (Auth, Postgres + Row Level Security, Storage) — no custom
  server. The browser talks directly to Supabase; Postgres enforces all
  data-isolation and business rules.
- **Deploy target**: Cloudflare Pages (static SPA)

## Getting started

```bash
npm install
cp .env.example .env   # fill in VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
npm run dev
```

See `supabase/README.md` for one-time Supabase project setup (running migrations,
creating storage buckets, promoting the first admin).

Other scripts: `npm run build` (tsc + vite build), `npm run lint` (oxlint),
`npm run preview` (serve the production build locally).

## How data flows

There is no backend server. Every screen calls a function in `src/services/`,
which calls Supabase directly (PostgREST for tables, an RPC for the one
multi-step operation, Storage for images). Row Level Security policies in
`supabase/migrations/0003_rls_policies.sql` are what actually stop one user from
reading another user's data — client-side checks (`ProtectedRoute`, `AdminRoute`)
are just UX, not the security boundary. If something is leaking data or
wrongly blocking it, look at the RLS policy first, not the React code.

## Folder-by-folder

```
supabase/migrations/   Raw SQL, run once in the Supabase SQL Editor (in order).
src/
  lib/                 Cross-cutting singletons: the Supabase client, route path constants.
  types/                TypeScript types. database.types.ts mirrors the SQL schema by hand.
  contexts/             AuthContext: the one piece of global state (session + profile).
  hooks/                Data-fetching hooks, one per resource. Thin wrappers around services/.
  services/             All Supabase calls live here. Pure functions, no React.
  components/           Reusable UI, grouped by where it's used.
  pages/                One file per route. Composes components/hooks, holds page-level state.
  utils/                Formatting helpers and zod validation schemas.
```

### `supabase/migrations/`

Five files, applied in order:

- `0001_schema.sql` — every table (UUID PKs, FKs to `auth.users`), the
  `payment_method_enum`, and indexes.
- `0002_functions_triggers.sql` — `handle_new_user()` (auto-creates a `profiles`
  row on signup), `is_admin()` / `is_disabled()` (the helpers every RLS policy
  calls), `updated_at` triggers, and a trigger that stops a non-admin from
  flipping their own `is_admin`/`is_disabled` flags.
- `0003_rls_policies.sql` — enables RLS and defines the per-table policies.
  Pattern to remember: `SELECT` = owner OR admin (and not disabled); `INSERT`/
  `UPDATE`/`DELETE` = owner only. `sales`/`sale_items` have no update/delete
  policy at all — see below.
- `0004_create_sale_rpc.sql` — `create_sale()`, a single Postgres function that
  validates stock, inserts the sale + line items, and decrements stock
  atomically. This is the _only_ way sale data is ever written; if a sale looks
  wrong, debug this function, not `sales.service.ts`.
- `0005_storage_policies.sql` — locks Storage writes to `{user_id}/...` folders
  in the `product-images` and `gcash-qr` buckets (both public-read).

### `src/lib/`

- `supabaseClient.ts` — the single `SupabaseClient` instance. Throws on import
  if `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` are missing.
- `routes.ts` — every route path as a named constant/function (`ROUTES.home`,
  `ROUTES.customerDetail(id)`). Don't hardcode path strings elsewhere.

### `src/types/`

- `database.types.ts` — hand-written to mirror the SQL schema, in the same
  shape `@supabase/supabase-js` expects (`Row`/`Insert`/`Update`/`Relationships`
  per table). **If you change the schema, update this file too** — nothing
  generates it automatically yet.
- `domain.ts` — app-level aliases (`Product`, `Customer`, `CartItem`, etc.)
  built on top of `database.types.ts`. Import from here in components/pages,
  not from `database.types.ts` directly.

### `src/contexts/AuthContext.tsx`

Loads the Supabase session on mount, subscribes to `onAuthStateChange`, and
fetches the matching `profiles` row. Exposes `{ session, profile, loading,
refreshProfile, signOut }` via `useAuth()`. This is the only global state in
the app — everything else is fetched per-page.

### `src/hooks/`

One hook per resource (`useProducts`, `useCategories`, `useCustomers`), each
returning `{ data, loading, refresh }`. They call the matching `services/*`
function and re-fetch on demand — there's no caching layer, so calling
`refresh()` after a mutation is how the UI updates. `useBarcodeScanner` is the
odd one out: it wraps the `@zxing/browser` camera lifecycle (starts on mount,
stops on unmount — if the camera stays on after closing a scanner, this hook
is where to look). `useAdminData.ts` holds several small admin-only hooks that
also resolve a `user_id -> store_name` lookup for display.

### `src/services/`

Thin, direct Supabase calls — no business logic beyond shaping the request.
One file per resource (`products.service.ts`, `utang.service.ts`, etc.).
Notable ones:

- `sales.service.ts` — `createSale()` calls the `create_sale` RPC (see
  `0004_create_sale_rpc.sql`); it does not insert into `sales`/`sale_items`
  directly, because RLS blocks that (see above).
- `utang.service.ts` — a customer's balance is _derived_, not stored:
  `sum(utang.amount) - sum(utang_payments.amount)`. There's no "balance"
  column anywhere; if a balance looks wrong, check the charges/payments rows,
  not a cached total.
- `admin.service.ts` — issues plain, unfiltered `select('*')` calls. They only
  return cross-user data because the caller is an admin (RLS's `is_admin()`
  bypass); the same code run as a non-admin returns just their own rows. This
  is intentional — it's how you can prove the admin gate is server-side.
- `storage.service.ts` — shared upload helper used by both the product-image
  and GCash-QR upload flows; writes to `{bucket}/{user_id}/{random}.{ext}`.

### `src/components/`

- `common/` — generic UI: `Button`, `Card`/`CardButton`, `Input`, `Modal`,
  `Spinner`, `EmptyState`, `SearchBar`, `PageHeader`, and
  `BarcodeScannerModal` (shared by Inventory and POS, since both need to read
  a barcode).
- `layout/` — `ProtectedRoute` (redirects to `/login` if no session, or if
  `profile.is_disabled`), `AdminRoute` (additionally requires
  `profile.is_admin`), `AppLayout` (the mobile-width page shell).
- `pos/`, `inventory/`, `customers/`, `admin/` — module-specific pieces used
  only by their matching pages.

### `src/pages/`

One file per route (see `src/App.tsx` for the route table). Pages own
page-level state (form values, modal open/closed) and wire hooks/services to
components. If a screen is behaving wrong, start in its `pages/` file, then
follow the hook/service/RLS chain down.

- `pos/POSPage.tsx` is the most important flow: search/scan → tap products
  into a cart → checkout modal (discount, payment method, cash/change) →
  `createSale()` → redirect to `pos/SaleReceiptPage.tsx`.
- `customers/CustomerDetailPage.tsx` merges `utang` and `utang_payments` into
  one chronological "ledger" for display (see `getLedger()` in
  `utang.service.ts`).

### `src/utils/`

- `currency.ts` — peso formatting (`formatPeso`).
- `date.ts` — date/relative-date formatting (`date-fns` wrappers).
- `validation.ts` — every zod schema, one per form. Forms are plain
  `useState` + validate-on-submit; there's no form library.

## Debugging checklist

- **"User A can see User B's data"** → check the RLS policy for that table in
  `0003_rls_policies.sql`, not the frontend query.
- **"Admin page shows nothing / shows only their own data"** → confirm
  `profiles.is_admin = true` for that account, and that `is_admin()` in
  `0002_functions_triggers.sql` is being hit (it's `SECURITY DEFINER`, so it
  should always resolve regardless of the caller's own row access).
- **"Stock didn't decrement / sale is missing items"** → the whole write path
  is `create_sale()`; check its `raise exception` conditions — a partial
  failure there rolls back the entire sale, so you'd see _no_ sale row at all,
  not a half-written one.
- **"Camera won't open for barcode scanning"** → needs HTTPS (or localhost) and
  camera permission; check `useBarcodeScanner.ts`'s `error` state, and confirm
  `controls.stop()` is actually being called on unmount (leaked camera streams
  show up as "camera already in use" on the next open).
- **"Disabled account can still log in / see data"** → `ProtectedRoute` signs
  the user out client-side on `profile.is_disabled`, but the real block is
  `not is_disabled()` in every RLS policy — test by hitting the REST API
  directly with that user's token, not just through the UI.
