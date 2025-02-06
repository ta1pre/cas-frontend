// src/middleware/authMiddleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export async function authMiddleware(request: NextRequest): Promise<NextResponse | void> {
    const token = request.cookies.get('token')?.value;

    if (!token) {
        console.log('🔄 Redirecting to /auth/login (No Token)');
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(JWT_SECRET)
        );

        if (!payload.sub) {
            console.log('⛔ Invalid Token: Missing user_id');
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }

        console.log('✅ Token Validated');
    } catch (error) {
        console.error('⛔ JWT Verification Error:', error);
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }
}
