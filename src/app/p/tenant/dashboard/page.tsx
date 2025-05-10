// src/app/p/tenant/page.tsx
"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, CircularProgress, Paper } from "@mui/material";
import { useAuth } from "@/context/auth/useAuth";

export default function TenantDashboardPage() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated || user?.userType !== "tenant") {
      router.replace("/tenant");
    }
  }, [isAuthenticated, user, loading, router]);

  if (loading || !user) {
    return (
      <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-blue-50">
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box className="w-full min-h-screen px-2 md:px-8 py-8 bg-gradient-to-br from-pink-50 to-blue-50">
      <Typography variant="h4" className="font-bold text-gray-800 mb-6">
      テナント管理ダッシュボード
      </Typography>

      {/* ✅ ここを修正しました */}
      <Paper
        elevation={1}
        className="w-full max-w-full md:max-w-none mx-auto p-8 rounded-xl"
      >
        <div className="mb-4">
          <Typography variant="h5" className="font-bold text-gray-700 mb-2">
            ようこそ、テナント管理者さん！
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            店舗情報や管理機能はこちらからご確認いただけます。
          </Typography>
        </div>

        {/* PCでは横並び・最大幅で広く使う */}
        <div className="flex flex-col md:flex-row gap-8 w-full">
          {/* テナント情報 */}
          <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6 min-w-0">
            <Typography variant="h6" className="font-bold text-gray-700 mb-2">
              テナント情報
            </Typography>
            <div className="text-gray-700">
              <div className="mb-1">テナントID: {user.userId}</div>
              <div>ユーザータイプ: {user.userType}</div>
            </div>
          </div>

          {/* お知らせ */}
          <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6 min-w-0">
            <Typography variant="h6" className="font-bold text-gray-700 mb-2">
              お知らせ
            </Typography>
            <div className="text-gray-700">
              新機能のお知らせやアップデート情報が表示されます
            </div>
          </div>
        </div>
      </Paper>
    </Box>
  );
}
