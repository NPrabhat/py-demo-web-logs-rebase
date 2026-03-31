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
  pro: -1,
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

export const SAMPLE_CONTENT = `Artificial Intelligence is transforming the way we work and live. From automating repetitive tasks to generating creative content, AI tools are becoming indispensable in our daily workflows.

The rise of large language models like Llama 3.3 has opened up new possibilities for content creators, marketers, and businesses. These models can understand context, generate human-like text, and adapt to various writing styles with remarkable accuracy.

One of the most exciting applications of AI is content repurposing. A single piece of content can be transformed into multiple formats optimized for different platforms. What once took hours of manual work can now be accomplished in seconds.

For social media managers, this means being able to maintain a consistent presence across Twitter, LinkedIn, Instagram, and other platforms without burning out. For email marketers, it means turning blog posts into engaging newsletters that drive opens and clicks.

The key to successful AI-assisted content creation is understanding that AI is a tool, not a replacement for human creativity. The best results come from combining AI efficiency with human insight, editing, and personal touch.

As we move forward, expect to see even more sophisticated AI tools that understand nuance, brand voice, and audience preferences. The future of content creation is here, and it's more accessible than ever before.`;
