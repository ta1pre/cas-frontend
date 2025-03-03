// src/app/p/setup/components/customer/CustomerProfileStep.tsx
'use client';

import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { handleCustomerProfileStep } from '@/app/p/setup/hooks/logic/step/handleCustomerProfileStep';

interface Props {
    onNextStep: () => void;
}

export default function CustomerProfileStep({ onNextStep }: Props): React.JSX.Element {
    const [nickname, setNickname] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newNickname = event.target.value;
        setNickname(newNickname);
        handleCustomerProfileStep(newNickname); // ✅ リアルタイム更新
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                gap: 3,
                px: 3,
            }}
        >
            {/* ✅ タイトルを変更 */}
            <Typography variant="h5" fontWeight="bold">
                ニックネーム設定
            </Typography>

            {/* ✅ 名前の入力のみ */}
            <Box component="form" sx={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    label="ニックネーム"
                    variant="outlined"
                    required
                    fullWidth
                    value={nickname}
                    onChange={handleChange}
                />

                {/* 「次へ」ボタン */}
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={onNextStep}
                    sx={{ mt: 2 }}
                    disabled={!nickname.trim()} // ✅ 入力がないと次へ進めない
                >
                    次へ
                </Button>
            </Box>
        </Box>
    );
}
