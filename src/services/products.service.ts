import { supabase } from "../lib/supabaseClient";
import type { Product } from "../types/domain";
import { uploadImage } from "./storage.service";

export interface ProductInput {
  name: string;
  categoryId: string | null;
  barcode: string | null;
  currentStock: number;
  buyingPrice: number;
  sellingPrice: number;
  imageUrl: string | null;
}

export async function listProducts(userId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", userId)
    .order("name");
  if (error) throw error;
  return data;
}

export async function getProduct(id: string): Promise<Product> {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

export async function findProductByBarcode(userId: string, barcode: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("user_id", userId)
    .eq("barcode", barcode)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createProduct(userId: string, input: ProductInput): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .insert({
      user_id: userId,
      name: input.name,
      category_id: input.categoryId,
      barcode: input.barcode,
      current_stock: input.currentStock,
      buying_price: input.buyingPrice,
      selling_price: input.sellingPrice,
      image_url: input.imageUrl,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProduct(id: string, input: ProductInput): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .update({
      name: input.name,
      category_id: input.categoryId,
      barcode: input.barcode,
      current_stock: input.currentStock,
      buying_price: input.buyingPrice,
      selling_price: input.sellingPrice,
      image_url: input.imageUrl,
    })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadProductImage(userId: string, file: File): Promise<string> {
  return uploadImage("product-images", userId, file);
}
