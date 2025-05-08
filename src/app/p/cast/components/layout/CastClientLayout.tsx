// 📂 src/app/p/cast/components/layout/CastClientLayout.tsx
"use client";

import React from "react";
import { CssBaseline, Box } from "@mui/material";
import Header from "./Header";
import CastBottomNav from "./CastBottomNav";
import useUser from "@/hooks/useUser";
import { CastUserContext } from "@/app/p/cast/context/CastUserContext";

export default function CastClientLayout({ children }: { children: React.ReactNode }) {
  const user = useUser();

  if (!user) {
    return <div>ユーザーデータ取得中...</div>;
  }

  return (
    <CastUserContext.Provider value={user}>
      <Box sx={{ width: '100%', minHeight: '100vh', overflowX: 'hidden', pb: '56px' }}>
        <CssBaseline />
        <Header />
        <Box py={4} pt={6}>{children}</Box>
        <CastBottomNav />
      </Box>
    </CastUserContext.Provider>
  );
}
