// src/app/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import AuthButton from '@/components/Auth/AuthButton';

// シンプルなページコンポーネント
export default function HomePage() {
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Google Fonts のインライン読み込み
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        // ふわっと表示のアニメーション
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    // LINEログイン処理(シンプル化)
    const handleLogin = async () => {
        try {
            setLoading(true);
            // LINEログインページへのリンク
            window.location.href = '/auth/login';
        } catch (err) {
            console.error('ログインエラー:', err);
        }
    };

    return (
        <Container 
            maxWidth="sm"
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                overflow: "hidden", // スクロールなし
                justifyContent: "flex-start", // タイトルを上1/3に
            }}
        >
            {/* precasロゴ */}
            <Typography 
                variant="h2"
                sx={{
                    fontFamily: '"Quicksand", sans-serif',
                    fontWeight: 500,
                    color: "#FF6F61", // コーラルオレンジ
                    marginTop: "33vh", // 上1/3に配置
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0px)" : "translateY(-10px)",
                    transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
                }}
            >
                precas
            </Typography>

            {/* ログインボタン(簡略化) */}
            <Box 
                sx={{
                    position: "absolute",
                    bottom: "8px",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    px: 6
                }}
            >
                <AuthButton onClick={handleLogin} loading={loading} />
            </Box>
        </Container>
    );
}
