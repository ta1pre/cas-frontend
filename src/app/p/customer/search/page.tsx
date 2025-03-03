// src/app/p/customer/search/page.tsx
"use client";

import { Container, Typography } from "@mui/material";
import CastList from "./components/cast/CastList";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll";
import { useSearch } from "./hooks/useSearch";
import { FiltersStateProvider } from "./components/search_options/state/FiltersState"; // ✅ フィルターの状態管理
import { FiltersProvider } from "./components/search_options/context/FiltersContext"; // ✅ フィルターの開閉管理
import SearchFilters from "./components/search_options/SearchFilters";

export default function SearchPage() {
    return (
        <FiltersStateProvider> {/* ✅ フィルターの状態管理 */}
            <FiltersProvider> {/* ✅ フィルターの開閉管理 */}
                <SearchPageContent />
            </FiltersProvider>
        </FiltersStateProvider>
    );
}

function SearchPageContent() {
    const { casts, loading, error, sort, setSort, setOffset, hasMore } = useSearch(12);
    useInfiniteScroll(loading, setOffset, 12, hasMore);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>キャスト検索</Typography>
            {error && <Typography color="error">{error}</Typography>}
            <CastList casts={casts} sort={sort} setSort={setSort} />
            {loading && <Typography>ロード中...</Typography>}
            
            {!hasMore && !loading && (
                <Typography color="textSecondary" sx={{ textAlign: "center", mt: 3 }}>
                    すべてのキャストを表示しました
                </Typography>
            )}

            <SearchFilters setOffset={setOffset} /> {/* ✅ `setOffset` を渡す */}
        </Container>
    );
}
