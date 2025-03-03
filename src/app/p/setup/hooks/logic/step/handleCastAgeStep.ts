'use client';

import { useSetupStorage } from '../../storage/useSetupStorage';

/**
 * ✅ キャストの年齢を LocalStorage に保存
 */
export function handleCastAge(age: number) {
    const { getStorage, setStorage } = useSetupStorage();

    // ✅ `profile_data` を取得 & 更新
    const profileData = JSON.parse(getStorage('profile_data') || '{}');
    profileData.age = age;

    setStorage('profile_data', JSON.stringify(profileData));
}
