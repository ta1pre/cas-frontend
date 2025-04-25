// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "./middleware/authMiddleware";
import { tokenMiddlewareLogic } from "./middleware/tokenMiddleware";
import { setupMiddleware } from "./middleware/setupMiddleware";

export const config = {
    matcher: [
        "/p/:path*",
        "/tenant/:path*" // /tenant配下も追加
    ],
};

export default async function middleware(request: NextRequest) {
    console.log("【middleware.ts】ミドルウェア開始");

    const { pathname } = request.nextUrl;
    console.log("【middleware.ts】 pathname:", pathname);

    // /tenant 直下（ログインページ）は認証ガードしない
    if (pathname === "/tenant") {
        return NextResponse.next();
    }

    // /tenant/* サブページは認証ガード
    if (pathname.startsWith("/tenant/")) {
        try {
            const token = await tokenMiddlewareLogic(request);
            console.log("【middleware.ts】 /tenant/*: 取得したtoken:", token);
            if (!token) {
                console.warn("【middleware.ts】 /tenant/*: トークンなし。ログインページへリダイレクト");
                return NextResponse.redirect(new URL("/tenant", request.url));
            }
            // 認証処理を追加
            const authResponse = await authMiddleware(request, token);
            if (authResponse) {
                console.warn("【middleware.ts】 /tenant/*: 認証失敗。リダイレクト");
                return authResponse; // 認証失敗時はリダイレクト
            }
            // 認証成功時はクッキーにトークンを再セット
            const response = NextResponse.next();
            response.cookies.set("token", token, {
                path: "/",
                secure: false, // 本番はtrue
                sameSite: "lax",
                httpOnly: false,
                maxAge: 3600,
            });
            console.log("【middleware.ts】 /tenant/*: 認証成功、レスポンス返却");
            return response;
        } catch (error) {
            console.error("【middleware.ts】 /tenant/*: エラー発生:", error);
            return NextResponse.redirect(new URL("/tenant", request.url));
        }
    }

    // /p/以下は既存ロジックを維持
    if (!pathname.startsWith("/p")) {
        console.log(" `/p/` 以外のためスキップ");
        return NextResponse.next();
    }

    try {
        // トークン取得
        console.log("【middleware.ts】 トークン取得処理開始");
        const token = await tokenMiddlewareLogic(request);

        if (!token) {
            console.warn("【middleware.ts】 トークンなし。ログインページへリダイレクト");
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }
        console.log("【middleware.ts】 トークン取得成功");

        // 認証処理
        console.log("【middleware.ts】 認証チェック開始");
        const authResponse = await authMiddleware(request, token);

        if (authResponse) return authResponse;
        console.log("【middleware.ts】 認証成功");

        // 認証成功時にトークンをクッキーへセット
        const response = NextResponse.next();
        response.cookies.set("token", token, {
            path: "/",
            secure: false, // 本番はtrue
            sameSite: "lax", // ローカルはlaxでSafari対応
            httpOnly: false,
            maxAge: 3600,
        });

        console.log("【middleware.ts】 クッキーにトークンをセット");

        // 【重要】 setupMiddlewareを実行し、そのレスポンスを受け取る
        const setupResponse = await setupMiddleware(request);

        if (setupResponse) {
            // setupMiddlewareがレスポンスを返したら即座にreturnする（リダイレクト実行）
            console.log("【middleware.ts】 setupMiddlewareからレスポンスが返されたので、即座に返却します");
            return setupResponse;
        }

        // setupMiddlewareが何も返さなければ、処理を継続
        return response;

    } catch (error) {
        console.error("【middleware.ts】 エラー発生:", error);
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }
}
