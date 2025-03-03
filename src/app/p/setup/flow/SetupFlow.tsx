// File: frontapp/src/app/p/setup/flow/SetupFlow.tsx
'use client';

import React, { useEffect } from 'react';
import { Container, CircularProgress } from '@mui/material';
import { useSetupNavigation } from '../hooks/storage/useSetupNavigation';
import BackButton from './BackButton';

// ✅ 各ステップのコンポーネント
import AgeVerificationStep from '../components/common/AgeVerificationStep';
import SexSelectionStep from '../components/common/SexSelectionStep';
import CustomerProfileStep from '../components/customer/CustomerProfileStep';
import CastNameStep from '../components/cast/CastNameStep';
import CastPhotoStep from '../components/cast/CastPhotoStep';
import CastAgeStep from '../components/cast/CastAgeStep';
import CastHeightStep from '../components/cast/CastHeightStep';
import CastTraitsStep from '../components/cast/CastTraitsStep'; // ✅ 追加
import CastServiceSelectionStep from '../components/cast/CastServiceSelectionStep';
import SMSVerificationStep from '../components/common/SMSVerificationStep';
import CompleteStep from '../components/common/CompleteStep';

export default function SetupFlow() {
    const { setupStatus, setSetupStatus, handlePrevStep } = useSetupNavigation();

    // ✅ デバッグ用ログ出力
    useEffect(() => {
        console.log('現在の setupStatus:', setupStatus);
    }, [setupStatus]);

    // ✅ ローディング処理
    if (setupStatus === null) {
        console.log('setupStatus が null のため、ローディング画面を表示');
        return (
            <Container maxWidth="md" sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    // ✅ ステップごとのコンポーネントを取得
    const getStepComponent = () => {
        console.log('現在のステップ:', setupStatus);
        switch (setupStatus) {
            case 'empty': 
                return <AgeVerificationStep onNextStep={() => setSetupStatus('sex_selection')} />;
            case 'sex_selection': 
                return <SexSelectionStep onNextStep={(gender) => setSetupStatus(gender === 'male' ? 'customer_profile' : 'cast_name')} />;

            case 'customer_profile': 
                return <CustomerProfileStep onNextStep={() => setSetupStatus('sms_verification')} />;
            case 'cast_name': 
                return <CastNameStep onNextStep={() => setSetupStatus('cast_photo')} />;
            case 'cast_photo': 
                return <CastPhotoStep onNextStep={() => setSetupStatus('cast_age')} />;
            case 'cast_age': 
                return <CastAgeStep onNextStep={() => setSetupStatus('cast_height')} />;
            case 'cast_height': 
                return <CastHeightStep onNextStep={() => setSetupStatus('cast_traits')} />; // ✅ 修正
            case 'cast_traits': 
                return <CastTraitsStep onNextStep={() => setSetupStatus('service_selection')} />; // ✅ 追加
            case 'service_selection': 
                return <CastServiceSelectionStep onNextStep={() => setSetupStatus('sms_verification')} />;
            case 'sms_verification': 
                return <SMSVerificationStep onNextStep={() => setSetupStatus('complete')} />;
            case 'complete': 
                return <CompleteStep />;
            default: 
                return <p>不明なステータスです。</p>;
        }
    };

    return (
        <Container
            maxWidth="md"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <BackButton onClick={handlePrevStep} />
            {getStepComponent()}
        </Container>
    );
}
