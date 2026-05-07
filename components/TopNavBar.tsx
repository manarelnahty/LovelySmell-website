"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ShoppingBag, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '@/components/logo';
import { useCart } from '@/lib/context/CartContext';

export function TopNavBar() {
  const pathname = usePathname();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleCart, itemCount } = useCart();

  const links = [
    { name: 'الرئيسية',     href: '/' },
    { name: 'المتجر',       href: '/shop' },
    { name: 'تتبع الطلب',  href: '/order-tracking' },
    { name: 'الشحن والإرجاع', href: '/shipping-policy' },
    { name: 'السياسات',    href: '/legal-policies' },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/50 backdrop-blur-[20px] border-b border-secondary/20 shadow-sm">
        <div className="flex flex-row-reverse justify-between items-center w-full px-4 md:px-16 py-4 md:py-6 max-w-container-max mx-auto">
          {/* Brand */}
          <Link href="/" className="hover:opacity-80 transition-opacity scale-90 md:scale-100 z-50">
            <Logo />
          </Link>
          
          {/* Desktop Nav */}
          <ul className="hidden md:flex gap-1 lg:gap-4 font-serif text-sm tracking-widest uppercase items-center">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className={`rounded-full px-4 transition-all ease-out duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center ${
                      isActive 
                        ? 'text-secondary bg-secondary/10 font-bold' 
                        : 'text-on-surface hover:text-secondary hover:bg-secondary/5'
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Actions & Mobile Toggle */}
          <div className="flex flex-row-reverse md:flex-row items-center gap-1 md:gap-4 text-on-surface flex-shrink-0 font-serif text-sm z-50">
            {/* Mobile Menu Toggle */}
            <button
              aria-label="Toggle Mobile Menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden hover:text-secondary hover:bg-secondary/5 rounded-full transition-all duration-300 ease-out flex items-center justify-center min-h-[44px] min-w-[44px]"
            >
              {isMobileMenuOpen ? <X strokeWidth={1.5} className="w-6 h-6" /> : <Menu strokeWidth={1.5} className="w-6 h-6" />}
            </button>

            <button 
              aria-label="Shopping Bag" 
              onClick={toggleCart}
              className="hover:text-secondary hover:bg-secondary/5 rounded-full transition-all duration-300 ease-out flex items-center justify-center min-h-[44px] min-w-[44px] relative"
            >
              <ShoppingBag strokeWidth={1.5} className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-secondary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
            <Link 
              href="/login" 
              className="hover:text-secondary hover:bg-secondary/5 rounded-full px-2 md:px-4 transition-all duration-300 ease-out flex items-center justify-center min-h-[44px] min-w-[44px]"
            >
              {isSignedIn ? <User strokeWidth={1.5} className="w-5 h-5" /> : <span className="hidden md:inline">تسجيل الدخول</span>}
              {!isSignedIn && <User strokeWidth={1.5} className="w-5 h-5 md:hidden" />}
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background pt-[88px] px-4 md:hidden flex flex-col dir-rtl"
          >
            <ul className="flex flex-col gap-4 text-center mt-8">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className={`block rounded-2xl py-4 text-lg font-tajawal transition-all ease-out duration-300 ${
                        isActive 
                          ? 'text-secondary bg-secondary/10 font-bold' 
                          : 'text-on-surface hover:text-secondary hover:bg-secondary/5'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
