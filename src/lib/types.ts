// TypeScript types for RepurposeAI

export type FormatKey = 'twitter' | 'linkedin' | 'instagram' | 'email' | 'reddit' | 'takeaways';

export interface Profile {
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
}

export interface RepurposeHistory {
  id: string;
  user_id: string;
  original_content: string;
  content_title: string | null;
  formats_generated: number;
  ai_model_used: string | null;
  generation_time_ms: number | null;
  created_at: string;
}

export interface RepurposeOutput {
  id: string;
  history_id: string;
  user_id: string;
  format: FormatKey;
  label: string;
  emoji: string;
  content: string;
  model_used: string | null;
  tokens_used: number | null;
  created_at: string;
}

export interface FormatConfig {
  label: string;
  emoji: string;
}

export interface RepurposeRequest {
  content: string;
}

export interface GroqGenerationResult {
  format: FormatKey;
  content: string;
  model: string;
  tokens: number;
  success: boolean;
  error?: string;
}

export interface RepurposeApiResponse {
  historyId: string;
  results: GroqGenerationResult[];
  usageRemaining: number;
  isPro: boolean;
}

export interface UsageInfo {
  monthlyUsage: number;
  monthlyLimit: number;
  isPro: boolean;
  resetDate: string;
  canGenerate: boolean;
}

export interface ApiError {
  error: string;
  code?: string;
  details?: unknown;
}

export interface StripeCheckoutResponse {
  url: string;
}

export interface StripePortalResponse {
  url: string;
}
