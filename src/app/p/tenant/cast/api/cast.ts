import { Cast } from '../types/castTypes';
import { fetchAPI } from '@/services/auth/axiosInterceptor';

// 所属キャスト一覧取得API（ダミー実装）
export const fetchCasts = async (): Promise<Cast[]> => {
  try {
    const res = await fetchAPI('/api/v1/tenants/cast/casts', {}, 'POST');
    console.log('キャスト一覧APIレスポンス:', res);
    
    // APIu30ecu30b9u30ddンスu306eu69cbu9020u306bu5bfeu5fdcすu308bためu306eu30c1ェック
    if (Array.isArray(res)) {
      // resu81eau4f53u304cu914du5217u306eu5834u5408
      return res;
    } else if (res?.data && Array.isArray(res.data)) {
      // res.datau304cu914du5217u306eu5834u5408
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
