'use client';

import React from 'react';

interface ProgressBarProps {
    steps: { id: string; label: string; icon: string }[];
    currentStepId: string;
}

export default function ProgressBar({ steps, currentStepId }: ProgressBarProps) {
    const currentIndex = steps.findIndex(step => step.id === currentStepId);
    const progressPercentage = ((currentIndex + 1) / steps.length) * 100;

    return (
        <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                {steps.map((step, index) => (
                    <span
                        key={step.id}
                        style={{
                            fontWeight: index <= currentIndex ? 'bold' : 'normal',
                            color: index <= currentIndex ? '#4caf50' : '#ccc',
                        }}
                    >
                        {step.label}
                    </span>
                ))}
            </div>
            <div style={{ position: 'relative', height: '10px', backgroundColor: '#eee', borderRadius: '5px' }}>
                <div
                    style={{
                        height: '100%',
                        width: `${progressPercentage}%`,
                        backgroundColor: '#4caf50',
                        borderRadius: '5px',
                        transition: 'width 0.3s ease-in-out',
                    }}
                ></div>
            </div>
        </div>
    );
}
