import Cookies from 'js-cookie';
import axios from 'axios'; // ✅ `apiClient` の代わりに `axios` を直接インポート

// axiosのデフォルトタイムアウト設定
axios.defaults.timeout = 30000; // 30秒

/**
 * ✅ ログイン処理
 */
export const login = async (provider: 'line' | 'phone' | 'email', credentials?: any) => {
    try {
        switch (provider) {
            case 'line':
                const requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/line/login?tr=${credentials?.trackingId || 'DEFAULT_ID'}`;
                console.log('🔄 [authUtils] リクエストURL:', requestUrl);
                console.log('🔄 [authUtils] trパラメータ:', credentials?.trackingId);
                console.log('🔄 [authUtils] API_URL:', process.env.NEXT_PUBLIC_API_URL);
                
                const response = await axios.get(requestUrl, {
                    withCredentials: true, // 🔹 Cookie 送信を維持
                    timeout: 30000, // 30秒のタイムアウト
                });
                
                console.log('🔄 [authUtils] レスポンス:', response.data);
                console.log('🔄 [authUtils] ステータス:', response.status);
                console.log('🔄 [authUtils] レスポンスヘッダー:', response.headers);
                
                // レスポンスの詳細ログ
                if (response.data) {
                    console.log('🔄 [authUtils] レスポンスデータの詳細:', JSON.stringify(response.data, null, 2));
                }
                
                const authUrl = response.data?.auth_url;
                if (authUrl) {
                    console.log('🌐 [authUtils] LINE認証URL:', authUrl);
                    console.log('🔄 [authUtils] URLパラメータ解析:', new URL(authUrl).searchParams.toString());
                    
                    // stateパラメータの確認
                    const url = new URL(authUrl);
                    const stateParam = url.searchParams.get('state');
                    console.log('🔄 [authUtils] stateパラメータ:', stateParam);
                    
                    window.location.href = authUrl; // LINE認証画面にリダイレクト
                } else {
                    throw new Error('LINE認証URLが見つかりません');
                }
                break;
            case 'phone':
                await axios.post(`/api/v1/account/phone/login`, {
                    phone: credentials?.phone,
                    password: credentials?.password,
                }, {
                    withCredentials: true,
                    timeout: 30000,
                });
                break;
            case 'email':
                await axios.post(`/api/v1/account/email/login`, {
                    email: credentials?.email,
                    password: credentials?.password,
                }, {
                    withCredentials: true,
                    timeout: 30000,
                });
                break;
            default:
                throw new Error('Unsupported authentication provider');
        }
    } catch (err: any) {
        console.error('[AuthUtils] Login Error:', err.message);
        console.error('[AuthUtils] Error details:', {
            status: err.response?.status,
            statusText: err.response?.statusText,
            data: err.response?.data,
            headers: err.response?.headers,
            config: {
                url: err.config?.url,
                method: err.config?.method,
                timeout: err.config?.timeout,
                withCredentials: err.config?.withCredentials
            }
        });
        throw err;
    }
};

/**
 * ✅ ログアウト処理
 */
export const logout = () => {
    Cookies.remove('token');
};
