'use client';

const STORAGE_KEY = 'kpg:visits';
const APP_KEY = 'kpg:app-visits';
const COUNTRY_KEY = 'kpg:country-visits';

function isClient() {
  return typeof window !== 'undefined';
}

function readVisits(): Record<string, number> {
  if (!isClient()) return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeVisits(visits: Record<string, number>) {
  if (!isClient()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(visits));
}

export function recordVisit(placeId: string): number {
  const visits = readVisits();
  visits[placeId] = (visits[placeId] || 0) + 1;
  writeVisits(visits);
  return visits[placeId];
}

export function getVisits(placeId: string): number {
  return readVisits()[placeId] || 0;
}

export function getAllVisits(): Record<string, number> {
  return readVisits();
}

export function getTotalVisits(): number {
  const visits = readVisits();
  return Object.values(visits).reduce((sum, n) => sum + n, 0);
}

export function recordAppVisit(): number {
  if (!isClient()) return 0;
  const current = Number(localStorage.getItem(APP_KEY) || '0');
  const next = current + 1;
  localStorage.setItem(APP_KEY, String(next));
  return next;
}

export function getAppVisits(): number {
  if (!isClient()) return 0;
  return Number(localStorage.getItem(APP_KEY) || '0');
}

export function getMostVisited(limit: number = 5): { placeId: string; count: number }[] {
  const visits = readVisits();
  return Object.entries(visits)
    .map(([placeId, count]) => ({ placeId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function resetVisits() {
  if (!isClient()) return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(APP_KEY);
  localStorage.removeItem(COUNTRY_KEY);
}

function readCountryVisits(): Record<string, number> {
  if (!isClient()) return {};
  try {
    const raw = localStorage.getItem(COUNTRY_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function recordCountryVisit(countryCode: string): number {
  if (!isClient()) return 0;
  const data = readCountryVisits();
  data[countryCode] = (data[countryCode] || 0) + 1;
  localStorage.setItem(COUNTRY_KEY, JSON.stringify(data));
  return data[countryCode];
}

export function getCountryStats(): Record<string, number> {
  return readCountryVisits();
}

export function getTotalCountryVisits(): number {
  const stats = readCountryVisits();
  return Object.values(stats).reduce((sum, n) => sum + n, 0);
}
