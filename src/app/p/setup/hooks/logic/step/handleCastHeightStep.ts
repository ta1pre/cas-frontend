// File: frontapp/src/app/p/setup/hooks/logic/step/handleCastHeight.ts
'use client';

import { handleProfileUpdate } from '../handleProfileUpdate';

/**
 * ✅ 身長入力時の処理
 */
export function handleCastHeight(
    height: number,
    onNextStep: () => void
) {
    // ✅ `profile_data` に身長を保存
    handleProfileUpdate({ height });

    // ✅ 次のステップへ進む
    onNextStep();
}
