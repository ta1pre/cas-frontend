// 📂 src/app/p/customer/area/api/getPrefectures.ts
import { fetchAPI } from "@/services/auth/axiosInterceptor"; // ✅ API通信用

export default async function fetchPrefectures() {
    // ✅ `globalThis.user` から `user_id` を取得
    const user = globalThis.user ?? null;

    if (!user || !user.userId) {
        console.error("🚨 ユーザーがログインしていません、または `userId` が取得できません");
        return [];
    }

    const userId = user.userId;
    console.log("✅ `fetchPrefectures()` - 取得した `userId`:", userId); // ✅ デバッグログ

    try {
        console.log("📡 `POST /api/v1/prefectures` をリクエスト:", { user_id: userId });

        // ✅ `userId` を API に渡してリクエスト
        const response = await fetchAPI("/api/v1/customer/area/prefectures", { user_id: userId });

        console.log("✅ APIレスポンス:", response);
        return response;
    } catch (error: any) {
        console.error("🚨 APIエラー:", error);
        return [];
    }
}
