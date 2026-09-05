import type { Metadata } from "next";
import { Nunito, Outfit } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin", "vietnamese"],
  variable: "--font-nunito",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "EduSpark — Nền Tảng Học Tập Gamified Dành Cho Học Sinh Cấp 1 & 2",
  description: "Vừa học vừa chơi, bứt phá tư duy với các mini-game giáo dục, thử thách hàng ngày và bảng vàng vinh danh!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${nunito.variable} ${outfit.variable}`}>
      <body className="font-sans antialiased selection:bg-spark-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}

