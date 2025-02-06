// src/middleware.ts

import { NextRequest, NextResponse } from 'next/server';
import { authMiddleware } from './middleware/authMiddleware';
import { setupMiddleware } from './middleware/setupMiddleware';
import { publicMiddleware } from './middleware/publicMiddleware';
import { PUBLIC_PATHS, SETUP_SKIP_PATHS } from './middleware/paths';

export const config = {
    matcher: ['/p/:path*', '/auth/:path*', '/s/:path*'],
    runtime: 'experimental-edge',
};

export async function middleware(request: NextRequest) {
    console.log('🚀 [middleware.ts] Middleware Entry Point');

    const { pathname } = request.nextUrl;

    // 🔹 1️⃣ 公開パス確認
    if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
        console.log('✅ [middleware.ts] Public Path Accessed');
        return NextResponse.next();
    }

    // 🔹 2️⃣ 認証チェック
    const authResponse = await authMiddleware(request);
    if (authResponse) {
        console.log('✅ [middleware.ts] Auth Middleware Triggered');
        return authResponse;
    }

    // 🔹 3️⃣ セットアップ確認
    if (!SETUP_SKIP_PATHS.some(path => pathname.startsWith(path))) {
        const setupResponse = await setupMiddleware(request);
        if (setupResponse) {
            console.log('✅ [middleware.ts] Setup Middleware Triggered');
            return setupResponse;
        }
    }

    console.log('✅ [middleware.ts] All Middleware Passed');
    return NextResponse.next();
}
