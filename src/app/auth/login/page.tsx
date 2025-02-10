// src/app/auth/login/page.tsx

'use client';

import React from 'react';
import AuthButton from '@/components/Auth/AuthButton';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
    const { handleLogin, loading } = useAuth(); // useAuth から関数を取得

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-4">LINEログイン</h1>
            <AuthButton onClick={() => handleLogin('line')} loading={loading} />
        </div>
    );
}
