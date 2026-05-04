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

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const links = [
    { name: 'الرئيسية',     href: '/' },
    { name: 'المتجر',       href: '/shop' },
    { name: 'تتبع الطلب',  href: '/order-tracking' },
    { name: 'الشحن والإرجاع', href: '/shipping-policy' },
    { name: 'السياسات',    href: '/legal-policies' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-[20px] border-b border-secondary/10 shadow-sm transition-all duration-300">
      <div className="flex flex-row-reverse justify-between items-center w-full px-4 md:px-16 py-4 md:py-6 max-w-container-max mx-auto">
        
        {/* Brand/Logo */}
        <div className="flex items-center gap-4">
          {/* Hamburger Menu (Mobile Only) */}
          <button 
            className="md:hidden p-2 hover:bg-secondary/5 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <Link href="/" className="hover:opacity-80 transition-opacity scale-90 md:scale-100 flex-shrink-0">
            <Logo />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-1 lg:gap-2 font-alexandria text-sm tracking-[0.1em] uppercase items-center">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.name}>
                <Link 
                  href={link.href} 
                  className={`rounded-full px-4 py-2 transition-all ease-out duration-300 min-h-[44px] flex items-center justify-center whitespace-nowrap ${
                    isActive 
                      ? 'text-secondary bg-secondary/10 font-medium' 
                      : 'text-on-surface hover:text-secondary hover:bg-secondary/5'
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-1 md:gap-4 text-on-surface flex-shrink-0 font-alexandria text-sm font-light">
          <Link 
            href="/login" 
            className="hover:text-secondary hover:bg-secondary/5 rounded-full px-2 md:px-4 transition-all duration-300 ease-out flex items-center justify-center min-h-[44px] min-w-[44px]"
            aria-label="User Profile"
          >
            {isSignedIn ? (
              <User strokeWidth={1} className="w-5 h-5" />
            ) : (
              <>
                <span className="hidden md:inline tracking-wider">تسجيل الدخول</span>
                <User strokeWidth={1} className="md:hidden w-6 h-6" />
              </>
            )}
          </Link>

          <button 
            aria-label="Shopping Bag" 
            onClick={toggleCart}
            className="hover:text-secondary hover:bg-secondary/5 rounded-full transition-all duration-300 ease-out flex items-center justify-center min-h-[44px] min-w-[44px] relative"
          >
            <ShoppingBag strokeWidth={1} className="w-6 h-6 md:w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 bg-secondary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-sans">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[51] md:hidden"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-[80%] max-w-[300px] bg-white z-[52] md:hidden shadow-2xl flex flex-col p-8"
            >
              <div className="flex justify-between items-center mb-12">
                <Logo />
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-secondary/5 rounded-full"
                >
                  <X size={24} />
                </button>
              </div>

              <ul className="flex flex-col gap-4 text-lg">
                {links.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <li key={link.name}>
                      <Link 
                        href={link.href}
                        className={`block py-3 px-4 rounded-2xl transition-all ${
                          isActive 
                            ? 'bg-secondary/10 text-secondary font-bold' 
                            : 'text-on-surface hover:bg-secondary/5'
                        }`}
                      >
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-auto pt-8 border-t border-secondary/10">
                <p className="text-xs text-secondary/50 tracking-widest uppercase mb-4">Lovely Smell EG</p>
                <div className="flex gap-4">
                  {/* Social icons could go here */}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
