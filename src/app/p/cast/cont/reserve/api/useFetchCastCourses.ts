// 📂 src/app/p/cast/cont/reserve/api/useFetchCastCourses.ts

import { fetchAPI } from "@/services/auth/axiosInterceptor";
import { useCallback } from 'react';

/**
 * コース情報レスポンスの型定義
 */
export interface CourseResponse {
  id: number;
  course_name: string;
  description: string | null;
  duration_minutes: number;
  cast_reward_points: number;
  course_type: number;
}

/**
 * キャストのコース一覧を取得するAPI関数
 * @param castId キャストID
 * @returns コース一覧
 */
export const fetchCastCourses = async (castId: number) => {
  try {
    const response = await fetchAPI("/api/v1/reserve/cast/courses", {
      cast_id: castId
    });
    
    console.log("✅ コース一覧取得成功:", response);
    return response.courses as CourseResponse[];
  } catch (error) {
    console.error("🔴 コース一覧取得エラー:", error);
    throw error;
  }
};

/**
 * 全てのアクティブなコース一覧を取得するAPI関数
 * @returns 全コース一覧
 */
export const fetchAllCourses = async () => {
  try {
    const response = await fetchAPI("/api/v1/reserve/cast/all-courses", {});
    
    console.log("✅ 全コース一覧取得成功:", response);
    return response.courses as CourseResponse[];
  } catch (error) {
    console.error("🔴 全コース一覧取得エラー:", error);
    throw error;
  }
};

/**
 * キャストタイプに基づいてフィルタリングされたコース一覧を取得するAPI関数
 * @param castId キャストID（オプション）
 * @returns フィルタリングされたコース一覧
 */
export const fetchFilteredCourses = async (castId?: number) => {
  try {
    const payload = castId ? { cast_id: castId } : {};
    const response = await fetchAPI("/api/v1/reserve/cast/filtered-courses", payload);
    
    console.log("✅ フィルタリングコース一覧取得成功:", response);
    return response.courses as CourseResponse[];
  } catch (error) {
    console.error("🔴 フィルタリングコース一覧取得エラー:", error);
    throw error;
  }
};

/**
 * キャストのコース一覧を取得するフック
 */
export const useFetchCastCourses = (castId: number) => {
  const fetchCoursesCallback = useCallback(async () => {
    return fetchCastCourses(castId);
  }, [castId]);

  return fetchCoursesCallback;
};

/**
 * 全てのアクティブなコース一覧を取得するフック
 */
export const useFetchAllCourses = () => {
  const fetchAllCoursesCallback = useCallback(async () => {
    return fetchAllCourses();
  }, []);

  return fetchAllCoursesCallback;
};

/**
 * キャストタイプに基づいてフィルタリングされたコース一覧を取得するフック
 */
export const useFetchFilteredCourses = (castId?: number) => {
  const fetchFilteredCoursesCallback = useCallback(async () => {
    return fetchFilteredCourses(castId);
  }, [castId]);

  return fetchFilteredCoursesCallback;
};
