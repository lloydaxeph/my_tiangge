import { z } from "zod";

export const signUpSchema = z
  .object({
    storeName: z.string().trim().min(1, "Store name is required"),
    ownerName: z.string().trim().min(1, "Your name is required"),
    email: z.string().trim().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  })
  .strict();

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const productSchema = z.object({
  name: z.string().trim().min(1, "Product name is required"),
  categoryId: z.string().nullable(),
  barcode: z.string().trim().nullable(),
  currentStock: z.coerce.number().min(0, "Stock cannot be negative"),
  buyingPrice: z.coerce.number().min(0, "Price cannot be negative"),
  sellingPrice: z.coerce.number().min(0, "Price cannot be negative"),
});

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required"),
});

export const customerSchema = z.object({
  name: z.string().trim().min(1, "Customer name is required"),
  phone: z.string().trim().nullable(),
});

export const utangSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  description: z.string().trim().nullable(),
});

export const paymentSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  note: z.string().trim().nullable(),
});

export const profileSchema = z.object({
  storeName: z.string().trim().min(1, "Store name is required"),
  ownerName: z.string().trim().min(1, "Your name is required"),
  phone: z.string().trim().nullable(),
});
