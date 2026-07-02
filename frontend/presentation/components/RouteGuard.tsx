"use client";

// presentation/components/RouteGuard.tsx
// ============================================================
// RouteGuard — Component wrapper สำหรับ protect หน้าตาม Role
// ใช้ useAuth() เพื่อเช็ค role ของ user
// ถ้า role ไม่ตรง → redirect ไปหน้าที่เหมาะสม
// ============================================================

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/presentation/context/AuthProvider";

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // ยังไม่ได้ login → ไปหน้าหลัก
    if (!user) {
      router.push("/home");
      return;
    }

    // role ยังเป็น null → ดึง role จาก backend ไม่สำเร็จ → ไปหน้าหลัก
    // ป้องกันไม่ให้เข้าถึง protected content โดยไม่ผ่านการยืนยัน role จาก backend
    if (!role) {
      router.push("/home");
      return;
    }

    // มี role แล้วแต่ไม่มีสิทธิ์ → redirect ไปหน้าที่เหมาะสม
    if (!allowedRoles.includes(role)) {
      router.push("/home");
    }
  }, [user, role, loading, allowedRoles, router]);

  // กำลัง loading
  if (loading) {
    return <p>กำลังตรวจสอบสิทธิ์...</p>;
  }

  // ยังไม่ login หรือ role เป็น null หรือ role ไม่ตรง → ไม่แสดง content (รอ redirect)
  // สำคัญ: ต้องเช็ค !role ด้วย เพื่อไม่ให้ content หลุดออกไปก่อน backend ยืนยัน role
  if (!user || !role || !allowedRoles.includes(role)) {
    return <p>กำลังตรวจสอบสิทธิ์...</p>;
  }

  return <>{children}</>;
}
