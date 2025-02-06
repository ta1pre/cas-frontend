// src/middleware/publicMiddleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { PUBLIC_PATHS } from './paths';

export async function publicMiddleware(request: NextRequest): Promise<NextResponse | void> {
    const pathname = request.nextUrl.pathname;

    if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
        console.log('✅ Public Path: Skipping Authentication');
        return NextResponse.next();
    }
}
