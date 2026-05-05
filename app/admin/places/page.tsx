'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Search, Star, Eye, Image as ImageIcon, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { Place, CategoryId } from '@/lib/types';
import { useTranslation } from '@/lib/i18n/context';
import {
  getPlaces,
  addPlace,
  updatePlace,
  deletePlace,
} from '@/lib/store/placesStore';
import { mockCategories } from '@/lib/data/mockCategories';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { PlaceForm } from '@/components/admin/PlaceForm';
import { Button } from '@/components/ui/Button';
import { Rating } from '@/components/ui/Rating';
import { Badge } from '@/components/ui/Badge';
import clsx from 'clsx';

export default function AdminPlacesPage() {
  const { t, locale } = useTranslation();
  const [places, setPlaces] = useState<Place[]>([]);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<CategoryId | 'all'>('all');
  const [query, setQuery] = useState('');
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const refresh = async () => {
    setPlaces(await getPlaces());
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    const handler = () => setOpenMenu(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const handleSave = async (data: Omit<Place, 'id' | 'createdAt'>) => {
    if (editingPlace) {
      await updatePlace(editingPlace.id, data);
    } else {
      await addPlace(data);
    }
    setShowForm(false);
    setEditingPlace(null);
    await refresh();
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('admin.confirmDelete'))) {
      await deletePlace(id);
      await refresh();
    }
  };

  const handleToggleFeatured = async (place: Place) => {
    await updatePlace(place.id, { isFeatured: !place.isFeatured });
    await refresh();
  };

  const handleSwapImage = async (place: Place) => {
    if (place.images.length < 2) return;
    const swapped = [place.images[1], place.images[0], ...place.images.slice(2)];
    await updatePlace(place.id, { images: swapped });
    await refresh();
  };

  const handleEdit = (place: Place) => {
    setEditingPlace(place);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingPlace(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPlace(null);
  };

  const filtered = useMemo(() => {
    let result = places;
    if (filter !== 'all') result = result.filter((p) => p.categoryId === filter);
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.nameAr.toLowerCase().includes(q) ||
          p.nameEn.toLowerCase().includes(q) ||
          p.area.toLowerCase().includes(q)
      );
    }
    return result;
  }, [places, filter, query]);

  return (
    <AdminLayout>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-gray-900">
            {t('admin.managePlaces')}
          </h1>
          <p className="text-xs text-gray-500">
            {filtered.length} / {places.length} {locale === 'ar' ? 'مكان' : 'places'}
          </p>
        </div>
        <Button size="sm" onClick={handleAdd}>
          <Plus className="w-4 h-4" />
          <span className="text-xs">{locale === 'ar' ? 'مكان جديد' : 'New'}</span>
        </Button>
      </div>

      <div className="mb-3">
        <div className="relative">
          <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-gray-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={locale === 'ar' ? 'ابحث في الأماكن...' : 'Search places...'}
            className="w-full ps-10 pe-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="flex gap-1.5 mb-3 overflow-x-auto scrollbar-hide -mx-4 px-4">
        <button
          onClick={() => setFilter('all')}
          className={clsx(
            'shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
            filter === 'all'
              ? 'bg-primary-600 text-white border-primary-600'
              : 'bg-white text-gray-600 border-gray-200'
          )}
        >
          {t('common.all')} ({places.length})
        </button>
        {mockCategories.map((cat) => {
          const count = places.filter((p) => p.categoryId === cat.id).length;
          const active = filter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={clsx(
                'shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                active
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-600 border-gray-200'
              )}
            >
              {locale === 'ar' ? cat.nameAr : cat.nameEn} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl card-shadow p-8 text-center">
          <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">
            {locale === 'ar' ? 'لا توجد أماكن تطابق البحث' : 'No places match your search'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((place) => {
            const cat = mockCategories.find((c) => c.id === place.categoryId);
            const menuOpen = openMenu === place.id;
            return (
              <div
                key={place.id}
                className="bg-white rounded-2xl card-shadow overflow-hidden"
              >
                <div className="flex gap-3 p-3">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    <img
                      src={place.images[0]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    {place.isFeatured && (
                      <span className="absolute top-1 start-1 bg-amber-500 text-white text-[9px] font-bold px-1 rounded">
                        ⭐
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {locale === 'ar' ? place.nameAr : place.nameEn}
                        </h3>
                        {cat && (
                          <span className={`text-[11px] font-medium ${cat.color}`}>
                            {locale === 'ar' ? cat.nameAr : cat.nameEn}
                          </span>
                        )}
                      </div>
                      <div className="relative shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenu(menuOpen ? null : place.id);
                          }}
                          className="w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-500 flex items-center justify-center"
                          aria-label="More options"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        {menuOpen && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute end-0 top-8 z-20 bg-white rounded-xl border border-gray-100 shadow-lg py-1 w-44"
                          >
                            <Link
                              href={`/places/${place.id}`}
                              className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              {locale === 'ar' ? 'معاينة' : 'Preview'}
                            </Link>
                            <button
                              onClick={() => {
                                handleToggleFeatured(place);
                                setOpenMenu(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
                            >
                              <Star className={clsx('w-3.5 h-3.5', place.isFeatured && 'fill-amber-500 text-amber-500')} />
                              {place.isFeatured
                                ? (locale === 'ar' ? 'إزالة من المميزة' : 'Unfeature')
                                : (locale === 'ar' ? 'جعله مميزاً' : 'Mark as Featured')}
                            </button>
                            <button
                              onClick={() => {
                                handleSwapImage(place);
                                setOpenMenu(null);
                              }}
                              disabled={place.images.length < 2}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <ImageIcon className="w-3.5 h-3.5" />
                              {locale === 'ar' ? 'تبديل الصورة الرئيسية' : 'Swap Main Image'}
                            </button>
                            <div className="border-t border-gray-100 my-1" />
                            <button
                              onClick={() => {
                                handleDelete(place.id);
                                setOpenMenu(null);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              {t('common.delete')}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-1.5">
                      <Rating value={place.rating} showCount={false} size="sm" />
                      <span className="text-[11px] text-gray-400">
                        · {place.reviewsCount.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        · 📍 {locale === 'ar' ? place.area : place.areaEn}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-2">
                      <Badge variant="gray" className="text-[10px]">
                        {place.images.length} 📷
                      </Badge>
                      {place.features.slice(0, 3).map((f) => (
                        <Badge key={f} variant="default" className="text-[10px]">
                          {t(`features.${f}`)}
                        </Badge>
                      ))}
                      {place.features.length > 3 && (
                        <span className="text-[10px] text-gray-400">+{place.features.length - 3}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(place)}
                    className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-primary-600 hover:bg-primary-50 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    {t('common.edit')}
                  </button>
                  <Link
                    href={`/places/${place.id}`}
                    className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors border-s border-gray-100"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {locale === 'ar' ? 'معاينة' : 'Preview'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <PlaceForm
          initial={editingPlace || undefined}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </AdminLayout>
  );
}
