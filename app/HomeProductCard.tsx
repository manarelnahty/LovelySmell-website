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

  const handleAddToCart = () => {
    addToCart(product, 1, selectedVariation?.id);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const handleBuyNow = () => {
    addToCart(product, 1, selectedVariation?.id);
    router.push('/checkout');
  };

  const isAdded = addedId === product.id;

  return (
    <div className="bg-white rounded-3xl p-6 group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-gray-100 hover:border-[#C4A36E]/30 flex flex-col justify-between h-full relative overflow-hidden">
      <div className="relative h-48 w-full mb-6 cursor-pointer" onClick={() => router.push(`/shop/${product.id}`)}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3"
        />
      </div>

      <div className="space-y-4">
        {/* Variation Toggle */}
        {product.variations && product.variations.length > 0 && (
          <div className="flex gap-2 justify-end">
            {product.variations.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariation(v)}
                className={`text-[9px] font-bold px-2 py-0.5 rounded-md border transition-all ${
                  selectedVariation?.id === v.id 
                    ? 'bg-[#C4A36E] text-white border-[#C4A36E]' 
                    : 'bg-white border-gray-200 text-gray-400 hover:border-[#C4A36E]/50'
                }`}
              >
                {v.volume}ml
              </button>
            ))}
          </div>
        )}

        <div className="flex justify-between items-end">
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              aria-label={`أضف ${product.name} إلى السلة`}
              className={`border rounded-full p-2.5 transition-all duration-300 active:scale-90 ${
                isAdded
                  ? 'bg-green-500 border-green-500 text-white scale-110'
                  : 'text-[#C4A36E] border-[#C4A36E] hover:bg-[#C4A36E] hover:text-white'
              }`}
            >
              {isAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
            
            <button
              onClick={handleBuyNow}
              aria-label="Buy now"
              className="bg-[#2C2C2C] text-white rounded-full p-2.5 hover:bg-black transition-all active:scale-90 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>

          <div className="text-left font-serif" dir="ltr">
            <h4 className="text-lg font-bold text-[#2C2C2C] mb-1 font-tajawal text-right truncate max-w-[120px]" dir="rtl">{product.name}</h4>
            <AnimatePresence mode="wait">
              <motion.span 
                key={displayPrice}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[#C4A36E] text-sm font-bold"
              >
                EGP {displayPrice}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
