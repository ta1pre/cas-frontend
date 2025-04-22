import React from 'react';
import { Box, Typography, Paper, Chip, Button, Divider } from '@mui/material';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import Link from 'next/link';

interface IdentityVerificationCardProps {
  status: string;
  message?: string;
  submittedAt?: string | null;
  reviewedAt?: string | null;
}

const IdentityVerificationCard: React.FC<IdentityVerificationCardProps> = ({
  status,
  message,
  submittedAt,
  reviewedAt
}) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'pending':
        return {
          title: '審査中',
          description: '書類の審査を行っています。審査には1営業日ほどお時間をいただいております。',
          icon: <PendingIcon fontSize="medium" color="warning" />,
          color: 'warning',
          chipLabel: '審査中'
        };
      case 'approved':
        return {
          title: '承認済み',
          description: '本人確認が完了しました。',
          icon: <CheckCircleIcon fontSize="medium" color="success" />,
          color: 'success',
          chipLabel: '承認済み'
        };
      case 'rejected':
        return {
          title: '差し戻し',
          description: '書類に不備があります。メッセージを確認し、再提出してください。',
          icon: <ErrorIcon fontSize="medium" color="error" />,
          color: 'error',
          chipLabel: '差し戻し'
        };
      default:
        return {
          title: '未提出',
          description: '本人確認書類を提出してください。本人確認終了後、予約受付が可能になります。',
          icon: <WarningIcon fontSize="medium" color="error" />,
          color: 'error',
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

  const statusInfo = getStatusInfo();

  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">
          本人確認と口座登録
        </Typography>
        <Chip
          icon={statusInfo.icon}
          label={statusInfo.chipLabel}
          color={statusInfo.color as any}
          size="medium"
        />
      </Box>

      <Typography variant="body1" sx={{ mb: 2 }}>
        {statusInfo.description}
      </Typography>

      {(status === 'pending' || status === 'approved' || status === 'rejected') && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', mb: 1 }}>
              <Typography variant="body2" sx={{ width: '100px', fontWeight: 'bold' }}>
                申請日時:
              </Typography>
              <Typography variant="body2">
                {formatDate(submittedAt)}
              </Typography>
            </Box>
            {reviewedAt && (
              <Box sx={{ display: 'flex' }}>
                <Typography variant="body2" sx={{ width: '100px', fontWeight: 'bold' }}>
                  審査日時:
                </Typography>
                <Typography variant="body2">
                  {formatDate(reviewedAt)}
                </Typography>
              </Box>
            )}
          </Box>
        </>
      )}

      {status === 'rejected' && message && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            運営からのメッセージ:
          </Typography>
          <Typography variant="body2" color="error.main">
            {message}
          </Typography>
        </Box>
      )}

      <Box sx={{ mt: 'auto', pt: 2 }}>
        <Link href="/p/cast/cont/identity_verification" passHref>
          <Button
            variant={status === 'rejected' || status === 'unsubmitted' ? 'contained' : 'outlined'}
            color="primary"
            fullWidth
          >
            {status === 'rejected' ? '書類を再提出する' : 
             status === 'unsubmitted' ? '本人確認を行う' : 
             '詳細を確認する'}
          </Button>
        </Link>
      </Box>
    </Paper>
  );
};

export default IdentityVerificationCard;
