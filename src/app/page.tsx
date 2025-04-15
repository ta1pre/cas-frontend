'use client';

import React, { useEffect, useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import Image from 'next/image';
import MicrocmsFooter from "./components/microcms/MicrocmsFooter";

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
                justifyContent: "center",
                overflow: "hidden",
                pt: 4,
                pb: 10,
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
                <Box sx={{ display: 'inline-flex', alignItems: 'center', ml: 2 }}>
                    <Typography variant="h5" color="#E91E63" fontWeight="bold" sx={{ letterSpacing: 2 }}>
                        cas
                    </Typography>
                </Box>
            </Box>

            <Typography mt={4} color="#E91E63" fontWeight="medium" fontSize={20} textAlign="center">
                近日、オープン
            </Typography>

            {/* ▼ Stripe審査向け 追加説明セクション ▼ */}
            <Box mt={6} textAlign="center">
                <Typography fontSize={16} fontWeight="bold" mb={1}>
                    Cas（キャス）とは？
                </Typography>
                <Typography fontSize={14} color="text.secondary">
                    Cas（キャス）は、キャストとゲストをつなぐ<br />
                    マッチング支援型の会員制サービスです。<br />
                    食事・会話・お出かけ・リラクゼーションなど、<br />
                    多彩な役務サービスを気軽にご予約いただけます。
                </Typography>

                <Typography mt={4} fontSize={16} fontWeight="bold" mb={1}>
                    ポイント制・料金について
                </Typography>
                <Typography fontSize={14} color="text.secondary">
                    ご予約には事前にポイントをご購入いただきます。<br />
                    <strong>1ポイント = 1円</strong>として使用でき、<br />
                    料金はキャストごと・時間ごとに異なります。<br />
                    （各キャストページに料金を明記）<br />
                    ポイントはクレジットカードで即時購入でき、<br />
                    購入後のキャンセルや返金は原則できません。<br />
                    ※有効期限は180日間です。
                </Typography>

                <Typography mt={4} fontSize={14} color="text.secondary">
                    詳細はページ下部の「利用規約」「特定商取引法に基づく表記」をご確認ください。
                </Typography>
            </Box>
            {/* ▲ Stripe審査向け 追加説明セクション ▲ */}

            <Box mt={8}>
                <MicrocmsFooter />
            </Box>
        </Container>
    );
}
