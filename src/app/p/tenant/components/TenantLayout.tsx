"use client";
import React from "react";
import { Box, Drawer, Button, Typography } from "@mui/material";
import { Dashboard, Store, Event, People, Logout } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth/useAuth";

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/tenant");
  };

  const menuItems = [
    { icon: <Dashboard />, label: 'ダッシュボード', href: '/p/tenant/dashboard' },
    { icon: <Store />, label: '店舗情報', href: '/p/tenant/store-info' },
    { icon: <Event />, label: '予約管理', href: '/p/tenant/reservations' },
    { icon: <People />, label: 'キャスト管理', href: '/p/tenant/cast' },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* サイドバー */}
      <div className="w-64 h-full bg-slate-900 flex flex-col fixed left-0 top-0 bottom-0">
        <div className="p-4 border-b border-slate-800">
          <h2 className="text-white font-bold">提携店管理</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {menuItems.map((item, index) => (
            <Link 
              key={index} 
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
        
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-300 hover:text-white w-full"
          >
            <Logout />
            ログアウト
          </button>
        </div>
      </div>
      
      {/* メインコンテンツ */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50" style={{ marginLeft: '16rem' }}>
        {children}
      </div>
    </div>
  );
}
