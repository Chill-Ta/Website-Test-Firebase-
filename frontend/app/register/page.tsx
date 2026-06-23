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
    message,
    isError,
    loading,
    handleSubmit,
  } = useRegister();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md rounded-2xl p-8 animate-fade-in">
        <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-8">
          สมัครสมาชิก (Register)
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="custom-input"
              placeholder="example@mail.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="custom-input"
              placeholder="อย่างน้อย 6 ตัวอักษร"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 font-semibold mt-4 flex items-center justify-center gap-2"
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
            className={`mt-4 p-3 border rounded-xl text-sm text-center ${
              isError
                ? "bg-red-950/40 border-red-500/20 text-red-400"
                : "bg-green-950/40 border-green-500/20 text-green-400"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-8 text-center text-sm text-slate-400">
          มีบัญชีแล้ว?{" "}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            เข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </div>
  );
}


