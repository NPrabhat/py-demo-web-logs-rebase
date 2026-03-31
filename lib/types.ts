export type FormatKey = 'twitter' | 'linkedin' | 'instagram' | 'email' | 'reddit' | 'takeaways';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: 'free' | 'pro';
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: 'active' | 'inactive' | 'canceled' | 'past_due' | null;
  monthly_usage: number;
  usage_reset_date: string;
  created_at: string;
  updated_at: string;
}

export interface RepurposeHistory {
  id: string;
  user_id: string;
  original_content: string;
  content_title: string;
  formats_generated: number;
  ai_model_used: string;
  generation_time_ms: number;
  created_at: string;
  outputs?: RepurposeOutput[];
}

export interface RepurposeOutput {
  id: string;
  history_id: string;
  user_id: string;
  format: FormatKey;
  label: string;
  emoji: string;
  content: string;
  model_used: string;
  tokens_used: number;
  created_at: string;
}

export interface FormatConfig {
  label: string;
  emoji: string;
}

export interface FormatResult {
  format: FormatKey;
  label: string;
  emoji: string;
  content: string;
  modelUsed: string;
  tokensUsed: number;
}

export interface RepurposeRequest {
  content: string;
}

export interface RepurposeApiResponse {
  success: boolean;
  data?: {
    historyId: string;
    outputs: FormatResult[];
    generationTimeMs: number;
    modelUsed: string;
  };
  error?: string;
}

export interface UsageInfo {
  monthlyUsage: number;
  monthlyLimit: number;
  isUnlimited: boolean;
  resetDate: string;
  plan: 'free' | 'pro';
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface GroqGenerationResult {
  format: FormatKey;
  content: string;
  model: string;
  tokens: number;
  success: boolean;
  error?: string;
}

export interface AuthContextType {
  user: { id: string; email: string } | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}
