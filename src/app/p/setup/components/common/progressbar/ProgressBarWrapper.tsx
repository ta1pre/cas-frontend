'use client';

import React from 'react';
import { useSetup } from '../../../context/SetupContext';
import ProgressBar from './ProgressBar';

interface ProgressBarWrapperProps {
    children: React.ReactNode;
}

export default function ProgressBarWrapper({ children }: ProgressBarWrapperProps) {
    const { state } = useSetup();

    // キャストフローのすべてのステップでプログレスバーを表示
    const steps = [
        { id: 'cast_profile', label: 'キャストプロフィール', icon: '🎭' },
        { id: 'service_selection', label: 'サービス選択', icon: '🛠️' },
        { id: 'sms_verification', label: 'SMS認証', icon: '📱' },
        { id: 'complete', label: '完了', icon: '✔️' },
    ];

    // キャストフローの該当ステップではプログレスバーを表示
    const shouldShowProgressBar = ['cast_profile', 'service_selection', 'complete'].includes(state.setupStatus);

    return (
        <div>
            {shouldShowProgressBar && <ProgressBar steps={steps} currentStepId={state.setupStatus} />}
            <div>{children}</div>
        </div>
    );
}
