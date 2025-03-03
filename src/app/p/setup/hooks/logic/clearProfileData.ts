// File: frontapp/src/app/p/setup/hooks/logic/clearProfileData.ts
'use client';

import { useSetupStorage } from '../storage/useSetupStorage';

/**
 * ✅ LocalStorage のプロフィールデータを削除する
 */
export function clearProfileData() {
    const { removeStorage } = useSetupStorage();
    removeStorage('profile_data');
}
