"use client";
import React from "react";
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Button, Typography, Divider, ListItemButton } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StoreIcon from "@mui/icons-material/Store";
import EventIcon from "@mui/icons-material/Event";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth/useAuth";

const menuItems = [
  { text: "ダッシュボード", icon: <DashboardIcon />, path: "/p/tenant/dashboard" },
  { text: "店舗情報", icon: <StoreIcon />, path: "/p/tenant/store" },
  { text: "予約管理", icon: <EventIcon />, path: "/p/tenant/reservations" },
];

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/tenant");
  };

  return (
    <Box className="min-h-screen flex bg-gray-100">
      {/* サイドバー */}
      <Drawer
        variant="permanent"
        anchor="left"
        PaperProps={{
          className: "w-64 bg-slate-900 border-r-0 shadow-md flex flex-col justify-between",
        }}
      >
        <Box>
          <Typography variant="h5" className="text-center py-6 font-bold text-blue-300 tracking-widest">
            提携店管理
          </Typography>
          <Divider className="mb-2 bg-gray-700" />
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={() => router.push(item.path)} className="hover:bg-slate-800">
                  <ListItemIcon className="text-blue-400">{item.icon}</ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ className: "text-gray-900 font-bold" }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
        <Box className="mb-6 px-4">
          <Button
            variant="contained"
            fullWidth
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            className="bg-gray-700 hover:bg-blue-700 text-gray-100 font-bold py-2 rounded-lg shadow"
          >
            ログアウト
          </Button>
        </Box>
      </Drawer>
      {/* メインエリア: サイドバー幅分の左マージンを追加 */}
      <Box className="flex-1 p-8 ml-64 bg-white min-h-screen">
        {children}
      </Box>
    </Box>
  );
}
