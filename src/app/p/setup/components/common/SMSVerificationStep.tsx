'use client';

import React, { useState } from 'react';
import axios from 'axios';

interface SMSVerificationStepProps {
    onNextStep: () => void;
    onPrevStep: () => void;
}

export default function SMSVerificationStep({ onNextStep, onPrevStep }: SMSVerificationStepProps) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // ✅ 環境変数からAPIエンドポイントを読み込み
    const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/sms`;
    const token = localStorage.getItem('token');  // ✅ 認証トークン（変更なし）

    const formatPhoneNumber = (number: string) => {
        // 先頭の0を+81に変換（例: 09012345678 → +819012345678）
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
        <div style={{ padding: '20px' }}>
            <h2>📱 SMS認証</h2>
            <p>電話番号を入力し、SMSで受け取った認証コードを入力してください。</p>

            {!isCodeSent ? (
                <>
                    <label>
                        電話番号:
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="例: 09012345678"
                            style={{ display: 'block', margin: '10px 0', padding: '8px', width: '100%' }}
                            disabled={isLoading}
                        />
                    </label>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {message && <p style={{ color: 'green' }}>{message}</p>}
                    <button
                        onClick={handleSendCode}
                        disabled={isLoading}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#4caf50',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        {isLoading ? '送信中...' : '認証コードを送信'}
                    </button>
                </>
            ) : (
                <>
                    <label>
                        認証コード:
                        <input
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            placeholder="認証コードを入力"
                            style={{ display: 'block', margin: '10px 0', padding: '8px', width: '100%' }}
                            disabled={isLoading}
                        />
                    </label>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {message && <p style={{ color: 'green' }}>{message}</p>}
                    <button
                        onClick={handleVerifyCode}
                        disabled={isLoading}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#4caf50',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        {isLoading ? '認証中...' : '認証する'}
                    </button>
                </>
            )}

            <div style={{ marginTop: '20px' }}>
                <button onClick={onPrevStep} style={{ padding: '10px 20px' }} disabled={isLoading}>
                    戻る
                </button>
            </div>
        </div>
    );
}
