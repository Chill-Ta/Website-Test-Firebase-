// app/layout.tsx
// Root Layout — โครงสร้างหลักของ App
// ครอบ AuthProvider เพื่อให้ทุกหน้าเข้าถึง user + role ได้

import "./globals.css";
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Noto+Sans+Thai:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

