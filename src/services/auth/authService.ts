import { loginWithLine } from './providers/lineAuth';
import { loginWithPhone } from './providers/phoneAuth';
import { loginWithEmail } from './providers/emailAuth';
import apiClient from './axiosInterceptor'; // APIクライアントをインポート

export type AuthProvider = 'line' | 'phone' | 'email';

/**
 * 認証を実行する共通インターフェース
 * @param provider - 'line' | 'phone' | 'email'
 * @param credentials - 各プロバイダーに必要な認証情報
 */
export async function login(
    provider: AuthProvider,
    credentials?: { 
        phone?: string; 
        email?: string; 
        password?: string; 
        trackingId?: string; // ✅ trackingIdを追加
    }
): Promise<void> {
    switch (provider) {
        case 'line':
            return await loginWithLine(credentials?.trackingId || 'DEFAULT_ID');
        case 'phone':
            return await loginWithPhone(credentials?.phone, credentials?.password);
        case 'email':
            return await loginWithEmail(credentials?.email, credentials?.password);
        default:
            throw new Error('Unsupported authentication provider');
    }
}

/**
 * `refresh_token` の有効期限を取得する関数
 */
export const fetchRefreshTokenExpiration = async (): Promise<string | null> => {
    try {
        // `HttpOnly Cookie` を利用するため `withCredentials: true` を設定
        const response = await apiClient.get('/api/v1/account/auth/refresh_token_expiration', {
            withCredentials: true,
        });

        return response.data.expiration || null;
    } catch (error) {
        console.error('❌ `refresh_token` の有効期限取得に失敗:', error);
        return null;
    }
};

