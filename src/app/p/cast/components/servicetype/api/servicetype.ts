import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const BASE_URL = `${apiUrl}/api/v1/servicetype`;

/**
 * ✅ サービスタイプの型を定義
 */
interface ServiceType {
  id: number;
  name: string;
  weight: number;
  category: string;
  is_active: number;
  description: string | null; // ✅ `description` を含める
}

/**
 * ✅ サービスタイプ一覧を取得
 */
export const getAllServiceTypes = async (token: string): Promise<Record<string, ServiceType[]>> => {
  if (!token) {
    console.error("【service type list】認証トークンがありません");
    throw new Error("認証トークンがありません");
  }

  try {
    const response = await axios.post(`${BASE_URL}/list`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.info("【service type list】APIレスポンス:", response.data);
    return response.data;
  } catch (error) {
    console.error("【service type list】APIリクエスト失敗", error);
    throw error;
  }
};



/**
 * ✅ キャストの選択済みサービスタイプを取得
 */
export const getSelectedServiceTypes = async (token: string, castId: number): Promise<number[]> => {
  if (!token) {
    console.error("【getSelectedServiceTypes】認証トークンがありません");
    throw new Error("認証トークンがありません");
  }

  try {
    const response = await axios.post(`${BASE_URL}/selected`, { cast_id: castId }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.info("【getSelectedServiceTypes】APIレスポンス:", response.data);
    return response.data;
  } catch (error) {
    console.error("【getSelectedServiceTypes】APIリクエスト失敗", error);
    throw error;
  }
};

/**
 * ✅ サービスタイプを登録
 */
export const registerServiceTypes = async (token: string, castId: number, serviceTypeIds: number[]): Promise<void> => {
  if (!token) {
    console.error("【registerServiceTypes】認証トークンがありません");
    throw new Error("認証トークンがありません");
  }

  await axios.post(`${BASE_URL}/register`, { cast_id: castId, service_type_ids: serviceTypeIds }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

/**
 * ✅ サービスタイプを削除
 */
export const deleteServiceTypes = async (token: string, castId: number, serviceTypeIds: number[]): Promise<void> => {
  if (!token) {
    console.error("【deleteServiceTypes】認証トークンがありません");
    throw new Error("認証トークンがありません");
  }

  await axios.post(`${BASE_URL}/delete`, { cast_id: castId, service_type_ids: serviceTypeIds }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
