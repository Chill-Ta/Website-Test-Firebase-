"use client";

// app/profile/page.tsx
// ============================================================
// หน้า Profile — แสดงข้อมูลส่วนตัว (email, uid, role)
// เข้าถึงได้ทั้ง student และ admin
// ============================================================

import Link from "next/link";
import { useAuth } from "@/presentation/context/AuthProvider";
import { RouteGuard } from "@/presentation/components/RouteGuard";
import { logoutUseCase } from "@/di";
import { useRouter } from "next/navigation";

function ProfileContent() {
  const { user, role } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    try {
      await logoutUseCase.execute();
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl glass-panel rounded-2xl p-8 animate-fade-in">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent mb-8 text-center flex items-center justify-center gap-2">
          <span>👤</span> ข้อมูลส่วนตัว (Profile)
        </h1>

        <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-6 mb-8 divide-y divide-slate-850">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 first:pt-0">
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">Email Address</span>
            <span className="text-sm font-semibold text-slate-100 mt-1 sm:mt-0">{user?.email || "-"}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4">
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">User UID</span>
            <span className="text-sm font-mono text-slate-300 mt-1 sm:mt-0 break-all">{user?.uid || "-"}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4">
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">Email Verified</span>
            <span className="mt-1 sm:mt-0">
              {user?.emailVerified ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-green-500/10 text-green-400 border border-green-500/20">
                  ✅ Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-500/10 text-red-400 border border-red-500/20">
                  ❌ Unverified
                </span>
              )}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 last:pb-0">
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">Account Role</span>
            <span className="mt-1 sm:mt-0">
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-extrabold tracking-wide uppercase ${
                role === "admin" 
                  ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                  : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
              }`}>
                {role || "-"}
              </span>
            </span>
          </div>
        </div>

        <h2 className="text-lg font-bold text-slate-300 mb-4">เมนูนำทาง</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <Link href="/home" className="flex items-center gap-3 px-4 py-3 bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-200 transition-all font-semibold">
            <span>🏠</span> Home
          </Link>
          <Link href="/profile" className="flex items-center gap-3 px-4 py-3 bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-200 transition-all font-semibold">
            <span>👤</span> Profile
          </Link>
          {role === "admin" && (
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 hover:border-red-900/50 rounded-xl text-red-400 transition-all font-semibold">
              <span>📊</span> Dashboard
            </Link>
          )}
        </div>

        <button 
          onClick={handleLogout}
          className="mt-10 w-full py-3 bg-red-950/20 border border-red-500/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 rounded-xl font-bold transition-all cursor-pointer text-center"
        >
          ออกจากระบบ (Logout)
        </button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <RouteGuard allowedRoles={["student", "admin"]}>
      <ProfileContent />
    </RouteGuard>
  );
}
