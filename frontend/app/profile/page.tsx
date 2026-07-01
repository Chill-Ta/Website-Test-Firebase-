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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#FCEFF4] via-white to-white text-[#404041]">
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md border border-[#F5CDDC] rounded-3xl p-8 shadow-xl shadow-[#DE5D8F]/5 animate-fade-in">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#DE5D8F] to-[#E992B4] bg-clip-text text-transparent mb-8 text-center flex items-center justify-center gap-2 font-serif">
          <span>👤</span> ข้อมูลส่วนตัว (Profile)
        </h1>

        <div className="bg-slate-50 border border-[#F5CDDC] rounded-2xl p-6 mb-8 divide-y divide-pink-100/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 first:pt-0">
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-500">Email Address</span>
            <span className="text-sm font-bold text-slate-800 mt-1 sm:mt-0">{user?.email || "-"}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4">
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-500">User UID</span>
            <span className="text-sm font-mono text-slate-600 mt-1 sm:mt-0 break-all">{user?.uid || "-"}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4">
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-500">Email Verified</span>
            <span className="mt-1 sm:mt-0">
              {user?.emailVerified ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-green-50 text-green-600 border border-green-200">
                  ✅ Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-50 text-red-600 border border-red-200">
                  ❌ Unverified
                </span>
              )}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 last:pb-0">
            <span className="text-sm font-semibold uppercase tracking-wider text-slate-500">Account Role</span>
            <span className="mt-1 sm:mt-0">
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-extrabold tracking-wide uppercase ${
                role === "admin" 
                  ? "bg-rose-50 text-rose-600 border border-rose-200" 
                  : "bg-indigo-50 text-indigo-600 border border-indigo-200"
              }`}>
                {role || "-"}
              </span>
            </span>
          </div>
        </div>

        <h2 className="text-lg font-bold text-slate-700 mb-4">เมนูนำทาง</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <Link href="/home" className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-[#FCEFF4]/30 border border-[#F5CDDC] rounded-xl text-slate-700 hover:text-[#DE5D8F] transition-all font-semibold">
            <span>🏠</span> Home
          </Link>
          <Link href="/profile" className="flex items-center gap-3 px-4 py-3 bg-[#FCEFF4]/40 border border-[#DE5D8F] rounded-xl text-[#DE5D8F] transition-all font-semibold">
            <span>👤</span> Profile
          </Link>
          <Link href="/help" className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-[#FCEFF4]/30 border border-[#F5CDDC] rounded-xl text-slate-700 hover:text-[#DE5D8F] transition-all font-semibold">
            <span>❓</span> ช่วยเหลือ (Help)
          </Link>
          {role === "admin" && (
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-rose-50/50 border border-rose-200 hover:border-[#DE5D8F] rounded-xl text-[#DE5D8F] transition-all font-semibold col-span-1 sm:col-span-2 md:col-span-3">
              <span>📊</span> Dashboard
            </Link>
          )}
        </div>

        <button 
          onClick={handleLogout}
          className="mt-10 w-full py-3 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl font-bold transition-all cursor-pointer text-center"
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
