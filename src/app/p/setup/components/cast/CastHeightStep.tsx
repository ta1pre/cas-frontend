// File: frontapp/src/app/p/setup/components/cast/CastHeightStep.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Slider, Button } from '@mui/material';
import { useSetupStorage } from '@/app/p/setup/hooks/storage/useSetupStorage';
import { handleProfileUpdate } from '@/app/p/setup/hooks/logic/handleProfileUpdate';

interface Props {
    onNextStep: () => void;
}

export default function CastHeightStep({ onNextStep }: Props): React.JSX.Element {
    const { getStorage } = useSetupStorage();
    const [height, setHeight] = useState<number>(170); // ✅ デフォルト値

    // ✅ LocalStorage から身長を復元
    useEffect(() => {
        const savedProfile = JSON.parse(getStorage('profile_data') || '{}');
        if (savedProfile.height) {
            setHeight(savedProfile.height);
        }
    }, []);

    // ✅ スライダーの変更処理（変更時に即時 `localStorage` に保存）
    const handleHeightChange = (_: Event, newValue: number | number[]) => {
        if (typeof newValue === 'number') {
            setHeight(newValue);
            handleProfileUpdate({ height: newValue }); // ✅ 変更時に即時保存
        }
    };

    // ✅ 「次へ」ボタンの処理
    const handleNext = () => {
        onNextStep();
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
                width: '100%', // ✅ 幅を広げる
            }}
        >
            {/* タイトル */}
            <Typography variant="h5" fontWeight="bold">
                身長を選択
            </Typography>

            {/* スライダー */}
            <Box sx={{ width: '100%', textAlign: 'center' }}> {/* ✅ 幅を最大に */}
                <Slider
                    value={height}
                    onChange={handleHeightChange} // ✅ 変更時に即時保存
                    valueLabelDisplay="auto"
                    min={140} // ✅ 最小値 140cm
                    max={190} // ✅ 最大値 190cm
                    step={1}
                    marks={[
                        { value: 140, label: '140cm' },
                        { value: 165, label: '165cm' },
                        { value: 190, label: '190cm' },
                    ]}
                />
                <Typography variant="h6">{height} cm</Typography>
            </Box>

            {/* 「次へ」ボタン */}
            <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleNext}
                disabled={height === 170} // ✅ 変更がない場合は無効化
                sx={{ mt: 2 }}
            >
                次へ
            </Button>
        </Box>
    );
}
