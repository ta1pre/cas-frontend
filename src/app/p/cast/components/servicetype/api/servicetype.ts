import axios from "axios";
import { fetchAPI } from "@/services/auth/axiosInterceptor";

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

  // fetchAPI はグローバル token を使うため事前にセット
  globalThis.user = { 
    token,
    userId: globalThis.user?.userId || 0,
    userType: globalThis.user?.userType || null,
    affiType: globalThis.user?.affiType || null
  };

  const data = await fetchAPI("/api/v1/servicetype/list", {});
  return data as Record<string, ServiceType[]>;
};

/**
 * ✅ キャストの選択済みサービスタイプを取得
 */
export const getSelectedServiceTypes = async (token: string, castId: number): Promise<number[]> => {
  if (!token) {
    console.error("【getSelectedServiceTypes】認証トークンがありません");
    throw new Error("認証トークンがありません");
  }

  globalThis.user = { 
    token,
    userId: globalThis.user?.userId || 0,
    userType: globalThis.user?.userType || null,
    affiType: globalThis.user?.affiType || null
  };

  const data = await fetchAPI("/api/v1/servicetype/selected", { cast_id: castId });
  return data as number[];
};

/**
 * ✅ サービスタイプを登録
 */
export const registerServiceTypes = async (token: string, castId: number, serviceTypeIds: number[]): Promise<void> => {
  if (!token) {
    console.error("【registerServiceTypes】認証トークンがありません");
    throw new Error("認証トークンがありません");
  }

  globalThis.user = { 
    token,
    userId: globalThis.user?.userId || 0,
    userType: globalThis.user?.userType || null,
    affiType: globalThis.user?.affiType || null
  };
  await fetchAPI("/api/v1/servicetype/register", { cast_id: castId, service_type_ids: serviceTypeIds });
};

/**
 * ✅ サービスタイプを削除
 */
export const deleteServiceTypes = async (token: string, castId: number, serviceTypeIds: number[]): Promise<void> => {
  if (!token) {
    console.error("【deleteServiceTypes】認証トークンがありません");
    throw new Error("認証トークンがありません");
  }

  globalThis.user = { 
    token,
    userId: globalThis.user?.userId || 0,
    userType: globalThis.user?.userType || null,
    affiType: globalThis.user?.affiType || null
  };
  await fetchAPI("/api/v1/servicetype/delete", { cast_id: castId, service_type_ids: serviceTypeIds });
};
