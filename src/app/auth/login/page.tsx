// src/app/auth/login/page.tsx

'use client';

import React, { Suspense } from 'react';
import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

// Suspenseバウンダリ内でuseSearchParamsを使用するコンポーネント
function LoginContent() {
    const { handleLogin, loading } = useAuth(); // useAuth から関数を取得

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '100vh', 
            p: 4,
            backgroundColor: '#fff'
        }}>
            {/* ロゴとサイト名 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 6 }}>
                <Image src="/images/common/precas_logo2.jpg" alt="Logo" width={50} height={50} />
                <Typography sx={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#333' }}>
                    PreCas
                </Typography>
            </Box>
            
            {/* ログインボタン */}
            <Button
                variant="contained"
                onClick={() => handleLogin('line')}
                disabled={loading}
                sx={{
                    backgroundColor: '#FF80AB',
                    color: 'white',
                    borderRadius: '50px',
                    padding: '14px 60px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    width: '100%',
                    maxWidth: '300px',
                    textTransform: 'none',
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    '&:hover': { backgroundColor: '#FF4081' }
                }}
            >
                {loading ? 'ログイン中...' : 'ログイン'}
            </Button>
        </Box>
    );
}

// メインのページコンポーネント
export default function LoginPage() {
    return (
        <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Typography>🔄 読み込み中...</Typography></Box>}>
            <LoginContent />
        </Suspense>
    );
}
