import { supabase } from "../lib/supabaseClient";

export async function signUp(email: string, password: string, storeName: string, ownerName: string) {
  // store_name/owner_name are read by the handle_new_user() DB trigger from
  // this metadata, since a profiles UPDATE here could race a pending email
  // confirmation (no session yet => RLS would reject it).
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { store_name: storeName, owner_name: ownerName } },
  });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function sendPasswordResetEmail(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
}

export async function updatePassword(password: string) {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
}
