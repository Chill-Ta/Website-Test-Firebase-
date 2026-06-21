// lib/firebase.ts
// Firebase Client SDK Configuration
// ============================================================
// ค่า config นี้ใช้สำหรับ Firebase Client SDK (ฝั่ง Browser)
// ⚠️ ต้องเปลี่ยน apiKey ให้ตรงกับ Firebase Project ของคุณ
//    ดูได้จาก Firebase Console > Project Settings > General > Web App
// ============================================================

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDv52CAFZixlCV8NShD074AUuVFjk7kDHw", // ← เปลี่ยนค่านี้
  authDomain: "account-test-c25f0.firebaseapp.com",
  projectId: "account-test-c25f0",
};

// ป้องกันไม่ให้ initialize ซ้ำ (Next.js อาจ re-render หลายรอบ)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);

export { auth };
export default app;
