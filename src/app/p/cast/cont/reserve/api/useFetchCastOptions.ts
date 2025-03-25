// 📂 src/app/p/cast/cont/reserve/api/useFetchCastOptions.ts
import { fetchAPI } from "@/services/auth/axiosInterceptor";

export const fetchCastOptions = async (reservationId: number, castId: number) => {
  try {
    console.log(`オプション取得リクエスト: reservation_id=${reservationId}, cast_id=${castId}`);
    const response = await fetchAPI("/api/v1/reserve/cast/options", {
      reservation_id: reservationId,
      cast_id: castId,
    });
    
    // レスポンスの検証
    if (!response) {
      console.warn("オプション取得: レスポンスがnullです");
      return { available_options: [] }; // デフォルト値を返す
    }
    
    if (!response.available_options) {
      console.warn("オプション取得: available_optionsが存在しません", response);
      return { ...response, available_options: [] }; // デフォルト値を追加
    }
    
    console.log("✅ オプション取得成功:", response);
    return response;
  } catch (error) {
    console.error("🔴 オプション取得失敗:", error);
    // エラー時にはデフォルト値を返す
    return { available_options: [] };
  }
};
