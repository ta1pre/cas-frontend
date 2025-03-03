'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Box, TextField, Button, Typography } from '@mui/material';

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
    const token = localStorage.getItem('token');

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
            await axios.post(
                `${BASE_URL}/send/`,
                { phone: formatPhoneNumber(phoneNumber) },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setIsCodeSent(true);
            setMessage("認証コードを送信しました。SMSをご確認ください。");
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
            await axios.post(
                `${BASE_URL}/verify/`,
                { code: verificationCode },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setMessage('電話番号認証が完了しました！');
            onNextStep();
        } catch (error) {
            setError('認証コードが正しくありません。');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>📱 SMS認証</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>電話番号を入力し、SMSで受け取った認証コードを入力してください。</Typography>

            {!isCodeSent ? (
                <>
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
                </>
            ) : (
                <>
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
                </>
            )}

            {/* ✅ 戻るボタン & スキップ（次へ）ボタン */}
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button variant="outlined" color="secondary" onClick={onPrevStep} disabled={isLoading}>戻る</Button>
                <Button variant="contained" color="success" onClick={onNextStep}>次へ（スキップ）</Button>
            </Box>
        </Box>
    );
}
