'use client';

import { getCookie, setCookie } from '../../../utils/cookieUtils';

// ✅ ウェブストレージから値を取得
function getStorageValue(key: string): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
}

// ✅ ウェブストレージに値を保存
function setStorageValue(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, value);
    
    // ✅ クッキーにも保存
    setCookie(key, value);
}

/**
 * ✅ キャストの年齢を LocalStorage に保存
 */
export function handleCastAge(age: number) {
    // ✅ `profile_data` を取得 & 更新
    const profileData = JSON.parse(getStorageValue('profile_data') || '{}');
    profileData.age = age;

    setStorageValue('profile_data', JSON.stringify(profileData));
}
