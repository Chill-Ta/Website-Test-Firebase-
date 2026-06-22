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

        try {
          // ดึง role จาก backend (GET /me)
          const profile = await fetchProfileUseCase.execute();
          setRole(profile.role || "student");
          setUser((prev) =>
            prev ? { ...prev, role: profile.role || "student" } : prev
          );
        } catch {
          // ถ้าดึง role ไม่ได้ ให้ default เป็น student
          setRole("student");
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
