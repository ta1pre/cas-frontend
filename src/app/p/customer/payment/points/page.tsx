'use client';

import React, { useState } from 'react';
import { Container, Typography, Card, CardContent, CardActions, Button, Grid, CircularProgress, Alert, Box, Dialog, DialogTitle } from '@mui/material';
import useUser from '@/hooks/useUser'; // ユーザーフックのパスを確認・調整
import { createCheckoutSession } from './api/payment';
import ElementsPaymentForm from "./components/ElementsPaymentForm";
import { useRouter } from "next/navigation";

// 1Pあたりの販売価格
const PRICE_PER_POINT = 1.2615;

// Stripeダッシュボードで作成した実際のPrice IDに置き換えてください
const POINT_PLANS = [
  {
    id: 'plan_11000',
    name: 'スタートプラン',
    points: 11000,
    description: 'まずはお試しでたっぷりチャージ！',
    stripe_price_id: 'price_xxxxxxxxxx11000',
  },
  {
    id: 'plan_33000',
    name: 'おすすめプラン',
    points: 33000,
    description: '人気No.1！お得にポイント大量GET',
    stripe_price_id: 'price_xxxxxxxxxx33000',
  },
  {
    id: 'plan_55000',
    name: '満足プラン',
    points: 55000,
    description: 'たっぷり使いたい方に最適',
    stripe_price_id: 'price_xxxxxxxxxx55000',
  },
  {
    id: 'plan_77000',
    name: 'プレミアムプラン',
    points: 77000,
    description: '大容量で安心！',
    stripe_price_id: 'price_xxxxxxxxxx77000',
  },
  {
    id: 'plan_110000',
    name: 'スペシャルプラン',
    points: 110000,
    description: '最上級のボリュームで超お得',
    stripe_price_id: 'price_xxxxxxxxxx110000',
  },
];

const formatYen = (num: number) => num.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 });

export default function PointPurchasePage() {
  const router = useRouter();
  const user = useUser();
  const [selectedPlan, setSelectedPlan] = useState<typeof POINT_PLANS[0] | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = (plan: typeof POINT_PLANS[0]) => {
    if (!user || !user.token) {
      setError('ログインが必要です。');
      return;
    }
    setSelectedPlan(plan);
    setShowPayment(true);
    setError(null);
  };

  const handlePaymentSuccess = () => {
    if (selectedPlan) {
      window.location.href = `/p/customer/payment/points/success?added=${selectedPlan.points}`;
    } else {
      window.location.href = `/p/customer/payment/points/success`;
    }
  };

  const handleClosePayment = () => {
    setShowPayment(false);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Typography variant="h4" align="center" fontWeight="bold" color="#C2185B" mb={2}>
        ポイント購入
      </Typography>
      <Grid container spacing={3}>
        {POINT_PLANS.map(plan => {
          const price = Math.ceil(plan.points * PRICE_PER_POINT);
          return (
            <Grid item xs={12} sm={6} key={plan.id}>
              <Card sx={{ borderRadius: 3, boxShadow: 4, position: 'relative', border: '2px solid #F8BBD0' }}>
                <CardContent>
                  <Typography variant="h6" color="#C2185B" fontWeight="bold" mb={1}>{plan.name}</Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>{plan.description}</Typography>
                  <Box textAlign="center" mb={1}>
                    <Typography variant="h3" fontWeight="bold" color="#EC407A" sx={{ letterSpacing: 1, display: 'inline-flex', alignItems: 'flex-end', lineHeight: 1 }}>
                      {plan.points.toLocaleString()}
                      <span style={{ fontSize: '1.3rem', marginLeft: 2, lineHeight: 1, display: 'inline-block', verticalAlign: 'bottom' }}>P</span>
                    </Typography>
                    <Typography sx={{ color: '#888', fontSize: '0.95rem', mt: 1, mb: 1, fontWeight: 'bold', lineHeight: 1 }}>
                      {Math.ceil(plan.points * PRICE_PER_POINT).toLocaleString()}円<span style={{ fontSize: '0.85em' }}>(税込)</span>
                    </Typography>
                  </Box>
                  <Typography sx={{ color: '#bbb', fontSize: '0.85rem', textAlign: 'right', mt: 0, mb: 0, pr: 0.5 }}>
                    1P = {PRICE_PER_POINT}円
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button variant="contained" color="secondary" size="large" sx={{ borderRadius: 5, px: 5, fontWeight: 'bold', letterSpacing: 1 }} onClick={() => handlePurchase(plan)}>
                    このプランを選ぶ
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      {/* 決済モーダル */}
      <Dialog
        open={showPayment}
        onClose={handleClosePayment}
        maxWidth={false}
        fullWidth
        PaperProps={{
          sx: { width: 'calc(100vw - 48px)', maxWidth: 'calc(100vw - 48px)', m: 0, borderRadius: 0 }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', borderBottom: '1px solid #eee' }}>
          ポイント購入
        </DialogTitle>
        {selectedPlan && (
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full relative">
            <button
              className="absolute top-3 right-4 text-gray-400 hover:text-pink-400 text-2xl font-bold"
              onClick={handleClosePayment}
            >
              ×
            </button>
            <div className="mb-6 text-center">
              <Typography variant="h3" fontWeight="bold" color="#EC407A" sx={{ letterSpacing: 1, display: 'inline-flex', alignItems: 'flex-end', lineHeight: 1 }}>
                {selectedPlan.points.toLocaleString()}
                <span style={{ fontSize: '1.3rem', marginLeft: 2, lineHeight: 1, display: 'inline-block', verticalAlign: 'bottom' }}>P</span>
              </Typography>
              <Typography sx={{ color: '#888', fontSize: '0.95rem', mt: 1, mb: 1, fontWeight: 'bold', lineHeight: 1 }}>
                {Math.ceil(selectedPlan.points * PRICE_PER_POINT).toLocaleString()}円<span style={{ fontSize: '0.85em' }}>(税込)</span>
              </Typography>
            </div>
            <ElementsPaymentForm
              amount={Math.ceil(selectedPlan.points * PRICE_PER_POINT)}
              points={selectedPlan.points}
              onSuccess={handlePaymentSuccess}
            />
          </div>
        )}
      </Dialog>
      {!user && (
        <div className="mt-6 bg-yellow-50 text-yellow-700 py-2 px-4 rounded text-center">
          ポイントを購入するにはログインが必要です。
        </div>
      )}
    </Container>
  );
}
