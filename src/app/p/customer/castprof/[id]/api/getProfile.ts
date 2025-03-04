// src/app/p/customer/castprof/[id]/api/getProfile.ts
import { fetchAPI } from "@/services/auth/axiosInterceptor";

export default async function fetchProfile(castId: number) { // ✅ **関数名を変更**
    const user = globalThis.user ?? null;

    if (!user) {
        console.error("🚨 ユーザーがログインしていません");
        return null;
    }

    try {
        console.log("📡 `POST /api/v1/customer/castprof/` をリクエスト:", { cast_id: castId, user_id: user.userId });

        const response = await fetchAPI("/api/v1/customer/castprof/", { cast_id: castId, user_id: user.userId });

        console.log("✅ APIレスポンス:", response);
        return response;
    } catch (error: any) {
        if (error.response?.status === 404) {
            console.warn("⚠️ キャストが見つかりません");
            return null;
        }
        console.error("🚨 APIエラー:", error);
        return null;
    }
}
