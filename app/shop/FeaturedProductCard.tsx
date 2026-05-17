"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Plus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, ProductVariation } from '@/lib/data/products';
import { useCart } from '@/lib/context/CartContext';
import { useRouter } from 'next/navigation';

interface FeaturedProductCardProps {
  product: Product;
  index: number;
  variants: any;
  type: 'featured' | 'editorial' | 'month';
}

export function FeaturedProductCard({ product, index, variants, type }: FeaturedProductCardProps) {
  const { addToCart } = useCart();
  const router = useRouter();
  
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | undefined>(
    product.variations && product.variations.length > 0 ? product.variations[0] : undefined
  );

  const displayPrice = selectedVariation ? selectedVariation.price : product.price;

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, selectedVariation?.id);
    router.push('/checkout');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, selectedVariation?.id);
  };

  if (type === 'featured') {
    return (
      <motion.div variants={variants} className="sm:col-span-2 sm:row-span-2 group flex flex-col">
        <div className="h-full bg-transparent overflow-hidden relative border border-[#e8e6df]/50 transition-all duration-500">
          <Link href={`/shop/${product.id}`} className="block relative w-full h-full min-h-[420px]">
            <Image 
              src={product.image} 
              alt={product.name} 
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-[1.02] transition-transform duration-1000 ease-out" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            {/* Elegant Minimal Badge */}
            <div className="absolute top-6 right-6 bg-[#C4A36E] text-white text-[9px] font-tajawal tracking-[0.2em] font-medium px-4 py-1.5 uppercase shadow-sm">
              إصدار مميز
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col sm:flex-row justify-between items-end gap-6 z-10">
              <div className="max-w-full sm:max-w-[65%] text-right">
                <h3 className="font-tajawal font-light text-2xl md:text-3xl text-white mb-2 leading-tight tracking-wide">{product.name}</h3>
                <p className="font-tajawal font-light text-xs text-white/80 line-clamp-2 mb-4 leading-relaxed">{product.description}</p>
                
                {/* Minimal Volume Selector */}
                {product.variations && product.variations.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {product.variations.map((v) => (
                      <button
                        key={v.id}
                        onClick={(e) => { e.preventDefault(); setSelectedVariation(v); }}
                        className={`text-[9px] font-medium px-3 py-1 border transition-all duration-300 ${
                          selectedVariation?.id === v.id 
                            ? 'bg-[#C4A36E] text-white border-[#C4A36E]' 
                            : 'bg-transparent border-white/30 text-white hover:bg-white/10'
                        }`}
                      >
                        {v.volume}ml
                      </button>
                    ))}
                  </div>
                )}
                
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={displayPrice}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="text-xl md:text-2xl font-light text-white font-sans tracking-widest font-bold"
                  >
                    {displayPrice} ج.م
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Obsidian Row */}
              <div className="flex items-stretch gap-2 w-full sm:w-auto">
                <button 
                  onClick={handleBuyNow}
                  className="flex-grow sm:flex-grow-0 bg-[#C4A36E] text-white border border-[#C4A36E] px-6 py-3 text-xs font-tajawal tracking-wider hover:bg-transparent hover:text-white transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 stroke-[1.2]" />
                  <span>شراء الآن</span>
                </button>
                <button 
                  onClick={handleAddToCart}
                  className="bg-transparent border border-white/20 hover:border-[#C4A36E] hover:text-[#C4A36E] text-white w-12 flex items-center justify-center hover:bg-[#C4A36E]/10 transition-all duration-300"
                  aria-label="Add to cart"
                >
                  <Plus className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>
            </div>
          </Link>
        </div>
      </motion.div>
    );
  }

  if (type === 'month') {
    return (
      <motion.div variants={variants} className="sm:col-span-1 sm:row-span-2 group flex flex-col">
        <div className="h-full bg-transparent border border-[#e8e6df]/50 p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-700 hover:border-[#111]/20 min-h-[500px]">
          <Link href={`/shop/${product.id}`} className="absolute inset-0">
            <Image 
              src={product.image} 
              alt={product.name} 
              fill 
              sizes="(max-width: 768px) 100vw, 25vw" 
              className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000 ease-out" 
            />
            {/* Blend backdrop gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F6]/10 to-[#FAF9F6]/95"></div>
          </Link>
          
          <div className="relative z-10 pointer-events-none text-right">
            <span className="inline-block px-3 py-1 bg-[#C4A36E] text-white text-[9px] tracking-[0.25em] font-tajawal mb-6 uppercase">عطر الشهر</span>
            <h3 className="font-tajawal font-light text-xl text-[#111] mb-3 leading-tight tracking-wide">{product.name}</h3>
            <p className="font-tajawal font-light text-xs text-on-surface-variant/80 line-clamp-4 leading-relaxed">{product.description}</p>
          </div>
          
          <div className="relative z-10 mt-auto">
            {/* Volume Selector for Month Card */}
            {product.variations && product.variations.length > 0 && (
              <div className="flex gap-1.5 mb-6 justify-end">
                {product.variations.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariation(v)}
                    className={`text-[9px] font-medium px-2 py-0.5 border transition-all duration-300 ${
                      selectedVariation?.id === v.id 
                        ? 'bg-[#C4A36E] text-white border-[#C4A36E]' 
                        : 'bg-white/80 border-[#e2dfd9] text-on-surface-variant/80 hover:border-[#C4A36E]/50'
                    }`}
                  >
                    {v.volume}ml
                  </button>
                ))}
              </div>
            )}

            <div className="pt-6 flex justify-between items-stretch gap-2 border-t border-[#111]/5">
              <button 
                onClick={handleAddToCart}
                className="bg-[#C4A36E] text-white hover:bg-transparent hover:text-[#C4A36E] border border-[#C4A36E] flex-grow py-2.5 px-4 text-xs font-tajawal transition-all duration-300 flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 stroke-[1.5]" />
                <span>إضافة للسلة</span>
              </button>
              
              <div className="flex items-center">
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={displayPrice}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs md:text-sm font-sans tracking-widest text-[#111] font-bold"
                  >
                    {displayPrice} ج.م
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Editorial fallback / banner overlay
  return (
    <motion.div variants={variants} className="sm:col-span-2 sm:row-span-1 group flex flex-col">
      <Link href={`/shop/${product.id}`} className="block h-full bg-transparent flex items-center justify-center p-8 text-center relative overflow-hidden border border-[#e8e6df]/50 hover:border-[#111]/20 transition-all duration-700 min-h-[180px]">
        <Image 
          src={product.image} 
          alt={product.name} 
          fill 
          sizes="(max-width: 768px) 100vw, 50vw" 
          className="object-cover opacity-30 mix-blend-luminosity group-hover:scale-[1.03] transition-transform duration-1000 ease-out" 
        />
        <div className="absolute inset-0 bg-[#FAF9F6]/20 group-hover:bg-[#FAF9F6]/0 transition-colors"></div>
        <div className="relative z-10 p-6 backdrop-blur-md bg-white/40 border border-white/30 px-8 py-5">
          <h3 className="font-tajawal font-light text-base md:text-lg text-[#111] tracking-wide mb-2 leading-tight">
            {product.name}
          </h3>
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#111] font-medium tracking-wide">
            <span>اكتشف التفاصيل</span>
            <ArrowLeft className="w-3.5 h-3.5 stroke-[1.2] rtl:rotate-180" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
