'use client';

import { Place } from '../types';
import { mockPlaces } from '../data/mockPlaces';

const STORAGE_KEY = 'kpg:places';
const VERSION_KEY = 'kpg:version';
const CURRENT_VERSION = '1.3';

function isClient() {
  return typeof window !== 'undefined';
}

function readStorage(): Place[] | null {
  if (!isClient()) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const version = localStorage.getItem(VERSION_KEY);
    if (!raw || version !== CURRENT_VERSION) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeStorage(places: Place[]): void {
  if (!isClient()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(places));
  localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
}

function ensureSeeded(): Place[] {
  const existing = readStorage();
  if (existing && existing.length > 0) return existing;
  writeStorage(mockPlaces);
  return mockPlaces;
}

export function getPlaces(): Place[] {
  if (!isClient()) return mockPlaces;
  return ensureSeeded();
}

export function getPlace(id: string): Place | null {
  return getPlaces().find((p) => p.id === id) ?? null;
}

export function addPlace(place: Omit<Place, 'id' | 'createdAt'>): Place {
  const places = getPlaces();
  const newPlace: Place = {
    ...place,
    id: `p${String(Date.now()).slice(-6)}`,
    createdAt: new Date().toISOString().split('T')[0],
  };
  writeStorage([newPlace, ...places]);
  return newPlace;
}

export function updatePlace(id: string, updates: Partial<Place>): Place | null {
  const places = getPlaces();
  const idx = places.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const updated = { ...places[idx], ...updates, id };
  const newList = [...places];
  newList[idx] = updated;
  writeStorage(newList);
  return updated;
}

export function deletePlace(id: string): boolean {
  const places = getPlaces();
  const filtered = places.filter((p) => p.id !== id);
  if (filtered.length === places.length) return false;
  writeStorage(filtered);
  return true;
}

export function resetToMockData(): void {
  writeStorage(mockPlaces);
}
