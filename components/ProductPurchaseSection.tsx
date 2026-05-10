"use client";

import { ShoppingBag, ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { Product, ProductVariation } from '@/lib/data/products';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';

interface ProductPurchaseSectionProps {
  product: Product;
}

export function ProductPurchaseSection({ product }: ProductPurchaseSectionProps) {
  const { addToCart } = useCart();
  const router = useRouter();
  
  // Default to first variation or product base price
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | undefined>(
    product.variations && product.variations.length > 0 ? product.variations[0] : undefined
  );

  const displayPrice = selectedVariation ? selectedVariation.price : product.price;

  const handleBuyNow = () => {
    addToCart(product, 1, selectedVariation?.id);
    router.push('/checkout');
  };

  const handleAddToCart = () => {
    addToCart(product, 1, selectedVariation?.id);
  };

  return (
    <div className="flex flex-col space-y-8">
      {/* Dynamic Price Display */}
      <div className="h-10">
        <AnimatePresence mode="wait">
          <motion.p 
            key={displayPrice}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="font-headline-md text-3xl text-secondary"
          >
            {displayPrice} ج.م
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Size Selection */}
      {product.variations && product.variations.length > 0 && (
        <div className="space-y-4">
          <span className="block font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">اختر الحجم</span>
          <div className="flex flex-wrap gap-4">
            {product.variations.map((v) => (
              <button 
                key={v.id}
                onClick={() => setSelectedVariation(v)}
                className={`px-8 py-3.5 rounded-full font-label-md text-sm transition-all duration-300 border-2 ${
                  selectedVariation?.id === v.id
                    ? 'bg-secondary text-on-secondary border-secondary shadow-lg scale-105'
                    : 'bg-transparent border-secondary/20 text-on-surface hover:border-secondary/50'
                }`}
              >
                {v.volume}ml
                {v.stock < 5 && v.stock > 0 && (
                  <span className="block text-[8px] mt-0.5 opacity-80">كمية محدودة!</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button 
          onClick={handleBuyNow}
          className="flex-grow py-4 px-8 rounded-full bg-secondary text-on-secondary font-bold text-lg flex items-center justify-center gap-3 shadow-xl hover:bg-secondary/90 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>اشتري الآن</span>
        </button>
        
        <button 
          onClick={handleAddToCart}
          className="py-4 px-8 rounded-full bg-transparent border-2 border-secondary text-secondary font-bold text-lg flex items-center justify-center gap-3 hover:bg-secondary/5 transition-all"
        >
          <ShoppingCart className="w-5 h-5" strokeWidth={1.5} />
          <span>أضف للسلة</span>
        </button>
      </div>
    </div>
  );
}
