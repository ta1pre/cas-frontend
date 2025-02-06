'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // ✅ ルーターを追加
import { useSetup } from '../../context/SetupContext';
import AgeVerificationStep from './AgeVerificationStep';
import SexSelectionStep from './SexSelectionStep';
import CustomerProfileStep from '../customer/CustomerProfileStep';
import CastProfileStep from '../cast/CastProfileStep';
import ServiceSelectionStep from '../cast/ServiceSelectionStep';
import SMSVerificationStep from '../../components/common/SMSVerificationStep';
import CompleteStep from './CompleteStep';
import { Container, Box } from '@mui/material';

export default function SetupFlow() {
    const { state, setSetupStatus } = useSetup();
    const router = useRouter(); // ✅ ルーターを取得

    // ✅ setupStatus が completedZ になったら user_type に応じてリダイレクト
    useEffect(() => {
        if (state.setupStatus === 'completed') {
            if (state.user_type === 'user') {
                router.push('/p/user'); // ✅ ユーザー用のページへ
            } else if (state.user_type === 'cast') {
                router.push('/p/cast'); // ✅ キャスト用のページへ
            }
        }
    }, [state.setupStatus, state.user_type, router]); // ✅ `userType` → `user_type` に修正

    // ✅ ステップに対応するコンポーネントを定義
    const getStepComponent = () => {
        switch (state.setupStatus) {
            case 'empty':
                return <AgeVerificationStep onNextStep={() => setSetupStatus('sex_selection')} />;
            case 'sex_selection':
                return (
                    <SexSelectionStep
                        onNextStepMale={() => setSetupStatus('customer_profile')}
                        onNextStepFemale={() => setSetupStatus('cast_profile')}
                    />
                );
            case 'customer_profile':
                return (
                    <CustomerProfileStep
                        onNextStep={() => setSetupStatus('sms_verification')}
                        onPrevStep={() => setSetupStatus('sex_selection')}
                    />
                );
            case 'cast_profile':
                return (
                    <CastProfileStep
                        onNextStep={() => setSetupStatus('service_selection')}
                        onPrevStep={() => setSetupStatus('sex_selection')}
                    />
                );
            case 'service_selection':
                return (
                    <ServiceSelectionStep
                        onNextStep={() => setSetupStatus('sms_verification')}
                        onPrevStep={() => setSetupStatus('cast_profile')}
                    />
                );
            case 'sms_verification':
                return (
                    <SMSVerificationStep
                        onNextStep={() => setSetupStatus('complete')}
                        onPrevStep={() =>
                            state.setupStatus === 'service_selection'
                                ? setSetupStatus('service_selection')
                                : setSetupStatus('customer_profile')
                        }
                    />
                );
            case 'complete':
                return <CompleteStep />;
            default:
                return <p>不明なステータスです。</p>;
        }
    };

    return (
        <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
            {/* ✅ 各ステップのコンポーネントを表示 */}
            <Box>{getStepComponent()}</Box>
        </Container>
    );
}
