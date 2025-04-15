'use client';

import React, { useState } from 'react';
import { Container, Typography, Card, CardContent, CardActions, Button, Grid, CircularProgress, Alert, Box } from '@mui/material';
import useUser from '@/hooks/useUser'; // ユーザーフックのパスを確認・調整
import { createCheckoutSession } from './api/payment';

// Stripeダッシュボードで作成した実際のPrice IDに置き換えてください
const POINT_PLANS = [
  {
    id: 'plan_1',
    name: 'お手軽プラン✨',
    price: 1000,
    points: 1100,
    description: 'ちょっと試してみたい方に。',
    stripe_price_id: 'price_xxxxxxxxxxxxxx1', // TODO: Stripe Price IDに置換
  },
  {
    id: 'plan_2',
    name: '人気No.1プラン💖',
    price: 3000,
    points: 3500,
    description: 'お得にポイントをゲット！',
    stripe_price_id: 'price_xxxxxxxxxxxxxx2', // TODO: Stripe Price IDに置換
  },
  {
    id: 'plan_3',
    name: 'たっぷりプラン💎',
    price: 5000,
    points: 6000,
    description: 'たくさん使いたい方におすすめ。',
    stripe_price_id: 'price_xxxxxxxxxxxxxx3', // TODO: Stripe Price IDに置換
  },
];

export default function PointPurchasePage() {
  const user = useUser();
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async (priceId: string) => {
    if (!user || !user.token) {
      setError('ログインが必要です。');
      return;
    }
    if (loadingPriceId) return; // 他の処理が進行中なら何もしない

    setLoadingPriceId(priceId);
    setError(null);

    try {
      const response = await createCheckoutSession(priceId);
      if (response && response.checkout_url) {
        // Stripe Checkoutページへリダイレクト
        window.location.href = response.checkout_url;
        // リダイレクトされるので、ここではローディング解除は不要な場合が多い
        // setLoadingPriceId(null); // 必要であれば
      } else {
        setError('決済セッションの作成に失敗しました。もう一度お試しください。');
        setLoadingPriceId(null);
      }
    } catch (err) {
      console.error('購入処理中にエラー:', err);
      setError('購入処理中にエラーが発生しました。時間をおいて再度お試しください。');
      setLoadingPriceId(null);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4, color: 'primary.main', fontWeight: 'bold' }}>
        ポイント購入
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {POINT_PLANS.map((plan) => (
          <Grid item xs={12} sm={6} md={4} key={plan.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, boxShadow: 3 }}>
              <CardContent sx={{ flexGrow: 1, backgroundColor: 'rgba(255, 182, 193, 0.1)' /* 例: 薄いピンク */ }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'secondary.main' /* 例: アクセントカラー */ }}>
                  {plan.name}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  {plan.description}
                </Typography>
                <Typography variant="h6" sx={{ my: 1 }}>
                  {plan.price.toLocaleString()}円 → {plan.points.toLocaleString()}ポイント
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', p: 2 }}>
                <Button
                  variant="contained"
                  color="primary" // テーマのプライマリカラー（例: ピンク系）
                  size="large"
                  onClick={() => handlePurchase(plan.stripe_price_id)}
                  disabled={!!loadingPriceId || !user}
                  sx={{ borderRadius: '20px', px: 4, fontWeight: 'bold' }}
                >
                  {loadingPriceId === plan.stripe_price_id ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'このプランを購入'
                  )}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {!user && (
         <Alert severity="warning" sx={{ mt: 3 }}>
          ポイントを購入するにはログインが必要です。
        </Alert>
      )}

    </Container>
  );
}
