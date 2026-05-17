"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ShoppingBag, ChevronDown } from 'lucide-react';
import { adminGetOrders, adminUpdateOrderStatus } from '@/lib/actions/orders';

type OrderStatus = 'جديد' | 'قيد التجهيز' | 'تم الشحن' | 'تم التسليم' | 'ملغي' | string;

const STATUS_COLORS: Record<string, string> = {
  'جديد':        'bg-blue-50 text-blue-700 border-blue-200',
  'قيد التجهيز': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'تم الشحن':    'bg-purple-50 text-purple-700 border-purple-200',
  'تم التسليم':  'bg-green-50 text-green-700 border-green-200',
  'ملغي':        'bg-red-50 text-red-600 border-red-200',
};

const ALL_STATUSES: OrderStatus[] = ['جديد', 'قيد التجهيز', 'تم الشحن', 'تم التسليم', 'ملغي'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | 'الكل'>('الكل');
  const [expanded, setExpanded] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const result = await adminGetOrders();
    if (result.success && result.data) {
      setOrders(result.data);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleStatusChange(orderId: string, status: OrderStatus) {
    await adminUpdateOrderStatus(orderId, status);
    load();
  }

  const filtered = filter === 'الكل' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#2C2C2C]">الطلبات</h1>
          <p className="text-[#747878] mt-1">{orders.length} طلب إجمالاً</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['الكل', ...ALL_STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm border transition-all duration-200
              ${filter === s
                ? 'bg-[#2C2C2C] text-white border-[#2C2C2C]'
                : 'border-[#C4A36E]/30 text-[#747878] hover:border-[#C4A36E] hover:text-[#C4A36E]'
              }`}
          >
            {s}
            {s !== 'الكل' && (
              <span className="mr-1.5 opacity-70">
                ({orders.filter((o) => o.status === s).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-4">
        {loading && <div className="text-center py-10 text-[#747878]">جاري التحميل...</div>}
        
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-[#747878]">
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>لا توجد طلبات بعد.</p>
            <p className="text-xs mt-1 opacity-60">ستظهر الطلبات هنا بعد أن يكمل العملاء عملية الشراء.</p>
          </div>
        )}

        {!loading && filtered.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-2xl border border-[#C4A36E]/10 shadow-sm overflow-hidden"
          >
            {/* Order Header */}
            <div className="p-5 flex flex-wrap items-center gap-4">
              {/* Order ID & Date */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-[#2C2C2C] text-sm font-mono">#{order.order_number || order.id.slice(0, 8).toUpperCase()}</span>
                  <span
                    className={`text-xs border px-2.5 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-[#747878] mt-1">
                  {new Date(order.created_at).toLocaleDateString('ar-EG', {
                    year: 'numeric', month: 'long', day: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </div>

              {/* Customer */}
              <div className="text-sm">
                <p className="font-semibold text-[#2C2C2C]">{order.customer_name}</p>
                <p className="text-[#747878] text-xs" dir="ltr">{order.customer_phone}</p>
              </div>

              {/* Total */}
              <div className="text-sm font-bold text-[#C4A36E] whitespace-nowrap">
                {order.total_amount.toLocaleString('ar-EG')} ج.م
              </div>

              {/* Status Selector */}
              <div className="relative">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                  className="appearance-none bg-[#F5F1EA] border border-[#C4A36E]/20 rounded-xl py-2 pr-3 pl-8 text-xs text-[#2C2C2C] outline-none cursor-pointer hover:border-[#C4A36E]/50 transition-colors"
                >
                  {ALL_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#747878] pointer-events-none" />
              </div>

              {/* Toggle Details */}
              <button
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                className="text-xs text-[#C4A36E] hover:underline whitespace-nowrap"
              >
                {expanded === order.id ? 'إخفاء' : 'التفاصيل'}
              </button>
            </div>

            {/* Expanded Details */}
            {expanded === order.id && (
              <div className="border-t border-[#C4A36E]/10 px-5 py-4 bg-[#FDF9F3] flex flex-col gap-4">
                {/* Delivery Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-[#747878] mb-1">المحافظة</p>
                    <p className="font-medium text-[#2C2C2C]">{order.customer_governorate}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs text-[#747878] mb-1">العنوان</p>
                    <p className="font-medium text-[#2C2C2C]">{order.customer_address}</p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <p className="text-xs text-[#747878] mb-2">المنتجات</p>
                  <div className="flex flex-col gap-2">
                    {order.order_items?.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-[#C4A36E]/10">
                        <div className="relative w-10 h-10 bg-[#F5F1EA] rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.products?.image || '/ls.png'}
                            alt={item.products?.name || 'Product'}
                            fill
                            sizes="40px"
                            className="object-contain p-1"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/ls.png'; }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#2C2C2C] line-clamp-1">{item.products?.name}</p>
                          <p className="text-xs text-[#747878]">
                            الكمية: {item.quantity} 
                            {item.volume && ` • الحجم: ${item.volume}${item.unit}`}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-[#C4A36E] whitespace-nowrap">
                          {(item.unit_price * item.quantity).toLocaleString('ar-EG')} ج.م
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="flex flex-col gap-1 text-sm border-t border-[#C4A36E]/10 pt-3">
                  <div className="flex justify-between text-[#747878]">
                    <span>المجموع الفرعي</span>
                    <span className="font-mono">{(order.total_amount - order.shipping_fee).toLocaleString('ar-EG')} ج.م</span>
                  </div>
                  <div className="flex justify-between text-[#747878]">
                    <span>الشحن</span>
                    <span className="font-mono">{order.shipping_fee === 0 ? 'مجاني' : `${order.shipping_fee} ج.م`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#2C2C2C] pt-1 border-t border-[#C4A36E]/10 mt-1">
                    <span>الإجمالي</span>
                    <span className="font-mono text-[#C4A36E]">{order.total_amount.toLocaleString('ar-EG')} ج.م</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
