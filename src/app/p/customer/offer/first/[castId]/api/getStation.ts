import { fetchAPI } from "@/services/auth/axiosInterceptor";
import { StationResponse } from "./types";

export async function fetchStation(userId: number, castId: number): Promise<StationResponse | null> {
    try {
        console.log("📡 `POST /api/v1/reserve/get_station` をリクエスト:", { user_id: userId, cast_id: castId });

        const response = await fetchAPI("/api/v1/reserve/customer/get_station", { user_id: userId, cast_id: castId });

        console.log("✅ APIレスポンス:", response);
        return response;
    } catch (error: any) {
        console.error("🚨 APIエラー:", error);
        return null;
    }
}
