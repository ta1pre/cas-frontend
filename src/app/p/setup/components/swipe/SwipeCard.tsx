'use client';

import React from 'react';

interface SwipeCardProps {
    title: string;
    description: string;
    isSelected: boolean;
    onSelect: () => void;
    onDeselect: () => void;
}

export default function SwipeCard({ title, description, isSelected, onSelect, onDeselect }: SwipeCardProps) {
    return (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '0 10px', textAlign: 'center' }}>
            <h3>{title}</h3>
            <p>{description}</p>
            <button
                onClick={isSelected ? onDeselect : onSelect}
                style={{
                    backgroundColor: isSelected ? '#4caf50' : '#f0f0f0',
                    color: isSelected ? '#fff' : '#000',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                {isSelected ? 'このサービスを選択中' : 'このサービスに対応する'}
            </button>
        </div>
    );
}
