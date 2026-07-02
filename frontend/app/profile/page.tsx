"use client";

// app/profile/page.tsx
// ============================================================
// หน้า Profile — แสดงข้อมูลส่วนตัว (email, role)
// ปรับปรุงการออกแบบสไตล์ Figma: Account Setting - Profile & Privacy
// ขนาดคอนเทนเนอร์หลัก w-full max-w-[1280px] min-h-[996px] bg-[#FFFFFF] relative
// และลบข้อมูล UID ออกเรียบร้อยแล้ว
// ============================================================

import Link from "next/link";
import { useAuth } from "@/presentation/context/AuthProvider";
import { RouteGuard } from "@/presentation/components/RouteGuard";
import { logoutUseCase } from "@/di";
import { useRouter } from "next/navigation";

const fontChula = {
  fontFamily: "'ChulaCharasNew', 'Outfit', 'Noto Sans Thai', sans-serif"
};

function ProfileContent() {
  const { user, role } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    try {
      await logoutUseCase.execute();
      router.push("/home");
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  // ดึงตัวอักษรแรกของอีเมลมาทำเป็นอวาตาร์ชั่วคราว
  const emailPrefix = user?.email ? user.email.split("@")[0] : "?";
  const avatarChar = emailPrefix.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-0 md:p-6" style={fontChula}>
      {/* Account Setting - Profile & Privacy Canvas */}
      <div className="w-[1280px] max-w-full h-[996px] bg-white relative shadow-2xl border border-slate-200/60 overflow-hidden md:rounded-3xl">
        
        {/* Profile Container matching Figma style */}
        <div 
          className="absolute left-[192px] right-[192px] top-[54px] max-w-[896px] h-[842px] flex flex-col items-start p-0 gap-[32px]"
          style={{
            position: "absolute",
            left: "192px",
            right: "192px",
            top: "54px",
            maxWidth: "896px",
            height: "842px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            padding: "0px",
            gap: "32px"
          }}
        >
          {/* Header Section */}
          <div className="w-full flex justify-between items-center border-b border-slate-100 pb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                Profile & Privacy
              </h1>
              <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                ข้อมูลส่วนตัวและความเป็นส่วนตัวของบัญชีคุณ จัดการและตรวจสอบสิทธิ์การใช้งานได้ที่นี่
              </p>
            </div>
            
            {/* Header Navigation Actions */}
            <div className="flex gap-3">
              <Link 
                href="/home" 
                className="h-10 px-4 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold transition-all shadow-sm flex items-center gap-2 text-sm"
              >
                <span>🏠</span> หน้าหลัก (Home)
              </Link>
              <button 
                onClick={handleLogout}
                className="h-10 px-4 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl font-bold transition-all flex items-center gap-2 text-sm cursor-pointer"
              >
                <span>🚪</span> ออกจากระบบ (Logout)
              </button>
            </div>
          </div>

          {/* Profile Detail Card */}
          <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-8">
            {/* User Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#DE5D8F] to-[#E992B4] flex items-center justify-center text-white font-extrabold text-3xl shadow-md">
                {avatarChar}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#DE5D8F] border-2 border-white flex items-center justify-center text-white text-xs cursor-pointer shadow">
                ✏️
              </div>
            </div>

            {/* Quick Info */}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-800">{emailPrefix}</h3>
              <p className="text-slate-400 text-xs mt-1">Chulalongkorn University Account</p>
              <div className="flex gap-2 mt-3">
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                  role === "admin" 
                    ? "bg-rose-50 text-rose-600 border border-rose-200" 
                    : "bg-indigo-50 text-indigo-600 border border-indigo-200"
                }`}>
                  {role || "student"}
                </span>
                {user?.emailVerified && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 border border-green-200">
                    ✅ Verified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Information Form Grid */}
          <div className="w-full grid grid-cols-1 gap-6">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Email Address
              </label>
              <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none flex items-center justify-between">
                <span>{user?.email || "-"}</span>
                <span className="text-xs font-medium text-slate-400">Primary Email</span>
              </div>
            </div>

            {/* Status Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Verification Status
              </label>
              <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none flex items-center justify-between">
                <span>{user?.emailVerified ? "ยืนยันอีเมลเรียบร้อยแล้ว" : "ยังไม่ได้ยืนยันอีเมล"}</span>
                <span>
                  {user?.emailVerified ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block animate-pulse"></span>
                  )}
                </span>
              </div>
            </div>

            {/* Role Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Access Role
              </label>
              <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none flex items-center justify-between">
                <span className="capitalize">{role || "Student"}</span>
                <span className="text-xs font-medium text-slate-400">Permissions tier</span>
              </div>
            </div>
          </div>

          {/* Footer Notice */}
          <div className="w-full mt-auto pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium">
            <span>© 2026 ArtGoz - คณะกรรมการนิสิตอักษรศาสตร์. All rights reserved.</span>
            <div className="flex gap-4">
              <span className="hover:underline cursor-pointer">Privacy Policy</span>
              <span className="hover:underline cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </div>

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
