// src/app/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Button, Link as MuiLink, Paper } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import MicrocmsFooter from "./components/microcms/MicrocmsFooter";

export default function HomePage() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    return (
        <Container maxWidth="sm" sx={{ py: 6 }}>
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, bgcolor: '#fff', opacity: isVisible ? 1 : 0, transition: 'opacity 1s' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Image src="/images/common/logo.png" alt="Cas Logo" width={72} height={72} style={{ borderRadius: '50%' }} />
                </Box>
                <Typography variant="h4" align="center" fontWeight="bold" color="#E91E63" mb={2}>
                    Cas（キャス）へようこそ
                </Typography>
                <Typography align="center" color="text.secondary" fontSize={16} mb={3}>
                    Cas（キャス）は、<b>キャストとゲストをつなぐ女性向けのマッチング支援型サービス</b>です。<br />
                    食事・会話・お出かけ・外出同行など、多彩な接客型サービスを安心してご予約いただけます。
                </Typography>
                <Box sx={{ bgcolor: '#FFF0F6', borderRadius: 3, p: 2, mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="#E91E63" mb={1}>
                        ご利用料金・ポイントについて
                    </Typography>
                    <Typography fontSize={15} color="text.secondary">
                        サービスは<b>1時間4,000円（税込）〜</b>ご利用いただけます。<br />
                        お支払いは<b>クレジットカード決済のみ</b>対応です。<br />
                        <br />
                        <b>1P（ポイント）= 1.25円</b>で換算されます。ご購入時にポイントへ自動変換されます。
                    </Typography>
                </Box>
                <Box sx={{ bgcolor: '#FCE4EC', borderRadius: 3, p: 2, mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="#E91E63" mb={1}>
                        キャンセル・返金ポリシー
                    </Typography>
                    <Typography fontSize={15} color="text.secondary">
                        ご購入後のキャンセルや返金は原則できません。<br />
                        詳細は「利用規約」および「特定商取引法に基づく表記」をご確認ください。
                    </Typography>
                </Box>
                <Box sx={{ bgcolor: '#FFF8E1', borderRadius: 3, p: 2, mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold" color="#E91E63" mb={1}>
                        運営情報・お問い合わせ
                    </Typography>
                    <Typography fontSize={15} color="text.secondary">
                        運営形態：個人事業主<br />
                        運営責任者：梅木太一<br />
                        所在地：東京都品川区西五反田2-14-10<br />
                        電話番号：請求があれば遅滞なく開示いたします<br />
                        メール：<MuiLink href="mailto:info@cas.tokyo" color="#E91E63" underline="hover">info@cas.tokyo</MuiLink>
                    </Typography>
                </Box>
                <Box mt={3} mb={1} textAlign="center">
                    <Button variant="contained" color="secondary" sx={{ bgcolor: '#E91E63', borderRadius: 8, px: 5, py: 1.5, fontWeight: 'bold', fontSize: 16, boxShadow: 2 }} href="mailto:info@cas.tokyo">
                        お問い合わせはこちら
                    </Button>
                </Box>
                <Box mt={4} mb={1} textAlign="center">
                    <MuiLink component={Link} href="https://cas.tokyo/docs/2p5du7plkq8" target="_blank" color="#E91E63" fontWeight="bold" underline="hover" sx={{ mx: 1 }}>
                        利用規約
                    </MuiLink>
                    <MuiLink component={Link} href="https://cas.tokyo/docs/1jd--tbx1d" target="_blank" color="#E91E63" fontWeight="bold" underline="hover" sx={{ mx: 1 }}>
                        特定商取引法に基づく表記
                    </MuiLink>
                    <MuiLink component={Link} href="https://cas.tokyo/docs/38etdezud" target="_blank" color="#E91E63" fontWeight="bold" underline="hover" sx={{ mx: 1 }}>
                        プライバシーポリシー
                    </MuiLink>
                </Box>
            </Paper>
            <Box mt={6}>
                <MicrocmsFooter />
            </Box>
        </Container>
    );
}
