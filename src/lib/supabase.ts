import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Check your .env.local file.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          long_description: string | null;
          price: number;
          stock: number;
          image_url: string;
          category: string;
          origin: string | null;
          weight_options: string[] | null;
          is_featured: boolean;
          is_active: boolean;
          created_at: string;
          // Extended tea details
          experience: string | null;
          tea_type: string | null;
          flavor_profile: string | null;
          aroma: string | null;
          caffeine_level: string | null;
          benefits: string | null;
          steep_temp: string | null;
          steep_amount: string | null;
          steep_time: string | null;
          steep_resteep: string | null;
          why_choose: string | null;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
          total: number;
          subtotal: number;
          shipping: number;
          line_items: OrderLineItem[];
          shipping_address: ShippingAddress;
          customer_name: string;
          customer_email: string;
          customer_phone: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          role: 'customer' | 'admin';
          phone: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          role?: 'customer' | 'admin';
          phone?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      banners: {
        Row: {
          id: string;
          title: string | null;
          subtitle: string | null;
          image_url: string;
          link_url: string | null;
          link_text: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['banners']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['banners']['Insert']>;
      };
    };
  };
};

export type Product = Database['public']['Tables']['products']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Banner = Database['public']['Tables']['banners']['Row'];

export type OrderLineItem = {
  product_id: string;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
  weight: string;
};

export type ShippingAddress = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
};
