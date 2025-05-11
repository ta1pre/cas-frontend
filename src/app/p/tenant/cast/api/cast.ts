import { fetchAPI } from '@/services/auth/axiosInterceptor';

export interface Cast {
  id: number;
  name: string;
  tenant: number;
}

interface CreateCastData {
  nick_name: string;
}

// プロフィール項目を共通型として定義
export interface CastProfile {
  name: string;
  age?: number;
  height?: number;
  bust?: number;
  cup?: string;
  waist?: number;
  hip?: number;
  birthplace?: string;
  blood_type?: string;
  hobby?: string;
  self_introduction?: string;
  job?: string;
  dispatch_prefecture?: string;
  support_area?: string;
  reservation_fee_deli?: number;
  is_active?: number;
  cast_type?: string;
  station_name?: string; // 最寄り駅名用プロパティを追加
}

// 新規・編集どちらもこの型でOK
export interface SaveCastData {
  cast_id?: number; // 新規時はundefined、編集時はid
  cast: CastProfile;
}

export const createCast = async (nick_name: string): Promise<Cast> => {
  const response = await fetchAPI('/api/v1/tenants/cast/create', { nick_name }, 'POST');
  
  // レスポンスがCast型のオブジェクトか確認
  if (response && typeof response === 'object' && 'id' in response) {
    return response;
  }
  
  console.error('無効なAPIレスポンス形式:', response);
  throw new Error('登録に失敗しました: 無効なレスポンス形式');
};

export const saveCast = async (data: SaveCastData): Promise<Cast> => {
  const response = await fetchAPI('/api/v1/tenants/cast/create', data, 'POST');
  if (!response || !('id' in response)) {
    throw new Error('登録に失敗しました');
  }
  return response;
};

// 所属キャスト一覧取得API（ダミー実装）
export const fetchCasts = async (): Promise<Cast[]> => {
  try {
    const res = await fetchAPI('/api/v1/tenants/cast/casts', {}, 'POST');
    console.log('キャスト一覧APIレスポンス:', res);
    
    // APIレスポンスの形式をチェック
    if (Array.isArray(res)) {
      // resが配列の場合
      return res;
    } else if (res?.data && Array.isArray(res.data)) {
      // res.dataが配列の場合
      return res.data;
    } else {
      console.warn('予u671fu3057u306au3044u30ecスポンスu5f62式:', res);
      return [];
    }
  } catch (e) {
    console.error('キャスト一覧取得エラー', e);
    return [];
  }
};
