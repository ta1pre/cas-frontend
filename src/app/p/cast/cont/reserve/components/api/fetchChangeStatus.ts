import { fetchAPI } from "@/services/auth/axiosInterceptor";

/**
 * ステータス変更API呼び出し関数（キャスト用）
 * @param nextStatus 変更後のステータス
 * @param reservationId 予約ID
 * @param userId キャストユーザーID
 * @param latitude 緯度（任意）
 * @param longitude 経度（任意）
 */
export default async function fetchChangeStatus(
  nextStatus: string,
  reservationId: number,
  userId: number,
  latitude?: number,
  longitude?: number
) {
  try {
    const response = await fetchAPI(`/api/v1/reserve/common/change_status/${nextStatus}`, {
      reservation_id: reservationId,
      user_id: userId,
      latitude,
      longitude,
    });
    return response;
  } catch (error) {
    console.error("ステータス変更APIエラー:", error);
    return { status: "ERROR", message: "ステータス変更に失敗しました" };
  }
}
