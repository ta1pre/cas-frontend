'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import BasicTraits from '@/app/p/cast/components/traits/components/BasicTraits';
import { useTraits } from '@/app/p/cast/components/traits/hooks/useTraits';

interface Props {
  onClose: () => void;
}

export default function TraitsForm({ onClose }: Props): React.JSX.Element {
  const { selectedTraits, error } = useTraits();
  const [traits, setTraits] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 初回データ取得
  useEffect(() => {
    setTimeout(() => {
      setTraits(selectedTraits);
      setIsLoading(false);
    }, 500);
  }, [selectedTraits]);

  // 特徴が変更されたらリアルタイムで更新
  const handleTraitChange = (updatedTraits: number[]) => {
    setTraits(updatedTraits);
    setSaveSuccess(true);
    
    // 成功メッセージを3秒後に非表示
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        p: 3,
        gap: 2,
        overflow: 'auto'
      }}
    >
      {/* ヘッダー */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
        特徴を選択
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        あなたの特徴を選択してください。複数選択できます。
      </Typography>

      {/* 成功メッセージ */}
      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          特徴を更新しました
        </Alert>
      )}

      {/* エラーメッセージ */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* 選択状態の表示 */}
      <Typography variant="body2" color={traits.length > 0 ? "success.main" : "error.main"} sx={{ mb: 1 }}>
        {isLoading
          ? "🔄 読み込み中..."
          : traits.length > 0
            ? `✅ 選択済み: ${traits.length}件`
            : "⚠️ 1つ以上選択してください"}
      </Typography>

      {/* 特徴選択コンポーネント */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <BasicTraits onTraitsChange={handleTraitChange} />
      )}

      {/* 閉じるボタン */}
      <Button
        variant="outlined"
        color="primary"
        onClick={onClose}
        sx={{ mt: 3, alignSelf: 'center' }}
      >
        閉じる
      </Button>
    </Box>
  );
}
