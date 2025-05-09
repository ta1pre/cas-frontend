"use client";

import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, Paper, Box, CircularProgress, 
  Card, CardContent, IconButton, Divider, Avatar, Button, Link
} from '@mui/material';
import IdentityVerificationCard from '@/app/p/cast/cont/dashboard/components/IdentityVerificationCard';
import AvailableButton from './components/AvailableButton';
import { getVerificationStatus } from '../identity_verification/services/identityService';
import { fetchProfileApi } from '../prof/api/profileApi';
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
  const [profile, setProfile] = useState<{ name?: string }>({});

  // 初期ロード時に本人確認ステータスを取得
  useEffect(() => {
    fetchVerificationStatus();
    // プロフィール情報取得
    fetchProfileApi().then((data) => {
      setProfile({ name: data?.name });
    });
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
      {/* 挨拶メッセージ - ボタンの上に左寄せで */}
      {profile.name && (
        <Typography variant="body1" sx={{ color: '#333', mb: 2, fontSize: '1rem' }}>
          {profile.name}さん、こんにちは
        </Typography>
      )}
      {/* 利用可能ボタン - ホームの下に移動 */}
      {verificationData.status === 'approved' && <AvailableButton />}
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
              <b>今がもっともお得！</b><br />
              お友達を紹介して、ポイントをゲットしよう♪
              <br />
              <Link href="/p/cast/cont/referral" underline="always" sx={{ color: '#ff69b4', fontWeight: 'bold' }}>
                紹介プログラムはこちら
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* 公式LINE案内カード - ここでお知らせや最新情報が届きます */}
      <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', mb: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1" fontWeight="medium" color="#06c755">
              公式LINEはこちら
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mt: 1 }}>
            <Link href="https://lin.ee/D59hzsB" target="_blank" rel="noopener noreferrer">
              <Button
                variant="contained"
                sx={{ bgcolor: '#06c755', color: 'white', borderRadius: 2, px: 3, py: 1, fontWeight: 'bold', boxShadow: 'none', '&:hover': { bgcolor: '#32d071' } }}
              >
                公式LINEで友だち追加
              </Button>
            </Link>
            <Typography variant="caption" sx={{ mt: 1, color: '#888' }}>
            <b>AIが24時間質問に回答します！</b><br />
            不安な方は<b>オペレーターにも直接相談</b>もできます。
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
