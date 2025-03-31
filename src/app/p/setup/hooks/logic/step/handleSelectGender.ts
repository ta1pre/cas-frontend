'use client';

import { clearProfileData } from '../clearProfileData';
import { setCookie } from '../../../utils/cookieUtils';

// ✅ ローカルストレージからユーザータイプを取得
function getStorageValue(key: string): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(key);
}

// ✅ ローカルストレージに値を保存
function setStorageValue(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, value);
}

/**
 * ✅ 性別選択時の処理
 */
export function handleSelectGender(
    gender: 'male' | 'female',
    setUserType: (userType: 'customer' | 'cast') => void
) {
    // ✅ 現在の `user_type` を取得
    const currentUserType = getStorageValue('user_type');

    // ✅ 新しい `user_type` を決定
    const newUserType = gender === 'male' ? 'customer' : 'cast';

    // ✅ **性別が変更された場合のみ `profile_data` を削除**
    if (currentUserType && currentUserType !== newUserType) {
        clearProfileData();
    }

    // ✅ `user_type` をローカルストレージに保存
    setStorageValue('user_type', newUserType);
    
    // ✅ StartPageクッキーも更新
    const genre = 'cas'; // デフォルトは通常タイプ
    setCookie('StartPage', `${newUserType}:${genre}`);

    // ✅ ステータス更新
    setUserType(newUserType);
}
