'use client';

import { Category, CategoryId } from '../types';
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

export async function getCategories(): Promise<Category[]> {
  return api<Category[]>('/api/categories');
}

export async function getCategory(id: CategoryId): Promise<Category | undefined> {
  const all = await getCategories();
  return all.find((c) => c.id === id);
}

export async function updateCategory(
  id: CategoryId,
  updates: Partial<Pick<Category, 'nameAr' | 'nameEn' | 'icon' | 'color' | 'bgColor'>>
): Promise<Category | null> {
  try {
    return await api<Category>(`/api/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }, true);
  } catch {
    return null;
  }
}

export async function resetCategoryOverrides(): Promise<void> {
  // No-op on backend (categories are now stored in DB, not overrides)
}

export const colorPresets: { name: string; color: string; bgColor: string }[] = [
  { name: 'Purple', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  { name: 'Red', color: 'text-red-600', bgColor: 'bg-red-100' },
  { name: 'Amber', color: 'text-amber-700', bgColor: 'bg-amber-100' },
  { name: 'Blue', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { name: 'Emerald', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
  { name: 'Pink', color: 'text-pink-600', bgColor: 'bg-pink-100' },
  { name: 'Teal', color: 'text-teal-600', bgColor: 'bg-teal-100' },
  { name: 'Orange', color: 'text-orange-600', bgColor: 'bg-orange-100' },
];

export const iconPresets = [
  'Landmark',
  'UtensilsCrossed',
  'Coffee',
  'Wrench',
  'ShoppingBag',
];
