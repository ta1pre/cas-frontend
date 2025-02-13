// File: /middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "./middleware/authMiddleware";
import { tokenMiddlewareLogic } from "./middleware/tokenMiddleware";

export const config = {
    matcher: ["/p/:path*"], // `/p/*` のみミドルウェアを適用
};

export default async function middleware(request: NextRequest) {
    console.log("🚀 【middleware.ts】ミドルウェア開始");

    const { pathname } = request.nextUrl;
    console.log("📌 【middleware.ts】pathname:", pathname);

    // ✅ `/p` 以外ならミドルウェアをスキップ
    if (!pathname.startsWith("/p")) {
        console.log("⏭️ 【middleware.ts】 `/p` 以外のためスキップ");
        return NextResponse.next();
    }

    let token: string | null = null;
    try {
        console.log("🛠️ 【middleware.ts】 tokenMiddleware 実行");
        token = await tokenMiddlewareLogic(request);
        console.log("✅【middleware.ts】 tokenMiddleware 実行完了: ", token);

        if (!token) {
            console.warn("❌【middleware.ts】 token が取得できませんでした。リダイレクトします。");
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }

        console.log("🛠️ 【middleware.ts】 authMiddleware 実行");

        // ✅ `authMiddleware.ts` に `token` を直接渡す
        const authResponse = await authMiddleware(request, token);
        if (authResponse) return authResponse;
        console.log("✅【middleware.ts】 authMiddleware 実行完了");

    } catch (error) {
        console.error("❌【middleware.ts】 Middleware Error:", error);
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // ✅ 認証成功なら `token` をクッキーにセット
    const response = NextResponse.next();
    if (token) {
        response.cookies.set("token", token, {
            path: "/",
            secure: true,
            sameSite: "none",
            httpOnly: false,
            maxAge: 3600,
        });
        console.log("✅【middleware.ts】 最終レスポンスに token クッキーをセットしました");
    }

    return response;
}
