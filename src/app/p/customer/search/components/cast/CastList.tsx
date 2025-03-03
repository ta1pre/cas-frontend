// src/app/p/customer/search/components/cast/CastList.tsx
import React from "react";
import CastCard from "./CastCard";
import CastFilters from "../sort/CastSort";  
import { Cast } from "../../api/cast/castTypes";

interface CastListProps {
    casts: Cast[];
    sort: string;
    setSort: (sort: string) => void;
}

const CastList: React.FC<CastListProps> = ({ casts, sort, setSort }) => {
    return (
        <div className="cast-list">
            {/* ✅ 並べ替えフィルターを表示 */}
            <CastFilters sort={sort} setSort={setSort} />

            {casts.length === 0 ? (
                <p>キャストが見つかりません。</p>
            ) : (
                casts.map((cast) => <CastCard key={cast.cast_id} cast={cast} />)
            )}
        </div>
    );
};

export default CastList;
