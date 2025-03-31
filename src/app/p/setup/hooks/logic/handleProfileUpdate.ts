'use client';

import { getCookie, setCookie } from '../../utils/cookieUtils';

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
 * プロフィールデータを localStorage に保存
 */
export function handleProfileUpdate(updatedData: Record<string, any>) {
    // ✅ 既存の profile_data を取得
    const existingData = JSON.parse(getStorageValue('profile_data') || '{}');

    // ✅ 新しいデータとマージ
    const newData = { ...existingData, ...updatedData };

    // ✅ localStorage に保存
    setStorageValue('profile_data', JSON.stringify(newData));
}
