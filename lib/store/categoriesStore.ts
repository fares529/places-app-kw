'use client';

import { Category, CategoryId } from '../types';
import { mockCategories } from '../data/mockCategories';

const STORAGE_KEY = 'kpg:categories';

function isClient() {
  return typeof window !== 'undefined';
}

type Override = Partial<Pick<Category, 'nameAr' | 'nameEn' | 'icon' | 'color' | 'bgColor'>>;
type Overrides = Record<CategoryId, Override>;

function readOverrides(): Overrides {
  if (!isClient()) return {} as Overrides;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : ({} as Overrides);
  } catch {
    return {} as Overrides;
  }
}

function writeOverrides(overrides: Overrides) {
  if (!isClient()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
}

export function getCategories(): Category[] {
  const overrides = readOverrides();
  return mockCategories.map((cat) => ({
    ...cat,
    ...(overrides[cat.id] || {}),
  }));
}

export function getCategory(id: CategoryId): Category | undefined {
  return getCategories().find((c) => c.id === id);
}

export function updateCategory(id: CategoryId, updates: Override): Category | null {
  const overrides = readOverrides();
  overrides[id] = { ...(overrides[id] || {}), ...updates };
  writeOverrides(overrides);
  return getCategory(id) ?? null;
}

export function resetCategoryOverrides() {
  if (!isClient()) return;
  localStorage.removeItem(STORAGE_KEY);
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
