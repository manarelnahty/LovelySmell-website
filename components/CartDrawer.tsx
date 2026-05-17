"use client";

import { useCart } from '@/lib/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, ArrowLeft, MessageCircle, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';

export function CartDrawer() {
  const { isCartOpen, closeCart, items, cartTotal, itemCount, updateQuantity, updateVariation, removeFromCart } = useCart();
  // isVisible controls whether we keep the element in the DOM (for exit animation)
  const [isVisible, setIsVisible] = useState(false);
  // isAnimated controls the CSS transition class (translate-x)
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    if (isCartOpen) {
      setIsVisible(true);
      // Tiny delay so browser renders the initial off-screen state first
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsAnimated(true));
      });
      document.body.style.overflow = 'hidden';
      return () => cancelAnimationFrame(raf);
    } else {
      // Start exit animation first, then unmount after transition completes
      setIsAnimated(false);
      const timer = setTimeout(() => setIsVisible(false), 500);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isCartOpen]);

  const FREE_SHIPPING_THRESHOLD = 1500;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);
  const progressPercentage = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay — fades in/out */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${
          isAnimated ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Cart Drawer — slides in from right */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] z-[70] flex flex-col
          shadow-[-20px_0_60px_rgba(0,0,0,0.12)] dir-rtl
          bg-surface-container-lowest/90 backdrop-blur-3xl border-l border-secondary/20
          transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${isAnimated ? 'translate-x-0' : 'translate-x-full'}`}
        aria-modal="true"
        role="dialog"
        aria-label="سلة التسوق"
      >
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-6 border-b border-secondary/20 bg-white/50">
          <div>
            <h2 className="font-headline-md text-headline-md text-primary-container">سلة التسوق</h2>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-2">{itemCount} منتجات</p>
          </div>
          <button
            onClick={closeCart}
            className="w-10 h-10 rounded-full border border-secondary/30 flex items-center justify-center text-secondary hover:bg-secondary/10 transition-colors"
            aria-label="إغلاق السلة"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Shipping Progress */}
        <div className="px-8 py-4 bg-[#F5F1EA]/50 border-b border-secondary/20">
          <p className="font-body-md text-body-md text-secondary mb-2 text-center">
            {remainingForFreeShipping > 0
              ? `أضف ${remainingForFreeShipping.toLocaleString('ar-EG')} ج.م إضافية للشحن المجاني`
              : '🎉 تهانينا! لقد حصلت على شحن مجاني'}
          </p>
          <div className="w-full h-1.5 bg-secondary/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-l from-secondary to-secondary/60 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Cart Items (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5" data-lenis-prevent="true">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-on-surface-variant gap-4">
              <ShoppingCart className="w-16 h-16 text-secondary/30" strokeWidth={1} />
              <p className="font-body-lg text-body-lg">سلة التسوق فارغة</p>
              <button
                onClick={closeCart}
                className="text-secondary underline underline-offset-4 hover:text-primary-container transition-colors"
              >
                مواصلة التسوق
              </button>
            </div>
          ) : (
            items.map((item, index) => {
              const cartItemId = item.variationId ? `${item.product.id}-${item.variationId}` : item.product.id;
              const currentVariation = item.product.variations?.find(v => v.id === item.variationId);
              const displayPrice = currentVariation ? currentVariation.price : item.product.price;

              return (
                <div
                  key={cartItemId}
                  className="flex flex-col bg-white/80 p-4 rounded-xl shadow-[0_4px_20px_rgba(196,163,110,0.08)] border border-secondary/10"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-[80px] h-[100px] bg-surface-container-low rounded-lg overflow-hidden shrink-0 flex items-center justify-center relative border border-secondary/10">
                      <Image
                        alt={item.product.name}
                        src={item.product.image}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <h3 className="font-body-lg text-body-lg text-primary-container font-bold line-clamp-1">{item.product.name}</h3>
                          <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">{item.product.category[0]}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(cartItemId)}
                          className="w-7 h-7 flex-shrink-0 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-error/10 hover:text-error transition-colors"
                          aria-label={`إزالة ${item.product.name}`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variation Switcher inside Cart */}
                      {item.product.variations && item.product.variations.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {item.product.variations.map((v) => (
                            <button
                              key={v.id}
                              onClick={() => updateVariation(cartItemId, v.id)}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition-all ${
                                item.variationId === v.id 
                                  ? 'bg-secondary text-on-secondary border-secondary' 
                                  : 'bg-surface-variant/5 border-secondary/20 text-secondary/60 hover:border-secondary/40'
                              }`}
                            >
                              {v.volume}ml
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2 border border-secondary/30 rounded-full px-3 py-1">
                          <button
                            onClick={() => updateQuantity(cartItemId, item.quantity - 1)}
                            className="w-5 h-5 flex items-center justify-center text-secondary hover:bg-secondary/10 rounded-full transition-colors"
                            aria-label="تقليل الكمية"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-body-md text-body-md w-5 text-center tabular-nums">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(cartItemId, item.quantity + 1)}
                            className="w-5 h-5 flex items-center justify-center text-secondary hover:bg-secondary/10 rounded-full transition-colors"
                            aria-label="زيادة الكمية"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-body-lg text-body-lg text-primary-container font-bold tabular-nums">
                          {(displayPrice * item.quantity).toLocaleString('ar-EG')} ج.م
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer / Summary */}
        {items.length > 0 && (
          <div className="px-8 py-6 bg-white/80 border-t border-secondary/20 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
                <span>المجموع الفرعي</span>
                <span className="tabular-nums">{cartTotal.toLocaleString('ar-EG')} ج.م</span>
              </div>
              <div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
                <span>الشحن</span>
                <span>{remainingForFreeShipping === 0 ? 'مجاني 🎉' : 'يُحسب عند الدفع'}</span>
              </div>
              <div className="flex justify-between font-headline-md text-headline-md text-primary-container border-t border-secondary/20 pt-3">
                <span>الإجمالي</span>
                <span className="tabular-nums">{cartTotal.toLocaleString('ar-EG')} ج.م</span>
              </div>
            </div>

            <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full py-4 bg-primary-container text-secondary font-body-lg text-body-lg rounded-full hover:shadow-[0_0_20px_rgba(196,163,110,0.4)] active:scale-[0.98] transition-all duration-200 flex items-center justify-center"
              >
                إتمام الطلب
              </Link>
            <a
              href="https://wa.me/201018580523"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 bg-transparent border-[1.5px] border-secondary text-secondary font-body-md text-body-md rounded-full hover:bg-secondary/5 active:scale-[0.98] transition-all duration-200 flex justify-center items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
              أكمل طلبك عبر واتساب
            </a>

            <div className="text-center pt-1">
              <button
                onClick={closeCart}
                className="inline-flex items-center gap-2 font-body-md text-body-md text-secondary/70 hover:text-secondary transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-300 rtl:rotate-180" />
                مواصلة التسوق
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
