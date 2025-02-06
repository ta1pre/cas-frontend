// src/components/Auth/AuthButton.tsx

'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';

/**
 * 認証ボタンコンポーネント
 */
export default function AuthButton() {
    const { handleLogin, loading, error } = useAuth();

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2>ログイン</h2>

            {/* LINEログイン */}
            <button
                onClick={() => handleLogin('line')}
                disabled={loading}
                style={{
                    margin: '10px',
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                }}
            >
                {loading ? '🔄 LINEログイン中...' : '🌐 LINEでログイン'}
            </button>

            {/* 電話番号ログイン（未実装） */}
            <button
                onClick={() => alert('電話番号ログインは未実装です')}
                disabled={loading}
                style={{
                    margin: '10px',
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: 'not-allowed',
                    backgroundColor: '#ccc',
                }}
            >
                📱 電話番号でログイン（未実装）
            </button>

            {/* メールアドレスログイン（未実装） */}
            <button
                onClick={() => alert('メールアドレスログインは未実装です')}
                disabled={loading}
                style={{
                    margin: '10px',
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: 'not-allowed',
                    backgroundColor: '#ccc',
                }}
            >
                📧 メールアドレスでログイン（未実装）
            </button>

            {/* エラーメッセージ */}
            {error && (
                <p style={{ color: 'red', marginTop: '10px' }}>
                    ❌ エラー: {error}
                </p>
            )}
        </div>
    );
}
