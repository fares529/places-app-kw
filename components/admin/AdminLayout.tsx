'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, MapPin, Tag, RotateCcw, Lock, LogOut, Shield, Mail } from 'lucide-react';
import { ReactNode, useEffect, useState, FormEvent } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import { resetToMockData } from '@/lib/store/placesStore';
import { adminLogin, isAdminAuthed, clearAdminToken } from '@/lib/auth/adminClient';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import clsx from 'clsx';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { t, locale } = useTranslation();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAuthed(isAdminAuthed());
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await adminLogin(email, password);
    setLoading(false);
    if (result.ok) {
      setAuthed(true);
      setEmail('');
      setPassword('');
    } else {
      setError(result.error || 'Failed');
    }
  };

  const handleLogout = () => {
    clearAdminToken();
    setAuthed(false);
  };

  const items = [
    { href: '/admin', icon: LayoutDashboard, label: locale === 'ar' ? 'النظرة العامة' : 'Overview' },
    { href: '/admin/places', icon: MapPin, label: t('admin.managePlaces') },
    { href: '/admin/categories', icon: Tag, label: t('admin.manageCategories') },
  ];

  const handleReset = async () => {
    if (confirm(t('admin.resetConfirm'))) {
      await resetToMockData();
      window.location.reload();
    }
  };

  if (authed === null) {
    return (
      <div className="container-app pt-3 pb-6 text-center text-gray-500 text-sm">
        {t('common.loading')}
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="container-app pt-6 pb-6">
        <div className="bg-white rounded-2xl card-shadow p-6 max-w-sm mx-auto">
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-100 text-primary-600 mb-3">
              <Shield className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              {locale === 'ar' ? 'دخول الأدمن' : 'Admin Login'}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {locale === 'ar'
                ? 'هذه الصفحة محمية بكلمة سر'
                : 'This area is protected'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={locale === 'ar' ? 'إيميل الأدمن' : 'Admin email'}
              required
              autoFocus
              dir="ltr"
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={locale === 'ar' ? 'كلمة السر' : 'Password'}
              required
              dir="ltr"
            />
            {error && <p className="text-xs text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading || !email || !password}>
              <Lock className="w-4 h-4" />
              {loading
                ? locale === 'ar' ? 'جارٍ التحقق...' : 'Checking...'
                : locale === 'ar' ? 'دخول' : 'Login'}
            </Button>
          </form>

          <p className="text-[10px] text-gray-400 text-center mt-4 leading-relaxed">
            {locale === 'ar'
              ? 'الجلسة تُحفظ مؤقتاً في المتصفّح. تنتهي عند إغلاق التبويب.'
              : 'Session stored in browser only. Cleared on tab close.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app pt-3 pb-6">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-gray-900 text-lg flex items-center gap-1.5">
            {locale === 'ar' ? 'لوحة الإدارة' : 'Admin Panel'}
            <Shield className="w-4 h-4 text-emerald-600" />
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Reset data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('admin.resetData')}</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Logout"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
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
