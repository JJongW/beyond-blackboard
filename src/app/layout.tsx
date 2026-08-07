import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "크레파스",
  description: "교사의 반복 행정 업무를 줄이는 학급 행정 도우미",
  keywords: "크레파스, 교사, 행정업무, 학교, 교육, 문서생성, 수행평가",
  authors: [{ name: "크레파스" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <link rel="icon" href="/images/crepass-app-icon.png" />
        <meta name="theme-color" content="#3D8B6E" />
      </head>
      <body className="font-sans h-full bg-surface text-ink">{children}</body>
    </html>
  );
}
