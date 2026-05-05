'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { MapPin, Heart, Eye } from 'lucide-react';
import { Place } from '@/lib/types';
import { useTranslation } from '@/lib/i18n/context';
import { mockCategories } from '@/lib/data/mockCategories';
import { getVisits } from '@/lib/store/visitsStore';
import { Rating, PriceRange } from '@/components/ui/Rating';
import { Badge } from '@/components/ui/Badge';

interface PlaceCardProps {
  place: Place;
  variant?: 'default' | 'compact';
}

export function PlaceCard({ place, variant = 'default' }: PlaceCardProps) {
  const { locale } = useTranslation();
  const category = mockCategories.find((c) => c.id === place.categoryId);
  const [visits, setVisits] = useState(0);

  useEffect(() => {
    setVisits(getVisits(place.id));
  }, [place.id]);

  const name = locale === 'ar' ? place.nameAr : place.nameEn;
  const area = locale === 'ar' ? place.area : place.areaEn;
  const categoryName = category ? (locale === 'ar' ? category.nameAr : category.nameEn) : '';

  if (variant === 'compact') {
    return (
      <Link
        href={`/places/${place.id}`}
        className="flex-shrink-0 w-64 bg-white rounded-2xl card-shadow hover:card-shadow-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
      >
        <div className="relative h-36 bg-gray-100 overflow-hidden">
          <Image
            src={place.images[0]}
            alt={name}
            fill
            sizes="256px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {place.isFeatured && (
            <div className="absolute top-2 start-2">
              <Badge variant="warning">⭐ {locale === 'ar' ? 'مميز' : 'Featured'}</Badge>
            </div>
          )}
        </div>
        <div className="p-3.5">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-1">{name}</h3>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="line-clamp-1">{area}</span>
          </div>
          <div className="flex items-center justify-between">
            <Rating value={place.rating} count={place.reviewsCount} size="sm" />
            <PriceRange value={place.priceRange} className="text-xs" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/places/${place.id}`}
      className="block bg-white rounded-2xl card-shadow hover:card-shadow-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
    >
      <div className="relative h-44 sm:h-48 bg-gray-100 overflow-hidden">
        <Image
          src={place.images[0]}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {place.isFeatured && (
          <div className="absolute top-3 start-3">
            <Badge variant="warning">⭐ {locale === 'ar' ? 'مميز' : 'Featured'}</Badge>
          </div>
        )}
        <button
          aria-label="Favorite"
          onClick={(e) => { e.preventDefault(); }}
          className="absolute top-3 end-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart className="w-4 h-4 text-gray-700" />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-base md:text-lg leading-tight line-clamp-1">
              {name}
            </h3>
            {category && (
              <span className={`text-xs font-medium ${category.color}`}>{categoryName}</span>
            )}
          </div>
          <PriceRange value={place.priceRange} />
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="line-clamp-1">{area}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <Rating value={place.rating} count={place.reviewsCount} size="sm" />
          {visits > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] text-gray-500 font-medium">
              <Eye className="w-3 h-3" />
              {visits.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
