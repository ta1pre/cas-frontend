// 📂 src/app/p/cast/cont/reserve/api/useFetchCastCourses.ts

import { fetchAPI } from "@/services/auth/axiosInterceptor";

/**
 * コース情報レスポンスの型定義
 */
export interface CourseResponse {
  id: number;
  course_name: string;
  description: string;
  duration_minutes: number;
  cast_reward_points: number;
  course_type: number;
}

/**
 * コースタイプの名前マッピング
 */
export const courseTypeNames: { [key: number]: string } = {
  1: "通常コース",
  2: "SPコース"
};

/**
 * コースをタイプごとにグループ化する関数
 */
export const groupCoursesByType = (courses: CourseResponse[]) => {
  const grouped: { [key: number]: CourseResponse[] } = {};
  
  courses.forEach(course => {
    if (!grouped[course.course_type]) {
      grouped[course.course_type] = [];
    }
    grouped[course.course_type].push(course);
  });
  
  return grouped;
};

/**
 * キャストのコース一覧を取得するAPI関数
 * @param castId キャストID
 * @returns コース一覧
 */
export const fetchCastCourses = async (castId: number) => {
  try {
    console.log(`🔍 コース取得API実行中: castId=${castId}`);
    
    // filtered-coursesエンドポイントを使用してコースを取得
    // このエンドポイントはキャストタイプに基づいてフィルタリングされたコース一覧を返す
    const response = await fetchAPI("/api/v1/reserve/cast/filtered-courses", {
      cast_id: castId
    });
    
    console.log('✔️ コース取得API成功:', response);
    
    if (response && response.courses) {
      console.log(`📊 取得コース数: ${response.courses.length}件`);
      
      // コースタイプごとに整理
      const groupedCourses = groupCoursesByType(response.courses);
      console.log('📊 コースタイプごとのグループ:', groupedCourses);
      
      response.courses.forEach((course: CourseResponse, index: number) => {
        console.log(`📊 コース[${index+1}]: ID=${course.id}, コース名=${course.course_name}, コースタイプ=${courseTypeNames[course.course_type]}, 時間=${course.duration_minutes}分, マイレージ=${course.cast_reward_points}`);
        
        if (course.cast_reward_points === undefined || course.cast_reward_points === null || course.cast_reward_points === 0) {
          console.warn(`⚠️ 注意: コースID=${course.id}のマイレージポイントが${course.cast_reward_points}です。確認してください。`);
        }
      });
      
      return response.courses as CourseResponse[];
    } else {
      console.error('❌ コース取得APIレスポンス不正: courses配列が存在しません', response);
      throw new Error('コース情報取得失敗');
    }
  } catch (error) {
    console.error('❌ コース取得APIエラー:', error);
    throw error;
  }
};

/**
 * 全てのアクティブなコース一覧を取得するAPI関数
 * @returns 全コース一覧
 */
export const fetchAllCourses = async () => {
  try {
    console.log('🔍 全コース取得API実行中');
    
    const response = await fetchAPI("/api/v1/reserve/cast/all-courses", {});
    
    console.log('✔️ 全コース取得API成功:', response);
    
    if (response && response.courses) {
      console.log(`📊 取得コース数: ${response.courses.length}件`);
      
      // コースタイプごとに整理
      const groupedCourses = groupCoursesByType(response.courses);
      console.log('📊 コースタイプごとのグループ:', groupedCourses);
      
      response.courses.forEach((course: CourseResponse, index: number) => {
        console.log(`📊 コース[${index+1}]: ID=${course.id}, コース名=${course.course_name}, コースタイプ=${courseTypeNames[course.course_type]}, 時間=${course.duration_minutes}分, マイレージ=${course.cast_reward_points}`);
        
        if (course.cast_reward_points === 0) {
          console.warn(`⚠️ 注意: コースID=${course.id}のマイレージポイントが0です。確認してください。`);
        }
      });
      
      return response.courses as CourseResponse[];
    } else {
      console.error('❌ 全コース取得APIレスポンス不正: courses配列が存在しません', response);
      throw new Error('コース情報取得失敗');
    }
  } catch (error) {
    console.error('❌ 全コース取得APIエラー:', error);
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
    console.log(`🔍 フィルタリングコース取得API実行中: castId=${castId || 'なし'}`);
    
    const payload = castId ? { cast_id: castId } : {};
    const response = await fetchAPI("/api/v1/reserve/cast/filtered-courses", payload);
    
    console.log('✔️ フィルタリングコース取得API成功:', response);
    
    if (response && response.courses) {
      console.log(`📊 取得コース数: ${response.courses.length}件`);
      
      // コースタイプごとに整理
      const groupedCourses = groupCoursesByType(response.courses);
      console.log('📊 コースタイプごとのグループ:', groupedCourses);
      
      response.courses.forEach((course: CourseResponse, index: number) => {
        console.log(`📊 コース[${index+1}]: ID=${course.id}, コース名=${course.course_name}, コースタイプ=${courseTypeNames[course.course_type]}, 時間=${course.duration_minutes}分, マイレージ=${course.cast_reward_points}`);
        
        if (course.cast_reward_points === 0) {
          console.warn(`⚠️ 注意: コースID=${course.id}のマイレージポイントが0です。確認してください。`);
        }
      });
      
      return response.courses as CourseResponse[];
    } else {
      console.error('❌ フィルタリングコース取得APIレスポンス不正: courses配列が存在しません', response);
      throw new Error('コース情報取得失敗');
    }
  } catch (error) {
    console.error('❌ フィルタリングコース取得APIエラー:', error);
    throw error;
  }
};
