import type { Metadata } from 'next';
import { ChevronDown } from 'lucide-react';
import { Suspense } from 'react';
import { TopNavBar } from '@/components/TopNavBar';
import { SiteFooter } from '@/components/SiteFooter';
import { ProductFilter } from './ProductFilter';
import { ProductGrid } from './ProductGrid';
import { mockProducts } from '@/lib/data/products';

export const metadata: Metadata = {
  title: 'تسوق جميع العطور',
  description:
    'تصفح مجموعتنا الكاملة من العطور الفاخرة الشرقية والغربية. عطور رجالي ونسائي بأسعار تنافسية مع توصيل سريع.',
  alternates: {
    canonical: '/shop',
  },
  openGraph: {
    title: 'تسوق جميع العطور — Lovely Smell EG',
    description:
      'تصفح مجموعتنا الكاملة من العطور الفاخرة الشرقية والغربية.',
    url: '/shop',
  },
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams;
  const category = typeof resolvedParams.category === 'string' ? resolvedParams.category : null;
  const query = typeof resolvedParams.q === 'string' ? resolvedParams.q : null;

  let filteredProducts = mockProducts;

  if (category && category !== "الكل") {
    filteredProducts = filteredProducts.filter(p => p.category.includes(category));
  }

  if (query) {
    const lowerQuery = query.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.description.toLowerCase().includes(lowerQuery)
    );
  }

  return (
    <div className="bg-background text-[#2C2C2C] font-alexandria antialiased min-h-screen flex flex-col">
      <TopNavBar />

      {/* Main Content */}
      <main className="flex-grow pt-[88px] md:pt-[120px] px-4 md:px-16 max-w-[1440px] mx-auto w-full">
        {/* Editorial Heading */}
        <header className="flex flex-col items-center justify-center text-center mb-12 md:mb-16 space-y-4 pt-12">
          <h1 className="text-4xl md:text-6xl font-bold text-[#2C2C2C]">جميع العطور</h1>
          <div className="w-12 h-[2px] bg-secondary/30 rounded-full"></div>
          <p className="text-sm md:text-base text-on-surface-variant font-light max-w-md leading-relaxed">
            اكتشف مجموعتنا الكاملة من العطور الفاخرة، المصممة بشغف لتعكس شخصيتك الفريدة.
          </p>
        </header>

        <Suspense fallback={<div className="h-20 bg-secondary/5 animate-pulse rounded-full mb-12" />}>
          <ProductFilter />
        </Suspense>

        {/* Section 3: Bento Product Grid */}
        <ProductGrid products={filteredProducts} />

        {/* Section 5: Pagination */}
        <div className="flex justify-center mt-12 mb-24">
          <button aria-label="Load more products" className="border border-[#C4A36E] text-[#C4A36E] hover:bg-[#C4A36E] hover:text-white font-medium text-sm px-12 py-4 rounded-full transition-all flex items-center gap-2 min-h-[44px] shadow-sm hover:shadow-lg active:scale-95">
            تحميل المزيد
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
