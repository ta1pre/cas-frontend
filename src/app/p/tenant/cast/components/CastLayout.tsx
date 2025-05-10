import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function CastLayout({ children }: Props) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box sx={{ width: 240, bgcolor: '#f5f5f5', p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>キャスト管理</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography>キャスト一覧</Typography>
          <Typography>新規登録</Typography>
          <Typography>設定</Typography>
        </Box>
      </Box>
      <Box sx={{ flex: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}
