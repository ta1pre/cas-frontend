'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, Container } from '@mui/material';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import { useSetupStorage } from '@/app/p/setup/hooks/storage/useSetupStorage';
import { handleSelectGender } from '@/app/p/setup/hooks/logic/step/handleSelectGender';

interface Props {
    onNextStep: (gender: 'male' | 'female') => void;
}

export default function SexSelectionStep({ onNextStep }: Props) {
    const { getStorage } = useSetupStorage();
    const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [tempGender, setTempGender] = useState<'male' | 'female' | null>(null);

    useEffect(() => {
        const storedUserType = getStorage('user_type');
        if (storedUserType === 'customer') setSelectedGender('male');
        if (storedUserType === 'cast') setSelectedGender('female');
    }, []);

    const handleGenderSelection = (gender: 'male' | 'female') => {
        setTempGender(gender);
        setConfirmOpen(true);
    };

    const confirmSelection = () => {
        if (tempGender) {
            setSelectedGender(tempGender);
            handleSelectGender(tempGender, () => {});
            onNextStep(tempGender);
        }
        setConfirmOpen(false);
    };

    return (
        <Container maxWidth="md">
            {/* コンテンツエリア */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    bgcolor: "background.default",
                    color: "text.primary",
                    px: 3,
                    py: 4,
                }}
            >
                {/* タイトル */}
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    性別を選択
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, color: "text.secondary" }}>
                    後で変更はできません。
                </Typography>

                {/* ボタン */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%", maxWidth: 300 }}>
                    <Button
                        variant={selectedGender === 'male' ? 'contained' : 'outlined'}
                        fullWidth
                        startIcon={<MaleIcon />}
                        onClick={() => handleGenderSelection('male')}
                        sx={{
                            py: 1.5,
                            fontSize: "1.1rem",
                            borderColor: "#2196F3",
                            color: selectedGender === 'male' ? "#FFFFFF" : "#2196F3",
                            bgcolor: selectedGender === 'male' ? "#2196F3" : "transparent",
                            '&:hover': {
                                bgcolor: selectedGender === 'male' ? "#1976D2" : "rgba(33, 150, 243, 0.1)",
                            },
                        }}
                    >
                        男性
                    </Button>
                    <Button
                        variant={selectedGender === 'female' ? 'contained' : 'outlined'}
                        fullWidth
                        startIcon={<FemaleIcon />}
                        onClick={() => handleGenderSelection('female')}
                        sx={{
                            py: 1.5,
                            fontSize: "1.1rem",
                            borderColor: "#E91E63",
                            color: selectedGender === 'female' ? "#FFFFFF" : "#E91E63",
                            bgcolor: selectedGender === 'female' ? "#E91E63" : "transparent",
                            '&:hover': {
                                bgcolor: selectedGender === 'female' ? "#C2185B" : "rgba(233, 30, 99, 0.1)",
                            },
                        }}
                    >
                        女性
                    </Button>
                </Box>
            </Box>

            {/* 確認ダイアログ */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle sx={{ fontWeight: "bold" }}>確認</DialogTitle>
                <DialogContent>
                    <Typography fontWeight="bold">
                        本当に{" "}
                        <Box component="span" sx={{ color: tempGender === "male" ? "#2196F3" : "#E91E63", fontWeight: "bold" }}>
                            {tempGender === "male" ? "男性" : "女性"}
                        </Box>{" "}
                        で確定しますか？
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)} color="inherit">
                        キャンセル
                    </Button>
                    <Button onClick={confirmSelection} sx={{ color: tempGender === "male" ? "#2196F3" : "#E91E63" }}>
                        確定
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
