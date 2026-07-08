import { supabase } from "../lib/supabaseClient";
import type { Customer, Utang, UtangPayment } from "../types/domain";

export interface LedgerEntry {
  id: string;
  type: "charge" | "payment";
  amount: number;
  note: string | null;
  createdAt: string;
}

export async function addUtang(
  userId: string,
  customerId: string,
  amount: number,
  description: string | null
): Promise<Utang> {
  const { data, error } = await supabase
    .from("utang")
    .insert({ user_id: userId, customer_id: customerId, amount, description })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function addPayment(
  userId: string,
  customerId: string,
  amount: number,
  note: string | null
): Promise<UtangPayment> {
  const { data, error } = await supabase
    .from("utang_payments")
    .insert({ user_id: userId, customer_id: customerId, amount, note })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getCustomerBalance(customerId: string): Promise<number> {
  const [{ data: charges, error: chargesError }, { data: payments, error: paymentsError }] =
    await Promise.all([
      supabase.from("utang").select("amount").eq("customer_id", customerId),
      supabase.from("utang_payments").select("amount").eq("customer_id", customerId),
    ]);
  if (chargesError) throw chargesError;
  if (paymentsError) throw paymentsError;

  const totalCharges = charges.reduce((sum, c) => sum + Number(c.amount), 0);
  const totalPayments = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  return totalCharges - totalPayments;
}

export async function getLedger(customerId: string): Promise<LedgerEntry[]> {
  const [{ data: charges, error: chargesError }, { data: payments, error: paymentsError }] =
    await Promise.all([
      supabase.from("utang").select("*").eq("customer_id", customerId),
      supabase.from("utang_payments").select("*").eq("customer_id", customerId),
    ]);
  if (chargesError) throw chargesError;
  if (paymentsError) throw paymentsError;

  const entries: LedgerEntry[] = [
    ...charges.map((c) => ({
      id: c.id,
      type: "charge" as const,
      amount: c.amount,
      note: c.description,
      createdAt: c.created_at,
    })),
    ...payments.map((p) => ({
      id: p.id,
      type: "payment" as const,
      amount: p.amount,
      note: p.note,
      createdAt: p.created_at,
    })),
  ];

  return entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export interface CustomerBalance {
  customer: Customer;
  balance: number;
  oldestChargeDate: string | null;
}

export async function listCustomerBalances(userId: string): Promise<CustomerBalance[]> {
  const [{ data: customers, error: customersError }, { data: charges, error: chargesError }, { data: payments, error: paymentsError }] =
    await Promise.all([
      supabase.from("customers").select("*").eq("user_id", userId),
      supabase.from("utang").select("customer_id, amount, created_at").eq("user_id", userId),
      supabase.from("utang_payments").select("customer_id, amount").eq("user_id", userId),
    ]);
  if (customersError) throw customersError;
  if (chargesError) throw chargesError;
  if (paymentsError) throw paymentsError;

  return customers.map((customer) => {
    const customerCharges = charges.filter((c) => c.customer_id === customer.id);
    const totalCharges = customerCharges.reduce((sum, c) => sum + Number(c.amount), 0);
    const totalPayments = payments
      .filter((p) => p.customer_id === customer.id)
      .reduce((sum, p) => sum + Number(p.amount), 0);
    const oldestChargeDate = customerCharges.length
      ? customerCharges.reduce((oldest, c) => (c.created_at < oldest ? c.created_at : oldest), customerCharges[0].created_at)
      : null;

    return { customer, balance: totalCharges - totalPayments, oldestChargeDate };
  });
}
