"use client";

import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, Paper, Box, CircularProgress, 
  Card, CardContent, IconButton, Divider, Avatar, SvgIcon, Button, Link
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
              ・新規登録キャンペーン実施中！
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* 公式LINE案内カード - ここでお知らせや最新情報が届きます */}
      <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', mb: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            {/* LINEアイコン（SVG） */}
            <SvgIcon sx={{ color: '#06c755', mr: 1, fontSize: 24 }}>
              <path d="M20.666 3.999C19.133 2.466 16.667 2 12 2S4.867 2.466 3.334 3.999C1.8 5.533 1.333 8 1.333 12c0 4 0.467 6.467 2 8.001C4.867 21.534 7.333 22 12 22s7.133-0.466 8.666-2C22.2 18.467 22.667 16 22.667 12c0-4-0.467-6.467-2.001-8.001zM12 20c-4.667 0-7.133-0.466-8.667-2C2.133 16.467 1.667 14 1.667 12c0-2 0.466-4.467 2-6.001C4.867 4.466 7.333 4 12 4s7.133 0.466 8.667 2C21.867 7.533 22.333 10 22.333 12c0 2-0.466 4.467-2 6.001C19.133 19.534 16.667 20 12 20zm-0.667-8.667h1.334v3.334h-1.334v-3.334zm-2.666 0h1.334v3.334h-1.334v-3.334zm5.334 0h1.334v3.334h-1.334v-3.334z" />
            </SvgIcon>
            <Typography variant="subtitle1" fontWeight="medium" color="#06c755">
              公式LINEはこちら
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mt: 1 }}>
            <Link href="https://lin.ee/D59hzsB" target="_blank" rel="noopener noreferrer">
              <Button
                variant="contained"
                sx={{ bgcolor: '#06c755', color: 'white', borderRadius: 2, px: 3, py: 1, fontWeight: 'bold', boxShadow: 'none', '&:hover': { bgcolor: '#32d071' } }}
                startIcon={
                  <SvgIcon sx={{ fontSize: 22 }}>
                    <path d="M20.666 3.999C19.133 2.466 16.667 2 12 2S4.867 2.466 3.334 3.999C1.8 5.533 1.333 8 1.333 12c0 4 0.467 6.467 2 8.001C4.867 21.534 7.333 22 12 22s7.133-0.466 8.666-2C22.2 18.467 22.667 16 22.667 12c0-4-0.467-6.467-2.001-8.001zM12 20c-4.667 0-7.133-0.466-8.667-2C2.133 16.467 1.667 14 1.667 12c0-2 0.466-4.467 2-6.001C4.867 4.466 7.333 4 12 4s7.133 0.466 8.667 2C21.867 7.533 22.333 10 22.333 12c0 2-0.466 4.467-2 6.001C19.133 19.534 16.667 20 12 20zm-0.667-8.667h1.334v3.334h-1.334v-3.334zm-2.666 0h1.334v3.334h-1.334v-3.334zm5.334 0h1.334v3.334h-1.334v-3.334z" />
                  </SvgIcon>
                }
              >
                公式LINEで友だち追加
              </Button>
            </Link>
            <Typography variant="caption" sx={{ mt: 1, color: '#888' }}>
              お知らせや最新情報は公式LINEでお届けします。
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
