'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useMemo } from 'react';

export default function ThemeProviderClient({ children }: { children: React.ReactNode }) {
  // ✅ useMemo を使って、テーマを毎回変えないようにする
  const theme = useMemo(() => createTheme({
    palette: {
      primary: { main: '#1976d2', dark: '#115293' },
      secondary: { main: '#dc004e', dark: '#9a0036' },
    },
  }), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
