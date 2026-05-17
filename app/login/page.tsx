'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { Logo } from '@/components/logo';
import { useState, useActionState, Suspense } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { login, signInWithGoogle } from '@/lib/actions/auth';

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(login, null);
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#FDF9F3] text-[#2C2C2C]">
      {/* Visual Side (Image) - Renders on the Right in RTL */}
      <div className="relative hidden lg:block h-full w-full overflow-hidden bg-[#2C2C2C]">
        <Image
          src="/luxury-perfume.png"
          alt="Luxury Perfume"
          fill
          sizes="50vw"
          className="object-cover object-center scale-105 transition-transform duration-[10s] hover:scale-100"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E]/80 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[#C4A36E]/10 mix-blend-color-burn pointer-events-none" />
        
        {/* Subtle decorative overlay */}
        <div className="absolute bottom-12 right-12 left-12 border-t border-white/20 pt-8 flex justify-between items-end text-white/90">
          <div>
            <h2 className="font-playfair text-3xl font-bold mb-2">LOVELY SMELL EG</h2>
            <p className="font-tajawal font-light tracking-wide text-sm opacity-80">
              The Essence of Elegance
            </p>
          </div>
          <div className="text-xs tracking-[0.2em] uppercase font-tajawal opacity-70">
            Est. 2024
          </div>
        </div>
      </div>

      {/* Form Side - Renders on the Left in RTL */}
      <div className="flex flex-col justify-center px-6 md:px-16 lg:px-24 xl:px-32 relative min-h-screen overflow-y-auto py-12">
        {/* Back Button & Logo Header for Mobile */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center lg:hidden">
          <Link href="/" className="flex items-center gap-1.5 text-[#6B6058] hover:text-[#C4A36E] transition-colors group">
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            <span className="font-tajawal text-xs font-medium">الرئيسية</span>
          </Link>
          <Logo />
        </div>
        {/* Back Button */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute top-10 left-10 lg:left-12 hidden lg:block"
        >
          <Link href="/" className="flex items-center gap-2 text-[#6B6058] hover:text-[#C4A36E] transition-colors group">
            <span className="font-tajawal text-sm font-medium">العودة للرئيسية</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Logo (Top Right) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute top-10 right-10 lg:right-12 hidden lg:block"
        >
          <Logo />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md mx-auto mt-16"
        >
          <div className="text-center mb-12">
            <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-4 text-[#1E1E1E]">أهلاً بك مجدداً</h1>
            <p className="font-tajawal text-[#6B6058] text-sm tracking-wide leading-relaxed">
              سجل الدخول لاكتشاف عالم من الفخامة والعطور الاستثنائية التي تعبر عن شخصيتك.
            </p>
          </div>

          <form className="space-y-8" action={formAction}>
            <input type="hidden" name="redirect" value={redirectPath} />

            {state?.error && (
              <div className="p-3 bg-red-50 border-r-4 border-red-500 text-red-700 font-tajawal text-sm mb-4 animate-in fade-in slide-in-from-right-2">
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <label className="font-tajawal text-sm text-[#2C2C2C] font-semibold" htmlFor="email">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full border-b border-[#D8D0C5] bg-transparent py-3 text-[#2C2C2C] font-tajawal placeholder-[#A9A096] focus:outline-none focus:border-[#C4A36E] transition-colors duration-300"
                placeholder="أدخل بريدك الإلكتروني"
                dir="rtl"
              />
            </div>

            <div className="space-y-2 relative">
              <div className="flex justify-between items-end mb-1">
                <label className="font-tajawal text-sm text-[#2C2C2C] font-semibold" htmlFor="password">
                  كلمة المرور
                </label>
                <Link href="/forgot-password" className="font-tajawal text-xs text-[#6B6058] hover:text-[#C4A36E] transition-colors">
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  className="w-full border-b border-[#D8D0C5] bg-transparent py-3 pr-2 pl-10 text-[#2C2C2C] font-tajawal placeholder-[#A9A096] focus:outline-none focus:border-[#C4A36E] transition-colors duration-300"
                  placeholder="أدخل كلمة المرور"
                  dir="rtl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-[#A9A096] hover:text-[#C4A36E] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isPending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-[#A88A58] via-[#C4A36E] to-[#A88A58] bg-[length:200%_auto] hover:bg-right text-white font-tajawal font-bold py-4 rounded-sm shadow-xl hover:shadow-2xl transition-all duration-500 mt-6 relative overflow-hidden group disabled:opacity-70"
            >
              <span className="relative z-10 tracking-wide">
                {isPending ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            </motion.button>
          </form>

          <div className="mt-8">
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#D8D0C5]"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#FDF9F3] px-2 text-[#6B6058] font-tajawal">أو عبر</span>
              </div>
            </div>

            <motion.button
              onClick={() => signInWithGoogle()}
              whileHover={{ scale: 1.01, backgroundColor: '#fdfdfd' }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-3 bg-white border border-[#E5E0D8] text-[#2C2C2C] font-tajawal font-medium py-3.5 rounded-sm shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span className="tracking-wide">المتابعة باستخدام Google</span>
            </motion.button>
          </div>

          <div className="mt-10 text-center">
            <p className="font-tajawal text-sm text-[#6B6058]">
              ليس لديك حساب؟{' '}
              <Link href="/register" className="text-[#C4A36E] font-bold hover:text-[#2C2C2C] transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:right-0 after:w-full after:h-[1px] after:bg-[#C4A36E] hover:after:bg-[#2C2C2C] after:transition-colors">
                إنشاء حساب جديد
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDF9F3] flex items-center justify-center"><div className="w-8 h-8 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div></div>}>
      <LoginForm />
    </Suspense>
  );
}

