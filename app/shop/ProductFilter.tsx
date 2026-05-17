"use client";
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useTransition, useRef, useEffect } from 'react';
import { FilterDrawer } from './FilterDrawer';
import { motion, AnimatePresence } from 'motion/react';

export function ProductFilter({ categories }: { categories: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const currentCategory = searchParams.get('category') || "الكل";
  const currentQuery = searchParams.get('q') || "";

  const [searchTerm, setSearchTerm] = useState(currentQuery);
  const [isSearchExpanded, setIsSearchExpanded] = useState(!!currentQuery);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

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

  const clearSearch = () => {
    setSearchTerm("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    router.push(pathname + '?' + params.toString(), { scroll: false });
    setIsSearchExpanded(false);
  };

  return (
    <div className="backdrop-blur-md bg-white/70 border border-white/40 rounded-3xl md:rounded-full px-6 py-3.5 md:py-4 mb-12 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-[80px] md:top-[96px] z-40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] mt-6 max-w-5xl mx-auto w-full transition-all duration-300">
      {/* Symmetrical & Minimalist Search Input */}
      <div className="relative flex items-center h-10 w-full md:w-auto flex-shrink-0">
        <AnimatePresence initial={false}>
          {!isSearchExpanded ? (
            <motion.button
              key="search-trigger"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setIsSearchExpanded(true)}
              aria-label="Expand search"
              className="p-2 text-on-surface-variant hover:text-[#111] transition-colors rounded-full hover:bg-black/5"
            >
              <Search className="w-5 h-5 stroke-[1.2]" />
            </motion.button>
          ) : (
            <motion.div
              key="search-input"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "240px", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative flex items-center w-full md:w-60 bg-black/5 border-none rounded-full"
            >
              <input 
                ref={searchInputRef}
                className="w-full bg-transparent border-none py-1.5 pl-10 pr-4 text-xs font-tajawal text-on-background focus:ring-0 outline-none placeholder:text-on-surface-variant/50" 
                placeholder="ابحث عن عطر..." 
                type="text" 
                aria-label="Search products"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button 
                onClick={clearSearch} 
                className="absolute left-3 text-on-surface-variant/50 hover:text-[#111] transition-colors"
                aria-label="Close search"
              >
                <X className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Minimalist Navigation Categories */}
      <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar w-full md:w-auto justify-center py-1">
        {categories.map((category) => {
          const isActive = currentCategory === category;
          return (
            <button 
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`font-tajawal text-xs tracking-wider px-4 py-2 relative transition-all duration-300 ease-out whitespace-nowrap group ${
                isActive 
                  ? 'text-[#C4A36E] font-bold' 
                  : 'text-on-surface-variant/75 hover:text-[#C4A36E]'
              }`}
            >
              <span>{category}</span>
              <span 
                className={`absolute bottom-0 left-3 right-3 h-[1.5px] bg-[#C4A36E] transition-transform duration-300 origin-center ${
                  isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Advanced Filter Drawer Component */}
      <div className="flex-shrink-0">
        <FilterDrawer categories={categories} />
      </div>
    </div>
  );
}
