"use client";

// app/dashboard/page.tsx
// ============================================================
// หน้า Dashboard — เฉพาะ admin เท่านั้น
// ถ้า student พยายามเข้า → จะถูก redirect ไป /home
// ============================================================

import { useEffect, useState } from "react";
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
    contactsList,
    contactsLoading,
    contactsError,
    fetchContactsList,
    replyToContact,
  } = useDashboard();

  useEffect(() => {
    if (user) {
      fetchUsersList();
      fetchContactsList();
    }
  }, [user]);

  // Modal states for replying to user contacts
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyStatus, setReplyStatus] = useState("resolved");
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyError, setReplyError] = useState("");

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
    <div className="min-h-screen p-4 md:p-8 flex justify-center bg-gradient-to-b from-[#FCEFF4] via-white to-white text-[#404041]">
      <div className="w-full max-w-5xl space-y-8 animate-fade-in">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-pink-100">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#DE5D8F] to-[#E992B4] bg-clip-text text-transparent flex items-center gap-2 font-serif">
              <span>📊</span> Dashboard (Admin)
            </h1>
            <p className="text-sm text-slate-500 mt-1">ระบบจัดการและตรวจสอบสิทธิ์หลังบ้าน</p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-300 rounded-xl text-sm font-semibold transition-all cursor-pointer"
          >
            ออกจากระบบ
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Admin Profile */}
          <div className="bg-white border border-[#F5CDDC] rounded-3xl p-6 md:col-span-2 space-y-4 shadow-xl shadow-[#DE5D8F]/2">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span>🛡️</span> ผู้ใช้ปัจจุบัน (แอดมิน)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-50 border border-pink-100/60 rounded-xl p-3.5">
                <span className="block text-xs text-slate-500 font-semibold mb-0.5">Email</span>
                <span className="text-slate-800 font-medium break-all">{user?.email}</span>
              </div>
              <div className="bg-slate-50 border border-pink-100/60 rounded-xl p-3.5">
                <span className="block text-xs text-slate-500 font-semibold mb-0.5">UID</span>
                <span className="text-slate-700 font-mono text-xs break-all">{user?.uid}</span>
              </div>
              <div className="bg-slate-50 border border-pink-100/60 rounded-xl p-3.5">
                <span className="block text-xs text-slate-500 font-semibold mb-0.5">Verification</span>
                <span className="text-slate-800 font-medium">
                  {user?.emailVerified ? "✅ ยืนยันอีเมลแล้ว" : "❌ ยังไม่ได้ยืนยันอีเมล"}
                </span>
              </div>
              <div className="bg-slate-50 border border-pink-100/60 rounded-xl p-3.5">
                <span className="block text-xs text-slate-500 font-semibold mb-0.5">Role</span>
                <span className="inline-flex px-2 py-0.5 rounded text-xs font-extrabold uppercase bg-rose-50 text-rose-600 border border-rose-200">
                  {role}
                </span>
              </div>
            </div>
          </div>

          {/* User Count Stats */}
          <div className="bg-white border border-[#F5CDDC] rounded-3xl p-6 flex flex-col justify-between shadow-xl shadow-[#DE5D8F]/2">
            <h2 className="text-lg font-bold text-slate-800">
              👥 สมาชิกทั้งหมด
            </h2>
            <div className="my-auto py-4">
              <div className="text-5xl font-extrabold bg-gradient-to-r from-[#DE5D8F] to-[#E992B4] bg-clip-text text-transparent">
                {usersList.length}
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-1">บัญชีผู้ใช้ในระบบทั้งหมด</p>
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
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span>📋</span> รายชื่อผู้ใช้งานทั้งหมด
            </h2>
          </div>

          {usersError && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm">
              {usersError}
            </div>
          )}

          <div className="bg-white rounded-3xl overflow-hidden border border-[#F5CDDC] shadow-xl shadow-[#DE5D8F]/2">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700 border-collapse">
                <thead>
                  <tr className="bg-[#FCEFF4]/60 border-b border-[#F5CDDC] text-slate-600 font-semibold text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 text-center w-16">ลำดับ</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">UID</th>
                    <th className="px-6 py-4 text-center w-32">Role</th>
                    <th className="px-6 py-4">วันที่สมัครสมาชิก</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-100/60">
                  {usersLoading && usersList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                        กำลังดึงข้อมูล...
                      </td>
                    </tr>
                  ) : usersList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                        ไม่มีรายชื่อผู้ใช้ในระบบ
                      </td>
                    </tr>
                  ) : (
                    usersList.map((u, idx) => (
                      <tr key={u.uid} className="hover:bg-[#FCEFF4]/20 transition-colors">
                        <td className="px-6 py-4 text-center font-semibold text-slate-400">{idx + 1}</td>
                        <td className="px-6 py-4 font-medium text-slate-800">{u.email}</td>
                        <td className="px-6 py-4"><code className="text-xs bg-slate-50 border border-pink-100/80 px-2 py-1 rounded text-slate-600 font-mono">{u.uid}</code></td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                            u.role === "admin" 
                              ? "bg-rose-50 text-rose-600 border border-rose-200" 
                              : "bg-indigo-50 text-indigo-600 border border-indigo-200"
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{formatDate(u.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* User Questions / Contact Submissions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span>💬</span> คำถาม/ข้อร้องเรียนจากนิสิต
            </h2>
            <button 
              onClick={fetchContactsList}
              disabled={contactsLoading}
              className="px-4 py-1.5 bg-[#FCEFF4] hover:bg-[#F5CDDC] text-[#DE5D8F] disabled:opacity-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              {contactsLoading ? "กำลังดึงข้อมูล..." : "🔄 รีเฟรชข้อมูล"}
            </button>
          </div>

          {contactsError && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
              {contactsError}
            </div>
          )}

          <div className="bg-white rounded-3xl overflow-hidden border border-[#F5CDDC] shadow-xl shadow-[#DE5D8F]/2">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700 border-collapse">
                <thead>
                  <tr className="bg-[#FCEFF4]/60 border-b border-[#F5CDDC] text-slate-600 font-semibold text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 text-center w-16">ลำดับ</th>
                    <th className="px-6 py-4">ผู้ส่ง</th>
                    <th className="px-6 py-4">ประเภท/หัวข้อ</th>
                    <th className="px-6 py-4">ข้อความคำถาม</th>
                    <th className="px-6 py-4 text-center">สถานะ</th>
                    <th className="px-6 py-4">วันที่ส่ง</th>
                    <th className="px-6 py-4 text-center w-28">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pink-100/60">
                  {contactsLoading && contactsList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                        กำลังดึงข้อมูล...
                      </td>
                    </tr>
                  ) : contactsList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                        ไม่มีข้อมูลข้อความคำถามในระบบ
                      </td>
                    </tr>
                  ) : (
                    contactsList.map((c, idx) => (
                      <tr key={c.id} className="hover:bg-[#FCEFF4]/20 transition-colors">
                        <td className="px-6 py-4 text-center font-semibold text-slate-400">{idx + 1}</td>
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-800 block text-xs">{c.name}</span>
                          <span className="text-slate-500 text-xs block">{c.email}</span>
                          {c.studentId && <span className="block text-slate-400 font-mono text-[10px]">{c.studentId}</span>}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-bold bg-[#FCEFF4] text-[#DE5D8F]">
                            {c.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 max-w-xs truncate text-xs text-slate-600" title={c.message}>
                          <div className="font-medium text-slate-700">{c.message}</div>
                          {c.reply && (
                            <div className="mt-1 text-[11px] text-[#DE5D8F] font-semibold">
                              ↪️ ตอบกลับ: {c.reply}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase ${
                            c.status === "resolved" 
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200" 
                              : "bg-amber-50 text-amber-600 border border-amber-200"
                          }`}>
                            {c.status === "resolved" ? "แก้ไขแล้ว" : "รอดำเนินการ"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs">{formatDate(c.createdAt)}</td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => {
                              setSelectedContact(c);
                              setReplyText(c.reply || "");
                              setReplyStatus(c.status || "resolved");
                              setReplyError("");
                            }}
                            className="px-3 py-1 bg-[#DE5D8F] hover:bg-[#DE5D8F]/95 text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
                          >
                            ตอบกลับ
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Console / Test Protected API */}
        <div className="bg-white border border-[#F5CDDC] rounded-3xl p-6 space-y-4 shadow-xl shadow-[#DE5D8F]/2">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span>⚡</span> ทดสอบการเชื่อมต่อ API (Protected API)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              ทดสอบยิง Request ไปที่ Endpoint <code>GET /me</code> พร้อมแนบ Token เพื่อตรวจสอบความถูกต้องของสิทธิ์การใช้งาน
            </p>
          </div>

          <button 
            onClick={fetchProtectedData} 
            disabled={fetchLoading}
            className="px-6 py-2.5 bg-gradient-to-r from-[#DE5D8F] to-[#E992B4] hover:from-[#DE5D8F]/95 hover:to-[#E992B4]/95 text-white font-bold rounded-xl shadow-md hover:shadow-lg disabled:opacity-60 transition-all cursor-pointer text-sm"
          >
            {fetchLoading ? "กำลังดึงข้อมูล..." : "ส่งคำขอไปที่ /me"}
          </button>

          {protectedData && (
            <div className="space-y-2">
              <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Console Response</span>
              <pre className="p-4 bg-slate-50 border border-pink-200 rounded-xl text-xs font-mono text-emerald-800 overflow-x-auto max-h-60 shadow-inner">
                {protectedData}
              </pre>
            </div>
          )}

          {fetchError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
              {fetchError}
            </div>
          )}
        </div>

        {/* Menu Navigation */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">เมนูนำทาง</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link href="/home" className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-[#FCEFF4]/30 border border-[#F5CDDC] rounded-xl text-slate-700 hover:text-[#DE5D8F] transition-all font-semibold">
              <span>🏠</span> Home
            </Link>
            <Link href="/profile" className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-[#FCEFF4]/30 border border-[#F5CDDC] rounded-xl text-slate-700 hover:text-[#DE5D8F] transition-all font-semibold">
              <span>👤</span> Profile
            </Link>
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-[#FCEFF4]/40 border border-[#DE5D8F] rounded-xl text-[#DE5D8F] transition-all font-semibold">
              <span>📊</span> Dashboard
            </Link>
          </div>
        </div>

      </div>

      {/* ==================== REPLY MODAL OVERLAY ==================== */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 scale-95 md:scale-100 transition-all">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#DE5D8F] to-[#E992B4] px-6 py-4 flex justify-between items-center text-white">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span>💬</span> ตอบกลับข้อร้องเรียน/คำถาม
              </h3>
              <button
                onClick={() => setSelectedContact(null)}
                className="text-white/80 hover:text-white text-2xl font-bold leading-none cursor-pointer focus:outline-none"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                setReplyLoading(true);
                setReplyError("");
                try {
                  await replyToContact(selectedContact.id, replyStatus, replyText);
                  setSelectedContact(null);
                } catch (err: any) {
                  setReplyError(err.message || "เกิดข้อผิดพลาดในการบันทึกการตอบกลับ");
                } finally {
                  setReplyLoading(false);
                }
              }} 
              className="p-6 space-y-4"
            >
              {replyError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-semibold">
                  ⚠️ {replyError}
                </div>
              )}

              {/* Message Details */}
              <div className="bg-slate-50 border border-pink-100/60 rounded-xl p-4 text-xs space-y-2">
                <div>
                  <span className="font-bold text-slate-500 block mb-0.5">ผู้สอบถาม</span>
                  <span className="text-slate-800 font-semibold">{selectedContact.name} ({selectedContact.email})</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 block mb-0.5">รายละเอียดข้อความ</span>
                  <p className="text-slate-700 bg-white p-3.5 rounded border border-pink-100/30 whitespace-pre-line leading-relaxed">
                    {selectedContact.message}
                  </p>
                </div>
              </div>

              {/* Reply Status Input */}
              <div>
                <label htmlFor="reply-status" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  สถานะคำถาม
                </label>
                <select
                  id="reply-status"
                  value={replyStatus}
                  onChange={(e) => setReplyStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 focus:border-[#DE5D8F] focus:ring-1 focus:ring-[#DE5D8F] rounded-lg px-3 py-2 text-sm text-slate-800 outline-none transition-all cursor-pointer"
                >
                  <option value="pending">รอดำเนินการ (Pending)</option>
                  <option value="resolved">แก้ไขแล้ว (Resolved)</option>
                </select>
              </div>

              {/* Reply text input */}
              <div>
                <label htmlFor="reply-text" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  ข้อความสำหรับตอบกลับ (ผู้ใช้จะเห็นผ่านเว็บ)
                </label>
                <textarea
                  id="reply-text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                  placeholder="เขียนคำตอบที่ต้องการตอบกลับที่นี่..."
                  className="w-full bg-slate-50 border border-slate-300 focus:border-[#DE5D8F] focus:ring-1 focus:ring-[#DE5D8F] rounded-lg px-3 py-2 text-sm text-slate-800 outline-none transition-all placeholder-slate-400 resize-none"
                ></textarea>
              </div>

              {/* Form actions */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedContact(null)}
                  className="h-10 px-5 border border-slate-300 hover:bg-slate-50 text-slate-600 rounded-lg text-sm font-bold transition-all cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={replyLoading}
                  className="h-10 px-6 bg-[#DE5D8F] hover:bg-[#DE5D8F]/95 disabled:opacity-60 text-white rounded-lg text-sm font-bold shadow-md shadow-[#DE5D8F]/10 hover:scale-102 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {replyLoading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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


