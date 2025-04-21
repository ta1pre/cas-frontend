// File: frontapp/src/app/p/setup/components/cast/CastHeightStep.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Container, Paper, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useSetupStorage } from '@/app/p/setup/hooks/storage/useSetupStorage';
import { handleProfileUpdate } from '@/app/p/setup/hooks/logic/handleProfileUpdate';

interface Props {
    onNextStep: () => void;
}

export default function CastHeightStep({ onNextStep }: Props): React.JSX.Element {
    const { getStorage } = useSetupStorage();
    const [height, setHeight] = useState<number>(158); // ✅ デフォルト値を158cmに変更

    // ✅ LocalStorage から身長を復元
    useEffect(() => {
        const savedProfile = JSON.parse(getStorage('profile_data') || '{}');
        if (savedProfile.height) {
            setHeight(savedProfile.height);
        }
    }, []);

    // ✅ 身長選択時の処理
    const handleHeightChange = (event: SelectChangeEvent<number>) => {
        const newHeight = event.target.value as number;
        setHeight(newHeight);
        handleProfileUpdate({ height: newHeight }); // ✅ 変更時に即時保存
    };

    // ✅ 「次へ」ボタンの処理
    const handleNext = () => {
        onNextStep();
    };

    // ✅ 身長選択肢を生成（140cm〜190cm）
    const heightOptions = [];
    for (let i = 140; i <= 190; i++) {
        heightOptions.push(i);
    }

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
                        textAlign: 'center'
                    }}
                >
                    {/* タイトル */}
                    <Typography variant="h5" fontWeight="bold" color="#e91e63">
                        身長を選択
                    </Typography>

                    {/* プルダウン */}
                    <FormControl fullWidth sx={{ maxWidth: 200 }}>
                        <InputLabel id="height-select-label" sx={{ 
                            '&.Mui-focused': { color: '#ff80ab' } 
                        }}>身長</InputLabel>
                        <Select
                            labelId="height-select-label"
                            id="height-select"
                            value={height}
                            label="身長"
                            onChange={handleHeightChange}
                            sx={{
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#ffcdd2',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#ff80ab',
                                },
                            }}
                        >
                            {heightOptions.map((height) => (
                                <MenuItem key={height} value={height}>{height} cm</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* 「次へ」ボタン */}
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleNext}
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
