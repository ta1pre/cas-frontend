// src/app/auth/callback/page.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function CallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isTokenProcessed, setIsTokenProcessed] = useState(false);

    useEffect(() => {
    const token = searchParams.get('token');
    
    if (token && !isTokenProcessed) {
        console.log('🔑 Token from URL:', token);
        document.cookie = `token=${token}; path=/; max-age=3600; secure=false; samesite=lax`;
        setIsTokenProcessed(true); // ✅ トークン処理済み
        router.replace('/p'); // ✅ replace により履歴を残さない
    }
}, [searchParams, router, isTokenProcessed]);


    return <p>🔄 ログイン処理中...</p>;
}
