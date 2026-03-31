import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    
    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Fetch history by id with outputs
    const { data: history, error: historyError } = await supabase
      .from('repurpose_history')
      .select(`
        *,
        repurpose_outputs (
          id,
          format,
          label,
          emoji,
          content,
          model_used,
          tokens_used,
          created_at
        )
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (historyError || !history) {
      return NextResponse.json({ error: 'History not found' }, { status: 404 });
    }

    return NextResponse.json({ history });
  } catch (error) {
    console.error('History detail API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    
    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership before delete
    const { data: history } = await supabase
      .from('repurpose_history')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!history) {
      return NextResponse.json({ error: 'History not found' }, { status: 404 });
    }

    // Use admin client for cascade delete
    const adminSupabase = createAdminClient();

    // Delete outputs first (cascade should handle this, but being explicit)
    await adminSupabase
      .from('repurpose_outputs')
      .delete()
      .eq('history_id', id);

    // Delete history
    const { error: deleteError } = await adminSupabase
      .from('repurpose_history')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting history:', deleteError);
      return NextResponse.json({ error: 'Failed to delete history' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('History delete API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
