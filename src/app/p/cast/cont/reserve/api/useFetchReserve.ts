// 📂 src/app/p/cast/cont/reserve/api/useFetchCastReserve.ts

import { fetchAPI } from "@/services/auth/axiosInterceptor";
import { CastReserveResponse } from "../types/reserveTypes";

// キャスト予約一覧取得API
export const fetchCastReserveList = async (cast_id: number, page = 1, limit = 10): Promise<CastReserveResponse> => {
  try {
    const body = { cast_id, page, limit };
    console.log("📡 APIリクエスト:", body);
    
    const response = await fetchAPI("/api/v1/reserve/cast/rsvelist", body);
    console.log("✅ APIレスポンス:", response);

    return response as CastReserveResponse;
  } catch (error) {
    console.error("🔴 API取得エラー:", error);
    throw error;
  }
};
