"use client";
import { Search, SlidersHorizontal } from 'lucide-react';

export function ProductFilter() {
  return (
    <div className="glass-panel border border-secondary/20 rounded-full px-6 py-4 mb-stack-lg flex flex-col md:flex-row items-center justify-between gap-4 sticky top-[100px] z-40 shadow-sm shadow-secondary/5">
      {/* Search */}
      <div className="relative w-full md:w-auto flex-shrink-0">
        <input 
          className="w-full md:w-64 bg-surface-container-lowest/50 border border-outline-variant rounded-full py-2 px-4 pr-12 text-body-md font-body-md text-on-background focus:border-secondary focus:ring-0 placeholder:text-on-surface-variant/70 min-h-[44px] outline-none" 
          placeholder="ابحث عن عطر..." 
          type="text" 
          aria-label="Search products"
        />
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/70 w-5 h-5 pointer-events-none" />
      </div>
      
      {/* Categories */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar w-full md:w-auto justify-center py-1">
        <button className="bg-primary-container text-on-primary font-label-sm text-label-sm px-6 rounded-full whitespace-nowrap transition-colors min-h-[44px]">الكل</button>
        <button className="border border-outline-variant text-on-surface hover:bg-surface-variant font-label-sm text-label-sm px-6 rounded-full whitespace-nowrap transition-colors min-h-[44px]">رجالي</button>
        <button className="border border-outline-variant text-on-surface hover:bg-surface-variant font-label-sm text-label-sm px-6 rounded-full whitespace-nowrap transition-colors min-h-[44px]">نسائي</button>
        <button className="border border-outline-variant text-on-surface hover:bg-surface-variant font-label-sm text-label-sm px-6 rounded-full whitespace-nowrap transition-colors min-h-[44px]">صيفي</button>
        <button className="border border-outline-variant text-on-surface hover:bg-surface-variant font-label-sm text-label-sm px-6 rounded-full whitespace-nowrap transition-colors min-h-[44px]">شرقي</button>
        <button className="border border-outline-variant text-on-surface hover:bg-surface-variant font-label-sm text-label-sm px-6 rounded-full whitespace-nowrap transition-colors min-h-[44px]">غربي</button>
      </div>

      {/* Sort */}
      <button className="flex items-center gap-2 w-full md:w-auto justify-end text-on-surface-variant hover:text-secondary transition-colors min-h-[44px] px-2" aria-label="Sort products">
        <span className="font-label-sm text-label-sm">ترتيب حسب</span>
        <SlidersHorizontal className="w-5 h-5" />
      </button>
    </div>
  );
}
