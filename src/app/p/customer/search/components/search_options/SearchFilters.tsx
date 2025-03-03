// src/app/p/customer/search/components/search_options/SearchFilters.tsx
import { useFilters } from "./context/FiltersContext";
import FiltersModal from "./panels/FiltersModal";
import { useFiltersState } from "./state/FiltersState";

interface SearchFiltersProps {
    setOffset: (offset: number) => void;
}

export default function SearchFilters({ setOffset }: SearchFiltersProps) {
    const { openFilters } = useFilters();
    const { hasActiveFilters } = useFiltersState();

    const filterText = hasActiveFilters ? "検索条件あり" : "絞り込み";

    return (
        <>
            <button 
                className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full shadow-lg 
                    ${hasActiveFilters ? "bg-red-500 text-white" : "bg-blue-500 text-white"}`}
                onClick={openFilters}
            >
                {filterText}
            </button>

            <FiltersModal setOffset={setOffset} /> {/* ✅ `setOffset` を渡す */}
        </>
    );
}
