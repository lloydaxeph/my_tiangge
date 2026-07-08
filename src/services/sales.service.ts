import { supabase } from "../lib/supabaseClient";
import type { CartItem, PaymentMethod, Sale, SaleItem } from "../types/domain";

export async function createSale(
  cart: CartItem[],
  paymentMethod: PaymentMethod,
  discount: number,
  amountTendered: number | null
): Promise<string> {
  const items = cart.map((item) => ({
    product_id: item.product.id,
    quantity: item.quantity,
    unit_price: item.product.selling_price,
  }));

  const { data, error } = await supabase.rpc("create_sale", {
    p_payment_method: paymentMethod,
    p_discount: discount,
    p_amount_tendered: amountTendered,
    p_items: items,
  });
  if (error) throw error;
  return data as string;
}

export async function getSale(id: string): Promise<Sale> {
  const { data, error } = await supabase.from("sales").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

export async function getSaleItems(saleId: string): Promise<SaleItem[]> {
  const { data, error } = await supabase.from("sale_items").select("*").eq("sale_id", saleId);
  if (error) throw error;
  return data;
}

export async function listSales(userId: string): Promise<Sale[]> {
  const { data, error } = await supabase
    .from("sales")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}
