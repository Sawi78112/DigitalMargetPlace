export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)";
  };
  public: {
    Tables: {
      cart_items: {
        Row: {
          added_at: string;
          cart_id: string;
          id: string;
          product_id: string;
          quantity: number;
        };
        Insert: {
          added_at?: string;
          cart_id: string;
          id?: string;
          product_id: string;
          quantity?: number;
        };
        Update: {
          added_at?: string;
          cart_id?: string;
          id?: string;
          product_id?: string;
          quantity?: number;
        };
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey";
            columns: ["cart_id"];
            isOneToOne: false;
            referencedRelation: "carts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cart_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      carts: {
        Row: {
          created_at: string;
          id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          created_at: string;
          description: string | null;
          icon_url: string | null;
          id: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          icon_url?: string | null;
          id?: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          icon_url?: string | null;
          id?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      customer_activities: {
        Row: {
          activity_type: string;
          created_at: string;
          id: string;
          ip_address: unknown | null;
          metadata: Json | null;
          referrer: string | null;
          resource_id: string | null;
          resource_type: string | null;
          session_id: string;
          user_agent: string | null;
          user_id: string | null;
        };
        Insert: {
          activity_type: string;
          created_at?: string;
          id?: string;
          ip_address?: unknown | null;
          metadata?: Json | null;
          referrer?: string | null;
          resource_id?: string | null;
          resource_type?: string | null;
          session_id: string;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Update: {
          activity_type?: string;
          created_at?: string;
          id?: string;
          ip_address?: unknown | null;
          metadata?: Json | null;
          referrer?: string | null;
          resource_id?: string | null;
          resource_type?: string | null;
          session_id?: string;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          created_at: string;
          download_count: number | null;
          download_expires_at: string | null;
          download_url: string | null;
          id: string;
          max_downloads: number | null;
          order_id: string;
          product_description: string | null;
          product_id: string;
          product_title: string;
          quantity: number;
          seller_id: string;
          store_id: string;
          total_price: number;
          unit_price: number;
        };
        Insert: {
          created_at?: string;
          download_count?: number | null;
          download_expires_at?: string | null;
          download_url?: string | null;
          id?: string;
          max_downloads?: number | null;
          order_id: string;
          product_description?: string | null;
          product_id: string;
          product_title: string;
          quantity?: number;
          seller_id: string;
          store_id: string;
          total_price: number;
          unit_price: number;
        };
        Update: {
          created_at?: string;
          download_count?: number | null;
          download_expires_at?: string | null;
          download_url?: string | null;
          id?: string;
          max_downloads?: number | null;
          order_id?: string;
          product_description?: string | null;
          product_id?: string;
          product_title?: string;
          quantity?: number;
          seller_id?: string;
          store_id?: string;
          total_price?: number;
          unit_price?: number;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_store_id_fkey";
            columns: ["store_id"];
            isOneToOne: false;
            referencedRelation: "stores";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          admin_notes: string | null;
          buyer_id: string;
          buyer_notes: string | null;
          created_at: string;
          id: string;
          order_number: string;
          payment_completed_at: string | null;
          payment_method: string | null;
          payment_transaction_id: string | null;
          status: Database["public"]["Enums"]["order_status"];
          total_amount: number;
          updated_at: string;
        };
        Insert: {
          admin_notes?: string | null;
          buyer_id: string;
          buyer_notes?: string | null;
          created_at?: string;
          id?: string;
          order_number: string;
          payment_completed_at?: string | null;
          payment_method?: string | null;
          payment_transaction_id?: string | null;
          status?: Database["public"]["Enums"]["order_status"];
          total_amount: number;
          updated_at?: string;
        };
        Update: {
          admin_notes?: string | null;
          buyer_id?: string;
          buyer_notes?: string | null;
          created_at?: string;
          id?: string;
          order_number?: string;
          payment_completed_at?: string | null;
          payment_method?: string | null;
          payment_transaction_id?: string | null;
          status?: Database["public"]["Enums"]["order_status"];
          total_amount?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      product_categories: {
        Row: {
          category_id: string;
          created_at: string;
          id: string;
          product_id: string;
        };
        Insert: {
          category_id: string;
          created_at?: string;
          id?: string;
          product_id: string;
        };
        Update: {
          category_id?: string;
          created_at?: string;
          id?: string;
          product_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_categories_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_categories_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_photos: {
        Row: {
          created_at: string;
          display_order: number | null;
          id: string;
          product_id: string;
          storage_path: string;
          type: Database["public"]["Enums"]["photo_type"];
        };
        Insert: {
          created_at?: string;
          display_order?: number | null;
          id?: string;
          product_id: string;
          storage_path: string;
          type: Database["public"]["Enums"]["photo_type"];
        };
        Update: {
          created_at?: string;
          display_order?: number | null;
          id?: string;
          product_id?: string;
          storage_path?: string;
          type?: Database["public"]["Enums"]["photo_type"];
        };
        Relationships: [
          {
            foreignKeyName: "product_photos_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          created_at: string;
          description: string;
          download_count: number | null;
          file_size_bytes: number | null;
          id: string;
          price: number;
          storage_path: string;
          store_id: string;
          title: string;
          updated_at: string;
          visibility: Database["public"]["Enums"]["product_visibility"];
        };
        Insert: {
          created_at?: string;
          description: string;
          download_count?: number | null;
          file_size_bytes?: number | null;
          id?: string;
          price: number;
          storage_path: string;
          store_id: string;
          title: string;
          updated_at?: string;
          visibility?: Database["public"]["Enums"]["product_visibility"];
        };
        Update: {
          created_at?: string;
          description?: string;
          download_count?: number | null;
          file_size_bytes?: number | null;
          id?: string;
          price?: number;
          storage_path?: string;
          store_id?: string;
          title?: string;
          updated_at?: string;
          visibility?: Database["public"]["Enums"]["product_visibility"];
        };
        Relationships: [
          {
            foreignKeyName: "products_store_id_fkey";
            columns: ["store_id"];
            isOneToOne: false;
            referencedRelation: "stores";
            referencedColumns: ["id"];
          },
        ];
      };
      sales_analytics: {
        Row: {
          buyer_country: string | null;
          buyer_id: string;
          created_at: string;
          gross_amount: number;
          id: string;
          order_id: string;
          platform_fee: number | null;
          product_id: string;
          sale_date: string;
          seller_earnings: number;
          seller_id: string;
          store_id: string;
          traffic_source: string | null;
        };
        Insert: {
          buyer_country?: string | null;
          buyer_id: string;
          created_at?: string;
          gross_amount: number;
          id?: string;
          order_id: string;
          platform_fee?: number | null;
          product_id: string;
          sale_date?: string;
          seller_earnings: number;
          seller_id: string;
          store_id: string;
          traffic_source?: string | null;
        };
        Update: {
          buyer_country?: string | null;
          buyer_id?: string;
          created_at?: string;
          gross_amount?: number;
          id?: string;
          order_id?: string;
          platform_fee?: number | null;
          product_id?: string;
          sale_date?: string;
          seller_earnings?: number;
          seller_id?: string;
          store_id?: string;
          traffic_source?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "sales_analytics_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "sales_analytics_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "sales_analytics_store_id_fkey";
            columns: ["store_id"];
            isOneToOne: false;
            referencedRelation: "stores";
            referencedColumns: ["id"];
          },
        ];
      };
      store_blogs: {
        Row: {
          author_id: string;
          content: string;
          cover_image_storage_path: string | null;
          created_at: string;
          excerpt: string | null;
          id: string;
          is_published: boolean | null;
          published_at: string | null;
          store_id: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          author_id: string;
          content: string;
          cover_image_storage_path?: string | null;
          created_at?: string;
          excerpt?: string | null;
          id?: string;
          is_published?: boolean | null;
          published_at?: string | null;
          store_id: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          author_id?: string;
          content?: string;
          cover_image_storage_path?: string | null;
          created_at?: string;
          excerpt?: string | null;
          id?: string;
          is_published?: boolean | null;
          published_at?: string | null;
          store_id?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "store_blogs_store_id_fkey";
            columns: ["store_id"];
            isOneToOne: false;
            referencedRelation: "stores";
            referencedColumns: ["id"];
          },
        ];
      };
      stores: {
        Row: {
          banner_url: string | null;
          created_at: string;
          description: string | null;
          id: string;
          is_active: boolean | null;
          logo_url: string | null;
          name: string;
          owner_id: string;
          updated_at: string;
        };
        Insert: {
          banner_url?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          logo_url?: string | null;
          name: string;
          owner_id: string;
          updated_at?: string;
        };
        Update: {
          banner_url?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          logo_url?: string | null;
          name?: string;
          owner_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      tax_information: {
        Row: {
          acknowledged_certification: boolean;
          country: string;
          created_at: string;
          enabled_newsletter: boolean | null;
          id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          acknowledged_certification: boolean;
          country: string;
          created_at?: string;
          enabled_newsletter?: boolean | null;
          id?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          acknowledged_certification?: boolean;
          country?: string;
          created_at?: string;
          enabled_newsletter?: boolean | null;
          id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      order_status:
        | "pending"
        | "processing"
        | "completed"
        | "cancelled"
        | "refunded";
      photo_type: "cover_photo" | "gallery_photo";
      product_visibility: "visible" | "invisible" | "unlisted";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type ProductVisibility = Enums<"product_visibility">;
export type OrderStatus = Enums<"order_status">;
export type PhotoType = Enums<"photo_type">;

export type Cart = Tables<"carts">;
export type CartItem = Tables<"cart_items">;
export type Category = Tables<"categories">;
export type CustomerActivity = Tables<"customer_activities">;
export type Order = Tables<"orders">;
export type OrderItem = Tables<"order_items">;
export type Product = Tables<"products">;
export type ProductCategory = Tables<"product_categories">;
export type ProductPhoto = Tables<"product_photos">;
export type SalesAnalytics = Tables<"sales_analytics">;
export type Store = Tables<"stores">;
export type StoreBlog = Tables<"store_blogs">;
export type TaxInformation = Tables<"tax_information">;

export type CartInsert = TablesInsert<"carts">;
export type CartItemInsert = TablesInsert<"cart_items">;
export type CategoryInsert = TablesInsert<"categories">;
export type CustomerActivityInsert = TablesInsert<"customer_activities">;
export type OrderInsert = TablesInsert<"orders">;
export type OrderItemInsert = TablesInsert<"order_items">;
export type ProductInsert = TablesInsert<"products">;
export type ProductCategoryInsert = TablesInsert<"product_categories">;
export type ProductPhotoInsert = TablesInsert<"product_photos">;
export type SalesAnalyticsInsert = TablesInsert<"sales_analytics">;
export type StoreInsert = TablesInsert<"stores">;
export type StoreBlogInsert = TablesInsert<"store_blogs">;
export type TaxInformationInsert = TablesInsert<"tax_information">;

export type CartUpdate = TablesUpdate<"carts">;
export type CartItemUpdate = TablesUpdate<"cart_items">;
export type CategoryUpdate = TablesUpdate<"categories">;
export type CustomerActivityUpdate = TablesUpdate<"customer_activities">;
export type OrderUpdate = TablesUpdate<"orders">;
export type OrderItemUpdate = TablesUpdate<"order_items">;
export type ProductUpdate = TablesUpdate<"products">;
export type ProductCategoryUpdate = TablesUpdate<"product_categories">;
export type ProductPhotoUpdate = TablesUpdate<"product_photos">;
export type SalesAnalyticsUpdate = TablesUpdate<"sales_analytics">;
export type StoreUpdate = TablesUpdate<"stores">;
export type StoreBlogUpdate = TablesUpdate<"store_blogs">;
export type TaxInformationUpdate = TablesUpdate<"tax_information">;
