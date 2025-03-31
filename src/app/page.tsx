// src/app/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { Container, Box } from '@mui/material';
import Image from 'next/image';

// シンプルなページコンポーネント
export default function HomePage() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // ふわっと表示のアニメーション
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    return (
        <Container 
            maxWidth="sm"
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center", // 完全中央配置
                overflow: "hidden", // スクロールなし
            }}
        >
            {/* ロゴを中央に配置 */}
            <Box
                sx={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0px)" : "translateY(-10px)",
                    transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
                    textAlign: 'center'
                }}
            >
                <Image 
                    src="/images/common/logo.png" 
                    alt="Cas Logo" 
                    width={120} 
                    height={120} 
                    priority
                />
            </Box>
        </Container>
    );
}
