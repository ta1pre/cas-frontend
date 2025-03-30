"use client";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import ReservationList from "./components/ReservationList";
import ReservationDetail from "./components/ReservationDetail/ReservationDetail";
import MessagePanel from "./components/Message/MessagePanel";
import Backdrop from "./components/Backdrop";
import { ReservationListItem } from "./api/types";
import fetchCustomerReserve from "./api/resvlist";
import useUser from "@/hooks/useUser";
import { Typography, Button, Box, CircularProgress, Alert, Fade } from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote"; // 

export default function CustomerReservePage() {
  const user = useUser();
  const [reservations, setReservations] = useState<ReservationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false); // 
  const [selectedReservation, setSelectedReservation] = useState<ReservationListItem | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null); // 
  const limit = 10;

  // URLハッシュから予約IDを取得する関数
  const getReservationIdFromHash = (): number | null => {
    if (typeof window === 'undefined') return null;
    
    const hash = window.location.hash;
    if (!hash) return null;
    
    // #33 のような形式から数字部分を取得
    const reservationId = parseInt(hash.substring(1));
    return isNaN(reservationId) ? null : reservationId;
  };

  // 特定の予約IDから予約データを見つける関数
  const findReservationById = (id: number): ReservationListItem | null => {
    return reservations.find(r => r.reservation_id === id) || null;
  };

  useEffect(() => {
    if (!user) return;
    loadReservations(1, true);
  }, [user]);

  // URLハッシュが変更されたときに予約を選択する
  useEffect(() => {
    if (typeof window === 'undefined' || reservations.length === 0) return;

    const handleHashChange = () => {
      const reservationId = getReservationIdFromHash();
      if (reservationId) {
        const reservation = findReservationById(reservationId);
        if (reservation) {
          setSelectedReservation(reservation);
        } else if (!loading) {
          // 予約が見つからない場合、全ページのデータを読み込む
          loadAllReservations(reservationId);
        }
      }
    };

    // 初期ロード時にもハッシュをチェック
    handleHashChange();

    // ハッシュ変更イベントをリッスン
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [reservations, loading]);

  // 全ページの予約データを読み込む関数
  const loadAllReservations = async (targetReservationId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      let allReservations: ReservationListItem[] = [];
      let currentPage = 1;
      let hasMorePages = true;
      
      while (hasMorePages) {
        const data = await fetchCustomerReserve(currentPage, limit);
        if (!data || data.reservations.length === 0) {
          hasMorePages = false;
          break;
        }
        
        allReservations = [...allReservations, ...data.reservations];
        
        // 目的の予約が見つかったかチェック
        const foundReservation = data.reservations.find(r => r.reservation_id === targetReservationId);
        if (foundReservation) {
          setSelectedReservation(foundReservation);
          break;
        }
        
        // 次のページがあるかチェック
        if (allReservations.length >= data.totalCount) {
          hasMorePages = false;
        } else {
          currentPage++;
        }
      }
      
      // 全ての予約を状態に設定
      setReservations(allReservations);
      setTotalCount(allReservations.length);
      setPage(currentPage);
      
      // 予約が見つからなかった場合
      if (!selectedReservation) {
        setError(`予約ID ${targetReservationId} が見つかりませんでした。`);
      }
    } catch (error) {
      console.error("全予約データの読み込み中にエラーが発生しました", error);
      setError("予約データの読み込みに失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReservations = async (): Promise<void> => {
      console.log("");
      setLoading(true);
      setError(null); 

      try {
          const data = await fetchCustomerReserve(1, limit);
          console.log(":", data);

          if (data) {
              setReservations(data.reservations);
              setTotalCount(data.totalCount);

              if (selectedReservation) {
                  const updatedReservationData = data.reservations.find(
                      (r) => r.reservation_id === selectedReservation.reservation_id
                  );
                  if (updatedReservationData) {
                      // 更新後のデータが見つかった場合のみ、選択中の予約情報を更新する
                      setSelectedReservation(updatedReservationData);
                      console.log("選択中の予約情報を更新:", updatedReservationData);
                  } else {
                      // 更新後のデータが見つからない場合、パネルを閉じずに情報を維持
                      // (必要であれば、エラーログなどを出す)
                      console.warn("更新後の予約データが見つかりませんでした。ID:", selectedReservation.reservation_id);
                  }
              }
          }
      } catch (error) {
          console.error("", error);
          setError("");
      } finally {
          setLoading(false);
      }
  };

  const loadReservations = async (pageNum: number, reset: boolean = false) => {
    try {
      if (reset) {
        setLoading(true);
        setError(null); 
      } else {
        setLoadingMore(true);
      }

      const data = await fetchCustomerReserve(pageNum, limit);
      
      if (data) {
        setReservations((prev) => (reset ? data.reservations : [...prev, ...data.reservations]));
        setTotalCount(data.totalCount);
        setPage(pageNum); 
        
        // ページロード後にURLハッシュをチェック
        const reservationId = getReservationIdFromHash();
        if (reservationId && reset) {
          const reservation = data.reservations.find(r => r.reservation_id === reservationId);
          if (reservation) {
            setSelectedReservation(reservation);
          }
        }
      }
    } catch (error) {
      console.error("", error);
      setError("");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    loadReservations(nextPage);
  };

  const remainingItems = totalCount - reservations.length;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <EventNoteIcon fontSize="large" sx={{ color: "blue.600", mr: 1 }} />
        <Typography variant="h5" fontWeight="bold">
          予約一覧
        </Typography>
      </Box>

      {error && (
        <Fade in={!!error}>
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        </Fade>
      )}

      {loading && reservations.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : reservations.length === 0 ? (
        <Typography>予約がありません。</Typography>
      ) : (
        <>
          <ReservationList 
            reservations={reservations} 
            onSelect={setSelectedReservation} 
          />
          
          {reservations.length < totalCount && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3, mb: 2 }}>
              <Button 
                onClick={loadMore} 
                variant="contained" 
                color="primary"
                disabled={loadingMore}
                startIcon={loadingMore ? <CircularProgress size={20} color="inherit" /> : null}
                sx={{ minWidth: "200px" }}
              >
                {loadingMore 
                  ? "読み込み中..." 
                  : `もっと見る (残り${remainingItems}件)`}
              </Button>
            </Box>
          )}
        </>
      )}

      <AnimatePresence>
        {selectedReservation && (
          <>
            <Backdrop
              isVisible
              onClick={() => setShowMessage(false)}
              onCloseAll={() => { setSelectedReservation(null); setShowMessage(false); }}
            />
            <ReservationDetail 
              isOpen={!!selectedReservation} 
              onClose={() => {
                setSelectedReservation(null);
                // 予約詳細を閉じるときにURLハッシュを削除
                if (typeof window !== 'undefined' && window.location.hash) {
                  history.pushState("", document.title, window.location.pathname + window.location.search);
                }
              }}
              onOpenMessage={() => setShowMessage(true)}
              onCloseMessage={() => setShowMessage(false)}
              reservation={selectedReservation}
                onUpdate={async () => {
    console.log("");
    await handleUpdateReservations(); 
  }} 
            />
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMessage && (
          <>
            <Backdrop
              isVisible
              onClick={() => setShowMessage(false)}
              onCloseAll={() => { setSelectedReservation(null); setShowMessage(false); }}
            />
            <MessagePanel 
              isOpen={showMessage} 
              onClose={() => setShowMessage(false)} 
              reservationId={selectedReservation?.reservation_id ?? 0}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
