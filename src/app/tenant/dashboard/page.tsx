"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useAuth } from "@/context/auth/useAuth";

export default function TenantDashboardPage() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // ローディング中は絶対にリダイレクト判定しない
    if (loading) return;
    if (!isAuthenticated || user?.userType !== "tenant") {
      router.replace("/tenant");
    }
  }, [isAuthenticated, user, loading, router]);

  // ローディング中は必ずスピナー表示
  if (loading || typeof user === 'undefined') {
    return (
      <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
      <Box className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
        <Typography variant="h5" color="secondary" className="mb-4 font-bold">
          テナントダッシュボード
        </Typography>
        <Typography className="mb-4">ようこそ、テナント管理者さん！</Typography>
        <Typography>ここにテナント向け機能が表示されます。</Typography>
      </Box>
    </Box>
  );
}
