'use client';

import React, { useState } from 'react';

interface HardModalProps {
    onClose: () => void;
    onSave: (details: { price: string; duration: string; intensity: string; options: string }) => void;
}

export default function HardModal({ onClose, onSave }: HardModalProps) {
    const [details, setDetails] = useState({
        price: '',
        duration: '',
        intensity: '',
        options: '',
    });

    return (
        <div
            style={{
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', width: '90%' }}>
                <h2>ハードの詳細設定</h2>
                <form>
                    <label>
                        料金:
                        <input
                            type="number"
                            value={details.price}
                            onChange={(e) => setDetails({ ...details, price: e.target.value })}
                            placeholder="料金 (円)"
                        />
                    </label>
                    <label>
                        所要時間:
                        <input
                            type="number"
                            value={details.duration}
                            onChange={(e) => setDetails({ ...details, duration: e.target.value })}
                            placeholder="所要時間 (分)"
                        />
                    </label>
                    <label>
                        強度設定:
                        <input
                            type="text"
                            value={details.intensity}
                            onChange={(e) => setDetails({ ...details, intensity: e.target.value })}
                            placeholder="強度設定"
                        />
                    </label>
                    <label>
                        オプション:
                        <textarea
                            value={details.options}
                            onChange={(e) => setDetails({ ...details, options: e.target.value })}
                            placeholder="オプション設定"
                        ></textarea>
                    </label>
                    <div style={{ marginTop: '20px' }}>
                        <button type="button" onClick={() => onSave(details)}>
                            保存
                        </button>
                        <button type="button" onClick={onClose} style={{ marginLeft: '10px' }}>
                            キャンセル
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
