import { fetchAPI } from '@/services/auth/axiosInterceptor';

// 駅データの型定義
export interface Station {
  id: number;
  name: string;
}

/**
 * 駅名サジェスト取得API
 * @param query 検索クエリ（駅名の一部）
 * @returns 駅リスト
 */
export const fetchStationSuggest = async (query: string): Promise<Station[]> => {
  try {
    const body = { query };
    console.log("📡 駅名サジェストAPIリクエスト:", body);
    
    const response = await fetchAPI("/api/v1/reserve/cast/station/suggest", body);
    console.log("✅ 駅名サジェストAPIレスポンス:", response);

    return response as Station[];
  } catch (error) {
    console.error("❌ 駅名サジェストAPI呼び出しエラー:", error);
    return []; // エラー時は空配列を返す
  }
};
