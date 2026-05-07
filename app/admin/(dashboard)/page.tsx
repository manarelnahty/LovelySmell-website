"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ShoppingBag, TrendingUp, ArrowLeft } from 'lucide-react';
import { getAdminOrders, getAdminProducts } from '@/lib/data/adminProducts';

export default function AdminDashboardPage() {
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [newOrders, setNewOrders] = useState(0);

  useEffect(() => {
    const products = getAdminProducts();
    const orders = getAdminOrders();
    setProductCount(products.length);
    setOrderCount(orders.length);
    setRevenue(orders.reduce((sum, o) => sum + o.grandTotal, 0));
    setNewOrders(orders.filter((o) => o.status === 'جديد').length);
  }, []);

  const stats = [
    {
      label: 'إجمالي المنتجات',
      value: productCount,
      icon: Package,
      color: 'bg-[#C4A36E]/10 text-[#C4A36E]',
      href: '/admin/products',
    },
    {
      label: 'إجمالي الطلبات',
      value: orderCount,
      icon: ShoppingBag,
      color: 'bg-blue-50 text-blue-600',
      href: '/admin/orders',
    },
    {
      label: 'طلبات جديدة',
      value: newOrders,
      icon: TrendingUp,
      color: 'bg-green-50 text-green-600',
      href: '/admin/orders',
    },
    {
      label: 'إجمالي الإيرادات',
      value: `${revenue.toLocaleString('ar-EG')} ج.م`,
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600',
      href: '/admin/orders',
    },
  ];

  return (
    <div dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2C2C2C]">مرحباً 👋</h1>
        <p className="text-[#747878] mt-1">هذه نظرة عامة على متجرك اليوم</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-2xl p-6 border border-[#C4A36E]/10 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className={`inline-flex p-3 rounded-xl mb-4 ${stat.color}`}>
              <stat.icon className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <div className="text-2xl font-bold text-[#2C2C2C] mb-1">{stat.value}</div>
            <div className="text-sm text-[#747878]">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-[#C4A36E]/10 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-[#2C2C2C] mb-5">إجراءات سريعة</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/admin/products"
            id="admin-goto-products"
            className="flex items-center justify-between bg-[#2C2C2C] text-white rounded-xl px-5 py-4 hover:bg-black transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-[#C4A36E]" strokeWidth={1.5} />
              <span className="font-medium">إدارة المنتجات</span>
            </div>
            <ArrowLeft className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:-translate-x-1 transition-all duration-200" />
          </Link>
          <Link
            href="/admin/orders"
            id="admin-goto-orders"
            className="flex items-center justify-between bg-[#C4A36E] text-white rounded-xl px-5 py-4 hover:bg-[#A88A58] transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
              <span className="font-medium">متابعة الطلبات</span>
            </div>
            <ArrowLeft className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:-translate-x-1 transition-all duration-200" />
          </Link>
        </div>
      </div>

      {/* Back to site */}
      <div className="text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#747878] hover:text-[#C4A36E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          العودة للموقع
        </Link>
      </div>
    </div>
  );
}
