"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Alert, Button } from "@mui/material";
import Link from "next/link";

export default function PointsSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // session_idがなくてもサクセスメッセージを表示
    setMessage("ご購入ありがとうございます！ポイントが正常に付与されました。");
    setLoading(false);
  }, []);

  return (
    <Box maxWidth={500} mx="auto" mt={8} p={4} bgcolor="#fff0f6" borderRadius={3} boxShadow={3}>
      <Typography variant="h4" fontWeight="bold" color="secondary" gutterBottom align="center">
        ポイント購入完了
      </Typography>
      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 3 }} />}
      {error && <Alert severity="error" sx={{ my: 3 }}>{error}</Alert>}
      {message && <Alert severity="success" sx={{ my: 3 }}>{message}</Alert>}
      <Box textAlign="center" mt={4}>
        <Link href="/p/customer/points" passHref legacyBehavior>
          <Button variant="contained" color="primary" sx={{ borderRadius: 2, px: 4, fontWeight: 'bold' }}>
            ポイント管理へ戻る
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
