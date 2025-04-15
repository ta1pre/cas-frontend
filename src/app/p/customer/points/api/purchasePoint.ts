// src/app/p/customer/points/api/purchasePoint.ts

import { fetchAPI } from "@/services/auth/axiosInterceptor";

/**
 * ✅ ポイント購入API（一時的にコメントアウト）
 * Stripe決済導入後は、createPaymentIntentとconfirmPaymentに置き換え予定
 */
export default async function purchasePoint(amount: number) {
    // ✅ 一時的に実装をコメントアウト
    console.warn('ポイント購入機能は現在準備中です。Stripe決済を導入予定です。');
    return null;
    
    /*
    const user = globalThis.user ?? null;

    if (!user || !user.userId) {
        console.error("🚨 ユーザーがログインしていません");
        return null;
    }

    const userId = user.userId;
    console.log("✅ `purchasePoint()` - 送信データ:", { user_id: userId, amount });

    try {
        const response = await fetchAPI("/api/v1/points/purchase", {
            user_id: userId,
            amount
        });

        console.log("✅ APIレスポンス:", response);
        return response;
    } catch (error: any) {
        console.error("🚨 APIエラー:", error);
        return null;
    }
    */
}

/**
 * ✅ Stripe決済用の関数（実装予定）
 * PaymentIntentを作成する関数
 */
export async function createPaymentIntent(pointAmount: number) {
    console.warn('決済情報作成機能は現在準備中です。');
    return null;
    // TODO: Stripe PaymentIntent作成の実装
}

/**
 * ✅ Stripe決済用の関数（実装予定）
 * 決済を確定する関数
 */
export async function confirmPayment() {
    console.warn('決済確定機能は現在準備中です。');
    return false;
    // TODO: Stripe決済確定の実装
}
