// File: frontapp/src/app/p/setup/components/cast/CastAgeStep.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Slider, Button, Container } from '@mui/material';
import { useSetupStorage } from '@/app/p/setup/hooks/storage/useSetupStorage';
import { handleProfileUpdate } from '@/app/p/setup/hooks/logic/handleProfileUpdate';

interface Props {
    onNextStep: () => void;
}

export default function CastAgeStep({ onNextStep }: Props): React.JSX.Element {
    const { getStorage } = useSetupStorage();
    const [age, setAge] = useState<number>(20); // ✅ デフォルト値

    // ✅ LocalStorage から年齢を復元
    useEffect(() => {
        const savedProfile = JSON.parse(getStorage('profile_data') || '{}');
        if (savedProfile.age) {
            setAge(savedProfile.age);
        }
    }, []);

    // ✅ スライダーの変更処理（変更時に即座にストレージに反映）
    const handleAgeChange = (_: Event, newValue: number | number[], __: number) => {
        if (typeof newValue === 'number') {
            setAge(newValue);
            handleProfileUpdate({ age: newValue }); // ✅ 即座に `localStorage` に保存
        }
    };

    return (
        <Container maxWidth="sm">
            <Box textAlign="center" my={4}>
                <Typography variant="h5" fontWeight="bold">
                    🎂 年齢を選択
                </Typography>
            </Box>

            {/* ✅ スライダー */}
            <Box sx={{ width: '80%', textAlign: 'center' }}>
                <Slider
                    value={age}
                    onChange={handleAgeChange}
                    valueLabelDisplay="auto"
                    min={18}
                    max={60}
                    step={1}
                    marks={[
                        { value: 18, label: '18歳' },
                        { value: 30, label: '30歳' },
                        { value: 45, label: '45歳' },
                        { value: 60, label: '60歳' },
                    ]}
                />
                <Typography variant="h6">{age} 歳</Typography>
            </Box>

            {/* ✅ 「次へ」ボタンのみ */}
            <Box textAlign="center" mt={4}>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={onNextStep}
                    disabled={age === 20} // ✅ 変更がない場合は無効化
                >
                    次へ
                </Button>
            </Box>
        </Container>
    );
}
