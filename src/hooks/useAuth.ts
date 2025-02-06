// src/hooks/useAuth.ts
'use client';

import { useState } from 'react';
import { login } from '@/services/auth/authService';
import { useTrackingId } from '@/hooks/useTrackingId';
import { useAuth as useAuthContext } from '@/context/auth/AuthContext';

type AuthProvider = 'line' | 'phone' | 'email';

/**
 * 認証を管理するカスタムフック
 */
export function useAuth() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const trackingId = useTrackingId(); // LINEログイン用トラッキングID
    const { handleTokenUpdate, login: contextLogin, logout, user } = useAuthContext();

    /**
     * 認証処理を実行
     */
    const handleLogin = async (provider: AuthProvider, credentials?: { phone?: string; email?: string; password?: string }) => {
        try {
            setLoading(true);
            setError(null);

            switch (provider) {
                case 'line':
                    await contextLogin('line', { trackingId });
                    break;
                case 'phone':
                    if (!credentials?.phone || !credentials?.password) {
                        throw new Error('電話番号とパスワードを入力してください。');
                    }
                    await contextLogin('phone', { phone: credentials.phone, password: credentials.password });
                    break;
                case 'email':
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error('メールアドレスとパスワードを入力してください。');
                    }
                    await contextLogin('email', { email: credentials.email, password: credentials.password });
                    break;
                default:
                    throw new Error('不明な認証プロバイダーです');
            }

            console.log(`✅ [useAuth] ${provider} ログイン成功`);
        } catch (err: any) {
            console.error(`[useAuth] Error: ${err.message}`);
            setError(err.message || 'ログインに失敗しました');
        } finally {
            setLoading(false);
        }
    };

    return {
        handleLogin,
        handleTokenUpdate,
        logout,
        loading,
        error,
        user,
    };
}
