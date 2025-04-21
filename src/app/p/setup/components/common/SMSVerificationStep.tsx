'use client';

import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Container } from '@mui/material';
import { fetchAPI } from '@/services/auth/axiosInterceptor';

interface SMSVerificationStepProps {
    onNextStep: () => void;
    onPrevStep?: () => void;
}

export default function SMSVerificationStep({ onNextStep, onPrevStep }: SMSVerificationStepProps) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/sms`;

    const formatPhoneNumber = (number: string) => {
        if (number.startsWith("0")) {
            return "+81" + number.slice(1);
        }
        return number;
    };

    const handleSendCode = async () => {
        if (!phoneNumber.match(/^\d{10,11}$/)) {
            setError("正しい電話番号を入力してください。");
            return;
        }

        setIsLoading(true);
        setError("");
        setMessage("");

        try {
            const res = await fetchAPI(
                `${BASE_URL}/send/`,
                { phone: formatPhoneNumber(phoneNumber) },
                'POST'
            );
            if (res) {
                setIsCodeSent(true);
                setMessage("認証コードを送信しました。SMSをご確認ください。");
            } else {
                setError("認証コードの送信に失敗しました。");
            }
        } catch (error) {
            console.error("認証コードの送信に失敗しました:", error);
            setError("認証コードの送信に失敗しました。");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        if (!verificationCode.match(/^\d{4,6}$/)) {
            setError('正しい認証コードを入力してください。');
            return;
        }

        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await fetchAPI(
                `${BASE_URL}/verify/`,
                { code: verificationCode },
                'POST'
            );
            if (res) {
                setMessage('電話番号認証が完了しました！');
                onNextStep();
            } else {
                setError('認証コードが正しくありません。');
            }
        } catch (error) {
            setError('認証コードが正しくありません。');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="md">
            {/* コンテンツエリア */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    px: 3,
                    py: 4,
                }}
            >
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>📱 SMS認証</Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                    電話番号を入力し、SMSで受け取った認証コードを入力してください。
                </Typography>

                {!isCodeSent ? (
                    <Box sx={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="電話番号"
                            variant="outlined"
                            fullWidth
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="例: 09012345678"
                            disabled={isLoading}
                        />
                        {error && <Typography color="error">{error}</Typography>}
                        {message && <Typography color="success.main">{message}</Typography>}

                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleSendCode}
                            disabled={isLoading}
                        >
                            {isLoading ? '送信中...' : '認証コードを送信'}
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="認証コード"
                            variant="outlined"
                            fullWidth
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            placeholder="認証コードを入力"
                            disabled={isLoading}
                        />
                        {error && <Typography color="error">{error}</Typography>}
                        {message && <Typography color="success.main">{message}</Typography>}

                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleVerifyCode}
                            disabled={isLoading}
                        >
                            {isLoading ? '認証中...' : '認証する'}
                        </Button>
                    </Box>
                )}

                {/* ✅ 戻るボタン & スキップ（次へ）ボタン */}
                <Box sx={{ width: '100%', maxWidth: 360, display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                   
                    <Button variant="contained" color="success" onClick={onNextStep}>次へ（開発環境 -スキップ可能！-）</Button>
                </Box>
            </Box>
        </Container>
    );
}
