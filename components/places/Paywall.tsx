'use client';

import Link from 'next/link';
import { Crown, Lock, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { Button } from '@/components/ui/Button';

interface PaywallProps {
  viewedCount: number;
  limit: number;
}

export function Paywall({ viewedCount, limit }: PaywallProps) {
  const { locale } = useTranslation();
  const Arrow = locale === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="container-app py-6">
      <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-6 text-center mb-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500 text-white mb-3">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {locale === 'ar' ? 'انتهت أماكنك المجانية' : "You've used your free views"}
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          {locale === 'ar'
            ? `شفت ${viewedCount} مكان من أصل ${limit} مجاناً. اشترك للوصول الكامل لكل الأماكن.`
            : `You've viewed ${viewedCount} of ${limit} free places. Subscribe for full access.`}
        </p>

        <Link href="/subscribe">
          <Button size="lg" className="w-full">
            <Crown className="w-4 h-4" />
            {locale === 'ar' ? 'اشترك بـ 1 د.ك / شهر' : 'Subscribe — 1 KWD/month'}
            <Arrow className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl card-shadow p-5">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          {locale === 'ar' ? 'مميزات الاشتراك' : 'Subscription Benefits'}
        </h3>
        <ul className="space-y-2.5 text-sm text-gray-700">
          <li className="flex gap-2">
            <span className="text-emerald-600 font-bold">✓</span>
            {locale === 'ar' ? 'وصول كامل لكل الأماكن (25+ مكان)' : 'Full access to all 25+ places'}
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-600 font-bold">✓</span>
            {locale === 'ar' ? 'تفاصيل كاملة، صور، خرائط' : 'Full details, photos, maps'}
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-600 font-bold">✓</span>
            {locale === 'ar' ? 'إلغاء في أي وقت' : 'Cancel anytime'}
          </li>
          <li className="flex gap-2">
            <span className="text-emerald-600 font-bold">✓</span>
            {locale === 'ar' ? 'بدون رسوم خفية' : 'No hidden fees'}
          </li>
        </ul>
      </div>

      <p className="text-xs text-gray-400 text-center mt-4">
        {locale === 'ar'
          ? 'الدفع آمن عبر Tap Payment 🔒'
          : 'Secure payment via Tap 🔒'}
      </p>
    </div>
  );
}
