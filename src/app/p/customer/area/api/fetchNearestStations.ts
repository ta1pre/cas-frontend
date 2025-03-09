import { fetchAPI } from "@/services/auth/axiosInterceptor"; // ✅ API通信用

export default async function fetchNearestStations(lat: number, lon: number) {
    // ✅ `globalThis.user` から `user_id` を取得
    const user = globalThis.user ?? null;

    if (!user || !user.userId) {
        console.error("🚨 ユーザーがログインしていません");
        return [];
    }

    const userId = user.userId;
    console.log("📡 `POST /api/v1/customer/area/station/nearest` をリクエスト:", { user_id: userId, lat, lon });

    try {
        const response = await fetchAPI("/api/v1/customer/area/station/nearest", {
            user_id: userId,
            lat,
            lon,
        });

        console.log("✅ APIレスポンス:", response);
        return response.map((station: any) => ({
            id: station.id,
            name: station.name,
            lineName: station.line_name, // ✅ 追加：路線名
            distanceKm: station.distance_km,
        }));
    } catch (error: any) {
        console.error("🚨 APIエラー:", error);
        return [];
    }
}
