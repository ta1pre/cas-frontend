// src/components/Auth/AuthButton.tsx

'use client';

import React from 'react';
import { Button } from '@mui/material';
import { SiLine } from 'react-icons/si';

/**
 * LINEログインボタン
 * @param {function} onClick - ログイン処理を実行する関数
 * @param {boolean} loading - ログイン処理中かどうか
 */
export default function AuthButton({ onClick, loading }: { onClick: () => void; loading: boolean }) {
    return (
        <Button
            variant="contained"
            className="w-full flex items-center justify-center gap-3 px-8 text-lg text-white shadow-md"
            style={{
                backgroundColor: '#06C755',
                height: '50px',
                borderRadius: '25px', // 角丸を維持（高さの半分）
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
            }}
            onClick={onClick}
            disabled={loading}
        >
            <SiLine size={26} />
            <span>{loading ? 'ログイン中...' : 'LINEでログイン'}</span>
        </Button>
    );
}
