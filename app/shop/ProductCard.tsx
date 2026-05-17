"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Plus, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, ProductVariation } from '@/lib/data/products';
import { useCart } from '@/lib/context/CartContext';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
  index: number;
  variants: any; // framer motion variants
}

export function ProductCard({ product, index, variants }: ProductCardProps) {
  const { addToCart } = useCart();
  const router = useRouter();
  
  // Default to the first variation or a fallback
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | undefined>(
    product.variations && product.variations.length > 0 ? product.variations[0] : undefined
  );

  const displayPrice = selectedVariation ? selectedVariation.price : product.price;
  const isOutOfStock = (product.stock ?? 0) <= 0;

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1, selectedVariation?.id);
    router.push('/checkout');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1, selectedVariation?.id);
  };

  return (
    <motion.div variants={variants} className="col-span-1 group flex flex-col">
      {/* Symmetrical Luxury Container */}
      <div className="flex flex-col h-full bg-transparent overflow-hidden relative">
        <Link href={`/shop/${product.id}`} className="relative w-full aspect-[4/5] overflow-hidden bg-[#F5F4F0] border border-[#e8e6df]/50 flex items-center justify-center transition-all duration-700 group-hover:border-[#111]/20">
          <Image 
            src={product.image} 
            alt={product.name} 
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-700 ease-out" 
            priority={index < 4}
          />
          
          {/* Symmetrical, minimal out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-[#FAF9F6]/85 backdrop-blur-[1px] flex items-center justify-center z-10">
              <span className="border border-[#111]/25 text-[#111] text-[10px] tracking-[0.2em] font-tajawal px-4 py-2 uppercase bg-white/50">
                نفد المخزون
              </span>
            </div>
          )}
        </Link>

        {/* Center-aligned Editorial Content */}
        <div className="pt-5 pb-2 flex flex-col items-center justify-between flex-grow text-center">
          <div className="w-full flex flex-col items-center space-y-2">
            {/* Minimal Luxury Category Tag */}
            {product.category && product.category.length > 0 && (
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#888] font-light">
                {product.category[0]}
              </span>
            )}
            
            <Link href={`/shop/${product.id}`} className="w-full">
              <h3 className="font-tajawal font-light text-sm md:text-base text-[#111] tracking-wide hover:opacity-75 transition-opacity line-clamp-1 px-2">
                {product.name}
              </h3>
            </Link>
            
            {/* Minimalist sharp-corner volume selectors */}
            {product.variations && product.variations.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1.5 my-1.5">
                {product.variations.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariation(v)}
                    className={`text-[9px] font-medium px-2 py-0.5 border transition-all duration-300 ${
                      selectedVariation?.id === v.id 
                        ? 'bg-[#C4A36E] text-white border-[#C4A36E]' 
                        : 'bg-transparent border-[#e2dfd9] text-on-surface-variant/80 hover:border-[#C4A36E]/50'
                    }`}
                  >
                    {v.volume}ml
                  </button>
                ))}
              </div>
            )}

            {/* Premium center-aligned Price */}
            <div className="h-5 flex items-center justify-center mt-1">
              <AnimatePresence mode="wait">
                <motion.p 
                  key={displayPrice}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  className="text-xs md:text-sm font-light text-[#111] font-sans tracking-widest font-bold"
                >
                  {displayPrice} ج.م
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Symmetrical sharp action row */}
          <div className="mt-5 w-full flex items-stretch gap-1.5 px-1">
            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className={`flex-grow py-3 px-4 font-tajawal text-xs tracking-wider transition-all duration-300 flex items-center justify-center gap-2 border transition-colors ${
                isOutOfStock
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-[#C4A36E] text-white border-[#C4A36E] hover:bg-transparent hover:text-[#C4A36E]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 stroke-[1.2]" />
              <span>{isOutOfStock ? 'غير متوفر' : 'شراء الآن'}</span>
            </button>

            <button
              aria-label="Add to cart"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`border w-12 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                isOutOfStock
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-[#C4A36E]/20 text-[#111] hover:bg-[#C4A36E] hover:text-white hover:border-[#C4A36E]'
              }`}
            >
              <Plus className="w-4 h-4 stroke-[1.5]" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
