import React from 'react';
import { Box, Typography, Alert, AlertTitle, Button, Chip, Paper } from '@mui/material';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface VerificationStatusProps {
  status: string;
  message?: string;
  submittedAt?: string | null;
  reviewedAt?: string | null;
  onResubmit?: () => void;
}

const VerificationStatus: React.FC<VerificationStatusProps> = ({ 
  status, 
  message, 
  submittedAt, 
  reviewedAt,
  onResubmit 
}) => {
  const getStatusDisplay = () => {
    switch (status) {
      case 'pending':
        return {
          title: '審査中',
          description: '書類の審査を行っています。審査には1〜3営業日ほどお時間をいただいております。',
          icon: <PendingIcon fontSize="large" color="warning" />,
          color: 'warning',
          chipLabel: '審査中'
        };
      case 'approved':
        return {
          title: '承認済み',
          description: '本人確認が完了しました。',
          icon: <CheckCircleIcon fontSize="large" color="success" />,
          color: 'success',
          chipLabel: '承認済み'
        };
      case 'rejected':
        return {
          title: '差し戻し',
          description: '書類に不備があります。以下のメッセージを確認し、再提出してください。',
          icon: <ErrorIcon fontSize="large" color="error" />,
          color: 'error',
          chipLabel: '差し戻し'
        };
      default:
        return {
          title: '未提出',
          description: '本人確認書類を提出してください。',
          icon: null,
          color: 'default',
          chipLabel: '未提出'
        };
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return format(date, 'yyyy年MM月dd日 HH:mm', { locale: ja });
    } catch (e) {
      return dateString;
    }
  };

  const statusInfo = getStatusDisplay();

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2" sx={{ mr: 2 }}>
          申請ステータス
        </Typography>
        <Chip
          label={statusInfo.chipLabel}
          color={statusInfo.color as any}
          size="medium"
        />
      </Box>

      <Alert
        severity={statusInfo.color as any}
        icon={statusInfo.icon}
        sx={{ mb: 3 }}
      >
        <AlertTitle>{statusInfo.title}</AlertTitle>
        {statusInfo.description}
      </Alert>

      {(status === 'pending' || status === 'approved' || status === 'rejected') && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            申請情報
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex' }}>
                <Typography variant="body2" sx={{ width: '120px', fontWeight: 'bold' }}>
                  申請日時:
                </Typography>
                <Typography variant="body2">
                  {formatDate(submittedAt)}
                </Typography>
              </Box>
              {reviewedAt && (
                <Box sx={{ display: 'flex' }}>
                  <Typography variant="body2" sx={{ width: '120px', fontWeight: 'bold' }}>
                    審査日時:
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(reviewedAt)}
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      )}

      {status === 'rejected' && message && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            運営からのメッセージ
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
            <Typography variant="body1">{message}</Typography>
          </Paper>
        </Box>
      )}

      {status === 'rejected' && onResubmit && (
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={onResubmit}
        >
          書類を再提出する
        </Button>
      )}
    </Box>
  );
};

export default VerificationStatus;
