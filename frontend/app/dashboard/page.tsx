"use client";

// app/dashboard/page.tsx
// ============================================================
// หน้า Dashboard — เฉพาะ admin เท่านั้น
// ถ้า student พยายามเข้า → จะถูก redirect ไป /home
// ============================================================

import Link from "next/link";
import { useAuth } from "@/presentation/context/AuthProvider";
import { RouteGuard } from "@/presentation/components/RouteGuard";
import { useDashboard } from "@/presentation/hooks/useDashboard";

function DashboardContent() {
  const { role } = useAuth();
  const {
    user,
    protectedData,
    fetchError,
    fetchLoading,
    handleLogout,
    fetchProtectedData,
  } = useDashboard();

  return (
    <div>
      <h1>📊 Dashboard (Admin)</h1>

      <h2>ข้อมูลผู้ใช้</h2>
      <p>
        <strong>Email:</strong> {user?.email}
      </p>
      <p>
        <strong>UID:</strong> {user?.uid}
      </p>
      <p>
        <strong>Email Verified:</strong> {user?.emailVerified ? "✅ Yes" : "❌ No"}
      </p>
      <p>
        <strong>Role:</strong> {role}
      </p>

      <hr />

      <h2>ทดสอบ Protected API</h2>
      <p>
        กดปุ่มด้านล่างเพื่อเรียก <code>GET /me</code> พร้อม Authorization
        Bearer token
      </p>
      <button onClick={fetchProtectedData} disabled={fetchLoading}>
        {fetchLoading ? "กำลังดึงข้อมูล..." : "ดึงข้อมูลจาก /me"}
      </button>

      {protectedData && (
        <div>
          <h3>Response:</h3>
          <pre>{protectedData}</pre>
        </div>
      )}

      {fetchError && <p style={{ color: "red" }}>{fetchError}</p>}

      <hr />

      <h2>เมนู</h2>
      <ul>
        <li>
          <Link href="/home">🏠 Home</Link>
        </li>
        <li>
          <Link href="/profile">👤 Profile</Link>
        </li>
        <li>
          <Link href="/dashboard">📊 Dashboard (Admin)</Link>
        </li>
      </ul>

      <hr />

      <button onClick={handleLogout}>ออกจากระบบ (Logout)</button>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RouteGuard allowedRoles={["admin"]}>
      <DashboardContent />
    </RouteGuard>
  );
}


