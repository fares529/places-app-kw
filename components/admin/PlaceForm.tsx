'use client';

import { useState, FormEvent } from 'react';
import { X, Star, Info, MapPin, Phone, Sparkles } from 'lucide-react';
import { Place, CategoryId } from '@/lib/types';
import { useTranslation } from '@/lib/i18n/context';
import { mockCategories } from '@/lib/data/mockCategories';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageManager } from './ImageManager';

interface PlaceFormProps {
  initial?: Place;
  onSave: (data: Omit<Place, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const featureOptions = ['wifi', 'parking', 'family', 'wheelchair', 'delivery', 'view', 'workspace', 'beach', 'pickup', 'booking', '24h', 'cinema', 'food-court'];

const defaultPlace: Omit<Place, 'id' | 'createdAt'> = {
  nameAr: '',
  nameEn: '',
  descriptionAr: '',
  descriptionEn: '',
  categoryId: 'restaurants',
  rating: 4.0,
  reviewsCount: 0,
  priceRange: 2,
  area: '',
  areaEn: '',
  address: '',
  addressEn: '',
  phone: '',
  website: '',
  coordinates: { lat: 29.3759, lng: 47.9774 },
  images: [],
  openingHours: '',
  openingHoursEn: '',
  features: [],
  isFeatured: false,
};

type Tab = 'basic' | 'images' | 'location' | 'extras';

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-3">
        <Icon className="w-4 h-4 text-primary-600" />
        {title}
      </h3>
      {children}
    </div>
  );
}

export function PlaceForm({ initial, onSave, onCancel }: PlaceFormProps) {
  const { t, locale } = useTranslation();
  const [tab, setTab] = useState<Tab>('basic');
  const [data, setData] = useState<Omit<Place, 'id' | 'createdAt'>>(
    initial
      ? {
          nameAr: initial.nameAr,
          nameEn: initial.nameEn,
          descriptionAr: initial.descriptionAr,
          descriptionEn: initial.descriptionEn,
          categoryId: initial.categoryId,
          rating: initial.rating,
          reviewsCount: initial.reviewsCount,
          priceRange: initial.priceRange,
          area: initial.area,
          areaEn: initial.areaEn,
          address: initial.address,
          addressEn: initial.addressEn,
          phone: initial.phone || '',
          website: initial.website || '',
          coordinates: initial.coordinates,
          images: initial.images,
          openingHours: initial.openingHours,
          openingHoursEn: initial.openingHoursEn,
          features: initial.features,
          isFeatured: initial.isFeatured,
        }
      : defaultPlace
  );

  const toggleFeature = (f: string) => {
    setData((prev) => ({
      ...prev,
      features: prev.features.includes(f)
        ? prev.features.filter((x) => x !== f)
        : [...prev.features, f],
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    let images = data.images;
    if (images.length === 0) {
      const cat = mockCategories.find((c) => c.id === data.categoryId);
      const colors: Record<CategoryId, string> = {
        tourist: '7c3aed',
        restaurants: 'dc2626',
        cafes: 'b45309',
        services: '2563eb',
        malls: '059669',
      };
      const color = colors[data.categoryId];
      const slug = encodeURIComponent(data.nameEn || 'New Place');
      images = [`https://placehold.co/800x600/${color}/ffffff.png?text=${slug}&font=montserrat`];
    }
    onSave({ ...data, images });
  };

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'basic', label: locale === 'ar' ? 'الأساسيات' : 'Basics', icon: Info },
    { id: 'images', label: locale === 'ar' ? 'الصور' : 'Images', icon: Star },
    { id: 'location', label: locale === 'ar' ? 'الموقع' : 'Location', icon: MapPin },
    { id: 'extras', label: locale === 'ar' ? 'إضافات' : 'Extras', icon: Sparkles },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-stretch justify-center sm:items-center sm:p-4">
      <div className="bg-gray-50 w-full sm:max-w-2xl sm:rounded-2xl flex flex-col max-h-screen sm:max-h-[92vh]">
        <div className="bg-white flex items-center justify-between p-4 border-b border-gray-100 sm:rounded-t-2xl shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={onCancel}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center shrink-0"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
            <h2 className="text-base font-bold text-gray-900 truncate">
              {initial ? t('admin.editPlace') : t('admin.addNewPlace')}
            </h2>
          </div>
          <Button size="sm" onClick={handleSubmit}>
            {t('common.save')}
          </Button>
        </div>

        <nav className="bg-white border-b border-gray-100 flex overflow-x-auto scrollbar-hide shrink-0">
          {tabs.map((ttab) => {
            const Icon = ttab.icon;
            const active = tab === ttab.id;
            return (
              <button
                key={ttab.id}
                type="button"
                onClick={() => setTab(ttab.id)}
                className={`flex-1 min-w-fit flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  active
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {ttab.label}
              </button>
            );
          })}
        </nav>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 space-y-3 flex-1">
          {tab === 'basic' && (
            <>
              <Section title={locale === 'ar' ? 'الاسم والفئة' : 'Name & Category'} icon={Info}>
                <div className="grid grid-cols-1 gap-3">
                  <Input
                    label={t('admin.nameAr')}
                    value={data.nameAr}
                    onChange={(e) => setData({ ...data, nameAr: e.target.value })}
                    required
                  />
                  <Input
                    label={t('admin.nameEn')}
                    value={data.nameEn}
                    onChange={(e) => setData({ ...data, nameEn: e.target.value })}
                    dir="ltr"
                    required
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Select
                      label={t('common.category')}
                      value={data.categoryId}
                      onChange={(e) => setData({ ...data, categoryId: e.target.value as CategoryId })}
                    >
                      {mockCategories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {locale === 'ar' ? c.nameAr : c.nameEn}
                        </option>
                      ))}
                    </Select>
                    <Select
                      label={t('common.price')}
                      value={data.priceRange}
                      onChange={(e) => setData({ ...data, priceRange: Number(e.target.value) as 1 | 2 | 3 | 4 })}
                    >
                      <option value="1">$ ({locale === 'ar' ? 'اقتصادي' : 'Budget'})</option>
                      <option value="2">$$</option>
                      <option value="3">$$$</option>
                      <option value="4">$$$$ ({locale === 'ar' ? 'فاخر' : 'Luxury'})</option>
                    </Select>
                  </div>
                </div>
              </Section>

              <Section title={locale === 'ar' ? 'الوصف' : 'Description'} icon={Info}>
                <div className="space-y-3">
                  <Textarea
                    label={t('admin.descriptionAr')}
                    value={data.descriptionAr}
                    onChange={(e) => setData({ ...data, descriptionAr: e.target.value })}
                    rows={3}
                    required
                  />
                  <Textarea
                    label={t('admin.descriptionEn')}
                    value={data.descriptionEn}
                    onChange={(e) => setData({ ...data, descriptionEn: e.target.value })}
                    rows={3}
                    dir="ltr"
                    required
                  />
                </div>
              </Section>

              <Section title={locale === 'ar' ? 'التقييم' : 'Rating'} icon={Star}>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label={t('common.rating')}
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={data.rating}
                    onChange={(e) => setData({ ...data, rating: Number(e.target.value) })}
                  />
                  <Input
                    label={locale === 'ar' ? 'عدد المراجعات' : 'Reviews count'}
                    type="number"
                    min="0"
                    value={data.reviewsCount}
                    onChange={(e) => setData({ ...data, reviewsCount: Number(e.target.value) })}
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer mt-3 px-3 py-2 bg-amber-50 rounded-xl border border-amber-100">
                  <input
                    type="checkbox"
                    checked={data.isFeatured}
                    onChange={(e) => setData({ ...data, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-amber-900 font-medium">
                    ⭐ {locale === 'ar' ? 'إظهار في الأماكن المميزة' : 'Show in Featured'}
                  </span>
                </label>
              </Section>
            </>
          )}

          {tab === 'images' && (
            <Section title={locale === 'ar' ? 'إدارة صور المكان' : 'Manage Images'} icon={Star}>
              <ImageManager
                images={data.images}
                onChange={(images) => setData({ ...data, images })}
                categoryId={data.categoryId}
                placeName={data.nameEn}
              />
            </Section>
          )}

          {tab === 'location' && (
            <>
              <Section title={locale === 'ar' ? 'المنطقة والعنوان' : 'Area & Address'} icon={MapPin}>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label={locale === 'ar' ? 'المنطقة (عربي)' : 'Area (Arabic)'}
                    value={data.area}
                    onChange={(e) => setData({ ...data, area: e.target.value })}
                    required
                  />
                  <Input
                    label={locale === 'ar' ? 'المنطقة (إنجليزي)' : 'Area (English)'}
                    value={data.areaEn}
                    onChange={(e) => setData({ ...data, areaEn: e.target.value })}
                    dir="ltr"
                    required
                  />
                </div>
                <div className="mt-3 space-y-3">
                  <Input
                    label={locale === 'ar' ? 'العنوان (عربي)' : 'Address (Arabic)'}
                    value={data.address}
                    onChange={(e) => setData({ ...data, address: e.target.value })}
                  />
                  <Input
                    label={locale === 'ar' ? 'العنوان (إنجليزي)' : 'Address (English)'}
                    value={data.addressEn}
                    onChange={(e) => setData({ ...data, addressEn: e.target.value })}
                    dir="ltr"
                  />
                </div>
              </Section>

              <Section title={locale === 'ar' ? 'الإحداثيات' : 'Coordinates'} icon={MapPin}>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label={locale === 'ar' ? 'خط العرض' : 'Latitude'}
                    type="number"
                    step="0.0001"
                    value={data.coordinates.lat}
                    onChange={(e) =>
                      setData({
                        ...data,
                        coordinates: { ...data.coordinates, lat: Number(e.target.value) },
                      })
                    }
                  />
                  <Input
                    label={locale === 'ar' ? 'خط الطول' : 'Longitude'}
                    type="number"
                    step="0.0001"
                    value={data.coordinates.lng}
                    onChange={(e) =>
                      setData({
                        ...data,
                        coordinates: { ...data.coordinates, lng: Number(e.target.value) },
                      })
                    }
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-2">
                  {locale === 'ar'
                    ? 'تلميح: من Google Maps، اضغط بالزر الأيمن على الموقع لنسخ الإحداثيات.'
                    : 'Tip: In Google Maps, right-click on a location to copy coordinates.'}
                </p>
              </Section>
            </>
          )}

          {tab === 'extras' && (
            <>
              <Section title={locale === 'ar' ? 'بيانات الاتصال' : 'Contact'} icon={Phone}>
                <div className="space-y-3">
                  <Input
                    label={t('common.phone')}
                    value={data.phone}
                    onChange={(e) => setData({ ...data, phone: e.target.value })}
                    dir="ltr"
                    placeholder="+965 ..."
                  />
                  <Input
                    label={t('common.website')}
                    value={data.website}
                    onChange={(e) => setData({ ...data, website: e.target.value })}
                    dir="ltr"
                    placeholder="https://..."
                  />
                  <div className="grid grid-cols-1 gap-3">
                    <Input
                      label={locale === 'ar' ? 'ساعات العمل (عربي)' : 'Hours (Arabic)'}
                      value={data.openingHours}
                      onChange={(e) => setData({ ...data, openingHours: e.target.value })}
                    />
                    <Input
                      label={locale === 'ar' ? 'ساعات العمل (إنجليزي)' : 'Hours (English)'}
                      value={data.openingHoursEn}
                      onChange={(e) => setData({ ...data, openingHoursEn: e.target.value })}
                      dir="ltr"
                    />
                  </div>
                </div>
              </Section>

              <Section title={t('common.features')} icon={Sparkles}>
                <div className="flex flex-wrap gap-2">
                  {featureOptions.map((f) => {
                    const active = data.features.includes(f);
                    return (
                      <button
                        type="button"
                        key={f}
                        onClick={() => toggleFeature(f)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          active
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {t(`features.${f}`)}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-gray-400 mt-2">
                  {locale === 'ar'
                    ? `محدد: ${data.features.length}`
                    : `Selected: ${data.features.length}`}
                </p>
              </Section>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
