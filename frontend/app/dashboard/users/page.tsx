"use client";

// app/dashboard/users/page.tsx
// ============================================================
// หน้าจัดการบัญชี / User Management (Audit Log) — เฉพาะ admin เท่านั้น
// ออกแบบตาม Figma Style specification และ CSS พิกัดที่กำหนด
// ============================================================

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/presentation/context/AuthProvider";
import { RouteGuard } from "@/presentation/components/RouteGuard";
import { logoutUseCase } from "@/di";

const fontChula = {
  fontFamily: "'ChulaCharasNew', 'Outfit', 'Noto Sans Thai', sans-serif"
};

interface LogItem {
  id: string;
  user: string;
  role: string;
  action: string;
  timestamp: string;
  ipDevice: string;
  status: "Success" | "Failed";
}

function UserManagementContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // States for filters & search
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [userFilter, setUserFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock Logs matching the Figma screenshot rows precisely
  const initialLogs: LogItem[] = [
    { id: "1234567890", user: "Shirt Nanthanit", role: "Admin", action: "Approved Yellow Card", timestamp: "20/06/2026 14:30", ipDevice: "IP/Device", status: "Success" },
    { id: "1234567890", user: "Shirt Nanthanit", role: "Admin", action: "Approved Yellow Card", timestamp: "20/06/2026 14:28", ipDevice: "IP/Device", status: "Failed" },
    { id: "1234567890", user: "Shirt Nanthanit", role: "Admin", action: "Approved Yellow Card", timestamp: "20/06/2026 14:25", ipDevice: "IP/Device", status: "Success" },
    { id: "1234567890", user: "Shirt Nanthanit", role: "Admin", action: "Approved Yellow Card", timestamp: "20/06/2026 14:20", ipDevice: "IP/Device", status: "Failed" },
    { id: "1234567890", user: "Shirt Nanthanit", role: "Admin", action: "Approved Yellow Card", timestamp: "20/06/2026 14:15", ipDevice: "IP/Device", status: "Success" },
    { id: "1234567890", user: "Shirt Nanthanit", role: "Admin", action: "Approved Yellow Card", timestamp: "20/06/2026 14:10", ipDevice: "IP/Device", status: "Success" },
    { id: "1234567890", user: "Shirt Nanthanit", role: "Admin", action: "Approved Yellow Card", timestamp: "20/06/2026 14:05", ipDevice: "IP/Device", status: "Success" }
  ];

  // Logout Handler
  async function handleLogout() {
    try {
      await logoutUseCase.execute();
      router.push("/home");
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  // Filter & Search Logic
  const filteredLogs = useMemo(() => {
    return initialLogs
      .filter((log) => {
        // Search query filter
        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase();
          const matches =
            log.id.toLowerCase().includes(q) ||
            log.user.toLowerCase().includes(q) ||
            log.role.toLowerCase().includes(q) ||
            log.action.toLowerCase().includes(q) ||
            log.ipDevice.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // User filter
        if (userFilter !== "all") {
          if (userFilter === "Shirt Nanthanit" && log.user !== "Shirt Nanthanit") return false;
          if (userFilter === "Admin" && log.role !== "Admin") return false;
        }

        // Action filter
        if (actionFilter !== "all") {
          if (log.action !== actionFilter) return false;
        }

        // Status filter
        if (statusFilter !== "all") {
          if (log.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Sorting logic (กิจกรรมล่าสุด / กิจกรรมเก่าสุด)
        if (sortOrder === "latest") {
          return b.timestamp.localeCompare(a.timestamp);
        } else {
          return a.timestamp.localeCompare(b.timestamp);
        }
      });
  }, [searchQuery, sortOrder, userFilter, actionFilter, statusFilter]);

  // CSV Export utility
  const handleExportCSV = () => {
    try {
      let csvContent = "\ufeff"; // UTF-8 BOM
      csvContent += "Log ID,User,Role,Action,Timestamp,IP/Device,Status\n";
      filteredLogs.forEach((log) => {
        csvContent += `"${log.id}","${log.user}","${log.role}","${log.action}","${log.timestamp}","${log.ipDevice}","${log.status}"\n`;
      });

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `User_Management_AuditLog_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("CSV Export failed", err);
    }
  };

  return (
    <div 
      className="min-h-screen bg-white text-black flex flex-col md:flex-row relative w-full overflow-x-hidden font-sans" 
      style={{
        ...fontChula,
        minWidth: "1280px",
        minHeight: "1077px",
      }}
    >
      
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
              {/* Dashboard Overview */}
              <Link 
                href="/dashboard" 
                className="flex flex-row items-center px-4 py-2.5 gap-[16px] w-full rounded-lg hover:bg-slate-50 text-[#545455] transition-all"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 flex-shrink-0">
                  <rect x="3" y="3" width="7" height="9" />
                  <rect x="14" y="3" width="7" height="5" />
                  <rect x="14" y="12" width="7" height="9" />
                  <rect x="3" y="16" width="7" height="5" />
                </svg>
                <span className="text-[17px] font-semibold" style={fontChula}>Dashboard Overview</span>
              </Link>

              {/* User Management (Active) */}
              <Link 
                href="/dashboard/users" 
                className="flex flex-row items-center px-4 py-2.5 gap-[16px] w-full rounded-lg bg-[#FCEFF4] text-[#DE5D8F] border-l-4 border-[#DE5D8F] font-bold transition-all"
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

      {/* ================= MAIN CONTENT WORKSPACE ================= */}
      <main className="flex-1 bg-white relative p-6 md:p-0">
        
        {/* Mobile Header Toggle */}
        <div className="flex md:hidden items-center justify-between bg-[#FCEFF4]/30 p-3 rounded-xl border border-[#DFDFE0] shadow-sm mb-6">
          <span className="font-bold text-[#DE5D8F]">👥 User Management</span>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="px-3 py-1 bg-[#FCEFF4] text-[#DE5D8F] text-xs font-bold rounded-lg border border-[#F5CDDC]"
          >
            เมนู ☰
          </button>
        </div>

        {/* Dashboard Header Container */}
        <div 
          className="md:absolute flex flex-row justify-between items-end gap-6 md:gap-[404px] h-11 left-[298px] right-[26px] top-[62px] border-b border-slate-100 pb-2 md:pb-0"
        >
          <div className="flex flex-col items-start w-[330px] h-11">
            <h2 
              className="text-[#000000] text-[36px] font-bold tracking-[-0.72px] leading-[44px]"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
            >
              User Mangement
            </h2>
          </div>
        </div>

        {/* Search Field Container */}
        <div 
          className="md:absolute flex flex-row items-center px-6 gap-6 w-full md:w-[953px] h-[41px] left-[298px] top-[132px] bg-white border border-[#8B8B8C] rounded-full focus-within:ring-2 focus-within:ring-[#DE5D8F]/20 mt-4 md:mt-0"
        >
          <input
            type="text"
            placeholder="ค้นหา"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-full bg-transparent border-none outline-none text-slate-800 placeholder-[#99999A] text-lg font-normal font-sans"
          />
          {/* Search Icon */}
          <div className="w-5 h-5 flex items-center justify-center text-slate-700">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        {/* Dropdowns & Export Row (Frame 6683) */}
        <div 
          className="md:absolute flex flex-wrap md:flex-row items-center gap-3 w-full md:w-[950px] h-auto md:h-[35px] left-[303px] top-[190px] mt-4 md:mt-0 justify-between"
        >
          {/* Dropdowns group */}
          <div className="flex flex-wrap gap-2">
            
            {/* กิจกรรมล่าสุด */}
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="appearance-none bg-white border border-[#D0D0D1] rounded-lg px-4 pr-10 py-1.5 text-[18px] text-slate-800 focus:outline-none cursor-pointer h-[35px] min-w-[180px]"
                style={fontChula}
              >
                <option value="latest">กิจกรรมล่าสุด</option>
                <option value="oldest">กิจกรรมเก่าสุด</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#6D6D6D]">
                ▼
              </div>
            </div>

            {/* โดยทุกคน */}
            <div className="relative">
              <select
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="appearance-none bg-white border border-[#D0D0D1] rounded-lg px-4 pr-10 py-1.5 text-[18px] text-slate-800 focus:outline-none cursor-pointer h-[35px] min-w-[180px]"
                style={fontChula}
              >
                <option value="all">โดยทุกคน</option>
                <option value="Shirt Nanthanit">Shirt Nanthanit</option>
                <option value="Admin">แอดมินระบบ</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#6D6D6D]">
                ▼
              </div>
            </div>

            {/* ทุกกิจกรรม */}
            <div className="relative">
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="appearance-none bg-white border border-[#D0D0D1] rounded-lg px-4 pr-10 py-1.5 text-[18px] text-slate-800 focus:outline-none cursor-pointer h-[35px] min-w-[180px]"
                style={fontChula}
              >
                <option value="all">ทุกกิจกรรม</option>
                <option value="Approved Yellow Card">Approved Yellow Card</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#6D6D6D]">
                ▼
              </div>
            </div>

            {/* ทุกสถานะ */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-[#D0D0D1] rounded-lg px-4 pr-10 py-1.5 text-[18px] text-slate-800 focus:outline-none cursor-pointer h-[35px] min-w-[180px]"
                style={fontChula}
              >
                <option value="all">ทุกสถานะ</option>
                <option value="Success">Success</option>
                <option value="Failed">Failed</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-[#6D6D6D]">
                ▼
              </div>
            </div>

          </div>

          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            className="flex flex-row justify-center items-center gap-2 w-[129px] h-[35px] bg-[#F5CDDC] hover:bg-[#F5CDDC]/80 rounded-lg text-white font-bold text-sm transition-all cursor-pointer select-none"
            style={fontChula}
          >
            Button
            {/* Download Icon */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
        </div>

        {/* Rectangle 405 Outer Card */}
        <div 
          className="md:absolute w-[1278px] md:w-[960px] h-[554px] left-[287px] top-[327px] bg-white border border-[#8B8B8C] rounded-[12px] shadow-sm p-4 overflow-hidden mt-6 md:mt-0 flex flex-col justify-between"
        >
          {/* Table container with headers */}
          <div className="w-full flex flex-col">
            
            {/* Headers row (Frame 6684) */}
            <div className="flex flex-row items-center border-b border-[#8B8B8C] pb-3 text-[#000000] font-extrabold text-[20px] px-3 select-none" style={fontChula}>
              <div className="w-[122px]">Log ID</div>
              <div className="w-[157px]">User</div>
              <div className="w-[100px]">Role</div>
              <div className="w-[179px]">Action</div>
              <div className="w-[133px]">Timestamp</div>
              <div className="w-[136px]">IP/Device</div>
              <div className="w-[107px]">Status</div>
            </div>

            {/* Audit log rows list container */}
            <div className="flex flex-col divide-y divide-slate-100 max-h-[440px] overflow-y-auto mt-2">
              {filteredLogs.length === 0 ? (
                <div className="py-12 text-center text-slate-400 font-bold" style={fontChula}>
                  ไม่พบข้อมูลบันทึกกิจกรรมการใช้งาน (No Logs Found)
                </div>
              ) : (
                filteredLogs.map((log, index) => (
                  <div 
                    key={index} 
                    className="flex flex-row items-center py-3 text-[16px] text-[#000000] hover:bg-slate-50/50 transition-colors px-3 font-normal"
                    style={fontChula}
                  >
                    <div className="w-[122px]">{log.id}</div>
                    <div className="w-[157px] truncate pr-2">{log.user}</div>
                    <div className="w-[100px]">{log.role}</div>
                    <div className="w-[179px] truncate pr-2">{log.action}</div>
                    <div className="w-[133px]">{log.timestamp.split(" ")[0]}</div>
                    <div className="w-[136px]">{log.ipDevice}</div>
                    <div className="w-[107px]">
                      {log.status === "Success" ? (
                        <div 
                          className="flex flex-row items-center justify-center gap-1.5 w-[80.3px] h-[25.09px] bg-[#C2EAAB] border border-[#5A9A6E] rounded-[15px] text-[#5A9A6E] font-normal text-[11px]"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#38870A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Success
                        </div>
                      ) : (
                        <div 
                          className="flex flex-row items-center justify-center gap-1.5 w-[70.3px] h-[25.09px] bg-[#CB2348] border border-transparent rounded-[15px] text-white font-normal text-[12.11px]"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                          Failed
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>

          {/* Table divider border line at top of logs */}
          <div className="h-[1px] bg-[#8B8B8C] w-full mt-2" />

        </div>

      </main>

    </div>
  );
}

export default function UserManagementPage() {
  return (
    <RouteGuard allowedRoles={["admin"]}>
      <UserManagementContent />
    </RouteGuard>
  );
}
