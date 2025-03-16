"use client";

import { useEffect, useState } from "react";
import { Container, Typography } from "@mui/material";
import CastList from "./components/cast/CastList";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll";
import { useSearch } from "./hooks/useSearch";
import { FiltersStateProvider, useFiltersState } from "./components/search_options/state/FiltersState"; 
import { FiltersProvider } from "./components/search_options/context/FiltersContext"; 
import SearchFilters from "./components/search_options/SearchFilters";
import GetPrefectureModal from "./components/getPrefecture/GetPrefectureModal";
import { useUserPrefecture } from "./hooks/useUserPrefecture";

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

    const userId = globalThis.user?.userId ?? null; 
    const { prefecture, prefectureName: initialPrefectureName, loading: prefLoading } = useUserPrefecture(userId);
    
    const { updateFilter, applyFilters, prefectureName } = useFiltersState(); // ✅ 変更: useFiltersStateから都道府県名を取得

    const [openPrefectureModal, setOpenPrefectureModal] = useState(false);

    useEffect(() => {
        console.log("✅ 都道府県チェック（SearchPage.tsx）: ", prefectureName);

        if (!prefLoading && (prefecture === null || prefecture === undefined)) {
            console.log("✅ モーダルを開く処理が実行されるはず");
            setOpenPrefectureModal(true);
        } else {
            setOpenPrefectureModal(false);
        }
    }, [prefecture, prefLoading]);

    const handlePrefectureSelect = (selectedPrefecture: number | null) => {
        if (selectedPrefecture !== null) {
            updateFilter("location", selectedPrefecture);  
            applyFilters();  
            setOpenPrefectureModal(false);
        }
    };

    return (
        <Container 
            maxWidth="xl"
            className="bg-white min-h-screen px-0 sm:px-4 md:px-8 py-4 w-full"
        >
            {error && <Typography color="error">{error}</Typography>}

            <CastList 
                casts={casts} 
                sort={sort} 
                setSort={setSort} 
                loading={loading} 
                noResults={noResults}
                prefectureName={prefectureName || initialPrefectureName} // ✅ DB 取得時の都道府県 or フィルターから取得
            />

            {loading && <Typography>ロード中...</Typography>}

            {!hasMore && !loading && (
                <Typography color="textSecondary" sx={{ textAlign: "center", mt: 3 }}>
                    すべてのキャストを表示しました
                </Typography>
            )}

            <SearchFilters setOffset={setOffset} />

            <GetPrefectureModal 
                userId={userId} 
                open={openPrefectureModal} 
                onClose={handlePrefectureSelect} 
            />
        </Container>
    );
}
