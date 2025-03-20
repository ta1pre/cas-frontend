// File: /middleware/tokenMiddleware.ts
import { NextRequest } from "next/server";
import { refreshToken } from "../hooks/cookies/extend_token";

/**
 * トークンの更新を行い、リクエストのヘッダーを書き換える
 */
export async function tokenMiddlewareLogic(request: NextRequest): Promise<string | null> {
    try {
        console.log("🚀 【tokenMiddleware】Token更新 を実行して token を更新します...");
        const token = await refreshToken(request);
        if (!token) {
            console.warn("【tokenMiddleware】⛔ Token更新 が null を返しました。");
            return null;
        }

        console.log("✅【tokenMiddleware】 token 更新完了:", token);
        return token;
    } catch (error) {
        console.error("❌【tokenMiddleware】エラー発生:", error);
        return null;
    }
}
