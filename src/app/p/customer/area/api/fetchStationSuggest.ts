// 📂 src/app/p/customer/area/api/fetchStationSuggest.ts
import { fetchAPI } from "@/services/auth/axiosInterceptor"; // ✅ API通信用

export default async function fetchStationSuggest(query: string) {
    // ✅ `globalThis.user` から `user_id` を取得
    const user = globalThis.user ?? null;

    if (!user || !user.userId) {
        console.error("🚨 ユーザーがログインしていません");
        return [];
    }

    const userId = user.userId;
    console.log("📡 `POST /api/v1/customer/area/station/suggest` をリクエスト:", { user_id: userId, query });

    try {
        const response = await fetchAPI("/api/v1/customer/area/station/suggest", { query });

        console.log("✅ APIレスポンス:", response);

        if (!Array.isArray(response)) {
            console.error("🚨 APIが配列を返していません:", response);
            return [];
        }

        return response.map((station: any) => ({
            id: station.id,
            name: station.name,
            lineName: station.line_name, // ✅ 路線名
        }));
    } catch (error: any) {
        console.error("🚨 APIエラー:", error);
        return [];
    }
}
