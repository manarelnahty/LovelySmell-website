import { TopNavBar } from '@/components/TopNavBar';
import { SiteFooter } from '@/components/SiteFooter';
import { Truck, Clock, CreditCard, RotateCcw, AlertCircle, HelpCircle, ChevronDown, MapPin } from 'lucide-react';
import Link from 'next/link';

const shippingCards = [
  {
    icon: <MapPin className="w-6 h-6" strokeWidth={1.5} />,
    title: 'مناطق التوصيل',
    body: 'نوفر خدمة التوصيل إلى القاهرة، الجيزة، الإسكندرية، وجميع محافظات جمهورية مصر العربية.',
  },
  {
    icon: <Clock className="w-6 h-6" strokeWidth={1.5} />,
    title: 'مدة التوصيل',
    body: 'يستغرق التوصيل من 2–3 أيام عمل للقاهرة والإسكندرية، ومن 3–5 أيام عمل لباقي المحافظات.',
  },
];

const returnSteps = [
  {
    step: '1',
    title: 'تواصل معنا',
    body: 'قم بالتواصل مع خدمة العملاء عبر تطبيق الواتساب لطلب الإرجاع أو الاستبدال.',
  },
  {
    step: '2',
    title: 'أرسل المنتج',
    body: 'سيقوم مندوبنا بالتواصل معك لاستلام المنتج من عنوانك.',
  },
  {
    step: '3',
    title: 'الاسترداد أو التبديل',
    body: 'بمجرد فحص المنتج والتأكد من حالته، سيتم رد المبلغ أو إرسال المنتج البديل.',
  },
];

const faqs = [
  {
    q: 'كيف يمكنني تتبع شحنتي؟',
    a: 'بمجرد تأكيد طلبك وخروجه للشحن، ستتلقى رسالة نصية أو رسالة عبر واتساب تحتوي على رقم التتبع الخاص بشحنتك.',
  },
  {
    q: 'متى أسترد أموالي بعد الإرجاع؟',
    a: 'تستغرق عملية استرداد الأموال من 5 إلى 10 أيام عمل بعد استلامنا للمنتج المرتجع والتأكد من سلامته، وتعتمد المدة على طريقة الدفع الأصلية.',
  },
];

export const metadata = {
  title: 'سياسة الشحن والإرجاع | Lovely Smell EG',
  description: 'تعرّف على سياسة الشحن والتوصيل والإرجاع لدى Lovely Smell EG',
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-[#FDF9F3] text-on-surface min-h-screen flex flex-col font-body-md antialiased">
      <TopNavBar />

      <main className="flex-grow pt-24 md:pt-36 pb-12 md:pb-24 px-4 md:px-16 max-w-[1440px] mx-auto w-full">
        {/* Page Header */}
        <div className="text-center mb-16 dir-rtl">
          <h1 className="font-headline-lg text-headline-lg text-primary-container mb-4">سياسة الشحن والإرجاع</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            نحرص على تقديم تجربة تسوق سلسة ومريحة لعملائنا، مع ضمان وصول منتجاتنا إليكم بأفضل حالة وفي الوقت المحدد.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(196,163,110,0.1)] p-6 md:p-16 border border-secondary/10 dir-rtl">
          <div className="flex flex-col gap-20">

            {/* Section 1: Shipping */}
            <section className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-start">
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-secondary shrink-0">
                <Truck className="w-7 h-7" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="font-headline-md text-[28px] text-primary-container mb-6">الشحن والتوصيل</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {shippingCards.map((card) => (
                    <div key={card.title} className="bg-[#F5F1EA] p-6 rounded-xl border border-secondary/10">
                      <h3 className="font-bold text-primary-container mb-2 flex items-center gap-2">
                        <span className="text-secondary">{card.icon}</span>
                        {card.title}
                      </h3>
                      <p className="text-on-surface-variant font-body-md text-body-md">{card.body}</p>
                    </div>
                  ))}

                  {/* Fees card — full width */}
                  <div className="bg-[#F5F1EA] p-6 rounded-xl border border-secondary/10 sm:col-span-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-primary-container mb-2 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-secondary" strokeWidth={1.5} />
                        رسوم التوصيل
                      </h3>
                      <p className="text-on-surface-variant font-body-md text-body-md">
                        50 جنيهاً مصرياً للطلبات أقل من 1,500 جنيه.{' '}
                        <strong className="text-secondary">توصيل مجاني للطلبات التي تزيد عن 1,500 جنيه.</strong>
                      </p>
                    </div>
                    <div className="bg-primary-container text-secondary px-6 py-2 rounded-full font-label-sm text-label-sm uppercase tracking-wider shrink-0 self-start md:self-auto">
                      الدفع عند الاستلام متاح
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-secondary/15" />

            {/* Section 2: Returns */}
            <section className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-start">
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-secondary shrink-0">
                <RotateCcw className="w-7 h-7" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="font-headline-md text-[28px] text-primary-container mb-4">الاسترجاع والاستبدال</h2>
                <p className="text-on-surface-variant font-body-md text-body-md mb-6">
                  نقبل إرجاع المنتجات خلال <strong className="text-primary-container">14 يوماً</strong> من تاريخ الاستلام، بشرط أن تكون المنتجات في حالتها الأصلية غير مفتوحة وغير مستخدمة.
                </p>

                {/* Stepper */}
                <div className="flex flex-col gap-4 relative">
                  {/* Connector line */}
                  <div className="absolute right-[11px] top-6 bottom-6 w-[2px] bg-secondary/15 hidden sm:block" />

                  {returnSteps.map((s) => (
                    <div key={s.step} className="flex items-start gap-4 relative z-10">
                      <div className="w-6 h-6 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                        {s.step}
                      </div>
                      <div className="bg-[#FDF9F3] p-4 rounded-xl flex-1 border border-secondary/10">
                        <h4 className="font-bold text-primary-container mb-1">{s.title}</h4>
                        <p className="text-sm text-on-surface-variant font-body-md">{s.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <hr className="border-secondary/15" />

            {/* Section 3: Damaged / Wrong Items */}
            <section className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-center bg-[#F5F1EA] p-8 md:p-10 rounded-2xl border border-secondary/20">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-error shrink-0 shadow-sm">
                <AlertCircle className="w-7 h-7" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="font-headline-md text-[24px] text-primary-container mb-2">المنتجات التالفة أو الخاطئة</h2>
                <p className="text-on-surface-variant font-body-md text-body-md">
                  إذا استلمت منتجاً تالفاً أو مختلفاً عما قمت بطلبه، نعتذر عن ذلك وسنقوم بتوفير{' '}
                  <strong className="text-secondary">استبدال مجاني وفوري</strong> دون تحملكم أي رسوم إضافية. يرجى التواصل معنا فور الاستلام.
                </p>
              </div>
            </section>

            {/* Section 4: FAQ */}
            <section>
              <h2 className="font-headline-md text-[28px] text-primary-container mb-6 flex items-center gap-3 justify-center md:justify-start">
                <HelpCircle className="text-secondary w-7 h-7" strokeWidth={1.5} />
                الأسئلة الشائعة
              </h2>
              <div className="flex flex-col gap-3">
                {faqs.map((faq) => (
                  <details key={faq.q} className="group border border-secondary/15 rounded-xl p-5 hover:border-secondary/40 transition-colors cursor-pointer">
                    <summary className="flex justify-between items-center list-none">
                      <h3 className="font-bold text-primary-container group-hover:text-secondary transition-colors">{faq.q}</h3>
                      <ChevronDown className="w-5 h-5 text-on-surface-variant group-open:rotate-180 transition-transform duration-300 shrink-0" strokeWidth={1.5} />
                    </summary>
                    <p className="text-sm text-on-surface-variant font-body-md mt-3 leading-relaxed">{faq.a}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          {/* CTA */}
          <div className="bg-[#F5F1EA] rounded-2xl mt-20 p-10 flex flex-col items-center justify-center text-center gap-5 border border-secondary/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-secondary/5 pointer-events-none" />
            <h3 className="font-headline-md text-[24px] text-primary-container relative z-10">لم تجد إجابة لاستفسارك؟</h3>
            <p className="text-on-surface-variant max-w-md relative z-10 font-body-md text-body-md">
              فريق خدمة العملاء لدينا مستعد دائماً للمساعدة في أي وقت.
            </p>
            <a
              href="https://wa.me/201018580523"
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full border-[1.5px] border-secondary text-secondary font-label-sm text-label-sm uppercase tracking-wider hover:bg-secondary/5 transition-colors mt-1"
            >
              تواصل معنا عبر واتساب
              <svg fill="currentColor" height="18" viewBox="0 0 16 16" width="18" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
              </svg>
            </a>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
