"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getOrderDetailsByToken } from '@/lib/actions/orders';
import { CheckCircle, ShoppingBag, MessageCircle } from 'lucide-react';
import { useState, useEffect, Suspense } from 'react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOrder() {
      if (!token) {
        setError('رابط الطلب غير صالح');
        setLoading(false);
        return;
      }
      const result = await getOrderDetailsByToken(token);
      if (result.success) {
        setOrderData(result.data);
      } else {
        setError(result.error || 'حدث خطأ أثناء تحميل الطلب');
      }
      setLoading(false);
    }
    fetchOrder();
  }, [token]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">جاري تحميل تفاصيل الطلب...</div>;
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center gap-4">
        <h1 className="text-2xl font-bold text-red-500">{error}</h1>
        <Link href="/" className="text-secondary underline">العودة للرئيسية</Link>
      </div>
    );
  }

  const itemCount = orderData.order_items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;

  return (
    <div className="bg-[#FDF9F3] min-h-screen flex flex-col items-center justify-center p-6 md:p-12 font-body-md text-on-surface">
      {/* Minimal Header */}
      <header className="w-full max-w-[600px] flex justify-between items-center mb-12 dir-rtl">
        <div className="flex items-center gap-2 text-secondary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">دفع آمن</span>
        </div>
        <div className="font-headline-md text-[20px] tracking-[0.2em] uppercase text-on-surface">
          Lovely Smell EG
        </div>
        <div className="w-[80px]" />
      </header>

      {/* Main Content */}
      <main className="w-full max-w-[600px] flex flex-col gap-5 dir-rtl">
        {/* Success Card */}
        <section className="bg-white rounded-2xl shadow-[0_10px_40px_-15px_rgba(196,163,110,0.15)] p-8 md:p-12 flex flex-col items-center text-center border border-secondary/10">
          {/* Animated Checkmark */}
          <div className="w-20 h-20 rounded-full bg-[#E8F3E8] flex items-center justify-center mb-6 animate-[scale-in_0.5s_ease-out]">
            <CheckCircle className="text-[#6BA86B] w-10 h-10" strokeWidth={1.5} />
          </div>

          <h1 className="font-headline-md text-headline-md text-on-surface mb-3">تم تقديم الطلب بنجاح!</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mb-8 max-w-[400px]">
            شكراً لثقتك، سيتواصل معك فريقنا قريباً لتأكيد الطلب وتحديد موعد التوصيل
          </p>

          {/* Order Details Box */}
          <div className="w-full bg-[#F5F1EA] rounded-xl p-4 md:p-6 flex flex-col gap-4 text-right mb-8 border border-secondary/20">
            <div className="flex justify-between items-center pb-4 border-b border-secondary/20">
              <span className="font-body-md text-body-md text-on-surface-variant">رقم الطلب</span>
              <span className="font-label-sm text-label-sm text-on-surface uppercase font-bold tracking-wider">{orderData.order_number}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-secondary/10">
              <span className="font-body-md text-body-md text-on-surface-variant">عدد المنتجات</span>
              <span className="font-body-md text-body-md text-on-surface">{itemCount} منتج</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-secondary/10">
              <span className="font-body-md text-body-md text-on-surface-variant">الإجمالي</span>
              <span className="font-label-sm text-label-sm text-secondary uppercase font-bold">
                {orderData.total_amount.toLocaleString('ar-EG')} ج.م
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-secondary/10">
              <span className="font-body-md text-body-md text-on-surface-variant">طريقة الدفع</span>
              <span className="font-body-md text-body-md text-on-surface">{orderData.payment_method === 'cod' ? 'الدفع عند الاستلام' : 'بطاقة ائتمانية'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body-md text-body-md text-on-surface-variant">موعد التوصيل المتوقع</span>
              <span className="font-body-md text-body-md text-on-surface">٢–٣ أيام عمل</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col gap-3">
            <Link
              href="/order-tracking"
              className="w-full py-4 rounded-full bg-primary-container text-secondary font-label-sm text-label-sm uppercase tracking-wider hover:shadow-[0_0_20px_rgba(196,163,110,0.35)] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
              تتبع طلبك
            </Link>
            <a
              href="https://wa.me/201018580523"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-full bg-transparent border-[1.5px] border-secondary text-secondary font-label-sm text-label-sm uppercase tracking-wider hover:bg-secondary/5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
              تواصل معنا
            </a>
          </div>
        </section>

        {/* WhatsApp Support Card */}
        <a
          href="https://wa.me/201018580523"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-white/60 backdrop-blur-xl rounded-2xl p-5 border border-secondary/20 flex items-center justify-center gap-3 hover:bg-white/80 transition-colors duration-300 shadow-[0_4px_20px_-10px_rgba(196,163,110,0.15)]"
        >
          <span className="font-body-md text-body-md text-on-surface">هل تحتاج إلى تعديل الطلب؟ تواصل معنا عبر واتساب</span>
          <svg fill="#25D366" height="20" viewBox="0 0 16 16" width="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
          </svg>
        </a>
      </main>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#FDF9F3]">جاري التحميل...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
