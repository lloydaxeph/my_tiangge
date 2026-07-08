import { supabase } from "../lib/supabaseClient";
import type { Product, Profile, Sale, Utang, UtangPayment } from "../types/domain";

// These issue plain, unfiltered selects -- the `is_admin()` RLS bypass (see
// supabase/migrations/0003_rls_policies.sql) is what makes them return every
// user's rows. If the caller isn't actually an admin, the exact same query
// would just return their own rows, since Postgres enforces this, not the UI.

export async function listAllUsers(): Promise<Profile[]> {
  const { data, error } = await supabase.from("profiles").select("*").order("created_at");
  if (error) throw error;
  return data;
}

export async function setUserDisabled(userId: string, disabled: boolean): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ is_disabled: disabled })
    .eq("id", userId);
  if (error) throw error;
}

export async function listAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function listAllUtang(): Promise<{ charges: Utang[]; payments: UtangPayment[] }> {
  const [{ data: charges, error: chargesError }, { data: payments, error: paymentsError }] =
    await Promise.all([
      supabase.from("utang").select("*").order("created_at", { ascending: false }),
      supabase.from("utang_payments").select("*").order("created_at", { ascending: false }),
    ]);
  if (chargesError) throw chargesError;
  if (paymentsError) throw paymentsError;
  return { charges, payments };
}

export async function listAllSales(): Promise<Sale[]> {
  const { data, error } = await supabase
    .from("sales")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}
