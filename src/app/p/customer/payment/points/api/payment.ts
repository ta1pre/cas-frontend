import { fetchAPI } from '@/services/auth/axiosInterceptor'; // fetchAPIのパスを修正

/**
 * Stripe Checkout セッションを作成するためのAPIリクエスト
 * @param priceId - Stripeの商品価格ID
 * @returns CheckoutセッションのURLを含むオブジェクト、またはエラー時null
 */
export const createCheckoutSession = async (
  priceId: string
): Promise<{ checkout_url: string } | null> => {
  const endpoint = '/api/v1/customer/payments/create-checkout-session';
  const data = { price_id: priceId };

  try {
    const response = await fetchAPI(endpoint, data);
    // fetchAPIはエラー時にnullを返す想定
    if (!response || typeof response.checkout_url !== 'string') { 
      console.error('Checkoutセッションの作成に失敗しました。(APIエラーまたは無効なレスポンス)');
      return null;
    }
    return response; // 成功時は { checkout_url: "..." } を返す
  } catch (error) {
    // fetchAPI内でcatchされなかった予期せぬエラー
    console.error('Checkoutセッション作成中に予期せぬエラー:', error);
    return null;
  }
};
