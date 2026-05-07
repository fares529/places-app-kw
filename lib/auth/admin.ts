/**
 * Server-side admin gate.
 * Use at the top of admin-only API routes.
 */
export function requireAdmin(req: Request): Response | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return new Response(
      JSON.stringify({ error: 'ADMIN_PASSWORD not configured on server' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (token !== password) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized — admin access required' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
  return null;
}
