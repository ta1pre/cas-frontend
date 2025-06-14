"use client";

import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, Button, Stepper, Step, StepLabel, CircularProgress } from '@mui/material';
import IdentityVerificationForm from './components/IdentityVerificationForm';
import BankAccountCard from './components/BankAccountCard';
import VerificationStatus from './components/VerificationStatus';
import { getVerificationStatus, getBankAccount, submitVerification } from './services/identityService';

interface VerificationDataType {
  status: string;
  message: string;
  submitted_at: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
}

interface BankAccount {
  bank_name: string;
  branch_name: string;
  branch_code: string;
  account_type: string;
  account_number: string;
  account_holder: string;
}

const IdentityVerificationPage = () => {
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
  const [bankSaved, setBankSaved] = useState(false);

  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 本人確認ステータスの状態
  const [verificationData, setVerificationData] = useState<VerificationDataType>({
    status: 'unsubmitted', // unsubmitted, pending, approved, rejected
    message: '',
    submitted_at: null,
    reviewed_at: null,
    rejection_reason: null
  });

  const steps = ['口座情報', '身分証アップロード', '審査待ち'];

  // 初期ロード時に本人確認ステータスを取得
  useEffect(() => {
    fetchVerificationStatus();
    fetchBankAccount();
  }, []);

  // 銀行口座取得
  const fetchBankAccount = async () => {
    try {
      const data = await getBankAccount();
      if (data) {
        setBankAccount(data);
        setBankSaved(true);
      }
    } catch (e) {
      console.error('銀行口座取得エラー', e);
    }
  };

  // 本人確認ステータスを取得
  const fetchVerificationStatus = async () => {
    try {
      setIsLoading(true);
      const response = await getVerificationStatus();
      console.log('本人確認ステータスレスポンス:', response);
      
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
      
      // ステータスに応じてステップを設定
      if (response && (response.status === 'pending' || response.status === 'approved')) {
        setActiveStep(2);
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

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      // 本人確認申請の提出はIdentityVerificationFormコンポーネントで行うため、ここでは呼び出さない
      // const response = await submitVerification();
      // setVerificationData(response);
      handleNext();
    } catch (error) {
      console.error('本人確認申請エラー:', error);
      alert('本人確認申請に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResubmit = () => {
    // 再提出の場合はステップを1に戻す
    setActiveStep(1);
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          本人確認
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          安全なサービス提供のため、本人確認書類のアップロードをお願いします。
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {verificationData && verificationData.status !== 'unsubmitted' && verificationData.status !== 'rejected' ? (
          <VerificationStatus 
            status={verificationData.status} 
            message={verificationData.rejection_reason || ''} 
            submittedAt={verificationData.submitted_at}
            reviewedAt={verificationData.reviewed_at}
          />
        ) : (
          <>
            {activeStep === 0 && (
              <BankAccountCard
                initialAccount={bankAccount}
                onSaveSuccess={(acc) => {
                  setBankAccount(acc);
                  setBankSaved(true);
                }}
              />
            )}

            {activeStep === 1 && (
              <IdentityVerificationForm 
                onSubmitSuccess={handleNext} 
                defaultServiceType={'B'}
                hideServiceTypeSelection={true}
              />
            )}

            {activeStep === 2 && (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography variant="h6" gutterBottom>
                  書類の審査中です
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  審査には1〜3営業日ほどお時間をいただいております。
                  審査結果はメールでお知らせします。
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0 || isSubmitting}
                onClick={handleBack}
                variant="outlined"
              >
                戻る
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={() => window.location.href = '/p/cast/cont/dashboard'}
                >
                  完了
                </Button>
              ) : activeStep === 0 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!bankSaved || isSubmitting}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : '次へ'}
                </Button>
              ) : null}
            </Box>
          </>
        )}

        {verificationData && verificationData.status === 'rejected' && (
          <VerificationStatus 
            status={verificationData.status} 
            message={verificationData.rejection_reason || ''} 
            submittedAt={verificationData.submitted_at}
            reviewedAt={verificationData.reviewed_at}
            onResubmit={handleResubmit}
          />
        )}
      </Paper>
    </Container>
  );
};

export default IdentityVerificationPage;
