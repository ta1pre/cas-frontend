"use client";
import React, { useState } from "react";
import { loginTenant } from "./api/loginTenant";
import { TextField, Button, Box, Typography, Alert, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

export default function TenantLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginTenant(email, password);
      if (res && res.access_token) {
        Cookies.set("token", res.access_token, {
          path: "/",
          sameSite: "Strict",
          secure: process.env.NODE_ENV === "production",
          expires: 1
        });
        
        // リフレッシュトークンをクッキーに保存 (/adminページと同様の設定)
        if (res.refresh_token) {
          console.log('🔐 【page.tsx】refresh_token保存開始:', {
            length: res.refresh_token.length,
            first5: res.refresh_token.substring(0, 5) + '...'
          });
          try {
            const isProduction = process.env.NODE_ENV === "production";
            Cookies.set("refresh_token", res.refresh_token, { 
              path: "/",
              expires: 7, 
              secure: isProduction,
              sameSite: "Lax",
              httpOnly: false
            });
            console.log('✅ 【page.tsx】refresh_token保存成功:', Cookies.get('refresh_token')?.substring(0, 5) + '...');
          } catch (error) {
            console.error('❌ 【page.tsx】refresh_token保存失敗:', error);
          }
        } else {
          console.error('⚠️ 【page.tsx】refresh_tokenがレスポンスに存在しません');
        }
        
        localStorage.setItem("token", res.access_token);
        router.push("/p/tenant/dashboard");
      } else {
        setError("トークンを取得できませんでした");
      }
    } catch (e: any) {
      setError(e?.response?.data?.detail || "ログインに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',  // グレー系の背景色
        p: 4
      }}
    >
      <Box 
        sx={{
          width: '100%',
          maxWidth: 400,
          bgcolor: 'white',
          boxShadow: 3,
          borderRadius: 2,
          p: 4,
          mb: 4  // フォーム間の余白
        }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            color: 'text.primary',
            mb: 4,  // タイトル下部の余白
            mt: 2,  // タイトル上部の余白
            textAlign: 'center',
            fontWeight: 'bold'
          }}
        >
          PreCasログイン
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-6">
          <TextField
            fullWidth
            label="メールアドレス"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 3 }}  // メールアドレスフィールド下の余白
          />
          <TextField
            fullWidth
            label="パスワード"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}  // パスワードフィールド下の余白
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{ 
              py: 1.5,  // ボタンの上下padding
              mt: 2,    // ボタン上部の余白
              mb: 1     // ボタン下部の余白
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'ログイン'}
          </Button>
        </form>
      </Box>
    </Box>
  );
}
