// components/LocalTokenMake.tsx
"use client";
import { useEffect } from "react";
import { extendRefreshToken } from "@/hooks/cookies/extend_refresh_token";

export default function LocalTokenMake({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const refresh = async () => {
            try {
                console.log("📡 `/extend_refresh_token` をリクエスト...");
                await extendRefreshToken();
                console.log("✅ トークンの更新成功");
            } catch (error) {
                console.error("❌ トークンの更新失敗:", error);
            }
        };

        refresh();
    }, []);

    return <>{children}</>;
}
