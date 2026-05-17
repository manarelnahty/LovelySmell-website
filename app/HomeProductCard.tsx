"use client";
import Image from 'next/image';
import { Plus, Check, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, ProductVariation } from '@/lib/data/products';
import { useCart } from '@/lib/context/CartContext';
import { useRouter } from 'next/navigation';

interface HomeProductCardProps {
  product: Product;
}

export function HomeProductCard({ product }: HomeProductCardProps) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [addedId, setAddedId] = useState<string | null>(null);
  
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | undefined>(
    product.variations && product.variations.length > 0 ? product.variations[0] : undefined
  );

  const displayPrice = selectedVariation ? selectedVariation.price : product.price;
  const isOutOfStock = (product.stock ?? 0) <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, 1, selectedVariation?.id);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, 1, selectedVariation?.id);
    router.push('/checkout');
  };

  const isAdded = addedId === product.id;

  return (
    <div className="bg-white rounded-none p-5 group border border-black/[0.04] hover:border-black/[0.1] transition-all duration-500 flex flex-col justify-between h-full relative overflow-hidden">
      <div 
        className="relative h-56 w-full mb-5 cursor-pointer bg-gradient-to-tr from-[#fbf9f6] to-[#fefcfb] border border-black/[0.02] flex items-center justify-center overflow-hidden" 
        onClick={() => router.push(`/shop/${product.id}`)}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-6 transition-transform duration-700 group-hover:scale-103"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-10">
            <span className="bg-black/90 text-white text-[10px] uppercase tracking-widest font-medium px-4 py-2 font-sans">نفد المخزون</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 mt-auto">
        {/* Title and Price */}
        <div className="flex justify-between items-start">
          <div className="text-left font-sans" dir="ltr">
            <AnimatePresence mode="wait">
              <motion.span 
                key={displayPrice}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[#C4A36E] text-xs font-semibold tracking-wide font-sans"
              >
                EGP {displayPrice}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="text-right">
            <h4 
              className="text-sm font-light text-[#2C2C2C] hover:text-[#C4A36E] transition-colors duration-300 cursor-pointer line-clamp-1 max-w-[150px]"
              onClick={() => router.push(`/shop/${product.id}`)}
            >
              {product.name}
            </h4>
          </div>
        </div>

        {/* Variation Selection if multiple */}
        {product.variations && product.variations.length > 0 && (
          <div className="flex gap-1.5 justify-end">
            {product.variations.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariation(v)}
                className={`text-[9px] px-2 py-0.5 border transition-all duration-300 font-sans tracking-wider ${
                  selectedVariation?.id === v.id 
                    ? 'bg-[#2C2C2C] text-white border-[#2C2C2C]' 
                    : 'bg-white border-black/[0.08] text-gray-400 hover:border-black/20 hover:text-gray-700'
                }`}
              >
                {v.volume}ml
              </button>
            ))}
          </div>
        )}

        {/* Unified Luxury bottom actions row */}
        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-black/[0.03] font-sans">
          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className={`text-center text-[10px] uppercase tracking-widest bg-[#2C2C2C] text-white hover:bg-black py-2.5 transition-colors font-medium ${
              isOutOfStock ? 'opacity-30 cursor-not-allowed' : ''
            }`}
          >
            شراء
          </button>
          
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`text-center text-[10px] uppercase tracking-widest border py-2.5 transition-all font-medium ${
              isOutOfStock
                ? 'border-black/[0.06] text-gray-300 cursor-not-allowed'
                : isAdded
                  ? 'bg-green-600 border-green-600 text-white'
                  : 'border-black/[0.12] hover:border-black text-[#2C2C2C] hover:bg-black/[0.02]'
            }`}
          >
            {isAdded ? 'تمت الإضافة' : 'إضافة للسلة'}
          </button>
        </div>
      </div>
    </div>
  );
}
