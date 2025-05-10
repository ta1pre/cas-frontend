"use client";
import { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { fetchCasts } from '../api/cast';
import { Cast } from '../types/castTypes';
import CastItem from './CastItem';

export default function CastList() {
  const [casts, setCasts] = useState<Cast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('\u30ad\u30e3\u30b9\u30c8\u4e00\u89a7\u53d6\u5f97\u958b\u59cb');
    fetchCasts().then((data) => {
      console.log('\u53d6\u5f97\u3057\u305f\u30ad\u30e3\u30b9\u30c8\u30c7\u30fc\u30bf:', data);
      setCasts(data);
      setLoading(false);
    }).catch(err => {
      console.error('\u30ad\u30e3\u30b9\u30c8\u53d6\u5f97\u30a8\u30e9\u30fc:', err);
      setLoading(false);
    });
  }, []);

  console.log('\u30ec\u30f3\u30c0\u30ea\u30f3\u30b0\u76f4\u524d\u306e\u72b6\u614b - casts:', casts, 'loading:', loading);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>キャスト一覧</Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {casts.map((cast) => (
            <CastItem key={cast.id} cast={cast} />
          ))}
        </Box>
      )}
    </Paper>
  );
}
