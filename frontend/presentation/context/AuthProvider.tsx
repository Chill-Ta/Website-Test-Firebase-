"use client";

// presentation/context/AuthProvider.tsx
// ============================================================
// Auth Context Provider — จัดการ state ของ user + role ทั่วทั้ง App
// ใช้ onAuthStateChanged เพื่อ listen auth state จาก Firebase
// เมื่อ user login แล้ว → เรียก GET /me เพื่อดึง role จาก backend
// ============================================================

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/domain/entities/user.entity";
import { getCurrentUserUseCase, fetchProfileUseCase } from "@/di";

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getCurrentUserUseCase.subscribe(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // ตั้ง loading = true ใหม่ทุกครั้งที่ auth state เปลี่ยน
        // เพื่อให้ RouteGuard รอจนกว่า backend จะยืนยัน role เสร็จ
        // แก้ race condition: onAuthStateChanged ยิงครั้งแรกด้วย null (loading=false)
        // แล้วยิงครั้งที่ 2 ด้วย user → ถ้าไม่ reset loading, RouteGuard จะเห็น
        // loading=false + role=null แล้วเตะไป /home ก่อนที่จะดึง role เสร็จ
        setLoading(true);

        // ดึง role จาก backend (GET /me)
        // Frontend ไม่มีสิทธิ์กำหนด role เอง — ต้องได้จาก backend เท่านั้น
        // ใช้ retry เพื่อรองรับกรณี refresh หน้า ที่ Firebase SDK อาจยังเตรียม token ไม่เสร็จ
        const MAX_RETRIES = 2;
        let fetched = false;

        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
          try {
            const profile = await fetchProfileUseCase.execute();
            if (profile.role) {
              setRole(profile.role);
              setUser((prev) =>
                prev ? { ...prev, role: profile.role } : prev
              );
              fetched = true;
              break;
            }
          } catch {
            // ถ้ายังเหลือรอบ retry → รอ 1 วินาทีแล้วลองใหม่
            if (attempt < MAX_RETRIES) {
              await new Promise((r) => setTimeout(r, 1000));
            }
          }
        }

        if (!fetched) {
          // retry ครบแล้วยังไม่สำเร็จ → ไม่ให้สิทธิ์ใดๆ (role = null)
          // ป้องกันการโจมตีด้วยการตัด network เพื่อ bypass role check
          setRole(null);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
