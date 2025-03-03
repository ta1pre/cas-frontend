'use client';

import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useSetupStorage } from '@/app/p/setup/hooks/storage/useSetupStorage';
import { handleCastName, registerCast } from '@/app/p/setup/hooks/logic/step/handleCastName';
import useUser from '@/hooks/useUser';

interface Props {
    onNextStep: () => void;
}

export default function CastNameStep({ onNextStep }: Props): React.JSX.Element {
    const { getStorage } = useSetupStorage();
    const [name, setName] = useState('');
    const user = useUser();
    const token = user?.token;

    // ✅ LocalStorage からキャスト名を復元
    useEffect(() => {
        const savedName = getStorage('profile_data') ? JSON.parse(getStorage('profile_data') || '{}').cast_name : '';
        if (savedName) {
            setName(savedName);
        }
    }, []);

    // ✅ トークンが取得できたらキャスト登録APIを実行
    useEffect(() => {
        if (token) {
            registerCast(token);
        }
    }, [token]); // token が変わったら実行

    // ✅ 名前入力時に即座に保存
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setName(newName);
        handleCastName(newName);
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
            {/* タイトル */}
            <Typography variant="h5" fontWeight="bold">
                キャスト名を入力
            </Typography>

            {/* 名前入力 */}
            <TextField
                label="キャスト名"
                variant="outlined"
                required
                fullWidth
                value={name}
                onChange={handleNameChange}
            />

            {/* 「次へ」ボタン */}
            <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={onNextStep}
                disabled={!name}
                sx={{ mt: 2 }}
            >
                次へ
            </Button>
        </Box>
    );
}
