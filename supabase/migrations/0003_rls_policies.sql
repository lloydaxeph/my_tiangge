alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.utang enable row level security;
alter table public.utang_payments enable row level security;
alter table public.sales enable row level security;
alter table public.sale_items enable row level security;

-- profiles: own row readable/writable; admin can read + toggle any row
-- (self-escalation on is_admin/is_disabled is still blocked by the
-- protect_profile_admin_fields trigger even under the "own" update policy)
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "profiles_admin_update_any" on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());

-- Reusable pattern for every per-user table below:
--   SELECT: owner OR admin, and caller must not be disabled
--   INSERT/UPDATE/DELETE: owner only, caller must not be disabled
--   (admin is read-only on business data per product requirements)

create policy "categories_select" on public.categories
  for select using (not public.is_disabled() and (auth.uid() = user_id or public.is_admin()));
create policy "categories_insert" on public.categories
  for insert with check (not public.is_disabled() and auth.uid() = user_id);
create policy "categories_update" on public.categories
  for update using (not public.is_disabled() and auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "categories_delete" on public.categories
  for delete using (not public.is_disabled() and auth.uid() = user_id);

create policy "products_select" on public.products
  for select using (not public.is_disabled() and (auth.uid() = user_id or public.is_admin()));
create policy "products_insert" on public.products
  for insert with check (not public.is_disabled() and auth.uid() = user_id);
create policy "products_update" on public.products
  for update using (not public.is_disabled() and auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "products_delete" on public.products
  for delete using (not public.is_disabled() and auth.uid() = user_id);

create policy "customers_select" on public.customers
  for select using (not public.is_disabled() and (auth.uid() = user_id or public.is_admin()));
create policy "customers_insert" on public.customers
  for insert with check (not public.is_disabled() and auth.uid() = user_id);
create policy "customers_update" on public.customers
  for update using (not public.is_disabled() and auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "customers_delete" on public.customers
  for delete using (not public.is_disabled() and auth.uid() = user_id);

create policy "utang_select" on public.utang
  for select using (not public.is_disabled() and (auth.uid() = user_id or public.is_admin()));
create policy "utang_insert" on public.utang
  for insert with check (not public.is_disabled() and auth.uid() = user_id);
create policy "utang_update" on public.utang
  for update using (not public.is_disabled() and auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "utang_delete" on public.utang
  for delete using (not public.is_disabled() and auth.uid() = user_id);

create policy "utang_payments_select" on public.utang_payments
  for select using (not public.is_disabled() and (auth.uid() = user_id or public.is_admin()));
create policy "utang_payments_insert" on public.utang_payments
  for insert with check (not public.is_disabled() and auth.uid() = user_id);
create policy "utang_payments_update" on public.utang_payments
  for update using (not public.is_disabled() and auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "utang_payments_delete" on public.utang_payments
  for delete using (not public.is_disabled() and auth.uid() = user_id);

create policy "sales_select" on public.sales
  for select using (not public.is_disabled() and (auth.uid() = user_id or public.is_admin()));
create policy "sales_insert" on public.sales
  for insert with check (not public.is_disabled() and auth.uid() = user_id);
-- no update/delete policy: sales are immutable history, written only via create_sale()

create policy "sale_items_select" on public.sale_items
  for select using (not public.is_disabled() and (auth.uid() = user_id or public.is_admin()));
create policy "sale_items_insert" on public.sale_items
  for insert with check (not public.is_disabled() and auth.uid() = user_id);
-- no update/delete policy: sale_items are immutable, written only via create_sale()
