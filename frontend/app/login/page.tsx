"use client";

// app/login/page.tsx
// ============================================================
// หน้า Login — Refactored to use Clean Architecture
// UI rendering remains here, while all orchestration logic,
// Firebase Client SDK calls, and API integrations are delegated
// to the Presentation Hook (useLogin).
// ============================================================

import Link from "next/link";
import { useLogin } from "@/presentation/hooks/useLogin";

export default function LoginPage() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
  } = useLogin();

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

