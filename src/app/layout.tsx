import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "부서 공동 업무 플래너",
  description: "부서원들이 함께 사용하는 업무 관리 시스템",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
