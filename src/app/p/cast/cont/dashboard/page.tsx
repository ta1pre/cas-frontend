"use client";

import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Paper, Box, CircularProgress } from '@mui/material';
import IdentityVerificationCard from '@/app/p/cast/cont/dashboard/components/IdentityVerificationCard';
import { getVerificationStatus } from '../identity_verification/services/identityService';

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
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        ダッシュボード
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        アカウント情報と各種ステータスを確認できます。
      </Typography>

      <Grid container spacing={3}>
        {/* 本人確認ステータスカード */}
        <Grid item xs={12} md={6}>
          <IdentityVerificationCard 
            status={verificationData.status}
            message={verificationData.rejection_reason || ''}
            submittedAt={verificationData.submitted_at}
            reviewedAt={verificationData.reviewed_at}
          />
        </Grid>

        {/* 他のカードをここに追加できます */}
      </Grid>
    </Container>
  );
};

export default DashboardPage;
