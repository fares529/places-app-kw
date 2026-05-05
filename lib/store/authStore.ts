'use client';

const USER_KEY = 'kpg:user';
const OTP_KEY = 'kpg:pending-otp';

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

export interface User {
  phone: string;       // raw digits (no dial code)
  fullPhone: string;   // dial + phone
  countryCode: string; // 'KW', 'SA', etc.
  loggedInAt: string;
}

export interface PendingOTP {
  code: string;
  phone: string;
  fullPhone: string;
  countryCode: string;
  createdAt: number;
}

function isClient() {
  return typeof window !== 'undefined';
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

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function requestOTP(phone: string, fullPhone: string, countryCode: string): PendingOTP {
  const otp: PendingOTP = {
    code: generateCode(),
    phone,
    fullPhone,
    countryCode,
    createdAt: Date.now(),
  };
  if (isClient()) {
    localStorage.setItem(OTP_KEY, JSON.stringify(otp));
  }
  return otp;
}

export function getPendingOTP(): PendingOTP | null {
  if (!isClient()) return null;
  try {
    const raw = localStorage.getItem(OTP_KEY);
    if (!raw) return null;
    const otp = JSON.parse(raw) as PendingOTP;
    if (Date.now() - otp.createdAt > OTP_EXPIRY_MS) {
      localStorage.removeItem(OTP_KEY);
      return null;
    }
    return otp;
  } catch {
    return null;
  }
}

export function verifyOTP(code: string): { ok: true; user: User } | { ok: false; reason: 'expired' | 'invalid' } {
  const pending = getPendingOTP();
  if (!pending) return { ok: false, reason: 'expired' };
  if (pending.code !== code.trim()) return { ok: false, reason: 'invalid' };

  const user: User = {
    phone: pending.phone,
    fullPhone: pending.fullPhone,
    countryCode: pending.countryCode,
    loggedInAt: new Date().toISOString(),
  };
  if (isClient()) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.removeItem(OTP_KEY);
  }
  return { ok: true, user };
}

export function logout() {
  if (!isClient()) return;
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(OTP_KEY);
}

export function clearPendingOTP() {
  if (!isClient()) return;
  localStorage.removeItem(OTP_KEY);
}
