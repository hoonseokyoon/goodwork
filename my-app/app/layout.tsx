import type { Metadata } from "next";
import { Geist } from "next/font/google";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { cn } from "@/lib/utils";

import "./globals.css";

export const metadata: Metadata = {
  title: "수도원·수녀원 허브",
  description: "한 곳에서 찾고 참여하는 수도원·수녀원 정보",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={cn(
          geistSans.className,
          "min-h-screen bg-background text-foreground antialiased",
        )}
      >
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="container mx-auto flex-1 px-4 py-6">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
