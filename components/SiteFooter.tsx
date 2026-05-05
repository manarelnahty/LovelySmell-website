import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Instagram } from 'lucide-react';

const footerLinks = {
  shop: [
    { label: 'جميع العطور', href: '/shop' },
    { label: 'العطور الجديدة', href: '/shop?filter=new' },
    { label: 'للرجال', href: '/shop?category=رجالي' },
    { label: 'للنساء', href: '/shop?category=نسائي' },
    { label: 'يونيسكس', href: '/shop?category=يونيسكس' },
  ],
  account: [
    { label: 'تسجيل الدخول', href: '/login' },
    { label: 'إنشاء حساب', href: '/register' },
    { label: 'تتبع طلبك', href: '/order-tracking' },
  ],
  info: [
    { label: 'الشحن والإرجاع', href: '/shipping-policy' },
    { label: 'سياسة الخصوصية', href: '/legal-policies' },
    { label: 'الشروط والأحكام', href: '/legal-policies' },
  ],
};

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: <Instagram className="w-4 h-4" />,
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/201018580523',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
        <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
      </svg>
    ),
  },
];

export function SiteFooter() {
  return (
    <footer className="w-full bg-[#F5F1EA] border-t border-secondary/10 dir-rtl">
      {/* Main footer grid */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand column */}
        <div className="flex flex-col gap-5">
          <Logo />
          <p className="font-body-md text-sm text-on-surface-variant leading-relaxed max-w-[200px]">
            عطور فاخرة من قلب القاهرة إلى العالم.
          </p>
          {/* Social links */}
          <div className="flex gap-3">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-secondary/30 flex items-center justify-center text-secondary hover:bg-secondary hover:text-white transition-all duration-300"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Shop links */}
        <div>
          <h4 className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-5">المتجر</h4>
          <ul className="flex flex-col gap-3">
            {footerLinks.shop.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="font-body-md text-sm text-on-surface-variant hover:text-secondary transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Account links */}
        <div>
          <h4 className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-5">حسابي</h4>
          <ul className="flex flex-col gap-3">
            {footerLinks.account.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="font-body-md text-sm text-on-surface-variant hover:text-secondary transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Info / Legal links */}
        <div>
          <h4 className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-5">معلومات</h4>
          <ul className="flex flex-col gap-3">
            {footerLinks.info.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="font-body-md text-sm text-on-surface-variant hover:text-secondary transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-secondary/10 py-6 px-6 md:px-16 max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="font-sans text-xs text-on-surface-variant/60 tracking-wider">
          © 2025 LOVELY SMELL EG. جميع الحقوق محفوظة.
        </p>
        <div className="flex gap-5 font-sans text-xs text-on-surface-variant">
          <Link href="/legal-policies" className="hover:text-secondary transition-colors">الخصوصية</Link>
          <Link href="/legal-policies" className="hover:text-secondary transition-colors">الشروط</Link>
          <Link href="/shipping-policy" className="hover:text-secondary transition-colors">الشحن والإرجاع</Link>
        </div>
      </div>
    </footer>
  );
}
