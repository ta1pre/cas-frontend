'use client';

import React from 'react';
import { Box, Button, Typography } from '@mui/material';

interface Props {
    onNextStep: () => void;
}

export default function AgeVerificationStep({ onNextStep }: Props) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",  // ✅ 余白を完全になくす
                overflow: "hidden",  // ✅ スクロールを防ぐ
                textAlign: "center",
                bgcolor: "background.default",
                color: "text.primary",
                px: 3,
            }}
        >
            {/* タイトル */}
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                年齢確認
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
                18歳以上の方のみご利用いただけます。
            </Typography>

            {/* ボタン */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%", maxWidth: 300 }}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={onNextStep} 
                    fullWidth
                    sx={{ py: 1.5, fontSize: "1.1rem" }}
                >
                    ✅ 18歳以上
                </Button>
                <Button 
                    variant="contained" 
                    color="error" 
                    onClick={() => alert('18歳未満の方は利用できません')} 
                    fullWidth
                    sx={{ py: 1.5, fontSize: "1.1rem" }}
                >
                    ⚠ 18歳未満
                </Button>
            </Box>
        </Box>
    );
}
