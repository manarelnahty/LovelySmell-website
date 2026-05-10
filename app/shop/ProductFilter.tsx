"use client";
import { Search, SlidersHorizontal } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useTransition } from 'react';
import { FilterDrawer } from './FilterDrawer';

export function ProductFilter({ categories }: { categories: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const currentCategory = searchParams.get('category') || "الكل";
  const currentQuery = searchParams.get('q') || "";

  const [searchTerm, setSearchTerm] = useState(currentQuery);

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category && category !== "الكل") {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    startTransition(() => {
      router.push(pathname + '?' + params.toString(), { scroll: false });
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    
    startTransition(() => {
      router.push(pathname + '?' + params.toString(), { scroll: false });
    });
  };

  return (
    <div className="glass-panel border border-secondary/20 rounded-3xl md:rounded-full px-4 py-3 md:px-6 md:py-4 mb-stack-lg flex flex-col md:flex-row items-center justify-between gap-4 sticky top-[110px] md:top-[120px] z-40 shadow-sm shadow-secondary/5 mt-6">
      {/* Search */}
      <div className="relative w-full md:w-auto flex-shrink-0">
        <input 
          className="w-full md:w-64 bg-surface-container-lowest/50 border border-outline-variant rounded-full py-2 px-4 pr-12 text-body-md font-body-md text-on-background focus:border-secondary focus:ring-0 placeholder:text-on-surface-variant/70 min-h-[44px] outline-none transition-colors" 
          placeholder="ابحث عن عطر..." 
          type="text" 
          aria-label="Search products"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/70 w-5 h-5 pointer-events-none" />
      </div>
      
      {/* Categories */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar w-full md:w-auto justify-center py-1">
        {categories.map((category) => {
          const isActive = currentCategory === category;
          return (
            <button 
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`${
                isActive 
                  ? 'bg-primary-container text-on-primary' 
                  : 'border border-outline-variant text-on-surface hover:bg-surface-variant'
              } font-label-sm text-label-sm px-6 rounded-full whitespace-nowrap transition-all duration-300 min-h-[44px]`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Advanced Filter Drawer */}
      <FilterDrawer categories={categories} />
    </div>
  );
}
