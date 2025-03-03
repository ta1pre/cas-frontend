// ✅ `user` をセットする関数
export const setGlobalUser = (user: any) => {
    globalThis.user = user; // ✅ `globalThis.user` に `user` をセット（型エラーなし）
};

// ✅ `user` を取得する関数
export const getGlobalUser = () => {
    return globalThis.user ?? null; // ✅ `globalThis.user` を返す（存在しない場合は `null`）
};
