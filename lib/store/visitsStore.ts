'use client';

const VISITS_CACHE_KEY = 'kpg:visits-cache';
const APP_VISITS_KEY = 'kpg:app-visits-cache';

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`API ${url} failed: ${res.status}`);
  return res.json();
}

export async function recordVisit(placeId: string): Promise<number> {
  const r = await api<{ count: number }>(`/api/visits/place/${placeId}`, { method: 'POST' });
  return r.count;
}

export async function getVisits(placeId: string): Promise<number> {
  try {
    const r = await api<{ count: number }>(`/api/visits/place/${placeId}`);
    return r.count;
  } catch {
    return 0;
  }
}

export async function recordAppVisit(): Promise<number> {
  // Throttle: only record once per session
  if (typeof window !== 'undefined') {
    const sessionKey = 'kpg:session-recorded';
    if (sessionStorage.getItem(sessionKey)) {
      return Number(sessionStorage.getItem(APP_VISITS_KEY) || '0');
    }
    sessionStorage.setItem(sessionKey, '1');
  }
  try {
    const r = await api<{ count: number }>('/api/visits/app', { method: 'POST' });
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(APP_VISITS_KEY, String(r.count));
    }
    return r.count;
  } catch {
    return 0;
  }
}

export interface DashboardStats {
  totalPlaces: number;
  totalCategories: number;
  totalVisits: number;
  appVisits: number;
  avgRating: number;
  featuredCount: number;
  topVisited: { placeId: string; count: number }[];
  countryStats: Record<string, number>;
  totalCountryVisits: number;
}

export async function getStats(): Promise<DashboardStats> {
  return api<DashboardStats>('/api/stats');
}
