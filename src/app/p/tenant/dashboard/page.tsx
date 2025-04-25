"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, CircularProgress, Paper, Grid } from "@mui/material";
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
      <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box className="min-h-screen p-6 bg-gradient-to-br from-pink-100 to-purple-100">
      <Paper elevation={3} className="p-6 rounded-lg shadow-lg">
        <Typography variant="h4" color="secondary" className="mb-6 font-bold text-center">
          テナント管理ダッシュボード
        </Typography>
        
        <Typography className="mb-4 text-center">
          ようこそ、テナント管理者さん！
        </Typography>
        
        <Grid container spacing={3} className="mt-4">
          <Grid item xs={12} md={4}>
            <Paper elevation={2} className="p-4 h-full bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <Typography variant="h6" color="secondary" className="mb-2 font-bold">
                テナント情報
              </Typography>
              <Typography variant="body2">
                テナントID: {user.userId}<br />
                ユーザータイプ: {user.userType}
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={2} className="p-4 h-full bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <Typography variant="h6" color="secondary" className="mb-2 font-bold">
                最近の活動
              </Typography>
              <Typography variant="body2">
                ここに最近の活動ログが表示されます
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={2} className="p-4 h-full bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <Typography variant="h6" color="secondary" className="mb-2 font-bold">
                お知らせ
              </Typography>
              <Typography variant="body2">
                新機能のお知らせやアップデート情報が表示されます
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
