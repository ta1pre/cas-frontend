'use client';

import { useSetupStorage } from '../storage/useSetupStorage';

/**
 * プロフィールデータを localStorage に保存
 */
export function handleProfileUpdate(updatedData: Record<string, any>) {
    const { getStorage, setStorage } = useSetupStorage();

    // ✅ 既存の profile_data を取得
    const existingData = JSON.parse(getStorage('profile_data') || '{}');

    // ✅ 新しいデータとマージ
    const newData = { ...existingData, ...updatedData };

    // ✅ localStorage に保存
    setStorage('profile_data', JSON.stringify(newData));
}
