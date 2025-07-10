import { fetchAPI } from "@/services/auth/axiosInterceptor";

export interface ReferredUser {
    id: number;
    nick_name: string;
    line_id: string;
    created_at: string;
}

export default async function fetchReferredUsers(): Promise<ReferredUser[] | null> {
    // グローバルユーザー情報を取得
    const user = globalThis.user ?? null;
    
    if (!user || !user.userId) {
        console.error("🚨 ユーザーがログインしていません、または userId が取得できません");
        return null;
    }

    const userId = user.userId;
    console.log("✅ fetchReferredUsers() - 取得した userId:", userId);

    try {
        console.log("📡 POST /api/v1/points/referred_users をリクエスト");

        // APIリクエスト（POSTメソッド、ボディは空）
        const response = await fetchAPI("/api/v1/points/referred_users", {});

        console.log("✅ APIレスポンス:", response);
        return response as ReferredUser[];
    } catch (error: any) {
        console.error("🚨 APIエラー:", error);
        return null;
    }
}