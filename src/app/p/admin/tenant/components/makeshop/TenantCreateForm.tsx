"use client";

// テナント新規作成フォーム
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTenant } from "./api/createTenant";
import { fetchAPI } from '@/services/auth/axiosInterceptor'; // fetchAPIは必ずこのパスから
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

export default function TenantCreateForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickName, setNickName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      const res = await createTenant({ email, password, nick_name: nickName });
      console.log("✅ テナント作成レスポンス:", res); // デバッグ用ログ
      if (res && res.status === "success") {
        setSuccess("テナントアカウントを作成しました: " + res.email);
        setEmail(""); setPassword(""); setNickName("");
        // 自動ログイン・トークン保存・ダッシュボード遷移は削除（元の挙動に戻す）
      } else {
        setError("予期しないレスポンス形式です");
        console.error("予期しないレスポンス:", res);
      }
    } catch (err: any) {
      console.error("エラー詳細:", err); // デバッグ用ログ
      if (err?.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err?.message) {
        setError(err.message);
      } else {
        setError("作成に失敗しました");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && <Alert severity="success">{success}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="メールアドレス"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        fullWidth
        required
        color="secondary"
      />
      <TextField
        label="パスワード"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        fullWidth
        required
        helperText="8文字以上"
        color="secondary"
      />
      <TextField
        label="ニックネーム"
        value={nickName}
        onChange={e => setNickName(e.target.value)}
        fullWidth
        required
        color="secondary"
      />
      <Button
        type="submit"
        variant="contained"
        color="secondary"
        fullWidth
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? "作成中..." : "新規作成"}
      </Button>
    </form>
  );
}
