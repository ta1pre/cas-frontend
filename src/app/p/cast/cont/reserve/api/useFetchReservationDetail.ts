// 📂 src/app/p/cast/cont/reserve/api/useFetchReservationDetail.ts

import { fetchAPI } from "@/services/auth/axiosInterceptor";

export const fetchReservationDetail = async (reservationId: number, castId: number) => {
  try {
    const response = await fetchAPI("/api/v1/reserve/cast/detail", {
      reservation_id: reservationId,
      cast_id: castId
    });

    console.log("✅ 予約詳細取得成功:", response);
    return response;
  } catch (error) {
    console.error("🔴 予約詳細取得エラー:", error);
    throw error;
  }
};
