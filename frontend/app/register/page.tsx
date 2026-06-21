"use client";

// app/register/page.tsx
// ============================================================
// หน้า Register — Refactored to use Clean Architecture
// UI rendering remains here, while registration flow logic is
// delegated to the Presentation Hook (useRegister).
// ============================================================

import Link from "next/link";
import { useRegister } from "@/presentation/hooks/useRegister";

export default function RegisterPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    message,
    isError,
    loading,
    handleSubmit,
  } = useRegister();

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

