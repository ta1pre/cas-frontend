// src/app/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Link as MuiLink, Paper } from '@mui/material';
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
                <Typography variant="h5" align="center" color="#E91E63" fontWeight="bold" mb={2}>
                    サービス内容
                </Typography>
                <Typography align="center" color="text.secondary" fontSize={16} mb={3}>
                    <b>Cas（キャス）は、18歳以上の会員が「ポイント」を購入し、キャスト（登録スタッフ）による同行・会話・食事・外出サポートなどの役務サービスを予約・利用できるマッチング支援型サービスです。</b><br />
                    <br />
                    <b>ご利用の流れ：</b><br />
                    ① 会員登録（18歳以上、本人確認済み）<br />
                    ② ポイントをクレジットカード決済で即時購入（1P=1.25円、1時間4,000円〜）<br />
                    ③ サイト上でキャスト・日時・サービス内容を選択して予約<br />
                    ④ サービス当日、ご予約内容に応じてキャストが同行・会話・サポート等を提供<br />
                    <b>※ポイント購入時に即時決済、サービス利用時にポイントが消費されます。</b><br />
                    <br />
                    <b>主なサービス例：</b><br />
                    ・カフェやレストランでの食事同行<br />
                    ・観光地やイベントへのお出かけ同行<br />
                    ・会話や相談のサポート<br />
                    ・その他、キャストごとに提供可能な役務サービス<br />
                </Typography>
                <Typography variant="h6" color="#E91E63" fontWeight="bold" mb={1}>
                    ご利用料金・ポイントについて
                </Typography>
                <Typography fontSize={15} color="text.secondary" mb={2}>
                    サービスは<b>1時間4,000円（税込）〜</b>ご利用いただけます。<br />
                    お支払いは<b>クレジットカード決済のみ</b>対応です。<br />
                    <b>1P（ポイント）= 1.25円</b>で換算され、ご購入時にポイントへ自動変換されます。
                </Typography>
                <Typography variant="h6" color="#E91E63" fontWeight="bold" mb={1}>
                    運営者情報
                </Typography>
                <Typography fontSize={15} color="text.secondary" mb={2}>
                    運営者：梅木太一（個人事業主）<br />
                    所在地：東京都品川区西五反田2-14-10<br />
                    メール：info@cas.tokyo<br />
                    電話番号：請求があれば遅滞なく開示
                </Typography>
                <Typography variant="h6" color="#E91E63" fontWeight="bold" mb={1}>
                    キャンセル・返金ポリシー
                </Typography>
                <Typography fontSize={15} color="text.secondary" mb={2}>
                    ご購入後のキャンセルや返金は原則できません。詳細は利用規約・特定商取引法ページをご確認ください。
                </Typography>
                <Typography variant="h6" color="#E91E63" fontWeight="bold" mb={1}>
                    禁止事項・健全性について
                </Typography>
                <Typography fontSize={15} color="text.secondary" mb={2}>
                    ・風俗的サービス、違法行為、公序良俗に反する行為は一切提供・許容していません。<br />
                    ・18歳未満のご利用はできません。<br />
                    <span style={{color:'#E91E63', fontWeight:'bold'}}>本サービスは安心・安全・健全な役務マッチング支援を目的としています。</span>
                </Typography>
                <Typography variant="h6" color="#E91E63" fontWeight="bold" mb={1}>
                    よくあるご質問（FAQ）
                </Typography>
                <Typography fontSize={15} color="text.secondary" mb={2}>
                    <b>Q. キャンセル・返金はできますか？</b><br />
                    A. ご購入後のキャンセル・返金は原則できません。<br /><br />
                    <b>Q. どんな支払い方法が使えますか？</b><br />
                    A. クレジットカード決済のみ対応しています。<br /><br />
                    <b>Q. サービス利用に制限はありますか？</b><br />
                    A. 18歳未満の方や、風俗的・違法な目的での利用は禁止です。
                </Typography>
                <Box sx={{ bgcolor: '#FFF0F6', borderRadius: 3, p: 2, mb: 3 }}>
                    <Typography fontSize={14} color="text.secondary" align="center">
                        <a href="https://cas.tokyo/docs/2p5du7plkq8" target="_blank" rel="noopener noreferrer" style={{ color: '#E91E63', textDecoration: 'underline', fontWeight: 'bold' }}>特定商取引法に基づく表記</a> ／
                        <a href="https://cas.tokyo/docs/1jd--tbx1d" target="_blank" rel="noopener noreferrer" style={{ color: '#E91E63', textDecoration: 'underline', fontWeight: 'bold', marginLeft: 8 }}>利用規約</a> ／
                        <a href="https://cas.tokyo/docs/38etdezud" target="_blank" rel="noopener noreferrer" style={{ color: '#E91E63', textDecoration: 'underline', fontWeight: 'bold', marginLeft: 8 }}>プライバシーポリシー</a>
                    </Typography>
                </Box>
            </Paper>
            <Box mt={6}>
                <MicrocmsFooter />
            </Box>
        </Container>
    );
}
