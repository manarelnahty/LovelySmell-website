"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/logo';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

const ADMIN_EMAIL = 'admin@lovelysmell.com';
const ADMIN_PASSWORD = 'admin';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [shaking, setShaking] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem('ls_admin_auth', 'true');
      router.push('/admin');
    } else {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#FDF9F3] relative overflow-hidden"
      dir="rtl"
    >
      {/* Background decorative blobs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#C4A36E]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#C4A36E]/10 rounded-full blur-3xl pointer-events-none" />

      <div
        className={`w-full max-w-md mx-4 transition-all duration-300 ${
          shaking ? 'animate-[shake_0.5s_ease-in-out]' : ''
        }`}
        style={
          shaking
            ? { animation: 'shake 0.5s ease-in-out' }
            : {}
        }
      >
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-[0_24px_80px_rgba(44,44,44,0.10)] border border-[#C4A36E]/15 p-10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#C4A36E]/10 mb-4">
              <Lock className="w-5 h-5 text-[#C4A36E]" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-bold text-[#2C2C2C] mb-1">لوحة الإدارة</h1>
            <p className="text-[#747878] text-sm">تسجيل دخول المسؤول</p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 mb-6 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-[#444748] mb-2 font-medium">
                البريد الإلكتروني
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="admin@lovelysmell.com"
                className="w-full bg-[#F5F1EA] rounded-xl py-4 px-4 text-[#2C2C2C] placeholder:text-[#747878]/60 focus:ring-2 focus:ring-[#C4A36E]/50 outline-none transition-all duration-300"
                dir="ltr"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm text-[#444748] mb-2 font-medium">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  className="w-full bg-[#F5F1EA] rounded-xl py-4 px-4 pl-12 text-[#2C2C2C] placeholder:text-[#747878]/60 focus:ring-2 focus:ring-[#C4A36E]/50 outline-none transition-all duration-300"
                  dir="ltr"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#747878] hover:text-[#C4A36E] transition-colors"
                  aria-label="إظهار/إخفاء كلمة المرور"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="admin-login-btn"
              className="mt-2 w-full bg-[#2C2C2C] text-[#C4A36E] rounded-2xl py-4 font-semibold hover:bg-black hover:shadow-[0_0_25px_rgba(196,163,110,0.25)] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" strokeWidth={2} />
              دخول
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#747878]/60 mt-6">
          Lovely Smell EG — Admin Portal
        </p>
      </div>

      {/* Shake keyframes via style tag */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(8px); }
          45% { transform: translateX(-6px); }
          60% { transform: translateX(6px); }
          75% { transform: translateX(-4px); }
          90% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
