import { NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/db/supabase';

export const dynamic = 'force-dynamic';

const OTP_EXPIRY_MS = 5 * 60 * 1000;

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  const body = await req.json();
  const { phone, fullPhone, countryCode } = body;

  if (!phone || !fullPhone || !countryCode) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const code = generateCode();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);

  await supabase.from('otps').delete().eq('phone', phone);

  const { data, error } = await supabase
    .from('otps')
    .insert({
      phone,
      full_phone: fullPhone,
      country_code: countryCode,
      code,
      expires_at: expiresAt.toISOString(),
    })
    .select('*')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  console.log('\n┌─────────────────────────────────────┐');
  console.log(`│  📱 OTP for ${fullPhone.padEnd(20)}│`);
  console.log(`│  🔑 Code: ${code}                    │`);
  console.log(`│  ⏱️  Expires in 5 minutes              │`);
  console.log('└─────────────────────────────────────┘\n');

  return NextResponse.json({
    ok: true,
    demo: true,
    code,
    otpId: data.id,
    expiresAt: data.expires_at,
  });
}
