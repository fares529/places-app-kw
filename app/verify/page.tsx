'use client';

import { useEffect, useState, useRef, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, MessageCircle, RefreshCw, Copy } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { getPendingOTP, verifyOTP, requestOTP, PendingOTP } from '@/lib/store/authStore';
import { getCountry } from '@/lib/data/countries';
import { Button } from '@/components/ui/Button';

const RESEND_COOLDOWN = 30;

export default function VerifyPage() {
  const { locale } = useTranslation();
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [pending, setPending] = useState<PendingOTP | null>(null);
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const [showDemoCode, setShowDemoCode] = useState(true);

  const BackArrow = locale === 'ar' ? ArrowRight : ArrowLeft;

  useEffect(() => {
    const otp = getPendingOTP();
    if (!otp) {
      router.replace('/login');
      return;
    }
    setPending(otp);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }, [router]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleChange = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[idx] = val;
    setDigits(next);
    setError('');

    if (val && idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }

    if (next.every((d) => d) && next.join('').length === 6) {
      submitCode(next.join(''));
    }
  };

  const handleKeyDown = (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 0) return;
    const next = ['', '', '', '', '', ''];
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    if (pasted.length === 6) submitCode(pasted);
    else inputRefs.current[pasted.length]?.focus();
  };

  const submitCode = async (code: string) => {
    const result = await verifyOTP(code);
    if (result.ok) {
      setSuccess(true);
      setTimeout(() => router.push('/'), 1200);
    } else {
      setError(
        result.reason === 'expired'
          ? locale === 'ar' ? 'انتهت صلاحية الرمز' : 'Code expired'
          : locale === 'ar' ? 'الرمز غير صحيح' : 'Invalid code'
      );
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (!pending || cooldown > 0) return;
    const fresh = await requestOTP(pending.phone, pending.fullPhone, pending.countryCode);
    setPending(fresh);
    setCooldown(RESEND_COOLDOWN);
    setShowDemoCode(true);
    setError('');
  };

  const copyCode = () => {
    if (!pending?.code) return;
    navigator.clipboard.writeText(pending.code);
  };

  if (!pending) return null;

  const country = getCountry(pending.countryCode);

  if (success) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4 animate-fade-in">
          <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {locale === 'ar' ? 'تم التحقق بنجاح' : 'Verified successfully'}
        </h2>
        <p className="text-sm text-gray-500">
          {locale === 'ar' ? 'جارٍ توجيهك...' : 'Redirecting...'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col">
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white pt-6 pb-10 px-4">
        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm font-medium mb-6"
        >
          <BackArrow className="w-4 h-4" />
          {locale === 'ar' ? 'تغيير الرقم' : 'Change number'}
        </Link>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm mb-4">
            <MessageCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {locale === 'ar' ? 'أدخل رمز التحقق' : 'Enter verification code'}
          </h1>
          <p className="text-sm text-white/85">
            {locale === 'ar' ? 'أرسلنا رمزاً مكوّناً من 6 أرقام إلى' : 'We sent a 6-digit code to'}
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            {country && <span className="text-xl">{country.flag}</span>}
            <span className="font-bold text-base" dir="ltr">{pending.fullPhone}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 -mt-6">
        <div className="bg-white rounded-2xl card-shadow p-5">
          {showDemoCode && (
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-4 mb-5 relative">
              <button
                onClick={() => setShowDemoCode(false)}
                className="absolute top-2 end-2 text-amber-700 hover:text-amber-900 text-xs"
              >
                ✕
              </button>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">⚠️</span>
                <span className="text-xs font-bold text-amber-900">
                  {locale === 'ar' ? 'وضع تجريبي — رمزك:' : 'Demo Mode — Your Code:'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <code className="text-2xl font-black text-amber-900 tracking-widest" dir="ltr">
                  {pending.code}
                </code>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-white text-amber-800 rounded-lg text-xs font-medium hover:bg-amber-50"
                >
                  <Copy className="w-3 h-3" />
                  {locale === 'ar' ? 'نسخ' : 'Copy'}
                </button>
              </div>
              <p className="text-[10px] text-amber-700 mt-2 leading-relaxed">
                {locale === 'ar'
                  ? 'في الإنتاج: الرمز يُرسل لـ WhatsApp فعلياً عبر API'
                  : 'In production: this code would arrive via WhatsApp API'}
              </p>
            </div>
          )}

          <div className="flex justify-center gap-2 mb-4" dir="ltr">
            {digits.map((d, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={idx === 0 ? handlePaste : undefined}
                className="w-11 h-14 text-center text-xl font-bold bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white text-gray-900"
              />
            ))}
          </div>

          {error && (
            <p className="text-center text-sm text-red-600 mb-4">{error}</p>
          )}

          <Button
            onClick={() => submitCode(digits.join(''))}
            className="w-full"
            disabled={digits.some((d) => !d)}
          >
            {locale === 'ar' ? 'تأكيد' : 'Verify'}
          </Button>

          <div className="text-center mt-4">
            <button
              onClick={handleResend}
              disabled={cooldown > 0}
              className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {cooldown > 0
                ? locale === 'ar'
                  ? `إعادة الإرسال خلال ${cooldown} ثانية`
                  : `Resend in ${cooldown}s`
                : locale === 'ar'
                  ? 'إعادة إرسال الرمز'
                  : 'Resend code'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
