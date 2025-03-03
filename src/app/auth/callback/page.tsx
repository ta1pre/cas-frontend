// src/app/auth/callback/page.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isTokenProcessed, setIsTokenProcessed] = useState(false);

    useEffect(() => {
        const token = searchParams.get('token');
        const refreshToken = searchParams.get('refresh_token'); // ✅ refresh_token も取得

        if (token && refreshToken && !isTokenProcessed) {
            console.log('【コールバック】🔑 Token from URL:', token);
            console.log('【コールバック】🔄 Refresh Token from URL:', refreshToken);

            // ✅ トークンをクッキーに保存
            document.cookie = `token=${token}; path=/; max-age=3600; secure=True; samesite=None`;
            document.cookie = `refresh_token=${refreshToken}; path=/; max-age=7776000; Secure; SameSite=None`;

            setIsTokenProcessed(true); // ✅ トークン処理済み

            // ✅ `window.history.replaceState` で URL からパラメータを削除
            window.history.replaceState(null, "", window.location.pathname);

            router.replace('/p'); // ✅ replace により履歴を残さない
        }
    }, [searchParams, router, isTokenProcessed]);

    return <p>🔄 ログイン処理中...</p>;
}
