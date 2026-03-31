import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PLAN_LIMITS } from '@/lib/constants';
import { isUsageResetNeeded, getFirstDayOfNextMonth } from '@/lib/utils';

export async function GET() {
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
    let resetDate = profile.usage_reset_date;

    if (isUsageResetNeeded(profile.usage_reset_date)) {
      monthlyUsage = 0;
      resetDate = getFirstDayOfNextMonth().toISOString();
      
      // Update profile with reset values
      await supabase
        .from('profiles')
        .update({ 
          monthly_usage: 0, 
          usage_reset_date: resetDate 
        })
        .eq('id', user.id);
    }

    const isPro = profile.plan === 'pro';
    const monthlyLimit = isPro ? -1 : PLAN_LIMITS.free;
    const canGenerate = isPro || monthlyUsage < PLAN_LIMITS.free;

    return NextResponse.json({
      monthlyUsage,
      monthlyLimit,
      isPro,
      resetDate,
      canGenerate,
    });
  } catch (error) {
    console.error('Usage API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
