// File: /src/middleware/authMiddleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export async function authMiddleware(request: NextRequest, token: string): Promise<NextResponse | void> {
    // ✅ `token` は `middleware.ts` から渡される
    console.log(`【authMiddleware.ts】🔍 受け取ったトークン: ${token ? token.slice(0, 20) + "..." : "なし"}`);

    if (!token) {
        console.log("【authMiddleware.ts】🔄 Redirecting to /auth/login (No Token)");
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    try {
        console.log("【authMiddleware.ts】🔍 トークンの検証を開始");

        const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));

        if (!payload.sub) {
            console.log("【authMiddleware.ts】⛔ Invalid Token: Missing user_id");
            return NextResponse.redirect(new URL("/auth/login", request.url));
        }

        console.log(`✅【authMiddleware.ts】 Token Validated - User ID: ${payload.sub}`);
    } catch (error) {
        console.error("【authMiddleware.ts】⛔ JWT Verification Error:", error);
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }
}
