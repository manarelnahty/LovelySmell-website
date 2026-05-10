"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/lib/data/products';

export interface CartItem {
  product: Product;
  quantity: number;
  variationId?: string; // Tracks the currently selected size
}

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  cartTotal: number;
  itemCount: number;
  addToCart: (product: Product, quantity?: number, variationId?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  updateVariation: (cartItemId: string, newVariationId: string) => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // In a real app, we would load from localStorage here
  }, []);

  const cartTotal = items.reduce((total, item) => {
    const price = item.variationId 
      ? item.product.variations?.find(v => v.id === item.variationId)?.price || item.product.price
      : item.product.price;
    return total + (price * item.quantity);
  }, 0);

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  const addToCart = (product: Product, quantity: number = 1, variationId?: string) => {
    setItems(prevItems => {
      // Find if this exact product+size combo already exists
      const existingItem = prevItems.find(item => 
        item.product.id === product.id && item.variationId === variationId
      );

      if (existingItem) {
        return prevItems.map(item =>
          (item.product.id === product.id && item.variationId === variationId)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      // Generate a unique ID for this cart entry (product.id + variation suffix if exists)
      return [...prevItems, { product, quantity, variationId }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setItems(prevItems => prevItems.filter(item => {
      const id = item.variationId ? `${item.product.id}-${item.variationId}` : item.product.id;
      return id !== cartItemId;
    }));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(cartItemId);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item => {
        const id = item.variationId ? `${item.product.id}-${item.variationId}` : item.product.id;
        return id === cartItemId ? { ...item, quantity } : item;
      })
    );
  };

  const updateVariation = (cartItemId: string, newVariationId: string) => {
    setItems(prevItems => {
      // Find the item we want to change
      const itemToUpdate = prevItems.find(item => {
        const id = item.variationId ? `${item.product.id}-${item.variationId}` : item.product.id;
        return id === cartItemId;
      });

      if (!itemToUpdate) return prevItems;

      // Check if the NEW variation already exists in the cart
      const existingNewVariation = prevItems.find(item => 
        item.product.id === itemToUpdate.product.id && item.variationId === newVariationId
      );

      if (existingNewVariation) {
        // Merge them!
        return prevItems
          .filter(item => {
            const id = item.variationId ? `${item.product.id}-${item.variationId}` : item.product.id;
            return id !== cartItemId; // Remove the old one
          })
          .map(item => {
            if (item.product.id === itemToUpdate.product.id && item.variationId === newVariationId) {
              return { ...item, quantity: item.quantity + itemToUpdate.quantity };
            }
            return item;
          });
      }

      // Just update the variation ID
      return prevItems.map(item => {
        const id = item.variationId ? `${item.product.id}-${item.variationId}` : item.product.id;
        return id === cartItemId ? { ...item, variationId: newVariationId } : item;
      });
    });
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const clearCart = () => setItems([]);


  return (
    <CartContext.Provider value={{
      items,
      isCartOpen,
      cartTotal,
      itemCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateVariation,
      toggleCart,
      openCart,
      closeCart,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
