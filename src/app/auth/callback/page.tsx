// src/app/auth/callback/page.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

// Suspenseバウンダリ内でuseSearchParamsを使用するコンポーネント
function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isTokenProcessed, setIsTokenProcessed] = useState(false);

    useEffect(() => {
        console.log('🔄 [Callback] URL:', window.location.href);
        console.log('🔄 [Callback] 全パラメータ:', Object.fromEntries(searchParams.entries()));
        
        const token = searchParams.get('token');
        const refreshToken = searchParams.get('refresh_token'); // refresh_token も取得
        const stateParam = searchParams.get('state');
        const codeParam = searchParams.get('code');
        const errorParam = searchParams.get('error');

        console.log('🔄 [Callback] token:', token);
        console.log('🔄 [Callback] refresh_token:', refreshToken);
        console.log('🔄 [Callback] state:', stateParam);
        console.log('🔄 [Callback] code:', codeParam);
        console.log('🔄 [Callback] error:', errorParam);

        if (token && refreshToken && !isTokenProcessed) {
            console.log('【コールバック】 Token from URL:', token);
            console.log('【コールバック】 Refresh Token from URL:', refreshToken);

            // トークンをクッキーに保存
            document.cookie = `token=${token}; path=/; max-age=3600; secure=True; samesite=None`;
            document.cookie = `refresh_token=${refreshToken}; path=/; max-age=7776000; Secure; SameSite=None`;

            setIsTokenProcessed(true); // トークン処理済み

            // `window.history.replaceState` で URL からパラメータを削除
            window.history.replaceState(null, "", window.location.pathname);

            router.replace('/p'); // replace により履歴を残さない
        }
    }, [searchParams, router, isTokenProcessed]);

    return <p> ログイン処理中...</p>;
}

// メインのページコンポーネント
export default function CallbackPage() {
    return (
        <Suspense fallback={<p> 読み込み中...</p>}>
            <CallbackContent />
        </Suspense>
    );
}
