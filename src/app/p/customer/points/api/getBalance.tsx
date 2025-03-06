import { fetchAPI } from "@/services/auth/axiosInterceptor"; // ✅ API通信用

export default async function fetchPointBalance() {
    // ✅ `globalThis.user` から `userId` を取得
    const user = globalThis.user ?? null;
    
    if (!user || !user.userId) {
        console.error("🚨 ユーザーがログインしていません、または `userId` が取得できません");
        return null;
    }

    const userId = user.userId;
    console.log("✅ `fetchPointBalance()` - 取得した `userId`:", userId); // ✅ デバッグログ

    try {
        console.log("📡 `POST /api/v1/points/balance` をリクエスト:", { user_id: userId });

        // ✅ `userId` を API に渡してリクエスト
        const response = await fetchAPI("/api/v1/points/balance", { user_id: userId });

        console.log("✅ APIレスポンス:", response);
        return response;
    } catch (error: any) {
        console.error("🚨 APIエラー:", error);
        return null;
    }
}
