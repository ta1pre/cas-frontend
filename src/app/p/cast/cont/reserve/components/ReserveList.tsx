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
  Badge,
  Snackbar
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
import fetchChangeStatus from "./api/fetchChangeStatus";

// タブの種類を定義
type TabType = 'action' | 'schedule' | 'history';

// 予約ステータスをグループ化
const ACTION_STATUSES = ['requested', 'adjusting', 'waiting_user_confirm'];
const SCHEDULE_STATUSES = ['confirmed', 'user_arrived', 'cast_arrived', 'both_arrived'];
const HISTORY_STATUSES = ['completed', 'cancelled_user', 'cancelled_cast', 'no_show_user', 'no_show_cast', 'dispute'];

export default function CastReserveList() {
  const [reserves, setReserves] = useState<CastReserveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentTab, setCurrentTab] = useState<TabType>('schedule');
  const limit = 10; // 1ページあたりの表示件数
  const user = useCastUser();
  const [selectedReservationId, setSelectedReservationId] = useState<number | null>(null);
  const [allReservations, setAllReservations] = useState<CastReserveItem[]>([]);
  const [statusLoadingId, setStatusLoadingId] = useState<number | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // 件数カウント関数
  const actionCount = allReservations.filter(r => ACTION_STATUSES.includes(r.status_key as string)).length;
  const scheduleCount = allReservations.filter(r => SCHEDULE_STATUSES.includes(r.status_key as string)).length;

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
        // 全予約を保持
        if (!append && pageNum === 1) {
          setAllReservations(data.reservations);
        } else if (append) {
          setAllReservations(prev => [...prev, ...data.reservations]);
        }
        
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
          setReserves(prev => {
            const updated = [...prev, ...filteredReservations];
            console.log('setReserves (append):', updated);
            return updated;
          });
        } else {
          setReserves(filteredReservations);
          console.log('setReserves:', filteredReservations);
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

  // 日付を「2025年4月19日」形式で返す関数
  const formatYMD = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
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

  // ページ全体をリロードする関数（未使用化）
  // const forcePageReload = () => {
  //   if (typeof window !== 'undefined') {
  //     window.location.reload();
  //   }
  // };

  // 予約カードの表示
  const renderReservationCard = (reserve: CastReserveItem) => {
    // ステータスごとにボタン表示と挙動を切り替え
    const showCastArrivedBtn = reserve.status_key === 'user_arrived' || reserve.status === 'user_arrived';
    const showStartServiceBtn = reserve.status_key === 'cast_arrived' || reserve.status === 'cast_arrived';
    const showCompleteBtn = reserve.status_key === 'both_arrived' || reserve.status === 'both_arrived';
    const handleCardClick = () => setSelectedReservationId(reserve.reservation_id);

    // 到着報告ボタン
    const handleCastArrived = async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (statusLoadingId) return;
      if (!user?.user_id) return;
      setStatusLoadingId(reserve.reservation_id);
      try {
        const response = await fetchChangeStatus(
          "cast_arrived",
          reserve.reservation_id,
          user.user_id
        );
        console.log('【fetchChangeStatus レスポンス】', response);
        if (response?.message && response.message.includes('ステータスを cast_arrived に変更しました')) {
          // レスポンスメッセージを明示的に判定してリスト再取得
          fetchReservations(1, false, currentTab);
        } else if (response?.status === "OK" || response?.status === "SUCCESS") {
          // 1秒待ってからリスト再取得
          setTimeout(() => {
            fetchReservations(1, false, currentTab);
          }, 1000);
        } else {
          setSnackbarMessage(response?.message || "ステータス変更に失敗しました。");
          setSnackbarOpen(true);
        }
      } catch (e: any) {
        setSnackbarMessage(e?.message || "ステータス変更でエラーが発生しました");
        setSnackbarOpen(true);
      } finally {
        setStatusLoadingId(null);
      }
    };

    // サービス開始ボタン
    const handleStartService = async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (statusLoadingId) return;
      if (!user?.user_id) return;
      setStatusLoadingId(reserve.reservation_id);
      try {
        const response = await fetchChangeStatus(
          "both_arrived",
          reserve.reservation_id,
          user.user_id
        );
        console.log('【fetchChangeStatus レスポンス】', response);
        if (response?.message && response.message.includes('ステータスを both_arrived に変更しました')) {
          fetchReservations(1, false, currentTab);
        } else if (response?.status === "OK" || response?.status === "SUCCESS") {
          // 1秒待ってからリスト再取得
          setTimeout(() => {
            fetchReservations(1, false, currentTab);
          }, 1000);
        } else {
          setSnackbarMessage(response?.message || "ステータス変更に失敗しました。");
          setSnackbarOpen(true);
        }
      } catch (e: any) {
        setSnackbarMessage(e?.message || "ステータス変更でエラーが発生しました");
        setSnackbarOpen(true);
      } finally {
        setStatusLoadingId(null);
      }
    };

    // サービス終了報告ボタン
    const handleComplete = async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (statusLoadingId) return;
      if (!user?.user_id) return;
      setStatusLoadingId(reserve.reservation_id);
      try {
        const response = await fetchChangeStatus(
          "completed",
          reserve.reservation_id,
          user.user_id
        );
        console.log('【fetchChangeStatus レスポンス】', response);
        if (response?.message && response.message.includes('ステータスを completed に変更しました')) {
          fetchReservations(1, false, currentTab);
        } else if (response?.status === "OK" || response?.status === "SUCCESS") {
          // 1秒待ってからリスト再取得
          setTimeout(() => {
            fetchReservations(1, false, currentTab);
          }, 1000);
        } else {
          setSnackbarMessage(response?.message || "ステータス変更に失敗しました。");
          setSnackbarOpen(true);
        }
      } catch (e: any) {
        setSnackbarMessage(e?.message || "ステータス変更でエラーが発生しました");
        setSnackbarOpen(true);
      } finally {
        setStatusLoadingId(null);
      }
    };

    return (
      <Card
        key={`${reserve.reservation_id}-${reserve.status_key}-${reserve.status}`}
        sx={{ mb: 2, borderRadius: 4, boxShadow: 1, border: '1px solid #f8bbd0', cursor: 'pointer', position: 'relative' }}
        onClick={handleCardClick}
      >
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                <Chip label={getStatusLabel(reserve.status)} sx={{ backgroundColor: reserve.color_code, color: '#fff', height: 22, fontSize: 13 }} />
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  予約ID: {reserve.reservation_id}
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#e91e63' }}>
                {isFastestRequest(reserve.start_time)
                  ? `最速調整中@${reserve.station_name || "未設定"}`
                  : `${formatYMD(reserve.start_time)} @ ${reserve.station_name || "未設定"}`}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {reserve.user_name} / {reserve.course_name}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              {showCastArrivedBtn && (
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  disabled={statusLoadingId === reserve.reservation_id}
                  onClick={handleCastArrived}
                  sx={{
                    borderRadius: 6,
                    background: 'linear-gradient(90deg, #f8bbd0 0%, #f06292 100%)',
                    color: '#fff',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 8px rgba(240,98,146,0.12)',
                    minWidth: 110,
                    ml: 1,
                    '&:hover': {
                      background: 'linear-gradient(90deg, #f06292 0%, #f8bbd0 100%)',
                      opacity: 0.9,
                    },
                  }}
                >
                  {statusLoadingId === reserve.reservation_id ? '処理中...' : '到着報告'}
                </Button>
              )}
              {showStartServiceBtn && (
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  disabled={statusLoadingId === reserve.reservation_id}
                  onClick={handleStartService}
                  sx={{
                    borderRadius: 6,
                    background: 'linear-gradient(90deg, #b2dfdb 0%, #1976d2 100%)',
                    color: '#fff',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 8px rgba(25,118,210,0.12)',
                    minWidth: 110,
                    ml: 1,
                    '&:hover': {
                      background: 'linear-gradient(90deg, #1976d2 0%, #b2dfdb 100%)',
                      opacity: 0.9,
                    },
                  }}
                >
                  {statusLoadingId === reserve.reservation_id ? '処理中...' : 'サービス開始'}
                </Button>
              )}
              {showCompleteBtn && (
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  disabled={statusLoadingId === reserve.reservation_id}
                  onClick={handleComplete}
                  sx={{
                    borderRadius: 6,
                    background: 'linear-gradient(90deg, #dcedc8 0%, #388e3c 100%)',
                    color: '#fff',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 8px rgba(56,142,60,0.12)',
                    minWidth: 120,
                    ml: 1,
                    '&:hover': {
                      background: 'linear-gradient(90deg, #388e3c 0%, #dcedc8 100%)',
                      opacity: 0.9,
                    },
                  }}
                >
                  {statusLoadingId === reserve.reservation_id ? '処理中...' : 'サービス終了報告'}
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  // 予約リスト内の特定予約のステータスを即時更新
  const updateReservationStatus = (reservationId: number, newStatus: string) => {
    setReserves(prev => {
      // 現在のタブごとにフィルタリング
      if (currentTab === 'action') {
        const updated = prev.map(r =>
          r.reservation_id === reservationId
            ? { ...r, status_key: newStatus, status: newStatus as ReservationStatus }
            : r
        );
        return updated.filter(r => isActionTargetStatus(r.status_key));
      } else if (currentTab === 'history') {
        const updated = prev.map(r =>
          r.reservation_id === reservationId
            ? { ...r, status_key: newStatus, status: newStatus as ReservationStatus }
            : r
        );
        return updated.filter(r => isHistoryTargetStatus(r.status_key));
      }
      // その他タブは単純に反映
      return prev.map(r =>
        r.reservation_id === reservationId
          ? { ...r, status_key: newStatus, status: newStatus as ReservationStatus }
          : r
      );
    });
    setAllReservations(prev => prev.map(r =>
      r.reservation_id === reservationId
        ? { ...r, status_key: newStatus, status: newStatus as ReservationStatus }
        : r
    ));
  };

  // アクションタブの対象status_key判定（例：user_arrived, cast_arrived, both_arrived）
  const isActionTargetStatus = (status: string) => {
    return ["user_arrived", "cast_arrived", "both_arrived"].includes(status);
  };
  // 履歴タブの対象status_key判定（例：completed, canceled など）
  const isHistoryTargetStatus = (status: string) => {
    return ["completed", "canceled", "cancelled", "no_show", "no_show_user", "no_show_cast", "dispute", "cancelled_user", "cancelled_cast"].includes(status);
  };

  // タブを一時的に切り替えて戻す関数（UI上も強制的に切替を見せる）
  const forceTabReload = () => {
    let nextTab: TabType = currentTab === 'schedule' ? 'action' : 'schedule';
    setCurrentTab(nextTab);
    setTimeout(() => {
      setCurrentTab(currentTab);
      // タブ切替時のfetchReservationsはhandleTabChangeで保証されている
    }, 400); // 0.4秒だけ違うタブを表示
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
      case 'user_arrived':
        return 'ユーザー到着';
      case 'cast_arrived':
        return 'キャスト到着';
      case 'both_arrived':
        return '両者到着';
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

  const handleSnackbarClose = () => setSnackbarOpen(false);

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
        indicatorColor="secondary"
        textColor="secondary"
        variant="fullWidth"
        sx={{ mb: 2, borderRadius: 2, boxShadow: '0 2px 8px rgba(240,98,146,0.06)' }}
      >
        <Tab 
          label={
            <Badge badgeContent={scheduleCount} color="secondary" invisible={false}>
              確定予定
            </Badge>
          }
          value="schedule"
          icon={<CalendarTodayIcon />}
          iconPosition="start"
        />
        <Tab 
          label={
            <Badge badgeContent={actionCount} color="error" invisible={false}>
              要対応
            </Badge>
          }
          value="action"
          icon={<NotificationsIcon />}
          iconPosition="start"
        />
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
                      '続きを読む'
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

      {/* スナックバー通知 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </Container>
  );
}
