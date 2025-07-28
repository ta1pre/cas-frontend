"use client";

import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Button, 
  Stepper, 
  Step, 
  StepLabel, 
  CircularProgress,
  LinearProgress,
  Alert
} from '@mui/material';
import VerificationStatus from './components/VerificationStatus';
import DocumentUploadCard from './components/DocumentUploadCard';
import { 
  getVerificationStatus, 
  getUploadProgress,
  uploadBasicDocument,
  uploadResidenceDocument
} from './services/identityService';

interface VerificationDataType {
  status: string;
  message: string;
  submitted_at: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
}

interface UploadProgressType {
  status: string;
  progress: {
    basic_document: {
      uploaded: boolean;
      uploaded_at?: string | null;
      file_name?: string | null;
    };
    residence_document: {
      uploaded: boolean;
      uploaded_at?: string | null;
      file_name?: string | null;
    };
  };
  completion_rate: number;
  current_step: string;
  next_action?: string;
}

const IdentityVerificationPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgressType | null>(null);
  
  // 本人確認ステータスの状態
  const [verificationData, setVerificationData] = useState<VerificationDataType>({
    status: 'unsubmitted',
    message: '',
    submitted_at: null,
    reviewed_at: null,
    rejection_reason: null
  });

  const steps = ['基本身分証', '住民票', '審査'];

  // 初期ロード時にステータスを取得
  useEffect(() => {
    fetchInitialData();
  }, []);

  // 初期データを取得
  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [statusData, progressData] = await Promise.all([
        getVerificationStatus(),
        getUploadProgress()
      ]);
      
      if (statusData) {
        setVerificationData(statusData);
      }
      
      if (progressData) {
        setUploadProgress(progressData);
        
        // 進捗に応じてステップを設定
        if (progressData.status === 'pending' || progressData.status === 'approved') {
          setActiveStep(2);
        } else if (progressData.progress.basic_document.uploaded && !progressData.progress.residence_document.uploaded) {
          setActiveStep(1);
        } else {
          setActiveStep(0);
        }
      }
      
    } catch (error) {
      console.error('初期データ取得エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 基本身分証をアップロード
  const handleBasicDocumentUpload = async (file: File, documentType: string) => {
    try {
      setIsUploading(true);
      const response = await uploadBasicDocument(file, documentType);
      
      if (response.success) {
        // 進捗を更新
        await fetchInitialData();
        setActiveStep(1);
      }
    } catch (error) {
      console.error('基本身分証アップロードエラー:', error);
      alert('基本身分証のアップロードに失敗しました。もう一度お試しください。');
    } finally {
      setIsUploading(false);
    }
  };

  // 住民票をアップロード
  const handleResidenceDocumentUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const response = await uploadResidenceDocument(file);
      
      if (response.success) {
        // 進捗を更新
        await fetchInitialData();
        setActiveStep(2);
      }
    } catch (error) {
      console.error('住民票アップロードエラー:', error);
      alert('住民票のアップロードに失敗しました。もう一度お試しください。');
    } finally {
      setIsUploading(false);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleResubmit = () => {
    setActiveStep(0);
    fetchInitialData();
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
          安全なサービス提供のため、身分証明書のアップロードをお願いします。
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* 進捗表示 */}
        {uploadProgress && uploadProgress.completion_rate > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              進捗: {uploadProgress.completion_rate}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={uploadProgress.completion_rate} 
              sx={{ mb: 2 }}
            />
          </Box>
        )}

        {/* 完了済みまたは審査中の場合 */}
        {verificationData && (verificationData.status === 'pending' || verificationData.status === 'approved') ? (
          <VerificationStatus 
            status={verificationData.status} 
            message={verificationData.rejection_reason || ''} 
            submittedAt={verificationData.submitted_at}
            reviewedAt={verificationData.reviewed_at}
          />
        ) : (
          <>
            {/* Step 0: 基本身分証アップロード */}
            {activeStep === 0 && (
              <DocumentUploadCard
                title="基本身分証をアップロード"
                subtitle="写真付きの身分証明書をアップロードしてください"
                acceptedTypes={['運転免許証', 'マイナンバーカード', 'パスポート', '住民基本台帳カード']}
                onUpload={handleBasicDocumentUpload}
                isUploading={isUploading}
                uploadedFile={uploadProgress?.progress.basic_document}
              />
            )}

            {/* Step 1: 住民票アップロード */}
            {activeStep === 1 && (
              <Box>
                <Alert severity="success" sx={{ mb: 3 }}>
                  ✅ 基本身分証のアップロードが完了しました！
                </Alert>
                <DocumentUploadCard
                  title="住民票をアップロード"
                  subtitle="発行から3ヶ月以内の住民票をアップロードしてください"
                  acceptedTypes={['住民票（PDF・JPG・PNG）']}
                  onUpload={(file) => handleResidenceDocumentUpload(file)}
                  isUploading={isUploading}
                  uploadedFile={uploadProgress?.progress.residence_document}
                />
              </Box>
            )}

            {/* Step 2: 審査待ち */}
            {activeStep === 2 && (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Alert severity="info" sx={{ mb: 3 }}>
                  📋 本人確認書類の提出が完了しました！
                </Alert>
                <Typography variant="h6" gutterBottom>
                  書類の審査中です
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  審査には1〜3営業日ほどお時間をいただいております。
                  審査結果はメールでお知らせします。
                </Typography>
              </Box>
            )}

            {/* ナビゲーションボタン */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0 || isUploading}
                onClick={handleBack}
                variant="outlined"
              >
                戻る
              </Button>
              {activeStep === steps.length - 1 && (
                <Button
                  variant="contained"
                  onClick={() => window.location.href = '/p/cast/cont/dashboard'}
                >
                  ダッシュボードに戻る
                </Button>
              )}
            </Box>
          </>
        )}

        {/* 却下された場合の再提出 */}
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