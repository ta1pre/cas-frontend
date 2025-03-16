import { createContext, useContext, useState, useEffect } from "react";
import { PREFECTURE_OPTIONS } from "../../../config/prefectures";

interface FiltersStateType {
    selectedFilters: Record<string, any>;
    appliedFilters: Record<string, any>;
    setSelectedFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    applyFilters: () => void;
    updateFilter: (key: string, value: any) => void;
    resetFilters: () => void;
    hasActiveFilters: boolean;
    prefectureName: string | null;  // ✅ 都道府県名を追加
}

export const FiltersStateContext = createContext<FiltersStateType | null>(null);

export function FiltersStateProvider({ children }: { children: React.ReactNode }) {
    const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});
    const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
    const [prefectureName, setPrefectureName] = useState<string | null>(null); // ✅ 都道府県名を管理

    const updateFilter = (key: string, value: any) => {
        setSelectedFilters((prev) => {
            const newFilters = { ...prev, [key]: value };

            if (key === "location") {
                const matchedName = Object.entries(PREFECTURE_OPTIONS).find(([name, id]) => id === Number(value));
                newFilters["prefectureName"] = matchedName ? matchedName[0] : "未設定";
                setPrefectureName(matchedName ? matchedName[0] : "未設定"); // ✅ `prefectureName` を更新
            }

            return newFilters;
        });
    };

    const applyFilters = () => {
        setAppliedFilters({ ...selectedFilters });
    };

    const resetFilters = () => {
        setSelectedFilters({});
        setPrefectureName(null); // ✅ フィルターリセット時に都道府県名もリセット
    };

    const hasActiveFilters = Object.keys(selectedFilters).length > 0;

    return (
        <FiltersStateContext.Provider
            value={{
                selectedFilters,
                appliedFilters,
                setSelectedFilters,
                applyFilters,
                updateFilter,
                resetFilters,
                hasActiveFilters,
                prefectureName, // ✅ 追加
            }}
        >
            {children}
        </FiltersStateContext.Provider>
    );
}

export function useFiltersState() {
    const context = useContext(FiltersStateContext);
    if (!context) throw new Error("useFiltersState must be used within FiltersStateProvider");
    return context;
}
