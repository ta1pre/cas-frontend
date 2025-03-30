// src/app/p/cast/cont/prof/components/PhotoUploadForm.tsx
'use client';

import React, { useState } from 'react';
import { Box, Typography, Button, Container, Grid, Alert } from '@mui/material';
import ProfPost from '@/app/p/cast/components/media/ProfPost';
import useMediaStatus from '@/app/p/cast/components/media/common/useMediaStatus';
import useUser from '@/hooks/useUser';
import PhotoIcon from '@mui/icons-material/Photo';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

/**
 * 写真アップロードフォームのProps
 */
interface PhotoUploadFormProps {
  onClose: () => void;
}

/**
 * 写真アップロードフォームコンポーネント
 * @param onClose フォームを閉じる関数
 */
export default function PhotoUploadForm({ onClose }: PhotoUploadFormProps): React.JSX.Element {
  const user = useUser();
  const targetType = "profile_common";
  const targetId = user?.user_id ?? null;
  const orderIndexes = [0, 1, 2, 3, 4, 5];

  const [uploadTrigger, setUploadTrigger] = useState(0);
  const mediaStatus = useMediaStatus(targetType, targetId, orderIndexes, uploadTrigger);
  const isMainUploaded = mediaStatus[0] || false; // メイン画像がアップロードされているか

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
          <PhotoIcon sx={{ color: '#ff69b4', mr: 1, fontSize: 20 }} />
          プロフィール写真を登録・編集できます
        </Typography>
        
        <Alert 
          severity={isMainUploaded ? "success" : "warning"}
          icon={isMainUploaded ? <CheckCircleIcon fontSize="inherit" /> : undefined}
          sx={{ 
            mb: 2, 
            borderRadius: 2,
            bgcolor: isMainUploaded ? 'rgba(46, 125, 50, 0.1)' : 'rgba(237, 108, 2, 0.1)',
            '& .MuiAlert-icon': { color: isMainUploaded ? '#2e7d32' : '#ed6c02' }
          }}
        >
          {isMainUploaded 
            ? "メイン画像（左上）が登録されています" 
            : "メイン画像（左上）を登録してください。プロフィールに表示される重要な写真です。"}
        </Alert>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          ※ 最大6枚まで登録できます。左上の画像がメイン写真として表示されます。
        </Typography>
      </Box>

      {/* 画像アップロードグリッド */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {orderIndexes.map((index) => (
          <Grid item xs={6} sm={4} key={index}>
            <Box sx={{
              border: index === 0 ? '2px solid #ff69b4' : '1px solid #e0e0e0',
              borderRadius: 2,
              padding: 0.5,
              backgroundColor: index === 0 ? 'rgba(255, 105, 180, 0.05)' : 'transparent'
            }}>
              <ProfPost
                orderIndex={index}
                onUploadComplete={() => setUploadTrigger((prev) => prev + 1)}
              />
              {index === 0 && (
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: '#ff69b4', fontWeight: 'bold' }}>
                  メイン写真
                </Typography>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* 保存ボタン */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ 
            borderColor: '#999',
            color: '#666',
            '&:hover': { borderColor: '#666', backgroundColor: 'rgba(0, 0, 0, 0.04)' }
          }}
        >
          閉じる
        </Button>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{ 
            bgcolor: '#ff69b4', 
            '&:hover': { bgcolor: '#ff5ba7' },
            color: 'white',
            fontWeight: 'bold'
          }}
        >
          保存
        </Button>
      </Box>
    </Container>
  );
}
