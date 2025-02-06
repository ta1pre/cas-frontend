'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { fetchRefreshTokenExpiration } from '@/services/auth/authService';

interface CustomJwtPayload extends JwtPayload {
    sub?: string;
    user_id?: string;
    user_type?: string;
    exp?: number;
}

export default function DashboardPage() {
    const [userInfo, setUserInfo] = useState<CustomJwtPayload | null>(null);
    const [setupStatus, setSetupStatus] = useState<string | null>(null);
    const [refreshTokenExp, setRefreshTokenExp] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // `refresh_token` の有効期限を取得
                const expiration = await fetchRefreshTokenExpiration();
                setRefreshTokenExp(expiration);
            } catch (err: any) {
                console.error('❌ `refresh_token` の取得に失敗:', err.message);
                setError(err.message || 'エラーが発生しました。');
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>ダッシュボード</h1>
            {error && <p style={{ color: 'red' }}>❌ {error}</p>}

            <h3>🔄 `refresh_token` 情報</h3>
            <p><strong>有効期限 (`refresh_token`):</strong> {refreshTokenExp || '不明'}</p>

            {/* ✅ 他のページへのリンク */}
            <h3>📌 他のページへ移動</h3>
            <br /><br /><br /><br /><br />
            <ul>
                <li><Link href="/p/cast">キャストのページ</Link></li>
            </ul>
        </div>
    );
}
