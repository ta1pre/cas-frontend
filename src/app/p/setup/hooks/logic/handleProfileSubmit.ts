'use client';

import { getCookie, removeCookie } from '../../utils/cookieUtils';

// ✅ ローカルストレージから値を取得
function getStorageValue(key: string): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
}

// ✅ ローカルストレージの値を削除
function removeStorageValue(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
    
    // ✅ クッキーからも削除
    removeCookie(key);
}

/**
 * ✅ プロフィール情報を整理 & API に送信
 */
export async function handleProfileSubmit() {
    // ✅ ユーザータイプを取得
    const userType = getStorageValue('user_type');
    if (!userType) return;

    // ✅ `profile_data` を取得
    const profileData = JSON.parse(getStorageValue('profile_data') || '{}');

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
        removeStorageValue('profile_data');

        console.log('プロフィール送信完了');
    } catch (error) {
        console.error('エラー:', error);
    }
}
