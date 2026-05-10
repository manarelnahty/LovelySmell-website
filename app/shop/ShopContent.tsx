'use client';

import { useState } from 'react';
import { ChevronDown, Loader2, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ProductGrid } from './ProductGrid';
import { Product } from '@/lib/data/products';
import { getProducts } from '@/lib/actions/products';

interface ShopContentProps {
  initialProducts: Product[];
  totalCount: number;
  category: string | null;
  query: string | null;
  minPrice: number | null;
  maxPrice: number | null;
}

export function ShopContent({ initialProducts, totalCount, category, query, minPrice, maxPrice }: ShopContentProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(initialProducts.length);

  const hasMore = products.length < totalCount;

  const loadMore = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const result = await getProducts({
        category,
        query,
        limit: 8,
        offset: offset,
        minPrice,
        maxPrice
      });

      setProducts(prev => [...prev, ...result.products]);
      setOffset(prev => prev + result.products.length);
    } catch (error) {
      console.error('Failed to load more products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Active Filters Summary */}
      {(category || minPrice !== null || maxPrice !== null) && (
        <div className="flex flex-wrap items-center gap-3 mb-8 px-4 py-3 bg-secondary/5 border border-secondary/10 rounded-2xl animate-fade-in">
          <span className="text-xs font-bold text-secondary ml-2">الفلاتر النشطة:</span>
          
          {category && (
            <div className="flex items-center gap-2 bg-white border border-secondary/20 px-4 py-1.5 rounded-full text-xs font-bold text-on-surface shadow-sm">
              <span>القسم: {category}</span>
              <button onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.delete('category');
                router.push(pathname + '?' + params.toString(), { scroll: false });
              }} className="hover:text-secondary"><X className="w-3 h-3" /></button>
            </div>
          )}

          {(minPrice !== null || maxPrice !== null) && (
            <div className="flex items-center gap-2 bg-white border border-secondary/20 px-4 py-1.5 rounded-full text-xs font-bold text-on-surface shadow-sm">
              <span>السعر: {minPrice || 0} - {maxPrice || 2000} ج.م</span>
              <button onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.delete('minPrice');
                params.delete('maxPrice');
                router.push(pathname + '?' + params.toString(), { scroll: false });
              }} className="hover:text-secondary"><X className="w-3 h-3" /></button>
            </div>
          )}

          <button 
            onClick={() => router.push(pathname)}
            className="text-xs font-bold text-secondary hover:underline underline-offset-4 mr-auto"
          >
            مسح الكل
          </button>
        </div>
      )}

      {/* Bento Product Grid */}
      <ProductGrid products={products} />

      {/* Pagination */}
      {hasMore && (
        <div className="flex justify-center mt-stack-lg">
          <button 
            onClick={loadMore}
            disabled={isLoading}
            aria-label="Load more products" 
            className="border-[1.5px] border-secondary text-secondary hover:bg-secondary/5 font-label-sm text-label-sm px-10 py-3 rounded-full transition-colors flex items-center gap-2 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                جاري التحميل...
                <Loader2 className="w-5 h-5 animate-spin" />
              </>
            ) : (
              <>
                تحميل المزيد
                <ChevronDown className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      )}
      
      {!hasMore && products.length > 0 && (
        <p className="text-center text-on-surface-variant font-body-sm mt-12 opacity-60">
          لقد شاهدت جميع المنتجات
        </p>
      )}
    </>
  );
}
