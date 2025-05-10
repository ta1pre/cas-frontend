import { Box, Typography, Paper } from '@mui/material';

export default function CastList() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>キャスト一覧</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {[1, 2, 3].map((i) => (
          <Box key={i} sx={{ p: 2, border: '1px solid #eee', borderRadius: 1 }}>
            <Typography>キャスト {i}</Typography>
            <Typography variant="body2" color="text.secondary">
              詳細情報がここに入ります
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
