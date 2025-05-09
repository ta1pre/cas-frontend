import { fetchAPI } from '@/services/auth/axiosInterceptor';

export type Invitee = {
  display_number: number;
  total_earned_point: number;
  created_at: string;
};

export const getInvitees = async (): Promise<Invitee[]> => {
  try {
    const res = await fetchAPI("/api/v1/referral/invitees", undefined, "GET");
    if (!res) return [];
    return res;
  } catch (e) {
    console.error('紹介者リストの取得に失敗しました', e);
    return [];
  }
};
