// middleware.ts
// ============================================================
// Next.js Middleware — ทำงานที่ Edge Runtime (ก่อน React render)
// ตรวจสอบเบื้องต้นว่า user มี Firebase Auth cookie/token หรือไม่
//
// หมายเหตุ: Next.js Middleware ไม่สามารถเรียก Firebase Client SDK
// หรือ Firestore ได้โดยตรง ดังนั้น role-based check จะทำที่
// client-side ผ่าน AuthProvider + RouteGuard แทน
//
// Middleware นี้ทำหน้าที่:
// - ปล่อยหน้า public ผ่าน (/login, /register, /)
// - ปล่อย protected routes ผ่าน (role-check ทำที่ client)
// ============================================================

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes ที่ไม่ต้อง login ก็เข้าได้
const PUBLIC_ROUTES = ["/register", "/"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ถ้าเป็น public route → ปล่อยผ่าน
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // สำหรับ protected routes → ปล่อยผ่านเสมอ
  // เพราะ Firebase Auth ใช้ Client SDK (ไม่มี cookie ที่ Edge ตรวจได้)
  // การเช็ค auth + role จะทำที่ client-side ผ่าน AuthProvider + RouteGuard
  return NextResponse.next();
}

export const config = {
  // ใช้ middleware กับ routes เหล่านี้
  matcher: ["/home", "/profile", "/dashboard", "/register"],
};
