"use client";

import { useState } from 'react';
import Link from 'next/link';
import { TopNavBar } from '@/components/TopNavBar';
import { SiteFooter } from '@/components/SiteFooter';
import { Truck, HelpCircle, Package, CheckCheck, Clock } from 'lucide-react';

type OrderStatus = 'placed' | 'preparing' | 'shipped' | 'delivered';

interface MockOrder {
  orderNumber: string;
  date: string;
  total: string;
  payment: string;
  status: OrderStatus;
  address: string;
  items: { name: string; qty: string }[];
}

// Mock order lookup — in production, this would call an API
const MOCK_ORDERS: Record<string, MockOrder> = {
  'LMN-37772': {
    orderNumber: 'LMN-37772',
    date: '3 مايو 2025',
    total: '1,850 ج.م',
    payment: 'الدفع عند الاستلام',
    status: 'shipped',
    address: 'شارع التحرير، عمارة 15، شقة 4\nالدقي، الجيزة، مصر',
    items: [
      { name: 'فن العطارة الأصيلة', qty: '1 × 100ml' },
    ],
  },
  'LMN-00001': {
    orderNumber: 'LMN-00001',
    date: '1 مايو 2025',
    total: '3,050 ج.م',
    payment: 'الدفع عند الاستلام',
    status: 'delivered',
    address: 'شارع النيل، برج الأهرام\nالمعادي، القاهرة، مصر',
    items: [
      { name: 'ليالي الشرق', qty: '1 × 50ml' },
      { name: 'روح الورد', qty: '2 × 50ml' },
    ],
  },
};

const STEPS: { key: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { key: 'placed',    label: 'تم الطلب',      icon: <Package className="w-3 h-3" /> },
  { key: 'preparing', label: 'جاري التجهيز',   icon: <Clock className="w-3 h-3" /> },
  { key: 'shipped',   label: 'تم الشحن',       icon: <Truck className="w-3 h-3" /> },
  { key: 'delivered', label: 'تم التوصيل',     icon: <CheckCheck className="w-3 h-3" /> },
];

const STATUS_ORDER: OrderStatus[] = ['placed', 'preparing', 'shipped', 'delivered'];

const STATUS_BADGE: Record<OrderStatus, { label: string; classes: string }> = {
  placed:    { label: 'تم استلام الطلب',  classes: 'bg-blue-50 text-blue-700 border-blue-200' },
  preparing: { label: 'جاري التجهيز',     classes: 'bg-amber-50 text-amber-700 border-amber-200' },
  shipped:   { label: 'تم الشحن',          classes: 'bg-[#E8F3ED] text-[#4A7C59] border-[#4A7C59]/20' },
  delivered: { label: 'تم التوصيل ✓',     classes: 'bg-green-50 text-green-700 border-green-200' },
};

export default function OrderTrackingPage() {
  const [orderNum, setOrderNum] = useState('');
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState<MockOrder | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLookup = () => {
    setError('');
    setResult(null);
    setLoading(true);

    setTimeout(() => {
      const key = orderNum.replace('#', '').trim().toUpperCase();
      const order = MOCK_ORDERS[key];
      if (order) {
        setResult(order);
      } else {
        setError('لم يتم العثور على طلب بهذا الرقم. تأكد من الرقم وحاول مرة أخرى.');
      }
      setLoading(false);
    }, 800);
  };

  const currentStepIndex = result ? STATUS_ORDER.indexOf(result.status) : -1;
  const progressPct = result ? (currentStepIndex / (STATUS_ORDER.length - 1)) * 100 : 0;

  return (
    <div className="bg-[#FDF9F3] text-on-surface min-h-screen flex flex-col font-body-md antialiased">
      <TopNavBar />

      <main className="flex-grow pt-24 md:pt-32 pb-12 md:pb-24 px-4 md:px-16 max-w-[1440px] mx-auto w-full">
        {/* Header */}
        <section className="text-center mb-12 mt-8">
          <h1 className="font-headline-md text-headline-md text-on-background mb-3">تتبع طلبك</h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mx-auto">
            أدخل رقم الطلب ورقم الهاتف لمعرفة حالة شحنتك
          </p>
          <div className="w-16 h-px bg-secondary mx-auto mt-4 opacity-50" />
        </section>

        {/* Lookup Form */}
        <section className="max-w-xl mx-auto mb-16">
          <div className="bg-white/50 backdrop-blur-xl border border-secondary/20 rounded-2xl p-7 shadow-[0_4px_30px_rgba(196,163,110,0.08)]">
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => { e.preventDefault(); handleLookup(); }}
            >
              <div>
                <label className="sr-only" htmlFor="order_id">رقم الطلب</label>
                <input
                  id="order_id"
                  type="text"
                  value={orderNum}
                  onChange={e => setOrderNum(e.target.value)}
                  placeholder="رقم الطلب (مثال: LMN-37772)"
                  className="w-full bg-[#F5F1EA] border border-transparent focus:border-secondary/50 focus:ring-0 rounded-full px-6 py-4 font-body-md text-on-background placeholder:text-on-surface-variant/50 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="sr-only" htmlFor="phone">رقم الهاتف</label>
                <input
                  id="phone"
                  type="tel"
                  dir="ltr"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="رقم الهاتف"
                  style={{ textAlign: 'right' }}
                  className="w-full bg-[#F5F1EA] border border-transparent focus:border-secondary/50 focus:ring-0 rounded-full px-6 py-4 font-body-md text-on-background placeholder:text-on-surface-variant/50 outline-none transition-colors"
                />
              </div>

              {error && (
                <p className="text-center text-sm text-red-600 font-body-md">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !orderNum.trim()}
                className="w-full bg-primary-container text-secondary rounded-full py-4 font-label-sm text-label-sm uppercase tracking-wider hover:shadow-[0_0_20px_rgba(196,163,110,0.3)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 mt-1"
              >
                {loading ? 'جاري البحث...' : 'تحقق من حالة الطلب'}
              </button>
            </form>
          </div>
        </section>

        {/* Results */}
        {result && (
          <section className="max-w-4xl mx-auto space-y-6 dir-rtl">
            {/* Status Badge */}
            <div className="flex items-center justify-center sm:justify-start">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-label-sm text-label-sm ${STATUS_BADGE[result.status].classes}`}>
                <Truck className="w-4 h-4" strokeWidth={1.5} />
                {STATUS_BADGE[result.status].label}
              </span>
            </div>

            {/* Timeline Progress */}
            <div className="bg-white/50 backdrop-blur-xl border border-secondary/20 rounded-2xl p-7 shadow-[0_4px_30px_rgba(196,163,110,0.08)]">
              <div className="relative py-6 px-2">
                {/* Background track */}
                <div className="absolute top-1/2 right-4 left-4 h-[2px] bg-secondary/10 -translate-y-1/2 z-0" />
                {/* Filled track */}
                <div
                  className="absolute top-1/2 right-4 h-[2px] bg-secondary -translate-y-1/2 z-0 transition-all duration-700"
                  style={{ width: `calc(${progressPct}% - 2rem)` }}
                />
                {/* Steps */}
                <div className="flex justify-between relative z-10">
                  {STEPS.map((step, i) => {
                    const isCompleted = i <= currentStepIndex;
                    const isCurrent  = i === currentStepIndex;
                    return (
                      <div key={step.key} className="flex flex-col items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 border-4
                          ${isCurrent
                            ? 'bg-secondary border-[#FDF9F3] shadow-[0_0_12px_rgba(196,163,110,0.6)] text-white'
                            : isCompleted
                              ? 'bg-secondary border-white text-white'
                              : 'bg-white border-secondary/20 text-on-surface-variant'
                          }`}
                        >
                          {step.icon}
                        </div>
                        <span className={`font-label-sm text-label-sm text-center ${isCurrent ? 'text-secondary font-bold' : isCompleted ? 'text-on-surface' : 'text-outline'}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Estimated Delivery */}
              <p className="text-center font-body-md text-body-md text-on-surface-variant pt-4 border-t border-secondary/10">
                وقت التوصيل المتوقع: <span className="font-bold text-on-background">2–3 أيام عمل</span>
              </p>
            </div>

            {/* Bento Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Order Details */}
              <div className="bg-white rounded-xl p-5 shadow-[0_4px_20px_rgba(44,44,44,0.04)] border border-secondary/10 flex flex-col gap-3">
                <h3 className="font-label-sm text-label-sm text-secondary uppercase tracking-wider pb-2 border-b border-secondary/10">تفاصيل الطلب</h3>
                <div className="flex justify-between">
                  <span className="font-body-md text-body-md text-on-surface-variant">رقم الطلب</span>
                  <span className="font-label-sm text-label-sm text-on-background font-bold">#{result.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body-md text-body-md text-on-surface-variant">التاريخ</span>
                  <span className="font-label-sm text-label-sm text-on-background">{result.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body-md text-body-md text-on-surface-variant">الإجمالي</span>
                  <span className="font-label-sm text-label-sm text-secondary font-bold">{result.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body-md text-body-md text-on-surface-variant">الدفع</span>
                  <span className="font-label-sm text-label-sm text-on-background">{result.payment}</span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-xl p-5 shadow-[0_4px_20px_rgba(44,44,44,0.04)] border border-secondary/10 flex flex-col gap-3">
                <h3 className="font-label-sm text-label-sm text-secondary uppercase tracking-wider pb-2 border-b border-secondary/10">عنوان الشحن</h3>
                <p className="font-body-md text-body-md text-on-background leading-relaxed whitespace-pre-line">{result.address}</p>
              </div>

              {/* Items */}
              <div className="bg-white rounded-xl p-5 shadow-[0_4px_20px_rgba(44,44,44,0.04)] border border-secondary/10 flex flex-col gap-3">
                <h3 className="font-label-sm text-label-sm text-secondary uppercase tracking-wider pb-2 border-b border-secondary/10">
                  المنتجات ({result.items.length})
                </h3>
                {result.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#F5F1EA] border border-secondary/10 flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-secondary/50" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-label-sm text-label-sm text-on-background">{item.name}</p>
                      <p className="font-body-md text-[13px] text-on-surface-variant">{item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Secondary Actions */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
              <button
                onClick={() => { setResult(null); setOrderNum(''); setPhone(''); }}
                className="px-8 py-3 rounded-full border border-secondary text-secondary font-label-sm text-label-sm uppercase tracking-wider hover:bg-secondary/5 transition-colors"
              >
                تتبع طلب آخر
              </button>
              <a
                href="https://wa.me/201018580523"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-on-surface-variant hover:text-secondary transition-colors font-body-md text-body-md"
              >
                <HelpCircle className="w-5 h-5" strokeWidth={1.5} />
                تحتاج مساعدة؟
              </a>
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
