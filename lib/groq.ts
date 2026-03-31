import Groq from 'groq-sdk';
import { GROQ_MODELS, GROQ_CONFIG } from './constants';
import { PROMPTS } from './prompts';
import type { FormatKey, GroqGenerationResult } from './types';

const groqPrimary = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function callGroqWithRetry(
  messages: Array<{ role: string; content: string }>,
  retryCount: number = 0,
  useFallback: boolean = false
): Promise<{ content: string; model: string; tokens: number }> {
  const model = useFallback ? GROQ_MODELS.FALLBACK : GROQ_MODELS.PRIMARY;
  const maxRetries = GROQ_CONFIG.maxRetries;

  try {
    const completion = await groqPrimary.chat.completions.create({
      model,
      messages,
      max_tokens: GROQ_CONFIG.maxTokens,
      temperature: GROQ_CONFIG.temperature,
    });

    const content = completion.choices[0]?.message?.content || '';
    const tokens = completion.usage?.total_tokens || 0;

    return { content, model, tokens };
  } catch (error) {
    const isRateLimit = (error as any)?.status === 429;
    
    if (retryCount < maxRetries) {
      const backoffDelay = Math.pow(2, retryCount) * 1000;
      await delay(backoffDelay);
      
      // Switch to fallback after 2 failures with primary
      const shouldUseFallback = !useFallback && retryCount >= 1;
      
      return callGroqWithRetry(messages, retryCount + 1, shouldUseFallback);
    }

    throw error;
  }
}

export async function generateSingleFormat(
  content: string,
  formatKey: FormatKey
): Promise<{ content: string; model: string; tokens: number }> {
  const prompt = PROMPTS[formatKey];
  
  const messages = [
    { role: 'system', content: prompt.system },
    { role: 'user', content: prompt.user(content) },
  ];

  return callGroqWithRetry(messages);
}

export async function generateAllFormats(
  content: string
): Promise<GroqGenerationResult[]> {
  const formats: FormatKey[] = ['twitter', 'linkedin', 'instagram', 'email', 'reddit', 'takeaways'];
  const results: GroqGenerationResult[] = [];

  // Process in batches of 2 with delays between batches
  for (let i = 0; i < formats.length; i += GROQ_CONFIG.batchSize) {
    const batch = formats.slice(i, i + GROQ_CONFIG.batchSize);
    
    const batchPromises = batch.map(async (format) => {
      try {
        const result = await generateSingleFormat(content, format);
        return {
          format,
          content: result.content,
          model: result.model,
          tokens: result.tokens,
          success: true,
        } as GroqGenerationResult;
      } catch (error) {
        return {
          format,
          content: '',
          model: GROQ_MODELS.FALLBACK,
          tokens: 0,
          success: false,
          error: (error as Error).message,
        } as GroqGenerationResult;
      }
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Add delay between batches (except after the last batch)
    if (i + GROQ_CONFIG.batchSize < formats.length) {
      await delay(GROQ_CONFIG.batchDelayMs);
    }
  }

  return results;
}
