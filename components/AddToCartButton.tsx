"use client";

import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { Product } from '@/lib/data/products';

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  return (
    <button 
      onClick={() => addToCart(product)}
      className="w-full py-4 rounded-full bg-primary-container text-[#C4A36E] font-body-md text-body-md flex items-center justify-center gap-3 hover:shadow-[0_0_20px_rgba(196,163,110,0.2)] transition-all mt-auto md:mt-12"
    >
      <ShoppingCart className="w-5 h-5" strokeWidth={1.5} />
      أضف إلى السلة
    </button>
  );
}
