'use client';

import { useSetupStorage } from '../storage/useSetupStorage';

/**
 * ✅ プロフィール情報を整理 & API に送信
 */
export async function handleProfileSubmit() {
    const { getStorage, removeStorage } = useSetupStorage();

    // ✅ ユーザータイプを取得
    const userType = getStorage('user_type');
    if (!userType) return;

    // ✅ `profile_data` を取得
    const profileData = JSON.parse(getStorage('profile_data') || '{}');

    // ✅ `user_type` に応じて不要なデータを除外
    const filteredProfileData = userType === 'customer'
        ? { name: profileData.name, email: profileData.email }
        : { castName: profileData.castName, experience: profileData.experience, services: profileData.services };

    try {
        // ✅ API 送信
        const response = await fetch('/api/submitProfile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userType,
                profileData: filteredProfileData,
            }),
        });

        if (!response.ok) {
            throw new Error('API 送信に失敗しました');
        }

        // ✅ 送信成功後 `profile_data` を削除
        removeStorage('profile_data');

        console.log('プロフィール送信完了');
    } catch (error) {
        console.error('エラー:', error);
    }
}
