import { extendRefreshToken } from "@/hooks/cookies/extend_refresh_token";

/**
 * トークンミドルウェア
 * - 単純に `extendRefreshToken()` を実行する
 */
export const tokenMiddleware = async (): Promise<void> => {
    console.log("🔄 トークン更新開始...");
    try {
        await extendRefreshToken();
        console.log("✅ トークンの更新が完了しました。");
    } catch (error) {
        console.error("❌ トークンミドルウェア: トークンの更新に失敗しました。", error);
    }
};
