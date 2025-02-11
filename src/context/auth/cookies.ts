import { extendRefreshToken as refreshTokenAPI } from "@/hooks/cookies/extend_refresh_token"; // ✅ `extend_refresh_token.ts` を使用

/**
 * `refresh_token` を更新する関数
 */
export const extendRefreshToken = async () => {
    try {
        console.log("📡 `extendRefreshToken()` を実行...");
        await refreshTokenAPI(); // ✅ 実際の `refresh_token` 更新処理を実行
        console.log("✅ `extendRefreshToken()` の実行完了");
    } catch (err) {
        console.error("❌ `extendRefreshToken()` の実行エラー:", err);
    }
};
