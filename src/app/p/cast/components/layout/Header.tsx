'use client';

import React, { useState } from 'react';
import {
  AppBar, Toolbar, IconButton, Drawer,
  List, ListItemText, Box, ListItemButton, Divider, ListItemIcon
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useAuth } from '@/context/auth/useAuth';  // ✅ 正しいインポートパス
import Link from 'next/link';

export default function Header() {
  const { logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <>
      {/* ✅ 画面幅いっぱいのヘッダー */}
      <AppBar position="static" sx={{ width: '100%', maxWidth: 'none', backgroundColor: '#696969' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>
          {/* 左側のスペース（タイトルを入れる場合はここに追加） */}
          <Box />

          {/* 右側のメニューアイコン */}
          <IconButton edge="end" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* ✅ ハンバーガーメニュー */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
          <List>
            {/* ✅ ダッシュボード */}
            <Link href="/p/cast" passHref>
              <ListItemButton>
                <ListItemIcon><DashboardIcon /></ListItemIcon>
                <ListItemText primary="ダッシュボード" />
              </ListItemButton>
            </Link>

            {/* ✅ ヘルプ */}
            <Link href="/p/cast/cont/help" passHref>
              <ListItemButton>
                <ListItemIcon><HelpOutlineIcon /></ListItemIcon>
                <ListItemText primary="ヘルプ" />
              </ListItemButton>
            </Link>

            <Divider />

            {/* ✅ ログアウト */}
            <ListItemButton onClick={logout}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="ログアウト" />
            </ListItemButton>

          </List>
        </Box>
      </Drawer>
    </>
  );
}
