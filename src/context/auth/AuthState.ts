// src/context/auth/AuthState.ts

/**
 * 認証状態の型定義
 */
export type AuthState = {
    user: {
        user_id: number | null;
        user_type: string | null;
        affi_type: string | null;
    } | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
};

/**
 * 認証状態の初期値
 */
export const initialAuthState: AuthState = {
    user: null,           // ユーザー情報 (user_id, user_type, affi_type)
    token: null,          // JWTトークン
    isAuthenticated: false, // 認証されているかどうか
    loading: false,       // 認証状態の読み込み中か
    error: null,          // エラーメッセージ
};
