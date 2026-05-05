import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { phone, code } = await req.json();
  if (!phone || !code) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const { data: otp } = await supabase
    .from('otps')
    .select('*')
    .eq('phone', phone)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!otp) {
    return NextResponse.json({ ok: false, reason: 'expired' }, { status: 401 });
  }

  if (new Date(otp.expires_at) < new Date()) {
    await supabase.from('otps').delete().eq('id', otp.id);
    return NextResponse.json({ ok: false, reason: 'expired' }, { status: 401 });
  }

  if (otp.code !== code.trim()) {
    return NextResponse.json({ ok: false, reason: 'invalid' }, { status: 401 });
  }

  // Upsert user
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('phone', otp.phone)
    .maybeSingle();

  let user;
  if (existingUser) {
    const { data } = await supabase
      .from('users')
      .update({
        logged_in_at: new Date().toISOString(),
        full_phone: otp.full_phone,
        country_code: otp.country_code,
      })
      .eq('id', existingUser.id)
      .select('*')
      .single();
    user = data;
  } else {
    const { data } = await supabase
      .from('users')
      .insert({
        phone: otp.phone,
        full_phone: otp.full_phone,
        country_code: otp.country_code,
      })
      .select('*')
      .single();
    user = data;
  }

  await supabase.from('otps').delete().eq('id', otp.id);
  await supabase.from('country_visits').insert({ country_code: otp.country_code });

  return NextResponse.json({
    ok: true,
    user: {
      id: user!.id,
      phone: user!.phone,
      fullPhone: user!.full_phone,
      countryCode: user!.country_code,
      loggedInAt: user!.logged_in_at,
    },
  });
}
