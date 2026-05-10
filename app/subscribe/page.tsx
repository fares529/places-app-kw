'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, ArrowRight, Check, CreditCard, Crown, Sparkles, Star,
  Zap, AlertCircle, Loader2,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { getCurrentUser } from '@/lib/store/authStore';
import { getSubscriptionStatus, startSubscription, Subscription } from '@/lib/store/subscriptionStore';
import { Button } from '@/components/ui/Button';

export default function SubscribePage() {
  const router = useRouter();
  const { locale } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [error, setError] = useState('');
  const [active, setActive] = useState<Subscription | null>(null);
  const userObj = typeof window !== 'undefined' ? getCurrentUser() : null;

  const BackArrow = locale === 'ar' ? ArrowRight : ArrowLeft;

  useEffect(() => {
    if (!userObj?.id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const status = await getSubscriptionStatus(userObj.id);
        if (!cancelled) setActive(status.subscription);
      } catch {
        // ignore
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [userObj?.id]);

  const handleSubscribe = async () => {
    if (!userObj?.id) {
      router.push('/login');
      return;
    }
    setError('');
    setSubscribing(true);
    try {
      const result = await startSubscription(userObj.id);
      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
      } else {
        setError(locale === 'ar' ? 'فشل بدء الدفع' : 'Failed to start payment');
        setSubscribing(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
      setSubscribing(false);
    }
  };

  const features = [
    {
      icon: Sparkles,
      title: locale === 'ar' ? 'وصول كامل' : 'Full Access',
      desc: locale === 'ar' ? 'كل الأماكن والتفاصيل بدون قيود' : 'All places, full details, no limits',
    },
    {
      icon: Star,
      title: locale === 'ar' ? 'بدون إعلانات' : 'Ad Free',
      desc: locale === 'ar' ? 'تجربة نظيفة 100%' : 'Clean experience, no ads',
    },
    {
      icon: Zap,
      title: locale === 'ar' ? 'تحديثات مبكرة' : 'Early Access',
      desc: locale === 'ar' ? 'أماكن جديدة قبل الجميع' : 'New places before everyone',
    },
    {
      icon: CreditCard,
      title: locale === 'ar' ? 'إلغاء أي وقت' : 'Cancel Anytime',
      desc: locale === 'ar' ? 'بدون رسوم خفية أو التزام' : 'No hidden fees, no commitment',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (active && active.status === 'active') {
    const expires = active.expires_at ? new Date(active.expires_at) : null;
    return (
      <div className="min-h-full flex flex-col">
        <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-800 text-white pt-6 pb-12 px-4">
          <Link href="/" className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm mb-6">
            <BackArrow className="w-4 h-4" />
            {locale === 'ar' ? 'العودة' : 'Back'}
          </Link>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm mb-4">
              <Crown className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold mb-2">
              {locale === 'ar' ? 'أنت مشترك Premium 👑' : "You're a Premium Member 👑"}
            </h1>
            <p className="text-sm text-white/85">
              {locale === 'ar' ? 'استمتع بكل المميزات' : 'Enjoy all the features'}
            </p>
          </div>
        </div>

        <div className="flex-1 px-4 -mt-6">
          <div className="bg-white rounded-2xl card-shadow p-5">
            <h2 className="font-bold text-gray-900 mb-3">
              {locale === 'ar' ? 'تفاصيل اشتراكك' : 'Subscription Details'}
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">{locale === 'ar' ? 'الحالة' : 'Status'}</span>
                <span className="font-semibold text-emerald-700">
                  {locale === 'ar' ? '✓ نشط' : '✓ Active'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{locale === 'ar' ? 'المبلغ' : 'Amount'}</span>
                <span className="font-semibold">{active.amount} {active.currency}</span>
              </div>
              {expires && (
                <div className="flex justify-between">
                  <span className="text-gray-500">{locale === 'ar' ? 'ينتهي في' : 'Expires'}</span>
                  <span className="font-semibold">{expires.toLocaleDateString(locale === 'ar' ? 'ar-KW' : 'en-US')}</span>
                </div>
              )}
            </div>

            <Link href="/" className="block mt-5">
              <Button className="w-full">
                {locale === 'ar' ? 'استكشف الأماكن' : 'Explore Places'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col">
      <div className="bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 text-white pt-6 pb-14 px-4">
        <Link href="/" className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm mb-6">
          <BackArrow className="w-4 h-4" />
          {locale === 'ar' ? 'العودة' : 'Back'}
        </Link>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm mb-4">
            <Crown className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {locale === 'ar' ? 'اشتراك Premium' : 'Premium Subscription'}
          </h1>
          <p className="text-sm text-white/90 max-w-xs mx-auto">
            {locale === 'ar'
              ? 'وصول كامل لجميع الأماكن والمميزات'
              : 'Full access to all places and features'}
          </p>
        </div>
      </div>

      <div className="flex-1 px-4 -mt-8 pb-6">
        <div className="bg-white rounded-2xl card-shadow p-5 mb-4">
          <div className="text-center mb-4">
            <div className="inline-flex items-baseline gap-1">
              <span className="text-4xl font-black text-gray-900">1</span>
              <span className="text-lg font-semibold text-gray-700">KWD</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {locale === 'ar' ? 'شهرياً • إلغاء في أي وقت' : 'per month • cancel anytime'}
            </p>
          </div>

          <div className="space-y-2.5 mb-5">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{f.title}</p>
                    <p className="text-xs text-gray-500">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {!userObj && (
            <div className="bg-blue-50 border border-blue-100 text-blue-800 text-xs rounded-xl p-3 mb-3 flex gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                {locale === 'ar' ? 'سجّل دخولك أولاً للاشتراك' : 'Login first to subscribe'}
                {' · '}
                <Link href="/login" className="underline font-semibold">
                  {locale === 'ar' ? 'تسجيل دخول' : 'Login'}
                </Link>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-800 text-xs rounded-xl p-3 mb-3">
              {error}
            </div>
          )}

          <Button
            onClick={handleSubscribe}
            className="w-full"
            size="lg"
            disabled={!userObj || subscribing}
          >
            {subscribing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {locale === 'ar' ? 'جارٍ التحويل...' : 'Redirecting...'}
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                {locale === 'ar' ? 'اشترك الآن — 1 د.ك' : 'Subscribe — 1 KWD'}
              </>
            )}
          </Button>

          <p className="text-[10px] text-gray-400 text-center mt-3 leading-relaxed">
            {locale === 'ar'
              ? '🔒 الدفع آمن عبر Tap Payment. بياناتك محمية.'
              : '🔒 Secure payment via Tap. Your data is protected.'}
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 text-[11px] text-amber-800 leading-relaxed">
          ⚠️ <strong>{locale === 'ar' ? 'وضع تجريبي:' : 'Demo Mode:'}</strong>{' '}
          {locale === 'ar'
            ? 'يستخدم Tap في وضع التجربة (لن يتم خصم أي مبلغ حقيقي).'
            : 'Tap is in test mode (no real money charged).'}
        </div>
      </div>
    </div>
  );
}
