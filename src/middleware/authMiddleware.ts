// src/middleware/authMiddleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("❌ 環境変数 `JWT_SECRET` が設定されていません！");
}

export async function authMiddleware(request: NextRequest): Promise<NextResponse | void> {
    const token = request.cookies.get("token")?.value;

    if (!token) {
        console.warn("⚠️ トークンがないため、ログインページへリダイレクトします。");
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));

        if (!payload || !payload.sub) {
            console.warn("⛔ JWTが無効: `sub` がありません。");
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }

        console.log("✅ JWTが正常に検証されました。");
    } catch (error) {
        console.error("⛔ JWTの検証エラー:", error);
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }
}
