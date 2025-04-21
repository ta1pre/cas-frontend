"use client";

import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, Paper, Box, CircularProgress, 
  Card, CardContent, IconButton, Divider, Avatar
} from '@mui/material';
import IdentityVerificationCard from '@/app/p/cast/cont/dashboard/components/IdentityVerificationCard';
import { getVerificationStatus } from '../identity_verification/services/identityService';
import HomeIcon from '@mui/icons-material/Home';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CampaignIcon from '@mui/icons-material/Campaign';
import EventNoteIcon from '@mui/icons-material/EventNote';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Cookies from 'js-cookie';

interface VerificationDataType {
  status: string;
  message: string;
  submitted_at: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
}

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [castType, setCastType] = useState<string>('通常キャスト'); 
  const [verificationData, setVerificationData] = useState<VerificationDataType>({
    status: 'unsubmitted',
    message: '',
    submitted_at: null,
    reviewed_at: null,
    rejection_reason: null
  });

  // 初期ロード時に本人確認ステータスを取得とキャストタイプの設定
  useEffect(() => {
    fetchVerificationStatus();
    
    // クッキーからキャストタイプを判定
    const startPage = Cookies.get('StartPage');
    if (startPage === 'cast:precas') {
      setCastType('高収入キャスト');
    } else if (startPage === 'cast:cas') {
      setCastType('通常キャスト');
    }
  }, []);

  // 本人確認ステータスを取得
  const fetchVerificationStatus = async () => {
    try {
      setIsLoading(true);
      const response = await getVerificationStatus();
      
      // レスポンスがnullの場合のデフォルト値を設定
      if (response === null) {
        setVerificationData({
          status: 'unsubmitted',
          message: '',
          submitted_at: null,
          reviewed_at: null,
          rejection_reason: null
        });
      } else {
        setVerificationData(response);
      }
    } catch (error) {
      console.error('本人確認ステータス取得エラー:', error);
      // エラー時はデフォルト値を設定
      setVerificationData({
        status: 'unsubmitted',
        message: '',
        submitted_at: null,
        reviewed_at: null,
        rejection_reason: null
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress sx={{ color: '#ff69b4' }} />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 3, px: 2 }}>
      {/* ヘッダー */}
      <Box className="flex items-center space-x-2 mb-4">
        <HomeIcon sx={{ color: '#ff69b4', fontSize: 28 }} />
        <Typography variant="h6" fontWeight="bold" color="#333">
          ホーム
        </Typography>
      </Box>

      {/* ウェルカムカード */}
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <Box sx={{ 
          background: castType === '高収入キャスト' ? 'linear-gradient(45deg, #ff69b4, #ff8fbf)' : 'linear-gradient(45deg, #87ceeb, #4682b4)', 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between'
        }}>
          <Typography variant="subtitle1" fontWeight="medium" color={castType === '高収入キャスト' ? 'white' : 'white'}>
            おはようございます！
          </Typography>
          <NotificationsIcon sx={{ color: castType === '高収入キャスト' ? 'white' : 'white' }} />
        </Box>
        <CardContent sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            今日も素敵な一日をお過ごしください。
          </Typography>
          {/* キャストタイプ表示 */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            backgroundColor: castType === '高収入キャスト' ? '#fff0f5' : '#f0f8ff',
            borderRadius: 1,
            p: 1,
            mt: 1
          }}>
            <Typography 
              variant="body2" 
              fontWeight="bold" 
              sx={{ 
                color: castType === '高収入キャスト' ? '#ff4081' : '#4169e1',
              }}
            >
              {castType}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        {/* 本人確認ステータスカード */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <VerifiedUserIcon sx={{ color: '#ff69b4', mr: 1, fontSize: 20 }} />
                <Typography variant="subtitle1" fontWeight="medium">
                  本人確認ステータス
                </Typography>
              </Box>
              <IdentityVerificationCard 
                status={verificationData.status}
                message={verificationData.rejection_reason || ''}
                submittedAt={verificationData.submitted_at}
                reviewedAt={verificationData.reviewed_at}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* 予約状況カード */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <EventNoteIcon sx={{ color: '#ff69b4', mr: 1, fontSize: 20 }} />
                <Typography variant="subtitle1" fontWeight="medium">
                  予約状況
                </Typography>
              </Box>
              <Box sx={{ p: 1, bgcolor: '#f9f9f9', borderRadius: 1, mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  現在の予約：0件
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                予約管理ページで詳細を確認できます。
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* キャンペーン情報カード */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <CampaignIcon sx={{ color: '#ff69b4', mr: 1, fontSize: 20 }} />
                <Typography variant="subtitle1" fontWeight="medium">
                  お知らせ
                </Typography>
              </Box>
              <Box sx={{ p: 1.5, bgcolor: '#fff0f5', borderRadius: 1 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  ・春の新規登録キャンペーン実施中！
                </Typography>
                <Typography variant="body2">
                  ・プロフィール写真を登録すると特典があります！
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
