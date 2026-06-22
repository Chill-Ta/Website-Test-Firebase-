// app/layout.tsx
// Root Layout — โครงสร้างหลักของ App
// ครอบ AuthProvider เพื่อให้ทุกหน้าเข้าถึง user + role ได้

import { AuthProvider } from "@/presentation/context/AuthProvider";

export const metadata = {
  title: "Login Firebase App",
  description: "Registration, Login & User Management with Firebase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

