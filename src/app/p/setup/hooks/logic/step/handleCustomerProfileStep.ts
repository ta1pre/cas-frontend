// src/app/p/setup/hooks/logic/step/handleCustomerProfileStep.ts
'use client';

import { handleProfileUpdate } from '../handleProfileUpdate';

/**
 * ✅ ニックネーム入力時の処理（リアルタイム更新）
 */
export function handleCustomerProfileStep(nickname: string) {
    // ✅ `profile_data` にニックネームを即時保存
    handleProfileUpdate({ nickname });
}
