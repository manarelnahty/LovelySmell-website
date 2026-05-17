"use client";
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, User, Menu, X, LogOut, Settings, Package } from 'lucide-react';
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

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    ...(user ? [{ name: 'طلباتي',  href: '/my-orders' }] : []),
    { name: 'تتبع الطلب',  href: '/order-tracking' },
    { name: 'الشحن والإرجاع', href: '/shipping-policy' },
    { name: 'السياسات',    href: '/legal-policies' },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const hasDarkHero = pathname === '/' || pathname === '/shop';
  const showDarkTheme = hasDarkHero && !isScrolled && !isMobileMenuOpen;

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out border-b ${
          showDarkTheme 
            ? 'bg-transparent border-transparent py-5 md:py-6'
            : 'bg-white/80 backdrop-blur-[20px] border-[#e8e6df]/35 shadow-sm py-2 md:py-3'
        }`}
      >
        <div className="flex flex-row-reverse justify-between items-center w-full px-6 md:px-20 max-w-container-max mx-auto">
          {/* Brand */}
          <Link href="/" className="hover:opacity-80 transition-opacity scale-95 md:scale-105 z-50">
            <Logo />
          </Link>
          
          {/* Desktop Nav */}
          <ul className="hidden md:flex gap-2 lg:gap-6 font-tajawal text-sm tracking-wide items-center font-medium">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className={`px-3 py-2 transition-all duration-300 relative group flex items-center justify-center text-xs md:text-sm ${
                      isActive 
                        ? (showDarkTheme ? 'text-white font-bold' : 'text-[#111] font-bold') 
                        : (showDarkTheme ? 'text-white/75 hover:text-white' : 'text-[#666] hover:text-[#111]')
                    }`}
                  >
                    <span>{link.name}</span>
                    <span 
                      className={`absolute bottom-0 left-0 right-0 h-[1.5px] transition-transform duration-300 origin-center ${
                        showDarkTheme ? 'bg-white' : 'bg-[#111]'
                      } ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Actions & Mobile Toggle */}
          <div className={`flex flex-row-reverse md:flex-row items-center gap-2 md:gap-5 flex-shrink-0 font-tajawal text-sm z-50 ${
            showDarkTheme ? 'text-white' : 'text-[#111]'
          }`}>
            {/* Mobile Menu Toggle */}
            <button
              aria-label="Toggle Mobile Menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden rounded-full transition-all duration-300 ease-out flex items-center justify-center min-h-[40px] min-w-[40px] ${
                showDarkTheme 
                  ? 'hover:text-white hover:bg-white/10' 
                  : 'hover:text-[#111] hover:bg-[#111]/5'
              }`}
            >
              {isMobileMenuOpen ? <X strokeWidth={1} className="w-5.5 h-5.5" /> : <Menu strokeWidth={1} className="w-5.5 h-5.5" />}
            </button>

            <button 
              aria-label="Shopping Bag" 
              onClick={toggleCart}
              className={`rounded-full transition-all duration-300 ease-out flex items-center justify-center min-h-[40px] min-w-[40px] relative ${
                showDarkTheme 
                  ? 'hover:text-white hover:bg-white/10' 
                  : 'hover:text-[#111] hover:bg-[#111]/5'
              }`}
            >
              <ShoppingBag strokeWidth={1} className="w-5 h-5" />
              {itemCount > 0 && (
                <span className={`absolute top-1.5 right-1.5 text-[8px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-sans font-bold ${
                  showDarkTheme ? 'bg-white text-[#111]' : 'bg-[#111] text-white'
                }`}>
                  {itemCount}
                </span>
              )}
            </button>
            
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className={`rounded-full transition-all duration-300 ease-out flex items-center justify-center min-h-[40px] min-w-[40px] md:min-h-[44px] md:min-w-[44px] border transition-colors ${
                    showDarkTheme 
                      ? 'border-white/20 bg-white/10 text-white hover:bg-white/20' 
                      : 'border-[#e8e6df] bg-white text-[#111] hover:bg-[#FAF9F6]'
                  } ${avatarUrl ? 'p-1' : 'px-2 md:px-4'}`}
                >
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt="User" 
                      className="w-9 h-9 rounded-full object-cover border border-[#C4A36E]/40 hover:border-[#C4A36E] filter grayscale hover:grayscale-0 transition-all duration-300" 
                    />
                  ) : (
                    <User strokeWidth={1.5} className="w-5 h-5 text-[#C4A36E]" />
                  )}
                </button>

                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#e8e6df]/50 rounded-xl shadow-lg py-2 overflow-hidden dir-rtl"
                    >
                      <Link
                        href="/my-orders"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/5 text-on-surface transition-colors"
                      >
                        <Package strokeWidth={1.5} className="w-4 h-4 text-secondary" />
                        <span>طلباتي</span>
                      </Link>
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
                className={`rounded-full px-3 py-1.5 md:px-4 md:py-2 transition-all duration-300 ease-out flex items-center justify-center text-xs md:text-sm font-medium tracking-wide ${
                  showDarkTheme 
                    ? 'border border-white/20 bg-white/10 text-white hover:bg-white/20' 
                    : 'border border-[#e8e6df] bg-[#111] text-white hover:bg-transparent hover:text-[#111]'
                }`}
              >
                <span>تسجيل الدخول</span>
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
            className="fixed inset-0 z-40 bg-[#FAF9F6] pt-[88px] px-4 md:hidden flex flex-col dir-rtl"
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
                          ? 'text-[#111] bg-[#111]/5 font-bold' 
                          : 'text-on-surface hover:text-[#111] hover:bg-[#111]/5'
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
