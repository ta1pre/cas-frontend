import { Box, Typography } from '@mui/material';
import { Cast } from '../types/castTypes';

type Props = {
  cast: Cast;
};

export default function CastItem({ cast }: Props) {
  console.log('\u30ad\u30e3\u30b9\u30c8\u30a2\u30a4\u30c6\u30e0\u30ec\u30f3\u30c0\u30ea\u30f3\u30b0:', cast);
  return (
    <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.3s', '&:hover': { backgroundColor: '#f9f9f9', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' } }}>
      <Box>
        <Typography variant="caption" color="text.secondary">ID: {cast.id}</Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{cast.name}</Typography>
      </Box>
      <Box>
        <Typography variant="body2" color="primary">詳細</Typography>
      </Box>
    </Box>
  );
}
