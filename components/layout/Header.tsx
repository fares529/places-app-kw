'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search, MapPin, Globe, User as UserIcon, LogOut, LogIn, Crown } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { getCurrentUser, logout, User } from '@/lib/store/authStore';
import { getSubscriptionStatus } from '@/lib/store/subscriptionStore';
import { getCountry } from '@/lib/data/countries';

export function Header() {
  const { locale, setLocale, t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    if (u?.id) {
      getSubscriptionStatus(u.id).then((s) => setIsSubscribed(s.isSubscribed)).catch(() => {});
    } else {
      setIsSubscribed(false);
    }
  }, [pathname]);

  useEffect(() => {
    const close = () => setShowMenu(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setShowMenu(false);
    router.push('/');
  };

  const country = user ? getCountry(user.countryCode) : null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/places?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="container-app">
        <div className="flex items-center justify-between h-14 gap-2">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm">
              {locale === 'ar' ? 'دليل الكويت' : 'Kuwait Guide'}
            </span>
          </Link>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors text-xs font-medium text-gray-700"
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{locale === 'ar' ? 'EN' : 'AR'}</span>
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-full transition-colors ${
                    isSubscribed
                      ? 'bg-amber-50 hover:bg-amber-100'
                      : 'bg-primary-50 hover:bg-primary-100'
                  }`}
                  aria-label="Account"
                >
                  <span className="text-base">{country?.flag}</span>
                  {isSubscribed ? (
                    <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-400" />
                  ) : (
                    <UserIcon className="w-3.5 h-3.5 text-primary-700" />
                  )}
                </button>
                {showMenu && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute end-0 top-10 z-30 bg-white rounded-xl border border-gray-100 shadow-lg py-1 w-56"
                  >
                    <div className="px-3 py-2 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{country?.flag}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-gray-900 truncate" dir="ltr">
                            {user.fullPhone}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {locale === 'ar' ? country?.nameAr : country?.nameEn}
                          </p>
                        </div>
                        {isSubscribed && (
                          <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
                            👑 PRO
                          </span>
                        )}
                      </div>
                    </div>
                    <Link
                      href="/subscribe"
                      onClick={() => setShowMenu(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-amber-700 hover:bg-amber-50"
                    >
                      <Crown className="w-3.5 h-3.5" />
                      {isSubscribed
                        ? (locale === 'ar' ? 'إدارة الاشتراك' : 'Manage Subscription')
                        : (locale === 'ar' ? 'اشترك في Premium' : 'Subscribe to Premium')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 border-t border-gray-100"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      {locale === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors text-xs font-medium"
              >
                <LogIn className="w-3.5 h-3.5" />
                {locale === 'ar' ? 'دخول' : 'Login'}
              </Link>
            )}
          </div>
        </div>

        <form onSubmit={handleSearch} className="pb-3">
          <div className="relative">
            <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('common.search')}
              className="w-full ps-10 pe-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
            />
          </div>
        </form>
      </div>
    </header>
  );
}
