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
      <motion.div variants={variants} className="sm:col-span-2 sm:row-span-2 group">
        <div className="h-full bg-surface-container-lowest rounded-2xl overflow-hidden relative shadow-sm hover:shadow-xl transition-all duration-500 border border-outline-variant/20">
          <Link href={`/shop/${product.id}`} className="block relative w-full h-full min-h-[400px]">
            <Image 
              src={product.image} 
              alt={product.name} 
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-1000" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
            <div className="absolute top-6 right-6 bg-secondary/90 backdrop-blur px-4 py-1.5 rounded-full text-label-sm font-label-sm text-on-secondary shadow-lg">إصدار مميز</div>
            
            <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col sm:flex-row justify-between items-end gap-6">
              <div className="max-w-full sm:max-w-[65%]">
                <h3 className="font-headline-lg text-headline-lg text-white mb-2 leading-tight">{product.name}</h3>
                <p className="font-body-md text-body-md text-white/80 line-clamp-2 mb-4">{product.description}</p>
                
                {/* Volume Selector for Featured */}
                {product.variations && product.variations.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {product.variations.map((v) => (
                      <button
                        key={v.id}
                        onClick={(e) => { e.preventDefault(); setSelectedVariation(v); }}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                          selectedVariation?.id === v.id 
                            ? 'bg-secondary text-on-secondary border-secondary' 
                            : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
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
                    className="font-body-lg text-secondary-fixed text-2xl font-sans font-bold"
                  >
                    {displayPrice} ج.م
                  </motion.span>
                </AnimatePresence>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <button 
                  onClick={handleBuyNow}
                  className="flex-grow sm:flex-grow-0 bg-secondary text-on-secondary px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>اشتري الآن</span>
                </button>
                <button 
                  onClick={handleAddToCart}
                  className="bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-white/20 transition-all"
                >
                  <Plus className="w-6 h-6" />
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
      <motion.div variants={variants} className="sm:col-span-1 sm:row-span-2 group">
        <div className="h-full glass-panel border border-secondary/30 rounded-2xl p-8 flex flex-col justify-between relative overflow-hidden hover:shadow-xl transition-all duration-500 min-h-[500px]">
          <Link href={`/shop/${product.id}`} className="absolute inset-0">
            <Image 
              src={product.image} 
              alt={product.name} 
              fill 
              sizes="(max-width: 768px) 100vw, 25vw" 
              className="object-cover opacity-90 group-hover:scale-110 transition-transform duration-1000" 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-white/95"></div>
          </Link>
          
          <div className="relative z-10 pointer-events-none">
            <span className="inline-block px-4 py-1.5 bg-secondary text-on-secondary rounded-full font-label-sm text-label-sm mb-6 shadow-md">عطر الشهر</span>
            <h3 className="font-headline-md text-headline-md text-on-background mb-4 leading-tight">{product.name}</h3>
            <p className="font-body-md text-body-md text-on-surface-variant/90 line-clamp-4">{product.description}</p>
          </div>
          
          <div className="relative z-10 mt-auto">
            {/* Volume Selector for Month Card */}
            {product.variations && product.variations.length > 0 && (
              <div className="flex gap-2 mb-6">
                {product.variations.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariation(v)}
                    className={`text-[10px] font-bold px-2 py-1 rounded border transition-all ${
                      selectedVariation?.id === v.id 
                        ? 'bg-secondary text-on-secondary border-secondary' 
                        : 'bg-white border-outline-variant/30 text-on-surface-variant'
                    }`}
                  >
                    {v.volume}ml
                  </button>
                ))}
              </div>
            )}

            <div className="pt-6 flex justify-between items-center border-t border-secondary/10">
              <AnimatePresence mode="wait">
                <motion.span 
                  key={displayPrice}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-body-lg text-secondary font-bold font-sans text-xl"
                >
                  {displayPrice} ج.م
                </motion.span>
              </AnimatePresence>
              <button 
                onClick={handleAddToCart}
                className="bg-secondary text-on-secondary p-3 rounded-full shadow-md hover:scale-110 transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Editorial (default/fallback)
  return (
    <motion.div variants={variants} className="sm:col-span-2 sm:row-span-1 group">
      <Link href={`/shop/${product.id}`} className="block h-full bg-surface-variant rounded-2xl flex items-center justify-center p-8 text-center relative overflow-hidden hover:shadow-lg transition-all duration-500 border border-secondary/10">
        <Image 
          src={product.image} 
          alt={product.name} 
          fill 
          sizes="(max-width: 768px) 100vw, 50vw" 
          className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000" 
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
        <div className="relative z-10 p-6 glass-panel border border-white/20 rounded-xl">
          <h3 className="font-headline-md text-headline-md text-on-surface leading-tight drop-shadow-sm mb-2">
            {product.name}
          </h3>
          <div className="flex items-center justify-center gap-2 text-secondary font-medium">
            <span>اكتشف التفاصيل</span>
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
