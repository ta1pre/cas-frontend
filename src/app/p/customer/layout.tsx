// src/app/p/customer/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // ✅ 予約ページではヘッダーを非表示にする
  const isOfferPage = pathname.startsWith("/p/customer/offer/first/");

  return (
    <div className="min-h-screen flex flex-col">
      {!isOfferPage && <Header />} {/* 予約ページではヘッダーを表示しない */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
