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

    const fetchCasts = async (reset: boolean = false) => {
        if (loading) return;
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

            // ✅ データ追加後にスクロール位置を復元（100ms 遅延）
            setTimeout(() => {
                window.scrollTo(0, prevScrollY.current);
                console.log("🛑 スクロール位置を復元:", prevScrollY.current);
            }, 100);
        }
    };

    useEffect(() => {
        // ✅ スクロール位置を保存（データ取得前）
        prevScrollY.current = window.scrollY;
        fetchCasts();
    }, [offset]); // ✅ `offset` の変更で発火

    useEffect(() => {
        console.log("🔄 並び替えが変更されたため、リストをリセット");
        setCasts([]);
        setOffset(0);
        setHasMore(true);
        window.scrollTo(0, 0); // ✅ 並び替え時は最上部に戻す
        fetchCasts(true); // ✅ 並び替え時に即時データ取得
    }, [sort]); // ✅ `sort` の変更で発火

    useEffect(() => {
        setOffset(0);
        setHasMore(true);
    }, [appliedFilters.location]);

    useEffect(() => {
        console.log("📡 [useEffect] 最新の casts:", casts);
    }, [casts]);

    return { casts, loading, error, sort, setSort, setOffset, hasMore, noResults, offset };
}
