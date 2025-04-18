import { fetchAPI } from "@/services/auth/axiosInterceptor";

/**
 * 任意の金額・ポイント数でPaymentIntentを作成するAPI
 * @param amount 支払い金額（円）
 * @param points 購入ポイント数
 * @returns PaymentIntentのclient_secret
 */
export async function createPaymentIntent(amount: number, points: number): Promise<{ client_secret: string } | null> {
  try {
    // APIリクエスト先をFastAPIの本物のエンドポイントに修正
    const res = await fetchAPI("/api/v1/customer/payments/create-payment-intent", { amount, points }, "POST");
    return res;
  } catch (e) {
    console.error("[createPaymentIntent]", e);
    return null;
  }
}
