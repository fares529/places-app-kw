'use client';

import { CategoryId } from '@/lib/types';
import { mockCategories } from '@/lib/data/mockCategories';
import { useTranslation } from '@/lib/i18n/context';
import { Icon } from '@/components/ui/Icon';
import clsx from 'clsx';

interface PlacesFilterProps {
  selectedCategory: CategoryId | 'all';
  onSelectCategory: (id: CategoryId | 'all') => void;
  sortBy: 'rating' | 'newest' | 'popular';
  onSortChange: (sort: 'rating' | 'newest' | 'popular') => void;
}

export function PlacesFilter({
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
}: PlacesFilterProps) {
  const { t, locale } = useTranslation();

  return (
    <div className="bg-white rounded-2xl card-shadow p-4 md:p-5 mb-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          {t('places.filterByCategory')}
        </h3>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
          <button
            onClick={() => onSelectCategory('all')}
            className={clsx(
              'shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors',
              selectedCategory === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            {t('common.all')}
          </button>
          {mockCategories.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={clsx(
                  'shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                <Icon name={cat.icon} className="w-4 h-4" />
                {locale === 'ar' ? cat.nameAr : cat.nameEn}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">{t('places.sortBy')}</h3>
        <div className="flex gap-2 flex-wrap">
          {(['rating', 'newest', 'popular'] as const).map((s) => (
            <button
              key={s}
              onClick={() => onSortChange(s)}
              className={clsx(
                'px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors border',
                sortBy === s
                  ? 'bg-primary-50 text-primary-700 border-primary-200'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              )}
            >
              {t(`places.sort${s.charAt(0).toUpperCase() + s.slice(1)}`)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
