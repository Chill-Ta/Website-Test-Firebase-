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

    // ยังไม่ได้ login → ไปหน้า login
    if (!user) {
      router.push("/login");
      return;
    }

    // เช็ค role — ถ้าไม่มีสิทธิ์ → redirect ตาม role
    if (role && !allowedRoles.includes(role)) {
      if (role === "student") {
        router.push("/home");
      } else {
        router.push("/login");
      }
    }
  }, [user, role, loading, allowedRoles, router]);

  // กำลัง loading
  if (loading) {
    return <p>กำลังตรวจสอบสิทธิ์...</p>;
  }

  // ยังไม่ login หรือ role ไม่ตรง → ไม่แสดง content (รอ redirect)
  if (!user || (role && !allowedRoles.includes(role))) {
    return <p>กำลังตรวจสอบสิทธิ์...</p>;
  }

  return <>{children}</>;
}
