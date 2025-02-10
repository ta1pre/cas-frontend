// src/app/auth/login/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container, Box, Typography } from '@mui/material';
import AuthButton from '@/components/Auth/AuthButton';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
    const { handleLogin, loading } = useAuth();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Google Fonts のインライン読み込み
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        // ふわっと表示のアニメーション
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    return (
        <Container 
            maxWidth="sm" 
            className="flex flex-col items-center justify-center min-h-screen p-4"
        >
            {/* precasロゴ */}
            <Typography 
                variant="h2" 
                className="text-5xl transition-opacity duration-700"
                style={{
                    fontFamily: '"Quicksand", sans-serif',
                    fontWeight: 500,
                    color: '#FF6F61', // コーラルオレンジ
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0px)' : 'translateY(-10px)',
                    transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
                }}
            >
                precas
            </Typography>

            {/* ログインボタン */}
            <Box className="absolute bottom-8 w-full flex justify-center px-6">
                <AuthButton onClick={() => handleLogin('line')} loading={loading} />
            </Box>
        </Container>
    );
}
