"use client";

// app/login/page.tsx
// ============================================================
// หน้า Login — Refactored to use Clean Architecture
// UI rendering remains here, while all orchestration logic,
// Firebase Client SDK calls, and API integrations are delegated
// to the Presentation Hook (useLogin).
// ============================================================

import Link from "next/link";
import { useLogin } from "@/presentation/hooks/useLogin";

export default function LoginPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
  } = useLogin();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md rounded-2xl p-8 animate-fade-in">
        <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-8">
          เข้าสู่ระบบ (Login)
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
              placeholder="รหัสผ่าน"
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
                <span>กำลังเข้าสู่ระบบ...</span>
              </>
            ) : (
              "เข้าสู่ระบบ"
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-950/40 border border-red-500/20 text-red-400 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        <div className="mt-8 text-center text-sm text-slate-400">
          ยังไม่มีบัญชี?{" "}
          <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
            สมัครสมาชิก
          </Link>
        </div>
      </div>
    </div>
  );
}


