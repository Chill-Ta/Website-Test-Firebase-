"use client";

// app/home/page.tsx
// ============================================================
// หน้า Home — สำหรับ student (และ admin)
// ปรับปรุงใหม่ตามสไตล์ Figma Desktop Landing (หน้าสว่าง)
// รวมเข้ากับสถานะการล็อกอิน ยินดีต้อนรับนิสิต และส่วนข้อมูลเนื้อหาต่างๆ
// ============================================================

import React, { useState, useRef, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/presentation/context/AuthProvider";
import { RouteGuard } from "@/presentation/components/RouteGuard";
import { logoutUseCase } from "@/di";
import { useRouter } from "next/navigation";
import { useLogin } from "@/presentation/hooks/useLogin";

interface ArticleItem {
  id: string;
  title: string;
  author: string;
  date: string;
  infoText: string;
  imgGradient: string;
}

interface ClubItem {
  id: string;
  name: string;
  description: string;
  members: number;
  emoji: string;
}

function HomeContent() {
  const { user, role } = useAuth();
  const router = useRouter();

  // Login Hook for Dropdown
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
  } = useLogin();

  // Carousel ref
  const carouselRef = useRef<HTMLDivElement>(null);

  // States
  const [isInternshipDropdownOpen, setIsInternshipDropdownOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Record<string, boolean>>({});

  React.useEffect(() => {
    if (user) {
      setIsLoginDropdownOpen(false);
    }
  }, [user]);

  const emailPrefix = user?.email ? user.email.split("@")[0] : "?";
  const avatarChar = emailPrefix.charAt(0).toUpperCase();

  // Logout handler
  async function handleLogout() {
    try {
      await logoutUseCase.execute();
      router.push("/home");
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  // Toggle Bookmark
  const toggleBookmark = (id: string) => {
    setBookmarkedArticles((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Scroll Carousel
  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 538; // Card width + gap
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Mock Articles
  const articles: ArticleItem[] = [
    {
      id: "art-1",
      title: "รักแมวที่สุดในโลก <3",
      author: "หมูหยองอร่อยดี",
      date: "14/03/26",
      infoText: "Information",
      imgGradient: "from-pink-400 via-rose-300 to-amber-200",
    },
    {
      id: "art-2",
      title: "10 พิกัดมุมอ่านหนังสือสุดเงียบสงบในอักษรฯ",
      author: "หนอนหนังสือตัวน้อย",
      date: "12/03/26",
      infoText: "Academic",
      imgGradient: "from-violet-400 via-indigo-300 to-cyan-200",
    },
    {
      id: "art-3",
      title: "ถอดรหัสความเครียดช่วงสอบและวิธีดูแลจิตใจ",
      author: "สายลมแสงแดด",
      date: "10/03/26",
      infoText: "Mental Health",
      imgGradient: "from-emerald-400 via-teal-300 to-sky-200",
    },
    {
      id: "art-4",
      title: "ชีวิตเด็กฝึกงานกองบรรณาธิการ: รอดหรือร่วง?",
      author: "นักหัดเขียนนิยาย",
      date: "08/03/26",
      infoText: "Internship",
      imgGradient: "from-orange-400 via-amber-300 to-yellow-200",
    },
  ];

  // Mock Clubs
  const clubs: ClubItem[] = [
    {
      id: "club-1",
      name: "ชมรมนักเขียนอักษรศาสตร์",
      description: "พื้นที่ฝึกหัดและแลกเปลี่ยนงานเขียน ความคิดสร้างสรรค์ วรรณกรรม และการทำหนังสือสาราณียกรเล่มพิเศษของคณะ",
      members: 142,
      emoji: "✍️",
    },
    {
      id: "club-2",
      name: "ชมรมละครเพลงอักษรศาสตร์ (Arts Musical)",
      description: "สร้างสรรค์ รังสรรค์ ร้อง เต้น และแสดงละครเวทีสุดอลังการที่สร้างความประทับใจให้ผู้ชมในทุกปีการศึกษา",
      members: 215,
      emoji: "🎭",
    },
    {
      id: "club-3",
      name: "ชมรมดนตรีสากลอักษรศาสตร์",
      description: "รวมตัวของคนรักดนตรี วงดนตรีประจำคณะ เล่นดนตรีสดในงานกิจกรรมต่างๆ ของคณะและจุฬาลงกรณ์มหาวิทยาลัย",
      members: 89,
      emoji: "🎸",
    },
    {
      id: "club-4",
      name: "ชมรมศิลปวัฒนธรรมวิเทศ",
      description: "เรียนรู้และเผยแพร่วัฒนธรรมนานาชาติ กิจกรรมแลกเปลี่ยนภาษา ต้อนรับนิสิตแลกเปลี่ยน และการทูตเยาวชน",
      members: 110,
      emoji: "🌐",
    },
  ];

  return (
    <div className="bg-white text-[#404041] font-sans min-h-screen flex flex-col antialiased relative">
      {/* ==================== NAVBAR ==================== */}
      <header className="sticky top-0 left-0 w-full h-[81px] bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.15)] z-40 px-6 sm:px-12 flex items-center justify-between">
        {/* Left Side: Logo (Custom stylized SVG Logo) */}
        <Link href="/home" className="flex items-center gap-3 transition-opacity hover:opacity-90">
          <div className="w-auto h-[37px] flex items-center justify-start gap-2 text-[#DE5D8F]">
            <svg width="34" height="34" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
              <rect width="40" height="40" rx="10" fill="url(#nav-logo-grad)" />
              <path d="M20 9L29 27H11L20 9Z" fill="white" opacity="0.9" />
              <circle cx="20" cy="22" r="5" fill="#DE5D8F" />
              <defs>
                <linearGradient id="nav-logo-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#DE5D8F" />
                  <stop offset="1" stopColor="#E992B4" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-[15px] font-bold tracking-wide text-[#DE5D8F] font-serif">คณะกรรมการนิสิตอักษรศาสตร์</span>
          </div>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link href="/home" className="text-[18px] font-bold text-[#DE5D8F] hover:text-[#DE5D8F]/80 transition-colors border-b-2 border-[#DE5D8F] pb-1">
            หน้าหลัก
          </Link>
          <a href="#services" className="text-[18px] font-medium text-[#404041] hover:text-[#DE5D8F] transition-colors">
            บริการนิสิต
          </a>
          <Link href="/help" className="text-[18px] font-medium text-[#404041] hover:text-[#DE5D8F] transition-colors">
            ช่วยเหลือ
          </Link>

          {/* Dropdown ฝึกงาน */}
          <div className="relative">
            <button
              onClick={() => setIsInternshipDropdownOpen(!isInternshipDropdownOpen)}
              className="flex items-center gap-1.5 text-[18px] font-medium text-[#404041] hover:text-[#DE5D8F] transition-colors cursor-pointer"
            >
              <span>ฝึกงาน</span>
              <svg
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`transition-transform duration-200 ${isInternshipDropdownOpen ? "rotate-180" : ""}`}
              >
                <path d="M1 1.5L6 6.5L11 1.5" stroke="#636363" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {isInternshipDropdownOpen && (
              <div className="absolute top-10 left-0 w-[180px] bg-white rounded-lg shadow-lg border border-slate-100 py-2 z-50 animate-fade-in">
                <a href="#internships" className="block px-4 py-2 text-sm text-[#404041] hover:bg-[#FCEFF4] hover:text-[#DE5D8F] transition-colors">
                  หาที่ฝึกงาน
                </a>
                <a href="#reviews" className="block px-4 py-2 text-sm text-[#404041] hover:bg-[#FCEFF4] hover:text-[#DE5D8F] transition-colors">
                  รีวิวฝึกงาน
                </a>
              </div>
            )}
          </div>

          <a href="#curriculum" className="text-[18px] font-medium text-[#404041] hover:text-[#DE5D8F] transition-colors">
            หลักสูตร
          </a>
        </nav>

        {/* Right Side: Search and Login Button */}
        <div className="flex items-center gap-4">
          <div className="relative hidden md:flex items-center w-[220px] lg:w-[296px] h-[41px] border border-[#8B8B8C] rounded-full px-4 bg-white focus-within:border-[#DE5D8F] transition-all">
            <input
              type="text"
              placeholder="ค้นหา..."
              className="w-full text-[15px] text-[#DE5D8F] bg-transparent outline-none placeholder-[#AEAEAE]"
            />
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#33363F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="h-[35px] px-4 bg-white border border-[#DE5D8F] hover:bg-[#FCEFF4] text-[#DE5D8F] shadow-[0px_4px_4px_rgba(0,0,0,0.15)] rounded-lg text-[13.7px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>👤</span>
                  <span className="hidden sm:inline">จัดการบัญชี</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="h-[35px] px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-[13.7px] font-bold flex items-center justify-center transition-all cursor-pointer"
                >
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                className="h-[35px] px-4 bg-[#DE5D8F] hover:bg-[#DE5D8F]/90 text-white shadow-[0px_4px_4px_rgba(0,0,0,0.15)] rounded-lg text-[13.7px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>🔑</span>
                <span>เข้าสู่ระบบ</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ==================== HERO & PROFILE ACCORDION ==================== */}
      <section className="bg-gradient-to-b from-[#FCEFF4] via-white to-white py-12 md:py-16 px-6 sm:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#E992B4]/10 blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* Welcome Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#FCEFF4] text-[#DE5D8F] px-4 py-1.5 rounded-full text-sm font-extrabold shadow-sm border border-[#F5CDDC]">
              ✨ ยินดีต้อนรับสู่เว็บไซต์.
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#404041] leading-tight font-serif">
              ศูนย์บริการนิสิต<br />
              <span className="bg-gradient-to-r from-[#DE5D8F] to-[#E992B4] bg-clip-text text-transparent">อักษรศาสตร์ จุฬาฯ</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-2xl">
              เข้าถึงข้อมูลและเครื่องมือสนับสนุนการเรียน ผลการศึกษา (Academic Tracker) บริการยื่นคำร้อง สวัสดิการ คณะกรรมการ และชมรมสาราณียกรๆ ได้
            </p>
          </div>

          {/* Welcome Dashboard Profile Card */}
          <div className="lg:col-span-5 bg-white/70 backdrop-blur-md border border-[#F5CDDC] rounded-3xl p-8 shadow-xl shadow-[#DE5D8F]/5 relative overflow-hidden transition-all hover:shadow-2xl">
            <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-[#E992B4]/15 rounded-full blur-xl"></div>

            <h3 className="text-xl font-extrabold text-[#404041] mb-6 flex items-center gap-2">
              <span>👤</span> ข้อมูลผู้ใช้งาน
            </h3>

            {user ? (
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">อีเมลผู้ใช้งาน (Email)</span>
                  <span className="text-[14px] font-bold text-slate-700 break-all">{user?.email || "-"}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">สิทธิ์ (Role)</span>
                    <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-extrabold tracking-wide uppercase ${role === "admin"
                      ? "bg-red-100 text-red-600 border border-red-200"
                      : "bg-[#FCEFF4] text-[#DE5D8F] border border-[#F5CDDC]"
                      }`}>
                      {role || "-"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 flex flex-col justify-between h-full">
                <p className="text-sm text-slate-500 leading-relaxed">
                  เข้าสู่ระบบเพื่อใช้งานฟังก์ชันจำลองหลักสูตร ติดตามประวัติหน่วยกิตสะสม (Academic Tracker) และบันทึกบทความที่ท่านสนใจ
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                    className="w-full h-11 bg-[#DE5D8F] hover:bg-[#DE5D8F]/90 text-white font-bold rounded-xl flex items-center justify-center transition-all shadow-md shadow-[#DE5D8F]/10 hover:shadow-lg active:scale-[0.98] cursor-pointer text-center"
                  >
                    เข้าสู่ระบบด้วยบัญชีสถาบัน
                  </button>
                  <Link
                    href="/register"
                    className="w-full h-11 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-bold rounded-xl flex items-center justify-center transition-all cursor-pointer"
                  >
                    สมัครสมาชิกใหม่
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ==================== QUICK ACCESS SECTION ==================== */}
      <section id="services" className="py-12 px-6 sm:px-12 bg-white max-w-7xl w-full mx-auto">
        {/* Frame 6427 Styled Section Title */}
        <div className="relative w-full max-w-[639px] h-20 bg-gradient-to-r from-[#F0B4CB] via-[#FCEFF4] to-white md:to-transparent rounded-lg flex items-center pl-8 mb-10 shadow-sm">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-black font-serif flex items-center gap-3">
            <span>⚡</span> Quick Access
          </h2>
        </div>

        {/* Quick Access Menu Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Academic Tracker */}
          <div className="bg-slate-50 hover:bg-[#FCEFF4]/20 border border-slate-200 hover:border-[#F5CDDC] rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 shadow-sm group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center text-2xl font-bold mb-4 group-hover:scale-110 transition-transform">
              📊
            </div>
            <h4 className="text-[18px] font-bold text-slate-800 mb-2">Academic Tracker</h4>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              บันทึก ตรวจสอบประวัติการเรียน วิเคราะห์วิชาบังคับสะสม และเช็คความคืบหน้าหลักสูตร
            </p>
            <Link href="/profile" className="text-sm font-bold text-indigo-500 hover:underline flex items-center gap-1.5 mt-auto">
              เปิดหน้าประวัติ <span>➔</span>
            </Link>
          </div>

          {/* Card 2: Course Registration */}
          <div className="bg-slate-50 hover:bg-[#FCEFF4]/20 border border-slate-200 hover:border-[#F5CDDC] rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 shadow-sm group">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-2xl font-bold mb-4 group-hover:scale-110 transition-transform">
              📝
            </div>
            <h4 className="text-[18px] font-bold text-slate-800 mb-2">ลงทะเบียนเรียน</h4>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              ค้นหารายวิชาอักษรศาสตร์ แนะนำตารางเรียนตามหลักสูตร และเตรียมความพร้อมก่อนลงทะเบียน
            </p>
            <a href="#curriculum" className="text-sm font-bold text-amber-500 hover:underline flex items-center gap-1.5 mt-auto">
              ดูวิชาในหลักสูตร <span>➔</span>
            </a>
          </div>

          {/* Card 3: Student Services */}
          <div className="bg-slate-50 hover:bg-[#FCEFF4]/20 border border-slate-200 hover:border-[#F5CDDC] rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 shadow-sm group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center text-2xl font-bold mb-4 group-hover:scale-110 transition-transform">
              🏫
            </div>
            <h4 className="text-[18px] font-bold text-slate-800 mb-2">บริการสำหรับนิสิต</h4>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              ยื่นคำร้องขอเปิดวิชาเรียน คำร้องพิเศษ ขอใช้ห้องนิสิต และบริการสวัสดิการอื่นๆ ของคณะ
            </p>
            <a href="#services" className="text-sm font-bold text-emerald-500 hover:underline flex items-center gap-1.5 mt-auto">
              ยื่นบริการนิสิต <span>➔</span>
            </a>
          </div>

          {/* Card 4: Help / FAQ */}
          <div className="bg-slate-50 hover:bg-[#FCEFF4]/20 border border-slate-200 hover:border-[#F5CDDC] rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 shadow-sm group">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#DE5D8F] flex items-center justify-center text-2xl font-bold mb-4 group-hover:scale-110 transition-transform">
              ❓
            </div>
            <h4 className="text-[18px] font-bold text-slate-800 mb-2">ช่วยเหลือ & FAQ</h4>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              คำถามที่พบบ่อยเกี่ยวกับการเรียน กิจกรรม และติดต่อร้องเรียนปัญหากับคณะกรรมการ
            </p>
            <Link href="/help" className="text-sm font-bold text-[#DE5D8F] hover:underline flex items-center gap-1.5 mt-auto">
              เปิดคู่มือช่วยเหลือ <span>➔</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== ARTICLES CAROUSEL SECTION ==================== */}
      <section className="py-16 px-6 sm:px-12 bg-slate-50">
        <div className="max-w-7xl w-full mx-auto">
          {/* Header Title with Linear Gradient */}
          <div className="relative w-full h-20 bg-gradient-to-r from-[#F0B4CB] via-[#FCEFF4] to-white md:to-transparent rounded-lg flex items-center justify-between px-8 mb-10 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-black font-serif flex items-center gap-3">
              <span>📚</span> บทความจากชมรมสาราณียกร
            </h2>

            {/* Navigation Arrows */}
            <div className="flex gap-2">
              <button
                onClick={() => scrollCarousel("left")}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-[#DE5D8F] hover:border-[#DE5D8F] transition-all cursor-pointer"
              >
                ◀
              </button>
              <button
                onClick={() => scrollCarousel("right")}
                className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 hover:text-[#DE5D8F] hover:border-[#DE5D8F] transition-all cursor-pointer"
              >
                ▶
              </button>
            </div>
          </div>

          {/* Carousel container */}
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto pb-6 scroll-smooth scrollbar-none snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            {articles.map((art) => {
              const isBookmarked = !!bookmarkedArticles[art.id];
              return (
                <div
                  key={art.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-slate-100 flex-shrink-0 w-[512px] max-w-full h-[356px] relative p-6 snap-start transition-all"
                >
                  {/* Left Side: IMG_8324.jpg mock using beautiful gradients */}
                  <div className="w-[248px] h-[308px] rounded-xl bg-gradient-to-tr shadow-inner absolute top-6 left-6 overflow-hidden flex flex-col justify-between p-4 text-white">
                    <div className={`absolute inset-0 bg-gradient-to-br ${art.imgGradient} opacity-90`}></div>
                    <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                    <span className="relative z-10 text-[10px] font-extrabold uppercase tracking-widest bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full self-start">
                      SarnCU
                    </span>
                    <span className="relative z-10 text-3xl self-center animate-pulse">🐱</span>
                    <span className="relative z-10 text-[11px] font-semibold text-white/80 self-end">
                      &copy; ชมรมสาราณียกร
                    </span>
                  </div>

                  {/* Right Side: Text details */}
                  <div className="absolute left-[304px] top-[107px] w-[182px] h-[153px] flex flex-col justify-between">
                    <div>
                      {/* Article Title */}
                      <h4 className="text-[20px] font-bold text-slate-800 leading-snug line-clamp-3 hover:text-[#DE5D8F] transition-colors cursor-pointer">
                        {art.title}
                      </h4>
                    </div>

                    {/* Author & Date Box */}
                    <div className="space-y-1">
                      {/* Author */}
                      <div className="text-[13px] font-bold text-slate-500 flex items-center gap-1.5">
                        <span className="text-slate-400 text-xs">✍️</span>
                        <span className="truncate">{art.author}</span>
                      </div>
                      {/* Date */}
                      <div className="text-[12px] font-bold text-slate-400 flex items-center gap-1.5">
                        <span className="text-slate-300 text-xs">📅</span>
                        <span>เผยแพร่ {art.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Top Right Controls: Information Banner & Yellow Bookmark */}
                  <div className="absolute right-6 top-6 flex items-center gap-2">
                    {/* Information Pill */}
                    <div className="bg-[#FCEFF4] text-[#DE5D8F] border border-[#F5CDDC] px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">
                      {art.infoText}
                    </div>

                    {/* Yellow Bookmark */}
                    <button
                      onClick={() => toggleBookmark(art.id)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all cursor-pointer ${isBookmarked
                        ? "bg-[#F8C135] text-white shadow-md shadow-[#F8C135]/25 hover:scale-105"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600"
                        }`}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Under-carousel button */}
          <div className="flex justify-center mt-10">
            <button className="w-[300px] h-[55px] bg-[#E992B4] hover:bg-[#DE5D8F] text-white text-lg font-bold rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center">
              อ่านเพิ่มเติมทั้งหมด
            </button>
          </div>
        </div>
      </section>

      {/* ==================== CLUBS SECTION ==================== */}
      <section className="py-16 px-6 sm:px-12 bg-white max-w-7xl w-full mx-auto">
        {/* Title Block with Gradient */}
        <div className="relative w-full h-20 bg-gradient-to-r from-[#F0B4CB] via-[#FCEFF4] to-white md:to-transparent rounded-lg flex items-center pl-8 mb-10 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black font-serif flex items-center gap-3">
            <span>🏛️</span> ชมรมในคณะอักษรศาสตร์
          </h2>
        </div>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {clubs.map((club) => (
            <div
              key={club.id}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex gap-6 hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-4xl shadow-sm flex-shrink-0">
                {club.emoji}
              </div>
              <div className="flex flex-col justify-between flex-grow">
                <div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">{club.name}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">
                    {club.description}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200/60 pt-3 text-xs text-slate-400">
                  <span className="font-semibold text-[#DE5D8F]">สมาชิก {club.members} คน</span>
                  <button className="text-xs font-bold text-[#DE5D8F] hover:text-[#DE5D8F]/80 flex items-center gap-1 cursor-pointer">
                    เข้าสู่บอร์ดชมรม <span>➔</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Under-clubs button */}
        <div className="flex justify-center">
          <button className="w-[300px] h-[55px] bg-[#E992B4] hover:bg-[#DE5D8F] text-white text-lg font-bold rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center">
            ดูชมรมทั้งหมด
          </button>
        </div>
      </section>

      {/* ==================== EXPANDED SITEMAP FOOTER ==================== */}
      <footer className="w-[1280px] max-w-full mx-auto relative rounded-t-2xl shadow-[0_-4px_9.5px_#E992B4] overflow-hidden bg-white mt-12 border-t border-slate-100">
        {/* Pink Top Accent bar */}
        <div className="w-full h-5 bg-[#E992B4]"></div>

        <div className="px-6 sm:px-12 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">

            {/* Left Column: Logo & Address */}
            <div className="lg:col-span-4 flex flex-col">
              {/* Logo */}
              <div className="w-auto h-[56px] flex items-center justify-start gap-2 text-[#DE5D8F] mb-4">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="40" height="40" rx="10" fill="url(#footer-redesign-logo-grad)" />
                  <path d="M20 9L29 27H11L20 9Z" fill="white" opacity="0.9" />
                  <circle cx="20" cy="22" r="5" fill="#DE5D8F" />
                  <defs>
                    <linearGradient id="footer-redesign-logo-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#DE5D8F" />
                      <stop offset="1" stopColor="#E992B4" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="text-[18px] font-extrabold tracking-wide text-[#DE5D8F] font-serif">คณะกรรมการนิสิตอักษรศาสตร์</span>
              </div>

              {/* Address */}
              <p className="text-[15px] text-[#404041] leading-relaxed font-medium mb-6">
                ห้อง 148 ชั้น M1 อาคารมหาจักรีสิรินธร<br />
                254 ถนนพญาไท แขวงวังใหม่<br />
                เขตปทุมวัน กรุงเทพมหานคร 10330
              </p>

              {/* Social outlets */}
              <div className="flex flex-wrap gap-3">
                <a
                  href="mailto:artgoz@gmail.com"
                  className="w-10 h-10 rounded-full bg-[#FCEFF4] hover:bg-[#F5CDDC] text-[#DE5D8F] flex items-center justify-center transition-all shadow-sm"
                  title="Email"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-[#FCEFF4] hover:bg-[#F5CDDC] text-[#DE5D8F] flex items-center justify-center transition-all shadow-sm"
                  title="Facebook"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com/arts_goz"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-[#FCEFF4] hover:bg-[#F5CDDC] text-[#DE5D8F] flex items-center justify-center transition-all shadow-sm"
                  title="Instagram"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="https://line.me"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-[#FCEFF4] hover:bg-[#F5CDDC] text-[#DE5D8F] flex items-center justify-center transition-all shadow-sm"
                  title="Line"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Sitemap columns */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">

              {/* Column 1 */}
              <div className="space-y-3.5">
                <h5 className="text-[17px] font-bold text-[#DE5D8F] tracking-wide">เกี่ยวกับ ก.อศ.</h5>
                <ul className="space-y-2 text-sm">
                  <li><a href="#about" className="text-slate-600 hover:text-[#DE5D8F] underline transition-colors">เกี่ยวกับ ก.อศ.</a></li>
                  <li><a href="#members" className="text-slate-600 hover:text-[#DE5D8F] underline transition-colors">คณะกรรมการและสมาชิก</a></li>
                </ul>
              </div>

              {/* Column 2 */}
              <div className="space-y-3.5">
                <h5 className="text-[17px] font-bold text-[#DE5D8F] tracking-wide">บริการนิสิต</h5>
                <ul className="space-y-2 text-sm">
                  <li><a href="#services" className="text-slate-600 hover:text-[#DE5D8F] underline transition-colors">บริการสำหรับนิสิต</a></li>
                  <li><a href="#affairs" className="text-slate-600 hover:text-[#DE5D8F] underline transition-colors">งานกิจการนิสิต</a></li>
                  <li><a href="#mental" className="text-slate-600 hover:text-[#DE5D8F] underline transition-colors">สุขภาพจิต</a></li>
                </ul>
              </div>

              {/* Column 3 */}
              <div className="space-y-3.5">
                <h5 className="text-[17px] font-bold text-[#DE5D8F] tracking-wide">ฝ่ายประชาสัมพันธ์</h5>
                <ul className="space-y-2 text-sm">
                  <li><a href="#pr-schedule" className="text-slate-600 hover:text-[#DE5D8F] underline transition-colors">ตารางงานประชาสัมพันธ์</a></li>
                  <li><a href="#pr-contact" className="text-slate-600 hover:text-[#DE5D8F] underline transition-colors">ติดต่องานประชาสัมพันธ์ ก.อศ.</a></li>
                </ul>
              </div>

              {/* Column 4 */}
              <div className="space-y-3.5">
                <h5 className="text-[17px] font-bold text-[#DE5D8F] tracking-wide">ช่วยเหลือ/ร้องเรียน</h5>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/help" className="text-slate-600 hover:text-[#DE5D8F] underline transition-colors">ช่วยเหลือ/FAQ</Link></li>
                  <li><a href="#complain" className="text-slate-600 hover:text-[#DE5D8F] underline transition-colors">ร้องเรียนปัญหา</a></li>
                </ul>
              </div>

              {/* Column 5 */}
              <div className="space-y-3.5">
                <h5 className="text-[17px] font-bold text-[#DE5D8F] tracking-wide">กิจกรรม</h5>
                <ul className="space-y-2 text-sm">
                  <li><a href="#news" className="text-slate-600 hover:text-[#DE5D8F] underline transition-colors">ข่าวสาร/กิจกรรม</a></li>
                  <li><a href="#sarn-articles" className="text-slate-600 hover:text-[#DE5D8F] underline transition-colors">บทความสาราณียกร</a></li>
                  <li><a href="#clubs" className="text-slate-600 hover:text-[#DE5D8F] underline transition-colors">ชมรมในคณะอักษรศาสตร์</a></li>
                </ul>
              </div>

              {/* Column 6 */}
              <div className="space-y-3.5">
                <h5 className="text-[17px] font-bold text-[#DE5D8F] tracking-wide">เกี่ยวกับเว็บไซต์</h5>
                <ul className="space-y-2 text-sm">
                  <li><a href="#privacy" className="text-slate-600 hover:text-[#DE5D8F] underline transition-colors">นโยบายความเป็นส่วนตัว</a></li>
                  <li><a href="#issues" className="text-slate-600 hover:text-[#DE5D8F] underline transition-colors">แจ้งปัญหาใช้งานเว็บไซต์</a></li>
                </ul>
              </div>
            </div>

          </div>
        </div>

        {/* copyright and primary web redirect */}
        <div className="bg-slate-50 border-t border-slate-100 py-5 px-6 sm:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium">
          <span>&copy; {new Date().getFullYear()} คณะกรรมการนิสิตอักษรศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย (ก.อศ.). All Rights Reserved.</span>
          <a href="https://www.arts.chula.ac.th" target="_blank" rel="noreferrer" className="text-[#DE5D8F] hover:underline font-semibold">
            เข้าสู่เว็บไซต์หลักคณะอักษรศาสตร์ จุฬาฯ 🌐
          </a>
        </div>
      </footer>

      {/* Login Dropdown Overlay Container */}
      {isLoginDropdownOpen && !user && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "53px 95px 266px 82px",
            gap: "149px",
            position: "absolute",
            width: "613px",
            height: "585px",
            background: "#F7F8F9",
            boxShadow: "4px 8px 10.2px rgba(0, 0, 0, 0.25)",
            borderRadius: "16px",
            zIndex: 50,
            boxSizing: "border-box",
          }}
          className="w-[90vw] md:w-[613px] top-[111px] left-1/2 -translate-x-1/2 xl:left-[628px] xl:translate-x-0"
        >
          {/* Close button */}
          <button
            onClick={() => setIsLoginDropdownOpen(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer transition-colors"
          >
            ✕
          </button>

          {/* Title */}
          <div className="flex flex-col items-center select-none text-center">
            <h2 className="text-[28px] font-extrabold text-[#404041] font-serif leading-none">เข้าสู่ระบบ</h2>
            <p className="text-[12px] font-semibold text-[#8B8B8C] mt-2">คณะกรรมการนิสิตอักษรศาสตร์</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            {error && (
              <div className="text-xs font-bold text-red-500 bg-red-50 border border-red-100 rounded-lg p-2 text-center mb-1">
                {error}
              </div>
            )}
            <div className="w-full">
              <input
                type="email"
                placeholder="อีเมลผู้ใช้งาน"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-11 bg-white border border-[#DE5D8F]/20 focus:border-[#DE5D8F] focus:ring-1 focus:ring-[#DE5D8F] rounded-xl px-4 text-[14px] text-[#404041] outline-none transition-all placeholder-slate-400"
              />
            </div>
            <div className="w-full">
              <input
                type="password"
                placeholder="รหัสผ่าน"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-11 bg-white border border-[#DE5D8F]/20 focus:border-[#DE5D8F] focus:ring-1 focus:ring-[#DE5D8F] rounded-xl px-4 text-[14px] text-[#404041] outline-none transition-all placeholder-slate-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#DE5D8F] hover:bg-[#DE5D8F]/90 text-white font-bold rounded-xl flex items-center justify-center transition-all shadow-md shadow-[#DE5D8F]/10 hover:shadow-lg active:scale-[0.98] cursor-pointer mt-2"
            >
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>
        </div>
      )}

      {/* Profile Dropdown Overlay Container */}
      {isProfileDropdownOpen && user && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            padding: "48px 48px",
            gap: "28px",
            position: "absolute",
            width: "613px",
            height: "585px",
            background: "#F7F8F9",
            boxShadow: "4px 8px 10.2px rgba(0, 0, 0, 0.25)",
            borderRadius: "16px",
            zIndex: 50,
            boxSizing: "border-box",
          }}
          className="w-[90vw] md:w-[613px] top-[111px] left-1/2 -translate-x-1/2 xl:left-[628px] xl:translate-x-0 text-left font-sans"
        >
          {/* Close button */}
          <button
            onClick={() => setIsProfileDropdownOpen(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer transition-colors"
          >
            ✕
          </button>

          {/* User Details Header */}
          <div className="flex items-center gap-6 w-full">
            {/* Avatar Circle */}
            <div className="w-[110px] h-[110px] rounded-full border-2 border-slate-300 bg-white flex items-center justify-center text-slate-400 font-extrabold text-4xl shadow-inner select-none">
              {avatarChar}
            </div>

            {/* Detail info */}
            <div className="flex flex-col gap-1 text-[15px] text-[#404041] font-bold">
              <div className="text-[17px] font-extrabold text-slate-800">{emailPrefix}</div>
              <div className="text-slate-400 font-semibold text-xs mb-1">นิสิตอักษรศาสตร์</div>
              <div>รหัสนิสิต 66xxxxxx</div>
              <div>เอกสาขาวิชา: ศิลปการละคร</div>
              <div>โทสาขาวิชา: -</div>
            </div>
          </div>

          {/* Menu Card */}
          <div className="w-full bg-white rounded-2xl border border-slate-200/60 p-6 flex flex-col gap-4 shadow-sm">
            <a
              href="#services"
              onClick={() => setIsProfileDropdownOpen(false)}
              className="flex items-center gap-3 text-[17px] font-extrabold text-slate-700 hover:text-[#DE5D8F] transition-all"
            >
              <span className="text-xl">🔖</span> ที่บันทึกไว้
            </a>
            <div className="h-[1px] bg-slate-100 w-full" />
            <Link
              href="/profile"
              onClick={() => setIsProfileDropdownOpen(false)}
              className="flex items-center gap-3 text-[17px] font-extrabold text-slate-700 hover:text-[#DE5D8F] transition-all"
            >
              <span className="text-xl">🕒</span> ประวัติการวางแผนหน่วยกิต
            </Link>
            <div className="h-[1px] bg-slate-100 w-full" />
            <Link
              href="/profile"
              onClick={() => setIsProfileDropdownOpen(false)}
              className="flex items-center gap-3 text-[17px] font-extrabold text-slate-700 hover:text-[#DE5D8F] transition-all"
            >
              <span className="text-xl">👤</span> จัดการบัญชี
            </Link>
            {role === "admin" && (
              <>
                <div className="h-[1px] bg-slate-100 w-full" />
                <Link
                  href="/dashboard"
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="flex items-center gap-3 text-[17px] font-extrabold text-slate-700 hover:text-[#DE5D8F] transition-all"
                >
                  <span className="text-xl">📊</span> แดชบอร์ด (Dashboard)
                </Link>
              </>
            )}
          </div>

          {/* Logout footer button */}
          <div className="w-full flex justify-end mt-auto">
            <div className="bg-white rounded-xl shadow-md border border-slate-100 hover:shadow-lg transition-all">
              <button
                onClick={() => {
                  setIsProfileDropdownOpen(false);
                  handleLogout();
                }}
                className="h-11 px-6 text-slate-600 hover:text-red-600 font-bold flex items-center justify-center transition-all cursor-pointer text-sm"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return <HomeContent />;
}
