"use client";

// app/register/page.tsx
// ============================================================
// หน้า Register — Refactored to use Clean Architecture
// UI rendering remains here, while registration flow logic is
// delegated to the Presentation Hook (useRegister).
// ============================================================

import Link from "next/link";
import { useRegister } from "@/presentation/hooks/useRegister";

export default function RegisterPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    role,
    setRole,
    message,
    isError,
    loading,
    handleSubmit,
  } = useRegister();

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-[#FCEFF4] via-white to-white text-[#404041]">
      <div className="bg-white/90 backdrop-blur-md border border-[#F5CDDC] w-full max-w-md rounded-3xl p-8 shadow-xl shadow-[#DE5D8F]/5 animate-fade-in">
        <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-[#DE5D8F] to-[#E992B4] bg-clip-text text-transparent mb-8 font-serif">
          สมัครสมาชิก (Register)
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-slate-500 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-300 focus:border-[#DE5D8F] focus:ring-1 focus:ring-[#DE5D8F] rounded-xl px-4 py-3 text-sm text-[#404041] outline-none transition-all placeholder-slate-400"
              placeholder="example@mail.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-bold text-slate-500 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-300 focus:border-[#DE5D8F] focus:ring-1 focus:ring-[#DE5D8F] rounded-xl px-4 py-3 text-sm text-[#404041] outline-none transition-all placeholder-slate-400"
              placeholder="อย่างน้อย 6 ตัวอักษร"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#DE5D8F] to-[#E992B4] hover:from-[#DE5D8F]/95 hover:to-[#E992B4]/95 text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer mt-4 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>กำลังสมัคร...</span>
              </>
            ) : (
              "สมัครสมาชิก"
            )}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 p-3 border rounded-xl text-sm text-center font-semibold animate-fade-in ${
              isError
                ? "bg-red-50 border-red-200 text-red-600"
                : "bg-emerald-50 border-emerald-200 text-emerald-600"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-8 text-center text-sm text-slate-400">
          มีบัญชีแล้ว?{" "}
          <Link href="/home" className="text-[#DE5D8F] hover:text-[#DE5D8F]/80 font-bold transition-colors underline">
            เข้าสู่ระบบที่หน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}


