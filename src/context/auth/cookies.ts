import { extendRefreshToken as refreshTokenAPI } from "@/hooks/cookies/extend_refresh_token"; // ✅ `extend_refresh_token.ts` を使用
import { getLocalTokenExpiration, getTokenExpiration, logTokenExpirations } from "@/hooks/cookies/extend_token"; // ✅ `extend_token.ts` をインポート

/**
 * `refresh_token` を更新し、その後 `local_token` と `token` の状態を確認
 */
export const extendRefreshToken = async () => {
    try {
        console.log("📡 `extendRefreshToken()` を実行...");
        
        await refreshTokenAPI(); // ✅ `refresh_token` の更新処理を実行
        console.log("✅ `extendRefreshToken()` の実行完了");

        console.log("📡 `logTokenExpirations()` を実行...");
        await logTokenExpirations(); // ✅ `local_token` と `token` の状態をログ出力
        console.log("✅ `logTokenExpirations()` の実行完了");
    } catch (err) {
        console.error("❌ `extendRefreshToken()` または `logTokenExpirations()` の実行エラー:", err);
    }
};
