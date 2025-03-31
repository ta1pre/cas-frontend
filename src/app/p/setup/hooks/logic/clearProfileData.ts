// File: frontapp/src/app/p/setup/hooks/logic/clearProfileData.ts
'use client';

import { removeCookie } from '../../utils/cookieUtils';

/**
 * ✅ LocalStorage のプロフィールデータを削除する
 */
export function clearProfileData() {
    // ✅ ローカルストレージから削除
    if (typeof window !== 'undefined') {
        localStorage.removeItem('profile_data');
    }
    
    // ✅ クッキーからも削除
    removeCookie('profile_data');
}
