"use client";

// app/help/page.tsx
// ============================================================
// หน้า Help (ช่วยเหลือ) — แสดง Linktree preview และคำถามที่พบบ่อย (FAQ)
// รองรับการค้นหา การคัดกรองตามหมวดหมู่ การเปิดคำถาม และฟอร์มส่งคำถามเพิ่มเติม
// ============================================================

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/presentation/context/AuthProvider";
import { logoutUseCase, fetchFaqsUseCase, submitContactUseCase } from "@/di";
import { useRouter } from "next/navigation";

// Define TypeScript interfaces for FAQ
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "general" | "registration" | "academic" | "website";
}

export default function HelpPage() {
  const { user, role } = useAuth();
  const router = useRouter();

  // Component states
  const [faqSearch, setFaqSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [isInternshipDropdownOpen, setIsInternshipDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalName, setModalName] = useState("");
  const [modalEmail, setModalEmail] = useState(user?.email || "");
  const [modalCategory, setModalCategory] = useState("ทั่วไป");
  const [modalQuestion, setModalQuestion] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [modalSubmitError, setModalSubmitError] = useState<string | null>(null);

  const [faqList, setFaqList] = useState<FAQItem[]>([]);
  const [faqLoading, setFaqLoading] = useState(false);
  const [faqError, setFaqError] = useState<string | null>(null);

  // Fetch FAQs from API on mount
  useEffect(() => {
    async function loadFAQs() {
      setFaqLoading(true);
      setFaqError(null);
      try {
        const data = await fetchFaqsUseCase.execute();
        if (data && data.length > 0) {
          // Map backend FAQ to frontend FAQItem structure
          const mappedFaqs = data.map((item: any) => ({
            id: item.id || Math.random().toString(),
            question: item.question || "",
            answer: item.answer || "",
            category: (item.tags && item.tags.length > 0 ? item.tags[0] : "general") as any,
          }));
          setFaqList(mappedFaqs);
        } else {
          // Fallback to static faqData if database has no records
          setFaqList(faqData);
        }
      } catch (err: any) {
        console.error("Failed to fetch FAQs:", err);
        setFaqError("ไม่สามารถดึงข้อมูล FAQ ล่าสุดจากเซิร์ฟเวอร์ได้ (กำลังแสดงข้อมูลสำรอง)");
        // Fallback to static faqData
        setFaqList(faqData);
      } finally {
        setFaqLoading(false);
      }
    }
    loadFAQs();
  }, []);

  // Logout handler
  async function handleLogout() {
    try {
      await logoutUseCase.execute();
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  // FAQ Items Data (in Thai, specific to CU Arts students / ก.อศ.)
  const faqData: FAQItem[] = [
    {
      id: "faq-1",
      question: "ก.อศ. ย่อมาจากอะไร และมีหน้าที่หลักอย่างไรบ้าง?",
      answer: "ก.อศ. ย่อมาจาก 'คณะกรรมการนิสิตอักษรศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย' มีหน้าที่ดูแลสวัสดิการนิสิต จัดกิจกรรมเพื่อส่งเสริมการเรียนรู้และการพัฒนาศักยภาพ ตลอดจนเป็นตัวแทนในการประสานงานระหว่างนิสิตและคณะเพื่อนำเสนอความต้องการและแก้ไขปัญหาต่างๆ",
      category: "general"
    },
    {
      id: "faq-2",
      question: "หากต้องการติดต่อ ก.อศ. นอกเหนือจากช่องทางออนไลน์ สามารถติดต่อได้ที่ไหน?",
      answer: "นิสิตสามารถเข้าพบและพูดคุยกับคณะกรรมการได้โดยตรงที่ ห้อง 148 ชั้น M1 อาคารมหาจักรีสิรินธร คณะอักษรศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย ในวันและเวลาราชการ",
      category: "general"
    },
    {
      id: "faq-3",
      question: "ระบบลงทะเบียนเรียน Reg Chula ประสบปัญหาระหว่างวันลงทะเบียนเรียนล่วงหน้า ต้องทำอย่างไร?",
      answer: "1. ตรวจสอบสถานะการเชื่อมต่อเครือข่ายของตนเอง แนะนำให้ใช้เครือข่ายที่มีความเสถียร\n2. ติดตามการอัปเดตและประกาศด่วนจากสำนักงานทะเบียนผ่านเพจ Reg Chula หรือฝ่ายวิชาการคณะ\n3. หากมีปัญหาในรายวิชาอักษรศาสตร์โดยเฉพาะ สามารถกรอกคำร้องผ่านระบบบริการนิสิตของคณะเพื่อความรวดเร็วในการประสานงาน",
      category: "registration"
    },
    {
      id: "faq-4",
      question: "กรณีต้องการขอเพิ่ม-ลดรายวิชานอกกำหนดการทั่วไป (การลงทะเบียนล่าช้า) ต้องยื่นคำร้องอย่างไร?",
      answer: "นิสิตต้องดาวน์โหลดคำร้องพิเศษ (จท42) จากระบบของสำนักงานทะเบียนฯ นำเสนอต่ออาจารย์ผู้สอนประจำรายวิชาเพื่อลงนามอนุญาต จากนั้นเสนอต่ออาจารย์ที่ปรึกษาลงนามรับทราบ และส่งเรื่องไปยังฝ่ายบริการวิชาการของคณะอักษรศาสตร์",
      category: "registration"
    },
    {
      id: "faq-5",
      question: "Academic Tracker คืออะไร และจะเริ่มใช้งานอย่างไร?",
      answer: "Academic Tracker เป็นระบบจำลองและติดตามประวัติการศึกษาของนิสิตอักษรศาสตร์ เพื่อคำนวณและประมวลผลการเก็บหน่วยกิตวิชาบังคับ วิชาเลือก และวิชาโท ตามแผนการเรียน นิสิตสามารถเข้าใช้งานระบบโดยเข้าสู่ระบบด้วยบัญชีสถาบันผ่านเว็บไซต์บริการนิสิต",
      category: "academic"
    },
    {
      id: "faq-6",
      question: "หากข้อมูลผลการเรียน (หน่วยกิต หรือเกรด) ในระบบ Academic Tracker ไม่ถูกต้อง ต้องแก้ไขอย่างไร?",
      answer: "เนื่องจาก Academic Tracker อ้างอิงเกรดอย่างเป็นทางการจากฐานข้อมูลสำนักงานทะเบียนฯ หากเกรดพึ่งออกอาจต้องใช้เวลาปรับปรุงฐานข้อมูล 1-2 วันทำการ หากพ้นกำหนดแล้วข้อมูลยังไม่ตรง สามารถยื่นรายงานบั๊กหรือสอบถามผ่านปุ่ม 'ส่งคำถามเพิ่มเติม' เพื่อส่งเรื่องให้ฝ่ายพัฒนาระบบตรวจสอบ",
      category: "academic"
    },
    {
      id: "faq-7",
      question: "หากพบปัญหาทางเทคนิค เช่น เข้าสู่ระบบไม่ได้ หรือฟังก์ชันบนเว็บไซต์แสดงผลผิดปกติ?",
      answer: "แนะนำให้ลองล้างแคชบราวเซอร์ (Clear Cache) หรือเปลี่ยนบราวเซอร์ในการเข้าใช้งาน หากยังพบล็อคอินล้มเหลวกรุณาตรวจสอบว่าสถานะอีเมล Firebase ของท่านยืนยันเรียบร้อยแล้ว หรือแจ้งปัญหาผ่านปุ่ม 'ส่งคำถามเพิ่มเติม' ด้านล่างได้ทันที",
      category: "website"
    }
  ];

  // Filter and Search Logic
  const filteredFaqs = useMemo(() => {
    return faqList.filter((item) => {
      const matchesCategory = activeCategory === "all" || item.category === activeCategory;
      const matchesSearch =
        item.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
        item.answer.toLowerCase().includes(faqSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [faqSearch, activeCategory, faqList]);

  // Toggle FAQ accordion item
  const toggleFaq = (id: string) => {
    if (expandedFaq === id) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(id);
    }
  };

  // Handle Question Submit Modal
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalQuestion.trim() || !modalName.trim() || !modalEmail.trim()) return;

    setModalSubmitError(null);
    setIsSubmitted(false);

    try {
      await submitContactUseCase.execute(
        modalName,
        null, // studentId is optional
        modalEmail,
        modalCategory,
        modalQuestion
      );

      setIsSubmitted(true);
      setTimeout(() => {
        // Reset form
        setModalName("");
        setModalQuestion("");
        setIsSubmitted(false);
        setIsModalOpen(false);
      }, 2000);
    } catch (err: any) {
      console.error("Failed to submit contact request:", err);
      setModalSubmitError(err.message || "เกิดข้อผิดพลาดในการส่งคำถาม กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <div className="bg-white text-[#404041] font-sans min-h-screen flex flex-col antialiased">
      {/* ==================== NAVBAR ==================== */}
      <header className="sticky top-0 left-0 w-full h-[81px] bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.15)] z-40 px-6 sm:px-12 flex items-center justify-between">
        {/* Left Side: Logo ab-nav 2 (Custom stylized SVG Logo) */}
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
          <Link href="/home" className="text-[18px] font-medium text-[#404041] hover:text-[#DE5D8F] transition-colors">
            หน้าหลัก
          </Link>
          <a href="#services" className="text-[18px] font-medium text-[#404041] hover:text-[#DE5D8F] transition-colors">
            บริการนิสิต
          </a>
          <Link href="/help" className="text-[18px] font-bold text-[#DE5D8F] hover:text-[#DE5D8F]/80 transition-colors border-b-2 border-[#DE5D8F] pb-1">
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
          {/* Search bar inside Navbar */}
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

          {/* Login Button */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="h-[35px] px-4 bg-white border border-[#DE5D8F] hover:bg-[#FCEFF4] text-[#DE5D8F] shadow-[0px_4px_4px_rgba(0,0,0,0.15)] rounded-lg text-[13.7px] font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <span>👤</span>
                <span className="hidden sm:inline">โปรไฟล์</span>
              </Link>
              <button
                onClick={handleLogout}
                className="h-[35px] px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-[13.7px] font-bold flex items-center justify-center transition-all cursor-pointer"
              >
                ออกจากระบบ
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="w-[114px] h-[35px] bg-white border border-slate-200 hover:border-[#DE5D8F] text-[#404041] hover:text-[#DE5D8F] shadow-[0px_4px_4px_rgba(0,0,0,0.15)] rounded-lg text-[13.7px] font-bold flex items-center justify-center transition-all"
            >
              เข้าสู่ระบบ
            </Link>
          )}
        </div>
      </header>

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 sm:px-12 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* ==================== LEFT COLUMN: ช่วยเหลือ & Linktree ==================== */}
        <section className="lg:col-span-5 flex flex-col items-center lg:items-start">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-[#404041] mb-8 font-serif self-start lg:self-auto flex items-center gap-2">
            ช่วยเหลือ
          </h2>

          {/* Mobile phone frame container */}
          <div className="w-[320px] sm:w-[350px] aspect-[9/18] rounded-[42px] border-[10px] border-slate-800 bg-slate-900 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] relative overflow-hidden flex flex-col p-1">
            
            {/* Screen Header Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[120px] h-[22px] bg-slate-800 rounded-full z-20 flex items-center justify-center">
              <div className="w-[45px] h-[4px] bg-slate-900 rounded-full"></div>
              <div className="w-[8px] h-[8px] bg-slate-900 rounded-full ml-3"></div>
            </div>

            {/* Screen Inner Viewport */}
            <div className="flex-grow rounded-[32px] overflow-y-auto overflow-x-hidden relative flex flex-col text-white pt-10 pb-4 px-4 bg-gradient-to-b from-[#1e1b4b] via-[#2d2254] to-[#E992B4]">
              {/* Decorative blobs for rich aesthetics */}
              <div className="absolute top-0 right-[-50px] w-[180px] h-[180px] rounded-full bg-[#E992B4]/20 blur-2xl pointer-events-none"></div>
              <div className="absolute bottom-[80px] left-[-60px] w-[200px] h-[200px] rounded-full bg-[#DE5D8F]/30 blur-3xl pointer-events-none"></div>
              
              {/* Header inside Mobile screen */}
              <div className="flex flex-col items-center text-center mt-4 mb-6 z-10">
                {/* Arts CU circular logo */}
                <div className="w-[72px] h-[72px] rounded-full bg-white p-1 flex items-center justify-center shadow-lg border-2 border-[#E992B4] hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#DE5D8F] to-[#FCEFF4] flex items-center justify-center font-bold text-white text-xl">
                    ก.อศ.
                  </div>
                </div>
                
                {/* Username */}
                <span className="text-[17px] font-bold mt-3 text-white leading-none">@artsgoz</span>
                
                {/* Short Bio */}
                <p className="text-[11px] text-slate-200 mt-2 px-2 leading-relaxed">
                  คณะกรรมการนิสิตอักษรศาสตร์ (ก.อศ.) จุฬาฯ<br />
                  <span className="text-[#FCEFF4]/85">The Arts Student Committee, CU</span>
                </p>
              </div>

              {/* Linktree buttons list inside Mobile Screen */}
              <div className="flex flex-col gap-3.5 z-10">
                {/* Link 1 */}
                <a
                  href="https://linktr.ee/artsgoz"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white/95 hover:bg-white text-slate-800 text-[12.5px] font-bold py-3.5 px-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex items-center justify-between group transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span className="flex-grow pr-2 leading-snug">
                    รายละเอียดการสมัครคณะกรรมการ นิสิตอักษรศาสตร์ ปีการศึกษา 2569
                  </span>
                  <div className="flex items-center gap-1.5 flex-shrink-0 text-slate-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="12" cy="5" r="1" />
                      <circle cx="12" cy="19" r="1" />
                    </svg>
                  </div>
                </a>

                {/* Link 2 */}
                <a
                  href="https://linktr.ee/artsgoz"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white/95 hover:bg-white text-slate-800 text-[12.5px] font-bold py-3.5 px-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex items-center justify-between group transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#FCEFF4] text-[#DE5D8F] flex items-center justify-center flex-shrink-0">
                      📝
                    </div>
                    <span className="leading-snug">
                      แบบสอบถามความต้องการในการจัดกิจกรรมในคณะอักษรศาสตร์
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0 text-slate-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="12" cy="5" r="1" />
                      <circle cx="12" cy="19" r="1" />
                    </svg>
                  </div>
                </a>

                {/* Link 3 */}
                <a
                  href="https://line.me/ti/g2/..."
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white/95 hover:bg-white text-slate-800 text-[12.5px] font-bold py-3.5 px-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex items-center justify-between group transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                      💬
                    </div>
                    <span className="leading-snug">Openchat for Arts CU 93</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0 text-slate-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="12" cy="5" r="1" />
                      <circle cx="12" cy="19" r="1" />
                    </svg>
                  </div>
                </a>

                {/* Link 4 */}
                <a
                  href="https://linktr.ee/artsgoz"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white/95 hover:bg-white text-slate-800 text-[12.5px] font-bold py-3.5 px-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] flex items-center justify-between group transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#FCEFF4] text-[#DE5D8F] flex items-center justify-center flex-shrink-0">
                      📢
                    </div>
                    <span className="leading-snug">
                      ฟอร์มกรอกเพื่อขอประชาสัมพันธ์ในช่องทางของ ก.อศ.
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0 text-slate-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="12" cy="5" r="1" />
                      <circle cx="12" cy="19" r="1" />
                    </svg>
                  </div>
                </a>
              </div>

              {/* Linktree simulation pill footer */}
              <div className="mt-auto pt-6 flex justify-center z-10">
                <div className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-2 border border-white/10 transition-colors">
                  <span className="text-[10px] font-semibold tracking-wider text-white">linktr.ee/artsgoz</span>
                  <button className="text-white/60 hover:text-white text-xs font-bold leading-none cursor-pointer">×</button>
                </div>
              </div>
            </div>
          </div>

          {/* Button under Mobile Device */}
          <a
            href="https://linktr.ee/artsgoz"
            target="_blank"
            rel="noreferrer"
            className="mt-6 text-sm font-bold text-[#DE5D8F] hover:text-[#DE5D8F]/85 hover:underline flex items-center gap-1.5 transition-all"
          >
            <span>🔗</span> เข้าร่วมกับ artsgoz บน Linktree
          </a>
        </section>

        {/* ==================== RIGHT COLUMN: FAQ คำถามที่พบบ่อย ==================== */}
        <section className="lg:col-span-7 flex flex-col">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#404041] mb-6 font-serif">
            คำถามที่พบบ่อย (FAQ)
          </h2>

          {/* Search bar above FAQ */}
          <div className="relative w-full max-w-lg h-[46px] border-2 border-[#8B8B8C] rounded-full px-5 bg-white flex items-center focus-within:border-[#DE5D8F] transition-all mb-8 shadow-sm">
            <input
              type="text"
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              placeholder="ค้นหาคำถามหรือคำตอบที่ต้องการ..."
              className="w-full text-base text-[#404041] bg-transparent outline-none placeholder-[#99999A] pr-3"
            />
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8B8B8C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2.5 mb-8">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeCategory === "all"
                  ? "bg-[#DE5D8F] text-white shadow-md shadow-[#DE5D8F]/20 scale-105"
                  : "bg-[#FCEFF4] text-[#DE5D8F] hover:bg-[#F5CDDC]"
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => setActiveCategory("general")}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeCategory === "general"
                  ? "bg-[#DE5D8F] text-white shadow-md shadow-[#DE5D8F]/20 scale-105"
                  : "bg-[#FCEFF4] text-[#DE5D8F] hover:bg-[#F5CDDC]"
              }`}
            >
              ทั่วไป
            </button>
            <button
              onClick={() => setActiveCategory("registration")}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeCategory === "registration"
                  ? "bg-[#DE5D8F] text-white shadow-md shadow-[#DE5D8F]/20 scale-105"
                  : "bg-[#FCEFF4] text-[#DE5D8F] hover:bg-[#F5CDDC]"
              }`}
            >
              ลงทะเบียนเรียน
            </button>
            <button
              onClick={() => setActiveCategory("academic")}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeCategory === "academic"
                  ? "bg-[#DE5D8F] text-white shadow-md shadow-[#DE5D8F]/20 scale-105"
                  : "bg-[#FCEFF4] text-[#DE5D8F] hover:bg-[#F5CDDC]"
              }`}
            >
              Academic Tracker
            </button>
            <button
              onClick={() => setActiveCategory("website")}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeCategory === "website"
                  ? "bg-[#DE5D8F] text-white shadow-md shadow-[#DE5D8F]/20 scale-105"
                  : "bg-[#FCEFF4] text-[#DE5D8F] hover:bg-[#F5CDDC]"
              }`}
            >
              เกี่ยวกับเว็บไซต์
            </button>
          </div>

          {/* Accordion list */}
          <div className="space-y-4 mb-10 flex-grow">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isExpanded = expandedFaq === faq.id;
                return (
                  <div key={faq.id} className="border-b border-slate-200 pb-4 transition-all">
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full text-left flex justify-between items-start gap-4 py-2 hover:text-[#DE5D8F] transition-colors focus:outline-none cursor-pointer group"
                    >
                      <h3 className="text-[19px] font-bold text-[#404041] group-hover:text-[#DE5D8F] transition-colors leading-snug">
                        {faq.question}
                      </h3>
                      <span className="flex-shrink-0 mt-1">
                        <svg
                          width="16"
                          height="10"
                          viewBox="0 0 16 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className={`transform transition-transform duration-300 stroke-[#8B8B8C] group-hover:stroke-[#DE5D8F] ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        >
                          <path d="M1.5 2L8 8.5L14.5 2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </button>

                    {/* Accordion Answer Content (Smooth Collapsible Effect) */}
                    <div
                      className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded ? "grid-rows-[1fr] opacity-100 mt-2.5" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="text-[16px] text-slate-600 leading-relaxed whitespace-pre-line pl-1 bg-[#FCEFF4]/30 rounded-lg p-3 border-l-2 border-[#E992B4]">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-slate-400">
                <span className="text-4xl block mb-3">🔍</span>
                ไม่พบคำถามที่ตรงกับข้อมูลการค้นหาของท่าน
              </div>
            )}
          </div>

          {/* Submit question button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="self-center lg:self-start h-12 px-8 bg-gradient-to-r from-[#DE5D8F] to-[#E992B4] hover:from-[#DE5D8F]/95 hover:to-[#E992B4]/95 text-white font-bold rounded-full shadow-lg shadow-[#DE5D8F]/25 hover:shadow-xl hover:shadow-[#DE5D8F]/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            ส่งคำถามเพิ่มเติม
          </button>
        </section>
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="w-[1280px] max-w-full mx-auto relative rounded-t-2xl shadow-[0_-4px_9.5px_#E992B4] overflow-hidden bg-white mt-12">
        {/* Pink Top Accent bar */}
        <div className="w-full h-5 bg-[#E992B4]"></div>

        <div className="px-6 sm:px-12 py-10 flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Left Column: Logo & Address */}
          <div className="flex flex-col max-w-md">
            {/* Logo */}
            <div className="w-auto h-[56px] flex items-center justify-start gap-2 text-[#DE5D8F] mb-4">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="10" fill="url(#footer-logo-grad)" />
                <path d="M20 9L29 27H11L20 9Z" fill="white" opacity="0.9" />
                <circle cx="20" cy="22" r="5" fill="#DE5D8F" />
                <defs>
                  <linearGradient id="footer-logo-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#DE5D8F" />
                    <stop offset="1" stopColor="#E992B4" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-[18px] font-extrabold tracking-wide text-[#DE5D8F] font-serif">คณะกรรมการนิสิตอักษรศาสตร์</span>
            </div>

            {/* Address */}
            <p className="text-[15px] text-[#404041] leading-relaxed font-medium">
              ห้อง 148 ชั้น M1 อาคารมหาจักรีสิรินธร<br />
              254 ถนนพญาไท แขวงวังใหม่<br />
              เขตปทุมวัน กรุงเทพมหานคร 10330
            </p>
          </div>

          {/* Right Column: Contact info */}
          <div className="flex flex-col gap-4 font-semibold text-[15px] text-[#DE5D8F] w-full md:w-auto">
            {/* Email link */}
            <a
              href="mailto:artgoz@gmail.com"
              className="flex items-center gap-3 hover:text-[#DE5D8F]/80 hover:translate-x-1 transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-[#FCEFF4] flex items-center justify-center group-hover:bg-[#F5CDDC] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DE5D8F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <span className="underline">artgoz@gmail.com</span>
            </a>

            {/* Facebook Link */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 hover:text-[#DE5D8F]/80 hover:translate-x-1 transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-[#FCEFF4] flex items-center justify-center group-hover:bg-[#F5CDDC] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DE5D8F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </div>
              <span className="underline">คณะกรรมการนิสิตอักษรศาสตร์ จุฬาฯ ก.อศ.</span>
            </a>

            {/* Instagram Link */}
            <a
              href="https://instagram.com/arts_goz"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 hover:text-[#DE5D8F]/80 hover:translate-x-1 transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-[#FCEFF4] flex items-center justify-center group-hover:bg-[#F5CDDC] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DE5D8F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </div>
              <span className="underline">arts_goz</span>
            </a>

            {/* Line/Twitter/Link Link */}
            <a
              href="https://line.me"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 hover:text-[#DE5D8F]/80 hover:translate-x-1 transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-[#FCEFF4] flex items-center justify-center group-hover:bg-[#F5CDDC] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DE5D8F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </div>
              <span className="underline">artsgoz</span>
            </a>
          </div>
        </div>

        {/* Small copyright subfooter */}
        <div className="text-center py-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-400 font-medium">
          &copy; {new Date().getFullYear()} คณะกรรมการนิสิตอักษรศาสตร์ จุฬาลงกรณ์มหาวิทยาลัย (ก.อศ.). All Rights Reserved.
        </div>
      </footer>

      {/* ==================== SUBMIT QUESTION MODAL OVERLAY ==================== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 scale-95 md:scale-100 transition-all">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#DE5D8F] to-[#E992B4] px-6 py-4 flex justify-between items-center text-white">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span>💬</span> ส่งคำถามเพิ่มเติม
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white text-2xl font-bold leading-none cursor-pointer focus:outline-none"
              >
                &times;
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleModalSubmit} className="p-6 space-y-4">
              {isSubmitted ? (
                /* Success Message */
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center text-4xl shadow-inner animate-bounce">
                    ✓
                  </div>
                  <h4 className="text-xl font-bold text-slate-800">ส่งคำถามของคุณเสร็จสิ้น!</h4>
                  <p className="text-sm text-slate-500 max-w-sm">
                    ขอบคุณที่ติดต่อ ก.อศ. เราได้รับข้อความเรียบร้อยแล้วและจะส่งคำตอบกลับไปยังอีเมล <strong>{modalEmail}</strong> ของท่านโดยเร็วที่สุด
                  </p>
                </div>
              ) : (
                /* Interactive Form Fields */
                <>
                  {modalSubmitError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-semibold">
                      ⚠️ {modalSubmitError}
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="modal-name" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        ชื่อ-นามสกุล (ผู้ส่ง)
                      </label>
                      <input
                        id="modal-name"
                        type="text"
                        value={modalName}
                        onChange={(e) => setModalName(e.target.value)}
                        placeholder="กรอกชื่อของคุณ"
                        required
                        className="w-full bg-slate-50 border border-slate-300 focus:border-[#DE5D8F] focus:ring-1 focus:ring-[#DE5D8F] rounded-lg px-3 py-2 text-sm text-slate-800 outline-none transition-all placeholder-slate-400"
                      />
                    </div>
                    <div>
                      <label htmlFor="modal-email" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                        อีเมลสำหรับติดต่อกลับ
                      </label>
                      <input
                        id="modal-email"
                        type="email"
                        value={modalEmail}
                        onChange={(e) => setModalEmail(e.target.value)}
                        placeholder="example@mail.com"
                        required
                        className="w-full bg-slate-50 border border-slate-300 focus:border-[#DE5D8F] focus:ring-1 focus:ring-[#DE5D8F] rounded-lg px-3 py-2 text-sm text-slate-800 outline-none transition-all placeholder-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="modal-category" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      หมวดหมู่คำถาม
                    </label>
                    <select
                      id="modal-category"
                      value={modalCategory}
                      onChange={(e) => setModalCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 focus:border-[#DE5D8F] focus:ring-1 focus:ring-[#DE5D8F] rounded-lg px-3 py-2 text-sm text-slate-800 outline-none transition-all cursor-pointer"
                    >
                      <option value="ทั่วไป">ทั่วไป (General)</option>
                      <option value="ลงทะเบียนเรียน">ลงทะเบียนเรียน (Course Registration)</option>
                      <option value="Academic Tracker">Academic Tracker</option>
                      <option value="เกี่ยวกับเว็บไซต์">เกี่ยวกับเว็บไซต์ (Technical Issue)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="modal-question" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      รายละเอียดคำถาม
                    </label>
                    <textarea
                      id="modal-question"
                      value={modalQuestion}
                      onChange={(e) => setModalQuestion(e.target.value)}
                      rows={4}
                      placeholder="เขียนคำถามหรือปัญหาที่ต้องการสอบถามที่นี่..."
                      required
                      className="w-full bg-slate-50 border border-slate-300 focus:border-[#DE5D8F] focus:ring-1 focus:ring-[#DE5D8F] rounded-lg px-3 py-2 text-sm text-slate-800 outline-none transition-all placeholder-slate-400 resize-none"
                    ></textarea>
                  </div>

                  {/* Form actions */}
                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="h-10 px-5 border border-slate-300 hover:bg-slate-50 text-slate-600 rounded-lg text-sm font-bold transition-all cursor-pointer"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      className="h-10 px-6 bg-[#DE5D8F] hover:bg-[#DE5D8F]/95 text-white rounded-lg text-sm font-bold shadow-md shadow-[#DE5D8F]/10 hover:scale-102 active:scale-98 transition-all cursor-pointer"
                    >
                      ยืนยันส่งคำถาม
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
