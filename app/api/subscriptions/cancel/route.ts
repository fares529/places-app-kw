import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/db/supabase';

export const dynamic = 'force-dynamic';

/**
 * Cancel an active subscription. The subscription remains usable until expiry.
 */
export async function POST(req: Request) {
  const { subscriptionId } = await req.json();
  if (!subscriptionId) {
    return NextResponse.json({ error: 'Missing subscriptionId' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .update({ cancelled_at: new Date().toISOString() })
    .eq('id', subscriptionId)
    .eq('status', 'active')
    .select('*')
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Subscription not found or not active' }, { status: 404 });

  return NextResponse.json({ ok: true, subscription: data });
}
