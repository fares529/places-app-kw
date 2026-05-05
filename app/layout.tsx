import type { Metadata } from 'next';
import { Inter, Tajawal } from 'next/font/google';
import { I18nProvider } from '@/lib/i18n/context';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-tajawal',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'دليل أماكن الكويت | Kuwait Places Guide',
  description: 'اكتشف أفضل الأماكن في الكويت — مطاعم، كافيهات، أسواق، أماكن سياحية وأكثر',
};

const unregisterStaleSW = `
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(rs => {
    rs.forEach(r => r.unregister());
    if ('caches' in window) {
      caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
    }
  });
}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${inter.variable} ${tajawal.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: unregisterStaleSW }} />
      </head>
      <body className="bg-gray-200 min-h-screen">
        <I18nProvider>
          <div className="phone-shell">
            <div className="phone-screen">
              <Header />
              <main className="flex-1 pb-20 overflow-y-auto">{children}</main>
              <BottomNav />
            </div>
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
