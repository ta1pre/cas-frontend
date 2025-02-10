import { NextRequest, NextResponse } from "next/server";
import { tokenMiddleware } from "./middleware/tokenMiddleware";
import { authMiddleware } from "./middleware/authMiddleware";

export const config = {
    matcher: ["/p/:path*"], // ✅ `/auth/*` は Middleware の対象から外す
};

// ✅ `export default` を追加
export default async function middleware(request: NextRequest) {
    console.log("🚀 [middleware.ts] ミドルウェアエントリー");

    const { pathname } = request.nextUrl;

    // ✅ 無限ループ防止: `/auth/*` のページでは Middleware をスキップ
    if (pathname.startsWith("/auth")) {
        console.log("⏩ [middleware.ts] `/auth/*` はスキップ");
        return NextResponse.next();
    }

    try {
        // 1️⃣ トークン管理 & リフレッシュ
        await tokenMiddleware(); // ✅ 単純に実行するだけ、リダイレクトしない

        // 2️⃣ JWT 認証チェック
        const authResponse = await authMiddleware(request);
        if (authResponse) return authResponse; // 認証エラーならリダイレクト
    } catch (error) {
        console.error("❌ [middleware.ts] Middleware Error:", error);
    }

    console.log("✅ [middleware.ts] All Middleware Passed");
    return NextResponse.next();
}
