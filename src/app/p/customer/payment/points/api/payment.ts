import { fetchAPI } from '@/services/auth/axiosInterceptor';

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
    if (!response || typeof response.checkout_url !== 'string') { 
      console.error('Checkoutセッションの作成に失敗しました。(APIエラーまたは無効なレスポンス)');
      return null;
    }
    return response; 
  } catch (error) {
    console.error('Checkoutセッション作成中に予期せぬエラー:', error);
    return null;
  }
};
