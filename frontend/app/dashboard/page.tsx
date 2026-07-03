"use client";

// app/dashboard/page.tsx
// ============================================================
// หน้า Dashboard — เฉพาะ admin เท่านั้น
// ออกแบบใหม่ตาม Figma Style specification (Light theme, #FFFFFF background, ChulaCharasNew font)
// ============================================================

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/presentation/context/AuthProvider";
import { RouteGuard } from "@/presentation/components/RouteGuard";
import { useDashboard } from "@/presentation/hooks/useDashboard";

const fontChula = {
  fontFamily: "'ChulaCharasNew', 'Outfit', 'Noto Sans Thai', sans-serif"
};

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
    updateUserRole,
  } = useDashboard();

  useEffect(() => {
    if (user) {
      fetchUsersList();
      fetchContactsList();
    }
  }, [user]);

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyStatus, setReplyStatus] = useState("resolved");
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyError, setReplyError] = useState("");

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("th-TH", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }) + " " + date.toLocaleTimeString("th-TH", { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  const getRelativeTime = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      const diffMs = Date.now() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays === 0) {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        if (diffHours === 0) {
          const diffMins = Math.floor(diffMs / (1000 * 60));
          return `${diffMins || 1} นาทีที่แล้ว`;
        }
        return `${diffHours} ชั่วโมงที่แล้ว`;
      }
      if (diffDays < 7) {
        return `${diffDays} วันที่แล้ว`;
      }
      return date.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return "";
    }
  };

  // Search Filter
  const filteredUsers = usersList.filter(u => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (u.email || "").toLowerCase().includes(q) ||
      (u.uid || "").toLowerCase().includes(q) ||
      (u.role || "").toLowerCase().includes(q)
    );
  });

  const filteredContacts = contactsList.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (c.name || "").toLowerCase().includes(q) ||
      (c.email || "").toLowerCase().includes(q) ||
      (c.category || "").toLowerCase().includes(q) ||
      (c.message || "").toLowerCase().includes(q) ||
      (c.reply || "").toLowerCase().includes(q) ||
      (c.status || "").toLowerCase().includes(q)
    );
  });

  // CSV Export Utility
  const handleExportData = () => {
    try {
      let csvContent = "\ufeff"; // BOM for UTF-8 Excel support
      csvContent += "=== ข้อมูลผู้ใช้ในระบบ ===\n";
      csvContent += "ลำดับ,อีเมล,UID,บทบาท,วันที่สมัครสมาชิก\n";
      usersList.forEach((u, idx) => {
        csvContent += `${idx + 1},"${u.email || ""}","${u.uid || ""}","${u.role || ""}","${formatDate(u.createdAt)}"\n`;
      });

      csvContent += "\n=== ข้อมูลคำถามและข้อร้องเรียนของนิสิต ===\n";
      csvContent += "ลำดับ,ผู้ส่ง,อีเมล,ประเภทหมวดหมู่,ข้อความร้องเรียน,คำตอบกลับแอดมิน,สถานะคำสั่ง,วันที่ส่งคำร้อง\n";
      contactsList.forEach((c, idx) => {
        csvContent += `${idx + 1},"${c.name || ""}","${c.email || ""}","${c.category || ""}","${(c.message || "").replace(/"/g, '""')}","${(c.reply || "").replace(/"/g, '""')}","${c.status === "resolved" ? "แก้ไขแล้ว" : "รอดำเนินการ"}","${formatDate(c.createdAt)}"\n`;
      });

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `ArtGoz_Dashboard_Export_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Export data failed:", err);
    }
  };

  // Simulated traffic array matching the Figma design elements
  const monthlyTraffic = [
    { label: "ม.ค.", value: 12402, percent: 65, color: "#9E4266" },
    { label: "ก.พ.", value: 8950, percent: 45, color: "#E57DA5" },
    { label: "มี.ค.", value: 15640, percent: 85, color: "#CA5582" },
    { label: "เม.ย.", value: 10420, percent: 55, color: "#E992B4" },
    { label: "พ.ค.", value: 18950, percent: 95, color: "#9E4266" },
    { label: "มิ.ย.", value: 13402, percent: 70, color: "#E992B4" }
  ];

  return (
    <div className="min-h-screen bg-white text-[#1A1C1C] flex flex-col md:flex-row relative w-full overflow-x-hidden font-sans" style={fontChula}>

      {/* ================= SIDEBAR (Component 41 / Default) ================= */}
      <aside 
        className={`w-full md:w-[246px] md:min-h-[1075px] bg-white flex-shrink-0 flex flex-col justify-between p-6 border-b md:border-b-0 md:border-r border-[#DFDFE0] md:sticky md:top-0 md:h-screen z-40 shadow-[0px_3px_7.7px_rgba(0,0,0,0.25)] transition-all duration-300 ${
          isSidebarOpen ? "block" : "hidden md:flex"
        }`}
        style={{
          maxWidth: "246px",
        }}
      >
        <div className="flex flex-col items-start p-0 gap-[40px] md:gap-[52px] w-full h-full justify-between">
          
          <div className="flex flex-col items-start p-0 gap-[42px] w-full">
            {/* Brand Logo Header */}
            <div className="flex items-center gap-3 px-2 w-full justify-between md:justify-start">
              <div className="flex items-center gap-2">
                {/* Peacock SVG Logo */}
                <svg width="45" height="45" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 animate-pulse">
                  <path d="M25 45C15 55 22 75 45 80C50 82 55 70 50 60C45 50 35 35 25 45Z" fill="#E992B4" opacity="0.7" />
                  <path d="M35 35C20 45 28 65 50 72C55 74 58 62 53 52C48 42 50 25 35 35Z" fill="#CA5582" opacity="0.8" />
                  <path d="M50 28C35 35 40 55 60 65C65 67 65 55 60 45C55 35 65 18 50 28Z" fill="#9E4266" opacity="0.9" />
                  <path d="M70 28C85 35 80 55 60 65C55 67 55 55 60 45C65 35 55 18 70 28Z" fill="#E57DA5" opacity="0.7" />
                  <path d="M85 35C100 45 92 65 70 72C65 74 62 62 67 52C72 42 70 25 85 35Z" fill="#FCEFF4" opacity="0.8" />
                  <path d="M95 45C105 55 98 75 75 80C70 82 65 70 70 60C75 50 85 35 95 45Z" fill="#DFDFE0" opacity="0.8" />
                  <path d="M60 95C55 85 52 70 56 55C58 48 55 42 50 39C46 36 53 28 60 32C64 34 68 40 66 50C64 60 68 75 60 95Z" fill="#545455" />
                  <path d="M47 37L40 38L46 41Z" fill="#9CA3AF" />
                </svg>
                <div className="flex flex-col text-[14px] leading-tight text-slate-800 font-extrabold" style={fontChula}>
                  <span>คณะกรรมการ</span>
                  <span>นิสิตอักษรศาสตร์</span>
                </div>
              </div>
              <button className="md:hidden text-[#545455] font-bold text-lg" onClick={() => setIsSidebarOpen(false)}>✕</button>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col items-start p-0 w-full space-y-2">
              {/* Dashboard Overview (Active) */}
              <Link 
                href="/dashboard" 
                className="flex flex-row items-center px-4 py-2.5 gap-[16px] w-full rounded-lg bg-[#FCEFF4] text-[#DE5D8F] border-l-4 border-[#DE5D8F] font-bold transition-all"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 flex-shrink-0">
                  <rect x="3" y="3" width="7" height="9" />
                  <rect x="14" y="3" width="7" height="5" />
                  <rect x="14" y="12" width="7" height="9" />
                  <rect x="3" y="16" width="7" height="5" />
                </svg>
                <span className="text-[17px] font-semibold" style={fontChula}>Dashboard Overview</span>
              </Link>

              {/* User Management */}
              <Link 
                href="/dashboard/users" 
                className="flex flex-row items-center px-4 py-2.5 gap-[16px] w-full rounded-lg hover:bg-slate-50 text-[#545455] transition-all"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 flex-shrink-0">
                  <circle cx="12" cy="7" r="4" />
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                </svg>
                <span className="text-[17px] font-semibold" style={fontChula}>User Management</span>
              </Link>

              {/* Approval */}
              <Link 
                href="/dashboard/approval" 
                className="flex flex-row items-center px-4 py-2.5 gap-[16px] w-full rounded-lg hover:bg-slate-50 text-[#545455] transition-all"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 flex-shrink-0">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span className="text-[17px] font-semibold" style={fontChula}>Approval</span>
              </Link>

              {/* Audit Log */}
              <button 
                onClick={() => alert("Audit Log feature is mocked.")} 
                className="flex flex-row items-center px-4 py-2.5 gap-[16px] w-full rounded-lg hover:bg-slate-50 text-[#545455] text-left transition-all cursor-pointer"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 flex-shrink-0">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                <span className="text-[17px] font-semibold" style={fontChula}>Audit Log</span>
              </button>
            </nav>
          </div>

          {/* Sign out Action */}
          <div className="flex flex-col items-center p-0 w-full mt-auto">
            <button
              onClick={handleLogout}
              className="flex flex-row items-center px-4 py-2.5 gap-[16px] w-full rounded-lg hover:bg-red-50 text-[#545455] hover:text-red-500 transition-all cursor-pointer"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 flex-shrink-0">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span className="text-[17px] font-semibold" style={fontChula}>Sign out</span>
            </button>
          </div>

        </div>
      </aside>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <main className="flex-1 min-h-screen bg-slate-50/50 p-4 md:p-8 flex flex-col space-y-6">

        {/* Mobile Header Toggle */}
        <div className="flex md:hidden items-center justify-between bg-white p-3 rounded-xl border border-[#DFDFE0] shadow-sm">
          <span className="font-bold text-[#9E4266]">📊 Dashboard Admin</span>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="px-3 py-1 bg-[#FCEFF4] text-[#9E4266] text-xs font-bold rounded-lg border border-[#F5CDDC]"
          >
            เมนู ☰
          </button>
        </div>

        {/* ================= SEARCH ROW (left: 298px, top: 31px figma spec) ================= */}
        <div className="w-full flex justify-start">
          <div className="w-full max-w-[601px] h-[41px] bg-white border border-[#8B8B8C] rounded-full flex items-center px-4 gap-3 focus-within:ring-2 focus-within:ring-[#E992B4]/40 transition-all">
            {/* Value text or search input */}
            <input
              type="text"
              placeholder="ค้นหาข้อมูลผู้ใช้, ข้อความ หรือหมวดหมู่..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 h-full bg-transparent border-none outline-none text-slate-800 placeholder-[#99999A] text-sm md:text-[16px] font-medium"
              style={fontChula}
            />
            {/* Search Icon (Ellipse 65 & Vector 109 simulation) */}
            <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center cursor-pointer text-slate-500 hover:text-[#9E4266] transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>
        </div>

        {/* ================= DASHBOARD HEADER (top: 106px figma spec) ================= */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#DFDFE0]">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-[48px] font-bold text-[#1A1C1C] tracking-tight leading-tight" style={fontChula}>
              Dashboard Overview
            </h1>
            <p className="text-xs text-slate-500">แผงควบคุมระบบตรวจสอบ ข้อมูลการเข้าชม และรายงานข้อร้องเรียน</p>
          </div>

          {/* Export Button (Frame 590 / Button figma spec) */}
          <button
            onClick={handleExportData}
            className="w-[145px] h-[40px] bg-[#E992B4] hover:bg-[#E992B4]/90 transition-all rounded-full shadow-sm flex items-center justify-center gap-2 cursor-pointer font-bold text-white text-sm"
          >
            {/* White Icon container */}
            <span className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center text-[8px] text-[#E992B4]">⬇</span>
            <span style={fontChula} className="text-sm">ส่งออกข้อมูล</span>
          </button>
        </div>

        {/* ================= KEY METRICS ROW (top: 195px figma spec) ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* Card 1: ยอดเข้าชมทั้งหมด */}
          <div className="bg-white border border-[#F5CDDC]/60 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between h-[148px]">
            <div className="flex items-start justify-between">
              {/* Overlay / Icon block */}
              <div className="w-8 h-8 rounded-md bg-[#F5CDDC] flex items-center justify-center text-[#9E4266] font-bold">
                👁️
              </div>
              {/* Growth badge */}
              <div className="bg-[#ECF4E7] rounded-full px-2.5 py-0.5 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#64A93C] flex items-center justify-center text-[6px] text-white">▲</span>
                <span className="text-xs font-bold text-[#64A93C]" style={fontChula}>12%</span>
              </div>
            </div>
            <div className="space-y-1 mt-3">
              <span className="block text-sm font-bold text-[#6D6D6D]" style={fontChula}>ยอดเข้าชมทั้งหมด</span>
              <span className="block text-[28px] font-semibold text-black tracking-tight font-sans">125,402</span>
            </div>
          </div>

          {/* Card 2: หมวดหมู่ยอดนิยม */}
          <div className="bg-white border border-[#F5CDDC]/60 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between h-[148px]">
            <div className="flex items-start justify-between">
              <div className="w-8 h-8 rounded-md bg-[#ECECEC] flex items-center justify-center text-slate-600 font-bold">
                🏷️
              </div>
            </div>
            <div className="space-y-2 mt-2">
              <span className="block text-sm font-bold text-[#6D6D6D]" style={fontChula}>หมวดหมู่คำถามยอดนิยม</span>
              {/* Colored pills matching figma text style */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[18px] font-bold text-[#CA5582]" style={fontChula}>ปรัชญา</span>
                <span className="text-[14px] font-bold text-[#E57DA5]" style={fontChula}>วัฒนธรรม</span>
                <span className="text-[12px] font-bold text-[#E992B4]" style={fontChula}>ภาษา</span>
              </div>
            </div>
          </div>

          {/* Card 3: สมาชิกทั้งหมด (Real Data) */}
          <div className="bg-white border border-[#F5CDDC]/60 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between h-[148px]">
            <div className="flex items-start justify-between">
              <div className="w-8 h-8 rounded-md bg-[#F5CDDC] flex items-center justify-center text-[#9E4266] font-bold">
                👥
              </div>
              <button
                onClick={fetchUsersList}
                disabled={usersLoading}
                className="text-[10px] font-semibold text-[#CA5582] bg-[#FCEFF4] px-2 py-0.5 rounded border border-[#F5CDDC]"
              >
                {usersLoading ? "ดึงข้อมูล..." : "รีเฟรช"}
              </button>
            </div>
            <div className="space-y-1 mt-3">
              <span className="block text-sm font-bold text-[#6D6D6D]" style={fontChula}>สมาชิกในระบบทั้งหมด</span>
              <span className="block text-[28px] font-semibold text-black tracking-tight font-sans">
                {usersLoading ? "..." : usersList.length}
              </span>
            </div>
          </div>

          {/* Card 4: คอมเมนต์ใหม่ (Real Data Contacts) */}
          <div className="bg-white border border-[#F5CDDC]/60 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between h-[148px]">
            <div className="flex items-start justify-between">
              <div className="w-8 h-8 rounded-md bg-[#FCEFF4] flex items-center justify-center text-[#DE5D8F] font-bold">
                💬
              </div>
              <div className="bg-[#ECF4E7] rounded-full px-2.5 py-0.5 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#64A93C] flex items-center justify-center text-[6px] text-white">▲</span>
                <span className="text-xs font-bold text-[#64A93C]" style={fontChula}>8%</span>
              </div>
            </div>
            <div className="space-y-1 mt-3">
              <span className="block text-sm font-bold text-[#6D6D6D]" style={fontChula}>คำถามจากนิสิตทั้งหมด</span>
              <span className="block text-[28px] font-semibold text-black tracking-tight font-sans">
                {contactsLoading ? "..." : contactsList.length}
              </span>
            </div>
          </div>

        </div>

        {/* ================= MIDDLE ROW (CHART & API TEST) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column: Traffic Chart Panel (top: 375px figma spec) */}
          <div className="bg-white border border-[#DFDFE0] rounded-2xl p-6 shadow-sm flex flex-col lg:col-span-2 justify-between min-h-[460px]">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-4 border-b border-[#ECECEC]">
              <div>
                <h2 className="text-xl font-bold text-black" style={fontChula}>ภาพรวมการเข้าชม</h2>
                <p className="text-sm font-semibold text-[#9E4266]" style={fontChula}>แนวโน้มจำนวนผู้เข้าชมรายเดือน</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-[#FCEFF4] text-[#9E4266] rounded-full border border-[#F5CDDC]">สถิติจริง</span>
            </div>

            {/* Simulated Chart with hover tooltips and gridlines */}
            <div className="relative h-[280px] mt-6 flex flex-col justify-end">
              {/* Horizontal Divider lines simulated behind */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pt-4">
                <div className="border-t border-[#DFDFE0] w-full"></div>
                <div className="border-t border-[#DFDFE0] w-full"></div>
                <div className="border-t border-[#DFDFE0] w-full"></div>
                <div className="border-t border-[#DFDFE0] w-full"></div>
              </div>

              {/* Chart Bars Row */}
              <div className="relative flex justify-between items-end h-full z-10 px-4 gap-2">
                {monthlyTraffic.map((item, idx) => (
                  <div key={idx} className="relative group flex flex-col items-center flex-1 h-full justify-end">

                    {/* Floating Tooltip matching Figma bubble `#404041` background */}
                    <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-200 bottom-full mb-1 bg-[#404041] text-white text-[10px] font-bold py-1 px-2.5 rounded-sm shadow-md text-center z-20 whitespace-nowrap">
                      {item.value.toLocaleString()} views
                    </div>

                    {/* Interactive Animated Bar Column */}
                    <div
                      className="w-[36px] sm:w-[48px] rounded-t-sm hover:brightness-90 active:scale-95 transition-all duration-300 cursor-pointer shadow-sm"
                      style={{
                        height: `${item.percent}%`,
                        backgroundColor: item.color
                      }}
                    />

                    {/* Label at bottom matching figma font-family Inter */}
                    <span className="mt-3 text-[11px] font-bold text-[#9E4266] font-mono tracking-tight">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Protected API Test Console & Admin Profile */}
          <div className="bg-white border border-[#F5CDDC]/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[460px]">
            <div className="space-y-4">

              {/* Profile Details (moved from Sidebar to figma-style widget card) */}
              <div className="pb-3 border-b border-[#ECECEC]">
                <h2 className="text-[16px] font-bold text-black flex items-center gap-1.5" style={fontChula}>
                  👤 ข้อมูลส่วนตัวผู้ใช้ (แอดมิน)
                </h2>
                <div className="mt-3 bg-[#FCEFF4] border border-[#F5CDDC]/60 rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="truncate"><span className="font-semibold text-slate-500">Email:</span> <span className="text-[#9E4266] font-bold">{user?.email}</span></div>
                  <div>
                    <span className="font-semibold text-slate-500">บทบาทสิทธิ์:</span>{" "}
                    <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-50 text-rose-600 border border-rose-200">
                      {role}
                    </span>
                  </div>
                  <div><span className="font-semibold text-slate-500">สถานะการตรวจสอบ:</span> {user?.emailVerified ? "✅ ยืนยันอีเมลแล้ว" : "❌ ยังไม่ได้ยืนยัน"}</div>
                </div>
              </div>

              <div className="pb-1">
                <h2 className="text-lg font-bold text-black flex items-center gap-1.5" style={fontChula}>
                  <span>⚡</span> เชื่อมต่อ API / ตรวจสอบสิทธิ์
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  ส่งคำขอ GET /me เพื่อตรวจสอบความถูกต้องของ JSON Web Token ในฝั่งแอดมิน
                </p>
              </div>

              <button
                onClick={fetchProtectedData}
                disabled={fetchLoading}
                className="w-full py-2.5 bg-gradient-to-r from-[#DE5D8F] to-[#E992B4] hover:from-[#DE5D8F]/95 hover:to-[#E992B4]/95 text-white font-bold rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-60 cursor-pointer text-sm"
              >
                {fetchLoading ? "กำลังยิงคำขอ..." : "ส่งคำขอ GET /me"}
              </button>

              {protectedData && (
                <div className="space-y-2 pt-2">
                  <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Console Response</span>
                  <pre className="p-3 bg-slate-900 border border-pink-900/40 rounded-xl text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-48 shadow-inner leading-relaxed">
                    {protectedData}
                  </pre>
                </div>
              )}

              {fetchError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-semibold">
                  ⚠️ {fetchError}
                </div>
              )}
            </div>

            <div className="text-[11px] text-slate-400 font-medium pt-4 border-t border-[#ECECEC]">
              *ระบบรักษาความปลอดภัยแบบ JWT (Bearer Token)
            </div>
          </div>

        </div>

        {/* ================= TABLES AREA (Figma popular articles list style) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Column 1 & 2: Contact Submissions Table (711px width in Figma) */}
          <div className="bg-white border border-[#DFDFE0] rounded-2xl shadow-sm overflow-hidden lg:col-span-2 flex flex-col justify-between">
            <div>
              {/* Table Card Header matching Figma HorizontalBorder */}
              <div className="flex justify-between items-center px-6 py-5 border-b border-[#DFDFE0]">
                <h3 className="text-xl font-bold text-black" style={fontChula}>
                  คำถาม/ข้อร้องเรียนจากนิสิต
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#9E4266]" style={fontChula}>เดือนนี้</span>
                  <button
                    onClick={fetchContactsList}
                    disabled={contactsLoading}
                    className="p-1 bg-[#FCEFF4] text-[#9E4266] rounded hover:bg-[#F5CDDC] transition-colors"
                    title="โหลดคำร้องใหม่"
                  >
                    🔄
                  </button>
                </div>
              </div>

              {contactsError && (
                <div className="m-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs">
                  {contactsError}
                </div>
              )}

              {/* Contacts Table List */}
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F7F8F9] border-b border-[#DFDFE0]">
                      <th className="px-6 py-4 font-bold text-[#9E4266] text-center w-14" style={fontChula}>ลำดับ</th>
                      <th className="px-6 py-4 font-bold text-[#9E4266]" style={fontChula}>ข้อมูลผู้ส่ง</th>
                      <th className="px-6 py-4 font-bold text-[#9E4266]" style={fontChula}>รายละเอียด</th>
                      <th className="px-6 py-4 font-bold text-[#9E4266] text-center w-24" style={fontChula}>สถานะ</th>
                      <th className="px-6 py-4 font-bold text-[#9E4266] text-center w-24" style={fontChula}>การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ECECEC]">
                    {contactsLoading && contactsList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">กำลังดึงข้อมูล...</td>
                      </tr>
                    ) : filteredContacts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">ไม่มีข้อมูลที่ตรงกับคำร้องเรียนของคุณ</td>
                      </tr>
                    ) : (
                      filteredContacts.map((c, idx) => (
                        <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-5 text-center font-bold text-slate-400">{idx + 1}</td>
                          <td className="px-6 py-5">
                            {/* Figma styled row layout with thumbnail avatar */}
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded bg-[#ECECEC] text-[#9E4266] flex items-center justify-center font-bold text-sm">
                                {c.name ? c.name.charAt(0).toUpperCase() : "?"}
                              </div>
                              <div className="space-y-0.5">
                                <span className="block text-sm font-bold text-black">{c.name}</span>
                                <span className="block text-[11px] text-[#9E4266] font-medium max-w-[140px] truncate">{c.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="space-y-1 max-w-xs md:max-w-md">
                              <p className="font-semibold text-slate-700 text-xs line-clamp-2" title={c.message || undefined}>{c.message}</p>
                              {/* Relative time & category styled as: ปรัชญา | 2 วันที่แล้ว */}
                              <span className="block text-[11px] font-bold text-[#9E4266]" style={fontChula}>
                                {c.category} | {getRelativeTime(c.createdAt)}
                              </span>
                              {c.reply && (
                                <div className="mt-1 bg-[#FCEFF4]/50 border border-[#F5CDDC]/40 rounded-lg p-2 text-[10px] text-[#9E4266] font-semibold leading-relaxed">
                                  ↪️ ตอบกลับ: {c.reply}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${c.status === "resolved"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : "bg-amber-50 text-amber-600 border-amber-100"
                              }`} style={fontChula}>
                              {c.status === "resolved" ? "แก้ไขแล้ว" : "รอดำเนินการ"}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <button
                              onClick={() => {
                                setSelectedContact(c);
                                setReplyText(c.reply || "");
                                setReplyStatus(c.status || "resolved");
                                setReplyError("");
                              }}
                              className="px-3 py-1.5 bg-[#9E4266] hover:bg-[#CA5582] text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                              style={fontChula}
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

          {/* Column 3: Users Accounts List Table */}
          <div className="bg-white border border-[#DFDFE0] rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-5 border-b border-[#DFDFE0]">
                <h3 className="text-xl font-bold text-black" style={fontChula}>
                  บัญชีผู้ใช้ในระบบ
                </h3>
                <span className="text-xs font-bold text-[#9E4266]" style={fontChula}>แอดมิน/ทั่วไป</span>
              </div>

              {usersError && (
                <div className="m-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs">
                  {usersError}
                </div>
              )}

              {/* Users List */}
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F7F8F9] border-b border-[#DFDFE0]">
                      <th className="px-5 py-4 font-bold text-[#9E4266] text-center w-12" style={fontChula}>ลำดับ</th>
                      <th className="px-5 py-4 font-bold text-[#9E4266]" style={fontChula}>อีเมล/UID</th>
                      <th className="px-5 py-4 font-bold text-[#9E4266] text-center w-20" style={fontChula}>สิทธิ์</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ECECEC]">
                    {usersLoading && usersList.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-5 py-12 text-center text-slate-400">กำลังดึงข้อมูล...</td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-5 py-12 text-center text-slate-400">ไม่พบรายชื่อผู้ใช้</td>
                      </tr>
                    ) : (
                      filteredUsers.map((u, idx) => (
                        <tr key={u.uid} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-5 text-center font-bold text-slate-400">{idx + 1}</td>
                          <td className="px-5 py-5">
                            <div className="space-y-0.5">
                              <span className="block font-bold text-black text-xs truncate max-w-[150px]" title={u.email || undefined}>{u.email}</span>
                              <span className="block text-[9px] text-[#9E4266] font-mono truncate max-w-[150px]">{u.uid}</span>
                              <span className="block text-[9px] text-slate-400">{getRelativeTime(u.createdAt)}</span>
                            </div>
                          </td>
                          <td className="px-5 py-5 text-center">
                            <select
                              value={u.role}
                              disabled={u.uid === user?.uid}
                              onChange={async (e) => {
                                const newRole = e.target.value;
                                if (confirm(`คุณต้องการเปลี่ยนบทบาทของผู้ใช้นี้เป็น ${newRole} ใช่หรือไม่?`)) {
                                  try {
                                    await updateUserRole(u.uid, newRole);
                                  } catch (err: any) {
                                    alert(err.message || "เกิดข้อผิดพลาดในการอัปเดตบทบาท");
                                  }
                                }
                              }}
                              className={`px-2 py-1 rounded text-[10px] font-extrabold border uppercase tracking-wider outline-none cursor-pointer transition-all ${
                                u.role === "admin"
                                  ? "bg-rose-50 text-rose-600 border-rose-200 focus:border-rose-400"
                                  : "bg-indigo-50 text-indigo-600 border-indigo-200 focus:border-indigo-400"
                              } disabled:opacity-60 disabled:cursor-not-allowed`}
                              style={fontChula}
                            >
                              <option value="student">student</option>
                              <option value="teacher">teacher</option>
                              <option value="club-member">club-member</option>
                              <option value="admin">admin</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* ==================== REPLY MODAL OVERLAY (same functionality, updated premium design) ==================== */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 transform transition-all">

            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#9E4266] to-[#E992B4] px-6 py-4 flex justify-between items-center text-white">
              <h3 className="text-lg font-bold flex items-center gap-2" style={fontChula}>
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
              className="p-6 space-y-4 text-xs"
            >
              {replyError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg font-semibold">
                  ⚠️ {replyError}
                </div>
              )}

              {/* Message Details */}
              <div className="bg-slate-50 border border-pink-100/60 rounded-xl p-4 text-xs space-y-2">
                <div>
                  <span className="font-bold text-slate-500 block mb-0.5">ผู้สอบถาม</span>
                  <span className="text-slate-800 font-bold">{selectedContact.name} ({selectedContact.email})</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 block mb-0.5">รายละเอียดข้อความ</span>
                  <p className="text-slate-700 bg-white p-3.5 rounded border border-[#DFDFE0] whitespace-pre-line leading-relaxed font-sans">
                    {selectedContact.message}
                  </p>
                </div>
              </div>

              {/* Reply Status Input */}
              <div>
                <label htmlFor="reply-status" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5" style={fontChula}>
                  สถานะคำถาม
                </label>
                <select
                  id="reply-status"
                  value={replyStatus}
                  onChange={(e) => setReplyStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-[#DFDFE0] focus:border-[#9E4266] rounded-lg px-3 py-2 text-xs text-slate-800 outline-none transition-all cursor-pointer font-sans"
                >
                  <option value="pending">รอดำเนินการ (Pending)</option>
                  <option value="resolved">แก้ไขแล้ว (Resolved)</option>
                </select>
              </div>

              {/* Reply text input */}
              <div>
                <label htmlFor="reply-text" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5" style={fontChula}>
                  ข้อความสำหรับตอบกลับ (ผู้ใช้จะเห็นผ่านเว็บ)
                </label>
                <textarea
                  id="reply-text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                  placeholder="เขียนคำตอบที่ต้องการตอบกลับที่นี่..."
                  className="w-full bg-slate-50 border border-[#DFDFE0] focus:border-[#9E4266] rounded-lg px-3 py-2 text-xs text-slate-800 outline-none transition-all placeholder-slate-400 resize-none font-sans"
                ></textarea>
              </div>

              {/* Form actions */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedContact(null)}
                  className="h-9 px-4 border border-[#DFDFE0] hover:bg-slate-50 text-slate-600 rounded-lg font-bold transition-all cursor-pointer"
                  style={fontChula}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={replyLoading}
                  className="h-9 px-5 bg-[#9E4266] hover:bg-[#CA5582] disabled:opacity-60 text-white rounded-lg font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  style={fontChula}
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
