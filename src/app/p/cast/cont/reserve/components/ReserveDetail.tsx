// 📂 src/app/p/cast/cont/reserve/components/ReserveDetail.tsx
"use client";

import React, { useEffect, useState } from "react";
import { fetchReservationDetail } from "../api/useFetchReservationDetail";
import { useCastUser } from "@/app/p/cast/hooks/useCastUser";
import OptionPanel from "./OptionPanel";

export default function ReservationDetail({ reservationId }: { reservationId: number }) {
  const [detail, setDetail] = useState<any>(null);
  const user = useCastUser();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await fetchReservationDetail(reservationId, user.user_id);
        setDetail(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDetail();
  }, [reservationId, user.user_id]);

  if (!detail) return <div>読み込み中...</div>;

  return (
    <div style={{ padding: '16px' }}>
      <h2>予約詳細</h2>
      <p><strong>顧客名:</strong> {detail.user_name}</p>
      <p><strong>コース:</strong> {detail.course_name}</p>
      <p><strong>開始:</strong> {new Date(detail.start_time).toLocaleString()}</p>
      <p><strong>終了:</strong> {new Date(detail.end_time).toLocaleString()}</p>
      <p><strong>場所:</strong> {detail.location}</p>
      <p><strong>ステータス:</strong> {detail.status}</p>
      <p><strong>メモ:</strong> {detail.reservation_note}</p>

      {/* ✅ オプション一覧を読み込んで表示 */}
      <OptionPanel reservationId={reservationId} />
    </div>
  );
}
