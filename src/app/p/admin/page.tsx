'use client';

import React, { useEffect, useState } from 'react';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface CustomJwtPayload extends JwtPayload {
    sub?: string; // サブジェクトとしてユーザーIDが入る
    user_id?: string; // 明示的なユーザーID
    user_type?: string;
    exp?: number;
}

export default function DashboardPage() {
    const [userInfo, setUserInfo] = useState<CustomJwtPayload | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            const token = document.cookie
                .split('; ')
                .find((row) => row.startsWith('token='))
                ?.split('=')[1];

            console.log('🔑 Token from Cookie:', token);

            if (!token) {
                throw new Error('トークンが存在しません。ログインしてください。');
            }

            const decoded = jwt.decode(token) as CustomJwtPayload;

            console.log('✅ Decoded Token:', decoded);

            if (!decoded || (!decoded.user_id && !decoded.sub)) {
                throw new Error('トークンにユーザーIDが含まれていません。');
            }

            setUserInfo({
                user_id: decoded.user_id || decoded.sub, // user_id がなければ sub を使用
                user_type: decoded.user_type,
                exp: decoded.exp,
            });
        } catch (err: any) {
            setError(err.message || 'エラーが発生しました。');
        }
    }, []);

    return (
        <div>
            <h1>ダッシュボード</h1>
            {error && <p style={{ color: 'red' }}>❌ {error}</p>}

            {userInfo ? (
                <div>
                    <h3>🔑 ログイン情報</h3>
                    <p><strong>ユーザーID:</strong> {userInfo.user_id || '不明'}</p>
                    <p><strong>ユーザータイプ:</strong> {userInfo.user_type || '不明'}</p>
                    <p><strong>トークン有効期限:</strong> {userInfo.exp ? new Date(userInfo.exp * 1000).toLocaleString() : '不明'}</p>
                </div>
            ) : (
                !error && <p>ユーザー情報を読み込み中...</p>
            )}
        </div>
    );
}
