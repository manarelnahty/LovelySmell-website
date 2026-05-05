import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تتبع طلبك',
  description: 'تتبع حالة شحنتك من Lovely Smell EG بسهولة باستخدام رقم الطلب ورقم الهاتف.',
  alternates: {
    canonical: '/order-tracking',
  },
};

export default function OrderTrackingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
