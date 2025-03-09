// 📂 src/app/p/customer/area/api/registerPrefecture.ts
import { fetchAPI } from "@/services/auth/axiosInterceptor"; // ✅ API通信用

export default async function registerPrefecture(prefectureId: number) {
    // ✅ `globalThis.user` から `user_id` を取得
    const user = globalThis.user ?? null;

    if (!user || !user.userId) {
        console.error("🚨 ユーザーがログインしていません");
        return null;
    }

    const userId = user.userId;
    console.log("📡 `POST /api/v1/customer/area/prefecture/register` をリクエスト:", { user_id: userId, prefecture_id: prefectureId });

    try {
        // ✅ `user_id` を API に渡して登録リクエスト
        const response = await fetchAPI("/api/v1/customer/area/prefecture/register", {
            user_id: userId,
            prefecture_id: prefectureId
        });

        console.log("✅ 登録成功:", response);
        return response;
    } catch (error: any) {
        console.error("🚨 登録エラー:", error);
        return null;
    }
}
