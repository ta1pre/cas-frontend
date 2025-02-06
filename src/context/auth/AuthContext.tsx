// src/context/auth/AuthContext.tsx

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import apiClient from '@/services/auth/axiosInterceptor';
import Cookies from 'js-cookie';
import { usePathname, useRouter } from 'next/navigation';

interface User {
    userId: number;
    userType: string | null;
    affiType: number | null;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (provider: 'line' | 'phone' | 'email', credentials?: any) => Promise<void>;
    logout: () => void;
    handleTokenUpdate: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const pathname = usePathname();
    const router = useRouter();

    /**
     * ✅ トークン検証 & ユーザー情報取得
     */
    const verifyToken = async () => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                console.warn('[AuthContext] No token found. Skipping /verify request.');
                setIsAuthenticated(false);
                setUser(null);
                return;
            }

            const response = await apiClient.get('/api/v1/account/auth/verify');
            const { user_id, user_type, affi_type } = response.data;

            setUser({ userId: user_id, userType: user_type, affiType: affi_type });
            setIsAuthenticated(true);
        } catch (err: any) {
            console.error('[AuthContext] Token Verification Failed:', err.message);
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    /**
     * ✅ トークン手動更新
     */
    const handleTokenUpdate = (token: string) => {
        Cookies.set('token', token, { secure: true, sameSite: 'lax' });
        verifyToken();
    };

    /**
     * ✅ ログイン処理
     */
    const login = async (provider: 'line' | 'phone' | 'email', credentials?: any) => {
        try {
            setLoading(true);
            setError(null);

            switch (provider) {
                case 'line':
    const response = await apiClient.get(`/api/v1/account/line/login?tracking_id=${credentials?.trackingId || 'DEFAULT_ID'}`);
    const authUrl = response.data?.auth_url;
    if (authUrl) {
        console.log('🌐 Redirecting to LINE Auth URL:', authUrl);
        window.location.href = authUrl; // LINE認証画面にリダイレクト
    } else {
        throw new Error('LINE認証URLが見つかりません');
    }
    break;

                case 'phone':
                    await apiClient.post('/api/v1/account/phone/login', {
                        phone: credentials?.phone,
                        password: credentials?.password,
                    });
                    break;
                case 'email':
                    await apiClient.post('/api/v1/account/email/login', {
                        email: credentials?.email,
                        password: credentials?.password,
                    });
                    break;
                default:
                    throw new Error('Unsupported authentication provider');
            }

            await verifyToken();
        } catch (err: any) {
            console.error('[AuthContext] Login Error:', err.message);
            setError(err.message || 'ログインに失敗しました');
        } finally {
            setLoading(false);
        }
    };

    /**
     * ✅ ログアウト処理
     */
    const logout = () => {
        Cookies.remove('token');
        setIsAuthenticated(false);
        setUser(null);
        router.push('/auth/login');
    };

    useEffect(() => {
    // ✅ `/auth/callback` ページでは verifyToken をスキップ
    if (pathname?.startsWith('/auth/callback')) {
        console.warn(`[AuthContext] Skipping verifyToken on ${pathname}`);
        setLoading(false);
        return;
    }

    // ✅ `/p/` 配下のページのみ verifyToken を実行
    if (pathname?.startsWith('/p')) {
        verifyToken();
    } else {
        setLoading(false);
    }
}, [pathname]);


    return (
        <AuthContext.Provider value={{ isAuthenticated, user, loading, error, login, logout, handleTokenUpdate }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * ✅ AuthContextを利用するカスタムフック
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
