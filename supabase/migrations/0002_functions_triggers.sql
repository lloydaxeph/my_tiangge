-- Auto-create a profile row when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, store_name, owner_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'store_name', ''),
    coalesce(new.raw_user_meta_data ->> 'owner_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Role-check helpers used throughout RLS policies below.
-- SECURITY DEFINER lets these read public.profiles regardless of the
-- caller's own row-level access, without granting the caller broader access.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

create or replace function public.is_disabled()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce((select is_disabled from public.profiles where id = auth.uid()), false);
$$;

grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_disabled() to authenticated;

-- updated_at maintenance
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger trg_products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- Defense in depth: even though only admins can UPDATE another user's
-- profile row (see RLS policies), block a user from ever flipping their
-- OWN is_admin/is_disabled flags via a normal profile-edit UPDATE.
create or replace function public.protect_profile_admin_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    new.is_admin := old.is_admin;
    new.is_disabled := old.is_disabled;
  end if;
  return new;
end;
$$;

create trigger trg_protect_profile_admin_fields
  before update on public.profiles
  for each row execute function public.protect_profile_admin_fields();
