import type { Database, PaymentMethod } from "./database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Customer = Database["public"]["Tables"]["customers"]["Row"];
export type Utang = Database["public"]["Tables"]["utang"]["Row"];
export type UtangPayment = Database["public"]["Tables"]["utang_payments"]["Row"];
export type Sale = Database["public"]["Tables"]["sales"]["Row"];
export type SaleItem = Database["public"]["Tables"]["sale_items"]["Row"];

export type { PaymentMethod };

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerWithBalance extends Customer {
  balance: number;
}
