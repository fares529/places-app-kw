import { NextResponse } from 'next/server';
import { validateAdminCredentials, getAdminToken } from '@/lib/auth/admin';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!validateAdminCredentials(email, password)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  return NextResponse.json({ ok: true, token: getAdminToken() });
}
