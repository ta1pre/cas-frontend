// File: /middleware/tokenMiddleware.ts
import { NextRequest } from "next/server";
import { refreshToken } from "../hooks/cookies/extend_token";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

/**
 * トークンの有効期限をチェックし、必要に応じて更新を行う
 */
export async function tokenMiddlewareLogic(request: NextRequest): Promise<string | null> {
    try {
        // クッキーからtoken取得ログ
        const cookieToken = request.cookies.get("token")?.value;
        console.log("【tokenMiddleware】サーバーで見えているtoken:", cookieToken);
        
        if (!cookieToken) {
            console.log("【tokenMiddleware】tokenが存在しません。refreshTokenを実行します。");
            return await refreshToken(request);
        }

        try {
            // トークンの有効期限をチェック
            const { payload } = await jwtVerify(cookieToken, new TextEncoder().encode(JWT_SECRET));
            const exp = payload.exp as number;
            const now = Math.floor(Date.now() / 1000);
            
            console.log("【tokenMiddleware】token有効期限チェック:", {
                exp: exp,
                now: now,
                remaining: exp - now,
                expired: exp <= now
            });

            // 有効期限まで5分以上残っている場合はそのまま使用
            if (exp > now + 300) {
                console.log("✅【tokenMiddleware】 tokenは有効です。更新をスキップします。");
                return cookieToken;
            }
            
            console.log("🚀 【tokenMiddleware】Token有効期限が近いため更新を実行します...");
        } catch (verifyError) {
            console.log("【tokenMiddleware】token検証エラー。refreshTokenを実行します:", verifyError);
        }

        // トークンを更新
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
