export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string;
          created_at: string;
          status: string;
          channel: string;
          customer_email: string;
          amount_total: number;
          currency: string;
          stripe_payment_intent_id: string | null;
          stripe_checkout_session_id: string | null;
          line_items: Json;
          metadata: Json;
        };
        Insert: {
          id?: string;
          created_at?: string;
          status: string;
          channel: string;
          customer_email: string;
          amount_total: number;
          currency: string;
          stripe_payment_intent_id?: string | null;
          stripe_checkout_session_id?: string | null;
          line_items?: Json;
          metadata?: Json;
        };
        Update: {
          id?: string;
          created_at?: string;
          status?: string;
          channel?: string;
          customer_email?: string;
          amount_total?: number;
          currency?: string;
          stripe_payment_intent_id?: string | null;
          stripe_checkout_session_id?: string | null;
          line_items?: Json;
          metadata?: Json;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
