import Groq from 'groq-sdk';
import { GROQ_MODELS, GROQ_CONFIG } from './constants';
import { FormatKey, GroqGenerationResult } from './types';
import { getSystemPrompt, getUserPrompt } from './prompts';
import { delay } from './utils';

const groqPrimary = new Groq({ apiKey: process.env.GROQ_API_KEY });
const groqFallback = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function callGroqWithRetry(
  messages: ChatMessage[],
  retryCount: number = 0,
  useFallback: boolean = false
): Promise<{ content: string; model: string; tokens: number }> {
  const client = useFallback ? groqFallback : groqPrimary;
  const model = useFallback ? GROQ_MODELS.FALLBACK : GROQ_MODELS.PRIMARY;

  try {
    const completion = await client.chat.completions.create({
      messages,
      model,
      max_tokens: GROQ_CONFIG.maxTokens,
      temperature: GROQ_CONFIG.temperature,
    });

    const content = completion.choices[0]?.message?.content || '';
    const tokens = completion.usage?.total_tokens || 0;

    return { content, model, tokens };
  } catch (error) {
    const groqError = error as { status?: number; message?: string };
    const isRateLimit = groqError.status === 429;

    if (isRateLimit && retryCount < GROQ_CONFIG.maxRetries) {
      const backoffMs = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
      await delay(backoffMs);
      return callGroqWithRetry(messages, retryCount + 1, useFallback);
    }

    // Switch to fallback model after 2 failures on primary
    if (!useFallback && retryCount >= 2) {
      await delay(1000);
      return callGroqWithRetry(messages, 0, true);
    }

    if (retryCount >= GROQ_CONFIG.maxRetries) {
      throw new Error(`Groq API failed after ${GROQ_CONFIG.maxRetries} retries: ${groqError.message || 'Unknown error'}`);
    }

    throw error;
  }
}

export async function generateSingleFormat(
  content: string,
  formatKey: FormatKey
): Promise<{ content: string; model: string; tokens: number }> {
  const systemPrompt = getSystemPrompt(formatKey);
  const userPrompt = getUserPrompt(formatKey, content);

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  return callGroqWithRetry(messages);
}

export async function generateAllFormats(
  content: string
): Promise<GroqGenerationResult[]> {
  const formats: FormatKey[] = ['twitter', 'linkedin', 'instagram', 'email', 'reddit', 'takeaways'];
  const results: GroqGenerationResult[] = [];

  // Process in 3 batches of 2 with 2.5s delay between batches
  for (let i = 0; i < formats.length; i += GROQ_CONFIG.batchSize) {
    const batch = formats.slice(i, i + GROQ_CONFIG.batchSize);
    
    // Generate formats in parallel within the batch
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
        const err = error as Error;
        return {
          format,
          content: '',
          model: '',
          tokens: 0,
          success: false,
          error: err.message,
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
