// app/page.tsx
// Home Page — Redirect ไปหน้า Login อัตโนมัติ

import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");
}
