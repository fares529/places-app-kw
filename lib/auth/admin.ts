/**
 * Server-side admin gate.
 * Token format: base64(email:password) — sent as `Authorization: Bearer <token>`.
 */
export function makeAdminToken(email: string, password: string): string {
  return Buffer.from(`${email}:${password}`).toString('base64');
}

export function validateAdminToken(token: string): boolean {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return false;
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    return decoded === `${email}:${password}`;
  } catch {
    return false;
  }
}

export function requireAdmin(req: Request): Response | null {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: 'Admin credentials not configured on server' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!validateAdminToken(token)) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized — admin access required' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
  return null;
}
