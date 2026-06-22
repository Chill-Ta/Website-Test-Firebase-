"use client";

// app/home/page.tsx
// ============================================================
// หน้า Home — สำหรับ student (และ admin ก็เข้าได้)
// แสดงข้อมูลต้อนรับ + เมนู Navigation
// ============================================================

import Link from "next/link";
import { useAuth } from "@/presentation/context/AuthProvider";
import { RouteGuard } from "@/presentation/components/RouteGuard";
import { logoutUseCase } from "@/di";
import { useRouter } from "next/navigation";

function HomeContent() {
  const { user, role } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    try {
      await logoutUseCase.execute();
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  return (
    <div>
      <h1>🏠 หน้าหลัก (Home)</h1>

      <h2>ยินดีต้อนรับ!</h2>
      <p>
        <strong>Email:</strong> {user?.email}
      </p>
      <p>
        <strong>UID:</strong> {user?.uid}
      </p>
      <p>
        <strong>Role:</strong> {role}
      </p>

      <hr />

      <h2>เมนู</h2>
      <ul>
        <li>
          <Link href="/home">🏠 Home</Link>
        </li>
        <li>
          <Link href="/profile">👤 Profile</Link>
        </li>
        {/* แสดงปุ่ม Dashboard เฉพาะ admin */}
        {role === "admin" && (
          <li>
            <Link href="/dashboard">📊 Dashboard (Admin)</Link>
          </li>
        )}
      </ul>

      <hr />

      <button onClick={handleLogout}>ออกจากระบบ (Logout)</button>
    </div>
  );
}

export default function HomePage() {
  return (
    <RouteGuard allowedRoles={["student", "admin"]}>
      <HomeContent />
    </RouteGuard>
  );
}
