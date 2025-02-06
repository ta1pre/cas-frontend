// src/services/auth/axiosInterceptor.ts

import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log('✅ API_URL:', API_URL);

// ✅ Axiosインスタンス作成
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ✅ リクエストインターセプター
apiClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token'); // Cookieから `access_token` を取得
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        const refreshToken = Cookies.get('refresh_token'); // Cookieから `refresh_token` を取得
        if (refreshToken) {
            config.headers['x-refresh-token'] = refreshToken; // `x-refresh-token` というカスタムヘッダーで送信
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ✅ レスポンスインターセプター
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // `refresh_token` を使用してトークンを更新する処理
            const refreshToken = Cookies.get('refresh_token');
            if (!refreshToken) {
                console.error('❌ `refresh_token` が存在しません');
                return Promise.reject(error);
            }

            try {
                const refreshResponse = await axios.post(`${API_URL}/api/v1/account/auth/refresh`, {}, {
                    headers: {
                        Authorization: `Bearer ${refreshToken}`, // `refresh_token` をヘッダーにセット
                    },
                    withCredentials: true,  // `HttpOnly Cookie` の利用を許可
                });

                const newToken = refreshResponse.data?.access_token;
                if (newToken) {
                    Cookies.set('token', newToken, {
                        expires: 7,
                        secure: true,
                        sameSite: 'lax',
                    });

                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                console.error('⛔ トークンの更新に失敗しました:', refreshError);
                window.location.href = '/auth/login'; // ログイン画面へリダイレクト
            }
        }

        return Promise.reject(error);
    }
);

// ✅ APIクライアントをエクスポート
export default apiClient;
