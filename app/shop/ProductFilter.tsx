"use client";
import { Search, SlidersHorizontal } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useTransition, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const categories = ["الكل", "رجالي", "نسائي", "صيفي", "شرقي", "غربي"];

export function ProductFilter() {
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
    <div className="sticky top-[80px] md:top-[100px] z-40 mb-12 px-4 md:px-0">
      <div className="glass-panel border border-secondary/20 rounded-[2rem] md:rounded-full px-6 py-4 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-xl shadow-secondary/5">
        
        {/* Search */}
        <div className="relative w-full lg:w-72 flex-shrink-0">
          <input 
            className="w-full bg-white/40 border border-secondary/10 rounded-full py-2 px-4 pr-12 text-sm font-alexandria text-[#2C2C2C] focus:border-secondary/30 focus:ring-0 placeholder:text-on-surface-variant/50 min-h-[48px] outline-none transition-all focus:bg-white/60" 
            placeholder="ابحث عن عطر..." 
            type="text" 
            aria-label="Search products"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary/40 w-5 h-5 pointer-events-none" />
          {isPending && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin" />
            </div>
          )}
        </div>
        
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar w-full lg:w-auto justify-start lg:justify-center py-1 -mx-2 px-2 lg:mx-0 lg:px-0 snap-x">
          {categories.map((category) => {
            const isActive = currentCategory === category;
            return (
              <button 
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`${
                  isActive 
                    ? 'bg-[#2C2C2C] text-white shadow-lg' 
                    : 'bg-white/20 text-[#2C2C2C] hover:bg-white/40'
                } font-alexandria text-xs font-medium px-6 rounded-full whitespace-nowrap transition-all duration-300 min-h-[44px] flex items-center justify-center snap-center`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Sort (Desktop only text, mobile icon only or refined) */}
        <button className="flex items-center gap-2 w-full lg:w-auto justify-end text-[#2C2C2C] hover:text-secondary transition-colors min-h-[44px] px-2 font-alexandria text-xs" aria-label="Sort products">
          <span className="font-medium tracking-wider">ترتيب حسب</span>
          <SlidersHorizontal className="w-5 h-5 opacity-70" />
        </button>
      </div>
    </div>
  );
}
