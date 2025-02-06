'use client';

import React from 'react';
import { useSetup } from '../../context/SetupContext';
import CustomButton from '@/components/ui/CustomButton'; // ✅ `SetupFlow.tsx` で一括インポートするなら削除可
import { Box, Typography } from '@mui/material';

interface Props {
    onNextStepMale: () => void;
    onNextStepFemale: () => void;
}

export default function SexSelectionStep({ onNextStepMale, onNextStepFemale }: Props) {
    const { state, setGender, setUserType, updateProfileData, setSetupStatus } = useSetup();

    const handleSelectMale = () => {
        setGender('male');
        setUserType('customer');
        updateProfileData({ gender: 'male', user_type: 'customer' });
        setSetupStatus('customer_profile');
        onNextStepMale();
    };

    const handleSelectFemale = () => {
        setGender('female');
        setUserType('cast');
        updateProfileData({ gender: 'female', user_type: 'cast' });
        setSetupStatus('cast_profile');
        onNextStepFemale();
    };

    return (
        <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="h5" gutterBottom>
                性別選択
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
                <CustomButton onClick={handleSelectMale} label="男性" color="primary" />
                <CustomButton onClick={handleSelectFemale} label="女性" color="secondary" variant="outlined" />
            </Box>

            {/* ✅ デバッグ用：profileDataの内容を画面に表示 */}
            <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px', marginTop: '20px' }}>
                {JSON.stringify(state.profileData, null, 2)}
            </pre>
        </Box>
    );
}
