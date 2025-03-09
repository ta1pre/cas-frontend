// 📂 src/app/p/customer/area/api/registerSuggestedStation.ts
import { fetchAPI } from "@/services/auth/axiosInterceptor"; // ✅ API通信用

export default async function registerSuggestedStation(stationId: number) {
    // ✅ `globalThis.user` から `user_id` を取得
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
            station: stationId,
        });

        console.log("✅ 登録成功:", response);
        return response;
    } catch (error: any) {
        console.error("🚨 登録APIエラー:", error);
        return null;
    }
}
