"use client";
import React, { useState } from "react";
import { loginTenant } from "./api/loginTenant";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
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
      // ログイン成功時にトークン保存とクッキー同期、ダッシュボードへリダイレクト
      if (res && res.access_token) {
        // クッキー属性をデモ・管理者ログインと統一
        Cookies.set("token", res.access_token, {
          path: "/",
          sameSite: "Strict",
          secure: process.env.NODE_ENV === "production", // 本番のみtrue
          expires: 1
        });
        localStorage.setItem("token", res.access_token);
        console.log("保存直後token:", Cookies.get("token"));
        // SPA遷移で状態伝播を安定させる
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
    <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
      <Box className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <Typography variant="h5" className="mb-6 text-center font-bold" color="secondary">テナントログイン</Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="メールアドレス"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            required
            variant="outlined"
          />
          <TextField
            label="パスワード"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            required
            variant="outlined"
          />
          {error && <Alert severity="error">{error}</Alert>}
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            fullWidth
            className="mt-4 font-bold"
            disabled={loading}
            style={{ background: "linear-gradient(90deg, #f472b6, #c084fc)" }}
          >
            {loading ? "ログイン中..." : "ログイン"}
          </Button>
        </form>
      </Box>
    </Box>
  );
}
