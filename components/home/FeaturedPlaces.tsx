'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Place } from '@/lib/types';
import { useTranslation } from '@/lib/i18n/context';
import { getPlaces } from '@/lib/store/placesStore';
import { PlaceCard } from '@/components/places/PlaceCard';

export function FeaturedPlaces() {
  const { t, locale } = useTranslation();
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    let cancelled = false;
    getPlaces({ featured: true }).then((all) => {
      if (!cancelled) setPlaces(all.slice(0, 8));
    });
    return () => { cancelled = true; };
  }, []);

  if (places.length === 0) return null;

  const ChevronStart = locale === 'ar' ? ChevronRight : ChevronLeft;

  return (
    <section className="py-6">
      <div className="container-app flex items-end justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            {t('home.featuredTitle')}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {locale === 'ar' ? 'أماكن مختارة بعناية' : 'Hand-picked places'}
          </p>
        </div>
        <Link
          href="/places"
          className="flex items-center gap-1 text-primary-600 hover:text-primary-700 text-xs font-medium"
        >
          {t('common.viewAll')}
          <ChevronStart className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide px-4">
        {places.map((place) => (
          <PlaceCard key={place.id} place={place} variant="compact" />
        ))}
      </div>
    </section>
  );
}
