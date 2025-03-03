// src/app/p/customer/search/page.tsx
"use client";

import { Container, Typography } from "@mui/material";
import CastList from "./components/cast/CastList";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll";
import { useSearch } from "./hooks/useSearch";

export default function SearchPage() {
    const { casts, loading, error, sort, setSort, setOffset, hasMore } = useSearch(12);
    useInfiniteScroll(loading, setOffset, 12, hasMore);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>キャスト検索</Typography>
            {error && <Typography color="error">{error}</Typography>}
            {/* ✅ `sort` / `setSort` を CastList に渡す */}
            <CastList casts={casts} sort={sort} setSort={setSort} />
            {loading && <Typography>ロード中...</Typography>}

            {!hasMore && !loading && (
                <Typography color="textSecondary" sx={{ textAlign: "center", mt: 3 }}>
                    すべてのキャストを表示しました
                </Typography>
            )}
        </Container>
    );
}
