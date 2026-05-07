"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingBag, LogOut, Menu, X } from 'lucide-react';
import { Logo } from '@/components/logo';

const NAV_ITEMS = [
  { href: '/admin',          label: 'الرئيسية',   icon: LayoutDashboard },
  { href: '/admin/products', label: 'المنتجات',   icon: Package },
  { href: '/admin/orders',   label: 'الطلبات',    icon: ShoppingBag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const isAuth = sessionStorage.getItem('ls_admin_auth') === 'true';
    if (!isAuth) {
      router.replace('/admin/login');
    } else {
      setChecked(true);
    }
  }, [router]);

  function handleLogout() {
    sessionStorage.removeItem('ls_admin_auth');
    router.replace('/admin/login');
  }

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF9F3]">
        <div className="w-8 h-8 rounded-full border-2 border-[#C4A36E] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F5F1EA]" dir="rtl">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 right-0 z-40 w-64 bg-[#2C2C2C] text-white flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0 md:static md:flex`}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="pointer-events-none select-none scale-75 origin-right">
            <Logo dark />
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white/50 hover:text-white"
            aria-label="إغلاق القائمة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Label */}
        <div className="px-6 py-4">
          <span className="text-[10px] tracking-[0.2em] text-[#C4A36E]/60 uppercase font-semibold">
            لوحة الإدارة
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium
                  ${isActive
                    ? 'bg-[#C4A36E]/20 text-[#C4A36E]'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            id="admin-logout-btn"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/60 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.5} />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 md:mr-0">
        {/* Top bar (mobile) */}
        <header className="md:hidden flex items-center justify-between px-4 py-4 bg-white border-b border-[#C4A36E]/10 shadow-sm sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-[#2C2C2C] hover:text-[#C4A36E] transition-colors"
            aria-label="فتح القائمة"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-semibold text-[#2C2C2C] text-sm">لوحة الإدارة</span>
          <div className="w-6" />
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
