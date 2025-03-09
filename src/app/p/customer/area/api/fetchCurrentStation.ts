// 📂 src/app/p/customer/area/api/fetchCurrentStation.ts
import { fetchAPI } from "@/services/auth/axiosInterceptor"; 

export default async function fetchCurrentStation() {
    const user = globalThis.user ?? null;
    console.log("🟢 ユーザー情報:", user); // ✅ ユーザー情報をログ出力

    if (!user || !user.userId) {
        console.error("🚨 ユーザーがログインしていません");
        return null;
    }

    try {
        const response = await fetchAPI("/api/v1/customer/area/station/current", {
            user_id: user.userId,
        });

        console.log("✅ APIレスポンス:", response);

        if (!response) {
            console.error("🚨 API から null が返されました");
            return null;
        }

        return {
            id: response.id,
            name: response.name,
            lineName: response.line_name || "路線名不明",
        };
    } catch (error: any) {
        console.error("🚨 最寄り駅の取得に失敗:", error);
        return null;
    }
}
