export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          image_url: string;
          category: 'Vinyl';
          tags: string[];
          color: string;
          stock: number;
          is_active: boolean;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          image_url: string;
          category: 'Vinyl';
          tags?: string[];
          color?: string;
          stock?: number;
          is_active?: boolean;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          image_url?: string;
          category?: 'Vinyl';
          tags?: string[];
          color?: string;
          stock?: number;
          is_active?: boolean;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          shipping_address: string;
          shipping_city: string;
          shipping_province: string;
          shipping_zip: string;
          shipping_region: string;
          items: OrderItem[];
          subtotal: number;
          shipping_fee: number;
          total: number;
          payment_method: string | null;
          payment_id: string | null;
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
          order_status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          shipping_address: string;
          shipping_city: string;
          shipping_province: string;
          shipping_zip: string;
          shipping_region: string;
          items: OrderItem[];
          subtotal: number;
          shipping_fee: number;
          total: number;
          payment_method?: string | null;
          payment_id?: string | null;
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
          order_status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          shipping_address?: string;
          shipping_city?: string;
          shipping_province?: string;
          shipping_zip?: string;
          shipping_region?: string;
          items?: OrderItem[];
          subtotal?: number;
          shipping_fee?: number;
          total?: number;
          payment_method?: string | null;
          payment_id?: string | null;
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded';
          order_status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: 'admin' | 'manager';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: 'admin' | 'manager';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: 'admin' | 'manager';
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

export type Product = Database['public']['Tables']['products']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type UserRole = Database['public']['Tables']['user_roles']['Row'];
