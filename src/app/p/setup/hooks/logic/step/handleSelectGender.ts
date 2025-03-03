'use client';

import { useSetupStorage } from '../../storage/useSetupStorage';
import { clearProfileData } from '../clearProfileData';

/**
 * ✅ 性別選択時の処理
 */
export function handleSelectGender(
    gender: 'male' | 'female',
    setUserType: (userType: 'customer' | 'cast') => void
) {
    const { getStorage, setStorage } = useSetupStorage();

    // ✅ 現在の `user_type` を取得
    const currentUserType = getStorage('user_type');

    // ✅ 新しい `user_type` を決定
    const newUserType = gender === 'male' ? 'customer' : 'cast';

    // ✅ **性別が変更された場合のみ `profile_data` を削除**
    if (currentUserType && currentUserType !== newUserType) {
        clearProfileData();
    }

    // ✅ `user_type` を保存
    setStorage('user_type', newUserType);

    // ✅ ステータス更新
    setUserType(newUserType);
}
