import axios from "axios";

/**
 * ============================================
 * 【axiosInterceptor.ts】APIリクエストを統一するためのファイル
 * ============================================
 * 
 * このファイルでは、以下の2つの機能を提供する:
 * 
 * 1. `apiClient`: Axios をベースにしたカスタム API クライアント
 * 2. `fetchAPI()`: API リクエストを簡単に統一するための関数
 * 
 * すべての API 呼び出しを `fetchAPI(endpoint, data)` の形で実行することで、
 * ヘッダーやトークンの管理を一元化し、各コンポーネントでのコードの冗長性を減らす。
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log("【axiosInterceptor】✅ 開始");

/**
 * `apiClient`: カスタム Axios インスタンス
 * 
 * - `baseURL`: API のベース URL（環境変数から取得）
 * - `withCredentials: true`: クッキーや認証情報を自動送信
 * - `headers`: `Content-Type: application/json` をデフォルト設定
 * 
 * `fetchAPI()` の内部で使用される。
 */
const apiClient = axios.create({
    baseURL: API_URL,
    withCredentials: true, // 🔹 Cookie を自動送信（HttpOnly な `access_token` を含む）
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * `fetchAPI()`: API リクエストを統一するための関数
 * 
 * @param {string} endpoint - API のエンドポイント（例: `/api/v1/setup/status/test`）
 * @param {object} [data] - API に送信するデータ（オプション）
 * @param {string} [method="POST"] - HTTPメソッド（デフォルトは「POST」）
 * 
 * ✅ 認証情報の自動付与
 * ✅ `globalThis.user` から `token` を取得
 * ✅ `axios.post()` または `axios.get()` を使ってリクエストを送信
 * ✅ エラー時は `null` を返す
 * 
 * 🔹 使い方:
 * ```tsx
 * const result = await fetchAPI("/api/v1/setup/status/test", { user_id: 123 });
 * const status = await fetchAPI("/api/v1/cast/identity-verification/status", null, "GET");
 * ```
 */
export const fetchAPI = async (endpoint: string, data?: object, method: string = "POST") => {
    /**
     * `globalThis.user`: ユーザー情報を保持するグローバル変数
     * 
     * `globalThis.user` には、ログインユーザーの `token` や `userId` が格納されている。
     * 
     * 🔹 例:
     * ```tsx
     * console.log(globalThis.user);
     * // { userId: 41, userType: "cast", affiType: 11, token: "xxxxx" }
     * ```
     * 
     * `fetchAPI()` は `token` を `Authorization` ヘッダーにセットするため、
     * `globalThis.user.token` が存在しない場合は API を呼び出さずに `null` を返す。
     */
    if (typeof globalThis.user === "undefined" || !globalThis.user?.token) {
        console.warn("【fetchAPI】⚠️ `globalThis.user` が未定義のため API を叩けません");
        return null;
    }

    const token = globalThis.user.token;

    try {
        console.log(`【fetchAPI】🔍 ${method} ${API_URL}${endpoint} をリクエスト中...`);
        
        /**
         * `axios.post()` または `axios.get()`: API を呼び出す
         * 
         * `Authorization` ヘッダーに `token` をセットし、API を実行する。
         * レスポンスデータは `response.data` に含まれるため、直接返す。
         */
        let response;
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        };
        
        if (method.toUpperCase() === "GET") {
            // GETリクエストの場合、dataをパラメータとして渡す
            response = await apiClient.get(endpoint, {
                ...config,
                params: data
            });
        } else {
            // POSTリクエストの場合（デフォルト）
            response = await apiClient.post(endpoint, data, config);
        }

        console.log(`【fetchAPI】✅ ${method} レスポンス:`, response.data);
        return response.data;
    } catch (error: any) {
        // AxiosError の場合はレスポンス内容を返す（バリデーションエラー詳細など）
        if (error.response) {
            console.error(`【fetchAPI】❌ ${method} API 呼び出し失敗:`, error.response.data);
            return error.response.data;
        }
        console.error(`【fetchAPI】❌ ${method} API 呼び出し失敗:`, error);
        return null;
    }
};

export default apiClient;
