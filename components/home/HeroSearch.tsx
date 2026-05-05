'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';

export function HeroSearch() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/places?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/places');
    }
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900" />
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.3) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.2) 0%, transparent 40%)',
      }} />

      <div className="relative container-app py-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-xs font-medium mb-3">
            <MapPin className="w-3 h-3" />
            <span>{locale === 'ar' ? 'دولة الكويت' : 'State of Kuwait'}</span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
            {t('home.heroTitle')}
          </h1>
          <p className="text-sm text-white/85 mb-5 leading-relaxed">
            {t('home.heroSubtitle')}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="relative">
              <Search className="absolute top-1/2 -translate-y-1/2 start-4 w-4 h-4 text-gray-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('common.search')}
                className="w-full ps-11 pe-24 py-3 bg-white rounded-full text-gray-900 placeholder:text-gray-400 shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30 text-sm"
              />
              <button
                type="submit"
                className="absolute top-1/2 -translate-y-1/2 end-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-medium text-xs transition-colors"
              >
                {t('common.searchButton')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
