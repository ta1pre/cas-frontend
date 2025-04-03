import { useState, useEffect } from "react";
import { fetchAPI } from "@/services/auth/axiosInterceptor";

// コース情報の型定義
export interface Course {
  course_name: string;
  duration: number;
  cost: number;
  course_type: number;
  course_points: number;
  reservation_fee: number;
}

// キャスト情報の型定義
interface CastInfo {
  cast_id: number;
  name?: string;
  reservation_fee?: number;
  reservation_fee_deli?: number;
}

// コースタイプの名前マッピング
export const courseTypeNames: { [key: number]: string } = {
  1: "通常コース",
  2: "SPコース"
};

// コース選択のカスタムフック
export default function useCourseSelection(castId: number) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [castInfo, setCastInfo] = useState<CastInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // コースをIDで検索する関数
  const findCourseById = (id: string): Course | null => {
    if (!id) return null;
    const [name, duration, type] = id.split("-");
    return courses.find(
      (c) => c.course_name === name && c.duration === parseInt(duration) && c.course_type === parseInt(type)
    ) || null;
  };

  // キャスト情報を取得する関数
  const fetchCastInfo = async (id: number) => {
    try {
      // キャスト情報を取得するAPIを呼び出し
      console.log("📡 `POST /api/v1/customer/castprof/` をリクエスト:", { cast_id: id });
      const response = await fetchAPI("/api/v1/customer/castprof/", { cast_id: id });
      console.log("✅ キャスト情報APIレスポンス:", response);
      
      if (response) {
        setCastInfo(response);
        return response;
      }
      return null;
    } catch (err) {
      console.error("🚨 キャスト情報取得エラー:", err);
      setError("キャスト情報の取得に失敗しました");
      return null;
    }
  };

  // コースを取得する関数
  const fetchCourses = async (id: number) => {
    try {
      // コース情報を取得するAPIを呼び出し
      console.log("📡 `POST /api/v1/reserve/customer/get_courses` をリクエスト:", { cast_id: id });
      const response = await fetchAPI("/api/v1/reserve/customer/get_courses", { cast_id: id });
      console.log("✅ コース情報APIレスポンス:", response);
      
      if (response && Array.isArray(response)) {
        // APIから返されたコースデータをそのまま使用
        return response;
      }
      return [];
    } catch (err) {
      console.error("🚨 コース取得エラー:", err);
      setError("コースの取得に失敗しました");
      return [];
    }
  };

  // コースをタイプごとにグループ化する関数
  const groupCoursesByType = () => {
    const grouped: { [key: number]: Course[] } = {};
    
    courses.forEach(course => {
      if (!grouped[course.course_type]) {
        grouped[course.course_type] = [];
      }
      grouped[course.course_type].push(course);
    });
    
    return grouped;
  };

  // データを取得する副作用
  useEffect(() => {
    // サーバーサイドレンダリング時は実行しない
    if (typeof window === 'undefined') return;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // キャスト情報を取得
        const castData = await fetchCastInfo(castId);
        
        // コース情報を取得
        const courseData = await fetchCourses(castId);
        
        // APIから返されたコースデータをそのまま設定
        if (courseData) {
          setCourses(courseData);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("🚨 データ取得エラー:", err);
        setError("データの取得に失敗しました");
        setLoading(false);
      }
    };
    
    fetchData();
  }, [castId]);

  return {
    courses,
    castInfo,
    loading,
    error,
    findCourseById,
    groupCoursesByType
  };
}
