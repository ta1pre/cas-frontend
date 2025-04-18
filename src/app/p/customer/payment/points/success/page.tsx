'use client';

import React, { useEffect } from 'react';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// TODO: ポイント残高を更新する処理を追加する (例: サーバーサイドでWebhookを処理した後、クライアント側で再取得)
// import useUser from '@/hooks/useUser';

export default function PointPurchaseSuccessPage() {
  // 追加ポイント数をクエリパラメータから取得
  const searchParams = useSearchParams();
  const addedRaw = searchParams?.get('added');
  const added = addedRaw ? Number(addedRaw) : null;

  useEffect(() => {
    console.log('Purchase success page loaded.');
  }, []);

  return (
    <Container maxWidth="sm" sx={{ py: 5, textAlign: 'center' }}>
      <Paper elevation={3} sx={{
        p: 4,
        borderRadius: 2,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', // 淡いブルーグレーグラデ
        boxShadow: '0 4px 16px rgba(30,64,175,0.08)',
      }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 70, mb: 2, color: 'primary.main' }} />
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold', mb: 1 }}>
          ポイント追加完了
        </Typography>
        <Typography variant="h5" sx={{
          color: 'text.primary',
          fontWeight: 'bold',
          mb: 2,
          fontSize: { xs: '2rem', sm: '2.5rem' },
          letterSpacing: 1,
        }}>
          {added !== null && !isNaN(added)
            ? <><span style={{ color: '#1e40af', fontWeight: 700, fontSize: '2.5rem' }}>+{added.toLocaleString()}</span>P</>
            : 'ポイントが追加されました！'}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          ご利用ありがとうございます。
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button component={Link} href="/p/customer/points" variant="outlined" color="primary" sx={{ borderRadius: 2, px: 4, fontWeight: 'bold' }}>
            ポイント履歴
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
