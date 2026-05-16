"use client";

import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { Product } from '@/lib/data/products';

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const isOutOfStock = (product.stock ?? 0) <= 0;

  return (
    <button
      onClick={() => { if (!isOutOfStock) addToCart(product); }}
      disabled={isOutOfStock}
      className={`w-full py-4 rounded-full font-body-md text-body-md flex items-center justify-center gap-3 transition-all mt-auto md:mt-12 ${
        isOutOfStock
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-primary-container text-[#C4A36E] hover:shadow-[0_0_20px_rgba(196,163,110,0.2)]'
      }`}
    >
      <ShoppingCart className="w-5 h-5" strokeWidth={1.5} />
      {isOutOfStock ? 'نفد المخزون' : 'أضف إلى السلة'}
    </button>
  );
}
