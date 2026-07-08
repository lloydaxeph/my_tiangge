-- MyTiangge MVP: core schema
create extension if not exists "pgcrypto"; -- for gen_random_uuid()

create type payment_method_enum as enum ('cash', 'gcash');

-- 1:1 with auth.users
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  store_name text not null default '',
  owner_name text not null default '',
  phone text,
  is_admin boolean not null default false,
  is_disabled boolean not null default false,
  gcash_qr_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  image_url text,
  barcode text,
  current_stock numeric(12, 2) not null default 0,
  buying_price numeric(12, 2) not null default 0,
  selling_price numeric(12, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_products_user on public.products(user_id);
create index idx_products_user_barcode on public.products(user_id, barcode);
create index idx_products_category on public.products(category_id);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  created_at timestamptz not null default now()
);
create index idx_customers_user on public.customers(user_id);

-- Each row = one debt charge for a customer
create table public.utang (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  amount numeric(12, 2) not null check (amount > 0),
  description text,
  created_at timestamptz not null default now()
);
create index idx_utang_customer on public.utang(customer_id);
create index idx_utang_user on public.utang(user_id);

-- Payments reduce a customer's overall running balance (running-tab model,
-- not itemized allocation against specific utang rows -- matches how store
-- owners actually track "suki" debt).
create table public.utang_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  amount numeric(12, 2) not null check (amount > 0),
  note text,
  created_at timestamptz not null default now()
);
create index idx_utang_payments_customer on public.utang_payments(customer_id);
create index idx_utang_payments_user on public.utang_payments(user_id);

create table public.sales (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payment_method payment_method_enum not null,
  subtotal numeric(12, 2) not null,
  discount numeric(12, 2) not null default 0,
  total numeric(12, 2) not null,
  amount_tendered numeric(12, 2),
  change_given numeric(12, 2) not null default 0,
  created_at timestamptz not null default now()
);
create index idx_sales_user_created on public.sales(user_id, created_at desc);

-- user_id is denormalized from sales purely so RLS stays a flat user_id = auth.uid() check
create table public.sale_items (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid not null references public.sales(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name_snapshot text not null,
  quantity numeric(12, 2) not null,
  unit_price numeric(12, 2) not null,
  line_total numeric(12, 2) not null
);
create index idx_sale_items_sale on public.sale_items(sale_id);
create index idx_sale_items_user on public.sale_items(user_id);
