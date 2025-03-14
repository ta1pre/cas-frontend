// src/app/p/customer/offer/first/[castId]/api/fetchCourses.ts
import { fetchAPI } from "@/services/auth/axiosInterceptor";

export interface Course {
    course_name: string;
    duration: number;
    cost: number;
    course_type: number;
}

// `castId` を受け取ってコースを取得するAPI
export async function fetchCourses(castId: number): Promise<Course[] | null> {
    try {
        console.log("📡 `POST /api/v1/reserve/customer/get_courses` をリクエスト:", { cast_id: castId });

        const response = await fetchAPI("/api/v1/reserve/customer/get_courses", { cast_id: castId });

        console.log("✅ APIレスポンス:", response);
        return response;
    } catch (error: any) {
        console.error("🚨 APIエラー:", error);
        return null;
    }
}
