// 📂 app/cast/components/CastHeader.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import ListIcon from '@mui/icons-material/List';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import Link from 'next/link';

export default function CastHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    console.log("🚪 【CastHeader】ログアウト処理開始");
    document.cookie.split(';').forEach((cookie) => {
      const name = cookie.split('=')[0].trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    console.log("✅ 【CastHeader】クッキー削除完了");
    router.push("/auth/login");
  };

  return (
    <>
      <header className="bg-pink-100 shadow-md fixed top-0 left-0 w-full z-50 h-12 flex items-center justify-center">
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Image src="/images/common/logo.png" alt="Logo" width={30} height={30} priority className="object-contain" />
        </div>
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
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(event, info) => {
                if (info.offset.x > 100) setIsOpen(false);
              }}
            >
              <div className="w-full flex items-center justify-end px-4 h-12 bg-pink-100">
                <button onClick={() => setIsOpen(false)} className="flex items-center space-x-1 text-gray-700 text-base font-semibold">
                  <span>メニューを閉じる</span>
                  <KeyboardDoubleArrowRightIcon fontSize="large" />
                </button>
              </div>

              <nav className="mt-4 px-4">
                <ul className="list-none space-y-4">
                  <NavLink href="/p/cast/cont/reserve" icon={AssignmentIcon} pathname={pathname} setIsOpen={setIsOpen}>予約管理</NavLink>
                  <NavLink href="/p/cast/cont/prof" icon={PersonIcon} pathname={pathname} setIsOpen={setIsOpen}>プロフィール編集</NavLink>
                  <NavLink href="/p/cast/cont/points" icon={AccountBalanceWalletIcon} pathname={pathname} setIsOpen={setIsOpen}>ポイント管理</NavLink>
                  <NavLink href="/p/cast/cont/help" icon={HelpOutlineIcon} pathname={pathname} setIsOpen={setIsOpen}>ヘルプ</NavLink>
                  <li className="mt-6 border-t border-gray-300 pt-4">
                    <button onClick={handleLogout} className="flex items-center py-3 px-4 rounded-lg text-red-600 hover:bg-gray-100 text-lg">
                      <LogoutIcon className="mr-3 text-red-600" fontSize="large" />ログアウト
                    </button>
                  </li>
                </ul>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

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