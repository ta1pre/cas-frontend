// src/app/p/customer/search/hooks/useSearch.ts
import { useState, useEffect } from "react";
import { getCasts, Cast } from "../api/cast/getCasts";

/**
 * 検索データ管理用のカスタムフック
 */
export function useSearch(limit: number) {
    const [casts, setCasts] = useState<Cast[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [offset, setOffset] = useState<number | null>(null); // ✅ 初回は `null`
    const [sort, setSort] = useState<string>("recommended"); // ✅ デフォルトを "おすすめ順" に変更
    const [hasMore, setHasMore] = useState<boolean>(true); // ✅ `true` で初期化

    // ✅ 初回ロード（最初の `offset` をセット）
    useEffect(() => {
        if (offset !== null) return; // ✅ `offset` が `null` なら初回実行

        setOffset(0); // ✅ 最初の `offset` を `0` にセット
    }, []);

    // ✅ `offset` が `null` でない場合にのみ `fetchCasts()` を実行
    useEffect(() => {
        if (offset === null || loading || !hasMore) return; // ✅ `offset === null` のときは実行しない

        async function fetchCasts() {
            try {
                setLoading(true);
                console.log("【useSearch】📡 APIリクエスト: limit =", limit, "offset =", offset, "sort =", sort);

                const response = await getCasts(limit, offset ?? 0, sort); // ✅ `null` の場合は `0`
                if (!response) throw new Error("キャスト情報の取得に失敗しました。");

                if (response.length === 0) {
                    console.warn("【useSearch】⚠️ 取得データなし（全件取得済み）");
                    setHasMore(false);
                    return;
                }

                setCasts((prev) => [...prev, ...response]);
            } catch (err) {
                setError("キャスト情報の取得に失敗しました。");
            } finally {
                setLoading(false);
            }
        }

        fetchCasts();
    }, [offset, sort]);

    // ✅ `sort` が変更されたらリストをリセットして再取得
    useEffect(() => {
        setCasts([]);  // ✅ 並べ替え時にリストをリセット
        setOffset(0);  // ✅ `offset` もリセットして最初から取得
        setHasMore(true); // ✅ `hasMore` を `true` に戻す（全件取得リセット）
    }, [sort]);

    return { casts, loading, error, sort, setSort, setOffset, hasMore };
}
