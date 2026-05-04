import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'السياسات القانونية والخصوصية',
  description: 'اطلع على سياسة الخصوصية والشروط والأحكام الخاصة بـ Lovely Smell EG. نلتزم بحماية بياناتك وحقوقك.',
  alternates: {
    canonical: '/legal-policies',
  },
};

export default function LegalPoliciesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
