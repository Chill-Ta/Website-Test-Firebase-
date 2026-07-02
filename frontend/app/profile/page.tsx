"use client";

// app/profile/page.tsx
// ============================================================
// หน้า Profile — แสดงข้อมูลส่วนตัว (email, role)
// ปรับปรุงการออกแบบสไตล์ Figma: Account Setting - Profile & Privacy
// ขนาดคอนเทนเนอร์หลัก w-full max-w-[1280px] min-h-[996px] bg-[#FFFFFF] relative
// และลบข้อมูล UID ออกเรียบร้อยแล้ว
// ============================================================

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/presentation/context/AuthProvider";
import { RouteGuard } from "@/presentation/components/RouteGuard";
import { logoutUseCase, changePasswordUseCase } from "@/di";
import { useRouter } from "next/navigation";

const fontChula = {
  fontFamily: "'ChulaCharasNew', 'Outfit', 'Noto Sans Thai', sans-serif"
};

function ProfileContent() {
  const { user, role } = useAuth();
  const router = useRouter();

  // State สำหรับฟอร์มแก้ไขรหัสผ่าน
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  async function handleLogout() {
    try {
      await logoutUseCase.execute();
      router.push("/home");
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setPasswordError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError("รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    setPasswordLoading(true);
    try {
      await changePasswordUseCase.execute(oldPassword, newPassword);
      setPasswordSuccess("เปลี่ยนรหัสผ่านสำเร็จแล้ว!");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      
      // ปิดฟอร์มหลังจากสำเร็จ
      setTimeout(() => {
        setIsEditingPassword(false);
        setPasswordSuccess("");
      }, 2500);
    } catch (err: any) {
      setPasswordError(err.message || "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน");
    } finally {
      setPasswordLoading(false);
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
          className="absolute left-[192px] right-[192px] top-[54px] max-w-[896px] h-[842px] flex flex-col items-start p-0 pr-4 gap-[32px] overflow-y-auto"
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
            padding: "0px 16px 0px 0px",
            gap: "32px",
            overflowY: "auto"
          }}
        >
          {/* Header Section */}
          <div className="w-full flex justify-between items-center border-b border-slate-100 pb-6 flex-shrink-0">
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
          <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-8 flex-shrink-0">
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
          <div className="w-full grid grid-cols-1 gap-6 flex-shrink-0">
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

          {/* Change Password Accordion Card */}
          <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 flex-shrink-0">
            <button
              onClick={() => {
                setIsEditingPassword(!isEditingPassword);
                setPasswordError("");
                setPasswordSuccess("");
              }}
              className="w-full px-6 py-4 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition-colors text-left focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🔑</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">แก้ไขรหัสผ่าน (Change Password)</h3>
                  <p className="text-xs text-slate-400">เปลี่ยนรหัสผ่านเพื่อความปลอดภัยของบัญชีคุณ</p>
                </div>
              </div>
              <span className={`text-slate-400 font-bold text-xs transition-transform duration-300 ${isEditingPassword ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {/* Expandable Form Content */}
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isEditingPassword ? 'max-h-[500px] border-t border-slate-100 p-6' : 'max-h-0'}`}>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                
                {/* Form fields grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Current Password */}
                  <div className="relative">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      รหัสผ่านปัจจุบัน
                    </label>
                    <div className="relative">
                      <input
                        type={showOldPassword ? "text" : "password"}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-[#DE5D8F] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs transition-colors"
                      >
                        {showOldPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="relative">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      รหัสผ่านใหม่
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-[#DE5D8F] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs transition-colors"
                      >
                        {showNewPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div className="relative">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      ยืนยันรหัสผ่านใหม่
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-[#DE5D8F] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs transition-colors"
                      >
                        {showConfirmPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notifications and Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <div className="flex-1 min-h-[24px]">
                    {passwordError && (
                      <p className="text-xs text-red-500 font-bold flex items-center gap-1.5 animate-pulse">
                        ❌ {passwordError}
                      </p>
                    )}
                    {passwordSuccess && (
                      <p className="text-xs text-green-500 font-bold flex items-center gap-1.5">
                        ✅ {passwordSuccess}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingPassword(false);
                        setPasswordError("");
                        setPasswordSuccess("");
                      }}
                      className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 transition-colors"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="px-5 py-2 bg-gradient-to-r from-[#DE5D8F] to-[#E992B4] hover:from-[#d14b7e] hover:to-[#e081a6] disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                    >
                      {passwordLoading ? (
                        <>
                          <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          กำลังบันทึก...
                        </>
                      ) : (
                        "บันทึกรหัสผ่านใหม่"
                      )}
                    </button>
                  </div>
                </div>

              </form>
            </div>
          </div>

          {/* Footer Notice */}
          <div className="w-full mt-auto pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium flex-shrink-0">
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
    <RouteGuard allowedRoles={["student", "admin", "teacher", "club-member"]}>
      <ProfileContent />
    </RouteGuard>
  );
}
