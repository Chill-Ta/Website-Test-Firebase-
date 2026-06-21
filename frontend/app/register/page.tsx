"use client";

// app/register/page.tsx
// ============================================================
// หน้า Register — สร้างบัญชีผู้ใช้ใหม่
// Flow:
//   1. User กรอก email + password
//   2. Submit → POST http://localhost:3000/register { email, password }
//   3. Backend สร้าง user ใน Firebase Auth + Firestore
//   4. แสดง success/error message
// ============================================================

import { useState, FormEvent } from "react";
import Link from "next/link";

const API_BASE = "http://localhost:3000";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Backend ส่ง error กลับมา (เช่น email ซ้ำ, password สั้นเกิน)
        setIsError(true);
        setMessage(data.error || "สมัครสมาชิกไม่สำเร็จ");
        return;
      }

      // สมัครสำเร็จ
      setIsError(false);
      setMessage(data.message || "สมัครสมาชิกสำเร็จ! กรุณาไปหน้า Login");
      setEmail("");
      setPassword("");
    } catch (err) {
      setIsError(true);
      setMessage("ไม่สามารถเชื่อมต่อ Server ได้");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>สมัครสมาชิก (Register)</h1>

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
            placeholder="อย่างน้อย 6 ตัวอักษร"
            minLength={6}
          />
        </div>

        <br />

        <button type="submit" disabled={loading}>
          {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
        </button>
      </form>

      {message && (
        <p style={{ color: isError ? "red" : "green" }}>{message}</p>
      )}

      <br />
      <p>
        มีบัญชีแล้ว? <Link href="/login">เข้าสู่ระบบ</Link>
      </p>
    </div>
  );
}
