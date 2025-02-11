export const setLocalToken = async (refreshToken?: string) => {
    try {
        console.log("【setLocalToken】🚀 関数開始");

        if (!refreshToken) {
            console.warn("【setLocalToken】⚠️ `refreshToken` が渡されていません。APIから取得します...");
            const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/auth/get_refresh_token`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            console.log("【setLocalToken】📡 `/get_refresh_token` API のレスポンスを受信");

            if (!fetchResponse.ok) {
                const errorData = await fetchResponse.json();
                console.error("【setLocalToken】❌ `/get_refresh_token` の取得失敗:", errorData);
                throw new Error(`APIエラー: ${JSON.stringify(errorData)}`);
            }

            const data = await fetchResponse.json();
            refreshToken = data.refresh_token;
            console.log("【setLocalToken】✅ `refresh_token` を取得:", refreshToken);
        }

        // ✅ `refresh_token_expiration` を取得
        console.log("【setLocalToken】📡 `refresh_token_expiration` を取得中...");
        const expResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/auth/refresh_token_expiration`, {
            method: 'GET',
            credentials: 'include',
        });

        console.log("【setLocalToken】📡 `/refresh_token_expiration` API のレスポンスを受信");

        if (!expResponse.ok) {
            console.error("【setLocalToken】❌ `/refresh_token_expiration` の取得失敗");
            throw new Error("refresh_token_expiration の取得に失敗");
        }

        const expData = await expResponse.json();
        console.log("【setLocalToken】🔍 `/refresh_token_expiration` のレスポンス:", expData);

        const expiration = expData.expiration || Math.floor(Date.now() / 1000) + (90 * 24 * 60 * 60);
        console.log("【setLocalToken】✅ `expiration` の計算結果 (UNIX):", expiration);
        console.log("【setLocalToken】✅ `expiration` の日時:", new Date(expiration * 1000).toLocaleString());

        // ✅ `Set-Cookie` を呼び出して `local_token` をセット
        console.log("【setLocalToken】📡 `local_token` を `Set-Cookie` で上書き:", refreshToken);

        const response = await fetch('/api/cookies/set-cookie', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newToken: refreshToken, expiration }),
            credentials: 'include',
        });

        console.log("【setLocalToken】📡 `/api/cookies/set-cookie` API のレスポンスを受信");

        if (!response.ok) {
            const errorData = await response.json();
            console.error("【setLocalToken】❌ `local_token` の `Set-Cookie` 更新失敗:", errorData);
            throw new Error(`APIエラー: ${JSON.stringify(errorData)}`);
        }

        console.log("【setLocalToken】✅ `local_token` の `Set-Cookie` 上書き成功");
    } catch (error) {
        console.error("【setLocalToken】❌ `setLocalToken` 実行エラー:", error);
    }
};
