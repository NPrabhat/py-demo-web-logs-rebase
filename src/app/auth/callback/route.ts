import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    
    try {
      await supabase.auth.exchangeCodeForSession(code);
      
      // Redirect to dashboard on success
      return NextResponse.redirect(`${origin}/dashboard`);
    } catch (error) {
      console.error('Error exchanging code for session:', error);
      return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_error`);
    }
  }

  // No code, redirect to login
  return NextResponse.redirect(`${origin}/auth/login`);
}
