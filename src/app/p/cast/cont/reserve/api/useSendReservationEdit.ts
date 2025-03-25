// 📂 src/app/p/cast/cont/reserve/api/useSendReservationEdit.ts

import { fetchAPI } from "@/services/auth/axiosInterceptor";

import { ReservationStatus } from "../types/reserveTypes";

// カスタムオプションの型定義
export interface CustomOption {
  name: string;
  price: number;
}

// 予約編集リクエストの型定義
export interface ReservationEditRequest {
  reservation_id: number;
  cast_id: number;
  course_id: number; // コースIDを追加
  start_time: string;
  end_time: string;
  location: string;
  reservation_note: string;
  status?: ReservationStatus; // バックエンドでデフォルト値が設定されるため省略可能
  option_ids: number[];
  custom_options: CustomOption[];
  transportation_fee?: number; // 交通費を追加
}

/**
 * 予約編集APIを呼び出す関数
 * @param requestData 編集内容を含むリクエストデータ
 * @returns APIレスポンス
 */
export const sendReservationEdit = async (requestData: ReservationEditRequest) => {
  try {
    // リクエストデータのディープコピーを作成
    const requestToSend = {
      ...requestData,
      // custom_optionsが配列であることを保証
      custom_options: Array.isArray(requestData.custom_options) 
        ? requestData.custom_options.map(opt => ({
            name: opt.name,
            price: typeof opt.price === 'number' ? opt.price : parseInt(String(opt.price))
          }))
        : []
    };
    
    console.log("✅ 予約編集API送信前データ:", JSON.stringify(requestToSend, null, 2));
    
    // カスタムオプションの検証
    if (requestToSend.custom_options.length > 0) {
      console.log("カスタムオプション検証:");
      requestToSend.custom_options.forEach((opt, index) => {
        console.log(`  - オプション #${index+1}: 名前=${opt.name}, 価格=${opt.price}`);
      });
    } else {
      console.log("カスタムオプションなし");
    }
    
    const response = await fetchAPI("/api/v1/reserve/cast/edit", requestToSend);
    console.log("✅ 予約編集成功:", response);
    return response;
  } catch (error) {
    console.error("🔴 予約編集失敗:", error);
    throw error;
  }
};
