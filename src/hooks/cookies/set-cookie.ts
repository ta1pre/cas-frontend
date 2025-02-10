export const setLocalToken = async (refreshToken?: string) => {  // ✅ 引数をオプションにする
    try {
        if (!refreshToken) {
            console.warn("⚠️ `refreshToken` が渡されていません。APIから取得します...");
            const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/auth/get_refresh_token`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });

            if (!fetchResponse.ok) {
                const errorData = await fetchResponse.json();
                console.error("❌ `/get_refresh_token` の取得失敗:", errorData);
                throw new Error(`APIエラー: ${JSON.stringify(errorData)}`);
            }

            const data = await fetchResponse.json();
            refreshToken = data.refresh_token; // ✅ API から `refresh_token` を取得
            console.log("✅ `refresh_token` を取得:", refreshToken);
        }

        // ✅ `refresh_token_expiration` を取得
        console.log("📡 `refresh_token_expiration` を取得中...");
        const expResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/auth/refresh_token_expiration`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!expResponse.ok) {
            console.error("❌ `/refresh_token_expiration` の取得失敗");
            throw new Error("refresh_token_expiration の取得に失敗");
        }

        const expData = await expResponse.json();
        const expiration = expData.expiration || Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // デフォルト30日

        console.log("📡 `local_token` を `Set-Cookie` で上書き:", refreshToken);

        const response = await fetch('/api/cookies/set-cookie', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newToken: refreshToken, expiration }), // 🔹 expiration を追加
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("❌ `local_token` の `Set-Cookie` 更新失敗:", errorData);
            throw new Error(`APIエラー: ${JSON.stringify(errorData)}`);
        }

        console.log("✅ `local_token` の `Set-Cookie` 上書き成功");
    } catch (error) {
        console.error("❌ `setLocalToken` 実行エラー:", error);
    }
};
