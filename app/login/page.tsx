'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, MessageCircle, MapPin, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { gulfCountries, Country } from '@/lib/data/countries';
import { requestOTP } from '@/lib/store/authStore';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const { locale } = useTranslation();
  const router = useRouter();

  const [country, setCountry] = useState<Country>(gulfCountries[0]);
  const [phone, setPhone] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [error, setError] = useState('');

  const BackArrow = locale === 'ar' ? ArrowRight : ArrowLeft;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== country.phoneLength) {
      setError(
        locale === 'ar'
          ? `رقم الهاتف لازم يكون ${country.phoneLength} أرقام لـ ${country.nameAr}`
          : `Phone must be ${country.phoneLength} digits for ${country.nameEn}`
      );
      return;
    }

    try {
      const fullPhone = `${country.dial}${cleanPhone}`;
      await requestOTP(cleanPhone, fullPhone, country.code);
      router.push('/verify');
    } catch (err) {
      setError(locale === 'ar' ? 'فشل إرسال الرمز، حاول مرة أخرى' : 'Failed to send code, try again');
    }
  };

  return (
    <div className="min-h-full flex flex-col">
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white pt-6 pb-10 px-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm font-medium mb-6"
        >
          <BackArrow className="w-4 h-4" />
          {locale === 'ar' ? 'العودة' : 'Back'}
        </Link>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm mb-4">
            <MessageCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {locale === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
          </h1>
          <p className="text-sm text-white/85 leading-relaxed max-w-xs mx-auto">
            {locale === 'ar'
              ? 'سنرسل لك رمزاً عبر WhatsApp للتحقق من رقمك'
              : "We'll send you a code on WhatsApp to verify your number"}
          </p>
        </div>
      </div>

      <div className="flex-1 px-4 -mt-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl card-shadow p-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {locale === 'ar' ? 'الدولة' : 'Country'}
          </label>
          <button
            type="button"
            onClick={() => setShowPicker(!showPicker)}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors mb-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{country.flag}</span>
              <div className="text-start">
                <div className="text-sm font-semibold text-gray-900">
                  {locale === 'ar' ? country.nameAr : country.nameEn}
                </div>
                <div className="text-xs text-gray-500" dir="ltr">
                  {country.dial}
                </div>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showPicker ? 'rotate-180' : ''}`} />
          </button>

          {showPicker && (
            <div className="mb-3 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
              {gulfCountries.map((c) => {
                const active = c.code === country.code;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setCountry(c);
                      setPhone('');
                      setShowPicker(false);
                      setError('');
                    }}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 transition-colors ${
                      active ? 'bg-primary-50' : 'hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{c.flag}</span>
                      <span className="text-sm font-medium text-gray-800">
                        {locale === 'ar' ? c.nameAr : c.nameEn}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500" dir="ltr">{c.dial}</span>
                      {active && <Check className="w-4 h-4 text-primary-600" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <label className="block text-sm font-medium text-gray-700 mb-2">
            {locale === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
          </label>
          <div className="flex gap-2 mb-1" dir="ltr">
            <div className="flex items-center px-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium text-sm">
              {country.dial}
            </div>
            <input
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value.replace(/\D/g, '').slice(0, country.phoneLength));
                setError('');
              }}
              placeholder={'•'.repeat(country.phoneLength)}
              className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 text-base font-medium"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 mt-1.5 mb-2">{error}</p>
          )}

          <p className="text-[11px] text-gray-400 mt-2 mb-4">
            <MapPin className="w-3 h-3 inline -mt-0.5" />
            {' '}
            {locale === 'ar'
              ? `سيتم تتبّع زياراتك من ${country.nameAr} لإحصائيات أفضل`
              : `Your visits from ${country.nameEn} will be tracked for analytics`}
          </p>

          <Button type="submit" className="w-full" size="lg" disabled={phone.length !== country.phoneLength}>
            <MessageCircle className="w-4 h-4" />
            {locale === 'ar' ? 'إرسال الرمز عبر WhatsApp' : 'Send WhatsApp Code'}
          </Button>

          <Link
            href="/"
            className="block text-center text-xs text-gray-500 hover:text-gray-700 mt-4"
          >
            {locale === 'ar' ? 'تصفّح كزائر بدون تسجيل' : 'Continue as guest without login'}
          </Link>
        </form>

        <div className="mt-4 mb-6 bg-amber-50 border border-amber-100 rounded-2xl p-3 text-[11px] text-amber-800 leading-relaxed">
          ⚠️{' '}
          <strong>{locale === 'ar' ? 'وضع تجريبي' : 'Demo Mode'}:</strong>{' '}
          {locale === 'ar'
            ? 'الرمز سيظهر داخل التطبيق (محاكاة). في الإنتاج، سيُرسل عبر WhatsApp Business API + Backend.'
            : "OTP shown in-app (simulated). In production it'll be sent via WhatsApp Business API + Backend."}
        </div>
      </div>
    </div>
  );
}
