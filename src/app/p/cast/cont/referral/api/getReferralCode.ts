import { fetchAPI } from '@/services/auth/axiosInterceptor';

/**
 * 紹介コード（invitation_id）を取得するAPI
 * @returns invitation_id（文字列）
 */
export const getReferralCode = async (): Promise<string> => {
  try {
    const res = await fetchAPI('/api/v1/referral/get_code');
    return res?.invitation_id || '';
  } catch (e) {
    console.error('紹介コード取得に失敗', e);
    return '';
  }
};
