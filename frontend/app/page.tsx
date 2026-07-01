// app/page.tsx
// Home Page — Redirect ไปหน้า Home อัตโนมัติ

import { redirect } from "next/navigation";

export default function Home() {
  redirect("/home");
}
