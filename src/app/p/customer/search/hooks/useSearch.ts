import { useState, useEffect } from "react";
import { getCasts } from "../api/cast/getCasts";
import { Cast } from "../api/cast/castTypes";
import { transformFilters } from "../api/cast/transformFilters"; 
import { useFiltersState } from "../components/search_options/state/FiltersState";

export function useSearch(limit: number) {
    const { appliedFilters } = useFiltersState();
    const [casts, setCasts] = useState<Cast[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [offset, setOffset] = useState<number>(0);  // ✅ `number` 型で統一
    const [sort, setSort] = useState<string>("recommended");
    const [hasMore, setHasMore] = useState<boolean>(true);

    useEffect(() => {
        if (loading || !hasMore) return;  // ✅ `offset === null` のチェック不要

        async function fetchCasts() {
            setLoading(true);
            setError(null);
            const filters = transformFilters(appliedFilters);
            console.log("📡 APIリクエスト:", { limit, offset, sort, filters });

            try {
                const response = await getCasts(limit, offset, sort, filters);

                if (!response || response.length === 0) {
                    if (offset === 0) {
                        setCasts([]); // ✅ 初回検索時のみ 0 件表示
                    }
                    setHasMore(false);
                } else {
                    setCasts((prev) => {
                        // ✅ `sort` が変わった場合は新しいデータでリセット
                        if (offset === 0) {
                            return response;
                        }
                        // ✅ `id` の重複を防ぐ
                        const uniqueCasts = [...prev, ...response].reduce((acc, cast) => {
                            if (!acc.some((item) => item.cast_id === cast.cast_id)) {
                                acc.push(cast);
                            }
                            return acc;
                        }, [] as Cast[]);
                        return uniqueCasts;
                    });
                    setHasMore(response.length === limit);
                }
            } catch (err) {
                setError("キャスト情報の取得に失敗しました。");
                console.error("🚨 APIエラー:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchCasts();
    }, [offset, sort, appliedFilters]); // ✅ `sort` を依存に追加

    return { casts, loading, error, sort, setSort, setOffset, hasMore, offset };
}
