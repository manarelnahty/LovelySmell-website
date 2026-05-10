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

  return (
    <motion.div variants={variants} className="col-span-1 group">
      <div className="block h-full bg-surface-container-lowest rounded-2xl overflow-hidden relative border border-outline-variant/30 flex flex-col hover:shadow-lg transition-all duration-500">
        <Link href={`/shop/${product.id}`} className="relative w-full aspect-square overflow-hidden bg-surface-variant/10 p-6 flex items-center justify-center">
          <Image 
            src={product.image} 
            alt={product.name} 
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-contain p-4 group-hover:scale-110 transition-transform duration-700" 
            priority={index < 4}
          />
          
          {/* Badge */}
          {product.category && product.category.length > 0 && (
            <div className="absolute top-4 right-4 bg-white/80 backdrop-blur border border-outline-variant/20 px-3 py-1 rounded-full text-label-sm font-label-sm text-secondary shadow-sm">
              {product.category[0]}
            </div>
          )}
        </Link>

        <div className="p-5 flex flex-col justify-between flex-grow bg-white">
          <div>
            <Link href={`/shop/${product.id}`}>
              <h3 className="font-body-lg text-body-lg text-on-background mb-1 font-medium group-hover:text-secondary transition-colors line-clamp-1">{product.name}</h3>
            </Link>
            
            {/* Volume Selector */}
            {product.variations && product.variations.length > 0 && (
              <div className="flex flex-wrap gap-2 my-3">
                {product.variations.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariation(v)}
                    className={`text-[10px] font-bold px-2 py-1 rounded-md border transition-all ${
                      selectedVariation?.id === v.id 
                        ? 'bg-secondary text-on-secondary border-secondary shadow-sm' 
                        : 'bg-surface-variant/10 border-outline-variant/30 text-on-surface-variant hover:border-secondary/50'
                    }`}
                  >
                    {v.volume}ml
                  </button>
                ))}
              </div>
            )}

            {/* Price with Animation */}
            <div className="h-6 mt-1">
              <AnimatePresence mode="wait">
                <motion.p 
                  key={displayPrice}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="font-body-md text-body-md text-secondary font-sans font-bold"
                >
                  {displayPrice} ج.م
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2">
            <button 
              onClick={handleBuyNow}
              className="flex-grow bg-secondary text-on-secondary py-2.5 px-4 rounded-xl font-label-md text-sm font-bold shadow-md hover:bg-secondary/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>اشتري الآن</span>
            </button>
            
            <button 
              aria-label="Add to cart" 
              onClick={handleAddToCart}
              className="border-2 border-secondary text-secondary rounded-xl w-10 h-10 flex items-center justify-center hover:bg-secondary/10 transition-all active:scale-90 flex-shrink-0"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
