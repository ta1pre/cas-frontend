/**
 * プロフィール関連のAPIフック
 */

import { useState } from 'react';
import { fetchAPI } from '@/services/auth/axiosInterceptor';

// プロフィール型定義
export interface ProfileData {
  cast_id?: number;
  rank_id?: number;
  cast_type?: string;
  name?: string;
  age?: number | string;
  height?: number | string;
  bust?: number | string;
  cup?: string;
  waist?: number | string;
  hip?: number | string;
  birthplace?: string;
  blood_type?: string;
  hobby?: string;
  reservation_fee?: number | string;
  self_introduction?: string;
  job?: string;
  dispatch_prefecture?: string | number;
  support_area?: string;
  popularity?: number;
  rating?: number;
  is_active?: number;
  available_at?: string;
  created_at?: string;
  updated_at?: string;
  station_name?: string;
}

/**
 * プロフィール関連のAPI操作を行うカスタムフック
 */
export const useProfileApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * プロフィール情報を取得する
   */
  const fetchProfile = async (): Promise<ProfileData> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchAPI('/api/v1/cast/prof/get', {}, 'POST');
      
      // 駅名の処理（"駅ID:"が含まれる場合は取り除く）
      if (response.station_name && response.station_name.includes('駅ID:')) {
        response.station_name = response.station_name.replace('駅ID:', '').trim();
      }
      
      return response;
    } catch (error: any) {
      console.error('プロフィール取得エラー:', error);
      const errorMessage = error?.response 
        ? `プロフィール取得に失敗しました: ${error.response.status} ${error.response.statusText}`
        : 'プロフィール取得に失敗しました';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * プロフィール情報を更新する
   * @param profileData 更新するプロフィールデータ
   */
  const updateProfile = async (profileData: ProfileData): Promise<ProfileData> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchAPI('/api/v1/cast/prof/update', profileData, 'POST');
      return response;
    } catch (error: any) {
      console.error('プロフィール更新エラー:', error);
      const errorMessage = error?.response
        ? `プロフィール更新に失敗しました: ${error.response.status} ${error.response.statusText}`
        : 'プロフィール更新に失敗しました';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchProfile,
    updateProfile,
    loading,
    error
  };
};

export default useProfileApi;