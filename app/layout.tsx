import type {Metadata} from 'next';
import { Tajawal, Playfair_Display } from 'next/font/google';
import { LenisProvider } from '@/components/lenis-provider';
import { CartProvider } from '@/lib/context/CartContext';
import { CartDrawer } from '@/components/CartDrawer';
import { AIChat } from '@/components/AIChat';
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
  icons: {
    icon: [
      { url: '/ls-monogram.png', type: 'image/png' },
    ],
    apple: [
      { url: '/ls-monogram.png', type: 'image/png' },
    ],
    shortcut: '/ls-monogram.png',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} ${playfair.variable}`}>
      <body className="font-tajawal bg-[#FDF9F3] text-[#2C2C2C]" suppressHydrationWarning>
        <CartProvider>
          <LenisProvider>{children}</LenisProvider>
          <CartDrawer />
          <AIChat />
        </CartProvider>
      </body>
    </html>
  );
}
