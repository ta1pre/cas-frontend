'use client';

import axios from 'axios';
import { handleProfileUpdate } from '../handleProfileUpdate';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

/**
 * ✅ キャスト名入力時の処理（リアルタイム更新）
 */
export function handleCastName(castName: string) {
    handleProfileUpdate({ cast_name: castName });
}

/**
 * ✅ キャスト登録APIを実行（token を外部から渡す）
 */
export async function registerCast(token: string) {
    if (!token) {
        console.error("❌ トークンがありません。キャスト登録APIは実行されません。");
        return;
    }

    try {
        const response = await axios.post(`${apiUrl}/api/v1/setup/register/register`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("✅ キャスト登録成功:", response.data);
    } catch (error) {
        console.error("❌ キャスト登録に失敗しました:", error);
    }
}
