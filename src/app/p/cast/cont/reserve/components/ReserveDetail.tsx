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
  DialogActions,
  Modal,
  Backdrop
} from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import EventNoteIcon from '@mui/icons-material/EventNote';
import TrainIcon from '@mui/icons-material/Train';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';

// コンポーネントのプロパティを更新
// castIdとonCloseを追加
interface ReservationDetailProps {
  reservationId: number;
  castId?: number; // キャストID
  onClose?: () => void; // モーダルを閉じる関数
}

export default function ReservationDetail({ reservationId, castId, onClose }: ReservationDetailProps) {
  const [detail, setDetail] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const user = useCastUser();

  // 予約詳細データを取得
  const fetchDetail = async () => {
    setLoading(true);
    try {
      // castIdが指定されていたらそれを使用し、なければuser.user_idを使用
      const userId = castId || user.user_id;
      const data = await fetchReservationDetail(reservationId, userId);
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

  // モーダルスタイル
  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 1200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(3px)'
  };

  const modalContentStyle = {
    width: '92%',
    maxWidth: 500,
    maxHeight: '90vh',
    backgroundColor: 'white',
    borderRadius: 4,
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  };

  // コンテンツをレンダリング
  const renderContent = () => (
    <Box sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 編集モードの場合は編集フォームを表示 */}
      {isEditing ? (
        <ReserveEditForm 
          reservationId={reservationId}
          reservation={detail} 
          onCancel={() => setIsEditing(false)} 
          onSuccess={() => {
            setIsEditing(false);
            fetchDetail(); // 編集後にデータを再取得
          }}
        />
      ) : (
        // 詳細表示モード
        <>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', py: 8 }}>
              <CircularProgress color="secondary" />
            </Box>
          ) : detail ? (
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* ステータスバー */}
              <Box sx={{ 
                p: 2, 
                borderBottom: '1px solid #f0f0f0',
                backgroundColor: detail.color_code || '#f06292',
                color: 'white'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" fontWeight="bold">
                    {detail.status}
                  </Typography>
                  <Typography variant="body2">
                    #{detail.reservation_id}
                  </Typography>
                </Box>
                {detail.description && (
                  <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
                    {detail.description}
                  </Typography>
                )}
              </Box>

              {/* コンテンツエリア */}
              <Box sx={{ p: 3, flexGrow: 1, overflowY: 'auto' }}>
                {/* 日時情報 */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccessTimeIcon sx={{ mr: 1, color: '#9e9e9e' }} />
                    <Typography variant="subtitle1" fontWeight="medium">
                      予約日時
                    </Typography>
                  </Box>
                  <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
                    <Typography variant="body1">
                      {new Date(detail.start_time).toLocaleString('ja-JP', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  </Paper>
                </Box>

                {/* 予約者情報 */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PersonIcon sx={{ mr: 1, color: '#9e9e9e' }} />
                    <Typography variant="subtitle1" fontWeight="medium">
                      予約者情報
                    </Typography>
                  </Box>
                  <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
                    <Typography variant="body1">
                      {detail.user_name}
                    </Typography>
                  </Paper>
                </Box>

                {/* コース情報 */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EventNoteIcon sx={{ mr: 1, color: '#9e9e9e' }} />
                    <Typography variant="subtitle1" fontWeight="medium">
                      コース
                    </Typography>
                  </Box>
                  <Paper elevation={0} sx={{ 
                    p: 2, 
                    backgroundColor: '#f9f9f9', 
                    borderRadius: 2,
                    borderLeft: `4px solid ${detail.color_code || '#f06292'}`
                  }}>
                    <Typography variant="h6" fontWeight="bold" color="#f06292">
                      {detail.course_name}
                    </Typography>
                  </Paper>
                </Box>

                {/* 駅情報 */}
                {detail.station_name && (
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <TrainIcon sx={{ mr: 1, color: '#9e9e9e' }} />
                      <Typography variant="subtitle1" fontWeight="medium">
                        駅
                      </Typography>
                    </Box>
                    <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
                      <Typography variant="body1">
                        {detail.station_name}
                      </Typography>
                    </Paper>
                  </Box>
                )}

                {/* オプション情報 */}
                {detail.options && detail.options.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <InfoIcon sx={{ mr: 1, color: '#9e9e9e' }} />
                      <Typography variant="subtitle1" fontWeight="medium">
                        オプション
                      </Typography>
                    </Box>
                    <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
                      <Stack spacing={1}>
                        {detail.options.map((option: any) => (
                          <Box key={option.id || option.name} sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            borderBottom: '1px dashed #e0e0e0',
                            pb: 1
                          }}>
                            <Typography variant="body2">
                              {option.name}
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {option.price.toLocaleString()}円
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Paper>
                  </Box>
                )}

                {/* 料金情報 */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <MonetizationOnIcon sx={{ mr: 1, color: '#9e9e9e' }} />
                    <Typography variant="subtitle1" fontWeight="medium">
                      料金
                    </Typography>
                  </Box>
                  <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
                    <Grid container spacing={1}>
                      <Grid item xs={8}>
                        <Typography variant="body2">コース料金</Typography>
                      </Grid>
                      <Grid item xs={4} sx={{ textAlign: 'right' }}>
                        <Typography variant="body2">{detail.reservation_fee.toLocaleString()}円</Typography>
                      </Grid>

                      {detail.designation_fee > 0 && (
                        <>
                          <Grid item xs={8}>
                            <Typography variant="body2">指定料</Typography>
                          </Grid>
                          <Grid item xs={4} sx={{ textAlign: 'right' }}>
                            <Typography variant="body2">{detail.designation_fee.toLocaleString()}円</Typography>
                          </Grid>
                        </>
                      )}

                      {detail.options_fee > 0 && (
                        <>
                          <Grid item xs={8}>
                            <Typography variant="body2">オプション料金</Typography>
                          </Grid>
                          <Grid item xs={4} sx={{ textAlign: 'right' }}>
                            <Typography variant="body2">{detail.options_fee.toLocaleString()}円</Typography>
                          </Grid>
                        </>
                      )}

                      {detail.traffic_fee > 0 && (
                        <>
                          <Grid item xs={8}>
                            <Typography variant="body2">交通費</Typography>
                          </Grid>
                          <Grid item xs={4} sx={{ textAlign: 'right' }}>
                            <Typography variant="body2">{detail.traffic_fee.toLocaleString()}円</Typography>
                          </Grid>
                        </>
                      )}

                      <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>

                      <Grid item xs={8}>
                        <Typography variant="subtitle2" fontWeight="bold">合計金額</Typography>
                      </Grid>
                      <Grid item xs={4} sx={{ textAlign: 'right' }}>
                        <Typography variant="subtitle2" fontWeight="bold" color="#f06292">
                          {detail.total_points.toLocaleString()}円
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
              </Box>

              {/* アクションバー */}
              <Box sx={{ 
                p: 2, 
                borderTop: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(true)}
                  sx={{ 
                    borderRadius: 6,
                    borderColor: '#f48fb1',
                    color: '#f06292',
                    '&:hover': {
                      borderColor: '#f06292',
                      backgroundColor: 'rgba(240, 98, 146, 0.04)'
                    }
                  }}
                >
                  編集する
                </Button>

                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<ChatIcon />}
                  onClick={() => setShowMessage(true)}
                  sx={{ 
                    borderRadius: 6,
                    backgroundColor: '#f06292',
                    '&:hover': {
                      backgroundColor: '#e91e63'
                    },
                    '&:active': {
                      backgroundColor: 'rgba(240, 98, 146, 0.05)',
                      boxShadow: '0 3px 8px rgba(240, 98, 146, 0.1)'
                    }
                  }}
                >
                  メッセージを表示
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                予約情報を取得できませんでした
              </Typography>
            </Box>
          )}
        </>
      )}

      {/* メッセージパネル */}
      <MessagePanel 
        isOpen={showMessage} 
        onClose={() => setShowMessage(false)} 
        reservationId={reservationId} 
      />
    </Box>
  );

  // onCloseが指定されていたらモーダル表示
  return onClose ? (
    <Box sx={modalStyle as any}>
      <Box sx={modalContentStyle as any}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid #f5f5f5'
        }}>
          <Typography variant="h6" fontWeight="bold">
            予約詳細
          </Typography>
          <IconButton 
            onClick={onClose}
            size="small"
            sx={{ color: '#9e9e9e' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Box sx={{ 
          flexGrow: 1, 
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          p: 0
        }}>
          {renderContent()}
        </Box>
      </Box>
    </Box>
  ) : renderContent();
}
