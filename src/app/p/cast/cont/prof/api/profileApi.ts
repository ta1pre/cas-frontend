/**
 * プロフィールAPI関連の処理
 */

import { ProfileData } from './useProfileApi';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * プロフィール情報を取得するAPI
 */
export const fetchProfileApi = async (): Promise<ProfileData> => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/cast/profile`);
    
    // 駅名の処理（「駅ID:」などの不要な文字列を削除）
    if (response.data.station_name && response.data.station_name.includes('駅ID:')) {
      response.data.station_name = response.data.station_name.replace('駅ID:', '').trim();
    }
    
    // support_areaの値をdispatch_prefectureに設定（初期値として）
    if (response.data.support_area && (!response.data.dispatch_prefecture || response.data.dispatch_prefecture === '')) {
      console.log('APIレスポンスのsupport_area:', response.data.support_area);
      // 数値に変換可能な場合は数値として設定
      if (!isNaN(Number(response.data.support_area))) {
        response.data.dispatch_prefecture = Number(response.data.support_area);
      } else {
        response.data.dispatch_prefecture = response.data.support_area;
      }
      console.log('dispatch_prefectureに設定:', response.data.dispatch_prefecture);
    }
    
    return response.data;
  } catch (error) {
    console.error('プロフィール取得エラー:', error);
    throw error;
  }
};

/**
 * プロフィール情報を更新するAPI
 */
export const updateProfileApi = async (profileData: ProfileData): Promise<any> => {
  try {
    const response = await axios.put(`${API_URL}/api/v1/cast/profile`, profileData);
    return response.data;
  } catch (error) {
    console.error('プロフィール更新エラー:', error);
    throw error;
  }
};
