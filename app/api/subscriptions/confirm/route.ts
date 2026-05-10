import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/db/supabase';
import { retrieveCharge } from '@/lib/payments/tap';

export const dynamic = 'force-dynamic';

const MONTH_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Called by frontend after Tap redirect.
 * Verifies the charge with Tap, then activates the subscription.
 */
export async function POST(req: Request) {
  const { subscriptionId } = await req.json();

  if (!subscriptionId) {
    return NextResponse.json({ error: 'Missing subscriptionId' }, { status: 400 });
  }

  const { data: sub, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('id', subscriptionId)
    .maybeSingle();

  if (error || !sub) {
    return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
  }

  if (sub.status === 'active') {
    return NextResponse.json({ ok: true, status: 'active', subscription: sub });
  }

  if (!sub.tap_charge_id) {
    return NextResponse.json({ error: 'No charge to verify' }, { status: 400 });
  }

  try {
    const charge = await retrieveCharge(sub.tap_charge_id);
    const success = ['CAPTURED', 'AUTHORIZED'].includes(charge.status);

    if (success) {
      const now = new Date();
      const expires = new Date(now.getTime() + MONTH_MS);
      const { data: updated } = await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          started_at: now.toISOString(),
          expires_at: expires.toISOString(),
        })
        .eq('id', subscriptionId)
        .select('*')
        .single();
      return NextResponse.json({ ok: true, status: 'active', subscription: updated });
    }

    if (['FAILED', 'DECLINED', 'RESTRICTED', 'ABANDONED', 'CANCELLED'].includes(charge.status)) {
      await supabase.from('subscriptions').update({ status: 'failed' }).eq('id', subscriptionId);
      return NextResponse.json({ ok: false, status: 'failed', tapStatus: charge.status });
    }

    return NextResponse.json({ ok: false, status: 'pending', tapStatus: charge.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Verify failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
