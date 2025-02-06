'use client';

import React, { useState } from 'react';
import SwipeCard from '../swipe/SwipeCard';
import SoftModal from '../swipe/SoftModal';
import HardModal from '../swipe/HardModal';

interface ServiceSelectionStepProps {
    onNextStep: () => void;
    onPrevStep: () => void;
}

export default function ServiceSelectionStep({ onNextStep, onPrevStep }: ServiceSelectionStepProps) {
    const [activeModal, setActiveModal] = useState<'soft' | 'hard' | null>(null);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);

    const handleSave = (service: 'soft' | 'hard', details: any) => {
        console.log(`${service} の詳細が保存されました:`, details);
        setSelectedServices((prev) => [...prev, service]);
        setActiveModal(null);
    };

    const handleDeselect = (service: 'soft' | 'hard') => {
        setSelectedServices((prev) => prev.filter((s) => s !== service));
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>サービス選択 & 詳細設定</h2>
            <p>提供可能なサービスを選択し、詳細を設定してください。</p>
            <div style={{ display: 'flex', overflowX: 'scroll', padding: '10px', gap: '10px' }}>
                <SwipeCard
                    title="ソフト"
                    description="リラクゼーションマッサージや柔らかい施術に対応します。"
                    isSelected={selectedServices.includes('soft')}
                    onSelect={() => setActiveModal('soft')}
                    onDeselect={() => handleDeselect('soft')}
                />
                <SwipeCard
                    title="ハード"
                    description="本格的なスポーツマッサージや強めの施術に対応します。"
                    isSelected={selectedServices.includes('hard')}
                    onSelect={() => setActiveModal('hard')}
                    onDeselect={() => handleDeselect('hard')}
                />
            </div>

            {/* モーダルの表示 */}
            {activeModal === 'soft' && (
                <SoftModal
                    onClose={() => setActiveModal(null)}
                    onSave={(details) => handleSave('soft', details)}
                />
            )}
            {activeModal === 'hard' && (
                <HardModal
                    onClose={() => setActiveModal(null)}
                    onSave={(details) => handleSave('hard', details)}
                />
            )}

            {/* ナビゲーション */}
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <button onClick={onPrevStep} style={{ padding: '10px 20px' }}>
                    戻る
                </button>
                <button
                    onClick={onNextStep}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: selectedServices.length > 0 ? '#4caf50' : '#ccc',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: selectedServices.length > 0 ? 'pointer' : 'not-allowed',
                    }}
                    disabled={selectedServices.length === 0}
                >
                    次へ
                </button>
            </div>
        </div>
    );
}
