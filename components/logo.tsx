"use client";
import { useRouter } from 'next/navigation';

export function Logo({ className = '', dark = false }: { className?: string, dark?: boolean }) {
  const router = useRouter();

  function handleDoubleClick() {
    router.push('/admin/login');
  }

  function handleClick() {
    router.push('/');
  }

  return (
    <div
      className={`flex items-center gap-4 group cursor-pointer ${className}`}
      onClick={handleClick}
    >
      <div
        className="relative flex items-center justify-center w-24 h-12 sm:w-32 sm:h-14 hover:scale-105 transition-transform duration-500"
        onDoubleClick={handleDoubleClick}
        title=""
      >
        <img
          src="/ls.png"
          alt="Lovely Smell Logo"
          className="w-full h-full object-contain scale-[1.5] sm:scale-[1.7]"
        />
      </div>
    </div>
  );
}
