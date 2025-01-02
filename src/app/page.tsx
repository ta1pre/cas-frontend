'use client';

import React from 'react';
import Link from 'next/link';
import { Typography, Button, Container, Box } from '@mui/material';

export default function HomePage() {
  return (
    <Container maxWidth="md">
      <Box textAlign="center" mt={5}>
        <Typography variant="h3" gutterBottom>
          ようこそ！エステ予約アプリへ
        </Typography>
        <Typography variant="body1" gutterBottom>
          当アプリでは、セラピストの検索や予約、チャット機能を通じて快適なサービスを提供します。
        </Typography>
        <Box mt={3}>
          <Link href="/auth/login" passHref>
            <Button variant="contained">ログイン</Button>
          </Link>
          <Link href="/auth/register" passHref>
            <Button variant="outlined" style={{ marginLeft: '10px' }}>
              新規登録
            </Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );
}
