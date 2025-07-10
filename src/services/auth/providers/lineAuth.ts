// src/services/auth/providers/lineAuth.ts

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * LINEログイン
 * @param trackingId - トラッキングID
 */
export async function loginWithLine(trackingId: string): Promise<void> {
    try {
        const requestUrl = `${API_URL}/api/v1/account/line/login?tr=${trackingId}`;
        console.log('🔄 [lineAuth] リクエストURL:', requestUrl);
        console.log('🔄 [lineAuth] trackingId:', trackingId);
        
        const response = await axios.get(requestUrl);
        
        console.log('🔄 [lineAuth] レスポンス:', response.data);
        console.log('🔄 [lineAuth] ステータス:', response.status);
        
        const { auth_url } = response.data;

        if (auth_url) {
            console.log('🌐 [lineAuth] LINE認証URL:', auth_url);
            
            // URLパラメータを解析
            const url = new URL(auth_url);
            console.log('🔄 [lineAuth] URLパラメータ:', Object.fromEntries(url.searchParams.entries()));
            
            window.location.href = auth_url;
        } else {
            throw new Error('LINE認証URLが見つかりません');
        }
    } catch (error: any) {
        console.error('[lineAuth] Error:', error.message);
        console.error('[lineAuth] Error details:', error.response?.data);
        throw new Error('LINEログイン中にエラーが発生しました');
    }
}
