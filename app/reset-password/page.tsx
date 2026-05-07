'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { Logo } from '@/components/logo';
import { useState, useActionState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { updatePassword } from '@/lib/actions/auth';

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(updatePassword, null);

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#FDF9F3] text-[#2C2C2C]">
      {/* Visual Side */}
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="flex justify-center mb-8">
            <Logo />
          </div>

          <div className="text-center mb-12">
            <h1 className="font-playfair text-3xl font-bold mb-4">تعيين كلمة مرور جديدة</h1>
            <p className="font-tajawal text-[#6B6058] text-sm">
              أدخل كلمة المرور الجديدة الخاصة بك أدناه.
            </p>
          </div>

          <form className="space-y-6" action={formAction}>
            {state?.error && (
              <div className="p-3 bg-red-50 border-r-4 border-red-500 text-red-700 text-sm">
                {state.error}
              </div>
            )}

            <div className="space-y-2 relative">
              <label className="font-tajawal text-sm font-semibold" htmlFor="password">
                كلمة المرور الجديدة
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  minLength={6}
                  className="w-full border-b border-[#D8D0C5] bg-transparent py-3 pr-2 pl-10 text-[#2C2C2C] font-tajawal focus:outline-none focus:border-[#C4A36E] transition-colors"
                  placeholder="أدخل كلمة المرور الجديدة"
                  dir="rtl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-[#A9A096]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-tajawal text-sm font-semibold" htmlFor="confirmPassword">
                تأكيد كلمة المرور
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                required
                minLength={6}
                className="w-full border-b border-[#D8D0C5] bg-transparent py-3 pr-2 text-[#2C2C2C] font-tajawal focus:outline-none focus:border-[#C4A36E] transition-colors"
                placeholder="أعد كتابة كلمة المرور"
                dir="rtl"
              />
            </div>

            <motion.button
              type="submit"
              disabled={isPending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#2C2C2C] text-[#C4A36E] font-tajawal font-bold py-4 rounded-sm shadow-xl disabled:opacity-70"
            >
              {isPending ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
