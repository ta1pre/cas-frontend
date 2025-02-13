// src/hooks/auth/extend-refresh-token.js

export const extendRefreshToken = async () => {
    console.log("📡 `/extend_refresh_token` API をリクエスト中...");

    try {
        // ✅ refresh_token を `document.cookie` から取得
        const refreshToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('refresh_token='))
            ?.split('=')[1];

        if (!refreshToken) {
            console.error("⛔ `refresh_token` が見つかりません。ログインが必要です。");
            // clearCookies();
            // window.location.href = '/auth/login';
            return;
        }

        console.log("📡 `fetch` 直前: `refresh_token` を送信", refreshToken);

        // ✅ refresh_token をリクエストボディに含めて送信
        const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/auth/extend_refresh_token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',  // `include` は削除してもOK（クッキーを使わないなら不要）
            body: JSON.stringify({ refresh_token: refreshToken })  // 🔹 ボディで送信
        });

        if (!fetchResponse.ok) {
            const errorData = await fetchResponse.json();
            console.error("❌ `/extend_refresh_token` の取得失敗:", errorData);
            throw new Error(`APIエラー: ${JSON.stringify(errorData)}`);
        }

        const { refresh_token } = await fetchResponse.json();
        console.log("✅ `refresh_token` を取得:", refresh_token);

        // ✅ `refresh_token` をクライアント側のクッキーに保存
        document.cookie = `refresh_token=${refresh_token}; path=/; max-age=7776000; Secure; SameSite=None`;

    } catch (error) {
        console.error("⚠️ ネットワークエラーまたはAPIエラー:", error);
        // clearCookies();
        // window.location.href = '/auth/login';
    }
};
