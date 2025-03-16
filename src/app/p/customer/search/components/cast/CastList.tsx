import React from "react";
import CastCard from "./CastCard";
import CastSort from "../sort/CastSort";  
import { Cast } from "../../api/cast/castTypes";
import { Typography } from "@mui/material";

interface CastListProps {
    casts: Cast[];
    sort: string;
    setSort: (sort: string) => void;
    loading: boolean;
    noResults: boolean;
    prefectureName: string | null; // ✅ 追加
}

const CastList: React.FC<CastListProps> = ({ casts, sort, setSort, loading, noResults, prefectureName }) => { 
    return (
        <div className="w-full px-0 sm:px-4"> {/* ✅ スマホ時の余白をなくす */}
            {/* ✅ 並べ替えフィルター */}
            <CastSort 
                sort={sort} 
                setSort={setSort} 
                prefectureName={prefectureName}  // ✅ 修正: `CastList` の props から渡す
            />

            {/* ✅ ロード中の表示 */}
            {loading && <Typography variant="body1">ロード中...</Typography>}

            {/* ✅ 「マッチするデータがありません」の表示 */}
            {!loading && noResults && (
                <Typography variant="body1" className="text-center text-gray-500">
                    マッチするデータがありません。
                </Typography>
            )}

            {/* ✅ キャストリストの表示（常に2列レイアウト） */}
            {!loading && !noResults && casts.length > 0 && (
                <div className="grid grid-cols-2 gap-1 sm:gap-2 md:gap-4"> {/* ✅ gap 調整 */}
                    {casts.map((cast) => (
                        <CastCard key={cast.cast_id} cast={cast} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CastList;
