import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const BASE_URL = `${apiUrl}/api/v1/traits/traits`;

/**
 * ✅ ` /list`（特徴リスト取得API）
 */
export const getAllTraits = async (token: string): Promise<Record<string, { id: number; name: string; weight: number; category: string; is_active: number }[]>> => {
  if (!token) {
    console.error("【traits list】認証トークンがありません");
    throw new Error("認証トークンがありません");
  }

  try {
    const response = await axios.post<Record<string, { id: number; name: string; weight: number; category: string; is_active: number }[]>>(`${BASE_URL}/list`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.info("【traits list】APIレスポンス:", response.data);
    return response.data; // ✅ カテゴリごとに整理されたデータを返す
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("【traits list】APIリクエスト失敗", error.response?.data || error.message);
    } else {
      console.error("【traits list】予期しないエラー", error);
    }
    throw error;
  }
};

/**
 * ✅ 選択されている特徴取得
 */
export const getSelectedTraits = async (token: string, castId: number): Promise<number[]> => {
  if (!token) {
    console.error("【getSelectedTraits】認証トークンがありません");
    throw new Error("認証トークンがありません");
  }

  try {
    const response = await axios.post<number[]>(`${BASE_URL}/selected`, { cast_id: castId }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.info("【getSelectedTraits】APIレスポンス:", response.data);
    return response.data; // ✅ 選択されている特徴の ID のリストを返す
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("【getSelectedTraits】APIリクエスト失敗", error.response?.data || error.message);
    } else {
      console.error("【getSelectedTraits】予期しないエラー", error);
    }
    throw error;
  }
};

/**
 * ✅ キャストの特徴を登録
 */
export const registerTraits = async (token: string, castId: number, traitIds: number[]): Promise<void> => {
  if (!token) {
    console.error("【registerTraits】認証トークンがありません");
    throw new Error("認証トークンがありません");
  }

  await axios.post(`${BASE_URL}/register`, { cast_id: castId, trait_ids: traitIds }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

/**
 * ✅ キャストの特徴を削除
 */
export const deleteTraits = async (token: string, castId: number, traitIds: number[]): Promise<void> => {
  if (!token) {
    console.error("【deleteTraits】認証トークンがありません");
    throw new Error("認証トークンがありません");
  }

  await axios.post(`${BASE_URL}/delete`, { cast_id: castId, trait_ids: traitIds }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

/**
 * ✅ `POST /hello`（テスト用API）
 */
export const sayHello = async (token: string): Promise<string> => {
  if (!token) {
    console.error("【hello】認証トークンがありません");
    throw new Error("認証トークンがありません");
  }

  try {
    const response = await axios.post(`${BASE_URL}/hello`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.info("【hello】APIレスポンス:", response.data);
    return response.data.message;
  } catch (error) {
    console.error("【hello】APIリクエスト失敗", error);
    throw error;
  }
};
