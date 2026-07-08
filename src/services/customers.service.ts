import { supabase } from "../lib/supabaseClient";
import type { Customer } from "../types/domain";

export async function listCustomers(userId: string): Promise<Customer[]> {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("user_id", userId)
    .order("name");
  if (error) throw error;
  return data;
}

export async function getCustomer(id: string): Promise<Customer> {
  const { data, error } = await supabase.from("customers").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

export async function createCustomer(
  userId: string,
  name: string,
  phone: string | null
): Promise<Customer> {
  const { data, error } = await supabase
    .from("customers")
    .insert({ user_id: userId, name, phone })
    .select()
    .single();
  if (error) throw error;
  return data;
}
