"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/lib/data/products';
import { createClient } from '@/utils/supabase/client';
import { getDbCart, syncLocalCartToDb, updateDbCartItem, removeDbCartItem, clearDbCart } from '@/lib/actions/cart';
import { User } from '@supabase/supabase-js';

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
  addToCart: (product: Product, quantity?: number, variationId?: string) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  updateVariation: (cartItemId: string, newVariationId: string) => Promise<void>;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    setIsMounted(true);
    
    // 1. Load local cart first for immediate display
    const savedLocalCart = localStorage.getItem('ls_cart');
    if (savedLocalCart) {
      try {
        setItems(JSON.parse(savedLocalCart));
      } catch (e) {
        console.error('Failed to parse local cart', e);
      }
    }

    // 2. Initialize Auth and DB Cart
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user || null;
      setUser(currentUser);

      if (currentUser) {
        // Sync local items to DB if any exist
        const localItems = savedLocalCart ? JSON.parse(savedLocalCart) : [];
        if (localItems.length > 0) {
          await syncLocalCartToDb(localItems);
          localStorage.removeItem('ls_cart');
        }
        
        // Fetch DB cart
        const dbCart = await getDbCart();
        setItems(dbCart);
      }
      setIsInitializing(false);
    };

    initAuth();

    // 3. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      
      if (currentUser && event === 'SIGNED_IN') {
        const localItemsStr = localStorage.getItem('ls_cart');
        const localItems = localItemsStr ? JSON.parse(localItemsStr) : [];
        if (localItems.length > 0) {
          await syncLocalCartToDb(localItems);
          localStorage.removeItem('ls_cart');
        }
        const dbCart = await getDbCart();
        setItems(dbCart);
      } else if (!currentUser) {
        // Keep items in state for guest, or clear?
        // Usually logout clears the cart
        setItems([]);
        localStorage.removeItem('ls_cart');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  // Sync to local storage for guests whenever items change
  useEffect(() => {
    if (isMounted && !user && !isInitializing) {
      localStorage.setItem('ls_cart', JSON.stringify(items));
    }
  }, [items, user, isMounted, isInitializing]);

  const cartTotal = items.reduce((total, item) => {
    const price = item.variationId 
      ? item.product.variations?.find(v => v.id === item.variationId)?.price || item.product.price
      : item.product.price;
    return total + (price * item.quantity);
  }, 0);

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  const addToCart = async (product: Product, quantity: number = 1, variationId?: string) => {
    let newTotalQuantity = quantity;
    
    // Optimistic UI update
    setItems(prevItems => {
      const existingItem = prevItems.find(item => 
        item.product.id === product.id && item.variationId === variationId
      );

      if (existingItem) {
        newTotalQuantity = existingItem.quantity + quantity;
        return prevItems.map(item =>
          (item.product.id === product.id && item.variationId === variationId)
            ? { ...item, quantity: newTotalQuantity }
            : item
        );
      }

      return [...prevItems, { product, quantity, variationId }];
    });

    // DB update
    if (user) {
      await updateDbCartItem(product.id, newTotalQuantity, variationId);
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    const itemToRemove = items.find(item => {
      const id = item.variationId ? `${item.product.id}-${item.variationId}` : item.product.id;
      return id === cartItemId;
    });

    setItems(prevItems => prevItems.filter(item => {
      const id = item.variationId ? `${item.product.id}-${item.variationId}` : item.product.id;
      return id !== cartItemId;
    }));

    if (user && itemToRemove) {
      await removeDbCartItem(itemToRemove.product.id, itemToRemove.variationId);
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(cartItemId);
      return;
    }
    
    const itemToUpdate = items.find(item => {
      const id = item.variationId ? `${item.product.id}-${item.variationId}` : item.product.id;
      return id === cartItemId;
    });

    setItems(prevItems =>
      prevItems.map(item => {
        const id = item.variationId ? `${item.product.id}-${item.variationId}` : item.product.id;
        return id === cartItemId ? { ...item, quantity } : item;
      })
    );

    if (user && itemToUpdate) {
      await updateDbCartItem(itemToUpdate.product.id, quantity, itemToUpdate.variationId);
    }
  };

  const updateVariation = async (cartItemId: string, newVariationId: string) => {
    const itemToUpdate = items.find(item => {
      const id = item.variationId ? `${item.product.id}-${item.variationId}` : item.product.id;
      return id === cartItemId;
    });

    if (!itemToUpdate) return;
    if (itemToUpdate.variationId === newVariationId) return; // Do nothing if it's already the same variation

    const existingNewVariation = items.find(item => 
      item.product.id === itemToUpdate.product.id && item.variationId === newVariationId
    );

    let finalQuantity = itemToUpdate.quantity;

    setItems(prevItems => {
      if (existingNewVariation) {
        return prevItems
          .filter(item => {
            const id = item.variationId ? `${item.product.id}-${item.variationId}` : item.product.id;
            return id !== cartItemId; 
          })
          .map(item => {
            if (item.product.id === itemToUpdate.product.id && item.variationId === newVariationId) {
              return { ...item, quantity: item.quantity + itemToUpdate.quantity };
            }
            return item;
          });
      }

      return prevItems.map(item => {
        const id = item.variationId ? `${item.product.id}-${item.variationId}` : item.product.id;
        return id === cartItemId ? { ...item, variationId: newVariationId } : item;
      });
    });

    if (user) {
      await removeDbCartItem(itemToUpdate.product.id, itemToUpdate.variationId);
      if (existingNewVariation) {
        finalQuantity += existingNewVariation.quantity;
      }
      await updateDbCartItem(itemToUpdate.product.id, finalQuantity, newVariationId);
    }
  };

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const clearCart = async () => {
    setItems([]);
    if (user) {
      await clearDbCart();
    } else {
      localStorage.removeItem('ls_cart');
    }
  };


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
