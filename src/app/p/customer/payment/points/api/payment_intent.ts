import { fetchAPI } from "@/services/auth/axiosInterceptor";

/**
 * 任意の金額・ポイント数でPaymentIntentを作成するAPI
 * @param amount 支払い金額（円）
 * @param points 購入ポイント数
 * @returns PaymentIntentのclient_secret
 */
export async function createPaymentIntent(amount: number, points: number): Promise<{ client_secret: string } | null> {
  try {
    // 毎回新しいPaymentIntentを作成するため、タイムスタンプを追加
    const timestamp = new Date().getTime();
    
    // APIリクエスト先をFastAPIの本物のエンドポイントに修正
    const res = await fetchAPI("/api/v1/customer/payments/create-payment-intent", { 
      amount, 
      points,
      timestamp // タイムスタンプを追加してキャッシュ回避
    }, "POST");
    
    console.log(`✅ PaymentIntent作成成功: 金額=${amount}円, ポイント=${points}P`);
    return res;
  } catch (e) {
    console.error("[createPaymentIntent] エラー:", e);
    return null;
  }
}
