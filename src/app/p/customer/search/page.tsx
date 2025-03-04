"use client";

import { Container, Typography } from "@mui/material";
import CastList from "./components/cast/CastList";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll";
import { useSearch } from "./hooks/useSearch";
import { FiltersStateProvider } from "./components/search_options/state/FiltersState"; 
import { FiltersProvider } from "./components/search_options/context/FiltersContext"; 
import SearchFilters from "./components/search_options/SearchFilters";

export default function SearchPage() {
    return (
        <FiltersStateProvider>
            <FiltersProvider>
                <SearchPageContent />
            </FiltersProvider>
        </FiltersStateProvider>
    );
}

function SearchPageContent() {
    const { casts, loading, error, sort, setSort, setOffset, hasMore, noResults } = useSearch(12);
    useInfiniteScroll(loading, setOffset, 12, hasMore);

    return (
        <Container 
            maxWidth="xl" // ✅ PC では幅広に
            className="bg-white min-h-screen px-0 sm:px-4 md:px-8 py-4 w-full" // ✅ スマホは余白なし
        >
            {error && <Typography color="error">{error}</Typography>}

            <CastList 
                casts={casts} 
                sort={sort} 
                setSort={setSort} 
                loading={loading} 
                noResults={noResults}
            />

            {loading && <Typography>ロード中...</Typography>}

            {!hasMore && !loading && (
                <Typography color="textSecondary" sx={{ textAlign: "center", mt: 3 }}>
                    すべてのキャストを表示しました
                </Typography>
            )}

            <SearchFilters setOffset={setOffset} />
        </Container>
    );
}
