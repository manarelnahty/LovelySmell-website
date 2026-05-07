"use client";

import { useState } from 'react';
import { TopNavBar } from '@/components/TopNavBar';
import { SiteFooter } from '@/components/SiteFooter';
import Link from 'next/link';
import { Info, Settings, Share2, Shield, FileText, Mail } from 'lucide-react';

const TABS = [
  { key: 'privacy', label: 'سياسة الخصوصية' },
  { key: 'terms',   label: 'الشروط والأحكام'  },
] as const;

type Tab = typeof TABS[number]['key'];

const privacySections = [
  {
    icon: <Info className="w-5 h-5" strokeWidth={1.5} />,
    title: 'جمع المعلومات',
    body: 'نحن في Lovely Smell EG نلتزم بحماية خصوصيتك. نقوم بجمع معلوماتك الشخصية مثل الاسم، البريد الإلكتروني، العنوان، ورقم الهاتف عند التسجيل في موقعنا أو إتمام عملية شراء. قد نجمع أيضاً بيانات التصفح لتحسين تجربتك.',
  },
  {
    icon: <Settings className="w-5 h-5" strokeWidth={1.5} />,
    title: 'استخدام المعلومات',
    body: 'تُستخدم المعلومات التي نجمعها لمعالجة طلباتك، تحسين خدمة العملاء، إرسال تحديثات حول طلبك، وتقديم عروض ترويجية مخصصة. نحن لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة.',
  },
  {
    icon: <Share2 className="w-5 h-5" strokeWidth={1.5} />,
    title: 'مشاركة المعلومات',
    body: 'قد نشارك معلوماتك مع مزودي الخدمات الموثوقين الذين يساعدوننا في تشغيل موقعنا، مثل شركات الشحن وبوابات الدفع، وذلك فقط بالقدر اللازم لتقديم هذه الخدمات.',
  },
  {
    icon: <Shield className="w-5 h-5" strokeWidth={1.5} />,
    title: 'أمان المعلومات',
    body: 'نتخذ تدابير أمنية مناسبة لحماية معلوماتك من الوصول غير المصرح به أو الإفصاح أو التغيير أو الإتلاف. تشمل هذه التدابير تشفير البيانات واستخدام بروتوكولات الاتصال الآمنة.',
  },
];

const termsSections = [
  {
    icon: <FileText className="w-5 h-5" strokeWidth={1.5} />,
    title: 'قبول الشروط',
    body: 'باستخدامك لموقع Lovely Smell EG، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام موقعنا.',
  },
  {
    icon: <Shield className="w-5 h-5" strokeWidth={1.5} />,
    title: 'استخدام الموقع',
    body: 'يُسمح لك باستخدام موقعنا للأغراض الشخصية وغير التجارية فقط. يحظر نسخ أو توزيع أو تعديل أي محتوى من موقعنا دون إذن كتابي مسبق منا.',
  },
  {
    icon: <Info className="w-5 h-5" strokeWidth={1.5} />,
    title: 'الملكية الفكرية',
    body: 'جميع محتويات هذا الموقع، بما في ذلك النصوص والصور والشعارات والتصاميم، هي ملك حصري لـ Lovely Smell EG وتخضع لقوانين الملكية الفكرية.',
  },
  {
    icon: <Settings className="w-5 h-5" strokeWidth={1.5} />,
    title: 'تعديل الشروط',
    body: 'نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار بارز على الموقع.',
  },
];

export default function LegalPoliciesPage() {
  const [activeTab, setActiveTab] = useState<Tab>('privacy');

  const sections = activeTab === 'privacy' ? privacySections : termsSections;

  return (
    <div className="bg-[#FDF9F3] text-on-surface min-h-screen flex flex-col font-body-md antialiased">
      <TopNavBar />

      <main className="flex-grow pt-24 md:pt-32 pb-12 md:pb-24 px-4 md:px-16">
        <div className="max-w-[900px] mx-auto dir-rtl">

          {/* Page Title */}
          <div className="text-center mb-10">
            <h1 className="font-headline-lg text-headline-lg text-primary-container mb-3">السياسات القانونية</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              نلتزم بالشفافية الكاملة في كيفية تعاملنا مع بياناتك وحقوقك كعميل.
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(196,163,110,0.1)] overflow-hidden border border-secondary/10">

            {/* Tabs */}
            <div className="flex border-b border-secondary/15">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-5 text-center font-bold text-[18px] transition-all duration-300 ${
                    activeTab === tab.key
                      ? 'bg-primary-container text-secondary border-b-2 border-secondary'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-8 md:p-12 space-y-10">
              {sections.map((section) => (
                <section key={section.title}>
                  <h2 className="text-[22px] font-bold text-secondary mb-4 flex items-center gap-2">
                    <span className="text-secondary">{section.icon}</span>
                    {section.title}
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    {section.body}
                  </p>
                </section>
              ))}

              {/* Last updated */}
              <p className="text-xs text-on-surface-variant/60 font-sans text-right pt-4 border-t border-secondary/10">
                آخر تحديث: مايو 2025
              </p>

              {/* CTA */}
              <div className="mt-8 pt-8 border-t border-secondary/10 flex flex-col items-center text-center gap-4">
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {activeTab === 'privacy'
                    ? 'هل لديك أسئلة حول سياسة الخصوصية؟'
                    : 'هل لديك استفسارات حول الشروط والأحكام؟'}
                </p>
                <a
                  href="https://wa.me/201018580523"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-[1.5px] border-secondary text-secondary font-label-sm text-label-sm uppercase tracking-wider hover:bg-secondary/5 active:scale-[0.98] transition-all"
                >
                  <Mail className="w-4 h-4" strokeWidth={1.5} />
                  تواصل معنا
                </a>
              </div>
            </div>
          </div>

          {/* Related Links */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-on-surface-variant">
            <Link href="/shipping-policy" className="hover:text-secondary transition-colors underline underline-offset-4">
              سياسة الشحن والإرجاع
            </Link>
            <span className="opacity-30">·</span>
            <Link href="/order-tracking" className="hover:text-secondary transition-colors underline underline-offset-4">
              تتبع طلبك
            </Link>
            <span className="opacity-30">·</span>
            <Link href="/shop" className="hover:text-secondary transition-colors underline underline-offset-4">
              المتجر
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
