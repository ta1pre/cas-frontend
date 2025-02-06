'use client';

import React from 'react';
import Link from 'next/link';
import { Container, Box, Typography } from '@mui/material';
import CustomButton from '@/components/ui/CustomButton';

export default function HomePage() {
  return (
    <Container maxWidth="md" className="flex flex-col items-center justify-center min-h-screen p-4">
      <Box textAlign="center" mt={5}>
        <Typography variant="h3" gutterBottom className="text-3xl font-bold text-blue-600">
          ようこそ！予約アプリへ
        </Typography>
        <Typography variant="body1" gutterBottom className="text-lg text-gray-700">
          当アプリでは、セラピストの検索や予約、チャット機能を通じて快適なサービスを提供します。
        </Typography>
        <Box mt={3} className="flex gap-4 justify-center">
          <Link href="/auth/login" passHref>
            <CustomButton onClick={() => console.log('ログイン')} label="ログイン" color="primary" />
          </Link>
          <Link href="/auth/register" passHref>
            <CustomButton onClick={() => console.log('新規登録')} label="新規登録" variant="outlined" color="secondary" />
          </Link>
        </Box>
      </Box>
    </Container>
  );
}
