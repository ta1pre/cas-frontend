// src/app/p/customer/points/api/purchasePoint.ts

import { fetchAPI } from "@/services/auth/axiosInterceptor";

export default async function purchasePoint(amount: number) {
    const user = globalThis.user ?? null;

    if (!user || !user.userId) {
        console.error("🚨 ユーザーがログインしていません");
        return null;
    }

    const userId = user.userId;
    console.log("✅ `purchasePoint()` - 送信データ:", { user_id: userId, amount });

    try {
        const response = await fetchAPI("/api/v1/points/purchase", {
            user_id: userId,
            amount
        });

        console.log("✅ APIレスポンス:", response);
        return response;
    } catch (error: any) {
        console.error("🚨 APIエラー:", error);
        return null;
    }
}
