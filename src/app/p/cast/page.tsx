'use client';

import React from 'react';
import { Container, Typography, Box } from '@mui/material';

export default function CastDashboard() {
  return (
    <Container maxWidth="md">
      <Box textAlign="center" py={5} className="bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-lg shadow-lg p-6">
        <Typography variant="h4" gutterBottom className="text-4xl font-bold">
          ダッシュボード
        </Typography>
        <Typography variant="body1" className="text-lg">
          ここはキャスト専用のページです。
        </Typography>
      </Box>
    </Container>
  );
}
