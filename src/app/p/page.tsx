"use client";
import Link from 'next/link';
import { useEffect } from "react";
import { extendRefreshToken } from "@/hooks/cookies/extend_refresh_token";

export default function DashboardPage() {
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

    return (
        <div>
            <h1>ダッシュボード</h1>
            <h3>📌 他のページへ移動</h3>
            <ul>
                <li><Link href="/p/cast">キャストのページ</Link></li>
                <li>↑タップ</li>
            </ul>
        </div>
    );
}
