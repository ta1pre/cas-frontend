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
  const [verificationData, setVerificationData] = useState<VerificationDataType>({
    status: 'unsubmitted',
    message: '',
    submitted_at: null,
    reviewed_at: null,
    rejection_reason: null
  });

  // 初期ロード時に本人確認ステータスを取得
  useEffect(() => {
    fetchVerificationStatus();
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

      {/* ウェルカムカード - 最初に表示 */}
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <Box sx={{ 
          background: 'linear-gradient(45deg, #ff69b4, #ff8fbf)', 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between'
        }}>
          <Typography variant="subtitle1" fontWeight="medium" color="white">
            おはようございます！
          </Typography>
          <NotificationsIcon sx={{ color: 'white' }} />
        </Box>
      </Card>

      {/* お知らせカード - 2番目に表示 */}
      <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', mb: 3 }}>
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
          </Box>
        </CardContent>
      </Card>

      {/* 本人確認ステータスカード */}
      <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <VerifiedUserIcon sx={{ color: '#ff69b4', mr: 1, fontSize: 20 }} />
            <Typography variant="subtitle1" fontWeight="medium">
              本人確認と口座登録
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
    </Container>
  );
};

export default DashboardPage;
