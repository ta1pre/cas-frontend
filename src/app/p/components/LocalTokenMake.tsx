"use client";

import { useEffect, useState } from "react";
import { extendRefreshToken } from "@/hooks/cookies/extend_refresh_token";

export default function LocalTokenMake({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const refresh = async () => {
            try {
                console.log("📡 `/extend_refresh_token` をリクエスト...");
                await extendRefreshToken();
                console.log("✅ トークンの更新成功");
            } catch (error) {
                console.error("❌ トークンの更新失敗:", error);
            } finally {
                setLoading(false); // ✅ `refresh` の完了後に `loading` を `false` にする
            }
        };

        refresh();
    }, []);

    if (loading) {
        return <p>トークンを更新中...</p>; // ✅ `loading` の間は何も表示しない
    }

    return <>{children}</>;
}
