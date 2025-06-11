import { fetchAPI } from "@/services/auth/axiosInterceptor";

/**
 * キャストプロフィール（cast_common_prof）を作成する
 * バックエンド側で user_id = cast_id として登録される
 */
export const createCastProfile = async (): Promise<void> => {
  await fetchAPI("/api/v1/setup/register", {});
};
