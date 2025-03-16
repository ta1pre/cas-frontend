// src/middleware/setupMiddleware.ts

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"; // ✅ APIのベースURL（環境変数から取得）

/**
 * セットアップ完了ステータスを確認するミドルウェア
 */
export async function setupMiddleware(request: NextRequest): Promise<NextResponse | void> {
    console.log("🚀 【setupMiddleware】セットアップ確認ミドルウェア実行");

    const { pathname } = request.nextUrl;
    console.log(`📌 【setupMiddleware】現在のパス: ${pathname}`);

    // ✅ `/p/setup` にいる場合はチェックをスキップ（無限ループ防止）
    if (pathname.startsWith("/p/setup")) {
        console.log("⏭️ 【setupMiddleware】 `/p/setup` はスキップ");
        return NextResponse.next();
    }

    try {
        // ✅ トークン取得
        const token = request.cookies.get("token")?.value;

        if (!token) {
            console.error("❌ 【setupMiddleware】 トークンなし。処理をスキップ");
            return NextResponse.next();
        }

        console.log("🔑 【setupMiddleware】トークン取得:", token.slice(0, 20) + "...");

        // ✅ `authMiddleware.ts` と同じ方法で `userId` を取得
        const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
        const userId = payload.sub;

        if (!userId) {
            console.error("❌ 【setupMiddleware】 ユーザーIDが取得できませんでした");
            return NextResponse.next();
        }

        console.log("👤 【setupMiddleware】ユーザーID取得成功:", userId);

        // ✅ 実際の `setup_status` を取得
        const setupStatus = await fetchSetupStatus(userId, token);

        if (setupStatus === null) {
            console.error("❌ 【setupMiddleware】 セットアップステータスの取得に失敗");
            return NextResponse.next();
        }

        console.log(`🔄 【setupMiddleware】取得した setup_status: ${setupStatus}`);

        // ✅ ステータスが `completed` 以外なら `/p/setup` にリダイレクト
        if (setupStatus !== "completed") {
            console.warn("🚨 【setupMiddleware】セットアップ未完了！ `/p/setup` にリダイレクト");
            return NextResponse.redirect(new URL("/p/setup", request.url));
        }

        console.log("✅ 【setupMiddleware】セットアップ完了！処理を継続");
        return NextResponse.next();

    } catch (error) {
        console.error("❌ 【setupMiddleware】エラー発生:", error);
        return NextResponse.next();
    }
}

/**
 * `setup_status` を取得する関数（実際の API を叩く）
 */
async function fetchSetupStatus(userId: string, token: string): Promise<string | null> {
    try {
        const url = `${API_BASE_URL}/api/v1/setup/status/setup_status/${userId}`;
        console.log(`📡 【setupMiddleware】 setup_status を取得: ${url}`);

        // ✅ 実際の API を叩く
        const response = await fetch(url, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            console.error(`🚨 【setupMiddleware】 APIエラー: ${response.status}`);
            return null;
        }

        const data = await response.json();
        return data.setup_status;

    } catch (error) {
        console.error("❌ 【setupMiddleware】 setup_status 取得エラー:", error);
        return null;
    }
}
