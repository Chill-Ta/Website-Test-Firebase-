"use client";

// app/dashboard/page.tsx
// ============================================================
// หน้า Dashboard — Protected Route
// Features:
//   1. เช็คสถานะ login จาก Firebase Auth (onAuthStateChanged)
//   2. ถ้ายังไม่ login → redirect ไป /login
//   3. แสดงข้อมูล user (email, UID)
//   4. ปุ่ม Logout (signOut)
//   5. ตัวอย่าง fetchProtectedData() — เรียก API ที่มี AuthMiddleware
//      โดยแนบ Header: Authorization: Bearer <id_token>
// ============================================================

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

const API_BASE = "http://localhost:3000";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [protectedData, setProtectedData] = useState<string>("");
  const [fetchError, setFetchError] = useState("");
  const [fetchLoading, setFetchLoading] = useState(false);

  // ─── เช็คสถานะ Authentication ───
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      } else {
        // ยังไม่ login → redirect ไปหน้า Login
        router.push("/login");
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [router]);

  // ─── Logout ───
  async function handleLogout() {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  // ─── ตัวอย่าง: Fetch ข้อมูลจาก Protected Route ───
  // ฟังก์ชันนี้แสดงวิธีเรียก API ที่มี AuthMiddleware
  // โดยต้องแนบ Authorization: Bearer <id_token> ทุกครั้ง
  async function fetchProtectedData() {
    if (!user) return;

    setFetchError("");
    setFetchLoading(true);
    setProtectedData("");

    try {
      // ดึง fresh ID Token จาก Firebase User
      const idToken = await user.getIdToken();

      // เรียก protected endpoint พร้อม Bearer token
      const res = await fetch(`${API_BASE}/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setFetchError(data.error || "ไม่สามารถดึงข้อมูลได้");
        return;
      }

      // แสดงผลข้อมูลที่ได้
      setProtectedData(JSON.stringify(data, null, 2));
    } catch (err) {
      setFetchError("ไม่สามารถเชื่อมต่อ Server ได้");
    } finally {
      setFetchLoading(false);
    }
  }

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
