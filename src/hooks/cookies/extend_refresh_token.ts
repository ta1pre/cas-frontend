// src/hooks/auth/extend-refresh-token.js

import { refreshToken as getNewToken } from "./extend_token";

export const extendRefreshToken = async () => {
    console.log("📡 `/extend_refresh_token` API をリクエスト中...");

    try {
        // 1. document.cookie から既存の refresh_token を取得する
        const oldRefreshToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('refresh_token='))
            ?.split('=')[1];

        if (!oldRefreshToken) {
            console.error("⛔ `refresh_token` が見つかりません。ログインが必要です。");
            // clearCookies();
            // window.location.href = '/auth/login';
            return;
        }

        console.log("📡 `fetch` 直前: `refresh_token` を送信", oldRefreshToken);

        // 2. refresh_token をリクエストボディに含めて /extend_refresh_token API に送信
        const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/auth/extend_refresh_token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // クッキー利用時は必要
            body: JSON.stringify({ refresh_token: oldRefreshToken })
        });

        if (!fetchResponse.ok) {
            const errorData = await fetchResponse.json();
            console.error("❌ `/extend_refresh_token` の取得失敗:", errorData);
            throw new Error(`APIエラー: ${JSON.stringify(errorData)}`);
        }

        // 3. APIから新しい refresh_token を取得
        const { refresh_token: newRefreshToken } = await fetchResponse.json();
        console.log("✅ `refresh_token` を取得:", newRefreshToken);

        // 4. 新しい refresh_token をクッキーに保存する
        document.cookie = `refresh_token=${newRefreshToken}; path=/; max-age=7776000; Secure; SameSite=None`;

        // 5. 新しい refresh_token が受け取られた場合のみ token の更新を試みる
        if (newRefreshToken !== oldRefreshToken) {
            console.log("📡 新しい refresh_token を受け取ったので、token の更新を試みます。");
            const newToken = await getNewToken();  // extend_token.ts の refreshToken() をそのまま活用
            if (newToken) {
                document.cookie = `token=${newToken}; path=/; max-age=3600; Secure; SameSite=None`;
                console.log("✅ token を更新しました:", newToken);
            } else {
                console.error("❌ token の更新に失敗しました。");
            }
        } else {
            console.log("ℹ️ refresh_token は変更されなかったため、token の更新はスキップします。");
        }
    } catch (error) {
        console.error("⚠️ ネットワークエラーまたはAPIエラー:", error);
        // clearCookies();
        // window.location.href = '/auth/login';
    }
};
