import { fetchAPI } from "@/services/auth/axiosInterceptor";

export default async function registerNearestStation(stationId: number) {
    const user = globalThis.user ?? null;
    if (!user || !user.userId) {
        console.error("🚨 ユーザーがログインしていません");
        return null;
    }

    const userId = user.userId;
    console.log("📡 `POST /api/v1/customer/area/station/register` をリクエスト:", { user_id: userId, station: stationId });

    try {
        const response = await fetchAPI("/api/v1/customer/area/station/register", {
            user_id: userId,
            station: stationId, // ✅ 修正: API 仕様に合わせて送信
        });

        console.log("✅ 登録成功:", response);
        return response;
    } catch (error: any) {
        console.error("🚨 登録エラー:", error);
        return null;
    }
}
