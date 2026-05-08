import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDF9F3] text-center px-4">
      <h1 className="text-6xl font-bold text-[#2C2C2C] mb-4">404</h1>
      <h2 className="text-2xl font-medium text-[#4A4A4A] mb-8">الصفحة غير موجودة</h2>
      <p className="text-[#6B6058] mb-8 max-w-md">
        عذراً، يبدو أن الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
      </p>
      <Link 
        href="/" 
        className="bg-[#2C2C2C] text-white px-8 py-3 rounded-full hover:bg-black transition-all hover:scale-105 active:scale-95 shadow-lg"
      >
        العودة للرئيسية
      </Link>
    </div>
  );
}
