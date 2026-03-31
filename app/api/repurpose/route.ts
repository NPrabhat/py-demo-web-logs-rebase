import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateAllFormats } from '@/lib/groq';
import { generateContentTitle, getFirstDayOfNextMonth } from '@/lib/utils';
import { PLAN_LIMITS, GROQ_MODELS } from '@/lib/constants';
import type { FormatKey } from '@/lib/types';

export async function POST(request: Request) {
  const supabase = await createClient();

  // Auth check
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
  }

  // Check if usage reset is needed
  const now = new Date();
  const resetDate = new Date(profile.usage_reset_date);
  let monthlyUsage = profile.monthly_usage;

  if (resetDate <= now) {
    monthlyUsage = 0;
    await supabase
      .from('profiles')
      .update({
        monthly_usage: 0,
        usage_reset_date: getFirstDayOfNextMonth().toISOString(),
      })
      .eq('id', user.id);
  }

  // Check usage limits
  const limit = profile.plan === 'pro' ? PLAN_LIMITS.pro : PLAN_LIMITS.free;
  if (limit !== -1 && monthlyUsage >= limit) {
    return NextResponse.json(
      { success: false, error: 'Monthly limit exceeded. Upgrade to Pro for unlimited access.' },
      { status: 403 }
    );
  }

  // Parse request
  const { content } = await request.json();

  // Validate content
  if (!content || typeof content !== 'string') {
    return NextResponse.json({ success: false, error: 'Content is required' }, { status: 400 });
  }

  if (content.length < 50 || content.length > 50000) {
    return NextResponse.json(
      { success: false, error: 'Content must be between 50 and 50,000 characters' },
      { status: 400 }
    );
  }

  const startTime = Date.now();

  try {
    // Generate all formats
    const results = await generateAllFormats(content);

    // Filter successful results
    const successfulResults = results.filter(r => r.success);
    
    if (successfulResults.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to generate any formats' },
        { status: 500 }
      );
    }

    // Create history record
    const generationTimeMs = Date.now() - startTime;
    const contentTitle = generateContentTitle(content);
    const primaryModel = results.find(r => r.model.includes('70b'))?.model || GROQ_MODELS.PRIMARY;

    const { data: history, error: historyError } = await supabase
      .from('repurpose_history')
      .insert({
        user_id: user.id,
        original_content: content,
        content_title: contentTitle,
        formats_generated: successfulResults.length,
        ai_model_used: primaryModel,
        generation_time_ms: generationTimeMs,
      })
      .select()
      .single();

    if (historyError) throw historyError;

    // Create output records
    const outputsToInsert = successfulResults.map(result => ({
      history_id: history.id,
      user_id: user.id,
      format: result.format,
      label: result.format.charAt(0).toUpperCase() + result.format.slice(1),
      emoji: result.format === 'twitter' ? '🐦' :
             result.format === 'linkedin' ? '💼' :
             result.format === 'instagram' ? '📸' :
             result.format === 'email' ? '📧' :
             result.format === 'reddit' ? '🤖' : '✨',
      content: result.content,
      model_used: result.model,
      tokens_used: result.tokens,
    }));

    const { error: outputsError } = await supabase
      .from('repurpose_outputs')
      .insert(outputsToInsert);

    if (outputsError) throw outputsError;

    // Increment usage
    await supabase
      .from('profiles')
      .update({ monthly_usage: monthlyUsage + 1 })
      .eq('id', user.id);

    // Format response
    const formattedOutputs = successfulResults.map(result => ({
      format: result.format as FormatKey,
      label: result.format.charAt(0).toUpperCase() + result.format.slice(1),
      emoji: result.format === 'twitter' ? '🐦' :
             result.format === 'linkedin' ? '💼' :
             result.format === 'instagram' ? '📸' :
             result.format === 'email' ? '📧' :
             result.format === 'reddit' ? '🤖' : '✨',
      content: result.content,
      modelUsed: result.model,
      tokensUsed: result.tokens,
    }));

    return NextResponse.json({
      success: true,
      data: {
        historyId: history.id,
        outputs: formattedOutputs,
        generationTimeMs,
        modelUsed: primaryModel,
      },
    });
  } catch (error) {
    console.error('Repurpose error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || 'Generation failed' },
      { status: 500 }
    );
  }
}
