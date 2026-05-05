'use client';

import { useTranslation } from '@/lib/i18n/context';
import { MapPin } from 'lucide-react';

export function Footer() {
  const { locale } = useTranslation();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16 hidden md:block">
      <div className="container-app py-10">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white">
                {locale === 'ar' ? 'دليل الكويت' : 'Kuwait Guide'}
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {locale === 'ar'
                ? 'دليلك الشامل لاكتشاف أفضل الأماكن في الكويت — مطاعم وكافيهات وأسواق ومعالم.'
                : 'Your comprehensive guide to discover the best places in Kuwait — restaurants, cafes, malls and landmarks.'}
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">
              {locale === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-primary-300 transition-colors">{locale === 'ar' ? 'الرئيسية' : 'Home'}</a></li>
              <li><a href="/places" className="hover:text-primary-300 transition-colors">{locale === 'ar' ? 'الأماكن' : 'Places'}</a></li>
              <li><a href="/admin" className="hover:text-primary-300 transition-colors">{locale === 'ar' ? 'الإدارة' : 'Admin'}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">
              {locale === 'ar' ? 'تواصل معنا' : 'Contact'}
            </h3>
            <p className="text-sm text-gray-400">
              {locale === 'ar' ? 'الكويت — مدينة الكويت' : 'Kuwait — Kuwait City'}
            </p>
            <p className="text-sm text-gray-400 mt-1">info@kuwaitguide.kw</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-sm text-gray-500 text-center">
          © 2026 Kuwait Places Guide. {locale === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.
        </div>
      </div>
    </footer>
  );
}
