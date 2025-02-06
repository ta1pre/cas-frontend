'use client';

import React from 'react';

interface Props {
    onNextStep: () => void;
}

export default function AccountSetupStep({ onNextStep }: Props): JSX.Element {
    return (
        <div>
            <h2>アカウント設定</h2>
            <form>
                <input type="text" placeholder="名前" required />
                <input type="email" placeholder="メールアドレス" required />
                <input type="password" placeholder="パスワード" required />
                <button type="button" onClick={onNextStep}>次へ</button>
            </form>
        </div>
    );
}
