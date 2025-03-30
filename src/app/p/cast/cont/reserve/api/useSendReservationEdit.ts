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
  console.log("🔵 [sendReservationEdit] Received requestData:", JSON.stringify(requestData, null, 2)); // ★ 追加: 関数開始時のデータ確認
  try {
    console.log("🟡 [sendReservationEdit] Processing custom_options:", requestData.custom_options); // ★ 追加: custom_options処理前のデータ確認

    // リクエストデータのディープコピーを作成
    const requestToSend = {
      ...requestData,
      // custom_optionsが配列であることを保証
      custom_options: Array.isArray(requestData.custom_options)
        ? requestData.custom_options.map((opt, index) => {
            console.log(`🟠 [sendReservationEdit] Mapping custom_option #${index}:`, opt); // ★ 追加: map内の各要素確認
            console.log(`🟠 [sendReservationEdit]   - opt.price: ${opt.price}, typeof: ${typeof opt.price}`); // ★ 追加: priceの値と型を確認
            const priceAsNumber = typeof opt.price === 'number' ? opt.price : parseInt(String(opt.price));
            console.log(`🟠 [sendReservationEdit]   - priceAsNumber: ${priceAsNumber}`); // ★ 追加: パース後の値を確認
            if (isNaN(priceAsNumber)) {
              console.error(`🔴 [sendReservationEdit] Error: custom_option #${index} price is NaN after parsing! Original price:`, opt.price);
              // 必要に応じてエラー処理を追加 (例: デフォルト値を設定、エラーを投げるなど)
              // ここでは一旦NaNのまま進めるが、ログで確認できるようにする
            }
            return {
              name: opt.name,
              price: priceAsNumber // パース後の数値を使用 (NaNの可能性あり)
            };
          })
        : []
    };

    console.log("✅ 予約編集API送信前データ:", JSON.stringify(requestToSend, null, 2)); // ここに到達するか？

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
