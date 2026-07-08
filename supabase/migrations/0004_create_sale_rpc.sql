-- Atomically creates a sale + its line items and decrements stock.
-- This is the ONLY way sales/sale_items rows are ever written (see the
-- missing update/delete policies and the intentional lack of a direct
-- insert-only client path for sale_items). Running as a single function
-- call means the whole thing is one implicit transaction: any exception
-- rolls back everything written so far, so a sale is always all-or-nothing.
create or replace function public.create_sale(
  p_payment_method payment_method_enum,
  p_discount numeric,
  p_amount_tendered numeric,
  p_items jsonb -- [{ "product_id": "...", "quantity": 2, "unit_price": 15.00 }, ...]
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_sale_id uuid;
  v_subtotal numeric(12, 2) := 0;
  v_total numeric(12, 2);
  v_change numeric(12, 2);
  v_item jsonb;
  v_product public.products%rowtype;
  v_qty numeric;
  v_price numeric;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;
  if public.is_disabled() then
    raise exception 'Account disabled';
  end if;
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Sale must contain at least one item';
  end if;

  -- Pass 1: lock rows and validate stock before writing anything
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := (v_item ->> 'quantity')::numeric;
    if v_qty <= 0 then
      raise exception 'Invalid quantity';
    end if;

    select * into v_product from public.products
      where id = (v_item ->> 'product_id')::uuid and user_id = v_user_id
      for update; -- row lock prevents concurrent oversell

    if not found then
      raise exception 'Product not found or not owned by user';
    end if;
    if v_product.current_stock < v_qty then
      raise exception 'Insufficient stock for %', v_product.name;
    end if;

    v_subtotal := v_subtotal + (v_qty * (v_item ->> 'unit_price')::numeric);
  end loop;

  v_total := v_subtotal - coalesce(p_discount, 0);
  if v_total < 0 then
    raise exception 'Discount exceeds subtotal';
  end if;
  v_change := coalesce(p_amount_tendered, 0) - v_total;

  insert into public.sales (
    user_id, payment_method, subtotal, discount, total, amount_tendered, change_given
  )
  values (
    v_user_id, p_payment_method, v_subtotal, coalesce(p_discount, 0), v_total,
    p_amount_tendered, greatest(v_change, 0)
  )
  returning id into v_sale_id;

  -- Pass 2: write line items and decrement stock
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := (v_item ->> 'quantity')::numeric;
    v_price := (v_item ->> 'unit_price')::numeric;

    insert into public.sale_items (
      sale_id, user_id, product_id, product_name_snapshot, quantity, unit_price, line_total
    )
    select v_sale_id, v_user_id, p.id, p.name, v_qty, v_price, v_qty * v_price
    from public.products p
    where p.id = (v_item ->> 'product_id')::uuid;

    update public.products
      set current_stock = current_stock - v_qty
      where id = (v_item ->> 'product_id')::uuid and user_id = v_user_id;
  end loop;

  return v_sale_id;
end;
$$;

grant execute on function public.create_sale(payment_method_enum, numeric, numeric, jsonb) to authenticated;
