'use client';

export interface Subscription {
  id: string;
  user_id: string;
  status: 'pending' | 'active' | 'cancelled' | 'expired' | 'failed';
  amount: number;
  currency: string;
  tap_charge_id: string | null;
  tap_payment_url: string | null;
  started_at: string | null;
  expires_at: string | null;
  cancelled_at: string | null;
  created_at: string;
}

export interface SubscriptionStatus {
  isSubscribed: boolean;
  subscription: Subscription | null;
}

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    cache: 'no-store',
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || `API ${url} failed: ${res.status}`);
  }
  return res.json();
}

export async function getSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
  return api<SubscriptionStatus>(`/api/subscriptions/status?userId=${encodeURIComponent(userId)}`);
}

export async function startSubscription(
  userId: string
): Promise<{ ok: true; demo: boolean; subscriptionId: string; paymentUrl: string | null }> {
  return api('/api/subscriptions/create', {
    method: 'POST',
    body: JSON.stringify({
      userId,
      redirectBase: typeof window !== 'undefined' ? window.location.origin : '',
    }),
  });
}

export async function confirmSubscription(
  subscriptionId: string
): Promise<{ ok: boolean; status: string; subscription?: Subscription }> {
  return api('/api/subscriptions/confirm', {
    method: 'POST',
    body: JSON.stringify({ subscriptionId }),
  });
}

export async function cancelSubscription(subscriptionId: string): Promise<{ ok: boolean }> {
  return api('/api/subscriptions/cancel', {
    method: 'POST',
    body: JSON.stringify({ subscriptionId }),
  });
}

// Local cache for free quota tracking (until 3 places viewed without subscription)
const FREE_VIEWS_KEY = 'kpg:free-views';
export const FREE_VIEW_LIMIT = 3;

export function getViewedPlaces(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(FREE_VIEWS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function recordPlaceView(placeId: string): number {
  if (typeof window === 'undefined') return 0;
  const viewed = getViewedPlaces();
  if (!viewed.includes(placeId)) {
    viewed.push(placeId);
    localStorage.setItem(FREE_VIEWS_KEY, JSON.stringify(viewed));
  }
  return viewed.length;
}

export function clearFreeViews(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(FREE_VIEWS_KEY);
}
