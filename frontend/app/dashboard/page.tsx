"use client";

// app/dashboard/page.tsx
// ============================================================
// หน้า Dashboard — เฉพาะ admin เท่านั้น
// ถ้า student พยายามเข้า → จะถูก redirect ไป /home
// ============================================================

import { useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/presentation/context/AuthProvider";
import { RouteGuard } from "@/presentation/components/RouteGuard";
import { useDashboard } from "@/presentation/hooks/useDashboard";

function DashboardContent() {
  const { role } = useAuth();
  const {
    user,
    protectedData,
    fetchError,
    fetchLoading,
    handleLogout,
    fetchProtectedData,
    usersList,
    usersLoading,
    usersError,
    fetchUsersList,
  } = useDashboard();

  useEffect(() => {
    if (user) {
      fetchUsersList();
    }
  }, [user]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      const date = new Date(dateStr);
      return date.toLocaleString("th-TH");
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex justify-center">
      <div className="w-full max-w-5xl space-y-8 animate-fade-in">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-red-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-2">
              <span>📊</span> Dashboard (Admin)
            </h1>
            <p className="text-sm text-slate-400 mt-1">ระบบจัดการและตรวจสอบสิทธิ์หลังบ้าน</p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-950/20 hover:bg-red-900/40 text-red-400 border border-red-500/20 hover:border-red-500/30 rounded-xl text-sm font-semibold transition-all cursor-pointer"
          >
            ออกจากระบบ
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Admin Profile */}
          <div className="glass-panel rounded-2xl p-6 md:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <span>🛡️</span> ผู้ใช้ปัจจุบัน (แอดมิน)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-3.5">
                <span className="block text-xs text-slate-400 font-semibold mb-0.5">Email</span>
                <span className="text-slate-200 font-medium break-all">{user?.email}</span>
              </div>
              <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-3.5">
                <span className="block text-xs text-slate-400 font-semibold mb-0.5">UID</span>
                <span className="text-slate-200 font-mono text-xs break-all">{user?.uid}</span>
              </div>
              <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-3.5">
                <span className="block text-xs text-slate-400 font-semibold mb-0.5">Verification</span>
                <span className="text-slate-200 font-medium">
                  {user?.emailVerified ? "✅ ยืนยันอีเมลแล้ว" : "❌ ยังไม่ได้ยืนยันอีเมล"}
                </span>
              </div>
              <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-3.5">
                <span className="block text-xs text-slate-400 font-semibold mb-0.5">Role</span>
                <span className="inline-flex px-2 py-0.5 rounded text-xs font-extrabold uppercase bg-red-500/10 text-red-400 border border-red-500/20">
                  {role}
                </span>
              </div>
            </div>
          </div>

          {/* User Count Stats */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
            <h2 className="text-lg font-bold text-slate-200">
              👥 สมาชิกทั้งหมด
            </h2>
            <div className="my-auto py-4">
              <div className="text-5xl font-extrabold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                {usersList.length}
              </div>
              <p className="text-xs text-slate-400 font-semibold mt-1">บัญชีผู้ใช้ในระบบทั้งหมด</p>
            </div>
            <button 
              onClick={fetchUsersList}
              disabled={usersLoading}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 rounded-xl text-xs font-bold transition-all"
            >
              {usersLoading ? "กำลังดึงข้อมูล..." : "🔄 ดึงข้อมูลผู้ใช้ล่าสุด"}
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
              <span>📋</span> รายชื่อผู้ใช้งานทั้งหมด
            </h2>
          </div>

          {usersError && (
            <div className="p-4 bg-red-950/40 border border-red-500/20 text-red-400 rounded-xl text-sm">
              {usersError}
            </div>
          )}

          <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800/80">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300 border-collapse">
                <thead>
                  <tr className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 text-center w-16">ลำดับ</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">UID</th>
                    <th className="px-6 py-4 text-center w-32">Role</th>
                    <th className="px-6 py-4">วันที่สมัครสมาชิก</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {usersLoading && usersList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        กำลังดึงข้อมูล...
                      </td>
                    </tr>
                  ) : usersList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        ไม่มีรายชื่อผู้ใช้ในระบบ
                      </td>
                    </tr>
                  ) : (
                    usersList.map((u, idx) => (
                      <tr key={u.uid} className="hover:bg-slate-850/20 transition-colors">
                        <td className="px-6 py-4 text-center font-semibold text-slate-500">{idx + 1}</td>
                        <td className="px-6 py-4 font-medium text-slate-200">{u.email}</td>
                        <td className="px-6 py-4"><code className="text-xs bg-slate-950/50 border border-slate-800/40 px-2 py-1 rounded text-slate-400 font-mono">{u.uid}</code></td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                            u.role === "admin" 
                              ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                              : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400">{formatDate(u.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Console / Test Protected API */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <span>⚡</span> ทดสอบการเชื่อมต่อ API (Protected API)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              ทดสอบยิง Request ไปที่ Endpoint <code>GET /me</code> พร้อมแนบ Token เพื่อตรวจสอบความถูกต้องของสิทธิ์การใช้งาน
            </p>
          </div>

          <button 
            onClick={fetchProtectedData} 
            disabled={fetchLoading}
            className="btn-primary py-2.5 text-sm flex items-center gap-2"
          >
            {fetchLoading ? "กำลังดึงข้อมูล..." : "ส่งคำขอไปที่ /me"}
          </button>

          {protectedData && (
            <div className="space-y-2">
              <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Console Response</span>
              <pre className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto max-h-60 shadow-inner">
                {protectedData}
              </pre>
            </div>
          )}

          {fetchError && (
            <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-400 rounded-xl text-sm">
              {fetchError}
            </div>
          )}
        </div>

        {/* Menu Navigation */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">เมนูนำทาง</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link href="/home" className="flex items-center gap-3 px-4 py-3 bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-200 transition-all font-semibold">
              <span>🏠</span> Home
            </Link>
            <Link href="/profile" className="flex items-center gap-3 px-4 py-3 bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-200 transition-all font-semibold">
              <span>👤</span> Profile
            </Link>
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-indigo-950/20 hover:bg-indigo-950/40 border border-indigo-900/30 hover:border-indigo-900/50 rounded-xl text-indigo-400 transition-all font-semibold">
              <span>📊</span> Dashboard
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RouteGuard allowedRoles={["admin"]}>
      <DashboardContent />
    </RouteGuard>
  );
}


