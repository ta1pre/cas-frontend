// src/app/p/customer/search/components/cast/CastList.tsx
import React from "react";
import CastCard from "./CastCard";
import CastFilters from "../sort/CastSort";  
import { Cast } from "../../api/cast/castTypes";

interface CastListProps {
    casts: Cast[];
    sort: string;
    setSort: (sort: string) => void;
    loading: boolean;
    noResults: boolean; // ✅ 追加
}

const CastList: React.FC<CastListProps> = ({ casts, sort, setSort, loading, noResults }) => {
    return (
        <div className="cast-list">
            {/* ✅ 並べ替えフィルターを表示 */}
            <CastFilters sort={sort} setSort={setSort} />

            {/* ✅ ロード中の表示 */}
            {loading && <p>ロード中...</p>}

            {/* ✅ 「マッチするデータがありません」の表示 */}
            {!loading && noResults && <p>マッチするデータがありません。</p>}

            {/* ✅ キャストリストの表示 */}
            {!loading && !noResults && casts.length > 0 && (
                casts.map((cast) => <CastCard key={cast.cast_id} cast={cast} />)
            )}
        </div>
    );
};

export default CastList;
