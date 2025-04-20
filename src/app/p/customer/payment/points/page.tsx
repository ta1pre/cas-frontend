'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, CardActions, Button, Grid, CircularProgress, Alert, Box, Dialog, DialogTitle } from '@mui/material';
import useUser from '@/hooks/useUser'; // ユーザーフックのパスを確認・調整
import { createCheckoutSession } from './api/payment';
import ElementsPaymentForm from "./components/ElementsPaymentForm";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchAPI } from '@/services/auth/axiosInterceptor'; // fetchAPIを必ず使う

// 1Pあたりの販売価格
const PRICE_PER_POINT = 1.2615;
const CUSTOM_PRICE_PER_POINT = 1.3; // 任意ポイント用

// Stripeダッシュボードで作成した実際のPrice IDに置き換えてください
type PointPlan = {
  id: string;
  name: string;
  points: number;
  description: string;
  stripe_price_id: string;
  custom_price_per_point?: number;
};

const POINT_PLANS: PointPlan[] = [
  {
    id: 'plan_11000',
    name: 'スタートパック',
    points: 11000,
    description: '気軽に購入',
    stripe_price_id: 'price_xxxxxxxxxx11000',
  },
  {
    id: 'plan_33000',
    name: 'おすすめパック',
    points: 33000,
    description: '一番人気のお得パック',
    stripe_price_id: 'price_xxxxxxxxxx33000',
  },
  {
    id: 'plan_55000',
    name: 'プレミアムパック',
    points: 55000,
    description: '大容量で安心',
    stripe_price_id: 'price_xxxxxxxxxx55000',
  },
  {
    id: 'plan_77000',
    name: 'プレミアムパック',
    points: 77000,
    description: '大容量でもっと安心！',
    stripe_price_id: 'price_xxxxxxxxxx77000',
  },
  {
    id: 'plan_110000',
    name: 'スペシャルパック',
    points: 110000,
    description: '最上級のボリュームパック',
    stripe_price_id: 'price_xxxxxxxxxx110000',
  },
];

const formatYen = (num: number) => num.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 });

export default function PointPurchasePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useUser();
  const [selectedPlan, setSelectedPlan] = useState<PointPlan | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // 任意ポイント関連のstate
  const [customPoints, setCustomPoints] = useState<number | ''>('');
  // クエリパラメータ取得
  const shortfallParam = searchParams.get("shortfall");
  const reservationIdParam = searchParams.get("reservationId");

  // 初期表示時に不足分があれば自動入力
  useEffect(() => {
    if (shortfallParam && !isNaN(Number(shortfallParam))) {
      setCustomPoints(Number(shortfallParam));
    }
  }, [shortfallParam]);

  // 任意ポイント入力時の金額自動計算
  const handleCustomPointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    const points: number | '' = value === '' ? '' : Math.min(999999, Number(value));
    setCustomPoints(points);
  };

  // 任意ポイント購入ボタン押下時
  const handleCustomPurchase = async () => {
    if (!user || !user.token) {
      alert('ログインが必要です。');
      return;
    }
    if (!customPoints || isNaN(Number(customPoints)) || Number(customPoints) < 100) {
      alert('100ポイント以上を入力してください。');
      return;
    }
    setSelectedPlan({
      id: `custom_${customPoints}`,
      name: 'カスタム',
      points: Number(customPoints),
      description: `${customPoints}ポイント購入`,
      stripe_price_id: '', // APIでprice_id不要な場合
      custom_price_per_point: CUSTOM_PRICE_PER_POINT, // 必要なら渡す
    });
    setShowPayment(true);
  };

  const handlePurchase = (plan: PointPlan) => {
    if (!user || !user.token) {
      alert('ログインが必要です。');
      return;
    }
    setSelectedPlan(plan);
    setShowPayment(true);
    setError(null);
  };

  // 決済成功時
  const handlePaymentSuccess = () => {
    // 予約ID付きで予約詳細に戻る（自動確定フラグ付き）
    if (reservationIdParam) {
      router.push(`/p/customer/reserve?autoCompleteReserve=1&reservationId=${reservationIdParam}`);
    } else if (selectedPlan) {
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
      <Grid container spacing={3} sx={{ mb: 0 }}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 4, position: 'relative', border: '2px solid #F8BBD0', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" color="#C2185B" fontWeight="bold" mb={1}>
                任意ポイント数で購入
              </Typography>
              {/* コメント部分（100P以上で購入可能の案内） */}
              <Typography variant="body2" color="text.secondary" mb={2}>
                100P以上から購入できます
              </Typography>
              <Box textAlign="center" mb={1} display="flex" flexDirection="column" alignItems="center" gap={1}>
                <Box display="flex" alignItems="center" gap={1}>
                  <input
                    type="number"
                    min={1}
                    max={999999}
                    value={customPoints}
                    onChange={handleCustomPointsChange}
                    placeholder="ポイント数を入力"
                    style={{ fontSize: 28, padding: '8px 18px', borderRadius: 8, border: '2px solid #EC407A', width: 150, fontWeight: 'bold', color: '#C2185B', textAlign: 'right', background: '#fff' }}
                  />
                  <Typography fontWeight="bold" color="#EC407A" sx={{ fontSize: 26, ml: 1 }}>P</Typography>
                </Box>
                {/* 金額表示のデザインを他プランと完全統一 */}
                <Typography variant="h3" fontWeight="bold" color="#EC407A" sx={{ letterSpacing: 1, display: 'inline-flex', alignItems: 'flex-end', lineHeight: 1 }}>
                  {customPoints && !isNaN(Number(customPoints)) ? Number(customPoints).toLocaleString() : '0'}
                  <span style={{ fontSize: '1.3rem', marginLeft: 2, lineHeight: 1, display: 'inline-block', verticalAlign: 'bottom' }}>P</span>
                </Typography>
                <Typography sx={{ color: '#888', fontSize: '0.95rem', mt: 1, mb: 1, fontWeight: 'bold', lineHeight: 1 }}>
                  {customPoints && !isNaN(Number(customPoints)) ? Math.ceil(Number(customPoints) * CUSTOM_PRICE_PER_POINT).toLocaleString() : '0'}円<span style={{ fontSize: '0.85em' }}>(税込)</span>
                </Typography>
              </Box>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                sx={{ borderRadius: 5, px: 5, fontWeight: 'bold', letterSpacing: 1 }}
                onClick={handleCustomPurchase}
                disabled={!customPoints || Number(customPoints) < 100}
              >
                このポイント数で購入
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      {/* パックの見出し */}
      <Typography variant="h5" color="#C2185B" fontWeight="bold" align="center" mt={5} mb={2} letterSpacing={2}>
        お得なポイントパック
      </Typography>
      <Grid container spacing={3}>
        {POINT_PLANS.map(plan => {
          const price = Math.ceil(plan.points * PRICE_PER_POINT);
          return (
            <Grid item xs={12} sm={6} key={plan.id}>
              <Card sx={{ borderRadius: 3, boxShadow: 4, position: 'relative', border: '2px solid #F8BBD0', height: '100%' }}>
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
                {selectedPlan.custom_price_per_point ? Math.ceil(selectedPlan.points * selectedPlan.custom_price_per_point).toLocaleString() : Math.ceil(selectedPlan.points * PRICE_PER_POINT).toLocaleString()}円<span style={{ fontSize: '0.85em' }}>(税込)</span>
              </Typography>
            </div>
            <ElementsPaymentForm
              amount={selectedPlan.custom_price_per_point ? Math.ceil(selectedPlan.points * selectedPlan.custom_price_per_point) : Math.ceil(selectedPlan.points * PRICE_PER_POINT)}
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
