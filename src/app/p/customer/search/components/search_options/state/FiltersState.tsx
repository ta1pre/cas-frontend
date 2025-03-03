import { createContext, useContext, useState, useEffect } from "react";

interface FiltersStateType {
    selectedFilters: Record<string, any>;
    appliedFilters: Record<string, any>;
    setSelectedFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    applyFilters: () => void;
    updateFilter: (key: string, value: any) => void;
    resetFilters: () => void;
    hasActiveFilters: boolean;
}

export const FiltersStateContext = createContext<FiltersStateType | null>(null);

export function FiltersStateProvider({ children }: { children: React.ReactNode }) {
    const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});
    const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});

    const updateFilter = (key: string, value: any) => {
        console.log(`🔄 [updateFilter] ${key} =`, value);
        console.log("🔄 [updateFilter] 更新前:", selectedFilters);

        setSelectedFilters((prev) => {
            const newFilters = { ...prev, [key]: value };
            return newFilters;
        });
    };

    const resetFilters = () => {
        console.log("🗑 [resetFilters] フィルターリセット:", selectedFilters);
        setSelectedFilters({});
    };

    const applyFilters = () => {
        console.log("🔍 [applyFilters] 適用前: selectedFilters =", selectedFilters);
        setAppliedFilters({ ...selectedFilters });
        console.log("✅ [applyFilters] 適用後: appliedFilters =", { ...selectedFilters });
    };

    // ✅ `selectedFilters` の変更を監視し、最新の状態をログに出力
    useEffect(() => {
        console.log("📡 [useEffect] 最新の selectedFilters:", selectedFilters);
    }, [selectedFilters]);

    // ✅ `selectedFilters` が変更されたら、強制的にリレンダリングする
    useEffect(() => {
        console.log("🖥️ [RE-RENDER] selectedFilters が変更されたため、UI を更新");
    }, [selectedFilters]);

    const hasActiveFilters = Object.keys(selectedFilters).length > 0;

    return (
        <FiltersStateContext.Provider value={{
            selectedFilters,
            appliedFilters,
            setSelectedFilters,
            applyFilters,
            updateFilter,
            resetFilters,
            hasActiveFilters
        }}>
            {children}
        </FiltersStateContext.Provider>
    );
}

export function useFiltersState() {
    const context = useContext(FiltersStateContext);
    if (!context) {
        throw new Error("useFiltersState must be used inside FiltersStateProvider");
    }
    return context;
}
