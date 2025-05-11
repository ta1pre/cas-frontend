import { Box, Typography, Button } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function CastLayout({ children }: Props) {
  return (
    <Box sx={{ minHeight: '100vh', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">キャスト管理</Typography>
      
      </Box>
      
      <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>キャスト一覧</Typography>
        {children}
      </Box>
    </Box>
  );
}
