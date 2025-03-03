// src/app/p/customer/search/hooks/useUserPrefecture.ts

import { useEffect, useState } from "react";
import { fetchAPI } from "@/services/auth/axiosInterceptor";

export function useUserPrefecture(userId: number | null) {
    const [prefecture, setPrefecture] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUserPrefecture() {
            if (!userId) {
                console.warn("⚠️ `useUserPrefecture` に `null` の `userId` が渡されました。API リクエストをスキップ");
                setLoading(false);
                return;
            }

            console.log("✅ `useUserPrefecture` で `POST /api/v1/customer/search/user/prefecture` を実行", { user_id: userId });
            try {
                const response = await fetchAPI("/api/v1/customer/search/user/prefecture", { user_id: userId });

                if (response?.prefecture !== undefined) {
                    setPrefecture(response.prefecture);
                    console.log("✅ 取得した都道府県ID:", response.prefecture);
                } else {
                    setError("都道府県の取得に失敗しました。");
                    console.warn("⚠️ API から `prefecture` のデータが取得できませんでした。レスポンス:", response);
                }
            } catch (err) {
                console.error("🚨 都道府県の取得エラー:", err);
                setError("都道府県の取得に失敗しました。");
            } finally {
                setLoading(false);
            }
        }

        fetchUserPrefecture();
    }, [userId]);

    return { prefecture, loading, error };
}
