import type {Metadata} from 'next';
import { Tajawal, Playfair_Display } from 'next/font/google';
import { LenisProvider } from '@/components/lenis-provider';
import './globals.css';

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-tajawal',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'Lovely Smell EG',
  description: 'اكتشف عطرك المثالي - Lovely Smell EG',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} ${playfair.variable}`}>
      <body className="font-tajawal bg-[#FDF9F3] text-[#2C2C2C]" suppressHydrationWarning>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
