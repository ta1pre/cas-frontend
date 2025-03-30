import { fetchAPI } from '@/services/auth/axiosInterceptor';

// 駅データの型定義
export interface Station {
  id: number;
  name: string;
}

/**
 * 駅名サジェスト取得API
 * @param query 検索クエリ（駅名の一部）
 * @param prefectureId 都道府県ID（オプション）
 * @returns 駅リスト
 */
export const fetchStationSuggest = async (query: string, prefectureId?: number): Promise<Station[]> => {
  try {
    // 都道府県IDがある場合はリクエストに含める
    const body = { query, prefecture_id: prefectureId };
    console.log("📡 駅名サジェストAPIリクエスト:", body);
    
    const response = await fetchAPI("/api/v1/reserve/cast/station/suggest", body);
    console.log("✅ 駅名サジェストAPIレスポンス:", response);

    return response as Station[];
  } catch (error) {
    console.error("❌ 駅名サジェストAPI呼び出しエラー:", error);
    return []; // エラー時は空配列を返す
  }
};
