export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          plan: 'free' | 'pro';
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          subscription_status: 'active' | 'inactive' | 'canceled' | 'past_due';
          monthly_usage: number;
          usage_reset_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          plan?: 'free' | 'pro';
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_status?: 'active' | 'inactive' | 'canceled' | 'past_due';
          monthly_usage?: number;
          usage_reset_date?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          plan?: 'free' | 'pro';
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_status?: 'active' | 'inactive' | 'canceled' | 'past_due';
          monthly_usage?: number;
          usage_reset_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      repurpose_history: {
        Row: {
          id: string;
          user_id: string;
          original_content: string;
          content_title: string | null;
          formats_generated: number;
          ai_model_used: string | null;
          generation_time_ms: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          original_content: string;
          content_title?: string | null;
          formats_generated?: number;
          ai_model_used?: string | null;
          generation_time_ms?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          original_content?: string;
          content_title?: string | null;
          formats_generated?: number;
          ai_model_used?: string | null;
          generation_time_ms?: number | null;
          created_at?: string;
        };
      };
      repurpose_outputs: {
        Row: {
          id: string;
          history_id: string;
          user_id: string;
          format: 'twitter' | 'linkedin' | 'instagram' | 'email' | 'reddit' | 'takeaways';
          label: string;
          emoji: string;
          content: string;
          model_used: string | null;
          tokens_used: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          history_id: string;
          user_id: string;
          format: 'twitter' | 'linkedin' | 'instagram' | 'email' | 'reddit' | 'takeaways';
          label: string;
          emoji: string;
          content: string;
          model_used?: string | null;
          tokens_used?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          history_id?: string;
          user_id?: string;
          format?: 'twitter' | 'linkedin' | 'instagram' | 'email' | 'reddit' | 'takeaways';
          label?: string;
          emoji?: string;
          content?: string;
          model_used?: string | null;
          tokens_used?: number | null;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {
      reset_monthly_usage: {
        Args: Record<string, never>;
        Returns: void;
      };
    };
    Enums: {};
  };
}
