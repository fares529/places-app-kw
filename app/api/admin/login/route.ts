import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { password } = await req.json();
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD not configured on server' },
      { status: 500 }
    );
  }

  if (typeof password !== 'string' || password !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  // Return the same password as the bearer token. Client stores it in sessionStorage
  // and sends with `Authorization: Bearer <token>` on subsequent admin requests.
  return NextResponse.json({ ok: true, token: password });
}
