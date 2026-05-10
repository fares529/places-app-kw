import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/db/supabase';
import { createCharge, isTapConfigured } from '@/lib/payments/tap';

export const dynamic = 'force-dynamic';

const SUBSCRIPTION_PRICE = 1.0; // 1 KWD
const CURRENCY = 'KWD';

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, redirectBase } = body;

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  // Fetch user for charge metadata
  const { data: user, error: userErr } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (userErr || !user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Check for existing active subscription
  const { data: existing } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  if (existing) {
    return NextResponse.json({
      error: 'Already subscribed',
      subscription: existing,
    }, { status: 409 });
  }

  // Insert pending subscription first
  const { data: sub, error: subErr } = await supabase
    .from('subscriptions')
    .insert({
      user_id: userId,
      status: 'pending',
      amount: SUBSCRIPTION_PRICE,
      currency: CURRENCY,
    })
    .select('*')
    .single();

  if (subErr || !sub) {
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
  }

  // Create Tap charge
  const base = redirectBase || new URL(req.url).origin;
  const callbackUrl = `${base}/subscribe/callback?sub=${sub.id}`;

  try {
    const charge = await createCharge({
      amount: SUBSCRIPTION_PRICE,
      currency: CURRENCY,
      description: 'Kuwait Places Guide — Monthly Subscription',
      customer: {
        name: user.phone,
        phone: user.phone,
        countryCode: user.country_code === 'KW' ? '965' :
                     user.country_code === 'SA' ? '966' :
                     user.country_code === 'AE' ? '971' :
                     user.country_code === 'QA' ? '974' :
                     user.country_code === 'BH' ? '973' :
                     user.country_code === 'OM' ? '968' : '965',
      },
      redirectUrl: callbackUrl,
      metadata: { subscription_id: sub.id, user_id: userId },
    });

    // Update subscription with charge id
    await supabase
      .from('subscriptions')
      .update({
        tap_charge_id: charge.id,
        tap_payment_url: charge.paymentUrl,
      })
      .eq('id', sub.id);

    return NextResponse.json({
      ok: true,
      demo: !isTapConfigured(),
      subscriptionId: sub.id,
      chargeId: charge.id,
      paymentUrl: charge.paymentUrl,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Charge creation failed';
    await supabase
      .from('subscriptions')
      .update({ status: 'failed' })
      .eq('id', sub.id);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
