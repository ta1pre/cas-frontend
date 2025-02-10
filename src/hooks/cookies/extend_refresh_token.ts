import { setLocalToken } from '@/hooks/cookies/set-cookie';

export const extendRefreshToken = async () => {
    console.log("📡 `/extend_refresh_token` API をリクエスト中...");

    const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/account/auth/extend_refresh_token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });

    if (!fetchResponse.ok) {
        const errorData = await fetchResponse.json();
        console.error("❌ `/extend_refresh_token` の取得失敗:", errorData);
        throw new Error(`APIエラー: ${JSON.stringify(errorData)}`);
    }

    const { refresh_token } = await fetchResponse.json();
    console.log("✅ `refresh_token` を取得:", refresh_token);

    // ✅ `refresh_token` を `local_token` にセット（引数あり）
    await setLocalToken(refresh_token);
};
