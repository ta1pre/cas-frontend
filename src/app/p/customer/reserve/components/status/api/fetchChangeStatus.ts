import { fetchAPI } from "@/services/auth/axiosInterceptor";

export default async function fetchChangeStatus(
    nextStatus: string,
    reservationId: number,
    userId: number
) {
    console.log("🟡 fetchChangeStatus() -", { nextStatus, reservationId, userId });
    try {
        const response = await fetchAPI(`/api/v1/reserve/common/change_status/${nextStatus}`, {
            reservation_id: reservationId,
            user_id: userId,
        });
        console.log("✅ ステータス変更APIレスポンス:", response);
        return response;
    } catch (error) {
        console.error("🚨 ステータス変更APIエラー:", error);
        return { status: "ERROR", message: "ステータス変更に失敗しました" };
    }
}
