'use client';

import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Typography, Container, Paper } from '@mui/material';
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
        <Container maxWidth="sm">
            <Paper 
                elevation={3} 
                sx={{
                    p: 4,
                    mt: 4,
                    borderRadius: 2,
                    backgroundColor: '#fff9fa',
                    border: '1px solid #ffe0e6'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 3,
                    }}
                >
                    {/* タイトル */}
                    <Typography variant="h5" fontWeight="bold" color="#e91e63">
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
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: '#ff80ab',
                                },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#ff80ab',
                            },
                        }}
                    />

                    {/* 「次へ」ボタン */}
                    <Button
                        variant="contained"
                        size="large"
                        onClick={onNextStep}
                        disabled={!name}
                        sx={{ 
                            mt: 2,
                            bgcolor: '#ff80ab',
                            '&:hover': {
                                bgcolor: '#f06292',
                            },
                            minWidth: 150,
                            borderRadius: 8
                        }}
                    >
                        次へ
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}
