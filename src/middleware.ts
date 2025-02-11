// File: /middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "./middleware/authMiddleware"; // ✅ named export
import tokenMiddleware from "./middleware/tokenMiddleware";  // ✅ default export

export const config = {
    matcher: ["/p/:path*"], // `/auth/*` は Middleware の対象から外す
};

export default async function middleware(request: NextRequest) {
    console.log("🚀 [middleware.ts] ミドルウェア開始");

    const { pathname } = request.nextUrl;
    console.log("📌 [middleware.ts] pathname:", pathname);

    // `/auth/*` では Middleware をスキップ
    if (pathname.startsWith("/auth")) {
        return NextResponse.next();
    }

    try {
        console.log("🛠️ [middleware.ts] tokenMiddleware 実行");

        // ✅ `tokenMiddleware` を実行し、レスポンスを取得
        const tokenResponse = tokenMiddleware(request);

        // `tokenMiddleware` が `NextResponse` を返した場合、そのまま返す
        if (tokenResponse) return tokenResponse; 

        console.log("✅ [middleware.ts] tokenMiddleware 実行完了");

        console.log("🛠️ [middleware.ts] authMiddleware 実行");

        // ✅ `authMiddleware` を実行し、レスポンスを取得
        const authResponse = authMiddleware(request);

        // `authMiddleware` が `NextResponse` を返した場合、そのまま返す
        if (authResponse) return authResponse; 

        console.log("✅ [middleware.ts] authMiddleware 実行完了");

    } catch (error) {
        console.error("❌ [middleware.ts] Middleware Error:", error);
    }

    return NextResponse.next();
}
