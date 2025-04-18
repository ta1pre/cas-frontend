"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Alert, Button } from "@mui/material";
import Link from "next/link";
import useUser from '@/hooks/useUser';
import { fetchAPI } from "@/services/auth/axiosInterceptor"; // ✅ API通信

export default function PointsSuccessPage() {
  const searchParams = useSearchParams();
  const addedRaw = searchParams.get("added");
  const added = addedRaw ? Number(addedRaw) : null;
  const user = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!user || !user.user_id || !user.token) {
        setError('ユーザー情報が取得できません。ログインし直してください。');
        setLoading(false);
        return;
      }
      try {
        const res = await fetchAPI('/api/v1/points/balance', { user_id: user.user_id });
        if (res && typeof res.total_point_balance === 'number') {
          setBalance(res.total_point_balance);
          setError(null);
        } else {
          setError('ポイント残高の取得に失敗しました。');
        }
      } catch (e) {
        setError('ポイント残高の取得時にエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };
    fetchBalance();
  }, [user]);

  return (
    <Box maxWidth={500} mx="auto" mt={8} p={4} bgcolor="#f5f7fa" borderRadius={3} boxShadow={3}>
      <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom align="center">
        ポイント購入完了
      </Typography>
      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 3 }} />}
      {error && <Alert severity="error" sx={{ my: 3 }}>{error}</Alert>}
      {!loading && !error && (
        <>
          {added !== null && !isNaN(added) && (
            <Typography variant="h5" align="center" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 2 }}>
              +{added.toLocaleString()}P 追加されました
            </Typography>
          )}
          <Typography variant="body1" align="center" sx={{ mb: 2 }}>
            ご利用ありがとうございます。
          </Typography>
          <Typography variant="body2" align="center" sx={{ mb: 3, color: 'text.secondary' }}>
            現在のポイント残高：<span style={{ color: '#1e40af', fontWeight: 700 }}>{balance !== null ? balance.toLocaleString() : '--'}P</span>
          </Typography>
        </>
      )}
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
