// Hand-written to mirror supabase/schema.sql. If you change the schema,
// update this file to match — or once you have the Supabase CLI set up with
// network access, generate it properly with:
//   npx supabase gen types typescript --project-id <your-project-id> > lib/supabase/types.ts

export type UserRole = "farmer" | "buyer" | "admin";
export type ResourceCategoryDB = "machinery" | "crop_residue";
export type ResourceStatusDB = "available" | "upcoming" | "booked";
export type RequestStatusDB = "open" | "matched" | "closed";
export type BookingStatusDB = "pending" | "confirmed" | "completed" | "cancelled";
export type DemandStatusDB = "open" | "fulfilled" | "closed";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          role: UserRole;
          location: string | null;
          latitude: number | null;
          longitude: number | null;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          phone?: string | null;
          role?: UserRole;
          location?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
        Relationships: [];
      };
      resources: {
        Row: {
          id: string;
          owner_id: string;
          type: string;
          category: ResourceCategoryDB;
          name: string;
          description: string | null;
          quantity: string | null;
          unit: string | null;
          price: number;
          price_unit: string;
          location: string;
          latitude: number | null;
          longitude: number | null;
          available_from: string | null;
          available_until: string | null;
          status: ResourceStatusDB;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          type: string;
          category: ResourceCategoryDB;
          name: string;
          description?: string | null;
          quantity?: string | null;
          unit?: string | null;
          price: number;
          price_unit: string;
          location: string;
          latitude?: number | null;
          longitude?: number | null;
          available_from?: string | null;
          available_until?: string | null;
          status?: ResourceStatusDB;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["resources"]["Insert"]>;
        Relationships: [];
      };
      requests: {
        Row: {
          id: string;
          requester_id: string;
          resource_type: string;
          category: ResourceCategoryDB;
          quantity: string | null;
          budget: string | null;
          required_date: string | null;
          latitude: number | null;
          longitude: number | null;
          status: RequestStatusDB;
          created_at: string;
        };
        Insert: {
          id?: string;
          requester_id: string;
          resource_type: string;
          category: ResourceCategoryDB;
          quantity?: string | null;
          budget?: string | null;
          required_date?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          status?: RequestStatusDB;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["requests"]["Insert"]>;
        Relationships: [];
      };
      bookings: {
        Row: {
          id: string;
          resource_id: string;
          requester_id: string;
          owner_id: string;
          requested_from: string | null;
          requested_until: string | null;
          agreed_price: number | null;
          status: BookingStatusDB;
          created_at: string;
        };
        Insert: {
          id?: string;
          resource_id: string;
          requester_id: string;
          owner_id: string;
          requested_from?: string | null;
          requested_until?: string | null;
          agreed_price?: number | null;
          status?: BookingStatusDB;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["bookings"]["Insert"]>;
        Relationships: [];
      };
      demand_posts: {
        Row: {
          id: string;
          user_id: string;
          resource_type: string;
          category: ResourceCategoryDB;
          quantity: string | null;
          budget: string | null;
          required_date: string | null;
          location: string;
          latitude: number | null;
          longitude: number | null;
          status: DemandStatusDB;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          resource_type: string;
          category: ResourceCategoryDB;
          quantity?: string | null;
          budget?: string | null;
          required_date?: string | null;
          location: string;
          latitude?: number | null;
          longitude?: number | null;
          status?: DemandStatusDB;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["demand_posts"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      resource_category: ResourceCategoryDB;
      resource_status: ResourceStatusDB;
      request_status: RequestStatusDB;
      booking_status: BookingStatusDB;
      demand_status: DemandStatusDB;
    };
    CompositeTypes: Record<string, never>;
  };
}