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

    const filterText = hasActiveFilters ? "絞り込み！" : "絞り込み";

    return (
        <>
<button 
    className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-full shadow-lg w-48
        ${hasActiveFilters ? "bg-red-500 text-white opacity-80" : "bg-blue-500 text-white opacity-80"}`}
    onClick={openFilters}
>
    {filterText}
</button>


            <FiltersModal setOffset={setOffset} /> {/* ✅ `setOffset` を渡す */}
        </>
    );
}
