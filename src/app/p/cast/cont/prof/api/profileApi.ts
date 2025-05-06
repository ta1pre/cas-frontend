/**
 * プロフィールAPI関連の処理
 */

import { ProfileData } from './useProfileApi';
import { fetchAPI } from '@/services/auth/axiosInterceptor';

/**
 * プロフィール情報を取得するAPI
 */
export const fetchProfileApi = async (): Promise<ProfileData> => {
  try {
    // 認証付きPOSTリクエストでプロフィール取得
    const response = await fetchAPI('/api/v1/cast/prof/get');
    
    // 駅名の処理（「駅ID:」などの不要な文字列を削除）
    if (response.station_name && response.station_name.includes('駅ID:')) {
      response.station_name = response.station_name.replace('駅ID:', '').trim();
    }
    
    return response;  // fetchAPIはdata部分を返す
  } catch (error: any) {
    console.error('プロフィール取得エラー:', error);
    throw error;
  }
};

/**
 * プロフィール情報を更新するAPI
 */
export const updateProfileApi = async (profileData: ProfileData): Promise<any> => {
  try {
    const response = await fetchAPI('/api/v1/cast/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return response;
  } catch (error) {
    console.error('プロフィール更新エラー:', error);
    throw error;
  }
};
