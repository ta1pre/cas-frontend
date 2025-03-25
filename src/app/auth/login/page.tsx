// src/app/auth/login/page.tsx

'use client';

import React, { Suspense } from 'react';
import AuthButton from '@/components/Auth/AuthButton';
import { useAuth } from '@/hooks/useAuth';

// Suspenseバウンダリ内でuseSearchParamsを使用するコンポーネント
function LoginContent() {
    const { handleLogin, loading } = useAuth(); // useAuth から関数を取得

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-4">LINEログイン</h1>
            <AuthButton onClick={() => handleLogin('line')} loading={loading} />
        </div>
    );
}

// メインのページコンポーネント
export default function LoginPage() {
    return (
        <Suspense fallback={<p>🔄 読み込み中...</p>}>
            <LoginContent />
        </Suspense>
    );
}
