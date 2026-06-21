"use client";

// app/dashboard/page.tsx
// ============================================================
// หน้า Dashboard — Refactored to use Clean Architecture
// UI rendering remains here, while all orchestration logic,
// authentication checking, logout, and protected endpoint fetching
// are delegated to the Presentation Hook (useDashboard).
// ============================================================

import { useDashboard } from "@/presentation/hooks/useDashboard";

export default function DashboardPage() {
  const {
    user,
    loading,
    protectedData,
    fetchError,
    fetchLoading,
    handleLogout,
    fetchProtectedData,
  } = useDashboard();

  // ─── Loading State ───
  if (loading) {
    return <p>กำลังตรวจสอบสถานะ...</p>;
  }

  // ─── Render Dashboard ───
  return (
    <div>
      <h1>Dashboard</h1>

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

      <button onClick={handleLogout}>ออกจากระบบ (Logout)</button>
    </div>
  );
}

