// p/cast/layout.tsx
'use client';

import React from 'react';
import { CssBaseline, Box } from '@mui/material';
import Header from './shared/Header';

export default function CastLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ width: '100%', minHeight: '100vh', overflowX: 'hidden' }}>
      <CssBaseline />
      
      {/* ✅ ヘッダー適用 */}
      <Header />

      <Box py={4}>
        {children}
      </Box>
    </Box>
  );
}
