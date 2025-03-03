// File: src/app/p/setup/components/cast/SetupTraits.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import BasicTraits from '@/app/p/cast/components/traits/components/BasicTraits';
import { useTraits } from '@/app/p/cast/components/traits/hooks/useTraits';

interface Props {
    onNextStep: () => void;
}

export default function SetupTraits({ onNextStep }: Props): React.JSX.Element {
    const { selectedTraits } = useTraits();
    const [traits, setTraits] = useState<number[]>([]);
    const [isNextEnabled, setIsNextEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // ✅ 初回データ取得（APIから直接取得）
    useEffect(() => {
        setTimeout(() => {
            console.log("✅ 初回取得データ:", selectedTraits);
            setTraits(selectedTraits);
            setIsNextEnabled(selectedTraits.length > 0);
            setIsLoading(false);
        }, 0);
    }, [selectedTraits]);

    // ✅ 特徴が変更されたらリアルタイムで更新
    const handleTraitChange = (updatedTraits: number[]) => {
        console.log("✅ 更新後の特徴選択:", updatedTraits);
        setTraits(updatedTraits);
        setIsNextEnabled(updatedTraits.length > 0);
    };

    // ✅ 「次へ」ボタンの処理
    const handleNext = () => {
        if (traits.length === 0) return;
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
                width: '100%',
            }}
        >
            {/* タイトル */}
            <Typography variant="h5" fontWeight="bold">
                特徴を選択
            </Typography>

            {/* ✅ 選択状態の表示 */}
            <Typography variant="body1" color={traits.length > 0 ? "success.main" : "error.main"}>
                {isLoading
                    ? "🔄 読み込み中..."
                    : traits.length > 0
                        ? `✅ 選択済み: ${traits.length}件`
                        : "⚠️ 1つ以上選択してください"}
            </Typography>

            {/* ✅ 特徴選択コンポーネント */}
            {isLoading ? (
                <CircularProgress />
            ) : (
                <BasicTraits onTraitsChange={handleTraitChange} />
            )}

            {/* 「次へ」ボタン */}
            <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleNext}
                disabled={isLoading || !isNextEnabled}
                sx={{ mt: 2 }}
            >
                次へ
            </Button>
        </Box>
    );
}
