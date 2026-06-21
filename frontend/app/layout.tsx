// app/layout.tsx
// Root Layout — โครงสร้างหลักของ App
// ไม่มี CSS/Style ตามข้อกำหนด

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
      <body>{children}</body>
    </html>
  );
}
