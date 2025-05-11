"use client";
import { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { fetchCasts, createCast, saveCast } from '../api/cast';
import CastEditModal from './CastEditModal';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Cast } from '../types/castTypes';
import CastItem from './CastItem';

export default function CastList() {
  const [casts, setCasts] = useState<Cast[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false); // 新規登録用
  const [name, setName] = useState('');

  // 編集用モーダルの状態
  const [editOpen, setEditOpen] = useState(false);
  const [editingCast, setEditingCast] = useState<Cast | null>(null);

  // Snackbar通知用
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

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

  const handleSubmit = async () => {
    try {
      const newCast = await createCast(name);
      setCasts([...casts, newCast]);
      setOpen(false);
      setName('');
    } catch (error) {
      console.error('登録失敗詳細:', error);
      alert(`登録に失敗しました: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpen(true)}
        sx={{ my: 3 }}
      >
        キャスト追加
      </Button>

      {/* 新規登録ダイアログ */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>新規キャスト登録</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="キャスト名"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>キャンセル</Button>
          <Button onClick={handleSubmit} color="primary">登録</Button>
        </DialogActions>
      </Dialog>

      {/* 編集モーダル */}
      <CastEditModal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditingCast(null);
        }}
        cast={editingCast}
        onSave={async (values) => {
          try {
            const updated = await saveCast(values);
            setCasts((prev) => prev.map(c => c.id === values.cast_id ? { ...c, name: updated.name } : c));
            setSnackbar({ open: true, message: '保存しました', severity: 'success' });
          } catch (e) {
            setSnackbar({ open: true, message: '保存に失敗しました', severity: 'error' });
          }
        }}
      />

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>キャスト一覧</Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {casts.map((cast) => (
              <CastItem key={cast.id} cast={cast} onEdit={() => { setEditingCast(cast); setEditOpen(true); }} />
            ))}
          </Box>
        )}
      </Paper>
      {/* Snackbar通知 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}
