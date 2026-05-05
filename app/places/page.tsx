'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MapPinOff } from 'lucide-react';
import { CategoryId, Place } from '@/lib/types';
import { useTranslation } from '@/lib/i18n/context';
import { getPlaces } from '@/lib/store/placesStore';
import { PlaceCard } from '@/components/places/PlaceCard';
import { PlacesFilter } from '@/components/places/PlacesFilter';

function PlacesContent() {
  const { t, locale } = useTranslation();
  const params = useSearchParams();
  const router = useRouter();

  const initialCategory = (params.get('category') as CategoryId) || 'all';
  const initialQuery = params.get('q') || '';

  const [allPlaces, setAllPlaces] = useState<Place[]>([]);
  const [category, setCategory] = useState<CategoryId | 'all'>(initialCategory);
  const [sortBy, setSortBy] = useState<'rating' | 'newest' | 'popular'>('rating');
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setAllPlaces(getPlaces());
  }, []);

  useEffect(() => {
    const sp = new URLSearchParams();
    if (category !== 'all') sp.set('category', category);
    if (query) sp.set('q', query);
    const qs = sp.toString();
    router.replace(qs ? `/places?${qs}` : '/places', { scroll: false });
  }, [category, query, router]);

  const filtered = useMemo(() => {
    let result = [...allPlaces];

    if (category !== 'all') {
      result = result.filter((p) => p.categoryId === category);
    }

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.nameAr.toLowerCase().includes(q) ||
          p.nameEn.toLowerCase().includes(q) ||
          p.area.toLowerCase().includes(q) ||
          p.areaEn.toLowerCase().includes(q) ||
          p.descriptionAr.toLowerCase().includes(q) ||
          p.descriptionEn.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } else if (sortBy === 'popular') {
      result.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return result;
  }, [allPlaces, category, query, sortBy]);

  return (
    <div className="container-app py-4">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-gray-900 mb-0.5">
          {t('places.title')}
        </h1>
        <p className="text-xs text-gray-500">
          {t('places.resultsCount', { count: filtered.length })}
        </p>
      </div>

      <PlacesFilter
        selectedCategory={category}
        onSelectCategory={setCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl card-shadow p-10 text-center">
          <MapPinOff className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{t('places.noPlacesFound')}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PlacesPage() {
  return (
    <Suspense fallback={<div className="container-app py-10">Loading...</div>}>
      <PlacesContent />
    </Suspense>
  );
}
