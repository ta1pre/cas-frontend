import { fetchAPI } from "@/services/auth/axiosInterceptor"; // ✅ API通信

export async function fetchCustomerReserve() {
    const user = globalThis.user ?? null;
    
    if (!user || !user.userId) {
        console.error("🚨 ユーザーがログインしていません、または `userId` が取得できません");
        return null;
    }

    const userId = user.userId;
    console.log("✅ `fetchCustomerReserve()` - 送信データ:", { user_id: userId });

    try {
        console.log("📡 `GET /api/v1/reserve/customer/test` をリクエスト:", { user_id: userId });

        // ✅ APIリクエスト送信
        const response = await fetchAPI("/api/v1/reserve/customer/test", { user_id: userId });

        console.log("✅ APIレスポンス:", response);
        return response;
    } catch (error: any) {
        console.error("🚨 APIエラー:", error);
        return null;
    }
}
