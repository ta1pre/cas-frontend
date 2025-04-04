"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import ListIcon from "@mui/icons-material/List";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite"; // お気に入りキャストアイコン追加
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import EventNoteIcon from "@mui/icons-material/EventNote";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InfoIcon from "@mui/icons-material/Info";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle"; // 追加: アカウント情報アイコン

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // ログアウト処理
  const handleLogout = () => {
    console.log("【Header】ログアウト処理開始");

    // クッキーをすべて削除
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });

    console.log("【Header】クッキー削除完了");
    
    // ローカルストレージをクリア
    localStorage.clear();
    console.log("【Header】ローカルストレージクリア完了");
    
    router.push("/auth/login");
  };

  return (
    <>
      <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50 h-12 flex items-center justify-center">
        <Link href="/p/customer/search" className="absolute left-1/2 transform -translate-x-1/2">
          <Image src="/images/common/logo.png" alt="Logo" width={30} height={30} priority className="object-contain" />
        </Link>
        <button onClick={() => setIsOpen(true)} className="absolute right-4">
          <ListIcon fontSize="large" />
        </button>
      </header>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              className="fixed top-0 right-0 w-3/4 max-w-xs h-full bg-white shadow-lg z-50 flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(event, info) => {
                if (info.offset.x > 100) {
                  setIsOpen(false);
                }
              }}
            >
              {/* メニューのヘッダー */}
              <div className="w-full flex items-center justify-end px-4 h-12 bg-gray-100">
                <button onClick={() => setIsOpen(false)} className="flex items-center space-x-1 text-gray-700 text-base font-semibold text-nowrap">
                  <span>メニューを閉じる</span>
                  <KeyboardDoubleArrowRightIcon fontSize="large" />
                </button>
              </div>

              {/* ナビゲーション */}
              <nav className="mt-4 px-4">
                <ul className="list-none space-y-4">
                  <NavLink href="/p/customer/search" icon={SearchIcon} pathname={pathname} setIsOpen={setIsOpen}>キャスト検索</NavLink>

                  {/* 追加: お気に入りキャスト */}
                  <NavLink href="/p/customer/favorites" icon={FavoriteIcon} pathname={pathname} setIsOpen={setIsOpen}>
                    お気に入りキャスト
                  </NavLink>

                  <NavLink href="/p/customer/points" icon={AccountBalanceWalletIcon} pathname={pathname} setIsOpen={setIsOpen}>ポイント管理</NavLink>
                  <NavLink href="/p/customer/reserve" icon={EventNoteIcon} pathname={pathname} setIsOpen={setIsOpen}>予約管理</NavLink>
                  <NavLink href="/p/customer/area" icon={LocationOnIcon} pathname={pathname} setIsOpen={setIsOpen}>エリア設定</NavLink>

                  {/* 追加: アプリインフォ */}
                  <NavLink href="/p/customer/appinfo" icon={InfoIcon} pathname={pathname} setIsOpen={setIsOpen}>アプリインフォ</NavLink>

                  {/* アカウント情報へのリンクをヘルプの上に移動 */}
                  <NavLink href="/p/customer/account" icon={AccountCircleIcon} pathname={pathname} setIsOpen={setIsOpen}>アカウント情報</NavLink>
                  <NavLink href="/p/customer/help" icon={HelpOutlineIcon} pathname={pathname} setIsOpen={setIsOpen}>ヘルプ</NavLink>

                  {/* ログアウトの前にスペースを入れる */}
                  <li className="mt-6 border-t border-gray-300 pt-4">
                    <button onClick={handleLogout} className="flex items-center py-3 px-4 rounded-lg text-red-600 hover:bg-gray-100 text-lg">
                      <LogoutIcon className="mr-3 text-red-600" fontSize="large" />
                      ログアウト
                    </button>
                  </li>
                </ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="pt-12"></div>
    </>
  );
}

// 「今いるページ」のアイコンだけ色を変える！
function NavLink({ href, icon: Icon, children, pathname, setIsOpen }: { href: string; icon: any; children: React.ReactNode; pathname: string; setIsOpen: (open: boolean) => void }) {
  const isActive = pathname === href;

  return (
    <li>
      {isActive ? (
        <button onClick={() => setIsOpen(false)} className="flex items-center py-3 px-4 rounded-lg text-gray-500">
          <Icon className="mr-3 text-blue-500" fontSize="large" />
          {children}
        </button>
      ) : (
        <Link href={href} onClick={() => setIsOpen(false)} className="flex items-center py-3 px-4 rounded-lg text-gray-700 hover:bg-gray-100 text-lg">
          <Icon className="mr-3 text-gray-700" fontSize="large" />
          {children}
        </Link>
      )}
    </li>
  );
}
