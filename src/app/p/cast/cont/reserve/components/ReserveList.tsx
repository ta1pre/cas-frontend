// 📂 src/app/p/cast/cont/reserve/components/ReserveList.tsx
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
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  Badge
} from "@mui/material";
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import TrainIcon from '@mui/icons-material/Train';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HistoryIcon from '@mui/icons-material/History';

// タブの種類を定義
type TabType = 'action' | 'schedule' | 'history';

// 予約ステータスをグループ化
const ACTION_STATUSES = ['requested', 'adjusting', 'waiting_user_confirm'];
const SCHEDULE_STATUSES = ['confirmed'];
const HISTORY_STATUSES = ['completed', 'cancelled_user', 'cancelled_cast', 'no_show_user', 'no_show_cast', 'dispute'];

export default function CastReserveList() {
  const [reserves, setReserves] = useState<CastReserveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentTab, setCurrentTab] = useState<TabType>('action');
  const limit = 10; // 1ページあたりの表示件数
  const user = useCastUser();
  const [selectedReservationId, setSelectedReservationId] = useState<number | null>(null);

  // タブ変更ハンドラー
  const handleTabChange = (event: React.SyntheticEvent, newValue: TabType) => {
    setCurrentTab(newValue);
    setPage(1); // タブ切り替え時にページをリセット
    fetchReservations(1, false, newValue);
  };

  // 予約データを取得する関数
  const fetchReservations = async (pageNum: number, append: boolean = false, tabType: TabType = currentTab) => {
    if (!user.user_id) return;
    
    setLoading(true);
    try {
      // APIリクエストのパラメータをログ出力
      console.log(`📡 予約一覧取得リクエスト - ページ:${pageNum}, 件数:${limit}, タブ:${tabType}`);
      
      const data = await fetchCastReserveList(user.user_id, pageNum, limit);
      console.log("✅ 取得した予約データ:", data);
      console.log(`✅ 予約件数: ${data?.reservations?.length || 0}件, 全${data?.total_count || 0}件中`);
      
      if (data && data.reservations) {
        // タブに応じてフィルタリング
        let filteredReservations = [];
        if (tabType === 'action') {
          filteredReservations = data.reservations.filter(r => 
            ACTION_STATUSES.includes(r.status_key as string)
          );
          // 要対応タブの内容をステータスの優先度と日時でソート
          filteredReservations = sortActionReservations(filteredReservations);
        } else if (tabType === 'schedule') {
          filteredReservations = data.reservations.filter(r => 
            SCHEDULE_STATUSES.includes(r.status_key as string)
          ).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
        } else {
          filteredReservations = data.reservations.filter(r => 
            HISTORY_STATUSES.includes(r.status_key as string)
          ).sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
        }
        
        // append=trueの場合は既存のデータに追加、falseの場合は置き換え
        if (append) {
          setReserves(prev => [...prev, ...filteredReservations]);
        } else {
          setReserves(filteredReservations);
        }
        
        // 続きがあるかどうかを判定
        const loadedCount = (append ? reserves.length + filteredReservations.length : filteredReservations.length);
        setHasMore(loadedCount < data.total_count);
        setTotalCount(data.total_count);
      } else {
        console.error("予約データが正しい形式ではありません", data);
        if (!append) setReserves([]);
      }
    } catch (error) {
      console.error("予約取得エラー", error);
      if (!append) setReserves([]);
    } finally {
      setLoading(false);
    }
  };

  // ステータスの優先度を取得（要対応タブ用）
  const getStatusPriority = (status: string): number => {
    switch(status) {
      case 'requested': return 0;      // 最優先（新着）
      case 'adjusting': return 1;      // 次優先（調整中）
      case 'waiting_user_confirm': return 2;  // 低優先（ユーザー確認待ち）
      default: return 99;  // その他
    }
  };

  // 要対応タブの内容をステータスの優先度と日時でソートする関数
  const sortActionReservations = (reservations: CastReserveItem[]): CastReserveItem[] => {
    return [...reservations].sort((a, b) => {
      // 「最速案内」を最優先で上に表示
      const aIsFastest = isFastestRequest(a.start_time);
      const bIsFastest = isFastestRequest(b.start_time);
      
      if (aIsFastest && !bIsFastest) return -1; // aが最速案内なら上に
      if (!aIsFastest && bIsFastest) return 1;  // bが最速案内なら上に
      
      // 両方とも「最速案内」または両方とも通常予約の場合は次の条件で判定
      
      // ステータスの優先度でソート
      const priorityDiff = getStatusPriority(a.status_key) - getStatusPriority(b.status_key);
      if (priorityDiff !== 0) return priorityDiff;
      
      // 日時でソート（昇順：近い日時が上）
      return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
    });
  };

  // 「最速案内」かどうかを判定する関数
  const isFastestRequest = (dateTime: string | null): boolean => {
    if (!dateTime) return false;
    return dateTime.startsWith('7777-07-07');
  };

  // 初回ロード時
  useEffect(() => {
    if (user.user_id) {
      fetchReservations(1);
    }
  }, [user.user_id]);

  // 続きを読む処理
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchReservations(nextPage, true);
  };

  // ステータスの色を取得（MUIのChipコンポーネント用）
  const getStatusColor = (status: ReservationStatus) => {
    switch(status) {
      case 'requested':
        return 'info';
      case 'adjusting':
        return 'warning';
      case 'confirmed':
        return 'success';
      case 'completed':
        return 'default';
      case 'cancelled_user':
      case 'cancelled_cast':
      case 'no_show_user':
      case 'no_show_cast':
      case 'dispute':
        return 'error';
      default:
        return 'default';
    }
  };

  // ステータスのラベルを取得
  const getStatusLabel = (status: ReservationStatus) => {
    switch(status) {
      case 'requested':
        return 'リクエスト中';
      case 'adjusting':
        return '調整中';
      case 'waiting_user_confirm':
        return 'ユーザー確認待ち';
      case 'confirmed':
        return '確定';
      case 'completed':
        return '完了';
      case 'cancelled_user':
        return 'ユーザーキャンセル';
      case 'cancelled_cast':
        return 'キャストキャンセル';
      case 'no_show_user':
        return 'ユーザー未到着';
      case 'no_show_cast':
        return 'キャスト未到着';
      case 'dispute':
        return 'トラブル';
      default:
        return status;
    }
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

  // 日付をグループ化するための関数
  const getDateGroup = (dateString: string): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const reserveDate = new Date(dateString);
    reserveDate.setHours(0, 0, 0, 0);
    
    if (reserveDate.getTime() === today.getTime()) {
      return '今日';
    } else if (reserveDate.getTime() === tomorrow.getTime()) {
      return '明日';
    } else if (reserveDate > today && reserveDate < nextWeek) {
      return '今週';
    } else {
      return '来週以降';
    }
  };

  // 予定タブ用に予約をグループ化する関数
  const groupReservationsByDate = () => {
    const groups: {[key: string]: CastReserveItem[]} = {
      '今日': [],
      '明日': [],
      '今週': [],
      '来週以降': []
    };
    
    reserves.forEach(reserve => {
      const group = getDateGroup(reserve.start_time);
      if (groups[group]) {
        groups[group].push(reserve);
      }
    });
    
    return groups;
  };

  // 要対応タブの件数を取得
  const getActionCount = () => {
    if (!user.user_id) return 0;
    return reserves.filter(r => ACTION_STATUSES.includes(r.status_key as string)).length;
  };

  // 予約カードの表示
  const renderReservationCard = (reserve: CastReserveItem) => {
    return (
      <Card key={reserve.reservation_id} sx={{ 
        mb: 2, 
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
        }
      }}>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Chip 
              label={reserve.status} 
              color={getStatusColor(reserve.status_key as ReservationStatus)}
              size="small"
              sx={{ fontWeight: 500 }}
            />
            <Typography variant="caption" color="text.secondary">
              #{reserve.reservation_id}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <AccessTimeIcon sx={{ mr: 1, fontSize: 20, color: '#9e9e9e' }} />
            {reserve.start_time ? (
              <>
                {isFastestRequest(reserve.start_time) ? (
                  <Typography variant="body1" fontWeight="bold" sx={{ color: 'red' }}>
                    最短の日時を指定して下さい
                  </Typography>
                ) : (
                  <Typography variant="body1" fontWeight="bold">
                    {formatDate(reserve.start_time)}
                  </Typography>
                )}
              </>
            ) : (
              <Typography variant="body1" fontWeight="bold" sx={{ color: 'red' }}>
                最短の日時を指定して下さい
              </Typography>
            )}
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
                {`${(reserve.cast_reward_points ?? 0).toLocaleString()}P（内、交通費 ${(reserve.traffic_fee ?? 0).toLocaleString()}P）`}
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
              {ACTION_STATUSES.includes(reserve.status_key as string) ? '対応する' : '詳細を見る'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
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

      {/* タブナビゲーション */}
      <Tabs 
        value={currentTab} 
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ 
          mb: 3, 
          '& .MuiTab-root': { 
            color: '#757575',
            '&.Mui-selected': { color: '#f06292' } 
          },
          '& .MuiTabs-indicator': { backgroundColor: '#f06292' }
        }}
      >
        <Tab 
          label="要対応" 
          value="action" 
          icon={
            <Badge badgeContent={getActionCount()} color="error" max={99}>
              <NotificationsIcon />
            </Badge>
          } 
          iconPosition="start" 
        />
        <Tab label="予定" value="schedule" icon={<CalendarTodayIcon />} iconPosition="start" />
        <Tab label="履歴" value="history" icon={<HistoryIcon />} iconPosition="start" />
      </Tabs>

      {loading && page === 1 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="secondary" />
        </Box>
      ) : (
        <Box>
          {reserves.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8, color: '#9e9e9e' }}>
              <Typography variant="body1">
                {currentTab === 'action' && '対応が必要な予約はありません'}
                {currentTab === 'schedule' && '予定されている予約はありません'}
                {currentTab === 'history' && '過去の予約履歴はありません'}
              </Typography>
            </Box>
          ) : (
            <>
              {/* 要対応タブの内容 */}
              {currentTab === 'action' && (
                <Box>
                  {reserves.map(reserve => renderReservationCard(reserve))}
                </Box>
              )}

              {/* 予定タブの内容 */}
              {currentTab === 'schedule' && (
                <Box>
                  {Object.entries(groupReservationsByDate()).map(([dateGroup, groupReservations]) => (
                    groupReservations.length > 0 && (
                      <Box key={dateGroup} sx={{ mb: 4 }}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: 'bold', 
                            color: dateGroup === '今日' ? '#f06292' : '#616161', 
                            mb: 1,
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {dateGroup === '今日' && <CalendarTodayIcon sx={{ mr: 1, fontSize: 18 }} />}
                          {dateGroup} ({groupReservations.length}件)
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        {groupReservations.map(reserve => renderReservationCard(reserve))}
                      </Box>
                    )
                  ))}
                </Box>
              )}

              {/* 履歴タブの内容 */}
              {currentTab === 'history' && (
                <Box>
                  {reserves.map(reserve => renderReservationCard(reserve))}
                </Box>
              )}

              {/* 続きを読むボタン */}
              {hasMore && (
                <Box sx={{ textAlign: 'center', mt: 3, mb: 5 }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleLoadMore}
                    disabled={loading}
                    sx={{ 
                      borderRadius: 6, 
                      px: 4, 
                      py: 1,
                      borderColor: '#f48fb1',
                      color: '#f06292',
                      '&:hover': {
                        borderColor: '#f06292',
                        backgroundColor: 'rgba(240, 98, 146, 0.04)'
                      }
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="secondary" />
                    ) : (
                      `続きを読む (${reserves.length}/${totalCount}件)`
                    )}
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>
      )}

      {selectedReservationId && (
        <ReservationDetail
          reservationId={selectedReservationId}
          castId={user.user_id}
          onClose={() => setSelectedReservationId(null)}
        />
      )}
    </Container>
  );
}
