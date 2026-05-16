"use client";

import { useState } from 'react';
import { Eye, EyeOff, Save, CheckCircle, AlertCircle, Lock, Mail, ShieldCheck } from 'lucide-react';

const DEFAULT_EMAIL = 'admin@lovelysmell.com';
const DEFAULT_PASSWORD = 'admin';
const CREDS_KEY = 'ls_admin_credentials';

function getStoredCreds(): { email: string; password: string } {
  if (typeof window === 'undefined') return { email: DEFAULT_EMAIL, password: DEFAULT_PASSWORD };
  try {
    const raw = localStorage.getItem(CREDS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { email: DEFAULT_EMAIL, password: DEFAULT_PASSWORD };
}

type ToastState = { type: 'success' | 'error'; msg: string } | null;

export default function AdminSettingsPage() {
  const stored = typeof window !== 'undefined' ? getStoredCreds() : { email: DEFAULT_EMAIL, password: DEFAULT_PASSWORD };

  // ── Email form ────────────────────────────────────────────────────────────
  const [newEmail, setNewEmail] = useState(stored.email);
  const [emailSaving, setEmailSaving] = useState(false);

  // ── Password form ─────────────────────────────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  // ── Toast ─────────────────────────────────────────────────────────────────
  const [toast, setToast] = useState<ToastState>(null);

  function showToast(type: 'success' | 'error', msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  // ── Save email ────────────────────────────────────────────────────────────
  function handleSaveEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmail.trim() || !newEmail.includes('@')) {
      showToast('error', 'يرجى إدخال بريد إلكتروني صحيح');
      return;
    }
    setEmailSaving(true);
    const creds = getStoredCreds();
    localStorage.setItem(CREDS_KEY, JSON.stringify({ ...creds, email: newEmail.trim() }));
    setTimeout(() => {
      setEmailSaving(false);
      showToast('success', 'تم تحديث البريد الإلكتروني بنجاح');
    }, 400);
  }

  // ── Save password ─────────────────────────────────────────────────────────
  function handleSavePassword(e: React.FormEvent) {
    e.preventDefault();
    const creds = getStoredCreds();

    if (currentPassword !== creds.password) {
      showToast('error', 'كلمة المرور الحالية غير صحيحة');
      return;
    }
    if (newPassword.length < 6) {
      showToast('error', 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('error', 'كلمتا المرور غير متطابقتين');
      return;
    }

    setPasswordSaving(true);
    localStorage.setItem(CREDS_KEY, JSON.stringify({ ...creds, password: newPassword }));
    setTimeout(() => {
      setPasswordSaving(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('success', 'تم تحديث كلمة المرور بنجاح');
    }, 400);
  }

  return (
    <div dir="rtl" className="max-w-2xl mx-auto w-full">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-sm font-medium transition-all duration-300
          ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2C2C2C]">الإعدادات</h1>
        <p className="text-[#747878] mt-1">إدارة بيانات دخول المسؤول</p>
      </div>

      {/* Security notice */}
      <div className="flex items-start gap-3 bg-[#C4A36E]/10 border border-[#C4A36E]/30 rounded-2xl p-4 mb-8">
        <ShieldCheck className="w-5 h-5 text-[#C4A36E] flex-shrink-0 mt-0.5" />
        <p className="text-sm text-[#444748]">
          بيانات الدخول محفوظة محلياً على هذا الجهاز. تأكد من استخدام كلمة مرور قوية.
        </p>
      </div>

      {/* ── Email Card ── */}
      <form onSubmit={handleSaveEmail} className="bg-white rounded-2xl border border-[#C4A36E]/10 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#C4A36E]/10 flex items-center justify-center">
            <Mail className="w-5 h-5 text-[#C4A36E]" />
          </div>
          <div>
            <h2 className="font-semibold text-[#2C2C2C]">البريد الإلكتروني</h2>
            <p className="text-xs text-[#747878]">تغيير بريد الدخول للوحة الإدارة</p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-[#444748] mb-2">البريد الإلكتروني الجديد</label>
          <input
            id="admin-settings-email"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="admin@lovelysmell.com"
            className="w-full bg-[#F5F1EA] rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-[#C4A36E]/40 text-sm transition-all"
            dir="ltr"
            required
          />
        </div>

        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={emailSaving}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#2C2C2C] text-[#C4A36E] px-8 py-3 rounded-xl text-sm font-medium hover:bg-black transition-all disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {emailSaving ? 'جاري الحفظ...' : 'حفظ البريد'}
          </button>
        </div>
      </form>

      {/* ── Password Card ── */}
      <form onSubmit={handleSavePassword} className="bg-white rounded-2xl border border-[#C4A36E]/10 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#C4A36E]/10 flex items-center justify-center">
            <Lock className="w-5 h-5 text-[#C4A36E]" />
          </div>
          <div>
            <h2 className="font-semibold text-[#2C2C2C]">كلمة المرور</h2>
            <p className="text-xs text-[#747878]">تغيير كلمة مرور الدخول للوحة الإدارة</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-4">
          {/* Current password */}
          <div>
            <label className="block text-sm font-medium text-[#444748] mb-2">كلمة المرور الحالية</label>
            <div className="relative">
              <input
                id="admin-current-password"
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F5F1EA] rounded-xl py-3 px-4 pl-11 outline-none focus:ring-2 focus:ring-[#C4A36E]/40 text-sm transition-all"
                dir="ltr"
                required
              />
              <button type="button" onClick={() => setShowCurrent(v => !v)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#747878] hover:text-[#C4A36E] transition-colors">
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New password */}
          <div>
            <label className="block text-sm font-medium text-[#444748] mb-2">كلمة المرور الجديدة</label>
            <div className="relative">
              <input
                id="admin-new-password"
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F5F1EA] rounded-xl py-3 px-4 pl-11 outline-none focus:ring-2 focus:ring-[#C4A36E]/40 text-sm transition-all"
                dir="ltr"
                required
                minLength={6}
              />
              <button type="button" onClick={() => setShowNew(v => !v)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#747878] hover:text-[#C4A36E] transition-colors">
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm new password */}
          <div>
            <label className="block text-sm font-medium text-[#444748] mb-2">تأكيد كلمة المرور الجديدة</label>
            <div className="relative">
              <input
                id="admin-confirm-password"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F5F1EA] rounded-xl py-3 px-4 pl-11 outline-none focus:ring-2 focus:ring-[#C4A36E]/40 text-sm transition-all"
                dir="ltr"
                required
              />
              <button type="button" onClick={() => setShowConfirm(v => !v)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#747878] hover:text-[#C4A36E] transition-colors">
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Match indicator */}
            {confirmPassword && (
              <p className={`text-xs mt-1.5 ${newPassword === confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
                {newPassword === confirmPassword ? '✓ كلمتا المرور متطابقتان' : '✗ كلمتا المرور غير متطابقتين'}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={passwordSaving}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#2C2C2C] text-[#C4A36E] px-8 py-3 rounded-xl text-sm font-medium hover:bg-black transition-all disabled:opacity-60"
          >
            <Lock className="w-4 h-4" />
            {passwordSaving ? 'جاري الحفظ...' : 'تحديث كلمة المرور'}
          </button>
        </div>
      </form>
    </div>
  );
}
