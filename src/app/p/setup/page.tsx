'use client';

import React from 'react';
import { SetupProvider } from './context/SetupContext';
import ProgressBarWrapper from './components/common/progressbar/ProgressBarWrapper';
import SetupFlow from './components/common/SetupFlow';

export default function SetupPage() {
    return (
        <SetupProvider>
            <ProgressBarWrapper>
                <SetupFlow />
            </ProgressBarWrapper>
        </SetupProvider>
    );
}
