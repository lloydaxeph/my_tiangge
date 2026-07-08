import { supabase } from "../lib/supabaseClient";
import type { Profile } from "../types/domain";
import { uploadImage } from "./storage.service";

export async function getProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(
  userId: string,
  updates: { storeName: string; ownerName: string; phone: string | null }
) {
  const { error } = await supabase
    .from("profiles")
    .update({
      store_name: updates.storeName,
      owner_name: updates.ownerName,
      phone: updates.phone,
    })
    .eq("id", userId);
  if (error) throw error;
}

export async function uploadGcashQr(userId: string, file: File): Promise<string> {
  const url = await uploadImage("gcash-qr", userId, file);
  const { error } = await supabase
    .from("profiles")
    .update({ gcash_qr_image_url: url })
    .eq("id", userId);
  if (error) throw error;
  return url;
}
