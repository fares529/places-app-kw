import { NextResponse } from 'next/server';
import { makeAdminToken } from '@/lib/auth/admin';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedEmail || !expectedPassword) {
    return NextResponse.json(
      { error: 'Admin credentials not configured on server' },
      { status: 500 }
    );
  }

  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    email.trim().toLowerCase() !== expectedEmail.toLowerCase() ||
    password !== expectedPassword
  ) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const token = makeAdminToken(expectedEmail, expectedPassword);
  return NextResponse.json({ ok: true, token });
}
