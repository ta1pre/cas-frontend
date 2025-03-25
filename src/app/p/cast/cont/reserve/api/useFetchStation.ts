// 📂 src/app/p/cast/cont/reserve/api/useFetchStation.ts

import { fetchAPI } from "@/services/auth/axiosInterceptor";

interface Station {
  id: number;
  name: string;
}

// 駅名サジェスト取得API
export const fetchStationSuggest = async (query: string): Promise<Station[]> => {
  try {
    const body = { query };
    console.log("📡 駅名サジェストAPIリクエスト:", body);
    
    const response = await fetchAPI("/api/v1/reserve/cast/station/suggest", body);
    console.log("✅ 駅名サジェストAPIレスポンス:", response);

    return response as Station[];
  } catch (error) {
    console.error("🔴 駅名サジェストAPI取得エラー:", error);
    throw error;
  }
};
