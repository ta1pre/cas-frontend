'use client';

import React, { useEffect } from 'react';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Link from 'next/link';

// TODO: ポイント残高を更新する処理を追加する (例: サーバーサイドでWebhookを処理した後、クライアント側で再取得)
// import useUser from '@/hooks/useUser';

export default function PointPurchaseSuccessPage() {
  // const user = useUser();

  useEffect(() => {
    // このページが表示されたタイミングで、バックエンドのWebhookが処理されて
    // ポイントが更新されていることを期待。
    // 必要であれば、ここでユーザー情報を再取得してポイント残高を更新するAPIを叩く。
    // 例: fetchUserProfile();
    console.log('Purchase success page loaded.');

    // オプション: 数秒後に自動でマイページなどに遷移させる場合
    // const timer = setTimeout(() => {
    //   // router.push('/mypage'); // Next.jsのrouterを使用する場合
    // }, 5000);
    // return () => clearTimeout(timer);
  }, []);

  return (
    <Container maxWidth="sm" sx={{ py: 5, textAlign: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, backgroundColor: 'rgba(144, 238, 144, 0.1)' /* 例: 薄い緑 */ }}>
        <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'success.main', fontWeight: 'bold' }}>
          購入完了！
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          ポイントの購入手続きが正常に完了しました。
          ご利用ありがとうございます！
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          {/* TODO: 実際のポイント履歴ページのパスに修正 */}
          <Button component={Link} href="/p/customer/points" variant="outlined" color="primary">
            ポイント履歴を見る
          </Button>
          {/* TODO: 実際のトップページやマイページのパスに修正 */}
          <Button component={Link} href="/" variant="contained" color="primary">
            トップページへ
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
