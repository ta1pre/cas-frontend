// 📂 src/app/p/cast/cont/reserve/api/useFetchCastOptions.ts
import { fetchAPI } from "@/services/auth/axiosInterceptor";

export const fetchCastOptions = async (reservationId: number, castId: number) => {
  try {
    const response = await fetchAPI("/api/v1/reserve/cast/options", {
      reservation_id: reservationId,
      cast_id: castId,
    });
    console.log("✅ オプション取得成功:", response);
    return response;
  } catch (error) {
    console.error("🔴 オプション取得失敗:", error);
    throw error;
  }
};
