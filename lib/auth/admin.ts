/**
 * Server-side admin gate with hardcoded defaults so the app works
 * without env var setup. Override via ADMIN_EMAIL / ADMIN_PASSWORD env vars.
 */

const DEFAULT_ADMIN_EMAIL = 'fares@fares.com';
const DEFAULT_ADMIN_PASSWORD = '123456789';

function adminEmail(): string {
  return process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL;
}

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
}

export function makeAdminToken(email: string, password: string): string {
  return Buffer.from(`${email}:${password}`).toString('base64');
}

export function validateAdminToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    return decoded === `${adminEmail()}:${adminPassword()}`;
  } catch {
    return false;
  }
}

export function validateAdminCredentials(email: string, password: string): boolean {
  return (
    typeof email === 'string' &&
    typeof password === 'string' &&
    email.trim().toLowerCase() === adminEmail().toLowerCase() &&
    password === adminPassword()
  );
}

export function getAdminToken(): string {
  return makeAdminToken(adminEmail(), adminPassword());
}

export function requireAdmin(req: Request): Response | null {
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
