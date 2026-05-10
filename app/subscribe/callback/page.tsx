'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { confirmSubscription } from '@/lib/store/subscriptionStore';
import { Button } from '@/components/ui/Button';

type Result = 'pending' | 'success' | 'failed';

function CallbackContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { locale } = useTranslation();
  const [result, setResult] = useState<Result>('pending');
  const [error, setError] = useState('');

  const subId = params.get('sub');

  useEffect(() => {
    if (!subId) {
      setResult('failed');
      setError(locale === 'ar' ? 'بيانات الاشتراك مفقودة' : 'Missing subscription data');
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await confirmSubscription(subId);
        if (cancelled) return;
        if (res.ok && res.status === 'active') {
          setResult('success');
          setTimeout(() => router.push('/subscribe'), 2500);
        } else {
          setResult('failed');
          setError(locale === 'ar' ? 'فشل الدفع' : 'Payment failed');
        }
      } catch (e) {
        if (cancelled) return;
        setResult('failed');
        setError(e instanceof Error ? e.message : 'Error');
      }
    })();
    return () => { cancelled = true; };
  }, [subId, locale, router]);

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-6 text-center">
      {result === 'pending' && (
        <>
          <Loader2 className="w-16 h-16 text-primary-600 animate-spin mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {locale === 'ar' ? 'جارٍ التحقق من الدفع...' : 'Verifying payment...'}
          </h2>
          <p className="text-sm text-gray-500">
            {locale === 'ar' ? 'لحظة من فضلك' : 'One moment please'}
          </p>
        </>
      )}

      {result === 'success' && (
        <>
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4 animate-fade-in">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {locale === 'ar' ? 'تم الاشتراك بنجاح! 🎉' : 'Subscribed successfully! 🎉'}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            {locale === 'ar' ? 'استمتع بالوصول الكامل' : 'Enjoy full access'}
          </p>
          <p className="text-xs text-gray-400">
            {locale === 'ar' ? 'جارٍ التوجيه...' : 'Redirecting...'}
          </p>
        </>
      )}

      {result === 'failed' && (
        <>
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {locale === 'ar' ? 'فشل الدفع' : 'Payment Failed'}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            {error || (locale === 'ar' ? 'حدث خطأ أثناء معالجة الدفع' : 'Something went wrong')}
          </p>
          <div className="flex gap-2">
            <Link href="/subscribe">
              <Button>{locale === 'ar' ? 'حاول مرة أخرى' : 'Try Again'}</Button>
            </Link>
            <Link href="/">
              <Button variant="secondary">{locale === 'ar' ? 'الرئيسية' : 'Home'}</Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function SubscribeCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-full flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
