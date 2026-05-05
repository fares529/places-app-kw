'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, MapPin, Tag, RotateCcw } from 'lucide-react';
import { ReactNode } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import { resetToMockData } from '@/lib/store/placesStore';
import clsx from 'clsx';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { t, locale } = useTranslation();

  const items = [
    { href: '/admin', icon: LayoutDashboard, label: locale === 'ar' ? 'النظرة العامة' : 'Overview' },
    { href: '/admin/places', icon: MapPin, label: t('admin.managePlaces') },
    { href: '/admin/categories', icon: Tag, label: t('admin.manageCategories') },
  ];

  const handleReset = () => {
    if (confirm(t('admin.resetConfirm'))) {
      resetToMockData();
      window.location.reload();
    }
  };

  return (
    <div className="container-app pt-3 pb-6">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-gray-900 text-lg">
            {locale === 'ar' ? 'لوحة الإدارة' : 'Admin Panel'}
          </h2>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Reset data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t('admin.resetData')}</span>
        </button>
      </div>

      <nav className="flex gap-1 mb-4 bg-white rounded-2xl card-shadow p-1.5">
        {items.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-xs font-medium transition-colors',
                active
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="line-clamp-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <main>{children}</main>
    </div>
  );
}
