import Cookies from 'js-cookie';
import axios from 'axios'; // ✅ `apiClient` の代わりに `axios` を直接インポート

/**
 * ✅ ログイン処理
 */
export const login = async (provider: 'line' | 'phone' | 'email', credentials?: any) => {
    try {
        switch (provider) {
            case 'line':
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/line/login?tracking_id=${credentials?.trackingId || 'DEFAULT_ID'}`, {
                    withCredentials: true, // 🔹 Cookie 送信を維持
                });
                const authUrl = response.data?.auth_url;
                if (authUrl) {
                    console.log('🌐 Redirecting to LINE Auth URL:', authUrl);
                    window.location.href = authUrl; // LINE認証画面にリダイレクト
                } else {
                    throw new Error('LINE認証URLが見つかりません');
                }
                break;
            case 'phone':
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/phone/login`, {
                    phone: credentials?.phone,
                    password: credentials?.password,
                }, {
                    withCredentials: true,
                });
                break;
            case 'email':
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/email/login`, {
                    email: credentials?.email,
                    password: credentials?.password,
                }, {
                    withCredentials: true,
                });
                break;
            default:
                throw new Error('Unsupported authentication provider');
        }
    } catch (err: any) {
        console.error('[AuthUtils] Login Error:', err.message);
        throw err;
    }
};

/**
 * ✅ ログアウト処理
 */
export const logout = () => {
    Cookies.remove('token');
};
