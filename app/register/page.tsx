'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { Logo } from '@/components/logo';
import { useState } from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

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
      <div className="flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32 relative min-h-screen overflow-y-auto py-12">
        {/* Back Button */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute top-8 left-8 lg:left-12"
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
          className="absolute top-8 right-8 lg:right-12"
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
            <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-4 text-[#1E1E1E]">إنشاء حساب جديد</h1>
            <p className="font-tajawal text-[#6B6058] text-sm tracking-wide leading-relaxed">
              انضم إلينا وابدأ رحلتك لاكتشاف العطور الفاخرة والاستثنائية.
            </p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="font-tajawal text-sm text-[#2C2C2C] font-semibold" htmlFor="name">
                الاسم الكامل
              </label>
              <input
                type="text"
                id="name"
                className="w-full border-b border-[#D8D0C5] bg-transparent py-3 text-[#2C2C2C] font-tajawal placeholder-[#A9A096] focus:outline-none focus:border-[#C4A36E] transition-colors duration-300"
                placeholder="أدخل اسمك الكامل"
                dir="rtl"
              />
            </div>

            <div className="space-y-2">
              <label className="font-tajawal text-sm text-[#2C2C2C] font-semibold" htmlFor="email">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                id="email"
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
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-[#A88A58] via-[#C4A36E] to-[#A88A58] bg-[length:200%_auto] hover:bg-right text-white font-tajawal font-bold py-4 rounded-sm shadow-xl hover:shadow-2xl transition-all duration-500 mt-10 relative overflow-hidden group"
            >
              <span className="relative z-10 tracking-wide">إنشاء الحساب</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            </motion.button>
          </form>

          <div className="mt-12 text-center">
            <p className="font-tajawal text-sm text-[#6B6058]">
              لديك حساب بالفعل؟{' '}
              <Link href="/login" className="text-[#C4A36E] font-bold hover:text-[#2C2C2C] transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:right-0 after:w-full after:h-[1px] after:bg-[#C4A36E] hover:after:bg-[#2C2C2C] after:transition-colors">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
