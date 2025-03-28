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

  useEffect(() => {
    if (!user) return;
    loadReservations(1, true);
  }, [user]);

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
                  const updated = data.reservations.find(
                      (r) => r.reservation_id === selectedReservation.reservation_id
                  );
                  console.log("", updated);
                  setSelectedReservation(updated || null);
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
          <ReservationList reservations={reservations} onSelect={setSelectedReservation} />
          
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
              onClose={() => setSelectedReservation(null)}
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
