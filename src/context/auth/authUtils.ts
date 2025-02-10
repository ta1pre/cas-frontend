import Cookies from 'js-cookie';
import axios from 'axios'; // ✅ `apiClient` の代わりに `axios` を直接インポート

/**
 * `token` の検証を行い、ユーザー情報をセットする
 */
export const verifyToken = async (setUser: any, setIsAuthenticated: any, setLoading: any) => {
    try {
        const token = Cookies.get('token');
        if (!token) {
            console.warn('[AuthUtils] No token found. Skipping /verify request.');
            setIsAuthenticated(false);
            setUser(null);
            return;
        }

        console.log('[AuthUtils] Sending token for verification:', token);

        // ✅ `apiClient` を使わずに `axios` を直接利用
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/auth/verify`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true, // 🔹 Cookie 送信を維持
        });

        const { user_id, user_type, affi_type } = response.data;

        console.log('[AuthUtils] Token verification successful:', response.data);

        setUser({ userId: user_id, userType: user_type, affiType: affi_type });
        setIsAuthenticated(true);
    } catch (err: any) {
        console.error('[AuthUtils] Token Verification Failed:', err.message);
        setIsAuthenticated(false);
        setUser(null);
    } finally {
        setLoading(false);
    }
};

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
