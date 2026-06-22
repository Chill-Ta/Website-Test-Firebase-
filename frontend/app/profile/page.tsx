"use client";

// app/profile/page.tsx
// ============================================================
// หน้า Profile — แสดงข้อมูลส่วนตัว (email, uid, role)
// เข้าถึงได้ทั้ง student และ admin
// ============================================================

import Link from "next/link";
import { useAuth } from "@/presentation/context/AuthProvider";
import { RouteGuard } from "@/presentation/components/RouteGuard";
import { logoutUseCase } from "@/di";
import { useRouter } from "next/navigation";

function ProfileContent() {
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
      <h1>👤 ข้อมูลส่วนตัว (Profile)</h1>

      <table>
        <tbody>
          <tr>
            <td><strong>Email</strong></td>
            <td>{user?.email}</td>
          </tr>
          <tr>
            <td><strong>UID</strong></td>
            <td>{user?.uid}</td>
          </tr>
          <tr>
            <td><strong>Email Verified</strong></td>
            <td>{user?.emailVerified ? "✅ Yes" : "❌ No"}</td>
          </tr>
          <tr>
            <td><strong>Role</strong></td>
            <td>{role}</td>
          </tr>
        </tbody>
      </table>

      <hr />

      <h2>เมนู</h2>
      <ul>
        <li>
          <Link href="/home">🏠 Home</Link>
        </li>
        <li>
          <Link href="/profile">👤 Profile</Link>
        </li>
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

export default function ProfilePage() {
  return (
    <RouteGuard allowedRoles={["student", "admin"]}>
      <ProfileContent />
    </RouteGuard>
  );
}
