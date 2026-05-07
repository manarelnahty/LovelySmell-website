'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { Logo } from '@/components/logo';
import { useState, useActionState } from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';
import { forgotPassword } from '@/lib/actions/auth';

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(forgotPassword, null);

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#FDF9F3] text-[#2C2C2C]">
      {/* Visual Side (Image) */}
      <div className="relative hidden lg:block h-full w-full overflow-hidden bg-[#2C2C2C]">
        <Image
          src="/luxury-perfume.png"
          alt="Luxury Perfume"
          fill
          sizes="50vw"
          className="object-cover object-center scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E]/80 via-transparent to-transparent" />
      </div>

      {/* Form Side */}
      <div className="flex flex-col justify-center px-6 md:px-16 lg:px-24 xl:px-32 relative min-h-screen py-12">
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center lg:hidden">
          <Link href="/login" className="flex items-center gap-1.5 text-[#6B6058]">
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            <span className="font-tajawal text-xs font-medium">العودة</span>
          </Link>
          <Logo />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="font-playfair text-3xl font-bold mb-4">نسيت كلمة المرور</h1>
            <p className="font-tajawal text-[#6B6058] text-sm">
              أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.
            </p>
          </div>

          <form className="space-y-6" action={formAction}>
            {state?.error && (
              <div className="p-3 bg-red-50 border-r-4 border-red-500 text-red-700 text-sm">
                {state.error}
              </div>
            )}
            {state?.success && (
              <div className="p-3 bg-green-50 border-r-4 border-green-500 text-green-700 text-sm">
                {state.success}
              </div>
            )}

            <div className="space-y-2">
              <label className="font-tajawal text-sm font-semibold" htmlFor="email">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full border-b border-[#D8D0C5] bg-transparent py-3 pr-2 text-[#2C2C2C] font-tajawal focus:outline-none focus:border-[#C4A36E] transition-colors"
                  placeholder="أدخل بريدك الإلكتروني"
                  dir="rtl"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isPending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#C4A36E] text-white font-tajawal font-bold py-4 rounded-sm shadow-xl disabled:opacity-70"
            >
              {isPending ? 'جاري الإرسال...' : 'إرسال رابط التعيين'}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/login" className="text-sm text-[#6B6058] hover:text-[#C4A36E] font-tajawal">
              العودة لتسجيل الدخول
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
