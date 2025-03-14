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
import { Typography, Button } from "@mui/material";

export default function CustomerReservePage() {
  const user = useUser();
  const [reservations, setReservations] = useState<ReservationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState<ReservationListItem | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;

  useEffect(() => {
    if (!user) return;
    loadReservations(1, true);
  }, [user]);

  // ✅ ステータス変更後の一覧再取得関数
  const handleUpdateReservations = async (): Promise<void> => {
      console.log("🔄 ステータス変更後の一覧を再取得");
      setLoading(true);

      try {
          const data = await fetchCustomerReserve(1, limit);
          console.log("📡 APIレスポンス:", data);

          if (data) {
              setReservations(data.reservations);
              setTotalCount(data.totalCount);

              if (selectedReservation) {
                  const updated = data.reservations.find(
                      (r) => r.reservation_id === selectedReservation.reservation_id
                  );
                  console.log("✅ 更新後の選択予約:", updated);
                  setSelectedReservation(updated || null);
              }
          }
      } catch (error) {
          console.error("🚨 予約一覧の更新に失敗:", error);
      } finally {
          setLoading(false);
      }
  };

  const loadReservations = async (page: number, reset: boolean = false) => {
    setLoading(true);
    const data = await fetchCustomerReserve(page, limit);
    if (data) {
      setReservations((prev) => (reset ? data.reservations : [...prev, ...data.reservations]));
      setTotalCount(data.totalCount);
    }
    setLoading(false);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadReservations(nextPage);
  };


  
  return (
    <div className="p-4 max-w-xl mx-auto">
      <Typography variant="h6" className="font-bold mb-4">予約一覧</Typography>

      {loading && reservations.length === 0 ? (
        <p className="p-4">読み込み中...</p>
      ) : reservations.length === 0 ? (
        <Typography>予約がありません。</Typography>
      ) : (
        <>
          <ReservationList reservations={reservations} onSelect={setSelectedReservation} />
          {reservations.length < totalCount && (
            <Button onClick={loadMore} variant="contained" color="primary" className="mt-4">
              もっと見る
            </Button>
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
              onClose={() => setSelectedReservation(null)}
              onOpenMessage={() => setShowMessage(true)}
              onCloseMessage={() => setShowMessage(false)}
              reservation={selectedReservation}
                onUpdate={async () => {
    console.log("🟡 page.tsx で onUpdate が呼ばれた");
    await handleUpdateReservations(); // ✅ `await` を追加し `Promise<void>` に
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
