// src/app/components/Header.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import ListIcon from "@mui/icons-material/List"; // ← 追加（MUIのアイコン）

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // 現在のURLを取得

  // ページ遷移時にメニューを閉じる
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* ヘッダー */}
      <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50 h-12 flex items-center justify-center">
        {/* ロゴ */}
        <Link href="/" className="absolute left-1/2 transform -translate-x-1/2">
          <Image
            src="/images/common/logo.png"
            alt="Logo"
            width={40}
            height={40}
            priority
            className="object-contain"
          />
        </Link>

        {/* ハンバーガーメニュー（MUIのListIconを使用） */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-4"
        >
          <ListIcon fontSize="large" />
        </button>

        {/* モバイル用ナビゲーション */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-12 w-full bg-white shadow-md rounded-md p-4 md:hidden"
          >
            <ul className="space-y-2 text-center">
              <NavLink href="/p/customer/search">キャスト検索</NavLink>
              <NavLink href="/p/customer/points">ポイント管理</NavLink>
              <NavLink href="/p/customer/reserve">予約管理</NavLink>
              <NavLink href="/p/customer/area">エリア設定</NavLink>
            </ul>
          </motion.div>
        )}
      </header>

      {/* ここでヘッダー分の余白を確保 */}
      <div className="pt-12"></div>
    </>
  );
}

// ナビゲーションリンク
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="block py-2 px-4 rounded-md text-gray-700 hover:bg-gray-100">
        {children}
      </Link>
    </li>
  );
}
