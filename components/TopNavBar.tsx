"use client";
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, User, Menu, X, LogOut, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '@/components/logo';
import { useCart } from '@/lib/context/CartContext';
import { createClient } from '@/utils/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export function TopNavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<{ avatar_url?: string | null } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { toggleCart, itemCount } = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserAndProfile = async (sessionUser?: SupabaseUser | null) => {
      let currentUser = sessionUser;
      if (currentUser === undefined) {
        const { data: { user } } = await supabase.auth.getUser();
        currentUser = user;
      }
      
      setUser(currentUser ?? null);
      
      if (currentUser) {
        const { data } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", currentUser.id)
          .single();
        setProfile(data);
      } else {
        setProfile(null);
      }
    };

    fetchUserAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        fetchUserAndProfile(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsProfileDropdownOpen(false);
    router.refresh();
  };

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
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className={`rounded-full transition-all duration-300 ease-out flex items-center justify-center min-h-[44px] min-w-[44px] border border-secondary/20 bg-white ${
                    avatarUrl ? 'p-1 hover:opacity-80' : 'px-2 md:px-4 hover:text-secondary hover:bg-secondary/5'
                  }`}
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="User" className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <User strokeWidth={1.5} className="w-5 h-5" />
                  )}
                </button>

                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white border border-secondary/10 rounded-xl shadow-lg py-2 overflow-hidden dir-rtl"
                    >
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/5 text-on-surface transition-colors"
                      >
                        <Settings strokeWidth={1.5} className="w-4 h-4 text-secondary" />
                        <span>إعدادات الحساب</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full text-right px-4 py-3 hover:bg-red-50 text-red-600 transition-colors"
                      >
                        <LogOut strokeWidth={1.5} className="w-4 h-4" />
                        <span>تسجيل الخروج</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="hover:text-secondary hover:bg-secondary/5 rounded-full px-2 md:px-4 transition-all duration-300 ease-out flex items-center justify-center min-h-[44px] min-w-[44px]"
              >
                <span className="hidden md:inline">تسجيل الدخول</span>
                <User strokeWidth={1.5} className="w-5 h-5 md:hidden" />
              </Link>
            )}
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
