// src/app/auth/login/page.tsx

'use client';

import React, { Suspense } from 'react';
import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

// Suspenseバウンダリ内でuseSearchParamsを使用するコンポーネント
function LoginContent() {
    const { handleLogin, loading } = useAuth();
    const [isFirstClick, setIsFirstClick] = React.useState(true);
    const [showRetryMessage, setShowRetryMessage] = React.useState(false);
    
    const handleLoginClick = async () => {
        if (isFirstClick) {
            setIsFirstClick(false);
            // 初回クリック時は30秒後にメッセージ表示
            setTimeout(() => {
                if (loading) {
                    setShowRetryMessage(true);
                }
            }, 30000);
        }
        await handleLogin('line');
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundColor: '#fff',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* 左上ロゴ */}
            <Box sx={{
                position: 'absolute',
                top: { xs: 16, md: 32 },
                left: { xs: 16, md: 32 },
                zIndex: 10,
            }}>
                <Image src="/images/common/precas_logo2.jpg" alt="Logo" width={56} height={56} style={{ borderRadius: '12px', boxShadow: '0 2px 8px #ffe0ef' }} />
            </Box>

            {/* 中央コンテンツ */}
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                width: '100%',
            }}>
                <Typography
                    sx={{
                        fontWeight: 'bold',
                        fontSize: { xs: '2.2rem', md: '2.8rem' },
                        color: '#FF4081',
                        letterSpacing: '0.1em',
                        mb: 1,
                        textShadow: '0 2px 12px #ffe0ef',
                    }}
                >
                    PreCas
                </Typography>
                <Typography
                    sx={{
                        color: '#AD1457',
                        fontSize: { xs: '1.1rem', md: '1.3rem' },
                        fontWeight: 500,
                        mb: 6,
                        letterSpacing: '0.08em',
                    }}
                >
                    大人なP活専門アプリ
                </Typography>
                {showRetryMessage && (
                    <Typography
                        sx={{
                            color: '#f44336',
                            fontSize: '0.9rem',
                            mb: 2,
                            textAlign: 'center',
                            maxWidth: '320px',
                        }}
                    >
                        サーバーが起動中です。もう一度お試しください。
                    </Typography>
                )}
                <Button
                    variant="contained"
                    onClick={handleLoginClick}
                    disabled={loading}
                    sx={{
                        backgroundColor: '#06C755', // LINEグリーン
                        color: 'white',
                        borderRadius: '50px',
                        padding: '14px 36px 14px 36px',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        width: '100%',
                        maxWidth: '320px',
                        textTransform: 'none',
                        opacity: loading ? 0.7 : 1,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        boxShadow: '0 2px 12px #c5f5d5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1.5,
                        '&:hover': { backgroundColor: '#00B900' },
                    }}
                >
                    {loading ? 'ログイン中...' : (<>
                        LINEで簡単ログイン
                        <span style={{ display: 'flex', alignItems: 'center', marginLeft: 8 }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 5L15 12L8 19" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </span>
                    </>)}
                </Button>
            </Box>
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
