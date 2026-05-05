'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';
import { mockCategories } from '@/lib/data/mockCategories';
import { Icon } from '@/components/ui/Icon';

export function CategoryGrid() {
  const { t, locale } = useTranslation();

  return (
    <section className="container-app py-6">
      <div className="flex items-end justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">
          {t('home.categoriesTitle')}
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {mockCategories.map((cat) => (
          <Link
            key={cat.id}
            href={`/places?category=${cat.id}`}
            className="group bg-white rounded-2xl p-3 card-shadow hover:card-shadow-hover active:scale-95 transition-all duration-200 flex flex-col items-center text-center"
          >
            <div className={`w-12 h-12 rounded-2xl ${cat.bgColor} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
              <Icon name={cat.icon} className={`w-6 h-6 ${cat.color}`} />
            </div>
            <span className="font-semibold text-gray-800 text-xs leading-tight">
              {locale === 'ar' ? cat.nameAr : cat.nameEn}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
