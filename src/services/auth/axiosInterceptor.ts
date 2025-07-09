import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

// JWTデコード時の型定義
interface DecodedUser {
    user_id: number;
    user_type: string;
    affi_type: number;
    exp: number;
}

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
// SSGビルド時にはログを出力しない
if (typeof window !== 'undefined') {
    console.log("【axiosInterceptor】✅ 開始");
}

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
    timeout: 30000, // 30秒のタイムアウト設定
});

// リトライロジックの追加
apiClient.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        
        // タイムアウトエラーの場合、最大2回リトライ
        if (error.code === 'ECONNABORTED' && !originalRequest._retry && originalRequest._retryCount < 2) {
            originalRequest._retry = true;
            originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
            
            console.log(`【axiosInterceptor】⏱️ タイムアウト発生。リトライ ${originalRequest._retryCount}/2`);
            
            // リトライ前に少し待機（指数バックオフ）
            await new Promise(resolve => setTimeout(resolve, 1000 * originalRequest._retryCount));
            
            return apiClient(originalRequest);
        }
        
        return Promise.reject(error);
    }
);

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
/**
 * Cookieからトークンを取得してglobalThis.userを設定
 */
const getAuthToken = (): string | null => {
    // まずglobalThis.userを確認
    if (globalThis.user?.token) {
        return globalThis.user.token;
    }
    
    // Cookieからトークンを取得
    const storedToken = Cookies.get('token');
    if (storedToken) {
        try {
            const decodedUser = jwtDecode<DecodedUser>(storedToken);
            console.log("✅ Cookieからトークンを取得してデコード:", decodedUser);
            
            // globalThis.userを設定
            globalThis.user = {
                userId: decodedUser.user_id,
                userType: decodedUser.user_type,
                affiType: decodedUser.affi_type,
                token: storedToken
            };
            
            return storedToken;
        } catch (error) {
            console.error("🔴 トークンのデコードに失敗:", error);
            return null;
        }
    }
    
    return null;
};

export const fetchAPI = async (endpoint: string, data?: object, method: string = "POST") => {
    // トークンを取得（globalThis.userまたはCookieから）
    const token = getAuthToken();
    
    if (!token) {
        console.warn("【fetchAPI】⚠️ 認証トークンが見つかりません");
        console.warn("【fetchAPI】🔍 globalThis.user:", globalThis.user);
        console.warn("【fetchAPI】🍪 Cookies:", document?.cookie);
        
        // 開発環境でもトークンがない場合はnullを返す
        return null;
    }

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
        
        const upperMethod = method.toUpperCase();
        if (upperMethod === "GET") {
            // GETリクエストの場合、dataをパラメータとして渡す
            response = await apiClient.get(endpoint, {
                ...config,
                params: data
            });
                } else if (upperMethod === "PUT") {
            response = await apiClient.put(endpoint, data, config);
        } else if (upperMethod === "PATCH") {
            response = await apiClient.patch(endpoint, data, config);
        } else if (upperMethod === "DELETE") {
            response = await apiClient.delete(endpoint, { ...config, data });
        } else {
                        // POST (default)
            response = await apiClient.post(endpoint, data, config);
        }

        console.log(`【fetchAPI】✅ ${method} レスポンス:`, response.data);
        return response.data;
    } catch (error: any) {
        // 詳細なエラー情報を記録
        if (error.response) {
            console.error(`【fetchAPI】❌ ${method} API 呼び出し失敗:`, {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data,
                headers: error.response.headers,
                endpoint: endpoint
            });
            return error.response.data;
        } else if (error.request) {
            console.error(`【fetchAPI】❌ ネットワークエラー:`, {
                message: error.message,
                code: error.code,
                endpoint: endpoint
            });
        } else {
            console.error(`【fetchAPI】❌ 予期しないエラー:`, error);
        }
        return null;
    }
};

export default apiClient;
