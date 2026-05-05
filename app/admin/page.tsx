'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, Tag, Star, Eye, Plus, Pencil, ChevronLeft, ChevronRight, Smartphone, TrendingUp } from 'lucide-react';
import { Place } from '@/lib/types';
import { useTranslation } from '@/lib/i18n/context';
import { getPlaces } from '@/lib/store/placesStore';
import { getCategories } from '@/lib/store/categoriesStore';
import { getTotalVisits, getAppVisits, getMostVisited, getCountryStats, getTotalCountryVisits } from '@/lib/store/visitsStore';
import { gulfCountries } from '@/lib/data/countries';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Rating } from '@/components/ui/Rating';
import { Icon } from '@/components/ui/Icon';

export default function AdminDashboardPage() {
  const { t, locale } = useTranslation();
  const [places, setPlaces] = useState<Place[]>([]);
  const [categories, setCategories] = useState(getCategories());
  const [totalVisits, setTotalVisits] = useState(0);
  const [appVisits, setAppVisits] = useState(0);
  const [topVisited, setTopVisited] = useState<{ placeId: string; count: number }[]>([]);
  const [countryStats, setCountryStats] = useState<Record<string, number>>({});
  const [totalCountryVisits, setTotalCountryVisits] = useState(0);

  useEffect(() => {
    setPlaces(getPlaces());
    setCategories(getCategories());
    setTotalVisits(getTotalVisits());
    setAppVisits(getAppVisits());
    setTopVisited(getMostVisited(5));
    setCountryStats(getCountryStats());
    setTotalCountryVisits(getTotalCountryVisits());
  }, []);

  const avgRating =
    places.length > 0 ? places.reduce((sum, p) => sum + p.rating, 0) / places.length : 0;
  const featuredCount = places.filter((p) => p.isFeatured).length;
  const recentPlaces = [...places]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  const topVisitedPlaces = topVisited
    .map((v) => ({ ...v, place: places.find((p) => p.id === v.placeId) }))
    .filter((x) => x.place);

  const stats = [
    {
      label: locale === 'ar' ? 'فتحات التطبيق' : 'App Opens',
      value: appVisits.toLocaleString(),
      icon: Smartphone,
      gradient: 'from-primary-500 to-primary-700',
      highlight: true,
    },
    {
      label: locale === 'ar' ? 'إجمالي الزيارات' : 'Total Visits',
      value: totalVisits.toLocaleString(),
      icon: Eye,
      gradient: 'from-rose-500 to-rose-700',
      highlight: true,
    },
    {
      label: t('admin.totalPlaces'),
      value: places.length,
      icon: MapPin,
      gradient: 'from-purple-500 to-purple-700',
    },
    {
      label: t('admin.totalCategories'),
      value: categories.length,
      icon: Tag,
      gradient: 'from-blue-500 to-blue-700',
    },
    {
      label: t('admin.averageRating'),
      value: avgRating.toFixed(1),
      icon: Star,
      gradient: 'from-amber-500 to-amber-700',
    },
    {
      label: locale === 'ar' ? 'الأماكن المميزة' : 'Featured',
      value: featuredCount,
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-emerald-700',
    },
  ];

  const ChevronEnd = locale === 'ar' ? ChevronLeft : ChevronRight;

  return (
    <AdminLayout>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {stats.slice(0, 2).map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`relative rounded-2xl p-3 overflow-hidden bg-gradient-to-br ${stat.gradient} text-white card-shadow`}
            >
              <Icon className="absolute top-2 end-2 w-12 h-12 opacity-20" />
              <div className="relative">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-[11px] text-white/85 mt-0.5">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {stats.slice(2).map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-2.5 card-shadow text-center"
            >
              <Icon className="w-4 h-4 text-gray-400 mx-auto mb-1" />
              <div className="text-base font-bold text-gray-900">{stat.value}</div>
              <div className="text-[9px] text-gray-500 leading-tight">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <Link
          href="/admin/places"
          className="flex items-center gap-2 bg-white p-3 rounded-2xl card-shadow hover:card-shadow-hover transition-all active:scale-95"
        >
          <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
            <Plus className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <div className="font-semibold text-gray-900">
              {locale === 'ar' ? 'إضافة' : 'Add'}
            </div>
            <div className="text-gray-500 text-[10px]">
              {locale === 'ar' ? 'مكان جديد' : 'New place'}
            </div>
          </div>
        </Link>
        <Link
          href="/admin/places"
          className="flex items-center gap-2 bg-white p-3 rounded-2xl card-shadow hover:card-shadow-hover transition-all active:scale-95"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Pencil className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <div className="font-semibold text-gray-900">
              {locale === 'ar' ? 'تعديل' : 'Edit'}
            </div>
            <div className="text-gray-500 text-[10px]">
              {locale === 'ar' ? 'الأماكن الحالية' : 'Existing places'}
            </div>
          </div>
        </Link>
      </div>

      <div className="bg-white rounded-2xl card-shadow overflow-hidden mb-4">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-sm text-gray-900">
            {t('admin.recentPlaces')}
          </h2>
          <Link
            href="/admin/places"
            className="flex items-center gap-0.5 text-xs text-primary-600 font-medium"
          >
            {t('common.viewAll')}
            <ChevronEnd className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {recentPlaces.map((place) => {
            const cat = categories.find((c) => c.id === place.categoryId);
            return (
              <Link
                key={place.id}
                href={`/places/${place.id}`}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                  <img
                    src={place.images[0]}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">
                    {locale === 'ar' ? place.nameAr : place.nameEn}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                    {cat ? (locale === 'ar' ? cat.nameAr : cat.nameEn) : ''} ·{' '}
                    {locale === 'ar' ? place.area : place.areaEn}
                  </p>
                </div>
                <Rating value={place.rating} showCount={false} size="sm" />
              </Link>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl card-shadow overflow-hidden mb-4">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
            🌍 {locale === 'ar' ? 'الزيارات حسب الدولة' : 'Visits by Country'}
          </h2>
          <span className="text-[11px] text-gray-500">
            {totalCountryVisits} {locale === 'ar' ? 'مستخدم مسجّل' : 'logged users'}
          </span>
        </div>
        <div className="p-3 space-y-2">
          {totalCountryVisits === 0 ? (
            <div className="text-center py-4">
              <p className="text-xs text-gray-500 mb-2">
                {locale === 'ar'
                  ? 'لا يوجد مستخدمون مسجّلون بعد. سجّل دخولك لتظهر دولتك هنا.'
                  : 'No registered users yet. Login to see your country here.'}
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-1 text-xs text-primary-600 font-medium"
              >
                {locale === 'ar' ? 'تسجيل دخول' : 'Login'} →
              </Link>
            </div>
          ) : (
            gulfCountries
              .map((c) => ({ ...c, count: countryStats[c.code] || 0 }))
              .sort((a, b) => b.count - a.count)
              .map((c) => {
                const pct = totalCountryVisits > 0 ? (c.count / totalCountryVisits) * 100 : 0;
                return (
                  <div key={c.code} className="flex items-center gap-2.5">
                    <span className="text-xl shrink-0">{c.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-800 truncate">
                          {locale === 'ar' ? c.nameAr : c.nameEn}
                        </span>
                        <span className="text-[11px] text-gray-500 shrink-0 font-medium">
                          {c.count} ({pct.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>

      {topVisitedPlaces.length > 0 && (
        <div className="bg-white rounded-2xl card-shadow overflow-hidden mb-4">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-rose-500" />
              {locale === 'ar' ? 'الأكثر زيارة' : 'Most Visited'}
            </h2>
            <span className="text-[11px] text-gray-500">{totalVisits} {locale === 'ar' ? 'زيارة إجمالاً' : 'total'}</span>
          </div>
          <div className="divide-y divide-gray-100">
            {topVisitedPlaces.map((item, idx) => {
              const place = item.place!;
              return (
                <Link
                  key={place.id}
                  href={`/places/${place.id}`}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50"
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    idx === 0 ? 'bg-amber-100 text-amber-700' :
                    idx === 1 ? 'bg-gray-200 text-gray-700' :
                    idx === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {idx + 1}
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                    <img src={place.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-xs truncate">
                      {locale === 'ar' ? place.nameAr : place.nameEn}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 shrink-0">
                    <Eye className="w-3 h-3" />
                    {item.count}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl card-shadow overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-sm text-gray-900">
            {locale === 'ar' ? 'توزيع الفئات' : 'Categories Distribution'}
          </h2>
        </div>
        <div className="p-3 grid grid-cols-1 gap-2">
          {categories.map((cat) => {
            const count = places.filter((p) => p.categoryId === cat.id).length;
            const pct = places.length > 0 ? (count / places.length) * 100 : 0;
            return (
              <div key={cat.id} className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl ${cat.bgColor} flex items-center justify-center shrink-0`}
                >
                  <Icon name={cat.icon} className={`w-4 h-4 ${cat.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-800 truncate">
                      {locale === 'ar' ? cat.nameAr : cat.nameEn}
                    </span>
                    <span className="text-[11px] text-gray-500 shrink-0">
                      {count} ({pct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cat.bgColor.replace('100', '500')} rounded-full transition-all`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
