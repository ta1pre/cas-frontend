import axios from 'axios';
import { extendRefreshToken } from "@/hooks/cookies/extend_refresh_token"; // ✅ これのみ実行

// ✅ APIのベースURLを環境変数から取得
const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log('✅ API_URL:', API_URL);
console.log("ax開始");

// ✅ シンプルな axios インスタンス
const apiClient = axios.create({
    baseURL: API_URL,
    withCredentials: true, // 🔹 Cookie を自動送信（HttpOnly な `access_token` を含む）
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    async (config) => {
        console.log("🌟 こんにちわぁ！`interceptors.request.use()` が実行されました - リクエストURL:", config.url);
        console.log("📡 `extendRefreshToken()` を実行..."); // ✅ `extendRefreshToken()` のログを追加
        await extendRefreshToken(); // ✅ ここが実行されているか確認
        console.log("✅ `extendRefreshToken()` の実行完了");

        return config;
    }
);

export default apiClient;
