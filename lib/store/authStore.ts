'use client';

const USER_KEY = 'kpg:user';
const PENDING_KEY = 'kpg:pending-otp';

export interface User {
  id: string;
  phone: string;
  fullPhone: string;
  countryCode: string;
  loggedInAt: string;
}

export interface PendingOTP {
  phone: string;
  fullPhone: string;
  countryCode: string;
  code?: string; // Demo Mode only — backend returns it for in-app display
  expiresAt: string;
}

function isClient() {
  return typeof window !== 'undefined';
}

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    cache: 'no-store',
  });
  if (!res.ok && res.status !== 401) {
    throw new Error(`API ${url} failed: ${res.status}`);
  }
  return res.json();
}

export function getCurrentUser(): User | null {
  if (!isClient()) return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return getCurrentUser() !== null;
}

export async function requestOTP(
  phone: string,
  fullPhone: string,
  countryCode: string
): Promise<PendingOTP> {
  const r = await api<{ ok: true; demo: boolean; code: string; expiresAt: string }>(
    '/api/auth/request-otp',
    {
      method: 'POST',
      body: JSON.stringify({ phone, fullPhone, countryCode }),
    }
  );
  const pending: PendingOTP = {
    phone,
    fullPhone,
    countryCode,
    code: r.code,
    expiresAt: r.expiresAt,
  };
  if (isClient()) {
    localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
  }
  return pending;
}

export function getPendingOTP(): PendingOTP | null {
  if (!isClient()) return null;
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    const pending = JSON.parse(raw) as PendingOTP;
    if (new Date(pending.expiresAt) < new Date()) {
      localStorage.removeItem(PENDING_KEY);
      return null;
    }
    return pending;
  } catch {
    return null;
  }
}

export async function verifyOTP(
  code: string
): Promise<{ ok: true; user: User } | { ok: false; reason: 'expired' | 'invalid' }> {
  const pending = getPendingOTP();
  if (!pending) return { ok: false, reason: 'expired' };

  const r = await api<
    { ok: true; user: User } | { ok: false; reason: 'expired' | 'invalid' }
  >('/api/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ phone: pending.phone, code }),
  });

  if (r.ok) {
    if (isClient()) {
      localStorage.setItem(USER_KEY, JSON.stringify(r.user));
      localStorage.removeItem(PENDING_KEY);
    }
    return { ok: true, user: r.user };
  }
  return r;
}

export function logout() {
  if (!isClient()) return;
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(PENDING_KEY);
}

export function clearPendingOTP() {
  if (!isClient()) return;
  localStorage.removeItem(PENDING_KEY);
}
