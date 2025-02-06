'use client';

import React from 'react';

interface Props {
    onNextStep: () => void;
}

export default function AgeVerificationStep({ onNextStep }: Props) {
    return (
        <div>
            <h2>年齢確認</h2>
            <button onClick={onNextStep}>18歳以上</button>
            <button onClick={() => alert('18歳未満の方は利用できません')}>18歳未満</button>
        </div>
    );
}
