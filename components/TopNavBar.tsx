"use client";
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ShoppingBag, User } from 'lucide-react';
import { Logo } from '@/components/logo';
import { useCart } from '@/lib/context/CartContext';

export function TopNavBar() {
  const pathname = usePathname();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { toggleCart, itemCount } = useCart();

  const links = [
    { name: 'الرئيسية',     href: '/' },
    { name: 'المتجر',       href: '/shop' },
    { name: 'تتبع الطلب',  href: '/order-tracking' },
    { name: 'الشحن والإرجاع', href: '/shipping-policy' },
    { name: 'السياسات',    href: '/legal-policies' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/50 backdrop-blur-[20px] border-b border-secondary/20 shadow-sm">
      <div className="flex flex-row-reverse justify-between items-center w-full px-16 py-6 max-w-container-max mx-auto">
        {/* Brand */}
        <Link href="/" className="hover:opacity-80 transition-opacity scale-90 md:scale-100">
          <Logo />
        </Link>
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
        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4 text-on-surface flex-shrink-0 font-serif text-sm">
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
            {isSignedIn ? <User strokeWidth={1.5} className="w-5 h-5" /> : "تسجيل الدخول"}
          </Link>
        </div>
      </div>
    </nav>
  );
}
