import { TopNavBar } from '@/components/TopNavBar';
import { ProductFilter } from './ProductFilter';
import { ShopContent } from './ShopContent';
import { SiteFooter } from '@/components/SiteFooter';
import { getProducts, getCategories } from '@/lib/actions/products';

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams;
  const category = typeof resolvedParams.category === 'string' ? resolvedParams.category : null;
  const query = typeof resolvedParams.q === 'string' ? resolvedParams.q : null;
  const minPrice = typeof resolvedParams.minPrice === 'string' ? parseInt(resolvedParams.minPrice) : null;
  const maxPrice = typeof resolvedParams.maxPrice === 'string' ? parseInt(resolvedParams.maxPrice) : null;

  // Fetch initial 8 products and all categories
  const [{ products: initialProducts, totalCount }, categoriesData] = await Promise.all([
    getProducts({ category, query, limit: 8, minPrice, maxPrice }),
    getCategories()
  ]);

  const categories = ["الكل", ...categoriesData.map(c => c.name_ar)];

  return (
    <div className="bg-background text-on-background font-body-md text-body-md antialiased min-h-screen flex flex-col">
      <TopNavBar />

      {/* Main Content */}
      <main className="flex-grow pt-8 md:pt-section-gap px-4 md:px-margin pb-8 md:pb-section-gap max-w-container-max mx-auto w-full">
        {/* Section 1: Editorial Heading */}
        <header className="flex flex-col items-center justify-center text-center mb-12 md:mb-16 space-y-stack-md pt-20 md:pt-12">
          <h1 className="font-display-xl text-4xl md:text-display-xl text-on-background">جميع العطور</h1>
          <div className="w-10 h-[1px] bg-secondary"></div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
            اكتشف مجموعتنا الكاملة من العطور الفاخرة، المصممة بشغف لتعكس شخصيتك الفريدة.
          </p>
        </header>

        {/* Section 2: Floating Filter Bar */}
        <ProductFilter categories={categories} />

        {/* Section 3: Paginated Product Grid & Load More */}
        <ShopContent 
          key={`${category || 'all'}-${query || 'none'}-${minPrice || 0}-${maxPrice || 2000}`}
          initialProducts={initialProducts} 
          totalCount={totalCount}
          category={category}
          query={query}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />
      </main>

      {/* Floating WhatsApp Action Button */}
      <a aria-label="تواصل معنا عبر واتساب" className="fixed bottom-8 left-8 bg-secondary text-on-secondary p-4 rounded-full shadow-[0_4px_20px_rgba(117,90,44,0.3)] z-50 hover:scale-105 transition-transform flex items-center justify-center min-w-[56px] min-h-[56px]" href="https://wa.me/966532243455" target="_blank" rel="noopener noreferrer">
        <svg fill="currentColor" height="24" viewBox="0 0 16 16" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"></path>
        </svg>
      </a>

      <SiteFooter />
    </div>
  );
}
