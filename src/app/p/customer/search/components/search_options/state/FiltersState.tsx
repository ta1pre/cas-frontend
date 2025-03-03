import { createContext, useContext, useState } from "react";

interface FiltersStateType {
    selectedFilters: Record<string, any>;
    appliedFilters: Record<string, any>;  // ✅ 追加
    setSelectedFilters: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    applyFilters: () => void;
    updateFilter: (key: string, value: any) => void;
    resetFilters: () => void;
    hasActiveFilters: boolean;
}

export const FiltersStateContext = createContext<FiltersStateType | null>(null);

export function FiltersStateProvider({ children }: { children: React.ReactNode }) {
    const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});
    const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});  // ✅ 追加

    const updateFilter = (key: string, value: any) => {
        setSelectedFilters((prev) => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setSelectedFilters({});
    };

    const applyFilters = () => {
        setAppliedFilters({ ...selectedFilters });  // ✅ `appliedFilters` にコピー
        console.log("✅ フィルター適用！:", selectedFilters);
    };

    const hasActiveFilters = Object.keys(selectedFilters).length > 0;

    return (
        <FiltersStateContext.Provider value={{
            selectedFilters,
            appliedFilters,  // ✅ 追加
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
