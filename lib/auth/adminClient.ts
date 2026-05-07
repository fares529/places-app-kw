'use client';

const ADMIN_TOKEN_KEY = 'kpg:admin-token';

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function isAdminAuthed(): boolean {
  return getAdminToken() !== null;
}

export async function adminLogin(password: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      return { ok: false, error: 'كلمة السر غير صحيحة' };
    }
    const data = await res.json();
    if (data.ok && data.token) {
      setAdminToken(data.token);
      return { ok: true };
    }
    return { ok: false, error: 'فشل تسجيل الدخول' };
  } catch {
    return { ok: false, error: 'خطأ في الشبكة' };
  }
}

/**
 * Build headers for admin-authenticated requests.
 * Adds Authorization: Bearer <token> if logged in.
 */
export function adminHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const token = getAdminToken();
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
