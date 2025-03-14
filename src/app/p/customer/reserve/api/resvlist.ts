import { fetchAPI } from "@/services/auth/axiosInterceptor";
import { ReservationListItem } from "./types";

export default async function fetchCustomerReserve(
    page: number = 1,
    limit: number = 10
): Promise<{ reservations: ReservationListItem[], totalCount: number } | null> {
    const user = globalThis.user ?? null;

    if (!user) {
        console.error("🚨 ユーザーがログインしていません");
        return null;
    }

    try {
        console.log(`📡 POST /api/v1/reserve/customer/rsvelist をリクエスト`, { user_id: user.userId, page, limit });

        // ✅ `page` & `limit` を body に含める
        const response = await fetchAPI("/api/v1/reserve/customer/rsvelist", {
            user_id: user.userId,
            page,
            limit
        });

        console.log("✅ APIレスポンス:", response);

        return {
            reservations: response.reservations, // ✅ 予約データ
            totalCount: response.total_count, // ✅ 総件数
        };
    } catch (error: any) {
        if (error.response?.status === 404) {
            console.warn("⚠️ 予約が見つかりません");
            return { reservations: [], totalCount: 0 };
        }
        console.error("🚨 APIエラー:", error);
        return null;
    }
}
