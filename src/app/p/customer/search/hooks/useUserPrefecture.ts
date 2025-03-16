import { useEffect, useState } from "react";
import { fetchAPI } from "@/services/auth/axiosInterceptor";

export function useUserPrefecture(userId: number | null) {
    const [prefecture, setPrefecture] = useState<number | null>(null);
    const [prefectureName, setPrefectureName] = useState<string | null>(null); // ✅ 県名も保存
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUserPrefecture() {
            if (!userId) {
                console.warn("⚠️ `useUserPrefecture` に `null` の `userId` が渡されました。API リクエストをスキップ");
                setLoading(false);
                return;
            }

            try {
                console.log("✅ `useUserPrefecture` で `POST /api/v1/customer/search/user/prefecture` を実行", { user_id: userId });

                const response = await fetchAPI("/api/v1/customer/search/user/prefecture", { user_id: userId });

                console.log("✅ 【API レスポンス】:", response);

                // 🚨 `prefecture_id` の処理（既存のもの）
                const normalizedPrefecture = typeof response?.prefecture_id === "string"
                    ? parseInt(response.prefecture_id, 10) || null
                    : typeof response?.prefecture_id === "number"
                    ? response.prefecture_id
                    : null;

                // 🚨 `prefecture_name` の処理（新規追加）
                const normalizedPrefectureName = typeof response?.prefecture_name === "string"
                    ? response.prefecture_name
                    : null;

                console.log("✅ 【最終的な都道府県ID】:", normalizedPrefecture);
                console.log("✅ 【最終的な都道府県名】:", normalizedPrefectureName);

                setPrefecture(normalizedPrefecture);
                setPrefectureName(normalizedPrefectureName);
            } catch (err) {
                console.error("🚨 都道府県の取得エラー:", err);
                setError("都道府県の取得に失敗しました。");
            } finally {
                setLoading(false);
            }
        }

        fetchUserPrefecture();
    }, [userId]);

    return { prefecture, prefectureName, loading, error }; // ✅ `prefectureName` も返す
}
