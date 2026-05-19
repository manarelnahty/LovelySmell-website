"use client";

import { useCart } from '@/lib/context/CartContext';
import { Logo } from '@/components/logo';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Truck, ArrowRight, ChevronDown } from 'lucide-react';
import { createOrder } from '@/lib/actions/orders';

const GOVERNORATES = [
  'القاهرة', 'الجيزة', 'الإسكندرية', 'البحيرة', 'الشرقية',
  'الدقهلية', 'المنوفية', 'القليوبية', 'الغربية', 'كفر الشيخ',
  'دمياط', 'بورسعيد', 'الإسماعيلية', 'السويس', 'شمال سيناء',
  'جنوب سيناء', 'الفيوم', 'بني سويف', 'المنيا', 'أسيوط',
  'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'البحر الأحمر',
  'الوادي الجديد', 'مطروح',
];

const SHIPPING_COST = 50;
const FREE_SHIPPING_THRESHOLD = 1500;

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone]               = useState('');
  const [governorate, setGovernorate]   = useState('');
  const [address, setAddress]           = useState('');
  const [submitting, setSubmitting]     = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    async function loadUserProfile() {
      const { createClient } = await import('@/utils/supabase/client');
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Enforce login for checkout
        router.push('/login?redirect=/checkout');
        return;
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (profile) {
        if (profile.full_name) setCustomerName(profile.full_name);
        if (profile.phone) setPhone(profile.phone);
        if (profile.governorate) setGovernorate(profile.governorate);
        if (profile.address) setAddress(profile.address);
      } else if (user.user_metadata?.full_name) {
        setCustomerName(user.user_metadata.full_name);
      }
      
      setIsLoadingProfile(false);
    }
    
    loadUserProfile();
  }, [router]);

  const shippingCost = cartTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const grandTotal = cartTotal + shippingCost;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);
  const progressPct = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !governorate || !address.trim()) return;
    setSubmitting(true);

    const orderPayload = {
      customer_name: customerName,
      customer_phone: phone,
      customer_governorate: governorate,
      customer_address: address,
      shipping_fee: shippingCost,
      total_amount: grandTotal,
      payment_method: paymentMethod,
      items: items.map((i) => {
        const variation = i.variationId 
          ? i.product.variations?.find(v => v.id === i.variationId)
          : null;
        const price = variation ? variation.price : i.product.price;
        
        return {
          product_id: i.product.id,
          variation_id: i.variationId || null,
          quantity: i.quantity,
          unit_price: price,
          volume: variation ? variation.volume : null,
          unit: variation ? variation.unit : null,
        };
      })
    };

    const result = await createOrder(orderPayload);
    
    if (result.success) {
      clearCart();
      
      const whatsappMessage = encodeURIComponent(
        `أهلاً بك، تم إرسال طلب شراء رقم: ${result.orderNumber}\n` +
        `الاسم: ${customerName}\n` +
        `رقم الهاتف: ${phone}\n` +
        `المحافظة: ${governorate}\n` +
        `العنوان: ${address}\n\n` +
        `تفاصيل الطلب:\n` +
        items.map(i => `- ${i.product.name} (الكمية: ${i.quantity})`).join('\n') +
        `\nالإجمالي: ${grandTotal} ج.م`
      );
      const whatsappUrl = `https://wa.me/201018580523?text=${whatsappMessage}`;
      
      // Attempt to open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank');

      // Then navigate to success page
      router.push(`/order-success?token=${result.trackingToken}`);
    } else {
      console.error(result.error);
      alert('حدث خطأ أثناء تقديم الطلب. يرجى المحاولة مرة أخرى.');
      setSubmitting(false);
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF9F3]">
        <div className="w-8 h-8 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#FDF9F3] text-on-surface min-h-screen flex flex-col font-body-md antialiased selection:bg-secondary/30">
      {/* Minimal Checkout Header */}
      <header className="w-full bg-white/60 backdrop-blur-xl border-b border-secondary/20 sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-5 flex justify-between items-center dir-rtl">
          <div className="flex items-center gap-2 text-secondary">
            <Lock className="w-4 h-4" strokeWidth={1.5} />
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">دفع آمن</span>
          </div>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2 hidden md:block" aria-label="الصفحة الرئيسية">
            <Logo />
          </Link>
          <Link href="/shop" className="flex items-center gap-2 text-on-surface-variant hover:text-secondary transition-colors duration-300 font-label-sm text-label-sm uppercase tracking-widest">
            <span>العودة للتسوق</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" strokeWidth={1.5} />
          </Link>
        </div>
      </header>

      {/* Main Checkout Canvas */}
      <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 md:px-16 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start dir-rtl">
        {/* Left Column: Forms */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <h1 className="font-headline-lg text-headline-lg">إتمام الطلب</h1>

          {/* Step 1: Shipping Info */}
          <section className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(44,44,44,0.05)] p-8 relative overflow-hidden">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-8 rounded-full bg-primary-container text-secondary flex items-center justify-center font-bold text-sm font-sans flex-shrink-0">1</div>
              <h2 className="font-headline-md text-[24px] text-on-surface">معلومات التوصيل</h2>
            </div>

            <form id="checkout-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">الاسم الكامل</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="أدخل اسمك الكامل"
                  required
                  className="w-full bg-[#F5F1EA] border-none rounded-xl py-4 px-4 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-secondary/50 outline-none transition-all duration-300"
                />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">رقم الهاتف</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+20 100 000 0000"
                  dir="ltr"
                  required
                  className="w-full bg-[#F5F1EA] border-none rounded-xl py-4 px-4 text-on-surface text-right placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-secondary/50 outline-none transition-all duration-300"
                />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">المحافظة</label>
                <div className="relative">
                  <select
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    required
                    className="w-full bg-[#F5F1EA] border-none rounded-xl py-4 px-4 pr-4 pl-10 text-on-surface appearance-none cursor-pointer focus:ring-2 focus:ring-secondary/50 outline-none transition-all duration-300"
                  >
                    <option value="">اختر المحافظة</option>
                    {GOVERNORATES.map(g => <option key={g}>{g}</option>)}
                  </select>
                  <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary pointer-events-none w-4 h-4" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">العنوان التفصيلي</label>
                <textarea
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="اسم الشارع، رقم العمارة، رقم الشقة..."
                  required
                  className="w-full bg-[#F5F1EA] border-none rounded-xl py-4 px-4 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-secondary/50 outline-none transition-all duration-300 resize-none"
                />
              </div>
            </form>
          </section>

          {/* Step 2: Payment */}
          <section className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(44,44,44,0.05)] p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-8 h-8 rounded-full border border-outline-variant text-on-surface-variant flex items-center justify-center font-bold text-sm font-sans flex-shrink-0">2</div>
              <h2 className="font-headline-md text-[24px] text-on-surface opacity-80">طريقة الدفع</h2>
            </div>

            <div className="flex flex-col gap-3">
              {/* Cash on Delivery */}
              <label
                onClick={() => setPaymentMethod('cod')}
                className={`flex items-center justify-between border rounded-2xl p-4 cursor-pointer transition-all duration-300 ${
                  paymentMethod === 'cod'
                    ? 'border-secondary bg-surface-container-low ring-1 ring-secondary'
                    : 'border-outline-variant hover:border-secondary/50 hover:bg-surface-container-low'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${paymentMethod === 'cod' ? 'border-secondary' : 'border-outline-variant'}`}>
                    {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-secondary" />}
                  </div>
                  <div>
                    <div className="font-body-lg text-body-lg font-medium">الدفع عند الاستلام</div>
                    <div className="font-label-sm text-label-sm text-on-surface-variant mt-1">ادفع نقداً عند استلام طلبك</div>
                  </div>
                </div>
                <Truck className="text-secondary w-7 h-7" strokeWidth={1.5} />
              </label>

              {/* Credit Card (disabled) */}
              <label className="flex items-center justify-between border border-outline-variant rounded-2xl p-4 opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 rounded-full border-2 border-outline-variant flex-shrink-0" />
                  <div>
                    <div className="font-body-lg text-body-lg font-medium text-on-surface-variant">البطاقة الائتمانية</div>
                    <div className="font-label-sm text-label-sm text-on-surface-variant mt-1">قريباً</div>
                  </div>
                </div>
                <div className="text-outline-variant text-sm font-label-sm border border-outline-variant/50 rounded-full px-3 py-1">قريباً</div>
              </label>
            </div>
          </section>

          {/* CTA */}
          <div>
            <button
              form="checkout-form"
              type="submit"
              disabled={submitting || items.length === 0}
              className="w-full bg-primary-container text-secondary rounded-full py-5 font-body-lg text-body-lg hover:shadow-[0_0_25px_rgba(196,163,110,0.35)] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>{submitting ? 'جاري التقديم...' : 'تقديم الطلب عبر واتساب'}</span>
              <ArrowRight className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300 rtl:rotate-180" strokeWidth={1.5} />
            </button>
            <p className="text-center font-label-sm text-label-sm text-on-surface-variant mt-4 flex items-center justify-center gap-2">
              <Lock className="w-3.5 h-3.5" strokeWidth={1.5} />
              البيانات مشفرة ومحمية بالكامل
            </p>
          </div>
        </div>

        {/* Right Column: Order Summary - Sticky */}
        <div className="lg:col-span-5 sticky top-28">
          <div className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(44,44,44,0.05)] p-8 border border-secondary/10">
            <h3 className="font-headline-md text-[22px] mb-6 border-b border-secondary/10 pb-4">ملخص الطلب</h3>

            {/* Free Shipping Progress */}
            <div className="mb-6 bg-[#F5F1EA] p-4 rounded-xl">
              <p className="font-body-md text-sm mb-2 flex items-center gap-2 text-on-surface">
                <Truck className="text-secondary w-4 h-4" strokeWidth={1.5} />
                {remaining > 0 ? (
                  <>متبقي <span className="font-sans font-semibold text-secondary">{remaining.toLocaleString('ar-EG')} ج.م</span> لشحن مجاني!</>
                ) : (
                  <span className="text-secondary font-medium">🎉 تهانينا! تأهلت للشحن المجاني</span>
                )}
              </p>
              <div className="w-full bg-secondary/20 rounded-full h-1.5 overflow-hidden">
                <div className="bg-secondary h-1.5 rounded-full transition-all duration-700" style={{ width: `${progressPct}%` }} />
              </div>
            </div>

            {/* Items */}
            <div className="flex flex-col gap-4 mb-6 max-h-[300px] overflow-y-auto" data-lenis-prevent="true">
              {items.length === 0 ? (
                <p className="text-center text-on-surface-variant py-8 font-body-md text-body-md">لا توجد منتجات في السلة</p>
              ) : (
                items.map(item => (
                  <div key={item.product.id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-container flex-shrink-0 relative border border-secondary/10">
                      <Image alt={item.product.name} src={item.product.image} fill sizes="64px" className="object-contain p-1" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-body-md text-sm font-medium line-clamp-1">{item.product.name}</h4>
                      <p className="font-label-sm text-[11px] text-on-surface-variant mt-1">الكمية: {item.quantity}</p>
                    </div>
                    <div className="font-sans font-semibold text-sm whitespace-nowrap text-on-surface">
                      {(item.product.price * item.quantity).toLocaleString('ar-EG')} ج.م
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Totals */}
            <div className="border-t border-secondary/10 pt-5 space-y-3">
              <div className="flex justify-between font-body-md text-sm text-on-surface-variant">
                <span>المجموع الفرعي</span>
                <span className="font-sans">{cartTotal.toLocaleString('ar-EG')} ج.م</span>
              </div>
              <div className="flex justify-between font-body-md text-sm text-on-surface-variant">
                <span>تكلفة الشحن</span>
                <span className="font-sans">{shippingCost === 0 ? 'مجاني 🎉' : `${shippingCost} ج.م`}</span>
              </div>
              <div className="flex justify-between items-end border-t border-secondary/10 pt-4">
                <div>
                  <span className="font-headline-md text-lg block">الإجمالي</span>
                  <span className="font-label-sm text-[10px] text-on-surface-variant">شاملاً ضريبة القيمة المضافة</span>
                </div>
                <span className="font-sans font-bold text-xl text-on-surface">{grandTotal.toLocaleString('ar-EG')} ج.م</span>
              </div>
            </div>

            {/* Help Link */}
            <div className="mt-6 pt-5 border-t border-secondary/10 text-center">
              <a href="https://wa.me/201018580523" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-secondary transition-colors font-label-sm text-label-sm">
                <svg fill="currentColor" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                </svg>
                تحتاج مساعدة؟ تواصل معنا عبر واتساب
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
