'use client';

import React from 'react';

interface Props {
    onNextStep: () => void;
    onPrevStep: () => void;
}

export default function CustomerProfileStep({ onNextStep, onPrevStep }: Props): JSX.Element {
    return (
        <div>
            <h2>カスタマー用プロフィール設定</h2>
            <form>
                <input type="text" placeholder="名前" required />
                <input type="email" placeholder="メールアドレス" required />
                <button type="button" onClick={onPrevStep}>戻る</button>
                <button type="button" onClick={onNextStep}>次へ</button>
            </form>
        </div>
    );
}
