// src/app/p/customer/points/api/getHistory.ts

import { fetchAPI } from "@/services/auth/axiosInterceptor"; // ✅ API通信用

export default async function fetchPointHistory(limit: number, offset: number) {
    const user = globalThis.user ?? null;

    if (!user || !user.userId) {
        console.error("🚨 ユーザーがログインしていません、または `userId` が取得できません");
        return null;
    }

    const userId = user.userId;
    console.log("✅ `fetchPointHistory()` - 取得した `userId`:", userId);

    try {
        console.log("📡 `POST /api/v1/points/history` をリクエスト:", { user_id: userId, limit, offset });

        const response = await fetchAPI("/api/v1/points/history", {
            user_id: userId,
            limit,
            offset
        });

        console.log("✅ APIレスポンス:", response);
        return response;
    } catch (error: any) {
        console.error("🚨 APIエラー:", error);
        return null;
    }
}
