// src/app/p/customer/search/hooks/useFilters.ts
import { useState } from "react";

/**
 * フィルターの状態を管理するカスタムフック
 */
export function useFilters() {
    const [draftFilters, setDraftFilters] = useState({
        min_age: undefined as number | undefined,
        max_age: undefined as number | undefined,
    });

    const [appliedFilters, setAppliedFilters] = useState({ ...draftFilters });

    // ✅ フィルターの値を更新する（即時適用しない）
    const updateFilter = (key: keyof typeof draftFilters, value: number | undefined) => {
        setDraftFilters((prev) => ({ ...prev, [key]: value }));
    };

    // ✅ フィルターを適用する（`useSearch.ts` に反映される）
    const applyFilters = () => {
        console.log("✅ フィルター適用:", draftFilters);
        setAppliedFilters({ ...draftFilters });
    };

    // ✅ フィルターをリセットする
    const resetFilters = () => {
        setDraftFilters({
            min_age: undefined,
            max_age: undefined,
        });
        setAppliedFilters({
            min_age: undefined,
            max_age: undefined,
        });
    };

    return { filters: appliedFilters, updateFilter, applyFilters, resetFilters };
}
