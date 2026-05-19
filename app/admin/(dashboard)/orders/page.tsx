"use client";

import { useEffect, useState, useTransition } from 'react';
import Image from 'next/image';
import {
  ShoppingBag, ChevronDown, Phone, MapPin, RefreshCw,
  Loader2, Copy, Check, MessageCircle, Package,
} from 'lucide-react';
import { adminGetOrders, adminUpdateOrderStatus } from '@/lib/actions/orders';

// ─── Types ───────────────────────────────────────────────────────────────────

interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  volume: number | null;
  unit: string | null;
  products: {
    id: string;
    name: string;
    image: string;
  } | null;
}

interface AdminOrder {
  id: string;
  order_number: string | null;
  customer_name: string;
  customer_phone: string;
  customer_governorate: string | null;
  customer_address: string;
  shipping_fee: number;
  total_amount: number;
  payment_method: string | null;
  status: string;
  created_at: string;
  order_items: OrderItem[];
}

// ─── Config ───────────────────────────────────────────────────────────────────

type StatusKey = 'جديد' | 'قيد التجهيز' | 'تم الشحن' | 'تم التسليم' | 'ملغي';

const STATUS_CONFIG: Record<StatusKey, { badge: string; dot: string; label: string }> = {
  'جديد':        { badge: 'bg-blue-50 text-blue-700 border-blue-200',     dot: 'bg-blue-500',   label: 'جديد' },
  'قيد التجهيز': { badge: 'bg-amber-50 text-amber-700 border-amber-200',   dot: 'bg-amber-500',  label: 'قيد التجهيز' },
  'تم الشحن':    { badge: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500', label: 'تم الشحن' },
  'تم التسليم':  { badge: 'bg-green-50 text-green-700 border-green-200',   dot: 'bg-green-500',  label: 'تم التسليم' },
  'ملغي':        { badge: 'bg-red-50 text-red-600 border-red-200',         dot: 'bg-red-500',    label: 'ملغي' },
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG) as StatusKey[];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ar-EG', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function statusCfg(status: string) {
  return STATUS_CONFIG[status as StatusKey] ?? {
    badge: 'bg-gray-100 text-gray-700 border-gray-200',
    dot: 'bg-gray-400',
    label: status,
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }
  return (
    <button onClick={copy} className="p-1 rounded hover:bg-[#C4A36E]/10 transition-colors">
      {copied
        ? <Check className="w-3 h-3 text-green-600" />
        : <Copy className="w-3 h-3 text-[#747878]" />}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cfg = statusCfg(status);
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs border px-2.5 py-0.5 rounded-full font-medium ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusKey | 'الكل'>('الكل');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const result = await adminGetOrders();
    if (result.success && result.data) {
      setOrders(result.data as AdminOrder[]);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function handleStatusChange(orderId: string, status: string) {
    setUpdatingId(orderId);
    startTransition(async () => {
      await adminUpdateOrderStatus(orderId, status);
      // Optimistic update
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
      setUpdatingId(null);
    });
  }

  const filtered = filter === 'الكل' ? orders : orders.filter((o) => o.status === filter);

  // Stats
  const stats = ALL_STATUSES.map((s) => ({
    key: s,
    count: orders.filter((o) => o.status === s).length,
    cfg: statusCfg(s),
  }));

  return (
    <div dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#2C2C2C]">الطلبات</h1>
          <p className="text-[#747878] mt-1 text-sm">{orders.length} طلب إجمالاً</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 border border-[#C4A36E]/30 text-[#747878] px-4 py-2 rounded-xl text-sm hover:border-[#C4A36E] hover:text-[#C4A36E] transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          تحديث
        </button>
      </div>

      {/* Stats row */}
      {!loading && orders.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {stats.map(({ key, count, cfg }) => (
            <button
              key={key}
              onClick={() => setFilter(filter === key ? 'الكل' : key)}
              className={`rounded-2xl border p-3 text-right transition-all hover:shadow-sm ${
                filter === key ? 'ring-2 ring-[#C4A36E] ring-offset-1' : ''
              } ${cfg.badge}`}
            >
              <p className="text-xl font-bold">{count}</p>
              <p className="text-xs opacity-80 mt-0.5">{key}</p>
            </button>
          ))}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['الكل', ...ALL_STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm border transition-all duration-200 ${
              filter === s
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

      {/* Loading skeleton */}
      {loading && (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#C4A36E]/10 p-5 animate-pulse">
              <div className="flex gap-4 items-center">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-[#F5F1EA] rounded w-32" />
                  <div className="h-3 bg-[#F5F1EA] rounded w-48" />
                </div>
                <div className="h-4 bg-[#F5F1EA] rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-24 text-[#747878]">
          <ShoppingBag className="w-14 h-14 mx-auto mb-4 opacity-20" />
          <p className="font-medium">لا توجد طلبات</p>
          <p className="text-xs mt-1 opacity-60">
            {filter === 'الكل' ? 'ستظهر الطلبات هنا بعد أن يكمل العملاء عملية الشراء.' : `لا توجد طلبات بحالة "${filter}".`}
          </p>
        </div>
      )}

      {/* Orders list */}
      {!loading && (
        <div className="flex flex-col gap-4">
          {filtered.map((order) => {
            const cfg = statusCfg(order.status);
            const isExpanded = expanded === order.id;
            const isUpdating = updatingId === order.id && isPending;
            const subtotal = order.total_amount - (order.shipping_fee ?? 0);
            const displayId = order.order_number ?? order.id.slice(0, 8).toUpperCase();

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-[#C4A36E]/10 shadow-sm overflow-hidden transition-shadow hover:shadow-md"
              >
                {/* Order header */}
                <div className="p-5 flex flex-wrap items-center gap-4">
                  {/* Order ID + date */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[#2C2C2C] text-sm font-mono">
                        #{displayId}
                      </span>
                      <CopyButton text={displayId} />
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-xs text-[#747878] mt-1">{formatDate(order.created_at)}</p>
                  </div>

                  {/* Customer info */}
                  <div className="text-sm min-w-0">
                    <p className="font-semibold text-[#2C2C2C] truncate">{order.customer_name}</p>
                    <a
                      href={`tel:${order.customer_phone}`}
                      className="text-[#747878] text-xs hover:text-[#C4A36E] transition-colors flex items-center gap-1"
                      dir="ltr"
                    >
                      <Phone className="w-3 h-3" />
                      {order.customer_phone}
                    </a>
                  </div>

                  {/* Total */}
                  <div className="text-sm font-bold text-[#C4A36E] whitespace-nowrap tabular-nums">
                    {Number(order.total_amount).toLocaleString('ar-EG')} ج.م
                  </div>

                  {/* Items count badge */}
                  <span className="hidden sm:flex items-center gap-1 text-xs text-[#747878] bg-[#F5F1EA] px-2 py-1 rounded-lg">
                    <Package className="w-3 h-3" />
                    {order.order_items?.length ?? 0} منتج
                  </span>

                  {/* Status selector */}
                  <div className="relative">
                    {isUpdating
                      ? <Loader2 className="w-4 h-4 animate-spin text-[#C4A36E]" />
                      : (
                        <>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`appearance-none border rounded-xl py-1.5 pr-3 pl-7 text-xs outline-none cursor-pointer transition-colors ${cfg.badge}`}
                          >
                            {ALL_STATUSES.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
                        </>
                      )}
                  </div>

                  {/* Toggle button */}
                  <button
                    onClick={() => setExpanded(isExpanded ? null : order.id)}
                    className="text-xs text-[#C4A36E] hover:underline whitespace-nowrap"
                  >
                    {isExpanded ? 'إخفاء' : 'التفاصيل'}
                  </button>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-[#C4A36E]/10 bg-[#FDF9F3] px-5 py-4 flex flex-col gap-4">

                    {/* Delivery info */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#C4A36E] mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] text-[#747878] uppercase tracking-wide mb-0.5">المحافظة</p>
                          <p className="text-sm font-medium text-[#2C2C2C]">{order.customer_governorate || '—'}</p>
                        </div>
                      </div>
                      <div className="sm:col-span-2 flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#C4A36E] mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] text-[#747878] uppercase tracking-wide mb-0.5">العنوان التفصيلي</p>
                          <p className="text-sm font-medium text-[#2C2C2C]">{order.customer_address}</p>
                        </div>
                      </div>
                    </div>

                    {/* Payment method */}
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-[10px] text-[#747878] uppercase tracking-wide">طريقة الدفع:</span>
                      <span className="font-medium text-[#2C2C2C]">
                        {order.payment_method === 'cod' ? 'الدفع عند الاستلام' : order.payment_method ?? '—'}
                      </span>
                    </div>

                    {/* Order items */}
                    <div>
                      <p className="text-xs text-[#747878] mb-2 uppercase tracking-wide">المنتجات</p>
                      <div className="flex flex-col gap-2">
                        {(order.order_items ?? []).map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 bg-white rounded-xl p-3 border border-[#C4A36E]/10"
                          >
                            <div className="relative w-10 h-10 bg-[#F5F1EA] rounded-lg overflow-hidden shrink-0">
                              <Image
                                src={item.products?.image || '/ls.png'}
                                alt={item.products?.name || 'عطر'}
                                fill
                                sizes="40px"
                                className="object-contain p-1"
                                onError={(e) => { (e.target as HTMLImageElement).src = '/ls.png'; }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[#2C2C2C] line-clamp-1">
                                {item.products?.name ?? 'منتج غير معروف'}
                              </p>
                              <p className="text-xs text-[#747878]">
                                الكمية: {item.quantity}
                                {item.volume && ` • الحجم: ${item.volume}${item.unit ?? 'ml'}`}
                              </p>
                            </div>
                            <p className="text-sm font-semibold text-[#C4A36E] whitespace-nowrap tabular-nums">
                              {(item.unit_price * item.quantity).toLocaleString('ar-EG')} ج.م
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Totals + WhatsApp */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between border-t border-[#C4A36E]/10 pt-4">
                      {/* Totals */}
                      <div className="flex flex-col gap-1 text-sm w-full sm:max-w-xs">
                        <div className="flex justify-between text-[#747878]">
                          <span>المجموع الفرعي</span>
                          <span className="tabular-nums">{subtotal.toLocaleString('ar-EG')} ج.م</span>
                        </div>
                        <div className="flex justify-between text-[#747878]">
                          <span>الشحن</span>
                          <span className="tabular-nums">
                            {!order.shipping_fee || order.shipping_fee === 0
                              ? 'مجاني'
                              : `${Number(order.shipping_fee).toLocaleString('ar-EG')} ج.م`}
                          </span>
                        </div>
                        <div className="flex justify-between font-bold text-[#2C2C2C] pt-1 border-t border-[#C4A36E]/10 mt-1">
                          <span>الإجمالي</span>
                          <span className="tabular-nums text-[#C4A36E]">
                            {Number(order.total_amount).toLocaleString('ar-EG')} ج.م
                          </span>
                        </div>
                      </div>

                      {/* WhatsApp contact */}
                      <a
                        href={`https://wa.me/${order.customer_phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                          `مرحباً ${order.customer_name}، بخصوص طلبك رقم #${displayId} من Lovely Smell 🌸`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-600 transition-colors whitespace-nowrap"
                      >
                        <MessageCircle className="w-4 h-4" />
                        تواصل عبر واتساب
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
