'use client';

import { Place } from '../types';
import { adminHeaders } from '../auth/adminClient';

async function api<T>(url: string, init?: RequestInit, admin = false): Promise<T> {
  const baseHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
  const headers = admin ? adminHeaders(baseHeaders) : baseHeaders;
  const res = await fetch(url, {
    ...init,
    headers: { ...headers, ...(init?.headers as Record<string, string> || {}) },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`API ${url} failed: ${res.status}`);
  return res.json();
}

export async function getPlaces(opts?: {
  category?: string;
  featured?: boolean;
  q?: string;
}): Promise<Place[]> {
  const params = new URLSearchParams();
  if (opts?.category) params.set('category', opts.category);
  if (opts?.featured) params.set('featured', 'true');
  if (opts?.q) params.set('q', opts.q);
  const qs = params.toString();
  return api<Place[]>(`/api/places${qs ? `?${qs}` : ''}`);
}

export async function getPlace(id: string): Promise<Place | null> {
  try {
    return await api<Place>(`/api/places/${id}`);
  } catch {
    return null;
  }
}

export async function addPlace(place: Omit<Place, 'id' | 'createdAt'>): Promise<Place> {
  return api<Place>('/api/places', {
    method: 'POST',
    body: JSON.stringify(place),
  }, true);
}

export async function updatePlace(id: string, updates: Partial<Place>): Promise<Place | null> {
  try {
    return await api<Place>(`/api/places/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }, true);
  } catch {
    return null;
  }
}

export async function deletePlace(id: string): Promise<boolean> {
  try {
    await api<{ ok: true }>(`/api/places/${id}`, { method: 'DELETE' }, true);
    return true;
  } catch {
    return false;
  }
}

export async function resetToMockData(): Promise<void> {
  await api<{ ok: true }>('/api/admin/reset', { method: 'POST' }, true);
}
