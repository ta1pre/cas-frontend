// File: frontapp/src/app/p/setup/components/cast/CastAgeStep.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Container, Paper, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { useSetupStorage } from '@/app/p/setup/hooks/storage/useSetupStorage';
import { handleProfileUpdate } from '@/app/p/setup/hooks/logic/handleProfileUpdate';

interface Props {
    onNextStep: () => void;
}

export default function CastAgeStep({ onNextStep }: Props): React.JSX.Element {
    const { getStorage } = useSetupStorage();
    const [age, setAge] = useState<number | "">(""); // 初期値は空文字（未選択）

    // LocalStorage から年齢を復元
    useEffect(() => {
        const savedProfile = JSON.parse(getStorage('profile_data') || '{}');
        if (savedProfile.age) {
            setAge(savedProfile.age);
        }
    }, []);

    // 年齢選択時処理
    const handleAgeChange = (event: SelectChangeEvent<number | "">) => {
        const value = event.target.value;
        const newAge = value === "" ? "" : Number(value);
        setAge(newAge);
        if (newAge !== "") {
            handleProfileUpdate({ age: newAge }); // 即座に `localStorage` に保存
        }
    };


    // 年齢選択肢を作成
    const ageOptions = [];
    for (let i = 18; i <= 60; i++) {
        ageOptions.push(i);
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
                <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <Typography variant="h5" fontWeight="bold" color="#e91e63">
                        年齢を選択
                    </Typography>

                    {/* プルダウン選択 */}
                    <FormControl fullWidth sx={{ maxWidth: 200 }}>
                        <InputLabel id="age-select-label" sx={{ 
                            '&.Mui-focused': { color: '#ff80ab' } 
                        }}>年齢</InputLabel>
                        <Select
                            labelId="age-select-label"
                            id="age-select"
                            value={age}
                            label="年齢"
                            onChange={handleAgeChange}
                            sx={{
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#ffcdd2',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#ff80ab',
                                },
                            }}
                        >
                            <MenuItem value=""><em>選択して下さい</em></MenuItem>
                            {ageOptions.map((age) => (
                                <MenuItem key={age} value={age}>{age} 歳</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* 「次へ」ボタン */}
                    <Button
                        variant="contained"
                        size="large"
                        onClick={onNextStep}
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
