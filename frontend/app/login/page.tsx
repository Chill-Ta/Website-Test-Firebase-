"use client";

// app/login/page.tsx
// ============================================================
// หน้า Login — 3-Step Authentication Flow
// Flow:
//   Step 1: signInWithEmailAndPassword (Firebase Client SDK)
//           → Authenticate กับ Firebase ฝั่ง Client
//   Step 2: user.getIdToken()
//           → ดึง ID Token จาก Firebase User
//   Step 3: POST http://localhost:3000/login { id_token: token }
//           → Backend verify token + คืนค่า UID
//   สำเร็จ → redirect ไป /dashboard
// ============================================================

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

const API_BASE = "http://localhost:3000";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ─── Step 1: Firebase Client Authentication ───
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // ─── Step 2: ดึง ID Token ───
      const idToken = await userCredential.user.getIdToken();

      // ─── Step 3: ส่ง Token ไป Backend เพื่อ Verify ───
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: idToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "เข้าสู่ระบบไม่สำเร็จ");
        return;
      }

      // Login สำเร็จ — Backend คืน uid มา
      console.log("Login success, UID:", data.uid);

      // Redirect ไป Dashboard
      router.push("/dashboard");
    } catch (err: unknown) {
      // จัดการ Error จาก Firebase Client SDK
      if (err instanceof Error) {
        // แปลง Firebase error code เป็นข้อความภาษาไทย
        const message = err.message;
        if (message.includes("user-not-found")) {
          setError("ไม่พบบัญชีผู้ใช้นี้");
        } else if (message.includes("wrong-password") || message.includes("invalid-credential")) {
          setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        } else if (message.includes("too-many-requests")) {
          setError("มีการพยายามเข้าสู่ระบบมากเกินไป กรุณารอสักครู่");
        } else {
          setError("เข้าสู่ระบบไม่สำเร็จ: " + message);
        }
      } else {
        setError("เกิดข้อผิดพลาดที่ไม่คาดคิด");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>เข้าสู่ระบบ (Login)</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <br />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="example@mail.com"
          />
        </div>

        <br />

        <div>
          <label htmlFor="password">Password:</label>
          <br />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="รหัสผ่าน"
          />
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <br />
      <p>
        ยังไม่มีบัญชี? <Link href="/register">สมัครสมาชิก</Link>
      </p>
    </div>
  );
}
