'use client';

import React from 'react';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import Link from 'next/link';

export default function PointPurchaseCancelPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 5, textAlign: 'center' }}>
       <Paper elevation={3} sx={{ p: 4, borderRadius: 2, backgroundColor: 'rgba(255, 223, 230, 0.2)' /* 例: 薄い赤 */ }}>
        <CancelOutlinedIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'error.main', fontWeight: 'bold' }}>
          購入キャンセル
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          ポイントの購入手続きがキャンセルされました。
          購入を続ける場合は、もう一度お試しください。
        </Typography>
        <Button component={Link} href="/p/customer/payment/points" variant="contained" color="primary">
          ポイント購入ページへ戻る
        </Button>
      </Paper>
    </Container>
  );
}
