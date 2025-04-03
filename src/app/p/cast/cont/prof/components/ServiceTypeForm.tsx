'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Alert, Chip } from '@mui/material';
import BasicServiceType from '@/app/p/cast/components/servicetype/components/BasicServiceType';
import { useServiceType } from '@/app/p/cast/components/servicetype/hooks/useServiceType';
import useProfileApi from '../api/useProfileApi';

interface Props {
  onClose: () => void;
}

// キャストタイプの表示名マッピング
const CAST_TYPE_DISPLAY = {
  'A': 'Aタイプ（女性向け）',
  'B': 'Bタイプ（男性向け）',
  'AB': 'ABタイプ（両方対応）',
};

export default function ServiceTypeForm({ onClose }: Props): React.JSX.Element {
  const { selectedServiceTypes, error } = useServiceType();
  const { fetchProfile, loading: profileLoading } = useProfileApi();
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [selectedServiceNames, setSelectedServiceNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [castType, setCastType] = useState<string | undefined>();

  // 初回データ取得
  useEffect(() => {
    const loadData = async () => {
      try {
        // プロフィール情報を取得してcast_typeを設定
        // キャストIDを0（自分自身）として渡す
        const profileData = await fetchProfile(0);
        // profileDataがnullの場合にエラーを吐く
        if (profileData) {
          setCastType(profileData.cast_type);
        }
      } catch (error) {
        console.error('プロフィール取得エラー:', error);
      } finally {
        setTimeout(() => {
          setSelectedServices(selectedServiceTypes);
          setIsLoading(false);
        }, 500);
      }
    };
    
    loadData();
  }, [selectedServiceTypes, fetchProfile]);

  // サービスタイプが変更されたらリアルタイムで更新
  const handleServiceChange = (updatedServices: number[], updatedNames: string[]) => {
    setSelectedServices(updatedServices);
    setSelectedServiceNames(updatedNames);
    setSaveSuccess(true);
    
    // 成功メッセージを3秒後に非表示
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  // キャストタイプの表示名を取得
  const getCastTypeDisplay = (type?: string) => {
    if (!type) return '未設定';
    return CAST_TYPE_DISPLAY[type as keyof typeof CAST_TYPE_DISPLAY] || type;
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
        サービスタイプを選択
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        提供できるサービスを選択してください。複数選択できます。
      </Typography>

      {/* キャストタイプ表示 */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          現在のキャストタイプ:
        </Typography>
        <Chip 
          label={getCastTypeDisplay(castType)}
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 'medium' }}
        />
        {castType === 'A' && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.8rem' }}>
            ※ Aタイプでは「通常」カテゴリのサービスのみ選択できます
          </Typography>
        )}
      </Box>

      {/* 成功メッセージ */}
      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          サービスタイプを更新しました
        </Alert>
      )}

      {/* エラーメッセージ */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* 選択状態の表示 */}
      <Typography variant="body2" color={selectedServices.length > 0 ? "success.main" : "error.main"} sx={{ mb: 1 }}>
        {isLoading
          ? "🔄 読み込み中..."
          : selectedServices.length > 0
            ? `✅ 選択済み: ${selectedServiceNames.join(', ') || `${selectedServices.length}件`}`
            : "⚠️ 1つ以上選択してください"}
      </Typography>

      {/* サービスタイプ選択コンポーネント */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <BasicServiceType 
          onServiceChange={handleServiceChange} 
          castType={castType} // キャストタイプを渡す
        />
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
