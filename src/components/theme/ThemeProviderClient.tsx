// frontapp/src/components/theme/ThemeProviderClient.tsx

'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useMemo } from 'react';
import theme from "@/styles/theme"; // ✅ `theme.ts` を import

export default function ThemeProviderClient({ children }: { children: React.ReactNode }) {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
