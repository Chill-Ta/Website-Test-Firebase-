"use client";

// app/dashboard/approval/page.tsx
// ============================================================
// หน้าอนุมัติรีวิวฝึกงาน — เฉพาะ admin เท่านั้น
// ออกแบบใหม่ตาม Figma Style specification (Light theme, #FFFFFF background, ChulaCharasNew font)
// ดึงข้อมูลและจัดการ CRUD ผ่าน API ในฐานข้อมูล Firestore จริง
// ============================================================

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/presentation/context/AuthProvider";
import { RouteGuard } from "@/presentation/components/RouteGuard";
import { 
  fetchReviewsUseCase, 
  approveReviewUseCase, 
  deleteReviewUseCase, 
  authRepository, 
  logoutUseCase 
} from "@/di";

const fontChula = {
  fontFamily: "'ChulaCharasNew', 'Outfit', 'Noto Sans Thai', sans-serif"
};

interface ReviewItem {
  id: string;
  company: string;
  role: string;
  content: string;
  author: string;
  date: string;
  status: "approved" | "pending";
}

function ApprovalContent() {
  const { user, role } = useAuth();
  const router = useRouter();

  // State Management
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending">("all");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReviewForModal, setSelectedReviewForModal] = useState<ReviewItem | null>(null);

  // Fetch reviews from Backend
  const fetchReviewsList = async () => {
    setLoading(true);
    setError("");
    try {
      const idToken = await authRepository.getIdToken();
      const list = await fetchReviewsUseCase.execute(idToken);
      setReviews(list);
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูลรีวิว");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchReviewsList();
    }
  }, [user]);

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
  const filteredReviews = useMemo(() => {
    return reviews
      .filter((rev) => {
        // Status Filter
        if (statusFilter === "approved" && rev.status !== "approved") return false;
        if (statusFilter === "pending" && rev.status !== "pending") return false;
        
        // Search Query Filter
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          rev.company.toLowerCase().includes(q) ||
          rev.role.toLowerCase().includes(q) ||
          rev.content.toLowerCase().includes(q) ||
          rev.author.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortOrder === "latest") return b.id.localeCompare(a.id);
        return a.id.localeCompare(b.id);
      });
  }, [reviews, searchQuery, statusFilter, sortOrder]);

  // Pagination Slice
  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage) || 1;
  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredReviews.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredReviews, currentPage]);

  // Toggle Selection
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Toggle All Current Page Selection
  const isAllSelected = useMemo(() => {
    if (paginatedReviews.length === 0) return false;
    return paginatedReviews.every((rev) => !!selectedIds[rev.id]);
  }, [paginatedReviews, selectedIds]);

  const toggleSelectAll = () => {
    if (isAllSelected) {
      const updated = { ...selectedIds };
      paginatedReviews.forEach((rev) => {
        delete updated[rev.id];
      });
      setSelectedIds(updated);
    } else {
      const updated = { ...selectedIds };
      paginatedReviews.forEach((rev) => {
        updated[rev.id] = true;
      });
      setSelectedIds(updated);
    }
  };

  // Bulk Actions
  const handleBulkApprove = async () => {
    const targets = Object.keys(selectedIds).filter((id) => selectedIds[id]);
    if (targets.length === 0) return;
    
    setLoading(true);
    try {
      const idToken = await authRepository.getIdToken();
      for (const id of targets) {
        await approveReviewUseCase.execute(idToken, id);
      }
      setSelectedIds({});
      await fetchReviewsList();
      alert(`อนุมัติรีวิวจำนวน ${targets.length} รายการสำเร็จ!`);
    } catch (err: any) {
      alert("ล้มเหลวในการอนุมัติรีวิว: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    const targets = Object.keys(selectedIds).filter((id) => selectedIds[id]);
    if (targets.length === 0) return;
    
    if (confirm(`คุณต้องการลบรีวิวฝึกงานที่เลือกจำนวน ${targets.length} รายการใช่หรือไม่?`)) {
      setLoading(true);
      try {
        const idToken = await authRepository.getIdToken();
        for (const id of targets) {
          await deleteReviewUseCase.execute(idToken, id);
        }
        setSelectedIds({});
        await fetchReviewsList();
        alert(`ลบรีวิวจำนวน ${targets.length} รายการสำเร็จ!`);
      } catch (err: any) {
        alert("ล้มเหลวในการลบรีวิว: " + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const hasSelections = Object.values(selectedIds).some((v) => v === true);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col md:flex-row relative w-full overflow-x-hidden font-sans" style={fontChula}>
      
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

              {/* Approval (Active) */}
              <Link 
                href="/dashboard/approval" 
                className="flex flex-row items-center px-4 py-2.5 gap-[16px] w-full rounded-lg bg-[#FCEFF4] text-[#DE5D8F] border-l-4 border-[#DE5D8F] font-bold transition-all"
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

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 min-h-screen bg-white p-4 md:p-10 flex flex-col space-y-6">
        
        {/* Mobile Header Toggle */}
        <div className="flex md:hidden items-center justify-between bg-white p-3 rounded-xl border border-[#DFDFE0] shadow-sm mb-4">
          <span className="font-bold text-[#DE5D8F]">📊 Approval Admin</span>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="px-3 py-1 bg-[#FCEFF4] text-[#DE5D8F] text-xs font-bold rounded-lg border border-[#F5CDDC]"
          >
            เมนู ☰
          </button>
        </div>

        {/* Header Block (Dashboard Header spec) */}
        <div className="flex justify-between items-end pb-3 border-b border-slate-100">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-black tracking-[-0.72px]" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
              รีวิวฝึกงาน
            </h1>
            <p className="text-sm text-slate-500">
              ตรวจสอบ อนุมัติ หรือลบรายงานรีวิวการฝึกงานที่นิสิตส่งเข้ามาในระบบ
            </p>
          </div>
          <div className="text-xs text-slate-400 font-medium hidden sm:block">
            *สิทธิ์เข้าถึง: <span className="text-[#DE5D8F] font-bold">{role}</span>
          </div>
        </div>

        {/* Search Field (Search Fields spec) */}
        <div className="w-full max-w-[953px] h-[45px] bg-white border border-[#8B8B8C] rounded-full flex items-center px-5 gap-4 focus-within:ring-2 focus-within:ring-[#E992B4]/40 transition-all">
          <input
            type="text"
            placeholder="ค้นหาข้อมูลผู้ใช้, ข้อความ หรือหมวดหมู่..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 h-full bg-transparent border-none outline-none text-slate-800 placeholder-[#99999A] text-sm md:text-[18px] font-medium"
            style={fontChula}
          />
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#33363F" strokeWidth="2.5" className="flex-shrink-0">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        {/* Control Toolbar: Check all, sorting dropdowns & Action buttons */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pt-4 w-full">
          
          <div className="flex items-center gap-4 w-full lg:w-auto">
            {/* Select All Checkbox Box */}
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleSelectAll}
                className="w-9 h-9 border border-[#BBBBBB] rounded flex items-center justify-center hover:bg-slate-50 cursor-pointer active:scale-95 transition-all bg-white"
                title="เลือกทั้งหมดหน้านี้"
              >
                <div className={`w-5 h-5 rounded-sm border flex items-center justify-center ${isAllSelected ? "bg-[#E992B4] border-[#E992B4]" : "border-[#99999A]"}`}>
                  {isAllSelected && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
              </button>
              <span className="text-xs text-slate-500 font-medium">เลือกทั้งหมดบนหน้านี้</span>
            </div>

            {/* Filter by Status Dropdown */}
            <div className="flex items-center gap-1.5 border border-[#D0D0D1] bg-white rounded-lg px-3 py-1.5 text-xs text-black cursor-pointer hover:bg-slate-50 transition-colors">
              <span className="font-semibold text-slate-500">แสดง:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="bg-transparent border-none outline-none font-bold text-slate-700 cursor-pointer pr-1"
                style={fontChula}
              >
                <option value="all">ทุกคน (ทั้งหมด)</option>
                <option value="approved">เฉพาะอนุมัติแล้ว (Success)</option>
                <option value="pending">เฉพาะรอดำเนินการ (Pending)</option>
              </select>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-1.5 border border-[#D0D0D1] bg-white rounded-lg px-3 py-1.5 text-xs text-black cursor-pointer hover:bg-slate-50 transition-colors">
              <span className="font-semibold text-slate-500">เรียงตาม:</span>
              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="bg-transparent border-none outline-none font-bold text-slate-700 cursor-pointer pr-1"
                style={fontChula}
              >
                <option value="latest">ล่าสุด</option>
                <option value="oldest">เก่าสุด</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            
            {/* Results count text */}
            <span className="text-sm font-bold text-[#6D6D6D] mr-2" style={fontChula}>
              แสดงทั้งหมด {filteredReviews.length} รายการ
            </span>

            {/* Action buttons (Delete & Approve spec) */}
            <button
              onClick={handleBulkDelete}
              disabled={!hasSelections || loading}
              className={`w-[126px] h-[40px] rounded-full shadow-sm flex items-center justify-center font-bold text-[#DE5D8F] bg-[#F5CDDC] transition-all text-sm select-none border border-[#DE5D8F]/10 ${
                hasSelections && !loading
                  ? "hover:bg-[#F5CDDC]/80 cursor-pointer active:scale-95" 
                  : "opacity-40 cursor-not-allowed"
              }`}
              style={fontChula}
            >
              ลบ
            </button>

            <button
              onClick={handleBulkApprove}
              disabled={!hasSelections || loading}
              className={`w-[126px] h-[40px] rounded-full shadow-sm flex items-center justify-center font-bold text-white bg-[#E992B4] transition-all text-sm select-none ${
                hasSelections && !loading
                  ? "hover:bg-[#E992B4]/90 cursor-pointer active:scale-95" 
                  : "opacity-40 cursor-not-allowed"
              }`}
              style={fontChula}
            >
              อนุมัติ
            </button>
          </div>

        </div>

        {/* Loading Indicator or Error Alert */}
        {loading ? (
          <div className="flex justify-center items-center py-20 w-full max-w-[940px]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#DE5D8F]"></div>
            <span className="ml-3 font-bold text-slate-500" style={fontChula}>กำลังดึงข้อมูลจากฐานข้อมูล...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-3xl p-6 text-center max-w-[940px] font-bold">
            ⚠️ {error}
          </div>
        ) : paginatedReviews.length === 0 ? (
          <div className="border border-dashed border-slate-200 rounded-3xl p-16 text-center text-slate-400 font-bold bg-slate-50 max-w-[940px]">
            📭 ไม่พบรายงานรีวิวฝึกงานตามหัวข้อที่ระบุ
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-[940px] pt-4">
            {paginatedReviews.map((rev) => (
              <div 
                key={rev.id} 
                className="bg-white border-l-[6px] border-[#E992B4] shadow-[0px_0px_7.3px_rgba(0,0,0,0.25)] rounded-r-lg p-5 flex flex-col justify-between h-[258px] transition-all hover:shadow-[0px_0px_10px_rgba(0,0,0,0.3)]"
              >
                {/* Header section of card */}
                <div className="flex justify-between items-start w-full">
                  <div className="space-y-1 max-w-[280px]">
                    <h3 className="text-[20px] font-bold text-black truncate" style={fontChula} title={rev.company}>
                      {rev.company}
                    </h3>
                    <p className="text-[16px] text-slate-700 font-medium truncate" style={fontChula}>
                      {rev.role}
                    </p>
                  </div>
                  
                  {/* Right side: checkbox and status badge */}
                  <div className="flex items-center gap-2">
                    {/* Status Badge */}
                    {rev.status === "approved" ? (
                      <div className="flex items-center px-2 py-1 gap-1 bg-[#E6F0FE] border border-[#3484F9] rounded-md text-[11px] font-semibold text-[#0165F8]">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span>Success</span>
                      </div>
                    ) : (
                      <div className="flex items-center px-2 py-1 gap-1 bg-[#FFE1EC] border border-[#E992B4] rounded-md text-[11px] font-semibold text-[#DE5D8F]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#DE5D8F] animate-pulse"></span>
                        <span>Pending</span>
                      </div>
                    )}

                    {/* Card Checkbox */}
                    <button
                      onClick={() => toggleSelect(rev.id)}
                      className="w-6 h-6 border border-[#8B8B8C] rounded flex items-center justify-center bg-white hover:bg-slate-50 cursor-pointer"
                    >
                      <div className={`w-4.5 h-4.5 rounded-sm flex items-center justify-center ${selectedIds[rev.id] ? "bg-[#E992B4] border-[#E992B4]" : "border-[#8B8B8C]"}`}>
                        {selectedIds[rev.id] && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Content text */}
                <p className="text-[16px] leading-[24px] text-slate-800 line-clamp-3 my-2" style={fontChula}>
                  {rev.content}
                </p>

                {/* Footer section of card: Author, Date, View Detail */}
                <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    {/* Circle Avatar placeholder */}
                    <div className="w-8 h-8 rounded-full bg-[#D9D9D9] flex items-center justify-center text-xs font-bold text-slate-600">
                      {rev.author.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[15px] font-semibold text-black truncate max-w-[140px]" style={fontChula}>
                        {rev.author}
                      </span>
                      <span className="text-[12px] text-slate-500" style={fontChula}>
                        {rev.date}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedReviewForModal(rev)}
                    className="text-xs font-bold text-[#DE5D8F] hover:text-[#9E4266] bg-[#FFE1EC] px-3 py-1.5 rounded-full border border-[#E992B4]/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    style={fontChula}
                  >
                    ดูเพิ่มเติม ➔
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* ================= PAGINATION (Component 14 spec) ================= */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center py-8 w-full max-w-[940px]">
            <div className="flex flex-row items-center justify-center gap-6 w-[418px]">
              
              {/* Left Arrow Button */}
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className={`w-[48px] h-[48px] rounded-full flex items-center justify-center text-white transition-all select-none border border-transparent ${
                  currentPage === 1 
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed opacity-50" 
                    : "bg-[#E992B4] hover:bg-[#DE5D8F] cursor-pointer active:scale-95 shadow"
                }`}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="rotate-180">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>

              {/* Page Numbers row (Frame 6232 spec) */}
              <div className="flex flex-row items-center gap-[8px] h-[32px]">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => {
                  const isActive = pNum === currentPage;
                  return (
                    <button
                      key={pNum}
                      onClick={() => setCurrentPage(pNum)}
                      className={`w-[32px] h-[32px] rounded border transition-all text-center flex items-center justify-center cursor-pointer select-none font-bold ${
                        isActive
                          ? "bg-white border-[#4200FF] text-[#4200FF] text-[12px] shadow-sm scale-110"
                          : "bg-white border-[#DFE3E8] text-[#212B36] text-[18px] hover:border-[#E992B4]/40"
                      }`}
                      style={fontChula}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>

              {/* Right Arrow Button */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className={`w-[48px] h-[48px] rounded-full flex items-center justify-center text-white transition-all select-none border border-transparent ${
                  currentPage === totalPages 
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed opacity-50" 
                    : "bg-[#E992B4] hover:bg-[#DE5D8F] cursor-pointer active:scale-95 shadow"
                }`}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>

            </div>
          </div>
        )}

      </main>

      {/* ================= DETAIL MODAL VIEW ================= */}
      {selectedReviewForModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-scale-up">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#9E4266] to-[#E992B4] px-6 py-5 flex justify-between items-center text-white">
              <div className="space-y-1">
                <span className="text-[10px] font-bold tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded">Review Approval Details</span>
                <h3 className="text-lg font-bold truncate max-w-[280px]" style={fontChula}>
                  {selectedReviewForModal.company}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedReviewForModal(null)} 
                className="text-white hover:text-rose-100 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 text-sm">
              
              <div className="space-y-1 pb-3 border-b border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">ตำแหน่งงาน (Internship Role)</span>
                <span className="text-slate-800 font-bold text-[18px]" style={fontChula}>{selectedReviewForModal.role}</span>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">ความคิดเห็นนิสิต (Review Text)</span>
                <p className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-slate-800 font-medium leading-relaxed text-[16px] whitespace-pre-line" style={fontChula}>
                  "{selectedReviewForModal.content}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#D9D9D9] flex items-center justify-center text-xs font-bold text-slate-600">
                    {selectedReviewForModal.author.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ผู้ส่งข้อมูล</span>
                    <span className="text-slate-700 font-bold text-xs" style={fontChula}>{selectedReviewForModal.author}</span>
                  </div>
                </div>
                
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col justify-center pl-4">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">วันเวลาที่ส่ง</span>
                  <span className="text-slate-700 font-bold text-xs" style={fontChula}>{selectedReviewForModal.date}</span>
                </div>
              </div>

              {/* Status indicator inside modal */}
              <div className="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-xl p-3.5 mt-2">
                <span className="text-slate-500 font-semibold text-xs">สถานะรีวิวฝึกงาน:</span>
                {selectedReviewForModal.status === "approved" ? (
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded text-xs font-extrabold flex items-center gap-1">
                    ✅ อนุมัติแล้ว (Success)
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded text-xs font-extrabold flex items-center gap-1">
                    ⏳ รอดำเนินการ (Pending)
                  </span>
                )}
              </div>

            </div>

            {/* Modal Actions */}
            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
              <button 
                onClick={() => setSelectedReviewForModal(null)} 
                className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-colors cursor-pointer text-xs"
              >
                ปิดหน้าต่าง
              </button>
              
              {selectedReviewForModal.status === "pending" && (
                <>
                  <button 
                    onClick={async () => {
                      if (confirm("ต้องการปฏิเสธและลบรีวิวนี้ใช่หรือไม่?")) {
                        try {
                          const idToken = await authRepository.getIdToken();
                          await deleteReviewUseCase.execute(idToken, selectedReviewForModal.id);
                          await fetchReviewsList();
                          setSelectedReviewForModal(null);
                          alert("ลบรีวิวสำเร็จ!");
                        } catch (err: any) {
                          alert("ล้มเหลวในการลบรีวิว: " + err.message);
                        }
                      }
                    }} 
                    className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 font-bold rounded-xl hover:bg-rose-100 transition-colors cursor-pointer text-xs"
                  >
                    ลบ/ปฏิเสธ
                  </button>

                  <button 
                    onClick={async () => {
                      try {
                        const idToken = await authRepository.getIdToken();
                        await approveReviewUseCase.execute(idToken, selectedReviewForModal.id);
                        await fetchReviewsList();
                        setSelectedReviewForModal(null);
                        alert("อนุมัติรีวิวนี้สำเร็จ!");
                      } catch (err: any) {
                        alert("ล้มเหลวในการอนุมัติรีวิว: " + err.message);
                      }
                    }} 
                    className="px-4 py-2 bg-[#E992B4] hover:bg-[#DE5D8F] text-white font-bold rounded-xl shadow transition-colors cursor-pointer text-xs"
                  >
                    อนุมัติรีวิว
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function ApprovalPage() {
  return (
    <RouteGuard allowedRoles={["admin"]}>
      <ApprovalContent />
    </RouteGuard>
  );
}
