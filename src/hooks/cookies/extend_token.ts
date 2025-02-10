import Cookies from 'js-cookie'
/**
 * `local_token` の有効期限を取得
 */
export const getLocalTokenExpiration = async (): Promise<number | null> => {
    try {
        console.log("🚀 `getLocalTokenExpiration` 実行開始...");

        // ✅ `local_token` を取得
        const response = await fetch('/api/cookies/get_local_token', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        if (!response.ok) {
            console.error("❌ `/get_local_token` 取得エラー:", await response.json());
            throw new Error("`local_token` を取得できませんでした");
        }

        const data = await response.json();
        const localToken = data.local_token;
        console.log("✅ `local_token` を取得:", localToken);

        // ✅ `local_token` の有効期限を解析
        const decoded = JSON.parse(atob(localToken.split('.')[1]));  // JWT をデコード
        const exp = decoded.exp;  // `exp` は UNIX 時間 (秒)
        console.log(`🕒 local_token の有効期限: ${exp}`);
        
        return exp;  // ✅ UNIX タイムスタンプで返す
    } catch (error) {
        console.error("❌ `getLocalTokenExpiration` 実行エラー:", error);
        return null;
    }
};

/**
 * `token` の有効期限を取得 (ブラウザのクッキーから取得)
 */
export const getTokenExpiration = (): number | null => {
    try {
        const token = Cookies.get('token'); // ✅ `Cookies` から取得
        if (!token) {
            console.warn("⚠️ `token` が見つかりません");
            return null;
        }
        const decoded = JSON.parse(atob(token.split('.')[1])); // JWT のデコード
        return decoded.exp; // UNIX 時間 (秒)
    } catch (error) {
        console.error("❌ `token` の有効期限取得に失敗:", error);
        return null;
    }
};


/**
 * `local_token` と `token` の残り時間を比較してログを出力
 */
export const logTokenExpirations = async () => {
    const localExp = await getLocalTokenExpiration();
    const tokenExp = await getTokenExpiration();
    const now = Math.floor(Date.now() / 1000);
    const threshold = 6 * 60 * 60; // 🔹 `hoge` 時間（6時間 = 21600秒）

    console.log('🕒 現在時刻 (UNIX秒):', now, `(${new Date(now * 1000).toLocaleString()})`);
    console.log('🔍 local_token の有効期限:', localExp ? `${new Date(localExp * 1000).toLocaleString()} (UNIX: ${localExp})` : '不明');
    console.log('🔍 token の有効期限:', tokenExp ? `${new Date(tokenExp * 1000).toLocaleString()} (UNIX: ${tokenExp})` : '不明');
    
    if (!localExp || !tokenExp) {
        console.warn("⚠️ `local_token` または `token` の有効期限を取得できませんでした");
        return;
    }
    
    const remainingLocalTime = Math.floor((localExp - now) / 60);
    const remainingTokenTime = Math.floor((tokenExp - now) / 60);
    
    console.log(`⏳ local_token 残り時間: ${remainingLocalTime}分`);
    console.log(`⏳ token 残り時間: ${remainingTokenTime}分`);
    
    if (remainingTokenTime <= 3) {
        console.log("🔄 トークン更新処理が必要です (token 残り時間 <= 3分)");
    } else if (remainingLocalTime < threshold / 60) {
        console.log("🔄 token を更新する必要があります (local_token 残り時間 < 6時間)");
    } else {
        console.log("✅ token はまだ有効");
    }
};