'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Phone,
  Globe,
  Clock,
  Navigation,
  Share2,
  Eye,
  Pencil,
} from 'lucide-react';
import { Place } from '@/lib/types';
import { useTranslation } from '@/lib/i18n/context';
import { getPlace, updatePlace } from '@/lib/store/placesStore';
import { recordVisit } from '@/lib/store/visitsStore';
import { mockCategories } from '@/lib/data/mockCategories';
import { Rating, PriceRange } from '@/components/ui/Rating';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { PlaceGallery } from '@/components/places/PlaceGallery';
import { PlaceForm } from '@/components/admin/PlaceForm';

const PlaceMap = dynamic(() => import('@/components/places/PlaceMap'), {
  ssr: false,
  loading: () => (
    <div className="h-72 bg-gray-100 rounded-2xl animate-pulse flex items-center justify-center text-gray-400">
      Loading map...
    </div>
  ),
});

export default function PlaceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { t, locale } = useTranslation();
  const [place, setPlace] = useState<Place | null | undefined>(undefined);
  const [visits, setVisits] = useState(0);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    const id = params?.id as string;
    let cancelled = false;
    (async () => {
      const found = await getPlace(id);
      if (cancelled) return;
      setPlace(found);
      if (found) {
        const c = await recordVisit(id);
        if (!cancelled) setVisits(c);
      }
    })();
    return () => { cancelled = true; };
  }, [params?.id]);

  const handleSaveEdit = async (data: Omit<Place, 'id' | 'createdAt'>) => {
    if (!place) return;
    const updated = await updatePlace(place.id, data);
    if (updated) setPlace(updated);
    setShowEdit(false);
  };

  if (place === undefined) {
    return (
      <div className="container-app py-12 text-center text-gray-500">
        {t('common.loading')}
      </div>
    );
  }

  if (place === null) {
    return (
      <div className="container-app py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          {locale === 'ar' ? 'المكان غير موجود' : 'Place not found'}
        </h2>
        <Button onClick={() => router.push('/places')}>{t('common.back')}</Button>
      </div>
    );
  }

  const name = locale === 'ar' ? place.nameAr : place.nameEn;
  const description = locale === 'ar' ? place.descriptionAr : place.descriptionEn;
  const area = locale === 'ar' ? place.area : place.areaEn;
  const address = locale === 'ar' ? place.address : place.addressEn;
  const hours = locale === 'ar' ? place.openingHours : place.openingHoursEn;
  const category = mockCategories.find((c) => c.id === place.categoryId);
  const categoryName = category ? (locale === 'ar' ? category.nameAr : category.nameEn) : '';

  const BackIcon = locale === 'ar' ? ArrowRight : ArrowLeft;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.coordinates.lat},${place.coordinates.lng}`;

  return (
    <div className="container-app py-4">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 mb-3"
      >
        <BackIcon className="w-4 h-4" />
        {t('common.back')}
      </button>

      <div className="flex flex-col gap-4">
        <PlaceGallery images={place.images} alt={name} />

        <div className="bg-white rounded-2xl card-shadow p-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              {category && (
                <Badge variant="default" className="mb-1.5">
                  <Icon name={category.icon} className="w-3 h-3" />
                  {categoryName}
                </Badge>
              )}
              <h1 className="text-xl font-bold text-gray-900 leading-tight">{name}</h1>
              <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{area}</span>
              </div>
            </div>
            <PriceRange value={place.priceRange} />
          </div>

          <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-gray-100">
            <Rating value={place.rating} count={place.reviewsCount} size="sm" />
            <div className="flex items-center gap-1.5">
              <Badge variant="gray">
                <Eye className="w-3 h-3" />
                {visits.toLocaleString()}
              </Badge>
              {place.isFeatured && <Badge variant="warning">⭐</Badge>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl card-shadow p-4">
          <h2 className="font-bold text-base text-gray-900 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary-600" />
            {t('details.location')}
          </h2>
          <div className="h-56 rounded-xl overflow-hidden mb-3">
            <PlaceMap lat={place.coordinates.lat} lng={place.coordinates.lng} name={name} />
          </div>
          <p className="text-xs text-gray-600 mb-3">{address}</p>
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" className="w-full" onClick={() => window.open(directionsUrl, '_blank')}>
              <Navigation className="w-4 h-4" />
              <span className="text-xs">{t('details.getDirections')}</span>
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="w-full"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: name, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
            >
              <Share2 className="w-4 h-4" />
              <span className="text-xs">{t('details.shareLocation')}</span>
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl card-shadow p-4">
          <h2 className="font-bold text-base text-gray-900 mb-3">{t('details.contactInfo')}</h2>
          <ul className="space-y-2.5 text-sm">
            {place.phone && (
              <li className="flex gap-2.5">
                <Phone className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <a href={`tel:${place.phone}`} className="text-primary-600 hover:underline" dir="ltr">
                  {place.phone}
                </a>
              </li>
            )}
            {place.website && (
              <li className="flex gap-2.5">
                <Globe className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <a
                  href={place.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline truncate text-xs"
                >
                  {place.website.replace(/^https?:\/\//, '')}
                </a>
              </li>
            )}
            <li className="flex gap-2.5">
              <Clock className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <span className="text-gray-700 text-xs">{hours}</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl card-shadow p-4">
          <h2 className="font-bold text-base text-gray-900 mb-2">{t('details.aboutPlace')}</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
        </div>

        {place.features.length > 0 && (
          <div className="bg-white rounded-2xl card-shadow p-4">
            <h2 className="font-bold text-base text-gray-900 mb-3">{t('details.amenities')}</h2>
            <div className="grid grid-cols-2 gap-2">
              {place.features.map((f) => (
                <div
                  key={f}
                  className="flex items-center gap-2 px-2.5 py-2 bg-gray-50 rounded-xl"
                >
                  <div className="w-7 h-7 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
                    <Icon name={f} className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs text-gray-700 font-medium">{t(`features.${f}`)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => setShowEdit(true)}
        className="fixed bottom-24 end-4 z-30 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-all"
        aria-label={locale === 'ar' ? 'تعديل المكان' : 'Edit place'}
        style={{ position: 'absolute' }}
      >
        <Pencil className="w-5 h-5" />
      </button>

      {showEdit && (
        <PlaceForm
          initial={place}
          onSave={handleSaveEdit}
          onCancel={() => setShowEdit(false)}
        />
      )}
    </div>
  );
}
