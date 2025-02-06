// src/services/auth/providers/lineAuth.ts

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * LINEログイン
 * @param trackingId - トラッキングID
 */
export async function loginWithLine(trackingId: string): Promise<void> {
    try {
        console.log('[loginWithLine] API:', `${API_URL}/api/v1/account/line/login?tracking_id=${trackingId}`);
        const response = await axios.get(`${API_URL}/api/v1/account/line/login?tracking_id=${trackingId}`);
        const { auth_url } = response.data;

        if (auth_url) {
            console.log('🌐 Redirecting to LINE Auth URL:', auth_url);
            window.location.href = auth_url;
        } else {
            throw new Error('LINE認証URLが見つかりません');
        }
    } catch (error: any) {
        console.error('[loginWithLine] Error:', error.message);
        throw new Error('LINEログイン中にエラーが発生しました');
    }
}
