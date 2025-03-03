'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import CustomButton from '@/components/ui/CustomButton';
import { useSetupStorage } from '@/app/p/setup/hooks/storage/useSetupStorage';
import { handleSelectGender } from '@/app/p/setup/hooks/logic/step/handleSelectGender';

interface Props {
    onNextStep: (gender: 'male' | 'female') => void;
}

export default function SexSelectionStep({ onNextStep }: Props) {
    const { getStorage } = useSetupStorage();

    // ✅ 初期値を `user_type` から取得
    const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);

    useEffect(() => {
        const storedUserType = getStorage('user_type');
        if (storedUserType === 'customer') setSelectedGender('male');
        if (storedUserType === 'cast') setSelectedGender('female');
    }, []);

    const [userType, setUserType] = useState<'customer' | 'cast' | null>(null);

    const handleGenderSelection = (gender: 'male' | 'female') => {
        setSelectedGender(gender);
        handleSelectGender(gender, setUserType);  // ✅ `setUserType` を渡す
        onNextStep(gender);
    };


    return (
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
            <Typography variant="h5" gutterBottom>性別選択</Typography>
            <Box sx={{ display: "flex", gap: 3 }}>
                <CustomButton 
                    onClick={() => handleGenderSelection('male')} 
                    label="男性" 
                    color="primary" 
                    variant={selectedGender === 'male' ? 'contained' : 'outlined'} 
                    sx={{ minWidth: 120, padding: "12px 24px" }} 
                />
                <CustomButton 
                    onClick={() => handleGenderSelection('female')} 
                    label="女性" 
                    color="secondary" 
                    variant={selectedGender === 'female' ? 'contained' : 'outlined'} 
                    sx={{ minWidth: 120, padding: "12px 24px" }} 
                />
            </Box>
        </Box>
    );
}
