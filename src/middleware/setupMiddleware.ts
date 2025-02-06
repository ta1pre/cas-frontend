import { NextRequest, NextResponse } from 'next/server';
import { SETUP_SKIP_PATHS } from './paths';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; // ✅ APIのベースURL

// ✅ Middleware で API から `setup_status` を取得
const getSetupStatus = async (token: string): Promise<string | null> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/setup/status`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return response.data?.setup_status || null;
    } catch (error) {
        console.error('❌ [middleware.ts] セットアップステータス取得エラー:', error);
        return null;
    }
};

export async function setupMiddleware(request: NextRequest): Promise<NextResponse | void> {
    console.log('🚀 [middleware.ts] Middleware Entry Point');

    const pathname = request.nextUrl.pathname;

    // ✅ `/p/setup` 以下ではリダイレクトを行わない
    if (SETUP_SKIP_PATHS.some(path => pathname.startsWith(path))) {
        console.log('✅ [middleware.ts] Skipping Setup Check for:', pathname);
        return NextResponse.next();
    }

    // ✅ クッキーからトークンを取得
    const token = request.cookies.get('token')?.value;
    if (!token) {
        console.log('⚠️ [middleware.ts] トークンが見つかりません');
        return NextResponse.redirect(new URL('/login', request.url));
    }
    console.log('✅ Token Validated');

    // ✅ API から `setup_status` を取得
    const setupStatus = await getSetupStatus(token);
    console.log(`🔎 [middleware.ts] Retrieved setup_status from API: ${setupStatus}`);

    // ✅ `setupStatus` が `completed` 以外なら `/p/setup` にリダイレクト
    if (!setupStatus || setupStatus !== 'completed') {
        console.log(`🔄 [middleware.ts] Redirecting to /p/setup (setup_status: ${setupStatus})`);
        return NextResponse.redirect(new URL('/p/setup', request.url));
    }

    console.log('✅ [middleware.ts] Setup Status Validated:', setupStatus);
    return NextResponse.next();
}
