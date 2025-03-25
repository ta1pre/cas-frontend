// 📂 src/app/p/cast/cont/reserve/components/CastReserveList.tsx
"use client";

import React, { useEffect, useState } from "react";
import { fetchCastReserveList } from "../api/useFetchReserve";
import { CastReserveItem, ReservationStatus } from "../types/reserveTypes";
import { useCastUser } from "@/app/p/cast/hooks/useCastUser";
import ReservationDetail from "./ReserveDetail";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Chip, 
  Container, 
  IconButton,
  CircularProgress
} from "@mui/material";
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import TrainIcon from '@mui/icons-material/Train';

export default function CastReserveList() {
  const [reserves, setReserves] = useState<CastReserveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useCastUser();
  const [selectedReservationId, setSelectedReservationId] = useState<number | null>(null);

  useEffect(() => {
    const loadReserves = async () => {
      setLoading(true);
      try {
        const data = await fetchCastReserveList(user.user_id, 1, 10);
        console.log("取得した予約データ:", data);
        
        if (data && data.reservations) {
          setReserves(data.reservations);
        } else {
          console.error("予約データが正しい形式ではありません", data);
          setReserves([]);
        }
      } catch (error) {
        console.error("予約取得エラー", error);
        setReserves([]);
      } finally {
        setLoading(false);
      }
    };

    loadReserves();
  }, [user.user_id]);

  // ステータスの色を取得（MUIのChipコンポーネント用）
  const getStatusColor = (status: ReservationStatus) => {
    // デフォルトの色を設定
    return 'default';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      month: 'long', 
      day: 'numeric', 
      weekday: 'short',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <Container maxWidth="sm" sx={{ 
      py: 2, 
      px: { xs: 2, sm: 3 },
      backgroundColor: '#fafafa',
      minHeight: '100vh'
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 3,
        color: '#f06292', // 女性向けのピンク系カラー
        pt: 1
      }}>
        <EventIcon sx={{ mr: 2, fontSize: 32 }} />
        <Typography variant="h5" fontWeight="600" sx={{ letterSpacing: 0.5 }}>
          予約管理
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="secondary" />
        </Box>
      ) : reserves.length === 0 ? (
        <Card sx={{ 
          textAlign: 'center', 
          py: 6, 
          backgroundColor: 'white', 
          borderRadius: 4,
          boxShadow: '0 3px 10px rgba(0,0,0,0.08)'
        }}>
          <Typography variant="h6" color="#9e9e9e">
            予約はありません
          </Typography>
          <Typography variant="body2" color="#bdbdbd" sx={{ mt: 1 }}>
            新しい予約をお待ちください
          </Typography>
        </Card>
      ) : (
        <Box>
          {reserves.map((reserve) => (
            <Card 
              key={reserve.reservation_id} 
              sx={{ 
                mb: 2.5, 
                borderRadius: 3, 
                boxShadow: '0 3px 15px rgba(0,0,0,0.06)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-2px)',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                },
                position: 'relative'
              }}
            >
              <Box sx={{ 
                height: '4px', 
                background: reserve.color_code || '#e0e0e0'
              }} />
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Chip 
                    label={reserve.status}
                    color={getStatusColor(reserve.status) as any}
                    size="small"
                    sx={{ 
                      fontWeight: 'medium',
                      borderRadius: '12px',
                      px: 1,
                      backgroundColor: reserve.color_code || '#e0e0e0',
                      color: '#ffffff'
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" fontWeight="medium">
                    #{reserve.reservation_id}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <AccessTimeIcon sx={{ mr: 1, fontSize: 20, color: '#9e9e9e' }} />
                  <Typography variant="body1" fontWeight="500" sx={{ color: '#424242' }}>
                    {formatDate(reserve.start_time)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <PersonIcon sx={{ mr: 1, fontSize: 20, color: '#9e9e9e' }} />
                  <Typography variant="body1" fontWeight="medium">
                    {reserve.user_name}
                  </Typography>
                </Box>

                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#f06292' }}>
                    {reserve.course_name}
                  </Typography>
                </Box>

                {reserve.station_name !== undefined && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <TrainIcon sx={{ mr: 1, fontSize: 20, color: '#9e9e9e' }} />
                    <Typography variant="body2" color="text.secondary">
                      {reserve.station_name}
                    </Typography>
                  </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MonetizationOnIcon sx={{ mr: 0.5, fontSize: 20, color: '#9e9e9e' }} />
                    <Typography variant="body2" fontWeight="medium" sx={{ color: '#424242' }}>
                      {reserve.course_price.toLocaleString()}円
                      {reserve.traffic_fee > 0 && ` (+交通費 ${reserve.traffic_fee.toLocaleString()}円)`}
                    </Typography>
                  </Box>

                  <Button 
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => setSelectedReservationId(reserve.reservation_id)}
                    sx={{ 
                      borderRadius: 6,
                      textTransform: 'none',
                      boxShadow: 'none',
                      backgroundColor: '#f06292',
                      '&:hover': {
                        backgroundColor: '#ec407a',
                        boxShadow: '0 3px 8px rgba(240, 98, 146, 0.3)'
                      }
                    }}
                  >
                    詳細を見る
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {selectedReservationId && (
        <Box sx={{
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
        }}>
          <Box sx={{
            width: '92%',
            maxWidth: 500,
            maxHeight: '90vh',
            backgroundColor: 'white',
            borderRadius: 4,
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
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
                onClick={() => setSelectedReservationId(null)}
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
              <ReservationDetail reservationId={selectedReservationId} />
            </Box>
          </Box>
        </Box>
      )}
    </Container>
  );
}
