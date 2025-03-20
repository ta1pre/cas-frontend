// 📂 src/app/p/cast/cont/reserve/components/CastReserveList.tsx
"use client";

import React, { useEffect, useState } from "react";
import { fetchCastReserveList } from "../api/useFetchReserve";
import { CastReserveItem } from "../types/reserveTypes";
import { useCastUser } from "@/app/p/cast/hooks/useCastUser";
import ReservationDetail from "./ReserveDetail";

export default function CastReserveList() {
  const [reserves, setReserves] = useState<CastReserveItem[]>([]);
  const user = useCastUser();
  const [selectedReservationId, setSelectedReservationId] = useState<number | null>(null);

  useEffect(() => {
    const loadReserves = async () => {
      try {
        const data = await fetchCastReserveList(user.user_id, 1, 10);
        setReserves(data.reservations);
      } catch (error) {
        console.error("予約取得エラー", error);
      }
    };

    loadReserves();
  }, [user.user_id]);

  return (
    <div style={{ padding: "16px", position: "relative" }}>
      <h2>予約一覧（キャスト用）</h2>
      {reserves.map((reserve) => (
        <div key={reserve.reservation_id} style={{ border: "1px solid #eee", marginBottom: "8px", padding: "8px" }}>
          <p><strong>予約番号:</strong> {reserve.reservation_id}</p>
          <p><strong>予約者:</strong> {reserve.user_name}</p>
          <p><strong>ステータス:</strong> {reserve.status}</p>
          <p><strong>日時:</strong> {new Date(reserve.start_time).toLocaleString()}</p>
          <p><strong>コース名:</strong> {reserve.course_name}</p>
          <p><strong>場所:</strong> {reserve.location || "未設定"}</p>
          <p><strong>料金:</strong> {reserve.course_price}円 (+交通費: {reserve.traffic_fee}円)</p>
          <button onClick={() => setSelectedReservationId(reserve.reservation_id)}>
            詳細を見る
          </button>
        </div>
      ))}

      {/* ✅ 右スライド式 詳細パネル */}
      {selectedReservationId && (
        <div style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "80%",
          height: "100%",
          backgroundColor: "#fff",
          boxShadow: "-2px 0 8px rgba(0,0,0,0.2)",
          zIndex: 100,
          overflowY: "auto",
          transition: "transform 0.3s ease-in-out"
        }}>
          <button onClick={() => setSelectedReservationId(null)} style={{ padding: "8px" }}>閉じる</button>
          <ReservationDetail reservationId={selectedReservationId} />
        </div>
      )}
    </div>
  );
}
