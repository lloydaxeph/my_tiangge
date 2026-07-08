// Hand-written types mirroring supabase/migrations/*.sql.
// If the schema changes, update this file (and, ideally, later swap to
// `supabase gen types typescript` once the Supabase CLI is part of the workflow).

export type PaymentMethod = "cash" | "gcash";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          store_name: string;
          owner_name: string;
          phone: string | null;
          is_admin: boolean;
          is_disabled: boolean;
          gcash_qr_image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["categories"]["Row"]> & {
          user_id: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Row"]>;
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          user_id: string;
          category_id: string | null;
          name: string;
          image_url: string | null;
          barcode: string | null;
          current_stock: number;
          buying_price: number;
          selling_price: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["products"]["Row"]> & {
          user_id: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Row"]>;
        Relationships: [];
      };
      customers: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          phone: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["customers"]["Row"]> & {
          user_id: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["customers"]["Row"]>;
        Relationships: [];
      };
      utang: {
        Row: {
          id: string;
          user_id: string;
          customer_id: string;
          amount: number;
          description: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["utang"]["Row"]> & {
          user_id: string;
          customer_id: string;
          amount: number;
        };
        Update: Partial<Database["public"]["Tables"]["utang"]["Row"]>;
        Relationships: [];
      };
      utang_payments: {
        Row: {
          id: string;
          user_id: string;
          customer_id: string;
          amount: number;
          note: string | null;
          created_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["utang_payments"]["Row"]
        > & {
          user_id: string;
          customer_id: string;
          amount: number;
        };
        Update: Partial<Database["public"]["Tables"]["utang_payments"]["Row"]>;
        Relationships: [];
      };
      sales: {
        Row: {
          id: string;
          user_id: string;
          payment_method: PaymentMethod;
          subtotal: number;
          discount: number;
          total: number;
          amount_tendered: number | null;
          change_given: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["sales"]["Row"]> & {
          user_id: string;
          payment_method: PaymentMethod;
          subtotal: number;
          total: number;
        };
        Update: Partial<Database["public"]["Tables"]["sales"]["Row"]>;
        Relationships: [];
      };
      sale_items: {
        Row: {
          id: string;
          sale_id: string;
          user_id: string;
          product_id: string | null;
          product_name_snapshot: string;
          quantity: number;
          unit_price: number;
          line_total: number;
        };
        Insert: Partial<Database["public"]["Tables"]["sale_items"]["Row"]> & {
          sale_id: string;
          user_id: string;
          product_name_snapshot: string;
          quantity: number;
          unit_price: number;
          line_total: number;
        };
        Update: Partial<Database["public"]["Tables"]["sale_items"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      is_disabled: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      create_sale: {
        Args: {
          p_payment_method: PaymentMethod;
          p_discount: number;
          p_amount_tendered: number | null;
          p_items: { product_id: string; quantity: number; unit_price: number }[];
        };
        Returns: string;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
