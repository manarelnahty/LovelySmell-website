export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FDF9F3]">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-secondary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-secondary rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="font-tajawal text-secondary font-medium tracking-wide animate-pulse">
          جاري التحميل...
        </p>
      </div>
    </div>
  );
}
