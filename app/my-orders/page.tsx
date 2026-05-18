import { getUserOrders } from '@/lib/actions/orders';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'طلباتي | Lovely Smell',
  description: 'سجل الطلبات الخاصة بك',
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'جديد':
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-label-sm text-[12px] whitespace-nowrap">
          <Clock className="w-3.5 h-3.5" /> قيد المراجعة
        </span>
      );
    case 'جاري التحضير':
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full font-label-sm text-[12px] whitespace-nowrap">
          <Package className="w-3.5 h-3.5" /> جاري التجهيز
        </span>
      );
    case 'في الطريق':
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-600 rounded-full font-label-sm text-[12px] whitespace-nowrap">
          <Truck className="w-3.5 h-3.5" /> في الطريق
        </span>
      );
    case 'مكتمل':
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full font-label-sm text-[12px] whitespace-nowrap">
          <CheckCircle className="w-3.5 h-3.5" /> تم التسليم
        </span>
      );
    default:
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-600 rounded-full font-label-sm text-[12px] whitespace-nowrap">
          {status}
        </span>
      );
  }
};

export default async function MyOrdersPage() {
  const result = await getUserOrders();

  if (!result.success) {
    return (
      <div className="min-h-screen bg-[#FDF9F3] pt-32 pb-20 px-4 md:px-16 flex flex-col items-center justify-center text-center">
        <h1 className="font-headline-md text-2xl text-on-surface mb-4">يجب تسجيل الدخول</h1>
        <Link href="/login?redirect=/my-orders" className="text-secondary underline hover:text-secondary/80">
          تسجيل الدخول للوصول لطلباتك
        </Link>
      </div>
    );
  }

  const orders = result.data || [];

  return (
    <div className="min-h-screen bg-[#FDF9F3] pt-32 pb-20 px-4 md:px-16 dir-rtl">
      <div className="max-w-[1000px] mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <Package className="w-8 h-8 text-secondary" strokeWidth={1.5} />
          <h1 className="font-headline-lg text-3xl text-on-surface">سجل طلباتي</h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-secondary/10 flex flex-col items-center justify-center gap-6">
            <div className="w-24 h-24 bg-secondary/5 rounded-full flex items-center justify-center text-secondary">
              <Package className="w-10 h-10" strokeWidth={1} />
            </div>
            <div>
              <h2 className="font-headline-md text-xl text-on-surface mb-2">لا توجد طلبات سابقة</h2>
              <p className="font-body-md text-on-surface-variant max-w-md mx-auto">لم تقم بإجراء أي طلبات حتى الآن. اكتشف مجموعتنا المميزة من العطور وتسوق الآن.</p>
            </div>
            <Link href="/shop" className="bg-secondary text-white px-8 py-3 rounded-full font-label-sm uppercase tracking-wider hover:bg-secondary/90 transition-colors">
              تصفح المتجر
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-secondary/10">
                {/* Order Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-secondary/10 gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-sans font-bold text-lg text-on-surface">رقم الطلب: {order.order_number}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <span className="font-body-md text-sm text-on-surface-variant">
                      تاريخ الطلب: {new Date(order.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="text-right w-full md:w-auto">
                    <span className="font-body-md text-sm text-on-surface-variant block mb-1">الإجمالي</span>
                    <span className="font-sans font-bold text-xl text-secondary">{order.total_amount.toLocaleString('ar-EG')} ج.م</span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="flex flex-col gap-4">
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-[#FDF9F3] rounded-2xl flex-shrink-0 flex items-center justify-center relative overflow-hidden border border-secondary/10 p-2">
                        {item.products?.image ? (
                          <Image src={item.products.image} alt={item.products.name || 'منتج'} fill className="object-contain" />
                        ) : (
                          <Package className="w-6 h-6 text-secondary/40" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-body-md font-medium text-on-surface">{item.products?.name || 'عطر غير معروف'}</h4>
                        {item.volume && item.unit && (
                          <p className="font-label-sm text-xs text-on-surface-variant mt-1">{item.volume}{item.unit}</p>
                        )}
                      </div>
                      <div className="text-left font-sans font-semibold text-on-surface">
                        {item.quantity} × {item.unit_price} ج.م
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Actions Footer */}
                <div className="mt-6 pt-6 border-t border-secondary/10 flex justify-between items-center gap-4">
                  <div>
                    <a
                      href={`https://wa.me/201016693794?text=${encodeURIComponent(`مرحباً Lovely Smell، أود تقديم طلب إرجاع/استبدال للطلب رقم: ${order.order_number}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2 bg-white border border-[#2C2C2C] text-[#2C2C2C] hover:bg-black hover:text-white rounded-full font-sans text-xs flex items-center gap-1.5 transition-all duration-300"
                    >
                      طلب إرجاع / استبدال
                    </a>
                  </div>
                  
                  <Link
                    href={`/order-tracking?orderNumber=${order.order_number}`}
                    className="text-xs font-sans text-[#C4A36E] underline hover:text-[#b38f59] transition-colors"
                  >
                    تتبع تفاصيل الشحن
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
