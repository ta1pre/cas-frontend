import React from 'react';

interface HelpFilterProps {
    showAdult: boolean;
    toggleAdult: () => void;
}

export function HelpFilter({ showAdult, toggleAdult }: HelpFilterProps) {
    return (
        <div className="flex items-center justify-between p-2 border-b">
            <h2 className="text-xl font-bold">ヘルプ一覧</h2>
            <button 
                onClick={toggleAdult}
                className="px-4 py-2 border rounded"
            >
                {showAdult ? '🔞 アダルト表示ON' : '🚫 アダルト非表示'}
            </button>
        </div>
    );
}
