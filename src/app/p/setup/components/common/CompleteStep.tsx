'use client';

import React from 'react';
import { jwtDecode } from 'jwt-decode';

// ✅ デコードしたトークンの型
interface DecodedToken {
    user_id: number;
    user_type: string;  // "cast" or "user"
    exp: number;
}

const getUserTypeFromToken = (): string | null => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decoded: DecodedToken = jwtDecode<DecodedToken>(token);
            return decoded.user_type;
        } catch (error) {
            console.error('トークンの解析に失敗しました:', error);
            return null;
        }
    }
    return null;
};

export default function CompleteStep() {
    const handleRedirect = () => {
        const userType = getUserTypeFromToken();

        // ✅ setup_status クッキーを設定
        document.cookie = "setup_status=completed; path=/";

        if (userType === 'cast') {
            window.location.href = '/p/cast';
        } else {
            window.location.href = '/p/user';
        }
    };

    return (
        <div>
            <h2>セットアップ完了！</h2>
            <p>お疲れ様でした。</p>
            <button onClick={handleRedirect}>ダッシュボードへ移動</button>
        </div>
    );
}
