import { useState, useEffect, useRef } from "react";
import { getCasts } from "../api/cast/getCasts";
import { Cast } from "../api/cast/castTypes";
import { transformFilters } from "../api/cast/transformFilters"; 
import { useFiltersState } from "../components/search_options/state/FiltersState";

export function useSearch(limit: number) {
    const { appliedFilters } = useFiltersState();
    const [casts, setCasts] = useState<Cast[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [offset, setOffset] = useState<number>(0);
    const [sort, setSort] = useState<string>("recommended");
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [noResults, setNoResults] = useState<boolean>(false);
    
    // ✅ スクロール位置を管理する `useRef`
    const prevScrollY = useRef<number>(0);
    const resetScroll = useRef<boolean>(false); // ✅ 並び替え・絞り込み時のスクロールリセットフラグ

    const fetchCasts = async (reset: boolean = false) => {
        if (loading) return;

        if (!reset) {
            // ✅ スクロール位置を保存（無限スクロール時のみ）
            prevScrollY.current = window.scrollY;
        } else {
            // ✅ 絞り込み・並び替え時はスクロール位置をリセット
            prevScrollY.current = 0;
        }

        setLoading(true);
        setError(null);
        setNoResults(false);
        const filters = transformFilters(appliedFilters);
        console.log("📡 APIリクエスト:", { limit, offset, sort, filters });

        try {
            const response = await getCasts(limit, offset, sort, filters);

            if (!response || response.length === 0) {
                if (offset === 0) {
                    setNoResults(true);
                    setCasts([]);
                    console.log("🛑 検索結果なし、リストをクリア");
                }
                setHasMore(false);
            } else {
                setCasts((prev) => {
                    const newCasts = reset ? response : [...prev, ...response];
                    const uniqueCasts = newCasts.filter(
                        (cast, index, self) =>
                            index === self.findIndex((c) => c.cast_id === cast.cast_id)
                    );
                    return uniqueCasts;
                });

                setHasMore(response.length === limit);
            }
        } catch (err) {
            setError("キャスト情報の取得に失敗しました。");
            console.error("🚨 APIエラー:", err);
        } finally {
            setLoading(false);

            // ✅ 並び替え・絞り込みをした場合、強制的に最上部へスクロール
            if (resetScroll.current) {
                setTimeout(() => {
                    window.scrollTo(0, 0);
                    console.log("🛑 並び替え・絞り込み後に最上部へリセット");
                }, 100);
                resetScroll.current = false; // ✅ フラグを解除
            } else {
                // ✅ 無限スクロール時のみスクロール位置を復元
                setTimeout(() => {
                    window.scrollTo(0, prevScrollY.current);
                    console.log("🛑 スクロール位置を復元:", prevScrollY.current);
                }, 100);
            }
        }
    };

    useEffect(() => {
        fetchCasts();
    }, [offset]); // ✅ `offset` の変更で発火（無限スクロール）

    useEffect(() => {
        console.log("🔄 並び替えが変更されたため、リストをリセット");
        resetScroll.current = true; // ✅ スクロールリセットフラグを設定（最上部に戻す）
        setCasts([]);
        setOffset(0);
        setHasMore(true);
        fetchCasts(true);
    }, [sort]); // ✅ `sort` の変更で発火（並び替え時）

    useEffect(() => {
        console.log("🔍 フィルター適用時: `setOffset(0)`, `fetchCasts(true)` を実行");
        resetScroll.current = true; // ✅ スクロールリセットフラグを設定（最上部に戻す）
        setCasts([]);
        setOffset(0);
        setHasMore(true);
        fetchCasts(true);
    }, [appliedFilters]); // ✅ `appliedFilters` の変更で発火（フィルター適用時）

    useEffect(() => {
        console.log("📡 [useEffect] 最新の casts:", casts);
    }, [casts]);

    return { casts, loading, error, sort, setSort, setOffset, hasMore, noResults, offset };
}
