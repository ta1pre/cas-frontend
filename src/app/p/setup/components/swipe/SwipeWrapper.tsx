'use client';

import React, { useState } from 'react';
import SwipeCard from './SwipeCard';
import SoftModal from './SoftModal';
import HardModal from './HardModal';

export default function SwipeWrapper() {
    const [activeModal, setActiveModal] = useState<'soft' | 'hard' | null>(null);

    const handleSave = (service: 'soft' | 'hard', details: any) => {
        console.log(`保存された ${service} の詳細:`, details);
        setActiveModal(null);
    };

    return (
        <div style={{ display: 'flex', overflowX: 'scroll', padding: '10px' }}>
            <SwipeCard
                title="ソフト"
                description="リラクゼーションマッサージや柔らかい施術に対応します。"
                isSelected={activeModal === 'soft'}
                onSelect={() => setActiveModal('soft')}
                onDeselect={() => console.log('ソフト選択解除')}
            />
            <SwipeCard
                title="ハード"
                description="本格的なスポーツマッサージや強めの施術に対応します。"
                isSelected={activeModal === 'hard'}
                onSelect={() => setActiveModal('hard')}
                onDeselect={() => console.log('ハード選択解除')}
            />
            {activeModal === 'soft' && (
                <SoftModal onClose={() => setActiveModal(null)} onSave={(details) => handleSave('soft', details)} />
            )}
            {activeModal === 'hard' && (
                <HardModal onClose={() => setActiveModal(null)} onSave={(details) => handleSave('hard', details)} />
            )}
        </div>
    );
}
