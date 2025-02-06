// src/middleware/paths.ts

// ✅ 認証不要のパス
export const PUBLIC_PATHS = [
    '/auth/login',
    '/auth/callback',
    '/s'
];

// ✅ セットアップ確認をスキップするパス
export const SETUP_SKIP_PATHS = [
    '/p/setup',
    '/p/help'
];
