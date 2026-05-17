"use client";
import { X, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export function FilterDrawer({ categories }: { categories: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => { setMounted(true); }, []);

  // Filter state
  const [minPrice, setMinPrice] = useState(Number(searchParams.get('minPrice')) || 0);
  const [maxPrice, setMaxPrice] = useState(Number(searchParams.get('maxPrice')) || 2000);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');

  const toggleDrawer = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (minPrice > 0) params.set('minPrice', minPrice.toString());
    else params.delete('minPrice');
    
    if (maxPrice < 2000) params.set('maxPrice', maxPrice.toString());
    else params.delete('maxPrice');

    if (selectedCategory) params.set('category', selectedCategory);
    else params.delete('category');

    router.push(pathname + '?' + params.toString(), { scroll: false });
    setIsOpen(false);
  };

  const resetFilters = () => {
    setMinPrice(0);
    setMaxPrice(2000);
    setSelectedCategory('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('category');
    router.push(pathname + '?' + params.toString(), { scroll: false });
    setIsOpen(false);
  };

  const drawerContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleDrawer}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-sm md:max-w-md bg-[#fdfcfb] shadow-[-30px_0_60px_rgba(0,0,0,0.3)] z-[9999] flex flex-col border-l border-outline-variant/20 dir-rtl"
          >
            {/* Header */}
            <div className="p-8 pb-6 flex items-center justify-between border-b border-outline-variant/30">
              <div className="space-y-1">
                <h2 className="font-display-sm text-display-sm text-on-background">تخصيص البحث</h2>
                <p className="text-xs text-on-surface-variant opacity-70 font-medium">اختر تفضيلاتك لعرض النتائج</p>
              </div>
              <button onClick={toggleDrawer} className="w-10 h-10 flex items-center justify-center hover:bg-surface-variant rounded-full transition-all text-on-surface-variant">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto p-8 space-y-12 custom-scrollbar" data-lenis-prevent="true">
              
              {/* Category Selection */}
              <div className="space-y-6">
                <h3 className="font-label-lg text-label-lg text-on-background font-bold tracking-wide flex items-center gap-3">
                  <span className="w-1.5 h-5 bg-secondary rounded-full shadow-[0_0_10px_rgba(117,90,44,0.3)]"></span>
                  الأقسام
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => setSelectedCategory('')}
                    className={`px-6 py-2.5 rounded-full text-xs font-bold border transition-all duration-300 ${
                      !selectedCategory ? 'bg-secondary text-on-secondary border-secondary shadow-md' : 'bg-white text-on-surface-variant border-outline-variant hover:border-secondary'
                    }`}
                  >
                    الكل
                  </button>
                  {categories.map((cat) => (
                    <button 
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-6 py-2.5 rounded-full text-xs font-bold border transition-all duration-300 ${
                        selectedCategory === cat ? 'bg-secondary text-on-secondary border-secondary shadow-md' : 'bg-white text-on-surface-variant border-outline-variant hover:border-secondary'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Slider Section */}
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="font-label-lg text-label-lg text-on-background font-bold tracking-wide flex items-center gap-3">
                    <span className="w-1.5 h-5 bg-secondary rounded-full shadow-[0_0_10px_rgba(117,90,44,0.3)]"></span>
                    نطاق السعر
                  </h3>
                  <div className="bg-secondary/10 px-3 py-1 rounded-lg">
                    <span className="text-xs font-sans text-secondary font-bold">{minPrice} - {maxPrice} ج.م</span>
                  </div>
                </div>

                <div className="px-2">
                  <div className="relative h-2 w-full bg-outline-variant/30 rounded-full">
                    <div 
                      className="absolute h-full bg-secondary rounded-full"
                      style={{ 
                        right: `${(minPrice / 2000) * 100}%`, 
                        left: `${100 - (maxPrice / 2000) * 100}%` 
                      }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      step="50"
                      value={minPrice}
                      onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - 100))}
                      className="absolute w-full h-full appearance-none bg-transparent pointer-events-none z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-secondary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      step="50"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + 100))}
                      className="absolute w-full h-full appearance-none bg-transparent pointer-events-none z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-secondary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                  </div>
                  <div className="flex justify-between mt-4 text-[10px] text-on-surface-variant font-bold opacity-50 font-sans">
                    <span>2000 ج.م</span>
                    <span>0 ج.م</span>
                  </div>
                </div>
              </div>

              {/* Scent Tags Section */}
              <div className="space-y-6">
                <h3 className="font-label-lg text-label-lg text-on-background font-bold tracking-wide flex items-center gap-3">
                  <span className="w-1.5 h-5 bg-secondary rounded-full shadow-[0_0_10px_rgba(117,90,44,0.3)]"></span>
                  نوتات مميزة
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['عنبر', 'عود', 'باتشولي', 'ياسمين', 'فانيليا'].map(tag => (
                    <button key={tag} className="px-4 py-2 border border-outline-variant/40 rounded-lg text-[11px] font-bold text-on-surface-variant hover:bg-secondary/5 hover:border-secondary transition-all">
                      # {tag}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-8 border-t border-outline-variant/30 bg-white grid grid-cols-2 gap-4 shadow-[0_-15px_30px_rgba(0,0,0,0.03)]">
              <button onClick={resetFilters} className="py-4 rounded-xl border border-outline-variant text-on-surface font-bold hover:bg-surface-variant transition-all">
                مسح الإعدادات
              </button>
              <button onClick={applyFilters} className="py-4 rounded-xl bg-secondary text-on-secondary font-bold shadow-lg shadow-secondary/20 hover:brightness-110 active:scale-95 transition-all">
                تطبيق التغييرات
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  const activeFilterCount = [
    selectedCategory !== '',
    minPrice > 0,
    maxPrice < 2000
  ].filter(Boolean).length;

  return (
    <>
      <button onClick={toggleDrawer} className="relative flex items-center gap-3 text-on-surface-variant hover:text-secondary transition-all duration-300 min-h-[44px] px-5 rounded-full border border-outline-variant bg-white/50 shadow-sm group">
        <SlidersHorizontal className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
        <span className="font-label-md text-label-md font-bold">تصفية المنتجات</span>
        
        {activeFilterCount > 0 && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-5 h-5 bg-secondary text-on-secondary text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-white"
          >
            {activeFilterCount}
          </motion.span>
        )}
      </button>
      {mounted && createPortal(drawerContent, document.body)}
    </>
  );
}
