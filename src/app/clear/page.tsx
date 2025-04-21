"use client";
import { useEffect } from "react";
import { Box, Typography } from "@mui/material";

export default function ClearPage() {
  useEffect(() => {
    // クッキー全削除
    if (typeof document !== "undefined") {
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos) : c;
        document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });
    }
    // ローカルストレージ全削除
    if (typeof window !== "undefined") {
      window.localStorage.clear();
      window.sessionStorage.clear();
    }
    // アラート
    alert("クリアされました！\n再度ログインしてください。");
  }, []);

  return (
    <Box className="flex flex-col items-center justify-center min-h-screen bg-pink-50" sx={{ py: 8 }}>
      <Typography variant="h4" className="text-gray-700 font-bold mb-4">
        データクリア完了
      </Typography>
      <Typography variant="body1" className="mb-8 text-gray-500">
        クッキー・ローカルストレージを削除しました。必要に応じて再ログインしてください。
      </Typography>

      {/* ▼ リンク集 ここから */}
      <Box className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 mb-4">
        <Typography variant="h6" className="text-gray-600 font-semibold mb-2">ユーザー向けページ</Typography>
        <Box className="flex flex-col gap-3 mb-4">
          <a href="https://cas.tokyo/s/sandbox/ero" target="_blank" rel="noopener noreferrer"
            className="block rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 font-medium transition">
            pre cas：<span className="font-mono">cas.tokyo/</span>
          </a>
          <a href="https://cas.tokyo/s/sandbox/normal" target="_blank" rel="noopener noreferrer"
            className="block rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 font-medium transition">
            cas：<span className="font-mono">cas.tokyo/</span>
          </a>
        </Box>
        <Typography variant="h6" className="text-gray-600 font-semibold mb-2">キャスト向けページ</Typography>
        <Box className="flex flex-col gap-3">
          <a href="https://lp.cas.tokyo/cast/lux/first" target="_blank" rel="noopener noreferrer"
            className="block rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 font-medium transition">
            pre cas：<span className="font-mono">lp.cas.toky</span>
          </a>
          <a href="https://lp.cas.tokyo/cast/std/normal" target="_blank" rel="noopener noreferrer"
            className="block rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 font-medium transition">
            cas：<span className="font-mono">lp.cas.toky</span>
          </a>
        </Box>
      </Box>
      {/* ▲ リンク集 ここまで */}
    </Box>
  );
}
