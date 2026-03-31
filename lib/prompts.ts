import { FormatKey } from './types';

export const TWITTER_PROMPT = {
  system: `You are an expert Twitter content creator. Create engaging Twitter threads that capture attention and drive engagement.`,
  user: (content: string) => `Transform the following content into a Twitter thread of 8-12 tweets. Each tweet must be under 280 characters. Use hooks, emojis sparingly, and end with a strong call-to-action or insight.

Content to repurpose:
${content}

Rules:
- 8-12 tweets total
- Each tweet under 280 characters
- First tweet must have a strong hook
- Use numbering (1/8, 2/8, etc.)
- Include relevant emojis but don't overdo it
- Last tweet should have a CTA or key insight
- Use line breaks for readability
- No hashtags in the thread itself`,
};

export const LINKEDIN_PROMPT = {
  system: `You are a professional LinkedIn content strategist. Create posts that establish thought leadership and encourage professional discussion.`,
  user: (content: string) => `Transform the following content into a compelling LinkedIn post.

Content to repurpose:
${content}

Rules:
- Start with a strong hook (first 2 lines visible before "see more")
- Use short paragraphs (1-3 lines each)
- Professional but conversational tone
- Include personal insight or takeaway
- Add 3-5 relevant hashtags at the end
- No emojis in the main content (maybe 1-2 max)
- End with a question to encourage comments
- Keep it under 1300 characters total`,
};

export const INSTAGRAM_PROMPT = {
  system: `You are an Instagram content expert. Create engaging captions that tell stories and build community.`,
  user: (content: string) => `Transform the following content into an Instagram caption.

Content to repurpose:
${content}

Rules:
- Start with an attention-grabbing first line
- Tell a story or share a personal angle
- Use emojis throughout to break up text
- Include line breaks for readability
- End with a question or CTA
- Add 20+ relevant hashtags at the end (after line breaks)
- Keep the main caption under 2200 characters
- Hashtags should be relevant and mix of popular/niche`,
};

export const EMAIL_PROMPT = {
  system: `You are an email marketing expert. Create newsletters that get opened, read, and clicked.`,
  user: (content: string) => `Transform the following content into an email newsletter.

Content to repurpose:
${content}

Rules:
- Write a compelling subject line (under 50 chars)
- Start with a personalized greeting
- Hook in the first sentence
- Break content into clear sections with subheadings
- Use short paragraphs and bullet points
- Include a clear CTA
- Add a P.S. line with additional value
- Professional yet conversational tone
- Keep total under 1500 characters`,
};

export const REDDIT_PROMPT = {
  system: `You are a Reddit community member. Create posts that fit Reddit's casual, authentic style and provide genuine value.`,
  user: (content: string) => `Transform the following content into a Reddit post.

Content to repurpose:
${content}

Rules:
- Write a catchy title (under 100 chars)
- Use casual, authentic tone
- Be transparent and honest
- Include TL;DR at the end
- Ask for community input/questions
- No marketing speak or corporate language
- Format with markdown (bold, lists, etc.)
- Keep main content under 2000 characters`,
};

export const TAKEAWAYS_PROMPT = {
  system: `You are an expert at distilling complex information into clear, actionable insights.`,
  user: (content: string) => `Extract the key takeaways from the following content.

Content to repurpose:
${content}

Rules:
- Create 7-10 bullet points
- Each point should be concise (1-2 sentences)
- Start each point with a relevant emoji
- Focus on actionable insights
- Prioritize the most valuable information
- Use clear, simple language
- No fluff or filler content
- Order by importance or logical flow`,
};

export const PROMPTS: Record<FormatKey, { system: string; user: (content: string) => string }> = {
  twitter: TWITTER_PROMPT,
  linkedin: LINKEDIN_PROMPT,
  instagram: INSTAGRAM_PROMPT,
  email: EMAIL_PROMPT,
  reddit: REDDIT_PROMPT,
  takeaways: TAKEAWAYS_PROMPT,
};
