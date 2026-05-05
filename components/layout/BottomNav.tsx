'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MapPin, Search, Settings } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import clsx from 'clsx';

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const items = [
    { href: '/', icon: Home, label: t('nav.home') },
    { href: '/places', icon: MapPin, label: t('nav.places') },
    { href: '/places?focus=search', icon: Search, label: t('nav.search') },
    { href: '/admin', icon: Settings, label: t('nav.admin') },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    const path = href.split('?')[0];
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <nav className="absolute bottom-0 inset-x-0 z-30 bg-white border-t border-gray-100">
      <div className="grid grid-cols-4">
        {items.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex flex-col items-center justify-center py-2.5 transition-colors',
                active ? 'text-primary-600' : 'text-gray-500 hover:text-gray-800'
              )}
            >
              <Icon className={clsx('w-5 h-5', active && 'fill-primary-100')} />
              <span className="text-[11px] mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
