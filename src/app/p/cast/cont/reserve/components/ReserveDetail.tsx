// 📂 src/app/p/cast/cont/reserve/components/ReserveDetail.tsx
"use client";

import React, { useEffect, useState } from "react";
import { fetchReservationDetail } from "../api/useFetchReservationDetail";
import { useCastUser } from "@/app/p/cast/hooks/useCastUser";
import ReserveEditForm from "./ReserveEditForm";
import MessagePanel from "./Message/MessagePanel";
import MessageToggleButton from "./Message/MessageToggleButton";
import { 
  Box, 
  Typography, 
  Button, 
  Chip, 
  Divider, 
  Grid,
  Paper,
  Stack,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import EventNoteIcon from '@mui/icons-material/EventNote';
import TrainIcon from '@mui/icons-material/Train';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import ChatIcon from '@mui/icons-material/Chat';

export default function ReservationDetail({ reservationId }: { reservationId: number }) {
  const [detail, setDetail] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const user = useCastUser();

  // 予約詳細データを取得
  const fetchDetail = async () => {
    setLoading(true);
    try {
      const data = await fetchReservationDetail(reservationId, user.user_id);
      console.log("受信した予約詳細データ:", data);
      if (data) {
        console.log("ステータス情報:", {
          status: data.status,
          color_code: data.color_code,
          cast_label: data.cast_label
        });
      }
      setDetail(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [reservationId, user.user_id]);

  // 編集モードの切り替え
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // 編集キャンセル時の処理
  const handleCancelEdit = () => {
    setIsEditing(false);
    // 最新の予約詳細を再取得
    fetchDetail();
  };

  // ステータスの色を取得（MUIのChipコンポーネント用）
  const getStatusColor = () => {
    const status = detail?.status;
    const colorCode = detail?.color_code;

    if (colorCode) {
      return colorCode;
    }

    switch (status) {
      case 'confirmed':
        return 'success'; // 緑
      case 'canceled':
      case 'cancelled':
        return 'error';   // 赤
      case 'requested':
      case 'adjusting':
      case 'waiting_user_confirm':
        return 'warning'; // 黄
      default:
        return 'default'; // グレー
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 8 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (!detail) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body1" color="error">
          予約情報を取得できませんでした
        </Typography>
      </Box>
    );
  }

  // 編集モード表示
  if (isEditing) {
    return <ReserveEditForm reservationId={reservationId} onCancel={handleCancelEdit} />;
  }

  // 詳細表示モード
  return (
    <Box sx={{ p: 3, pb: 8 }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          borderRadius: 3, 
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          position: 'relative',
          mb: 3,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          height: '4px', 
          bgcolor: detail.color_code || '#e0e0e0'
        }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Chip 
            label={detail.cast_label || "ステータス"}
            sx={{ 
              fontWeight: 'medium',
              borderRadius: '12px',
              px: 1,
              backgroundColor: detail.color_code || '#e0e0e0',
              color: '#ffffff'
            }}
          />
          <Typography variant="caption" color="text.secondary" fontWeight="medium">
            #{detail.reservation_id}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PersonIcon sx={{ mr: 1.5, color: '#9e9e9e' }} />
          <Typography variant="h6" fontWeight="medium">
            {detail.user_name}
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTimeIcon sx={{ mr: 1.5, color: '#9e9e9e' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  開始時間
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {new Date(detail.start_time).toLocaleString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTimeIcon sx={{ mr: 1.5, color: '#9e9e9e' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  終了時間
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {(() => {
                    const startDate = new Date(detail.start_time);
                    const endDate = new Date(startDate.getTime() + (detail.duration_minutes || 0) * 60000);
                    return endDate.toLocaleString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      weekday: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    });
                  })()}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {detail.station_name && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TrainIcon sx={{ mr: 1.5, color: '#9e9e9e' }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                最寄り駅
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {detail.station_name}
              </Typography>
            </Box>
          </Box>
        )}

        {detail.reservation_note && (
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <EventNoteIcon sx={{ mr: 1.5, color: '#9e9e9e', mt: 0.5 }} />
            <Box>
              <Typography variant="body2" color="text.secondary">
                メモ
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {detail.reservation_note}
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>

      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          borderRadius: 3, 
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          mb: 3
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, color: '#f06292', fontWeight: 'bold' }}>
          コース情報
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            {detail.course_name}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              基本報酬
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {detail.course_fee?.toLocaleString() || 0}円
            </Typography>
          </Grid>
          
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              指名料
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {detail.designation_fee?.toLocaleString() || 0}円
            </Typography>
          </Grid>
          
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              オプション料
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {(() => {
                const directFee = typeof detail.options_fee === 'number' ? detail.options_fee : 0;
                let calculatedFee = 0;
                if (Array.isArray(detail.options)) {
                  calculatedFee = detail.options.reduce((sum: number, opt: any) => {
                    const price = typeof opt.price === 'number' ? opt.price : 
                                typeof opt.price === 'string' ? parseInt(opt.price, 10) : 0;
                    return sum + (isNaN(price) ? 0 : price);
                  }, 0);
                }
                const finalFee = directFee > 0 ? directFee : calculatedFee;
                return finalFee.toLocaleString();
              })()}円
            </Typography>
          </Grid>
          
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              交通費
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {detail.traffic_fee?.toLocaleString() || 0}円
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1.5 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1" fontWeight="bold">
                合計
              </Typography>
              <Typography variant="h6" color="#f06292" fontWeight="bold">
                {(() => {
                  // 各項目を数値として取得
                  const courseFee = typeof detail.course_fee === 'number' ? detail.course_fee : 0;
                  const designationFee = typeof detail.designation_fee === 'number' ? detail.designation_fee : 0;
                  const optionsFee = typeof detail.options_fee === 'number' ? detail.options_fee : 0;
                  const trafficFee = typeof detail.traffic_fee === 'number' ? detail.traffic_fee : 0;
                  
                  // 合計金額を計算
                  const total = courseFee + designationFee + optionsFee + trafficFee;
                  return total.toLocaleString();
                })()}円
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {Array.isArray(detail.options) && detail.options.length > 0 && (
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            borderRadius: 3, 
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            mb: 3
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: '#f06292', fontWeight: 'bold' }}>
            オプション
          </Typography>
          
          <Stack spacing={1.5}>
            {detail.options.map((option: any, index: number) => (
              <Box 
                key={index} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'rgba(0,0,0,0.02)'
                }}
              >
                <Typography variant="body1">
                  {option?.name || 'オプション名なし'} {option?.is_custom && '(カスタム)'}
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {(option?.price || 0).toLocaleString()}円
                </Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button 
          variant="contained"
          startIcon={<EditIcon />}
          onClick={handleEditClick}
          sx={{ 
            borderRadius: 6,
            px: 4,
            py: 1,
            backgroundColor: '#f06292',
            '&:hover': {
              backgroundColor: '#ec407a',
              boxShadow: '0 3px 8px rgba(240, 98, 146, 0.3)'
            },
            mr: 2
          }}
        >
          予約を編集する
        </Button>
        <Button 
          variant="outlined"
          startIcon={<ChatIcon />}
          onClick={() => setShowMessage(true)}
          sx={{ 
            borderRadius: 6,
            px: 4,
            py: 1,
            borderColor: '#f06292',
            color: '#f06292',
            '&:hover': {
              borderColor: '#ec407a',
              backgroundColor: 'rgba(240, 98, 146, 0.05)',
              boxShadow: '0 3px 8px rgba(240, 98, 146, 0.1)'
            }
          }}
        >
          メッセージを表示
        </Button>
      </Box>

      {/* メッセージパネル */}
      <MessagePanel 
        isOpen={showMessage} 
        onClose={() => setShowMessage(false)} 
        reservationId={reservationId} 
      />
    </Box>
  );
}
