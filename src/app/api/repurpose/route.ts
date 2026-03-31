import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateAllFormats } from '@/lib/groq';
import { createAdminClient } from '@/lib/supabase/admin';
import { PLAN_LIMITS, FORMAT_CONFIGS, FORMATS } from '@/lib/constants';
import { generateContentTitle, isUsageResetNeeded, getFirstDayOfNextMonth } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Check if usage reset is needed
    let monthlyUsage = profile.monthly_usage;
    let usageResetDate = profile.usage_reset_date;

    if (isUsageResetNeeded(profile.usage_reset_date)) {
      monthlyUsage = 0;
      usageResetDate = getFirstDayOfNextMonth().toISOString();
      
      // Update profile with reset values
      await supabase
        .from('profiles')
        .update({ 
          monthly_usage: 0, 
          usage_reset_date: usageResetDate 
        })
        .eq('id', user.id);
    }

    // Check usage limits
    const isPro = profile.plan === 'pro';
    const limit = isPro ? PLAN_LIMITS.pro : PLAN_LIMITS.free;
    
    if (!isPro && monthlyUsage >= limit) {
      return NextResponse.json(
        { error: 'Monthly limit reached. Upgrade to Pro for unlimited repurposes.' },
        { status: 429 }
      );
    }

    // Parse request body
    const { content } = await request.json();

    // Validate content
    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    if (content.length < 50 || content.length > 50000) {
      return NextResponse.json(
        { error: 'Content must be between 50 and 50,000 characters' },
        { status: 400 }
      );
    }

    // Generate all formats using Groq
    const startTime = Date.now();
    const results = await generateAllFormats(content);
    const generationTimeMs = Date.now() - startTime;

    // Check if at least one format was successful
    const successfulResults = results.filter(r => r.success);
    if (successfulResults.length === 0) {
      return NextResponse.json(
        { error: 'Failed to generate any formats. Please try again.' },
        { status: 500 }
      );
    }

    // Use admin client to bypass RLS for batch insert
    const adminSupabase = createAdminClient();

    // Create history record
    const historyId = crypto.randomUUID();
    const contentTitle = generateContentTitle(content);
    const primaryModel = results[0]?.model || '';

    const { error: historyError } = await adminSupabase
      .from('repurpose_history')
      .insert({
        id: historyId,
        user_id: user.id,
        original_content: content,
        content_title: contentTitle,
        formats_generated: successfulResults.length,
        ai_model_used: primaryModel,
        generation_time_ms: generationTimeMs,
      });

    if (historyError) {
      console.error('Error creating history:', historyError);
      throw new Error('Failed to save history');
    }

    // Create output records
    const outputsToInsert = successfulResults.map(result => ({
      history_id: historyId,
      user_id: user.id,
      format: result.format,
      label: FORMAT_CONFIGS[result.format].label,
      emoji: FORMAT_CONFIGS[result.format].emoji,
      content: result.content,
      model_used: result.model,
      tokens_used: result.tokens,
    }));

    const { error: outputsError } = await adminSupabase
      .from('repurpose_outputs')
      .insert(outputsToInsert);

    if (outputsError) {
      console.error('Error creating outputs:', outputsError);
      throw new Error('Failed to save outputs');
    }

    // Increment monthly usage
    const newUsage = monthlyUsage + 1;
    const { error: updateError } = await adminSupabase
      .from('profiles')
      .update({ monthly_usage: newUsage })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating usage:', updateError);
    }

    // Calculate remaining usage
    const usageRemaining = isPro ? -1 : Math.max(0, limit - newUsage);

    return NextResponse.json({
      historyId,
      results: successfulResults,
      usageRemaining,
      isPro,
    });
  } catch (error) {
    console.error('Repurpose API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
