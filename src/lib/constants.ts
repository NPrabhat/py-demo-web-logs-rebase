// Constants for RepurposeAI

import { FormatKey, FormatConfig } from './types';

export const GROQ_MODELS = {
  PRIMARY: 'llama-3.3-70b-versatile',
  FALLBACK: 'llama-3.1-8b-instant',
} as const;

export const GROQ_CONFIG = {
  maxTokens: 2048,
  temperature: 0.8,
  batchSize: 2,
  batchDelayMs: 2500,
  maxRetries: 3,
} as const;

export const PLAN_LIMITS = {
  free: 5,
  pro: -1, // unlimited
} as const;

export const FORMATS: FormatKey[] = ['twitter', 'linkedin', 'instagram', 'email', 'reddit', 'takeaways'];

export const FORMAT_CONFIGS: Record<FormatKey, FormatConfig> = {
  twitter: { label: 'Twitter Thread', emoji: '🐦' },
  linkedin: { label: 'LinkedIn Post', emoji: '💼' },
  instagram: { label: 'Instagram Caption', emoji: '📸' },
  email: { label: 'Email Newsletter', emoji: '📧' },
  reddit: { label: 'Reddit Post', emoji: '🤖' },
  takeaways: { label: 'Key Takeaways', emoji: '✨' },
};
