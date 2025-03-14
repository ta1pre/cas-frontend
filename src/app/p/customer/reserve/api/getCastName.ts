// src/app/p/customer/points/api/getCastName.ts
import { fetchAPI } from "@/services/auth/axiosInterceptor";
import { CustomerCastResponse } from "./types";

export async function fetchCustomerCast(castId: number): Promise<CustomerCastResponse | null> {
    try {
        console.log("📡 `POST /api/v1/reserve/customer/cast` をリクエスト:", { cast_id: castId });

        const response = await fetchAPI("/api/v1/reserve/customer/cast", { cast_id: castId });

        console.log("✅ APIレスポンス:", response);
        return response;
    } catch (error: any) {
        if (error.response?.status === 404) {
            console.warn("⚠️ キャストが見つかりません");
            return null;
        }
        console.error("🚨 APIエラー:", error);
        return null;
    }
}
