import type { Metadata, Viewport } from 'next';
import { Alexandria, Playfair_Display, Tajawal } from 'next/font/google';
import { LenisProvider } from '@/components/lenis-provider';
import { CartProvider } from '@/lib/context/CartContext';
import { CartDrawer } from '@/components/CartDrawer';
import './globals.css';

const SITE_URL = 'https://lovelysmell.netlify.app';

const alexandria = Alexandria({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-alexandria',
  display: 'swap',
});

const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-tajawal',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#FDF9F3',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Lovely Smell EG — عطور فاخرة | Luxury Fragrances',
    template: '%s | Lovely Smell EG',
  },
  description:
    'اكتشف عطرك المثالي مع Lovely Smell EG. عطور فاخرة مصنوعة بعناية من أجود المكونات الشرقية والغربية. توصيل سريع في جميع أنحاء مصر.',
  keywords: [
    'عطور فاخرة',
    'عطور مصرية',
    'عطور شرقية',
    'عطور غربية',
    'luxury perfume Egypt',
    'Lovely Smell EG',
    'عود',
    'مسك',
    'ورد',
    'perfume Cairo',
  ],
  authors: [{ name: 'Lovely Smell EG' }],
  creator: 'Lovely Smell EG',
  publisher: 'Lovely Smell EG',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'ar_EG',
    url: SITE_URL,
    siteName: 'Lovely Smell EG',
    title: 'Lovely Smell EG — عطور فاخرة | Luxury Fragrances',
    description:
      'اكتشف عطرك المثالي مع Lovely Smell EG. عطور فاخرة مصنوعة بعناية من أجود المكونات الشرقية والغربية.',
    images: [
      {
        url: '/hero-perfume.png',
        width: 1200,
        height: 630,
        alt: 'Lovely Smell EG — عطور فاخرة',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lovely Smell EG — عطور فاخرة',
    description:
      'اكتشف عطرك المثالي. عطور فاخرة مصنوعة بعناية من أجود المكونات.',
    images: ['/hero-perfume.png'],
  },
};

/* JSON-LD structured data for Google rich results */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'Lovely Smell EG',
  description:
    'عطور فاخرة مصنوعة بعناية من أجود المكونات الشرقية والغربية. توصيل سريع في جميع أنحاء مصر.',
  url: SITE_URL,
  image: `${SITE_URL}/hero-perfume.png`,
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'EG',
  },
  priceRange: '$$',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${alexandria.variable} ${tajawal.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-alexandria bg-[#FDF9F3] text-[#2C2C2C]" suppressHydrationWarning>
        <CartProvider>
          <LenisProvider>{children}</LenisProvider>
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
