import { fetchAPI } from "@/services/auth/axiosInterceptor"; // ✅ API通信

export default async function applyPointRule(ruleName: string) {
    const user = globalThis.user ?? null;
    
    if (!user || !user.userId) {
        console.error("🚨 ユーザーがログインしていません、または `userId` が取得できません");
        return null;
    }

    const userId = user.userId;
    console.log("✅ `applyPointRule()` - 送信データ:", { user_id: userId, rule_name: ruleName });

    try {
        console.log("📡 `POST /api/v1/points/apply` をリクエスト:", { user_id: userId, rule_name: ruleName });

        // ✅ APIリクエスト送信
        const response = await fetchAPI("/api/v1/points/apply", {
            user_id: userId,
            rule_name: ruleName
        });

        console.log("✅ APIレスポンス:", response);
        return response;
    } catch (error: any) {
        console.error("🚨 APIエラー:", error);
        return null;
    }
}
