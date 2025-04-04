'use client';

import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import NicknameForm from './components/nickname/NicknameForm';

export default function AccountPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 4, textAlign: 'center' }}>
        アカウント情報
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <NicknameForm />
      </Paper>
      
      {/* 将来的に他のアカウント設定を追加する場合はここに追加 */}
    </Container>
  );
}
